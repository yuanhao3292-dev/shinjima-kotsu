# 医疗套餐支付系统 - 快速上手指南

## 📦 已完成的功能

### 1. 数据库架构 ✅
- ✅ Supabase 数据库已创建并配置
- ✅ 4 个核心表已创建:
  - `medical_packages` - 医疗套餐目录
  - `customers` - 客户信息
  - `orders` - 订单管理
  - `payments` - 支付记录
- ✅ 自动生成订单号功能 (TIMC-YYMMDD-####)
- ✅ Row Level Security (RLS) 已配置

### 2. Stripe 支付集成 ✅
- ✅ Stripe 测试模式已配置
- ✅ 3 个医疗套餐已在 Stripe 创建:
  - VIP 頂級全能套裝 (¥880,000)
  - PREMIUM 心臟精密 (¥650,000)
  - SELECT 胃+大腸鏡 (¥420,000)
- ✅ Stripe Product/Price ID 已关联到数据库

### 3. 前端页面 ✅
- ✅ `/medical-packages` - 套餐列表页
- ✅ `/medical-packages/[slug]` - 套餐详情和预约表单
- ✅ `/payment/success` - 支付成功页面
- ✅ `/payment/cancel` - 支付取消页面

### 4. API 路由 ✅
- ✅ `/api/create-checkout-session` - 创建 Stripe Checkout Session
- ✅ `/api/webhooks/stripe` - 处理 Stripe 支付回调

## 🚀 本地测试

### 1. 启动开发服务器

```bash
cd /Users/yuanhao/Developer/repos/shinjima-kotsu
npm run dev
```

### 2. 访问页面

打开浏览器访问：http://localhost:3000/medical-packages

### 3. 测试支付流程

1. 选择任意套餐
2. 填写预约信息（姓名、邮箱、电话等）
3. 点击「前往支付」
4. 在 Stripe Checkout 页面使用测试卡号：`4242 4242 4242 4242`
   - CVC: 任意 3 位数字
   - 日期: 任意未来日期
5. 完成支付后会重定向到成功页面

## 🔧 配置 Stripe Webhook（重要！）

为了让支付成功后自动更新订单状态，需要配置 Stripe Webhook：

### 方法 1: 使用 Stripe CLI（本地测试）

```bash
# 安装 Stripe CLI
brew install stripe/stripe-cli/stripe

# 登录
stripe login

# 转发 webhook 到本地
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 复制显示的 webhook signing secret，更新到 .env.local
# STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

### 方法 2: Vercel 部署后配置（生产环境）

1. 部署到 Vercel
2. 访问 https://dashboard.stripe.com/test/webhooks
3. 点击「Add endpoint」
4. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
5. 选择以下事件:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. 复制 Signing secret 到 Vercel 环境变量

## 📊 数据库管理

### 查看订单

在 Supabase Dashboard 的 SQL Editor 中运行：

```sql
-- 查看所有订单
SELECT
  o.order_number,
  o.status,
  o.total_amount_jpy,
  c.name as customer_name,
  c.email,
  p.name_zh_tw as package_name,
  o.created_at
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN medical_packages p ON o.package_id = p.id
ORDER BY o.created_at DESC;
```

### 查看支付记录

```sql
-- 查看所有支付记录
SELECT
  pay.stripe_payment_intent_id,
  pay.status,
  pay.amount_jpy,
  o.order_number,
  c.email,
  pay.created_at
FROM payments pay
JOIN orders o ON pay.order_id = o.id
JOIN customers c ON o.customer_id = c.id
ORDER BY pay.created_at DESC;
```

## 🔐 环境变量清单

`.env.local` 文件应包含:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://fcpcjfqxxtxlbtvbjduk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Stripe (测试模式)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # 配置 Webhook 后填写
```

## 🎨 Stripe 产品管理

### 查看产品

访问：https://dashboard.stripe.com/test/products

### 添加新套餐

1. 在数据库中添加套餐记录:

```sql
INSERT INTO medical_packages (
  slug,
  name_zh_tw,
  price_jpy,
  category,
  features
) VALUES (
  'new-package-slug',
  '新套餐名称',
  500000,
  'standard',
  '[{"zh_tw": "功能1"}, {"zh_tw": "功能2"}]'::jsonb
);
```

2. 运行脚本创建 Stripe 产品:

```bash
node scripts/setup-stripe-products.js
```

## 📝 订单状态流程

```
pending (待支付)
  ↓
paid (已支付) ← Stripe Webhook 自动更新
  ↓
confirmed (已确认) ← 客服手动确认
  ↓
completed (已完成) ← 体检完成后更新
```

其他状态:
- `cancelled` - 已取消
- `refunded` - 已退款

## 🔍 调试技巧

### 查看 Stripe 事件日志

访问：https://dashboard.stripe.com/test/events

### 查看 Supabase 日志

访问：https://supabase.com/dashboard/project/fcpcjfqxxtxlbtvbjduk/logs/explorer

### 本地日志

Webhook 处理日志会输出到终端：

```bash
# 查看 API 日志
npm run dev
```

## 📚 下一步开发

1. **邮件通知系统**
   - 使用 Resend 或 SendGrid
   - 支付成功后发送确认邮件
   - 客服确认后发送详细安排

2. **客服管理后台**
   - 订单管理面板
   - 客户信息管理
   - 预约日期管理

3. **支付方式扩展**
   - 支付宝 (Alipay)
   - 微信支付 (WeChat Pay)
   - 银行转账

4. **多语言支持**
   - 目前仅中文
   - 可添加日语和英语

## 🚨 常见问题

### Q: 支付成功但订单状态未更新？
A: 检查 Stripe Webhook 是否正确配置，查看 Webhook 事件日志。

### Q: 测试卡号无法使用？
A: 确认 Stripe 处于测试模式，使用 `pk_test_` 和 `sk_test_` 开头的密钥。

### Q: 数据库连接失败？
A: 检查 Supabase 环境变量是否正确配置。

## 📞 技术支持

如有问题，请参考：
- Stripe 文档: https://stripe.com/docs
- Supabase 文档: https://supabase.com/docs
- Next.js 文档: https://nextjs.org/docs

---

**项目状态**: ✅ 核心功能已完成，可进行测试
**最后更新**: 2026-01-13
