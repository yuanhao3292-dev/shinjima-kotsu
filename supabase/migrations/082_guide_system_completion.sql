-- ============================================
-- 082: 导游系统补全 - 缺失表和列
-- ============================================

-- 1. guides 表 - 补全缺失列
ALTER TABLE guides ADD COLUMN IF NOT EXISTS available_balance INTEGER DEFAULT 0;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS total_withdrawn INTEGER DEFAULT 0;

-- 2. webhook_events 表 - Stripe 幂等性保护
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  result VARCHAR(20) NOT NULL CHECK (result IN ('success', 'failed', 'skipped')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- RLS
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
-- webhook_events 仅服务端 service_role 可写，不需要客户端 RLS 策略

-- 3. support_tickets 表 - 客服工单
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  ticket_type VARCHAR(50) NOT NULL DEFAULT 'general',
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_guide_id ON support_tickets(guide_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- RLS: 导游只能查看自己的工单
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides can view own tickets" ON support_tickets
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Guides can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Guides can update own tickets" ON support_tickets
  FOR UPDATE USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 4. ticket_replies 表 - 工单回复
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  reply_by VARCHAR(255) NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);

-- RLS: 导游可以查看和创建自己工单的回复
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides can view replies on own tickets" ON ticket_replies
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM support_tickets
      WHERE guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Guides can create replies on own tickets" ON ticket_replies
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets
      WHERE guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
    )
  );

-- 5. referral_rewards 表 - 推荐奖励
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES guides(id) ON DELETE SET NULL,
  booking_id UUID,
  reward_type VARCHAR(50) DEFAULT 'commission',
  reward_rate DECIMAL(5,2),
  reward_amount INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer_id ON referral_rewards(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referee_id ON referral_rewards(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);

-- RLS: 导游可以查看自己的推荐奖励
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides can view own referral rewards" ON referral_rewards
  FOR SELECT USING (
    referrer_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 6. commission_settlements 表 (如果不存在)
CREATE TABLE IF NOT EXISTS commission_settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  settlement_month VARCHAR(7) NOT NULL, -- 'YYYY-MM'
  total_commission DECIMAL(12,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commission_settlements_guide_id ON commission_settlements(guide_id);
CREATE INDEX IF NOT EXISTS idx_commission_settlements_month ON commission_settlements(settlement_month DESC);

ALTER TABLE commission_settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides can view own settlements" ON commission_settlements
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );
