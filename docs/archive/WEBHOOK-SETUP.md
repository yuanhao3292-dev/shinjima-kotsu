# Stripe Webhook 配置指南

## 🎯 为什么需要配置 Webhook？

现在支付成功后，订单状态还是 `pending`（待支付）。
配置 Webhook 后，Stripe 会自动通知我们的服务器，订单状态会自动变成 `paid`（已支付）。

---

## 📋 本地测试配置（5分钟完成）

### 步骤 1: 安装 Stripe CLI

打开**新的终端窗口**，运行：

```bash
brew install stripe/stripe-cli/stripe
```

等待安装完成（大约1-2分钟）。

---

### 步骤 2: 登录 Stripe

```bash
stripe login
```

- 会自动打开浏览器
- 在浏览器中点击"Allow access"授权
- 看到"Success!"后关闭浏览器
- 回到终端

---

### 步骤 3: 启动 Webhook 转发

**重要**: 保持这个终端窗口一直开着！

```bash
cd /Users/yuanhao/Developer/repos/shinjima-kotsu
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

您会看到类似这样的输出：

```
> Ready! You are using Stripe API Version [2025-12-15]. This version is not frozen.
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxx (^C to quit)
```

**复制这个 `whsec_` 开头的密钥！**

---

### 步骤 4: 更新 .env.local 文件

1. 打开 `/Users/yuanhao/Developer/repos/shinjima-kotsu/.env.local`
2. 找到这一行：
   ```
   STRIPE_WEBHOOK_SECRET=""
   ```
3. 把刚才复制的密钥粘贴进去：
   ```
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxx"
   ```
4. 保存文件

---

### 步骤 5: 重启开发服务器

回到运行 `npm run dev` 的终端窗口：

1. 按 `Ctrl + C` 停止服务器
2. 重新运行：
   ```bash
   npm run dev
   ```

---

### 步骤 6: 测试 Webhook

现在重新测试一次支付：

1. 访问 http://localhost:3000/medical-packages
2. 选择任意套餐
3. 填写信息并支付（使用测试卡 4242 4242 4242 4242）
4. 支付成功后

**查看终端窗口**（运行 stripe listen 的那个）：
- 应该会显示收到的 webhook 事件
- 类似：`checkout.session.completed` 和 `payment_intent.succeeded`

**查看订单状态**：
```bash
node scripts/check-orders.js
```

订单状态应该从 `pending` 变成 `paid` 了！✅

---

## 🔍 故障排除

### 问题 1: stripe: command not found

**解决方案**: Stripe CLI 还没安装成功
```bash
# 重新安装
brew install stripe/stripe-cli/stripe

# 检查是否安装成功
stripe --version
```

---

### 问题 2: webhook secret 显示为空

**原因**: 您可能没有看到 `whsec_` 开头的密钥

**解决方案**:
1. 确保 `stripe listen` 命令正在运行
2. 输出的前几行应该包含 webhook secret
3. 向上滚动终端查看完整输出

---

### 问题 3: 订单状态还是 pending

**检查清单**:
1. ✅ `.env.local` 中 `STRIPE_WEBHOOK_SECRET` 已填写
2. ✅ `stripe listen` 命令正在运行（窗口没关）
3. ✅ 开发服务器已重启（npm run dev）
4. ✅ 重新完成了一次完整支付流程

**查看 webhook 日志**:
在运行 `stripe listen` 的终端中，应该能看到：
```
--> checkout.session.completed [evt_xxx]
--> payment_intent.succeeded [evt_xxx]
```

---

## 📝 确认 Webhook 工作正常

运行检查脚本：
```bash
node scripts/check-orders.js
```

您应该看到：
```
订单号: TIMC2601130003
状态: paid  ← 这里应该是 paid 而不是 pending
支付时间: 2026/1/13 20:xx:xx  ← 应该有支付时间
Payment Intent: pi_xxxxx  ← 应该有 Payment Intent ID
```

---

## 🎉 成功！

如果订单状态变成 `paid`，说明 Webhook 配置成功了！

现在系统完全自动化了：
1. 客户支付 → Stripe 通知我们 → 订单自动更新为"已支付" ✅
2. 您可以在数据库中看到完整的支付记录 ✅

---

## 🚀 生产环境配置（等部署到 Vercel 后）

部署后需要在 Stripe Dashboard 中配置真正的 Webhook：

1. 访问 https://dashboard.stripe.com/test/webhooks
2. 点击 "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. 选择事件:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. 复制 Signing secret
6. 添加到 Vercel 环境变量: `STRIPE_WEBHOOK_SECRET`

---

## ❓ 需要帮助？

如果遇到问题，请告诉我：
1. 在哪一步卡住了
2. 终端显示了什么错误信息
3. 我会帮您解决！
