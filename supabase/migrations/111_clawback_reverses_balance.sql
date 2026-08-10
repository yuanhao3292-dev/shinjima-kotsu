-- =====================================================
-- 111: 退款/争议 clawback 时同步回冲可提现余额(修复资金漏洞)
-- =====================================================
-- 背景:此前 lib/refund.ts 的 clawback 只递减 guides.total_commission(毛额累计),
-- 从不动 guides.available_balance。若佣金已成熟释放进 available_balance(甚至已
-- 提现)后才退款,导游可保留/提走已退款的钱 —— 真实资金损失。
--
-- 本 RPC 原子处理:锁订单行 + 锁导游行 →
--   1. 订单佣金状态置 clawed_back(幂等)
--   2. total_commission 递减毛额(clamp 到 0)
--   3. 若该单已释放(commission_status='available'),从 available_balance 回冲净额
--      (commission_amount - withholding_tax_amount);clamp 到 0 以尊重 104 的
--      available_balance >= 0 约束(已提现部分无法回收 → 记为 shortfall 告警)
--   4. 撤回对应推荐奖励
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件(且应先于/随代码上线)。

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
BEGIN
  -- 锁定并读取该在线单的佣金状态与金额
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

  -- 幂等:已撤回过的不再执行
  IF v_status = 'clawed_back' THEN
    RETURN json_build_object('result', 'already_clawed_back');
  END IF;

  -- 1. 标记订单佣金为已撤回
  UPDATE white_label_orders
  SET commission_status = 'clawed_back', updated_at = NOW()
  WHERE source_order_id = p_order_id AND guide_id = p_guide_id;

  -- 锁定导游行
  SELECT COALESCE(available_balance, 0) INTO v_current_balance
  FROM guides WHERE id = p_guide_id FOR UPDATE;

  -- 2. 递减累计佣金(毛额,clamp 到 0)
  UPDATE guides
  SET total_commission = GREATEST(COALESCE(total_commission, 0) - v_gross, 0),
      updated_at = NOW()
  WHERE id = p_guide_id;

  -- 3. 若佣金已释放进可提现余额,回冲净额;clamp 到 0(已提现部分记为缺口)
  IF v_status = 'available' THEN
    v_deducted := LEAST(v_current_balance, v_net);
    v_shortfall := v_net - v_deducted;
    UPDATE guides
    SET available_balance = v_current_balance - v_deducted,
        updated_at = NOW()
    WHERE id = p_guide_id;

    IF v_shortfall > 0 THEN
      RAISE WARNING '[clawback] 余额不足回冲: guide=%, order=%, net=%, deducted=%, shortfall=% (可能已提现)',
        p_guide_id, p_order_id, v_net, v_deducted, v_shortfall;
    END IF;
  END IF;

  -- 4. 撤回对应推荐奖励
  UPDATE referral_rewards
  SET status = 'clawed_back'
  WHERE booking_id = p_order_id;

  RETURN json_build_object(
    'result', 'clawed_back',
    'prior_status', v_status,
    'gross', v_gross,
    'net', v_net,
    'balance_deducted', v_deducted,
    'shortfall', v_shortfall
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
