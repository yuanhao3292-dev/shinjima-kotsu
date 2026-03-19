-- ============================================================
-- 085: JTB 合作医院表
-- 整合 JTB 159 家合作医院 + 既有 11 家直营医院
-- ============================================================

CREATE TABLE IF NOT EXISTS jtb_hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 基本标识
  jtb_id INTEGER UNIQUE,                   -- JTB 网站 ID（如 840, 187）；直营医院为 NULL
  source TEXT NOT NULL DEFAULT 'jtb',       -- 数据来源: 'jtb' | 'direct'
  internal_id TEXT,                         -- 直营医院的 component_key（如 'hyogo_medical'）

  -- 名称
  name_ja TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  name_zh_cn TEXT DEFAULT '',
  name_zh_tw TEXT DEFAULT '',

  -- 地理信息
  region TEXT NOT NULL DEFAULT '不明',       -- 地区（関東、近畿、中部...）
  prefecture TEXT NOT NULL DEFAULT '',      -- 都道府県
  address TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',

  -- 医疗能力
  category TEXT NOT NULL DEFAULT 'general_hospital',  -- general_hospital / health_screening / aesthetics / stem_cell
  departments TEXT[] DEFAULT '{}',          -- 标准化科室名（zh-CN）
  specialties TEXT[] DEFAULT '{}',          -- 特色专科关键词
  condition_keywords TEXT[] DEFAULT '{}',   -- 可处理症状/疾病关键词
  programs JSONB DEFAULT '[]',             -- 检查/治疗项目
  equipment TEXT[] DEFAULT '{}',           -- 医疗设备
  has_emergency BOOLEAN DEFAULT false,
  bed_count INTEGER DEFAULT 0,

  -- 多语言展示字段
  features_ja TEXT[] DEFAULT '{}',
  features_en TEXT[] DEFAULT '{}',
  features_zh_cn TEXT[] DEFAULT '{}',
  features_zh_tw TEXT[] DEFAULT '{}',
  suitable_for_ja TEXT DEFAULT '',
  suitable_for_en TEXT DEFAULT '',
  suitable_for_zh_cn TEXT DEFAULT '',
  suitable_for_zh_tw TEXT DEFAULT '',
  location_ja TEXT DEFAULT '',
  location_en TEXT DEFAULT '',
  location_zh_cn TEXT DEFAULT '',
  location_zh_tw TEXT DEFAULT '',

  -- 其他
  languages TEXT[] DEFAULT '{ja}',         -- 支持语言
  certifications TEXT[] DEFAULT '{}',
  website_url TEXT DEFAULT '',
  priority INTEGER NOT NULL DEFAULT 5,     -- 1-10，直营 8-10，JTB 默认 5
  is_active BOOLEAN NOT NULL DEFAULT true,
  raw_data JSONB,                          -- 原始爬取数据（备查）

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_departments ON jtb_hospitals USING GIN(departments);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_specialties ON jtb_hospitals USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_condition_kw ON jtb_hospitals USING GIN(condition_keywords);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_region ON jtb_hospitals(region);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_category ON jtb_hospitals(category);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_source ON jtb_hospitals(source);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_priority ON jtb_hospitals(priority DESC);
CREATE INDEX IF NOT EXISTS idx_jtb_hospitals_active ON jtb_hospitals(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE jtb_hospitals ENABLE ROW LEVEL SECURITY;

-- 所有人可读（公开数据）
CREATE POLICY "jtb_hospitals_public_read" ON jtb_hospitals
  FOR SELECT USING (true);

-- 只有 service_role 可写
CREATE POLICY "jtb_hospitals_service_write" ON jtb_hospitals
  FOR ALL USING (auth.role() = 'service_role');

-- 更新触发器
CREATE OR REPLACE FUNCTION update_jtb_hospitals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jtb_hospitals_updated_at
  BEFORE UPDATE ON jtb_hospitals
  FOR EACH ROW
  EXECUTE FUNCTION update_jtb_hospitals_updated_at();
