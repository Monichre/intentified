import { NextRequest } from "next/server";
import { createDataStreamResponse } from 'ai';
import { z } from "zod";
import { makeCompanyEnrichmentService } from '@repo/ai';

// Request validation schema
const enrichmentRequestSchema = z.object({
  url: z.string().url(),
  skipScreenshot: z.boolean().optional(),
  enrichmentTypes: z.array(z.string()).optional(),
});

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const { url, skipScreenshot, enrichmentTypes } = enrichmentRequestSchema.parse(body);

    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          // Initialize the enrichment service
          const enrichmentService = makeCompanyEnrichmentService();
          
          // Stream initialization
          dataStream.writeData({ 
            type: 'progress', 
            message: 'Starting company enrichment analysis...',
            phase: 'initialization'
          });

          // Run enrichment with progress streaming
          const result = await enrichmentService.enrichCompany(
            {
              websiteUrl: url,
              enrichmentTypes: enrichmentTypes || [
                'basic-info',
                'company-summary', 
                'competitors',
                'funding',
                'news'
              ],
              requestId: `stream-${Date.now()}`,
            },
            (progress) => {
              // Stream progress updates
              dataStream.writeData({ 
                type: 'progress', 
                ...progress,
                message: `Processing ${progress.currentType || 'data'}...`,
                phase: progress.currentType || 'processing'
              });
            }
          );

          // Stream final result
          dataStream.writeData({ 
            type: 'result', 
            result,
            message: 'Analysis complete!'
          });

        } catch (error) {
          console.error('Enrichment stream error:', error);
          dataStream.writeData({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            message: 'Analysis failed. Please try again.'
          });
        }
      },
      onError: (error) => error instanceof Error ? error.message : String(error),
    });
    
  } catch (error: any) {
    console.error("Enrichment stream setup error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to start enrichment stream" 
      }),
      { 
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}