# 项目标识

**项目名称：** 新岛交通官网 (shinjima-kotsu)
**生产域名：** https://www.niijima-koutsu.jp
**技术栈：** Next.js 16 + TypeScript + Tailwind CSS v4 + Supabase + Stripe
**部署平台：** Vercel

> ⚠️ **注意：这不是 linkquoteai.com 项目！**
> linkquoteai.com 的代码在 `/repos/niijima-b2b-quote-engine`

---

## 部署命令

```bash
# 部署到生产环境 (niijima-koutsu.jp)
vercel --prod
```

---

## 项目整体架构

```
shinjima-kotsu/
├── app/                    # Next.js App Router 页面和 API
│   ├── page.tsx            # 首页 Landing Page
│   ├── layout.tsx          # 根布局（字体加载）
│   ├── globals.css         # 全局样式 + 多语言字体
│   ├── admin/              # 管理后台
│   ├── business/           # B2B 商务页面
│   ├── cancer-treatment/   # 癌症治疗页面 + 支付
│   ├── hyogo-medical/      # 兵库医科大学病院页面 + 支付
│   ├── medical-packages/   # TIMC 健检套餐详情
│   ├── guide-partner/      # 导游合伙人后台
│   ├── g/[slug]/           # 白标分销页面
│   ├── payment/            # 支付成功/取消页
│   ├── api/                # API 路由
│   └── auth/               # Supabase 认证回调
├── components/             # 共享组件
│   ├── whitelabel-modules/ # 白标模块组件
│   ├── guide-partner/      # 导游后台组件
│   ├── distribution/       # 分销系统组件
│   └── modules/            # 页面模块组件
├── hooks/                  # React Hooks
├── lib/                    # 工具库
│   ├── config/             # 配置（医疗套餐、服务商）
│   ├── supabase/           # Supabase 客户端
│   ├── validations/        # Zod 验证 Schema
│   ├── utils/              # 工具函数
│   ├── services/           # 白标服务
│   ├── types/              # TypeScript 类型
│   ├── cache/              # 缓存
│   └── templates/          # 邮件模板
├── services/               # 业务服务
│   ├── deepseek/           # DeepSeek AI 健康问卷
│   ├── timcQuoteCalculator.ts  # TIMC 报价计算
│   └── pricingEngine.ts    # 定价引擎
├── supabase/migrations/    # 数据库迁移
├── scripts/                # 运维脚本
├── public/                 # 静态资源
└── tests/                  # 测试
```

---

## 核心功能模块

### 1. 首页 Landing Page
- **文件**: `components/LandingPage.tsx`
- 医疗健检、商务服务、高尔夫三大入口
- `components/HeroCarousel.tsx` 轮播

### 2. TIMC 医疗健检套餐
- **列表页**: `app/medical-packages/[slug]/page.tsx` (含 Stripe 支付表单)
- **套餐配置**: `lib/config/medical-packages.ts` (前端参考)
- **数据库**: `medical_packages` 表 (Supabase)
- **报价工具**: `components/TIMCQuoteModal.tsx` + `services/timcQuoteCalculator.ts`

### 3. 癌症治疗页面
- **主页面**: `app/cancer-treatment/page.tsx` → `CancerTreatmentContent.tsx`
- **支付页**: `app/cancer-treatment/initial-consultation/page.tsx` (前期咨询 ¥221,000)
- **支付页**: `app/cancer-treatment/remote-consultation/page.tsx` (远程会诊 ¥243,000)
- **交互式治疗流程**: PHASE 1-4 导航 + 10步时间线 + 患者/中介双栏对比

### 4. 兵库医科大学病院页面
- **主页面**: `app/hyogo-medical/page.tsx` → `HyogoMedicalContent.tsx`
- **支付页**: `app/hyogo-medical/initial-consultation/page.tsx` (前期咨询 ¥221,000)
- **支付页**: `app/hyogo-medical/remote-consultation/page.tsx` (远程会诊 ¥243,000)
- **交互式治疗流程**: 与癌症治疗同结构，PHASE 1-4 + 10步 + 双栏

### 5. 白标分销系统 (Whitelabel)
- **导游页面**: `app/g/[slug]/page.tsx` → 加载导游选择的模块
- **模块路由**: `app/g/[slug]/[moduleSlug]/page.tsx`
- **子项路由**: `app/g/[slug]/[moduleSlug]/[itemSlug]/page.tsx`
- **模块注册**: `components/whitelabel-modules/registry.ts`
- **配置**: `lib/whitelabel-config.ts` (slug 校验) + `lib/whitelabel-pages.ts`
- **服务端**: `lib/services/whitelabel.ts` + `lib/utils/whitelabel-server.ts`

#### 白标可用模块（数据库 page_modules 表，共 12 个）

| component_key | 名称 | Content 组件 | 分类 |
|---------------|------|-------------|------|
| medical_packages | TIMC 健检套餐 | TIMCContent | 体检中心 |
| hyogo_medical | 兵庫医科大学病院 | HyogoMedicalContent | 综合医院 |
| kindai_hospital | 近畿大学病院 | KindaiHospitalContent | 综合医院 |
| cancer_treatment | 大阪国際がんセンター | OICIContent | 综合医院 |
| sai_clinic | SAI CLINIC 医美整形 | SaiClinicContent | 医美整形 |
| wclinic_mens | W CLINIC men's 梅田院 | WClinicMensContent | 医美整形 |
| helene_clinic | 表参道HELENE诊所 | HeleneClinicContent | 干细胞中心 |
| ginza_phoenix | 銀座鳳凰クリニック | GinzaPhoenixContent | 干细胞中心 |
| cell_medicine | 先端細胞医療 | CellMedicineContent | 干细胞中心 |
| ac_plus | ACセルクリニック | ACPlusContent | 干细胞中心 |
| igtc | IGTクリニック | IGTCContent | 综合医院 |
| osaka_himak | 大阪重粒子線センター | OsakaHimakContent | 综合医院 |

> **注意**: `golf`、`medical_tourism`、`health_screening` 在代码中曾有残留引用，但数据库中不存在这些模块。`health_screening` 是独立硬编码路由（AI 健康筛查），不属于 page_modules。

#### ⚠️ 白标导航栏模块过滤机制（重要踩坑记录）

**问题**: 导游在选品中心选择了全部 9 个模块，但白标预览页导航栏只显示 4 个（SAI CLINIC、兵庫医科、がんセンター、TIMC体検）。

**根因**: 白标系统有 **三层过滤**，必须全部对齐才能正常显示：

```
layer 1: layout.tsx  → DETAIL_MODULES (导航栏白名单)
layer 2: page.tsx    → DETAIL_MODULES (首页卡片白名单)
layer 3: [moduleSlug]/page.tsx → SUPPORTED_KEYS + switch (详情页路由)
```

当时 `layout.tsx` 的 `DETAIL_MODULES` 只有 7 个 key（其中 golf/medical_tourism/health_screening 在数据库不存在），实际有效匹配只有 4 个。新增的 5 家诊所（helene_clinic、ginza_phoenix、wclinic_mens、cell_medicine、ac_plus）被白名单过滤掉了。

**修复**: 在 `layout.tsx` 的 `DETAIL_MODULES` 和 `MODULE_LABELS` 中补齐所有 9 个真实存在的模块。

**教训**:
1. 新增医院/模块时，必须同步更新三个文件的白名单（layout.tsx、page.tsx、[moduleSlug]/page.tsx）
2. 不要在代码中保留数据库已不存在的模块 key，会造成混淆
3. 排查问题时先查数据库实际数据，不要只看代码推测
4. **新增模块完整检查清单（6个文件 10个注册点）**（2026-03-07 更新）：
   - ✅ `app/g/[slug]/layout.tsx` → `DETAIL_MODULES` + `MODULE_LABELS`
   - ✅ `app/g/[slug]/page.tsx` → `DETAIL_MODULES` + `DETAIL_PAGE_HERO_IMAGES`
   - ✅ `app/g/[slug]/[moduleSlug]/page.tsx` → `SUPPORTED_KEYS` + import + case switch
   - ✅ `middleware.ts` → `WHITELABEL_MODULE_PATHS` (白标域名重定向)
   - ✅ `lib/config/product-categories.ts` → `MODULE_DETAIL_ROUTES` + 分类 `moduleKeys` ← 🚨 **必须！否则选品中心不可见**
   - ✅ `lib/config/medical-packages.ts` → 添加咨询服务配置
   - ✅ `Content组件` → props 接口添加 `guideSlug?: string`
   - ✅ `CLAUDE.md` → 更新白标可用模块表

#### 🔑 选品中心集成流程（2026-03-07 近畿大学病院案例）

**问题**: 近畿大学病院在数据库中配置完成，路由也注册了，但选品中心看不到，导游无法选择。

**根因**: 缺少 `lib/config/product-categories.ts` 配置，导致模块不在任何分类中显示。

**白标页面显示的完整链路**（7 个检查点）：

```
1. 数据库配置 (page_modules)
   ↓ is_active=true, display_config.template='immersive'
2. 前端分类配置 (product-categories.ts)  ← 🚨 容易遗漏！
   ↓ 加入 PRODUCT_CATEGORIES.moduleKeys
3. 选品中心 API (/api/guide/product-center)
   ↓ 返回所有 is_active=true 的模块
4. 选品中心前端 (product-center/page.tsx)
   ↓ 按分类过滤和显示
5. 导游选择 (guide_selected_modules 表)
   ↓ is_enabled=true
6. 白标页面服务 (lib/services/whitelabel.ts)
   ↓ getGuideDistributionPage() 查询选中模块
7. 白标页面前端 (app/g/[slug]/page.tsx)
   ↓ 过滤 immersive 模板 + DETAIL_MODULES 白名单
```

**修复步骤** (以 kindai_hospital 为例)：

1. **添加到路由映射** (`lib/config/product-categories.ts` 第 24-37 行)：
```typescript
export const MODULE_DETAIL_ROUTES: Record<string, string> = {
  // ...
  kindai_hospital: '/kindai-hospital',  // ← 新增
  osaka_himak: '/osaka-himak',          // ← 新增
  // ...
};
```

2. **添加到分类配置** (`lib/config/product-categories.ts` 第 40-50 行)：
```typescript
{
  id: 'general_hospital',
  name: '综合医院合作',
  moduleKeys: [
    'hyogo_medical',
    'kindai_hospital',   // ← 新增
    'osaka_himak',       // ← 新增
    'cancer_treatment',
    'igtc'
  ],
}
```

**验证方法**:
```bash
node scripts/test-complete-integration.js
```

**教训**:
- 数据库配置 + 路由注册 **≠** 完整集成
- **必须同时配置 `product-categories.ts`**，否则选品中心不可见
- 任何导游都无法选择未分类的模块（即使数据库中存在）
- 新增模块时使用完整检查清单，避免遗漏配置步骤

### 6. 导游合伙人系统
- **后台**: `app/guide-partner/` (dashboard, bookings, commission, analytics等)
- **产品中心**: `app/guide-partner/product-center/page.tsx`
- **白标管理**: `app/guide-partner/whitelabel/page.tsx`
- **订阅管理**: `app/guide-partner/subscription/page.tsx`
- **侧边栏**: `components/guide-partner/GuideSidebar.tsx`

### 7. 管理后台
- **入口**: `app/admin/page.tsx`
- **功能**: 订单管理、预约管理、KYC审核、新闻管理、导游管理、结算、工单

