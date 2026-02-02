-- ============================================
-- Seed: 白标模块化 - 插入 6 个服务模块
-- 运行前提: 已执行 061-whitelabel-module-components.sql
-- ============================================

-- 1. AI 智能健康筛查
INSERT INTO page_modules (category, name, name_ja, slug, description, component_key, commission_rate, is_required, sort_order, is_active, created_at, updated_at)
VALUES (
  'medical',
  'AI 智能健康筛查',
  'AI健康スクリーニング',
  'health-screening',
  '运用 AI 技术进行智能健康风险评估，覆盖全身系统精密筛查',
  'health_screening',
  10,
  false,
  10,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 2. 日本癌症治疗
INSERT INTO page_modules (category, name, name_ja, slug, description, component_key, commission_rate, is_required, sort_order, is_active, created_at, updated_at)
VALUES (
  'medical',
  '日本癌症治疗',
  '日本がん治療',
  'cancer-treatment',
  '质子重离子、光免疫疗法、BNCT 硼中子俘获等世界前沿癌症疗法',
  'cancer_treatment',
  10,
  false,
  20,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 3. 高端车队
INSERT INTO page_modules (category, name, name_ja, slug, description, component_key, commission_rate, is_required, sort_order, is_active, created_at, updated_at)
VALUES (
  'vehicle',
  '高端车队',
  'プレミアム車両',
  'vehicles',
  '全绿牌营业车辆，专业持证司机，从商务轿车到大型巴士，满足各种出行需求',
  'vehicles',
  10,
  false,
  30,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 4. 名门高尔夫旅游
INSERT INTO page_modules (category, name, name_ja, slug, description, component_key, commission_rate, is_required, sort_order, is_active, created_at, updated_at)
VALUES (
  'medical',
  '名门高尔夫旅游',
  '名門ゴルフツアー',
  'golf',
  '日本关西名门球场 VIP 预约通道，专车接送、中文服务、专属定制',
  'golf',
  10,
  false,
  40,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 5. 医疗旅游
INSERT INTO page_modules (category, name, name_ja, slug, description, component_key, commission_rate, is_required, sort_order, is_active, created_at, updated_at)
VALUES (
  'medical',
  '医疗旅游',
  '医療ツーリズム',
  'medical-tourism',
  '日本最先进的医疗技术，精密体检服务，PET-CT、MRI、胃肠内视镜等',
  'medical_tourism',
  10,
  false,
  50,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- 6. TIMC 健检套餐
INSERT INTO page_modules (category, name, name_ja, slug, description, component_key, commission_rate, is_required, sort_order, is_active, created_at, updated_at)
VALUES (
  'medical',
  'TIMC 健检套餐',
  'TIMC健診パッケージ',
  'medical-packages',
  '德洲会国际医疗中心 6 大健检套餐，从基础到 VIP 全覆盖',
  'medical_packages',
  10,
  false,
  60,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;
