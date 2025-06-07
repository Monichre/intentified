import { tool } from "ai";
import { exaInputSchema } from "../lib/schema/exa";
import { exaService } from "../lib/exa/exa";

export const exaTool = tool({
  description: `
    Advanced web search and content extraction tool using Exa AI.
    
    Available actions:
    - search: Perform a web search with advanced filtering options
    - searchAndContents: Search and extract content from results in one operation
    - getContents: Extract content from specific URLs
    - findSimilar: Find pages similar to a given URL
    - findSimilarAndContents: Find similar pages and extract their content
    - answer: Get a direct answer to a question based on web search
    
    Search types:
    - keyword: Exact keyword matching
    - neural: Semantic/AI-powered search for better relevance
    
    Content options:
    - text: Extract full text content
    - summary: Generate AI summaries based on a query
    - highlights: Extract relevant snippets
    - livecrawl: Force fresh content retrieval
    - subpages: Crawl additional pages from each result
    
    Examples:
    1. Search for company information:
       action: "searchAndContents"
       query: "Apple Inc latest news"
       searchOptions: { type: "neural", category: "news", numResults: 5 }
       contentOptions: { text: true, summary: { query: "What are the key highlights?" } }
    
    2. Get content from specific URLs:
       action: "getContents"
       urls: ["https://example.com/page1", "https://example.com/page2"]
       contentOptions: { text: true }
    
    3. Find similar companies:
       action: "findSimilar"
       url: "https://openai.com"
       searchOptions: { numResults: 10 }
  `,
  parameters: exaInputSchema,
  execute: async (input) => {
    try {
      switch (input.action) {
        case "search":
          if (!input.searchOptions) {
            throw new Error("searchOptions required for search action");
          }
          return await exaService.search(input.searchOptions);

        case "searchAndContents":
          if (!input.searchAndContentsOptions) {
            throw new Error("searchAndContentsOptions required for searchAndContents action");
          }
          return await exaService.searchAndContents(input.searchAndContentsOptions);

        case "getContents":
          if (!input.getContentsOptions) {
            throw new Error("getContentsOptions required for getContents action");
          }
          return await exaService.getContents(input.getContentsOptions);

        case "findSimilar":
          if (!input.findSimilarOptions) {
            throw new Error("findSimilarOptions required for findSimilar action");
          }
          return await exaService.findSimilar(input.findSimilarOptions);

        case "findSimilarAndContents":
          if (!input.findSimilarAndContentsOptions) {
            throw new Error("findSimilarAndContentsOptions required for findSimilarAndContents action");
          }
          return await exaService.findSimilarAndContents(input.findSimilarAndContentsOptions);

        case "answer":
          if (!input.answerOptions) {
            throw new Error("answerOptions required for answer action");
          }
          const answer = await exaService.answer(input.answerOptions);
          return { answer };

        default:
          throw new Error(`Unknown action: ${input.action}`);
      }
    } catch (error) {
      console.error("Exa tool error:", error);
      throw error;
    }
  },
});