import { tool } from "ai";
import { z } from "zod";
import { analyzeCompetitiveLandscape } from "../../services/pure-services";
import type { CompetitorAnalysisRequest } from "../../domains/enrichment/enrichment.service";

// Define the Zod schema for Competitive Analysis parameters
const competitiveAnalysisRequestSchema = z.object({
  companyName: z.string().describe("The target company name to analyze competitors for"),
  websiteUrl: z.string().url().describe("Company website URL for analysis"),
  industry: z.string().optional().describe("Optional industry specification to focus the analysis"),
  focusAreas: z.array(
    z.enum(['market-position', 'strengths', 'opportunities'])
  ).optional().describe("Specific areas to focus the competitive analysis on"),
  skipScreenshot: z.boolean().optional().default(false).describe("Skip website screenshot capture"),
});

// Define the response schema
const competitiveLandscapeResponseSchema = z.object({
  targetCompany: z.object({
    name: z.string(),
    website: z.string().optional(),
    industry: z.string().optional(),
    description: z.string().optional(),
  }),
  competitors: z.array(z.object({
    name: z.string(),
    website: z.string().optional(),
    description: z.string().optional(),
    fundingInfo: z.object({
      totalFunding: z.string().optional(),
      lastRound: z.string().optional(),
      investors: z.array(z.string()).optional(),
    }).optional(),
    marketPosition: z.string().optional(),
    keyDifferentiators: z.array(z.string()).optional(),
    similarityScore: z.number().min(0).max(1).optional(),
  })),
  marketAnalysis: z.object({
    marketSize: z.string().optional(),
    growthRate: z.string().optional(),
    keyTrends: z.array(z.string()).optional(),
    competitiveDynamics: z.string().optional(),
  }).optional(),
  positioningInsights: z.object({
    marketGaps: z.array(z.string()).optional(),
    competitiveAdvantages: z.array(z.string()).optional(),
    threats: z.array(z.string()).optional(),
    opportunities: z.array(z.string()).optional(),
  }).optional(),
  metadata: z.object({
    analysisDate: z.string(),
    dataSource: z.string(),
    confidence: z.number().min(0).max(1),
  }),
});

export const competitiveAnalysisTool = tool({
  description: `Performs comprehensive competitive landscape analysis for a company.
  
  This tool analyzes:
  - Direct and indirect competitors
  - Market positioning and share
  - Company strengths and opportunities
  - Strategic differentiators and recommendations
  - Key insights and takeaways
  
  The analysis combines multiple data sources including company websites, news, and market intelligence.`,
  
  parameters: competitiveAnalysisRequestSchema,
  
  execute: async (params) => {
    try {
      const { companyName, websiteUrl, industry, focusAreas, skipScreenshot } = params;

      // Create the request object matching the service interface
      const request: CompetitorAnalysisRequest = {
        websiteUrl,
        companyName,
        industry,
        focusAreas,
        skipScreenshot,
      };

      // Call the pure service function
      const result = await analyzeCompetitiveLandscape(request);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error in competitive analysis:", error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred during competitive analysis",
        companyName: params.companyName,
        websiteUrl: params.websiteUrl,
      };
    }
  },
});

// Export as both names for backward compatibility
export const competitiveLandscapeAnalysisTool = competitiveAnalysisTool;

// Export type definitions for use in other modules
export type CompetitiveLandscapeRequest = z.infer<typeof competitiveAnalysisRequestSchema>;
export type CompetitiveLandscapeResponse = z.infer<typeof competitiveLandscapeResponseSchema>; 