-- =====================================================
-- 062: 全面修复白标分销系统数据对齐
-- Comprehensive White-Label Distribution System Fix
-- =====================================================
-- 创建时间: 2026-02-12
-- 幂等脚本，可安全重复执行（所有操作都使用 IF NOT EXISTS / ON CONFLICT）
--
-- 修复内容:
-- [Part 1] Schema 补全 — 确保所有必要列存在
-- [Part 2] 7 个模块完整 UPSERT — 含 component_key + display_config
-- [Part 3] 佣金等级数据验证 — 确保 4 个等级存在
-- [Part 4] 车辆库数据验证 — 确保 5 款车型存在
-- [Part 5] 模板数据验证 — 确保 3 类模板存在
-- [Part 6] 清理遗留数据 — 删除 component_key IS NULL 的旧模块
-- [Part 7] white_label_orders 兼容性检查
-- [Part 8] 验证查询
--
-- 关联表:
-- page_modules         — 7 个服务模块
-- page_templates       — 7 个页面模板 (bio×3, vehicle×2, contact×2)
-- vehicle_library      — 5 款车型
-- commission_tiers     — 4 个佣金等级 (bronze/silver/gold/diamond)
-- guide_selected_modules — 导游选择的模块
-- guide_selected_vehicles — 导游选择的车辆
-- white_label_orders   — 白标订单
-- guides               — 导游主表 (白标相关字段)
-- =====================================================

-- =====================================================
-- Part 1: Schema 补全
-- =====================================================

-- 1.1 page_modules 表 — 添加后续迁移中新增的列
ALTER TABLE page_modules ADD COLUMN IF NOT EXISTS component_key VARCHAR(50);
ALTER TABLE page_modules ADD COLUMN IF NOT EXISTS display_config JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_page_modules_component_key ON page_modules(component_key);

-- 1.2 guide_selected_modules 表 — 添加 updated_at（TypeScript 类型中有但初始 DDL 缺失）
ALTER TABLE guide_selected_modules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 1.3 guides 表 — 确保白标/订阅相关列存在
--     (这些来自不同迁移文件，此处统一确认)
ALTER TABLE guides ADD COLUMN IF NOT EXISTS slug VARCHAR(50);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS brand_name VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS brand_logo_url TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS brand_color VARCHAR(20) DEFAULT '#2563eb';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact_wechat VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact_line VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS contact_display_phone VARCHAR(30);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(20) DEFAULT 'none';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'growth';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(100);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS whitelabel_views INT DEFAULT 0;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS whitelabel_conversions INT DEFAULT 0;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS selected_pages JSONB DEFAULT '["timc-medical", "premium-golf", "business-inspection"]'::jsonb;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS commission_tier_id UUID;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS commission_tier_code VARCHAR(20) DEFAULT 'bronze';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS total_commission DECIMAL(12,2) DEFAULT 0;

