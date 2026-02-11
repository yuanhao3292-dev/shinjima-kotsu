-- =====================================================
-- 061: 添加兵庫医大专属咨询服务套餐
-- Hyogo Medical-specific consultation packages
-- Reuses same Stripe prices as cancer packages (same amounts)
-- but with distinct names for email/admin identification
-- Already executed via run-migration-061.js
-- =====================================================

-- 前期咨询服务（¥221,000）
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  description_zh_tw,
  price_jpy,
  stripe_price_id,
  category,
  is_active,
  display_order
) VALUES (
  'hyogo-initial-consultation',
  '兵庫醫大 - 前期諮詢服務',
  '兵庫医大 - 初期相談サービス',
  '資料翻譯、兵庫醫大諮詢、治療方案初步評估',
  221000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-initial-consultation'),
  'cancer_treatment',
  true,
  110
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw,
  name_ja = EXCLUDED.name_ja,
  description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy,
  stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 远程会诊服务（¥243,000）
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  description_zh_tw,
  price_jpy,
  stripe_price_id,
  category,
  is_active,
  display_order
) VALUES (
  'hyogo-remote-consultation',
  '兵庫醫大 - 遠程會診服務',
  '兵庫医大 - 遠隔診療サービス',
  '與兵庫醫大專科醫生遠程視頻會診、討論治療方案、費用概算',
  243000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-remote-consultation'),
  'cancer_treatment',
  true,
  111
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw,
  name_ja = EXCLUDED.name_ja,
  description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy,
  stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = now();
