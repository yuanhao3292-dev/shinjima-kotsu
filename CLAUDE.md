# 项目标识

**项目名称：** 新岛交通官网 (shinjima-kotsu)
**生产域名：** https://www.niijima-koutsu.jp
**技术栈：** Next.js 16 + TypeScript + Tailwind CSS + Supabase

> ⚠️ **注意：这不是 linkquoteai.com 项目！**
> linkquoteai.com 的代码在 `/repos/niijima-b2b-quote-engine`

---

## 部署命令

```bash
# 部署到生产环境 (niijima-koutsu.jp)
vercel --prod
```

---

## 项目功能

- 首页 Landing Page（医疗、商务、高尔夫入口）
- TIMC 医疗健检套餐预约
- B2B 报价单生成（TIMC Quote Modal）
- 会员系统（登录、注册）
- 订单管理后台

---

## 关键文件

| 功能 | 文件 |
|------|------|
| 首页 | `components/LandingPage.tsx` |
| 医疗套餐 | `app/medical-packages/` |
| TIMC 报价 | `components/TIMCQuoteModal.tsx` |
| 翻译 | `translations.ts` |
| 价格计算 | `services/timcQuoteCalculator.ts` |
| 语言切换 | `components/LanguageSwitcher.tsx` |
| 字体设置 | `components/LocaleFontSetter.tsx` |
| 公共布局 | `components/PublicLayout.tsx` |

---

## 多语言系统 (i18n)

**支持语言：** ja, zh-TW, zh-CN, en
**实现方式：** Cookie-based (`NEXT_LOCALE`)，无 URL 路由
**翻译文件：** `translations.ts`（内联翻译）

### 语言读取逻辑

组件中需要从 cookie 读取当前语言时，必须在 `useEffect` 中读取：

```typescript
useEffect(() => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
      setCurrentLang(value as Language);
      return;
    }
  }
  // 如果没有 cookie，根据浏览器语言判断
  const browserLang = navigator.language;
  if (browserLang.startsWith('ja')) setCurrentLang('ja');
  else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
  else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
  else if (browserLang.startsWith('en')) setCurrentLang('en');
}, []);
```

**历史 Bug：** `LandingPage.tsx` 曾硬编码 `useState<Language>('zh-TW')`，永远不读 cookie，导致无论选什么语言都显示繁体中文。

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

### 三个关键踩坑点

#### 1. Tailwind v4 优先级覆盖 ⚠️⚠️

**问题：** Tailwind v4 (`@import "tailwindcss"`) 的 utility classes 优先级高于普通 CSS。`PublicLayout.tsx` 的 `font-sans` class 会覆盖 `globals.css` 中的 locale 字体规则。

**解决：** 必须使用 `!important` + 同时 target `.font-sans` 和 `.font-serif` class：

```css
/* ✅ 正确 - 使用 !important 覆盖 Tailwind utilities */
[data-locale="zh-CN"] body,
[data-locale="zh-CN"] .font-sans {
  font-family: 'PingFang SC', 'Microsoft YaHei', ... sans-serif !important;
}
[data-locale="zh-CN"] h1,
[data-locale="zh-CN"] .serif,
[data-locale="zh-CN"] .font-serif {
  font-family: 'LXGW WenKai', ... serif !important;
}

/* ❌ 错误 - 会被 Tailwind 的 font-sans/font-serif 覆盖 */
[data-locale="zh-CN"] body {
  font-family: 'PingFang SC', sans-serif;
}
```

#### 2. 日文字体 fallback 导致简体字形混排

**问题：** Noto Sans JP 能显示大部分汉字（共享 kanji），但简体特有字形（检、疗、务、车辆）不存在，浏览器回退到不同系统字体，导致同一行文字出现两种字体。

**解决：** zh-CN 模式下必须强制使用中文字体（PingFang SC/Microsoft YaHei），不能依赖从日文字体 fallback。`!important` 确保中文字体优先。

#### 3. 中国大陆无法访问 Google Fonts

**问题：** `fonts.googleapis.com` 和 `fonts.loli.net` 镜像在中国不稳定。

**解决：**
- zh-CN 正文使用**系统字体**（PingFang SC / Microsoft YaHei），零网络依赖
- zh-CN 标题使用 **LXGW WenKai** via jsDelivr（中国有节点），采用字符分包按需加载
- 其他语言继续使用 loli.net CDN

#### 4. `<body>` 上的 `font-sans` class

**问题：** `layout.tsx` 中 `<body className="font-sans antialiased">` 的 `font-sans` 会覆盖 CSS 中的 body 字体规则。

**解决：** 移除 `font-sans`，只保留 `<body className="antialiased">`。字体由 `globals.css` 统一管理。

### 禁止事项

- ❌ 不要在 `<body>` 上加 `font-sans` class
- ❌ 不要依赖 Google Fonts 为中国用户加载简体中文字体
- ❌ 不要在 locale-specific CSS 中省略 `!important`（会被 Tailwind 覆盖）
- ❌ 不要让 zh-CN 回退到日文字体 Noto Sans JP（会导致字形混排）