### 8. 会员系统
- **登录**: `app/login/page.tsx`
- **注册**: `app/register/page.tsx`
- **我的订单**: `app/my-orders/page.tsx`
- **我的账户**: `app/my-account/page.tsx`
- **认证**: Supabase Auth (`app/auth/callback/route.ts`, `app/auth/confirm/route.ts`)

### 9. AI 健康筛查
- **问卷页**: `app/health-screening/page.tsx`
- **结果页**: `app/health-screening/result/[id]/page.tsx`
- **历史**: `app/health-screening/history/page.tsx`
- **AI引擎**: `services/deepseek/` (DeepSeek AI分析)
- **API**: `app/api/health-screening/` (analyze, CRUD)

---

## 支付流程架构

```
用户点击「立即预约」
  → 填写表单（姓名、电话、邮箱、备注）
  → POST /api/create-checkout-session
      → Zod 验证 (CustomerInfoSchema + CreateCheckoutSessionSchema)
      → 查询 Supabase medical_packages 获取 stripe_price_id
      → 创建 Supabase order 记录
      → 调用 Stripe API 创建 Checkout Session
      → 返回 checkoutUrl
  → 重定向到 Stripe Checkout 页面
  → 支付成功 → /payment/success?session_id=xxx
  → 支付取消 → /payment/cancel
  → Stripe Webhook → /api/webhooks/stripe/route.ts → 更新订单状态
```

### 验证 Schema
- `lib/validations/api-schemas.ts`:
  - `CustomerInfoSchema`: name(必填), phone(可选), email(可选或空字符串)
  - `CreateCheckoutSessionSchema`: packageSlug, customerInfo, notes(max 1000)

### Stripe 环境
- 密钥: `STRIPE_SECRET_KEY` (Vercel env)
- Price ID 存储: Supabase `medical_packages.stripe_price_id`
- 当前账户标识: `I4ztZLHcF4` (TEST 模式)

---

## 数据库 (Supabase)

### 核心表

| 表名 | 用途 |
|------|------|
| `medical_packages` | 医疗套餐 (slug, name, price_jpy, stripe_price_id, category, is_active) |
| `orders` | 订单 (stripe_session_id, package_slug, customer_info, status) |
| `guides` | 导游合伙人 (slug, subscription, kyc_status) |
| `guide_selected_modules` | 导游选择的白标模块 |
| `guide_display_config` | 白标页面显示配置 |
| `page_templates` | 页面模板 |
| `page_modules` | 页面模块定义 |

### 迁移文件
- `001_create_medical_packages_schema.sql` - 基础医疗套餐表
- `058_white_label_system.sql` - 白标分销系统
- `059_add_display_config.sql` - 显示配置
- `060_add_hyogo_medical_module.sql` - 兵库医大模块
- `061_add_hyogo_medical_packages.sql` - 兵库医大套餐 (hyogo-initial/remote-consultation)

---

## API 路由

### 支付相关 (🔒 冻结)
| 路由 | 用途 |
|------|------|
| `POST /api/create-checkout-session` | 创建 Stripe Checkout 会话 |
| `POST /api/webhooks/stripe` | Stripe 支付 Webhook |
| `POST /api/stripe/webhook-subscription` | Stripe 订阅 Webhook |
| `GET /api/order-lookup` | 按 session_id 查询订单 |

### 白标/导游
| 路由 | 用途 |
|------|------|
| `GET/POST /api/guide/selected-modules` | 导游模块选择 |
| `GET/POST /api/guide/whitelabel-page` | 白标页面配置 |
| `GET/POST /api/guide/product-center` | 产品中心 |
| `POST /api/guide/register` | 导游注册 |
| `POST /api/guide/upgrade-to-partner` | 升级合伙人 |
| `GET/POST /api/guide/subscription` | 订阅管理 |
| `POST /api/whitelabel/create-subscription` | 创建白标订阅 |
| `POST /api/whitelabel/track` | 白标追踪 |
| `GET /api/whitelabel/orders` | 白标订单 |
| `GET /api/whitelabel/settings` | 白标设置 |

### 管理后台
| 路由 | 用途 |
|------|------|
| `POST /api/admin/verify` | 管理员认证 |
| `/api/admin/bookings` | 预约管理 |
| `/api/admin/guides` | 导游管理 |
| `/api/admin/orders` | 订单管理 |
| `/api/admin/news` | 新闻管理 |
| `/api/admin/kyc` | KYC审核 |
| `/api/admin/venues` | 场馆管理 |
| `/api/admin/tickets` | 工单 |

### 其他
| 路由 | 用途 |
|------|------|
| `/api/health-screening` | 健康筛查 CRUD |
| `/api/health-screening/analyze` | AI分析 |
| `/api/calculate-quote` | 计算报价 |
| `/api/parse-itinerary` | 解析行程 |
| `/api/partner-inquiry` | 合作咨询 |
| `/api/news` | 新闻列表 |
| `/api/commission-tiers` | 佣金等级 |

---

## 交互式治疗流程架构 (癌症治疗 / 兵库医大共用模式)

### 数据结构

```typescript
// 10步详细流程
const TREATMENT_FLOW = [
  { step: 1, title: Record<Language, string>, subtitle, fee, from, to, desc },
  // ... step 2-10
];

// 4大阶段（归纳10步）
const TREATMENT_PHASES = [
  {
    id: string,              // 唯一标识
    phaseNumber: 1-4,        // 阶段编号
    icon: LucideIcon,        // 图标
    color: 'blue'|'purple'|'amber'|'green',
    title: Record<Language, string>,
    subtitle: Record<Language, string>,
    duration: Record<Language, string>,
    stepRange: [from, to],   // 对应 TREATMENT_FLOW 的 step 范围
    patientActions: Record<Language, string>[],  // 患者需要做的
    weHandle: Record<Language, string>[],        // 我方负责的
    feeSummary: Record<Language, string> | null,  // 费用摘要
  },
];
```

### 颜色映射系统

```typescript
type PhaseColor = 'blue' | 'purple' | 'amber' | 'green';

PHASE_COLORS     → { bg, light, border, text, ring }  // 基础颜色
PHASE_GRADIENT_MAP → 渐变背景 (header)
PHASE_LIGHT_BG_MAP → 浅色背景+边框 (患者操作栏)
PHASE_DOT_MAP      → 时间线圆点颜色
```

### 交互逻辑

```
状态: activePhase (1-4), expandedStep (null | stepNumber)

UI 结构:
1. Section Header (标签 + 标题 + 描述)
2. Phase Navigation (2x4 grid 按钮，点击切换 activePhase)
3. Active Phase Detail:
   ├── Gradient Header (图标 + PHASE N + 标题 + 副标题 + 时长 + 费用)
   ├── Two-column (患者操作 vs 我方负责)
   └── Sub-step Timeline (可展开的步骤卡片 + from→to 标签)
```

### 两个页面的差异

| 项目 | 癌症治疗 (CancerTreatmentContent) | 兵库医大 (HyogoMedicalContent) |
|------|----|----|
| 语言变量名 | `currentLang` | `lang` |
| 翻译函数 | `t('flowYouDo')` | `bookingT.flowYouDo[lang]` |
| 标题标签 | `<h3>` | `<h3>` (section title) / `<h4>` (phase) |
| 医院名称 | 通用"病院" | "兵库医大" |
| 背景色 | `bg-white` | `bg-white` |

---

## 多语言系统 (i18n)

**支持语言：** ja, zh-TW, zh-CN, en
**实现方式：** Cookie-based (`NEXT_LOCALE`)，无 URL 路由
**Hook**: `hooks/useLanguage.ts` → 读取 cookie + 浏览器语言 fallback

### 翻译方式
- **全局翻译**: `translations.ts`（LandingPage 等共用）
- **页面内联翻译**: `Record<Language, string>` 对象（CancerTreatment, HyogoMedical 等）
- **独立页面翻译**: `payment/success/page.tsx` 等有独立 i18n 对象

### 语言读取逻辑

```typescript
// 使用 hooks/useLanguage.ts (推荐)
const lang = useLanguage();

// 或手动读取 cookie
useEffect(() => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE') setLang(value as Language);
  }
}, []);
```

**历史 Bug：** `LandingPage.tsx` 曾硬编码 `useState<Language>('zh-TW')`，永远不读 cookie。

---

## ⚠️ 多语言字体系统（重要踩坑记录）

### 字体配置

| 语言 | 正文 (sans-serif) | 标题 (serif) | 来源 |
|------|-------------------|-------------|------|
| ja | Noto Sans JP | Shippori Mincho | loli.net CDN |
| zh-TW | Noto Sans TC | Noto Serif TC | loli.net CDN |
| zh-CN | PingFang SC / Microsoft YaHei | LXGW WenKai (霞鹜文楷) | 系统字体 + jsDelivr |
| en | Inter | Playfair Display | loli.net CDN |

### 实现架构

1. **`LocaleFontSetter.tsx`** - 客户端组件，读取 cookie 设置 `<html data-locale="zh-CN">`
2. **`globals.css`** - 通过 `[data-locale="zh-CN"]` 选择器应用对应字体
3. **`layout.tsx`** - 加载 Google Fonts (loli.net 镜像) + LXGW WenKai (jsDelivr)

### 关键踩坑点

#### 1. Tailwind v4 优先级覆盖
必须使用 `!important` + 同时 target `.font-sans` 和 `.font-serif` class

#### 2. 日文字体 fallback 导致简体字形混排
zh-CN 必须强制使用中文字体（PingFang SC/Microsoft YaHei），不能依赖日文字体 fallback

#### 3. 中国大陆无法访问 Google Fonts
zh-CN 正文使用系统字体，标题使用 LXGW WenKai via jsDelivr

#### 4. `<body>` 上的 `font-sans` class
已移除，只保留 `<body className="antialiased">`

### 禁止事项

- ❌ 不要在 `<body>` 上加 `font-sans` class
- ❌ 不要依赖 Google Fonts 为中国用户加载简体中文字体
- ❌ 不要在 locale-specific CSS 中省略 `!important`
- ❌ 不要让 zh-CN 回退到日文字体 Noto Sans JP

---

## 🔒 支付模块冻结规范 (Payment Module - LOCKED)

**状态**: 🔒 **永久冻结** (Permanently Locked)
**生效日期**: 2026-01-26
**解锁条件**: 仅限用户明确指令

### ⛔ 绝对禁止修改的文件

| 文件 | 用途 | 冻结级别 |
|------|------|----------|
| `app/api/create-checkout-session/route.ts` | Stripe 支付会话创建 | 🔒 LOCKED |
| `app/api/stripe/webhook-subscription/route.ts` | Stripe 订阅 Webhook | 🔒 LOCKED |
| `app/api/webhooks/stripe/route.ts` | Stripe 支付 Webhook | 🔒 LOCKED |
| `app/medical-packages/[slug]/page.tsx` | 医疗套餐详情页（含支付表单） | 🔒 LOCKED |
| `app/payment/success/page.tsx` | 支付成功页 | 🔒 LOCKED |
| `app/payment/cancel/page.tsx` | 支付取消页 | 🔒 LOCKED |

### 解锁流程

用户必须明确说明（模糊指令不算）：
1. "我要修改支付功能"
2. "解锁支付模块"
3. "修改 create-checkout-session"

### 冻结原因

支付功能涉及真实金钱交易，任何未经授权的修改可能导致订单丢失、重复扣款、价格错误。

---

## 🔒 支付/结账页面布局规范 (CheckoutLayout - MANDATORY)

**状态**: 🔒 **强制执行** (Mandatory)
**生效日期**: 2026-02-12

