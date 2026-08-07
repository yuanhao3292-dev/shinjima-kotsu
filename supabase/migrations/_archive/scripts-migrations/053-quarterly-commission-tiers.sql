-- ============================================
-- 佣金等级系统升级：改为季度计算
-- Commission Tiers Update: Quarterly Calculation
-- ============================================

-- 1. 添加新字段（保留旧字段兼容）
ALTER TABLE commission_tiers ADD COLUMN IF NOT EXISTS min_quarterly_sales DECIMAL(12,2) DEFAULT 0;

-- 2. 更新等级阈值（新标准：季度销售额）
-- 铜牌: 0
-- 银牌: 100万日元/季度
-- 金牌: 300万日元/季度
-- 钻石: 500万日元/季度
UPDATE commission_tiers SET
  min_quarterly_sales = 0,
  min_monthly_sales = 0,
  updated_at = NOW()
WHERE tier_code = 'bronze';

UPDATE commission_tiers SET
  min_quarterly_sales = 1000000,
  min_monthly_sales = 1000000,  -- 保持同步用于前端显示
  updated_at = NOW()
WHERE tier_code = 'silver';

UPDATE commission_tiers SET
  min_quarterly_sales = 3000000,
  min_monthly_sales = 3000000,  -- 保持同步用于前端显示
  updated_at = NOW()
WHERE tier_code = 'gold';

UPDATE commission_tiers SET
  min_quarterly_sales = 5000000,
  min_monthly_sales = 5000000,  -- 保持同步用于前端显示
  updated_at = NOW()
WHERE tier_code = 'diamond';

-- 3. 更新等级计算函数：改为季度计算
CREATE OR REPLACE FUNCTION check_and_upgrade_guide_tier(p_guide_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  v_quarterly_sales DECIMAL(12,2);
  v_new_tier_id UUID;
  v_new_tier_code VARCHAR(20);
  v_quarter_start DATE;
BEGIN
  -- 计算当前季度的开始日期
  -- Q1: 1-3月, Q2: 4-6月, Q3: 7-9月, Q4: 10-12月
  v_quarter_start := DATE_TRUNC('quarter', CURRENT_DATE);

  -- 计算当前季度的销售额
  SELECT COALESCE(SUM(order_amount), 0) INTO v_quarterly_sales
  FROM whitelabel_orders
  WHERE guide_id = p_guide_id
    AND status = 'completed'
    AND created_at >= v_quarter_start;

  -- 查找适合的最高等级（使用季度销售额）
  SELECT id, tier_code INTO v_new_tier_id, v_new_tier_code
  FROM commission_tiers
  WHERE is_active = true
    AND min_quarterly_sales <= v_quarterly_sales
  ORDER BY min_quarterly_sales DESC
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

-- 4. 创建季度等级重置函数（每季度初调用）
CREATE OR REPLACE FUNCTION reset_quarterly_tiers()
RETURNS INT AS $$
DECLARE
  v_affected_count INT := 0;
  v_guide RECORD;
BEGIN
  -- 遍历所有活跃导游，重新计算等级
  FOR v_guide IN
    SELECT id FROM guides WHERE status = 'active'
  LOOP
    PERFORM check_and_upgrade_guide_tier(v_guide.id);
    v_affected_count := v_affected_count + 1;
  END LOOP;

  RETURN v_affected_count;
END;
$$ LANGUAGE plpgsql;

-- 5. 创建获取导游季度销售额的函数
CREATE OR REPLACE FUNCTION get_guide_quarterly_sales(p_guide_id UUID)
RETURNS DECIMAL(12,2) AS $$
DECLARE
  v_quarterly_sales DECIMAL(12,2);
  v_quarter_start DATE;
BEGIN
  v_quarter_start := DATE_TRUNC('quarter', CURRENT_DATE);

  SELECT COALESCE(SUM(order_amount), 0) INTO v_quarterly_sales
  FROM whitelabel_orders
  WHERE guide_id = p_guide_id
    AND status = 'completed'
    AND created_at >= v_quarter_start;

  RETURN v_quarterly_sales;
END;
$$ LANGUAGE plpgsql;

-- 6. 创建获取距离下一等级所需金额的函数
CREATE OR REPLACE FUNCTION get_guide_next_tier_info(p_guide_id UUID)
RETURNS TABLE (
  current_tier_code VARCHAR(20),
  current_tier_name VARCHAR(50),
  current_commission_rate DECIMAL(5,2),
  quarterly_sales DECIMAL(12,2),
  next_tier_code VARCHAR(20),
  next_tier_name VARCHAR(50),
  next_tier_threshold DECIMAL(12,2),
  amount_needed DECIMAL(12,2),
  progress_percent DECIMAL(5,2)
) AS $$
DECLARE
  v_quarterly_sales DECIMAL(12,2);
  v_current_tier RECORD;
  v_next_tier RECORD;
BEGIN
  -- 获取季度销售额
  v_quarterly_sales := get_guide_quarterly_sales(p_guide_id);

  -- 获取当前等级
  SELECT ct.* INTO v_current_tier
  FROM guides g
  JOIN commission_tiers ct ON g.commission_tier_id = ct.id
  WHERE g.id = p_guide_id;

  -- 获取下一等级
  SELECT * INTO v_next_tier
  FROM commission_tiers
  WHERE is_active = true
    AND min_quarterly_sales > COALESCE(v_current_tier.min_quarterly_sales, 0)
  ORDER BY min_quarterly_sales ASC
  LIMIT 1;

  RETURN QUERY SELECT
    v_current_tier.tier_code,
    v_current_tier.tier_name_zh,
    v_current_tier.commission_rate,
    v_quarterly_sales,
    v_next_tier.tier_code,
    v_next_tier.tier_name_zh,
    v_next_tier.min_quarterly_sales,
    GREATEST(0, v_next_tier.min_quarterly_sales - v_quarterly_sales),
    CASE
      WHEN v_next_tier.min_quarterly_sales IS NULL THEN 100.00
      WHEN v_next_tier.min_quarterly_sales = 0 THEN 100.00
      ELSE LEAST(100.00, (v_quarterly_sales / v_next_tier.min_quarterly_sales * 100))
    END;
END;
$$ LANGUAGE plpgsql;

-- 7. 添加季度重置日志表
CREATE TABLE IF NOT EXISTS tier_reset_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter_start DATE NOT NULL,
  affected_guides INT DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  executed_by VARCHAR(100) DEFAULT 'system'
);

-- ============================================
-- 完成
-- ============================================
