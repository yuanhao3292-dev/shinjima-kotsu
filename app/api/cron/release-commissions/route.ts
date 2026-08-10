import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

/**
 * 到期佣金释放定时任务
 *
 * 对全体导游批量把已过 14 天等待期(commission_available_at <= now)的佣金
 * 从 'calculated' 释放为 'available',并按净额累加到 available_balance。
 *
 * 此前状态推进只在导游打开提现页时触发,导致不看提现页的导游佣金永远卡在
 * calculated。本 cron 作为安全网,每日兜底释放。
 *
 * GET /api/cron/release-commissions
 */

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // 验证 Cron 密钥（防止未授权访问）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    console.error('CRON_SECRET is not configured in production');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!cronSecret && process.env.NODE_ENV !== 'production') {
    console.warn('Warning: CRON_SECRET not set, skipping auth in development');
  }

  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.rpc('release_all_matured_commissions');

    if (error) {
      console.error('[cron/release-commissions] RPC 失败:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[cron/release-commissions] 释放结果:', JSON.stringify(data));
    return NextResponse.json({ success: true, ...(data as object) });
  } catch (err) {
    console.error('[cron/release-commissions] 异常:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
