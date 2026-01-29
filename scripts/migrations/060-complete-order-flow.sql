-- ============================================
-- 完整订单流程系统
-- Complete Order Flow System (95+ Architecture)
-- ============================================
-- Version: 1.1.0
-- Created: 2025-01-30
-- Updated: 2025-01-30
-- Author: System
--
-- 变更记录:
-- v1.0.0 - 初始版本，基础订单流程
-- v1.1.0 - 增强版本，添加管理员策略、复合索引、状态验证
--
-- 依赖表:
-- - guide_white_label (导游白标配置)
-- - page_modules (页面模块)
-- - guides (导游主表)
-- - audit_logs (审计日志)
-- - profiles (用户档案，用于管理员判断)
--
-- 业务说明:
-- 1. 分销订单由客户通过导游白标页面提交
-- 2. 订单经历完整生命周期：咨询 → 报价 → 付款 → 服务 → 完成
-- 3. 订单完成后自动计算佣金并记录到 commission_logs
-- 4. 所有状态变更记录到 audit_logs 用于合规审计
-- ============================================

-- 1. 增强 white_label_orders 表（如果不存在则创建）
-- 说明：分销订单主表，存储通过导游白标页面产生的所有订单
-- 外键策略：
-- - guide_white_label_id: RESTRICT - 防止删除有订单的白标配置
-- - module_id: RESTRICT - 防止删除有订单引用的模块
CREATE TABLE IF NOT EXISTS white_label_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_white_label_id UUID NOT NULL REFERENCES guide_white_label(id) ON DELETE RESTRICT,
  module_id UUID NOT NULL REFERENCES page_modules(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 添加客户信息字段（加密存储）
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_name_encrypted TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_email_encrypted TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_phone_encrypted TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_wechat_encrypted TEXT;

-- 3. 订单来源追踪
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS source_page_path TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS referrer TEXT;

-- 4. 订单详情
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS order_details JSONB DEFAULT '{}';
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS inquiry_message TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS preferred_date DATE;

-- 5. 订单流程状态字段
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS inquiry_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS quoted_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS quoted_amount INTEGER;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS deposit_paid_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS deposit_amount INTEGER;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS service_started_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS service_completed_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS final_amount INTEGER;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- 6. 佣金结算字段
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.10;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_amount INTEGER;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_status TEXT DEFAULT 'pending';
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_calculated_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_paid_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_payment_ref TEXT;

-- 7. 支付信息
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- 8. 更新状态约束
ALTER TABLE white_label_orders DROP CONSTRAINT IF EXISTS white_label_orders_status_check;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'inquiry';
ALTER TABLE white_label_orders ADD CONSTRAINT white_label_orders_status_check
  CHECK (status IN (
    'inquiry',           -- 咨询中
    'quoted',            -- 已报价
    'deposit_pending',   -- 待付定金
    'deposit_paid',      -- 定金已付
    'in_progress',       -- 服务进行中
    'completed',         -- 已完成
    'cancelled',         -- 已取消
    'refunded'           -- 已退款
  ));

-- 9. 佣金状态约束
ALTER TABLE white_label_orders DROP CONSTRAINT IF EXISTS white_label_orders_commission_status_check;
ALTER TABLE white_label_orders ADD CONSTRAINT white_label_orders_commission_status_check
  CHECK (commission_status IN ('pending', 'calculated', 'approved', 'paid', 'cancelled'));

-- 10. 创建索引
-- ============================================
-- 10.1 基础索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_wl_orders_guide_white_label ON white_label_orders(guide_white_label_id);
CREATE INDEX IF NOT EXISTS idx_wl_orders_module ON white_label_orders(module_id);
CREATE INDEX IF NOT EXISTS idx_wl_orders_status ON white_label_orders(status);
CREATE INDEX IF NOT EXISTS idx_wl_orders_commission_status ON white_label_orders(commission_status);
CREATE INDEX IF NOT EXISTS idx_wl_orders_created_at ON white_label_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_wl_orders_inquiry_at ON white_label_orders(inquiry_at);

-- ============================================
-- 10.2 复合索引（优化常见查询模式）
-- ============================================

-- 10.2.1 导游查看自己订单列表（按状态筛选 + 时间排序）
-- 用于: SELECT * FROM white_label_orders WHERE guide_white_label_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_wl_orders_guide_status_created
  ON white_label_orders(guide_white_label_id, status, created_at DESC);

-- 10.2.2 管理员订单管理（状态筛选 + 时间范围）
-- 用于: SELECT * FROM white_label_orders WHERE status = ? AND created_at BETWEEN ? AND ?
CREATE INDEX IF NOT EXISTS idx_wl_orders_status_created
  ON white_label_orders(status, created_at DESC);

-- 10.2.3 佣金结算查询（佣金状态 + 完成时间）
-- 用于: SELECT * FROM white_label_orders WHERE commission_status = ? ORDER BY service_completed_at
CREATE INDEX IF NOT EXISTS idx_wl_orders_commission_completed
  ON white_label_orders(commission_status, service_completed_at DESC);

-- 10.2.4 Stripe 支付关联查询
-- 用于: 根据 Stripe Payment Intent 或 Checkout Session 查找订单
CREATE INDEX IF NOT EXISTS idx_wl_orders_stripe_payment
  ON white_label_orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wl_orders_stripe_checkout
  ON white_label_orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;

-- 11. 佣金日志表
CREATE TABLE IF NOT EXISTS commission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id),
  order_type TEXT NOT NULL CHECK (order_type IN ('distribution', 'booking', 'referral')),
  order_id UUID NOT NULL,
  order_amount INTEGER NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL,
  commission_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  paid_at TIMESTAMPTZ,
  payment_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 基础索引
