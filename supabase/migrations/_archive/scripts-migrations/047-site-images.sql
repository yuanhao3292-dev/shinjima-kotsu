-- ============================================
-- 网站图片管理系统
-- Site Images Management System
-- ============================================
-- 允许管理员通过后台上传和管理网站图片

-- 1. 创建图片配置表
CREATE TABLE IF NOT EXISTS site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 图片标识符（用于代码引用）
  image_key VARCHAR(100) NOT NULL UNIQUE,

  -- 图片分类
  category VARCHAR(50) NOT NULL,
  -- 分类: 'hero' (首页大图), 'medical' (医疗), 'golf' (高尔夫),
  --       'business' (商务), 'general' (通用), 'team' (团队)

  -- 图片信息
  title VARCHAR(200) NOT NULL,           -- 图片标题（管理用）
  description TEXT,                       -- 图片描述

  -- 图片 URL
  image_url TEXT NOT NULL,               -- 当前使用的图片 URL
  default_url TEXT,                      -- 默认 URL（Unsplash 等）

  -- 图片尺寸建议
  recommended_width INT,
  recommended_height INT,
  aspect_ratio VARCHAR(20),              -- 如 '16:9', '4:3', '1:1'

  -- 使用位置说明
  usage_location TEXT,                   -- 说明这个图片用在哪里

  -- 状态
  is_active BOOLEAN DEFAULT true,

  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_site_images_key ON site_images(image_key);
CREATE INDEX IF NOT EXISTS idx_site_images_category ON site_images(category);

-- 3. 插入默认图片配置
INSERT INTO site_images (image_key, category, title, description, image_url, default_url, recommended_width, recommended_height, aspect_ratio, usage_location) VALUES

-- ===== 首页 Hero 图片 =====
('home_hero', 'hero', '首页主横幅', '网站首页顶部大图',
 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '首页顶部横幅背景'),

-- ===== 医疗版块 =====
('medical_hero', 'medical', '医疗版块主图', '医疗旅游首页大图',
 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '医疗版块顶部横幅'),

('medical_preview', 'medical', '医疗预览图', '首页医疗服务预览卡片',
 'https://images.unsplash.com/photo-1531297461136-82ae96c51248?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1531297461136-82ae96c51248?q=80&w=1000&auto=format&fit=crop',
 800, 600, '4:3', '首页医疗服务卡片'),

('tech_ct', 'medical', 'CT检查设备', '先进CT扫描设备',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术展示 - CT'),

('tech_mri', 'medical', 'MRI检查设备', '先进MRI扫描设备',
 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术展示 - MRI'),

('tech_endo', 'medical', '内视镜检查', '先进内视镜设备',
 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术展示 - 内视镜'),

('tech_dental', 'medical', '口腔检查', '牙科检查设备',
 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术展示 - 口腔'),

-- ===== 高尔夫版块 =====
('golf_hero', 'golf', '高尔夫版块主图', '高尔夫旅游首页大图',
 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '高尔夫版块顶部横幅'),

('golf_preview', 'golf', '高尔夫预览图', '首页高尔夫服务预览卡片',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1000&auto=format&fit=crop',
 800, 600, '4:3', '首页高尔夫服务卡片'),

('plan_kansai', 'golf', '关西球场', '关西地区高尔夫球场',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '高尔夫套餐卡片 - 关西'),

('plan_difficult', 'golf', '挑战球场', '高难度挑战球场',
 'https://images.unsplash.com/photo-1623567341691-389eb3292434?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1623567341691-389eb3292434?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '高尔夫套餐卡片 - 挑战'),

('plan_fuji', 'golf', '富士山球场', '富士山景高尔夫球场',
 'https://images.unsplash.com/photo-1563205764-5d59524dc335?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1563205764-5d59524dc335?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '高尔夫套餐卡片 - 富士山'),

-- ===== 商务版块 =====
('business_hero', 'business', '商务版块主图', '商务考察首页大图',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '商务版块顶部横幅'),

('business_preview', 'business', '商务预览图', '首页商务服务预览卡片',
 'https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '首页商务服务卡片'),

('biz_medical', 'business', '医疗考察', '医疗机构商务考察',
 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '商务套餐卡片 - 医疗考察'),

('biz_tokyo', 'business', '东京商务', '东京商务考察',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '商务套餐卡片 - 东京'),

('biz_factory', 'business', '工厂参观', '精密制造工厂',
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '商务套餐卡片 - 工厂'),

('biz_resort', 'business', '度假村', '高端度假村',
 'https://images.unsplash.com/photo-1571896349842-6e5a513e610a?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1571896349842-6e5a513e610a?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '商务套餐卡片 - 度假村'),

('biz_golden', 'business', '黄金路线', '新干线富士山',
 'https://images.unsplash.com/photo-1490761668535-35497054764d?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1490761668535-35497054764d?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '商务套餐卡片 - 黄金路线'),

-- ===== 团队/关于我们 =====
('founder_portrait', 'team', '创始人照片', '公司创始人肖像',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
 400, 400, '1:1', '关于我们 - 创始人'),

('team_photo', 'team', '团队合照', '公司团队合照',
 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop',
 1600, 900, '16:9', '关于我们 - 团队'),

-- ===== 通用背景 =====
('pattern_bg', 'general', '纹理背景', '装饰性纹理背景',
 'https://www.transparenttextures.com/patterns/cubes.png',
 'https://www.transparenttextures.com/patterns/cubes.png',
 400, 400, '1:1', '装饰性背景纹理'),

('default_placeholder', 'general', '默认占位图', '图片加载失败时的占位图',
 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '通用占位图')

ON CONFLICT (image_key) DO NOTHING;

-- 4. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_site_images_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_site_images_timestamp ON site_images;
CREATE TRIGGER trigger_site_images_timestamp
  BEFORE UPDATE ON site_images
  FOR EACH ROW
  EXECUTE FUNCTION update_site_images_timestamp();

-- 5. RLS 策略（允许公开读取）
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images"
  ON site_images FOR SELECT
  USING (true);

-- 6. 添加注释
COMMENT ON TABLE site_images IS '网站图片配置表，管理所有页面使用的图片';
COMMENT ON COLUMN site_images.image_key IS '图片唯一标识，用于代码引用';
COMMENT ON COLUMN site_images.category IS '图片分类：hero/medical/golf/business/team/general';
COMMENT ON COLUMN site_images.image_url IS '当前使用的图片URL（可能是上传的或默认的）';
COMMENT ON COLUMN site_images.default_url IS '默认图片URL（Unsplash等）';

-- ============================================
-- 验证
-- ============================================
-- SELECT image_key, category, title, usage_location FROM site_images ORDER BY category, image_key;
