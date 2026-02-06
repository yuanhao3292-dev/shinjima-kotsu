-- ============================================
-- 白标系统增强
-- White-Label System Enhancements
-- ============================================

-- ============================================
-- 1. 添加 selected_pages 列
-- ============================================
ALTER TABLE guides ADD COLUMN IF NOT EXISTS selected_pages JSONB DEFAULT '["timc-medical", "premium-golf", "business-inspection"]'::jsonb;

-- 创建索引用于查询
CREATE INDEX IF NOT EXISTS idx_guides_selected_pages ON guides USING GIN (selected_pages);

-- ============================================
-- 2. 更新 subscription_plan 约束以支持新计划
-- ============================================
-- 先删除旧约束
ALTER TABLE guides DROP CONSTRAINT IF EXISTS guides_subscription_plan_check;

-- 添加新约束（包含 basic 和 professional）
ALTER TABLE guides ADD CONSTRAINT guides_subscription_plan_check
  CHECK (subscription_plan IN ('none', 'monthly', 'basic', 'professional'));

-- ============================================
-- 3. 为 guides 表添加 RLS 策略
-- ============================================
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Guides can view own profile" ON guides;
DROP POLICY IF EXISTS "Guides can update own profile" ON guides;
DROP POLICY IF EXISTS "Service role full access" ON guides;
DROP POLICY IF EXISTS "Public can view approved guides by slug" ON guides;

-- 导游可以查看自己的资料
CREATE POLICY "Guides can view own profile" ON guides
  FOR SELECT USING (
    auth_user_id = auth.uid()
  );

-- 导游可以更新自己的资料（有限字段）
CREATE POLICY "Guides can update own profile" ON guides
  FOR UPDATE USING (
    auth_user_id = auth.uid()
  );

-- 服务端（service_role）有完整访问权限
CREATE POLICY "Service role full access" ON guides
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- 公开查看已批准导游的基本信息（通过 slug）
-- 用于白标页面公开访问
CREATE POLICY "Public can view approved guides by slug" ON guides
  FOR SELECT USING (
    status = 'approved' AND slug IS NOT NULL
  );

-- ============================================
-- 4. 加强 whitelabel_orders 的 RLS
-- ============================================

-- 删除旧策略
DROP POLICY IF EXISTS "Guides can view own orders" ON whitelabel_orders;
DROP POLICY IF EXISTS "Service role can insert orders" ON whitelabel_orders;
DROP POLICY IF EXISTS "Guides can update own orders" ON whitelabel_orders;

-- 导游只能查看自己的订单
CREATE POLICY "Guides can view own orders" ON whitelabel_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM guides
      WHERE guides.id = whitelabel_orders.guide_id
        AND guides.auth_user_id = auth.uid()
    )
  );

-- 服务端可以插入订单
CREATE POLICY "Service role can manage orders" ON whitelabel_orders
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- ============================================
-- 5. 加强 whitelabel_page_views 的 RLS
-- ============================================

-- 删除旧策略
DROP POLICY IF EXISTS "Guides can view own page views" ON whitelabel_page_views;
DROP POLICY IF EXISTS "Service role can insert page views" ON whitelabel_page_views;

-- 导游只能查看自己的页面访问记录
CREATE POLICY "Guides can view own page views" ON whitelabel_page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM guides
      WHERE guides.id = whitelabel_page_views.guide_id
        AND guides.auth_user_id = auth.uid()
    )
  );

-- 服务端可以管理页面访问记录
CREATE POLICY "Service role can manage page views" ON whitelabel_page_views
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- ============================================
-- 6. 辅助函数：验证页面选择是否符合订阅计划
-- ============================================
CREATE OR REPLACE FUNCTION validate_selected_pages()
RETURNS TRIGGER AS $$
DECLARE
  page_count INT;
  max_pages INT;
BEGIN
  -- 计算选择的页面数量
  page_count := jsonb_array_length(COALESCE(NEW.selected_pages, '[]'::jsonb));

  -- 根据订阅计划确定最大页面数
  CASE NEW.subscription_plan
    WHEN 'basic' THEN max_pages := 2;
    WHEN 'professional', 'monthly' THEN max_pages := -1; -- 无限制
    ELSE max_pages := 2; -- 默认基础版限制
  END CASE;

  -- 检查是否超过限制
  IF max_pages > 0 AND page_count > max_pages THEN
    RAISE EXCEPTION 'Selected pages (%) exceeds plan limit (%)', page_count, max_pages;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_validate_selected_pages ON guides;
CREATE TRIGGER trigger_validate_selected_pages
  BEFORE INSERT OR UPDATE OF selected_pages, subscription_plan ON guides
  FOR EACH ROW
  EXECUTE FUNCTION validate_selected_pages();

-- ============================================
-- 完成
-- ============================================
