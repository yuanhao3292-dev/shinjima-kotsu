import { NextRequest, NextResponse } from 'next/server';
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
          from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
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
          from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
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
  const urgentBanner = isUrgent ? `
    <tr>
      <td style="padding: 0 30px 20px;">
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; text-align: center;">
          <span style="font-size: 24px;">⚠️</span>
          <p style="color: #dc2626; font-weight: 600; margin: 8px 0 0;">订阅即将到期，请尽快续费以避免服务中断</p>
        </div>
      </td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">NIIJIMA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Guide Partner Program</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <h2 style="color: #1e293b; margin: 0 0 10px; font-size: 24px;">订阅到期提醒</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">${name || '尊敬的合伙人'}，您好</p>
            </td>
          </tr>

          ${urgentBanner}

          <tr>
            <td style="padding: 0 30px 20px; text-align: center;">
              <div style="background-color: #fff7ed; border-radius: 12px; padding: 24px;">
                <p style="color: #9a3412; font-size: 48px; font-weight: 700; margin: 0;">${daysLeft}</p>
                <p style="color: #c2410c; font-size: 16px; margin: 8px 0 0;">天后到期</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                您的白标页面订阅将在 ${daysLeft} 天后到期。为了避免服务中断，请及时续费。
              </p>
              <a href="https://niijima-koutsu.jp/guide-partner/whitelabel"
                 style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                立即续费
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                如有任何问题，请联系我们的客服团队
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
