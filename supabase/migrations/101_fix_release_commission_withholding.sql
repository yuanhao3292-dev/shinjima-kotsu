-- =====================================================
-- 101: Fix release_matured_commissions — deduct withholding tax
-- Previously added gross commission_amount to available_balance.
-- Now adds NET amount (commission_amount - withholding_tax_amount).
-- =====================================================

CREATE OR REPLACE FUNCTION release_matured_commissions(p_guide_id UUID)
RETURNS JSON AS $$
DECLARE
  v_gross_amount NUMERIC;
  v_net_amount NUMERIC;
  v_release_count INT;
BEGIN
  -- Calculate both gross and net amounts
  SELECT
    COALESCE(SUM(commission_amount), 0),
    COALESCE(SUM(commission_amount - COALESCE(withholding_tax_amount, 0)), 0),
    COUNT(*)
  INTO v_gross_amount, v_net_amount, v_release_count
  FROM white_label_orders
  WHERE guide_id = p_guide_id
    AND commission_status = 'calculated'
    AND commission_available_at IS NOT NULL
    AND commission_available_at <= NOW();

  IF v_release_count > 0 THEN
    -- Update commission status to available
    UPDATE white_label_orders
    SET commission_status = 'available',
        updated_at = NOW()
    WHERE guide_id = p_guide_id
      AND commission_status = 'calculated'
      AND commission_available_at IS NOT NULL
      AND commission_available_at <= NOW();

    -- Add NET amount (after withholding tax) to available_balance
    UPDATE guides
    SET available_balance = COALESCE(available_balance, 0) + v_net_amount,
        updated_at = NOW()
    WHERE id = p_guide_id;

    RAISE NOTICE 'Released: guide=%, gross=%, net=%, withheld=%, count=%',
      p_guide_id, v_gross_amount, v_net_amount, v_gross_amount - v_net_amount, v_release_count;
  END IF;

  RETURN json_build_object(
    'released_amount', v_net_amount,
    'gross_amount', v_gross_amount,
    'released_count', v_release_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
