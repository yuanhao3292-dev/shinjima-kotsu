/**
 * Health Screening API
 * POST: 创建新的筛查记录
 * GET: 获取用户的筛查历史和剩余免费次数
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FREE_SCREENING_LIMIT } from '@/lib/screening-questions';

/**
 * 获取本周的开始时间（周一 00:00:00 UTC+8）
 */
function getWeekStart(): Date {
  const now = new Date();
  // 调整到东八区
  const utc8Offset = 8 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + utc8Offset);

  const day = localNow.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? 6 : day - 1; // 计算距离周一的天数

  const weekStart = new Date(localNow);
  weekStart.setUTCDate(localNow.getUTCDate() - diff);
  weekStart.setUTCHours(0, 0, 0, 0);

  // 转回 UTC
  return new Date(weekStart.getTime() - utc8Offset);
}

/**
 * 检查并更新用户的周次数
 * 如果是新的一周，重置免费次数
 */
async function getOrResetWeeklyUsage(
  supabase: any,
  userId: string
): Promise<{ freeRemaining: number; totalUsed: number; weekStart: string }> {
  const currentWeekStart = getWeekStart();
  const weekStartStr = currentWeekStart.toISOString();

  // 获取现有 usage 记录
  const { data: usage, error } = await supabase
    .from('screening_usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  // 如果没有记录，创建新记录
  if (error && error.code === 'PGRST116') {
    const { data: newUsage, error: insertError } = await supabase
      .from('screening_usage')
      .insert({
        user_id: userId,
        free_remaining: FREE_SCREENING_LIMIT,
        total_used: 0,
        week_start: weekStartStr,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert usage error:', insertError);
      throw new Error(`创建用量记录失败: ${insertError.message || insertError.code}`);
    }

    return {
      freeRemaining: FREE_SCREENING_LIMIT,
      totalUsed: 0,
      weekStart: weekStartStr,
    };
  }

  if (error) {
    throw new Error('查询用量记录失败');
  }

  // 检查是否需要重置（新的一周）
  const usageWeekStart = usage.week_start ? new Date(usage.week_start) : null;
  const needsReset = !usageWeekStart || usageWeekStart < currentWeekStart;

  if (needsReset) {
    // 重置为新的一周
    const { error: updateError } = await supabase
      .from('screening_usage')
      .update({
        free_remaining: FREE_SCREENING_LIMIT,
        week_start: weekStartStr,
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Reset weekly usage error:', updateError);
      throw new Error(`重置周用量失败: ${updateError.message || updateError.code}`);
    }

    return {
      freeRemaining: FREE_SCREENING_LIMIT,
      totalUsed: usage.total_used || 0,
      weekStart: weekStartStr,
    };
  }

  return {
    freeRemaining: usage.free_remaining,
    totalUsed: usage.total_used || 0,
    weekStart: usage.week_start,
  };
}

// POST: 创建新的筛查记录
export async function POST(request: NextRequest) {
  try {
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

    // 检查用户的本周免费额度
    let usageInfo;
    try {
      usageInfo = await getOrResetWeeklyUsage(supabase, user.id);
    } catch (err: any) {
      console.error('Usage check error:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // 检查是否还有免费次数
    if (usageInfo.freeRemaining <= 0) {
      return NextResponse.json(
        {
          error: '本週免費筛查次數已用完，下週一將自動重置',
          freeRemaining: 0,
        },
        { status: 403 }
      );
    }

    // 创建新的筛查记录
    const { data: screening, error: createError } = await supabase
      .from('health_screenings')
      .insert({
        user_id: user.id,
        user_email: user.email,
        status: 'in_progress',
        answers: [],
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating screening:', createError);
      return NextResponse.json({ error: '創建筛查記錄失敗' }, { status: 500 });
    }

    return NextResponse.json({
      screeningId: screening.id,
      freeRemaining: usageInfo.freeRemaining,
      message: '筛查記錄已創建',
    });
  } catch (error: unknown) {
    console.error('Health screening POST error:', error);
    return NextResponse.json({ error: '系統錯誤，請稍後重試' }, { status: 500 });
  }
}

// GET: 获取用户的筛查历史和剩余免费次数
export async function GET(request: NextRequest) {
  try {
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

    // 获取用户的本周 usage 记录（自动重置如果是新的一周）
    let usageInfo;
    try {
      usageInfo = await getOrResetWeeklyUsage(supabase, user.id);
    } catch (err: any) {
      console.error('Usage check error:', err);
      usageInfo = {
        freeRemaining: FREE_SCREENING_LIMIT,
        totalUsed: 0,
      };
    }

    // 获取筛查历史
    const { data: screenings, error: screeningsError } = await supabase
      .from('health_screenings')
      .select('id, status, created_at, completed_at, analysis_result')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (screeningsError) {
      console.error('Error fetching screenings:', screeningsError);
      return NextResponse.json(
        { error: '獲取筛查歷史失敗' },
        { status: 500 }
      );
    }

    // 处理筛查记录，只返回必要信息
    const processedScreenings = (screenings || []).map((s) => ({
      id: s.id,
      status: s.status,
      createdAt: s.created_at,
      completedAt: s.completed_at,
      hasResult: !!s.analysis_result,
      riskLevel: s.analysis_result?.riskLevel || null,
    }));

    return NextResponse.json({
      screenings: processedScreenings,
      freeRemaining: usageInfo.freeRemaining,
      totalUsed: usageInfo.totalUsed,
    });
  } catch (error: unknown) {
    console.error('Health screening GET error:', error);
    return NextResponse.json({ error: '系統錯誤，請稍後重試' }, { status: 500 });
  }
}
