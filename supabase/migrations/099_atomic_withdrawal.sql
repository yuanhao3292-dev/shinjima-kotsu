-- =====================================================
-- 099: Atomic Withdrawal with SELECT FOR UPDATE
-- Prevents race condition: concurrent withdrawals exceeding balance
-- =====================================================

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

  -- Check for existing pending withdrawal (also locked by the guide row lock)
  SELECT COUNT(*) INTO v_pending_count
  FROM withdrawal_requests
  WHERE guide_id = p_guide_id
    AND status IN ('pending', 'approved', 'processing');

  IF v_pending_count > 0 THEN
    RETURN json_build_object('error', 'PENDING_WITHDRAWAL_EXISTS');
  END IF;

  -- Atomically deduct balance
  UPDATE guides
  SET available_balance = available_balance - p_amount,
      total_withdrawn = COALESCE(total_withdrawn, 0) + p_amount,
      updated_at = NOW()
  WHERE id = p_guide_id;

  -- Insert withdrawal request
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
