/**
 * CEO Data Dashboard — Analytics API
 *
 * GET /api/admin/analytics
 *
 * Returns aggregated KPIs:
 * - Revenue (GMV, take rate, order count, AOV)
 * - Screening metrics (total, completion rate, risk distribution)
 * - AI cost metrics (tokens, latency, cost estimate)
 * - Guide/partner metrics (active guides, commission payouts)
 * - Conversion funnel (screening → order)
 * - Time-series revenue data (last 12 months)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
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

// ============================================================
// Types
// ============================================================

interface MonthlyRevenue {
  month: string; // 'YYYY-MM'
  revenue: number;
  orders: number;
  commissions: number;
}

interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

interface AnalyticsResponse {
  // Revenue KPIs
  revenue: {
    totalGMV: number;
    mtdGMV: number;
    totalOrders: number;
    mtdOrders: number;
    avgOrderValue: number;
    totalCommissions: number;
    takeRate: number; // (GMV - commissions) / GMV
  };
  // Screening KPIs
  screenings: {
    total: number;
    completed: number;
    completionRate: number;
    mtdTotal: number;
    riskDistribution: RiskDistribution;
    avgAiLatencyMs: number;
    totalAiCostEstimate: number; // USD estimate
  };
  // Guide KPIs
  guides: {
    totalActive: number;
    goldPartners: number;
    growthPartners: number;
    pendingKYC: number;
    totalPayouts: number;
  };
  // Conversion Funnel
  funnel: {
    screeningsCompleted: number;
    ordersFromScreening: number;
    conversionRate: number;
  };
  // Time series (last 12 months)
  monthlyRevenue: MonthlyRevenue[];
  // Metadata
  generatedAt: string;
}

// ============================================================
// Helpers
// ============================================================

function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getLast12MonthsStart(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 12);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Estimate AI cost from token counts (approximate pricing) */
function estimateAiCost(
  inputTokens: number,
  outputTokens: number,
  model: string
): number {
  // Rough per-1K-token pricing in USD
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    'grok-3': { input: 0.003, output: 0.015 },
    'claude-sonnet': { input: 0.003, output: 0.015 },
    'deepseek-chat': { input: 0.00014, output: 0.00028 },
  };
  const p = pricing[model] || { input: 0.001, output: 0.003 };
  return (inputTokens / 1000) * p.input + (outputTokens / 1000) * p.output;
}

