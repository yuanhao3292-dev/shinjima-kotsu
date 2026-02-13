-- 合同管理系统
-- 创建日期：2026-02-13
-- 功能：医疗机构合作协议、导游佣金协议、客户服务合同管理

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. 医疗机构合作协议表
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS medical_institution_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(100) UNIQUE NOT NULL, -- 合同编号 NJKT-MIC-2026-001

  -- 医疗机构信息
  institution_name VARCHAR(500) NOT NULL, -- 医疗机构名称
  institution_type VARCHAR(100), -- 病院/クリニック/検診センター
  institution_code VARCHAR(100), -- 医療機関コード
  certifications JSONB, -- 认证资质 [JCI, ISO, 厚生省]
  representative_name VARCHAR(200), -- 代表者姓名
  representative_title VARCHAR(100), -- 院長/理事長
  address TEXT, -- 所在地
  phone VARCHAR(50),
  email VARCHAR(200),

  -- 合作范围
  service_scope JSONB, -- ['健康体检', '精密体检', '专科诊疗', '美容医疗', '癌症治疗']
  is_free_medical_care BOOLEAN DEFAULT true, -- 是否为自由诊疗（非保险诊疗）

  -- 紹介料标准
  referral_fee_type VARCHAR(50), -- 'percentage' | 'fixed'
  referral_fee_config JSONB, -- { ranges: [...], amounts: [...] } 或 { items: [...] }
  payment_cycle VARCHAR(50) DEFAULT 'monthly', -- monthly/quarterly
  payment_day INTEGER DEFAULT 15, -- 每月15日支付
  bank_account JSONB, -- 银行账户信息

  -- 合同条款
  contract_term_years INTEGER DEFAULT 1, -- 合同期限（年）
  auto_renewal BOOLEAN DEFAULT true, -- 是否自动续约
  notice_days INTEGER DEFAULT 60, -- 提前终止通知天数

  -- 状态
  status VARCHAR(50) DEFAULT 'draft', -- draft/pending/active/expired/terminated
  signed_by_institution_at TIMESTAMPTZ, -- 医疗机构签署时间
  signed_by_niijima_at TIMESTAMPTZ, -- 新岛交通签署时间
  effective_date DATE, -- 生效日期
  expiry_date DATE, -- 到期日期

  -- PDF文件
  pdf_url TEXT, -- 合同PDF URL
  institution_signature_url TEXT, -- 医疗机构签字扫描件
  niijima_signature_url TEXT, -- 新岛交通签字扫描件

  -- 审计
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_medical_contracts_status ON medical_institution_contracts(status);
CREATE INDEX IF NOT EXISTS idx_medical_contracts_institution ON medical_institution_contracts(institution_name);
CREATE INDEX IF NOT EXISTS idx_medical_contracts_expiry ON medical_institution_contracts(expiry_date);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. 导游佣金协议表
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS guide_commission_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(100) UNIQUE NOT NULL, -- 合同编号 NJKT-GC-2026-001

  -- 导游信息
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  guide_name VARCHAR(200) NOT NULL, -- 导游姓名/商号
  guide_slug VARCHAR(100), -- 白标独立站 slug
  identity_number VARCHAR(100), -- 身份证号/パスポート番号
  phone VARCHAR(50),
  email VARCHAR(200),
  bank_account JSONB, -- 银行账户信息

  -- 佣金标准
  commission_type VARCHAR(50), -- 'fixed_percentage' | 'tiered'
  commission_config JSONB, -- { service_fee: 60, referral_fee: 70 } 或阶梯配置

  -- 合同条款
  contract_term_years INTEGER DEFAULT 1,
  auto_renewal BOOLEAN DEFAULT true,
  notice_days INTEGER DEFAULT 30,

  -- 合规确认（导游必须确认的合规要点）
  compliance_acknowledged BOOLEAN DEFAULT false, -- 是否确认合规要求
  compliance_checklist JSONB, -- 合规检查清单确认
  compliance_acknowledged_at TIMESTAMPTZ, -- 确认时间

  -- 状态
  status VARCHAR(50) DEFAULT 'draft', -- draft/pending/active/expired/terminated
  signed_by_guide_at TIMESTAMPTZ, -- 导游签署时间
  signed_by_niijima_at TIMESTAMPTZ, -- 新岛交通签署时间
  effective_date DATE,
  expiry_date DATE,

  -- PDF文件
  pdf_url TEXT, -- 合同PDF URL
  guide_signature_url TEXT, -- 导游签字扫描件（上传）
  niijima_signature_url TEXT,

  -- 审计
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_guide_contracts_guide_id ON guide_commission_contracts(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_contracts_status ON guide_commission_contracts(status);
CREATE INDEX IF NOT EXISTS idx_guide_contracts_expiry ON guide_commission_contracts(expiry_date);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. 客户服务合同表
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS customer_service_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(100) UNIQUE NOT NULL, -- 合同编号 NJKT-MT-2026-0001

  -- 客户信息
  customer_name VARCHAR(200) NOT NULL,
  passport_number VARCHAR(100),
  nationality VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(200),
  emergency_contact VARCHAR(200), -- 紧急联系人
  emergency_phone VARCHAR(50),

  -- 服务信息
  service_items JSONB, -- 服务项目列表
  service_fee_jpy INTEGER NOT NULL, -- 旅行服务费（日元）
  medical_fee_estimate_jpy INTEGER, -- 医疗费用预估

  -- 医疗机构信息
  medical_institution_name VARCHAR(500),
  medical_institution_address TEXT,
  appointment_project VARCHAR(500), -- 预约项目
  appointment_datetime TIMESTAMPTZ, -- 预约时间

  -- 行程信息
  itinerary JSONB, -- 详细行程
  arrival_date DATE,
  departure_date DATE,

  -- 专属导游
  assigned_guide_id UUID REFERENCES guides(id),
  assigned_guide_name VARCHAR(200),
  assigned_guide_phone VARCHAR(50),

  -- 支付信息
  payment_method VARCHAR(50), -- 'credit_card' | 'bank_transfer'
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending/paid/refunded
  stripe_session_id VARCHAR(200),
  paid_at TIMESTAMPTZ,

  -- 状态
  status VARCHAR(50) DEFAULT 'draft', -- draft/pending/signed/active/completed/cancelled
  signed_by_customer_at TIMESTAMPTZ, -- 客户签署时间
  customer_signature_data TEXT, -- 客户在线签名（base64）
  signed_by_niijima_at TIMESTAMPTZ,

  -- PDF文件
  pdf_url TEXT, -- 合同PDF URL

  -- 审计
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_customer_contracts_customer ON customer_service_contracts(customer_name);
CREATE INDEX IF NOT EXISTS idx_customer_contracts_status ON customer_service_contracts(status);
CREATE INDEX IF NOT EXISTS idx_customer_contracts_guide ON customer_service_contracts(assigned_guide_id);
CREATE INDEX IF NOT EXISTS idx_customer_contracts_date ON customer_service_contracts(arrival_date);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. 合规审查记录表
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS compliance_review_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 审查周期
  review_quarter VARCHAR(10) NOT NULL, -- '2026-Q1', '2026-Q2'
  review_due_date DATE NOT NULL, -- 审查截止日期

  -- 审查项目
  tasks JSONB NOT NULL, -- [{ task: '检查文案', status: 'pending', completed_at: null }, ...]

  -- 状态
  status VARCHAR(50) DEFAULT 'pending', -- pending/in_progress/completed/overdue
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),

  -- 审查结果
  findings JSONB, -- 发现的问题
  actions_taken JSONB, -- 采取的措施
  notes TEXT, -- 备注

  -- 审计
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_compliance_review_quarter ON compliance_review_records(review_quarter);
CREATE INDEX IF NOT EXISTS idx_compliance_review_status ON compliance_review_records(status);
CREATE INDEX IF NOT EXISTS idx_compliance_review_due ON compliance_review_records(review_due_date);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 5. 自动更新时间戳触发器
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_medical_contracts_updated_at ON medical_institution_contracts;
CREATE TRIGGER update_medical_contracts_updated_at
  BEFORE UPDATE ON medical_institution_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guide_contracts_updated_at ON guide_commission_contracts;
