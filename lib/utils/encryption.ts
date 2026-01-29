/**
 * PII 加密工具
 * ============================================
 * 用于加密存储敏感个人信息（如身份证号码、联系方式等）
 *
 * 安全特性：
 * - 使用 AES-256-GCM 认证加密算法
 * - 每次加密使用随机 IV（防止重放攻击）
 * - 包含认证标签（防止数据篡改）
 * - 使用 scrypt 进行密钥派生
 *
 * 使用方式：
 * - 单字段：encryptPII / decryptPII
 * - 客户信息：encryptCustomerPII / decryptCustomerPII
 * - 批量处理：encryptFields / decryptFields
 *
 * 环境变量：
 * - ENCRYPTION_KEY: 加密主密钥（生产环境必须配置）
 *
 * @version 1.1.0
 * @author System
 */

import crypto from 'crypto';

// ============================================
// 类型定义
// ============================================

/**
 * 客户 PII 原始数据
 */
export interface CustomerPII {
  name?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  idNumber?: string;
  address?: string;
}

/**
 * 加密后的客户 PII 数据
 */
export interface EncryptedCustomerPII {
  customer_name?: string;
  customer_name_encrypted?: string;
  customer_email_encrypted?: string;
  customer_phone_encrypted?: string;
  customer_wechat_encrypted?: string;
  customer_id_number_encrypted?: string;
  customer_address_encrypted?: string;
}

/**
 * 加密错误类型
 */
export class EncryptionError extends Error {
  constructor(
    message: string,
    public readonly code: 'MISSING_KEY' | 'INVALID_DATA' | 'DECRYPT_FAILED' | 'ENCRYPT_FAILED'
  ) {
    super(message);
    this.name = 'EncryptionError';
  }
}

// 加密算法配置
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 初始化向量长度
const AUTH_TAG_LENGTH = 16; // 认证标签长度
const KEY_LENGTH = 32; // 256 bits

/**
 * 获取加密密钥
 * 从环境变量获取，或使用默认密钥（仅开发环境）
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    // 开发环境使用默认密钥（生产环境必须配置）
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is required in production');
    }
    console.warn('⚠️ Using default encryption key. Set ENCRYPTION_KEY in production!');
    return crypto.scryptSync('default-dev-key-not-for-production', 'salt', KEY_LENGTH);
  }

  // 使用 scrypt 派生固定长度的密钥
  return crypto.scryptSync(key, 'niijima-kotsu-pii', KEY_LENGTH);
}

/**
 * 加密敏感数据
 * @param plaintext 明文数据
 * @returns 加密后的字符串（格式：iv:authTag:ciphertext，Base64 编码）
 */
