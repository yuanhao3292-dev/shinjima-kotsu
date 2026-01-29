/**
 * 分销订单详情 API
 * ============================================
 * GET /api/whitelabel/orders/[id] - 获取订单详情
 * PATCH /api/whitelabel/orders/[id] - 更新订单状态（管理员操作）
 *
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMITS,
  createRateLimitHeaders,
} from '@/lib/utils/rate-limiter';
import {
  normalizeError,
  logError,
  createErrorResponse,
  Errors,
} from '@/lib/utils/api-errors';
import { validateBody } from '@/lib/validations/validate';
import { UpdateDistributionOrderSchema } from '@/lib/validations/api-schemas';
import { decryptCustomerPII, maskCustomerPII, type CustomerPII } from '@/lib/utils/encryption';

// ============================================
// Supabase 客户端
// ============================================

const getSupabase = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error('Supabase configuration is missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// ============================================
// 状态转换映射
// ============================================

const ACTION_TO_STATUS: Record<string, string> = {
  quote: 'quoted',
  request_deposit: 'deposit_pending',
  confirm_deposit: 'deposit_paid',
  start_service: 'in_progress',
  complete: 'completed',
  cancel: 'cancelled',
  refund: 'refunded',
};

// ============================================
// GET - 获取订单详情
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // 1. 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/orders/${orderId}`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);

    // 2. 检查是否需要完整 PII（管理员）
    const includeFullPII = searchParams.get('fullPII') === 'true';

    // 3. 查询订单详情
    const { data: order, error: queryError } = await supabase
      .from('white_label_orders')
      .select(`
        *,
        guide_white_label (
          id,
          guide_id,
          guides (
            id,
            name,
            email
          )
        ),
        page_modules (
          id,
          name,
          module_type
        )
      `)
      .eq('id', orderId)
      .single();

    if (queryError || !order) {
      console.error('[Orders] Order not found:', orderId);
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    // 4. 解密客户 PII
    const decryptedPII = decryptCustomerPII({
      customer_name: order.customer_name,
      customer_name_encrypted: order.customer_name_encrypted,
      customer_email_encrypted: order.customer_email_encrypted,
      customer_phone_encrypted: order.customer_phone_encrypted,
      customer_wechat_encrypted: order.customer_wechat_encrypted,
    });

    // 5. 根据权限决定是否脱敏
    const customerInfo: CustomerPII = includeFullPII
      ? decryptedPII
      : maskCustomerPII(decryptedPII);

    // 6. 构建响应
    const response = {
      id: order.id,
      // 客户信息（可能脱敏）
      customer: customerInfo,
      // 订单状态
      status: order.status,
      // 时间线
      timeline: {
        inquiryAt: order.inquiry_at,
        quotedAt: order.quoted_at,
        depositPaidAt: order.deposit_paid_at,
        serviceStartedAt: order.service_started_at,
        serviceCompletedAt: order.service_completed_at,
        cancelledAt: order.cancelled_at,
      },
      // 金额
      quotedAmount: order.quoted_amount,
      depositAmount: order.deposit_amount,
      finalAmount: order.final_amount,
      // 佣金
      commission: {
        rate: order.commission_rate,
        amount: order.commission_amount,
        status: order.commission_status,
        calculatedAt: order.commission_calculated_at,
        paidAt: order.commission_paid_at,
        paymentRef: order.commission_payment_ref,
      },
      // 订单内容
      orderDetails: order.order_details,
      inquiryMessage: order.inquiry_message,
      preferredDate: order.preferred_date,
      cancelReason: order.cancel_reason,
      // 来源追踪
      tracking: {
        sourcePagePath: order.source_page_path,
        utmSource: order.utm_source,
        utmMedium: order.utm_medium,
        utmCampaign: order.utm_campaign,
        referrer: order.referrer,
      },
      // 关联信息
      module: order.page_modules,
      guide: order.guide_white_label?.guides,
      // 元数据
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    return NextResponse.json(response);

  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] GET detail error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders/[id]', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

// ============================================
// PATCH - 更新订单状态
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // 1. 速率限制（敏感操作）
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/whitelabel/orders/${orderId}:patch`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const supabase = getSupabase();

    // 2. 验证请求体
    const validation = await validateBody(request, UpdateDistributionOrderSchema);
    if (!validation.success) return validation.error;

    const { action, quotedAmount, depositAmount, finalAmount, cancelReason, adminNotes } = validation.data;

    // 验证 orderId 匹配
    if (validation.data.orderId !== orderId) {
      return NextResponse.json(
        { error: '订单 ID 不匹配' },
        { status: 400 }
      );
    }

    // 3. 获取当前订单状态
    const { data: currentOrder, error: fetchError } = await supabase
      .from('white_label_orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    // 4. 获取目标状态
    const newStatus = ACTION_TO_STATUS[action];
    if (!newStatus) {
      return NextResponse.json(
        { error: '无效的操作' },
        { status: 400 }
      );
    }

    // 5. 构建更新数据
    const updateData: Record<string, any> = {
      status: newStatus,
    };

    // 根据操作添加额外字段
    switch (action) {
      case 'quote':
        updateData.quoted_amount = quotedAmount;
        updateData.quoted_at = new Date().toISOString();
        break;
      case 'request_deposit':
        updateData.deposit_amount = depositAmount;
        break;
      case 'confirm_deposit':
        updateData.deposit_paid_at = new Date().toISOString();
        break;
      case 'start_service':
        updateData.service_started_at = new Date().toISOString();
        break;
      case 'complete':
        updateData.final_amount = finalAmount;
        updateData.service_completed_at = new Date().toISOString();
        // 佣金将由数据库触发器自动计算
        break;
      case 'cancel':
        updateData.cancel_reason = cancelReason;
        updateData.cancelled_at = new Date().toISOString();
        break;
      case 'refund':
        // refunded 状态不需要额外字段
        break;
    }

    // 6. 执行更新
    // 注意：状态转换验证由数据库触发器 trg_validate_order_status 处理
    const { data: updatedOrder, error: updateError } = await supabase
      .from('white_label_orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, status, commission_amount, commission_status')
      .single();

    if (updateError) {
      // 检查是否是状态转换错误
      if (updateError.message.includes('非法状态转换')) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 }
        );
      }
      console.error('[Orders] Update error:', updateError);
      logError(normalizeError(updateError), {
        path: '/api/whitelabel/orders/[id]',
        method: 'PATCH',
        context: `action: ${action}, orderId: ${orderId}`,
      });
      return NextResponse.json(
        { error: '更新订单失败' },
        { status: 500 }
      );
    }

    console.log(`[Orders] ✅ Order ${orderId} status changed: ${currentOrder.status} → ${newStatus}`);

    // 7. 返回更新结果
    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      previousStatus: currentOrder.status,
      newStatus: updatedOrder.status,
      commission: action === 'complete' ? {
        amount: updatedOrder.commission_amount,
        status: updatedOrder.commission_status,
      } : undefined,
      message: getStatusChangeMessage(action),
    });

  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] PATCH error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders/[id]', method: 'PATCH' });
    return createErrorResponse(apiError);
  }
}

// ============================================
// 辅助函数
// ============================================

function getStatusChangeMessage(action: string): string {
  const messages: Record<string, string> = {
    quote: '报价已发送',
    request_deposit: '定金请求已发送',
    confirm_deposit: '定金已确认',
    start_service: '服务已开始',
    complete: '订单已完成，佣金已计算',
    cancel: '订单已取消',
    refund: '订单已退款',
  };
  return messages[action] || '状态已更新';
}
