/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * 检查所有关键依赖的连通性，用于 uptime 监控和部署验证。
 * 响应时间 < 3s 为健康，> 5s 视为降级。
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/api';

interface DependencyCheck {
  status: 'ok' | 'degraded' | 'down';
  latency_ms: number;
  error?: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const start = Date.now();
  const checks: Record<string, DependencyCheck> = {};

  // 1. Supabase DB
  checks.database = await checkDatabase();

  // 2. Redis (rate limiter)
  checks.redis = await checkRedis();

  // 3. Overall status
  const allOk = Object.values(checks).every((c) => c.status === 'ok');
  const anyDown = Object.values(checks).some((c) => c.status === 'down');
  const overallStatus = anyDown ? 'unhealthy' : allOk ? 'healthy' : 'degraded';

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime_ms: Date.now() - start,
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
    checks,
  };

  const httpStatus = overallStatus === 'unhealthy' ? 503 : 200;

  return NextResponse.json(response, {
    status: httpStatus,
    headers: { 'Cache-Control': 'no-store' },
  });
}

async function checkDatabase(): Promise<DependencyCheck> {
  const t0 = Date.now();
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('health_screenings')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    const latency = Date.now() - t0;
    if (error) {
      return { status: 'down', latency_ms: latency, error: error.message };
    }
    return { status: latency > 3000 ? 'degraded' : 'ok', latency_ms: latency };
  } catch (err) {
    return {
      status: 'down',
      latency_ms: Date.now() - t0,
      error: err instanceof Error ? err.message : 'Unknown',
    };
  }
}

async function checkRedis(): Promise<DependencyCheck> {
  const t0 = Date.now();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return { status: 'degraded', latency_ms: 0, error: 'Not configured (using in-memory fallback)' };
  }

  try {
    const res = await fetch(`${redisUrl}/ping`, {
      headers: { Authorization: `Bearer ${redisToken}` },
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - t0;

    if (!res.ok) {
      return { status: 'down', latency_ms: latency, error: `HTTP ${res.status}` };
    }
    return { status: latency > 3000 ? 'degraded' : 'ok', latency_ms: latency };
  } catch (err) {
    return {
      status: 'down',
      latency_ms: Date.now() - t0,
      error: err instanceof Error ? err.message : 'Unknown',
    };
  }
}
