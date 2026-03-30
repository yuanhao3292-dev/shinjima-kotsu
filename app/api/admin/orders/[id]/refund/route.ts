import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { getStripeServer as getStripe } from '@/lib/stripe-server';
import { clawbackCommission } from '@/lib/refund';
import { sendRefundNotificationEmail } from '@/lib/email';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * POST /api/admin/orders/[id]/refund
 *
 * 管理员发起退款：
 * 1. 验证 admin 权限
 * 2. 查询订单 + payment_intent_id
 * 3. 幂等检查（防止重复退款）
 * 4. 调用 Stripe refund API（带 idempotency key + metadata）
 * 5. 更新订单状态 → refunded
 * 6. 撤回佣金（如有）
 * 7. 发送退款通知邮件（带重试）
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Admin 认证
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    const { id: orderId } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || '';
    const refundAmountInput: number | undefined = typeof body.amount === 'number' && body.amount > 0
      ? body.amount
      : undefined;

    const supabase = getSupabaseAdmin();
    const stripe = getStripe();

    // 2. 查询订单
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, payment_intent_id, total_amount_jpy, commission_amount, referred_by_guide_id, customer_id, package_id, stripe_refund_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return createErrorResponse(Errors.notFound('order'));
    }

    // 3. 幂等检查 — 已退款或已有 stripe_refund_id
    if (order.status === 'refunded') {
      return createErrorResponse(Errors.business('订单已退款', 'ALREADY_REFUNDED'));
    }
    if (order.stripe_refund_id) {
      return createErrorResponse(Errors.business('订单退款正在处理中', 'REFUND_IN_PROGRESS'));
    }

    // 4. 验证订单状态可退款（paid/confirmed/completed 均可）
    const refundableStatuses = ['paid', 'confirmed', 'completed'];
    if (!refundableStatuses.includes(order.status)) {
      return createErrorResponse(Errors.business(
        `只有已付款、已确认或已完成的订单才能退款（当前状态: ${order.status}）`,
        'INVALID_STATUS'
      ));
    }
    if (!order.payment_intent_id) {
      return createErrorResponse(Errors.business('订单缺少支付信息，请在 Stripe Dashboard 手动退款', 'NO_PAYMENT_INTENT'));
    }

    // 5. 验证退款金额
    const refundAmount = refundAmountInput || order.total_amount_jpy;
    if (refundAmount > order.total_amount_jpy) {
      return createErrorResponse(Errors.business('退款金额不能超过订单总额', 'INVALID_REFUND_AMOUNT'));
    }

    // 6. 调用 Stripe 退款（带 idempotency key 防重复 + metadata 方便对账）
    let refund: Stripe.Refund;
    try {
      refund = await stripe.refunds.create({
        payment_intent: order.payment_intent_id,
        amount: refundAmount,
        reason: 'requested_by_customer',
        metadata: {
          order_id: orderId,
          admin_email: authResult.email || '',
          refund_reason: reason || 'admin_initiated',
        },
      }, {
        idempotencyKey: `refund_${orderId}`,
      });
    } catch (stripeError: any) {
      console.error('[Admin Refund] Stripe refund failed:', stripeError);
      return createErrorResponse(
        Errors.business(`Stripe 退款失败: ${stripeError.message}`, 'STRIPE_REFUND_FAILED')
      );
    }

    // 7. 更新订单状态
    const isFullRefund = refundAmount >= order.total_amount_jpy;
    await supabase
      .from('orders')
      .update({
        status: isFullRefund ? 'refunded' : order.status,
        commission_status: order.commission_amount > 0 ? 'clawed_back' : undefined,
        refunded_at: new Date().toISOString(),
        refund_reason: reason || null,
        stripe_refund_id: refund.id,
        refund_amount_jpy: refundAmount,
        refunded_by_admin_email: authResult.email || null,
      })
      .eq('id', orderId);

    console.log(`[Admin Refund] Order ${orderId} refunded ¥${refundAmount} by admin ${authResult.email}, stripe_refund=${refund.id}`);

    // 8. 撤回佣金（全额退款时）
    if (isFullRefund && order.referred_by_guide_id && order.commission_amount > 0) {
      await clawbackCommission(supabase, orderId, order.referred_by_guide_id, order.commission_amount);
    }

    // 9. 发送退款通知邮件（带重试）
    const { data: customer } = await supabase
      .from('customers')
      .select('email, name')
      .eq('id', order.customer_id)
      .single();

    let packageName = '';
    if (order.package_id) {
      const { data: pkg } = await supabase
        .from('medical_packages')
        .select('name_zh_tw')
        .eq('id', order.package_id)
        .single();
      packageName = pkg?.name_zh_tw || '';
    }

    if (customer?.email) {
      // 带重试的邮件发送（最多 2 次重试）
      const sendWithRetry = async (attempt = 1) => {
        const result = await sendRefundNotificationEmail({
          customerEmail: customer.email,
          customerName: customer.name || '',
          packageName,
          refundAmount,
          orderId,
          reason: reason || undefined,
          stripeRefundId: refund.id,
        });
        if (!result.success && attempt < 3) {
          console.warn(`[Admin Refund] Email attempt ${attempt} failed, retrying...`);
          await new Promise(r => setTimeout(r, 1000 * attempt));
          return sendWithRetry(attempt + 1);
        }
        if (!result.success) {
          console.error(`[Admin Refund] Email failed after ${attempt} attempts for order ${orderId}`);
        }
      };
      sendWithRetry().catch(() => {});
    }

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refundAmount,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/orders/[id]/refund', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
