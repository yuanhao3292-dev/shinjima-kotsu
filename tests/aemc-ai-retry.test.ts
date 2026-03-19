/**
 * AI 重试机制测试
 *
 * 测试范围：
 * 1. 成功调用直接返回
 * 2. 可重试错误的指数退避
 * 3. 不可重试错误立即抛出
 * 4. 最大重试次数限制
 * 5. 默认参数
 */

import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../services/aemc/ai-retry';
import {
  RateLimitError,
  InternalServerError,
  APIConnectionError,
  APIError,
  BadRequestError,
  AuthenticationError,
} from 'openai';

// ============================================================
// 辅助：创建 OpenAI SDK 错误实例
// ============================================================

const emptyHeaders = new Headers();

function makeRateLimitError(): RateLimitError {
  return new RateLimitError(429, { message: 'Rate limited' }, 'Rate limited', emptyHeaders);
}

function makeInternalServerError(): InternalServerError {
  return new InternalServerError(500, { message: 'Internal error' }, 'Internal error', emptyHeaders);
}

function makeBadRequestError(): BadRequestError {
  return new BadRequestError(400, { message: 'Bad request' }, 'Bad request', emptyHeaders);
}

function makeAuthError(): AuthenticationError {
  return new AuthenticationError(401, { message: 'Unauthorized' }, 'Unauthorized', emptyHeaders);
}

function make502Error(): APIError {
  return new APIError(502, { message: 'Bad Gateway' }, 'Bad Gateway', emptyHeaders);
}

// ============================================================
// 成功场景
// ============================================================

describe('withRetry — 成功', () => {
  it('首次调用成功直接返回', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 2, baseDelayMs: 10 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('第二次调用成功', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(makeRateLimitError())
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 2, baseDelayMs: 10 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('第三次调用成功（重试2次）', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(makeInternalServerError())
      .mockRejectedValueOnce(makeRateLimitError())
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 2, baseDelayMs: 10 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

// ============================================================
// 可重试错误
// ============================================================

describe('withRetry — 可重试错误', () => {
  it('429 RateLimitError 会重试', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(makeRateLimitError())
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 1, baseDelayMs: 10 });
    expect(result).toBe('ok');
  });

  it('500 InternalServerError 会重试', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(makeInternalServerError())
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 1, baseDelayMs: 10 });
    expect(result).toBe('ok');
  });

  it('502 会重试', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(make502Error())
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 1, baseDelayMs: 10 });
    expect(result).toBe('ok');
  });

  it('ECONNRESET 网络错误会重试', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('ECONNRESET'))
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 1, baseDelayMs: 10 });
    expect(result).toBe('ok');
  });

  it('ETIMEDOUT 超时会重试', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('ETIMEDOUT'))
      .mockResolvedValue('ok');
    const result = await withRetry(fn, { maxRetries: 1, baseDelayMs: 10 });
    expect(result).toBe('ok');
  });
});

// ============================================================
// 不可重试错误
// ============================================================

describe('withRetry — 不可重试错误', () => {
  it('400 BadRequestError 立即抛出', async () => {
    const fn = vi.fn().mockRejectedValue(makeBadRequestError());
    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 10 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('401 AuthenticationError 立即抛出', async () => {
    const fn = vi.fn().mockRejectedValue(makeAuthError());
    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 10 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('JSON.parse SyntaxError 立即抛出', async () => {
    const fn = vi.fn().mockRejectedValue(new SyntaxError('Unexpected token'));
    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 10 })).rejects.toThrow(SyntaxError);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// 最大重试次数
// ============================================================

describe('withRetry — 重试次数限制', () => {
  it('超过 maxRetries 抛出最后的错误', async () => {
    const fn = vi.fn().mockRejectedValue(makeRateLimitError());
    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 10 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it('maxRetries=0 不重试', async () => {
    const fn = vi.fn().mockRejectedValue(makeRateLimitError());
    await expect(withRetry(fn, { maxRetries: 0, baseDelayMs: 10 })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// 默认参数
// ============================================================

describe('withRetry — 默认参数', () => {
  it('无 options 使用默认值（maxRetries=2）', async () => {
    const fn = vi.fn().mockRejectedValue(makeRateLimitError());
    await expect(withRetry(fn)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(3); // 默认 maxRetries=2
  });
});
