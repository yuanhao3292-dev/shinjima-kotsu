/**
 * 密码重置链接的状态判定
 *
 * 背景：线上出现过「邮件收到了，点开链接却提示已过期」。排查发现页面有三个问题：
 *
 *   1. useEffect 里直接 getSession()。supabase-js 需要**异步**解析 URL 里的
 *      凭证才能建立会话，这一查很可能在解析完成前返回 null —— 于是完全有效的
 *      链接也被判成"已过期"。这是最隐蔽的一个，只在慢网络/慢设备上稳定复现。
 *   2. Supabase 明明在回跳 URL 里放了 error_code（otp_expired 等），代码完全不读。
 *   3. 无法区分"链接失效"和"直接访问了本页"。
 *
 * 这里测的是从 URL 提取错误与凭证的纯函数部分——判定逻辑的输入。
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/** 与 app/reset-password/page.tsx 中的实现保持一致 */
function readSupabaseAuthError(): { code: string; description: string } | null {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  const code = query.get('error_code') || hash.get('error_code');
  const error = query.get('error') || hash.get('error');
  if (!code && !error) return null;

  return {
    code: code || error || 'unknown',
    description: query.get('error_description') || hash.get('error_description') || '',
  };
}

function hasPendingCredential(): boolean {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return Boolean(query.get('code') || hash.get('access_token') || hash.get('code'));
}

/** 在 jsdom 里改写当前地址 */
function setUrl(url: string) {
  window.history.replaceState({}, '', url);
}

describe('密码重置链接判定', () => {
  beforeEach(() => setUrl('/reset-password'));
  afterEach(() => setUrl('/reset-password'));

  describe('识别 Supabase 回报的错误', () => {
    it('读得到 query 里的 error_code', () => {
      setUrl('/reset-password?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired');
      expect(readSupabaseAuthError()).toEqual({
        code: 'otp_expired',
        description: 'Email link is invalid or has expired',
      });
    });

    it('读得到 hash 里的 error_code —— Supabase 两处都会放', () => {
      setUrl('/reset-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid');
      expect(readSupabaseAuthError()?.code).toBe('otp_expired');
    });

    it('只有 error 没有 error_code 时退回用 error', () => {
      setUrl('/reset-password?error=access_denied');
      expect(readSupabaseAuthError()?.code).toBe('access_denied');
    });

    it('正常链接不产生错误', () => {
      setUrl('/reset-password?code=abc123');
      expect(readSupabaseAuthError()).toBeNull();
    });
  });

  describe('识别待处理的恢复凭证', () => {
    it('PKCE 流：query 里的 code', () => {
      setUrl('/reset-password?code=pkce-auth-code');
      expect(hasPendingCredential()).toBe(true);
    });

    it('隐式流：hash 里的 access_token', () => {
      setUrl('/reset-password#access_token=jwt&refresh_token=r&type=recovery');
      expect(hasPendingCredential()).toBe(true);
    });

    it('直接访问本页时没有凭证 —— 应提示从邮件进入，而不是谎称链接过期', () => {
      setUrl('/reset-password');
      expect(hasPendingCredential()).toBe(false);
    });

    it('带 from=guide 但无凭证，仍然算无凭证', () => {
      setUrl('/reset-password?from=guide');
      expect(hasPendingCredential()).toBe(false);
    });

    it('错误回跳不算作有凭证', () => {
      setUrl('/reset-password?error=access_denied&error_code=otp_expired');
      expect(hasPendingCredential()).toBe(false);
    });
  });

  describe('三种入口的判定结果', () => {
    const decide = () => {
      if (readSupabaseAuthError()) return 'invalid:expired';
      if (hasPendingCredential()) return 'verifying';
      return 'invalid:missing';
    };

    it('从有效邮件链接进入 → 先进入验证中，等待会话建立', () => {
      setUrl('/reset-password?code=valid-code');
      expect(decide()).toBe('verifying');
    });

    it('令牌已失效 → 直接判定过期，不必等待', () => {
      setUrl('/reset-password?error=access_denied&error_code=otp_expired');
      expect(decide()).toBe('invalid:expired');
    });

    it('直接打开页面 → 提示应从邮件链接进入', () => {
      setUrl('/reset-password');
      expect(decide()).toBe('invalid:missing');
    });
  });
});
