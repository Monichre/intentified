import { streamCompetitorAnalysis } from "@/app/actions/stream-competitor-analysis";
// import type { CompetitorAnalysisProgress, CompetitorAnalysisRequest, CompetitorAnalysisResponse } from '../../../../../packages/ai/core/schemas/enrichment.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("🚀 ~ POST ~ body:", body);

    if (!body.websiteUrl) {
      console.error("Missing websiteUrl in request:", body);
      return new Response(JSON.stringify({ error: "Website URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure the request matches the expected interface
    // CompetitorAnalysisRequest
    const competitorAnalysisRequest: any = {
      websiteUrl: body.websiteUrl,
      companyName: body.companyName || undefined,
      industry: body.industry || undefined,
      focusAreas: body.focusAreas || ['market-position', 'strengths', 'opportunities'],
      skipScreenshot: body.skipScreenshot || false,
    };

    console.log("🚀 ~ Sending to streamCompetitorAnalysis:", competitorAnalysisRequest);

    return streamCompetitorAnalysis(competitorAnalysisRequest);
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 