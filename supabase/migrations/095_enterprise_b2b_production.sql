-- ============================================
-- Enterprise B2B Production — RLS + 配额 + 审计
-- ============================================

-- ── 1. RLS 策略（enterprises / enterprise_members / enterprise_orders）──

-- enterprises: 仅 service_role 可 CRUD（Admin API 用 getSupabaseAdmin）
CREATE POLICY "service_role_all" ON enterprises FOR ALL TO service_role USING (true) WITH CHECK (true);

-- enterprise_members: service_role 全权 + 认证用户可读自己
CREATE POLICY "service_role_all" ON enterprise_members FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "member_read_self" ON enterprise_members FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- enterprise_orders: service_role 全权
CREATE POLICY "service_role_all" ON enterprise_orders FOR ALL TO service_role USING (true) WITH CHECK (true);

-- api_keys / api_usage_log: service_role 全权
CREATE POLICY "service_role_all" ON api_keys FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON api_usage_log FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 2. enterprises 表新增字段 ──

ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS screening_quota INTEGER DEFAULT 200;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS screening_used INTEGER DEFAULT 0;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS notes TEXT;

-- ── 3. 企业筛查配额追踪表 ──

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

-- ── 4. 企业审计日志表 ──

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

-- ── 5. updated_at 自动更新触发器 ──

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
