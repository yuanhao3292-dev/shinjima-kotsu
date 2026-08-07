-- ============================================
-- KYC 身份验证系统
-- KYC Identity Verification System
-- ============================================

-- 添加 KYC 相关字段到 guides 表
ALTER TABLE guides ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'pending'
  CHECK (kyc_status IN ('pending', 'submitted', 'approved', 'rejected'));

-- 身份证类型（护照/身份证/在留卡）
ALTER TABLE guides ADD COLUMN IF NOT EXISTS id_document_type VARCHAR(30)
  CHECK (id_document_type IN ('passport', 'id_card', 'residence_card', 'other'));

-- 身份证号（加密存储）
ALTER TABLE guides ADD COLUMN IF NOT EXISTS id_document_number VARCHAR(100);

-- 身份证照片 URL（存储在 Supabase Storage）
ALTER TABLE guides ADD COLUMN IF NOT EXISTS id_document_front_url TEXT;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS id_document_back_url TEXT;

-- 真实姓名（与证件一致）
ALTER TABLE guides ADD COLUMN IF NOT EXISTS legal_name VARCHAR(100);

-- 国籍
ALTER TABLE guides ADD COLUMN IF NOT EXISTS nationality VARCHAR(50);

-- KYC 提交和审核时间
ALTER TABLE guides ADD COLUMN IF NOT EXISTS kyc_submitted_at TIMESTAMPTZ;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS kyc_reviewed_at TIMESTAMPTZ;

-- KYC 审核备注
ALTER TABLE guides ADD COLUMN IF NOT EXISTS kyc_review_note TEXT;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_guides_kyc_status ON guides(kyc_status);

-- ============================================
-- Storage Policy for KYC Documents
-- ============================================
-- 注意：需要在 Supabase Dashboard 创建 bucket: kyc-documents
-- 并设置为 private（非公开）

-- ============================================
-- 完成
-- ============================================
