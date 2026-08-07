-- ============================================
-- 安全修复：收紧 4 条缺少 TO 子句的 RLS 策略
--
-- 背景：CREATE POLICY 不写 TO 子句时默认作用于 PUBLIC（含 anon），
-- 而 service_role 本身就绕过 RLS、根本不需要策略。因此下面这些
-- "给 service role 用"的 USING (true) 策略，实际效果是把权限
-- 开放给了持有公开 anon key 的任何人。
--
-- 影响的表按严重度排序：
--   1. customer_service_contracts —— 明文护照号/姓名/电话，可被全表拖走
--   2. whitelabel_screenings     —— 健康问诊数据，可被匿名增删改查
--   3. white_label_orders        —— 佣金订单，可被匿名伪造插入
--   4. whitelabel_page_views     —— 访问埋点，可被匿名污染
--
-- 修复后这些表仅可通过服务端 service_role 客户端访问（现有 API 路由
-- 已全部走 getSupabaseAdmin()，无需改动应用代码）。
-- ============================================

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. customer_service_contracts（原 062）
-- 原策略注释称"通过 UUID 访问本身就有安全性"，但 PostgREST 查询
-- 无需带 UUID 过滤条件，USING (true) 等于允许 SELECT * 全表。
-- 合同签署页 app/contract/sign/[id] 是服务端组件 + HMAC 签约令牌 +
-- service_role 读取，不依赖此策略，故直接删除。
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DROP POLICY IF EXISTS "Public can view own contract by ID" ON customer_service_contracts;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. whitelabel_screenings（原 068）
-- 策略名写的是 "Service role full access"，但漏了 TO service_role，
-- 实际把 FOR ALL 授予了 anon。
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DROP POLICY IF EXISTS "Service role full access on whitelabel_screenings" ON whitelabel_screenings;

CREATE POLICY "Service role full access on whitelabel_screenings"
  ON whitelabel_screenings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. white_label_orders（原 scripts/migrations/060）
-- 匿名 INSERT 意味着可以伪造佣金订单记录。
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DROP POLICY IF EXISTS "Service role can insert orders" ON white_label_orders;

CREATE POLICY "Service role can insert orders"
  ON white_label_orders
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. whitelabel_page_views（原 scripts/migrations/036）
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DROP POLICY IF EXISTS "Service can insert page views" ON whitelabel_page_views;

CREATE POLICY "Service can insert page views"
  ON whitelabel_page_views
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 验证：执行后下面这条查询应返回 0 行
-- （列出所有对 anon/public 开放且无行级条件的策略）
--
--   SELECT schemaname, tablename, policyname, roles, cmd
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND qual = 'true'
--     AND ('anon' = ANY(roles) OR 'public' = ANY(roles))
--     AND tablename IN (
--       'customer_service_contracts', 'whitelabel_screenings',
--       'white_label_orders', 'whitelabel_page_views'
--     );
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
