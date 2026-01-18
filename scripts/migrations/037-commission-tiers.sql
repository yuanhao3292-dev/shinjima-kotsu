-- ============================================
-- 佣金等级配置系统
-- Commission Tiers System
-- ============================================

-- 佣金等级配置表（集中管理分成比例）
CREATE TABLE IF NOT EXISTS commission_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 等级标识
  tier_code VARCHAR(20) NOT NULL UNIQUE, -- 'bronze', 'silver', 'gold', 'diamond'
  tier_name_ja VARCHAR(50) NOT NULL,     -- '銅牌', '銀牌', '金牌', '鑽石'
  tier_name_zh VARCHAR(50) NOT NULL,     -- '铜牌', '银牌', '金牌', '钻石'
  tier_name_en VARCHAR(50) NOT NULL,     -- 'Bronze', 'Silver', 'Gold', 'Diamond'
  -- 等级条件
  min_monthly_sales DECIMAL(12,2) DEFAULT 0,        -- 升级所需月销售额
  min_total_orders INT DEFAULT 0,                    -- 升级所需累计订单数
  -- 佣金比例（百分比）
  commission_rate DECIMAL(5,2) NOT NULL,             -- 基础佣金率（如 10.00 表示 10%）
  -- 适用订单类型（NULL 表示全部适用）
  applicable_order_types TEXT[] DEFAULT NULL,
  -- 显示配置
  badge_color VARCHAR(20) DEFAULT '#CD7F32',         -- 徽章颜色
  sort_order INT DEFAULT 0,                          -- 排序
  is_active BOOLEAN DEFAULT true,
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_commission_tiers_code ON commission_tiers(tier_code);
CREATE INDEX IF NOT EXISTS idx_commission_tiers_active ON commission_tiers(is_active);

-- 插入默认等级
INSERT INTO commission_tiers (tier_code, tier_name_ja, tier_name_zh, tier_name_en, min_monthly_sales, commission_rate, badge_color, sort_order)
VALUES
  ('bronze', '銅牌合夥人', '铜牌合伙人', 'Bronze Partner', 0, 10.00, '#CD7F32', 1),
  ('silver', '銀牌合夥人', '银牌合伙人', 'Silver Partner', 500000, 12.00, '#C0C0C0', 2),
  ('gold', '金牌合夥人', '金牌合伙人', 'Gold Partner', 1500000, 15.00, '#FFD700', 3),
  ('diamond', '鑽石合夥人', '钻石合伙人', 'Diamond Partner', 5000000, 20.00, '#B9F2FF', 4)
ON CONFLICT (tier_code) DO UPDATE SET
  commission_rate = EXCLUDED.commission_rate,
  min_monthly_sales = EXCLUDED.min_monthly_sales,
  updated_at = NOW();

-- ============================================
-- 为 guides 表添加佣金等级关联
-- ============================================
ALTER TABLE guides ADD COLUMN IF NOT EXISTS commission_tier_id UUID REFERENCES commission_tiers(id);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS commission_tier_code VARCHAR(20) DEFAULT 'bronze';

-- 设置默认等级
UPDATE guides
SET commission_tier_id = (SELECT id FROM commission_tiers WHERE tier_code = 'bronze'),
    commission_tier_code = 'bronze'
WHERE commission_tier_id IS NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_guides_commission_tier ON guides(commission_tier_id);

-- ============================================
-- 为 whitelabel_orders 表添加归属字段
-- ============================================
-- 添加原始订单关联（如 medical_packages 的 orders 表）
ALTER TABLE whitelabel_orders ADD COLUMN IF NOT EXISTS source_order_id UUID;
ALTER TABLE whitelabel_orders ADD COLUMN IF NOT EXISTS source_order_table VARCHAR(50);

-- 添加计算时使用的佣金率记录（冻结历史）
ALTER TABLE whitelabel_orders ADD COLUMN IF NOT EXISTS applied_commission_rate DECIMAL(5,2);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_source ON whitelabel_orders(source_order_id);

