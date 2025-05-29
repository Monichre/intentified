-- Marketing Intelligence Tables

-- Company marketing campaigns table
CREATE TABLE IF NOT EXISTS company_marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Campaign metadata
  campaign_name TEXT,
  description TEXT,
  status TEXT DEFAULT 'generating', -- 'generating', 'completed', 'failed'
  
  -- Brand analysis data
  brand_analysis JSONB NOT NULL DEFAULT '{}',
  
  -- Email templates
  email_templates JSONB NOT NULL DEFAULT '[]',
  total_templates INTEGER DEFAULT 0,
  
  -- Processing information
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  processing_time INTEGER, -- milliseconds
  error_message TEXT,
  
  -- Performance tracking
  templates_used INTEGER DEFAULT 0,
  total_sends INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email template usage tracking
CREATE TABLE IF NOT EXISTS email_template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES company_marketing_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Template information
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_purpose TEXT NOT NULL,
  template_theme TEXT NOT NULL,
  
  -- Usage details
  recipient_email TEXT,
  recipient_name TEXT,
  recipient_company TEXT,
  personalization_data JSONB DEFAULT '{}',
  
  -- Email service details
  email_service_provider TEXT, -- 'resend', 'sendgrid', 'mailgun', etc.
  email_service_id TEXT, -- External service's email ID
  
  -- Performance metrics
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  first_click_at TIMESTAMPTZ,
  total_clicks INTEGER DEFAULT 0,
  bounced BOOLEAN DEFAULT false,
  complained BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false,
  
  -- A/B testing
  ab_test_variant TEXT,
  ab_test_group TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand analysis history for tracking brand evolution
CREATE TABLE IF NOT EXISTS company_brand_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  
  -- Brand analysis snapshot
  brand_analysis JSONB NOT NULL,
  analysis_version INTEGER DEFAULT 1,
  
  -- Change tracking
  changes_detected JSONB DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  
  -- Source data hash for change detection
  source_data_hash TEXT,
  
  -- Timestamps
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email campaign performance aggregates
CREATE TABLE IF NOT EXISTS email_campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES company_marketing_campaigns(id) ON DELETE CASCADE,
  
  -- Time period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  
  -- Aggregate metrics
  emails_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_bounced INTEGER DEFAULT 0,
  emails_complained INTEGER DEFAULT 0,
  emails_unsubscribed INTEGER DEFAULT 0,
  
  -- Calculated rates
  delivery_rate DECIMAL(5,4),
  open_rate DECIMAL(5,4),
  click_rate DECIMAL(5,4),
  click_to_open_rate DECIMAL(5,4),
  bounce_rate DECIMAL(5,4),
  complaint_rate DECIMAL(5,4),
  unsubscribe_rate DECIMAL(5,4),
  
  -- Revenue tracking (if applicable)
  total_revenue DECIMAL(10,2),
  revenue_per_email DECIMAL(10,2),
  
  -- Template performance breakdown
  template_performance JSONB DEFAULT '{}',
  
  -- Timestamps
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(campaign_id, period_start, period_end, period_type)
);

-- Marketing automation workflows
CREATE TABLE IF NOT EXISTS marketing_automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Workflow metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  
  -- Trigger configuration
  trigger_type TEXT NOT NULL, -- 'manual', 'webhook', 'schedule', 'event'
  trigger_config JSONB NOT NULL DEFAULT '{}',
  
  -- Workflow steps
  workflow_steps JSONB NOT NULL DEFAULT '[]',
  current_step INTEGER DEFAULT 0,
  
  -- Email templates used in workflow
  email_templates JSONB DEFAULT '[]',
  
  -- Performance tracking
  total_enrollments INTEGER DEFAULT 0,
  active_enrollments INTEGER DEFAULT 0,
  completed_enrollments INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
);