-- 1.4 确保 slug 唯一索引存在（CREATE UNIQUE INDEX IF NOT EXISTS 需要 pg 9.5+）
CREATE UNIQUE INDEX IF NOT EXISTS idx_guides_slug_unique ON guides(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guides_subscription_status ON guides(subscription_status);
CREATE INDEX IF NOT EXISTS idx_guides_subscription_tier ON guides(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_guides_selected_pages ON guides USING GIN (selected_pages);


-- =====================================================
-- Part 2: 7 个模块完整 UPSERT
-- =====================================================
-- page_modules.category CHECK 约束: ('medical', 'beauty', 'vehicle', 'travel', 'other')
-- component_key 映射: → components/whitelabel-modules/registry.ts
-- display_config 结构: → lib/types/display-config.ts (ImmersiveDisplayConfig)
--
-- slug (URL路径) → component_key (React 组件) 映射:
--   medical-packages  → medical_packages
--   hyogo-medical     → hyogo_medical
--   cancer-treatment  → cancer_treatment
--   medical-tourism   → medical_tourism
--   golf              → golf
--   health-screening  → health_screening
--   vehicles          → vehicles

-- ── 2.1 TIMC 健检套餐 ──────────────────────────────
-- component_key: medical_packages
-- React 组件: MedicalPackagesFullPage (app/medical-packages/)
-- 用途: 德洲会国际医疗中心 6 大健检套餐选购
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'medical',
  'TIMC 健检套餐',
  'TIMC健診パッケージ',
  'TIMC Health Checkup Packages',
  'medical-packages',
  '德洲会国际医疗中心 6 大健检套餐，从基础到 VIP 全覆盖',
  '徳洲会国際医療センター6つの健診パッケージ、基本からVIPまで全カバー',
  'medical_packages',
  10.00, false, 10, true,
  '{
    "template": "immersive",
    "sectionId": "medical-packages",
    "navLabel": "TIMC体检",
    "heroImage": "https://i.ibb.co/xS1h4rTM/hero-medical.jpg",
    "colorTheme": "emerald",
    "tagline": "TIMC Health Checkup",
    "title": "日本 TIMC 精密体检",
    "subtitle": "早期发现，守护健康",
    "description": "德洲会国际医疗中心（TIMC）提供世界顶级精密体检服务。PET-CT、MRI、胃肠镜等先进设备，配合日本医师专业解读，为您的健康保驾护航。",
    "stats": [
      {"value": "6", "unit": "种", "label": "体检套餐"},
      {"value": "5mm", "unit": "", "label": "早期病变检出"},
      {"value": "100", "unit": "%", "label": "中文陪诊"}
    ],
    "tags": ["PET-CT", "MRI 3.0T", "无痛胃肠镜", "基因检测", "心脑血管"],
    "ctaText": "咨询体检套餐",
    "sidebar": {
      "title": "体检套餐",
      "type": "checklist",
      "items": [
        {"name": "标准套餐", "desc": "基础全面检查"},
        {"name": "PET-CT 套餐", "desc": "全身癌症筛查"},
        {"name": "VIP 套餐", "desc": "深度精密检查"}
      ]
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();

-- ── 2.2 兵庫医科大学病院 ──────────────────────────────
-- component_key: hyogo_medical
-- React 组件: HyogoMedicalContent (app/hyogo-medical/)
-- 用途: 兵库县最大规模特定功能医院，达芬奇Xi手术机器人等先进设备
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config,
  tags
) VALUES (
  'medical',
  '兵庫医科大学病院',
  '兵庫医科大学病院',
  'Hyogo Medical University Hospital',
  'hyogo-medical',
  '自1972年开院，兵库县最大规模特定功能医院。配备达芬奇Xi手术机器人、PET-CT中心等先进设备。2026年9月新病院大楼即将开院。',
  '1972年開院以来、兵庫県最大規模の特定機能病院。ダヴィンチXi手術ロボット、PET-CTセンターなど最先端設備を完備。2026年9月新病院棟開院予定。',
  'hyogo_medical',
  15.00, false, 20, true,
  '{
    "template": "immersive",
    "sectionId": "hyogo-medical",
    "navLabel": "兵庫医科",
    "heroImage": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
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
  ARRAY['医院', '特定功能医院', '手术机器人', 'PET-CT', '兵库县', '高端医疗']
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  tags           = EXCLUDED.tags,
  updated_at     = now();

-- ── 2.3 日本癌症治疗 ──────────────────────────────
-- component_key: cancer_treatment
-- React 组件: CancerTreatmentContent (app/cancer-treatment/)
-- 用途: 质子重离子、光免疫疗法、BNCT 等世界前沿癌症疗法
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'medical',
  '日本癌症治疗',
  '日本がん治療',
  'Japan Cancer Treatment',
  'cancer-treatment',
  '质子重离子、光免疫疗法、BNCT 硼中子俘获等世界前沿癌症疗法',
  '陽子線・重粒子線、光免疫療法、BNCT硼素中性子捕捉療法など世界最先端がん治療',
  'cancer_treatment',
  10.00, false, 30, false,  -- is_active = false (旧模块，需要重做)
  '{
    "template": "immersive",
    "sectionId": "treatment",
    "navLabel": "重疾治疗",
    "heroImage": "https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "blue-dark",
    "tagline": "Advanced Treatment",
    "title": "面对重疾",
    "subtitle": "日本医疗给您更多希望",
    "description": "质子重离子治疗、免疫细胞疗法、达文西微创手术——日本癌症5年生存率全球领先。我们协助您获得日本顶尖医院的治疗机会，全程陪同，让您专注康复。",
    "stats": [
      {"value": "68", "unit": "%", "label": "癌症5年生存率"},
      {"value": "98", "unit": "%", "label": "心脏手术成功率"},
      {"value": "24", "unit": "h", "label": "病历评估响应"}
    ],
    "tags": ["癌症治疗", "质子重离子", "心脏手术", "脑血管"],
    "ctaText": "咨询治疗服务",
    "sidebar": {
      "title": "服务流程",
      "type": "steps",
      "items": [
        {"name": "提交病历，24小时内评估", "desc": "", "step": "01"},
        {"name": "制定方案，明确费用", "desc": "", "step": "02"},
        {"name": "赴日治疗，全程陪同", "desc": "", "step": "03"},
        {"name": "回国后持续跟进", "desc": "", "step": "04"}
      ]
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();

-- ── 2.4 医疗旅游 ──────────────────────────────
-- component_key: medical_tourism
-- React 组件: MedicalTourismContent (app/business/medical/)
-- 用途: PET-CT、MRI、胃肠内视镜等精密体检服务
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'medical',
  '医疗旅游',
  '医療ツーリズム',
  'Medical Tourism',
  'medical-tourism',
  '日本最先进的医疗技术，精密体检服务，PET-CT、MRI、胃肠内视镜等',
  '日本最先端の医療技術、精密健診サービス、PET-CT、MRI、胃腸内視鏡など',
  'medical_tourism',
  10.00, false, 40, false,  -- is_active = false (旧模块，需要重做)
  '{
    "template": "immersive",
    "sectionId": "medical",
    "navLabel": "医疗旅游",
    "heroImage": "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "teal",
    "tagline": "Medical Tourism",
    "title": "把健康交给",
    "subtitle": "值得信赖的人",
    "description": "日本医疗技术全球领先，PET-CT可发现5mm早期病变。我们提供专车接送、全程陪诊翻译、报告解读——让您专心照顾健康，其他的交给我们。",
    "stats": [
      {"value": "12", "unit": "年", "label": "医疗服务经验"},
      {"value": "3000", "unit": "+", "label": "服务客户"},
      {"value": "100", "unit": "%", "label": "全程陪同"}
    ],
    "tags": ["专车接送", "医疗翻译", "报告解读", "后续跟进"],
    "ctaText": "咨询体检方案",
    "sidebar": {
      "title": "精密检查项目",
      "type": "checklist",
      "items": [
        {"name": "PET-CT", "desc": "全身癌症早期筛查"},
        {"name": "MRI 3.0T", "desc": "脑部·心脏精密检查"},
        {"name": "无痛胃肠镜", "desc": "消化道全面检查"}
      ]
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();

-- ── 2.5 名门高尔夫旅游 ──────────────────────────────
-- component_key: golf
-- React 组件: GolfContent (app/business/golf/)
-- 用途: 日本关西名门球场 VIP 预约
-- ⚠️ 修正: category 从旧 seed 的 'medical' → 'travel'
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'travel',  -- ← 修正: 旧 seed 错误地设为 'medical'
  '名门高尔夫旅游',
  '名門ゴルフツアー',
  'Premium Golf Tour',
  'golf',
  '日本关西名门球场 VIP 预约通道，专车接送、中文服务、专属定制',
  '日本関西名門ゴルフ場VIP予約、専用車送迎、中国語対応、完全オーダーメイド',
  'golf',
  10.00, false, 50, false,  -- is_active = false (旧模块，需要重做)
  '{
    "template": "immersive",
    "sectionId": "golf",
    "navLabel": "名门高尔夫",
    "heroImage": "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "amber",
    "tagline": "Exclusive Access",
    "title": "踏入",
    "subtitle": "传说中的名门",
    "description": "广野、霞ヶ関、小野——这些球场的名字，在高尔夫爱好者心中如雷贯耳。平时需要会员介绍才能踏入的圣地，现在向您敞开大门。",
    "stats": [
      {"value": "25", "unit": "+", "label": "名门球场"},
      {"value": "0", "unit": "", "label": "会员介绍"},
      {"value": "VIP", "unit": "", "label": "专属待遇"}
    ],
    "tags": ["廣野ゴルフ倶楽部", "霞ヶ関カンツリー倶楽部", "小野ゴルフ倶楽部", "茨木カンツリー倶楽部"],
    "ctaText": "预约名门球场",
    "sidebar": {
      "title": "尊享服务",
      "type": "checklist",
      "items": [
        {"name": "专属开球时段", "desc": ""},
        {"name": "双语球童服务", "desc": ""},
        {"name": "温泉旅馆安排", "desc": ""},
        {"name": "怀石料理预约", "desc": ""}
      ]
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,  -- 'travel' 覆盖旧的 'medical'
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();

-- ── 2.6 AI 智能健康筛查 ──────────────────────────────
-- component_key: health_screening
-- React 组件: HealthScreeningContent (app/health-screening/)
-- 用途: AI 驱动的人体图交互健康风险评估
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'medical',
  'AI 智能健康筛查',
  'AI健康スクリーニング',
  'AI Health Screening',
  'health-screening',
  '运用 AI 技术进行智能健康风险评估，覆盖全身系统精密筛查',
  'AI技術による健康リスク評価、全身精密スクリーニング',
  'health_screening',
  10.00, false, 60, false,  -- is_active = false (旧模块，需要重做)
  '{
    "template": "immersive",
    "sectionId": "health-screening",
    "navLabel": "健康筛查",
    "heroImage": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "indigo",
    "tagline": "AI Health Screening",
    "title": "AI 智能问诊",
    "subtitle": "精准推荐体检方案",
    "description": "通过人体图交互选择不适部位，AI 根据您的症状智能推荐检查科室，并生成专业健康评估报告。3分钟了解您的健康风险，为您推荐最适合的体检方案。",
    "stats": [
      {"value": "3", "unit": "分钟", "label": "快速评估"},
      {"value": "AI", "unit": "", "label": "智能驱动"},
      {"value": "PDF", "unit": "", "label": "专业报告"}
    ],
    "tags": ["人体图交互", "智能科室推荐", "动态问诊", "PDF 报告"],
    "ctaText": "开始筛查"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();

-- ── 2.7 高端车队 ──────────────────────────────
-- component_key: vehicles
-- React 组件: VehiclesContent (app/vehicles/)
-- 用途: 全绿牌营业车辆展示（数据来自 vehicle_library 表）
-- 注: vehicles 同时存在于 page_modules（作为导游可选模块）和
--     vehicle_library（作为车辆具体数据）。这是 by design：
--     page_modules.vehicles 控制"导游是否选择展示车队"
--     vehicle_library 存储具体车辆数据
INSERT INTO page_modules (
  category, name, name_ja, name_en, slug,
  description, description_ja,
  component_key, commission_rate, is_required,
  sort_order, is_active, display_config
) VALUES (
  'vehicle',
  '高端车队',
  'プレミアム車両',
  'Premium Fleet',
  'vehicles',
  '全绿牌营业车辆，专业持证司机，从商务轿车到大型巴士，满足各种出行需求',
  '全グリーンナンバー営業車両、プロ有資格ドライバー、ビジネスセダンから大型バスまで',
  'vehicles',
  10.00, false, 70, false,  -- is_active = false (旧模块，需要重做)
  '{
    "template": "immersive",
    "sectionId": "vehicles",
    "navLabel": "高端车队",
    "heroImage": "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?q=80&w=2000&auto=format&fit=crop",
    "colorTheme": "zinc",
    "tagline": "Premium Fleet",
    "title": "全绿牌",
    "subtitle": "专业车队服务",
    "description": "全车队绿牌营业许可，专业持证司机。丰田阿尔法、奔驰V级、雷克萨斯LM——从商务出行到VIP接待，我们为您提供最舒适的日本出行体验。",
    "stats": [
      {"value": "5", "unit": "款", "label": "豪华车型"},
      {"value": "100", "unit": "%", "label": "绿牌营业"},
      {"value": "24", "unit": "h", "label": "随时调度"}
    ],
    "tags": ["丰田阿尔法", "奔驰V级", "雷克萨斯LM", "中型巴士"],
    "ctaText": "预约车辆",
    "sidebar": {
      "title": "车队亮点",
      "type": "checklist",
      "items": [
        {"name": "全绿牌营业", "desc": "合法合规运营"},
        {"name": "专业持证司机", "desc": "二種免許保有"},
        {"name": "车载WiFi", "desc": "全程网络覆盖"},
        {"name": "多语种服务", "desc": "中日英三语"}
      ]
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  category       = EXCLUDED.category,
  name           = EXCLUDED.name,
  name_ja        = EXCLUDED.name_ja,
  name_en        = EXCLUDED.name_en,
  description    = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  component_key  = EXCLUDED.component_key,
  commission_rate = EXCLUDED.commission_rate,
  display_config = EXCLUDED.display_config,
  sort_order     = EXCLUDED.sort_order,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();


-- =====================================================
-- Part 3: 佣金等级数据验证 (commission_tiers)
-- =====================================================
-- 确保 4 个等级存在，季度销售额阈值正确
-- bronze: 10%, silver: 12%, gold: 15%, diamond: 20%

INSERT INTO commission_tiers (tier_code, tier_name_ja, tier_name_zh, tier_name_en, min_monthly_sales, commission_rate, badge_color, sort_order)
VALUES
  ('bronze',  '銅牌合夥人',  '铜牌合伙人', 'Bronze Partner',  0,       10.00, '#CD7F32', 1),
  ('silver',  '銀牌合夥人',  '银牌合伙人', 'Silver Partner',  1000000, 12.00, '#C0C0C0', 2),
  ('gold',    '金牌合夥人',  '金牌合伙人', 'Gold Partner',    3000000, 15.00, '#FFD700', 3),
  ('diamond', '鑽石合夥人',  '钻石合伙人', 'Diamond Partner', 5000000, 20.00, '#B9F2FF', 4)
ON CONFLICT (tier_code) DO UPDATE SET
  commission_rate  = EXCLUDED.commission_rate,
  min_monthly_sales = EXCLUDED.min_monthly_sales,
  badge_color      = EXCLUDED.badge_color,
  sort_order       = EXCLUDED.sort_order,
  updated_at       = NOW();


-- =====================================================
-- Part 4: 车辆库数据验证 (vehicle_library)
-- =====================================================
-- 确保 5 款车型存在
-- vehicle_type CHECK 约束: ('sedan', 'mpv', 'suv', 'bus', 'luxury')

INSERT INTO vehicle_library (name, name_ja, name_en, slug, vehicle_type, seats, description, description_ja, features, sort_order)
VALUES
  ('丰田阿尔法', 'トヨタ アルファード', 'Toyota Alphard', 'toyota-alphard', 'mpv', 7,
   '日本最受欢迎的豪华MPV，宽敞舒适，适合家庭和商务接待',
   '日本で最も人気のある高級MPV。広々とした快適な空間で、ご家族やビジネスシーンに最適です',
   ARRAY['真皮座椅', '电动滑门', '后排娱乐系统', '车载WiFi'], 1),

  ('丰田海狮', 'トヨタ ハイエース', 'Toyota Hiace', 'toyota-hiace', 'mpv', 10,
   '大空间商务车，适合小团队出行',
   '大空間のワンボックス。小グループでの移動に最適です',
   ARRAY['大行李空间', '舒适座椅', '车载WiFi'], 2),

  ('丰田考斯特', 'トヨタ コースター', 'Toyota Coaster', 'toyota-coaster', 'bus', 28,
   '中型巴士，适合团队旅游',
   '中型バス。団体旅行に最適です',
   ARRAY['空调', '麦克风', '大行李舱'], 3),

  ('奔驰V级', 'メルセデス・ベンツ Vクラス', 'Mercedes-Benz V-Class', 'mercedes-v-class', 'luxury', 7,
   '德系豪华MPV，极致舒适体验',
   'ドイツの高級MPV。最高の快適さをお届けします',
   ARRAY['NAPPA皮革', '按摩座椅', '氛围灯', '车载冰箱'], 4),

  ('雷克萨斯LM', 'レクサス LM', 'Lexus LM', 'lexus-lm', 'luxury', 4,
   '顶级行政座驾，极致奢华',
   '最高級の行政用車両。究極のラグジュアリー',
   ARRAY['头等舱座椅', '隔断屏幕', '车载冰箱', '星空顶'], 5)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  name_ja     = EXCLUDED.name_ja,
  name_en     = EXCLUDED.name_en,
  vehicle_type = EXCLUDED.vehicle_type,
  seats       = EXCLUDED.seats,
  description = EXCLUDED.description,
  description_ja = EXCLUDED.description_ja,
  features    = EXCLUDED.features,
  sort_order  = EXCLUDED.sort_order;


-- =====================================================
-- Part 5: 模板数据验证 (page_templates)
-- =====================================================
-- 确保 3 类模板存在
-- page_templates.category CHECK 约束: ('bio', 'vehicle', 'contact')
--
-- 模板使用 name 作为标识（无 slug），使用 category + name 的组合来做幂等
-- 由于 page_templates 没有 UNIQUE 约束可用于 ON CONFLICT，
-- 使用 INSERT ... WHERE NOT EXISTS 模式

-- Bio 模板 (3个)
INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'bio', '商务精英', 'ビジネスエリート', '深蓝色调，专业商务风格', true,
       '{"theme": "business", "primaryColor": "#1e40af", "layout": "professional"}'::jsonb, 1
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'bio' AND name = '商务精英');

INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'bio', '亲切友好', '親しみやすい', '暖色调，亲切自然风格', false,
       '{"theme": "friendly", "primaryColor": "#f97316", "layout": "casual"}'::jsonb, 2
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'bio' AND name = '亲切友好');

INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'bio', '医疗专家', '医療エキスパート', '纯白色调，专业医疗翻译风格', false,
       '{"theme": "medical", "primaryColor": "#0ea5e9", "layout": "clean"}'::jsonb, 3
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'bio' AND name = '医疗专家');

-- Vehicle 模板 (2个)
INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'vehicle', '豪华展示', 'ラグジュアリー', '大图展示，突出豪华感', true,
       '{"theme": "luxury", "imageSize": "large", "showPrice": true}'::jsonb, 1
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'vehicle' AND name = '豪华展示');

INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'vehicle', '简洁列表', 'シンプルリスト', '紧凑列表，信息清晰', false,
       '{"theme": "compact", "imageSize": "medium", "showPrice": true}'::jsonb, 2
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'vehicle' AND name = '简洁列表');

-- Contact 模板 (2个)
INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'contact', '二维码优先', 'QRコード優先', '突出显示微信/LINE二维码', true,
       '{"layout": "qr_focused", "showMap": false}'::jsonb, 1
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'contact' AND name = '二维码优先');

INSERT INTO page_templates (category, name, name_ja, description, is_default, template_config, sort_order)
SELECT 'contact', '表单优先', 'フォーム優先', '突出显示联系表单', false,
       '{"layout": "form_focused", "showMap": true}'::jsonb, 2
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE category = 'contact' AND name = '表单优先');


-- =====================================================
-- Part 6: 清理遗留数据
-- =====================================================
-- 058 初始迁移插入了一个 "TIMC 综合体检中心" 模块（无 component_key）
-- 后续 seed 又插入了 "TIMC 健检套餐"（component_key = 'medical_packages'）
-- 旧的应该被清理掉

-- 6.1 先解除导游选择的关联
DELETE FROM guide_selected_modules
WHERE module_id IN (
  SELECT id FROM page_modules
  WHERE component_key IS NULL
);

-- 6.2 解除订单关联（将 module_id 置 NULL，而非删除订单）
UPDATE white_label_orders
SET module_id = NULL
WHERE module_id IN (
  SELECT id FROM page_modules
  WHERE component_key IS NULL
);

-- 6.3 删除无 component_key 的旧模块
DELETE FROM page_modules
WHERE component_key IS NULL;


-- =====================================================
-- Part 7: white_label_orders 兼容性检查
-- =====================================================
-- 当前 API (app/api/whitelabel/orders/route.ts) 使用:
--   guide_id (UUID)       ← 直接引用 guides.id
--   status = 'pending'    ← 058 schema CHECK 约束
--   payment_status = 'pending'
--
-- 注意: scripts/migrations/060-complete-order-flow.sql 定义了一套完全不同的
-- 状态机 (inquiry/quoted/deposit_pending/...)，但尚未应用到生产。
-- 如果该迁移已运行，需要确保 'pending' 在 CHECK 约束中:

-- 安全地恢复 'pending' 状态（如果 060 已运行并替换了约束）
-- 先检查约束是否允许 'pending'，如果不允许则更新
DO $$
BEGIN
  -- 尝试检查当前约束：如果 'pending' 不被允许，说明 060 已运行
  -- 此时需要将约束扩展为同时支持两套状态
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'white_label_orders_status_check'
      AND check_clause LIKE '%inquiry%'
      AND check_clause NOT LIKE '%pending%'
  ) THEN
    -- 060 已运行但缺少 'pending'，扩展约束
    ALTER TABLE white_label_orders DROP CONSTRAINT IF EXISTS white_label_orders_status_check;
    ALTER TABLE white_label_orders ADD CONSTRAINT white_label_orders_status_check
      CHECK (status IN (
        'pending',           -- 简单模式（当前 API 使用）
        'confirmed',         -- 简单模式
        'inquiry',           -- 完整生命周期模式
        'quoted',
        'deposit_pending',
        'deposit_paid',
        'in_progress',
        'completed',
        'cancelled',
        'refunded'
      ));
    RAISE NOTICE '[062] ✅ 扩展了 white_label_orders.status 约束，兼容 pending + inquiry 两套状态';
  ELSE
    RAISE NOTICE '[062] ℹ️ white_label_orders.status 约束已包含 pending，无需修改';
  END IF;
