-- ============================================
-- 纠纷/支持工单系统
-- Support Tickets System
-- ============================================

-- 支持工单表
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 提交者信息
  guide_id UUID NOT NULL REFERENCES guides(id),
  -- 工单类型
  ticket_type VARCHAR(50) NOT NULL CHECK (ticket_type IN (
    'commission_dispute',    -- 佣金纠纷
    'order_issue',           -- 订单问题
    'payment_issue',         -- 支付问题
    'technical_issue',       -- 技术问题
    'suggestion',            -- 建议反馈
    'other'                  -- 其他
  )),
  -- 关联订单（可选）
  related_order_id UUID,
  related_booking_id UUID,
  -- 工单内容
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  -- 附件（JSON 数组存储文件 URL）
  attachments JSONB DEFAULT '[]',
  -- 工单状态
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN (
    'open',        -- 待处理
    'in_progress', -- 处理中
    'resolved',    -- 已解决
    'closed'       -- 已关闭
  )),
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN (
    'low',     -- 低
    'normal',  -- 普通
    'high',    -- 高
    'urgent'   -- 紧急
  )),
  -- 处理信息
  assigned_to VARCHAR(100),          -- 负责人
  resolution_note TEXT,              -- 解决说明
  resolved_at TIMESTAMPTZ,
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 工单回复表
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  -- 回复者
  reply_by VARCHAR(100) NOT NULL,    -- 'guide' 或 管理员名字
  is_staff BOOLEAN DEFAULT false,     -- 是否为工作人员回复
  -- 回复内容
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_support_tickets_guide ON support_tickets(guide_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(ticket_type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket ON ticket_replies(ticket_id);

-- ============================================
-- RLS 策略
-- ============================================
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

-- 导游只能查看自己的工单
DROP POLICY IF EXISTS "Guides can view own tickets" ON support_tickets;
CREATE POLICY "Guides can view own tickets" ON support_tickets
  FOR SELECT USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

-- 导游可以创建工单
DROP POLICY IF EXISTS "Guides can create tickets" ON support_tickets;
CREATE POLICY "Guides can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

-- 导游可以更新自己的工单（仅限添加内容）
DROP POLICY IF EXISTS "Guides can update own tickets" ON support_tickets;
CREATE POLICY "Guides can update own tickets" ON support_tickets
  FOR UPDATE USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
  );

-- Service role 可以完全操作
DROP POLICY IF EXISTS "Service role full access tickets" ON support_tickets;
CREATE POLICY "Service role full access tickets" ON support_tickets
  FOR ALL USING (auth.role() = 'service_role');

-- 回复的 RLS
DROP POLICY IF EXISTS "Users can view ticket replies" ON ticket_replies;
CREATE POLICY "Users can view ticket replies" ON ticket_replies
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM support_tickets WHERE guide_id IN (
        SELECT id FROM guides WHERE auth_user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Guides can create replies" ON ticket_replies;
CREATE POLICY "Guides can create replies" ON ticket_replies
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets WHERE guide_id IN (
        SELECT id FROM guides WHERE auth_user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Service role full access replies" ON ticket_replies;
CREATE POLICY "Service role full access replies" ON ticket_replies
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 更新时间戳触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_support_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_support_ticket_updated ON support_tickets;
CREATE TRIGGER trigger_support_ticket_updated
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_support_ticket_timestamp();

-- ============================================
-- 完成
-- ============================================
