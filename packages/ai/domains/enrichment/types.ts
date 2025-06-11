export interface EnrichmentRequest {
  websiteUrl: string;
  enrichmentTypes?: EnrichmentType[];
  requestId?: string;
}

export type EnrichmentType =
  | "basic-info"
  | "company-summary"
  | "funding"
  | "linkedin"
  | "founders"
  | "competitors"
  | "crunchbase"
  | "news"
  | "social-media"
  | "financial-report"
  | "github-url"
  | "pitchbook"
  | "tiktok"
  | "tracxn"
  | "wikipedia"
  | "youtube-videos"
  | "recent-tweets"
  | "reddit"
  | "twitter-profile"
  | "website-sub-pages"
  | "website-url"
  | "youtube-video-details"
  | "mind-map";
 

export interface EnrichmentResult {
  type: EnrichmentType;
  status: 'success' | 'error' | 'skipped';
  data?: any;
  error?: string;
  duration?: number;
}

export interface BulkEnrichmentResponse {
  websiteUrl: string;
  requestId: string;
  results: EnrichmentResult[];
  summary: {
    totalRequested: number;
    successful: number;
    failed: number;
    skipped: number;
    totalDuration: number;
  };
}

export interface EnrichmentProgress {
  requestId: string;
  currentStep: number;
  totalSteps: number;
  currentType?: EnrichmentType;
  completedTypes: EnrichmentType[];
  isComplete: boolean;
}

// Consolidated research types
export interface BaseResearchParams {
  websiteUrl: string;
}

export interface CompanySummaryParams extends BaseResearchParams {
  subpages: any;
  mainpage: any;
}

export interface CompetitorSearchParams extends BaseResearchParams {
  summaryText: string;
}

export interface TwitterSearchParams {
  username: string;
}

// Exa configuration
export interface ExaSearchConfig {
  type?: "keyword" | "neural";
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeText?: string[];
  category?: string;
  livecrawl?: string;
  text?: boolean;
  summary?: {
    query: string;
  };
  useAutoprompt?: boolean;
  subpages?: number;
  subpageTarget?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
}

// Research result types
export interface ResearchResult {
  url: string;
  title?: string;
  text?: string;
  summary?: string;
  score?: number;
  publishedDate?: string;
  author?: string;
}

export interface ResearchResponse {
  results: ResearchResult[];
}

// Company data types
export interface CompanySummarySection {
  heading: string;
  text: string;
}

export interface CompanySummaryResult {
  sections: CompanySummarySection[];
}

export interface FundingInfo {
  hasFunding: boolean;
  details?: string;
  summary?: string;
}

export interface FounderInfo {
  name?: string;
  linkedinUrl: string;
  title?: string;
}

export interface CompetitorInfo {
  name: string;
  description: string;
  website?: string;
  similarity?: number;
}

export interface LinkedInProfile {
  url: string;
  content: string;
  employeeCount?: string;
  industry?: string;
}



/**
 * Root payload for enriched company data.
 */
export interface EnrichedCompanyPayload {
  websiteUrl: string;
  requestId: string;
  results: EnrichedCompanyResult[];
  summary: EnrichedCompanySummary;
}

/**
 * Discriminated union for all possible result types.
 */
export type EnrichedCompanyResult =
  | BasicInfoResult
  | CompanySummaryResult
  | FundingResult
  | LinkedinResult
  | FoundersResult
  | CrunchbaseResult
  | NewsResult
  | FinancialReportResult
  | GithubUrlResult
  | PitchbookResult
  | TiktokResult
  | TracxnResult
  | WikipediaResult
  | YoutubeVideosResult
  | RecentTweetsResult
  | RedditResult
  | TwitterProfileResult
  | WebsiteSubPagesResult
  | WebsiteUrlResult
  | YoutubeVideoDetailsResult
  | CompetitorsResult
  | MindMapResult;

/** Common result fields */
interface BaseResult<T, K extends string> {
  type: K;
  status: "success" | "error";
  data: T;
  duration: number;
}

/** Basic Info */
export interface BasicInfoResult extends BaseResult<BasicInfoData, "basic-info"> {}
export interface BasicInfoData {
  results: Array<{
    url: string;
    title: string;
    text: string;
    summary: string;
    publishedDate: string;
  }>;
}

