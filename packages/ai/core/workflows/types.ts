/**
 * Multi-Step Workflow Types
 * Type definitions for workflow orchestration and execution
 */

// Base workflow types
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  phase: string;
  dependencies?: string[];
  estimatedDuration?: number; // minutes
  required: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
}

export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
}

export interface WorkflowProgress {
  currentPhase: string;
  currentStep: string;
  overallProgress: number; // 0-100
  phaseProgress: number; // 0-100
  stepProgress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number; // minutes
}

export interface WorkflowResult<T = any> {
  workflowId: string;
  status: 'completed' | 'failed' | 'cancelled';
  phases: WorkflowPhase[];
  result?: T;
  error?: string;
  metadata: {
    startTime: Date;
    endTime?: Date;
    totalDuration?: number; // minutes
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
  };
}

export interface WorkflowExecutionOptions {
  workflowId: string;
  onProgress?: (progress: WorkflowProgress) => void;
  onPhaseComplete?: (phase: WorkflowPhase) => void;
  onStepComplete?: (step: WorkflowStep) => void;
  onError?: (error: Error, step?: WorkflowStep) => void;
  continueOnError?: boolean;
  maxRetries?: number;
  timeout?: number; // minutes
}

// Research and Report Generation Types
export interface ResearchReportOptions {
  industry: string;
  reportTitle?: string;
  targetAudience?: string;
  reportLength?: 'short' | 'medium' | 'comprehensive'; // 5-8, 10-15, 20+ pages
  includeCharts?: boolean;
  includeFinancials?: boolean;
  timeframe?: string; // e.g., "last 6 months", "2024"
}

export interface ResearchData {
  industryReports: IndustryReport[];
  newsArticles: NewsArticle[];
  companies: CompanyProfile[];
  marketData: MarketData;
  trends: IndustryTrend[];
}

export interface IndustryReport {
  title: string;
  source: string;
  url: string;
  publishDate: Date;
  summary: string;
  keyFindings: string[];
  relevanceScore: number; // 0-1
}

export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishDate: Date;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number; // 0-1
}

export interface CompanyProfile {
  name: string;
  marketCap?: number;
  revenue?: number;
  employees?: number;
  marketShare?: number;
  strengths: string[];
  weaknesses: string[];
  recentNews: string[];
}

export interface MarketData {
  marketSize: number;
  growthRate: number;
  projectedSize?: number;
  keySegments: MarketSegment[];
  geographicData: GeographicSegment[];
}

export interface MarketSegment {
  name: string;
  size: number;
  growthRate: number;
  keyPlayers: string[];
}

export interface GeographicSegment {
  region: string;
  marketShare: number;
  growthRate: number;
}

export interface IndustryTrend {
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeline: 'current' | 'emerging' | 'future';
  drivers: string[];
  implications: string[];
}

export interface ResearchReport {
  title: string;
  executiveSummary: string;
  industryOverview: string;
  competitiveLandscape: string;
  trendAnalysis: string;
  futureOutlook: string;
  recommendations: string[];
  methodology: string;
  references: string[];
  charts?: ChartData[];
  appendices?: string[];
}

export interface ChartData {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
  data: any;
  description: string;
}

// Event Planning Types
export interface EventPlanningOptions {
  eventType: string;
  numberOfAttendees: number;
  date: Date;
  budget: number;
  location: string;
  centralLocation?: string;
  foodPreferences?: string[];
  entertainmentPreferences?: string[];
  specialRequirements?: string[];
}

export interface VenueOption {
  name: string;
  location: string;
  capacity: number;
  cost: number;
  included: string[];
  amenities: string[];
  rating: number;
  reviews: string[];
  distance?: number; // from central location
  availability: boolean;
  contactInfo: ContactInfo;
}

export interface VendorOption {
  category: 'catering' | 'photography' | 'entertainment' | 'decorations' | 'other';
  name: string;
  services: string[];
  cost: number;
  rating: number;
  portfolio?: string[];
  contactInfo: ContactInfo;
  availability: boolean;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  website?: string;
}

export interface EventBudget {
  venue: number;
  catering: number;
  entertainment: number;
  decorations: number;
  staffing: number;
  marketing: number;
  contingency: number;
  total: number;
  breakdown: BudgetItem[];
}

export interface BudgetItem {
  category: string;
  description: string;
  cost: number;
  vendor?: string;
  notes?: string;
}

export interface EventTimeline {
  planningMilestones: TimelineItem[];
  dayOfSchedule: TimelineItem[];
  tasks: TaskItem[];
}

export interface TimelineItem {
  time: Date;
  description: string;
  duration?: number; // minutes
  responsible?: string;
  notes?: string;
}

export interface TaskItem {
  description: string;
  assignee: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dependencies?: string[];
}

