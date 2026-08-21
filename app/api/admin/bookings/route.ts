import { NextRequest, NextResponse } from 'next/server';
import { commissionAvailableAt } from '@/lib/commission-config';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { BookingActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { calculateWithholdingTax } from '@/lib/commission-tax';
import { Resend } from 'resend';
import { EMAIL_FROM, buildEmailHtml, buildDetailsTable } from '@/lib/email-template';

/**
 * Nightclub booking management API
 *
 * GET  /api/admin/bookings - List bookings with filters
 * POST /api/admin/bookings - Perform booking actions (confirm, complete, no_show, cancel)
 */

// ============================================================
// Types
// ============================================================

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
type DepositStatus = 'pending' | 'paid' | 'refunded' | 'forfeited';

interface BookingRow {
  id: string;
  guide_id: string;
  venue_id: string;
  customer_name: string;
  customer_phone: string;
  party_size: number;
  booking_date: string;
  booking_time: string | null;
  special_requests: string | null;
  deposit_amount: number;
  deposit_status: DepositStatus;
  deposit_paid_at: string | null;
  actual_spend: number | null;
  spend_before_tax: number | null;
  status: BookingStatus;
  commission_rate: number | null;
  commission_amount: number | null;
  commission_status: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  venues: { name: string } | null;
  guides: { name: string } | null;
}

// ============================================================
// Email helper (fire-and-forget)
// ============================================================

const ADMIN_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || '';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not configured, emails will be skipped');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function sendBookingAdminNotification(
  action: 'confirm' | 'complete',
  booking: {
    id: string;
    customer_name: string;
    party_size: number;
    booking_date: string;
    booking_time: string | null;
    venue_name: string;
    guide_name: string;
    actual_spend?: number;
  }
): void {
  const resend = getResend();
  if (!resend || !ADMIN_NOTIFICATION_EMAIL) return;

  const actionLabel = action === 'confirm' ? 'Confirmed' : 'Completed';
  const subject = `[Booking ${actionLabel}] ${booking.venue_name} - ${booking.customer_name} (${booking.party_size} pax)`;

  const html = buildEmailHtml({
    headerTitle: 'NIIJIMA',
    iconEmoji: action === 'confirm' ? '&#128197;' : '&#10003;',
    statusTitle: `Booking ${actionLabel}`,
    contentSections: [
      buildDetailsTable('Booking Details', [
        { label: 'Booking ID', value: booking.id },
        { label: 'Venue', value: booking.venue_name, valueColor: '#b13e22' },
        { label: 'Guide', value: booking.guide_name, valueBold: false },
        { label: 'Customer', value: booking.customer_name },
        { label: 'Party Size', value: `${booking.party_size} pax`, valueBold: false },
        { label: 'Date', value: `${booking.booking_date}${booking.booking_time ? ' ' + booking.booking_time : ''}`, valueBold: false },
        ...(action === 'complete' && booking.actual_spend !== undefined
          ? [{ label: 'Actual Spend', value: `\u00a5${booking.actual_spend.toLocaleString()}`, valueColor: '#16a34a' }]
          : []),
      ]),
    ],
    ctaText: 'View Bookings',
    ctaUrl: 'https://niijima-koutsu.jp/admin/bookings',
    footerCompanyName: '新島交通株式會社',
    footerDisclaimer: 'Auto-generated notification',
  });

  // Fire-and-forget
  resend.emails.send({
    from: EMAIL_FROM.system,
    to: ADMIN_NOTIFICATION_EMAIL,
    subject,
    html,
  }).catch((err) => {
    console.error('[Booking Notification] Failed to send email:', err);
  });
}

// ============================================================
// Audit logging helper
// ============================================================

async function logAuditAction(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  action: string,
  entityType: string,
  entityId: string,
  authResult: { userId?: string; email?: string },
  details: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from('audit_logs').insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    admin_id: authResult.userId,
    admin_email: authResult.email,
    details,
  });

  if (error) {
    console.error('[CRITICAL] Audit log write failed:', error);
  }
}

