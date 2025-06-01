import type { 
  BulkEnrichmentResponse,
  CompanySummaryResult,
 
} from "../types";
import { askAiStructuredResponse, ANTHROPIC_MODELS } from "../../../lib/models";
import { z } from "zod";

interface Database {
  from: (table: string) => any;
}

export interface BrandAnalysis {
  tone: {
    primary: 'professional' | 'casual' | 'innovative' | 'traditional' | 'playful' | 'authoritative';
    secondary: string[];
    confidence: number;
    examples: string[];
  };
  communicationStyle: {
    style: 'direct' | 'conversational' | 'technical' | 'storytelling' | 'data-driven' | 'emotional';
    characteristics: string[];
    vocabulary: string[];
    sentenceStructure: 'short' | 'medium' | 'long' | 'varied';
  };
  brandIdentity: {
    values: string[];
    personality: string[];
    positioning: string;
    targetAudience: string;
    uniqueSellingProposition: string;
  };
  visualPreferences: {
    colorScheme: 'corporate' | 'modern' | 'minimalist' | 'vibrant' | 'dark' | 'light';
    designStyle: 'clean' | 'bold' | 'elegant' | 'playful' | 'technical' | 'artistic';
    imagery: string[];
  };
  competitiveAnalysis: {
    differentiators: string[];
    marketPosition: 'leader' | 'challenger' | 'niche' | 'startup';
    competitiveAdvantages: string[];
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  purpose: 'cold_outreach' | 'follow_up' | 'partnership' | 'product_demo' | 'content_sharing' | 'event_invitation' | 'feedback_request' | 'case_study' | 'newsletter' | 're_engagement';
  subject: string;
  previewText: string;
  content: {
    html: string;
    text: string;
    reactEmailComponent: string;
  };
  designVariant: {
    name: string;
    theme: 'minimal' | 'corporate' | 'modern' | 'creative' | 'dark' | 'colorful' | 'newsletter' | 'product' | 'event' | 'personal';
    primaryColor: string;
    secondaryColor: string;
    layout: 'single_column' | 'two_column' | 'hero_banner' | 'card_layout' | 'timeline' | 'grid';
  };
  personalization: {
    variables: string[];
    dynamicContent: Record<string, string>;
    conditionalSections: Array<{
      condition: string;
      content: string;
    }>;
  };
  performance: {
    estimatedOpenRate: number;
    estimatedClickRate: number;
    difficulty: 'easy' | 'medium' | 'hard';
    bestTimeToSend: string;
  };
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  companyProfileId: string;
  brandAnalysis: BrandAnalysis;
  emailTemplates: EmailTemplate[];
  generatedAt: string;
  status: 'generating' | 'completed' | 'failed';
  totalTemplates: number;
  processingTime: number;
}

const BrandAnalysisSchema = z.object({
  tone: z.object({
    primary: z.enum(['professional', 'casual', 'innovative', 'traditional', 'playful', 'authoritative']),
    secondary: z.array(z.string()),
    confidence: z.number().min(0).max(1),
    examples: z.array(z.string())
  }),
  communicationStyle: z.object({
    style: z.enum(['direct', 'conversational', 'technical', 'storytelling', 'data-driven', 'emotional']),
    characteristics: z.array(z.string()),
    vocabulary: z.array(z.string()),
    sentenceStructure: z.enum(['short', 'medium', 'long', 'varied'])
  }),
  brandIdentity: z.object({
    values: z.array(z.string()),
    personality: z.array(z.string()),
    positioning: z.string(),
    targetAudience: z.string(),
    uniqueSellingProposition: z.string()
  }),
  visualPreferences: z.object({
    colorScheme: z.enum(['corporate', 'modern', 'minimalist', 'vibrant', 'dark', 'light']),
    designStyle: z.enum(['clean', 'bold', 'elegant', 'playful', 'technical', 'artistic']),
    imagery: z.array(z.string())
  }),
  competitiveAnalysis: z.object({
    differentiators: z.array(z.string()),
    marketPosition: z.enum(['leader', 'challenger', 'niche', 'startup']),
    competitiveAdvantages: z.array(z.string())
  })
});

const EmailTemplateSchema = z.object({
  name: z.string(),
  description: z.string(),
  purpose: z.enum(['cold_outreach', 'follow_up', 'partnership', 'product_demo', 'content_sharing', 'event_invitation', 'feedback_request', 'case_study', 'newsletter', 're_engagement']),
  subject: z.string(),
  previewText: z.string(),
  content: z.object({
    html: z.string(),
    text: z.string()
  }),
  designVariant: z.object({
    name: z.string(),
    theme: z.enum(['minimal', 'corporate', 'modern', 'creative', 'dark', 'colorful', 'newsletter', 'product', 'event', 'personal']),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    layout: z.enum(['single_column', 'two_column', 'hero_banner', 'card_layout', 'timeline', 'grid'])
  }),
  personalization: z.object({
    variables: z.array(z.string()),
    dynamicContent: z.record(z.string()),
    conditionalSections: z.array(z.object({
      condition: z.string(),
      content: z.string()
    }))
  }),
  performance: z.object({
    estimatedOpenRate: z.number().min(0).max(1),
    estimatedClickRate: z.number().min(0).max(1),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    bestTimeToSend: z.string()
  })
});

export const makeMarketingIntelligenceService = (db: Database) => {

  /**
   * Analyze company brand and communication style
   */
  const analyzeBrandIdentity = async (
    enrichmentData: BulkEnrichmentResponse,
    socialProfiles: SocialProfile[],
    documents: CompanyDocument[]
  ): Promise<BrandAnalysis> => {
    // Compile all text content for analysis
    const contentSources = [];

    // Extract text from enrichment data
    enrichmentData.results.forEach(result => {
      if (result.status === 'success' && result.data) {
        if (result.type === 'company-summary') {
          const summaryData = result.data as CompanySummaryResult['data'];
          summaryData.sections?.forEach(section => {
            contentSources.push(`Website ${section.heading}: ${section.text}`);
          });
        } else if (result.type === 'basic-info' || result.type === 'website-url') {
          const basicData = result.data as any;
          basicData.results?.forEach((item: any) => {
            if (item.text) contentSources.push(`Website content: ${item.text}`);
            if (item.summary) contentSources.push(`Website summary: ${item.summary}`);
          });
        } else if (result.type === 'news') {
          const newsData = result.data as any;
          newsData.results?.forEach((item: any) => {
            if (item.text) contentSources.push(`News content: ${item.text}`);
          });
        }
      }
    });

    // Extract social media content
    socialProfiles.forEach(profile => {
      if (profile.bio) {
        contentSources.push(`${profile.platform} bio: ${profile.bio}`);
      }
      if (profile.scrapedData) {
        // Extract recent posts if available
        const posts = profile.scrapedData.recentPosts || profile.scrapedData.posts || [];
        posts.slice(0, 10).forEach((post: any) => {
          if (post.text || post.content) {
            contentSources.push(`${profile.platform} post: ${post.text || post.content}`);
          }
        });
      }
    });

    // Extract document summaries
    documents.forEach(doc => {
      if (doc.summary) {
        contentSources.push(`Document (${doc.documentType}): ${doc.summary}`);
      }
      if (doc.extractedText) {
        // Use first 1000 characters of extracted text
        contentSources.push(`Document content: ${doc.extractedText.substring(0, 1000)}`);
      }
    });

    const combinedContent = contentSources.join('\n\n');

    const prompt = `
Analyze the following company content to determine their brand identity, communication style, and marketing approach:

${combinedContent}

Based on this content, provide a comprehensive brand analysis that covers:

1. **Tone Analysis**: What is their primary communication tone? (professional, casual, innovative, etc.)
2. **Communication Style**: How do they communicate? (direct, conversational, technical, etc.)
3. **Brand Identity**: What are their core values, personality traits, and positioning?
4. **Visual Preferences**: What design and visual style would match their brand?
5. **Competitive Analysis**: What differentiates them in their market?

Be specific and provide examples from the content to support your analysis.
    `;

    const { object: brandAnalysis } = await askAiStructuredResponse({
      prompt,
      schema: BrandAnalysisSchema,
      model: ANTHROPIC_MODELS.SONNET_35,
      system: "You are a brand strategist and marketing expert. Analyze company content to extract brand identity, communication patterns, and marketing insights."
    });

    return brandAnalysis;
  };

  /**
   * Generate email templates based on brand analysis
   */
  const generateEmailTemplates = async (
    brandAnalysis: BrandAnalysis,
    companyData: {
      websiteUrl: string;
      companyName: string;
      industry?: string;
      summary?: string;
    }
  ): Promise<EmailTemplate[]> => {
    const emailPurposes: EmailTemplate['purpose'][] = [
      'cold_outreach',
      'follow_up', 
      'partnership',
      'product_demo',
      'content_sharing',
      'event_invitation',
      'feedback_request',
      'case_study',
      'newsletter',
      're_engagement'
    ];

    const designThemes: EmailTemplate['designVariant']['theme'][] = [
      'minimal',
      'corporate', 
      'modern',
      'creative',
      'dark',
      'colorful',
      'newsletter',
      'product',
      'event',
      'personal'
    ];

    const templates: EmailTemplate[] = [];

    // Generate one template for each purpose with varying design themes
    for (let i = 0; i < emailPurposes.length; i++) {
      const purpose = emailPurposes[i];
      const theme = designThemes[i % designThemes.length];

      const prompt = `
Create a high-converting email template for ${companyData.companyName} with the following specifications:

**Company Information:**
- Name: ${companyData.companyName}
- Website: ${companyData.websiteUrl}
- Industry: ${companyData.industry || 'Not specified'}
- Summary: ${companyData.summary || 'Not provided'}

**Brand Analysis:**
- Primary Tone: ${brandAnalysis.tone.primary}
- Communication Style: ${brandAnalysis.communicationStyle.style}
- Brand Values: ${brandAnalysis.brandIdentity.values.join(', ')}
- Target Audience: ${brandAnalysis.brandIdentity.targetAudience}
- Unique Selling Proposition: ${brandAnalysis.brandIdentity.uniqueSellingProposition}

**Email Specifications:**
- Purpose: ${purpose}
- Design Theme: ${theme}
- Color Scheme: ${brandAnalysis.visualPreferences.colorScheme}
- Design Style: ${brandAnalysis.visualPreferences.designStyle}

Create an email template that:
1. Matches their brand tone and communication style exactly
2. Uses appropriate personalization variables
3. Includes both HTML and plain text versions
4. Has compelling subject line and preview text
5. Incorporates their brand values and USP naturally
6. Is optimized for the specified purpose and theme

The email should feel authentic to their brand and be immediately actionable.
      `;

      const { object: template } = await askAiStructuredResponse({
        prompt,
        schema: EmailTemplateSchema,
        model: ANTHROPIC_MODELS.SONNET_35,
        system: `You are an expert email marketing copywriter and designer. Create high-converting email templates that match the company's exact brand voice and achieve specific marketing objectives. Focus on authenticity, personalization, and measurable results.`
      });

      // Generate React Email component
      const reactEmailComponent = await generateReactEmailComponent(template, brandAnalysis, theme);

      templates.push({
        id: `template-${Date.now()}-${i}`,
        ...template,
        content: {
          ...template.content,
          reactEmailComponent
        },
        createdAt: new Date().toISOString()
      });

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return templates;
  };

  /**
   * Generate React Email component code
   */
  const generateReactEmailComponent = async (
    template: Omit<EmailTemplate, 'id' | 'createdAt' | 'content'> & { content: { html: string; text: string } },
    brandAnalysis: BrandAnalysis,
    theme: EmailTemplate['designVariant']['theme']
  ): Promise<string> => {
    const prompt = `
Generate a React Email component for the following email template:

**Template Details:**
- Name: ${template.name}
- Purpose: ${template.purpose}
- Theme: ${theme}
- Layout: ${template.designVariant.layout}
- Primary Color: ${template.designVariant.primaryColor}
- Secondary Color: ${template.designVariant.secondaryColor}

**Content:**
${template.content.html}

**Brand Guidelines:**
- Tone: ${brandAnalysis.tone.primary}
- Design Style: ${brandAnalysis.visualPreferences.designStyle}
- Color Scheme: ${brandAnalysis.visualPreferences.colorScheme}

Create a React Email component that:
1. Uses @react-email/components
2. Implements the specified layout and theme
3. Includes proper styling with inline CSS
4. Supports personalization variables: ${template.personalization.variables.join(', ')}
5. Is mobile-responsive
6. Follows email best practices
7. Matches the brand's visual preferences

Return only the React component code, properly formatted and ready to use.
    `;

    const response = await askAiStructuredResponse({
      prompt,
      schema: z.object({
        componentCode: z.string()
      }),
      model: ANTHROPIC_MODELS.SONNET_35,
      system: "You are an expert React Email developer. Create production-ready email components that render perfectly across all email clients and devices."
    });

    return response.object.componentCode;
  };

  /**
   * Save marketing campaign to database
   */
  const saveMarketingCampaign = async (
    companyProfileId: string,
    brandAnalysis: BrandAnalysis,
    emailTemplates: EmailTemplate[]
  ): Promise<string> => {
    const campaignId = `campaign-${Date.now()}`;

    const { error } = await db
      .from('company_marketing_campaigns')
      .insert({
        id: campaignId,
        company_profile_id: companyProfileId,
        brand_analysis: brandAnalysis,
        email_templates: emailTemplates,
        generated_at: new Date().toISOString(),
        status: 'completed',
        total_templates: emailTemplates.length,
        processing_time: 0 // Will be updated when processing completes
      });

    if (error) throw new Error(`Failed to save marketing campaign: ${error.message}`);

    return campaignId;
  };

  /**
   * Get marketing campaign by company
   */
  const getMarketingCampaign = async (companyProfileId: string): Promise<MarketingCampaign | null> => {
    const { data, error } = await db
      .from('company_marketing_campaigns')
      .select('*')
      .eq('company_profile_id', companyProfileId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to get marketing campaign: ${error.message}`);

    if (!data) return null;

    return {
      id: data.id,
      companyProfileId: data.company_profile_id,
      brandAnalysis: data.brand_analysis,
      emailTemplates: data.email_templates,
      generatedAt: data.generated_at,
      status: data.status,
      totalTemplates: data.total_templates,
      processingTime: data.processing_time
    };
  };

  /**
   * Generate complete marketing intelligence (main orchestrator)
   */
  const generateMarketingIntelligence = async (
    companyProfileId: string,
    enrichmentData: BulkEnrichmentResponse,
    socialProfiles: SocialProfile[],
    documents: CompanyDocument[],
    onProgress?: (update: {
      step: string;
      currentStep: number;
      totalSteps: number;
      message: string;
    }) => void | Promise<void>
  ): Promise<MarketingCampaign> => {
    const startTime = Date.now();
    const totalSteps = 4; // Brand analysis + Company data extraction + Email generation + Save to database

    try {
      // Step 1: Analyze brand identity
      if (onProgress) {
        await onProgress({
          step: 'brand-analysis',
          currentStep: 1,
          totalSteps,
          message: 'Analyzing brand identity and communication style'
        });
      }
      const brandAnalysis = await analyzeBrandIdentity(enrichmentData, socialProfiles, documents);

      // Step 2: Extract company data for template generation
      if (onProgress) {
        await onProgress({
          step: 'data-extraction',
          currentStep: 2,
          totalSteps,
          message: 'Extracting company information for template generation'
        });
      }
      const companyData = {
        websiteUrl: enrichmentData.websiteUrl,
        companyName: extractCompanyName(enrichmentData),
        industry: extractIndustry(enrichmentData),
        summary: extractCompanySummary(enrichmentData)
      };

      // Step 3: Generate email templates
      if (onProgress) {
        await onProgress({
          step: 'email-generation',
          currentStep: 3,
          totalSteps,
          message: 'Generating personalized email templates'
        });
      }
      const emailTemplates = await generateEmailTemplates(brandAnalysis, companyData);

      // Step 4: Save to database
      if (onProgress) {
        await onProgress({
          step: 'saving',
          currentStep: 4,
          totalSteps,
          message: 'Saving marketing campaign to database'
        });
      }
      const campaignId = await saveMarketingCampaign(companyProfileId, brandAnalysis, emailTemplates);

      const processingTime = Date.now() - startTime;

      // Update processing time
      await db
        .from('company_marketing_campaigns')
        .update({ processing_time: processingTime })
        .eq('id', campaignId);

      return {
        id: campaignId,
        companyProfileId,
        brandAnalysis,
        emailTemplates,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        totalTemplates: emailTemplates.length,
        processingTime
      };

    } catch (error) {
      // Save failed campaign record
      const campaignId = `campaign-failed-${Date.now()}`;
      await db
        .from('company_marketing_campaigns')
        .insert({
          id: campaignId,
          company_profile_id: companyProfileId,
          status: 'failed',
          generated_at: new Date().toISOString(),
          total_templates: 0,
          processing_time: Date.now() - startTime,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });

      throw error;
    }
  };

  // Helper functions
  const extractCompanyName = (enrichmentData: BulkEnrichmentResponse): string => {
    // Try to extract company name from various sources
    const summaryResult = enrichmentData.results.find(r => r.type === 'company-summary');
    if (summaryResult?.status === 'success') {
      const summary = summaryResult.data as CompanySummaryResult['data'];
      // Look for company name in headings or content
      for (const section of summary.sections || []) {
        if (section.heading.toLowerCase().includes('about') || section.heading.toLowerCase().includes('company')) {
          const nameMatch = section.text.match(/([A-Z][a-zA-Z\s]+(?:Inc|LLC|Corp|Ltd|Corporation|Company)?)/);
          if (nameMatch) return nameMatch[1].trim();
        }
      }
    }

    // Fallback to domain name
    const domain = enrichmentData.websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    return domain.split('.')[0];
  };

  const extractIndustry = (enrichmentData: BulkEnrichmentResponse): string | undefined => {
    const summaryResult = enrichmentData.results.find(r => r.type === 'company-summary');
    if (summaryResult?.status === 'success') {
      const summary = summaryResult.data as CompanySummaryResult['data'];
      // Look for industry mentions in the summary
      const industryTerms = ['software', 'technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'education', 'consulting'];
      const combinedText = summary.sections?.map(s => s.text).join(' ').toLowerCase() || '';
      
      for (const term of industryTerms) {
        if (combinedText.includes(term)) {
          return term.charAt(0).toUpperCase() + term.slice(1);
        }
      }
    }
    return undefined;
  };

  const extractCompanySummary = (enrichmentData: BulkEnrichmentResponse): string | undefined => {
    const summaryResult = enrichmentData.results.find(r => r.type === 'company-summary');
    if (summaryResult?.status === 'success') {
      const summary = summaryResult.data as CompanySummaryResult['data'];
      return summary.sections?.map(s => s.text).join(' ').substring(0, 500);
    }
    return undefined;
  };

  return {
    analyzeBrandIdentity,
    generateEmailTemplates,
    generateMarketingIntelligence,
    getMarketingCampaign,
    saveMarketingCampaign
  };
};

export type MarketingIntelligenceService = ReturnType<typeof makeMarketingIntelligenceService>;