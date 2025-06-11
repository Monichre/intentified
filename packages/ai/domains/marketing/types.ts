/**
 * Type definitions for Marketing Intelligence domain
 * Based on NewCopy.ai analysis and brand analysis enrichment specs
 */

// Base Brand Analysis Types
export interface BrandAttributes {
  brandName: string;
  logo?: string;
  colorPalette: ColorPalette;
  brandValues: string[];
  missionStatement?: string;
  toneOfVoice: ToneAnalysis;
  socialPresence: SocialPresence;
}

export interface ColorPalette {
  primary: string;
  secondary: string[];
  accent: string[];
  dominant: string[];
}

export interface ToneAnalysis {
  formality: 'formal' | 'informal' | 'mixed';
  technicality: 'technical' | 'conversational' | 'mixed';
  mood: 'serious' | 'humorous' | 'balanced';
  passion: 'passionate' | 'matter-of-fact' | 'varied';
  confidence: number; // 0-1 scale
}

export interface SocialPresence {
  platforms: SocialPlatform[];
  overallEngagement: number;
  brandConsistency: number; // 0-1 scale
}

export interface SocialPlatform {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
  url: string;
  followers?: number;
  engagementRate?: number;
  lastActive?: Date;
}

// Brand Sentiment Analysis Types
export interface BrandSentimentAnalysis {
  overallSentiment: SentimentScore;
  sentimentBreakdown: SentimentDistribution;
  emotionalAssociations: EmotionalAssociation[];
  keyTopics: Topic[];
  sentimentOverTime: TimeSeriesData[];
  comparativeAnalysis: CompetitiveSentiment;
}

export interface SentimentScore {
  score: number; // -1 to 1
  confidence: number; // 0-1
  classification: 'positive' | 'negative' | 'neutral';
}

export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

export interface EmotionalAssociation {
  emotion: string;
  intensity: number; // 0-1
  frequency: number;
}

export interface Topic {
  name: string;
  relevance: number; // 0-1
  sentiment: SentimentScore;
  mentions: number;
}

export interface TimeSeriesData {
  date: Date;
  sentiment: SentimentScore;
  volume: number;
}

export interface CompetitiveSentiment {
  industryAverage: SentimentScore;
  competitors: CompetitorSentiment[];
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
}

export interface CompetitorSentiment {
  name: string;
  sentiment: SentimentScore;
  marketShare?: number;
}

// Brand Positioning Types
export interface BrandPositioningAnalysis {
  positioningMap: PositioningMap;
  keyDifferentiators: Differentiator[];
  competitorComparison: CompetitorComparison;
  marketGaps: MarketGap[];
  positioningRecommendations: Recommendation[];
}

export interface PositioningMap {
  dimensions: PositioningDimension[];
  brandPosition: Position;
  competitorPositions: CompetitorPosition[];
}

export interface PositioningDimension {
  name: string;
  lowLabel: string;
  highLabel: string;
  importance: number; // 0-1
}

export interface Position {
  x: number; // -1 to 1
  y: number; // -1 to 1
  dimensions: string[]; // which dimensions this represents
}

export interface CompetitorPosition {
  name: string;
  position: Position;
  marketShare?: number;
}

export interface Differentiator {
  factor: string;
  strength: number; // 0-1
  uniqueness: number; // 0-1
  marketValue: number; // 0-1
}

export interface CompetitorComparison {
  competitors: CompetitorProfile[];
  comparisonMatrix: ComparisonMetric[];
}

export interface CompetitorProfile {
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  targetAudience: string[];
}

export interface ComparisonMetric {
  metric: string;
  brandScore: number;
  competitorScores: Record<string, number>;
  importance: number;
}

export interface MarketGap {
  opportunity: string;
  size: number; // 0-1
  difficulty: number; // 0-1
  timeline: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number; // 0-1
  effort: number; // 0-1
  timeline: string;
  dependencies?: string[];
}

// SEO Analysis Types
export interface SEOAnalysis {
  overallScore: number; // 0-100
  pageAnalyses: Record<string, PageAnalysis>;
  technicalAnalysis: TechnicalAnalysis;
  keywordAnalysis: KeywordAnalysis;
  prioritizedRecommendations: SEORecommendation[];
}

export interface PageAnalysis {
  title: MetricScore;
  metaDescription: MetricScore;
  headings: MetricScore;
  content: MetricScore;
  images: MetricScore;
  internalLinks: MetricScore;
  externalLinks: MetricScore;
}

export interface MetricScore {
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
}

export interface TechnicalAnalysis {
  pageSpeed: PerformanceMetric;
  mobileFriendliness: MetricScore;
  indexability: MetricScore;
  ssl: MetricScore;
  robotsTxt: MetricScore;
  sitemap: MetricScore;
  structuredData: MetricScore;
}

