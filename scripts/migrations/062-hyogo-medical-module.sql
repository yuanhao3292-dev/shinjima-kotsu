-- ============================================
-- 062: 兵庫医科大学病院専題模块
-- Hyogo Medical University Hospital Module
-- ============================================

-- 添加兵庫医科大学病院模块到 page_modules 表
INSERT INTO page_modules (
  category,
  name,
  name_ja,
  slug,
  description,
  component_key,
  commission_rate,
  is_required,
  sort_order,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'medical',
  '兵庫医科大学病院',
  '兵庫医科大学病院',
  'hyogo-medical',
  '兵庫県最大規模の特定功能医院。963床、41診療科を擁し、国指定特定機能病院として高度な医療を提供。2026年新病院棟開院予定。',
  'hyogo_medical',
  10,
  false,
  70,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 为现有模块添加注释
COMMENT ON TABLE page_modules IS '白标页面模块表 - 包含所有可供导游选择的服务模块';

-- ============================================
-- 完成
-- ============================================
