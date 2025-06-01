// This is a TypeScript file that defines types for the database schema

// Enum types
type DocumentStatus = "pending" | "processing" | "completed" | "error";
type FileType = "pdf" | "docx" | "csv" | "txt" | "xlsx";
type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";

// Schema types
export type CSVFile = {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "processing" | "completed" | "error";
  totalRows: number;
  validRows: number;
  invalidRows: number;
};

export type CSVRow = {
  id: string;
  fileId: string;
  rowData: Record<string, any>;
  rowIndex: number;
  isValid: boolean;
  errors: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Company = {
  id: string;
  clerk_user_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: CompanySize | null;
  social_links: Record<string, any>;
  keywords: string[];
  competitors: string[];
  created_at: Date;
  updated_at: Date;
};

export type CompanyBrandHistory = {
  id: string;
  company_profile_id: string | null;
  brand_analysis: Record<string, any>;
  analysis_version: number;
  changes_detected: Record<string, any>;
  confidence_score: number | null;
  source_data_hash: string | null;
  analyzed_at: Date;
  created_at: Date;
};

export type CompanyDocument = {
  id: string;
  company_profile_id: string | null;
  user_id: string | null;
  title: string;
  description: string | null;
  document_type: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  storage_path: string;
  storage_bucket: string;
  processing_status: string;
  extracted_text: string | null;
  summary: string | null;
  tags: string[] | null;
  ai_analysis: Record<string, any>;
  sentiment_score: number | null;
  key_topics: string[] | null;
  visibility: string;
  access_permissions: Record<string, any>;
  uploaded_at: Date;
  processed_at: Date | null;
  last_accessed_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type CompanyEnrichment = {
  id: string;
  company_id: string | null;
  description: string | null;
  category: string | null;
  summary_sections: Record<string, any> | null;
  funding_status: string | null;
  total_funding: number | null;
  last_funding_date: Date | null;
  funding_rounds: Record<string, any> | null;
  linkedin_url: string | null;
  linkedin_employee_count: number | null;
  linkedin_followers: number | null;
  founders: Record<string, any>[];
  enriched_competitors: Record<string, any>[];
  company_intelligence: string | null;
  market_position: string | null;
  growth_indicators: Record<string, any> | null;
  seo_analysis_completed: boolean;
  seo_analysis_timestamp: Date | null;
  seo_analysis_data: Record<string, any> | null;
  enrichment_source: string | null;
  enrichment_timestamp: Date;
  raw_enrichment_data: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
};

export type CompanyInsight = {
  id: string;
  company_profile_id: string | null;
  insight_type: string;
  title: string;
  description: string | null;
  confidence_score: number | null;
  insight_data: Record<string, any>;
  source_references: Record<string, any>[];
  category: string | null;
  priority: string;
  tags: string[] | null;
  validated_by: string | null;
  validated_at: Date | null;
  validation_notes: string | null;
  generated_at: Date;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type CompanyMarketingCampaign = {
  id: string;
  company_profile_id: string | null;
  user_id: string | null;
  campaign_name: string | null;
  description: string | null;
  status: string;
  brand_analysis: Record<string, any>;
  email_templates: Record<string, any>[];
  total_templates: number;
  generated_at: Date;
  processing_time: number | null;
  error_message: string | null;
  templates_used: number;
  total_sends: number;
  total_opens: number;
  total_clicks: number;
  created_at: Date;
  updated_at: Date;
};

export type CompanyProfile = {
  id: string;
  website_url: string;
  last_enriched_at: Date | null;
  enrichment_data: Record<string, any>;
  social_links: Record<string, any>;
  created_at: Date;
  updated_at: Date;
};

export type CompanySocialContent = {
  id: string;
  social_profile_id: string | null;
  platform_post_id: string;
  post_type: string;
  content_text: string | null;
  media_urls: string[] | null;
  post_url: string | null;
  likes_count: number;
  shares_count: number;
  comments_count: number;
  views_count: number;
  sentiment_score: number | null;
  engagement_rate: number | null;
  topics: string[] | null;
  mentions: string[] | null;
  hashtags: string[] | null;
  posted_at: Date;
  scraped_at: Date;
  created_at: Date;
};

export type CompanySocialProfile = {
  id: string;
  company_profile_id: string | null;
  platform: string;
  profile_url: string;
  username: string | null;
  handle: string | null;
  verified: boolean;
  follower_count: number | null;
  following_count: number | null;
  post_count: number | null;
  bio: string | null;
  profile_image_url: string | null;
  last_scraped_at: Date;
  is_active: boolean;
  scraped_data: Record<string, any>;
  created_at: Date;
  updated_at: Date;
};

export type DocProcessorDocumentChunk = {
  id: string;
  document_id: string | null;
  chunk_index: number;
  content: string;
  token_count: number;
  embedding: any; // Vector type
  created_at: Date;
  page_number: number | null;
  heading: string | null;
};

export type DocProcessorDocumentEntity = {
  id: string;
  document_id: string | null;
  entity_type: string;
  entity_text: string;
  metadata: Record<string, any> | null;
  created_at: Date;
};

export type DocProcessorDocument = {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: FileType;
  file_size: number;
  mime_type: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
  processed_at: Date | null;
  user_id: string | null;
  page_count: number | null;
  word_count: number | null;
  language: string | null;
  summary: string | null;
  keywords: string[] | null;
  analysis: Record<string, any> | null;
  file_hash: string | null;
  extracted_text: string | null;
  metadata: Record<string, any> | null;
};

export type DocProcessorProcessingTask = {
  id: string;
  document_id: string | null;
  task_type: string;
  status: DocumentStatus;
  error_message: string | null;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any> | null;
};

export type EmailCampaignPerformance = {
  id: string;
  campaign_id: string | null;
  period_start: Date;
  period_end: Date;
  period_type: string;
  emails_sent: number;
  emails_delivered: number;
  emails_opened: number;
  emails_clicked: number;
  emails_bounced: number;
  emails_complained: number;
  emails_unsubscribed: number;
  delivery_rate: number | null;
  open_rate: number | null;
  click_rate: number | null;
  click_to_open_rate: number | null;
  bounce_rate: number | null;
  complaint_rate: number | null;
  unsubscribe_rate: number | null;
  total_revenue: number | null;
  revenue_per_email: number | null;
  template_performance: Record<string, any>;
  calculated_at: Date;
  created_at: Date;
};

export type EmailTemplateUsage = {
  id: string;
  campaign_id: string | null;
  user_id: string | null;
  template_id: string;
  template_name: string;
  template_purpose: string;
  template_theme: string;
  recipient_email: string | null;
  recipient_name: string | null;
  recipient_company: string | null;
  personalization_data: Record<string, any>;
  email_service_provider: string | null;
  email_service_id: string | null;
  sent_at: Date | null;
  opened_at: Date | null;
  first_click_at: Date | null;
  total_clicks: number;
  bounced: boolean;
  complained: boolean;
  unsubscribed: boolean;
  ab_test_variant: string | null;
  ab_test_group: string | null;
  created_at: Date;
  updated_at: Date;
};

export type EnrichmentRequest = {
  id: string;
  user_id: string | null;
  website_url: string;
  enrichment_types: string[];
  status: string;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
  total_duration: number | null;
  total_requested: number;
  successful: number;
  failed: number;
  skipped: number;
};

export type EnrichmentResult = {
  id: string;
  request_id: string | null;
  type: string;
  status: string;
  data: Record<string, any> | null;
  error_message: string | null;
  duration: number | null;
  created_at: Date;
};

export type MarketingAutomationWorkflow = {
  id: string;
  company_profile_id: string | null;
  user_id: string | null;
  name: string;
  description: string | null;
  status: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  workflow_steps: Record<string, any>[];
  current_step: number;
  email_templates: Record<string, any>[];
  total_enrollments: number;
  active_enrollments: number;
  completed_enrollments: number;
  created_at: Date;
  updated_at: Date;
  last_triggered_at: Date | null;
};

export type OnboardingProgress = {
  id: string;
  company_id: string | null;
  clerk_user_id: string;
  onboarding_completed: boolean;
  onboarding_completed_at: Date | null;
  current_step: string | null;
  completed_steps: string[];
  form_data_snapshot: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
};

export type UserGoal = {
  id: string;
  company_id: string | null;
  clerk_user_id: string;
  goals: string[];
  created_at: Date;
  updated_at: Date;
};

export type User = {
  id: number;
  created_at: Date;
  clerk_id: string;
  email: string;
  name: string | null;
  role: string;
};

export type WorkflowEnrollment = {
  id: string;
  workflow_id: string | null;
  contact_email: string;
  contact_name: string | null;
  contact_company: string | null;
  contact_metadata: Record<string, any>;
  status: string;
  current_step: number;
  steps_completed: number;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  enrolled_at: Date;
  last_activity_at: Date;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type WrappersFdwStat = {
  fdw_name: string;
  create_times: number | null;
  rows_in: number | null;
  rows_out: number | null;
  bytes_in: number | null;
  bytes_out: number | null;
  metadata: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
};
