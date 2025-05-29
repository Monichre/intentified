import type { WebsiteResearchParams, CompetitorSearchParams, TwitterSearchParams } from "@/lib/exa/types"
import type {
  ResearchResponse,
  ExaService,
  ExaSearchConfig,
} from "./exa.client";


/* ------------------------------------------------------------------ *
 * Pure functional helpers – each curried with an Exa instance first  *
 * ------------------------------------------------------------------ */

const withDomain = (domains: string[]) =>
  ({ includeDomains: domains } as ExaSearchConfig);

const withoutDomain = (domains: string[]) =>
  ({ excludeDomains: domains } as ExaSearchConfig);

export const makeExaResearch = (exa: ExaService) => {
  /* shorthand wrappers */
  const S = (q: string, c?: ExaSearchConfig) => exa.search(q, c);
  const SC = (q: string, c?: ExaSearchConfig) => exa.searchAndContents(q, c);
  const G = (url: string, c?: ExaSearchConfig) => exa.getContents([url], c);

  /* reusable generator for “${site} profile” type look-ups */
  const profile =
    (domain: string, keyword: string) =>
    ({ websiteUrl }: WebsiteResearchParams) =>
      S(`${websiteUrl} ${keyword}:`, {
        type: "keyword",
        numResults: 1,
        ...withDomain([domain]),
        includeText: [websiteUrl],
      });

  /* ---------------- concrete exported queries ---------------- */
  const fetchCrunchbase = profile("crunchbase.com", "crunchbase page");
  const fetchFinancialReport = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} 10k financial report:`, {
      type: "keyword",
      category: "financial report",
      livecrawl: "always",
      text: true,
      includeText: [websiteUrl],
    });

  const fetchFounders = profile("linkedin.com", "founder's Linkedin page");
  const fetchFunding = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} Funding:`, {
      type: "keyword",
      numResults: 1,
      text: true,
      summary: {
        query:
          "Tell me all about the funding (and valuation if available) of this company. If none, reply “NO”.",
      },
      livecrawl: "always",
      includeText: [websiteUrl],
    });

  const fetchGithubUrl = profile("github.com", "Github");
  const fetchPitchbook = profile("pitchbook.com", "pitchbook profile");
  const fetchTiktok = profile("tiktok.com", "TikTok");
  const fetchTracxn = profile("tracxn.com", "tracxn profile");

  const fetchWikipedia = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} company wikipedia page:`, {
      ...withDomain(["wikipedia.org"]),
      type: "keyword",
      livecrawl: "always",
      text: true,
      numResults: 1,
      includeText: [websiteUrl],
    });

  const fetchYoutubeVideos = ({ websiteUrl }: WebsiteResearchParams) =>
    S(websiteUrl, {
      ...withDomain(["youtube.com"]),
      type: "keyword",
      numResults: 10,
      includeText: [websiteUrl],
    });

  const youtubeVideoDetails = ({ videoUrl }: { videoUrl: string }) =>
    SC(videoUrl, {
      ...withDomain(["youtube.com"]),
      type: "keyword",
      text: true,
      numResults: 1,
    });

  const scrapeWebsiteUrl = ({ websiteUrl }: WebsiteResearchParams) =>
    G(websiteUrl, {
      text: true,
      summary: {
        query:
          "Describe the company in few words (simple English, no name included).",
      },
    });

  const scrapeWebsiteSubPages = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(websiteUrl, {
      category: "company",
      type: "neural",
      text: true,
      numResults: 1,
      livecrawl: "always",
      subpages: 4,
      subpageTarget: ["about", "pricing", "faq", "blog"],
      ...withDomain([websiteUrl]),
    });

  const findCompetitors = ({
    websiteUrl,
    summaryText,
  }: CompetitorSearchParams) =>
    SC(summaryText, {
      type: "neural",
      useAutoprompt: true,
      text: true,
      summary: {
        query:
          "Explain in one-two short lines what this company does (very simple English).",
      },
      livecrawl: "always",
      ...withoutDomain([websiteUrl]),
    });

  const findNews = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} Latest News:`, {
      category: "news",
      type: "keyword",
      text: true,
      livecrawl: "always",
      includeText: [websiteUrl],
      numResults: 10,
    });

  const scrapeLinkedin = ({ websiteUrl }: WebsiteResearchParams) =>
    SC(`${websiteUrl} Linkedin profile:`, {
      type: "keyword",
      text: true,
      numResults: 1,
      livecrawl: "always",
    });

  const scrapeTwitterProfile = ({ username }: TwitterSearchParams) =>
    S(`${username} Twitter bio`, {
      type: "keyword",
      ...withDomain(["twitter.com"]),
      numResults: 1,
    });

  const scrapeRecentTweets = ({ username }: TwitterSearchParams) => {
    const now = new Date();
    const start = new Date(now.getTime() - 90 * 864e5).toISOString();
    const end = new Date(now.getTime() + 864e5).toISOString();
    return SC(`from:${username}`, {
      type: "keyword",
      livecrawl: "always",
      ...withDomain(["twitter.com"]),
      category: "tweet",
      startPublishedDate: start,
      endPublishedDate: end,
      includeText: [username],
    });
  };

  const scrapeReddit = ({ websiteUrl }: WebsiteResearchParams) =>
    S(websiteUrl, {
      ...withDomain(["reddit.com"]),
      type: "keyword",
      includeText: [websiteUrl],
    });



  return {
      fetchCrunchbase,
      fetchFinancialReport,
      fetchFounders,
      fetchFunding,
      fetchGithubUrl,
      fetchPitchbook,
      fetchTiktok,
      fetchTracxn,
      fetchWikipedia,
      fetchYoutubeVideos,
      youtubeVideoDetails,
      findCompetitors,
      findNews,
      scrapeLinkedin,
      scrapeRecentTweets,
      scrapeTwitterProfile,
      scrapeReddit,
      scrapeWebsiteSubPages,
      scrapeWebsiteUrl,
      // findSimilar,
      // findSimilarContent,
      // answer,
      // parallelProcess,
  };
};