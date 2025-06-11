import { enrichCompetitorsTool } from './enrich-competitors-tool'

// Enrichment and Analysis Tools
import { enrichCompanyDataTool } from './enrich-company-data-tool';
import { enrichCompanySummaryTool } from './enrich-company-summary-tool';



import { competitiveAnalysisTool, competitiveLandscapeAnalysisTool } from './competitive-analysis-tool';
import { exaResearchTool, } from './exa-research-tool';
import { exaTool } from './exa-tool';
import { tavilySearch } from './tavily-tool';
import { serperSearch } from './serper-tool';
import { fireCrawlExtraction } from './firecrawl-tool';
import { intelligenceEnrichmentTool } from './intelligence-enrichment-tool';

// Research and Search Tools
export { exaResearchTool } from './exa-research-tool'
export { exaTool } from './exa-tool'

export { intelligenceEnrichmentTool } from './intelligence-enrichment-tool';

// Legacy exports (may need refactoring)
export * from './root';

// Type exports for tool parameters and responses
export type { CompetitiveLandscapeRequest, CompetitiveLandscapeResponse } from './competitive-analysis-tool';

// Tool collections for easy agent setup
export const enrichmentTools = [
  enrichCompanyDataTool,
  enrichCompanySummaryTool,
  enrichCompetitorsTool,
  
  competitiveAnalysisTool,
];

export const researchTools = [
  exaResearchTool,
  exaTool,
  serperSearch,
  tavilySearch,
  fireCrawlExtraction,
  intelligenceEnrichmentTool,
];

export const allTools = [
  ...enrichmentTools,
  ...researchTools,
];

// Utility function to get tools by category
export const getToolsByCategory = (category: 'enrichment' | 'research' | 'all') => {
  switch (category) {
    case 'enrichment':
      return enrichmentTools;
    case 'research':
      return researchTools;
    case 'all':
    default:
      return allTools;
  }
}; 