-- =====================================================
-- 059: 添加 display_config 列到 page_modules 表
-- 数据驱动架构迁移：所有沉浸式板块的展示内容存入数据库
-- =====================================================

-- 1. 添加 display_config 列（如果不存在）
ALTER TABLE page_modules ADD COLUMN IF NOT EXISTS display_config JSONB DEFAULT NULL;

-- 2. 为每个沉浸式模块填充 display_config

-- ====== 医疗旅游 (medical_tourism) ======
UPDATE page_modules
SET display_config = '{
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
WHERE component_key = 'medical_tourism';

-- ====== 重疾治疗 (cancer_treatment) ======
UPDATE page_modules
SET display_config = '{
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
WHERE component_key = 'cancer_treatment';

-- ====== 名门高尔夫 (golf) ======
UPDATE page_modules
SET display_config = '{
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
  "tags": ["廣野ゴルフ倶楽部", "霞ヶ関カンツリー倶楽部", "小野ゴルフ倶楽部", "茨木カンツリー倶楽部", "古賀ゴルフ・クラブ"],
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
WHERE component_key = 'golf';

-- ====== AI 智能健康筛查 (health_screening) ======
UPDATE page_modules
SET display_config = '{
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
  "ctaText": "咨询健康筛查"
}'::jsonb
WHERE component_key = 'health_screening';

-- ====== TIMC 健检套餐 (medical_packages) ======
UPDATE page_modules
SET display_config = '{
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
WHERE component_key = 'medical_packages';

-- ====== 兵庫医科大学病院 (hyogo_medical) ======
UPDATE page_modules
SET display_config = '{
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
}'::jsonb
WHERE component_key = 'hyogo_medical';

-- 3. 清理已删除的错误模块（TIMC 综合体检中心，component_key 为 NULL 的重复项）
-- 先删除关联的导游选择记录
DELETE FROM guide_selected_modules
WHERE module_id IN (
  SELECT id FROM page_modules
  WHERE name = 'TIMC 综合体检中心' AND component_key IS NULL
);
-- 再删除模块本身
DELETE FROM page_modules
WHERE name = 'TIMC 综合体检中心' AND component_key IS NULL;

-- 4. 添加索引以优化查询
CREATE INDEX IF NOT EXISTS idx_page_modules_component_key ON page_modules(component_key);
