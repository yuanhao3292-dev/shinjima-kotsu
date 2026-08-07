-- ============================================
-- 首页四大业务板块背景图
-- Homepage Section Background Images
-- ============================================
-- 为首页医疗体检、重疾治疗、高尔夫、商务考察四个板块添加可管理的背景图

INSERT INTO site_images (image_key, category, title, description, image_url, default_url, recommended_width, recommended_height, aspect_ratio, usage_location) VALUES

-- ===== 首页医疗体检板块 =====
('homepage_medical_bg', 'medical', '首页医疗体检背景', '首页医疗体检板块全屏背景图',
 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页 - 医疗体检板块背景'),

-- ===== 首页重疾治疗板块 =====
('homepage_treatment_bg', 'medical', '首页重疾治疗背景', '首页重疾治疗板块全屏背景图（癌症/心脑血管）',
 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页 - 重疾治疗板块背景'),

-- ===== 首页高尔夫板块 =====
('homepage_golf_bg', 'golf', '首页高尔夫背景', '首页名门高尔夫板块全屏背景图',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页 - 高尔夫板块背景'),

-- ===== 首页商务考察板块 =====
('homepage_business_bg', 'business', '首页商务考察背景', '首页商务考察板块全屏背景图',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页 - 商务考察板块背景')

ON CONFLICT (image_key) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  usage_location = EXCLUDED.usage_location,
  updated_at = NOW();

-- ============================================
-- 验证
-- ============================================
-- SELECT image_key, category, title, usage_location FROM site_images WHERE image_key LIKE 'homepage_%' ORDER BY image_key;
