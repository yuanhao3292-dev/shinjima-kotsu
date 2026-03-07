# 白标页面系统架构说明

## 📋 系统概述

白标页面系统采用**三层架构**：代码层 + 数据库层 + 路由注册层

---

## 🏗️ 三层架构详解

### 1️⃣ 代码层（组件文件）

每个医院/诊所都有独立的 React 组件文件：

```
app/
├── kindai-hospital/
│   └── KindaiHospitalContent.tsx      # 近畿大学病院
├── hyogo-medical/
│   └── HyogoMedicalContent.tsx        # 兵库医科大学
├── osaka-himak/
│   └── OsakaHimakContent.tsx          # 大阪重粒子线中心
├── sai-clinic/
│   └── SaiClinicContent.tsx           # SAI CLINIC
├── wclinic-mens/
│   └── WClinicMensContent.tsx         # W CLINIC men's
├── helene-clinic/
│   └── HeleneClinicContent.tsx        # HELENE诊所
├── ginza-phoenix/
│   └── GinzaPhoenixContent.tsx        # 銀座鳳凰クリニック
├── cell-medicine/
│   └── CellMedicineContent.tsx        # 先端細胞医療
├── ac-plus/
│   └── ACPlusContent.tsx              # ACセルクリニック
├── igtc/
│   └── IGTCContent.tsx                # IGTクリニック
└── cancer-treatment/
    └── CancerTreatmentContent.tsx     # 大阪国际癌症中心
```

**组件特点**：
- 包含完整的页面内容、样式、交互逻辑
- 支持 4 语言（ja, zh-CN, zh-TW, en）
- 接受 `isGuideEmbed` 和 `guideSlug` props（白标模式）

---

### 2️⃣ 数据库层（Supabase）

**表：`page_modules`**

存储模块的元数据和配置信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| `slug` | URL 友好的唯一标识 | `kindai-hospital` |
| `component_key` | 组件映射键（snake_case） | `kindai_hospital` |
| `name` | 模块名称（中文） | `近畿大学病院` |
| `name_ja` | 日文名称 | `近畿大学病院` |
| `name_en` | 英文名称 | `Kindai University Hospital` |
| `category` | 分类 | `medical` / `beauty` |
| `tags` | 标签数组（用于分组） | `['综合医院', '特定功能医院', ...]` |
| `display_config` | 展示配置（JSONB） | 见下方 |
| `has_detail_page` | 是否有详情页 | `true` / `false` |
| `detail_route_type` | 路由类型 | `standalone` / `inline` |
| `commission_rate_a` | 佣金率 A | `15` |
| `commission_rate_b` | 佣金率 B | `20` |
| `is_active` | 是否启用 | `true` / `false` |
| `sort_order` | 排序序号 | `25` |

**display_config 结构**（immersive 模板）：

```json
{
  "template": "immersive",
  "colorTheme": "blue",
  "title": "近畿大学病院",
  "subtitle": "西日本最大规模的特定功能医院",
  "tagline": "Kindai University Hospital",
  "description": "929床位、35诊疗科...",
  "heroImage": "https://www.med.kindai.ac.jp/img/about/relocation/mv.webp",
  "sectionId": "kindai-hospital",
  "navLabel": "近大病院",
  "ctaText": "咨询就诊服务",
  "tags": ["特定功能医院", "达芬奇手术", ...],
  "stats": [
    { "label": "病床数", "value": "929", "unit": "床" },
    ...
  ],
  "sidebar": {
    "type": "checklist",
    "title": "医院特色",
    "items": [
      { "name": "达芬奇手术", "desc": "微创机器人手术系统" },
      ...
    ]
  }
}
```

---

### 3️⃣ 路由注册层（手动配置）

**必须在以下文件中注册新模块**：

#### A. 详情页路由：`app/g/[slug]/[moduleSlug]/page.tsx`

```typescript
// 1. 导入组件
import KindaiHospitalContent from '@/app/kindai-hospital/KindaiHospitalContent';

// 2. 添加到 SUPPORTED_KEYS
const SUPPORTED_KEYS = new Set([
  'kindai_hospital',  // ← 新增
  'hyogo_medical',
  // ...
]);

// 3. 在 switch 中添加 case
switch (componentKey) {
  case 'kindai_hospital':
    return <KindaiHospitalContent isGuideEmbed guideSlug={slug} />;
  // ...
}
```

#### B. 首页路由：`app/g/[slug]/page.tsx`

