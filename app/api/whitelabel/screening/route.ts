import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, guideSlug } = body;

    if (!sessionId || !guideSlug) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // IP 限流：同一 session_id 1小时内最多5次
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('whitelabel_screenings')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .gte('created_at', oneHourAgo);

    if (count && count >= 5) {
      return NextResponse.json(
        { error: '操作过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 获取客户端 IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    // 创建匿名筛查记录
    const { data, error } = await supabase
      .from('whitelabel_screenings')
      .insert({
        session_id: sessionId,
        guide_slug: guideSlug,
        ip_address: ip,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Create whitelabel screening error:', error);
      return NextResponse.json(
        { error: '创建筛查失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      screeningId: data.id,
    });
  } catch (error) {
    console.error('Whitelabel screening POST error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
