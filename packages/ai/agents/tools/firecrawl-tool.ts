// Firecrawl Extraction Tool
// Provides web data extraction, crawling, and mapping by URL using the Firecrawl API. Handles errors and logs failures.

import { tool } from "ai";

import { firecrawlInputSchema } from "./schema/firecrawl";
import { fireCrawlClient, scrapeUrl, crawlUrl, mapUrl } from "../../integrations/firecrawl";
import type { ScrapeRequest, CrawlRequest, MapRequest } from "./types"


const TOOL_DESCRIPTION = `Web Data Extraction, Crawling, and Mapping by given Link or URL. Can display the result to user.`;

type FirecrawlToolArgs =
  | { action: "scrape"; scrapeOptions: ScrapeRequest }
  | { action: "crawl"; crawlOptions: CrawlRequest }
  | { action: "map"; mapOptions: MapRequest };

export const fireCrawlExtraction = tool({
  description: TOOL_DESCRIPTION,
  parameters: firecrawlInputSchema,
  execute: async (args: FirecrawlToolArgs) => {
    try {
      let contentResult;
      switch (args.action) {
        case "scrape":
          contentResult = await fireCrawlClient.scrapeUrl(args.scrapeOptions);
          break;
        case "crawl":
          contentResult = await fireCrawlClient.crawlUrl(args.crawlOptions);
          break;
        case "map":
          contentResult = await fireCrawlClient.mapUrl(args.mapOptions);
          break;
        default:
          
          return "Invalid Firecrawl action specified.";
      }
      if (!contentResult || (typeof contentResult === 'object' && contentResult.success === false)) {
        
        return "An error occurred or the operation did not return a value.";
      }
      return contentResult;
    } catch (error) {
      
      return "An unexpected error occurred during Firecrawl operation.";
    }
  },
});
