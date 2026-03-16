import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/my-account';

  // 防止开放重定向：只允许相对路径
  if (!next.startsWith('/') || next.startsWith('//')) {
    next = '/my-account';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // 构造重定向 URL 的辅助函数
    const buildRedirectUrl = (path: string) => {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return `${origin}${path}`;
      } else if (forwardedHost) {
        const allowedHostPatterns = [
          'niijima-koutsu.jp',
          'www.niijima-koutsu.jp',
        ];
        const isAllowedHost =
          allowedHostPatterns.includes(forwardedHost) ||
          forwardedHost.endsWith('.vercel.app');

        if (isAllowedHost) {
          return `https://${forwardedHost}${path}`;
        }
      }
      return `${origin}${path}`;
    };

    if (!error) {
      return NextResponse.redirect(buildRedirectUrl(next));
    }

    // PKCE 交换失败（常见于用户在不同浏览器/邮件App中打开验证链接）
    // 邮箱已在 Supabase 侧验证成功，只是无法建立 session
    // 显示友好提示，引导用户登录
    return NextResponse.redirect(buildRedirectUrl('/login?verified=true'));
  }

  // 没有 code 参数，真正的错误
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
