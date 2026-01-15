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