CREATE TRIGGER update_guide_contracts_updated_at
  BEFORE UPDATE ON guide_commission_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_contracts_updated_at ON customer_service_contracts;
CREATE TRIGGER update_customer_contracts_updated_at
  BEFORE UPDATE ON customer_service_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_compliance_review_updated_at ON compliance_review_records;
CREATE TRIGGER update_compliance_review_updated_at
  BEFORE UPDATE ON compliance_review_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 6. RLS 策略（✅ 修正：使用 auth_user_id）
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 先删除可能已存在的策略
DROP POLICY IF EXISTS "Admin can manage medical contracts" ON medical_institution_contracts;
DROP POLICY IF EXISTS "Guide can view own contract" ON guide_commission_contracts;
DROP POLICY IF EXISTS "Admin can manage guide contracts" ON guide_commission_contracts;
DROP POLICY IF EXISTS "Public can view own contract by ID" ON customer_service_contracts;
DROP POLICY IF EXISTS "Admin can manage customer contracts" ON customer_service_contracts;
DROP POLICY IF EXISTS "Admin can manage compliance reviews" ON compliance_review_records;

ALTER TABLE medical_institution_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_commission_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_service_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_review_records ENABLE ROW LEVEL SECURITY;

-- 医疗机构合同：仅管理员可访问
CREATE POLICY "Admin can manage medical contracts"
  ON medical_institution_contracts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- 导游佣金协议：导游可查看自己的，管理员可查看所有
