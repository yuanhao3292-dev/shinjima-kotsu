-- ================================================
-- 大阪重粒子线中心 (Osaka Heavy Ion Therapy Center)
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
  '大阪重粒子线中心',
  '大阪重粒子線センター',
  'Osaka Heavy Ion Therapy Center',
  'osaka-himak',
  '日本最先进的重粒子线癌症治疗中心。采用世界领先的小型化重粒子治疗系统，无需手术，痛感少，疗程短。全室配备扫描照射治疗技术。',
  '日本最先端の重粒子線がん治療センター。世界をリードする小型化重粒子治療システムを採用。無切開、無痛、短期治療。全室スキャニング照射治療を完備。',
  'osaka_himak',
  75,
  true,
  true,
  'standalone',
  15,
  20,
  jsonb_build_object(
    'template', 'immersive',
    'colorTheme', 'blue',
    'sectionId', 'osaka-himak',
    'title', '大阪重粒子线中心',
    'tagline', 'Osaka Heavy Ion Therapy Center',
    'subtitle', '日本最先进的重粒子线癌症治疗',
    'description', '采用世界领先的小型化重粒子治疗系统，无需手术，痛感少，疗程短（1天-5周）。全室配备360°旋转机架扫描照射技术，精准定位肿瘤，保护正常组织。公益财团法人运营，专注癌症治疗40余年。',
    'heroImage', 'https://www.osaka-himak.or.jp/cn/images/top/sec_slide01_mv_img01_pc.jpg',
    'navLabel', '重粒子线',
    'ctaText', '咨询重粒子线治疗',
    'tags', array['重粒子线', '癌症治疗', '无痛无创', '短期疗程', '扫描照射', '大阪'],
    'stats', jsonb_build_array(
      jsonb_build_object('value', '世界最小', 'label', '重粒子系统', 'unit', ''),
      jsonb_build_object('value', '100', 'label', '扫描照射覆盖', 'unit', '%'),
      jsonb_build_object('value', '1-5', 'label', '治疗疗程', 'unit', '周'),
      jsonb_build_object('value', '8', 'label', '适应癌症', 'unit', '种+')
    ),
    'sidebar', jsonb_build_object(
      'type', 'checklist',
      'title', '治疗特点',
      'items', jsonb_build_array(
        jsonb_build_object('name', '无需手术', 'desc', '无切口、无痛感'),
        jsonb_build_object('name', '精准定位', 'desc', 'Bragg峰效应靶向肿瘤'),
        jsonb_build_object('name', '短期疗程', 'desc', '1天至5周完成'),
        jsonb_build_object('name', '360°旋转', 'desc', '扫描照射全覆盖')
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
  sort_order,
  stripe_price_id
) VALUES (
  'osaka-himak-initial-consultation',
  '大阪重粒子線中心 - 前期諮詢服務',
  '大阪重粒子線センター - 初期相談サービス',
  'Osaka HIMAK - Initial Consultation',
  '病歷資料翻譯、重粒子線治療適應性評估、治療計劃初步討論、費用概算',
  221000,
  'cancer_treatment',
  true,
  200,
  NULL  -- 需要替换为实际的 Stripe Price ID
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
  sort_order,
  stripe_price_id
) VALUES (
  'osaka-himak-remote-consultation',
  '大阪重粒子線中心 - 遠程會診服務',
  '大阪重粒子線センター - 遠隔診療サービス',
  'Osaka HIMAK - Remote Consultation',
  '與重粒子線治療專家遠程視頻會診、討論治療適應性與方案、費用詳細說明',
  243000,
  'cancer_treatment',
  true,
  201,
  NULL  -- 需要替换为实际的 Stripe Price ID
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
WHERE slug = 'osaka-himak';

SELECT
  slug,
  name_zh_tw,
  price_jpy,
  stripe_price_id,
  is_active
FROM medical_packages
WHERE slug LIKE 'osaka-himak-%'
ORDER BY sort_order;

-- ================================================
-- 执行完成后的 TODO:
-- ================================================
-- [ ] 在 Stripe 创建 2 个 Product + Price
-- [ ] 更新上方 stripe_price_id 字段为实际值
-- [ ] 创建咨询路由页面:
--     - app/osaka-himak/initial-consultation/page.tsx
--     - app/osaka-himak/remote-consultation/page.tsx
-- [ ] 在 app/g/[slug]/[moduleSlug]/page.tsx 添加路由:
--     case 'osaka_himak':
--       return <OsakaHimakContent isGuideEmbed={true} guideSlug={slug} />
-- [ ] 更新 DETAIL_PAGE_HERO_IMAGES 映射
-- [ ] 更新 lib/config/medical-packages.ts 添加配置
-- ================================================
