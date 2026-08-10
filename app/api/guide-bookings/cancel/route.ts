import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseWithAuth } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

/**
 * POST /api/guide-bookings/cancel
 * 导游取消自己的预约。
 *
 * 此前取消走客户端 supabase 直连 update bookings,依赖"Guides can update own
 * bookings"这条无 WITH CHECK 的 RLS 策略 —— 导游可借同一权限篡改 deposit_status/
 * commission_rate/actual_spend。迁移 116 已删该策略,取消改由本服务端路由代劳:
 * 校验所有权 + 可取消状态,并【由服务端判定】押金归属(当天取消没收、否则退还),
 * 不信任客户端传入的任何金额/状态字段。
 *
 * Body: { bookingId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/guide-bookings/cancel`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    const { user, error: authError } = await getSupabaseWithAuth(
      request.headers.get('authorization')
    );
    if (authError || !user) {
      return createErrorResponse(Errors.auth(authError || '未登入'));
    }

    const body = await request.json();
    const bookingId = body?.bookingId;
    if (!bookingId || typeof bookingId !== 'string') {
      return createErrorResponse(Errors.validation('bookingId 为必填'));
    }

    const supabase = getSupabaseAdmin();

    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, status')
      .eq('auth_user_id', user.id)
      .single();
    if (guideError || !guide) {
      return createErrorResponse(Errors.auth('导游帐户不存在'));
    }

    // 查自己名下的预约
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, status, booking_date, deposit_status')
      .eq('id', bookingId)
      .eq('guide_id', guide.id)
      .single();
    if (bookingError || !booking) {
      return createErrorResponse(Errors.notFound('预约'));
    }

    // 仅 pending / confirmed 可由导游取消;completed/cancelled/no_show 不可
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return createErrorResponse(
        Errors.business(
          `此预约当前状态为 '${booking.status}',无法取消`,
          'BOOKING_NOT_CANCELLABLE'
        )
      );
    }

    // 押金归属由服务端判定:当天取消没收(forfeited),否则退还(refunded)。
    // 以日本时区(Asia/Tokyo)判定"当天",与业务地一致,不采信客户端。
    const jstToday = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    const isSameDay = booking.booking_date === jstToday;
    // 只有已实际支付的押金才谈没收/退还;未付押金保持原状(仍是 pending)
    const nextDepositStatus =
      booking.deposit_status === 'paid'
        ? (isSameDay ? 'forfeited' : 'refunded')
        : booking.deposit_status;

    const now = new Date().toISOString();
    const { data: updatedRows, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        deposit_status: nextDepositStatus,
        updated_at: now,
      })
      .eq('id', bookingId)
      .eq('guide_id', guide.id)
      .in('status', ['pending', 'confirmed']) // 乐观并发守卫
      .select('id');

    if (updateError) {
      logError(normalizeError(updateError), { path: '/api/guide-bookings/cancel', method: 'POST' });
      return createErrorResponse(Errors.internal('取消预约失败'));
    }
    if (!updatedRows || updatedRows.length === 0) {
      // 并发下已被改走(如 admin 已确认/完成)
      return createErrorResponse(
        Errors.business('此预约已无法取消,请刷新后重试', 'BOOKING_NOT_CANCELLABLE')
      );
    }

    return NextResponse.json({
      success: true,
      depositStatus: nextDepositStatus,
      depositForfeited: nextDepositStatus === 'forfeited',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/guide-bookings/cancel', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
