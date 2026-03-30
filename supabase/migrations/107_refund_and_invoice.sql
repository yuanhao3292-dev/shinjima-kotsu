-- ============================================
-- 退款字段：记录退款时间、原因、Stripe 退款 ID、审计
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_refund_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_amount_jpy INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_by_admin_email TEXT;

-- 索引：按退款状态和时间快速查询
CREATE INDEX IF NOT EXISTS idx_orders_stripe_refund_id ON orders(stripe_refund_id) WHERE stripe_refund_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_refunded_at ON orders(refunded_at) WHERE refunded_at IS NOT NULL;

-- ============================================
-- 发票下载审计日志（電子帳簿保存法 合规）
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoice_downloads_order ON invoice_downloads(order_id);
