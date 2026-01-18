-- ============================================
-- 修复白标系统 RLS 策略
-- Fix White-Label RLS Policies
-- ============================================

-- ============================================
-- 1. 修复 whitelabel_orders 表的 RLS
-- ============================================

-- 删除旧策略
DROP POLICY IF EXISTS "Guides can view own whitelabel orders" ON whitelabel_orders;
DROP POLICY IF EXISTS "Service can insert orders" ON whitelabel_orders;

-- 导游只能查看自己的白标订单
CREATE POLICY "Guides can view own orders" ON whitelabel_orders
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 只有 service_role 可以插入订单（通过服务端 API）
CREATE POLICY "Service role can insert orders" ON whitelabel_orders
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
  );

-- 导游可以更新自己订单的有限字段（例如备注）
CREATE POLICY "Guides can update own orders" ON whitelabel_orders
  FOR UPDATE USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- ============================================
-- 2. 修复 whitelabel_page_views 表的 RLS
-- ============================================

-- 删除旧的过于宽松的策略
DROP POLICY IF EXISTS "Service can insert page views" ON whitelabel_page_views;
DROP POLICY IF EXISTS "Guides can view own page views" ON whitelabel_page_views;

-- 导游只能查看自己的页面访问记录
CREATE POLICY "Guides can view own page views" ON whitelabel_page_views
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 只有 service_role 可以插入页面访问记录（通过服务端 API）
-- 这防止恶意用户制造虚假访问记录
CREATE POLICY "Service role can insert page views" ON whitelabel_page_views
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
  );

-- ============================================
-- 3. 添加速率限制函数（可选，用于未来扩展）
-- ============================================

-- 检查某个 session 在最近 N 秒内的请求次数
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_session_id VARCHAR,
  p_window_seconds INT DEFAULT 60,
  p_max_requests INT DEFAULT 30
)
RETURNS BOOLEAN AS $$
DECLARE
  request_count INT;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM whitelabel_page_views
  WHERE session_id = p_session_id
    AND viewed_at > NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  RETURN request_count < p_max_requests;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 完成
-- ============================================