-- Workflow enrollments (individual contacts in workflows)
CREATE TABLE IF NOT EXISTS workflow_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES marketing_automation_workflows(id) ON DELETE CASCADE,
  
  -- Contact information
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_company TEXT,
  contact_metadata JSONB DEFAULT '{}',
  
  -- Enrollment status
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  current_step INTEGER DEFAULT 0,
  
  -- Progress tracking
  steps_completed INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  
  -- Timing
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(workflow_id, contact_email)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_company_id ON company_marketing_campaigns(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_user_id ON company_marketing_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON company_marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_generated_at ON company_marketing_campaigns(generated_at);

CREATE INDEX IF NOT EXISTS idx_email_template_usage_campaign_id ON email_template_usage(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_user_id ON email_template_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_sent_at ON email_template_usage(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_template_usage_template_purpose ON email_template_usage(template_purpose);

CREATE INDEX IF NOT EXISTS idx_brand_history_company_id ON company_brand_history(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_brand_history_analyzed_at ON company_brand_history(analyzed_at);

CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign_id ON email_campaign_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_period ON email_campaign_performance(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_automation_workflows_company_id ON marketing_automation_workflows(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON marketing_automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_trigger_type ON marketing_automation_workflows(trigger_type);

CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_workflow_id ON workflow_enrollments(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_contact_email ON workflow_enrollments(contact_email);
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_status ON workflow_enrollments(status);

-- Full-text search for email templates
CREATE INDEX IF NOT EXISTS idx_email_templates_search ON company_marketing_campaigns 
USING gin(to_tsvector('english', COALESCE(campaign_name, '') || ' ' || COALESCE(description, '')));

-- RLS Policies
ALTER TABLE company_marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_template_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_brand_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_enrollments ENABLE ROW LEVEL SECURITY;

-- Marketing campaigns policies
CREATE POLICY "Users can view their marketing campaigns" 
ON company_marketing_campaigns FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create marketing campaigns" 
ON company_marketing_campaigns FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their marketing campaigns" 
ON company_marketing_campaigns FOR UPDATE 
USING (auth.uid() = user_id);

-- Email usage policies
CREATE POLICY "Users can view their email usage" 
ON email_template_usage FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create email usage records" 
ON email_template_usage FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Brand history policies
CREATE POLICY "Users can view brand history" 
ON company_brand_history FOR SELECT 
USING (
  company_profile_id IN (
    SELECT id FROM company_profiles 
    WHERE id = company_profile_id
  )
);

-- Campaign performance policies
CREATE POLICY "Users can view campaign performance" 
ON email_campaign_performance FOR SELECT 
USING (
  campaign_id IN (
    SELECT id FROM company_marketing_campaigns 
    WHERE user_id = auth.uid()
  )
);

-- Automation workflow policies
CREATE POLICY "Users can manage their automation workflows" 
ON marketing_automation_workflows FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view workflow enrollments" 
ON workflow_enrollments FOR SELECT 
USING (
  workflow_id IN (
    SELECT id FROM marketing_automation_workflows 
    WHERE user_id = auth.uid()
  )
);

-- Functions for calculating performance metrics
CREATE OR REPLACE FUNCTION calculate_campaign_performance(
  campaign_id_param UUID,
  period_start_param TIMESTAMPTZ,
  period_end_param TIMESTAMPTZ
) RETURNS TABLE(
  emails_sent BIGINT,
  emails_opened BIGINT,
  emails_clicked BIGINT,
  open_rate DECIMAL,
  click_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as emails_sent,
    COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as emails_opened,
    COUNT(*) FILTER (WHERE first_click_at IS NOT NULL) as emails_clicked,
    CASE 
      WHEN COUNT(*) > 0 
      THEN ROUND(COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::DECIMAL / COUNT(*)::DECIMAL, 4)
      ELSE 0
    END as open_rate,
    CASE 
      WHEN COUNT(*) > 0 
      THEN ROUND(COUNT(*) FILTER (WHERE first_click_at IS NOT NULL)::DECIMAL / COUNT(*)::DECIMAL, 4)
      ELSE 0
    END as click_rate
  FROM email_template_usage
  WHERE 
    campaign_id = campaign_id_param
    AND sent_at >= period_start_param
    AND sent_at <= period_end_param;
END;
$$ LANGUAGE plpgsql;

-- Function to update campaign aggregates
CREATE OR REPLACE FUNCTION update_campaign_totals(campaign_id_param UUID) RETURNS VOID AS $$
BEGIN
  UPDATE company_marketing_campaigns
  SET 
    total_sends = (
      SELECT COUNT(*) FROM email_template_usage 
      WHERE campaign_id = campaign_id_param AND sent_at IS NOT NULL
    ),
    total_opens = (
      SELECT COUNT(*) FROM email_template_usage 
      WHERE campaign_id = campaign_id_param AND opened_at IS NOT NULL
    ),
    total_clicks = (
      SELECT COALESCE(SUM(total_clicks), 0) FROM email_template_usage 
      WHERE campaign_id = campaign_id_param
    ),
    updated_at = NOW()
  WHERE id = campaign_id_param;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update campaign totals
CREATE OR REPLACE FUNCTION trigger_update_campaign_totals() RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_campaign_totals(NEW.campaign_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_usage_update_campaign_totals
  AFTER INSERT OR UPDATE ON email_template_usage
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_campaign_totals();