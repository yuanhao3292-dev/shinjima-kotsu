-- ============================================
-- 098: Payment Compliance — 税務・インボイス対応
-- ============================================

-- P0-1: 源泉徴収（Withholding Tax）
-- 導遊の税務居住地：居住者 vs 非居住者で源泉徴収率が異なる
ALTER TABLE guides ADD COLUMN IF NOT EXISTS tax_residency TEXT DEFAULT 'non_resident'
  CHECK (tax_residency IN ('resident', 'non_resident'));
COMMENT ON COLUMN guides.tax_residency IS '税務居住地。resident=日本居住者(10.21%/20.42%), non_resident=非居住者(20.42%一律)';

-- P0-2: インボイス制度（適格請求書等保存方式）
-- 2023年10月施行。登録番号がない場合、仕入税額控除が制限される
ALTER TABLE guides ADD COLUMN IF NOT EXISTS invoice_registration_number TEXT;
COMMENT ON COLUMN guides.invoice_registration_number IS '適格請求書発行事業者登録番号（T+13桁数字）。NULLは未登録';

-- P1-3: 套餐個別消費税率
-- 健診=10%, 非課税医療行為=0% など商品毎に異なる
ALTER TABLE medical_packages ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 10.00;
COMMENT ON COLUMN medical_packages.tax_rate IS '消費税率（%）。健診=10, 非課税医療=0';

-- 佣金記録に源泉徴収情報を追加
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS withholding_tax_amount INTEGER DEFAULT 0;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS withholding_tax_rate DECIMAL(5,4) DEFAULT 0;
COMMENT ON COLUMN white_label_orders.withholding_tax_amount IS '源泉徴収額（円）';
COMMENT ON COLUMN white_label_orders.withholding_tax_rate IS '適用された源泉徴収率';

-- 提現記録にも源泉徴収情報（支払調書生成用）
ALTER TABLE withdrawal_requests ADD COLUMN IF NOT EXISTS withholding_tax_amount INTEGER DEFAULT 0;
COMMENT ON COLUMN withdrawal_requests.withholding_tax_amount IS '源泉徴収額（円）。支払調書生成用';
