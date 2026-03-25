import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { Resend } from 'resend';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { escapeHtml } from '@/lib/utils/html-escape';
import { validateBody } from '@/lib/validations/validate';
import { WithdrawalActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * 管理员提现管理 API
 *
 * GET /api/admin/withdrawals - 获取提现申请列表
 * POST /api/admin/withdrawals - 处理提现申请（批准/拒绝/完成）
 */

export async function GET(request: NextRequest) {
  // GET 端点速率限制（防数据枚举攻击）
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/withdrawals:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  try {
    let query = supabase
      .from('withdrawal_requests')
      .select(`
        *,
        guide:guides(id, name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: withdrawals, error } = await query.limit(100);

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/withdrawals', method: 'GET' });
      return createErrorResponse(Errors.internal('获取提现列表失败'));
    }

    // 获取统计数据
    const { data: stats } = await supabase
      .from('withdrawal_requests')
      .select('status, amount')
      .in('status', ['pending', 'approved', 'processing']);

    const statsMap = {
      pending: { count: 0, amount: 0 },
      approved: { count: 0, amount: 0 },
      processing: { count: 0, amount: 0 },
    };

    stats?.forEach(s => {
      if (statsMap[s.status as keyof typeof statsMap]) {
        statsMap[s.status as keyof typeof statsMap].count++;
        statsMap[s.status as keyof typeof statsMap].amount += Number(s.amount);
      }
    });

    return NextResponse.json({
      withdrawals: withdrawals || [],
      stats: statsMap,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/withdrawals', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/withdrawals`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // 使用 Zod 验证输入
    const validation = await validateBody(request, WithdrawalActionSchema);
    if (!validation.success) return validation.error;
    const { withdrawalId, action, reviewNote, paymentReference } = validation.data;

    const supabase = getSupabaseAdmin();

    // 获取提现申请
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawal_requests')
      .select(`
        *,
        guide:guides(id, name, email)
      `)
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) {
      return NextResponse.json({ error: '提现申请不存在' }, { status: 404 });
    }

    // 状态流转验证
    const allowedTransitions: Record<string, string[]> = {
      pending: ['approve', 'reject'],
      approved: ['process', 'reject'],
      processing: ['complete'],
    };

    if (!allowedTransitions[withdrawal.status]?.includes(action)) {
      return NextResponse.json({
        error: `当前状态 (${withdrawal.status}) 不允许执行 ${action} 操作`
      }, { status: 400 });
    }

    // 构建更新数据
    const updateData: Record<string, any> = {};

    switch (action) {
      case 'approve':
        updateData.status = 'approved';
        updateData.reviewed_by = authResult.userId;
        updateData.reviewed_at = new Date().toISOString();
        updateData.review_note = reviewNote || null;
        break;

      case 'reject':
        updateData.status = 'rejected';
        updateData.reviewed_by = authResult.userId;
        updateData.reviewed_at = new Date().toISOString();
        updateData.review_note = reviewNote || null;
        break;

      case 'process':
        updateData.status = 'processing';
        break;

      case 'complete':
        if (!paymentReference) {
          return NextResponse.json({ error: '请提供转账凭证号' }, { status: 400 });
        }
        updateData.status = 'completed';
        updateData.payment_reference = paymentReference;
        updateData.payment_method = 'bank_transfer';
        updateData.paid_at = new Date().toISOString();
        break;
    }

    // 更新提现申请
    const { error: updateError } = await supabase
      .from('withdrawal_requests')
      .update(updateData)
      .eq('id', withdrawalId);

    if (updateError) {
      console.error('更新提现状态失败:', updateError);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    // 发送通知邮件
    if (resend && withdrawal.guide?.email) {
      const guide = withdrawal.guide;
      const amount = Number(withdrawal.amount).toLocaleString();

      let subject = '';
      let content = '';

      switch (action) {
        case 'approve':
          subject = '✅ 提现申请已批准';
          content = `您的 ¥${amount} 提现申请已批准，我们将尽快处理打款。`;
          break;
        case 'reject':
          subject = '❌ 提现申请被拒绝';
          content = `您的 ¥${amount} 提现申请被拒绝。${reviewNote ? `原因：${reviewNote}` : ''}`;
          break;
        case 'complete':
          subject = '💰 提现已到账';
          content = `您的 ¥${amount} 提现已完成打款，请查收。转账凭证号：${paymentReference}`;
          break;
      }

      if (subject && content) {
        await resend.emails.send({
          from: 'NIIJIMA Partner <partner@niijima-koutsu.jp>',
          to: guide.email,
          subject,
          html: generateWithdrawalEmail(guide.name, subject, content),
        }).catch(err => {
          console.error('发送提现通知邮件失败:', err);
        });
      }
    }

    // 记录审计日志（失败时记录告警）
    const { error: auditError } = await supabase.from('audit_logs').insert({
      action: `withdrawal_${action}`,
      entity_type: 'withdrawal_request',
      entity_id: withdrawalId,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: {
        amount: withdrawal.amount,
        reviewNote,
        paymentReference,
      },
    });

    if (auditError) {
      console.error('[CRITICAL] 审计日志写入失败:', auditError);
    }

    const actionLabels: Record<string, string> = {
      approve: '已批准',
      reject: '已拒绝',
      process: '已开始处理',
      complete: '已完成打款',
    };

    return NextResponse.json({
      success: true,
      message: `提现申请${actionLabels[action]}`,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/withdrawals', method: 'POST' });
    return createErrorResponse(apiError);
  }
}

function generateWithdrawalEmail(name: string, title: string, content: string): string {
  const safeName = escapeHtml(name || '尊敬的合伙人');
  const safeTitle = escapeHtml(title);
  const safeContent = escapeHtml(content);
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
            <td style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #1e293b; margin: 0 0 10px; font-size: 24px;">${safeTitle}</h2>
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 16px;">${safeName}，您好</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                ${safeContent}
              </p>
              <a href="https://niijima-koutsu.jp/guide-partner/commission"
                 style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                查看详情
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
