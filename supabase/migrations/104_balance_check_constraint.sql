-- Migration 104: Add CHECK constraint to prevent negative available_balance
-- This prevents over-withdrawal due to race conditions at the database level

ALTER TABLE guides
  ADD CONSTRAINT guides_available_balance_non_negative
  CHECK (available_balance >= 0);
