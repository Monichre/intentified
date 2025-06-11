
import { tool } from "ai";
import { z } from "zod";
import { makeCompanyEnrichmentService } from "../../domains/enrichment/enrichment.service";
import type { EnrichmentType } from "../../domains/enrichment/types";

// Define the Zod schema for EnrichmentRequest parameters
export const enrichmentRequestSchema = z.object({
  websiteUrl: z.string().url().describe("The target website URL to enrich data for"),
  enrichmentTypes: z.array(
    z.enum([
      'basic-info',
      'company-summary',
      'funding',
      'competitors',
      'mind-map',
      'linkedin',
      'founders',
      'crunchbase',
      'news',
      'financial-report',
      'github-url',
      'pitchbook',
      'tiktok',
      'tracxn',
      'wikipedia',
      'youtube-videos',
      'recent-tweets',
      'reddit',
      'twitter-profile',
      'website-sub-pages',
      'website-url',
      'youtube-video-details',
      'social-media'
    ] as const)
  ).optional().describe("Specific enrichment types to run. If not provided, all types will be run"),
  requestId: z.string().optional().describe("Optional request ID for tracking"),
});

export const enrichCompanyDataTool = tool({
  description: `Enriches company data from a website URL using multiple data sources and analysis techniques.
  
  This tool performs comprehensive company intelligence gathering including:
  - Basic company information and website analysis
  - Company summary and positioning
  - Funding and financial information
  - Competitor analysis
  - Leadership and founder information
  - News and social media presence
  - Market positioning and insights
  
  Returns a structured result with all gathered information organized by sections.`,
  
  parameters: enrichmentRequestSchema,
  
  execute: async ({ websiteUrl, enrichmentTypes, requestId }) => {
    try {
      // Use the factory service for full enrichment
      const enrichmentService = makeCompanyEnrichmentService();
      const result = await enrichmentService.enrichCompany({
        websiteUrl,
        enrichmentTypes: enrichmentTypes as EnrichmentType[],
        requestId,
      });
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred during enrichment",
      };
    }
  },
}); 