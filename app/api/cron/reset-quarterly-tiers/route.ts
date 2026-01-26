import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

/**
 * 季度等级重置定时任务
 *
 * 每季度初（1月1日、4月1日、7月1日、10月1日）运行
 * 重新计算所有导游的佣金等级
 *
 * GET /api/cron/reset-quarterly-tiers
 *
 * 环境变量：
 * - CRON_SECRET: 用于验证请求的密钥
 */
export async function GET(request: NextRequest) {
  // 验证 Cron 密钥（防止未授权访问）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // 安全修复：生产环境必须配置 CRON_SECRET
  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    console.error('[reset-quarterly-tiers] CRON_SECRET is not configured in production');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // 验证 Bearer Token
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 开发环境警告
  if (!cronSecret && process.env.NODE_ENV !== 'production') {
    console.warn('[reset-quarterly-tiers] Warning: CRON_SECRET not set, skipping auth in development');
  }

  const supabase = getSupabaseAdmin();

  try {
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const year = now.getFullYear();
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);

    console.log(`[reset-quarterly-tiers] 开始执行 ${year}年第${quarter}季度等级重置`);

    // 调用数据库函数重置等级
    const { data: affectedCount, error: resetError } = await supabase
      .rpc('reset_quarterly_tiers');

    if (resetError) {
      console.error('[reset-quarterly-tiers] 执行失败:', resetError);
      return NextResponse.json({
        success: false,
        error: resetError.message,
      }, { status: 500 });
    }

    // 记录重置日志
    const { error: logError } = await supabase
      .from('tier_reset_logs')
      .insert({
        quarter_start: quarterStart.toISOString().split('T')[0],
        affected_guides: affectedCount || 0,
        executed_by: 'cron',
      });

    if (logError) {
      console.warn('[reset-quarterly-tiers] 日志记录失败:', logError);
    }

    console.log(`[reset-quarterly-tiers] 重置完成，影响 ${affectedCount} 位导游`);

    return NextResponse.json({
      success: true,
      quarter: `${year}Q${quarter}`,
      affected_guides: affectedCount,
      executed_at: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('[reset-quarterly-tiers] 执行异常:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '服务器错误',
    }, { status: 500 });
  }
}
