"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  CompetitorAnalysisRequest,
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse,
} from "@repo/ai";

// Import the server action function separately (now unused)
// import { streamCompetitorAnalysis } from "@/app/actions/stream-competitor-analysis";
// import type { CompetitorAnalysisStreamUpdate } from "@/app/actions/stream-competitor-analysis";
import type { StreamState } from "@/types/stream-types";

/* ------------------------------------------------------------------ *
 * Specialized Stream States                                          *
 * ------------------------------------------------------------------ */

export type CompetitorAnalysisStreamState = StreamState<
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse,
  "progress" | "result" | "error"
>;

export interface CompetitorAnalysisStreamOptions extends CompetitorAnalysisRequest {
  onProgress?: (progress: CompetitorAnalysisProgress) => void;
  onComplete?: (result: CompetitorAnalysisResponse) => void;
  onError?: (error: string) => void;
}

/* ------------------------------------------------------------------ *
 * Stream Update Types                                                *
 * ------------------------------------------------------------------ */

export type CompetitorAnalysisStreamUpdateType = {
  type: 'progress' | 'result' | 'error';
  progress?: CompetitorAnalysisProgress;
  result?: CompetitorAnalysisResponse;
  error?: string;
};

/* ------------------------------------------------------------------ *
 * Transformation Utilities                                           *
 * ------------------------------------------------------------------ */

function transformEnrichmentToCompetitorAnalysis(enrichmentResult: any): CompetitorAnalysisResponse {
  // Extract data from enrichment results
  const summaryResult = enrichmentResult.results?.find((r: any) => r.type === 'company-summary');
  const competitorsResult = enrichmentResult.results?.find((r: any) => r.type === 'competitors');
  const newsResult = enrichmentResult.results?.find((r: any) => r.type === 'news');
  
  // Transform to competitor analysis format
  return {
    websiteUrl: enrichmentResult.websiteUrl,
    requestId: enrichmentResult.requestId || `transformed-${Date.now()}`,
    company: {
      name: summaryResult?.data?.companyName || 'Unknown Company',
      summary: summaryResult?.data?.sections?.find((s: any) => s.header === 'Company Overview')?.text || 'No summary available',
      positioning: summaryResult?.data?.sections?.find((s: any) => s.header === 'Market Position')?.text || 'No positioning data available',
      screenshot: enrichmentResult.summary?.screenshot
    },
    competitiveLandscape: {
      directCompetitors: (competitorsResult?.data || []).slice(0, 5).map((comp: any) => ({
        name: comp.name || 'Unknown',
        url: comp.url || '',
        description: comp.description || '',
        strengths: comp.strengths || []
      })),
      marketPosition: {
        rank: 'Analyzing...',
        marketShare: undefined,
        growthTrend: undefined
      },
      strengths: summaryResult?.data?.sections?.find((s: any) => s.header === 'Strengths')?.text?.split(',') || [],
      opportunities: summaryResult?.data?.sections?.find((s: any) => s.header === 'Opportunities')?.text?.split(',') || []
    },
    insights: {
      differentiators: summaryResult?.data?.sections?.find((s: any) => s.header === 'Differentiators')?.text?.split(',') || [],
      recommendations: ['Leverage unique value propositions', 'Focus on market gaps', 'Strengthen competitive advantages'],
      keyTakeaways: summaryResult?.data?.sections?.map((s: any) => `${s.header}: ${s.text?.substring(0, 100)}...`) || []
    },
    summary: {
      totalAnalyzed: enrichmentResult.summary?.totalRequested || 0,
      successful: enrichmentResult.summary?.successful || 0,
      failed: enrichmentResult.summary?.failed || 0,
      totalDuration: enrichmentResult.summary?.totalDuration || 0
    }
  };
}

/* ------------------------------------------------------------------ *
 * Hook Implementation                                                *
 * ------------------------------------------------------------------ */

export function useCompetitorAnalysisStream() {
  const [state, setState] = useState<CompetitorAnalysisStreamState>({
    status: "idle",
    progress: null,
    result: null,
    error: null,
    messages: [],
  });

  // Store intermediate data/results
  const [intermediateData, setIntermediateData] = useState<{
    enrichmentResults?: any[];
    partialAnalysis?: any;
    progressHistory?: any[];
  }>({
    enrichmentResults: [],
    partialAnalysis: null,
    progressHistory: []
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

  const connect = useCallback(async (options: CompetitorAnalysisStreamOptions) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState({
      status: "connecting",
      progress: null,
      result: null,
      error: null,
      messages: [],
    });

    try {
      console.log('🚀 ~ Starting competitor analysis stream for:', options);
      
      // Use the competitor analysis streaming API endpoint
      const response = await fetch('/api/intelligence/competitor-analysis/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteUrl: options.websiteUrl,
          companyName: options.companyName,
          industry: options.industry,
          focusAreas: options.focusAreas,
          skipScreenshot: options.skipScreenshot || false
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setState((prev) => ({ ...prev, status: "connected" }));

      for await (const update of ndjsonStream(response)) {

        console.log("🚀 ~ Stream update received:", update)

        if (abortControllerRef.current?.signal.aborted) break;
        if (!update) continue;
        const timestamp = new Date().toISOString();
        switch (update.type) {
          case "progress":
          case "analysis":
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
              
              // Store progress in intermediate data
              setIntermediateData(prev => ({
                ...prev,
                progressHistory: [...(prev.progressHistory || []), {
                  ...update.progress,
                  timestamp
                }]
              }));
              
              options.onProgress?.(update.progress);
            }
            break;
            
          case "result":
            if (update.result) {
              // Combine final result with accumulated intermediate data
              const enhancedResult = {
                ...update.result,
                streamingData: {
                  enrichmentResults: intermediateData.enrichmentResults,
                  progressHistory: intermediateData.progressHistory,
                  partialAnalysis: intermediateData.partialAnalysis,
                  completedAt: timestamp
                }
              };

              setState((prev) => ({
                ...prev,
                status: "completed",
                result: enhancedResult,
                messages: [
                  ...prev.messages,
                  {
                    type: "result" as const,
                    data: enhancedResult,
                    timestamp,
                  },
                ],
              }));
              
              console.log('✅ Final result with streaming data:', enhancedResult);
              options.onComplete?.(enhancedResult);
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
            
          case "phase":
          case "enrichment":
          case "processing":
            if (update.phaseIntelligence || update.enrichmentProgress || update.enrichmentResult) {
              const phaseData = update.phaseIntelligence || update.enrichmentProgress;
              
              setState((prev) => ({
                ...prev,
                status: "processing",
                messages: [
                  ...prev.messages,
                  {
                    type: "progress" as const,
                    data: phaseData,
                    timestamp,
                  },
                ],
              }));

              // Store enrichment data as it comes in
              if (update.enrichmentResult) {
                setIntermediateData(prev => ({
                  ...prev,
                  enrichmentResults: [...(prev.enrichmentResults || []), {
                    ...update.enrichmentResult,
                    timestamp
                  }]
                }));
                
                console.log('📊 Enrichment data stored:', update.enrichmentResult);
              }

              // Store phase intelligence
              if (update.phaseIntelligence) {
                setIntermediateData(prev => ({
                  ...prev,
                  partialAnalysis: {
                    ...prev.partialAnalysis,
                    currentPhase: update.phaseIntelligence,
                    timestamp
                  }
                }));
                
                console.log('🔄 Phase update stored:', update.phaseIntelligence);
              }
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
        console.error("Competitor analysis stream error:", error);
      }
      
      // Only set error state if it's not an abort
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || "Failed to connect to competitor analysis stream";
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

