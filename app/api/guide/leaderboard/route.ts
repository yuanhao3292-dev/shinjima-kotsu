import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

/**
 * 排行榜数据
 *
 * GET /api/guide/leaderboard?range=all|month|week
 *
 * 时间聚合必须在服务端做：bookings 表 RLS 只让导游看到自己的预订，
 * 客户端直接聚合会导致"本月/本周"榜单只剩登录者一人。这里用
 * service_role 跨全量读取，返回脱敏后的排名（不含任何可定位个人的信息）。
 */
export async function GET(request: NextRequest) {
  try {
    const range = request.nextUrl.searchParams.get('range') || 'all';
    const supabase = getSupabaseAdmin();

    // 全部已审核导游
    const { data: guides, error } = await supabase
      .from('guides')
      .select('id, name, commission_tier_code, total_commission, total_bookings')
      .eq('status', 'approved');

    if (error) {
      return NextResponse.json({ error: '加载失败' }, { status: 500 });
    }

    type Row = {
      id: string;
      name: string | null;
      commission_tier_code: string | null;
      total_commission: number | null;
      total_bookings: number | null;
    };
    const guideRows = (guides || []) as Row[];

    // 时间段口径：从 bookings 按 created_at 现算佣金
    let periodByGuide: Map<string, { commission: number; bookings: number }> | null = null;
    if (range === 'month' || range === 'week') {
      const now = new Date();
      const since = new Date(now);
      if (range === 'week') {
        since.setDate(now.getDate() - 7);
      } else {
        since.setMonth(now.getMonth(), 1);
        since.setHours(0, 0, 0, 0);
      }

      const { data: bookings } = await supabase
        .from('bookings')
        .select('guide_id, commission_amount')
        .gte('created_at', since.toISOString());

      periodByGuide = new Map();
      for (const b of (bookings || []) as { guide_id: string | null; commission_amount: number | null }[]) {
        if (!b.guide_id) continue;
        const prev = periodByGuide.get(b.guide_id) || { commission: 0, bookings: 0 };
        periodByGuide.set(b.guide_id, {
          commission: prev.commission + Number(b.commission_amount || 0),
          bookings: prev.bookings + 1,
        });
      }
    }

    const ranked = guideRows
      .map((g) => {
        const period = periodByGuide?.get(g.id);
        return {
          id: g.id,
          level: g.commission_tier_code || 'growth',
          // 姓名脱敏在服务端完成，绝不外泄完整姓名
          nameMasked: maskName(g.name || ''),
          commission: periodByGuide ? period?.commission ?? 0 : g.total_commission || 0,
          bookings: periodByGuide ? period?.bookings ?? 0 : g.total_bookings || 0,
        };
      })
      .filter((r) => r.commission > 0)
      .sort((a, b) => b.commission - a.commission)
      .slice(0, 50)
      .map((r, i) => ({ ...r, rank: i + 1 }));

    return NextResponse.json({ leaderboard: ranked });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/** 只保留姓氏首字，其余用 * —— 与原客户端逻辑一致 */
function maskName(name: string): string {
  if (!name) return '***';
  if (name.length <= 1) return name + '**';
  return name[0] + '*'.repeat(Math.max(1, name.length - 1));
}
