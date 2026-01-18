/**
 * PII 加密工具
 * 用于加密存储敏感个人信息（如身份证号码）
 *
 * 使用 AES-256-GCM 加密算法
 * 密钥从环境变量 ENCRYPTION_KEY 获取
 */

import crypto from 'crypto';

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
 * @returns 解密后的明文
 */
export function decryptPII(encryptedData: string): string {
  if (!encryptedData) return '';

  // 检查是否是加密格式（包含两个冒号分隔符）
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    // 如果不是加密格式，可能是旧的明文数据，直接返回
    // 这允许向后兼容和渐进式迁移
    console.warn('⚠️ Data appears to be unencrypted. Consider migrating to encrypted format.');
    return encryptedData;
  }

  const key = getEncryptionKey();
  const [ivBase64, authTagBase64, ciphertext] = parts;

  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
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
