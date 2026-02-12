-- ============================================
-- 简化佣金等级：4 级 → 2 级
-- Simplify Commission Tiers: 4 → 2
-- ============================================
-- 新模型：
--   初期合伙人 (growth): ¥1,980/月, 10% 分成
--   金牌合伙人 (gold/partner): ¥4,980/月, 20% 分成, ¥200,000 入场费
-- ============================================

-- ============================================
-- Part 1: 更新 commission_tiers 表
-- ============================================

-- 1a. 将所有 bronze 导游迁移到 growth
UPDATE guides
SET commission_tier_code = 'growth'
WHERE commission_tier_code = 'bronze' OR commission_tier_code IS NULL;

-- 1b. 将所有 silver 导游迁移到 growth（降级到初期）
UPDATE guides
SET commission_tier_code = 'growth'
WHERE commission_tier_code = 'silver';

-- 1c. 将所有 diamond 导游迁移到 gold
UPDATE guides
SET commission_tier_code = 'gold'
WHERE commission_tier_code = 'diamond';

-- 1d. 停用 silver 和 diamond 等级
UPDATE commission_tiers SET is_active = false WHERE tier_code IN ('silver', 'diamond');

-- 1e. 更新 bronze → growth
UPDATE commission_tiers
SET tier_code = 'growth',
    tier_name_ja = '初期合夥人',
    tier_name_zh = '初期合伙人',
    tier_name_en = 'Growth Partner',
    min_monthly_sales = 0,
    min_quarterly_sales = 0,
    commission_rate = 10.00,
    badge_color = '#F97316',
    sort_order = 1,
    is_active = true,
    updated_at = NOW()
WHERE tier_code = 'bronze';

-- 如果 bronze 不存在（已被改过），用 UPSERT 保底
INSERT INTO commission_tiers (tier_code, tier_name_ja, tier_name_zh, tier_name_en, min_monthly_sales, commission_rate, badge_color, sort_order, is_active)
VALUES ('growth', '初期合夥人', '初期合伙人', 'Growth Partner', 0, 10.00, '#F97316', 1, true)
ON CONFLICT (tier_code) DO UPDATE SET
  tier_name_ja = EXCLUDED.tier_name_ja,
  tier_name_zh = EXCLUDED.tier_name_zh,
  tier_name_en = EXCLUDED.tier_name_en,
  min_monthly_sales = EXCLUDED.min_monthly_sales,
  commission_rate = EXCLUDED.commission_rate,
  badge_color = EXCLUDED.badge_color,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = NOW();

-- 1f. 更新 gold 等级
UPDATE commission_tiers
SET tier_name_ja = '金牌合夥人',
    tier_name_zh = '金牌合伙人',
    tier_name_en = 'Gold Partner',
    commission_rate = 20.00,
    badge_color = '#FFD700',
    sort_order = 2,
    is_active = true,
    updated_at = NOW()
WHERE tier_code = 'gold';

-- 如果 gold 不存在，UPSERT 保底
INSERT INTO commission_tiers (tier_code, tier_name_ja, tier_name_zh, tier_name_en, min_monthly_sales, commission_rate, badge_color, sort_order, is_active)
VALUES ('gold', '金牌合夥人', '金牌合伙人', 'Gold Partner', 0, 20.00, '#FFD700', 2, true)
ON CONFLICT (tier_code) DO UPDATE SET
  tier_name_ja = EXCLUDED.tier_name_ja,
  tier_name_zh = EXCLUDED.tier_name_zh,
  tier_name_en = EXCLUDED.tier_name_en,
  commission_rate = EXCLUDED.commission_rate,
  badge_color = EXCLUDED.badge_color,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = NOW();

-- 1g. 更新 guides.commission_tier_id 关联
UPDATE guides g
SET commission_tier_id = ct.id
FROM commission_tiers ct
WHERE g.commission_tier_code = ct.tier_code
  AND ct.is_active = true;

-- ============================================
-- Part 2: 更新 subscription_plans 表
-- ============================================

UPDATE subscription_plans
SET entry_fee = 200000,
    benefits = jsonb_set(
      benefits,
      '{description}',
      '"一次支付20万日币入场费，享受20%固定分成"'::jsonb
    ),
    updated_at = NOW()
WHERE plan_code = 'partner';

-- 更新 growth 描述
UPDATE subscription_plans
SET commission_rate = NULL,
    commission_type = 'fixed',
    benefits = jsonb_set(
      benefits,
      '{description}',
      '"每月1980日币，10%固定分成"'::jsonb
    ),
    updated_at = NOW()
WHERE plan_code = 'growth';

-- ============================================
-- Part 3: 更新 partner_entry_fees 默认金额
-- ============================================

-- 修改默认值为 200000
ALTER TABLE partner_entry_fees ALTER COLUMN amount SET DEFAULT 200000;

-- ============================================
-- Part 4: 更新分成计算函数
-- ============================================

-- 简化版：只有两个等级
CREATE OR REPLACE FUNCTION get_guide_commission_rate(p_guide_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_subscription_tier VARCHAR(20);
BEGIN
  SELECT subscription_tier
  INTO v_subscription_tier
  FROM guides
  WHERE id = p_guide_id;

  -- 金牌合伙人 = 20%
  IF v_subscription_tier = 'partner' THEN
    RETURN 0.20;
  END IF;

  -- 初期合伙人 = 10%
  RETURN 0.10;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Part 5: 更新升级函数（入场费 ¥200,000）
-- ============================================

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
      200000,
      p_stripe_payment_intent_id,
      'completed',
      NOW()
    );
  END IF;

  -- 升级到金牌合伙人
  UPDATE guides
  SET subscription_tier = 'partner',
      commission_tier_code = 'gold',
      commission_tier_id = (SELECT id FROM commission_tiers WHERE tier_code = 'gold' AND is_active = true LIMIT 1),
      updated_at = NOW()
  WHERE id = p_guide_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Part 6: 更新订阅详情函数
-- ============================================

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
  SELECT g.subscription_tier, g.subscription_status
  INTO v_tier, v_status
  FROM guides g
  WHERE g.id = p_guide_id;

  -- 简化：partner = 20%, 其他 = 10%
  IF v_tier = 'partner' THEN
    v_rate := 0.20;
  ELSE
    v_rate := 0.10;
  END IF;

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
      ELSE 1980.00
    END,
    v_entry_paid,
    CASE WHEN v_entry_paid THEN 200000.00 ELSE 0.00 END,
    CASE v_tier
      WHEN 'growth' THEN '{"commission": "10%固定", "support": "标准", "description": "初期合伙人"}'::JSONB
      WHEN 'partner' THEN '{"commission": "20%固定", "support": "专属", "priority_resources": true, "partner_certificate": true, "description": "金牌合伙人"}'::JSONB
      ELSE '{}'::JSONB
    END;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Part 7: 设置 guides 表默认值
-- ============================================

-- 将默认 commission_tier_code 从 'bronze' 改为 'growth'
ALTER TABLE guides ALTER COLUMN commission_tier_code SET DEFAULT 'growth';

-- ============================================
-- 完成
-- ============================================
