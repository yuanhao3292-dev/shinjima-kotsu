/**
 * 白标订单详情 API
 * ============================================
 * GET /api/whitelabel/orders/[id] - 获取订单详情
 * PATCH /api/whitelabel/orders/[id] - 更新订单状态（管理员操作）
 *
 * DB 表: white_label_orders (058_white_label_system.sql)
 * 状态: pending → confirmed → completed / cancelled
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
import { z } from 'zod';

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

// 内联 Zod schema
const UpdateOrderSchema = z.object({
  action: z.enum(['confirm', 'complete', 'cancel']),
  totalAmount: z.number().int().min(0).optional(),
  commissionAmount: z.number().int().min(0).optional(),
  cancelReason: z.string().max(500).optional(),
  adminNotes: z.string().max(2000).optional(),
});

// 状态转换映射
const ACTION_TO_STATUS: Record<string, string> = {
  confirm: 'confirmed',
  complete: 'completed',
  cancel: 'cancelled',
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

    // 查询订单详情（直接通过 guide_id 关联 guides）
    const { data: order, error: queryError } = await supabase
      .from('white_label_orders')
      .select(`
        *,
        guides (
          id,
          name,
          email
        ),
        page_modules (
          id,
          name,
          category
        )
      `)
      .eq('id', orderId)
      .single();

    if (queryError || !order) {
      console.error('[Orders] Order not found:', orderId);
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    // 构建响应（匹配 DB 实际列）
    const response = {
      id: order.id,
      customer: {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email,
        wechat: order.customer_wechat,
        line: order.customer_line,
        notes: order.customer_notes,
      },
      service: {
        type: order.service_type,
        name: order.service_name,
        date: order.service_date,
        time: order.service_time,
      },
      status: order.status,
      payment: {
        status: order.payment_status,
        totalAmount: order.total_amount,
        paidAt: order.paid_at,
        stripePaymentIntentId: order.stripe_payment_intent_id,
      },
      commission: {
        rate: order.commission_rate,
        amount: order.commission_amount,
      },
      timeline: {
        createdAt: order.created_at,
        confirmedAt: order.confirmed_at,
        completedAt: order.completed_at,
        cancelledAt: order.cancelled_at,
      },
      cancelReason: order.cancel_reason,
      adminNotes: order.admin_notes,
      module: order.page_modules,
      guide: order.guides,
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse(Errors.validation('无效的请求体'));
    }

    const parseResult = UpdateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return createErrorResponse(Errors.validation('参数错误'));
    }

    const { action, totalAmount, commissionAmount, cancelReason, adminNotes } = parseResult.data;

    // 获取当前订单
    const { data: currentOrder, error: fetchError } = await supabase
      .from('white_label_orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    const newStatus = ACTION_TO_STATUS[action];
    if (!newStatus) {
      return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }

    // 构建更新数据（匹配 DB 实际列）
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    switch (action) {
      case 'confirm':
        updateData.confirmed_at = new Date().toISOString();
        break;
      case 'complete':
        updateData.completed_at = new Date().toISOString();
        if (totalAmount !== undefined) updateData.total_amount = totalAmount;
        if (commissionAmount !== undefined) updateData.commission_amount = commissionAmount;
        break;
      case 'cancel':
        updateData.cancelled_at = new Date().toISOString();
        if (cancelReason) updateData.cancel_reason = cancelReason;
        break;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('white_label_orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, status, commission_amount')
      .single();

    if (updateError) {
      console.error('[Orders] Update error:', updateError);
      logError(normalizeError(updateError), {
        path: '/api/whitelabel/orders/[id]',
        method: 'PATCH',
      });
      return NextResponse.json({ error: '更新订单失败' }, { status: 500 });
    }

    console.log(`[Orders] Order ${orderId}: ${currentOrder.status} → ${newStatus}`);

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      previousStatus: currentOrder.status,
      newStatus: updatedOrder.status,
      message: getStatusChangeMessage(action),
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    console.error('[Orders] PATCH error:', apiError);
    logError(apiError, { path: '/api/whitelabel/orders/[id]', method: 'PATCH' });
    return createErrorResponse(apiError);
  }
}

function getStatusChangeMessage(action: string): string {
  const messages: Record<string, string> = {
    confirm: '订单已确认',
    complete: '订单已完成',
    cancel: '订单已取消',
  };
  return messages[action] || '状态已更新';
}