export interface EventPlan {
  overview: {
    eventType: string;
    date: Date;
    attendees: number;
    budget: number;
    location: string;
  };
  selectedVenue: VenueOption;
  selectedVendors: VendorOption[];
  budget: EventBudget;
  timeline: EventTimeline;
  invitations: {
    template: string;
    distributionPlan: string;
    rsvpTracking: string;
  };
  contingencyPlans: string[];
  contactList: ContactInfo[];
}

// Website Migration Types
export interface WebsiteMigrationOptions {
  websiteUrl: string;
  currentPlatform: string;
  newPlatform: string;
  migrationScope: 'full' | 'content-only' | 'design-only' | 'custom';
  goLiveDate?: Date;
  backupRequired?: boolean;
  seoPreservation?: boolean;
}

export interface ContentAudit {
  pages: PageInventory[];
  mediaFiles: MediaFile[];
  forms: FormInventory[];
  integrations: Integration[];
  seoElements: SEOElements;
  totalItems: number;
}

export interface PageInventory {
  url: string;
  title: string;
  contentType: 'page' | 'post' | 'product' | 'category' | 'other';
  wordCount: number;
  lastModified: Date;
  seoScore?: number;
  priority: 'high' | 'medium' | 'low';
  migrationNotes?: string;
}

export interface MediaFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  usageCount: number;
  altText?: string;
  migrationStatus: 'pending' | 'migrated' | 'skipped';
}

export interface FormInventory {
  formId: string;
  name: string;
  fields: string[];
  submissions: number;
  integrations: string[];
  complexity: 'simple' | 'medium' | 'complex';
}

export interface Integration {
  name: string;
  type: 'analytics' | 'payment' | 'marketing' | 'social' | 'other';
  critical: boolean;
  migrationMethod: string;
  testingRequired: boolean;
}

export interface SEOElements {
  totalPages: number;
  metaTitles: number;
  metaDescriptions: number;
  altTexts: number;
  customUrls: number;
  redirectsNeeded: string[];
}

export interface MigrationPlan {
  overview: {
    sourceUrl: string;
    currentPlatform: string;
    targetPlatform: string;
    scope: string;
    timeline: Date[];
  };
  contentAudit: ContentAudit;
  technicalRequirements: TechnicalRequirement[];
  migrationTimeline: MigrationPhase[];
  testingPlan: TestCase[];
  launchStrategy: LaunchPlan;
  rollbackPlan: RollbackPlan;
}

export interface TechnicalRequirement {
  category: 'hosting' | 'database' | 'integrations' | 'performance' | 'security';
  requirement: string;
  priority: 'critical' | 'important' | 'nice-to-have';
  responsible: string;
  deadline: Date;
}

export interface MigrationPhase {
  name: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  dependencies: string[];
  risks: string[];
}

export interface TestCase {
  category: string;
  description: string;
  expectedResult: string;
  priority: 'critical' | 'important' | 'minor';
  status: 'pending' | 'passed' | 'failed';
}

export interface LaunchPlan {
  goLiveDate: Date;
  launchSteps: TimelineItem[];
  communicationPlan: string;
  monitoringPlan: string;
  successCriteria: string[];
}

export interface RollbackPlan {
  triggerConditions: string[];
  rollbackSteps: string[];
  timeToRollback: number; // minutes
  dataRecoveryPlan: string;
}

// Product Launch Campaign Types
export interface ProductLaunchOptions {
  productName: string;
  targetAudience: string;
  launchDate?: Date;
  budget?: number;
  launchType: 'soft' | 'full' | 'beta' | 'preview';
  channels?: string[];
  geographicScope?: 'local' | 'national' | 'global';
}

export interface LaunchResearch {
  audienceInsights: AudienceInsight[];
  competitorAnalysis: CompetitorLaunch[];
  influencers: Influencer[];
  mediaOutlets: MediaOutlet[];
  industryEvents: IndustryEvent[];
  marketTiming: MarketTiming;
}

export interface AudienceInsight {
  segment: string;
  demographics: Record<string, any>;
  preferences: string[];
  channels: string[];
  painPoints: string[];
  motivations: string[];
}

export interface CompetitorLaunch {
  company: string;
  product: string;
  launchDate: Date;
  strategy: string;
  channels: string[];
  results: string[];
  lessonsLearned: string[];
}

export interface Influencer {
  name: string;
  platform: string;
  followers: number;
  engagementRate: number;
  niche: string[];
  contactInfo: ContactInfo;
  rates?: number;
  previousWork?: string[];
}

export interface MediaOutlet {
  name: string;
  type: 'blog' | 'podcast' | 'publication' | 'tv' | 'radio';
  audience: string;
  reach: number;
  contactInfo: ContactInfo;
  submissionGuidelines?: string;
}

