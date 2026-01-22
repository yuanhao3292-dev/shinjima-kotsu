-- ============================================
-- 完整网站图片配置
-- Complete Site Images Configuration
-- ============================================
-- 将 LandingPage.tsx 中所有硬编码图片迁移到数据库
-- 便于后台管理和更换

INSERT INTO site_images (image_key, category, title, description, image_url, default_url, recommended_width, recommended_height, aspect_ratio, usage_location) VALUES

-- ===== 医疗板块 Medical Section =====
('medical_hero', 'medical', '医疗板块主图', '医疗旅游页面顶部大图',
 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '医疗页面 Hero'),

('tech_ct', 'medical', 'CT检查设备', '医疗技术展示 - CT扫描',
 'https://i.ibb.co/mFbDmCvg/tech-ct.jpg',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术卡片 - CT'),

('tech_mri', 'medical', 'MRI检查设备', '医疗技术展示 - MRI扫描',
 'https://i.ibb.co/XxZdfCML/tech-mri.jpg',
 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术卡片 - MRI'),

('tech_endo', 'medical', '内视镜检查', '医疗技术展示 - 内视镜',
 'https://i.ibb.co/MkkrywCZ/tech-endo.jpg',
 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术卡片 - 内视镜'),

('tech_dental', 'medical', '口腔检查', '医疗技术展示 - 牙科',
 'https://i.ibb.co/tM1LBQJW/tech-dental.jpg',
 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '医疗技术卡片 - 口腔'),

('detail_echo', 'medical', '超声波检查', '医疗设备详情 - 超声波',
 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
 1200, 800, '3:2', '医疗设备详情 - 超声波'),

('detail_mammo', 'medical', '乳腺检查', '医疗设备详情 - 乳腺摄影',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
 1200, 800, '3:2', '医疗设备详情 - 乳腺'),

-- ===== 高尔夫板块 Golf Section =====
('golf_hero', 'golf', '高尔夫板块主图', '高尔夫页面顶部大图',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '高尔夫页面 Hero'),

('plan_kansai', 'golf', '关西经典球场', '高尔夫套餐 - 关西路线',
 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '高尔夫套餐卡片 - 关西'),

('plan_difficult', 'golf', '挑战级球场', '高尔夫套餐 - 挑战路线',
 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1623567341691-389eb3292434?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '高尔夫套餐卡片 - 挑战'),

('plan_fuji', 'golf', '富士山景球场', '高尔夫套餐 - 富士山路线',
 'https://i.ibb.co/B2L1nxdg/2025-12-16-16-36-41.png',
 'https://images.unsplash.com/photo-1563205764-5d59524dc335?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '高尔夫套餐卡片 - 富士山'),

-- ===== 商务考察板块 Business Section =====
('business_hero', 'business', '商务考察主图', '商务考察页面顶部大图',
 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
 2000, 1000, '2:1', '商务考察页面 Hero'),

('biz_auto', 'business', '汽车产业考察', '商务套餐 - 丰田/汽车',
 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 汽车'),

('biz_tech', 'business', '半导体科技考察', '商务套餐 - 半导体/科技',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 科技'),

('biz_retail', 'business', '零售业考察', '商务套餐 - UNIQLO/零售',
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 零售'),

('biz_medical', 'business', '医疗产业考察', '商务套餐 - 医疗/健康',
 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 医疗'),

('biz_food', 'business', '食品工厂考察', '商务套餐 - 食品/饮料',
 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 食品'),

('biz_hospitality', 'business', '酒店业考察', '商务套餐 - 酒店/旅游',
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 酒店'),

('biz_century', 'business', '百年企业考察', '商务套餐 - 传承/长寿企业',
 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 百年企业'),

('biz_precision', 'business', '精密制造考察', '商务套餐 - 精密制造',
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 精密制造'),

('biz_esg', 'business', 'ESG可持续发展', '商务套餐 - ESG/可持续',
 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - ESG'),

('biz_inamori', 'business', '稻盛哲学考察', '商务套餐 - 稻盛和夫/京瓷',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 稻盛哲学'),

('biz_logistics', 'business', '物流供应链考察', '商务套餐 - 物流/供应链',
 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 物流'),

('biz_agtech', 'business', '农业科技考察', '商务套餐 - 农业/食品安全',
 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 农业科技'),

('biz_dx', 'business', '数字化转型考察', '商务套餐 - DX/数字化',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 数字化'),

('biz_construction', 'business', '建筑地产考察', '商务套餐 - 建筑/地产',
 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 建筑'),

('biz_senior_care', 'business', '养老产业考察', '商务套餐 - 养老/护理',
 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 养老护理'),

('biz_senior_living', 'business', '适老化住宅考察', '商务套餐 - 适老化/认知症',
 'https://images.unsplash.com/photo-1559234938-b60fff04894d?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1559234938-b60fff04894d?q=80&w=800&auto=format&fit=crop',
 1000, 750, '4:3', '商务套餐卡片 - 适老化'),

-- ===== 首页预览卡片 Home Preview =====
('home_medical_preview', 'hero', '首页医疗预览', '首页医疗服务预览卡片图',
 'https://images.unsplash.com/photo-1531297461136-82ae96c51248?q=80&w=1000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1531297461136-82ae96c51248?q=80&w=1000&auto=format&fit=crop',
 1000, 750, '4:3', '首页 - 医疗服务预览'),

('home_business_preview', 'hero', '首页商务预览', '首页商务服务预览卡片图',
 'https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=800&auto=format&fit=crop',
 800, 600, '4:3', '首页 - 商务服务预览'),

-- ===== 团队/关于我们 Team =====
('founder_portrait', 'team', '创始人照片', '公司创始人肖像照',
 'https://i.ibb.co/B2mJDvq7/founder.jpg',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
 400, 400, '1:1', '关于我们 - 创始人'),

-- ===== 移动端备用图片 Mobile Fallbacks =====
('mobile_medical_fallback', 'general', '移动端医疗备用图', '移动设备上医疗板块的备用背景',
 'https://i.ibb.co/TDYnsXBb/013-2.jpg',
 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
 1200, 800, '3:2', '移动端 - 医疗备用'),

('mobile_business_fallback', 'general', '移动端商务备用图', '移动设备上商务板块的备用背景',
 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
 1200, 800, '3:2', '移动端 - 商务备用'),

-- ===== 车辆展示图片 Vehicles Section =====
-- 注意：这些图片存储在 Supabase Storage (vehicle-image bucket)
-- 可以直接在 Supabase 后台上传替换，或通过此表管理 URL
('vehicle_alphard', 'vehicles', '丰田埃尔法', '高端商务 MPV',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/alphard.jpg',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/alphard.jpg',
 800, 600, '4:3', '车辆展示页 - 埃尔法'),

('vehicle_hiace', 'vehicles', '丰田海狮', '9座商务车',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/hiace.jpg',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/hiace.jpg',
 800, 600, '4:3', '车辆展示页 - 海狮'),

('vehicle_coaster', 'vehicles', '丰田考斯特', '小型巴士',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/coaster.jpg',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/coaster.jpg',
 800, 600, '4:3', '车辆展示页 - 考斯特'),

('vehicle_melpha', 'vehicles', '日野 Melpha', '中型巴士',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/melpha.jpg',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/melpha.jpg',
 800, 600, '4:3', '车辆展示页 - Melpha'),

('vehicle_selega', 'vehicles', '日野 Selega', '大型巴士',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/selega.jpg',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/selega.jpg',
 800, 600, '4:3', '车辆展示页 - Selega'),

('vehicle_aeroqueen', 'vehicles', '三菱 Aero Queen', '超豪华大巴',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/aeroqueen.jpg',
 'https://fcpcjfqxxtxlbtvbjduk.supabase.co/storage/v1/object/public/vehicle-image/aeroqueen.jpg',
 800, 600, '4:3', '车辆展示页 - Aero Queen'),

-- ===== 首页轮播图 Hero Slides =====
('hero_slide_1', 'hero', '首页轮播图1', '癌症治疗主题',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页轮播 - 癌症治疗'),

('hero_slide_2', 'hero', '首页轮播图2', 'TIMC体检主题',
 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
 2000, 1200, '16:9', '首页轮播 - TIMC体检'),

('hero_slide_2_mobile', 'hero', '首页轮播图2(移动端)', 'TIMC体检移动端版本',
 'https://i.ibb.co/TDYnsXBb/013-2.jpg',
 'https://i.ibb.co/TDYnsXBb/013-2.jpg',
 1200, 800, '3:2', '首页轮播 - TIMC体检(移动端)'),

('hero_slide_3', 'hero', '首页轮播图3', 'AI健康检测主题',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页轮播 - AI健康检测'),

-- ===== 首页板块背景图 Homepage Section BGs =====
('homepage_partner_bg', 'hero', '首页合作伙伴背景', '导游合作板块背景',
 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop',
 2000, 1200, '16:9', '首页 - 合作伙伴板块背景')

ON CONFLICT (image_key) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  default_url = EXCLUDED.default_url,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  usage_location = EXCLUDED.usage_location,
  recommended_width = EXCLUDED.recommended_width,
  recommended_height = EXCLUDED.recommended_height,
  aspect_ratio = EXCLUDED.aspect_ratio,
  updated_at = NOW();

-- ============================================
-- 验证
-- ============================================
-- SELECT image_key, category, title, usage_location FROM site_images ORDER BY category, image_key;