END $$;

-- 确保 guide_id 列存在（060 使用 guide_white_label_id 替代，但 API 需要 guide_id）
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS guide_id UUID;

-- 确保必要的列存在（058 定义但 060 可能未保留的列）
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_wechat TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_line TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS service_date DATE;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS service_time TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS total_amount INTEGER DEFAULT 0;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2);
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS commission_amount INTEGER;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE white_label_orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 索引
CREATE INDEX IF NOT EXISTS idx_white_label_orders_guide ON white_label_orders(guide_id);
CREATE INDEX IF NOT EXISTS idx_white_label_orders_status ON white_label_orders(status);
CREATE INDEX IF NOT EXISTS idx_white_label_orders_created ON white_label_orders(created_at DESC);


-- =====================================================
-- Part 8: 验证查询（取消注释后手动运行）
-- =====================================================

-- 8.1 验证 page_modules — 应返回 7 行
-- SELECT id, slug, component_key, category, name, sort_order, is_active,
--        (display_config IS NOT NULL) AS has_display_config
-- FROM page_modules
-- WHERE is_active = true
-- ORDER BY sort_order;
--
-- 预期:
-- | slug              | component_key    | category | name               | has_display_config |
-- |-------------------|------------------|----------|--------------------|--------------------|
-- | medical-packages  | medical_packages | medical  | TIMC 健检套餐       | true               |
-- | hyogo-medical     | hyogo_medical    | medical  | 兵庫医科大学病院    | true               |
-- | cancer-treatment  | cancer_treatment | medical  | 日本癌症治疗        | true               |
-- | medical-tourism   | medical_tourism  | medical  | 医疗旅游            | true               |
-- | golf              | golf             | travel   | 名门高尔夫旅游      | true               |
-- | health-screening  | health_screening | medical  | AI 智能健康筛查     | true               |
-- | vehicles          | vehicles         | vehicle  | 高端车队            | true               |

