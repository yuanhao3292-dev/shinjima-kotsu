-- =====================================================
-- 114: 夜总会(店铺)预约佣金接通 —— 补齐 bookings 佣金列 + 到期释放 RPC
-- =====================================================
-- 此前 admin 完成夜总会预约只写 actual_spend,从不计佣 → 店铺佣金整条死线。
-- 本迁移让夜总会佣金进入与白标一致的"计算→14天锁定→成熟释放→提现"生命周期。
--
--   1. 补齐 bookings 的佣金列(IF NOT EXISTS,缺则加、有则跳过)
--   2. release_all_matured_booking_commissions():到期(commission_available_at ≤ now)
--      的 bookings 佣金 calculated → available,按净额(commission_amount -
--      withholding_tax_amount)累加进导游 available_balance,与白标口径一致。
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。

-- 1. 补齐佣金列
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS commission_amount INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS commission_status VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS commission_available_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS withholding_tax_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS withholding_tax_rate NUMERIC;
CREATE INDEX IF NOT EXISTS idx_bookings_commission_available_at ON bookings(commission_available_at);

-- 2. 批量释放到期夜总会佣金进导游可提现余额
CREATE OR REPLACE FUNCTION release_all_matured_booking_commissions()
RETURNS JSON AS $$
DECLARE
  v_total_net NUMERIC := 0;
  v_total_count INT := 0;
  v_guide_count INT := 0;
BEGIN
  WITH matured AS (
    SELECT id, guide_id,
           COALESCE(commission_amount, 0) - COALESCE(withholding_tax_amount, 0) AS net
    FROM bookings
    WHERE commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW()
  ),
  released AS (
    UPDATE bookings b
    SET commission_status = 'available', updated_at = NOW()
    FROM matured m
    WHERE b.id = m.id
    RETURNING m.guide_id, m.net
  ),
  per_guide AS (
    SELECT guide_id, SUM(net) AS net_sum, COUNT(*) AS cnt
    FROM released
    WHERE guide_id IS NOT NULL
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