-- ✅ 修正：使用 auth_user_id 而不是 user_id
CREATE POLICY "Guide can view own contract"
  ON guide_commission_contracts
  FOR SELECT
  USING (
    guide_id IN (
      SELECT id FROM guides WHERE auth_user_id = auth.uid()
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admin can manage guide contracts"
  ON guide_commission_contracts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- 客户服务合同：客户可查看自己的（通过UUID），管理员可查看所有
CREATE POLICY "Public can view own contract by ID"
  ON customer_service_contracts
  FOR SELECT
  USING (true); -- 通过UUID访问，本身就有安全性

CREATE POLICY "Admin can manage customer contracts"
  ON customer_service_contracts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- 合规审查：仅管理员可访问
CREATE POLICY "Admin can manage compliance reviews"
  ON compliance_review_records
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 7. 初始化合规审查任务（每季度）
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 创建2026年Q1的合规审查任务
INSERT INTO compliance_review_records (review_quarter, review_due_date, tasks, status)
VALUES (
  '2026-Q1',
  '2026-03-31',
  '[
    {"task": "检查白标页面文案是否合规", "status": "pending", "completed_at": null, "description": "检查所有导游白标页面是否使用合规文案，禁止"医疗介绍""医疗中介"等表述"},
    {"task": "检查合同模板是否需要更新", "status": "pending", "completed_at": null, "description": "review contracts/目录下的三个合同模板，确保符合最新法律要求"},
    {"task": "培训导游合规要求", "status": "pending", "completed_at": null, "description": "组织导游合规培训，强调禁止行为和合规话术"}
  ]'::jsonb,
  'pending'
)
ON CONFLICT DO NOTHING;

-- 注释
COMMENT ON TABLE medical_institution_contracts IS '医疗机构合作协议表';
COMMENT ON TABLE guide_commission_contracts IS '导游佣金协议表';
COMMENT ON TABLE customer_service_contracts IS '客户医疗旅行服务合同表';
COMMENT ON TABLE compliance_review_records IS '合规审查记录表';