### 规则

所有支付页面、咨询预约页面、结账页面**必须**使用 `CheckoutLayout` 组件，**禁止**使用 `PublicLayout`。

### 原因

客户从医疗/健检等服务页面进入支付页时，若显示完整的 NIIJIMA 导航栏，会造成品牌断裂感（"进入了陌生网站"）。CheckoutLayout 提供 Stripe Checkout 风格的极简体验。

### CheckoutLayout 特性

| 特性 | 说明 |
|------|------|
| 顶部品牌 | 从 WhiteLabelContext 读取，与分销页面品牌设置同步 |
| 导航 | 无完整导航栏，仅品牌名 + 安全结账标识 + 语言切换 |
| 底部 | **必须**显示新岛交通株式会社 + 旅行业登录号（法律要求，不可替换为白标品牌） |
| 返回按钮 | 由各页面自行在 CheckoutLayout 内部实现 |

### 必须使用 CheckoutLayout 的页面

| 页面 | 文件 |
|------|------|
| TIMC 健检套餐详情 | `app/medical-packages/[slug]/page.tsx` |
| 兵库医大初期咨询 | `app/hyogo-medical/initial-consultation/page.tsx` |
| 兵库医大远程会诊 | `app/hyogo-medical/remote-consultation/page.tsx` |
| 癌症治疗初期咨询 | `app/cancer-treatment/initial-consultation/page.tsx` |
| 癌症治疗远程会诊 | `app/cancer-treatment/remote-consultation/page.tsx` |
| IGTC初期咨询 | `app/igtc/initial-consultation/page.tsx` |
| IGTC远程会诊 | `app/igtc/remote-consultation/page.tsx` |

### 新增支付页面时的检查清单

1. ✅ 使用 `<CheckoutLayout>` 包裹，**不要**用 `<PublicLayout>`
2. ✅ 顶部品牌自动与白标设置同步（无需额外代码）
3. ✅ 底部法律信息保持新岛交通株式会社（**禁止**替换）
4. ✅ 移除 `pt-20` padding（CheckoutLayout 的 header 高度仅 56px）
5. ✅ 页面内自行添加返回按钮（`<ArrowLeft>` + `<Link>`）

---

## 🔒 导游独立站首页首图规范 (Guide Homepage Hero Images - MANDATORY)

**状态**: 🔒 **强制执行** (Mandatory)
**生效日期**: 2026-02-13

### 规则

导游独立站首页 (`app/g/[slug]/page.tsx`) 的背景图片**必须**直接复用对应详情页的首图，**禁止**单独配置首页背景图。

### 实现方式

使用 `DETAIL_PAGE_HERO_IMAGES` 硬编码映射（位于 `app/g/[slug]/page.tsx` 第 23-30 行）：

```typescript
/** 详情页首图映射（确保首页背景图严格复用详情页首图） */
const DETAIL_PAGE_HERO_IMAGES: Record<string, string> = {
  medical_packages: 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg',
  health_screening: 'https://i.ibb.co/xS1h4rTM/hero-medical.jpg', // 和 medical_packages 共用
  sai_clinic: '/images/sai-clinic/hero-01.jpg',
  hyogo_medical: 'https://www.hosp.hyo-med.ac.jp/library/petcenter/institution/img/img01.jpg',
  // 新增模块时在此处补充
};
```

### 原因

首页和详情页的视觉必须保持一致性。如果首页使用 `ImmersiveDisplayConfig.heroImage`（存储在数据库），而详情页使用组件内硬编码的图片，会导致用户从首页跳转到详情页时看到不同的背景图，造成品牌断裂感。

### 如何添加新模块

当添加新的医院/模块详情页时：

1. 从详情页组件中找到首图 URL（例如 `TIMCContent.tsx` line 17, `SaiClinicContent.tsx` line 18, `HyogoMedicalContent.tsx` line 809）
2. 添加到 `DETAIL_PAGE_HERO_IMAGES` 映射中
3. **禁止**在 `display_config.heroImage` 中单独设置不同的图片

### 使用示例

```typescript
// Hero Section (首页第一个产品)
<img
  src={DETAIL_PAGE_HERO_IMAGES[heroCard.componentKey] || heroCard.config.heroImage}
  alt={heroCard.config.title}
  className="absolute inset-0 w-full h-full object-cover"
/>

// Partner Sections (后续产品)
<img
  src={DETAIL_PAGE_HERO_IMAGES[componentKey] || dc.heroImage}
  alt={dc.title}
  className="absolute inset-0 w-full h-full object-cover"
/>
```

**优先级**: `DETAIL_PAGE_HERO_IMAGES` 映射 > `displayConfig.heroImage` (fallback)

### ⛔ 禁止操作

- ❌ 不要绕过 `DETAIL_PAGE_HERO_IMAGES` 直接使用 `dc.heroImage`
- ❌ 不要在数据库 `display_config.heroImage` 中设置与详情页首图不同的图片
- ❌ 不要删除或注释 `DETAIL_PAGE_HERO_IMAGES` 映射

---

## 🔒 医疗旅游业务合规规范 (Medical Tourism Compliance - MANDATORY)

**状态**: 🔒 **强制执行** (Mandatory)
**生效日期**: 2026-02-13
**法律依据**: 日本旅行業法、療養担当規則、個人情報保護法

### 核心合规原则

医疗旅游业务涉及旅行业法、医疗法规、个人信息保护等多重法律监管，必须严格遵守以下规范。

---

### 一、法律架构（三方关系）

```
┌──────────────────────────────────────────────┐
│              合法业务流程                       │
└──────────────────────────────────────────────┘

客户（外国游客）
    ↓ 签署医疗旅行服务合同
新岛交通（持牌旅行社，第2-3115号）
    ↓ 安排医疗预约 + 提供旅行服务
医疗机构（自由诊疗）
    ↓ 支付患者紹介料（自由诊疗允许）
新岛交通
    ↓ 分配销售佣金
导游（合作伙伴）
```

**关键法律要点：**
1. ✅ 合同主体：**新岛交通**（持牌旅行社）
2. ✅ 服务性质：**医疗旅行服务**（非单纯医疗介绍）
3. ✅ 诊疗类型：**自由诊疗**（非保险诊疗）
4. ✅ 导游收入：**销售佣金**（非医疗介绍费）

---

### 二、患者紹介料的法律规定

#### 2.1 法律红线

