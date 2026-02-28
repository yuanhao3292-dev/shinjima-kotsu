-- =====================================================
-- 077: Fix DB Functions — whitelabel_orders → white_label_orders
-- 所有 DB 函数统一使用正确表名 white_label_orders
-- =====================================================

-- =====================================================
-- 1. release_matured_commissions — 释放到期佣金（提现核心）
-- =====================================================

CREATE OR REPLACE FUNCTION release_matured_commissions(p_guide_id UUID)
RETURNS JSON AS $$
DECLARE
  v_release_amount NUMERIC;
  v_release_count INT;
BEGIN
  -- 计算待释放金额
  SELECT COALESCE(SUM(commission_amount), 0), COUNT(*)
  INTO v_release_amount, v_release_count
  FROM white_label_orders
  WHERE guide_id = p_guide_id
    AND commission_status = 'calculated'
    AND commission_available_at IS NOT NULL
    AND commission_available_at <= NOW();

  IF v_release_amount > 0 THEN
    -- 更新佣金状态为 available
    UPDATE white_label_orders
    SET commission_status = 'available',
        updated_at = NOW()
    WHERE guide_id = p_guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    -- 将释放的金额加入可提现余额
    UPDATE guides
    SET available_balance = COALESCE(available_balance, 0) + v_release_amount,
        updated_at = NOW()
    WHERE id = p_guide_id;

    RAISE NOTICE '释放佣金: guide=%, amount=%, count=%', p_guide_id, v_release_amount, v_release_count;
  END IF;

  RETURN json_build_object(
    'released_amount', v_release_amount,
    'released_count', v_release_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. check_and_upgrade_guide_tier — 季度等级升级检查
-- =====================================================

CREATE OR REPLACE FUNCTION check_and_upgrade_guide_tier(p_guide_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  v_quarterly_sales DECIMAL(12,2);
  v_new_tier_id UUID;
  v_new_tier_code VARCHAR(20);
  v_quarter_start DATE;
BEGIN
  v_quarter_start := DATE_TRUNC('quarter', CURRENT_DATE);

  -- 合并 white_label_orders 和 bookings 的季度销售额
  SELECT COALESCE(wl.total, 0) + COALESCE(bk.total, 0) INTO v_quarterly_sales
  FROM
    (SELECT COALESCE(SUM(order_amount), 0) AS total
     FROM white_label_orders
     WHERE guide_id = p_guide_id
       AND status = 'completed'
       AND created_at >= v_quarter_start) wl,
    (SELECT COALESCE(SUM(actual_spend), 0) AS total
     FROM bookings
     WHERE guide_id = p_guide_id
       AND status = 'completed'
       AND created_at >= v_quarter_start) bk;

  SELECT id, tier_code INTO v_new_tier_id, v_new_tier_code
  FROM commission_tiers
  WHERE is_active = true
    AND min_quarterly_sales <= v_quarterly_sales
  ORDER BY min_quarterly_sales DESC
  LIMIT 1;

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

-- =====================================================
-- 3. get_guide_quarterly_sales — 季度销售额查询
-- =====================================================

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
     FROM white_label_orders
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

-- =====================================================
-- 4. audit_whitelabel_order — 审计触发器函数
-- （函数本身不引用表名，但触发器绑定需要更新）
-- =====================================================

-- 删除旧表上的触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_audit_whitelabel_order ON whitelabel_orders;
DROP TRIGGER IF EXISTS trigger_audit_whitelabel_order ON white_label_orders;

-- 重新绑定到正确的表
CREATE TRIGGER trigger_audit_whitelabel_order
  AFTER INSERT OR UPDATE ON white_label_orders
  FOR EACH ROW
  EXECUTE FUNCTION audit_whitelabel_order();

-- =====================================================
-- 5. 验证（取消注释后手动执行）
-- =====================================================
-- SELECT proname, prosrc FROM pg_proc WHERE proname = 'release_matured_commissions';
-- SELECT proname, prosrc FROM pg_proc WHERE proname = 'check_and_upgrade_guide_tier';
-- SELECT proname, prosrc FROM pg_proc WHERE proname = 'get_guide_quarterly_sales';
-- SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname = 'trigger_audit_whitelabel_order';
