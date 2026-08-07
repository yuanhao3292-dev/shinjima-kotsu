# ✅ 生产环境 Stripe 测试指南

## 🎯 部署完成

生产环境已成功配置为 Stripe 测试模式！

- **官网域名**: https://niijima-koutsu.jp（主域名）
- **备用域名**: https://bespoketrip.jp
- **部署时间**: 2026-01-26
- **状态**: ✅ 使用测试密钥（不会产生真实扣款）

---

## 🧪 立即测试

### 步骤 1：访问白标设置页面

登录导游账户后，访问：

```
https://niijima-koutsu.jp/guide-partner/whitelabel
```

### 步骤 2：点击"立即订阅"按钮

页面会跳转到 Stripe Checkout 支付页面

### 步骤 3：使用测试卡号支付

**最常用测试卡** (支付成功):
```
卡号:    4242 4242 4242 4242
有效期:   12/28
CVV:     123
邮编:    12345
```

**其他测试场景**:
```
✅ 支付成功:        4242 4242 4242 4242
✅ 需要3D验证:      4000 0027 6000 3184
❌ 卡被拒绝:        4000 0000 0000 0002
❌ 余额不足:        4000 0000 0000 9995
❌ 卡已过期:        4000 0000 0000 0069
```

---

## ✅ 预期结果

1. **支付成功后**
   - ✅ 自动跳转回白标设置页面
   - ✅ 显示 "订阅成功！您的白标页面已激活。"
   - ✅ 订阅状态变为 "已激活"
   - ✅ 可以开始自定义品牌设置

2. **在 Stripe Dashboard 验证**
   - 访问: https://dashboard.stripe.com/test/payments
   - 确保左上角显示 **"测试模式"**
   - 可以看到刚才的支付记录
   - 金额: ¥1,980

3. **在数据库验证**
   - guides 表中 `subscription_status` 更新为 `active`
   - `subscription_plan` 设置为 `whitelabel_monthly`
   - `subscription_end_date` 设置为 30 天后

---

## 📋 当前配置

### Vercel 生产环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_*` | 测试环境可发布密钥 |
| `STRIPE_SECRET_KEY` | `sk_test_*` | 测试环境密钥 |
| `STRIPE_WHITELABEL_PRICE_ID` | `price_1StmV7I4ztZLHcF4oRwxTECa` | 白标订阅价格 ID |
| `STRIPE_WEBHOOK_SECRET` | `whsec_*` | Webhook 密钥 |

### 价格信息

- **白标订阅**: ¥1,980 / 月
- **支付方式**: 信用卡
- **计费周期**: 每月自动续费

---

## ⚠️ 重要提示

### 1. 当前使用测试环境

- ✅ **不会产生真实扣款**
- ✅ 只能使用测试卡号
- ✅ 测试数据会显示在 Stripe Dashboard 的测试模式中

### 2. 切换回生产环境

测试完成后，需要更新为生产密钥：

```bash
cd /Users/yuanhao/Developer/repos/shinjima-kotsu

# 更新 Vercel 环境变量
vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes
echo "pk_live_YOUR_LIVE_KEY" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

vercel env rm STRIPE_SECRET_KEY production --yes
echo "sk_live_YOUR_LIVE_KEY" | vercel env add STRIPE_SECRET_KEY production

# 重新部署
vercel --prod
```

### 3. Webhook 配置

确保 Stripe Webhook 指向正确的 URL：

```
https://niijima-koutsu.jp/api/stripe/webhook-subscription
```

或使用备用域名：
```
https://bespoketrip.jp/api/stripe/webhook-subscription
```

在 Stripe Dashboard → Webhooks 中检查配置。

---

## 🔍 故障排查

### 问题 1: 支付失败

**症状**: 点击"订阅"后提示错误

**检查清单**:
- ✅ 确认卡号正确（无空格）
- ✅ 有效期格式正确（MM/YY）
- ✅ CVV 为3位数字
- ✅ 查看浏览器控制台错误信息

### 问题 2: 订阅状态未更新

**症状**: 支付成功但订阅状态仍为"未订阅"

**解决方案**:
1. 检查 Stripe Webhook 是否正常工作
2. 查看 Vercel 日志: `vercel logs https://niijima-koutsu.jp`
3. 手动触发 Webhook 重试（在 Stripe Dashboard 中）

### 问题 3: 无法访问白标设置页面

**症状**: 页面显示 404 或重定向到登录

**解决方案**:
- 确保已登录导游账户
- 检查账户是否已审核通过
- 清除浏览器缓存并重新登录

---

## 📊 测试检查清单

- [ ] 成功登录导游账户
- [ ] 访问白标设置页面
- [ ] 点击"立即订阅"按钮
- [ ] 填写测试卡号并提交
- [ ] 支付成功，跳转回设置页面
- [ ] 订阅状态显示为"已激活"
- [ ] 在 Stripe Dashboard 看到支付记录
- [ ] 可以自定义品牌设置并保存
- [ ] 白标页面 URL 正常显示
- [ ] 测试取消订阅功能

---

## 📚 相关资源

- [Stripe 测试卡号完整列表](https://stripe.com/docs/testing)
- [Stripe Dashboard (测试模式)](https://dashboard.stripe.com/test/payments)
- [完整测试指南](./STRIPE-TEST-GUIDE.md)
- [本地测试配置](./STRIPE-TEST-SETUP.md)

---

**测试完成日期**: _____________
**测试人**: _____________
**测试结果**: [ ] 通过 [ ] 失败

---

**最后更新**: 2026-01-26
