import type { 
  EnrichmentRequest, 
  EnrichmentProgress, 
  BulkEnrichmentResponse 
} from "./types";

import { makeCompanyEnrichmentService } from "./enrichment.service";
import { makeEnrichmentPersistenceService, type EnrichmentPersistenceService } from "./persistence.service";
import { makeSocialMediaService, type SocialMediaService } from "./social-media.service";
import { makeDocumentStorageService, type DocumentStorageService } from "./document-storage.service";
import { makeMarketingIntelligenceService, type MarketingIntelligenceService } from "./marketing-intelligence.service";
import type { SupabaseClient } from '@supabase/supabase-js';

interface Database {
  from: (table: string) => any;
}

export const makePersistedEnrichmentService = (db: Database, supabase: SupabaseClient, userId: string) => {
  const enrichmentService = makeCompanyEnrichmentService();
  const persistenceService = makeEnrichmentPersistenceService(db, userId);
  const socialMediaService = makeSocialMediaService(db);
  const documentStorageService = makeDocumentStorageService(db, supabase, userId);
  const marketingIntelligenceService = makeMarketingIntelligenceService(db);

  /**
   * Enrich company with persistence and caching
   */
  const enrichCompanyWithPersistence = async (
    request: EnrichmentRequest,
    options: {
      useCache?: boolean;
      onProgress?: (progress: EnrichmentProgress) => void;
      onPersisted?: (requestId: string) => void;
    } = {}
  ): Promise<BulkEnrichmentResponse> => {
    const { useCache = true, onProgress, onPersisted } = options;

    // Check cache first if enabled
    if (useCache && request.enrichmentTypes) {
      const cachedData = await persistenceService.getCachedEnrichment(
        request.websiteUrl,
        request.enrichmentTypes
      );

      if (cachedData) {
        // Return cached data in the expected format
        const cachedResults = Object.entries(cachedData).map(([type, data]) => ({
          type: type as any,
          status: 'success' as const,
          data,
          duration: 0 // Cached, so no duration
        }));

        return {
          websiteUrl: request.websiteUrl,
          requestId: `cached-${Date.now()}`,
          results: cachedResults,
          summary: {
            totalRequested: cachedResults.length,
            successful: cachedResults.length,
            failed: 0,
            skipped: 0,
            totalDuration: 0
          }
        };
      }
    }

    // Create persistence record
    const persistedRequestId = await persistenceService.createEnrichmentRequest(request);
    const enrichmentRequest = { ...request, requestId: persistedRequestId };

    // Notify that request was persisted
    onPersisted?.(persistedRequestId);

    try {
      // Update status to processing
      await persistenceService.updateRequestStatus(persistedRequestId, 'processing');

      // Perform enrichment with progress tracking
      const result = await enrichmentService.enrichCompany(enrichmentRequest, onProgress);

      // Save results to database
      await persistenceService.saveEnrichmentResults(persistedRequestId, result.results);

      // Update final status
      await persistenceService.updateRequestStatus(
        persistedRequestId, 
        'completed', 
        result.summary
      );

      // Update company profile with successful results
      const successfulData: Record<string, any> = {};
      const socialData: Record<string, any> = {};

      result.results
        .filter(r => r.status === 'success')
        .forEach(r => {
          successfulData[r.type] = r.data;
          
          // Extract social media data
          if (['linkedin', 'twitter-profile', 'instagram', 'facebook', 'tiktok', 'youtube-videos'].includes(r.type)) {
            socialData[r.type] = r.data;
          }
        });

      if (Object.keys(successfulData).length > 0) {
        // Upsert company profile
        await persistenceService.upsertCompanyProfile(
          request.websiteUrl,
          successfulData
        );

        // Get company profile ID for social media and documents
        const profile = await persistenceService.getCompanyProfile(request.websiteUrl);
        
        if (profile && Object.keys(socialData).length > 0) {
          // Save social media profiles
          await socialMediaService.saveSocialProfiles(profile.id, socialData);
          
          // Extract social links for quick access
          const socialLinks: Record<string, string> = {};
          Object.entries(socialData).forEach(([platform, data]: [string, any]) => {
            if (data?.url) socialLinks[platform] = data.url;
          });
          
          if (Object.keys(socialLinks).length > 0) {
            await socialMediaService.updateCompanySocialLinks(profile.id, socialLinks);
          }

          // Generate marketing intelligence asynchronously
          generateMarketingIntelligenceAsync(profile.id, result, socialProfiles, documents);
        }
      }

      return result;

    } catch (error) {
      // Update status to failed
      await persistenceService.updateRequestStatus(persistedRequestId, 'failed');
      throw error;
    }
  };

  /**
   * Get enrichment request with full details
   */
  const getEnrichmentRequest = async (requestId: string) => {
    return persistenceService.getEnrichmentRequest(requestId);
  };

  /**
   * Get user's enrichment history
   */
  const getEnrichmentHistory = async (limit?: number, offset?: number) => {
    return persistenceService.getUserEnrichmentHistory(limit, offset);
  };

  /**
   * Get company profile with social media and documents
   */
  const getCompanyProfile = async (websiteUrl: string) => {
    const profile = await persistenceService.getCompanyProfile(websiteUrl);
    if (!profile) return null;

    // Get social media profiles
    const socialProfiles = await socialMediaService.getSocialProfiles(profile.id);
    
    // Get recent documents
    const documents = await documentStorageService.getCompanyDocuments(profile.id, { limit: 10 });

    // Generate social insights
    const socialInsights = await socialMediaService.generateSocialInsights(profile.id);

    return {
      ...profile,
      socialProfiles,
      socialInsights,
      documents,
      documentCount: documents.length
    };
  };

  /**
   * Re-enrich a company (bypass cache)
   */
  const reEnrichCompany = async (
    request: EnrichmentRequest,
    onProgress?: (progress: EnrichmentProgress) => void
  ): Promise<BulkEnrichmentResponse> => {
    return enrichCompanyWithPersistence(request, {
      useCache: false,
      onProgress
    });
  };

  /**
   * Upload document for a company
   */
  const uploadCompanyDocument = async (
    websiteUrl: string,
    file: File,
    metadata: {
      title: string;
      description?: string;
      documentType: 'financial_report' | 'pitch_deck' | 'whitepaper' | 'case_study' | 'product_spec' | 'legal_doc' | 'other';
      visibility?: 'private' | 'team' | 'public';
    }
  ) => {
    // Get or create company profile
    let profile = await persistenceService.getCompanyProfile(websiteUrl);
    if (!profile) {
      // Create minimal profile
      await persistenceService.upsertCompanyProfile(websiteUrl, {});
      profile = await persistenceService.getCompanyProfile(websiteUrl);
      if (!profile) throw new Error('Failed to create company profile');
    }

    return documentStorageService.uploadDocument(profile.id, file, metadata);
  };

  /**
   * Get social media insights for a company
   */
  const getCompanySocialInsights = async (websiteUrl: string) => {
    const profile = await persistenceService.getCompanyProfile(websiteUrl);
    if (!profile) return null;

    return socialMediaService.generateSocialInsights(profile.id);
  };

  /**
   * Search company documents
   */
  const searchCompanyDocuments = async (
    websiteUrl: string,
    query: string,
    options?: {
      documentType?: 'financial_report' | 'pitch_deck' | 'whitepaper' | 'case_study' | 'product_spec' | 'legal_doc' | 'other';
      limit?: number;
    }
  ) => {
    const profile = await persistenceService.getCompanyProfile(websiteUrl);
    if (!profile) return [];

    return documentStorageService.searchDocuments(profile.id, query, options);
  };

  /**
   * Generate marketing intelligence for a company (async background task)
   */
  const generateMarketingIntelligenceAsync = async (
    companyProfileId: string,
    enrichmentData: BulkEnrichmentResponse,
    socialProfiles: any[],
    documents: any[]
  ) => {
    try {
      // Run in background - don't await or block main flow
      setTimeout(async () => {
        try {
          await marketingIntelligenceService.generateMarketingIntelligence(
            companyProfileId,
            enrichmentData,
            socialProfiles,
            documents
          );
          console.log(`✅ Marketing intelligence generated for company: ${companyProfileId}`);
        } catch (error) {
          console.error(`❌ Failed to generate marketing intelligence for ${companyProfileId}:`, error);
        }
      }, 1000); // 1 second delay to not block the main response
    } catch (error) {
      console.error('Error queuing marketing intelligence generation:', error);
    }
  };

  /**
   * Generate marketing intelligence manually (immediate)
   */
  const generateMarketingIntelligence = async (websiteUrl: string) => {
    const profile = await persistenceService.getCompanyProfile(websiteUrl);
    if (!profile) throw new Error('Company profile not found');

    // Get latest enrichment data
    const enrichmentHistory = await persistenceService.getUserEnrichmentHistory(1, 0);
    const latestEnrichment = enrichmentHistory.find(req => req.website_url === websiteUrl);
    
    if (!latestEnrichment) {
      throw new Error('No enrichment data found for this company');
    }

    const enrichmentData = await persistenceService.getEnrichmentRequest(latestEnrichment.id);
    const socialProfiles = await socialMediaService.getSocialProfiles(profile.id);
    const documents = await documentStorageService.getCompanyDocuments(profile.id, { limit: 50 });

    // Convert to expected format
    const bulkResponse: BulkEnrichmentResponse = {
      websiteUrl: enrichmentData.website_url,
      requestId: enrichmentData.id,
      results: enrichmentData.results,
      summary: {
        totalRequested: enrichmentData.total_requested,
        successful: enrichmentData.successful,
        failed: enrichmentData.failed,
        skipped: enrichmentData.skipped,
        totalDuration: enrichmentData.total_duration || 0
      }
    };

    return marketingIntelligenceService.generateMarketingIntelligence(
      profile.id,
      bulkResponse,
      socialProfiles,
      documents
    );
  };

  /**
   * Get marketing campaign for a company
   */
  const getMarketingCampaign = async (websiteUrl: string) => {
    const profile = await persistenceService.getCompanyProfile(websiteUrl);
    if (!profile) return null;

    return marketingIntelligenceService.getMarketingCampaign(profile.id);
  };

  return {
    // Core functionality
    enrichCompany: enrichCompanyWithPersistence,
    reEnrichCompany,

    // Query functionality  
    getEnrichmentRequest,
    getEnrichmentHistory,
    getCompanyProfile,

    // Social media functionality
    getCompanySocialInsights,

    // Document functionality
    uploadCompanyDocument,
    searchCompanyDocuments,

    // Marketing intelligence functionality
    generateMarketingIntelligence,
    getMarketingCampaign,

    // Direct access to underlying services
    enrichmentService,
    persistenceService,
    socialMediaService,
    documentStorageService,
    marketingIntelligenceService,

    // Configuration
    ALL_ENRICHMENT_TYPES: enrichmentService.ALL_ENRICHMENT_TYPES
  };
};

export type PersistedEnrichmentService = ReturnType<typeof makePersistedEnrichmentService>;