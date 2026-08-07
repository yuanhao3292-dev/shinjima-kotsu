# ✅ Stripe 测试环境配置完成

## 📋 已配置信息

### 1. Stripe 测试密钥

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51ShMGoI4ztZLHcF4..."
STRIPE_SECRET_KEY="sk_test_51ShMGoI4ztZLHcF4..."
STRIPE_WHITELABEL_PRICE_ID="price_1StmV7I4ztZLHcF4oRwxTECa"
```

### 2. 白标订阅价格

- **价格**: ¥1,980 / 月
- **测试价格 ID**: `price_1StmV7I4ztZLHcF4oRwxTECa`

---

## 🧪 开始测试

### 1. 启动开发服务器

```bash
cd /Users/yuanhao/Developer/repos/shinjima-kotsu
npm run dev
```

### 2. 访问白标页面设置

```
http://localhost:3000/guide-partner/whitelabel
```

### 3. 使用测试卡号支付

**最常用测试卡** (支付成功):
```
卡号:    4242 4242 4242 4242
有效期:   12/28
CVV:     123
邮编:    12345
```

**其他测试场景**:
- **卡被拒绝**: `4000 0000 0000 0002`
- **余额不足**: `4000 0000 0000 9995`
- **需要3D验证**: `4000 0027 6000 3184`

---

## ✅ 测试流程

1. **登录导游账户**
   - 使用你的导游账号登录

2. **进入白标设置页面**
   - 导航到: `/guide-partner/whitelabel`

3. **点击"立即订阅"按钮**
   - 页面会跳转到 Stripe Checkout

4. **填写测试支付信息**
   - 卡号: `4242 4242 4242 4242`
   - 有效期: `12/28`
   - CVV: `123`

5. **提交支付**
   - 点击"订阅"按钮

6. **验证结果**
   - ✅ 页面应该跳转回 `/guide-partner/whitelabel?subscription=success`
   - ✅ 订阅状态应该更新为"已激活"
   - ✅ 在 Stripe Dashboard 可以看到测试支付记录

---

## 🔍 在 Stripe Dashboard 验证

1. 访问: https://dashboard.stripe.com/test/payments
2. 确保左上角显示 **"测试模式"**
3. 查看最新的支付记录
4. 点击支付记录可查看详细信息

---

## 📁 配置文件备份

原配置已备份到:
```
.env.local.backup-YYYYMMDD-HHMMSS
```

恢复到生产环境:
```bash
# 查看所有备份
ls -la .env.local.backup-*

# 恢复特定备份
cp .env.local.backup-YYYYMMDD-HHMMSS .env.local

# 重启服务器
npm run dev
```

---

## ⚠️ 重要提示

1. **当前使用测试环境**
   - 所有密钥均为 `*_test_*` 开头
   - 不会产生真实扣款

2. **测试完成后**
   - 记得切换回生产环境密钥
   - 或删除 `STRIPE_WHITELABEL_PRICE_ID` 使用动态价格

3. **Webhook 本地测试**
   - 如需测试 Webhook，使用 Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

---

## 📚 相关文档

- [完整测试指南](./STRIPE-TEST-GUIDE.md)
- [Stripe 测试卡号](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
