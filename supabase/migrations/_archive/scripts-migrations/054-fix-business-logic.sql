-- ============================================
-- 商业逻辑修复迁移
-- Business Logic Fix Migration
-- ============================================
-- 修复审计发现的关键商业逻辑问题:
--   P0 #1: calculate_commission 触发器不使用阶梯费率
--   P0 #2: 提现从 approved→rejected 时余额不退还
--   P2 #7: 等级升级只看 whitelabel_orders，不看 bookings
--   P2 #8: 佣金触发器无状态守卫
--   P2 #9: 预约统计不可逆 + available_balance 不更新

-- ============================================
-- FIX #1 + #8: calculate_commission() 触发器
-- 问题: 始终使用 bookings.commission_rate 默认值 0.10 (10%)
--        忽略导游的阶梯佣金率; 且对已取消订单也会计算
-- 修复: 动态查询 commission_tiers 获取正确费率
--        添加订单状态守卫
-- ============================================

CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_tier_rate DECIMAL(5,2);
BEGIN
  -- 已取消/未到店的订单不计算佣金
  IF NEW.status IN ('cancelled', 'no_show') THEN
    RETURN NEW;
  END IF;

  IF NEW.actual_spend IS NOT NULL AND NEW.actual_spend > 0 THEN
    -- 从 commission_tiers 获取导游的动态佣金率
    SELECT ct.commission_rate INTO v_tier_rate
    FROM guides g
    JOIN commission_tiers ct ON g.commission_tier_id = ct.id AND ct.is_active = true
    WHERE g.id = NEW.guide_id;

    -- 使用阶梯费率（commission_tiers 存 10.00 代表 10%, bookings 存 0.10 代表 10%）
    IF v_tier_rate IS NOT NULL THEN
      NEW.commission_rate := v_tier_rate / 100;
    END IF;
    -- 如果未找到阶梯费率，保留 bookings 表的默认值 0.10

    -- 计算税前金额（扣除 10% 消费税）
    NEW.spend_before_tax := NEW.actual_spend / 1.1;
    -- 计算佣金（四舍五入到整数）
    NEW.commission_amount := ROUND(NEW.spend_before_tax * NEW.commission_rate, 0);
    NEW.commission_status := 'calculated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIX #2: process_withdrawal_request() 触发器
-- 问题: 拒绝已批准的提现时不退还冻结余额
--        因为条件只检查 OLD.status = 'pending'
-- 修复: 扩展为 OLD.status IN ('pending', 'approved')
-- ============================================

CREATE OR REPLACE FUNCTION process_withdrawal_request()
RETURNS TRIGGER AS $$
BEGIN
  -- 创建新申请时，检查余额是否足够并冻结
  IF TG_OP = 'INSERT' THEN
    IF (SELECT available_balance FROM guides WHERE id = NEW.guide_id) < NEW.amount THEN
      RAISE EXCEPTION '可提现余额不足';
    END IF;

    -- 冻结余额
    UPDATE guides
    SET available_balance = available_balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  -- 状态变更处理
  IF TG_OP = 'UPDATE' THEN
    -- 拒绝或取消时，退还冻结金额（无论从 pending 还是 approved 拒绝）
    IF NEW.status IN ('rejected', 'cancelled')
       AND OLD.status IN ('pending', 'approved') THEN
      UPDATE guides
      SET available_balance = available_balance + OLD.amount,
          updated_at = NOW()
      WHERE id = OLD.guide_id;
    END IF;

    -- 完成打款时，更新已提现总额
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      UPDATE guides
      SET total_withdrawn = total_withdrawn + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.guide_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIX #7 + #9: update_guide_stats() 触发器
-- 问题1: completed→cancelled 时统计不回退
-- 问题2: available_balance 在订单完成时不更新
-- 修复: 添加反向逻辑 + 同步更新 available_balance
-- ============================================

