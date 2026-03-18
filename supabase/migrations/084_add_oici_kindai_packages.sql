-- =====================================================
-- 084: 添加 OICI 和近畿大学病院的咨询服务套餐
-- Add OICI and Kindai Hospital consultation packages
-- Reuse cancer-* Stripe prices (same ¥221,000 / ¥243,000)
-- =====================================================

-- 1. OICI 前期咨询服务（¥221,000）
INSERT INTO medical_packages (
  slug, name_zh_tw, name_ja, name_en, description_zh_tw,
  price_jpy, stripe_price_id, category, is_active, display_order
) VALUES (
  'oici-initial-consultation',
  '大阪國際癌症中心 - 前期諮詢服務',
  '大阪国際がんセンター - 初期相談サービス',
  'OICI - Initial Consultation',
  '病歷翻譯、大阪國際癌症中心諮詢、治療方案初步評估、費用概算',
  221000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-initial-consultation'),
  'cancer_treatment',
  true,
  170
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw, name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en, description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy, stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active, display_order = EXCLUDED.display_order,
  updated_at = now();

-- 2. OICI 远程会诊服务（¥243,000）
INSERT INTO medical_packages (
  slug, name_zh_tw, name_ja, name_en, description_zh_tw,
  price_jpy, stripe_price_id, category, is_active, display_order
) VALUES (
  'oici-remote-consultation',
  '大阪國際癌症中心 - 遠程會診服務',
  '大阪国際がんセンター - 遠隔診療サービス',
  'OICI - Remote Consultation',
  '與大阪國際癌症中心專科醫生遠程視頻會診、討論治療方案、費用概算',
  243000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-remote-consultation'),
  'cancer_treatment',
  true,
  171
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw, name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en, description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy, stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active, display_order = EXCLUDED.display_order,
  updated_at = now();

-- 3. 近畿大学病院 前期咨询服务（¥221,000）
INSERT INTO medical_packages (
  slug, name_zh_tw, name_ja, name_en, description_zh_tw,
  price_jpy, stripe_price_id, category, is_active, display_order
) VALUES (
  'kindai-initial-consultation',
  '近畿大學醫院 - 前期諮詢服務',
  '近畿大学病院 - 初期相談サービス',
  'Kindai University Hospital - Initial Consultation',
  '病歷翻譯、近畿大學醫院諮詢、治療方案初步評估、費用概算',
  221000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-initial-consultation'),
  'cancer_treatment',
  true,
  172
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw, name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en, description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy, stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active, display_order = EXCLUDED.display_order,
  updated_at = now();

-- 4. 近畿大学病院 远程会诊服务（¥243,000）
INSERT INTO medical_packages (
  slug, name_zh_tw, name_ja, name_en, description_zh_tw,
  price_jpy, stripe_price_id, category, is_active, display_order
) VALUES (
  'kindai-remote-consultation',
  '近畿大學醫院 - 遠程會診服務',
  '近畿大学病院 - 遠隔診療サービス',
  'Kindai University Hospital - Remote Consultation',
  '與近畿大學醫院專科醫生遠程視頻會診、討論治療方案、費用概算',
  243000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-remote-consultation'),
  'cancer_treatment',
  true,
  173
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw, name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en, description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy, stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active, display_order = EXCLUDED.display_order,
  updated_at = now();

-- 5. 回填 module_id（如果 page_modules 中有对应条目）
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.slug = 'oici'
  AND mp.slug LIKE 'oici-%'
  AND mp.module_id IS NULL;

UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.slug = 'kindai-hospital'
  AND mp.slug LIKE 'kindai-%'
  AND mp.module_id IS NULL;
