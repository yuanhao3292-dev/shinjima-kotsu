-- =====================================================
-- 100: Atomic Commission Increment & Enterprise Quota
-- Prevents race conditions on concurrent operations
-- =====================================================

-- 1. Atomic commission increment for guides
-- Replaces read-modify-write in webhook handler
CREATE OR REPLACE FUNCTION increment_guide_commission(
  p_guide_id UUID,
  p_amount NUMERIC
)
RETURNS NUMERIC AS $$
DECLARE
  v_new_total NUMERIC;
BEGIN
  UPDATE guides
  SET total_commission = COALESCE(total_commission, 0) + p_amount,
      updated_at = NOW()
  WHERE id = p_guide_id
  RETURNING total_commission INTO v_new_total;

  RETURN v_new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atomic enterprise screening quota increment
-- Checks quota in the same UPDATE statement (no TOCTOU)
CREATE OR REPLACE FUNCTION increment_enterprise_screening_quota(
  p_enterprise_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_new_used INT;
  v_quota INT;
BEGIN
  UPDATE enterprises
  SET screening_used = screening_used + 1
  WHERE id = p_enterprise_id
    AND screening_used < screening_quota
  RETURNING screening_used, screening_quota INTO v_new_used, v_quota;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'QUOTA_EXCEEDED');
  END IF;

  RETURN json_build_object('success', true, 'used', v_new_used, 'quota', v_quota);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
