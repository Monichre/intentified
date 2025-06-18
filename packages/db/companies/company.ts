import { supabaseAdminClient } from "../src/supabase/admin.client";

// Define types locally instead of importing from app-specific paths
export interface CompanyEnrichmentData {
  description?: string;
  category?: string;
  summary?: any;
  funding?: {
    status?: string;
    totalFunding?: number;
  };
  linkedIn?: {
    url?: string;
    employeeCount?: number;
    followers?: number;
  };
  founders?: any[];
  competitors?: string[];
  companyIntelligence?: any;
}

export type CompanySize = 'solo' | '2-10' | '11-50' | '51-200' | '201-500' | '500+';

export interface CompanyData {
  id?: string;
  clerk_user_id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: CompanySize;
  social_links?: Record<string, string>;
  keywords?: string[];
  competitors?: string[];
}

export interface UserGoalsData {
  id?: string;
  company_id: string;
  clerk_user_id: string;
  goals: string[];
}

export interface OnboardingProgressData {
  id?: string;
  company_id: string;
  clerk_user_id: string;
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  current_step?: string;
  completed_steps?: string[];
  form_data_snapshot?: any;
}

export class CompanyPersistence {
  /**
   * Get or create a company for a user
   */
  static async getOrCreateCompany(
    clerkUserId: string,
    companyData: Partial<CompanyData>
  ): Promise<string> {
    // First, try to get existing company
    const { data: existingCompany, error: fetchError } = await supabaseAdminClient
      .from('companies')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (existingCompany) {
      // Update existing company
      const { error: updateError } = await supabaseAdminClient
        .from('companies')
        .update({
          name: companyData.name,
          website: companyData.website,
          industry: companyData.industry,
          size: companyData.size,
          social_links: companyData.social_links,
          keywords: companyData.keywords,
          competitors: companyData.competitors,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCompany.id);

      if (updateError) {
        console.error('Error updating company:', updateError);
        throw updateError;
      }

      return existingCompany.id;
    }

    // Create new company
    const { data: newCompany, error: createError } = await supabaseAdminClient
      .from('companies')
      .insert({
        clerk_user_id: clerkUserId,
        name: companyData.name || '',
        website: companyData.website,
        industry: companyData.industry,
        size: companyData.size,
        social_links: companyData.social_links || {},
        keywords: companyData.keywords || [],
        competitors: companyData.competitors || [],
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating company:', createError);
      throw createError;
    }

    return newCompany.id;
  }

  /**
   * Save company enrichment data
   */
  static async saveEnrichmentData(
    companyId: string,
    enrichmentData: CompanyEnrichmentData,
    seoAnalysisData?: any
  ): Promise<void> {
    const enrichmentRecord = {
      company_id: companyId,
      description: enrichmentData.description,
      category: enrichmentData.category,
      summary_sections: enrichmentData.summary,
      funding_status: enrichmentData.funding?.status,
      total_funding: enrichmentData.funding?.totalFunding,
      linkedin_url: enrichmentData.linkedIn?.url,
      linkedin_employee_count: enrichmentData.linkedIn?.employeeCount,
      linkedin_followers: enrichmentData.linkedIn?.followers,
      founders: enrichmentData.founders || [],
      enriched_competitors: enrichmentData.competitors || [],
      company_intelligence: enrichmentData.companyIntelligence,
      enrichment_source: 'api',
      raw_enrichment_data: enrichmentData,
      seo_analysis_completed: !!seoAnalysisData,
      seo_analysis_timestamp: seoAnalysisData ? new Date().toISOString() : null,
      seo_analysis_data: seoAnalysisData,
    };

    // Check if enrichment already exists
    const { data: existing } = await supabaseAdminClient
      .from('company_enrichments')
      .select('id')
      .eq('company_id', companyId)
      .single();

    if (existing) {
      // Update existing enrichment
      const { error } = await supabaseAdminClient
        .from('company_enrichments')
        .update({
          ...enrichmentRecord,
          updated_at: new Date().toISOString(),
        })
        .eq('company_id', companyId);

      if (error) {
        console.error('Error updating enrichment:', error);
        throw error;
      }
    } else {
      // Insert new enrichment
      const { error } = await supabaseAdminClient
        .from('company_enrichments')
        .insert(enrichmentRecord);

      if (error) {
        console.error('Error inserting enrichment:', error);
        throw error;
      }
    }
  }

  /**
   * Save user goals
   */
  static async saveUserGoals(
    companyId: string,
    clerkUserId: string,
    goals: string[]
  ): Promise<void> {
    // Check if goals already exist
    const { data: existing } = await supabaseAdminClient
      .from('user_goals')
      .select('id')
      .eq('company_id', companyId)
      .single();

    if (existing) {
      // Update existing goals
      const { error } = await supabaseAdminClient
        .from('user_goals')
        .update({
          goals,
          updated_at: new Date().toISOString(),
        })
        .eq('company_id', companyId);

      if (error) {
        console.error('Error updating goals:', error);
        throw error;
      }
    } else {
      // Insert new goals
      const { error } = await supabaseAdminClient
        .from('user_goals')
        .insert({
          company_id: companyId,
          clerk_user_id: clerkUserId,
          goals,
        });

      if (error) {
        console.error('Error inserting goals:', error);
        throw error;
      }
    }
  }

  /**
   * Update onboarding progress
   */
  static async updateOnboardingProgress(
    companyId: string,
    clerkUserId: string,
    progress: Partial<OnboardingProgressData>
  ): Promise<void> {
    // Check if progress already exists
    const { data: existing } = await supabaseAdminClient
      .from('onboarding_progress')
      .select('id')
      .eq('company_id', companyId)
      .single();

    if (existing) {
      // Update existing progress
      const { error } = await supabaseAdminClient
        .from('onboarding_progress')
        .update({
          ...progress,
          updated_at: new Date().toISOString(),
        })
        .eq('company_id', companyId);

      if (error) {
        console.error('Error updating onboarding progress:', error);
        throw error;
      }
    } else {
      // Insert new progress
      const { error } = await supabaseAdminClient
        .from('onboarding_progress')
        .insert({
          company_id: companyId,
          clerk_user_id: clerkUserId,
          ...progress,
        });

      if (error) {
        console.error('Error inserting onboarding progress:', error);
        throw error;
      }
    }
  }

  /**
   * Complete onboarding with all data
   */
  static async completeOnboarding(
    clerkUserId: string,
    formData: {
      companyName: string;
      companySize: CompanySize;
      industry: string;
      website: string;
      socialLinks: Record<string, string>;
      competitors: string[];
      keywords: string[];
      goals: string[];
    },
    enrichmentData?: CompanyEnrichmentData,
    seoAnalysisData?: any
  ): Promise<void> {
    try {
      // 1. Create or update company
      const companyId = await this.getOrCreateCompany(clerkUserId, {
        name: formData.companyName,
        size: formData.companySize,
        industry: formData.industry,
        website: formData.website,
        social_links: formData.socialLinks,
        keywords: formData.keywords,
        competitors: formData.competitors,
      });

      // 2. Save enrichment data if available
      if (enrichmentData) {
        await this.saveEnrichmentData(companyId, enrichmentData, seoAnalysisData);
      }

      // 3. Save user goals
      await this.saveUserGoals(companyId, clerkUserId, formData.goals);

      // 4. Update onboarding progress
      await this.updateOnboardingProgress(companyId, clerkUserId, {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        completed_steps: ['company', 'digital', 'seo', 'goals', 'confirm'],
      });

    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Get company data by user ID
   */
  static async getCompanyByUserId(clerkUserId: string): Promise<any> {
    const { data, error } = await supabaseAdminClient
      .from('companies')
      .select(`
        *,
        company_enrichments (*),
        user_goals (*),
        onboarding_progress (*)
      `)
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      return null;
    }

    return data;
  }
}