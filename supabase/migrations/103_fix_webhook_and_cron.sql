-- =====================================================
-- 103: Fix webhook_events CHECK constraint + cron idempotency
-- =====================================================

-- H4: Add 'retrying' to webhook_events result CHECK constraint
ALTER TABLE webhook_events DROP CONSTRAINT IF EXISTS webhook_events_result_check;
ALTER TABLE webhook_events ADD CONSTRAINT webhook_events_result_check
  CHECK (result IN ('success', 'failed', 'skipped', 'retrying'));

-- H5: Add last_reminder columns for cron idempotency
ALTER TABLE guides ADD COLUMN IF NOT EXISTS last_subscription_reminder_at TIMESTAMPTZ;

-- For health checkup reminders, track per-user
ALTER TABLE health_snapshots ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ;
