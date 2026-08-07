# Stripe 支付测试指南

## 🎯 快速开始

### 1. 切换到测试模式

1. 访问 https://dashboard.stripe.com
2. 左上角切换到 **"测试模式"** (Test mode)
3. 左侧菜单：**开发者** → **API 密钥**

### 2. 获取测试密钥

```
可发布密钥: pk_test_xxxxxxxxxx
密钥:       sk_test_xxxxxxxxxx
```

### 3. 更新 .env.local

```bash
# 备份当前配置
cp .env.local .env.local.backup

# 编辑 .env.local，修改 Stripe 配置：
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_xxx"  # 本地测试时可以暂时保持

# 重启开发服务器
npm run dev
```

---

## 🧪 测试卡号大全

### 常用测试卡

| 卡号 | 场景 | CVV | 有效期 |
|------|------|-----|--------|
| `4242 4242 4242 4242` | ✅ 支付成功（最常用） | 任意3位 | 未来日期 |
| `4000 0027 6000 3184` | ✅ 3D验证成功 | 任意3位 | 未来日期 |
| `4000 0000 0000 0002` | ❌ 卡被拒绝 | 任意3位 | 未来日期 |
| `4000 0000 0000 9995` | ❌ 余额不足 | 任意3位 | 未来日期 |
| `4000 0000 0000 0069` | ❌ 卡已过期 | 任意3位 | 未来日期 |
| `4000 0000 0000 0127` | ❌ CVV 错误 | 任意3位 | 未来日期 |

### 其他说明

- **CVV**: 任意3位数字（如 `123`）
- **有效期**: 任意未来日期（如 `12/28`）
- **邮编**: 任意5位数字（如 `12345`）

---

## 📋 测试流程

### 白标页面订阅测试

1. **访问白标页面设置**
   ```
   http://localhost:3000/guide-partner/whitelabel
   ```

2. **点击"立即订阅"按钮**

3. **填写支付信息**
   - 卡号: `4242 4242 4242 4242`
   - 有效期: `12/28`
   - CVV: `123`
   - 邮编: `12345`

4. **提交支付**

5. **验证结果**
   - ✅ 支付成功，页面跳转到成功页面
   - ✅ 订阅状态更新为 "active"
   - ✅ Stripe Dashboard 显示测试支付记录

---

## 🔍 在 Stripe Dashboard 查看测试结果

1. 访问 https://dashboard.stripe.com/test/payments
2. 查看最近的支付记录
3. 点击具体支付，查看详细信息

---

## ⚠️ 常见问题

### Q1: 提示 "Invalid API Key"

**原因**: 使用了生产密钥（pk_live_xxx）但 Dashboard 在测试模式

**解决**: 确保使用 `pk_test_` 和 `sk_test_` 开头的测试密钥

### Q2: Webhook 事件收不到

**原因**: 本地开发时，Stripe 无法访问 localhost

**解决**: 使用 Stripe CLI 转发 Webhook 事件

```bash
# 1. 安装 Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. 登录
stripe login

# 3. 转发 Webhook 到本地
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Q3: 如何测试订阅取消？

1. 在 Stripe Dashboard → 客户 → 订阅
2. 找到测试订阅，点击 "取消订阅"
3. 或使用代码调用取消 API

---

## 🚀 切换回生产环境

测试完成后，记得切换回生产密钥：

```bash
# 恢复生产配置
cp .env.local.backup .env.local

# 或手动改回：
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"
STRIPE_SECRET_KEY="sk_live_xxx"

# 重启服务器
npm run dev
```

---

## 📚 参考资源

- [Stripe 测试卡号完整列表](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API 文档](https://stripe.com/docs/api)