-- ============================================
-- 创建获取导游佣金率的函数
-- ============================================
CREATE OR REPLACE FUNCTION get_guide_commission_rate(p_guide_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_rate DECIMAL(5,2);
BEGIN
  SELECT ct.commission_rate INTO v_rate
  FROM guides g
  JOIN commission_tiers ct ON g.commission_tier_id = ct.id
  WHERE g.id = p_guide_id AND ct.is_active = true;

  -- 默认返回 10% 如果没有找到
  RETURN COALESCE(v_rate, 10.00);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 创建计算佣金的函数
-- ============================================
CREATE OR REPLACE FUNCTION calculate_commission(
  p_amount DECIMAL(12,2),
  p_guide_id UUID,
  p_include_tax BOOLEAN DEFAULT true
)
RETURNS TABLE (
  net_amount DECIMAL(12,2),
  commission_rate DECIMAL(5,2),
  commission_amount DECIMAL(12,2)
) AS $$
DECLARE
  v_rate DECIMAL(5,2);
  v_net DECIMAL(12,2);
  v_commission DECIMAL(12,2);
BEGIN
  -- 获取导游的佣金率
  v_rate := get_guide_commission_rate(p_guide_id);

  -- 如果金额含税，先扣除消费税（10%）
  IF p_include_tax THEN
    v_net := p_amount / 1.1;
  ELSE
    v_net := p_amount;
  END IF;

  -- 计算佣金
  v_commission := ROUND(v_net * v_rate / 100, 0);

  RETURN QUERY SELECT v_net, v_rate, v_commission;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 创建自动升级等级的函数
-- ============================================
CREATE OR REPLACE FUNCTION check_and_upgrade_guide_tier(p_guide_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  v_monthly_sales DECIMAL(12,2);
  v_new_tier_id UUID;
  v_new_tier_code VARCHAR(20);
BEGIN
  -- 计算过去30天的销售额
  SELECT COALESCE(SUM(order_amount), 0) INTO v_monthly_sales
  FROM whitelabel_orders
  WHERE guide_id = p_guide_id
    AND status = 'completed'
    AND created_at >= NOW() - INTERVAL '30 days';

  -- 查找适合的最高等级
  SELECT id, tier_code INTO v_new_tier_id, v_new_tier_code
  FROM commission_tiers
  WHERE is_active = true
    AND min_monthly_sales <= v_monthly_sales
  ORDER BY min_monthly_sales DESC
  LIMIT 1;

  -- 更新导游等级
  IF v_new_tier_id IS NOT NULL THEN
    UPDATE guides
    SET commission_tier_id = v_new_tier_id,
        commission_tier_code = v_new_tier_code,
        updated_at = NOW()
    WHERE id = p_guide_id
      AND (commission_tier_id IS NULL OR commission_tier_id != v_new_tier_id);
  END IF;

  RETURN v_new_tier_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 触发器：订单完成时自动检查升级
-- ============================================
CREATE OR REPLACE FUNCTION trigger_check_tier_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  -- 只在订单完成时检查
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM check_and_upgrade_guide_tier(NEW.guide_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_whitelabel_order_tier_check ON whitelabel_orders;
CREATE TRIGGER trigger_whitelabel_order_tier_check
  AFTER INSERT OR UPDATE ON whitelabel_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_tier_upgrade();

-- ============================================
-- RLS 策略
-- ============================================
ALTER TABLE commission_tiers ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看佣金等级（公开信息）
CREATE POLICY "Anyone can view commission tiers" ON commission_tiers
  FOR SELECT USING (true);

-- 只有管理员可以修改
CREATE POLICY "Only admins can modify commission tiers" ON commission_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM guides
      WHERE auth_user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- 为 orders 表添加白标归属字段
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referred_by_guide_id UUID REFERENCES guides(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referred_by_guide_slug VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(12,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_status VARCHAR(20) DEFAULT 'pending'
  CHECK (commission_status IN ('pending', 'calculated', 'paid'));

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_orders_guide ON orders(referred_by_guide_id);
CREATE INDEX IF NOT EXISTS idx_orders_commission_status ON orders(commission_status);

-- ============================================
-- 完成
-- ============================================
