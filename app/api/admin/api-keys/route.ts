/**
 * Admin API Key Management
 *
 * GET  /api/admin/api-keys — List all API keys
 * POST /api/admin/api-keys — Create a new API key (returns the raw key ONCE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { generateAPIKey } from '@/lib/utils/api-key-auth';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/api-keys:GET`,
    RATE_LIMITS.standard
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, owner_email, owner_org, scopes, rate_limit_per_minute, rate_limit_per_day, total_requests, total_tokens_in, total_tokens_out, is_active, last_used_at, expires_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/api-keys', method: 'GET' });
      return createErrorResponse(Errors.internal('Failed to fetch API keys'));
    }

    return NextResponse.json({ keys: data || [] });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/api-keys', method: 'GET' });
    return createErrorResponse(apiError);
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/api-keys`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(
      Errors.rateLimit(rateLimitResult.retryAfter),
      createRateLimitHeaders(rateLimitResult)
    );
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  try {
    const body = await request.json();
    const { name, ownerEmail, ownerOrg, rateLimitPerMinute, rateLimitPerDay } = body as {
      name?: string;
      ownerEmail?: string;
      ownerOrg?: string;
      rateLimitPerMinute?: number;
      rateLimitPerDay?: number;
    };

    if (!name || !ownerEmail) {
      return createErrorResponse(Errors.validation('name and ownerEmail are required'));
    }

    const { key, hash, prefix } = generateAPIKey('live');
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from('api_keys').insert({
      name,
      key_hash: hash,
      key_prefix: prefix,
      owner_email: ownerEmail,
      owner_org: ownerOrg || null,
      rate_limit_per_minute: rateLimitPerMinute || 10,
      rate_limit_per_day: rateLimitPerDay || 1000,
    });

    if (error) {
      logError(normalizeError(error), { path: '/api/admin/api-keys', method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to create API key'));
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      action: 'api_key_created',
      entity_type: 'api_key',
      entity_id: prefix,
      admin_id: authResult.userId,
      admin_email: authResult.email,
      details: { name, ownerEmail, ownerOrg },
    });

    // Return raw key ONCE — it cannot be retrieved again
    return NextResponse.json({
      key, // Only time the full key is returned
      prefix,
      name,
      message: 'Save this API key securely. It cannot be retrieved again.',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: '/api/admin/api-keys', method: 'POST' });
    return createErrorResponse(apiError);
  }
}
