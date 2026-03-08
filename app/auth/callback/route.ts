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
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // 验证 x-forwarded-host 是否为允许的域名
        const allowedHostPatterns = [
          'niijima-koutsu.jp',
          'www.niijima-koutsu.jp',
        ];
        const isAllowedHost =
          allowedHostPatterns.includes(forwardedHost) ||
          forwardedHost.endsWith('.vercel.app'); // Vercel 预览部署

        if (isAllowedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        }
        // 不在白名单中的 host，使用 origin
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // 如果出错，重定向到错误页面
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
