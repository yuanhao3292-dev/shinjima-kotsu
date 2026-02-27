-- =====================================================
-- 074: 添加 AC Cell Clinic (ACセルクリニック) 模块到选品中心
-- Insert AC Cell Clinic as a page module
-- Location: Osaka, Japan Cell Building
-- =====================================================

-- 1. 插入模块
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
  'ACセルクリニック（再生医療・幹細胞治療）',
  'ACセルクリニック（再生医療・幹細胞治療）',
  'AC Cell Clinic (Regenerative Medicine & Stem Cell Therapy)',
  'ac-plus',
  'AC国际医疗集团旗下大阪再生医疗专门诊所。自家脂肪由来干细胞治疗、NK细胞疗法、干细胞培养上清液、ACRS疗法、血液净化。京都大学·大阪大学合作，30,000+治疗实绩，ISO Class 5 CPC洁净室。',
  'AC国際医療グループの大阪再生医療専門クリニック。自家脂肪由来幹細胞治療、NK細胞療法、幹細胞培養上清液、ACRS療法、血液浄化。京都大学・大阪大学と連携、30,000名以上の治療実績、ISO Class 5 CPC。',
  15.00,
  ARRAY['ACセルクリニック', 'AC Cell Clinic', '再生医療', '幹細胞', 'NK細胞', 'ACRS', '血液浄化', '京都大学', '大阪大学'],
  false,
  false,
  19,
  true,
  'ac_plus',
  '{
    "template": "immersive",
    "sectionId": "ac-plus",
    "navLabel": "ACセルクリニック",
    "heroImage": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "teal",
    "tagline": "大阪 · 再生医療専門",
    "title": "ACセルクリニック",
    "subtitle": "再生医療・幹細胞治療・NK細胞療法",
    "description": "AC国际医疗集团旗下大阪再生医疗专门诊所。京都大学·大阪大学合作，30,000+治疗实绩。自家脂肪由来干细胞治疗、NK细胞疗法、ACRS疗法、血液净化。",
    "stats": [
      {"value": "30000", "unit": "+", "label": "累计患者"},
      {"value": "18", "unit": "年", "label": "运营历史"},
      {"value": "98", "unit": "%+", "label": "满意度"},
      {"value": "9", "unit": "层", "label": "专用大楼"}
    ],
    "tags": ["干细胞治疗", "NK细胞", "再生医疗", "京都大学合作"],
    "ctaText": "咨询再生医疗",
    "sidebar": {
      "title": "核心服务",
      "type": "steps",
      "items": [
        {"name": "干细胞治疗", "desc": "自家脂肪由来MSC", "step": "1"},
        {"name": "NK细胞疗法", "desc": "癌症免疫治疗", "step": "2"},
        {"name": "ACRS疗法", "desc": "进化版PRP", "step": "3"},
        {"name": "血液净化", "desc": "体外循环净化", "step": "4"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "ACセルクリニック",
    "heroSubtitle": "再生医療・幹細胞治療・NK細胞療法",
    "sections": [],
    "detailPage": "/ac-plus"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  commission_rate = EXCLUDED.commission_rate,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  component_key = EXCLUDED.component_key,
  display_config = EXCLUDED.display_config,
  page_content = EXCLUDED.page_content,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- 2. 插入 AC Cell Clinic 初期咨询服务
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'ac-plus-initial-consultation',
  'ACセルクリニック - 初期相談サービス',
  'AC Cell Clinic - 前期諮詢服務',
  'AC Cell Clinic - Initial Consultation',
  221000,
  'other',
  155
)
ON CONFLICT (slug) DO NOTHING;

-- 3. 插入 AC Cell Clinic 远程诊断服务
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'ac-plus-remote-consultation',
  'ACセルクリニック - 遠隔診療サービス',
  'AC Cell Clinic - 遠程診斷服務',
  'AC Cell Clinic - Remote Consultation',
  243000,
  'other',
  156
)
ON CONFLICT (slug) DO NOTHING;
