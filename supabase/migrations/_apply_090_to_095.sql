-- ============================================
-- Combined Migrations: 090 → 095
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- ═══════════════════════════════════════════
-- 090: API Keys
-- ═══════════════════════════════════════════

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_org TEXT,
  scopes TEXT[] NOT NULL DEFAULT '{medical_triage}',
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 10,
  rate_limit_per_day INTEGER NOT NULL DEFAULT 1000,
  total_requests INTEGER NOT NULL DEFAULT 0,
  total_tokens_in INTEGER NOT NULL DEFAULT 0,
  total_tokens_out INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_key_hash ON api_keys (key_hash) WHERE is_active = true;
CREATE INDEX idx_api_keys_prefix ON api_keys (key_prefix);

CREATE TABLE api_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id),
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  latency_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  error TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_usage_key_date ON api_usage_log (api_key_id, created_at DESC);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- 091: Health Community
-- ═══════════════════════════════════════════

CREATE TABLE health_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ja' CHECK (language IN ('ja', 'zh-CN', 'zh-TW', 'en')),
  category TEXT NOT NULL DEFAULT 'experience' CHECK (category IN ('experience', 'tip', 'question', 'review')),
  tags TEXT[] DEFAULT '{}',
  screening_id UUID,
  risk_level TEXT CHECK (risk_level IS NULL OR risk_level IN ('low', 'medium', 'high')),
  author_display_name TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  moderated_by UUID,
  moderated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_stories_status ON health_stories (status, created_at DESC);
CREATE INDEX idx_health_stories_user ON health_stories (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_health_stories_lang ON health_stories (language, status);

CREATE TABLE story_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES health_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

CREATE TABLE health_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_ja TEXT NOT NULL,
  title_zh_cn TEXT,
  title_zh_tw TEXT,
  title_en TEXT,
  content_ja TEXT NOT NULL,
  content_zh_cn TEXT,
  content_zh_tw TEXT,
  content_en TEXT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'screening', 'department', 'lifestyle', 'faq')),
  tags TEXT[] DEFAULT '{}',
  related_departments TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  author_id UUID,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_articles_slug ON health_articles (slug);
CREATE INDEX idx_health_articles_status ON health_articles (status, sort_order);

ALTER TABLE health_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved stories"
  ON health_stories FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create stories"
  ON health_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read published articles"
  ON health_articles FOR SELECT USING (status = 'published');

-- ═══════════════════════════════════════════
-- 092: Enterprise B2B
-- ═══════════════════════════════════════════

CREATE TABLE enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  stock_code TEXT,
  stock_exchange TEXT CHECK (stock_exchange IS NULL OR stock_exchange IN (
    'SSE', 'SZSE', 'HKEX', 'TWSE', 'TPEx'
  )),
  region TEXT NOT NULL DEFAULT 'CN' CHECK (region IN ('CN', 'HK', 'MO', 'TW')),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_title TEXT,
  contract_type TEXT NOT NULL DEFAULT 'annual' CHECK (contract_type IN ('annual', 'per_use', 'trial')),
  contract_start DATE,
  contract_end DATE,
  member_limit INTEGER NOT NULL DEFAULT 50,
  annual_fee_jpy INTEGER,
  per_screening_fee_jpy INTEGER DEFAULT 0,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  dedicated_coordinator BOOLEAN DEFAULT false,
  priority_booking BOOLEAN DEFAULT false,
  chinese_interpreter BOOLEAN DEFAULT true,
  airport_transfer BOOLEAN DEFAULT false,
  api_key_id UUID REFERENCES api_keys(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enterprises_status ON enterprises (status);
CREATE INDEX idx_enterprises_region ON enterprises (region, status);

CREATE TABLE enterprise_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  full_name_en TEXT,
  title TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  nationality TEXT,
  passport_number TEXT,
  medical_notes TEXT,
  allergies TEXT[],
  preferred_language TEXT DEFAULT 'zh-CN' CHECK (preferred_language IN ('ja', 'zh-CN', 'zh-TW', 'en')),
  last_screening_id UUID,
  last_screening_date TIMESTAMPTZ,
  last_health_score INTEGER,
  screening_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ent_members_enterprise ON enterprise_members (enterprise_id, status);
CREATE INDEX idx_ent_members_user ON enterprise_members (user_id) WHERE user_id IS NOT NULL;

CREATE TABLE enterprise_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  package_id UUID REFERENCES medical_packages(id),
  member_ids UUID[] NOT NULL DEFAULT '{}',
  member_count INTEGER NOT NULL DEFAULT 0,
  unit_price_jpy INTEGER NOT NULL,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  total_amount_jpy INTEGER NOT NULL,
  preferred_dates DATERANGE,
  confirmed_dates DATERANGE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'confirmed', 'in_progress', 'completed', 'cancelled'
  )),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'invoiced', 'paid', 'refunded')),
  invoice_number TEXT,
  paid_at TIMESTAMPTZ,
  special_requirements TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ent_orders_enterprise ON enterprise_orders (enterprise_id, status);

ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_orders ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- 093: Screening Structured Cases
-- ═══════════════════════════════════════════