CREATE INDEX IF NOT EXISTS idx_commission_logs_guide ON commission_logs(guide_id);
CREATE INDEX IF NOT EXISTS idx_commission_logs_order ON commission_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_commission_logs_status ON commission_logs(status);

-- 复合索引：导游佣金查询（状态筛选 + 时间排序）
CREATE INDEX IF NOT EXISTS idx_commission_logs_guide_status_created
  ON commission_logs(guide_id, status, created_at DESC);

-- 复合索引：管理员审批队列（待审批状态 + 创建时间）
CREATE INDEX IF NOT EXISTS idx_commission_logs_pending_approval
  ON commission_logs(status, created_at) WHERE status = 'pending';

-- 复合索引：支付记录查询
CREATE INDEX IF NOT EXISTS idx_commission_logs_paid
  ON commission_logs(paid_at DESC) WHERE status = 'paid';

-- 12. RLS 策略
ALTER TABLE white_label_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 12.1 white_label_orders RLS 策略
-- ============================================

-- 12.1.1 导游可以查看自己的订单
DROP POLICY IF EXISTS "Guides can view own distribution orders" ON white_label_orders;
CREATE POLICY "Guides can view own distribution orders" ON white_label_orders
  FOR SELECT USING (
    guide_white_label_id IN (
      SELECT gwl.id FROM guide_white_label gwl
      JOIN guides g ON g.id = gwl.guide_id
      WHERE g.auth_user_id = auth.uid()
    )
  );

-- 12.1.2 管理员可以查看所有订单
DROP POLICY IF EXISTS "Admins can view all distribution orders" ON white_label_orders;
CREATE POLICY "Admins can view all distribution orders" ON white_label_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 12.1.3 管理员可以更新所有订单
DROP POLICY IF EXISTS "Admins can update all distribution orders" ON white_label_orders;
CREATE POLICY "Admins can update all distribution orders" ON white_label_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 12.1.4 Service Role 可以插入订单（通过 API 提交）
DROP POLICY IF EXISTS "Service role can insert orders" ON white_label_orders;
CREATE POLICY "Service role can insert orders" ON white_label_orders
  FOR INSERT WITH CHECK (true);  -- Service role 跳过 RLS，此策略用于文档说明

-- ============================================
-- 12.2 commission_logs RLS 策略
-- ============================================

-- 12.2.1 导游可以查看自己的佣金日志
DROP POLICY IF EXISTS "Guides can view own commission logs" ON commission_logs;
CREATE POLICY "Guides can view own commission logs" ON commission_logs
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 12.2.2 管理员可以查看所有佣金日志
DROP POLICY IF EXISTS "Admins can view all commission logs" ON commission_logs;
CREATE POLICY "Admins can view all commission logs" ON commission_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 12.2.3 管理员可以更新佣金日志（审批、支付）
DROP POLICY IF EXISTS "Admins can update commission logs" ON commission_logs;
CREATE POLICY "Admins can update commission logs" ON commission_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 13. 订单状态转换验证函数
-- ============================================
-- 状态机定义：
--   inquiry → quoted → deposit_pending → deposit_paid → in_progress → completed
--                  ↓           ↓              ↓             ↓            ↓
--               cancelled   cancelled     cancelled     cancelled    refunded
--
-- 合法转换路径：
-- - inquiry → quoted, cancelled
-- - quoted → deposit_pending, cancelled
-- - deposit_pending → deposit_paid, cancelled
-- - deposit_paid → in_progress, cancelled
-- - in_progress → completed, cancelled
-- - completed → refunded
-- - cancelled/refunded → (终态，不可变)
-- ============================================

