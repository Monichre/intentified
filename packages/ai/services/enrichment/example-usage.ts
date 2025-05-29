import { createClient } from '@supabase/supabase-js';
import { makePersistedEnrichmentService } from './enrichment-with-persistence.service';

// Example usage in Next.js API route or server component
export async function enrichCompanyExample() {
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123'; // Get from auth context
  
  // Create the persisted enrichment service with social & document support
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  try {
    // Enrich a company with social media and document support
    const result = await enrichmentService.enrichCompany({
      websiteUrl: 'https://anthropic.com',
      enrichmentTypes: [
        'basic-info', 
        'company-summary', 
        'funding', 
        'competitors',
        'linkedin',
        'twitter-profile',
        'news'
      ]
    }, {
      useCache: true, // Will use cached data if fresh (< 24hrs)
      onProgress: (progress) => {
        console.log(`Progress: ${progress.currentStep}/${progress.totalSteps} - ${progress.currentType}`);
      },
      onPersisted: (requestId) => {
        console.log(`Enrichment request persisted with ID: ${requestId}`);
      }
    });

    console.log('Enrichment completed:', {
      successful: result.summary.successful,
      failed: result.summary.failed,
      duration: result.summary.totalDuration
    });

    return result;

  } catch (error) {
    console.error('Enrichment failed:', error);
    throw error;
  }
}

// Example: Get user's enrichment history
export async function getUserHistory() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  const history = await enrichmentService.getEnrichmentHistory(10, 0);
  
  return history.map(req => ({
    id: req.id,
    websiteUrl: req.website_url,
    status: req.status,
    enrichmentTypes: req.enrichment_types,
    createdAt: req.created_at,
    completedAt: req.completed_at,
    summary: {
      successful: req.successful,
      failed: req.failed,
      skipped: req.skipped,
      duration: req.total_duration
    }
  }));
}

// Example: Get cached company data
export async function getCompanyData(websiteUrl: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  const profile = await enrichmentService.getCompanyProfile(websiteUrl);
  
  if (!profile) {
    return null;
  }

  return {
    websiteUrl: profile.website_url,
    lastEnrichedAt: profile.last_enriched_at,
    data: profile.enrichment_data,
    socialProfiles: profile.socialProfiles,
    socialInsights: profile.socialInsights,
    documents: profile.documents,
    documentCount: profile.documentCount,
    isFresh: profile.last_enriched_at ? 
      enrichmentService.persistenceService.isEnrichmentFresh(profile.last_enriched_at) : 
      false
  };
}

// Example: Upload company document
export async function uploadCompanyDocument(
  websiteUrl: string,
  file: File,
  metadata: {
    title: string;
    description?: string;
    documentType: 'financial_report' | 'pitch_deck' | 'whitepaper' | 'case_study' | 'product_spec' | 'legal_doc' | 'other';
  }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  const documentId = await enrichmentService.uploadCompanyDocument(
    websiteUrl,
    file,
    metadata
  );

  console.log(`Document uploaded with ID: ${documentId}`);
  return documentId;
}

// Example: Get social media insights
export async function getCompanySocialInsights(websiteUrl: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  const insights = await enrichmentService.getCompanySocialInsights(websiteUrl);
  
  if (!insights) {
    return null;
  }

  return {
    totalFollowers: insights.totalFollowers,
    totalPosts: insights.totalPosts,
    avgEngagementRate: insights.avgEngagementRate,
    sentimentTrend: insights.sentimentTrend,
    topTopics: insights.topTopics,
    platformBreakdown: insights.platformBreakdown,
    growthMetrics: insights.growthMetrics
  };
}

// Example: Search company documents
export async function searchCompanyDocuments(
  websiteUrl: string,
  query: string,
  documentType?: 'financial_report' | 'pitch_deck' | 'whitepaper'
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  const documents = await enrichmentService.searchCompanyDocuments(
    websiteUrl,
    query,
    { documentType, limit: 20 }
  );

  return documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    documentType: doc.documentType,
    fileName: doc.fileName,
    summary: doc.summary,
    tags: doc.tags,
    sentimentScore: doc.sentimentScore,
    uploadedAt: doc.uploadedAt,
    processingStatus: doc.processingStatus
  }));
}

// Example: Generate marketing intelligence and email templates
export async function generateMarketingCampaign(websiteUrl: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  try {
    // Step 1: Generate marketing intelligence (analyzes brand + creates 10 email templates)
    const campaign = await enrichmentService.generateMarketingIntelligence(websiteUrl);

    console.log('🎯 Marketing Campaign Generated:', {
      campaignId: campaign.id,
      brandAnalysis: {
        tone: campaign.brandAnalysis.tone.primary,
        style: campaign.brandAnalysis.communicationStyle.style,
        positioning: campaign.brandAnalysis.brandIdentity.positioning
      },
      emailTemplates: campaign.emailTemplates.length,
      processingTime: `${campaign.processingTime}ms`
    });

    // Step 2: Each template includes React Email component code
    campaign.emailTemplates.forEach((template, index) => {
      console.log(`📧 Template ${index + 1}:`, {
        name: template.name,
        purpose: template.purpose,
        theme: template.designVariant.theme,
        layout: template.designVariant.layout,
        estimatedOpenRate: `${(template.performance.estimatedOpenRate * 100).toFixed(1)}%`,
        estimatedClickRate: `${(template.performance.estimatedClickRate * 100).toFixed(1)}%`,
        hasReactComponent: !!template.content.reactEmailComponent
      });
    });

    return campaign;

  } catch (error) {
    console.error('Failed to generate marketing campaign:', error);
    throw error;
  }
}