```typescript
// 1. 添加到 DETAIL_MODULES
const DETAIL_MODULES = new Set([
  'kindai_hospital',  // ← 新增
  'hyogo_medical',
  // ...
]);

// 2. 添加 Hero 图片映射
const DETAIL_PAGE_HERO_IMAGES: Record<string, string> = {
  kindai_hospital: 'https://www.med.kindai.ac.jp/img/about/relocation/mv.webp',
  // ...
};
```

---

## 🔄 添加新白标页面的完整流程

### Step 1: 创建组件文件

```bash
app/new-hospital/NewHospitalContent.tsx
```

### Step 2: 执行数据库 SQL

```sql
-- 插入 page_modules 记录
INSERT INTO page_modules (
  slug, component_key, name, name_ja, name_en,
  category, tags, display_config,
  has_detail_page, detail_route_type,
  commission_rate_a, is_active
) VALUES (
  'new-hospital',
  'new_hospital',
  '新医院名称',
  '新病院名',
  'New Hospital',
  'medical',
  ARRAY['综合医院', '特定功能医院'],
  '{ "template": "immersive", ... }'::jsonb,
  true,
  'standalone',
  15,
  true
);

-- 插入 medical_packages 记录（如有咨询服务）
INSERT INTO medical_packages (...) VALUES (...);
```

### Step 3: 注册路由

在 `app/g/[slug]/[moduleSlug]/page.tsx` 和 `app/g/[slug]/page.tsx` 中添加注册代码（见上方）

### Step 4: 创建 Stripe 产品（如需要）

```bash
node scripts/create-new-hospital-stripe-prices.js
```

---

## 📊 当前所有白标页面

| 组件 | component_key | 分类 | 路由类型 | 状态 |
|------|---------------|------|----------|------|
| KindaiHospitalContent | kindai_hospital | medical | standalone | ✅ 已注册 |
| HyogoMedicalContent | hyogo_medical | medical | inline | ✅ 已注册 |
| OsakaHimakContent | osaka_himak | medical | standalone | ✅ 已注册 |
| CancerTreatmentContent | cancer_treatment | medical | inline | ✅ 已注册 |
| SaiClinicContent | sai_clinic | beauty | inline | ✅ 已注册 |
| WClinicMensContent | wclinic_mens | medical | inline | ✅ 已注册 |
| HeleneClinicContent | helene_clinic | medical | inline | ✅ 已注册 |
| GinzaPhoenixContent | ginza_phoenix | medical | inline | ✅ 已注册 |
| CellMedicineContent | cell_medicine | medical | inline | ✅ 已注册 |
| ACPlusContent | ac_plus | medical | inline | ✅ 已注册 |
| IGTCContent | igtc | medical | inline | ✅ 已注册 |
| TIMCContent | medical_packages | medical | inline | ✅ 已注册 |

---

## 🏷️ 综合医院模块分类

使用 `tags` 字段进行分组：

```javascript
// 综合医院
tags: ['综合医院', '特定功能医院', ...]

// 专科诊所
tags: ['美容整形', '再生医疗', ...]

// 癌症治疗
tags: ['癌症治疗', '重粒子线', ...]
```

**当前综合医院**：
- 近畿大学病院（kindai_hospital）
- 兵庫医科大学病院（hyogo_medical）

---

## 🔍 调试工具脚本

```bash
# 检查所有模块分类
node scripts/check-categories.js

# 检查导游选中的模块
node scripts/check-yuan-modules.js

# 检查特定模块配置
node scripts/check-kindai-config.js

# 查看表结构
node scripts/check-table-schema.js
```

---

## ⚠️ 常见问题

### Q1: 数据库中配置了但前端不显示？
**A**: 检查是否在路由文件中注册了 `component_key`

### Q2: Hero 图片不显示？
**A**: 检查 `DETAIL_PAGE_HERO_IMAGES` 是否添加了映射

### Q3: 如何按标签分组？
**A**: 使用 `tags` 字段，第一个 tag 用于主分类（如 `'综合医院'`）

### Q4: 代码在哪？配置在哪？
**A**:
- 代码：`app/*/Content.tsx` 组件文件
- 配置：Supabase `page_modules` 表
- 路由：`app/g/[slug]/` 路由文件（需手动注册）

---

## 📝 最后更新

- **日期**: 2026-03-07
- **操作**: 添加近畿大学病院到综合医院模块
- **文件**:
  - `app/g/[slug]/[moduleSlug]/page.tsx` ✅ 已注册
  - `app/g/[slug]/page.tsx` ✅ 已注册
  - 数据库 `page_modules` ✅ 已配置
  - 数据库 `tags` 字段 ✅ 已添加"综合医院"标签
