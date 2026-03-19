-- ============================================
-- Enterprise B2B — Listed Company Executive Health Management
-- ============================================

-- Enterprise accounts (companies)
CREATE TABLE enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Company identity
  name TEXT NOT NULL,
  name_en TEXT,
  stock_code TEXT,                          -- e.g. "600519.SH", "0700.HK"
  stock_exchange TEXT CHECK (stock_exchange IS NULL OR stock_exchange IN (
    'SSE', 'SZSE', 'HKEX', 'TWSE', 'TPEx'   -- Shanghai, Shenzhen, HK, TW main, TW OTC
  )),
  region TEXT NOT NULL DEFAULT 'CN' CHECK (region IN ('CN', 'HK', 'MO', 'TW')),
  -- Contact
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_title TEXT,                        -- e.g. "HR Director", "Health Coordinator"
  -- Contract
  contract_type TEXT NOT NULL DEFAULT 'annual' CHECK (contract_type IN ('annual', 'per_use', 'trial')),
  contract_start DATE,
  contract_end DATE,
  member_limit INTEGER NOT NULL DEFAULT 50,  -- Max executives covered
  -- Pricing
  annual_fee_jpy INTEGER,                    -- Annual enterprise fee
  per_screening_fee_jpy INTEGER DEFAULT 0,   -- Per-use fee (if per_use type)
  discount_rate DECIMAL(5,2) DEFAULT 0,      -- Discount on medical packages (%)
  -- Features
  dedicated_coordinator BOOLEAN DEFAULT false,
  priority_booking BOOLEAN DEFAULT false,
  chinese_interpreter BOOLEAN DEFAULT true,
  airport_transfer BOOLEAN DEFAULT false,
  -- API access
  api_key_id UUID REFERENCES api_keys(id),
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'expired')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enterprises_status ON enterprises (status);
CREATE INDEX idx_enterprises_region ON enterprises (region, status);

-- Enterprise members (executives)
CREATE TABLE enterprise_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  -- Identity
  user_id UUID REFERENCES auth.users(id),    -- Linked auth user (optional)
  full_name TEXT NOT NULL,
  full_name_en TEXT,
  title TEXT,                                 -- "CEO", "CFO", "VP Operations"
  email TEXT,
  phone TEXT,
  -- Demographics
  gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  nationality TEXT,
  passport_number TEXT,                       -- For Japan visa/booking
  -- Health info (encrypted in production)
  medical_notes TEXT,
  allergies TEXT[],
  preferred_language TEXT DEFAULT 'zh-CN' CHECK (preferred_language IN ('ja', 'zh-CN', 'zh-TW', 'en')),
  -- Screening history
  last_screening_id UUID,
  last_screening_date TIMESTAMPTZ,
  last_health_score INTEGER,
  screening_count INTEGER NOT NULL DEFAULT 0,
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ent_members_enterprise ON enterprise_members (enterprise_id, status);
CREATE INDEX idx_ent_members_user ON enterprise_members (user_id) WHERE user_id IS NOT NULL;

-- Enterprise orders (batch bookings)
CREATE TABLE enterprise_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
  -- Order details
  order_number TEXT UNIQUE NOT NULL,
  package_id UUID REFERENCES medical_packages(id),
  member_ids UUID[] NOT NULL DEFAULT '{}',    -- Array of enterprise_member IDs
  member_count INTEGER NOT NULL DEFAULT 0,
  -- Pricing
  unit_price_jpy INTEGER NOT NULL,
  discount_rate DECIMAL(5,2) DEFAULT 0,
  total_amount_jpy INTEGER NOT NULL,
  -- Scheduling
  preferred_dates DATERANGE,
  confirmed_dates DATERANGE,
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'confirmed', 'in_progress', 'completed', 'cancelled'
  )),
  -- Payment
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'invoiced', 'paid', 'refunded')),
  invoice_number TEXT,
  paid_at TIMESTAMPTZ,
  -- Notes
  special_requirements TEXT,
  admin_notes TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ent_orders_enterprise ON enterprise_orders (enterprise_id, status);

-- RLS
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_orders ENABLE ROW LEVEL SECURITY;
