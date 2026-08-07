-- ============================================
-- Migration 047: 修复 customers 表 RLS 策略
-- Fix Customers Table RLS Policy
-- ============================================
-- 问题：原策略 `auth.uid() IS NOT NULL` 允许任何登录用户查看所有客户信息
-- 修复：客户只能查看与自己 Stripe Customer ID 关联的数据

-- ============================================
-- 1. 修复 customers 表 RLS
-- ============================================

-- 删除有缺陷的旧策略
DROP POLICY IF EXISTS "客户可查看自己的信息" ON customers;

-- 创建新的安全策略：客户只能查看自己的信息
-- 通过 stripe_customer_id 与 auth.users 的 raw_user_meta_data 关联
CREATE POLICY "Customers can view own profile" ON customers
  FOR SELECT USING (
    stripe_customer_id IS NOT NULL
    AND stripe_customer_id = (
      SELECT raw_user_meta_data->>'stripe_customer_id'
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- 允许 service_role 完全访问（用于后端 API）
CREATE POLICY "Service role full access to customers" ON customers
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 2. 添加 Admin 访问策略（便于后台管理）
-- ============================================

-- 如果存在 admin_users 表，允许管理员查看所有客户
-- 注意：这个策略只在 admin_users 表存在时才有效
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
    EXECUTE 'CREATE POLICY "Admins can view all customers" ON customers
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
      )';
  END IF;
END $$;

-- ============================================
-- 3. 为 orders 和 payments 表添加额外保护
-- ============================================

-- 确保 service_role 可以访问订单（用于 Webhook 处理）
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to payments" ON payments;
CREATE POLICY "Service role full access to payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 4. 验证 RLS 已启用
-- ============================================

-- 确保所有表都启用了 RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 完成
-- ============================================
COMMENT ON POLICY "Customers can view own profile" ON customers IS
  '客户只能通过 stripe_customer_id 查看自己的信息';
