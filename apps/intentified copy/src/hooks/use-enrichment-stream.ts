"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  EnrichmentRequest,
  EnrichmentProgress,
  BulkEnrichmentResponse,
  EnrichmentType,
} from "@repo/ai";

import { streamCompanyEnrichment } from "@/app/actions/stream-enrich-company";
import type { StreamState } from "@/types/stream-types";

export interface MarketingIntelligenceProgress {
  currentStep: number;
  totalSteps: number;
  currentType?: string;
  message: string;
  isComplete: boolean;
}

export type EnrichmentStreamState = StreamState<
  EnrichmentProgress,
  BulkEnrichmentResponse,
  "progress" | "marketing-intelligence" | "complete" | "error"
> & {
  marketingProgress: MarketingIntelligenceProgress | null;
};

export interface EnrichmentStreamOptions {
  url: string;
  skipScreenshot?: boolean;
  enrichmentTypes?: EnrichmentType[];
  onProgress?: (progress: EnrichmentProgress) => void;
  onMarketingProgress?: (progress: MarketingIntelligenceProgress) => void;
  onComplete?: (result: BulkEnrichmentResponse) => void;
  onError?: (error: string) => void;
}

export type EnrichmentStreamUpdateType =
  | { type: "progress"; progress: EnrichmentProgress }
  | { type: "marketing"; marketingIntelligence: MarketingIntelligenceProgress }
  | { type: "result"; result: BulkEnrichmentResponse }
  | { type: "error"; error: string };

export function useEnrichmentStream() {
  const [state, setState] = useState<EnrichmentStreamState>({
    status: "idle",
    progress: null,
    marketingProgress: null,
    result: null,
    error: null,
    messages: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper: Async iterator for NDJSON/JSON lines from a Response
  async function* ndjsonStream(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.trim()) {
          try {
            yield JSON.parse(line);
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer);
      } catch (e) {}
    }
  }

  const connect = useCallback(async (options: EnrichmentStreamOptions) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState({
      status: "connecting",
      progress: null,
      marketingProgress: null,
      result: null,
      error: null,
      messages: [],
    });

    try {
      // Use the streaming API endpoint instead of server action
      const response = await fetch('/api/intelligence/enrich/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: options.url,
          skipScreenshot: options.skipScreenshot || true,
          enrichmentTypes: options.enrichmentTypes || [
            'basic-info',
            'company-summary', 
            'competitors',
            'funding',
            'news'
          ]
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setState((prev) => ({ ...prev, status: "connected" }));

      for await (const update of ndjsonStream(response)) {
        if (abortControllerRef.current?.signal.aborted) break;
        if (!update) continue;
        const timestamp = new Date().toISOString();
        switch (update.type) {
          case "progress":
            if (update.progress) {
              setState((prev) => ({
                ...prev,
                status: "processing",
                progress: update.progress ?? null,
                messages: [
                  ...prev.messages,
                  {
                    type: "progress" as const,
                    data: update.progress,
                    timestamp,
                  },
                ],
              }));
              options.onProgress?.(update.progress);
            }
            break;
          case "marketing":
            if (update.marketingIntelligence) {
              const marketingProgress: MarketingIntelligenceProgress = {
                currentStep: update.marketingIntelligence.currentStep ?? 1,
                totalSteps: update.marketingIntelligence.totalSteps ?? 1,
                currentType: update.marketingIntelligence.phase,
                message: update.marketingIntelligence.message,
                isComplete: update.marketingIntelligence.isComplete ?? false,
                ...update.marketingIntelligence.data,
              };
              setState((prev) => ({
                ...prev,
                marketingProgress: marketingProgress ?? null,
                messages: [
                  ...prev.messages,
                  {
                    type: "marketing-intelligence" as const,
                    data: marketingProgress,
                    timestamp,
                  },
                ],
              }));
              options.onMarketingProgress?.(marketingProgress);
            }
            break;
          case "result":
            if (update.result) {
              setState((prev) => ({
                ...prev,
                status: "completed",
                result: update.result ?? null,
                messages: [
                  ...prev.messages,
                  {
                    type: "complete" as const,
                    data: update.result,
                    timestamp,
                  },
                ],
              }));
              options.onComplete?.(update.result);
            }
            break;
          case "error":
            if (update.error) {
              setState((prev) => ({
                ...prev,
                status: "error",
                error: update.error ?? null,
                messages: [
                  ...prev.messages,
                  {
                    type: "error" as const,
                    data: { message: update.error },
                    timestamp,
                  },
                ],
              }));
              options.onError?.(update.error);
            }
            break;
        }
      }
      setState((prev) => {
        if (prev.status === "processing" || prev.status === "connected") {
          return { ...prev, status: "completed" };
        }
        return prev;
      });
    } catch (error: any) {
      // Don't log abort errors as they're expected when disconnecting
      if (error.name !== 'AbortError') {
        console.error("Enrichment stream error:", error);
      }
      
      // Only set error state if it's not an abort
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || "Failed to connect to enrichment stream";
        setState((prev) => ({
          ...prev,
          status: "error",
          error: errorMessage,
        }));
        options.onError?.(errorMessage);
      }
    } finally {
      setState((prev) => ({ ...prev, status: "disconnected" }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({ ...prev, status: "disconnected" }));
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    connect,
    disconnect,
    isConnected: state.status === "connected" || state.status === "processing",
    isProcessing: state.status === "processing",
    isCompleted: state.status === "completed",
    hasError: state.status === "error",
  };
}
