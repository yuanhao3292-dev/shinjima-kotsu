-- =====================================================
-- 070: 添加銀座鳳凰クリニック模块到选品中心
-- Insert Ginza Phoenix Clinic as a page module
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
  '銀座鳳凰クリニック',
  '銀座鳳凰クリニック',
  'Ginza Phoenix Clinic',
  'ginza-phoenix',
  '东京秋叶原UDX的癌症免疫细胞治疗专门诊所。拥有厚生劳动省认可的19项再生医疗计划，提供WT1树突细胞疫苗、NK细胞、NKT细胞三大核心免疫疗法。院长永井恒志（东京大学博士）领衔，GMP标准细胞培养，可与标准治疗联合使用。',
  '東京秋葉原UDXのがん免疫細胞治療専門クリニック。厚生労働省認可の再生医療計画19件を保有。WT1樹状細胞ワクチン・NK細胞・NKT細胞の3大免疫療法を提供。院長永井恒志（東京大学博士）率いる専門チーム、GMP基準の細胞培養、標準治療との併用が可能。',
  15.00,
  ARRAY['癌症免疫', '树突细胞', 'NK细胞', 'NKT细胞', '免疫治疗', '东京', '秋叶原', '厚劳省认可'],
  false,
  false,
  16,
  true,
  'ginza_phoenix',
  '{
    "template": "immersive",
    "sectionId": "ginza-phoenix",
    "navLabel": "銀座鳳凰免疫治療",
    "heroImage": "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "blue",
    "tagline": "Ginza Phoenix Clinic",
    "title": "銀座鳳凰クリニック",
    "subtitle": "癌症免疫细胞治疗专门诊所",
    "description": "厚生劳动省认可19项再生医疗计划。提供WT1树突细胞疫苗、NK细胞、NKT细胞三大免疫疗法，可与手术·放疗·化疗联合使用，适用于多种实体瘤和血液恶性肿瘤。",
    "stats": [
      {"value": "19", "unit": "件", "label": "厚劳省认可计划"},
      {"value": "3", "unit": "大", "label": "核心免疫疗法"},
      {"value": "350", "unit": "万+", "label": "参考疗程费用"},
      {"value": "GMP", "unit": "", "label": "细胞培养标准"}
    ],
    "tags": ["WT1树突细胞", "NK细胞", "NKT细胞", "厚劳省认可"],
    "ctaText": "咨询免疫治疗",
    "sidebar": {
      "title": "治疗流程",
      "type": "steps",
      "items": [
        {"name": "初诊评估", "desc": "分析病情制定方案", "step": "1"},
        {"name": "血液采集", "desc": "采集免疫细胞", "step": "2"},
        {"name": "细胞培养", "desc": "GMP标准2-3周", "step": "3"},
        {"name": "免疫治疗", "desc": "回输激活免疫细胞", "step": "4"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "銀座鳳凰クリニック",
    "heroSubtitle": "癌症免疫细胞治疗专门诊所",
    "sections": [],
    "detailPage": "/ginza-phoenix"
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

-- 2. 插入銀座鳳凰 初期咨询服务到 medical_packages 表
-- 注意: 实际数据库 medical_packages 表已重建，使用新 schema
INSERT INTO medical_packages (
  name_zh,
  name_ja,
  name_en,
  price,
  currency,
  original_price,
  category,
  description_i18n,
  tags,
  is_active,
  is_featured,
  sort_order
) VALUES (
  '銀座鳳凰診所 - 前期諮詢服務',
  '銀座鳳凰クリニック - 初期相談サービス',
  'Ginza Phoenix Clinic - Initial Consultation',
  221000,
  'JPY',
  221000,
  'treatment',
  '{
    "zh": "病历翻译（中→日）、銀座鳳凰クリニック初步咨询、免疫细胞疗法可行性评估、费用概算",
    "ja": "カルテ翻訳（中→日）、銀座鳳凰クリニック初期相談、免疫細胞療法の実現可能性評価、費用概算",
    "en": "Medical record translation, Ginza Phoenix Clinic consultation, immunotherapy feasibility assessment, cost estimation"
  }'::jsonb,
  ARRAY['癌症免疫', '免疫治疗', '銀座鳳凰', '咨询'],
  true,
  false,
  130
);

-- 3. 插入銀座鳳凰 远程诊断服务到 medical_packages 表
INSERT INTO medical_packages (
  name_zh,
  name_ja,
  name_en,
  price,
  currency,
  original_price,
  category,
  description_i18n,
  tags,
  is_active,
  is_featured,
  sort_order
) VALUES (
  '銀座鳳凰診所 - 遠程診斷服務',
  '銀座鳳凰クリニック - 遠隔診療サービス',
  'Ginza Phoenix Clinic - Remote Consultation',
  243000,
  'JPY',
  243000,
  'treatment',
  '{
    "zh": "与銀座鳳凰クリニック专科医生远程视频会诊、免疫细胞疗法方案评估、个性化治疗计划制定、费用概算",
    "ja": "銀座鳳凰クリニック専門医とのオンライン診療、免疫細胞療法プラン評価、個別治療計画の策定、費用概算",
    "en": "Remote video consultation with Ginza Phoenix specialist, immunotherapy plan evaluation, personalized treatment planning, cost estimation"
  }'::jsonb,
  ARRAY['癌症免疫', '免疫治疗', '銀座鳳凰', '远程诊断'],
  true,
  false,
  131
);
