import { createStreamableUI } from "ai/rsc";
import { fireCrawlExtraction } from "./firecrawl-tool";
import { serperSearch } from "./serper-tool";
import { tavilySearch } from "./tavily-tool";
import { competitiveAnalysisTool } from "./competitive-analysis-tool";
import { enrichCompanyDataTool } from "./enrich-company-data-tool";
import { enrichCompanySummaryTool } from "./enrich-company-summary-tool"
import { enrichCompetitorsTool } from "./enrich-competitors-tool"


export const rootTools = {
  tavilySearch,
  serperSearch,
  fireCrawlExtraction,
};

type Chunk = {
  uiStream: ReturnType<typeof createStreamableUI>;
};

export const toolContainer = (model: string, chunk: Chunk) => {
  return {
    tavilySearch, serperSearch, fireCrawlExtraction, competitiveAnalysisTool, enrichCompanyDataTool,  enrichCompanySummaryTool, enrichCompetitorsTool
  }
};


export type FunctionToolsName = keyof ReturnType<typeof toolContainer>