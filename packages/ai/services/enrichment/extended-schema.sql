-- Extend existing company_profiles table
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Company social media profiles table
CREATE TABLE IF NOT EXISTS company_social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube'
  profile_url TEXT NOT NULL,
  username TEXT,
  handle TEXT,
  verified BOOLEAN DEFAULT false,
  follower_count INTEGER,
  following_count INTEGER,
  post_count INTEGER,
  bio TEXT,
  profile_image_url TEXT,
  last_scraped_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  scraped_data JSONB DEFAULT '{}', -- Raw platform-specific data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(company_profile_id, platform)
);

-- Company documents table
CREATE TABLE IF NOT EXISTS company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Document metadata
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL, -- 'financial_report', 'pitch_deck', 'whitepaper', 'case_study', 'product_spec', 'legal_doc', 'other'
  file_name TEXT NOT NULL,
  file_size INTEGER, -- bytes
  mime_type TEXT,
  
  -- Storage information
  storage_path TEXT NOT NULL, -- Supabase Storage path
  storage_bucket TEXT NOT NULL DEFAULT 'company-documents',
  
  -- Processing status
  processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  extracted_text TEXT, -- Full text extraction for search
  summary TEXT, -- AI-generated summary
  tags TEXT[], -- Auto-generated tags
  
  -- AI analysis
  ai_analysis JSONB DEFAULT '{}', -- Structured insights from document
  sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
  key_topics TEXT[],
  
  -- Access control
  visibility TEXT DEFAULT 'private', -- 'private', 'team', 'public'
  access_permissions JSONB DEFAULT '{}',
  
  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social media posts/content table  
CREATE TABLE IF NOT EXISTS company_social_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_profile_id UUID REFERENCES company_social_profiles(id) ON DELETE CASCADE,
  
  -- Post metadata
  platform_post_id TEXT NOT NULL, -- Platform's native ID
  post_type TEXT NOT NULL, -- 'post', 'tweet', 'story', 'video', 'reel', 'short'
  content_text TEXT,
  media_urls TEXT[],
  post_url TEXT,
  
  -- Engagement metrics
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  -- AI analysis
  sentiment_score DECIMAL(3,2),
  engagement_rate DECIMAL(5,4),
  topics TEXT[],
  mentions TEXT[],
  hashtags TEXT[],
  
  -- Timestamps
  posted_at TIMESTAMPTZ NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(social_profile_id, platform_post_id)
);

-- Company insights aggregation table
CREATE TABLE IF NOT EXISTS company_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  
  -- Insight metadata
  insight_type TEXT NOT NULL, -- 'social_sentiment', 'document_analysis', 'funding_trend', 'competitor_analysis'
  title TEXT NOT NULL,
  description TEXT,
  confidence_score DECIMAL(3,2), -- 0.0 to 1.0
  
  -- Insight data
  insight_data JSONB NOT NULL,
  source_references JSONB DEFAULT '[]', -- References to source data
  
  -- Categorization
  category TEXT, -- 'financial', 'operational', 'market', 'social', 'competitive'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  tags TEXT[],
  
  -- Validation
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMPTZ,
  validation_notes TEXT,
  
  -- Timestamps
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- For time-sensitive insights
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_social_profiles_company_id ON company_social_profiles(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_social_profiles_platform ON company_social_profiles(platform);
CREATE INDEX IF NOT EXISTS idx_company_documents_company_id ON company_documents(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_type ON company_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_company_documents_user_id ON company_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_company_social_content_profile_id ON company_social_content(social_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_social_content_posted_at ON company_social_content(posted_at);
CREATE INDEX IF NOT EXISTS idx_company_insights_company_id ON company_insights(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_insights_type ON company_insights(insight_type);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_company_documents_search ON company_documents USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(extracted_text, '')));
CREATE INDEX IF NOT EXISTS idx_company_social_content_search ON company_social_content USING gin(to_tsvector('english', COALESCE(content_text, '')));

-- RLS Policies (Row Level Security)
ALTER TABLE company_social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_social_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_insights ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
CREATE POLICY "Users can view company social profiles" ON company_social_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their documents" ON company_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view social content" ON company_social_content FOR SELECT USING (true);
CREATE POLICY "Users can view insights" ON company_insights FOR SELECT USING (true);