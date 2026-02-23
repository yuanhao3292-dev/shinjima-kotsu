-- =====================================================
-- 068: White Label Anonymous Health Screening
-- 匿名白标 AI 健康筛查表
-- =====================================================

-- 匿名筛查记录（不依赖 auth.users，用 session_id 标识）
CREATE TABLE IF NOT EXISTS whitelabel_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  guide_slug TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  answers JSONB DEFAULT '[]'::jsonb,
  body_map_data JSONB,
  analysis_result JSONB,
  answers_hash TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_wl_screenings_session ON whitelabel_screenings(session_id);
CREATE INDEX IF NOT EXISTS idx_wl_screenings_guide ON whitelabel_screenings(guide_slug);
CREATE INDEX IF NOT EXISTS idx_wl_screenings_created ON whitelabel_screenings(created_at DESC);

-- RLS: 启用但允许 service role 全权限访问
-- API 层通过 session_id 验证所有权
ALTER TABLE whitelabel_screenings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on whitelabel_screenings"
  ON whitelabel_screenings
  FOR ALL
  USING (true)
  WITH CHECK (true);
