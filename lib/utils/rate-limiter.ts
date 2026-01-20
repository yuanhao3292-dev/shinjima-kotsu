/**
 * 简单的内存速率限制器
 * 适用于 Serverless 环境的轻量级实现
 *
 * 注意：此实现适合单实例部署或低流量场景
 * 高流量生产环境建议使用 Redis 等分布式方案
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// 内存存储（按端点分组）
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

// 清理过期条目的间隔（5分钟）
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * 清理过期的速率限制条目
 */
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * 速率限制配置
 */
export interface RateLimitConfig {
  /** 窗口时间（毫秒） */
  windowMs: number;
  /** 窗口内最大请求数 */
  maxRequests: number;
}

/**
 * 预设的速率限制配置
 */
export const RATE_LIMITS = {
  // 高频端点（搜索、查询）
  search: { windowMs: 60 * 1000, maxRequests: 60 } as RateLimitConfig,

  // 一般 API 端点
  standard: { windowMs: 60 * 1000, maxRequests: 30 } as RateLimitConfig,

  // 敏感操作（支付、提交）
  sensitive: { windowMs: 60 * 1000, maxRequests: 10 } as RateLimitConfig,

  // 认证端点
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 } as RateLimitConfig,
} as const;

/**
 * 速率限制结果
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * 检查速率限制
 *
 * @param identifier 唯一标识符（通常是 IP 或 userId + endpoint）
 * @param config 速率限制配置
 * @returns 速率限制结果
 *
 * @example
 * const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
 * const result = checkRateLimit(`${clientIp}:/api/search`, RATE_LIMITS.search);
 * if (!result.success) {
 *   return NextResponse.json({ error: '请求过于频繁' }, { status: 429 });
 * }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // 新请求或窗口已重置
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // 检查是否超限
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  // 增加计数
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * 获取客户端 IP 地址
 * 优先使用 x-forwarded-for（适用于代理/CDN 后端）
 */
export function getClientIp(request: Request): string {
  // Vercel / Cloudflare 等代理设置的真实 IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // 取第一个 IP（原始客户端）
    return forwarded.split(',')[0].trim();
  }

  // 备选方案
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // 无法确定时返回占位符
  return 'unknown';
}

/**
 * 创建速率限制响应头
 */
export function createRateLimitHeaders(result: RateLimitResult): Headers {
  const headers = new Headers();
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.resetTime.toString());
  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString());
  }
  return headers;
}
