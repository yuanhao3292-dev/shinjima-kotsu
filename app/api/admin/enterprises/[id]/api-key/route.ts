/**
 * Admin Enterprise API Key Management
 *
 * POST   /api/admin/enterprises/[id]/api-key — Generate new API key for enterprise
 * DELETE /api/admin/enterprises/[id]/api-key — Deactivate current API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import { generateAPIKey } from '@/lib/utils/api-key-auth';
import { checkRateLimit, getClientIp, RATE_LIMITS, createRateLimitHeaders } from '@/lib/utils/rate-limiter';
import { normalizeError, logError, createErrorResponse, Errors } from '@/lib/utils/api-errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/api-key`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();

  try {
    // Get enterprise info
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('id, name, contact_email, api_key_id')
      .eq('id', enterpriseId)
      .single();

    if (!enterprise) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    // Deactivate existing key if any
    if (enterprise.api_key_id) {
      await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', enterprise.api_key_id);
    }

    // Generate new key
    const { key, hash, prefix } = generateAPIKey('live');

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .insert({
        name: `Enterprise: ${enterprise.name}`,
        key_hash: hash,
        key_prefix: prefix,
        owner_email: enterprise.contact_email,
        owner_org: enterprise.name,
        scopes: ['medical_triage', 'enterprise_management', 'enterprise_screening'],
        rate_limit_per_minute: 30,
        rate_limit_per_day: 5000,
      })
      .select('id')
      .single();

    if (error || !apiKey) {
      logError(normalizeError(error), { path: `/api/admin/enterprises/${enterpriseId}/api-key`, method: 'POST' });
      return createErrorResponse(Errors.internal('Failed to create API key'));
    }

    // Link key to enterprise
    await supabase
      .from('enterprises')
      .update({ api_key_id: apiKey.id })
      .eq('id', enterpriseId);

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'api_key_generated',
      details: { prefix, admin_email: authResult.email },
    });

    return NextResponse.json({
      success: true,
      key, // Only time the full key is returned
      prefix,
      message: 'Save this API key securely. It cannot be retrieved again.',
    });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/api-key`, method: 'POST' });
    return createErrorResponse(apiError);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id: enterpriseId } = await context.params;

  const clientIp = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `${clientIp}:/api/admin/enterprises/${enterpriseId}/api-key:DELETE`,
    RATE_LIMITS.sensitive
  );
  if (!rateLimitResult.success) {
    return createErrorResponse(Errors.rateLimit(rateLimitResult.retryAfter), createRateLimitHeaders(rateLimitResult));
  }

  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return createErrorResponse(Errors.auth(authResult.error));
  }

  const supabase = getSupabaseAdmin();

  try {
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('id, api_key_id')
      .eq('id', enterpriseId)
      .single();

    if (!enterprise) {
      return createErrorResponse(Errors.notFound('Enterprise'));
    }

    if (!enterprise.api_key_id) {
      return createErrorResponse(Errors.business('No API key linked to this enterprise', 'NO_API_KEY'));
    }

    // Deactivate key
    await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', enterprise.api_key_id);

    // Unlink from enterprise
    await supabase
      .from('enterprises')
      .update({ api_key_id: null })
      .eq('id', enterpriseId);

    // Audit log
    await supabase.from('enterprise_audit_log').insert({
      enterprise_id: enterpriseId,
      actor_type: 'admin',
      actor_id: authResult.userId,
      action: 'api_key_revoked',
      details: { admin_email: authResult.email },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const apiError = normalizeError(error);
    logError(apiError, { path: `/api/admin/enterprises/${enterpriseId}/api-key`, method: 'DELETE' });
    return createErrorResponse(apiError);
  }
}
