import type { CompanySummaryParams, CompanySummaryResult, CompanyMapParams, CompanyMindMap } from "../../agents/tools/exa/types"
import { generateCompanySummary, generateCompanyMindMap } from "../../lib/functions"
import { makeCompanyEnrichmentService } from "./enrichment.service"
import type { EnrichmentRequest } from "./types"

/* Convenience façade – thin wrapper to keep calling code tidy */
export const insights = {
  summary: (p: CompanySummaryParams): Promise<CompanySummaryResult> =>
    generateCompanySummary(p),
  mindMap: (p: CompanyMapParams): Promise<CompanyMindMap> =>
    generateCompanyMindMap(p),

};
export const enrichment = {
  enrichCompanyData: async (p: EnrichmentRequest): Promise<CompanySummaryResult> => {
    const {enrichCompany} = makeCompanyEnrichmentService();
    const enriched = await enrichCompany(p)

    console.log("🚀 ~ enriched:", enriched)

    // Fallback: convert all results to sections
    return {
      ...enriched,
      sections: enriched.results
        .map((result) => ({
          heading: result.type,
          status: result.status,
          text: JSON.stringify(result.data, null, 2),
          data: result.data
        }))
    };
  }
};