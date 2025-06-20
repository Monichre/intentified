"use client";

import { useState, useCallback } from "react";

export interface CompetitorAnalysisProgress {
  requestId: string;
  currentStep: number;
  totalSteps: number;
  currentType?: string;
  message: string;
  isComplete: boolean;
}

export interface CompetitorAnalysisResponse {
  websiteUrl: string;
  requestId: string;
  company: {
    name: string;
    summary: string;
    positioning: string;
    screenshot?: string;
  };
  competitiveLandscape: {
    directCompetitors: Array<{
      name: string;
      url: string;
      description: string;
      strengths: string[];
    }>;
    marketPosition: {
      rank: string;
      marketShare?: string;
      growthTrend?: string;
    };
    strengths: string[];
    opportunities: string[];
  };
  insights: {
    differentiators: string[];
    recommendations: string[];
    keyTakeaways: string[];
  };
  summary: {
    totalAnalyzed: number;
    successful: number;
    failed: number;
    totalDuration: number;
  };
}

export interface UseCompetitorAnalysisStreamProps {
  onProgress?: (progress: CompetitorAnalysisProgress) => void;
  onComplete?: (response: CompetitorAnalysisResponse) => void;
  onError?: (error: Error) => void;
}

export function useCompetitorAnalysisStream({
  onProgress,
  onComplete,
  onError,
}: UseCompetitorAnalysisStreamProps = {}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState<CompetitorAnalysisProgress | null>(null);
  const [response, setResponse] = useState<CompetitorAnalysisResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const startStream = useCallback(
    async (websiteUrl: string, companyName?: string, industry?: string) => {
      setIsStreaming(true);
      setError(null);
      setProgress(null);
      setResponse(null);

      try {
        const response = await fetch("/api/competitor-analysis/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            websiteUrl,
            companyName,
            industry,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "progress") {
                  const progressData = data.data as CompetitorAnalysisProgress;
                  setProgress(progressData);
                  onProgress?.(progressData);
                } else if (data.type === "complete") {
                  const responseData = data.data as CompetitorAnalysisResponse;
                  setResponse(responseData);
                  onComplete?.(responseData);
                } else if (data.type === "error") {
                  throw new Error(data.error);
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        onError?.(error);
      } finally {
        setIsStreaming(false);
      }
    },
    [onProgress, onComplete, onError],
  );

  return {
    startStream,
    isStreaming,
    progress,
    response,
    error,
  };
} 