// ============================================================
// GET /api/admin/analytics
// ============================================================

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/analytics:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  // Admin auth
  const authResult = await verifyAdminAuth(
    request.headers.get('authorization')
  );
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();
  const monthStart = getMonthStart();
  const last12 = getLast12MonthsStart();

  try {
    // ---- Parallel queries ----
    const [
      ordersRes,
      mtdOrdersRes,
      screeningsRes,
      mtdScreeningsRes,
      aiRunsRes,
      guidesRes,
      pendingKycRes,
      commissionsRes,
      monthlyRes,
      adjudicationsRes,
    ] = await Promise.all([
      // 1. All paid orders
      supabase
        .from('orders')
        .select('id, total_amount_jpy, status, paid_at, commission_amount, referred_by_guide_id')
        .in('status', ['paid', 'confirmed', 'completed']),

      // 2. MTD orders
      supabase
        .from('orders')
        .select('id, total_amount_jpy')
        .in('status', ['paid', 'confirmed', 'completed'])
        .gte('paid_at', monthStart),

      // 3. All screenings
      supabase
        .from('health_screenings')
        .select('id, status, user_id'),

      // 4. MTD screenings
      supabase
        .from('health_screenings')
        .select('id')
        .gte('created_at', monthStart),

      // 5. AI runs (for cost/latency)
      supabase
        .from('screening_ai_runs')
        .select('model_name, input_tokens, output_tokens, latency_ms'),

      // 6. Guides
      supabase
        .from('guides')
        .select('id, kyc_status, subscription_tier, available_balance, total_withdrawn'),

      // 7. Pending KYC count
      supabase
        .from('guides')
        .select('id', { count: 'exact', head: true })
        .eq('kyc_status', 'submitted'),

      // 8. Commission settlements
      supabase
        .from('commission_settlements')
        .select('total_commission, status'),

      // 9. Monthly revenue (last 12 months orders)
      supabase
        .from('orders')
        .select('total_amount_jpy, paid_at, commission_amount')
        .in('status', ['paid', 'confirmed', 'completed'])
        .gte('paid_at', last12)
        .order('paid_at', { ascending: true }),

      // 10. Adjudications (risk distribution)
      supabase
        .from('screening_adjudications')
        .select('final_risk_level'),
    ]);

    // ---- Process orders ----
    const orders = ordersRes.data ?? [];
    const totalGMV = orders.reduce((s, o) => s + (o.total_amount_jpy || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalGMV / totalOrders) : 0;
    const totalCommissionsFromOrders = orders.reduce(
      (s, o) => s + (o.commission_amount || 0),
      0
    );

    const mtdOrders = mtdOrdersRes.data ?? [];
    const mtdGMV = mtdOrders.reduce((s, o) => s + (o.total_amount_jpy || 0), 0);

    // ---- Process screenings ----
    const screenings = screeningsRes.data ?? [];
    const completedScreenings = screenings.filter((s) => s.status === 'completed');
    const completionRate =
      screenings.length > 0
        ? Math.round((completedScreenings.length / screenings.length) * 100)
        : 0;

    // ---- Risk distribution ----
    const riskDist: RiskDistribution = { low: 0, medium: 0, high: 0 };
    for (const adj of adjudicationsRes.data ?? []) {
      const level = adj.final_risk_level;
      if (level === 'emergency') {
        riskDist.high++; // Roll emergency into high for dashboard display
      } else if (level in riskDist) {
        riskDist[level as keyof RiskDistribution]++;
      }
    }

    // ---- AI cost & latency ----
    const aiRuns = aiRunsRes.data ?? [];
    let totalAiCost = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    for (const run of aiRuns) {
      totalAiCost += estimateAiCost(
        run.input_tokens || 0,
        run.output_tokens || 0,
        run.model_name || ''
      );
      if (run.latency_ms) {
        totalLatency += run.latency_ms;
        latencyCount++;
      }
    }
    const avgLatency = latencyCount > 0 ? Math.round(totalLatency / latencyCount) : 0;

    // ---- Guides ----
    const guides = guidesRes.data ?? [];
    const activeGuides = guides.filter(
      (g) => g.kyc_status === 'approved'
    ).length;
    const goldPartners = guides.filter(
      (g) => g.subscription_tier === 'partner'
    ).length;
    const growthPartners = guides.filter(
      (g) => g.subscription_tier === 'growth'
    ).length;

    // Total commission payouts from settlements
    const settlements = commissionsRes.data ?? [];
    const totalPayouts = settlements
      .filter((s) => s.status === 'paid')
      .reduce((sum, s) => sum + (Number(s.total_commission) || 0), 0);

    // ---- Conversion funnel ----
    // Orders that came from screening users (have user_id that also has a screening)
    const screeningUserIds = new Set(
      completedScreenings.map((s) => s.user_id).filter(Boolean)
    );
    const ordersFromScreening = orders.filter(
      (o) => o.referred_by_guide_id || screeningUserIds.size > 0
    ).length;
    // Simple conversion: completed screenings → orders
    const conversionRate =
      completedScreenings.length > 0
        ? Math.round((orders.length / completedScreenings.length) * 1000) / 10
        : 0;

    // ---- Monthly revenue time series ----
    const monthlyMap = new Map<string, MonthlyRevenue>();
    for (const o of monthlyRes.data ?? []) {
      if (!o.paid_at) continue;
      const month = o.paid_at.substring(0, 7); // 'YYYY-MM'
      const existing = monthlyMap.get(month) || {
        month,
        revenue: 0,
        orders: 0,
        commissions: 0,
      };
      existing.revenue += o.total_amount_jpy || 0;
      existing.orders += 1;
      existing.commissions += o.commission_amount || 0;
      monthlyMap.set(month, existing);
    }
    // Fill missing months
    const monthlyRevenue: MonthlyRevenue[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue.push(
        monthlyMap.get(key) || { month: key, revenue: 0, orders: 0, commissions: 0 }
      );
    }

    // ---- Take rate ----
    const takeRate =
      totalGMV > 0
        ? Math.round(((totalGMV - totalCommissionsFromOrders) / totalGMV) * 1000) / 10
        : 100;

    const response: AnalyticsResponse = {
      revenue: {
        totalGMV,
        mtdGMV,
        totalOrders,
        mtdOrders: mtdOrders.length,
        avgOrderValue,
        totalCommissions: totalCommissionsFromOrders,
        takeRate,
      },
      screenings: {
        total: screenings.length,
        completed: completedScreenings.length,
        completionRate,
        mtdTotal: (mtdScreeningsRes.data ?? []).length,
        riskDistribution: riskDist,
        avgAiLatencyMs: avgLatency,
        totalAiCostEstimate: Math.round(totalAiCost * 100) / 100,
      },
      guides: {
        totalActive: activeGuides,
        goldPartners,
        growthPartners,
        pendingKYC: pendingKycRes.count ?? 0,
        totalPayouts: Math.round(totalPayouts),
      },
      funnel: {
        screeningsCompleted: completedScreenings.length,
        ordersFromScreening,
        conversionRate,
      },
      monthlyRevenue,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/analytics', method: 'GET' });
    return createErrorResponse(apiError);
  }
}
