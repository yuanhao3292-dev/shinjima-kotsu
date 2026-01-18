-- ============================================
-- 增强审计日志系统
-- Enhanced Audit Logging System
-- ============================================
-- 自动记录关键业务事件

-- 1. 添加更多字段到 audit_logs 表
ALTER TABLE audit_logs
ADD COLUMN IF NOT EXISTS old_value JSONB,
ADD COLUMN IF NOT EXISTS new_value JSONB,
ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'info';
-- severity: 'info', 'warning', 'critical'

-- 2. 添加 severity 索引
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);

-- 3. 创建通用的审计日志记录函数
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action VARCHAR(100),
  p_entity_type VARCHAR(50),
  p_entity_id UUID,
  p_admin_id UUID DEFAULT NULL,
  p_admin_email VARCHAR(255) DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL,
  p_severity VARCHAR(20) DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_logs (
    action, entity_type, entity_id,
    admin_id, admin_email,
    details, old_value, new_value, severity
  ) VALUES (
    p_action, p_entity_type, p_entity_id,
    p_admin_id, p_admin_email,
    p_details, p_old_value, p_new_value, p_severity
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 自动记录导游状态变更
CREATE OR REPLACE FUNCTION audit_guide_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- 状态变更
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_audit_event(
      'guide_status_changed',
      'guide',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'name', NEW.name,
        'old_status', OLD.status,
        'new_status', NEW.status
      ),
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      CASE
        WHEN NEW.status = 'suspended' THEN 'warning'
        WHEN NEW.status = 'approved' THEN 'info'
        ELSE 'info'
      END
    );
  END IF;

  -- KYC 状态变更
  IF OLD.kyc_status IS DISTINCT FROM NEW.kyc_status THEN
    PERFORM log_audit_event(
      'guide_kyc_changed',
      'guide',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'name', NEW.name,
        'old_kyc_status', OLD.kyc_status,
        'new_kyc_status', NEW.kyc_status
      ),
      jsonb_build_object('kyc_status', OLD.kyc_status),
      jsonb_build_object('kyc_status', NEW.kyc_status),
      'info'
    );
  END IF;

  -- 订阅状态变更
  IF OLD.subscription_status IS DISTINCT FROM NEW.subscription_status THEN
    PERFORM log_audit_event(
      'guide_subscription_changed',
      'guide',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'name', NEW.name,
        'old_subscription', OLD.subscription_status,
        'new_subscription', NEW.subscription_status
      ),
      jsonb_build_object('subscription_status', OLD.subscription_status),
      jsonb_build_object('subscription_status', NEW.subscription_status),
      CASE
        WHEN NEW.subscription_status = 'cancelled' THEN 'warning'
        WHEN NEW.subscription_status = 'active' THEN 'info'
        ELSE 'info'
      END
    );
  END IF;

  -- 等级变更
  IF OLD.commission_tier_id IS DISTINCT FROM NEW.commission_tier_id THEN
    PERFORM log_audit_event(
      'guide_tier_changed',
      'guide',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'name', NEW.name,
        'old_tier_id', OLD.commission_tier_id,
        'new_tier_id', NEW.commission_tier_id
      ),
      jsonb_build_object('commission_tier_id', OLD.commission_tier_id),
      jsonb_build_object('commission_tier_id', NEW.commission_tier_id),
      'info'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建导游变更审计触发器
DROP TRIGGER IF EXISTS trigger_audit_guide_changes ON guides;
CREATE TRIGGER trigger_audit_guide_changes
  AFTER UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION audit_guide_changes();

-- 5. 自动记录预约状态变更
CREATE OR REPLACE FUNCTION audit_booking_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- 新预约创建
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      'booking_created',
      'booking',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'guide_id', NEW.guide_id,
        'venue_id', NEW.venue_id,
        'customer_name', NEW.customer_name,
        'booking_date', NEW.booking_date,
        'booking_time', NEW.booking_time
      ),
      NULL,
      to_jsonb(NEW),
      'info'
    );
    RETURN NEW;
  END IF;

  -- 状态变更
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_audit_event(
      'booking_status_changed',
      'booking',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'customer_name', NEW.customer_name,
        'old_status', OLD.status,
        'new_status', NEW.status
      ),
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      CASE
        WHEN NEW.status = 'cancelled' THEN 'warning'
        WHEN NEW.status = 'no_show' THEN 'warning'
        WHEN NEW.status = 'completed' THEN 'info'
        ELSE 'info'
      END
    );
  END IF;

  -- 消费金额记录
  IF OLD.actual_spend IS DISTINCT FROM NEW.actual_spend AND NEW.actual_spend IS NOT NULL THEN
    PERFORM log_audit_event(
      'booking_spend_recorded',
      'booking',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'customer_name', NEW.customer_name,
        'actual_spend', NEW.actual_spend,
        'commission_amount', NEW.commission_amount
      ),
      jsonb_build_object('actual_spend', OLD.actual_spend),
      jsonb_build_object('actual_spend', NEW.actual_spend),
      'info'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建预约变更审计触发器
