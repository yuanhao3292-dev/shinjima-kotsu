-- ============================================
-- 083: referral_rewards 幂等保护
-- booking_id 加 UNIQUE 约束，防止 webhook 重试产生重复奖励
-- ============================================

-- 删除可能存在的旧外键（trigger 脚本版本创建了 REFERENCES bookings(id)）
-- booking_id 实际存的是 orders.id，不应有外键
ALTER TABLE referral_rewards DROP CONSTRAINT IF EXISTS referral_rewards_booking_id_fkey;

-- 加 UNIQUE 约束（配合 upsert onConflict 使用）
CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_rewards_booking_id_unique ON referral_rewards(booking_id);
