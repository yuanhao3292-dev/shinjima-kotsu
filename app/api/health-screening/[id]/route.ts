/**
 * Health Screening Detail API
 * GET: 获取单个筛查记录详情
 * PATCH: 更新筛查记录（保存答案）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: 获取单个筛查记录详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '請先登入後再使用此功能' },
        { status: 401 }
      );
    }

    // 获取筛查记录
    const { data: screening, error: fetchError } = await supabase
      .from('health_screenings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // 确保只能访问自己的记录
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: '找不到該筛查記錄' }, { status: 404 });
      }
      console.error('Error fetching screening:', fetchError);
      return NextResponse.json({ error: '獲取筛查記錄失敗' }, { status: 500 });
    }

    return NextResponse.json({
      screening: {
        id: screening.id,
        status: screening.status,
        answers: screening.answers,
        bodyMapData: screening.body_map_data,
        analysisResult: screening.analysis_result,
        createdAt: screening.created_at,
        completedAt: screening.completed_at,
        userEmail: screening.user_email,
      },
    });
  } catch (error: unknown) {
    console.error('Health screening GET [id] error:', error);
    return NextResponse.json({ error: '系統錯誤，請稍後重試' }, { status: 500 });
  }
}

// PATCH: 更新筛查记录（保存答案）
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '請先登入後再使用此功能' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answers, bodyMapData } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: '請提供有效的答案數據' },
        { status: 400 }
      );
    }

    // 验证筛查记录存在且属于当前用户
    const { data: existing, error: checkError } = await supabase
      .from('health_screenings')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json({ error: '找不到該筛查記錄' }, { status: 404 });
    }

    if (existing.status === 'completed') {
      return NextResponse.json(
        { error: '此筛查已完成，無法修改' },
        { status: 400 }
      );
    }

    // 更新答案和人体图数据
    const updateData: Record<string, any> = {
      answers: answers,
    };

    // 如果有人体图数据，也保存
    if (bodyMapData) {
      updateData.body_map_data = bodyMapData;
    }

    const { error: updateError } = await supabase
      .from('health_screenings')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating screening:', updateError);
      return NextResponse.json({ error: '保存答案失敗' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '答案已保存',
    });
  } catch (error: unknown) {
    console.error('Health screening PATCH error:', error);
    return NextResponse.json({ error: '系統錯誤，請稍後重試' }, { status: 500 });
  }
}
