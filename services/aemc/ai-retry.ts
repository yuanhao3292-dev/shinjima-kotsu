/**
 * AI 调用重试工具
 *
 * 对 OpenRouter/OpenAI API 调用添加指数退避重试，
 * 处理瞬态错误（429 限流、5xx 服务端错误、超时、网络中断）。
 *
 * 不重试：400 Bad Request、401 Auth Error、JSON 解析失败等非瞬态错误。
 */

import {
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  RateLimitError,
  InternalServerError,
} from 'openai';
import { aemcLog } from './logger';

/**
 * 判断错误是否为可重试的瞬态错误
 */
function isRetryableError(err: unknown): boolean {
  // OpenAI SDK 错误类型
  if (err instanceof RateLimitError) return true; // 429
  if (err instanceof InternalServerError) return true; // 500
  if (err instanceof APIConnectionError) return true; // 网络中断
  if (err instanceof APIConnectionTimeoutError) return true; // 超时

  // OpenRouter 可能返回 502/503/504
  if (err instanceof APIError) {
    const status = err.status;
    if (status && [502, 503, 504].includes(status)) return true;
  }

  // Node.js 原生网络错误
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('econnreset') || msg.includes('econnrefused') || msg.includes('etimedout')) {
      return true;
    }
  }

  return false;
}

export interface RetryOptions {
  /** 最大重试次数（不含首次调用）。默认 2 */
  maxRetries?: number;
  /** 首次重试延迟（ms）。默认 1000 */
  baseDelayMs?: number;
  /** 日志前缀 */
  label?: string;
}

/**
 * 带指数退避的重试包装器
 *
 * @example
 * const response = await withRetry(
 *   () => client.chat.completions.create({ ... }),
 *   { maxRetries: 2, baseDelayMs: 1000, label: 'AI-1 Extractor' }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 2;
  const baseDelayMs = options?.baseDelayMs ?? 1000;
  const label = options?.label ?? 'AI';

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // 最后一次重试也失败 或 不可重试的错误 → 直接抛出
      if (attempt >= maxRetries || !isRetryableError(err)) {
        throw err;
      }

      const delay = baseDelayMs * Math.pow(2, attempt);
      const errName = err instanceof Error ? err.constructor.name : 'UnknownError';
      aemcLog.warn('ai-retry', `${label} attempt ${attempt + 1}/${maxRetries + 1} failed (${errName}), retrying in ${delay}ms`, {
        label, attempt: attempt + 1, maxAttempts: maxRetries + 1, errorType: errName, delayMs: delay,
      });
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError;
}