/** Company Summary */
export interface CompanySummaryResult extends BaseResult<CompanySummaryData, "company-summary"> {}
export interface CompanySummaryData {
  sections: Array<{
    heading: string;
    text: string;
  }>;
}

/** Funding */
export interface FundingResult extends BaseResult<FundingData, "funding"> {}
export interface FundingData {
  results: unknown[];
}

/** Linkedin */
export interface LinkedinResult extends BaseResult<LinkedinData, "linkedin"> {}
export interface LinkedinData {
  results: Array<{
    url: string;
    title: string;
    text: string;
    publishedDate: string;
  }>;
}

/** Founders */
export interface FoundersResult extends BaseResult<FoundersData, "founders"> {}
export interface FoundersData {
  results: unknown[];
}

/** Crunchbase */
export interface CrunchbaseResult extends BaseResult<CrunchbaseData, "crunchbase"> {}
export interface CrunchbaseData {
  results: unknown[];
}

/** News */
export interface NewsResult extends BaseResult<NewsData, "news"> {}
export interface NewsData {
  results: unknown[];
}

/** Financial Report */
export interface FinancialReportResult extends BaseResult<FinancialReportData, "financial-report"> {}
export interface FinancialReportData {
  results: unknown[];
}

/** Github URL */
export interface GithubUrlResult extends BaseResult<GithubUrlData, "github-url"> {}
export interface GithubUrlData {
  results: unknown[];
}

/** Pitchbook */
export interface PitchbookResult extends BaseResult<PitchbookData, "pitchbook"> {}
export interface PitchbookData {
  results: unknown[];
}

/** Tiktok */
export interface TiktokResult extends BaseResult<TiktokData, "tiktok"> {}
export interface TiktokData {
  results: unknown[];
}

/** Tracxn */
export interface TracxnResult extends BaseResult<TracxnData, "tracxn"> {}
export interface TracxnData {
  results: unknown[];
}

/** Wikipedia */
export interface WikipediaResult extends BaseResult<WikipediaData, "wikipedia"> {}
export interface WikipediaData {
  results: unknown[];
}

/** Youtube Videos */
export interface YoutubeVideosResult extends BaseResult<YoutubeVideosData, "youtube-videos"> {}
export interface YoutubeVideosData {
  results: unknown[];
}

/** Recent Tweets (error) */
export interface RecentTweetsResult extends BaseResult<RecentTweetsData, "recent-tweets"> {}
export interface RecentTweetsData {
  error: string;
}

/** Reddit */
export interface RedditResult extends BaseResult<RedditData, "reddit"> {}
export interface RedditData {
  results: unknown[];
}

/** Twitter Profile (error) */
export interface TwitterProfileResult extends BaseResult<TwitterProfileData, "twitter-profile"> {}
export interface TwitterProfileData {
  error: string;
}

/** Website Sub Pages */
export interface WebsiteSubPagesResult extends BaseResult<WebsiteSubPagesData, "website-sub-pages"> {}
export interface WebsiteSubPagesData {
  results: unknown[];
}

/** Website URL */
export interface WebsiteUrlResult extends BaseResult<WebsiteUrlData, "website-url"> {}
export interface WebsiteUrlData {
  results: Array<{
    url: string;
    title: string;
    text: string;
    summary: string;
    publishedDate: string;
  }>;
}

/** Youtube Video Details (error) */
export interface YoutubeVideoDetailsResult extends BaseResult<YoutubeVideoDetailsData, "youtube-video-details"> {}
export interface YoutubeVideoDetailsData {
  error: string;
}

/** Competitors */
export interface CompetitorsResult extends BaseResult<CompetitorsData, "competitors"> {}
export interface CompetitorsData {
  results: Array<{
    url: string;
    title: string;
    text: string;
    summary: string;
    publishedDate: string;
  }>;
}

/** Mind Map */
export interface MindMapResult extends BaseResult<MindMapData, "mind-map"> {}
export interface MindMapData {
  companyName: string;
  rootNode: MindMapNode;
}
export interface MindMapNode {
  title: string;
  description?: string;
  children?: MindMapNode[];
}

/** Summary object at the root */
export interface EnrichedCompanySummary {
  totalRequested: number;
  successful: number;
  failed: number;
  skipped: number;
  totalDuration: number;
}