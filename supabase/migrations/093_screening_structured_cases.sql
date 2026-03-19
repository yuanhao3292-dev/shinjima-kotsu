-- ============================================
-- Structured Case Data Accumulation
--
-- AI-1 Extractor の構造化出力を永続保存。
-- 用途：prompt 改善 / 知識ベース構築 / Safety Gate 閾値校正
-- ============================================

CREATE TABLE screening_structured_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id TEXT NOT NULL,
  screening_type TEXT NOT NULL DEFAULT 'authenticated'
    CHECK (screening_type IN ('authenticated', 'whitelabel')),

  -- Language & source
  language TEXT NOT NULL DEFAULT 'ja',
  input_mode TEXT CHECK (input_mode IS NULL OR input_mode IN ('questionnaire', 'document', 'hybrid')),
  has_uploaded_document BOOLEAN DEFAULT false,

  -- Demographics (flat columns for easy querying)
  patient_age INTEGER,
  patient_sex TEXT CHECK (patient_sex IS NULL OR patient_sex IN ('male', 'female')),
  patient_country TEXT,

  -- Chief complaint
  chief_complaint TEXT,

  -- Present illness (structured JSON)
  symptoms JSONB NOT NULL DEFAULT '[]',        -- ExtractedSymptom[]
  aggravating_factors TEXT[] DEFAULT '{}',
  relieving_factors TEXT[] DEFAULT '{}',
  associated_symptoms TEXT[] DEFAULT '{}',

  -- History arrays (queryable with GIN index)
  past_history TEXT[] DEFAULT '{}',
  medication_history TEXT[] DEFAULT '{}',
  allergy_history TEXT[] DEFAULT '{}',
  known_diagnoses TEXT[] DEFAULT '{}',
  exam_findings TEXT[] DEFAULT '{}',

  -- Red flags (critical for Safety Gate calibration)
  red_flags TEXT[] DEFAULT '{}',
  red_flag_count INTEGER GENERATED ALWAYS AS (array_length(red_flags, 1)) STORED,

  -- Gaps
  missing_critical_info TEXT[] DEFAULT '{}',
  unknown_items TEXT[] DEFAULT '{}',
  inferred_items JSONB DEFAULT '[]',           -- InferredItem[]

  -- AI metadata
  extractor_model TEXT,                         -- e.g. 'openai/gpt-4o'
  extractor_prompt_version TEXT,                -- e.g. 'extractor-v1.3'
  extraction_latency_ms INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_sc_screening ON screening_structured_cases (screening_id);
CREATE INDEX idx_sc_language ON screening_structured_cases (language);
CREATE INDEX idx_sc_red_flags ON screening_structured_cases USING GIN (red_flags);
CREATE INDEX idx_sc_diagnoses ON screening_structured_cases USING GIN (known_diagnoses);
CREATE INDEX idx_sc_medications ON screening_structured_cases USING GIN (medication_history);
CREATE INDEX idx_sc_age_sex ON screening_structured_cases (patient_age, patient_sex);
CREATE INDEX idx_sc_created ON screening_structured_cases (created_at DESC);

-- RLS
ALTER TABLE screening_structured_cases ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE screening_structured_cases IS
  'AI-1 Extractor 構造化出力の蓄積テーブル。prompt改善・知識ベース構築・Safety Gate校正に使用。';
