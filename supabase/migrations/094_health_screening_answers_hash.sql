-- 094: 添加 answers_hash 列到 health_screenings 表
-- 该列用于缓存查询（同一用户 + 同一答案哈希 → 跳过重复 AI 分析）
-- 注意：此列之前仅在 scripts/migrations/048 中定义，未应用到 Supabase 生产数据库

ALTER TABLE health_screenings
  ADD COLUMN IF NOT EXISTS answers_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_health_screenings_answers_hash
  ON health_screenings(answers_hash)
  WHERE answers_hash IS NOT NULL;
