'use server';

import { createDataStreamResponse } from 'ai';
import { 
  analyzeCompetitiveLandscape,
  enrichCompanyBulk,
  getDefaultEnrichmentTypes
} from '@repo/ai';
// import { makeCompanyEnrichmentService } from "@/services/enrichment/factory"
import type { 
  EnrichmentType,
  EnrichmentProgress,
  BulkEnrichmentResponse,
  CompetitorAnalysisProgress, 
  CompetitorAnalysisRequest, 
  CompetitorAnalysisResponse
} from "@repo/ai";

// Re-export types from the enrichment service for consistency


/*!SECTION
IMPORTANNT:
✻ Thinking…

  Great! Now I've changed the competitor analysis to use 'full' 
  enrichment instead of 'competitor'. This means it will now gather:

  Full enrichment includes:
  - 'basic-info', 'company-summary', 'funding', 'competitors', 
  'mind-map', 'linkedin', 'founders', 'crunchbase', 'news', 
  'website-sub-pages'

  This includes all the foundational data that the insights service 
  needs to generate proper summaries, which should resolve the 
  "Invalid request parameters" errors.

  The flow will now be:
  1. Phase 1: Initialization 
  2. Phase 2: Comprehensive company enrichment (full data gathering)
  3. Phase 3: Competitive landscape analysis (using the rich data from
   phase 2)

  This matches the user's intuition that the competitor analysis needs
   the full enrichment suite to run first before it can do meaningful 
  competitive analysis.

⏺ Perfect! Now the competitor analysis will use the full enrichment 
  suite first:

  ✅ Fixed Flow:

  Before (limited data):
  getDefaultEnrichmentTypes('competitor')
  // Only: basic-info, company-summary, competitors, mind-map, news, 
  website-sub-pages

  After (comprehensive data):
  getDefaultEnrichmentTypes('full')
  // Includes: basic-info, company-summary, funding, competitors, 
  mind-map, linkedin, founders, crunchbase, news, website-sub-pages

  Why This Fixes It:

  1. More Context: funding, linkedin, founders, crunchbase provide
  crucial context for insights generation
  2. Better Validation: The insights service gets enough data to
  create meaningful summaries instead of falling back to "not enough
  info"
  3. Richer Analysis: The competitive analysis phase gets
  comprehensive company data to work with

  New Flow:

  1. Phase 1: Initialization
  2. Phase 2: Comprehensive Company Enrichment (full data gathering)
  3. Phase 3: Competitive Analysis (using rich foundational data)

  This matches exactly what you suspected - the competitor analysis
  needs the full enrichment foundation first, just like
  stream-enrich-company.ts does, before it can perform meaningful
  competitive analysis.

  Test this now and the "Invalid request parameters" errors should be 
  resolved!
*/


export interface CompetitorAnalysisStreamUpdate {
  type: 'progress' | 'phase' | 'enrichment' | 'analysis' | 'processing' | 'result' | 'error';
  progress?: CompetitorAnalysisProgress;
  enrichmentProgress?: EnrichmentProgress;
  phaseIntelligence?: {
    phase: string;
    subPhase?: string;
    message: string;
    data?: any;
  };
  result?: CompetitorAnalysisResponse;
  enrichmentResult?: BulkEnrichmentResponse;
  error?: string;
}


