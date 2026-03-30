-- ============================================
-- 安全修复 #4: 防止并发创建重复 pending 订单
-- 添加 partial unique index，同一客户+套餐只能有一个 pending 订单
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_order_per_customer_package
  ON orders (customer_id, package_id)
  WHERE status = 'pending';

-- ============================================
-- 安全修复 #5: 佣金计算原子化 RPC
-- 将 orders 更新 + white_label_orders 插入 + 导游余额递增
-- 封装在单个事务中，任一步骤失败则全部回滚
-- ============================================

-- 先确保 source_order_id 有唯一约束（幂等性依赖）
CREATE UNIQUE INDEX IF NOT EXISTS idx_wl_orders_source_order_id_unique
  ON white_label_orders (source_order_id)
  WHERE source_order_id IS NOT NULL;

CREATE OR REPLACE FUNCTION calculate_and_record_commission(
  p_order_id UUID,
  p_guide_id UUID,
  p_commission_amount INTEGER,
  p_commission_tax INTEGER,
  p_commission_net INTEGER,
  p_commission_rate NUMERIC,
  p_applied_commission_rate NUMERIC DEFAULT 0,
  p_order_amount INTEGER DEFAULT 0,
  p_order_type TEXT DEFAULT 'medical',
  p_module_id UUID DEFAULT NULL,
  p_withholding_tax_amount INTEGER DEFAULT 0,
  p_withholding_tax_rate NUMERIC DEFAULT 0
) RETURNS INTEGER AS $$
DECLARE
  v_new_total INTEGER;
BEGIN
  -- Step 1: 更新订单佣金信息
  UPDATE orders SET
    commission_amount = p_commission_amount,
    commission_status = 'calculated'
  WHERE id = p_order_id;

  -- Step 2: 创建 white_label_orders 记录（忽略已存在的）
  INSERT INTO white_label_orders (
    source_order_id, source_order_table, guide_id, module_id,
    order_type, order_amount, order_currency,
    commission_rate, applied_commission_rate, commission_amount,
    commission_status, withholding_tax_amount, withholding_tax_rate,
    status, customer_name, service_type, service_name, total_amount
  ) VALUES (
    p_order_id, 'orders', p_guide_id, p_module_id,
    p_order_type, p_order_amount, 'JPY',
    p_commission_rate, p_applied_commission_rate, p_commission_amount,
    'calculated', p_withholding_tax_amount, p_withholding_tax_rate,
    'completed', '', p_order_type, '', p_order_amount
  ) ON CONFLICT (source_order_id) WHERE source_order_id IS NOT NULL DO NOTHING;

  -- Step 3: 原子递增导游余额
  UPDATE guides SET
    total_commission = COALESCE(total_commission, 0) + p_commission_amount,
    available_balance = COALESCE(available_balance, 0) + p_commission_net
  WHERE id = p_guide_id
  RETURNING available_balance INTO v_new_total;

  RETURN COALESCE(v_new_total, 0);
END;
$$ LANGUAGE plpgsql;
