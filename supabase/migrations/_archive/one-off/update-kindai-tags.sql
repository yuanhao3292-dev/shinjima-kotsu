-- 为近畿大学病院添加标签，使其归类到"综合医院"模块

UPDATE page_modules
SET
  tags = ARRAY['综合医院', '特定功能医院', '达芬奇手术', '放射治疗', '心脏血管', '大阪'],
  updated_at = NOW()
WHERE slug = 'kindai-hospital';

-- 同时确保兵库医科大学也有"综合医院"标签
UPDATE page_modules
SET
  tags = ARRAY['综合医院', '特定功能医院', '手术机器人', 'PET-CT', '兵库县', '高端医疗'],
  updated_at = NOW()
WHERE slug = 'hyogo-medical';

-- 验证结果
SELECT slug, name, category, tags
FROM page_modules
WHERE slug IN ('kindai-hospital', 'hyogo-medical')
ORDER BY slug;
