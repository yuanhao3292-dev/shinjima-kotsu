/**
 * Health Passport — 年度复查提醒 Cron Job
 *
 * 每月 1 日 09:00 UTC 执行。
 * 查找距上次筛查 11 个月+的用户，发送个性化复查提醒邮件。
 *
 * GET /api/cron/health-checkup-reminder
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase/api';

export async function GET(request: NextRequest) {
  // 验证 Cron 密钥
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    console.error('CRON_SECRET is not configured in production');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  if (!resend) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
  }

  try {
    const elevenMonthsAgo = new Date();
    elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);

    // 查找距上次筛查 11 个月+的用户最新快照
    const { data: dueSnapshots, error: queryError } = await supabase
      .from('health_snapshots')
      .select('user_id, health_score, risk_level, created_at')
      .lte('created_at', elevenMonthsAgo.toISOString())
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('[HealthReminder] Query error:', queryError.message);
      return NextResponse.json({ error: 'Query failed' }, { status: 500 });
    }

    // 去重：每个用户只取最新的一条
    const latestPerUser = new Map<string, typeof dueSnapshots[0]>();
    for (const snap of dueSnapshots ?? []) {
      if (!latestPerUser.has(snap.user_id)) {
        latestPerUser.set(snap.user_id, snap);
      }
    }

    // 排除：近 30 天内有新快照的用户（说明已经做了复查）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentSnapshots } = await supabase
      .from('health_snapshots')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const recentUserIds = new Set((recentSnapshots ?? []).map(s => s.user_id));

    // 过滤掉最近已复查的用户
    const usersToNotify: Array<{ userId: string; riskLevel: string; lastDate: string }> = [];
    for (const [userId, snap] of latestPerUser) {
      if (!recentUserIds.has(userId)) {
        usersToNotify.push({
          userId,
          riskLevel: snap.risk_level,
          lastDate: snap.created_at,
        });
      }
    }

    // 获取用户邮箱
    const results = { sent: 0, skipped: 0, errors: 0 };

    for (const u of usersToNotify) {
      try {
        const { data: authUser } = await supabase.auth.admin.getUserById(u.userId);
        const email = authUser?.user?.email;
        if (!email) {
          results.skipped++;
          continue;
        }

        const monthsSince = Math.floor(
          (Date.now() - new Date(u.lastDate).getTime()) / (30.44 * 24 * 60 * 60 * 1000)
        );

        await resend.emails.send({
          from: 'NIIJIMA Health <health@niijima-koutsu.jp>',
          to: email,
          subject: getSubject(u.riskLevel, monthsSince),
          html: generateReminderEmail(u.riskLevel, monthsSince),
        });

        results.sent++;
      } catch (err) {
        console.warn('[HealthReminder] Send error for user:', u.userId);
        results.errors++;
      }
    }

    console.log('[HealthReminder] Results:', results);

    return NextResponse.json({
      success: true,
      candidates: usersToNotify.length,
      ...results,
    });
  } catch (error) {
    console.error('[HealthReminder] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function getSubject(riskLevel: string, months: number): string {
  if (riskLevel === 'high') {
    return `Your annual health checkup is overdue (${months} months)`;
  }
  return `Time for your annual health screening (${months} months since last visit)`;
}

function generateReminderEmail(riskLevel: string, months: number): string {
  const urgencyColor = riskLevel === 'high' ? '#dc2626' : '#f59e0b';
  const urgencyBg = riskLevel === 'high' ? '#fef2f2' : '#fffbeb';
  const message =
    riskLevel === 'high'
      ? 'Your previous screening detected elevated health risks. We strongly recommend scheduling your annual follow-up checkup.'
      : 'Regular health screenings are the best form of prevention. It has been a while since your last checkup.';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">

<tr><td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:24px;">NIIJIMA</h1>
<p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;">Health Passport</p>
</td></tr>

<tr><td style="padding:40px 30px 20px;text-align:center;">
<div style="background:${urgencyBg};border-radius:12px;padding:24px;margin-bottom:20px;">
<p style="color:${urgencyColor};font-size:48px;font-weight:700;margin:0;">${months}</p>
<p style="color:${urgencyColor};font-size:16px;margin:8px 0 0;">months since last screening</p>
</div>
<p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">${message}</p>
<a href="https://niijima-koutsu.jp/health-screening"
   style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
  Schedule Your Checkup
</a>
</td></tr>

<tr><td style="background:#f8fafc;padding:20px 30px;text-align:center;">
<p style="color:#9ca3af;font-size:12px;margin:0;">
NIIJIMA KOUTSU Co., Ltd. | Japan Precision Health Screening
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