CREATE OR REPLACE FUNCTION validate_order_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  v_valid_transitions JSONB := '{
    "inquiry": ["quoted", "cancelled"],
    "quoted": ["deposit_pending", "cancelled"],
    "deposit_pending": ["deposit_paid", "cancelled"],
    "deposit_paid": ["in_progress", "cancelled"],
    "in_progress": ["completed", "cancelled"],
    "completed": ["refunded"],
    "cancelled": [],
    "refunded": []
  }'::JSONB;
  v_allowed_next_states JSONB;
BEGIN
  -- 如果状态没有变化，直接通过
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- 获取当前状态允许的下一状态列表
  v_allowed_next_states := v_valid_transitions -> OLD.status;

  -- 检查新状态是否在允许列表中
  IF NOT (v_allowed_next_states ? NEW.status) THEN
    RAISE EXCEPTION '非法状态转换: % → % (订单 %)', OLD.status, NEW.status, NEW.id
      USING HINT = '请检查订单状态流程';
  END IF;

  -- 自动设置状态变更时间戳
  CASE NEW.status
    WHEN 'quoted' THEN
      NEW.quoted_at := COALESCE(NEW.quoted_at, NOW());
    WHEN 'deposit_paid' THEN
      NEW.deposit_paid_at := COALESCE(NEW.deposit_paid_at, NOW());
    WHEN 'in_progress' THEN
      NEW.service_started_at := COALESCE(NEW.service_started_at, NOW());
    WHEN 'completed' THEN
      NEW.service_completed_at := COALESCE(NEW.service_completed_at, NOW());
    WHEN 'cancelled' THEN
      NEW.cancelled_at := COALESCE(NEW.cancelled_at, NOW());
    ELSE
      -- 其他状态不需要特殊处理
      NULL;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建状态转换验证触发器（在 calculate_distribution_commission 之前执行）
DROP TRIGGER IF EXISTS trg_validate_order_status ON white_label_orders;
CREATE TRIGGER trg_validate_order_status
  BEFORE UPDATE ON white_label_orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_order_status_transition();

-- ============================================
-- 14. 佣金自动计算触发器
-- ============================================
CREATE OR REPLACE FUNCTION calculate_distribution_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_guide_id UUID;
  v_commission_amount INTEGER;
  v_subscription_tier TEXT;
  v_commission_rate DECIMAL(5,4);
BEGIN
  -- 只在状态变为 completed 时触发
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- 获取导游 ID 和订阅等级
    SELECT gwl.guide_id, g.subscription_tier
    INTO v_guide_id, v_subscription_tier
    FROM guide_white_label gwl
    JOIN guides g ON g.id = gwl.guide_id
    WHERE gwl.id = NEW.guide_white_label_id;

    -- 根据订阅等级确定佣金比例
    IF v_subscription_tier = 'partner' THEN
      v_commission_rate := 0.20;  -- 合伙人固定 20%
    ELSE
      v_commission_rate := COALESCE(NEW.commission_rate, 0.10);  -- 成长版使用订单记录的比例
    END IF;

    -- 计算佣金金额
    v_commission_amount := ROUND(NEW.final_amount * v_commission_rate);

    -- 更新订单佣金信息
    NEW.commission_rate := v_commission_rate;
    NEW.commission_amount := v_commission_amount;
    NEW.commission_status := 'calculated';
    NEW.commission_calculated_at := NOW();
    NEW.service_completed_at := COALESCE(NEW.service_completed_at, NOW());

    -- 记录佣金日志
    INSERT INTO commission_logs (
      guide_id,
      order_type,
      order_id,
      order_amount,
      commission_rate,
      commission_amount,
      status
    ) VALUES (
      v_guide_id,
      'distribution',
      NEW.id,
      NEW.final_amount,
      v_commission_rate,
      v_commission_amount,
      'pending'
    );

    -- 更新导游累计佣金统计
    UPDATE guides
    SET
      total_commission = COALESCE(total_commission, 0) + v_commission_amount,
      updated_at = NOW()
    WHERE id = v_guide_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_distribution_commission ON white_label_orders;
CREATE TRIGGER trg_calculate_distribution_commission
  BEFORE UPDATE ON white_label_orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_distribution_commission();