export interface PerformanceMetric {
  score: number; // 0-100
  coreWebVitals: CoreWebVitals;
  issues: string[];
  opportunities: string[];
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
}

export interface KeywordAnalysis {
  targetKeywords: Keyword[];
  organicKeywords: Keyword[];
  keywordGaps: Keyword[];
  opportunities: KeywordOpportunity[];
}

export interface Keyword {
  term: string;
  volume: number;
  difficulty: number; // 0-100
  currentRank?: number;
  targetRank?: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
}

export interface KeywordOpportunity extends Keyword {
  potentialImpact: number; // 0-1
  effort: number; // 0-1
  timeToRank: number; // months
}

export interface SEORecommendation extends Recommendation {
  category: 'technical' | 'on-page' | 'content' | 'links';
  affectedPages: string[];
  implementationGuide: string;
}

// Content Analysis Types
export interface ContentAnalysis {
  structureAnalysis: ContentStructure;
  readabilityAnalysis: ReadabilityMetrics;
  toneAnalysis: ToneAnalysis;
  seoAnalysis: ContentSEO;
  improvementSuggestions: ContentSuggestions;
  contentScore: number; // 0-100
}

export interface ContentStructure {
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  headingStructure: HeadingHierarchy[];
  contentSections: ContentSection[];
}

export interface HeadingHierarchy {
  level: number; // 1-6
  text: string;
  position: number;
}

export interface ContentSection {
  title: string;
  wordCount: number;
  topics: string[];
}

export interface ReadabilityMetrics {
  scores: ReadabilityScores;
  summary: ReadabilitySummary;
}

export interface ReadabilityScores {
  fleschKincaid: number;
  smogIndex: number;
  colemanLiau: number;
  automatedReadability: number;
  daleChall: number;
}

export interface ReadabilitySummary {
  gradeLevel: number;
  readingTime: number; // minutes
  complexity: 'very-easy' | 'easy' | 'fairly-easy' | 'standard' | 'fairly-difficult' | 'difficult' | 'very-difficult';
  targetAudience: string;
}

export interface ContentSEO {
  keywordDensity: KeywordDensity[];
  potentialFocusKeywords: string[];
  internalLinkingOpportunities?: string[];
  contentCompleteness: number; // 0-1
}

export interface KeywordDensity {
  keyword: string;
  density: number; // 0-100
  frequency: number;
  optimal: boolean;
}

export interface ContentSuggestions {
  readability: string[];
  structure: string[];
  engagement: string[];
  seo: string[];
}

// API Integration Types
export interface EnrichmentProvider {
  name: string;
  endpoint: string;
  apiKey: string;
  rateLimit: RateLimit;
  cache: CacheConfig;
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export interface CacheConfig {
  ttl: number; // seconds
  keyPrefix: string;
}

// Third-party API response types
export interface ClearbitCompany {
  name: string;
  domain: string;
  sector: string;
  employees: number;
  annualRevenue: number;
  tech: string[];
  logoUrl: string;
  description: string;
  founded: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
}

export interface SimilarWebData {
  visits: number;
  bounceRate: number;
  avgVisitDuration: number;
  sources: TrafficSource[];
  geo: GeographicData[];
  categories: string[];
}

export interface TrafficSource {
  source: 'direct' | 'search' | 'social' | 'referral' | 'email' | 'display';
  percentage: number;
}

export interface GeographicData {
  country: string;
  percentage: number;
}

// Unified enrichment response
export interface CompanyEnrichment {
  company: ClearbitCompany;
  traffic: SimilarWebData;
  seo: SEOAnalysis;
  brand: BrandAttributes;
  sentiment: BrandSentimentAnalysis;
  positioning: BrandPositioningAnalysis;
  lastUpdated: Date;
  sources: string[];
}

// Service configuration
export interface MarketingIntelligenceConfig {
  providers: EnrichmentProvider[];
  defaultCacheTtl: number;
  maxConcurrentRequests: number;
  enableFallbacks: boolean;
  enableStreaming: boolean;
}

// Streaming types for real-time updates
export interface EnrichmentProgress {
  phase: 'starting' | 'scraping' | 'analyzing' | 'enriching' | 'finalizing' | 'complete';
  progress: number; // 0-100
  message: string;
  currentProvider?: string;
  estimatedTimeRemaining?: number; // seconds
}

export interface StreamingEnrichmentData {
  type: 'progress' | 'partial-result' | 'result' | 'error';
  data: EnrichmentProgress | Partial<CompanyEnrichment> | CompanyEnrichment | Error;
}