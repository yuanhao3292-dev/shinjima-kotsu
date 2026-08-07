-- ============================================
-- 提现申请系统
-- Withdrawal Request System
-- ============================================
-- 允许导游申请提现佣金余额

-- 1. 创建提现申请表
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,

  -- 提现金额
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'JPY',

  -- 提现状态
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending: 待审核
  -- approved: 已批准（待打款）
  -- processing: 打款中
  -- completed: 已完成
  -- rejected: 已拒绝
  -- cancelled: 已取消

  -- 银行信息（从 guides 表复制，便于审计）
  bank_name VARCHAR(100),
  bank_branch VARCHAR(100),
  account_type VARCHAR(20),  -- 'ordinary' (普通) | 'current' (当座)
  account_number VARCHAR(20),
  account_holder VARCHAR(100),

  -- 审核信息
  reviewed_by UUID,  -- 管理员 ID
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,

  -- 打款信息
  payment_reference VARCHAR(100),  -- 转账凭证号
  payment_method VARCHAR(50),      -- 'bank_transfer' | 'paypal' | 'other'
  paid_at TIMESTAMPTZ,

  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_withdrawal_guide ON withdrawal_requests(guide_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_created ON withdrawal_requests(created_at DESC);

-- 3. 添加 guides 表的银行信息字段（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'bank_name') THEN
    ALTER TABLE guides ADD COLUMN bank_name VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'bank_branch') THEN
    ALTER TABLE guides ADD COLUMN bank_branch VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'bank_account_type') THEN
    ALTER TABLE guides ADD COLUMN bank_account_type VARCHAR(20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'bank_account_number') THEN
    ALTER TABLE guides ADD COLUMN bank_account_number VARCHAR(20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'bank_account_holder') THEN
    ALTER TABLE guides ADD COLUMN bank_account_holder VARCHAR(100);
  END IF;

  -- 添加可提现余额字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'available_balance') THEN
    ALTER TABLE guides ADD COLUMN available_balance DECIMAL(12, 2) DEFAULT 0;
  END IF;

  -- 添加已提现总额字段
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guides' AND column_name = 'total_withdrawn') THEN
    ALTER TABLE guides ADD COLUMN total_withdrawn DECIMAL(12, 2) DEFAULT 0;
  END IF;
END
$$;

-- 4. RLS 策略
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- 导游只能查看自己的提现记录
CREATE POLICY "Guides can view own withdrawals"
  ON withdrawal_requests FOR SELECT
  USING (guide_id IN (
    SELECT id FROM guides WHERE auth_user_id = auth.uid()
  ));

-- 导游只能创建自己的提现申请
CREATE POLICY "Guides can create own withdrawals"
  ON withdrawal_requests FOR INSERT
  WITH CHECK (guide_id IN (
    SELECT id FROM guides WHERE auth_user_id = auth.uid()
  ));

-- 导游只能取消自己的待审核提现申请
CREATE POLICY "Guides can cancel pending withdrawals"
  ON withdrawal_requests FOR UPDATE
  USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
    AND status = 'pending'
  );

-- 5. 创建提现申请时自动冻结余额的函数
CREATE OR REPLACE FUNCTION process_withdrawal_request()
RETURNS TRIGGER AS $$
BEGIN
  -- 创建新申请时，检查余额是否足够
  IF TG_OP = 'INSERT' THEN
    IF (SELECT available_balance FROM guides WHERE id = NEW.guide_id) < NEW.amount THEN
      RAISE EXCEPTION '可提现余额不足';
    END IF;

    -- 冻结余额
    UPDATE guides
    SET available_balance = available_balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  -- 状态变更处理
  IF TG_OP = 'UPDATE' THEN
    -- 拒绝或取消时，退还冻结金额
    IF NEW.status IN ('rejected', 'cancelled') AND OLD.status = 'pending' THEN
      UPDATE guides
      SET available_balance = available_balance + OLD.amount,
          updated_at = NOW()
      WHERE id = OLD.guide_id;
    END IF;

    -- 完成打款时，更新已提现总额
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      UPDATE guides
      SET total_withdrawn = total_withdrawn + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.guide_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_process_withdrawal ON withdrawal_requests;
CREATE TRIGGER trigger_process_withdrawal
  BEFORE INSERT OR UPDATE ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION process_withdrawal_request();

-- 6. 更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_withdrawal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_withdrawal_timestamp ON withdrawal_requests;
CREATE TRIGGER trigger_withdrawal_timestamp
  BEFORE UPDATE ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_withdrawal_timestamp();

-- 7. 初始化现有导游的可提现余额
-- 可提现余额 = 累计佣金 - 已提现总额
UPDATE guides
SET available_balance = COALESCE(total_commission, 0) - COALESCE(total_withdrawn, 0)
WHERE available_balance IS NULL OR available_balance = 0;

-- 8. 添加注释
COMMENT ON TABLE withdrawal_requests IS '提现申请表，记录导游的佣金提现申请';
COMMENT ON COLUMN withdrawal_requests.status IS '状态: pending/approved/processing/completed/rejected/cancelled';
COMMENT ON COLUMN guides.available_balance IS '可提现余额（已确认的佣金减去已提现和待处理的提现）';
COMMENT ON COLUMN guides.total_withdrawn IS '累计已提现金额';

-- ============================================
-- 验证
-- ============================================
-- SELECT id, name, total_commission, available_balance, total_withdrawn FROM guides LIMIT 5;
-- SELECT * FROM withdrawal_requests ORDER BY created_at DESC LIMIT 10;
