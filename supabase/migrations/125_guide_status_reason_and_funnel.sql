-- 125: 导游状态原因 + 转化漏斗（把 AI 问诊建模为 lead）
--
-- 一、状态机补齐
--   guides.status 原本 pending / approved / rejected / suspended，后台停用时
--   只把 note 写进 audit_logs，导游行上不留"为什么、何时、谁停的"。
--   加三列 + 一个 'banned' 值（永久封禁，与可恢复的 suspended 区分）。
--
-- 二、漏斗
--   白标匿名问诊完成即一个 lead —— 数据一直在 whitelabel_screenings 里，
--   只是从没和访问、下单串成一条链。get_guide_funnel() 按导游返回
--   访问 → 独立访客 → 问诊 lead → 付款订单 的计数（可指定天数窗口）。
--   导游只能查自己（auth.uid() 归属校验），service_role 不受限（后台用）。

-- ---------- 一、状态原因 ----------
ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS status_reason     TEXT,
  ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status_changed_by TEXT;   -- 操作者邮箱（管理员）

ALTER TABLE guides DROP CONSTRAINT IF EXISTS guides_status_check;
ALTER TABLE guides
  ADD CONSTRAINT guides_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'suspended', 'banned'));

COMMENT ON COLUMN guides.status_reason IS
  '最近一次状态变更的原因（suspend / ban 必填）。历史见 audit_logs。';

-- ---------- 二、漏斗 ----------
CREATE OR REPLACE FUNCTION get_guide_funnel(p_guide_id UUID, p_days INTEGER DEFAULT 30)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug        TEXT;
  v_since       TIMESTAMPTZ := NOW() - (p_days || ' days')::INTERVAL;
  v_views       BIGINT;
  v_visitors    BIGINT;
  v_leads       BIGINT;
  v_orders      BIGINT;
  v_paid_orders BIGINT;
BEGIN
  -- 归属校验：本人 或 service_role
  SELECT slug INTO v_slug
  FROM guides
  WHERE id = p_guide_id
    AND (auth.role() = 'service_role' OR auth_user_id = auth.uid());
  IF v_slug IS NULL THEN
    RAISE EXCEPTION 'guide not found or not owned by caller' USING ERRCODE = '42501';
  END IF;

  SELECT COUNT(*), COUNT(DISTINCT session_id)
    INTO v_views, v_visitors
    FROM whitelabel_page_views
   WHERE guide_id = p_guide_id AND viewed_at >= v_since;

  SELECT COUNT(*) INTO v_leads
    FROM whitelabel_screenings
   WHERE guide_slug = v_slug AND status = 'completed' AND created_at >= v_since;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE paid_at IS NOT NULL)
    INTO v_orders, v_paid_orders
    FROM orders
   WHERE referred_by_guide_id = p_guide_id AND created_at >= v_since;

  RETURN json_build_object(
    'days',        p_days,
    'views',       v_views,
    'visitors',    v_visitors,
    'leads',       v_leads,
    'orders',      v_orders,
    'paid_orders', v_paid_orders
  );
END;
$$;

REVOKE ALL ON FUNCTION get_guide_funnel(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_guide_funnel(UUID, INTEGER) TO authenticated, service_role;
