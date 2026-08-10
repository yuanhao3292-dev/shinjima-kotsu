-- =====================================================
-- 116: 锁死 bookings —— 删除导游的直连 UPDATE 权限
-- =====================================================
-- _archive/one-off/guide-partner-schema.sql 里的 "Guides can update own bookings"
-- 策略【只有 USING、没有 WITH CHECK、不限制列】。导游用自己的 token 就能对名下预约
-- 任意 update:把 deposit_status 改成 'paid' 跳过真实付款、篡改 commission_rate /
-- actual_spend / commission_amount 抬高佣金、甚至改 status 伪造完成。押金真伪和金额
-- 本应只由 service-role(admin API / Stripe webhook)掌控。
--
-- 决策:彻底删除该策略。导游对 bookings 只保留 SELECT(看自己的)+ INSERT(下单)。
-- 唯一合法的客户端 update —— 取消预约 —— 已改走服务端路由
-- POST /api/guide-bookings/cancel(service-role 校验所有权/状态、服务端判定押金归属)。
-- admin 的确认/完成/爽约/取消走 getSupabaseAdmin(service-role),绕过 RLS,不受影响。
--
-- ⚠️ 本项目无迁移自动跟踪,需手动在生产库执行本文件。
-- ⚠️ 部署顺序:先上应用代码(取消路由已就绪)再执行本迁移,避免删策略后旧前端
--    直连 update 取消失败的空窗。

DROP POLICY IF EXISTS "Guides can update own bookings" ON bookings;
