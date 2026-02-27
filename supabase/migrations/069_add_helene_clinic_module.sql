-- =====================================================
-- 069: 添加表参道HELENE诊所模块到选品中心
-- Insert Omotesando HELENE Clinic as a page module
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
  '表参道HELENE诊所',
  '表参道ヘレネクリニック',
  'Omotesando HELENE Clinic',
  'helene-clinic',
  '日本首家合法干细胞治疗专门机构。2014年起通过厚生劳动省认可，独家3D多层培养技术，最高可培养22.5亿个MSC。16,000名以上治疗实绩，重大并发症零。剑桥大学教授监修。GCR国际认证。',
  '日本初の合法幹細胞治療専門機関。2014年より厚生労働省認可。独自3D多層培養技術で最大22.5億個のMSCを培養。16,000名以上の治療実績、重大合併症ゼロ。ケンブリッジ大学教授監修。GCR国際認証取得。',
  15.00,
  ARRAY['干细胞', '再生医疗', 'MSC', '外泌体', '抗衰老', '东京', '表参道', 'GCR认证'],
  false,
  false,
  15,
  true,
  'helene_clinic',
  '{
    "template": "immersive",
    "sectionId": "helene-clinic",
    "navLabel": "HELENE干细胞",
    "heroImage": "https://stemcells.jp/en/wp-content/themes/flavor_flavor_flavor/images/top/top-firstview-bg.webp",
    "colorTheme": "indigo",
    "tagline": "Omotesando HELENE Clinic",
    "title": "表参道HELENE诊所",
    "subtitle": "日本首家合法干细胞治疗专门机构",
    "description": "自2014年起实施厚生劳动省认可的干细胞治疗。独家3D多层培养技术，可培养世界顶级的22.5亿个MSC。16,000名以上治疗实绩，重大并发症零。剑桥大学教授监修。",
    "stats": [
      {"value": "16,000", "unit": "+", "label": "治疗实绩"},
      {"value": "22.5", "unit": "亿", "label": "MSC培养数"},
      {"value": "20", "unit": "+", "label": "厚劳省认可"}
    ],
    "tags": ["干细胞MSC", "外泌体", "GCR认证", "剑桥监修"],
    "ctaText": "咨询干细胞治疗",
    "sidebar": {
      "title": "治疗流程",
      "type": "steps",
      "items": [
        {"name": "预约咨询", "desc": "免费初次咨询", "step": "1"},
        {"name": "细胞采取", "desc": "耳后采集约20分钟", "step": "2"},
        {"name": "细胞培养", "desc": "约4周院内培养", "step": "3"},
        {"name": "细胞给药", "desc": "静脉/注射治疗", "step": "4"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "表参道HELENE诊所",
    "heroSubtitle": "日本首家合法干细胞治疗专门机构",
    "sections": [],
    "detailPage": "/helene-clinic"
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

-- 2. 插入 HELENE 初期咨询服务到 medical_packages 表
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
  'HELENE診所 - 前期諮詢服務',
  'ヘレネクリニック - 初期相談サービス',
  'HELENE Clinic - Initial Consultation',
  221000,
  'JPY',
  221000,
  'treatment',
  '{
    "zh": "病历翻译（中→日）、HELENE诊所初步咨询、干细胞治疗可行性评估、费用概算",
    "ja": "カルテ翻訳（中→日）、ヘレネクリニック初期相談、幹細胞治療の実現可能性評価、費用概算",
    "en": "Medical record translation, HELENE Clinic consultation, stem cell treatment feasibility assessment, cost estimation"
  }'::jsonb,
  ARRAY['干细胞', '再生医疗', 'HELENE', '咨询'],
  true,
  false,
  120
);

-- 3. 插入 HELENE 远程诊断服务到 medical_packages 表
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
  'HELENE診所 - 遠程診斷服務',
  'ヘレネクリニック - 遠隔診療サービス',
  'HELENE Clinic - Remote Consultation',
  243000,
  'JPY',
  243000,
  'treatment',
  '{
    "zh": "与HELENE诊所专科医生远程视频会诊、干细胞治疗方案评估、个性化治疗计划制定、费用概算",
    "ja": "ヘレネクリニック専門医とのオンライン診療、幹細胞治療プラン評価、個別治療計画の策定、費用概算",
    "en": "Remote video consultation with HELENE specialist, stem cell treatment plan evaluation, personalized treatment planning, cost estimation"
  }'::jsonb,
  ARRAY['干细胞', '再生医疗', 'HELENE', '远程诊断'],
  true,
  false,
  121
);
