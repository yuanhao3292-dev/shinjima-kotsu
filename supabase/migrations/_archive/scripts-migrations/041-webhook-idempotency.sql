-- ============================================
-- Webhook 幂等性检查表
-- Webhook Idempotency Check Table
-- ============================================
-- 用于防止 Stripe Webhook 事件被重复处理

-- 1. 创建 webhook_events 表
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) NOT NULL UNIQUE,  -- Stripe event ID (evt_xxx)
  event_type VARCHAR(100) NOT NULL,       -- checkout.session.completed, etc.
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB,                          -- 可选：存储事件数据用于调试
  result VARCHAR(50) DEFAULT 'success',   -- success, failed, skipped
  error_message TEXT,                     -- 如果失败，记录错误信息
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 创建索引以加快查询
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at);

-- 3. 创建自动清理过期事件的函数（保留 30 天）
CREATE OR REPLACE FUNCTION cleanup_old_webhook_events()
RETURNS void AS $$
BEGIN
  DELETE FROM webhook_events
  WHERE processed_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- 4. 添加注释
COMMENT ON TABLE webhook_events IS 'Stripe Webhook 事件记录表，用于幂等性检查，防止重复处理';
COMMENT ON COLUMN webhook_events.event_id IS 'Stripe 事件 ID，格式为 evt_xxx';
COMMENT ON COLUMN webhook_events.event_type IS 'Stripe 事件类型，如 checkout.session.completed';
COMMENT ON COLUMN webhook_events.result IS '处理结果：success/failed/skipped';

-- ============================================
-- 验证
-- ============================================
-- SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 10;
