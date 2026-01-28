import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { validateBody } from '@/lib/validations/validate';
import { BookingActionSchema } from '@/lib/validations/api-schemas';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';
import { Resend } from 'resend';

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

  const spendSection = action === 'complete' && booking.actual_spend !== undefined
    ? `<tr><td style="color:#64748b;padding:8px 0;">Actual Spend</td><td style="color:#16a34a;text-align:right;font-weight:600;">\u00a5${booking.actual_spend.toLocaleString()}</td></tr>`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <tr><td style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Booking ${actionLabel}</h1>
        </td></tr>
        <tr><td style="padding:30px;">
          <div style="background:#f8fafc;border-radius:12px;padding:24px;border:1px solid #e2e8f0;">
            <table width="100%" style="font-size:14px;">
              <tr><td style="color:#64748b;padding:8px 0;">Booking ID</td><td style="color:#1e293b;text-align:right;font-weight:600;">${booking.id.slice(0, 8).toUpperCase()}</td></tr>
              <tr><td style="color:#64748b;padding:8px 0;">Venue</td><td style="color:#7c3aed;text-align:right;font-weight:600;">${booking.venue_name}</td></tr>
              <tr><td style="color:#64748b;padding:8px 0;">Guide</td><td style="color:#1e293b;text-align:right;">${booking.guide_name}</td></tr>
              <tr><td style="color:#64748b;padding:8px 0;">Customer</td><td style="color:#1e293b;text-align:right;font-weight:600;">${booking.customer_name}</td></tr>
              <tr><td style="color:#64748b;padding:8px 0;">Party Size</td><td style="color:#1e293b;text-align:right;">${booking.party_size} pax</td></tr>
              <tr><td style="color:#64748b;padding:8px 0;">Date</td><td style="color:#1e293b;text-align:right;">${booking.booking_date}${booking.booking_time ? ` ${booking.booking_time}` : ''}</td></tr>
              ${spendSection}
            </table>
          </div>
        </td></tr>
        <tr><td style="padding:0 30px 30px;text-align:center;">
          <a href="https://niijima-koutsu.jp/admin/bookings" style="display:inline-block;background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            View Bookings
          </a>
        </td></tr>
        <tr><td style="background:#1e293b;padding:20px;text-align:center;">
          <p style="color:#94a3b8;margin:0;font-size:12px;">Auto-generated notification</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Fire-and-forget
  resend.emails.send({
    from: 'NIIJIMA Bookings <noreply@niijima-koutsu.jp>',
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

    return NextResponse.json(transformed);
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
        if (actualSpend === undefined) {
          return createErrorResponse(
            Errors.validation('actualSpend is required for complete action')
          );
        }

        const now = new Date().toISOString();
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'completed' as BookingStatus,
            actual_spend: actualSpend,
            completed_at: now,
            updated_at: now,
          })
          .eq('id', bookingId)
          .eq('status', 'confirmed');

        if (updateError) {
          logError(normalizeError(updateError), { path: '/api/admin/bookings', method: 'POST' });
          return createErrorResponse(Errors.internal('Failed to complete booking'));
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
