-- =====================================================
-- 072: 添加先端細胞医療模块到选品中心
-- Insert Cell-Medicine (cancer vaccine + iPeace iPS cell banking) as a page module
-- Location: Hyogo Medical University
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
  '先端細胞医療（自己がんワクチン × iPS細胞）',
  '先端細胞医療（自己がんワクチン × iPS細胞バンキング）',
  'Advanced Cell Medicine (Cancer Vaccine × iPS Cell Banking)',
  'cell-medicine',
  '兵库医科大学拠点の先端细胞医疗。Cell-Medicine自体癌症疫苗疗法（理研·筑波大创投，累计4000+病例，肝癌复发风险降低81%）与iPeace iPS细胞储存服务（山中伸弥教授共同研究者创办，FDA cGMP认证，仅需5mL采血）。',
  '兵庫医科大学拠点の先端細胞医療。Cell-Medicine自己がんワクチン療法（理研・筑波大発ベンチャー、累計4,000例以上、肝がん再発リスク81%低減）とiPeace iPS細胞バンキングサービス（山中伸弥教授の共同研究者が創業、FDA cGMP認証、採血わずか5mL）。',
  15.00,
  ARRAY['Cell-Medicine', 'iPeace', 'iPS細胞', '自己がんワクチン', '兵庫医科大学', '再生医療', '免疫療法', '理研'],
  false,
  false,
  18,
  true,
  'cell_medicine',
  '{
    "template": "immersive",
    "sectionId": "cell-medicine",
    "navLabel": "先端細胞医療",
    "heroImage": "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "emerald",
    "tagline": "兵庫医科大学 · 先端細胞医療",
    "title": "先端細胞医療センター",
    "subtitle": "自己がんワクチン × iPS細胞バンキング",
    "description": "Cell-Medicine自体癌症疫苗疗法（累计4,000例以上）与iPeace iPS细胞储存服务。理研·筑波大创投技术，山中伸弥教授共同研究者创办。",
    "stats": [
      {"value": "4000", "unit": "+", "label": "累计病例"},
      {"value": "80", "unit": "+", "label": "合作医院"},
      {"value": "24", "unit": "年", "label": "研发历史"},
      {"value": "0", "unit": "件", "label": "重大副作用"}
    ],
    "tags": ["自体癌症疫苗", "iPS细胞", "理研创投", "FDA认证"],
    "ctaText": "咨询先端细胞医疗",
    "sidebar": {
      "title": "核心服务",
      "type": "steps",
      "items": [
        {"name": "自体癌症疫苗", "desc": "个性化免疫疗法", "step": "1"},
        {"name": "iPS细胞储存", "desc": "未来再生医疗", "step": "2"},
        {"name": "临床评估", "desc": "专科医生诊断", "step": "3"},
        {"name": "治疗方案", "desc": "个性化计划", "step": "4"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "先端細胞医療センター",
    "heroSubtitle": "自己がんワクチン × iPS細胞バンキング",
    "sections": [],
    "detailPage": "/cell-medicine"
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

-- 2. 插入先端細胞医療初期咨询服务
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'cell-medicine-initial-consultation',
  '先端細胞医療 - 初期相談サービス',
  '先端細胞醫療 - 前期諮詢服務',
  'Advanced Cell Medicine - Initial Consultation',
  221000,
  'other',
  150
)
ON CONFLICT (slug) DO NOTHING;

-- 3. 插入先端細胞医療远程诊断服务
INSERT INTO medical_packages (
  slug, name_ja, name_zh_tw, name_en, price_jpy, category, display_order
) VALUES (
  'cell-medicine-remote-consultation',
  '先端細胞医療 - 遠隔診療サービス',
  '先端細胞醫療 - 遠程診斷服務',
  'Advanced Cell Medicine - Remote Consultation',
  243000,
  'other',
  151
)
ON CONFLICT (slug) DO NOTHING;
