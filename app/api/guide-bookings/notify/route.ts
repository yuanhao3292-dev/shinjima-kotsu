import { NextRequest, NextResponse } from 'next/server';
import { sendGuideBookingNotificationToAdmin } from '@/lib/email';

/**
 * POST /api/guide-bookings/notify
 *
 * 導遊建立預約後，發送通知郵件給管理員
 * 由客戶端在預約成功後調用（非阻塞）
 */
export async function POST(request: NextRequest) {
  try {
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
