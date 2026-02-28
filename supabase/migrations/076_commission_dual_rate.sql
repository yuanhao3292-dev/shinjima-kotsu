-- =====================================================
-- 076: Per-Module Dual-Rate Commission System
-- 每个模块独立设置 A/B 双佣金比例
-- Growth (Plan A): commission_rate_a
-- Partner (Plan B): commission_rate_b (≥20%)
-- =====================================================

-- =====================================================
-- Part 1: page_modules — 双佣金字段
-- =====================================================

-- 重命名现有 commission_rate → commission_rate_a (Growth 费率)
ALTER TABLE page_modules RENAME COLUMN commission_rate TO commission_rate_a;

-- 添加 commission_rate_b (Partner 费率)，默认 20%
ALTER TABLE page_modules ADD COLUMN commission_rate_b DECIMAL(5,2) DEFAULT 20.00;

-- 添加约束确保费率在 0-100 之间
ALTER TABLE page_modules ADD CONSTRAINT chk_commission_rate_a
  CHECK (commission_rate_a >= 0 AND commission_rate_a <= 100);
ALTER TABLE page_modules ADD CONSTRAINT chk_commission_rate_b
  CHECK (commission_rate_b >= 0 AND commission_rate_b <= 100);

-- =====================================================
-- Part 2: medical_packages — 添加 module_id 外键
-- =====================================================

ALTER TABLE medical_packages ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES page_modules(id);
CREATE INDEX IF NOT EXISTS idx_medical_packages_module_id ON medical_packages(module_id);

-- Backfill: 通过 slug 前缀 / category 关联到对应的 page_module

-- TIMC 体检套餐 (原始4个，categories: vip/premium/select/standard)
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'medical_packages'
  AND mp.category IN ('vip', 'premium', 'select', 'standard')
  AND mp.module_id IS NULL;

-- HELENE 诊所
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'helene_clinic'
  AND mp.slug LIKE 'helene-%'
  AND mp.module_id IS NULL;

-- SAI CLINIC
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'sai_clinic'
  AND mp.slug LIKE 'sai-%'
  AND mp.module_id IS NULL;

-- 兵庫医大
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'hyogo_medical'
  AND mp.slug LIKE 'hyogo-%'
  AND mp.module_id IS NULL;

-- 癌症治療
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'cancer_treatment'
  AND mp.slug LIKE 'cancer-%'
  AND mp.module_id IS NULL;

-- W CLINIC men's
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'wclinic_mens'
  AND mp.slug LIKE 'wclinic-%'
  AND mp.module_id IS NULL;

-- 先端細胞医療
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'cell_medicine'
  AND mp.slug LIKE 'cell-medicine-%'
  AND mp.module_id IS NULL;

-- AC Cell Clinic
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.component_key = 'ac_plus'
  AND mp.slug LIKE 'ac-plus-%'
  AND mp.module_id IS NULL;

-- =====================================================
-- Part 3: orders 表 — 补齐白标归属列
-- =====================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS referred_by_guide_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referred_by_guide_slug TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_amount INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_status TEXT DEFAULT 'none';

CREATE INDEX IF NOT EXISTS idx_orders_guide_id ON orders(referred_by_guide_id);

-- =====================================================
-- Part 4: white_label_orders — 补齐 webhook 使用的列
-- =====================================================

ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS applied_commission_rate DECIMAL(5,2);
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_status TEXT DEFAULT 'pending';
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_available_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS order_currency TEXT DEFAULT 'JPY';
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS source_order_id UUID;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS source_order_table TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS order_amount INTEGER;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS order_type TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS metadata JSONB;

-- =====================================================
-- Part 5: 验证（取消注释后手动执行）
-- =====================================================
-- SELECT slug, commission_rate_a, commission_rate_b FROM page_modules;
-- SELECT slug, module_id FROM medical_packages WHERE module_id IS NOT NULL LIMIT 10;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'orders' AND column_name LIKE 'commission%';
