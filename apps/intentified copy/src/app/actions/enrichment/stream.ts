'use server';

import { createDataStreamResponse } from 'ai';
import { enrichCompanyBulk } from '@repo/ai/services/enrichment/pure-services';
import type { EnrichmentRequest, EnrichmentProgress, BulkEnrichmentResponse } from '@repo/ai';

export async function streamEnrichment(request: EnrichmentRequest) {
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        // Stream initial status
        dataStream.writeData({ status: 'processing' });

        // Execute enrichment with progress callback
        const result = await enrichCompanyBulk(
          {
            ...request,
            requestId: request.requestId || `stream-${Date.now()}`,
          },
          (progress: EnrichmentProgress) => {
            dataStream.writeData({
              progress,
              status: 'processing',
            });
          }
        );

        // Stream the final result
        dataStream.writeData({
          result,
          status: 'completed',
        });
        dataStream.done();
      } catch (error) {
        console.error('Enrichment error:', error);
        dataStream.writeData({
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'error',
        });
        dataStream.done();
      }
    },
    onError: (error) => error instanceof Error ? error.message : String(error),
  });
}