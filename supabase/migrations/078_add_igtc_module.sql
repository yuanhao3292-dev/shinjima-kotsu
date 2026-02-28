-- =====================================================
-- 078: 添加 IGTクリニック (IGTC) 模块到选品中心
-- Insert IGT Clinic as a page module
-- Location: Osaka Izumisano (near Kansai Airport)
-- Specialty: Endovascular Intervention + Hyperthermia
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
  commission_rate_a,
  commission_rate_b,
  tags,
  is_premium,
  is_required,
  sort_order,
  is_active,
  component_key,
  display_config,
  page_content
) VALUES (
  'hospital',
  'IGTクリニック（血管内治療・温熱療法）',
  'IGTクリニック（血管内治療・温熱療法）',
  'IGT Clinic (Endovascular Intervention & Hyperthermia)',
  'igtc',
  'IGTクリニック（大阪泉佐野市）——癌症血管内介入治疗与温热疗法专门医院。20年以上实绩，适用于肝癌、乳腺癌、肺癌、胰腺癌等10余种癌症。微创、副作用少、可反复治疗、保险适用。关西机场旁。',
  'IGTクリニック（大阪府泉佐野市）——がん血管内治療（IGT）とハイパーサーミア（温熱療法）の専門病院。20年以上の実績。肝がん・乳がん・肺がん・膵臓がんなど10種以上に対応。低侵襲・副作用が少なく・保険適用可能。関西空港すぐ。',
  10.00,
  20.00,
  ARRAY['IGTクリニック', 'IGT Clinic', '血管内治療', '温熱療法', 'ハイパーサーミア', 'がん治療', '関西空港', '泉佐野'],
  false,
  false,
  20,
  true,
  'igtc',
  '{
    "template": "immersive",
    "sectionId": "igtc",
    "navLabel": "IGTクリニック",
    "heroImage": "https://igtc.jp/wp-content/themes/igtclinic/images/top/mainVisual_img01.jpg",
    "colorTheme": "blue",
    "tagline": "大阪泉佐野 · がん専門治療",
    "title": "IGTクリニック",
    "subtitle": "血管内治療・温熱療法",
    "description": "20年以上の実績を持つがん血管内介入治療（IGT）とハイパーサーミア（温熱療法）の専門医院。微創・副作用少・保険適用可能。",
    "stats": [
      {"value": "20", "unit": "年+", "label": "治療実績"},
      {"value": "10", "unit": "種+", "label": "対応がん種"},
      {"value": "80", "unit": "%", "label": "改善率"},
      {"value": "CIRSE", "unit": "", "label": "国際学会受賞"}
    ],
    "tags": ["保険適用", "血管内治療", "温熱療法", "関空すぐ"],
    "ctaText": "咨询癌症治疗",
    "sidebar": {
      "title": "治療メニュー",
      "type": "steps",
      "items": [
        {"name": "IGT血管内治療", "desc": "動脈化学塞栓術", "step": "1"},
        {"name": "温熱療法", "desc": "ハイパーサーミア", "step": "2"},
        {"name": "併用療法", "desc": "IGT+温熱の相乗効果", "step": "3"},
        {"name": "遠隔相談", "desc": "オンライン診療", "step": "4"}
      ]
    }
  }'::jsonb,
  '{
    "heroTitle": "IGTクリニック",
    "heroSubtitle": "血管内治療・温熱療法",
    "sections": [],
    "detailPage": "/igtc"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  commission_rate_a = EXCLUDED.commission_rate_a,
  commission_rate_b = EXCLUDED.commission_rate_b,
  tags = EXCLUDED.tags,
  is_active = EXCLUDED.is_active,
  component_key = EXCLUDED.component_key,
  display_config = EXCLUDED.display_config,
  page_content = EXCLUDED.page_content,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- 2. 插入 IGTC 前期咨询服务（¥221,000）— 复用 cancer 的 Stripe 价格
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  name_en,
  description_zh_tw,
  price_jpy,
  stripe_price_id,
  category,
  is_active,
  display_order
) VALUES (
  'igtc-initial-consultation',
  'IGTクリニック - 前期諮詢服務',
  'IGTクリニック - 初期相談サービス',
  'IGT Clinic - Initial Consultation',
  '資料翻譯、IGTクリニック諮詢、治療方案初步評估',
  221000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-initial-consultation'),
  'cancer_treatment',
  true,
  160
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw,
  name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en,
  description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy,
  stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 3. 插入 IGTC 远程会诊服务（¥243,000）— 复用 cancer 的 Stripe 价格
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  name_en,
  description_zh_tw,
  price_jpy,
  stripe_price_id,
  category,
  is_active,
  display_order
) VALUES (
  'igtc-remote-consultation',
  'IGTクリニック - 遠程會診服務',
  'IGTクリニック - 遠隔診療サービス',
  'IGT Clinic - Remote Consultation',
  '與IGTクリニック專科醫生遠程視頻會診、討論治療方案、費用概算',
  243000,
  (SELECT stripe_price_id FROM medical_packages WHERE slug = 'cancer-remote-consultation'),
  'cancer_treatment',
  true,
  161
)
ON CONFLICT (slug) DO UPDATE SET
  name_zh_tw = EXCLUDED.name_zh_tw,
  name_ja = EXCLUDED.name_ja,
  name_en = EXCLUDED.name_en,
  description_zh_tw = EXCLUDED.description_zh_tw,
  price_jpy = EXCLUDED.price_jpy,
  stripe_price_id = EXCLUDED.stripe_price_id,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 4. 回填 module_id 外键（关联 medical_packages → page_modules）
UPDATE medical_packages mp
SET module_id = pm.id
FROM page_modules pm
WHERE pm.slug = 'igtc'
  AND mp.slug LIKE 'igtc-%'
  AND mp.module_id IS NULL;
