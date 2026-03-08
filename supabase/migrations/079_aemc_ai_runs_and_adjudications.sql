-- ============================================================
-- AEMC (AI Expert Medical Consultation) 数据库表
-- Phase 2: AI 调用审计记录 + 仲裁结果 + 医院匹配 + 就诊闭环
--
-- 警告：这些表存储医疗相关的 AI 决策记录，
-- 修改前请确认不会破坏审计追溯能力。
-- ============================================================

-- 1. screening_ai_runs — 每次 AI 调用的审计记录
-- 记录 pipeline 中每个 AI 模型的输入/输出/延迟/token 消耗
CREATE TABLE IF NOT EXISTS screening_ai_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL,
  screening_type TEXT NOT NULL DEFAULT 'authenticated'
    CHECK (screening_type IN ('authenticated', 'whitelabel')),
  model_vendor TEXT NOT NULL,        -- 'openai' | 'google' | 'xai' | 'anthropic' | 'deepseek'
  model_name TEXT NOT NULL,          -- 'gpt-4o' | 'gemini-1.5-pro' | 'grok-3' | 'claude-sonnet'
  role TEXT NOT NULL,                -- 'extractor' | 'triage' | 'challenger' | 'adjudicator' | 'hospital_matcher'
  prompt_version TEXT NOT NULL,      -- 语义版本号 (e.g., 'extractor-v1.0')
  input_hash TEXT,                   -- 输入内容的哈希（用于去重分析）
  output_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  latency_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  error TEXT,                        -- 失败时记录错误信息
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_runs_screening ON screening_ai_runs(screening_id);
CREATE INDEX IF NOT EXISTS idx_ai_runs_role ON screening_ai_runs(role);
CREATE INDEX IF NOT EXISTS idx_ai_runs_vendor ON screening_ai_runs(model_vendor);
CREATE INDEX IF NOT EXISTS idx_ai_runs_created ON screening_ai_runs(created_at DESC);
-- 用于成本分析：按模型统计 token 消耗
CREATE INDEX IF NOT EXISTS idx_ai_runs_model ON screening_ai_runs(model_name, created_at DESC);

-- 2. screening_adjudications — 最终仲裁结果 + 安全闸门
-- 每次完整 pipeline 执行产生一条记录
CREATE TABLE IF NOT EXISTS screening_adjudications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL,
  screening_type TEXT NOT NULL DEFAULT 'authenticated'
    CHECK (screening_type IN ('authenticated', 'whitelabel')),
  pipeline_version TEXT NOT NULL,      -- e.g., 'aemc-v1.0'
  -- 仲裁结果
  final_risk_level TEXT NOT NULL       -- 'low' | 'medium' | 'high' | 'emergency'
    CHECK (final_risk_level IN ('low', 'medium', 'high', 'emergency')),
  final_departments TEXT[] NOT NULL DEFAULT '{}',
  final_summary TEXT,
  critical_reasons TEXT[] NOT NULL DEFAULT '{}',   -- [AUDIT-FIX] 仲裁官的关键推理
  must_ask_followups TEXT[] NOT NULL DEFAULT '{}', -- [AUDIT-FIX] 建议追问的问题
  conflict_notes TEXT[] NOT NULL DEFAULT '{}',     -- [AUDIT-FIX] AI 模型间的分歧记录
  safe_to_auto_display BOOLEAN NOT NULL DEFAULT false,
  escalate_to_human BOOLEAN NOT NULL DEFAULT true,
  escalation_reason TEXT,
  confidence DECIMAL(3,2)
    CHECK (confidence >= 0 AND confidence <= 1),
  -- 安全闸门结果
  safety_gate_class TEXT NOT NULL      -- 'A' | 'B' | 'C' | 'D'
    CHECK (safety_gate_class IN ('A', 'B', 'C', 'D')),
  safety_gate_triggers JSONB,          -- 触发的具体规则列表
  safety_gate_explanation TEXT,
  -- 性能
  total_latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adjudications_screening ON screening_adjudications(screening_id);
CREATE INDEX IF NOT EXISTS idx_adjudications_risk ON screening_adjudications(final_risk_level);
CREATE INDEX IF NOT EXISTS idx_adjudications_gate ON screening_adjudications(safety_gate_class);
CREATE INDEX IF NOT EXISTS idx_adjudications_created ON screening_adjudications(created_at DESC);
-- 用于安全监控：快速查找需要人工审核的案例
CREATE INDEX IF NOT EXISTS idx_adjudications_escalate ON screening_adjudications(escalate_to_human)
  WHERE escalate_to_human = true;

-- 3. screening_hospital_matches — 医院推荐记录 (Phase 4 使用)
CREATE TABLE IF NOT EXISTS screening_hospital_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL,
  screening_type TEXT NOT NULL DEFAULT 'authenticated'
    CHECK (screening_type IN ('authenticated', 'whitelabel')),
  hospital_id TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  department TEXT NOT NULL,
  match_score DECIMAL(3,2)
    CHECK (match_score >= 0 AND match_score <= 1),
  match_reasons JSONB,
  cautions JSONB,
  ranked_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hospital_matches_screening ON screening_hospital_matches(screening_id);

-- 4. screening_outcomes — 真实就诊结果回流 (Phase 6 使用)
-- 这是未来核心数据壁垒：AI 分诊结果 vs 真实就诊结果的闭环
CREATE TABLE IF NOT EXISTS screening_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL,
  screening_type TEXT NOT NULL DEFAULT 'authenticated'
    CHECK (screening_type IN ('authenticated', 'whitelabel')),
  contacted_hospital_id TEXT,
  actual_department TEXT,
  doctor_feedback TEXT,
  final_clinical_direction TEXT,
  was_admitted BOOLEAN,
  surgery_performed BOOLEAN,
  urgency_confirmed BOOLEAN,
  outcome_label TEXT                   -- 'accurate' | 'under_triage' | 'over_triage' | 'missed'
    CHECK (outcome_label IS NULL OR outcome_label IN ('accurate', 'under_triage', 'over_triage', 'missed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outcomes_screening ON screening_outcomes(screening_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_label ON screening_outcomes(outcome_label);

-- ============================================================
-- RLS 策略
-- 这些表仅通过 service role (API 后端) 访问。
-- service_role 自动绕过 RLS，无需任何 policy。
-- 开启 RLS + 不创建 policy = anon/authenticated 完全无法访问。
-- ============================================================

ALTER TABLE screening_ai_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_adjudications ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_hospital_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_outcomes ENABLE ROW LEVEL SECURITY;

-- 注意：不创建任何 CREATE POLICY 语句。
-- service_role 天然绕过 RLS，无需显式策略。
-- 这确保 anon key（浏览器端公开）无法读写审计数据。
