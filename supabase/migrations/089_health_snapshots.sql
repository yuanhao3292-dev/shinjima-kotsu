-- ============================================================
-- Health Passport: health_snapshots 表
-- 存储每次筛查的结构化健康快照，用于年度趋势分析
-- ============================================================

CREATE TABLE IF NOT EXISTS health_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL REFERENCES health_screenings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,

  -- 核心指标
  health_score INTEGER NOT NULL CHECK (health_score BETWEEN 0 AND 100),
  risk_level TEXT NOT NULL,
  safety_gate TEXT,

  -- 结构化提取
  department_count INTEGER DEFAULT 0,
  test_count INTEGER DEFAULT 0,
  departments TEXT[] DEFAULT '{}',
  top_findings TEXT[] DEFAULT '{}',

  -- 趋势对比
  score_delta INTEGER,
  prev_snapshot_id UUID,
  trend TEXT DEFAULT 'stable' CHECK (trend IN ('improving', 'stable', 'worsening')),
  new_departments TEXT[] DEFAULT '{}',
  resolved_departments TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(screening_id)
);

-- 按用户+时间倒序索引（护照仪表盘主查询）
CREATE INDEX IF NOT EXISTS idx_snapshots_user_time
  ON health_snapshots(user_id, created_at DESC);

-- RLS: 用户只能读自己的快照
ALTER TABLE health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots"
  ON health_snapshots FOR SELECT
  USING (auth.uid() = user_id);

-- Service role（API 路由写入）绕过 RLS，无需额外 INSERT policy