// ============================================================
// GET /api/admin/bookings
// ============================================================

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/bookings:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  // Admin auth
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const venueId = searchParams.get('venue_id');
  const guideId = searchParams.get('guide_id');
  const dateFrom = searchParams.get('date_from');
  const dateTo = searchParams.get('date_to');

  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        venues:venue_id ( id, name ),
        guides:guide_id ( id, name, email )
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (venueId) {
      query = query.eq('venue_id', venueId);
    }
    if (guideId) {
      query = query.eq('guide_id', guideId);
    }
    if (dateFrom) {
      query = query.gte('booking_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('booking_date', dateTo);
    }

    const { data: bookings, error } = await query;

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/bookings', method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch bookings'));
    }

    // Transform to match frontend expected structure
    const transformed = (bookings as BookingRow[] | null)?.map((b) => {
      const venueData = b.venues as { id: string; name: string } | null;
      const guideData = b.guides as { id: string; name: string; email: string } | null;

      return {
        id: b.id,
        venue: venueData ? { id: venueData.id, name: venueData.name } : { id: '', name: '未知店鋪' },
        guide: guideData ? { id: guideData.id, name: guideData.name, email: guideData.email || '' } : { id: '', name: '未知導遊', email: '' },
        customer: {
          name: b.customer_name,
          phone: b.customer_phone || '',
          email: '',
        },
        party_size: b.party_size,
        booking_date: b.booking_date,
        booking_time: b.booking_time || '',
        status: b.status,
        deposit_status: b.deposit_status,
        deposit_amount: b.deposit_amount,
        actual_spend: b.actual_spend,
        admin_notes: null,
        cancel_reason: null,
        created_at: b.created_at,
        updated_at: b.updated_at,
      };
    }) ?? [];

    // Calculate stats
    const stats = {
      total: transformed.length,
      pending: transformed.filter(b => b.status === 'pending').length,
      confirmed: transformed.filter(b => b.status === 'confirmed').length,
      completed: transformed.filter(b => b.status === 'completed').length,
      no_show: transformed.filter(b => b.status === 'no_show').length,
      cancelled: transformed.filter(b => b.status === 'cancelled').length,
    };

    return NextResponse.json({ bookings: transformed, stats });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/bookings', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