// Example: Get existing marketing campaign
export async function getMarketingCampaign(websiteUrl: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  const campaign = await enrichmentService.getMarketingCampaign(websiteUrl);
  
  if (!campaign) {
    return null;
  }

  return {
    id: campaign.id,
    status: campaign.status,
    generatedAt: campaign.generatedAt,
    processingTime: campaign.processingTime,
    brandAnalysis: campaign.brandAnalysis,
    emailTemplates: campaign.emailTemplates.map(template => ({
      id: template.id,
      name: template.name,
      purpose: template.purpose,
      subject: template.subject,
      theme: template.designVariant.theme,
      layout: template.designVariant.layout,
      colors: {
        primary: template.designVariant.primaryColor,
        secondary: template.designVariant.secondaryColor
      },
      performance: template.performance,
      personalizationVariables: template.personalization.variables,
      hasReactComponent: !!template.content.reactEmailComponent
    })),
    totalTemplates: campaign.totalTemplates
  };
}

// Example: Use React Email template with Resend
export async function sendMarketingEmail(
  templateId: string,
  recipientData: {
    email: string;
    name: string;
    company: string;
    [key: string]: any;
  }
) {
  // This would be implemented in your email sending service
  console.log('📤 Sending personalized email:', {
    templateId,
    recipient: recipientData.email,
    personalization: recipientData
  });

  // Example Resend integration:
  /*
  import { Resend } from 'resend';
  import { YourEmailTemplate } from './generated-templates/your-email-template';

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'hello@yourcompany.com',
    to: [recipientData.email],
    subject: personalizedSubject,
    react: YourEmailTemplate({
      recipientName: recipientData.name,
      companyName: recipientData.company,
      ...recipientData
    }),
  });
  */

  return {
    success: true,
    message: 'Email sent successfully',
    recipientEmail: recipientData.email
  };
}

// Example: Complete marketing workflow
export async function completeMarketingWorkflow(websiteUrl: string) {
  console.log('🚀 Starting complete marketing workflow...');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = 'user-123';
  const enrichmentService = makePersistedEnrichmentService(supabase, supabase, userId);

  // Step 1: Enrich company data (includes automatic marketing intelligence generation)
  console.log('1️⃣ Enriching company data...');
  const enrichment = await enrichmentService.enrichCompany({
    websiteUrl,
    enrichmentTypes: [
      'basic-info',
      'company-summary',
      'funding',
      'competitors',
      'linkedin',
      'twitter-profile',
      'news'
    ]
  }, {
    useCache: true,
    onProgress: (progress) => {
      console.log(`   📊 Progress: ${progress.currentStep}/${progress.totalSteps} - ${progress.currentType}`);
    }
  });

  // Step 2: Wait for marketing intelligence (generated automatically in background)
  console.log('2️⃣ Waiting for marketing intelligence...');
  let campaign = null;
  let attempts = 0;
  while (!campaign && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    campaign = await enrichmentService.getMarketingCampaign(websiteUrl);
    attempts++;
    console.log(`   ⏳ Attempt ${attempts}/10 - Campaign status: ${campaign?.status || 'not found'}`);
  }

  if (!campaign) {
    console.log('3️⃣ Generating marketing intelligence manually...');
    campaign = await enrichmentService.generateMarketingIntelligence(websiteUrl);
  }

  // Step 3: Display results
  console.log('✅ Marketing workflow completed!');
  console.log({
    enrichmentSummary: {
      successful: enrichment.summary.successful,
      failed: enrichment.summary.failed,
      duration: `${enrichment.summary.totalDuration}ms`
    },
    campaignSummary: {
      campaignId: campaign.id,
      brandTone: campaign.brandAnalysis.tone.primary,
      communicationStyle: campaign.brandAnalysis.communicationStyle.style,
      emailTemplates: campaign.emailTemplates.length,
      avgOpenRate: `${(campaign.emailTemplates.reduce((sum, t) => sum + t.performance.estimatedOpenRate, 0) / campaign.emailTemplates.length * 100).toFixed(1)}%`,
      processingTime: `${campaign.processingTime}ms`
    }
  });

  return {
    enrichment,
    campaign,
    workflow: {
      status: 'completed',
      totalTime: enrichment.summary.totalDuration + campaign.processingTime,
      steps: [
        '✅ Company data enriched',
        '✅ Social media analyzed', 
        '✅ Brand identity analyzed',
        '✅ Email templates generated',
        '✅ React Email components created'
      ]
    }
  };
}