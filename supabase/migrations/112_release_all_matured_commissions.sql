-- =====================================================
-- 112: 批量释放到期佣金(供定时任务调用)
-- =====================================================
-- 背景:release_matured_commissions(p_guide_id) 是按单个导游释放,且只在
-- /api/withdrawal GET/POST 时被调用 —— 状态推进完全依赖导游本人打开提现页。
-- 若导游从不打开提现页,其佣金永远停在 'calculated'、available_balance 永不更新。
--
-- 本 RPC 对全体导游一次性释放到期佣金(与 101 的单导游逻辑口径一致:按净额
-- commission_amount - withholding_tax_amount 入 available_balance),供每日 cron 调用。
-- 用单条多 CTE 语句保证快照一致(状态置 available 与余额累加基于同一批订单)。
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。

CREATE OR REPLACE FUNCTION release_all_matured_commissions()
RETURNS JSON AS $$
DECLARE
  v_total_net NUMERIC := 0;
  v_total_count INT := 0;
  v_guide_count INT := 0;
BEGIN
  WITH matured AS (
    SELECT id, guide_id,
           COALESCE(commission_amount, 0) - COALESCE(withholding_tax_amount, 0) AS net
    FROM white_label_orders
    WHERE commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW()
  ),
  released_orders AS (
    UPDATE white_label_orders wlo
    SET commission_status = 'available', updated_at = NOW()
    FROM matured m
    WHERE wlo.id = m.id
    RETURNING m.guide_id, m.net
  ),
  per_guide AS (
    SELECT guide_id, SUM(net) AS net_sum, COUNT(*) AS cnt
    FROM released_orders
    GROUP BY guide_id
  ),
  credited AS (
    UPDATE guides g
    SET available_balance = COALESCE(g.available_balance, 0) + p.net_sum,
        updated_at = NOW()
    FROM per_guide p
    WHERE g.id = p.guide_id
    RETURNING p.net_sum, p.cnt
  )
  SELECT COALESCE(SUM(net_sum), 0), COALESCE(SUM(cnt), 0), COUNT(*)
  INTO v_total_net, v_total_count, v_guide_count
  FROM credited;

  RETURN json_build_object(
    'released_net', v_total_net,
    'released_count', v_total_count,
    'guide_count', v_guide_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
