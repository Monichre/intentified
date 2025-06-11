import { tool } from "ai";
import { z } from "zod";

// import { enrichCompanySummary, enrichCompetitors, enrichMindMap } from "../../services/pure-services";

// import type { EnrichmentType } from "../../services/enrichment/types";
import { makeCompanyEnrichmentService } from "../../domains/enrichment"

const companySummaryRequestSchema = z.object({
  websiteUrl: z.string().url().describe("The company website URL to analyze and summarize"),
  requestId: z.string().optional().describe("Optional request ID for tracking"),
});

export const enrichCompanySummaryTool = tool({
  description: `Enriches company summary information from a website URL.
  
  This tool extracts and analyzes:
  - Company overview and description
  - Main products and services
  - Value propositions
  - Target market and customers
  - Company positioning
  - Website screenshot
  
  Returns a structured summary with key insights about the company.`,
  
  parameters: companySummaryRequestSchema,
  
  execute: async ({ websiteUrl, requestId }) => {
    try {
      const enrichmentService = makeCompanyEnrichmentService();
      const result = await enrichmentService.enrichCompany({
        websiteUrl,
        
        requestId,
      });

      console.log("🚀 ~ execute: ~ result:", result)

      
      return {
        success: true,
        type: 'company-summary',
        data: result.data,
        duration: result.duration,
      };
    } catch (error) {
      return {
        success: false,
        type: 'company-summary',
        error: error instanceof Error ? error.message : "Failed to enrich company summary",
      };
    }
  },
}); 