export async function streamCompetitorAnalysis(
  request: CompetitorAnalysisRequest,
) {
  "use server";
  
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        // Validate request
        if (!request.websiteUrl) {
          throw new Error('Website URL is required');
        }
        
        console.log('🚀 ~ streamCompetitorAnalysis ~ request:', request);
      
        // Phase 1: Initial setup
        dataStream.writeData({
          type: 'phase',
          phaseIntelligence: {
            phase: 'Initializing',
            message: 'Starting comprehensive competitor intelligence gathering...',
            data: {
              totalPhases: 3,
              currentPhase: 0
            }
          }
        });

        // Phase 2: Comprehensive Analysis (One-Shot)
        dataStream.writeData({
          type: 'phase',
          phaseIntelligence: {
            phase: 'Analyzing',
            message: 'Running comprehensive competitive analysis...',
            data: {
              totalPhases: 2,
              currentPhase: 1
            }
          }
        });

        // Use the new one-shot approach with competitive-analysis enrichment type
        console.log('🚀 Getting FULL enrichment types including competitive-analysis...');
        const enrichmentTypes = getDefaultEnrichmentTypes('full') as EnrichmentType[];
        console.log('🚀 enrichmentTypes:', enrichmentTypes);

        const enrichmentResult = await enrichCompanyBulk(
          {
            websiteUrl: request.websiteUrl,
            enrichmentTypes,
            requestId: `competitor-analysis-${Date.now()}`,
          },
          (progress: EnrichmentProgress) => {
            console.log('🚀 ~ Progress callback called:', progress);
            
            // Stream enrichment progress with current data snapshot
            dataStream.writeData({
              type: 'enrichment',
              enrichmentProgress: JSON.parse(JSON.stringify(progress))
            });

            // Also stream phase-specific insights with partial data
            const enrichmentPhase = getEnrichmentPhase(progress);
            if (enrichmentPhase) {
              dataStream.writeData({
                type: 'phase',
                phaseIntelligence: {
                  phase: 'Analyzing',
                  subPhase: enrichmentPhase.phase,
                  message: enrichmentPhase.message,
                  data: {
                    ...enrichmentPhase.data,
                    totalPhases: 2,
                    currentPhase: 1
                  }
                }
              });
            }

            // Stream intermediate results as they become available
            // This allows frontend to show partial data and save intermediate state
            dataStream.writeData({
              type: 'progress',
              progress: {
                requestId: `competitor-analysis-${Date.now()}`,
                currentStep: progress.currentStep,
                totalSteps: progress.totalSteps,
                currentType: progress.currentType,
                completedTypes: progress.completedTypes,
                isComplete: progress.isComplete,
                message: `Completed ${progress.completedTypes.length}/${progress.totalSteps} enrichments`,
                timestamp: new Date().toISOString()
              }
            });
          }
        );

        // Log all enrichment results for debugging
        console.log('🚀 ~ Enrichment results:', enrichmentResult.results.map(r => ({ type: r.type, status: r.status })));
        
        // Extract competitive analysis result from enrichment
        const competitiveAnalysisResult = enrichmentResult.results.find(r => r.type === 'competitive-analysis');
        console.log('🚀 ~ competitiveAnalysisResult:', competitiveAnalysisResult);
        
        // Stream final phase
        dataStream.writeData({
          type: 'phase',
          phaseIntelligence: {
            phase: 'Complete',
            message: 'Competitive analysis complete!',
            data: {
              totalPhases: 2,
              currentPhase: 2,
              totalDuration: enrichmentResult.summary.totalDuration,
              enrichmentTypes: enrichmentResult.results.length
            }
          }
        });

        // Stream the enrichment result and competitive analysis result
        dataStream.writeData({
          type: 'enrichment',
          enrichmentResult: JSON.parse(JSON.stringify(enrichmentResult))
        });

        if (competitiveAnalysisResult && competitiveAnalysisResult.status === 'success') {
          console.log('🚀 ~ Streaming successful competitive analysis result');
          dataStream.writeData({
            type: 'result',
            result: JSON.parse(JSON.stringify(competitiveAnalysisResult.data))
          });
        } else {
          console.log('🚀 ~ Competitive analysis failed, streaming fallback result. Error:', competitiveAnalysisResult?.error);
          // Fallback: return enrichment summary as result
          dataStream.writeData({
            type: 'result',
            result: JSON.parse(JSON.stringify({
              websiteUrl: request.websiteUrl,
              requestId: enrichmentResult.requestId,
              enrichmentSummary: enrichmentResult.summary,
              competitiveAnalysisError: competitiveAnalysisResult?.error || 'Competitive analysis not completed',
              availableResults: enrichmentResult.results.map(r => ({ type: r.type, status: r.status }))
            }))
          });
        }

        // Stream is complete by returning from the function
        return;
        
      } catch (error) {
        console.error('🚨 streamCompetitorAnalysis error:', error);
        dataStream.writeData({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
        throw error;
      }
    },
    onError: (error) => error instanceof Error ? error.message : String(error),
  });
}

// Helper function to get enrichment phase details
function getEnrichmentPhase(progress: EnrichmentProgress): {
  phase: string;
  message: string;
  data?: any;
} | null {
  const phaseMessages: Record<string, string> = {
    'basic-info': 'Extracting fundamental company information...',
    'company-summary': 'Analyzing company positioning and value propositions...',
    'competitors': 'Identifying direct and indirect competitors...',
    'mind-map': 'Building comprehensive market intelligence map...',
    'news': 'Gathering recent market activities and announcements...',
    'website-sub-pages': 'Deep-diving into product and service offerings...',
    'competitive-analysis': 'Performing comprehensive competitive landscape analysis...',
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

// Helper function to get analysis phase details - FIXED
function getAnalysisPhase(progress: CompetitorAnalysisProgress): {
  phase: string;
  message: string;
  data?: any;
} | null {
  // Map actual progress messages to user-friendly messages
  const getPhaseInfo = (progressMessage: string): { phase: string; message: string } | null => {
    // Handle common progress messages
    if (progressMessage.includes('Initializing') || progressMessage.includes('Setting up')) {
      return {
        phase: 'Setup',
        message: 'Setting up competitive analysis framework...'
      };
    }
    
    if (progressMessage.includes('competitors') || progressMessage.includes('Analyzing')) {
      return {
        phase: 'Analysis',
        message: 'Deep-diving into competitor strategies...'
      };
    }
    
    if (progressMessage.includes('positioning') || progressMessage.includes('Market')) {
      return {
        phase: 'Positioning',
        message: 'Evaluating market positions and dynamics...'
      };
    }
    
    if (progressMessage.includes('insights') || progressMessage.includes('Generating')) {
      return {
        phase: 'Insights',
        message: 'Synthesizing competitive intelligence...'
      };
    }
    
    if (progressMessage.includes('Finalizing') || progressMessage.includes('Complete')) {
      return {
        phase: 'Finalizing',
        message: 'Completing competitive landscape analysis...'
      };
    }

    // Default fallback
    return {
      phase: progress.currentType || 'Analysis',
      message: progressMessage
    };
  };

  const phaseInfo = getPhaseInfo(progress.message);
  
  if (phaseInfo) {
    return {
      phase: phaseInfo.phase,
      message: phaseInfo.message,
      data: {
        step: progress.currentStep,
        totalSteps: progress.totalSteps,
      }
    };
  }

  return null;
}
