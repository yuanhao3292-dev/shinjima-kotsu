-- ============================================
-- 白标系统数据库架构
-- White-Label System Database Schema
-- ============================================

-- 为 guides 表添加白标相关字段
ALTER TABLE guides ADD COLUMN IF NOT EXISTS slug VARCHAR(50) UNIQUE;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS brand_name VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS brand_logo_url TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS brand_color VARCHAR(20) DEFAULT '#2563eb';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact_wechat VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact_line VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact_display_phone VARCHAR(30);

-- 订阅状态
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive'
  CHECK (subscription_status IN ('inactive', 'active', 'cancelled', 'past_due'));
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(20) DEFAULT 'none'
  CHECK (subscription_plan IN ('none', 'monthly'));
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(100);

-- 白标统计
ALTER TABLE guides ADD COLUMN IF NOT EXISTS whitelabel_views INT DEFAULT 0;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS whitelabel_conversions INT DEFAULT 0;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_subscription_status ON guides(subscription_status);
CREATE INDEX IF NOT EXISTS idx_guides_stripe_customer ON guides(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_guides_stripe_subscription ON guides(stripe_subscription_id);

-- ============================================
-- 白标订单追踪表
-- 记录通过白标页面来的订单
-- ============================================
CREATE TABLE IF NOT EXISTS whitelabel_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 关联
  guide_id UUID NOT NULL REFERENCES guides(id),
  -- 订单信息
  order_type VARCHAR(30) NOT NULL CHECK (order_type IN ('medical', 'treatment', 'golf', 'business', 'nightclub')),
  order_amount DECIMAL(12, 2),
  order_currency VARCHAR(3) DEFAULT 'JPY',
  -- 客户信息（匿名）
  customer_session_id VARCHAR(100), -- Cookie ID
  customer_city VARCHAR(50),
  -- 状态
  status VARCHAR(20) DEFAULT 'lead' CHECK (status IN ('lead', 'inquiry', 'booked', 'completed', 'cancelled')),
  -- 归属
  attributed_at TIMESTAMPTZ DEFAULT NOW(), -- 归属时间
  cookie_set_at TIMESTAMPTZ, -- Cookie 设置时间
  -- 返金
  commission_rate DECIMAL(4, 2),
  commission_amount DECIMAL(12, 2),
  commission_status VARCHAR(20) DEFAULT 'pending' CHECK (commission_status IN ('pending', 'calculated', 'paid')),
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_guide ON whitelabel_orders(guide_id);
CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_type ON whitelabel_orders(order_type);
CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_status ON whitelabel_orders(status);
CREATE INDEX IF NOT EXISTS idx_whitelabel_orders_session ON whitelabel_orders(customer_session_id);

-- RLS 策略
ALTER TABLE whitelabel_orders ENABLE ROW LEVEL SECURITY;

-- 导游只能查看自己的白标订单
CREATE POLICY "Guides can view own whitelabel orders" ON whitelabel_orders
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- ============================================
-- 白标页面访问日志
-- ============================================
CREATE TABLE IF NOT EXISTS whitelabel_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id),
  -- 访问信息
  page_path VARCHAR(500),
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id VARCHAR(100),
  -- 地理位置（可选）
  country VARCHAR(50),
  city VARCHAR(100),
  -- 时间
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引（用于统计）
CREATE INDEX IF NOT EXISTS idx_whitelabel_views_guide ON whitelabel_page_views(guide_id);
CREATE INDEX IF NOT EXISTS idx_whitelabel_views_date ON whitelabel_page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_whitelabel_views_session ON whitelabel_page_views(session_id);

-- RLS 策略
ALTER TABLE whitelabel_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides can view own page views" ON whitelabel_page_views
  FOR SELECT USING (
    guide_id IN (SELECT id FROM guides WHERE auth_user_id = auth.uid())
  );

-- 服务端可以插入访问记录
CREATE POLICY "Service can insert page views" ON whitelabel_page_views
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 触发器：自动生成 slug
-- ============================================
CREATE OR REPLACE FUNCTION generate_guide_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug VARCHAR(50);
  final_slug VARCHAR(50);
  counter INT := 0;
BEGIN
  -- 如果已有 slug，不覆盖
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  -- 基于名字生成 slug（简化处理，只保留字母数字）
  base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '', 'g'));

  -- 如果太短，使用随机后缀
  IF LENGTH(base_slug) < 3 THEN
    base_slug := 'guide' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
  END IF;

  -- 确保唯一性
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM guides WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || counter::TEXT;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_generate_guide_slug ON guides;

CREATE TRIGGER trigger_generate_guide_slug
  BEFORE INSERT OR UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION generate_guide_slug();

-- ============================================
-- 触发器：更新白标统计
-- ============================================
CREATE OR REPLACE FUNCTION update_whitelabel_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新浏览量
  IF TG_TABLE_NAME = 'whitelabel_page_views' THEN
    UPDATE guides
    SET whitelabel_views = whitelabel_views + 1, updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  -- 更新转化量
  IF TG_TABLE_NAME = 'whitelabel_orders' AND TG_OP = 'INSERT' THEN
    UPDATE guides
    SET whitelabel_conversions = whitelabel_conversions + 1, updated_at = NOW()
    WHERE id = NEW.guide_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_views_stats
  AFTER INSERT ON whitelabel_page_views
  FOR EACH ROW
  EXECUTE FUNCTION update_whitelabel_stats();

CREATE TRIGGER trigger_update_conversion_stats
  AFTER INSERT ON whitelabel_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_whitelabel_stats();

-- ============================================
-- 完成
-- ============================================