export function encryptPII(plaintext: string): string {
  if (!plaintext) return '';

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  // 返回格式：iv:authTag:ciphertext（全部 Base64 编码）
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * 解密敏感数据
 * @param encryptedData 加密后的字符串
 * @param silent 是否静默模式（不输出警告）
 * @returns 解密后的明文
 * @throws {EncryptionError} 解密失败时抛出
 */
export function decryptPII(encryptedData: string, silent: boolean = false): string {
  if (!encryptedData) return '';

  // 检查是否是加密格式（包含两个冒号分隔符）
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    // 如果不是加密格式，可能是旧的明文数据，直接返回
    // 这允许向后兼容和渐进式迁移
    if (!silent) {
      console.warn('⚠️ Data appears to be unencrypted. Consider migrating to encrypted format.');
    }
    return encryptedData;
  }

  try {
    const key = getEncryptionKey();
    const [ivBase64, authTagBase64, ciphertext] = parts;

    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    // 验证 IV 和 AuthTag 长度
    if (iv.length !== IV_LENGTH) {
      throw new EncryptionError('Invalid IV length', 'INVALID_DATA');
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new EncryptionError('Invalid auth tag length', 'INVALID_DATA');
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // 如果是我们自定义的错误，直接抛出
    if (error instanceof EncryptionError) {
      throw error;
    }
    // 其他错误（如认证失败）转换为自定义错误
    throw new EncryptionError(
      `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'DECRYPT_FAILED'
    );
  }
}

/**
 * 安全解密（失败时返回 null 或原始值，不抛出异常）
 * 适用于 UI 显示场景，解密失败不应导致页面崩溃
 *
 * @param encryptedData 加密后的字符串
 * @param fallbackToOriginal 失败时是否返回原始值（默认 true）
 * @returns 解密后的明文，失败时返回 null 或原始值
 */
export function decryptPIISafe(encryptedData: string, fallbackToOriginal: boolean = true): string | null {
  if (!encryptedData) return null;

  try {
    return decryptPII(encryptedData, true);
  } catch {
    return fallbackToOriginal ? encryptedData : null;
  }
}

/**
 * 检查数据是否已加密
 * @param data 待检查的数据
 * @returns 是否为加密格式
 */
export function isEncrypted(data: string): boolean {
  if (!data) return false;
  const parts = data.split(':');
  if (parts.length !== 3) return false;

  // 检查各部分是否都是有效的 Base64
  try {
    const [iv, authTag] = parts;
    const ivBuffer = Buffer.from(iv, 'base64');
    const authTagBuffer = Buffer.from(authTag, 'base64');

    return ivBuffer.length === IV_LENGTH && authTagBuffer.length === AUTH_TAG_LENGTH;
  } catch {
    return false;
  }
}

/**
 * 对 PII 进行脱敏显示（用于日志和 UI）
 * @param plaintext 明文数据
 * @param visibleChars 显示的字符数（首尾各显示一半）
 * @returns 脱敏后的字符串
 */
export function maskPII(plaintext: string, visibleChars: number = 4): string {
  if (!plaintext) return '';
  if (plaintext.length <= visibleChars) return '*'.repeat(plaintext.length);

  const halfVisible = Math.floor(visibleChars / 2);
  const start = plaintext.substring(0, halfVisible);
  const end = plaintext.substring(plaintext.length - halfVisible);
  const masked = '*'.repeat(Math.min(6, plaintext.length - visibleChars));

  return `${start}${masked}${end}`;
}

// ============================================
// 客户 PII 批量处理函数
// ============================================

/**
 * 加密客户 PII 数据
 * 将原始客户信息转换为数据库存储格式
 *
 * @param pii 原始客户信息
 * @returns 加密后的数据库字段对象
 *
 * @example
 * const encrypted = encryptCustomerPII({
 *   name: '张三',
 *   email: 'zhang@example.com',
 *   phone: '13800138000'
 * });
 * // 结果:
 * // {
 * //   customer_name: '张三',  // 姓名保留明文用于显示
 * //   customer_name_encrypted: 'xxx:xxx:xxx',
 * //   customer_email_encrypted: 'xxx:xxx:xxx',
 * //   customer_phone_encrypted: 'xxx:xxx:xxx'
 * // }
 */
export function encryptCustomerPII(pii: CustomerPII): EncryptedCustomerPII {
  const result: EncryptedCustomerPII = {};

  // 姓名同时保存明文和加密版本
  // 明文用于列表显示，加密版本用于数据保护
  if (pii.name) {
    result.customer_name = pii.name;
    result.customer_name_encrypted = encryptPII(pii.name);
  }

  // 其他敏感字段仅保存加密版本
  if (pii.email) {
    result.customer_email_encrypted = encryptPII(pii.email);
  }
  if (pii.phone) {
    result.customer_phone_encrypted = encryptPII(pii.phone);
  }
  if (pii.wechat) {
    result.customer_wechat_encrypted = encryptPII(pii.wechat);
  }
  if (pii.idNumber) {
    result.customer_id_number_encrypted = encryptPII(pii.idNumber);
  }
  if (pii.address) {
    result.customer_address_encrypted = encryptPII(pii.address);
  }

  return result;
}

/**
 * 解密客户 PII 数据
 * 将数据库存储格式转换回原始客户信息
 *
 * @param encrypted 加密的数据库字段对象
 * @returns 解密后的原始客户信息
 *
 * @example
 * const pii = decryptCustomerPII(order);
 * // pii = { name: '张三', email: 'zhang@example.com', phone: '13800138000' }
 */
export function decryptCustomerPII(encrypted: EncryptedCustomerPII): CustomerPII {
  const result: CustomerPII = {};

  // 姓名优先从加密字段解密，其次使用明文字段
  if (encrypted.customer_name_encrypted) {
    result.name = decryptPII(encrypted.customer_name_encrypted);
  } else if (encrypted.customer_name) {
    result.name = encrypted.customer_name;
  }

  if (encrypted.customer_email_encrypted) {
    result.email = decryptPII(encrypted.customer_email_encrypted);
  }
  if (encrypted.customer_phone_encrypted) {
    result.phone = decryptPII(encrypted.customer_phone_encrypted);
  }
  if (encrypted.customer_wechat_encrypted) {
    result.wechat = decryptPII(encrypted.customer_wechat_encrypted);
  }
  if (encrypted.customer_id_number_encrypted) {
    result.idNumber = decryptPII(encrypted.customer_id_number_encrypted);
  }
  if (encrypted.customer_address_encrypted) {
    result.address = decryptPII(encrypted.customer_address_encrypted);
  }

  return result;
}

/**
 * 批量加密指定字段
 * 通用函数，用于加密对象中的指定字段
 *
 * @param data 原始数据对象
 * @param fieldsToEncrypt 需要加密的字段名数组
 * @returns 加密后的数据对象（加密字段添加 _encrypted 后缀）
 */
export function encryptFields<T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): T & Record<string, string> {
  const result: Record<string, unknown> = { ...data };

  for (const field of fieldsToEncrypt) {
    const value = data[field];
    if (typeof value === 'string' && value) {
      result[`${String(field)}_encrypted`] = encryptPII(value);
    }
  }

  return result as T & Record<string, string>;
}

/**
 * 批量解密指定字段
 * 通用函数，用于解密对象中的加密字段
 *
 * @param data 包含加密字段的数据对象
 * @param encryptedFields 加密字段名数组（带 _encrypted 后缀）
 * @returns 解密后的数据对象
 */
export function decryptFields<T extends Record<string, unknown>>(
  data: T,
  encryptedFields: string[]
): T & Record<string, string> {
  const result: Record<string, unknown> = { ...data };

  for (const encryptedField of encryptedFields) {
    const value = data[encryptedField as keyof T];
    if (typeof value === 'string' && value) {
      // 去掉 _encrypted 后缀得到原始字段名
      const originalField = encryptedField.replace(/_encrypted$/, '');
      result[originalField] = decryptPII(value);
    }
  }

  return result as T & Record<string, string>;
}

// ============================================
// PII 脱敏显示辅助函数
// ============================================

/**
 * 脱敏邮箱地址
 * 保留首字符和域名，中间用 * 替代
 *
 * @example
 * maskEmail('zhang@example.com') // 'z***@example.com'
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return maskPII(email);

  const [local, domain] = email.split('@');
  if (local.length <= 1) return `${local}***@${domain}`;

  return `${local[0]}***@${domain}`;
}

/**
 * 脱敏手机号码
 * 保留前3位和后4位
 *
 * @example
 * maskPhone('13800138000') // '138****8000'
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return maskPII(phone);

  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 7) return maskPII(phone);

  return `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}`;
}

/**
 * 脱敏身份证号
 * 保留前6位和后4位
 *
 * @example
 * maskIdNumber('310101199001011234') // '310101********1234'
 */
export function maskIdNumber(idNumber: string): string {
  if (!idNumber || idNumber.length < 10) return maskPII(idNumber);

  return `${idNumber.slice(0, 6)}${'*'.repeat(idNumber.length - 10)}${idNumber.slice(-4)}`;
}

/**
 * 获取客户 PII 的脱敏版本（用于日志和列表显示）
 *
 * @param pii 原始或解密后的客户信息
 * @returns 脱敏后的客户信息
 */
export function maskCustomerPII(pii: CustomerPII): CustomerPII {
  return {
    name: pii.name ? maskPII(pii.name, 2) : undefined,
    email: pii.email ? maskEmail(pii.email) : undefined,
    phone: pii.phone ? maskPhone(pii.phone) : undefined,
    wechat: pii.wechat ? maskPII(pii.wechat) : undefined,
    idNumber: pii.idNumber ? maskIdNumber(pii.idNumber) : undefined,
    address: pii.address ? maskPII(pii.address, 6) : undefined,
  };
}

// ============================================
// 安全验证函数
// ============================================

/**
 * 验证加密密钥是否已配置（用于启动时检查）
 * @returns 密钥配置状态
 */
export function validateEncryptionKey(): { valid: boolean; message: string } {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      return { valid: false, message: 'ENCRYPTION_KEY is required in production' };
    }
    return { valid: true, message: 'Using default development key (not secure)' };
  }

  if (key.length < 32) {
    return { valid: false, message: 'ENCRYPTION_KEY should be at least 32 characters' };
  }

  return { valid: true, message: 'Encryption key configured' };
}