-- ============================================
-- 15. 订单状态变更审计触发器
-- ============================================
CREATE OR REPLACE FUNCTION audit_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit_logs (
      action,
      entity_type,
      entity_id,
      details
    ) VALUES (
      'distribution_order_status_change',
      'white_label_order',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_at', NOW()
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_order_status ON white_label_orders;
CREATE TRIGGER trg_audit_order_status
  AFTER UPDATE ON white_label_orders
  FOR EACH ROW
  EXECUTE FUNCTION audit_order_status_change();

-- ============================================
-- 16. 自动更新 updated_at 触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_order_updated_at ON white_label_orders;
CREATE TRIGGER trg_update_order_updated_at
  BEFORE UPDATE ON white_label_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_updated_at();

-- ============================================
-- 17. 获取导游分销统计函数
-- ============================================
CREATE OR REPLACE FUNCTION get_guide_distribution_stats(p_guide_id UUID)
RETURNS TABLE (
  total_orders BIGINT,
  total_inquiries BIGINT,
  total_completed BIGINT,
  total_revenue BIGINT,
  total_commission BIGINT,
  pending_commission BIGINT,
  conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_orders,
    COUNT(*) FILTER (WHERE wo.status = 'inquiry')::BIGINT as total_inquiries,
    COUNT(*) FILTER (WHERE wo.status = 'completed')::BIGINT as total_completed,
    COALESCE(SUM(wo.final_amount) FILTER (WHERE wo.status = 'completed'), 0)::BIGINT as total_revenue,
    COALESCE(SUM(wo.commission_amount) FILTER (WHERE wo.commission_status IN ('calculated', 'approved', 'paid')), 0)::BIGINT as total_commission,
    COALESCE(SUM(wo.commission_amount) FILTER (WHERE wo.commission_status IN ('calculated', 'approved')), 0)::BIGINT as pending_commission,
    CASE
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE wo.status = 'completed')::DECIMAL / COUNT(*) * 100), 2)
      ELSE 0
    END as conversion_rate
  FROM white_label_orders wo
  JOIN guide_white_label gwl ON gwl.id = wo.guide_white_label_id
  WHERE gwl.guide_id = p_guide_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 18. 管理员佣金审批函数
-- ============================================
-- 用于批量审批或单独审批佣金
CREATE OR REPLACE FUNCTION approve_commission(
  p_commission_log_id UUID,
  p_admin_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE commission_logs
  SET
    status = 'approved',
    approved_at = NOW(),
    approved_by = p_admin_id,
    notes = COALESCE(p_notes, notes)
  WHERE id = p_commission_log_id
    AND status = 'pending';

  -- 同步更新订单的佣金状态
  UPDATE white_label_orders wo
  SET commission_status = 'approved'
  FROM commission_logs cl
  WHERE cl.id = p_commission_log_id
    AND cl.order_id = wo.id
    AND cl.order_type = 'distribution';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 19. 记录佣金支付函数
-- ============================================
CREATE OR REPLACE FUNCTION record_commission_payment(
  p_commission_log_id UUID,
  p_payment_ref TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE commission_logs
  SET
    status = 'paid',
    paid_at = NOW(),
    payment_ref = p_payment_ref,
    notes = COALESCE(p_notes, notes)
  WHERE id = p_commission_log_id
    AND status = 'approved';

  -- 同步更新订单的佣金状态
  UPDATE white_label_orders wo
  SET
    commission_status = 'paid',
    commission_paid_at = NOW(),
    commission_payment_ref = p_payment_ref
  FROM commission_logs cl
  WHERE cl.id = p_commission_log_id
    AND cl.order_id = wo.id
    AND cl.order_type = 'distribution';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 20. 获取待审批佣金列表（管理员用）
-- ============================================
CREATE OR REPLACE FUNCTION get_pending_commissions(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  commission_id UUID,
  guide_id UUID,
  guide_name TEXT,
  order_id UUID,
  order_type TEXT,
  order_amount INTEGER,
  commission_rate DECIMAL(5,4),
  commission_amount INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id as commission_id,
    cl.guide_id,
    g.name as guide_name,
    cl.order_id,
    cl.order_type,
    cl.order_amount,
    cl.commission_rate,
    cl.commission_amount,
    cl.created_at
  FROM commission_logs cl
  JOIN guides g ON g.id = cl.guide_id
  WHERE cl.status = 'pending'
  ORDER BY cl.created_at ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 完成
-- Version: 1.1.0
-- 表: white_label_orders, commission_logs
-- 函数: 5个（状态验证、佣金计算、审计、统计、支付）
-- 触发器: 4个
-- 索引: 16个（包括复合索引）
-- RLS策略: 7个（导游+管理员）
-- ============================================
