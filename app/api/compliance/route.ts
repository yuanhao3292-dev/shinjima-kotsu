import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 获取所有合规审查记录
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 检查管理员权限
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const quarter = searchParams.get('quarter');

    let query = supabase
      .from('compliance_review_records')
      .select('*')
      .order('review_due_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (quarter) {
      query = query.eq('review_quarter', quarter);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Fetch compliance reviews error:', error);
      return NextResponse.json(
        { error: '获取审查记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Get compliance error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新合规审查记录
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 检查管理员权限
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewId, tasks, notes, status } = body;

    if (!reviewId) {
      return NextResponse.json(
        { error: '缺少审查记录ID' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (tasks) {
      updateData.tasks = tasks;

      // 检查是否所有任务都完成了
      const allCompleted = tasks.every((t: any) => t.status === 'completed');
      if (allCompleted) {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = user.id;
      } else {
        updateData.status = 'in_progress';
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (status) {
      updateData.status = status;
    }

    const { data: updatedReview, error: updateError } = await supabase
      .from('compliance_review_records')
      .update(updateData)
      .eq('id', reviewId)
      .select()
      .single();

    if (updateError) {
      console.error('Update compliance review error:', updateError);
      return NextResponse.json(
        { error: '更新审查记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: '审查记录更新成功',
    });
  } catch (error) {
    console.error('Update compliance error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 创建新的合规审查记录（通常由定时任务调用）
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 检查管理员权限
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewQuarter, reviewDueDate, tasks } = body;

    if (!reviewQuarter || !reviewDueDate || !tasks) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查是否已存在该季度的审查记录
    const { data: existing } = await supabase
      .from('compliance_review_records')
      .select('id')
      .eq('review_quarter', reviewQuarter)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: '该季度的审查记录已存在' },
        { status: 400 }
      );
    }

    const { data: newReview, error: insertError } = await supabase
      .from('compliance_review_records')
      .insert({
        review_quarter: reviewQuarter,
        review_due_date: reviewDueDate,
        tasks,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Create compliance review error:', insertError);
      return NextResponse.json(
        { error: '创建审查记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      message: '审查记录创建成功',
    });
  } catch (error) {
    console.error('Create compliance error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
