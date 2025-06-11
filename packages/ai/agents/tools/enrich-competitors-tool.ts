import { enrichCompanySummaryPureService } from "../../services/pure-services";
import { makeCompanyEnrichmentService } from "../../domains/enrichment/enrichment.service";
import type { EnrichmentType } from "../../domains/enrichment/types";
import { enrichCompanySummary, enrichMindMap } from "../../services/pure-services";
import { tool } from "ai";
import { z } from "zod";


const competitorsRequestSchema = z.object({
  websiteUrl: z.string().url().describe("The company website URL to find competitors for"),
  summaryText: z.string().optional().describe("Optional pre-computed company summary text to improve competitor identification"),
  requestId: z.string().optional().describe("Optional request ID for tracking"),
});

export const enrichCompetitorsTool = tool({
  description: `Identifies and analyzes competitor companies from a website URL.
  
  This tool finds and provides information about:
  - Direct competitors in the same market
  - Indirect competitors offering alternative solutions
  - Competitor names, descriptions, and websites
  - Relative positioning and differentiation
  
  Can use an optional company summary text to improve accuracy of competitor identification.`,
  
  parameters: competitorsRequestSchema,
  
  execute: async ({ websiteUrl, summaryText, requestId }) => {
    try {
      const result = await enrichCompetitors(
        {
          websiteUrl,
          requestId,
        },
        summaryText
      );
      
      return {
        success: true,
        type: 'competitors',
        data: result.data,
        duration: result.duration,
      };
    } catch (error) {
      return {
        success: false,
        type: 'competitors',
        error: error instanceof Error ? error.message : "Failed to enrich competitors",
      };
    }
  },
}); 