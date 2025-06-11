// All enrichment types/schemas for re-use across pipeline

export interface CompetitorAnalysisRequest {
  websiteUrl: string;
  companyName?: string;
  industry?: string;
  focusAreas?: ('market-position' | 'strengths' | 'opportunities')[];
  skipScreenshot?: boolean;
}

export interface CompetitorAnalysisProgress {
  requestId: string;
  currentStep: number;
  totalSteps: number;
  currentType?: string;
  message: string;
  isComplete: boolean;
}

export interface CompetitorAnalysisResponse {
  websiteUrl: string;
  requestId: string;
  company: {
    name: string;
    summary: string;
    positioning: string;
    screenshot?: string;
  };
  competitiveLandscape: {
    directCompetitors: Array<{
      name: string;
      url: string;
      description: string;
      strengths: string[];
    }>;
    marketPosition: {
      rank: string;
      marketShare?: string;
      growthTrend?: string;
    };
    strengths: string[];
    opportunities: string[];
  };
  insights: {
    differentiators: string[];
    recommendations: string[];
    keyTakeaways: string[];
  };
  summary: {
    totalAnalyzed: number;
    successful: number;
    failed: number;
    totalDuration: number;
  };
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

export const ALL_ENRICHMENT_TYPES: EnrichmentType[] = [
  'basic-info',
  'company-summary', 
  'funding',
  'competitors',
  'mind-map',
  'linkedin',
  'founders',
  'crunchbase',
  'news',
  'financial-report',
  'github-url',
  'pitchbook',
  'tiktok',
  'tracxn',
  'wikipedia',
  'youtube-videos',
  'recent-tweets',
  'reddit',
  'twitter-profile',
  'website-sub-pages',
  'website-url',
  'youtube-video-details',
];

export interface EnrichmentRequest {
  websiteUrl: string;
  enrichmentTypes?: EnrichmentType[];
  requestId?: string;
}

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