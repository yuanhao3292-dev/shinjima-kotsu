# 🚀 新岛交通网站部署指南

## 📦 项目状态
- ✅ 代码已推送到 GitHub: https://github.com/yuanhao3292-dev/shinjima-kotsu
- ✅ Next.js 16.1.1 构建成功
- ✅ 响应式设计已优化
- ✅ Vercel 配置已就绪

## 🌐 部署选项

### 选项1: Vercel 一键部署（推荐）
1. **访问** [vercel.com/new](https://vercel.com/new)
2. **导入仓库** - 选择 `yuanhao3292-dev/shinjima-kotsu`
3. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`
4. **环境变量** - 根据 `.env.example` 设置
5. **点击部署**

### 选项2: Vercel CLI 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到生产环境
vercel --prod
```

### 选项3: 手动部署
```bash
# 构建项目
npm run build

# 本地测试生产版本
npm start

# 访问 http://localhost:3000 测试
```

## 🔧 环境变量配置
部署时需要设置以下环境变量：

### 必需变量
```
# Supabase 配置
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe 支付
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 邮件服务
RESEND_API_KEY=re_...
```

### 可选变量
```
# 谷歌 AI
GOOGLE_GENERATIVE_AI_API_KEY=...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# 其他 API
DEEPSEEK_API_KEY=...
```

## 📱 移动端优化
项目已包含：
- ✅ Viewport 元标签设置
- ✅ Tailwind 响应式类
- ✅ 触摸友好设计
- ✅ 图片懒加载

## 🧪 测试建议
1. **本地测试**: `npm run dev` → http://localhost:3000
2. **生产构建测试**: `npm run build && npm start`
3. **移动端测试**: 使用 Chrome DevTools 设备模拟
4. **功能测试**: 检查表单、支付、API 路由

## 🔄 持续部署
GitHub 仓库已连接，每次推送到 `main` 分支可自动部署：
1. 确保 Vercel 项目已连接 GitHub
2. 推送代码: `git push origin main`
3. Vercel 自动构建部署

## 📞 故障排除

### 构建失败
```bash
# 清理缓存
rm -rf .next node_modules

# 重新安装
npm install

# 重新构建
npm run build
```

### 环境变量问题
- 检查 Vercel 项目设置中的环境变量
- 确保变量名称与代码中一致
- 重启部署

### 数据库连接
- 检查 Supabase 项目状态
- 验证数据库连接字符串
- 检查网络访问权限

## 🎯 部署完成检查清单
- [ ] 网站可访问
- [ ] 移动端显示正常
- [ ] 表单功能正常
- [ ] 支付流程测试
- [ ] API 路由正常
- [ ] 图片加载正常
- [ ] SEO 元标签正确

## 🔗 重要链接
- **GitHub 仓库**: https://github.com/yuanhao3292-dev/shinjima-kotsu
- **Vercel 控制台**: https://vercel.com/dashboard
- **Supabase 控制台**: https://supabase.com/dashboard
- **Stripe 控制台**: https://dashboard.stripe.com

---
**最后更新**: $(date)
**部署状态**: ✅ 准备就绪
**下一步**: 前往 Vercel 开始部署
```