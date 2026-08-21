import { NextRequest, NextResponse } from 'next/server';
import { EMAIL_FROM, buildEmailHtml, buildBanner, buildInfoCard } from '@/lib/email-template';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase/api';

/**
 * 订阅到期提醒定时任务
 *
 * 每天运行一次，检查即将到期的订阅并发送提醒
 * 配置方法：在 vercel.json 中添加 cron 配置
 *
 * GET /api/cron/subscription-reminder
 */

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // 验证 Cron 密钥（防止未授权访问）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // 安全修复：生产环境必须配置 CRON_SECRET
  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    console.error('CRON_SECRET is not configured in production');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // 验证 Bearer Token
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 开发环境警告
  if (!cronSecret && process.env.NODE_ENV !== 'production') {
    console.warn('Warning: CRON_SECRET not set, skipping auth in development');
  }

  const supabase = getSupabaseAdmin();
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  if (!resend) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
  }

  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 幂等性：排除 24 小时内已发过提醒的导游
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // 查找 3 天内即将到期的订阅
    const { data: expiringSoon, error: soonError } = await supabase
      .from('guides')
      .select('id, name, email, subscription_end_date')
      .eq('subscription_status', 'active')
      .lte('subscription_end_date', threeDaysLater.toISOString())
      .gt('subscription_end_date', now.toISOString())
      .or(`last_subscription_reminder_at.is.null,last_subscription_reminder_at.lt.${oneDayAgo}`);

    // 查找 7 天内即将到期的订阅（首次提醒）
    const { data: expiringWeek, error: weekError } = await supabase
      .from('guides')
      .select('id, name, email, subscription_end_date')
      .eq('subscription_status', 'active')
      .lte('subscription_end_date', sevenDaysLater.toISOString())
      .gt('subscription_end_date', threeDaysLater.toISOString())
      .or(`last_subscription_reminder_at.is.null,last_subscription_reminder_at.lt.${oneDayAgo}`);

    const results = {
      urgent: [] as string[],
      reminder: [] as string[],
      errors: [] as string[],
    };

    // 发送紧急提醒（3 天内到期）
    for (const guide of (expiringSoon || [])) {
      if (!guide.email) continue;

      const daysLeft = Math.ceil(
        (new Date(guide.subscription_end_date).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      );

      try {
        await resend.emails.send({
          from: EMAIL_FROM.partner,
          to: guide.email,
          subject: `⚠️ 紧急提醒：您的白标订阅将在 ${daysLeft} 天后到期`,
          html: generateReminderEmail(guide.name, daysLeft, true),
        });
        // 标记已发送，防止重复
        await supabase.from('guides').update({ last_subscription_reminder_at: new Date().toISOString() }).eq('id', guide.id);
        results.urgent.push(guide.email);
      } catch (err: any) {
        results.errors.push(`${guide.email}: ${err.message}`);
      }
    }

    // 发送普通提醒（7 天内到期）
    for (const guide of (expiringWeek || [])) {
      if (!guide.email) continue;

      const daysLeft = Math.ceil(
        (new Date(guide.subscription_end_date).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      );

      try {
        await resend.emails.send({
          from: EMAIL_FROM.partner,
          to: guide.email,
          subject: `📅 提醒：您的白标订阅将在 ${daysLeft} 天后到期`,
          html: generateReminderEmail(guide.name, daysLeft, false),
        });
        await supabase.from('guides').update({ last_subscription_reminder_at: new Date().toISOString() }).eq('id', guide.id);
        results.reminder.push(guide.email);
      } catch (err: any) {
        results.errors.push(`${guide.email}: ${err.message}`);
      }
    }

    console.log('Subscription reminder results:', results);

    return NextResponse.json({
      success: true,
      sent: {
        urgent: results.urgent.length,
        reminder: results.reminder.length,
      },
      errors: results.errors.length,
    });
  } catch (error: unknown) {
    console.error('Subscription reminder error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '服务器错误' }, { status: 500 });
  }
}

function generateReminderEmail(name: string, daysLeft: number, isUrgent: boolean): string {
  return buildEmailHtml({
    headerTitle: 'NIIJIMA',
    iconEmoji: isUrgent ? '&#9888;' : '&#128197;',
    iconBgColor: isUrgent ? '#fef2f2' : '#fef6f4',
    statusTitle: '订阅到期提醒',
    statusSubtitle: `${name || '尊敬的合伙人'}，您好`,
    contentSections: [
      ...(isUrgent ? [buildBanner('⚠️ 订阅即将到期，请尽快续费以避免服务中断', { bgGradient: '#fef2f2', borderColor: '#fecaca', textColor: '#dc2626' })] : []),
      buildInfoCard('', `
        <div style="text-align: center;">
          <p style="color: #b13e22; font-size: 48px; font-weight: 700; margin: 0;">${daysLeft}</p>
          <p style="color: #78716a; font-size: 16px; margin: 8px 0 0;">天后到期</p>
        </div>`),
      buildInfoCard('', `<p style="color: #58534e; font-size: 14px; line-height: 1.7; margin: 0; text-align: center;">您的白标页面订阅将在 ${daysLeft} 天后到期。为了避免服务中断，请及时续费。</p>`),
    ],
    ctaText: '立即续费',
    ctaUrl: 'https://niijima-koutsu.jp/guide-partner/whitelabel',
    footerCompanyName: '新島交通株式會社',
    footerDisclaimer: '此邮件由系统自动发送',
  });
}
