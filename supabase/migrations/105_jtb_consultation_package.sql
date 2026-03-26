-- JTB 合作医院共享初诊咨询套餐
-- 部署后需在 Stripe Dashboard 创建对应 Product/Price，并更新 stripe_price_id

INSERT INTO medical_packages (slug, name_zh_tw, name_ja, price_jpy, stripe_price_id, is_active, display_order)
VALUES (
  'jtb-initial-consultation',
  'JTB合作醫院 前期諮詢服務',
  'JTB提携病院 初期相談サービス',
  221000,
  'PENDING_STRIPE_SETUP',
  true,
  900
)
ON CONFLICT (slug) DO NOTHING;