CREATE OR REPLACE FUNCTION update_guide_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 订单完成时：增加统计 + 增加可提现余额
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE guides
    SET
      total_bookings = total_bookings + 1,
      total_commission = total_commission + COALESCE(NEW.commission_amount, 0),
      available_balance = available_balance + COALESCE(NEW.commission_amount, 0),
      updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  -- 订单从完成变为其他状态时：回退统计 + 回退可提现余额
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE guides
    SET
      total_bookings = GREATEST(0, total_bookings - 1),
      total_commission = GREATEST(0, total_commission - COALESCE(OLD.commission_amount, 0)),
      available_balance = GREATEST(0, available_balance - COALESCE(OLD.commission_amount, 0)),
      updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIX #7: check_and_upgrade_guide_tier() 函数
-- 问题: 只统计 whitelabel_orders, 不统计 bookings
-- 修复: 合并两个表的季度销售额
-- ============================================

CREATE OR REPLACE FUNCTION check_and_upgrade_guide_tier(p_guide_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  v_quarterly_sales DECIMAL(12,2);
  v_new_tier_id UUID;
  v_new_tier_code VARCHAR(20);
  v_quarter_start DATE;
BEGIN
  -- 计算当前季度的开始日期
  v_quarter_start := DATE_TRUNC('quarter', CURRENT_DATE);

  -- 合并 whitelabel_orders 和 bookings 的季度销售额
  SELECT COALESCE(wl.total, 0) + COALESCE(bk.total, 0) INTO v_quarterly_sales
  FROM
    (SELECT COALESCE(SUM(order_amount), 0) AS total
     FROM whitelabel_orders
     WHERE guide_id = p_guide_id
       AND status = 'completed'
       AND created_at >= v_quarter_start) wl,
    (SELECT COALESCE(SUM(actual_spend), 0) AS total
     FROM bookings
     WHERE guide_id = p_guide_id
       AND status = 'completed'
       AND created_at >= v_quarter_start) bk;

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

-- ============================================
-- FIX #7: 为 bookings 添加等级升级检查触发器
-- 问题: 只有 whitelabel_orders 触发等级检查
-- 修复: bookings 完成时也检查等级升级
-- ============================================

CREATE OR REPLACE FUNCTION trigger_booking_tier_check()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM check_and_upgrade_guide_tier(NEW.guide_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_booking_tier_check ON bookings;
CREATE TRIGGER trigger_booking_tier_check
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_booking_tier_check();

-- ============================================
-- FIX #7: 更新 get_guide_quarterly_sales() 包含 bookings
-- ============================================

CREATE OR REPLACE FUNCTION get_guide_quarterly_sales(p_guide_id UUID)
RETURNS DECIMAL(12,2) AS $$
DECLARE
  v_quarterly_sales DECIMAL(12,2);
  v_quarter_start DATE;
BEGIN
  v_quarter_start := DATE_TRUNC('quarter', CURRENT_DATE);

  SELECT COALESCE(wl.total, 0) + COALESCE(bk.total, 0) INTO v_quarterly_sales
  FROM
    (SELECT COALESCE(SUM(order_amount), 0) AS total
     FROM whitelabel_orders
     WHERE guide_id = p_guide_id
       AND status = 'completed'
       AND created_at >= v_quarter_start) wl,
    (SELECT COALESCE(SUM(actual_spend), 0) AS total
     FROM bookings
     WHERE guide_id = p_guide_id
       AND status = 'completed'
       AND created_at >= v_quarter_start) bk;

  RETURN v_quarterly_sales;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 验证
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ 商业逻辑修复迁移完成';
  RAISE NOTICE '  P0 #1: calculate_commission — 使用动态阶梯费率 + 状态守卫';
  RAISE NOTICE '  P0 #2: process_withdrawal — 支持 approved→rejected 余额退还';
  RAISE NOTICE '  P2 #7: check_and_upgrade_guide_tier — 合并 bookings+whitelabel 销售额';
  RAISE NOTICE '  P2 #7: trigger_booking_tier_check — bookings 完成时触发等级检查';
  RAISE NOTICE '  P2 #9: update_guide_stats — 支持 completed→cancelled 统计回退';
  RAISE NOTICE '  P2 #9: update_guide_stats — 同步更新 available_balance';
END $$;
