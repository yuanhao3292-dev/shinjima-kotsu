/**
 * Health Passport — 年度复查提醒 Cron Job
 *
 * 每月 1 日 09:00 UTC 执行。
 * 查找距上次筛查 11 个月+的用户，发送 4 语言个性化复查提醒邮件。
 *
 * GET /api/cron/health-checkup-reminder
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { buildEmailHtml } from '@/lib/email-template';
import {
  type EmailLocale,
  t,
  common,
  healthCheckupReminder as i18n,
} from '@/lib/email-i18n';

export const maxDuration = 60;

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
    const usersToNotify: Array<{ userId: string; healthScore: number; riskLevel: string; lastDate: string }> = [];
    for (const [userId, snap] of latestPerUser) {
      if (!recentUserIds.has(userId)) {
        usersToNotify.push({
          userId,
          healthScore: snap.health_score,
          riskLevel: snap.risk_level,
          lastDate: snap.created_at,
        });
      }
    }

    // 获取用户邮箱并发送
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

        // 语言检测: user_metadata.locale → 默认 'ja'
        const rawLocale = authUser?.user?.user_metadata?.locale as string | undefined;
        const locale: EmailLocale = (['ja', 'zh-CN', 'zh-TW', 'en'].includes(rawLocale ?? '') ? rawLocale : 'ja') as EmailLocale;

        const isHighRisk = u.riskLevel === 'high';
        const subject = t(isHighRisk ? i18n.subjectHighRisk : i18n.subject, locale)
          .replace('{{months}}', String(monthsSince));

        const html = buildReminderEmail(locale, u.riskLevel, u.healthScore, monthsSince, isHighRisk);

        await resend.emails.send({
          from: 'NIIJIMA Health <health@niijima-koutsu.jp>',
          to: email,
          subject,
          html,
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

function buildReminderEmail(
  locale: EmailLocale,
  riskLevel: string,
  healthScore: number,
  months: number,
  isHighRisk: boolean,
): string {
  const scoreColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : '#ef4444';
  const urgencyColor = isHighRisk ? '#dc2626' : '#f59e0b';
  const urgencyBg = isHighRisk ? '#fef2f2' : '#fffbeb';

  const statsSection = `
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="display: flex; justify-content: space-around; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="text-align: center; padding: 20px; background: ${urgencyBg}; border-radius: 12px 0 0 12px;">
                <p style="color: ${urgencyColor}; font-size: 36px; font-weight: 700; margin: 0;">${months}</p>
                <p style="color: ${urgencyColor}; font-size: 12px; margin: 6px 0 0;">${t(i18n.monthsLabel, locale)} (${t(i18n.monthsUnit, locale)})</p>
              </td>
              <td width="50%" style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 0 12px 12px 0;">
                <p style="color: ${scoreColor}; font-size: 36px; font-weight: 700; margin: 0;">${healthScore}</p>
                <p style="color: #6b7280; font-size: 12px; margin: 6px 0 0;">${t(i18n.lastScoreLabel, locale)}</p>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>`;

  const message = t(isHighRisk ? i18n.messageHighRisk : i18n.message, locale);
  const messageSection = `
    <tr>
      <td style="padding: 0 30px 30px;">
        <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0;">${message}</p>
      </td>
    </tr>`;

  return buildEmailHtml({
    headerTitle: 'NIIJIMA',
    headerSubtitle: 'Health Passport',
    headerGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    iconEmoji: isHighRisk ? '⚠️' : '🏥',
    iconBgColor: isHighRisk ? '#fef2f2' : '#ecfdf5',
    statusTitle: t(isHighRisk ? i18n.statusTitleHighRisk : i18n.statusTitle, locale),
    statusTitleColor: isHighRisk ? '#991b1b' : '#065f46',
    contentSections: [statsSection, messageSection],
    ctaText: t(i18n.ctaText, locale),
    ctaUrl: 'https://niijima-koutsu.jp/health-screening',
    ctaGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    footerCompanyName: t(common.footerCompany, locale),
    footerSubtitle: 'Health Passport',
    footerDisclaimer: t(common.footerDisclaimer, locale),
  });
}
