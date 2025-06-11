import { tool } from "ai";
import { exaEnrichInputSchema } from "./schema/exa-research";
import { exaResearch as exaResearchFunction } from "../../integrations/exa/exa-research";
import { exaService } from "../../integrations/exa/exa";
import { z } from "zod"

 export const exaWebSearchTool = tool({
  description: 'Search the web for up-to-date information',
  parameters: z.object({
    query: z.string().min(1).max(100).describe('The search query'),
  }),
  execute: async ({ query }) => {
    const { results } = await EXA_CLIENT.searchAndContents(query, {
      livecrawl: 'always',
      numResults: 3,
    });
    return results.map(result => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000), // take just the first 1000 characters
      publishedDate: result.publishedDate,
    }));
  },
});



export const exaResearchTool = tool({
  description: `
    Specialized tool for company enrichment using Exa AI.
    
    This tool provides pre-configured searches for common company research tasks:
    - Company profiles (Crunchbase, Pitchbook, Tracxn)
    - Social media presence (LinkedIn, Twitter, TikTok, Reddit)
    - Financial information (funding, financial reports)
    - News and competitors
    - Website analysis and subpages
    
    Examples:
    1. Fetch company funding information:
       action: "fetchFunding"
       websiteParams: { websiteUrl: "https://openai.com" }
    
    2. Find competitors:
       action: "findCompetitors"
       competitorParams: { 
         websiteUrl: "https://openai.com",
         summaryText: "AI research company developing large language models"
       }
    
    3. Get LinkedIn profile:
       action: "scrapeLinkedin"
       profileParams: {
         profile: "Sam Altman",
         websiteUrl: "https://openai.com"
       }
  `,
  parameters: exaEnrichInputSchema,
  execute: async (input) => {
    try {
      // Create the enrichment research functions
      const exaResearch = exaResearchFunction(exaService);
      
      switch (input.action) {
        // Website-based actions
        case "fetchCrunchbase":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchCrunchbase(input.websiteParams);
          
        case "fetchFinancialReport":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchFinancialReport(input.websiteParams);
          
        case "fetchFounders":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchFounders(input.websiteParams);
          
        case "fetchFunding":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchFunding(input.websiteParams);
          
        case "fetchGithubUrl":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchGithubUrl(input.websiteParams);
          
        case "fetchPitchbook":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchPitchbook(input.websiteParams);
          
        case "fetchTiktok":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchTiktok(input.websiteParams);
          
        case "fetchTracxn":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchTracxn(input.websiteParams);
          
        case "fetchWikipedia":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchWikipedia(input.websiteParams);
          
        case "fetchYoutubeVideos":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.fetchYoutubeVideos(input.websiteParams);
          
        case "findNews":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.findNews(input.websiteParams);
          
        case "scrapeReddit":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.scrapeReddit(input.websiteParams);
          
        case "scrapeWebsiteSubPages":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.scrapeWebsiteSubPages(input.websiteParams);
          
        case "scrapeWebsiteUrl":
          if (!input.websiteParams) throw new Error("websiteParams required");
          return await exaResearch.scrapeWebsiteUrl(input.websiteParams);
          
        // Competitor search
        case "findCompetitors":
          if (!input.competitorParams) throw new Error("competitorParams required");
          return await exaResearch.findCompetitors(input.competitorParams);
          
        // Profile-based actions
        case "scrapeLinkedin":
          if (!input.profileParams) throw new Error("profileParams required");
          return await exaResearch.scrapeLinkedin(input.profileParams);
          
        case "scrapeRecentTweets":
          if (!input.profileParams) throw new Error("profileParams required");
          return await exaResearch.scrapeRecentTweets(input.profileParams);
          
        case "scrapeTwitterProfile":
          if (!input.profileParams) throw new Error("profileParams required");
          return await exaResearch.scrapeTwitterProfile(input.profileParams);
          
        // YouTube video details
        case "youtubeVideoDetails":
          if (!input.youtubeParams) throw new Error("youtubeParams required");
          return await exaResearch.youtubeVideoDetails(input.youtubeParams);
          
        default:
          throw new Error(`Unknown action: ${input.action}`);
      }
    } catch (error) {
      console.error("Exa enrichment tool error:", error);
      throw error;
    }
  },
});