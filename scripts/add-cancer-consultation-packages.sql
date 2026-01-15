-- 添加癌症治疗咨询服务产品到 medical_packages 表
-- 执行此脚本前，请先在 Stripe 创建对应的 Product 和 Price，并获取 price_id

-- 前期诮询服务 - ¥221,000
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  name_en,
  description_zh_tw,
  price_jpy,
  category,
  is_active,
  sort_order,
  stripe_price_id
) VALUES (
  'cancer-initial-consultation',
  '癌症治療 - 前期諮詢服務',
  'がん治療 - 初期相談サービス',
  'Cancer Treatment - Initial Consultation',
  '資料翻譯、醫院諮詢、治療方案初步評估',
  221000,
  'cancer_treatment',
  true,
  100,
  NULL  -- 需要替换为实际的 Stripe Price ID
) ON CONFLICT (slug) DO UPDATE SET
  price_jpy = EXCLUDED.price_jpy,
  name_zh_tw = EXCLUDED.name_zh_tw,
  description_zh_tw = EXCLUDED.description_zh_tw;

-- 远程会诊服务 - ¥243,000
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  name_en,
  description_zh_tw,
  price_jpy,
  category,
  is_active,
  sort_order,
  stripe_price_id
) VALUES (
  'cancer-remote-consultation',
  '癌症治療 - 遠程會診服務',
  'がん治療 - 遠隔診療サービス',
  'Cancer Treatment - Remote Consultation',
  '與日本醫生遠程視頻會診、討論治療方案、費用概算',
  243000,
  'cancer_treatment',
  true,
  101,
  NULL  -- 需要替换为实际的 Stripe Price ID
) ON CONFLICT (slug) DO UPDATE SET
  price_jpy = EXCLUDED.price_jpy,
  name_zh_tw = EXCLUDED.name_zh_tw,
  description_zh_tw = EXCLUDED.description_zh_tw;

-- 查看插入结果
SELECT slug, name_zh_tw, price_jpy, stripe_price_id FROM medical_packages WHERE category = 'cancer_treatment';
