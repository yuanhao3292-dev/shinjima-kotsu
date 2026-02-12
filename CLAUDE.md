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

#### 白标可用模块

| 模块 | 文件 | 说明 |
|------|------|------|
| 医疗健检 | `HealthScreeningModule.tsx` | TIMC 健检套餐 |
| 医疗套餐 | `MedicalPackagesModule.tsx` | 全部医疗套餐 |
| 医疗旅游 | `MedicalTourismModule.tsx` | 医疗旅游介绍 |
| 癌症治疗 | `CancerTreatmentModule.tsx` | 癌症患者赴日 |
| 兵库医大 | `HyogoMedicalModule.tsx` | 兵库医大病院 |
| 高尔夫 | `GolfModule.tsx` | 高尔夫预约 |
| 车辆租赁 | `VehiclesModule.tsx` | 包车服务 |

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

### 预提交钩子 (Husky + lint-staged)
- lint-staged 对整个暂存文件运行 `eslint --fix` + `prettier --write`
- 即使只改一行，也会检查文件中所有预存 lint 错误
- 如果产生"empty commit"，说明处理后文件与 HEAD 完全一致
