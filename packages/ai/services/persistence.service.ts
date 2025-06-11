import type { 
  EnrichmentRequest, 
  EnrichmentResult, 
  BulkEnrichmentResponse,
  EnrichmentType 
} from "../domains/enrichment/types";

interface Database {
  // Define your Supabase client type here
  from: (table: string) => any;
}

export interface EnrichmentRequestRecord {
  id: string;
  user_id: string;
  website_url: string;
  enrichment_types: EnrichmentType[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  total_duration?: number;
  total_requested: number;
  successful: number;
  failed: number;
  skipped: number;
}

export interface EnrichmentResultRecord {
  id: string;
  request_id: string;
  type: EnrichmentType;
  status: 'success' | 'error' | 'skipped';
  data?: any;
  error_message?: string;
  duration?: number;
  created_at: string;
}

export interface CompanyProfileRecord {
  id: string;
  website_url: string;
  last_enriched_at?: string;
  enrichment_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const makeEnrichmentPersistenceService = (db: Database, userId: string) => {
  
  /**
   * Create a new enrichment request
   */
  const createEnrichmentRequest = async (
    request: EnrichmentRequest
  ): Promise<string> => {
    const { data, error } = await db
      .from('enrichment_requests')
      .insert({
        user_id: userId,
        website_url: request.websiteUrl,
        enrichment_types: request.enrichmentTypes || [],
        status: 'pending',
        total_requested: request.enrichmentTypes?.length || 0
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create enrichment request: ${error.message}`);
    return data.id;
  };

  /**
   * Update enrichment request status
   */
  const updateRequestStatus = async (
    requestId: string, 
    status: EnrichmentRequestRecord['status'],
    summary?: BulkEnrichmentResponse['summary']
  ): Promise<void> => {
    const updates: Partial<EnrichmentRequestRecord> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed' || status === 'failed') {
      updates.completed_at = new Date().toISOString();
    }

    if (summary) {
      updates.total_duration = summary.totalDuration;
      updates.successful = summary.successful;
      updates.failed = summary.failed;
      updates.skipped = summary.skipped;
    }

    const { error } = await db
      .from('enrichment_requests')
      .update(updates)
      .eq('id', requestId);

    if (error) throw new Error(`Failed to update request status: ${error.message}`);
  };

  /**
   * Save individual enrichment results
   */
  const saveEnrichmentResults = async (
    requestId: string,
    results: EnrichmentResult[]
  ): Promise<void> => {
    const records = results.map(result => ({
      request_id: requestId,
      type: result.type,
      status: result.status,
      data: result.data || null,
      error_message: result.error || null,
      duration: result.duration || null
    }));

    const { error } = await db
      .from('enrichment_results')
      .insert(records);

    if (error) throw new Error(`Failed to save enrichment results: ${error.message}`);
  };

  /**
   * Update or create company profile with latest enrichment data
   */
  const upsertCompanyProfile = async (
    websiteUrl: string,
    enrichmentData: Record<EnrichmentType, any>
  ): Promise<void> => {
    const { error } = await db
      .from('company_profiles')
      .upsert({
        website_url: websiteUrl,
        last_enriched_at: new Date().toISOString(),
        enrichment_data: enrichmentData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'website_url'
      });

    if (error) throw new Error(`Failed to upsert company profile: ${error.message}`);
  };

  /**
   * Get enrichment request with results
   */
  const getEnrichmentRequest = async (
    requestId: string
  ): Promise<EnrichmentRequestRecord & { results: EnrichmentResultRecord[] }> => {
    const { data: request, error: requestError } = await db
      .from('enrichment_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', userId)
      .single();

    if (requestError) throw new Error(`Failed to get enrichment request: ${requestError.message}`);

    const { data: results, error: resultsError } = await db
      .from('enrichment_results')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (resultsError) throw new Error(`Failed to get enrichment results: ${resultsError.message}`);

    return { ...request, results: results || [] };
  };

  /**
   * Get company profile by website URL
   */
  const getCompanyProfile = async (
    websiteUrl: string
  ): Promise<CompanyProfileRecord | null> => {
    const { data, error } = await db
      .from('company_profiles')
      .select('*')
      .eq('website_url', websiteUrl)
      .maybeSingle();

    if (error) throw new Error(`Failed to get company profile: ${error.message}`);
    return data;
  };

  /**
   * Get user's enrichment history
   */
  const getUserEnrichmentHistory = async (
    limit: number = 10,
    offset: number = 0
  ): Promise<EnrichmentRequestRecord[]> => {
    const { data, error } = await db
      .from('enrichment_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to get enrichment history: ${error.message}`);
    return data || [];
  };

  /**
   * Check if enrichment data is fresh (within last 24 hours)
   */
  const isEnrichmentFresh = (lastEnrichedAt: string): boolean => {
    const lastEnriched = new Date(lastEnrichedAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastEnriched.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  /**
   * Get cached enrichment data if fresh
   */
  const getCachedEnrichment = async (
    websiteUrl: string,
    requestedTypes: EnrichmentType[]
  ): Promise<Partial<Record<EnrichmentType, any>> | null> => {
    const profile = await getCompanyProfile(websiteUrl);
    
    if (!profile || !profile.last_enriched_at) {
      return null;
    }

    if (!isEnrichmentFresh(profile.last_enriched_at)) {
      return null;
    }

    // Check if we have all requested types
    const cachedData = profile.enrichment_data;
    const availableTypes = Object.keys(cachedData) as EnrichmentType[];
    const missingTypes = requestedTypes.filter(type => !availableTypes.includes(type));

    if (missingTypes.length > 0) {
      return null; // Re-enrich if we're missing any requested types
    }

    // Return only the requested types
    const filteredData: Partial<Record<EnrichmentType, any>> = {};
    requestedTypes.forEach(type => {
      if (cachedData[type]) {
        filteredData[type] = cachedData[type];
      }
    });

    return filteredData;
  };

  return {
    // Core operations
    createEnrichmentRequest,
    updateRequestStatus,
    saveEnrichmentResults,
    upsertCompanyProfile,

    // Query operations
    getEnrichmentRequest,
    getCompanyProfile,
    getUserEnrichmentHistory,

    // Caching utilities
    getCachedEnrichment,
    isEnrichmentFresh
  };
};

export type EnrichmentPersistenceService = ReturnType<typeof makeEnrichmentPersistenceService>;