# Redis 配置状态报告

**生成时间**: 2026-01-26  
**项目**: shinjima-kotsu (niijima-koutsu.jp)

---

## 🚨 当前状态：Redis 未配置（使用内存模式）

### 环境检查结果

| 环境 | UPSTASH_REDIS_REST_URL | UPSTASH_REDIS_REST_TOKEN | 状态 |
|------|------------------------|--------------------------|------|
| **本地开发** (.env.local) | ❌ 未配置 | ❌ 未配置 | 降级到内存模式 |
| **Vercel 生产环境** | ❌ 未配置 | ❌ 未配置 | 降级到内存模式 ⚠️ |

### 安全影响

#### ⚠️ 内存模式在 Serverless 环境的局限性

```
Vercel Lambda 实例 A     内存: {user1: 5 次}
Vercel Lambda 实例 B     内存: {user1: 3 次}  
Vercel Lambda 实例 C     内存: {user1: 4 次}

→ 实际总请求: 12 次
→ 限流配置: 10 次/分钟
→ 结果: 绕过限流 ❌
```

**问题**:
- 每个 Lambda 实例有独立内存空间
- 无法统计跨实例的请求总数
- 攻击者可以通过负载均衡分散请求，轻易绕过限流

#### 🎯 Redis 分布式限流优势

```
所有 Lambda 实例 → Redis 中心化存储 {user1: 12 次}
→ 准确统计: 12 次
→ 触发限流: ✅ 超过 10 次/分钟
→ 返回 429 错误
```

---

## 📋 修复方案

### 第一步：创建 Upstash Redis 实例

1. 访问 https://console.upstash.com/
2. 创建免费 Redis 数据库（支持 10,000 请求/天）
3. 选择区域：推荐 Tokyo（最接近日本用户）
4. 复制以下凭证：
   - REST API URL
   - REST API Token

### 第二步：配置 Vercel 环境变量

```bash
# 方法 1: 使用 Vercel CLI（推荐）
cd /Users/yuanhao/Developer/repos/shinjima-kotsu
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production

# 方法 2: Vercel Dashboard
# 访问: https://vercel.com/yuanhao3292-devs-projects/shinjima-kotsu/settings/environment-variables
# 添加两个环境变量，选择 Production 环境
```

### 第三步：配置本地开发环境（可选）

```bash
# 编辑 .env.local
echo "UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io" >> .env.local
echo "UPSTASH_REDIS_REST_TOKEN=your_token_here" >> .env.local
```

### 第四步：重新部署

```bash
vercel --prod
```

### 第五步：验证 Redis 是否生效

检查生产环境日志：
```bash
vercel logs https://niijima-koutsu.jp --follow
```

查找日志：
```
✅ 成功: [RateLimit] Redis initialized successfully
❌ 失败: [RateLimit] Redis not configured, falling back to memory mode
```

---

## 🔍 当前代码状态

### ✅ 代码已实现 Redis 支持

文件: `lib/utils/rate-limiter.ts`

```typescript
// 自动选择 Redis 或内存模式
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  
  if (redis) {
    return checkRateLimitRedis(identifier, config);  // 使用 Redis
  } else {
    console.warn('[RateLimit] Redis not configured, falling back to memory mode');
    return checkRateLimitMemory(identifier, config);  // 降级到内存
  }
}
```

### ✅ 所有 API 端点已应用限流

| 端点 | 限流配置 | 状态 |
|------|----------|------|
| `/api/create-checkout-session` | 10 次/分钟 | ✅ 已应用 |
| `/api/partner-inquiry` | 10 次/分钟 | ✅ 已应用 |
| `/api/health-screening` | 30 次/分钟 | ✅ 已应用 |
| `/api/parse-itinerary` | 30 次/分钟 | ✅ 已应用 |
| 其他 API | 标准配置 | ✅ 已应用 |

---

## 💰 成本估算

### Upstash Redis 免费套餐

- **请求数**: 10,000 次/天
- **存储**: 256 MB
- **连接数**: 无限制
- **延迟**: ~5ms (Tokyo 区域)
- **价格**: $0/月

### 预估使用量

假设网站流量：
- 日访问量: 1,000 人
- 每人触发 5 次 API 请求
- 总请求数: 5,000 次/天

→ **完全免费** ✅

---

## ⏰ 优先级建议

| 优先级 | 任务 | 原因 |
|--------|------|------|
| 🔴 **P0** | 配置 Vercel 生产环境 Redis | 当前限流无效，存在 DDoS 风险 |
| 🟡 **P1** | 配置本地开发环境 Redis | 便于本地测试限流逻辑 |
| 🟢 **P2** | 监控 Redis 使用情况 | 确保不超出免费额度 |

---

## 📚 参考资料

- Upstash 官方文档: https://docs.upstash.com/redis
- Next.js Rate Limiting 最佳实践: https://nextjs.org/docs/app/building-your-application/configuring/rate-limiting
- Vercel 环境变量指南: https://vercel.com/docs/projects/environment-variables

---

## ✅ 下一步行动

1. [ ] 注册 Upstash 账号并创建 Redis 实例
2. [ ] 在 Vercel Dashboard 添加环境变量
3. [ ] 重新部署到生产环境
4. [ ] 验证日志中出现 "Redis initialized successfully"
5. [ ] 使用 Postman 测试限流（连续发送 15 次请求，第 11 次应返回 429）

