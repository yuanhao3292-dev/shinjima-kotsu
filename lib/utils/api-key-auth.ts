/**
 * API Key Authentication for B2B AEMC SaaS
 *
 * Keys are prefixed: nk_live_XXXX or nk_test_XXXX
 * Stored as SHA-256 hash in database.
 */

import { createHash, randomBytes } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/api';

export interface APIKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  owner_email: string;
  owner_org: string | null;
  scopes: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  total_requests: number;
  is_active: boolean;
  expires_at: string | null;
}

export interface APIKeyValidation {
  valid: boolean;
  error?: string;
  key?: APIKeyRecord;
}

/** Hash an API key for storage/lookup */
export function hashAPIKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/** Generate a new API key */
export function generateAPIKey(env: 'live' | 'test' = 'live'): {
  key: string;
  hash: string;
  prefix: string;
} {
  const random = randomBytes(24).toString('base64url');
  const key = `nk_${env}_${random}`;
  const hash = hashAPIKey(key);
  const prefix = key.slice(0, 12);
  return { key, hash, prefix };
}

/** Validate an API key from request header */
export async function validateAPIKey(
  authHeader: string | null,
  requiredScope: string = 'medical_triage'
): Promise<APIKeyValidation> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }

  const key = authHeader.slice(7);
  if (!key.startsWith('nk_')) {
    return { valid: false, error: 'Invalid API key format' };
  }

  const hash = hashAPIKey(key);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', hash)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Invalid or inactive API key' };
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'API key has expired' };
  }

  // Check scope
  if (!data.scopes.includes(requiredScope)) {
    return {
      valid: false,
      error: `API key does not have required scope: ${requiredScope}`,
    };
  }

  // Update usage stats (fire-and-forget)
  Promise.resolve(
    supabase
      .from('api_keys')
      .update({
        total_requests: (data.total_requests || 0) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', data.id)
  ).catch((e) => console.warn('[API Key] Usage stats update failed:', e));

  return { valid: true, key: data as APIKeyRecord };
}

/** Log API usage */
export async function logAPIUsage(params: {
  apiKeyId: string;
  endpoint: string;
  statusCode: number;
  latencyMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  error?: string;
  ipAddress?: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from('api_usage_log').insert({
    api_key_id: params.apiKeyId,
    endpoint: params.endpoint,
    status_code: params.statusCode,
    latency_ms: params.latencyMs || null,
    input_tokens: params.inputTokens || null,
    output_tokens: params.outputTokens || null,
    error: params.error || null,
    ip_address: params.ipAddress || null,
  });
}