DROP TRIGGER IF EXISTS trigger_audit_booking_changes ON bookings;
CREATE TRIGGER trigger_audit_booking_changes
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION audit_booking_changes();

-- 6. 自动记录提现申请变更
CREATE OR REPLACE FUNCTION audit_withdrawal_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- 新提现申请
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      'withdrawal_requested',
      'withdrawal_request',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'guide_id', NEW.guide_id,
        'amount', NEW.amount,
        'bank_name', NEW.bank_name
      ),
      NULL,
      jsonb_build_object('amount', NEW.amount, 'status', NEW.status),
      'info'
    );
    RETURN NEW;
  END IF;

  -- 状态变更
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_audit_event(
      'withdrawal_' || NEW.status,
      'withdrawal_request',
      NEW.id,
      NEW.reviewed_by,
      NULL,
      jsonb_build_object(
        'guide_id', NEW.guide_id,
        'amount', NEW.amount,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'review_note', NEW.review_note,
        'payment_reference', NEW.payment_reference
      ),
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      CASE
        WHEN NEW.status = 'rejected' THEN 'warning'
        WHEN NEW.status = 'completed' THEN 'info'
        ELSE 'info'
      END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建提现变更审计触发器
DROP TRIGGER IF EXISTS trigger_audit_withdrawal_changes ON withdrawal_requests;
CREATE TRIGGER trigger_audit_withdrawal_changes
  AFTER INSERT OR UPDATE ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION audit_withdrawal_changes();

-- 7. 自动记录白标订单
CREATE OR REPLACE FUNCTION audit_whitelabel_order()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      'whitelabel_order_created',
      'whitelabel_order',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'guide_id', NEW.guide_id,
        'order_type', NEW.order_type,
        'order_amount', NEW.order_amount,
        'status', NEW.status
      ),
      NULL,
      jsonb_build_object('order_type', NEW.order_type, 'status', NEW.status),
      'info'
    );
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_audit_event(
      'whitelabel_order_' || NEW.status,
      'whitelabel_order',
      NEW.id,
      NULL,
      NULL,
      jsonb_build_object(
        'guide_id', NEW.guide_id,
        'order_type', NEW.order_type,
        'order_amount', NEW.order_amount,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'commission_amount', NEW.commission_amount
      ),
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      CASE
        WHEN NEW.status = 'completed' THEN 'info'
        WHEN NEW.status = 'cancelled' THEN 'warning'
        ELSE 'info'
      END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建白标订单审计触发器
DROP TRIGGER IF EXISTS trigger_audit_whitelabel_order ON whitelabel_orders;
CREATE TRIGGER trigger_audit_whitelabel_order
  AFTER INSERT OR UPDATE ON whitelabel_orders
  FOR EACH ROW
  EXECUTE FUNCTION audit_whitelabel_order();

-- 8. 创建审计日志查询视图
CREATE OR REPLACE VIEW audit_logs_summary AS
SELECT
  DATE(created_at) AS log_date,
  action,
  entity_type,
  severity,
  COUNT(*) AS event_count
FROM audit_logs
GROUP BY DATE(created_at), action, entity_type, severity
ORDER BY log_date DESC, event_count DESC;

-- 9. 添加注释
COMMENT ON COLUMN audit_logs.old_value IS '变更前的值（JSON格式）';
COMMENT ON COLUMN audit_logs.new_value IS '变更后的值（JSON格式）';
COMMENT ON COLUMN audit_logs.severity IS '事件严重程度: info, warning, critical';
COMMENT ON FUNCTION log_audit_event IS '通用审计日志记录函数';
COMMENT ON VIEW audit_logs_summary IS '审计日志汇总视图';

-- ============================================
-- 验证
-- ============================================
-- SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20;
-- SELECT * FROM audit_logs_summary WHERE log_date >= CURRENT_DATE - INTERVAL '7 days';
