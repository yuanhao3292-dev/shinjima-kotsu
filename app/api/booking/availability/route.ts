import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 预约可用性检查 API
 *
 * GET /api/booking/availability?venue_id=xxx&date=2026-01-20
 * GET /api/booking/availability?guide_id=xxx&date=2026-01-20
 *
 * 返回指定日期的可用时间段
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venue_id');
  const guideId = searchParams.get('guide_id');
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: '请提供日期参数' }, { status: 400 });
  }

  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json({ error: '日期格式无效，请使用 YYYY-MM-DD' }, { status: 400 });
  }

  try {
    if (venueId) {
      // 查询店铺可用性
      const { data, error } = await supabase.rpc('get_venue_availability', {
        p_venue_id: venueId,
        p_date: date,
      });

      if (error) {
        // 如果函数不存在，使用备用查询
        if (error.message?.includes('does not exist')) {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('id, booking_time, customer_name')
            .eq('venue_id', venueId)
            .eq('booking_date', date)
            .not('status', 'in', '("cancelled","no_show")');

          // 生成时间段
          const slots = generateTimeSlots(bookings || []);
          return NextResponse.json({ availability: slots, date, venueId });
        }
        throw error;
      }

      return NextResponse.json({ availability: data, date, venueId });
    }

    if (guideId) {
      // 查询导游可用性
      const { data, error } = await supabase.rpc('get_guide_availability', {
        p_guide_id: guideId,
        p_date: date,
      });

      if (error) {
        // 如果函数不存在，使用备用查询
        if (error.message?.includes('does not exist')) {
          const { data: bookings } = await supabase
            .from('bookings')
            .select(`
              id,
              booking_time,
              customer_name,
              venue:venues(name)
            `)
            .eq('guide_id', guideId)
            .eq('booking_date', date)
            .not('status', 'in', '("cancelled","no_show")');

          const slots = generateGuidTimeSlots(bookings || []);
          return NextResponse.json({ availability: slots, date, guideId });
        }
        throw error;
      }

      return NextResponse.json({ availability: data, date, guideId });
    }

    return NextResponse.json({ error: '请提供 venue_id 或 guide_id' }, { status: 400 });
  } catch (error: any) {
    console.error('可用性查询错误:', error);
    return NextResponse.json({ error: '查询失败' }, { status: 500 });
  }
}

/**
 * POST /api/booking/availability - 检查特定时间是否可用
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venueId, guideId, date, time } = body;

    if (!date) {
      return NextResponse.json({ error: '请提供日期' }, { status: 400 });
    }

    const conflicts = [];

    // 检查店铺冲突
    if (venueId) {
      const { data: venueConflicts } = await supabase
        .from('bookings')
        .select('id, customer_name, booking_time')
        .eq('venue_id', venueId)
        .eq('booking_date', date)
        .not('status', 'in', '("cancelled","no_show")');

      if (venueConflicts && venueConflicts.length > 0) {
        for (const booking of venueConflicts) {
          if (isTimeConflict(time, booking.booking_time)) {
            conflicts.push({
              type: 'venue',
              message: `该店铺在 ${booking.booking_time || '当天'} 已有预约（客户：${booking.customer_name}）`,
              bookingId: booking.id,
            });
          }
        }
      }
    }

    // 检查导游冲突
    if (guideId) {
      const { data: guideConflicts } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          booking_time,
          venue:venues(name)
        `)
        .eq('guide_id', guideId)
        .eq('booking_date', date)
        .not('status', 'in', '("cancelled","no_show")');

      if (guideConflicts && guideConflicts.length > 0) {
        for (const booking of guideConflicts) {
          if (isTimeConflict(time, booking.booking_time)) {
            const venue = booking.venue as any;
            conflicts.push({
              type: 'guide',
              message: `您在 ${booking.booking_time || '当天'} 已有预约（${venue?.name || ''}，客户：${booking.customer_name}）`,
              bookingId: booking.id,
            });
          }
        }
      }
    }

    return NextResponse.json({
      available: conflicts.length === 0,
      conflicts,
    });
  } catch (error: any) {
    console.error('冲突检查错误:', error);
    return NextResponse.json({ error: '检查失败' }, { status: 500 });
  }
}

// 辅助函数：检查时间是否冲突（2小时内视为冲突）
function isTimeConflict(time1: string | null, time2: string | null): boolean {
  // 如果任一方没有指定时间，视为可能冲突
  if (!time1 || !time2) return true;

  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;

  return Math.abs(minutes1 - minutes2) < 120; // 2小时 = 120分钟
}

// 辅助函数：生成时间段（店铺）
function generateTimeSlots(bookings: any[]) {
  const slots = [];
  for (let hour = 10; hour <= 22; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const conflict = bookings.find(b => isTimeConflict(timeStr, b.booking_time));
    slots.push({
      time_slot: timeStr,
      is_available: !conflict,
      existing_booking_id: conflict?.id || null,
    });
  }
  return slots;
}

// 辅助函数：生成时间段（导游）
function generateGuidTimeSlots(bookings: any[]) {
  const slots = [];
  for (let hour = 10; hour <= 22; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const conflict = bookings.find(b => isTimeConflict(timeStr, b.booking_time));
    slots.push({
      time_slot: timeStr,
      is_available: !conflict,
      venue_name: conflict?.venue?.name || null,
      customer_name: conflict?.customer_name || null,
    });
  }
  return slots;
}
