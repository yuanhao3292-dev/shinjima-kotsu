-- ============================================
-- 审计日志表
-- Audit Logs Table
-- ============================================
-- 记录管理员操作和关键业务事件

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 操作类型
  action VARCHAR(100) NOT NULL,  -- e.g., kyc_approve, kyc_reject, ticket_close
  -- 关联实体
  entity_type VARCHAR(50) NOT NULL,  -- e.g., guide, ticket, order
  entity_id UUID NOT NULL,
  -- 操作者信息
  admin_id UUID,  -- 管理员 auth user id
  admin_email VARCHAR(255),
  -- 操作详情
  details JSONB,  -- 存储操作相关的详细信息
  -- IP 和设备信息
  ip_address INET,
  user_agent TEXT,
  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- 添加注释
COMMENT ON TABLE audit_logs IS '审计日志表，记录管理员操作和关键业务事件';
COMMENT ON COLUMN audit_logs.action IS '操作类型，如 kyc_approve, kyc_reject, ticket_close';
COMMENT ON COLUMN audit_logs.entity_type IS '关联实体类型，如 guide, ticket, order';
COMMENT ON COLUMN audit_logs.details IS '操作详情，JSON 格式';

-- ============================================
-- 验证
-- ============================================
-- SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
