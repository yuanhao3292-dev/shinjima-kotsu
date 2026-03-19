-- ============================================
-- API Keys for B2B AEMC SaaS
-- ============================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Key identity
  name TEXT NOT NULL,                    -- e.g. "Partner Hospital A"
  key_hash TEXT UNIQUE NOT NULL,         -- SHA-256 hash of the actual key
  key_prefix TEXT NOT NULL,              -- First 8 chars for identification (e.g. "nk_live_a1b2")
  -- Owner
  owner_email TEXT NOT NULL,
  owner_org TEXT,                        -- Organization name
  -- Permissions
  scopes TEXT[] NOT NULL DEFAULT '{medical_triage}',
  -- Rate limits
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 10,
  rate_limit_per_day INTEGER NOT NULL DEFAULT 1000,
  -- Usage tracking
  total_requests INTEGER NOT NULL DEFAULT 0,
  total_tokens_in INTEGER NOT NULL DEFAULT 0,
  total_tokens_out INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  -- Lifecycle
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for key lookup (most common query path)
CREATE INDEX idx_api_keys_key_hash ON api_keys (key_hash) WHERE is_active = true;
CREATE INDEX idx_api_keys_prefix ON api_keys (key_prefix);

-- API usage log (append-only audit trail)
CREATE TABLE api_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id),
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  latency_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  error TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_usage_key_date ON api_usage_log (api_key_id, created_at DESC);

-- RLS: Only service role can access
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;
