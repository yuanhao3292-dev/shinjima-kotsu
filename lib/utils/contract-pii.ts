/**
 * 客户服务合同 PII 加解密
 * ============================================
 * customer_service_contracts 表存储护照号、联系方式、紧急联系人等敏感信息。
 * 这些字段在库中以密文形式存放（AES-256-GCM，见 lib/utils/encryption.ts）。
 *
 * 迁移兼容：加密前写入的历史行是明文，decryptPII 检测不到密文格式时
 * 会原样返回，因此读取路径对新旧数据都成立。
 */

import { decryptPII, encryptPII, isEncrypted } from './encryption';

/** 需要加密存储的列。customer_name 保持明文，供后台列表检索与显示。 */
export const CONTRACT_PII_FIELDS = [
  'passport_number',
  'phone',
  'email',
  'emergency_contact',
  'emergency_phone',
] as const;

type ContractPIIField = (typeof CONTRACT_PII_FIELDS)[number];

/** 客户提交的表单字段名 → 数据库列名 */
const FORM_TO_COLUMN: Record<string, ContractPIIField> = {
  passportNumber: 'passport_number',
  phone: 'phone',
  email: 'email',
  emergencyContact: 'emergency_contact',
  emergencyPhone: 'emergency_phone',
};

/**
 * 把客户表单数据中的敏感字段加密成数据库列。
 * 空值不写入，避免用空字符串覆盖已有数据。
 */
export function encryptContractPII(
  customerData: Record<string, unknown>
): Partial<Record<ContractPIIField, string>> {
  const result: Partial<Record<ContractPIIField, string>> = {};

  for (const [formKey, column] of Object.entries(FORM_TO_COLUMN)) {
    const value = customerData[formKey];
    if (typeof value === 'string' && value.trim()) {
      result[column] = encryptPII(value.trim());
    }
  }

  return result;
}

/**
 * 解密合同行的敏感字段，返回可直接交给前端的对象。
 * 单个字段解密失败（例如密钥轮换后遗留的旧密文）不会中断整行读取，
 * 该字段返回空字符串。
 */
export function decryptContractRow<T extends Record<string, unknown>>(contract: T): T {
  if (!contract) return contract;

  const result: Record<string, unknown> = { ...contract };

  for (const field of CONTRACT_PII_FIELDS) {
    const value = contract[field];
    if (typeof value !== 'string' || !value) continue;
    if (!isEncrypted(value)) continue; // 历史明文行，原样保留

    try {
      result[field] = decryptPII(value, true);
    } catch {
      result[field] = '';
    }
  }

  return result as T;
}
