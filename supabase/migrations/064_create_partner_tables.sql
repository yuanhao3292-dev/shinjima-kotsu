-- ============================================
-- 创建合伙人升级所需的表
-- partner_entry_fees + subscription_plans
-- ============================================

-- 1. 合伙人入场费支付记录表
CREATE TABLE IF NOT EXISTS partner_entry_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  -- 支付信息
  amount DECIMAL(10, 2) NOT NULL DEFAULT 200000, -- 入场费金额（日元）
  currency VARCHAR(3) DEFAULT 'JPY',
  -- Stripe 支付
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_receipt_url TEXT,
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  -- 分期支付（可选）
  installment_plan VARCHAR(20) DEFAULT 'full' CHECK (installment_plan IN ('full', 'installment_3')),
  installment_number INT DEFAULT 1,
  total_installments INT DEFAULT 1,
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- 备注
  notes TEXT
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_partner_entry_fees_guide ON partner_entry_fees(guide_id);
CREATE INDEX IF NOT EXISTS idx_partner_entry_fees_status ON partner_entry_fees(status);

-- RLS
ALTER TABLE partner_entry_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides can view own entry fees" ON partner_entry_fees
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Service role can manage entry fees" ON partner_entry_fees
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- 2. 订阅套餐配置表
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code VARCHAR(20) UNIQUE NOT NULL,
  plan_name VARCHAR(50) NOT NULL,
  plan_name_zh VARCHAR(50),
  monthly_fee DECIMAL(10, 2) NOT NULL,
  entry_fee DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'JPY',
  commission_rate DECIMAL(5, 2),
  commission_type VARCHAR(20) DEFAULT 'fixed' CHECK (commission_type IN ('tiered', 'fixed')),
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  benefits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初始化套餐数据
INSERT INTO subscription_plans (plan_code, plan_name, plan_name_zh, monthly_fee, entry_fee, commission_rate, commission_type, benefits, display_order)
VALUES
  ('growth', 'Growth Plan', '初期合伙人', 1980, 0, 10.00, 'fixed',
   '{"templates": 3, "support": "standard", "description": "每月1980日币，10%固定分成"}'::JSONB, 1),
  ('partner', 'Gold Partner Plan', '金牌合伙人', 4980, 200000, 20.00, 'fixed',
   '{"templates": 10, "support": "priority", "priority_resources": true, "partner_certificate": true, "partner_group": true, "description": "一次支付20万日币入场费，20%固定分成"}'::JSONB, 2)
ON CONFLICT (plan_code) DO UPDATE SET
  monthly_fee = EXCLUDED.monthly_fee,
  entry_fee = EXCLUDED.entry_fee,
  commission_rate = EXCLUDED.commission_rate,
  commission_type = EXCLUDED.commission_type,
  benefits = EXCLUDED.benefits,
  updated_at = NOW();

-- 3. 确保 guides 表有 subscription_tier 列
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'growth'
  CHECK (subscription_tier IN ('growth', 'partner'));

-- ============================================
-- 完成
-- ============================================
