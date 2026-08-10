-- =====================================================
-- 115: 清理 bookings 遗留触发器 + 按导游即时释放夜总会佣金
-- =====================================================
-- _archive/one-off/guide-partner-schema.sql 里给 bookings 挂了三个遗留触发器,
-- 全仓库从未 DROP。若它们在生产库仍激活,会与应用层(admin/bookings complete +
-- Stripe webhook)显式写入的佣金/推荐奖励逻辑双写、双记账:
--
--   trigger_calculate_commission (BEFORE UPDATE):重算 commission_amount,
--       覆盖 route 里按四舍五入+源泉徴収口径写入的值
--   trigger_update_guide_stats  (AFTER UPDATE→completed):total_commission +=
--       commission_amount,与 route 里的 increment_guide_commission 叠加 → 翻倍
--   trigger_create_referral_reward (AFTER UPDATE→calculated):自动建 2% 推荐奖励,
--       但 status='pending' 且【无 available_at】→ 迁移 113 的释放 RPC 永远跳过它,
--       奖励永久锁死提不出
--
-- 决策:让应用层代码成为 bookings 计佣/推荐奖励的唯一权威来源,清掉三个旧触发器。
-- DROP ... IF EXISTS 幂等:活着则清除(消除双记账),不存在则空操作 —— 与生产库
-- 当前是否挂着这些触发器无关,应用本迁移都安全。
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。

-- 1. 清理三个遗留触发器(保留其函数本体,无害;仅摘除自动执行)
DROP TRIGGER IF EXISTS trigger_calculate_commission ON bookings;
DROP TRIGGER IF EXISTS trigger_update_guide_stats ON bookings;
DROP TRIGGER IF EXISTS trigger_create_referral_reward ON bookings;

-- 2. 按导游即时释放到期夜总会佣金(供提现页打开时调用,与白标
--    release_matured_commissions(p_guide_id) 对齐;每日 cron 仍是全体兜底)
CREATE OR REPLACE FUNCTION release_matured_booking_commissions(p_guide_id UUID)
RETURNS JSON AS $$
DECLARE
  v_gross_amount NUMERIC;
  v_net_amount NUMERIC;
  v_release_count INT;
BEGIN
  SELECT
    COALESCE(SUM(commission_amount), 0),
    COALESCE(SUM(commission_amount - COALESCE(withholding_tax_amount, 0)), 0),
    COUNT(*)
  INTO v_gross_amount, v_net_amount, v_release_count
  FROM bookings
  WHERE guide_id = p_guide_id
    AND commission_status = 'calculated'
    AND commission_available_at IS NOT NULL
    AND commission_available_at <= NOW();

  IF v_release_count > 0 THEN
    UPDATE bookings
    SET commission_status = 'available',
        updated_at = NOW()
    WHERE guide_id = p_guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    UPDATE guides
    SET available_balance = COALESCE(available_balance, 0) + v_net_amount,
        updated_at = NOW()
    WHERE id = p_guide_id;
  END IF;

  RETURN json_build_object(
    'released_amount', v_net_amount,
    'gross_amount', v_gross_amount,
    'released_count', v_release_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
