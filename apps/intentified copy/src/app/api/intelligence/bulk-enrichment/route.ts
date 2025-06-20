import { NextRequest, NextResponse } from 'next/server';
import { 
  makeCompanyEnrichmentService,
  EnrichmentType,
  BulkEnrichmentResponse
} from '@repo/ai';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

export const maxDuration = 100;

const schema = z.object({
  websiteUrl: z.string().url(),
  enrichmentTypes: z.array(z.string()).optional(),
});

// Schemas for enrichCompany and analyzeCompetitiveLandscape responses

const enrichCompanyResponseSchema = z.object({
  websiteUrl: z.string().url(),
  name: z.string().optional(),
  domain: z.string().optional(),
  summary: z.string().optional(),
  funding: z.object({
    total: z.string().optional(),
    rounds: z.array(
      z.object({
        date: z.string().optional(),
        amount: z.string().optional(),
        type: z.string().optional(),
        investors: z.array(z.string()).optional(),
      })
    ).optional(),
  }).optional(),
  linkedin: z.object({
    url: z.string().url().optional(),
    followers: z.number().optional(),
    description: z.string().optional(),
  }).optional(),
  founders: z.array(
    z.object({
      name: z.string().optional(),
      linkedin: z.string().url().optional(),
      title: z.string().optional(),
    })
  ).optional(),
  competitors: z.array(
    z.object({
      name: z.string().optional(),
      websiteUrl: z.string().url().optional(),
    })
  ).optional(),
  enrichmentTypes: z.array(z.string()).optional(),
});

const analyzeCompetitiveLandscapeResponseSchema = z.object({
  websiteUrl: z.string().url(),
  requestId: z.string(),
  company: z.object({
    name: z.string(),
    summary: z.string(),
    positioning: z.string(),
    screenshot: z.string().optional(),
  }),
  competitiveLandscape: z.object({
    directCompetitors: z.array(
      z.object({
        name: z.string(),
        url: z.string(),
        description: z.string(),
        strengths: z.array(z.string()),
      })
    ),
    marketPosition: z.object({
      rank: z.string(),
      marketShare: z.string().optional(),
      growthTrend: z.string().optional(),
    }),
    strengths: z.array(z.string()),
    opportunities: z.array(z.string()),
  }),
  insights: z.object({
    differentiators: z.array(z.string()),
    recommendations: z.array(z.string()),
    keyTakeaways: z.array(z.string()),
  }),
  summary: z.object({
    totalAnalyzed: z.number(),
    successful: z.number(),
    failed: z.number(),
    totalDuration: z.number(),
  }),
}).strict();


// Remove unused generateAnalysis function

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
    const {analyzeCompetitiveLandscape, enrichCompany} = makeCompanyEnrichmentService();
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
    const result: BulkEnrichmentResponse = await enrichCompany({
      websiteUrl,
      
    });

    console.log("🚀 ~ POST ~ result:", result)

    const competitiveAnalysis = await analyzeCompetitiveLandscape({
      websiteUrl,
      
    });

    console.log("🚀 ~ POST ~ competitiveAnalysis:", competitiveAnalysis)


    return NextResponse.json({
      success: true,
      data: {
        result,
        competitiveAnalysis
      },
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