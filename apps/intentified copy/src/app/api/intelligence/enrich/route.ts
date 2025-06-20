import { NextRequest, NextResponse } from 'next/server';
import { 
  CompanyEnrichmentService, 
  
  EnrichmentType,
  BulkEnrichmentResponse,
  makeCompanyEnrichmentService
} from '@repo/ai';

export const maxDuration = 100;

export async function POST(req: NextRequest) {
  try {
    const { websiteUrl, enrichmentTypes } = await req.json();
    
    if (!websiteUrl) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(websiteUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid website URL format' }, { status: 400 });
    }

    const exaApiKey = process.env.EXA_API_KEY;
    if (!exaApiKey) {
      return NextResponse.json({ error: 'EXA API key not configured' }, { status: 500 });
    }

    // Initialize services
    
    const enrichmentService = makeCompanyEnrichmentService()

    // Default enrichment types for onboarding
    const defaultTypes: EnrichmentType[] = [
      'basic-info',
      'company-summary', 
      'funding',
      'linkedin',
      'founders',
      'competitors'
    ];

    // Execute bulk enrichment
    const result: BulkEnrichmentResponse = await enrichmentService.enrichCompany({
      websiteUrl,
      enrichmentTypes: enrichmentTypes || defaultTypes,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Bulk enrichment API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: `Bulk enrichment failed: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add streaming support for real-time progress updates
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const websiteUrl = searchParams.get('websiteUrl');
  
  if (!websiteUrl) {
    return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
  }

  // Return available enrichment types
  const availableTypes: EnrichmentType[] = [
    'basic-info',
    'company-summary',
    'funding', 
    'linkedin',
    'founders',
    'competitors',
    'crunchbase',
    'news',
    'social-media'
  ];

  return NextResponse.json({
    availableTypes,
    defaultTypes: [
      'basic-info',
      'company-summary',
      'funding',
      'linkedin', 
      'founders',
      'competitors'
    ],
    estimatedDuration: {
      'basic-info': 5000,
      'company-summary': 15000,
      'funding': 10000,
      'linkedin': 8000,
      'founders': 8000,
      'competitors': 12000,
      'crunchbase': 5000,
      'news': 10000,
      'social-media': 8000,
    }
  });
}