/**
 * middleware matcher 覆盖范围测试
 *
 * 存在的理由：matcher 曾经写成 `api/(?!protected)`，本意大概是"放行不需要
 * 鉴权的 API"，实际效果是排除了除 /api/protected 外的**全部** API —— 而仓库里
 * 根本没有 /api/protected 这个路由。于是 middleware 从未在任何 API 路径上执行，
 * 里面的 CSRF 网关是一整段死代码，且没有任何测试能发现这一点
 * （tests/middleware.test.ts 只测了 rate-limiter，一次都没调用 middleware）。
 *
 * 这里直接对 matcher 正则求值，锁住"CSRF 网关确实会在写操作 API 上运行"这个前提。
 * Next.js 把 matcher 字符串锚定成 ^...$ 后用于路由匹配，下面复刻同样的语义。
 */
import { describe, it, expect } from 'vitest';
import { config } from '@/middleware';

/** 复刻 Next.js 对 matcher 的编译方式 */
function matches(pathname: string): boolean {
  return config.matcher.some((pattern) => {
    // '/api/:path*' 这类命名参数语法转成等价正则
    const source = pattern
      .replace(/\/:path\*/g, '(?:/.*)?')
      .replace(/\/:[a-zA-Z]+/g, '/[^/]+');
    return new RegExp(`^${source}$`).test(pathname);
  });
}

describe('middleware matcher', () => {
  it('覆盖需要 CSRF 校验的写操作 API', () => {
    // 这些端点会改状态，必须经过 middleware 的 Origin 校验
    for (const path of [
      '/api/create-checkout-session',
      '/api/contract/customer',
      '/api/withdrawal',
      '/api/admin/orders',
      '/api/whitelabel/screening/abc-123',
    ]) {
      expect(matches(path), `${path} 应当经过 middleware`).toBe(true);
    }
  });

  it('覆盖 webhook 与 cron（它们在函数体内被豁免，而不是靠 matcher 排除）', () => {
    // 豁免逻辑必须发生在 middleware 内部，这样豁免名单才是可读、可测的；
    // 用 matcher 排除会让豁免范围隐藏在正则里。
    expect(matches('/api/webhooks/stripe')).toBe(true);
    expect(matches('/api/stripe/webhook-subscription')).toBe(true);
    expect(matches('/api/cron/subscription-reminder')).toBe(true);
  });

  it('覆盖页面路由', () => {
    for (const path of ['/', '/login', '/g/xiaowang', '/admin/orders']) {
      expect(matches(path), `${path} 应当经过 middleware`).toBe(true);
    }
  });

  it('排除静态资源，避免无谓开销', () => {
    for (const path of [
      '/_next/static/chunks/main.js',
      '/_next/image',
      '/favicon.ico',
      '/images/logo.png',
      '/icons/wechat.svg',
    ]) {
      expect(matches(path), `${path} 不应经过 middleware`).toBe(false);
    }
  });
});
