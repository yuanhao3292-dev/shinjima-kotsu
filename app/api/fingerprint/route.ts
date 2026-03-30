import { NextRequest, NextResponse } from 'next/server';
import { generateFingerprintToken } from '@/lib/utils/fingerprint-token';

/**
 * POST /api/fingerprint
 * 接收客户端浏览器信号，服务端计算评分并签名，通过 Set-Cookie 返回。
 * 密钥仅存在于服务端（FP_SECRET），客户端无法伪造令牌。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signals } = body;

    if (!signals || typeof signals !== 'object') {
      return NextResponse.json({ error: 'Invalid signals' }, { status: 400 });
    }

    // 服务端计算 bot 评分（与原客户端逻辑一致）
    let score = 0;
    if (signals.webdriver === true) score += 25;
    if (signals.pluginCount === 0) score += 15;
    if (!signals.hasLanguage) score += 10;
    if (!signals.hasScreen || signals.screenWidth === 0 || signals.screenHeight === 0) score += 15;
    if (signals.suspiciousRenderer === true) score += 20;
    if (signals.noWebGL === true) score += 10;
    if (!signals.hasTimezone) score += 10;
    score = Math.min(score, 100);

    // 使用服务端密钥签名（不暴露给客户端）
    const fpSecret = process.env.FP_SECRET || process.env.NEXT_PUBLIC_FP_SECRET || 'fp-default-key';
    const token = await generateFingerprintToken(score, fpSecret);

    // 通过 Set-Cookie 返回签名令牌
    const response = NextResponse.json({ ok: true });
    response.cookies.set('__bfp', token, {
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