CREATE TABLE screening_structured_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id TEXT NOT NULL,
  screening_type TEXT NOT NULL DEFAULT 'authenticated'
    CHECK (screening_type IN ('authenticated', 'whitelabel')),
  language TEXT NOT NULL DEFAULT 'ja',
  input_mode TEXT CHECK (input_mode IS NULL OR input_mode IN ('questionnaire', 'document', 'hybrid')),
  has_uploaded_document BOOLEAN DEFAULT false,
  patient_age INTEGER,
  patient_sex TEXT CHECK (patient_sex IS NULL OR patient_sex IN ('male', 'female')),
  patient_country TEXT,
  chief_complaint TEXT,
  symptoms JSONB NOT NULL DEFAULT '[]',
  aggravating_factors TEXT[] DEFAULT '{}',
  relieving_factors TEXT[] DEFAULT '{}',
  associated_symptoms TEXT[] DEFAULT '{}',
  past_history TEXT[] DEFAULT '{}',
  medication_history TEXT[] DEFAULT '{}',
  allergy_history TEXT[] DEFAULT '{}',
  known_diagnoses TEXT[] DEFAULT '{}',
  exam_findings TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  red_flag_count INTEGER GENERATED ALWAYS AS (array_length(red_flags, 1)) STORED,
  missing_critical_info TEXT[] DEFAULT '{}',
  unknown_items TEXT[] DEFAULT '{}',
  inferred_items JSONB DEFAULT '[]',
  extractor_model TEXT,
  extractor_prompt_version TEXT,
  extraction_latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sc_screening ON screening_structured_cases (screening_id);
CREATE INDEX idx_sc_language ON screening_structured_cases (language);
CREATE INDEX idx_sc_red_flags ON screening_structured_cases USING GIN (red_flags);
CREATE INDEX idx_sc_diagnoses ON screening_structured_cases USING GIN (known_diagnoses);
CREATE INDEX idx_sc_medications ON screening_structured_cases USING GIN (medication_history);
CREATE INDEX idx_sc_age_sex ON screening_structured_cases (patient_age, patient_sex);
CREATE INDEX idx_sc_created ON screening_structured_cases (created_at DESC);

ALTER TABLE screening_structured_cases ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- 094: Health Screening Answers Hash
-- ═══════════════════════════════════════════

ALTER TABLE health_screenings
  ADD COLUMN IF NOT EXISTS answers_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_health_screenings_answers_hash
  ON health_screenings(answers_hash)
  WHERE answers_hash IS NOT NULL;

-- ═══════════════════════════════════════════
-- 095: Enterprise B2B Production (RLS + 配额 + 审计)
-- ═══════════════════════════════════════════

-- RLS policies
CREATE POLICY "service_role_all" ON enterprises FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON enterprise_members FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "member_read_self" ON enterprise_members FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY "service_role_all" ON enterprise_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON api_keys FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON api_usage_log FOR ALL TO service_role USING (true) WITH CHECK (true);

-- New columns on enterprises
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS screening_quota INTEGER DEFAULT 200;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS screening_used INTEGER DEFAULT 0;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS notes TEXT;

-- Enterprise screening usage
CREATE TABLE IF NOT EXISTS enterprise_screening_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES enterprise_members(id) ON DELETE CASCADE,
  screening_id UUID,
  screening_type TEXT DEFAULT 'ai_triage',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ent_screening_usage ON enterprise_screening_usage (enterprise_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ent_screening_member ON enterprise_screening_usage (member_id, created_at DESC);

ALTER TABLE enterprise_screening_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON enterprise_screening_usage FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enterprise audit log
CREATE TABLE IF NOT EXISTS enterprise_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('admin', 'api_key', 'member', 'system')),
  actor_id TEXT,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ent_audit ON enterprise_audit_log (enterprise_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ent_audit_action ON enterprise_audit_log (action, created_at DESC);

ALTER TABLE enterprise_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON enterprise_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);

-- updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_enterprises_updated_at') THEN
    CREATE TRIGGER tr_enterprises_updated_at BEFORE UPDATE ON enterprises
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_enterprise_members_updated_at') THEN
    CREATE TRIGGER tr_enterprise_members_updated_at BEFORE UPDATE ON enterprise_members
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_enterprise_orders_updated_at') THEN
    CREATE TRIGGER tr_enterprise_orders_updated_at BEFORE UPDATE ON enterprise_orders
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- RLS for screening_structured_cases
CREATE POLICY "service_role_all" ON screening_structured_cases FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Done! All 090-095 migrations applied.
