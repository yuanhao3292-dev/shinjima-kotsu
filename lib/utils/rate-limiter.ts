/**
 * 生产级速率限制器
 * 支持 Redis（分布式）和内存（本地开发）两种模式
 *
 * 环境变量配置：
 * - UPSTASH_REDIS_REST_URL: Redis REST API URL
 * - UPSTASH_REDIS_REST_TOKEN: Redis REST API Token
 *
 * 如果未配置环境变量，自动降级到内存模式（仅适合本地开发）
 */

import { Redis } from '@upstash/redis';

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
 * 速率限制结果
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
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

// ============================================================================
// Redis 实现（生产环境）
// ============================================================================

let redisClient: Redis | null = null;
let redisInitialized = false;

/**
 * 初始化 Redis 客户端（懒加载）
 */
function getRedisClient(): Redis | null {
  if (redisInitialized) return redisClient;

  redisInitialized = true;

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.warn('[RateLimit] Redis not configured, falling back to memory mode');
      return null;
    }

    redisClient = new Redis({
      url,
      token,
      // 性能优化：自动管道化请求
      automaticDeserialization: true,
    });

    console.info('[RateLimit] Redis initialized successfully');
    return redisClient;
  } catch (error) {
    console.error('[RateLimit] Failed to initialize Redis:', error);
    return null;
  }
}

/**
 * Redis 速率限制实现（分布式，适合 Serverless）
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  if (!redis) {
    throw new Error('Redis client not available');
  }

  const now = Date.now();
  const windowSeconds = Math.floor(config.windowMs / 1000);
  const windowKey = `ratelimit:${identifier}:${Math.floor(now / (windowSeconds * 1000))}`;

  try {
    // 使用 Redis 原子操作：INCR + EXPIRE
    const count = await redis.incr(windowKey);

    // 第一次请求时设置过期时间
    if (count === 1) {
      await redis.expire(windowKey, windowSeconds);
    }

    const resetTime = now + config.windowMs;
    const remaining = Math.max(0, config.maxRequests - count);

    if (count > config.maxRequests) {
      const retryAfter = Math.ceil(config.windowMs / 1000);
      return {
        success: false,
        remaining: 0,
        resetTime,
        retryAfter,
      };
    }

    return {
      success: true,
      remaining,
      resetTime,
    };
  } catch (error) {
    // Redis 错误时记录日志并降级到通过（避免服务中断）
    console.error('[RateLimit] Redis error, allowing request:', error);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }
}

// ============================================================================
// 内存实现（本地开发 Fallback）
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();
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
 * 内存速率限制实现（非分布式，仅适合单实例或本地开发）
 *
 * ⚠️ 警告：在 Vercel Serverless 环境中，每个 Lambda 实例有独立内存，
 * 无法实现真正的速率限制。建议生产环境配置 Redis。
 */
function checkRateLimitMemory(
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

// ============================================================================
// 公共 API
// ============================================================================

/**
 * 检查速率限制（自动选择 Redis 或内存实现）
 *
 * @param identifier 唯一标识符（通常是 IP + endpoint）
 * @param config 速率限制配置
 * @returns 速率限制结果
 *
 * @example
 * const clientIp = getClientIp(request);
 * const result = await checkRateLimit(`${clientIp}:/api/search`, RATE_LIMITS.search);
 * if (!result.success) {
 *   return NextResponse.json(
 *     { error: '请求过于频繁，请稍后再试' },
 *     { status: 429, headers: createRateLimitHeaders(result) }
 *   );
 * }
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  if (redis) {
    return checkRateLimitRedis(identifier, config);
  } else {
    // 降级到内存模式
    return checkRateLimitMemory(identifier, config);
  }
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
