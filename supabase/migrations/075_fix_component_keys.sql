-- ============================================================
-- 075: 修复 page_modules 的 component_key，确保选品中心分类正常
-- ============================================================
-- 问题：部分模块的 component_key 为 NULL 或不匹配前端配置，
--       导致所有模块都显示在"其他服务模块"中，分类标签页不显示。
-- ============================================================

-- 1. 查看当前所有模块的 component_key（调试用，可先单独执行）
-- SELECT id, name, component_key FROM page_modules WHERE is_active = true ORDER BY sort_order;

-- 2. 逐一修复 component_key（按名称匹配）

-- 兵庫医科大学 → hyogo_medical（综合医院合作）
UPDATE page_modules
SET component_key = 'hyogo_medical'
WHERE name ILIKE '%兵庫医科%' OR name ILIKE '%hyogo%'
  AND is_active = true;

-- 大阪国際がんセンター → cancer_treatment（综合医院合作）
UPDATE page_modules
SET component_key = 'cancer_treatment'
WHERE (name ILIKE '%がんセンター%' OR name ILIKE '%癌症%' OR name ILIKE '%cancer%')
  AND component_key IS DISTINCT FROM 'cell_medicine'
  AND is_active = true;

-- TIMC 体検 → medical_packages（体检中心合作）
UPDATE page_modules
SET component_key = 'medical_packages'
WHERE (name ILIKE '%TIMC%' OR name ILIKE '%体検%' OR name ILIKE '%体检%')
  AND is_active = true;

-- SAI クリニック → sai_clinic（医美整形合作）
UPDATE page_modules
SET component_key = 'sai_clinic'
WHERE (name ILIKE '%SAI%' AND name ILIKE '%クリニック%')
  AND is_active = true;

-- W CLINIC men's → wclinic_mens（医美整形合作）
UPDATE page_modules
SET component_key = 'wclinic_mens'
WHERE (name ILIKE '%W CLINIC%' OR name ILIKE '%wclinic%')
  AND is_active = true;

-- 表参道 HELENE → helene_clinic（干细胞中心合作）
UPDATE page_modules
SET component_key = 'helene_clinic'
WHERE (name ILIKE '%HELENE%' OR name ILIKE '%helene%')
  AND is_active = true;

-- 銀座鳳凰クリニック → ginza_phoenix（干细胞中心合作）
UPDATE page_modules
SET component_key = 'ginza_phoenix'
WHERE (name ILIKE '%鳳凰%' OR name ILIKE '%phoenix%' OR name ILIKE '%銀座鳳凰%')
  AND is_active = true;

-- 先端細胞医療 → cell_medicine（干细胞中心合作）
UPDATE page_modules
SET component_key = 'cell_medicine'
WHERE (name ILIKE '%先端細胞%' OR name ILIKE '%cell_medicine%' OR name ILIKE '%Cell-Medicine%')
  AND is_active = true;

-- AC セルクリニック → ac_plus（干细胞中心合作）
UPDATE page_modules
SET component_key = 'ac_plus'
WHERE (name ILIKE '%ACセル%' OR name ILIKE '%AC国際%' OR name ILIKE '%ac_plus%')
  AND is_active = true;

-- 3. 验证结果
SELECT name, component_key, is_active
FROM page_modules
WHERE is_active = true
ORDER BY sort_order;
