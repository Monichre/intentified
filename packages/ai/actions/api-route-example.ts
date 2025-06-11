// Example API route that would be placed in app/api/ai/competitive-analysis/stream/route.ts
// This shows how to integrate the streaming server action with a Next.js API route

import { streamCompetitiveAnalysis } from "../../../packages/ai/actions/stream-competitive-analysis";
import type { CompetitorAnalysisRequest } from "../../../packages/ai/core/schemas/enrichment.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the request (add proper validation in production)
    const request: CompetitorAnalysisRequest = {
      companyName: body.companyName,
      websiteUrl: body.websiteUrl,
      industry: body.industry,
      focusAreas: body.focusAreas,
      skipScreenshot: body.skipScreenshot ?? false,
    };

    // Return the streaming response directly
    return streamCompetitiveAnalysis(request);
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Example usage in a React Server Component or Client Component:
/*
import { CompetitiveAnalysisClient } from "@/packages/ai/actions/competitive-analysis-client";

export default function AnalysisPage() {
  const request = {
    companyName: "OpenAI",
    websiteUrl: "https://openai.com",
    industry: "AI/ML",
    focusAreas: ['market-position', 'strengths'],
    skipScreenshot: false
  };

  return (
    <div>
      <h1>Competitive Analysis</h1>
      <CompetitiveAnalysisClient 
        request={request}
        onComplete={(result) => {
          console.log('Analysis complete:', result);
        }}
      />
    </div>
  );
}
*/