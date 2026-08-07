-- ============================================
-- 推荐奖励触发器迁移脚本
-- Migration: Referral Rewards Trigger
--
-- 功能：当订单佣金计算完成时，自动为推荐人创建 2% 奖励记录
-- 运行方式：在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 确保 referral_rewards 表存在
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES guides(id),
  referee_id UUID NOT NULL REFERENCES guides(id),
  booking_id UUID REFERENCES bookings(id),
  reward_type VARCHAR(20) DEFAULT 'commission' CHECK (reward_type IN ('commission', 'bonus')),
  reward_rate DECIMAL(4, 2) DEFAULT 0.02,
  reward_amount DECIMAL(12, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referee ON referral_rewards(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);

-- 3. 启用 RLS
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- 4. RLS 策略（如果不存在）
DO $$
BEGIN
  -- 删除旧策略（如果存在）
  DROP POLICY IF EXISTS "Guides can view own referral rewards" ON referral_rewards;

  -- 创建新策略
  CREATE POLICY "Guides can view own referral rewards" ON referral_rewards
    FOR SELECT USING (
      referrer_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
    );
END $$;

-- 5. 创建或替换触发器函数
CREATE OR REPLACE FUNCTION create_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- 当订单佣金计算完成时，为推荐人创建奖励
  IF NEW.commission_status = 'calculated'
     AND (OLD.commission_status IS NULL OR OLD.commission_status != 'calculated')
     AND NEW.commission_amount IS NOT NULL
     AND NEW.commission_amount > 0 THEN

    -- 检查该订单是否已有奖励记录（避免重复）
    IF NOT EXISTS (
      SELECT 1 FROM referral_rewards WHERE booking_id = NEW.id
    ) THEN
      INSERT INTO referral_rewards (
        referrer_id,
        referee_id,
        booking_id,
        reward_rate,
        reward_amount,
        reward_type,
        status
      )
      SELECT
        g.referrer_id,
        NEW.guide_id,
        NEW.id,
        0.02,  -- 2% 推荐奖励率
        NEW.commission_amount * 0.02,  -- 2% 推荐奖励
        'commission',
        'pending'
      FROM guides g
      WHERE g.id = NEW.guide_id
        AND g.referrer_id IS NOT NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. 删除旧触发器（如果存在）并创建新触发器
DROP TRIGGER IF EXISTS trigger_create_referral_reward ON bookings;

CREATE TRIGGER trigger_create_referral_reward
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_reward();

-- 7. 验证触发器已创建
DO $$
DECLARE
  trigger_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_create_referral_reward'
  ) INTO trigger_exists;

  IF trigger_exists THEN
    RAISE NOTICE '✅ 触发器 trigger_create_referral_reward 已成功创建';
  ELSE
    RAISE EXCEPTION '❌ 触发器创建失败';
  END IF;
END $$;

-- ============================================
-- 迁移完成
-- ============================================
