"use client";

import { useState } from "react";
import type { 
  CompetitorAnalysisRequest,
  CompetitorAnalysisResponse 
} from "../core/schemas/enrichment.schema";
import type { CompetitiveAnalysisStreamData } from "./stream-competitive-analysis";

interface CompetitiveAnalysisClientProps {
  request: CompetitorAnalysisRequest;
  onComplete?: (result: CompetitorAnalysisResponse) => void;
}

export function CompetitiveAnalysisClient({ 
  request, 
  onComplete 
}: CompetitiveAnalysisClientProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [result, setResult] = useState<CompetitorAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress([]);
    setCurrentPhase('');
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/ai/competitive-analysis/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Read the stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split on newlines (NDJSON format)
        let lines = buffer.split('\n');
        buffer = lines.pop()!; // Last line may be incomplete

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const data: CompetitiveAnalysisStreamData = JSON.parse(line);
            
            switch (data.type) {
              case 'phase':
                setCurrentPhase(data.phase);
                setProgress(prev => [...prev, data.message]);
                break;
                
              case 'progress':
                if ('message' in data && data.message) {
                  setProgress(prev => [...prev, data.message]);
                }
                if ('phase' in data && data.phase) {
                  setCurrentPhase(data.phase);
                }
                break;
                
              case 'result':
                setResult(data.data);
                onComplete?.(data.data);
                break;
                
              case 'error':
                setError(data.error);
                break;
            }
          } catch (parseError) {
            console.warn('Failed to parse stream data:', line, parseError);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Competitive Analysis</h3>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </div>

      {currentPhase && (
        <div className="text-sm text-gray-600">
          Current Phase: <span className="font-medium">{currentPhase}</span>
        </div>
      )}

      {progress.length > 0 && (
        <div className="border rounded p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Progress:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {progress.map((msg, i) => (
              <div key={i} className="text-sm text-gray-700">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-200 rounded p-4 bg-red-50">
          <h4 className="font-medium text-red-800 mb-2">Error:</h4>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="border border-green-200 rounded p-4 bg-green-50">
          <h4 className="font-medium text-green-800 mb-2">Analysis Complete!</h4>
          <details className="text-sm">
            <summary className="cursor-pointer">View Results</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}