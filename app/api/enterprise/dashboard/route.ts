/**
 * Enterprise Dashboard API
 *
 * GET /api/enterprise/dashboard — Enterprise self-service dashboard data
 *
 * Auth: API Key (enterprise_management scope)
 * Returns: member overview, quota usage, recent screenings
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAPIKey } from '@/lib/utils/api-key-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/enterprise/dashboard:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authHeader = request.headers.get('authorization');
  const apiAuth = await validateAPIKey(authHeader, 'enterprise_management');
  if (!apiAuth.valid || !apiAuth.key) {
    return createErrorResponse(Errors.auth(apiAuth.error));
  }

  const supabase = getSupabaseAdmin();

  // Find enterprise
  const { data: enterprise } = await supabase
    .from('enterprises')
    .select('id, name, name_en, region, status, member_limit, screening_quota, screening_used, contract_type, contract_end')
    .eq('api_key_id', apiAuth.key.id)
    .eq('status', 'active')
    .single();

  if (!enterprise) {
    return createErrorResponse(Errors.auth('API key not linked to an active enterprise'));
  }

  try {
    // Member summary
    const { data: members } = await supabase
      .from('enterprise_members')
      .select('id, full_name, title, last_screening_date, last_health_score, screening_count, status')
      .eq('enterprise_id', enterprise.id)
      .neq('status', 'removed')
      .order('full_name');

    const activeMembers = (members || []).filter(m => m.status === 'active');
    const membersWithScreening = activeMembers.filter(m => m.last_health_score != null);
    const avgHealthScore = membersWithScreening.length > 0
      ? Math.round(membersWithScreening.reduce((s, m) => s + (m.last_health_score || 0), 0) / membersWithScreening.length)
      : null;

    // Recent screenings (last 20)
    const { data: recentUsage } = await supabase
      .from('enterprise_screening_usage')
      .select('id, member_id, screening_type, created_at')
      .eq('enterprise_id', enterprise.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Health score distribution
    const scoreDistribution = {
      excellent: membersWithScreening.filter(m => (m.last_health_score || 0) >= 80).length,
      good: membersWithScreening.filter(m => (m.last_health_score || 0) >= 60 && (m.last_health_score || 0) < 80).length,
      needsAttention: membersWithScreening.filter(m => (m.last_health_score || 0) < 60).length,
      notScreened: activeMembers.length - membersWithScreening.length,
    };

    return NextResponse.json({
      enterprise: {
        id: enterprise.id,
        name: enterprise.name,
        nameEn: enterprise.name_en,
        region: enterprise.region,
        contractType: enterprise.contract_type,
        contractEnd: enterprise.contract_end,
      },
      quota: {
        total: enterprise.screening_quota,
        used: enterprise.screening_used,
        remaining: enterprise.screening_quota - enterprise.screening_used,
      },
      members: {
        total: activeMembers.length,
        limit: enterprise.member_limit,
        screened: membersWithScreening.length,
        avgHealthScore,
        scoreDistribution,
      },
      recentScreenings: recentUsage || [],
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/enterprise/dashboard', method: 'GET' });
    return createErrorResponse(apiError);
  }
}
