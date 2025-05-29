import type { CompanySummaryParams, CompanySummaryResult, CompanyMapParams, CompanyMindMap } from "../../lib/exa/types"
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
    // Write the enriched data to a JSON file in the current working directory.
    // This is for debugging or audit purposes.
    // Note: No import here, so use dynamic import for 'fs' and 'path'.
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const cwd = process.cwd();
      const fileName = `enriched-company-${Date.now()}.json`;
      const filePath = path.join(cwd, fileName);
      await fs.writeFile(filePath, JSON.stringify(enriched, null, 2), 'utf-8');
      console.log(`Enriched company data written to ${filePath}`);
    } catch (err) {
      console.error('Failed to write enriched company data to file:', err);
    }
    

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