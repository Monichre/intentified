CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL,
  name text NOT NULL,
  website text NULL,
  industry text NULL,
  size public.company_size NULL,
  social_links jsonb NULL DEFAULT '{}'::jsonb,
  keywords text[] NULL DEFAULT '{}'::text[],
  competitors text[] NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_clerk_user_id_key UNIQUE (clerk_user_id)
);

CREATE INDEX IF NOT EXISTS companies_clerk_user_id_idx ON public.companies USING btree (clerk_user_id);
CREATE INDEX IF NOT EXISTS companies_created_at_idx ON public.companies USING btree (created_at);

CREATE TABLE public.company_brand_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_profile_id uuid NULL,
  brand_analysis jsonb NOT NULL,
  analysis_version integer NULL DEFAULT 1,
  changes_detected jsonb NULL DEFAULT '{}'::jsonb,
  confidence_score numeric(3,2) NULL,
  source_data_hash text NULL,
  analyzed_at timestamp with time zone NULL DEFAULT now(),
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT company_brand_history_pkey PRIMARY KEY (id),
  CONSTRAINT company_brand_history_company_profile_id_fkey FOREIGN KEY (company_profile_id) REFERENCES company_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_brand_history_company_id ON public.company_brand_history USING btree (company_profile_id);
CREATE INDEX IF NOT EXISTS idx_brand_history_analyzed_at ON public.company_brand_history USING btree (analyzed_at);

CREATE TABLE public.company_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_profile_id uuid NULL,
  user_id uuid NULL,
  title text NOT NULL,
  description text NULL,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_size integer NULL,
  mime_type text NULL,
  storage_path text NOT NULL,
  storage_bucket text NOT NULL DEFAULT 'company-documents'::text,
  processing_status text NULL DEFAULT 'pending'::text,
  extracted_text text NULL,
  summary text NULL,
  tags text[] NULL,
  ai_analysis jsonb NULL DEFAULT '{}'::jsonb,
  sentiment_score numeric(3,2) NULL,
  key_topics text[] NULL,
  visibility text NULL DEFAULT 'private'::text,
  access_permissions jsonb NULL DEFAULT '{}'::jsonb,
  uploaded_at timestamp with time zone NULL DEFAULT now(),
  processed_at timestamp with time zone NULL,
  last_accessed_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT company_documents_pkey PRIMARY KEY (id),
  CONSTRAINT company_documents_company_profile_id_fkey FOREIGN KEY (company_profile_id) REFERENCES company_profiles(id) ON DELETE CASCADE,
  CONSTRAINT company_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_company_documents_company_id ON public.company_documents USING btree (company_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_type ON public.company_documents USING btree (document_type);
CREATE INDEX IF NOT EXISTS idx_company_documents_user_id ON public.company_documents USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_search ON public.company_documents USING gin (to_tsvector('english'::regconfig, ((((title || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(extracted_text, ''::text))));

CREATE TABLE public.company_enrichments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NULL,
  description text NULL,
  category text NULL,
  summary_sections jsonb NULL,
  funding_status text NULL,
  total_funding numeric NULL,
  last_funding_date date NULL,
  funding_rounds jsonb NULL,
  linkedin_url text NULL,
  linkedin_employee_count integer NULL,
  linkedin_followers integer NULL,
  founders jsonb NULL DEFAULT '[]'::jsonb,
  enriched_competitors jsonb NULL DEFAULT '[]'::jsonb,
  company_intelligence text NULL,
  market_position text NULL,
  growth_indicators jsonb NULL,
  seo_analysis_completed boolean NULL DEFAULT false,
  seo_analysis_timestamp timestamp with time zone NULL,
  seo_analysis_data jsonb NULL,
  enrichment_source text NULL,
  enrichment_timestamp timestamp with time zone NULL DEFAULT now(),
  raw_enrichment_data jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT company_enrichments_pkey PRIMARY KEY (id),
  CONSTRAINT company_enrichments_company_id_key UNIQUE (company_id),
  CONSTRAINT company_enrichments_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS company_enrichments_company_id_idx ON public.company_enrichments USING btree (company_id);
CREATE INDEX IF NOT EXISTS company_enrichments_enrichment_timestamp_idx ON public.company_enrichments USING btree (enrichment_timestamp);

CREATE TABLE public.company_insights (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_profile_id uuid NULL,
  insight_type text NOT NULL,
  title text NOT NULL,
  description text NULL,
  confidence_score numeric(3,2) NULL,
  insight_data jsonb NOT NULL,
  source_references jsonb NULL DEFAULT '[]'::jsonb,
  category text NULL,
  priority text NULL DEFAULT 'medium'::text,
  tags text[],
  validated_by uuid NULL,
  validated_at timestamp with time zone NULL,
  validation_notes text NULL,
  generated_at timestamp with time zone NULL DEFAULT now(),
  expires_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT company_insights_pkey PRIMARY KEY (id),
  CONSTRAINT company_insights_company_profile_id_fkey FOREIGN KEY (company_profile_id) REFERENCES company_profiles(id) ON DELETE CASCADE,
  CONSTRAINT company_insights_validated_by_fkey FOREIGN KEY (validated_by) REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_company_insights_company_id ON public.company_insights USING btree (company_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_insights_type ON public.company_insights USING btree (insight_type);

CREATE TABLE public.company_marketing_campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_profile_id uuid NULL,
  user_id uuid NULL,
  campaign_name text NULL,
  description text NULL,
  status text NULL DEFAULT 'generating'::text,
  brand_analysis jsonb NOT NULL DEFAULT '{}'::jsonb,
  email_templates jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_templates integer NULL DEFAULT 0,
  generated_at timestamp with time zone NULL DEFAULT now(),
  processing_time integer NULL,
  error