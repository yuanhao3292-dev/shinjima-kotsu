-- ============================================
-- 佣金2周等待期
-- Commission 2-Week Waiting Period
-- ============================================
-- 客人完成体检/治疗后2周，佣金才可提现
-- After customer completes service + 2 weeks, commission becomes withdrawable

-- 1. 添加 commission_available_at 列到 whitelabel_orders
ALTER TABLE whitelabel_orders ADD COLUMN IF NOT EXISTS commission_available_at TIMESTAMPTZ;

-- 2. 更新 commission_status 的 CHECK 约束，添加 'available' 状态
-- 先移除旧约束（如果存在）
ALTER TABLE whitelabel_orders DROP CONSTRAINT IF EXISTS whitelabel_orders_commission_status_check;
-- 添加新约束（pending → calculated → available → paid）
ALTER TABLE whitelabel_orders ADD CONSTRAINT whitelabel_orders_commission_status_check
  CHECK (commission_status IN ('pending', 'calculated', 'available', 'paid'));

-- 3. 创建索引（加速查询待释放佣金）
CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_commission_available
  ON whitelabel_orders(guide_id, commission_status, commission_available_at);

-- 4. 创建 RPC 函数：释放到期佣金
-- 当佣金超过等待期（commission_available_at <= NOW()），
-- 将 commission_status 从 'calculated' 改为 'available'，
-- 并将佣金金额加入 guides.available_balance
CREATE OR REPLACE FUNCTION release_matured_commissions(p_guide_id UUID)
RETURNS JSON AS $$
DECLARE
  v_release_amount NUMERIC;
  v_release_count INT;
BEGIN
  -- 计算待释放金额
  SELECT COALESCE(SUM(commission_amount), 0), COUNT(*)
  INTO v_release_amount, v_release_count
  FROM whitelabel_orders
  WHERE guide_id = p_guide_id
    AND commission_status = 'calculated'
    AND commission_available_at IS NOT NULL
    AND commission_available_at <= NOW();

  IF v_release_amount > 0 THEN
    -- 更新佣金状态为 available
    UPDATE whitelabel_orders
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

-- 5. 回填现有数据
-- 对于已有的 whitelabel_orders 记录（commission_status = 'calculated'），
-- 如果没有 commission_available_at，设置为 created_at + 14 天
UPDATE whitelabel_orders
SET commission_available_at = created_at + INTERVAL '14 days'
WHERE commission_available_at IS NULL
  AND commission_status IN ('calculated', 'paid');

-- 对于已经超过等待期的记录，将状态更新为 available
-- 并将金额加入导游的 available_balance
DO $$
DECLARE
  guide_rec RECORD;
  v_release_amount NUMERIC;
BEGIN
  -- 找到所有有待释放佣金的导游
  FOR guide_rec IN
    SELECT DISTINCT guide_id
    FROM whitelabel_orders
    WHERE commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW()
  LOOP
    -- 计算该导游待释放金额
    SELECT COALESCE(SUM(commission_amount), 0) INTO v_release_amount
    FROM whitelabel_orders
    WHERE guide_id = guide_rec.guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    -- 更新佣金状态
    UPDATE whitelabel_orders
    SET commission_status = 'available',
        updated_at = NOW()
    WHERE guide_id = guide_rec.guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    -- 更新可提现余额
    UPDATE guides
    SET available_balance = COALESCE(available_balance, 0) + v_release_amount,
        updated_at = NOW()
    WHERE id = guide_rec.guide_id;

    RAISE NOTICE '回填释放: guide=%, amount=%', guide_rec.guide_id, v_release_amount;
  END LOOP;
END;
$$;

-- 6. 添加注释
COMMENT ON COLUMN whitelabel_orders.commission_available_at IS '佣金可提现时间（服务完成日期 + 14天等待期）';

-- ============================================
-- 验证
-- ============================================
-- SELECT id, guide_id, commission_amount, commission_status, commission_available_at
-- FROM whitelabel_orders ORDER BY created_at DESC LIMIT 10;
--
-- SELECT id, name, total_commission, available_balance, total_withdrawn
-- FROM guides WHERE total_commission > 0;
