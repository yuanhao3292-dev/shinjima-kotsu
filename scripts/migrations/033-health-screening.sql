-- Migration 033: AI Health Screening Tables
-- 创建 AI 健康筛查相关表
-- 每周 5 次免费筛查，周一自动重置

-- 1. 创建健康筛查记录表
CREATE TABLE IF NOT EXISTS health_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,                          -- 关联 auth.users
  user_email TEXT NOT NULL,                       -- 冗余存储便于查询和管理员查看
  status TEXT DEFAULT 'in_progress',              -- in_progress | completed
  answers JSONB DEFAULT '[]'::jsonb,              -- 用户答案数组
  analysis_result JSONB,                          -- AI 分析结果
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- 外键约束
  CONSTRAINT fk_health_screening_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. 创建筛查用量追踪表（支持每周重置）
CREATE TABLE IF NOT EXISTS screening_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  free_remaining INTEGER DEFAULT 5,               -- 本周剩余免费次数
  total_used INTEGER DEFAULT 0,                   -- 历史使用总次数
  week_start TIMESTAMPTZ,                         -- 当前统计周的开始时间
  last_used_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_health_screenings_user_id ON health_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_health_screenings_status ON health_screenings(status);
CREATE INDEX IF NOT EXISTS idx_health_screenings_created_at ON health_screenings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_screenings_user_email ON health_screenings(user_email);

-- 4. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_screening_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_screening_usage_updated_at ON screening_usage;
CREATE TRIGGER trigger_screening_usage_updated_at
  BEFORE UPDATE ON screening_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_screening_updated_at();

-- 5. 启用 RLS (需要用户认证)
ALTER TABLE health_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_usage ENABLE ROW LEVEL SECURITY;

-- 6. 创建 RLS 策略 - health_screenings
DROP POLICY IF EXISTS "Users can view own screenings" ON health_screenings;
CREATE POLICY "Users can view own screenings" ON health_screenings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own screenings" ON health_screenings;
CREATE POLICY "Users can insert own screenings" ON health_screenings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own screenings" ON health_screenings;
CREATE POLICY "Users can update own screenings" ON health_screenings
  FOR UPDATE USING (auth.uid() = user_id);

-- 7. 创建 RLS 策略 - screening_usage
DROP POLICY IF EXISTS "Users can view own usage" ON screening_usage;
CREATE POLICY "Users can view own usage" ON screening_usage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage" ON screening_usage;
CREATE POLICY "Users can insert own usage" ON screening_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own usage" ON screening_usage;
CREATE POLICY "Users can update own usage" ON screening_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- 8. 授予权限
GRANT ALL ON health_screenings TO authenticated;
GRANT ALL ON screening_usage TO authenticated;

-- 9. 为现有用户初始化 usage 记录
INSERT INTO screening_usage (user_id, free_remaining, total_used, week_start)
SELECT id, 5, 0, date_trunc('week', NOW()) FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
