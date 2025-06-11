"use server";

import { createDataStreamResponse } from "ai";
import { analyzeCompetitiveLandscape } from "../services/pure-services";
import type { 
  CompetitorAnalysisRequest, 
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse 
} from "../core/schemas/enrichment.schema";

/**
 * AI SDK 5 streaming server action for competitive analysis
 * Streams progress updates and final results using createDataStreamResponse
 */
export async function streamCompetitiveAnalysis(request: CompetitorAnalysisRequest) {
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        // Stream initialization
        dataStream.writeData({ 
          type: 'phase', 
          phase: 'initialization',
          message: 'Starting competitive analysis...',
          timestamp: new Date().toISOString()
        });

        let finalResult: CompetitorAnalysisResponse | null = null;

        // Run analysis with progress streaming
        finalResult = await analyzeCompetitiveLandscape(request, (progress: CompetitorAnalysisProgress) => {
          dataStream.writeData({ 
            type: 'progress', 
            ...progress,
            timestamp: new Date().toISOString()
          });
        });

        // Stream final result
        dataStream.writeData({ 
          type: 'result', 
          data: finalResult,
          timestamp: new Date().toISOString()
        });

        // Close the stream
        dataStream.done();

      } catch (error) {
        // Stream error and close
        dataStream.writeData({ 
          type: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date().toISOString()
        });
        dataStream.done();
      }
    },
    onError: (error) => error instanceof Error ? error.message : String(error),
  });
}

/**
 * Type definitions for streaming data
 */
export type CompetitiveAnalysisStreamData = 
  | { type: 'phase'; phase: string; message: string; timestamp: string }
  | { type: 'progress'; timestamp: string } & CompetitorAnalysisProgress
  | { type: 'result'; data: CompetitorAnalysisResponse; timestamp: string }
  | { type: 'error'; error: string; timestamp: string };