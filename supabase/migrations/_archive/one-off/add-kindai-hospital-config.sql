-- ================================================
-- 近畿大学病院 (Kindai University Hospital)
-- 配置脚本
-- ================================================
-- 执行此脚本前需要：
-- 1. 在 Stripe 创建对应的 Product 和 Price
-- 2. 获取 price_id 并替换下方的 NULL 值
-- ================================================

-- 1. 添加到 page_modules 表（白标导览系统）
INSERT INTO page_modules (
  category,
  name,
  name_ja,
  name_en,
  slug,
  description,
  description_ja,
  component_key,
  sort_order,
  is_active,
  has_detail_page,
  detail_route_type,
  commission_rate_a,
  commission_rate_b,
  display_config
) VALUES (
  'medical',
  '近畿大学病院',
  '近畿大学病院',
  'Kindai University Hospital',
  'kindai-hospital',
  '日本西部最大规模的特定功能医院，拥有929床位、35个诊疗科。配备达芬奇手术机器人、Halcyon放射治疗系统等尖端医疗设备。提供全方位高端医疗服务。',
  '西日本最大規模の特定機能病院。929床、35診療科を擁し、ダヴィンチ手術ロボット、Halcyon放射線治療システムなど最先端医療機器を完備。包括的な高度医療を提供。',
  'kindai_hospital',
  25,
  true,
  true,
  'standalone',
  15,
  20,
  jsonb_build_object(
    'template', 'immersive',
    'colorTheme', 'blue',
    'sectionId', 'kindai-hospital',
    'title', '近畿大学病院',
    'tagline', 'Kindai University Hospital',
    'subtitle', '西日本最大规模的特定功能医院',
    'description', '929床位、35诊疗科，配备达芬奇手术机器人、Halcyon放射治疗系统等尖端设备。提供心脏血管外科、消化器外科、肿瘤治疗等全方位高端医疗服务。国指定特定功能医院。',
    'heroImage', 'https://www.med.kindai.ac.jp/img/about/relocation/mv.webp',
    'navLabel', '近大病院',
    'ctaText', '咨询就诊服务',
    'tags', array['特定功能医院', '达芬奇手术', '放射治疗', '心脏血管', '肿瘤治疗', '大阪'],
    'stats', jsonb_build_array(
      jsonb_build_object('value', '929', 'label', '病床数', 'unit', '床'),
      jsonb_build_object('value', '35', 'label', '诊疗科', 'unit', '个'),
      jsonb_build_object('value', '国指定', 'label', '特定功能医院', 'unit', ''),
      jsonb_build_object('value', '6', 'label', '尖端医疗设备', 'unit', '台+')
    ),
    'sidebar', jsonb_build_object(
      'type', 'checklist',
      'title', '医院特色',
      'items', jsonb_build_array(
        jsonb_build_object('name', '达芬奇手术', 'desc', '微创机器人手术系统'),
        jsonb_build_object('name', 'Halcyon放疗', 'desc', '最新一代放射治疗'),
        jsonb_build_object('name', '全科室覆盖', 'desc', '35个专科诊疗科'),
        jsonb_build_object('name', '国家认证', 'desc', '特定功能医院资质')
      )
    )
  )
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_config = EXCLUDED.display_config,
  updated_at = NOW();

-- 2. 添加前期咨询服务到 medical_packages 表
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  name_en,
  description_zh_tw,
  price_jpy,
  category,
  is_active,
  stripe_price_id
) VALUES (
  'kindai-hospital-initial-consultation',
  '近畿大學醫院 - 前期諮詢服務',
  '近畿大学病院 - 初期相談サービス',
  'Kindai Hospital - Initial Consultation',
  '病歷資料翻譯、就診適應性評估、診療科室推薦、預約代行、醫療簽證邀請函、住宿交通安排',
  221000,
  'comprehensive_medical',
  true,
  NULL  -- 待创建 Stripe Product 后更新
) ON CONFLICT (slug) DO UPDATE SET
  price_jpy = EXCLUDED.price_jpy,
  name_zh_tw = EXCLUDED.name_zh_tw,
  description_zh_tw = EXCLUDED.description_zh_tw;

-- 3. 添加远程会诊服务到 medical_packages 表
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  name_ja,
  name_en,
  description_zh_tw,
  price_jpy,
  category,
  is_active,
  stripe_price_id
) VALUES (
  'kindai-hospital-remote-consultation',
  '近畿大學醫院 - 遠程會診服務',
  '近畿大学病院 - 遠隔診療サービス',
  'Kindai Hospital - Remote Consultation',
  '與專科醫師遠程視頻會診（30分鐘）、病情評估與診斷建議、治療方案討論、費用詳細說明',
  243000,
  'comprehensive_medical',
  true,
  NULL  -- 待创建 Stripe Product 后更新
) ON CONFLICT (slug) DO UPDATE SET
  price_jpy = EXCLUDED.price_jpy,
  name_zh_tw = EXCLUDED.name_zh_tw,
  description_zh_tw = EXCLUDED.description_zh_tw;

-- 4. 查看插入结果
SELECT
  slug,
  name,
  component_key,
  has_detail_page,
  is_active
FROM page_modules
WHERE slug = 'kindai-hospital';

SELECT
  slug,
  name_zh_tw,
  price_jpy,
  stripe_price_id,
  is_active
FROM medical_packages
WHERE slug LIKE 'kindai-hospital-%'
ORDER BY slug;

-- ================================================
-- 执行完成后的 TODO:
-- ================================================
-- [ ] 在 Stripe 创建 2 个 Product + Price
--     - 前期咨询: 221,000 JPY
--     - 远程会诊: 243,000 JPY
-- [ ] 更新上方 stripe_price_id 字段为实际值
-- [ ] 创建咨询路由页面:
--     - app/kindai-hospital/initial-consultation/page.tsx
--     - app/kindai-hospital/remote-consultation/page.tsx
-- [✓] 在 app/g/[slug]/[moduleSlug]/page.tsx 添加路由 (已完成)
-- [✓] 更新 DETAIL_PAGE_HERO_IMAGES 映射 (已完成)
-- [ ] 更新 lib/config/medical-packages.ts 添加配置
-- [✓] 主页面已添加咨询服务展示区域 (已完成)
-- ================================================