// ============================================================
// POST /api/admin/bookings
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(
      `${clientIp}:/api/admin/bookings`,
      RATE_LIMITS.sensitive
    );
    if (!rateLimitResult.success) {
      return createErrorResponse(
        Errors.rateLimit(rateLimitResult.retryAfter),
        createRateLimitHeaders(rateLimitResult)
      );
    }

    // Admin auth
    const authResult = await verifyAdminAuth(request.headers.get('authorization'));
    if (!authResult.isValid) {
      return createErrorResponse(Errors.auth(authResult.error));
    }

    // Validate input
    const validation = await validateBody(request, BookingActionSchema);
    if (!validation.success) return validation.error;
    const { action, bookingId, adminNotes, cancelReason, actualSpend } = validation.data;

    const supabase = getSupabaseAdmin();

    // Fetch existing booking with joined venue and guide names
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        venues:venue_id ( name ),
        guides:guide_id ( name )
      `)
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return createErrorResponse(Errors.notFound('Booking not found'));
    }

    const typedBooking = booking as BookingRow;

    switch (action) {
      // ----------------------------------------------------------
      // CONFIRM: pending + deposit paid -> confirmed
      // ----------------------------------------------------------
      case 'confirm': {
        if (typedBooking.status !== 'pending') {
          return createErrorResponse(
            Errors.business(
              `Cannot confirm booking: current status is '${typedBooking.status}', expected 'pending'`,
              'BOOKING_INVALID_STATE'
            )
          );
        }
        if (typedBooking.deposit_status !== 'paid') {
          return createErrorResponse(
            Errors.business(
              `Cannot confirm booking: deposit status is '${typedBooking.deposit_status}', must be 'paid'`,
              'BOOKING_DEPOSIT_NOT_PAID'
            )
          );
        }

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed' as BookingStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId)
          .eq('status', 'pending'); // Optimistic concurrency guard

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/admin/bookings', method: 'POST' });
          return createErrorResponse(Errors.internal('Failed to confirm booking'));
        }

        await logAuditAction(supabase, 'booking_confirm', 'booking', bookingId, authResult, {
          adminNotes,
          previousStatus: typedBooking.status,
        });

        // Email notification (fire-and-forget)
        sendBookingAdminNotification('confirm', {
          id: bookingId,
          customer_name: typedBooking.customer_name,
          party_size: typedBooking.party_size,
          booking_date: typedBooking.booking_date,
          booking_time: typedBooking.booking_time,
          venue_name: typedBooking.venues?.name ?? 'Unknown',
          guide_name: typedBooking.guides?.name ?? 'Unknown',
        });

        return NextResponse.json({ success: true, message: 'Booking confirmed' });
      }

      // ----------------------------------------------------------
      // COMPLETE: confirmed -> completed (requires actualSpend)
      // ----------------------------------------------------------
      case 'complete': {
        if (typedBooking.status !== 'confirmed') {
          return createErrorResponse(
            Errors.business(
              `Cannot complete booking: current status is '${typedBooking.status}', expected 'confirmed'`,
              'BOOKING_INVALID_STATE'
            )
          );
        }

        // actualSpend is guaranteed by Zod refine, but assert for TS narrowing
        if (actualSpend === undefined || actualSpend === null) {
          return createErrorResponse(
            Errors.validation('actualSpend is required for complete action')
          );
        }

        const now = new Date().toISOString();

        // 夜总会佣金:与白标/在线单口径一致
        //   税前基数 = actualSpend ÷ 1.1(去 10% 消费税)
        //   毛佣金   = 基数 × 阶梯佣金率(bookings.commission_rate 为小数,如 0.10/0.20)
        //   源泉徴収 = 按导游税务居住地预扣;成熟释放时扣净额入余额
        //   COMMISSION_HOLD_DAYS 天锁定后由 cron/提现页释放为 available
        const rate = typedBooking.commission_rate ?? 0;
        const spendBeforeTax = Math.round(actualSpend / 1.1);
        const grossCommission = rate > 0 ? Math.round(spendBeforeTax * rate) : 0;

        const commissionFields: Record<string, unknown> = { spend_before_tax: spendBeforeTax };
        let withholdingAmount = 0;
        let availableAtIso: string | null = null;
        let referrerId: string | null = null;
        if (typedBooking.guide_id && grossCommission > 0) {
          const { data: guideInfo } = await supabase
            .from('guides')
            .select('tax_residency, referrer_id')
            .eq('id', typedBooking.guide_id)
            .single();
          const isResident = guideInfo?.tax_residency === 'resident';
          referrerId = (guideInfo?.referrer_id as string | null) ?? null;
          const wh = calculateWithholdingTax(grossCommission, isResident);
          withholdingAmount = wh.withholdingAmount;
          const availableAt = new Date(commissionAvailableAt());
          availableAtIso = availableAt.toISOString();
          commissionFields.commission_amount = grossCommission;
          commissionFields.commission_status = 'calculated';
          commissionFields.commission_available_at = availableAtIso;
          commissionFields.withholding_tax_amount = withholdingAmount;
          commissionFields.withholding_tax_rate = wh.withholdingRate;
        }

        // .select() 作幂等守卫:仅当本次真的把 confirmed→completed(命中行)才累计佣金,
        // 并发/重试下第二次 update 命中 0 行 → 不重复入账。
        const { data: completedRows, error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'completed' as BookingStatus,
            actual_spend: actualSpend,
            completed_at: now,
            updated_at: now,
            ...commissionFields,
          })
          .eq('id', bookingId)
          .eq('status', 'confirmed')
          .select('id');

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/admin/bookings', method: 'POST' });
          return createErrorResponse(Errors.internal('Failed to complete booking'));
        }

        // 原子累计导游毛佣金(与白标线下单口径一致);失败仅告警不回滚完成状态
        const didComplete = (completedRows?.length ?? 0) > 0;
        if (didComplete && typedBooking.guide_id && grossCommission > 0) {
          const { error: commissionErr } = await supabase.rpc('increment_guide_commission', {
            p_guide_id: typedBooking.guide_id,
            p_amount: grossCommission,
          });
          if (commissionErr) {
            console.error(`[admin/bookings] 夜总会佣金累计失败 booking=${bookingId}:`, commissionErr);
            logError(normalizeError(commissionErr), { path: '/api/admin/bookings', method: 'POST' });
          }

          // 推荐奖励:该导游有推荐人时,按【净佣金】2% 给推荐人建奖励。
          // 与白标 webhook 同口径,带 available_at 同期成熟(COMMISSION_HOLD_DAYS 天),到期由 cron/提现页
          // 释放进推荐人余额。旧触发器 trigger_create_referral_reward 已在迁移 115 清除,
          // 此处是夜总会推荐奖励的唯一权威来源;upsert onConflict(booking_id) 幂等防重。
          if (referrerId) {
            const netCommission = grossCommission - withholdingAmount;
            const referralRewardAmount = Math.round(netCommission * 0.02);
            if (referralRewardAmount > 0) {
              const { error: rewardErr } = await supabase
                .from('referral_rewards')
                .upsert({
                  referrer_id: referrerId,
                  referee_id: typedBooking.guide_id,
                  booking_id: bookingId,
                  reward_type: 'commission',
                  reward_rate: 0.02,
                  reward_amount: referralRewardAmount,
                  status: 'pending',
                  available_at: availableAtIso,
                }, { onConflict: 'booking_id', ignoreDuplicates: true });
              if (rewardErr) {
                console.error(`[admin/bookings] 夜总会推荐奖励创建失败 booking=${bookingId}:`, rewardErr);
              }
            }
          }
        }

        await logAuditAction(supabase, 'booking_complete', 'booking', bookingId, authResult, {
          adminNotes,
          actualSpend,
          previousStatus: typedBooking.status,
        });

        // Email notification (fire-and-forget)
        sendBookingAdminNotification('complete', {
          id: bookingId,
          customer_name: typedBooking.customer_name,
          party_size: typedBooking.party_size,
          booking_date: typedBooking.booking_date,
          booking_time: typedBooking.booking_time,
          venue_name: typedBooking.venues?.name ?? 'Unknown',
          guide_name: typedBooking.guides?.name ?? 'Unknown',
          actual_spend: actualSpend,
        });

        return NextResponse.json({ success: true, message: 'Booking completed' });
      }

      // ----------------------------------------------------------
      // NO_SHOW: confirmed -> no_show
      // ----------------------------------------------------------
      case 'no_show': {
        if (typedBooking.status !== 'confirmed') {
          return createErrorResponse(
            Errors.business(
              `Cannot mark as no-show: current status is '${typedBooking.status}', expected 'confirmed'`,
              'BOOKING_INVALID_STATE'
            )
          );
        }

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'no_show' as BookingStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId)
          .eq('status', 'confirmed');

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/admin/bookings', method: 'POST' });
          return createErrorResponse(Errors.internal('Failed to mark booking as no-show'));
        }

        await logAuditAction(supabase, 'booking_no_show', 'booking', bookingId, authResult, {
          adminNotes,
          previousStatus: typedBooking.status,
        });

        return NextResponse.json({ success: true, message: 'Booking marked as no-show' });
      }

      // ----------------------------------------------------------
      // CANCEL: not completed/no_show/cancelled -> cancelled
      // ----------------------------------------------------------
      case 'cancel': {
        const nonCancellableStatuses: BookingStatus[] = ['completed', 'no_show', 'cancelled'];
        if (nonCancellableStatuses.includes(typedBooking.status)) {
          return createErrorResponse(
            Errors.business(
              `Cannot cancel booking: current status is '${typedBooking.status}'`,
              'BOOKING_INVALID_STATE'
            )
          );
        }

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'cancelled' as BookingStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/admin/bookings', method: 'POST' });
          return createErrorResponse(Errors.internal('Failed to cancel booking'));
        }

        await logAuditAction(supabase, 'booking_cancel', 'booking', bookingId, authResult, {
          adminNotes,
          cancelReason,
          previousStatus: typedBooking.status,
        });

        return NextResponse.json({ success: true, message: 'Booking cancelled' });
      }

      default:
        return createErrorResponse(Errors.validation('Invalid action'));
    }
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/bookings', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
