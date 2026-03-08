-- ============================================================
-- Phase 3: 补问系统（Follow-up Questions）
--
-- 当安全闸门判定为 B 类（缺失关键信息），系统会生成
-- AI 追问问题，用户回答后重新运行 pipeline。
-- ============================================================

-- 1. health_screenings — 添加补问相关字段
ALTER TABLE health_screenings
  ADD COLUMN IF NOT EXISTS followup_questions JSONB,      -- AI 生成的追问问题列表
  ADD COLUMN IF NOT EXISTS followup_answers JSONB,        -- 用户回答的追问答案
  ADD COLUMN IF NOT EXISTS followup_count INTEGER NOT NULL DEFAULT 0;  -- 追问轮次（防止无限循环）

-- status 列现在支持三个值：'in_progress' | 'needs_followup' | 'completed'
-- 注意：不添加 CHECK 约束（已有数据可能不符合）

-- 2. whitelabel_screenings — 同样添加补问字段
ALTER TABLE whitelabel_screenings
  ADD COLUMN IF NOT EXISTS followup_questions JSONB,
  ADD COLUMN IF NOT EXISTS followup_answers JSONB,
  ADD COLUMN IF NOT EXISTS followup_count INTEGER NOT NULL DEFAULT 0;

-- 3. 索引：快速查找需要追问的记录
CREATE INDEX IF NOT EXISTS idx_health_screenings_followup
  ON health_screenings(status) WHERE status = 'needs_followup';

CREATE INDEX IF NOT EXISTS idx_whitelabel_screenings_followup
  ON whitelabel_screenings(status) WHERE status = 'needs_followup';