根据[療養担当規則第2条の4の2](https://medical-soleil.jp/column/651.html)（2014年修订）：

| 诊疗类型 | 紹介料合法性 | 法律依据 |
|---------|------------|---------|
| **保险诊疗** | ❌ **严格禁止** | 療養担当規則（保护患者自由选择） |
| **自由诊疗** | ✅ **允许** | 厚生劳动省令和2年（2020年）见解 |

**判断标准：**
> "即使不用'紹介料'名称，**实质上**如果是介绍费就会被认定违法（保险诊疗）。"

#### 2.2 合规要求

**✅ 允许的做法：**
- 医疗机构向旅行社支付自由诊疗患者的紹介料
- 旅行社将紹介料的一部分作为佣金分配给导游
- 所有资金流向通过旅行社（持牌主体）

**❌ 禁止的做法：**
- 导游直接从医疗机构收取介绍费
- 为保险诊疗患者收取或支付紹介料
- 以"咨询费""服务费"等名义变相收取医疗介绍费

---

### 三、旅行业法要求

#### 3.1 旅行业登録

新岛交通持有：**大阪府知事登録旅行業 第2-3115号**（第2种旅行业）

**业务范围：**
- ✅ 可接待入境医疗旅游（インバウンド医療ツーリズム）
- ✅ 可安排国内所有旅行业务
- ✅ 可签署旅行合同作为合同主体
- ❌ 不能组织海外包价旅游（但不影响医疗入境）

#### 3.2 法定义务

根据[旅行業法](https://www.meti.go.jp/policy/mono_info_service/healthcare/kokusaitenkai/inbound.html)，持牌旅行社必须：
1. 缴纳営業保証金（或弁済業务保証金分担金）
2. 配备旅行业务取扱管理者
3. 作为合同主体签署旅行合同
4. 承担旅行业法规定的法律责任

---

### 四、合规文案规范

#### 4.1 禁止表述（违法风险）

| ❌ 禁止表述 | 风险 |
|-----------|------|
| "医疗介绍服务" | 暗示收取医疗介绍费 |
| "我可以帮您介绍日本医院" | 个人医疗中介（无资质） |
| "直接联系我预约医院" | 绕过旅行社主体 |
| "医疗中介" | 无旅行业资质经营 |
| "包治百病""100%治愈" | 违反医療広告ガイドライン |

#### 4.2 合规表述（推荐）

| ✅ 合规表述 | 说明 |
|-----------|------|
| "专业医疗旅行服务" | 强调旅行服务性质 |
| "由持牌旅行社新岛交通提供合规服务" | 明确合法主体 |
| "预约安排、中文翻译、全程陪同" | 具体服务内容 |
| "医疗旅行顾问" | 导游角色定位 |
| "持牌旅行社保障" | 强调合规背书 |

#### 4.3 文案检查清单

在所有对外宣传材料中（网站、宣传册、社交媒体等）：
- [ ] ✅ 强调"医疗旅行服务"（非单纯医疗介绍）
- [ ] ✅ 明确新岛交通作为持牌旅行社的主体地位
- [ ] ✅ 突出导游的"服务"角色（翻译、陪同、行程安排）
- [ ] ✅ 避免使用"介绍""中介"等敏感词汇
- [ ] ❌ 不夸大医疗效果，不做虚假承诺

---

### 五、合同模板规范

#### 5.1 标准合同模板

项目已创建三个标准合同模板（位于 `contracts/` 目录）：

1. **客户合同模板** (`customer-medical-travel-service-agreement.md`)
   - 合同主体：新岛交通株式会社
   - 服务性质：医疗旅行服务（含医疗安排、翻译陪同、交通住宿等）
   - 医疗费用：客户直接支付给医疗机构
   - 专属导游：明确指定

2. **医疗机构合作协议** (`medical-institution-cooperation-agreement.md`)
   - 诊疗类型确认：**自由诊疗**（非保险诊疗）
   - 紹介料标准：按医疗费比例或固定金额
   - 法律依据：厚生劳动省令和2年见解
   - 合规声明：符合療養担当規則要求

3. **导游佣金协议** (`guide-commission-agreement.md`)
   - 合作性质：销售代理/合作伙伴
   - 佣金性质：销售佣金（非医疗介绍费）
   - 禁止行为：不得直接从医疗机构收取费用
   - 合规培训：合规文案、业务流程培训

#### 5.2 合同必备条款

所有合同必须包含：
- ✅ 明确的合同主体（新岛交通作为旅行社）
- ✅ 服务性质说明（医疗旅行服务 vs 单纯医疗服务）
- ✅ 诊疗类型确认（自由诊疗 vs 保险诊疗）
- ✅ 个人信息保护条款（符合個人情報保護法）
- ✅ 医疗风险告知（旅行社不承担医疗责任）
- ✅ 争议解决条款（适用日本法律）

---

### 六、资金流与合同流

#### 6.1 合规资金流

```
客户 → 新岛交通（旅行服务费）
客户 → 医疗机构（医疗费，直接支付）
医疗机构 → 新岛交通（紹介料，自由诊疗允许）
新岛交通 → 导游（销售佣金）
```

**关键点：**
- ✅ 所有B2C资金流必须经过新岛交通（持牌主体）
- ✅ 医疗机构向旅行社支付紹介料（自由诊疗合法）
- ✅ 旅行社向导游支付销售佣金（合法分配）
- ❌ 导游不得直接从医疗机构收钱

#### 6.2 合规合同流

```
客户 ←→ 新岛交通（医疗旅行服务合同）
新岛交通 ←→ 医疗机构（合作协议）
新岛交通 ←→ 导游（佣金协议）
```

**关键点：**
- ✅ 客户合同主体必须是新岛交通
- ❌ 导游不得以个人名义与客户签约
- ❌ 导游不得与医疗机构直接签署介绍协议

---

### 七、白标页面合规要求

#### 7.1 页面文案

导游白标页面（`app/g/[slug]/page.tsx`）必须：
- ✅ 强调"医疗旅行服务平台"定位
- ✅ 明确新岛交通作为持牌旅行社的主体地位（Footer必须保留）
- ✅ 突出导游的"专属服务人员"角色
- ❌ 不说"医疗介绍""医疗中介"
- ❌ 不夸大医疗效果

#### 7.2 信任标识

页面必须展示：
- 持牌旅行社资质（大阪府知事登録旅行業 第2-3115号）
- 认证医疗机构（JCI/厚生省认证）
- 专业服务内容（预约安排、翻译陪同、全程服务）

#### 7.3 Footer法律信息

**⛔ 强制要求（不可删除）：**
```
旅行服务由 新岛交通株式会社 提供
大阪府知事登録旅行業 第2-3115号
```

即使是白标页面，Footer的法律信息**必须保留**，这是旅行业法的强制要求。

---

### 八、导游合规培训要点

#### 8.1 合规意识

导游必须理解：
1. 你的角色是"医疗旅行顾问"，不是"医疗中介"
2. 你的收入是"销售佣金"，不是"医疗介绍费"
3. 所有客户合同必须由新岛交通签署
4. 你不能直接从医疗机构收钱

#### 8.2 话术培训

**客户问："你是医院的人吗？"**
- ❌ "我帮医院介绍客户"
- ✅ "我是医疗旅行顾问，为您提供预约安排、翻译陪同等服务"

**客户问："你从医院拿多少提成？"**
- ❌ "医院给我XX%回扣"
- ✅ "我从旅行社获得服务佣金，医疗费用您直接支付给医院"

**客户问："为什么合同主体是新岛交通？"**
- ✅ "根据日本法律，跨境医疗旅游必须由持牌旅行社签约。新岛交通提供合规保障，我负责全程服务。"

---

### 九、违规后果

#### 9.1 法律风险

违反合规要求可能导致：
- 🚨 违反旅行业法 → 吊销旅行业登録资质
- 🚨 违反療養担当規則 → 医疗机构被处罚
- 🚨 违反個人情報保護法 → 罚款 + 刑事责任
- 🚨 虚假广告 → 违反医療広告ガイドライン

#### 9.2 商业风险

- 导游与旅行社的合作被终止
- 医疗机构拒绝继续合作
- 客户投诉 + 声誉受损
- 订单被取消 + 佣金被扣除

---

### 十、⛔ 绝对禁止的行为

| 禁止行为 | 后果 | 处理 |
|---------|------|------|
| 导游直接从医疗机构收取介绍费 | 违法 | 立即终止合作 + 追回所有佣金 |
| 以个人名义与客户签署医疗旅游合同 | 违反旅行业法 | 立即终止合作 + 法律追责 |
| 虚假宣传医疗效果（"包治百病"） | 违反广告法 | 删除内容 + 扣除佣金 + 警告 |
| 泄露客户医疗隐私 | 违反個人情報保護法 | 立即终止合作 + 法律追责 |
| 在白标页面删除Footer法律信息 | 违反旅行业法 | 恢复内容 + 警告 |

---

### 十一、参考法律文件

1. **旅行業法**
   - [経産省医疗旅游政策](https://www.meti.go.jp/policy/mono_info_service/healthcare/kokusaitenkai/inbound.html)
   - [大阪府旅行業登録制度](https://www.pref.osaka.lg.jp/o070070/toshimiryoku/tourokujigyousya/index.html)

2. **療養担当規則（患者紹介料規制）**
   - [厚生劳动省見解](https://medical-soleil.jp/column/651.html)
   - [自由诊疗紹介料の適法性](https://mialawoffice.jp/column/483/)

3. **個人情報保護法**
   - 保护患者个人信息和医疗隐私
   - 未经同意不得向第三方提供

4. **医療広告ガイドライン**
   - 禁止虚假夸大广告
   - 禁止使用禁止的广告用语

---

### 十二、合规检查清单

在开展医疗旅游业务前，必须确认：

**法律架构：**
- [ ] ✅ 客户合同主体为新岛交通（持牌旅行社）
- [ ] ✅ 医疗机构提供的是自由诊疗（非保险诊疗）
- [ ] ✅ 紹介料从医疗机构→旅行社→导游（合法流向）

**合同文件：**
- [ ] ✅ 使用标准合同模板（`contracts/` 目录）
- [ ] ✅ 合同包含必备条款（主体、性质、风险、隐私等）
- [ ] ✅ 合同符合日本法律要求

**宣传文案：**
- [ ] ✅ 使用合规表述（医疗旅行服务 vs 医疗介绍）
- [ ] ✅ 明确旅行社主体地位
- [ ] ✅ 不夸大医疗效果
- [ ] ✅ Footer保留法律信息

**导游培训：**
- [ ] ✅ 导游理解合规要求
- [ ] ✅ 导游掌握合规话术
- [ ] ✅ 导游签署佣金协议并确认禁止行为

---

### 十三、紧急情况处理

#### 13.1 如果客户质疑合法性

**标准回应：**
> "我们的业务完全合法合规：
> 1. 新岛交通是持牌旅行社（大阪府知事登録 第2-3115号）
> 2. 您签署的是医疗旅行服务合同，包含预约安排、翻译陪同等服务
> 3. 医疗服务由医疗机构提供，医疗费用您直接支付给医院
> 4. 您可以访问大阪府官网查询我们的资质真实性"

#### 13.2 如果医疗机构询问合法性

**标准回应：**
> "我们的合作模式完全合法：
> 1. 我们是持牌旅行社，为外国游客提供医疗旅行服务
> 2. 您提供的是自由诊疗（非保险诊疗），根据厚生劳动省見解，可以支付紹介料
> 3. 我们有标准的合作协议模板，明确法律依据
> 4. 如需确认，可咨询贵院的法务部门"

---

## 🔒 合规规范变更记录

| 日期 | 变更内容 | 原因 |
|------|---------|------|
| 2026-02-13 | 初始版本 | 建立医疗旅游业务合规框架 |

---

## 白标分销系统商务逻辑

### 完整业务闭环

```
1. 导游注册 → /guide-partner/register
   │  填写信息、KYC认证、管理员审核
   ↓
2. 订阅付费 → Stripe Subscription
   │  Growth ¥1,980/月 (佣金10%) 或 Partner ¥4,980/月 (佣金20%)
   │  Partner 另需入门费 ¥200,000
   ↓
3. 选品中心 → /guide-partner/product-center
   │  导游从 10 家合作机构中选择想推广的项目
   │  选择保存到 guide_selected_modules 表
   ↓
4. 白标页面生成 → /g/[slug]
   │  系统根据导游选品自动生成品牌页面
   │  导游品牌logo + 联系方式 + 选中的医院模块
   │  导航栏 = 选中模块 + AI健康筛查（强制）
   ↓
5. 客户下单 → /api/create-checkout-session
   │  客户通过导游白标页进入，cookie记录 guide_slug
   │  Stripe Checkout 支付（Live模式）
   │  订单绑定 referred_by_guide_slug
   ↓
6. 佣金结算 → Webhook → guide commission
   │  Stripe webhook 确认支付成功
   │  根据导游订阅等级计算佣金（10% 或 20%）
   │  佣金记录到 guide_commissions 表
   ↓
7. 合规底线
   ├─ 合同主体：新岛交通（持牌旅行社 第2-3115号）
   ├─ 诊疗类型：自由诊疗（非保险诊疗）
   ├─ 导游角色：医疗旅行顾问（非医疗中介）
   ├─ 资金流向：客户→新岛交通→导游（不得直接收费）
   └─ Footer 强制保留旅行社资质信息
```

### 三方关系

```
客户 ──(医疗旅行服务合同)──→ 新岛交通（持牌旅行社）
                                    │
                           (安排预约+旅行服务)
                                    │
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              10家医疗机构     导游（佣金合作）    Stripe（支付）
               (自由诊疗)      10%/20% 佣金      Live模式
```

### 白标页面数据流（导航栏渲染链路）

```
DB: page_modules (10个模块，含 component_key + display_config)
  ↓
DB: guide_selected_modules (导游选中的模块，is_enabled=true)
  ↓
Service: getGuideDistributionPage() → 查询并映射为 SelectedModuleWithDetails[]
  ↓
Layout: forEach + DETAIL_MODULES 白名单过滤 → push 进 navItems[]
  ↓
Component: DistributionNav 渲染导航（无额外过滤）
```

### 订阅等级对比

| 项目 | Growth | Partner |
|------|--------|---------|
| 月费 | ¥1,980 | ¥4,980 |
| 入门费 | 无 | ¥200,000 |
| 佣金比例 | 10% | 20% |
| Price ID (env) | STRIPE_WHITELABEL_PRICE_ID | STRIPE_PARTNER_MONTHLY_PRICE_ID |

---

## 🔒 白标页面设计规范 (Whitelabel Page Design Standards - MANDATORY)

**状态**: 🔒 **强制执行** (Mandatory)
**生效日期**: 2026-03-05

### 核心原则

白标页面必须保持统一的用户交互体验和视觉规范，避免多入口混乱和联系方式滥用。

---

### 一、联系入口唯一性原则

#### 1.1 唯一联系窗口

**规则**：在所有白标页面中，**悬浮窗口的"点我咨询"是唯一的联络窗口**。

**要求**：
- ✅ 页面右下角固定悬浮按钮（导游头像 + "点我咨询"）
- ✅ 点击后弹出导游联系信息（微信、LINE、WhatsApp等）
- ❌ 页面其他位置**禁止**直接显示联系方式（电话、邮箱、微信二维码等）
- ❌ 页面其他位置**禁止**添加额外的联系按钮或弹窗

#### 1.2 CTA 按钮规范

页面内的 CTA 按钮（如"立即预约""免费咨询"）应该：
- ✅ 跳转到支付/预约页面
- ✅ 或滚动到页面内联表单（锚点 `#consultation`）
- ❌ **不要**在 CTA 按钮处直接显示联系方式
- ❌ **不要**创建多个不同的联系入口

#### 1.3 设计原因

**唯一入口的优势**：
1. 用户体验一致：所有页面的联系方式都在右下角悬浮窗
2. 导游品牌强化：导游头像 + 专属联系方式形成个人品牌
3. 避免混乱：多入口会让用户困惑"该用哪个联系方式"
4. 数据追踪：统一入口便于追踪用户咨询行为

---

### 二、交通指南统一规范

#### 2.1 禁止显示联系方式

**规则**：交通指南（Access / 交通案内 / 地图）区域**禁止**显示任何联系方式。

**禁止内容**：
- ❌ 医院/诊所电话号码
- ❌ 邮箱地址
- ❌ 导游联系方式
- ❌ 在线咨询按钮（此区域专注于地理信息）

**允许内容**：
- ✅ 地图图片/嵌入式地图
- ✅ 地址文字（日文 + 中文/英文）
- ✅ 最近车站/交通方式说明
- ✅ 营业时间
- ✅ 停车信息

#### 2.2 统一格式要求

所有白标页面的交通指南区域必须遵循统一格式：

```typescript
// 交通指南标准结构
<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    {/* 标题 */}
    <div className="text-center mb-12">
      <span className="tag">交通案内</span>
      <h2>アクセス</h2>
    </div>

    {/* 地图 + 信息卡片 */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* 地图图片或嵌入式地图 */}
      <div className="map-container">
        <img src="..." alt="Map" />
      </div>

      {/* 交通信息 */}
      <div className="info-cards">
        <div className="card">
          <h3>住所</h3>
          <p>〒xxx-xxxx 東京都...</p>
        </div>
        <div className="card">
          <h3>最寄り駅</h3>
          <p>JR山手線「渋谷駅」徒歩5分</p>
        </div>
        <div className="card">
          <h3>営業時間</h3>
          <p>平日 9:00-18:00</p>
        </div>
        {/* ❌ 禁止添加电话、邮箱等联系方式卡片 */}
      </div>
    </div>
  </div>
</section>
```

#### 2.3 样式统一要求

| 设计元素 | 规范 |
|---------|------|
| 区域背景 | `bg-white` 或 `bg-[#f6f6f6]` （与页面整体色调一致） |
| 标签颜色 | 与主色调一致（如 `bg-[#0056b3]/10 text-[#0056b3]`） |
| 卡片样式 | 圆角 `rounded-xl`，阴影 `shadow-md`，内边距 `p-6` |
| 地图样式 | 圆角 `rounded-xl`，覆盖容器 `w-full h-full object-cover` |
| 图标颜色 | 与主色调一致 |

#### 2.4 多语言交通信息

交通指南的文字信息必须支持多语言（ja, zh-TW, zh-CN, en）：

```typescript
const accessT = {
  tag: { ja: 'アクセス', 'zh-TW': '交通指南', 'zh-CN': '交通指南', en: 'Access' },
  title: { ja: '交通案内', 'zh-TW': '如何前往', 'zh-CN': '如何前往', en: 'How to Get Here' },
  address: { ja: '〒xxx-xxxx 東京都...', 'zh-TW': '〒xxx-xxxx 東京都...', 'zh-CN': '〒xxx-xxxx 东京都...', en: '〒xxx-xxxx Tokyo...' },
  station: { ja: 'JR山手線「渋谷駅」徒歩5分', 'zh-TW': 'JR山手線「澀谷站」步行5分鐘', 'zh-CN': 'JR山手线「涩谷站」步行5分钟', en: '5 min walk from JR Shibuya Station' },
  // ... 其他字段
};
```

---

### 三、现有页面合规检查清单

#### 3.1 检查要点

在所有白标页面（`*Content.tsx` 组件）中检查：

**联系入口检查**：
- [ ] ✅ 右下角有唯一的悬浮"点我咨询"按钮
- [ ] ❌ 页面其他位置没有直接显示联系方式
- [ ] ❌ 页面其他位置没有额外的联系按钮/弹窗

**交通指南检查**：
- [ ] ✅ 交通指南区域存在且格式统一
- [ ] ❌ 交通指南区域没有显示电话、邮箱等联系方式
- [ ] ✅ 交通指南区域仅显示地址、车站、营业时间等地理信息
- [ ] ✅ 交通指南区域支持多语言

#### 3.2 白标页面文件合规状态

| 文件 | 状态 | 备注 |
|------|------|------|
| `app/hyogo-medical/HyogoMedicalContent.tsx` | ✅ **已修复** | 兵库医大 - 删除交通指南电话 (Commit 79f39ad) |
| `app/cancer-treatment/CancerTreatmentContent.tsx` | ✅ **已修复** | 大阪国际癌症中心 - 删除联系按钮组 (Commit 79f39ad) |
| `app/osaka-himak/OsakaHimakContent.tsx` | ✅ **已修复** | 大阪重粒子线中心 - 删除交通指南电话 (Commit f49a2cb) |
| `app/igtc/IGTCContent.tsx` | ✅ **已修复** | IGT クリニック - 删除交通指南电话 (Commit 4798629) |
| `app/sai-clinic/SaiClinicContent.tsx` | ✅ **已修复** | SAI CLINIC - 删除交通指南电话 (Commit 79f39ad) |
| `app/wclinic-mens/WClinicMensContent.tsx` | ✅ **已修复** | W CLINIC men's - 删除 2 处交通指南电话 (Commit 4798629) |
| `app/helene-clinic/HeleneClinicContent.tsx` | ✅ **已修复** | 表参道 HELENE - 删除交通指南电话 (Commit 79f39ad) |
| `app/ginza-phoenix/GinzaPhoenixContent.tsx` | ✅ **已修复** | 銀座鳳凰 - 删除交通指南电话 (Commit 4798629) |
| `app/cell-medicine/CellMedicineContent.tsx` | ✅ **合规** | 先端細胞医療 - 初始即合规，无需修复 ✓ |
| `app/ac-plus/ACPlusContent.tsx` | ✅ **合规** | AC セルクリニック - 初始即合规，无需修复 ✓ |
| `components/whitelabel-modules/TIMCContent.tsx` | ✅ **合规** | TIMC 健检 - 初始即合规，无需修复 ✓ |

**合规率：11 / 11（100%）** 🎉

---

### 四、新增白标页面时的检查清单

当添加新的医院/模块白标页面时，必须确认：

**联系入口**：
1. ✅ 页面通过 `WhiteLabelProvider` 获取导游信息
2. ✅ 右下角悬浮"点我咨询"按钮已实现（`DistributionLayout` 自动提供）
3. ❌ 页面内容区域**没有**额外的联系方式显示
4. ✅ CTA 按钮链接到支付页或锚点，**不是**联系入口

**交通指南**：
1. ✅ 交通指南区域遵循统一格式（地图 + 信息卡片）
2. ❌ 交通指南区域**没有**显示联系方式
3. ✅ 交通指南文字支持多语言（ja, zh-TW, zh-CN, en）
4. ✅ 样式与其他白标页面保持一致

---

### 五、⛔ 禁止操作

| 禁止行为 | 后果 |
|---------|------|
| 在页面内容区域直接显示电话、邮箱、二维码 | 破坏唯一入口原则，用户体验混乱 |
| 在交通指南区域添加联系方式 | 违反区域职责分离原则 |
| 创建多个联系按钮/弹窗 | 导航混乱，追踪困难 |
| 交通指南格式不统一 | 品牌形象不一致 |
| 交通指南缺少多语言支持 | 国际用户体验差 |

---

### 六、违规修复流程

如果发现现有白标页面违反上述规范：

1. **定位违规代码**：
   - 搜索 `<a href="tel:` 或 `<a href="mailto:` 找到联系方式链接
   - 搜索 `電話` `メール` `連絡` 找到联系方式文字
   - 检查交通指南区域是否有 `<Phone>` `<Mail>` 图标

2. **修复方案**：
   - 删除页面内容区域的联系方式显示
   - 确保交通指南仅显示地理信息
   - 验证右下角悬浮"点我咨询"按钮正常工作

3. **测试验证**：
   - 本地开发环境测试 `/g/test-guide/{moduleSlug}`
   - 确认悬浮按钮点击后显示导游联系方式
   - 确认页面其他位置无联系方式泄露

---

### 七、Hero 区域统一设计规范

#### 7.1 Hero容器结构标准

**规则**：所有白标页面的Hero区域必须遵循统一的容器布局，参考兵库医科大学（Hyogo Medical）的实现。

**标准结构**：
```tsx
<section className="relative min-h-[85vh] flex items-center overflow-hidden">
  {/* 背景图片 */}
  <div className="absolute inset-0">
    <img src="..." alt="..." className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-[主色]/75 via-[主色]/55 to-[主色]/30" />
  </div>

  {/* 文字内容容器 - 关键！*/}
  <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
    <div className="max-w-3xl">
      {/* hero内容：badge, 标题, 副标题, 描述, CTA等 */}
    </div>
  </div>
</section>
```

**关键设计要点**：

| 元素 | 规范 | 说明 |
|------|------|------|
| 外层容器 | `container mx-auto px-6 py-12 md:py-24` | container确保响应式宽度，相对定位以容纳z-index |
| 内层包裹 | `max-w-3xl` | **核心**：限制最大宽度实现左对齐，文字不占满全宽 |
| z-index | `relative z-10` | 确保文字在遮罩层之上 |
| 遮罩透明度 | `from-75 via-55 to-30` | 从左到右逐渐变透明，图片右侧更清晰 |
| 最小高度 | `min-h-[85vh]` | 确保hero区域足够高 |

#### 7.2 ❌ 错误示例（禁止）

```tsx
{/* ❌ 错误1：使用 max-w-6xl mx-auto 导致内容居中 */}
<div className="relative max-w-6xl mx-auto px-6 py-20">
  <div className="max-w-3xl">
    {/* 内容 */}
  </div>
</div>

{/* ❌ 错误2：没有 max-w-3xl 限制，文字占满全宽 */}
<div className="container mx-auto px-6 py-20">
  <h1>...</h1>  {/* 文字会占据整个容器宽度 */}
</div>

{/* ❌ 错误3：使用 text-center 导致文字居中 */}
<div className="container mx-auto px-6 text-center">
  {/* 破坏了左对齐原则 */}
</div>
```

#### 7.3 ✅ 正确示例（推荐）

```tsx
{/* ✅ 正确：兵库医科大学标准 */}
<div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
  <div className="max-w-3xl">
    <h1 className="text-4xl md:text-6xl font-bold text-white">
      {t(tr.heroTitle, lang)}
    </h1>
    <p className="text-xl text-gray-300">{t(tr.heroSubtitle, lang)}</p>
    {/* 其他内容 */}
  </div>
</div>
```

#### 7.4 文字对齐原则

**核心原则**：Hero文字靠左对齐，不居中，不占满全宽。

**实现方式**：
- ✅ 外层容器：`container mx-auto`（响应式，自动左右margin）
- ✅ 内层包裹：`max-w-3xl`（限制最大宽度，实现左对齐效果）
- ❌ 禁止使用：`text-center`、`items-center`、`justify-center`（会破坏左对齐）

**响应式行为**：
- 大屏幕（≥1280px）：`container` 宽度固定，`max-w-3xl` 内容靠左
- 中屏幕（768-1279px）：`container` 宽度自适应，`max-w-3xl` 内容靠左
- 小屏幕（<768px）：`px-6` 提供左右间距，内容自然左对齐

#### 7.5 遮罩层透明度标准

**推荐渐变**：`bg-gradient-to-r from-[主色]/75 via-[主色]/55 to-[主色]/30`

**设计理由**：
- 左侧75%遮罩：确保文字清晰可读
- 中间55%遮罩：过渡区域
- 右侧30%遮罩：让背景图片更清晰可见，提升视觉冲击力

**禁止过重遮罩**：
- ❌ `from-90 via-80 to-70`：遮罩太重，图片完全看不清
- ❌ 纯色遮罩 `bg-black/80`：无渐变效果，缺乏层次感

#### 7.6 新增白标页面时的Hero检查清单

当创建新的医院/诊所白标页面时，Hero区域必须确认：

1. ✅ 外层容器使用 `container mx-auto px-6 py-12 md:py-24 relative z-10`
2. ✅ 内层包裹使用 `max-w-3xl`
3. ❌ 没有使用 `text-center` 或 `items-center`
4. ✅ 遮罩渐变从左到右逐渐变透明（75→55→30）
5. ✅ 文字清晰可读（遮罩不能太轻）
6. ✅ 背景图片右侧清晰可见（遮罩不能太重）

#### 7.7 现有白标页面Hero合规状态

| 文件 | 状态 | 备注 |
|------|------|------|
| `app/hyogo-medical/HyogoMedicalContent.tsx` | ✅ **标准模板** | 参考实现（Line 1095-1116） |
| `app/igtc/IGTCContent.tsx` | ✅ **已修复** | 2026-03-06 统一为标准结构 |
| `app/cancer-treatment/CancerTreatmentContent.tsx` | 🔍 待检查 | |
| `app/helene-clinic/HeleneClinicContent.tsx` | ✅ **合规** | 已使用 max-w-2xl + container |
| `app/sai-clinic/SaiClinicContent.tsx` | 🔍 待检查 | |
| `app/wclinic-mens/WClinicMensContent.tsx` | 🔍 待检查 | |
| `app/ginza-phoenix/GinzaPhoenixContent.tsx` | 🔍 待检查 | |
| `app/cell-medicine/CellMedicineContent.tsx` | 🔍 待检查 | |
| `app/ac-plus/ACPlusContent.tsx` | 🔍 待检查 | |
| `app/osaka-himak/OsakaHimakContent.tsx` | 🔍 待检查 | |

---

## 🕷️ 白标页面官网爬取与内容提取规范

**文档版本**: v1.0
**最后更新**: 2026-03-06

### 背景

白标页面开发需要从合作医院官网提取信息（医院介绍、治疗项目、医师团队、价格、交通等），并转化为符合白标设计标准的页面。为确保信息完整、准确、合规，需要标准化的提取流程。

---

### 核心原则

1. **结构化抽取 > 自由总结**
   - 不让 AI 自由总结网站，而是使用强约束 Schema 逐项填空
   - 未提及的字段显示"未提及"，禁止 AI 编造内容

2. **分层处理 > 整站爬取**
   - 按页面类型（首页/治疗/医师/价格/交通）分别提取
   - 每个治疗项目单独提取（最容易遗漏）

3. **术语标准化**
   - 使用 `lib/config/medical-glossary.ts` 术语对照表
   - 确保四种语言（ja/zh-CN/zh-TW/en）专业术语一致

4. **合规性优先**
   - 提取阶段即删除所有联系方式（电话/邮箱/Line）
   - 交通指南仅保留地理信息

---

### 标准化提取流程

#### 📋 完整流程概览

```
Step 1: 官网结构扫描
  → 识别关键页面 URL（首页/治疗/医师/价格/交通/设施）

Step 2: 分层内容提取
  → 使用 WebFetch + 强约束 Prompt 逐页面提取
  → 治疗项目逐个提取（防止遗漏）

Step 3: 图片资源收集
  → 开发者工具手动提取高清图片 URL
  → 检查分辨率和 CORS

Step 4: 内容审核
  → 完整性检查（治疗项目 ≥ 3 个）
  → 合规性检查（删除所有联系方式）
  → 术语一致性检查

Step 5: 多语言翻译
  → 使用术语对照表进行 AI 翻译

Step 6: 生成白标组件
  → 创建 [HospitalName]Content.tsx
  → 遵守白标设计标准
```

---

### 技术实现

#### 1. WebFetch 工具（文字内容提取）

**典型用法**（以 cell-medicine 为例）：

```typescript
// 基础信息
WebFetch("https://cell-medicine.com/",
  "Company information, treatment details, certifications")

// 治疗详情
WebFetch("https://cell-medicine.com/about/",
  "Autologous cancer vaccine details, how it works, treatment process")

// 价格信息
WebFetch("https://cell-medicine.com/howto/price.php",
  "Treatment pricing, cost breakdown")

// 医院列表
WebFetch("https://cell-medicine.com/hospitals",
  "List of hospitals offering treatment")
```

**关键点**：
- 分页面提取，不要一次性抓取整站
- Prompt 要具体明确要提取的字段
- 附带术语对照表确保翻译准确

#### 2. 手动图片提取（静态资源）

**方法**：浏览器开发者工具（F12）→ Network 面板 → 筛选 Img

**示例**（W CLINIC men's）：
```
Hero: https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/material02/img/top/mv01b_pc.png
医师: https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/concept/dr_uemura01.png
地图: https://mens.wclinic-osaka.jp/wp-content/themes/mens_pc/img/access_map02.jpg
```

**质量要求**：
- 分辨率 ≥ 1200px（Retina 屏幕适配）
- 检查 CORS 策略（测试 `/_next/image` 代理）
- 准备备用图片方案

#### 3. 强约束型 Prompt 模板

**不推荐**（容易遗漏）：
```
"总结这个医院网站的治疗项目"
```

**推荐**（结构化填空）：
```
请严格按以下 JSON 结构提取信息，未提及的字段填 null：

{
  "treatment_name_ja": "",
  "indications": "",
  "mechanism": "",
  "treatment_process": ["Step 1", "Step 2", ...],
  "expected_results": "",
  "side_effects": "",
  "contraindications": "",
  "duration": "",
  "price_range": ""
}

【医疗术语对照表】
- 幹細胞 → 简中:干细胞 | 繁中:幹細胞 | EN:Stem Cell
- 自家がんワクチン → 简中:自体癌症疫苗 | ...

⚠️ 删除所有电话、邮箱、Line ID
```

---

### 标准化文件资源

| 文件 | 路径 | 用途 |
|------|------|------|
| 提取模板 | `templates/hospital-extraction-template.md` | 完整提取流程指南 |
| 术语对照表 | `lib/config/medical-glossary.ts` | 医疗术语标准翻译 |

**使用方法**：
1. 开发新白标页面前，阅读 `hospital-extraction-template.md`
2. WebFetch 时附带 `generateGlossaryPrompt()` 输出的术语表
3. 翻译时使用 `MEDICAL_GLOSSARY` 确保术语一致

---

### 质量标准

一个合格的白标页面应达到：

- ✅ 内容完整性 ≥ 90%（相比官网）
- ✅ 医疗术语准确率 = 100%
- ✅ 合规性（无联系方式）= 100%
- ✅ 图片加载成功率 ≥ 95%
- ✅ 多语言一致性 ≥ 98%

---

### 当前限制与未来改进

**当前限制**：
1. 无自动化爬虫脚本 - 每个白标页面手动开发
2. 图片直接引用官网 URL - 未下载到本地
3. 无定期更新机制 - 官网内容更新需手动同步

**未来改进方向**（按优先级）：

#### 阶段 2：半自动化提取（中期）
- [ ] 创建 `scripts/extract-hospital.ts` 脚本
- [ ] 自动扫描 sitemap 识别页面类型
- [ ] 批量调用 WebFetch 生成结构化 JSON
- [ ] 人工审核后生成组件代码

#### 阶段 3：数据与代码分离（长期）
- [ ] 白标内容存储为 `data/hospitals/[slug].json`
- [ ] 组件仅负责渲染 `render(json)`
- [ ] 支持 CMS 管理和内容更新
- [ ] 医院官网变更时可快速同步

**不建议大规模重构**：
当前 11 个白标页面运行稳定，大规模重构（如全部改为 JSON 驱动）成本高、风险大。建议新增页面时采用新流程，旧页面保持现状。

---

## 🔒 官方域名与白标域名隔离规范 (Domain Isolation - MANDATORY)

**状态**: 🔒 **强制执行** (Mandatory)
**生效日期**: 2026-03-03

### 核心原则

**niijima-koutsu.jp（官方域名）绝不承载白标内容，bespoketrip.jp（白标域名）专用于导游白标页面。**

### 双域名架构

| 域名 | 用途 | 白标模式 |
|------|------|---------|
| `niijima-koutsu.jp` | 新岛交通旅行社官方销售页面 | ❌ 永远不进入 |
| `bespoketrip.jp` | 导游白标分销页面（含子域名） | ✅ 始终进入 |

### 白标模式判断机制

白标模式**仅通过 middleware 设置的 HTTP 请求头判断**，不读取 Cookie：

```
middleware.ts 设置 x-whitelabel-mode + x-whitelabel-slug 头
  → getWhiteLabelConfig() 只读请求头（不读 Cookie）
  → WhiteLabelProvider 注入 isWhiteLabelMode
  → 所有组件通过 useWhiteLabel() 获取状态
```

**⚠️ `getWhiteLabelConfig()` 禁止直接读取 `wl_guide` Cookie**
Cookie 仅供 API 路由（`create-checkout-session`、`order-lookup`、`whitelabel/track`）用于导游佣金归属追踪。

### middleware 路由规则（生产环境）

| 请求 | 处理 |
|------|------|
| `yuan.bespoketrip.jp/*` | 设置 Cookie + 请求头 → 白标模式 |
| `bespoketrip.jp/*`（有 Cookie） | 设置请求头 → 白标模式 |
| `niijima-koutsu.jp/g/[slug]/*` | **重定向到 `[slug].bespoketrip.jp/g/[slug]/*`** |
| `niijima-koutsu.jp/p/[slug]` | **重定向到 `[slug].bespoketrip.jp`** |
| `niijima-koutsu.jp/*`（其他） | 不设置请求头 → 官方模式 |

### Cookie 归因窗口

- **Cookie 名**: `wl_guide`
- **有效期**: 7 天（导游引流归因窗口）
- **用途**: 仅用于 API 层的订单归属，不影响 UI 层白标模式判断
- **设置时机**: 白标域名访问时由 middleware 设置

### 白标域名上的裸模块页面重定向（middleware 步骤 2.5）

白标域名（bespoketrip.jp）上的所有模块页面必须通过 `/g/{slug}/` 路由访问，以获得白标 layout（导航栏、悬浮联系、页脚）。

**middleware 自动处理：**

| 白标域名上的请求 | 自动行为 |
|----------------|---------|
| `/hyogo-medical` | 重定向到 `/g/{slug}/hyogo-medical` |
| `/hyogo-medical/initial-consultation` | 补充 `?guide={slug}` 参数 |
| `/cancer-treatment` | 重定向到 `/g/{slug}/cancer-treatment` |
| 其他模块页面 | 同上规则 |

slug 来源优先级：子域名 > `wl_guide` Cookie

**受影响的模块路径** (`WHITELABEL_MODULE_PATHS`)：
`hyogo-medical`, `cancer-treatment`, `medical-packages`, `sai-clinic`, `wclinic-mens`, `helene-clinic`, `ginza-phoenix`, `cell-medicine`, `ac-plus`, `igtc`

### Checkout 子页面返回链接规范

所有 checkout 子页面（如 `initial-consultation`、`remote-consultation`、`treatment`）的返回链接必须是白标感知的：

```typescript
// 读取 middleware 补充的 ?guide= 参数
const searchParams = useSearchParams();
const guideSlugParam = searchParams.get('guide');
const guideSlug = guideSlugParam && isValidSlug(guideSlugParam) ? guideSlugParam : null;
const backHref = guideSlug ? `/g/${guideSlug}/hyogo-medical` : '/hyogo-medical';

// 使用 backHref 而非硬编码路径
<Link href={backHref}>返回</Link>
```

**内容组件的 CTA 链接（两种模式）：**

模式 A — **guideSlug 跳转**（有独立 checkout 子页面的模块）：
- `HyogoMedicalContent`、`OICIContent`、`IGTCContent`、`TIMCContent`：接收 `guideSlug` prop，CTA 链接附加 `?guide={slug}`
- 这些模块有独立的 `initial-consultation`/`remote-consultation`/`treatment` 子页面

模式 B — **锚点滚动**（页内内联表单的模块）：
- `HeleneClinicContent`、`WClinicMensContent`、`GinzaPhoenixContent`、`CellMedicineContent`、`ACPlusContent`、`SaiClinicContent`
- 白标模式下 CTA 使用页内锚点 `#consultation`，不跳转到 checkout 子页面

**⚠️ 新增模块时的关键检查：** 如果 CTA 链接指向独立 checkout 子页面，必须：
1. 内容组件接收 `guideSlug` prop 并在 CTA 链接中附加 `?guide={guideSlug}`
2. checkout 子页面实际存在（不要写死链接到不存在的页面）
3. checkout 子页面的返回链接使用 `?guide=` 参数构建白标感知路径
4. `lib/config/medical-packages.ts` 中注册对应的 packageSlug

### 新增模块时的检查清单

1. ✅ 将模块 URL slug 添加到 middleware 的 `WHITELABEL_MODULE_PATHS`
2. ✅ 内容组件接收 `guideSlug` prop（如果 CTA 链接跳转到独立 checkout 页面）
3. ✅ `app/g/[slug]/[moduleSlug]/page.tsx` 传入 `guideSlug={slug}`
4. ✅ Checkout 子页面读取 `?guide=` 构建白标感知的返回链接
5. ✅ 三层白名单对齐（layout.tsx, page.tsx, [moduleSlug]/page.tsx）

### ⛔ 禁止操作

- ❌ 不要在 `getWhiteLabelConfig()` 中读取 Cookie 判断白标模式
- ❌ 不要在官方域名上渲染 `/g/[slug]` 白标页面（必须重定向）
- ❌ 不要在支付页面显示"返回导游主页"等暴露白标概念的文案
- ❌ 不要让 Cookie 残留影响官方域名的 UI 显示
- ❌ 不要在 checkout 子页面硬编码返回链接（必须使用 `?guide=` 参数构建）
- ❌ 不要在白标域名上直接渲染裸模块页面（必须通过 `/g/{slug}/` 路由）

---

## 关键文件索引

| 功能 | 文件 |
|------|------|
| 首页 | `components/LandingPage.tsx` |
| 医疗套餐配置 | `lib/config/medical-packages.ts` |
| 服务商配置 | `lib/config/providers.ts` |
| TIMC 报价 | `components/TIMCQuoteModal.tsx` |
| 价格计算 | `services/timcQuoteCalculator.ts` |
| 翻译 | `translations.ts` |
| 语言Hook | `hooks/useLanguage.ts` |
| 语言切换 | `components/LanguageSwitcher.tsx` |
| 字体设置 | `components/LocaleFontSetter.tsx` |
| 公共布局 | `components/PublicLayout.tsx` |
| 结账页布局 | `components/CheckoutLayout.tsx` (支付页面必须使用) |
| 白标配置 | `lib/whitelabel-config.ts` |
| 白标模块注册 | `components/whitelabel-modules/registry.ts` |
| 白标类型 | `components/whitelabel-modules/types.ts` |
| API Schema | `lib/validations/api-schemas.ts` |
| API 错误处理 | `lib/utils/api-errors.ts` |
| Supabase Client | `lib/supabase/client.ts` (客户端) / `server.ts` (服务端) |
| Stripe Client | `lib/stripe-client.ts` |
| 邮件服务 | `lib/email.ts` |

---

## 运维脚本 (scripts/)

| 脚本 | 用途 |
|------|------|
| `fix-stripe-prices.js` | 修复 cancer/hyogo 咨询套餐 Stripe Price ID |
| `fix-all-stripe-prices.js` | 修复 6个 TIMC 健检套餐 Stripe Price ID |
| `check-all-prices.js` | 验证所有活跃套餐的 Stripe Price ID 有效性 |
| `check-packages.js` | 检查套餐数据库记录 |

---

## 开发注意事项

### Windows 环境
- Bash 工具中 `cd C:\path` 不生效，需用 `powershell.exe -NoProfile -Command "Set-Location '...'; command"`
- PowerShell 中 `&&` 链式命令与 here-string 不兼容，需分开执行
- commit message 用单引号，避免 backtick-n 换行

### Stripe 注意事项
- Price ID 必须与当前 `STRIPE_SECRET_KEY` 对应的 Stripe 账户匹配
- 切换 Stripe 账户后需重新创建 Product + Price 并更新数据库
- 验证命令: `node scripts/check-all-prices.js`

### 环境变量要求

#### 本地开发 (.env.local)
开发环境**必须**包含以下环境变量，否则白标页面会返回 500 错误：
```bash
# Supabase (必需 - 白标系统依赖)
NEXT_PUBLIC_SUPABASE_URL="https://fcpcjfqxxtxlbtvbjduk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."  # ⚠️ 关键：缺少此项会导致 /g/[slug] 路由 500 错误
```

**常见错误**：
```
⨯ Error: Missing Supabase environment variables
    at getServiceClient (lib\services\whitelabel.ts:18:11)
```
**原因**：`.env.local` 缺少 `SUPABASE_SERVICE_ROLE_KEY`
**解决**：从 `.env.production.local` 复制该变量到 `.env.local`

#### Vercel 生产环境
在 Vercel 项目 Settings → Environment Variables 中必须配置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Production, Preview, Development 全选)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- 其他变量见 `.env.production.local`

**症状**：子域名 `{slug}.bespoketrip.jp` 返回 `ERR_CONNECTION_CLOSED` 或 500 错误
**排查**：检查 Vercel 环境变量是否完整

### 预提交钩子 (Husky + lint-staged)
- lint-staged 对整个暂存文件运行 `eslint --fix` + `prettier --write`
- 即使只改一行，也会检查文件中所有预存 lint 错误
- 如果产生"empty commit"，说明处理后文件与 HEAD 完全一致

---

## 调试与测试脚本

### 白标系统集成测试

#### 完整集成测试
```bash
node scripts/test-complete-integration.js
```
**用途**: 测试模块从数据库 → 选品中心 → 白标页面的完整链路（7个检查点）  
**输出**: 每个步骤的通过/失败状态，定位问题所在层级  
**适用场景**: 新增模块后验证是否完全打通

#### 检查导游选中的模块
```bash
node scripts/check-yuan-modules.js
```
**用途**: 查看特定导游（yuan）选中了哪些模块  
**输出**: 模块列表（slug, component_key, is_enabled, sort_order）  
**适用场景**: 验证导游在选品中心的选择是否正确保存

#### 检查模块分类
```bash
node scripts/check-categories.js
```
**用途**: 查看所有活跃模块按分类（category）分组的情况  
**输出**: 按 BEAUTY/MEDICAL 等分类分组的模块表  
**适用场景**: 了解数据库中模块的分类结构

#### 调试产品卡片过滤
```bash
node scripts/debug-product-cards.js
```
**用途**: 模拟白标首页的 productCards 过滤逻辑  
**输出**: 每个模块是否通过过滤条件（immersive 模板、DETAIL_MODULES 白名单等）  
**适用场景**: 排查为什么某个模块在白标页面不显示

#### 验证近畿大学病院集成
```bash
node scripts/verify-kindai-integration.js
# 或使用最终检查脚本
node scripts/final-check.js
```
**用途**: 专门验证 kindai-hospital 模块的完整配置  
**输出**: 数据库、分类、路由、导游选择等各项检查结果  
**适用场景**: kindai-hospital 特定问题排查

### Stripe 产品创建

#### 创建近畿大学病院 Stripe 产品
```bash
node scripts/create-kindai-hospital-stripe-prices.js
```
**用途**: 为近畿大学病院创建 Stripe Products & Prices  
**输出**: 生成的 product_id 和 price_id，自动更新数据库  
**配置**: 2个咨询服务包（前期咨询 ¥221,000、远程会诊 ¥243,000）

#### 创建大阪重粒子线中心 Stripe 产品
```bash
node scripts/create-osaka-himak-stripe-prices.js
```
**用途**: 为大阪重粒子线中心创建 Stripe Products & Prices  
**输出**: 同上  
**配置**: 2个咨询服务包（前期咨询 ¥221,000、远程会诊 ¥243,000）

### 配置检查

#### 检查近畿大学病院配置
```bash
node scripts/check-kindai-config.js
```
**用途**: 查看 kindai-hospital 模块在 page_modules 表的完整配置  
**输出**: display_config 详细内容（template, colorTheme, stats, sidebar 等）  
**适用场景**: 验证数据库配置是否正确

#### 检查数据库表结构
```bash
node scripts/check-table-schema.js
```
**用途**: 查看 page_modules 表的所有字段  
**输出**: 字段列表 + 示例记录（kindai-hospital）的完整数据  
**适用场景**: 了解表结构，排查字段缺失问题

### 脚本创建历史记录

| 脚本文件 | 创建日期 | 用途 | 状态 |
|---------|---------|------|------|
| check-kindai-config.js | 2026-03-07 | 检查近畿配置 | ✅ 活跃 |
| check-yuan-modules.js | 2026-03-07 | 检查导游选择 | ✅ 活跃 |
| create-kindai-hospital-stripe-prices.js | 2026-03-07 | 创建 Stripe 产品 | ✅ 活跃 |
| create-osaka-himak-stripe-prices.js | 2026-03-07 | 创建 Stripe 产品 | ✅ 活跃 |
| check-categories.js | 2026-03-07 | 检查模块分类 | ✅ 活跃 |
| check-table-schema.js | 2026-03-07 | 查看表结构 | ✅ 活跃 |
| debug-product-cards.js | 2026-03-07 | 调试过滤逻辑 | ✅ 活跃 |
| verify-kindai-integration.js | 2026-03-07 | 验证集成（旧版） | 📦 归档 |
| final-check.js | 2026-03-07 | 最终检查 | ✅ 活跃 |
| test-complete-integration.js | 2026-03-07 | 完整集成测试 | ✅ 推荐使用 |

**推荐工作流**:
1. 新增模块后，先运行 `test-complete-integration.js` 验证完整链路
2. 如有问题，根据失败的步骤运行对应的专项脚本深入排查
3. Stripe 产品创建在数据库配置完成后执行

---

# 4 AI 联合会诊系统架构 (AEMC - AI Expert Medical Consultation)

> **警告：此系统涉及医疗健康，所有修改必须经过严格审计。**
> **红线：绝不直接给药、绝不替代医生下最终诊断、绝不给出确定性治疗结论。**
> **定位：AI 病情整理 + 风险分诊 + 日本医院转诊推荐引擎。**

## AEMC 系统定位

本系统做的是「筛查与导流」，不是替代医生诊断：
- 病情信息结构化整理
- 风险分层（低/中/高/急）
- 建议就诊科室
- 建议检查方向
- 推荐匹配的日本医院（基于 160 家合作医院数据库）
- 判断是否需要紧急人工介入

对外措辞：「建议检查路径」「建议就诊路径」「可能的治疗方向供医生确认」，
绝不使用「治疗方案」「处方」「确诊」等字眼。

## 旗舰模型分工

| 角色 | 模型 | 职责 | 核心原则 |
|------|------|------|---------|
| **AI-1 病历抽取官** | GPT-4o | 将问卷/自述/OCR 转为结构化 JSON | 宁可漏，不可编。不给诊断结论 |
| **AI-2 分诊判断官** | Gemini 1.5 Pro | 风险分层 + 科室推荐 + 检查建议 | Rule out worst first |
| **AI-3 反方挑战官** | Grok-3 | 找漏诊风险、质疑过于乐观的判断 | 只挑错，不做主结论 |
| **AI-4 质控仲裁官** | Claude Sonnet | 全链路一致性审查 + 最终裁决 | 有疑问就升级人工 |
| **医院匹配** | DeepSeek V3 + RAG | 标签匹配 + 向量检索 | 不做医学判断 |

## Pipeline 流程

```
用户输入（问卷答案 + Body Map + 自述文字）
        ↓
[Layer 0] Input Normalizer（输入标准化）
  - 语言识别（中/英/日）
  - 医学术语归一化
  - 生成统一 case_packet
        ↓
[AI-1] GPT-4o = 病历抽取
  - 输出 structured_case.json
  - 标记红旗症状、unknown、inferred
        ↓
[AI-2] Gemini + [AI-3] Grok（并行执行）
  - AI-2: triage_assessment.json（分诊）
  - AI-3: challenge_review.json（挑战）
        ↓
[AI-4] Claude = 质控仲裁
  - 输入: structured_case + triage + challenge
  - 输出: adjudicated_assessment.json
        ↓
[Hospital Matching] DeepSeek V3 + RAG
  - 规则过滤 → 向量召回 → 模型重排
  - 输出: hospital_recommendation.json
        ↓
[Deterministic Safety Gate] 硬规则闸门（纯代码，不是 AI）
  - 急症关键词强制升级
  - 高危人群强制升级
  - 模型冲突强制升级
  - 低置信度强制升级
        ↓
结果输出
  - A类：低风险 → 自动展示
  - B类：中风险 → 展示 + 补问提示
  - C类：高风险 → 不展示，进人工池
  - D类：疑似急症 → 紧急提示立即就医
```

## 5 个核心数据对象

### 1. case_packet（原始输入标准包）
所有 AI 的唯一入口，避免各模型各看各的文本。
```typescript
interface CasePacket {
  case_id: string;                    // UUID
  source_type: ('questionnaire' | 'free_text' | 'medical_report' | 'ocr')[];
  user_type: 'authenticated' | 'whitelabel';
  language: string;                   // zh-CN / en / ja
  demographics: {
    age?: number;
    sex?: 'male' | 'female';
    country?: string;
  };
  body_regions: string[];             // from BodyMapSelector
  selected_symptoms: SelectedSymptom[];
  questionnaire_answers: Record<string, string | string[]>;
  uploaded_report_text?: string;
  timeline: { time: string; event: string }[];
  raw_text_bundle: { source: string; text: string }[];
  metadata: {
    session_id?: string;
    screening_id: string;
    created_at: string;
  };
}
```

### 2. structured_case（AI-1 输出）
后续所有模型基于此对象工作，不允许随意改病史。
```typescript
interface StructuredCase {
  case_id: string;
  chief_complaint: string;
  present_illness: {
    symptoms: {
      name: string;
      duration: string;
      severity: string;
      certainty: 'explicit' | 'inferred' | 'unknown';
      evidence: string;             // 原文证据片段
    }[];
    aggravating_factors: string[];
    relieving_factors: string[];
    associated_symptoms: string[];
  };
  past_history: string[];
  medication_history: string[];
  allergy_history: string[];
  known_diagnoses: string[];
  exam_findings: string[];
  red_flags: string[];              // 红旗症状列表
  missing_critical_info: string[];  // 缺失的关键信息
  inferred_items: { item: string; reason: string }[];
  unknown_items: string[];
}
```

### 3. triage_assessment（AI-2 输出）
```typescript
interface TriageAssessment {
  case_id: string;
  urgency_level: 'low' | 'medium' | 'high' | 'emergency';
  recommended_departments: string[];
  differential_directions: {
    name: string;
    likelihood: string;
    reason: string;
  }[];
  suggested_tests: string[];
  needs_emergency_evaluation: boolean;
  doctor_review_required: boolean;
  confidence: number;               // 0-1
  reasoning_summary: string;
  do_not_miss_conditions: string[]; // 必须排除的危险情况
  missing_information_impact: string[];
}
```

### 4. challenge_review（AI-3 输出）
```typescript
interface ChallengeReview {
  case_id: string;
  main_concerns: string[];
  alternative_risks: {
    name: string;
    reason: string;
  }[];
  under_triage_risk: boolean;       // 是否存在分诊不足风险
  over_triage_risk: boolean;
  recommended_escalation: boolean;
  missing_high_impact_data: string[];
  confidence: number;               // 0-1
}
```

### 5. adjudicated_assessment（AI-4 输出）
```typescript
interface AdjudicatedAssessment {
  case_id: string;
  final_risk_level: 'low' | 'medium' | 'high' | 'emergency';
  final_departments: string[];
  final_summary: string;            // 中文
  critical_reasons: string[];
  must_ask_followups: string[];     // 应追问的问题
  safe_to_auto_display: boolean;
  escalate_to_human: boolean;
  escalation_reason: string;
  confidence: number;               // 0-1
  conflict_notes: string[];         // AI-2 与 AI-3 之间的分歧记录
}
```

## 硬规则安全闸门（Deterministic Safety Gate）

**此闸门是纯代码逻辑，不依赖任何 AI 模型。命中任一条件必须人工介入。**

### 急症类红旗
- 胸痛/胸闷 + 出汗/放射痛/呼吸困难
- 突发单侧无力/言语障碍/视力异常
- 呕血/黑便/大量便血
- 持续高热 + 意识异常
- 严重腹痛 + 呕吐/便血/冷汗
- 呼吸困难/紫绀/血氧异常
- 癫痫样发作/意识模糊/昏厥

### 肿瘤类红旗
- 不明原因体重明显下降
- 持续出血
- 明确肿块增大
- 影像提示肿瘤/占位/转移
- 病理提示恶性可能

### 高危人群
- 儿童（<14岁）
- 孕妇
- 高龄（>75岁）
- 肿瘤术后/化疗中
- 器官移植后
- 免疫抑制状态
- 严重心脑血管病史

### 模型层触发条件
- AI-2 与 AI-3 关键结论冲突（科室/风险等级不一致）
- AI-4 confidence < 0.7
- 缺失关键病史过多（missing_critical_info > 3 项）
- adjudicated_assessment.escalate_to_human === true

### 输出分类
- **A类（自动展示）**：低风险 + 无红旗 + 模型一致 + 信息完整
- **B类（展示+补问）**：中风险 + 无强制升级项 + 存在缺失信息
- **C类（人工审核）**：高风险/有红旗/模型冲突/低置信度
- **D类（紧急提示）**：疑似急症，直接提示立即就医

## 数据库新增表

### screening_ai_runs（每次 AI 调用记录）
```sql
CREATE TABLE screening_ai_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL REFERENCES health_screenings(id),
  model_vendor TEXT NOT NULL,       -- 'openai' | 'google' | 'xai' | 'anthropic' | 'deepseek'
  model_name TEXT NOT NULL,         -- 'gpt-4o' | 'gemini-1.5-pro' | 'grok-3' | 'claude-sonnet'
  role TEXT NOT NULL,               -- 'extractor' | 'triage' | 'challenger' | 'adjudicator' | 'hospital_matcher'
  prompt_version TEXT NOT NULL,     -- 语义版本号
  input_hash TEXT,                  -- SHA256
  output_json JSONB NOT NULL,
  latency_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  error TEXT,                       -- 失败时记录错误信息
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_runs_screening ON screening_ai_runs(screening_id);
CREATE INDEX idx_ai_runs_role ON screening_ai_runs(role);
```

### screening_adjudications（最终仲裁结果）
```sql
CREATE TABLE screening_adjudications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL REFERENCES health_screenings(id),
  final_risk_level TEXT NOT NULL,
  final_departments TEXT[] NOT NULL,
  safe_to_auto_display BOOLEAN NOT NULL DEFAULT false,
  escalate_to_human BOOLEAN NOT NULL DEFAULT true,
  escalation_reason TEXT,
  confidence DECIMAL(3,2),
  safety_gate_result TEXT NOT NULL,  -- 'A' | 'B' | 'C' | 'D'
  safety_gate_triggers TEXT[],       -- 触发的具体规则
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_adjudications_screening ON screening_adjudications(screening_id);
CREATE INDEX idx_adjudications_risk ON screening_adjudications(final_risk_level);
```

### screening_hospital_matches（医院推荐记录）
```sql
CREATE TABLE screening_hospital_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL REFERENCES health_screenings(id),
  hospital_id TEXT NOT NULL,
  department TEXT NOT NULL,
  match_score DECIMAL(3,2),
  reasons_json JSONB,
  ranked_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_hospital_matches_screening ON screening_hospital_matches(screening_id);
```

### screening_outcomes（真实就诊结果回流 — 未来核心壁垒）
```sql
CREATE TABLE screening_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screening_id UUID NOT NULL REFERENCES health_screenings(id),
  contacted_hospital_id TEXT,
  actual_department TEXT,
  doctor_feedback TEXT,
  final_clinical_direction TEXT,
  was_admitted BOOLEAN,
  surgery_performed BOOLEAN,
  urgency_confirmed BOOLEAN,
  outcome_label TEXT,               -- 'accurate' | 'under_triage' | 'over_triage' | 'missed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_outcomes_screening ON screening_outcomes(screening_id);
CREATE INDEX idx_outcomes_label ON screening_outcomes(outcome_label);
```

## 实施阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 硬规则安全闸门 + 红旗词典（纯代码） | ✅ 已完成 (26条规则, 三轮审计) |
| Phase 1 | 重构 analyze API 为 pipeline + 4 AI 调用 | ✅ 已完成 (AEMC_ENABLED 开关) |
| Phase 2 | 新增数据库表 (screening_ai_runs 等) | 待实施 |
| Phase 3 | 补问系统（信息不足时自动追问） | 待实施 |
| Phase 4 | 医院能力知识库结构化 + RAG | 待实施 |
| Phase 5 | 加入 Grok 挑战官 (V2) | 待实施 |
| Phase 6 | screening_outcomes 闭环 + 人工工作台 | 待实施 |

## 成本预算（全旗舰方案）

单次会诊 API 成本：~$0.174
500 会员 × 4 次/月 = 2,000 次/月
- 100% 利用率：$348/月 (~¥52,200)
- 50% 利用率：$174/月 (~¥26,100)
- 30% 利用率：$104/月 (~¥15,600)

## 文件结构规划

```
services/
├── aemc/                           # AI Expert Medical Consultation
│   ├── index.ts                    # Pipeline 主入口
│   ├── types.ts                    # 所有 TypeScript 接口定义
│   ├── safety-gate.ts              # 硬规则安全闸门（Phase 0）
│   ├── red-flags.ts                # 红旗词典（Phase 0）
│   ├── input-normalizer.ts         # 输入标准化
│   ├── extractor.ts                # AI-1 GPT-4o 病历抽取
│   ├── triage.ts                   # AI-2 Gemini 分诊判断
│   ├── challenger.ts               # AI-3 Grok 反方挑战
│   ├── adjudicator.ts              # AI-4 Claude 质控仲裁
│   ├── hospital-matcher.ts         # DeepSeek + RAG 医院匹配
│   └── prompts/                    # System Prompt 版本管理
│       ├── extractor-v1.ts
│       ├── triage-v1.ts
│       ├── challenger-v1.ts
│       ├── adjudicator-v1.ts
│       └── hospital-matcher-v1.ts
```
