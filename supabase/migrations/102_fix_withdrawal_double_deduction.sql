-- =====================================================
-- 102: Fix withdrawal double-deduction
-- The old trigger (process_withdrawal_request) and new RPC
-- (create_withdrawal_request) both deduct available_balance.
-- Drop the trigger; the RPC handles atomicity with SELECT FOR UPDATE.
-- Also fix: move total_withdrawn increment to completion time (trigger kept for UPDATE only).
-- =====================================================

-- 1. Drop the INSERT trigger that conflicts with the RPC
DROP TRIGGER IF EXISTS trigger_process_withdrawal ON withdrawal_requests;

-- 2. Rewrite the RPC: only deduct balance, do NOT touch total_withdrawn at creation
CREATE OR REPLACE FUNCTION create_withdrawal_request(
  p_guide_id UUID,
  p_amount NUMERIC,
  p_bank_name TEXT,
  p_bank_branch TEXT DEFAULT NULL,
  p_account_type TEXT DEFAULT NULL,
  p_account_number TEXT DEFAULT NULL,
  p_account_holder TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_balance NUMERIC;
  v_pending_count INT;
  v_withdrawal_id UUID;
BEGIN
  -- Lock the guide row to prevent concurrent withdrawals
  SELECT available_balance INTO v_balance
  FROM guides
  WHERE id = p_guide_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RETURN json_build_object('error', 'GUIDE_NOT_FOUND');
  END IF;

  IF v_balance < p_amount THEN
    RETURN json_build_object('error', 'INSUFFICIENT_BALANCE', 'available', v_balance);
  END IF;

  SELECT COUNT(*) INTO v_pending_count
  FROM withdrawal_requests
  WHERE guide_id = p_guide_id
    AND status IN ('pending', 'approved', 'processing');

  IF v_pending_count > 0 THEN
    RETURN json_build_object('error', 'PENDING_WITHDRAWAL_EXISTS');
  END IF;

  -- Atomically deduct balance (total_withdrawn updated at completion time)
  UPDATE guides
  SET available_balance = available_balance - p_amount,
      updated_at = NOW()
  WHERE id = p_guide_id;

  INSERT INTO withdrawal_requests (
    guide_id, amount, bank_name, bank_branch,
    account_type, account_number, account_holder, status
  ) VALUES (
    p_guide_id, p_amount, p_bank_name, p_bank_branch,
    p_account_type, p_account_number, p_account_holder, 'pending'
  )
  RETURNING id INTO v_withdrawal_id;

  RETURN json_build_object(
    'success', true,
    'withdrawal_id', v_withdrawal_id,
    'new_balance', v_balance - p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create the trigger for UPDATE only (handles reject refund + completion accounting)
CREATE OR REPLACE FUNCTION process_withdrawal_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fires on UPDATE (not INSERT — RPC handles that)
  IF NEW.status IN ('rejected', 'cancelled') AND OLD.status IN ('pending', 'approved', 'processing') THEN
    UPDATE guides
    SET available_balance = available_balance + OLD.amount,
        updated_at = NOW()
    WHERE id = OLD.guide_id;
  END IF;

  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE guides
    SET total_withdrawn = COALESCE(total_withdrawn, 0) + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_withdrawal_status_change
  BEFORE UPDATE ON withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION process_withdrawal_status_change();