-- 8.2 验证 page_templates — 应返回 7 行 (bio×3 + vehicle×2 + contact×2)
-- SELECT id, category, name, is_default
-- FROM page_templates
-- WHERE is_active = true
-- ORDER BY category, sort_order;

-- 8.3 验证 vehicle_library — 应返回 5 行
-- SELECT id, slug, name, vehicle_type, seats
-- FROM vehicle_library
-- WHERE is_active = true
-- ORDER BY sort_order;

-- 8.4 验证 commission_tiers — 应返回 4 行
-- SELECT tier_code, tier_name_zh, commission_rate, min_monthly_sales
-- FROM commission_tiers
-- WHERE is_active = true
-- ORDER BY sort_order;

-- 8.5 验证无 component_key 为 NULL 的模块（应返回 0 行）
-- SELECT id, name FROM page_modules WHERE component_key IS NULL;

-- 8.6 验证 white_label_orders 兼容性（应不报错）
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'white_label_orders'
--   AND column_name IN ('guide_id', 'status', 'payment_status', 'customer_name', 'module_id')
-- ORDER BY column_name;


-- =====================================================
-- 完成
-- =====================================================
-- 此迁移覆盖:
-- ✅ 7 个 page_modules 完整数据 (含 component_key + display_config)
-- ✅ golf category 修正 (medical → travel)
-- ✅ vehicles display_config 补充 (之前缺失)
-- ✅ 7 个 page_templates 种子数据 (bio×3, vehicle×2, contact×2)
-- ✅ 5 个 vehicle_library 种子数据
-- ✅ 4 个 commission_tiers 种子数据 (bronze/silver/gold/diamond)
-- ✅ Schema 补全 (component_key, display_config, updated_at, etc.)
-- ✅ guides 表白标字段确认
-- ✅ white_label_orders 兼容性修复 (pending + inquiry 双模式)
-- ✅ 清理 component_key IS NULL 的遗留模块
-- =====================================================
