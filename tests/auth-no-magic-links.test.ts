/**
 * 认证流程不得依赖邮件魔法链接
 *
 * 起因：生产 Auth Logs 里出现过这样一组记录 ——
 *
 *   15:46:06  /recover  request completed              申请重置，邮件发出
 *   15:46:26  /verify   request completed              20 秒后令牌已被消费
 *   15:47:05  /verify   403: Email link is invalid     用户真正点击时已失效
 *
 * 用户不可能在 20 秒内收信并点开，是邮件安全扫描器在投递时预取了链接。
 * 魔法链接携带的是一次性令牌，谁先访问谁消费掉，因此用户拿到手的永远是
 * 死令牌 —— 密码重置曾因此完全不可用，注册确认走同一条路则更严重
 * （账号永远激活不了，用户直接流失）。
 *
 * 解法是全面改用验证码：扫描器只会访问链接，不会替人转录数字。
 * 这个测试锁住这个决定，防止有人无意中改回链接流程。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf-8');

describe('认证流程', () => {
  it('密码重置用 verifyOtp 而非依赖链接换会话', () => {
    const src = read('app/reset-password/page.tsx');
    expect(src, '重置页应当调用 verifyOtp').toContain('verifyOtp');
    expect(src, "重置页的 verifyOtp 类型应为 recovery").toContain("type: 'recovery'");
  });

  it('注册确认用 verifyOtp 而非依赖链接', () => {
    // 验证动作发生在独立的 /verify-email 页，注册页只负责发码并跳转
    const src = read('app/verify-email/page.tsx');
    expect(src, '验证页应当调用 verifyOtp').toContain('verifyOtp');
    expect(src, "验证页的 verifyOtp 类型应为 signup").toContain("type: 'signup'");

    const register = read('app/register/page.tsx');
    expect(register, '注册页应当跳转到验证页').toContain('/verify-email');
  });

  it('重置页在无会话时提供验证码入口，而不是死路一条', () => {
    const src = read('app/reset-password/page.tsx');
    // need-code 是流程的正常一环：用户去邮箱抄码时页面状态会丢失，
    // 回到这个固定地址必须能原地继续
    expect(src).toContain("'need-code'");
  });

  it('认证回跳地址不依赖 window.location.origin', () => {
    // www 与非 www 都可直接访问且互不跳转，用 origin 会让从非 www 进来的
    // 用户拿到不在 Supabase 白名单里的回跳地址
    for (const file of ['app/register/page.tsx', 'app/forgot-password/page.tsx']) {
      const src = read(file);
      const usesOrigin = /(?:emailRedirectTo|redirectTo)[^\n]*window\.location\.origin/.test(src);
      expect(usesOrigin, `${file} 不应用 window.location.origin 拼回跳地址`).toBe(false);
      expect(src, `${file} 应使用 authRedirectUrl`).toContain('authRedirectUrl');
    }
  });

  it('登录仍走密码，不引入邮件魔法链接', () => {
    for (const file of ['app/login/page.tsx', 'app/guide-partner/login/page.tsx']) {
      const src = read(file);
      expect(src, `${file} 应使用 signInWithPassword`).toContain('signInWithPassword');
      expect(src, `${file} 不应使用 signInWithOtp 魔法链接`).not.toContain('signInWithOtp');
    }
  });

  it('导游注册在服务端直接确认邮箱，不发确认邮件', () => {
    const src = read('app/api/guide/register/route.ts');
    expect(src).toContain('admin.createUser');
    expect(src, '导游账号应当免邮件确认').toContain('email_confirm: true');
  });

  it('验证码输入位于固定地址，而非发码页的临时状态', () => {
    // 这个坑踩过两次：密码重置和注册都曾把输入框做在发码页的 React 状态里。
    // 用户必须切到邮箱客户端抄码，回来时状态早已丢失，验证码无处可填。
    // 输入框必须在一个刷新不丢、可直接访问的地址上。
    for (const page of ['app/reset-password/page.tsx', 'app/verify-email/page.tsx']) {
      const src = read(page);
      expect(src, `${page} 应当自己承担验证码输入`).toContain('verifyOtp');
      expect(src, `${page} 应当有验证码输入框`).toMatch(/one-time-code/);
    }

    // 发码页只负责发码并跳转，不得自己渲染验证码输入框
    for (const page of ['app/register/page.tsx', 'app/forgot-password/page.tsx']) {
      const src = read(page);
      expect(src, `${page} 不应内嵌验证码输入框`).not.toMatch(/one-time-code/);
    }
  });
});
