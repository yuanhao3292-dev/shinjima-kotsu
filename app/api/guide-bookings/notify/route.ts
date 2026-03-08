import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendGuideBookingNotificationToAdmin } from '@/lib/email';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';

/**
 * POST /api/guide-bookings/notify
 *
 * 導遊建立預約後，發送通知郵件給管理員
 * 由客戶端在預約成功後調用（非阻塞）
 */
export async function POST(request: NextRequest) {
  try {
    // 认证检查
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 限速
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/guide-bookings/notify`,
      RATE_LIMITS.standard
    );
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { guideName, venueName, customerName, customerPhone, partySize, bookingDate, bookingTime, specialRequests } = body;

    if (!guideName || !venueName || !customerName || !partySize || !bookingDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendGuideBookingNotificationToAdmin({
      guideName,
      venueName,
      customerName,
      customerPhone: customerPhone || undefined,
      partySize,
      bookingDate,
      bookingTime: bookingTime || undefined,
      specialRequests: specialRequests || undefined,
    });

    return NextResponse.json({ success: result.success });
  } catch (error: any) {
    console.error('[Guide Booking Notify] Error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
