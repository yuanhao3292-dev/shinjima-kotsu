-- ============================================
-- 健康筛查模块性能优化索引
-- ============================================

-- 1. 用户历史查询索引（我的筛查记录）
CREATE INDEX IF NOT EXISTS idx_health_screenings_user_created
  ON health_screenings(user_id, created_at DESC);

-- 2. 管理后台查询索引（按状态和时间）
CREATE INDEX IF NOT EXISTS idx_health_screenings_status_created
  ON health_screenings(status, created_at DESC);

-- 3. 已完成筛查的时间索引
CREATE INDEX IF NOT EXISTS idx_health_screenings_completed
  ON health_screenings(completed_at DESC)
  WHERE completed_at IS NOT NULL;

-- 4. 邮箱查询索引（用于用户登录前查找）
CREATE INDEX IF NOT EXISTS idx_health_screenings_email
  ON health_screenings(user_email)
  WHERE user_email IS NOT NULL;

-- 5. 分析结果缓存哈希索引（用于避免重复分析）
ALTER TABLE health_screenings
  ADD COLUMN IF NOT EXISTS answers_hash VARCHAR(32);

CREATE INDEX IF NOT EXISTS idx_health_screenings_answers_hash
  ON health_screenings(answers_hash)
  WHERE answers_hash IS NOT NULL;

-- 6. 添加数据大小检查约束（防止滥用）
ALTER TABLE health_screenings
  ADD CONSTRAINT IF NOT EXISTS check_answers_size
  CHECK (octet_length(answers::text) < 100000);  -- 100KB 限制

ALTER TABLE health_screenings
  ADD CONSTRAINT IF NOT EXISTS check_analysis_result_size
  CHECK (octet_length(analysis_result::text) < 200000);  -- 200KB 限制

-- 7. 添加更新时间自动更新触发器
CREATE OR REPLACE FUNCTION update_health_screening_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_health_screening_updated_at ON health_screenings;
CREATE TRIGGER trigger_health_screening_updated_at
  BEFORE UPDATE ON health_screenings
  FOR EACH ROW
  EXECUTE FUNCTION update_health_screening_updated_at();

-- 8. 数据保留策略：自动清理超过2年的匿名筛查数据
-- 注意：需要 pg_cron 扩展
-- SELECT cron.schedule('cleanup-old-screenings', '0 2 * * 0', $$
--   DELETE FROM health_screenings
--   WHERE user_id IS NULL
--   AND created_at < NOW() - INTERVAL '2 years';
-- $$);

COMMENT ON TABLE health_screenings IS '健康筛查记录表 - 已优化索引和约束';
