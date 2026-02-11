-- =====================================================
-- 060: 添加兵庫医科大学病院模块到选品中心
-- Insert Hyogo Medical University Hospital as a page module
-- =====================================================

-- 1. 插入模块（如果不存在）
INSERT INTO page_modules (
  category,
  name,
  name_ja,
  name_en,
  slug,
  description,
  description_ja,
  commission_rate,
  tags,
  is_premium,
  is_required,
  sort_order,
  is_active,
  component_key,
  display_config,
  page_content
) VALUES (
  'medical',
  '兵庫医科大学病院',
  '兵庫医科大学病院',
  'Hyogo Medical University Hospital',
  'hyogo-medical',
  '自1972年开院，兵库县最大规模特定功能医院。全国仅87家国家指定特定功能医院之一，配备达芬奇Xi手术机器人、hinotori国产手术机器人、PET-CT中心等先进设备。2026年9月新病院大楼即将开院。',
  '1972年開院以来、兵庫県最大規模の特定機能病院。全国わずか87の国指定特定機能病院の一つ。ダヴィンチXi手術ロボット、hinotori国産手術ロボット、PET-CTセンターなど最先端設備を完備。2026年9月新病院棟開院予定。',
  15.00,
  ARRAY['医院', '特定功能医院', '手术机器人', 'PET-CT', '兵库县', '高端医疗'],
  false,
  false,
  10,
  true,
  'hyogo_medical',
  '{
    "template": "immersive",
    "sectionId": "hyogo-medical",
    "navLabel": "兵庫医科",
    "heroImage": "https://www.hosp.hyo-med.ac.jp/library/petcenter/institution/img/img01.jpg",
    "colorTheme": "slate",
    "tagline": "Hyogo Medical University Hospital",
    "title": "兵庫医科大学病院",
    "subtitle": "兵库县最大规模特定功能医院",
    "description": "自1972年开院以来，以最先进的医疗设备和高端医疗技术持续贡献。国家指定特定功能医院，全日本仅87家，兵库县内仅2家。2026年9月新病院大楼即将开院。",
    "stats": [
      {"value": "801", "unit": "床", "label": "新病院规模"},
      {"value": "87", "unit": "家", "label": "全国特定功能医院"},
      {"value": "50", "unit": "+年", "label": "医院历史"}
    ],
    "tags": ["达芬奇Xi手术机器人", "PET-CT", "3.0T MRI", "320列CT"],
    "ctaText": "咨询医疗服务",
    "sidebar": {
      "title": "先进医疗设备",
      "type": "checklist",
      "items": [
        {"name": "达芬奇Xi", "desc": "机器人辅助手术系统"},
        {"name": "PET-CT中心", "desc": "全身癌症筛查"},
        {"name": "3.0T MRI", "desc": "超高精度影像诊断"},
        {"name": "320列CT", "desc": "低辐射心脏检查"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "兵庫医科大学病院",
    "heroSubtitle": "兵库县最大规模特定功能医院",
    "sections": [],
    "detailPage": "/hyogo-medical"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  display_config = EXCLUDED.display_config,
  description = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  updated_at = now();
