-- ============================================
-- 订阅套餐分层系统
-- Subscription Tier System (Growth / Partner)
-- ============================================

-- 1. 添加订阅等级字段到 guides 表
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'growth'
  CHECK (subscription_tier IN ('growth', 'partner'));

-- 2. 合伙人入场费支付记录表
CREATE TABLE IF NOT EXISTS partner_entry_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  -- 支付信息
  amount DECIMAL(10, 2) NOT NULL DEFAULT 100000, -- 入场费金额（日元）
  currency VARCHAR(3) DEFAULT 'JPY',
  -- Stripe 支付
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_receipt_url TEXT,
  -- 状态
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  -- 分期支付（可选）
  installment_plan VARCHAR(20) DEFAULT 'full' CHECK (installment_plan IN ('full', 'installment_3')),
  installment_number INT DEFAULT 1, -- 第几期
  total_installments INT DEFAULT 1, -- 总期数
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- 备注
  notes TEXT
);

-- 3. 合伙人月费订阅记录（区别于成长版月费）
-- 复用现有的 stripe_subscription_id，通过 subscription_tier 区分

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_guides_subscription_tier ON guides(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_partner_entry_fees_guide ON partner_entry_fees(guide_id);
CREATE INDEX IF NOT EXISTS idx_partner_entry_fees_status ON partner_entry_fees(status);

-- 5. RLS 策略
ALTER TABLE partner_entry_fees ENABLE ROW LEVEL SECURITY;

-- 导游可以查看自己的入场费记录
CREATE POLICY "Guides can view own entry fees" ON partner_entry_fees
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 管理员可以查看所有
CREATE POLICY "Admins can view all entry fees" ON partner_entry_fees
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- 6. 更新分成计算函数：根据订阅等级返回不同分成比例
CREATE OR REPLACE FUNCTION get_guide_commission_rate(p_guide_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_tier VARCHAR(20);
  v_subscription_tier VARCHAR(20);
  v_base_rate DECIMAL(5,2);
BEGIN
  -- 获取导游的订阅等级和分成等级
  SELECT subscription_tier, commission_tier_code
  INTO v_subscription_tier, v_tier
  FROM guides
  WHERE id = p_guide_id;

  -- 合伙人固定 20% 分成
  IF v_subscription_tier = 'partner' THEN
    RETURN 0.20;
  END IF;

  -- 成长版使用累计制分成
  SELECT commission_rate INTO v_base_rate
  FROM commission_tiers
  WHERE tier_code = COALESCE(v_tier, 'bronze')
    AND is_active = true;

  RETURN COALESCE(v_base_rate, 0.10);
END;
$$ LANGUAGE plpgsql;

-- 7. 升级到合伙人的函数
CREATE OR REPLACE FUNCTION upgrade_to_partner(
  p_guide_id UUID,
  p_stripe_payment_intent_id VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_entry_fee_paid BOOLEAN;
BEGIN
  -- 检查是否已支付入场费
  SELECT EXISTS (
    SELECT 1 FROM partner_entry_fees
    WHERE guide_id = p_guide_id
      AND status = 'completed'
      AND installment_plan = 'full'
  ) OR (
    -- 或者分期付款已全部完成
    SELECT COUNT(*) = MAX(total_installments)
    FROM partner_entry_fees
    WHERE guide_id = p_guide_id
      AND status = 'completed'
      AND installment_plan = 'installment_3'
  ) INTO v_entry_fee_paid;

  IF NOT v_entry_fee_paid AND p_stripe_payment_intent_id IS NULL THEN
    RAISE EXCEPTION 'Entry fee not paid';
  END IF;

  -- 如果提供了支付 ID，记录入场费
  IF p_stripe_payment_intent_id IS NOT NULL THEN
    INSERT INTO partner_entry_fees (
      guide_id,
      amount,
      stripe_payment_intent_id,
      status,
      completed_at
    ) VALUES (
      p_guide_id,
      100000,
      p_stripe_payment_intent_id,
      'completed',
      NOW()
    );
  END IF;

  -- 升级到合伙人
  UPDATE guides
  SET subscription_tier = 'partner',
      updated_at = NOW()
  WHERE id = p_guide_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 8. 获取导游订阅详情的函数
CREATE OR REPLACE FUNCTION get_guide_subscription_details(p_guide_id UUID)
RETURNS TABLE (
  subscription_tier VARCHAR(20),
  subscription_status VARCHAR(20),
  commission_rate DECIMAL(5,2),
  monthly_fee DECIMAL(10,2),
  entry_fee_paid BOOLEAN,
  entry_fee_amount DECIMAL(10,2),
  tier_benefits JSONB
) AS $$
DECLARE
  v_tier VARCHAR(20);
  v_status VARCHAR(20);
  v_rate DECIMAL(5,2);
  v_entry_paid BOOLEAN;
BEGIN
  -- 获取基本信息
  SELECT g.subscription_tier, g.subscription_status
  INTO v_tier, v_status
  FROM guides g
  WHERE g.id = p_guide_id;

  -- 获取分成比例
  v_rate := get_guide_commission_rate(p_guide_id);

  -- 检查入场费
  SELECT EXISTS (
    SELECT 1 FROM partner_entry_fees
    WHERE guide_id = p_guide_id AND status = 'completed'
  ) INTO v_entry_paid;

  RETURN QUERY SELECT
    v_tier,
    v_status,
    v_rate,
    CASE v_tier
      WHEN 'growth' THEN 1980.00
      WHEN 'partner' THEN 4980.00
      ELSE 0.00
    END,
    v_entry_paid,
    CASE WHEN v_entry_paid THEN 100000.00 ELSE 0.00 END,
    CASE v_tier
      WHEN 'growth' THEN '{"whitelabel": true, "commission": "累计制", "support": "标准"}'::JSONB
      WHEN 'partner' THEN '{"whitelabel": true, "commission": "20%固定", "support": "专属", "priority_resources": true, "partner_certificate": true}'::JSONB
      ELSE '{}'::JSONB
    END;
END;
$$ LANGUAGE plpgsql;

-- 9. 订阅套餐配置表（方便管理员调整）
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 基本信息
  plan_code VARCHAR(20) UNIQUE NOT NULL, -- 'growth' / 'partner'
  plan_name VARCHAR(50) NOT NULL,
  plan_name_zh VARCHAR(50),
  -- 价格
  monthly_fee DECIMAL(10, 2) NOT NULL,
  entry_fee DECIMAL(10, 2) DEFAULT 0, -- 入场费（合伙人专用）
  currency VARCHAR(3) DEFAULT 'JPY',
  -- 分成
  commission_rate DECIMAL(5, 2), -- NULL 表示使用累计制
  commission_type VARCHAR(20) DEFAULT 'tiered' CHECK (commission_type IN ('tiered', 'fixed')),
  -- Stripe 产品
  stripe_price_id VARCHAR(255),
  stripe_product_id VARCHAR(255),
  -- 权益
  benefits JSONB DEFAULT '{}',
  -- 状态
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 初始化订阅套餐数据
INSERT INTO subscription_plans (plan_code, plan_name, plan_name_zh, monthly_fee, entry_fee, commission_rate, commission_type, benefits, display_order)
VALUES
  ('growth', 'Growth Plan', '成长版', 1980, 0, NULL, 'tiered',
   '{"whitelabel": true, "templates": 3, "support": "standard", "description": "适合刚起步的导游"}'::JSONB, 1),
  ('partner', 'Partner Plan', '导游合伙人', 4980, 100000, 0.20, 'fixed',
   '{"whitelabel": true, "templates": 10, "support": "priority", "priority_resources": true, "partner_certificate": true, "partner_group": true, "description": "适合有野心、有客源的导游"}'::JSONB, 2)
ON CONFLICT (plan_code) DO UPDATE SET
  monthly_fee = EXCLUDED.monthly_fee,
  entry_fee = EXCLUDED.entry_fee,
  commission_rate = EXCLUDED.commission_rate,
  benefits = EXCLUDED.benefits,
  updated_at = NOW();

-- ============================================
-- 完成
-- ============================================
