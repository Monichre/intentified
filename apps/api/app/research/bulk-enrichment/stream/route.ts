import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { makePersistedEnrichmentService } from "@repo/ai/services/enrichment";
import { supabase } from "@repo/db/src/supabase/server";
import { z } from "zod";
import { Tracer } from "@repo/observability";

const tracer = new Tracer("api-enrichment-stream");

// Request validation schema
const enrichmentRequestSchema = z.object({
  url: z.string().url(),
  skipScreenshot: z.boolean().optional(),
  enrichmentTypes: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  return tracer.trace("POST /api/research/bulk-enrichment/stream", async (span) => {
    try {
      // Authenticate user
      const { userId } = await auth();
      if (!userId) {
        return new Response("Unauthorized", { status: 401 });
      }

      // Parse and validate request
      const body = await request.json();
      const { url, skipScreenshot, enrichmentTypes } = enrichmentRequestSchema.parse(body);

      span.setAttributes({
        "user.id": userId,
        "enrichment.url": url,
        "enrichment.skipScreenshot": skipScreenshot ?? false,
        "enrichment.typesCount": enrichmentTypes?.length ?? 0,
      });

      // Create SSE response with proper headers
      const encoder = new TextEncoder();
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();

      // Helper to send SSE events
      const sendEvent = async (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        await writer.write(encoder.encode(message));
      };

      // Start enrichment process in background
      (async () => {
        try {
          // Send initial connection event
          await sendEvent("connected", { 
            message: "Stream connected", 
            timestamp: new Date().toISOString() 
          });

          const enrichmentService = makePersistedEnrichmentService({ supabase });
          
          // Run enrichment with progress callback
          const result = await enrichmentService.enrichCompanyWithPersistence({
            url,
            userId,
            skipScreenshot,
            enrichmentTypes,
            onProgress: async (progress) => {
              // Send progress update via SSE
              await sendEvent("progress", {
                requestId: progress.requestId,
                currentStep: progress.currentStep,
                totalSteps: progress.totalSteps,
                currentType: progress.currentType,
                completedTypes: progress.completedTypes,
                isComplete: progress.isComplete,
                percentage: Math.round((progress.currentStep / progress.totalSteps) * 100),
                timestamp: new Date().toISOString(),
              });
            },
          });

          // Send completion event with results
          await sendEvent("complete", {
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
          });

          // Send marketing intelligence status
          await sendEvent("marketing-intelligence", {
            status: "started",
            message: "Generating marketing intelligence in background",
            timestamp: new Date().toISOString(),
          });

        } catch (error: any) {
          console.error("Enrichment stream error:", error);
          
          // Send error event
          await sendEvent("error", {
            message: error.message || "An unexpected error occurred",
            timestamp: new Date().toISOString(),
          });
        } finally {
          // Close the stream
          await writer.close();
        }
      })();

      // Return SSE response
      return new Response(stream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      });
      
    } catch (error: any) {
      span.recordException(error);
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
  });
}