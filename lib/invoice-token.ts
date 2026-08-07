/**
 * 发票/收据 URL 签名 token
 *
 * 使用 HMAC-SHA256 签名 orderId + email + timestamp，防止枚举下载。
 * 无需登录即可下载（客户可能未注册账号），但需要有效 token。
 *
 * Token 有效期 7 天（TOKEN_TTL_MS）。
 */

import { getInvoiceSecret as getSecret } from './utils/secrets';
import { constantTimeEqual } from './utils/constant-time';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天
const TOKEN_BUCKET_MS = 60 * 60 * 1000; // 1 小时粒度（同一小时内生成相同 token）

async function hmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 生成带时间桶的 token。
 * 同一小时内对同一订单生成的 token 相同（方便缓存），但7天后过期。
 */
export async function generateInvoiceToken(orderId: string, email: string): Promise<string> {
  const bucket = Math.floor(Date.now() / TOKEN_BUCKET_MS);
  const payload = `invoice:${orderId}:${email.toLowerCase().trim()}:${bucket}`;
  return hmac(payload, getSecret());
}

/**
 * 验证 token — 检查当前及过去 7*24 个时间桶（覆盖 7 天 TTL）。
 * 使用常量时间比较防止 timing attack。
 */
export async function verifyInvoiceToken(
  token: string,
  orderId: string,
  email: string
): Promise<boolean> {
  const secret = getSecret();
  const normalizedEmail = email.toLowerCase().trim();
  const currentBucket = Math.floor(Date.now() / TOKEN_BUCKET_MS);
  const bucketsToCheck = Math.ceil(TOKEN_TTL_MS / TOKEN_BUCKET_MS);

  for (let i = 0; i <= bucketsToCheck; i++) {
    const bucket = currentBucket - i;
    const payload = `invoice:${orderId}:${normalizedEmail}:${bucket}`;
    const expected = await hmac(payload, secret);

    if (constantTimeEqual(token, expected)) {
      return true;
    }
  }

  return false;
}

