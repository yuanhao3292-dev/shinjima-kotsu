-- =====================================================
-- 113: 推荐 2% 奖励接通可提现(成熟释放进推荐人余额)+ clawback 回冲推荐奖励
-- =====================================================
-- 此前 referral_rewards 只写不结:永远不进 available_balance、无成熟机制,
-- 页面显示"待结算推荐奖励"却永远提不了现。本迁移接通:
--   1. 加 available_at 列(与被推荐人订单佣金同期成熟,14天)
--   2. 扩 status CHECK,加入 'available'(已释放进余额)与 'clawed_back'
--      (顺带修复 refund.ts 早已在写 'clawed_back' 却违反原 CHECK 的潜在 bug)
--   3. release_all_matured_referral_rewards():到期奖励释放进推荐人 available_balance
--   4. 重定义 clawback_commission:退款时,若对应推荐奖励已释放进推荐人余额,
--      同步回冲(clamp 到 0),消除推荐奖励侧的同类资金漏洞
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。

-- 1. 成熟时间列
ALTER TABLE referral_rewards ADD COLUMN IF NOT EXISTS available_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_referral_rewards_available_at ON referral_rewards(available_at);

-- 2. 扩展状态取值
ALTER TABLE referral_rewards DROP CONSTRAINT IF EXISTS referral_rewards_status_check;
ALTER TABLE referral_rewards ADD CONSTRAINT referral_rewards_status_check
  CHECK (status IN ('pending', 'confirmed', 'available', 'paid', 'cancelled', 'clawed_back'));

-- 3. 批量释放到期推荐奖励进推荐人可提现余额
CREATE OR REPLACE FUNCTION release_all_matured_referral_rewards()
RETURNS JSON AS $$
DECLARE
  v_total NUMERIC := 0;
  v_count INT := 0;
  v_referrer_count INT := 0;
BEGIN
  WITH matured AS (
    SELECT id, referrer_id, COALESCE(reward_amount, 0) AS amt
    FROM referral_rewards
    WHERE status = 'pending'
      AND available_at IS NOT NULL
      AND available_at <= NOW()
  ),
  released AS (
    UPDATE referral_rewards r
    SET status = 'available'
    FROM matured m
    WHERE r.id = m.id
    RETURNING m.referrer_id, m.amt
  ),
  per_referrer AS (
    SELECT referrer_id, SUM(amt) AS reward_sum, COUNT(*) AS cnt
    FROM released
    GROUP BY referrer_id
  ),
  credited AS (
    UPDATE guides g
    SET available_balance = COALESCE(g.available_balance, 0) + p.reward_sum,
        updated_at = NOW()
    FROM per_referrer p
    WHERE g.id = p.referrer_id
    RETURNING p.reward_sum, p.cnt
  )
  SELECT COALESCE(SUM(reward_sum), 0), COALESCE(SUM(cnt), 0), COUNT(*)
  INTO v_total, v_count, v_referrer_count
  FROM credited;

  RETURN json_build_object(
    'released_amount', v_total,
    'released_count', v_count,
    'referrer_count', v_referrer_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 重定义 clawback_commission:在 111 的基础上,增加"推荐奖励已释放则回冲推荐人余额"
CREATE OR REPLACE FUNCTION clawback_commission(
  p_order_id UUID,
  p_guide_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_status TEXT;
  v_gross NUMERIC;
  v_net NUMERIC;
  v_current_balance NUMERIC;
  v_deducted NUMERIC := 0;
  v_shortfall NUMERIC := 0;
  v_ref_status TEXT;
  v_ref_referrer UUID;
  v_ref_amt NUMERIC;
BEGIN
  SELECT commission_status,
         COALESCE(commission_amount, 0),
         COALESCE(commission_amount, 0) - COALESCE(withholding_tax_amount, 0)
  INTO v_status, v_gross, v_net
  FROM white_label_orders
  WHERE source_order_id = p_order_id AND guide_id = p_guide_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('result', 'not_found');
  END IF;
  IF v_status = 'clawed_back' THEN
    RETURN json_build_object('result', 'already_clawed_back');
  END IF;

  UPDATE white_label_orders
  SET commission_status = 'clawed_back', updated_at = NOW()
  WHERE source_order_id = p_order_id AND guide_id = p_guide_id;

  SELECT COALESCE(available_balance, 0) INTO v_current_balance
  FROM guides WHERE id = p_guide_id FOR UPDATE;

  UPDATE guides
  SET total_commission = GREATEST(COALESCE(total_commission, 0) - v_gross, 0),
      updated_at = NOW()
  WHERE id = p_guide_id;

  IF v_status = 'available' THEN
    v_deducted := LEAST(v_current_balance, v_net);
    v_shortfall := v_net - v_deducted;
    UPDATE guides
    SET available_balance = v_current_balance - v_deducted,
        updated_at = NOW()
    WHERE id = p_guide_id;
    IF v_shortfall > 0 THEN
      RAISE WARNING '[clawback] 佣金余额不足回冲: guide=%, order=%, shortfall=%', p_guide_id, p_order_id, v_shortfall;
    END IF;
  END IF;

  -- 推荐奖励:若已释放进推荐人余额,回冲(clamp 到 0);否则仅标记
  SELECT status, referrer_id, COALESCE(reward_amount, 0)
  INTO v_ref_status, v_ref_referrer, v_ref_amt
  FROM referral_rewards
  WHERE booking_id = p_order_id
  FOR UPDATE;

  IF FOUND AND v_ref_status IS DISTINCT FROM 'clawed_back' THEN
    UPDATE referral_rewards SET status = 'clawed_back' WHERE booking_id = p_order_id;
    IF v_ref_status = 'available' AND v_ref_referrer IS NOT NULL THEN
      UPDATE guides
      SET available_balance = GREATEST(COALESCE(available_balance, 0) - v_ref_amt, 0),
          updated_at = NOW()
      WHERE id = v_ref_referrer;
    END IF;
  END IF;

  RETURN json_build_object(
    'result', 'clawed_back',
    'prior_status', v_status,
    'gross', v_gross,
    'net', v_net,
    'balance_deducted', v_deducted,
    'shortfall', v_shortfall,
    'referral_reversed', CASE WHEN v_ref_status = 'available' THEN v_ref_amt ELSE 0 END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
