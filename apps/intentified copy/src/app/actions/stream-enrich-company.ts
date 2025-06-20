'use server';

import { createDataStreamResponse } from 'ai';
import { 
  enrichCompanySummary, 
  enrichCompetitors, 
  enrichMindMap,
  enrichCompanyBulk,
  getDefaultEnrichmentTypes 
} from '@repo/ai';
import type { 
  EnrichmentRequest, 
  EnrichmentProgress, 
  BulkEnrichmentResponse,
  EnrichmentType 
} from '@repo/ai';

export interface EnrichmentStreamUpdate {
  type: 'progress' | 'marketing' | 'result' | 'error';
  progress?: EnrichmentProgress;
  marketingIntelligence?: {
    phase: string;
    message: string;
    data?: any;
  };
  result?: BulkEnrichmentResponse;
  error?: string;
}

export async function streamCompanyEnrichment(request: {
  websiteUrl: string;
  enrichmentTypes?: EnrichmentType[];
  skipScreenshot?: boolean;
}) {
  "use server";
  
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        // Define marketing-focused enrichment types
        const marketingEnrichmentTypes = request.enrichmentTypes || getDefaultEnrichmentTypes('marketing');

        // Stream initial marketing phase
        dataStream.writeData({
          type: 'marketing',
          marketingIntelligence: {
            phase: 'Initializing',
            message: 'Starting company intelligence gathering...'
          }
        });

        // Use the bulk enrichment service with progress callback
        const result = await enrichCompanyBulk(
          {
            websiteUrl: request.websiteUrl,
            enrichmentTypes: marketingEnrichmentTypes,
            requestId: `marketing-${Date.now()}`,
          },
          (progress: EnrichmentProgress) => {
            // Stream progress updates
            dataStream.writeData({
              type: 'progress',
              progress
            });

            // Also stream marketing-specific insights based on progress
            const marketingPhase = getMarketingPhase(progress);
            if (marketingPhase) {
              dataStream.writeData({
                type: 'marketing',
                marketingIntelligence: marketingPhase
              });
            }
          }
        );

        // Stream final result
        dataStream.writeData({
          type: 'result',
          result
        });

        // Stream is complete by returning from the function
        return;
      } catch (error) {
        console.error('Enrichment stream error:', error);
        dataStream.writeData({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        // Stream is complete by returning from the function
        return;
      }
    },
    onError: (error) => error instanceof Error ? error.message : String(error),
  });
}

// Helper function to generate marketing-specific insights from progress
function getMarketingPhase(progress: EnrichmentProgress): {
  phase: string;
  message: string;
  data?: any;
} | null {
  const phaseMessages: Record<string, string> = {
    'basic-info': 'Analyzing company fundamentals and market presence...',
    'company-summary': 'Extracting key value propositions and positioning...',
    'competitors': 'Identifying competitive landscape and market dynamics...',
    'funding': 'Researching investment history and financial backing...',
    'news': 'Gathering latest market developments and PR insights...',
    'linkedin': 'Analyzing professional network and talent insights...',
    'founders': 'Researching leadership team and company vision...',
    'website-sub-pages': 'Deep-diving into product offerings and services...',
  };

  if (progress.currentType && phaseMessages[progress.currentType]) {
    return {
      phase: progress.currentType,
      message: phaseMessages[progress.currentType],
      data: {
        progress: Math.round((progress.currentStep / progress.totalSteps) * 100),
        completedTypes: progress.completedTypes,
      }
    };
  }

  return null;
}
