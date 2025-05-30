/* ------------------------------------------------------------------
 * Functional Exa client – no classes, no hidden state.
 * ------------------------------------------------------------------ */
import Exa, { type ContentsOptions, type FindSimilarOptions, type RegularSearchOptions } from 'exa-js';
export type ExaSearchConfig = RegularSearchOptions & ContentsOptions & FindSimilarOptions & {
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
export interface ResearchHit   {
  title: string;
  url: string;
  text?: string;
  summary?: string;
  publishedDate?: string;
}
export type ResearchHitResponse = ResearchHit & any

export interface ResearchResponse {
  results: ResearchHitResponse[];
}

/* ------------------------------------------------------------------ *
 * Public factory – inject apiKey once, receive a fully typed client   *
 * ------------------------------------------------------------------ */
export const makeExaClient = (apiKey: string) => {
  const exaInstance = new Exa(apiKey);

  const search = async (query: string, options?: ExaSearchConfig): Promise<ResearchResponse> => {
    const {results} = await exaInstance.search(query, options as any);
    return {
      results
    };
  };

  const searchAndContents = async <T extends ContentsOptions>(query: string, options?: RegularSearchOptions & T): Promise<ResearchResponse> => {
    const {results} = await exaInstance.searchAndContents(query, options);
    console.log("🚀 ~ searchAndContents ~ results:", results)
    return {
      results
    };


  };

  const getContents = async (urls: string[], options?: ExaSearchConfig): Promise<ResearchResponse> => {
    const {results} = await exaInstance.getContents(urls, options as any);
    return {
      results
    };
  };

  const findSimilar = async ({websiteUrl}: {websiteUrl: string}) => {
    const {results} = await exaInstance.findSimilar(websiteUrl);
    return {
      results
    };
  }

    const findSimilarContent = async ({websiteUrl, options}: {websiteUrl: string, options?: FindSimilarOptions}) => {
       /**
     * Retrieves contents of documents based on URLs.
     * @param {string | string[] | SearchResult[]} urls - A URL or array of URLs, or an array of SearchResult objects.
     * @param {ContentsOptions} [options] - Additional options for retrieving document contents.
     * @returns {Promise<SearchResponse<T>>} A list of document contents for the requested URLs.
     */
    const {results} = await exaInstance.findSimilarAndContents(websiteUrl);
    return {
      results
    };
  }

  const answer = async ({query}: {query: string}) => {
    const result = await exaInstance.answer(query);
    return result;
  }
  
  
  

  return { search, searchAndContents, getContents, findSimilar, findSimilarContent, answer };
};