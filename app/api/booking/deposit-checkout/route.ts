import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin, getSupabaseWithAuth } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

/**
 * POST /api/booking/deposit-checkout
 * 導遊為預約支付定金（¥500），創建 Stripe Checkout Session
 *
 * Body: { bookingId: string }
 * 需要導遊登入認證
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/booking/deposit-checkout`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    // 驗證導遊身份
    const { supabase: authClient, user, error: authError } = await getSupabaseWithAuth(
      request.headers.get('authorization')
    );
    if (authError || !user || !authClient) {
      return createErrorResponse(Errors.auth(authError || '未登入'));
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return createErrorResponse(Errors.validation('bookingId 為必填'));
    }

    const supabase = getSupabaseAdmin();

    // 查詢導遊資訊
    const { data: guide, error: guideError } = await supabase
      .from('guides')
      .select('id, name, status')
      .eq('auth_user_id', user.id)
      .single();

    if (guideError || !guide) {
      return createErrorResponse(Errors.auth('導遊帳戶不存在'));
    }

    if (guide.status !== 'approved') {
      return createErrorResponse(Errors.business('導遊帳戶未通過審核', 'GUIDE_NOT_APPROVED'));
    }

    // 查詢預約資訊（含店鋪名）
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, venues(name, name_ja)')
      .eq('id', bookingId)
      .eq('guide_id', guide.id)
      .single();

    if (bookingError || !booking) {
      return createErrorResponse(Errors.notFound('預約不存在'));
    }

    if (booking.status !== 'pending' || booking.deposit_status !== 'pending') {
      return createErrorResponse(Errors.business('此預約不需要支付定金', 'DEPOSIT_NOT_REQUIRED'));
    }

    const stripe = getStripe();
    const fee = booking.deposit_amount || 500;
    const venueData = booking.venues as Record<string, unknown> | Record<string, unknown>[] | null;
    const venueName = String(
      (Array.isArray(venueData) ? venueData[0]?.name : venueData?.name) || '夜總會'
    );

    // 創建 Stripe Checkout Session（一次性支付）
    const origin = request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            unit_amount: fee,
            product_data: {
              name: `預約定金 - ${venueName}`,
              description: `預約日期: ${booking.booking_date}，人數: ${booking.party_size}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'nightclub_deposit',
        booking_id: bookingId,
        guide_id: guide.id,
        venue_name: venueName,
      },
      success_url: `${origin}/guide-partner/bookings?payment=success&booking_id=${bookingId}`,
      cancel_url: `${origin}/guide-partner/bookings?payment=cancelled&booking_id=${bookingId}`,
    });

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/booking/deposit-checkout', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
