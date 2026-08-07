-- ============================================
-- 安全修复：customer_service_contracts 敏感字段改为密文存储
--
-- 应用层从本次改动起，通过 lib/utils/contract-pii.ts 以 AES-256-GCM
-- 加密写入下列字段。密文格式为 "iv:authTag:ciphertext"（Base64），
-- 长度远超原有的 VARCHAR(50)/VARCHAR(100)，因此先把列放宽到 TEXT。
--
-- 历史行仍是明文，读取路径通过 isEncrypted() 判别后原样返回，
-- 无需一次性回填；这些行会在客户重新签署时自然转为密文。
-- ============================================

ALTER TABLE customer_service_contracts
  ALTER COLUMN passport_number   TYPE TEXT,
  ALTER COLUMN phone             TYPE TEXT,
  ALTER COLUMN email             TYPE TEXT,
  ALTER COLUMN emergency_contact TYPE TEXT,
  ALTER COLUMN emergency_phone   TYPE TEXT;

COMMENT ON COLUMN customer_service_contracts.passport_number IS
  '护照号（AES-256-GCM 密文，见 lib/utils/contract-pii.ts；历史行可能为明文）';
COMMENT ON COLUMN customer_service_contracts.phone IS
  '联系电话（AES-256-GCM 密文；历史行可能为明文）';
COMMENT ON COLUMN customer_service_contracts.email IS
  '联系邮箱（AES-256-GCM 密文；历史行可能为明文）';
COMMENT ON COLUMN customer_service_contracts.emergency_contact IS
  '紧急联系人（AES-256-GCM 密文；历史行可能为明文）';
COMMENT ON COLUMN customer_service_contracts.emergency_phone IS
  '紧急联系人电话（AES-256-GCM 密文；历史行可能为明文）';
