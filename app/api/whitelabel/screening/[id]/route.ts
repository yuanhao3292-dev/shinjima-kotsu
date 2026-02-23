import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少 sessionId' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: screening, error } = await supabase
      .from('whitelabel_screenings')
      .select('*')
      .eq('id', id)
      .eq('session_id', sessionId)
      .single();

    if (error || !screening) {
      return NextResponse.json(
        { error: '筛查记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      screening: {
        id: screening.id,
        status: screening.status,
        answers: screening.answers || [],
        bodyMapData: screening.body_map_data,
        analysisResult: screening.analysis_result,
        createdAt: screening.created_at,
        completedAt: screening.completed_at,
      },
    });
  } catch (error) {
    console.error('Whitelabel screening GET error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sessionId, answers, bodyMapData } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少 sessionId' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 验证 session_id 所有权
    const { data: existing, error: fetchError } = await supabase
      .from('whitelabel_screenings')
      .select('id, status')
      .eq('id', id)
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: '筛查记录不存在' },
        { status: 404 }
      );
    }

    if (existing.status === 'completed') {
      return NextResponse.json(
        { error: '筛查已完成，无法修改' },
        { status: 400 }
      );
    }

    // 构建更新数据
    const updateData: Record<string, unknown> = {};
    if (answers !== undefined) {
      updateData.answers = answers;
    }
    if (bodyMapData !== undefined) {
      updateData.body_map_data = bodyMapData;
    }

    const { error: updateError } = await supabase
      .from('whitelabel_screenings')
      .update(updateData)
      .eq('id', id)
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Update whitelabel screening error:', updateError);
      return NextResponse.json(
        { error: '更新失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Whitelabel screening PATCH error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