export interface IndustryEvent {
  name: string;
  date: Date;
  location: string;
  attendees: number;
  relevance: number; // 0-1
  opportunities: string[];
}

export interface MarketTiming {
  seasonality: string;
  competitorActivity: string;
  industryTrends: string[];
  optimalTiming: Date;
  risks: string[];
}

export interface LaunchStrategy {
  objectives: LaunchObjective[];
  messaging: LaunchMessaging;
  timeline: LaunchTimeline;
  budget: LaunchBudget;
  channels: LaunchChannel[];
}

export interface LaunchObjective {
  metric: string;
  target: number;
  timeframe: string;
  measurement: string;
}

export interface LaunchMessaging {
  valueProposition: string;
  keyMessages: string[];
  tagline?: string;
  campaignTheme: string;
  creativeGuidelines: string[];
}

export interface LaunchTimeline {
  prelaunch: TimelineItem[];
  launch: TimelineItem[];
  postlaunch: TimelineItem[];
}

export interface LaunchBudget {
  total: number;
  channels: Record<string, number>;
  activities: Record<string, number>;
  contingency: number;
}

export interface LaunchChannel {
  name: string;
  budget: number;
  tactics: string[];
  timeline: TimelineItem[];
  kpis: string[];
  responsible: string;
}

export interface LaunchCampaign {
  overview: {
    productName: string;
    launchDate: Date;
    targetAudience: string;
    budget: number;
  };
  research: LaunchResearch;
  strategy: LaunchStrategy;
  content: ContentPlan;
  execution: ExecutionPlan;
  measurement: MeasurementPlan;
}

export interface ContentPlan {
  landingPage: PageContent;
  socialMedia: SocialContent[];
  emailSequences: EmailContent[];
  pressKit: PressContent;
  videos: VideoContent[];
}

export interface PageContent {
  url: string;
  headline: string;
  subheadline: string;
  sections: PageSection[];
  cta: string;
  seoElements: SEOElements;
}

export interface PageSection {
  title: string;
  content: string;
  type: 'hero' | 'features' | 'benefits' | 'testimonials' | 'faq' | 'other';
}

export interface SocialContent {
  platform: string;
  posts: SocialPost[];
  schedule: Date[];
  hashtags: string[];
}

export interface SocialPost {
  content: string;
  media?: string[];
  postTime: Date;
  type: 'announcement' | 'behind-scenes' | 'user-generated' | 'educational';
}

export interface EmailContent {
  sequence: string;
  emails: EmailMessage[];
  segments: string[];
  timing: Date[];
}

export interface EmailMessage {
  subject: string;
  content: string;
  cta: string;
  personalization: string[];
}

export interface PressContent {
  pressRelease: string;
  factSheet: string;
  productImages: string[];
  executiveBios: string[];
  contactInfo: ContactInfo;
}

export interface VideoContent {
  title: string;
  type: 'product-demo' | 'testimonial' | 'behind-scenes' | 'explainer';
  duration: number;
  script: string;
  distribution: string[];
}

export interface ExecutionPlan {
  launchDay: LaunchDayPlan;
  influencerOutreach: InfluencerPlan;
  prActivities: PRPlan;
  paidAdvertising: AdPlan;
  partnerships: PartnershipPlan;
}

export interface LaunchDayPlan {
  checklist: string[];
  schedule: TimelineItem[];
  responsibilities: Record<string, string>;
  emergencyContacts: ContactInfo[];
}

export interface InfluencerPlan {
  targets: Influencer[];
  outreachMessages: string[];
  deliverables: string[];
  compensation: Record<string, number>;
}

export interface PRPlan {
  mediaList: MediaOutlet[];
  pitches: string[];
  pressRelease: string;
  timeline: TimelineItem[];
}

export interface AdPlan {
  platforms: string[];
  budgets: Record<string, number>;
  creatives: string[];
  targeting: Record<string, any>;
  schedule: TimelineItem[];
}

export interface PartnershipPlan {
  partners: string[];
  collaborations: string[];
  crossPromotions: string[];
  agreements: string[];
}

export interface MeasurementPlan {
  kpis: LaunchKPI[];
  trackingSetup: TrackingSetup[];
  dashboard: DashboardConfig;
  reporting: ReportingSchedule[];
}

export interface LaunchKPI {
  metric: string;
  target: number;
  current?: number;
  source: string;
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
}

export interface TrackingSetup {
  platform: string;
  events: string[];
  implementation: string;
  responsible: string;
}

export interface DashboardConfig {
  platform: string;
  widgets: string[];
  refreshRate: string;
  access: string[];
}

export interface ReportingSchedule {
  reportType: string;
  frequency: string;
  recipients: string[];
  deadline: string;
}