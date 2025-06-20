"use client";

import { useState } from "react";
import { useCompetitorAnalysisStream } from "@/hooks/use-competitor-analysis-stream";
import type { CompetitorAnalysisRequest } from "@repo/ai";

export function CompetitorAnalysisExample() {
  const { isLoading, progress, result, error, analyze } =
    useCompetitorAnalysisStream();
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request: CompetitorAnalysisRequest = {
      websiteUrl: url,
      companyName: undefined, // Optional
      industry: undefined, // Optional
      focusAreas: ["market-position", "strengths", "opportunities"],
      skipScreenshot: false,
    };

    await analyze(request);
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter competitor website URL"
            className="flex-1 rounded-lg border px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      {/* Progress Display */}
      {progress && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold">Analysis Progress</h3>
          <p className="text-sm text-gray-600">
            Step {progress.currentStep} of {progress.totalSteps}
          </p>
          <p className="text-sm">{progress.message}</p>
          {progress.currentType && (
            <p className="mt-1 text-xs text-gray-500">
              Processing: {progress.currentType}
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          <h3 className="mb-1 font-semibold">Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="mb-2 font-semibold">Analysis Complete</h3>
            <p className="text-sm text-gray-600">
              Analyzed {result.summary.totalAnalyzed} competitors
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="mb-2 font-semibold">{result.company.name}</h4>
            <p className="mb-2 text-sm text-gray-600">
              {result.company.summary}
            </p>
            <p className="text-sm">{result.company.positioning}</p>
          </div>

          {result.competitiveLandscape.directCompetitors.length > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold">Direct Competitors</h4>
              <div className="space-y-2">
                {result.competitiveLandscape.directCompetitors.map(
                  (competitor, idx) => (
                    <div key={idx} className="rounded bg-gray-50 p-3">
                      <h5 className="font-medium">{competitor.name}</h5>
                      <p className="text-sm text-gray-600">
                        {competitor.description}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
