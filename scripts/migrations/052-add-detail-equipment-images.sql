-- ============================================
-- 添加超声波和乳房摄影设备图片
-- Add detail_echo and detail_mammo images
-- ============================================

INSERT INTO site_images (image_key, category, title, description, image_url, default_url, recommended_width, recommended_height, aspect_ratio, usage_location) VALUES

('detail_echo', 'medical', '超声波设备', '医疗设备详情 - 超声波 Aplio i-700 / ARIETTA850',
 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
 1200, 800, '3:2', '医疗技术卡片 - 超声波'),

('detail_mammo', 'medical', '乳房摄影设备', '医疗设备详情 - 乳房摄影 AMULET SOPHINITY',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
 1200, 800, '3:2', '医疗技术卡片 - 乳房摄影')

ON CONFLICT (image_key) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  default_url = EXCLUDED.default_url,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  usage_location = EXCLUDED.usage_location,
  updated_at = NOW();
