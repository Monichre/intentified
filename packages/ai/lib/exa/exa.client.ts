/* ------------------------------------------------------------------
 * Functional Exa client – no classes, no hidden state.
 * ------------------------------------------------------------------ */
import Exa from 'exa-js';
export type ExaSearchConfig = {
  category?: "company" | "research paper" | "news" | "pdf" | "github" | "tweet" | "personal site" | "linkedin profile" | "financial report";
  type?: "keyword" | "neural";
  text?: boolean;
  summary?: { query: string };
  numResults?: number;
  livecrawl?: "always" | "never";
  subpages?: number;
  subpageTarget?: string[];
  includeDomains?: string[];
  excludeDomains?: string[];
  includeText?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
};

export interface ExaService {
  search: (query: string, options?: ExaSearchConfig) => Promise<ResearchResponse>;
  searchAndContents: (
    query: string,
    options?: ExaSearchConfig
  ) => Promise<ResearchResponse>;
  getContents: (
    urls: string[],
    options?: ExaSearchConfig
  ) => Promise<ResearchResponse>;
}

/* ---- minimal slices of your ./types so this compiles stand-alone ---- */
export interface ResearchHit {
  title: string;
  url: string;
  text?: string;
  summary?: string;
  publishedDate?: string;
}
export interface ResearchResponse {
  results: ResearchHit[];
}

/* ------------------------------------------------------------------ *
 * Public factory – inject apiKey once, receive a fully typed client   *
 * ------------------------------------------------------------------ */
export const makeExaClient = (apiKey: string) => {
  const exaInstance = new Exa(apiKey);

  const search = async (query: string, options?: ExaSearchConfig): Promise<ResearchResponse> => {
    const result = await exaInstance.search(query, options as any);
    return {
      results: result.results.map((r: any) => ({
        url: r.url,
        title: r.title || '',
        text: r.text,
        summary: r.summary,
        publishedDate: r.publishedDate
      }))
    };
  };

  const searchAndContents = async (query: string, options?: ExaSearchConfig): Promise<ResearchResponse> => {
    const result = await exaInstance.searchAndContents(query, options as any);
    return {
      results: result.results.map((r: any) => ({
        url: r.url,
        title: r.title || '',
        text: r.text,
        summary: r.summary,
        publishedDate: r.publishedDate
      }))
    };
  };

  const getContents = async (urls: string[], options?: ExaSearchConfig): Promise<ResearchResponse> => {
    const result = await exaInstance.getContents(urls, options as any);
    return {
      results: result.results.map((r: any) => ({
        url: r.url,
        title: r.title || '',
        text: r.text,
        summary: r.summary,
        publishedDate: r.publishedDate
      }))
    };
  };

  const findSimilar = async ({websiteUrl}: {websiteUrl: string}) => {
    const result = await exaInstance.findSimilar(websiteUrl);
    return {
      results: result.results.map((r: any) => ({
        url: r.url,
        title: r.title || '',
      }))
    };
  }

    const findSimilarContent = async ({websiteUrl}: {websiteUrl: string}) => {
    const result = await exaInstance.findSimilarAndContents(websiteUrl);
    return {
      results: result.results.map((r: any) => ({
        url: r.url,
        title: r.title || '',
      }))
    };
  }

  const answer = async ({query}: {query: string}) => {
    const result = await exaInstance.answer(query);
    return result;
  }
  
  
  

  return { search, searchAndContents, getContents, findSimilar, findSimilarContent, answer };
};