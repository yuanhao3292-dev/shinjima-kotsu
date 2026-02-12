-- ============================================
-- 065: 删除车辆库相关表和列
-- Drop vehicle library tables and references
-- ============================================

-- 1. 删除 guide_selected_vehicles 表（依赖 vehicle_library）
DROP TABLE IF EXISTS guide_selected_vehicles CASCADE;

-- 2. 删除 vehicle_library 表
DROP TABLE IF EXISTS vehicle_library CASCADE;

-- 3. 删除 guide_white_label 表中的 vehicle_template_id 列
ALTER TABLE guide_white_label DROP COLUMN IF EXISTS vehicle_template_id;

-- 4. 清理 page_templates 中的 vehicle 类型模板
DELETE FROM page_templates WHERE category = 'vehicle';
