/**
 * 浏览器指纹令牌（Edge Runtime 兼容）
 *
 * 客户端收集浏览器环境信号 → 计算 bot 评分 → HMAC 签名写入 cookie
 * Middleware 读取 cookie → 验证签名 → 根据评分调整限速级别
 */

const TOKEN_VERSION = 'v1';
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 小时过期

/**
 * 在 Edge Runtime 中使用 Web Crypto API 生成 HMAC
 */
async function hmacSign(data: string, secret: string): Promise<string> {
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
 * 生成指纹令牌（客户端调用）
 * 格式: v1.{score}.{timestamp}.{hmac}
 */
export async function generateFingerprintToken(
  score: number,
  secret: string
): Promise<string> {
  const timestamp = Date.now();
  const payload = `${TOKEN_VERSION}.${score}.${timestamp}`;
  const hmac = await hmacSign(payload, secret);
  return `${payload}.${hmac}`;
}

/**
 * 验证指纹令牌（Middleware 调用）
 */
export async function verifyFingerprintToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; score: number }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 4 || parts[0] !== TOKEN_VERSION) {
      return { valid: false, score: 100 };
    }

    const score = parseInt(parts[1], 10);
    const timestamp = parseInt(parts[2], 10);
    const providedHmac = parts[3];

    // 检查时间戳是否过期
    if (Date.now() - timestamp > TOKEN_TTL_MS) {
      return { valid: false, score: 100 };
    }

    // 验证 HMAC
    const payload = `${TOKEN_VERSION}.${score}.${timestamp}`;
    const expectedHmac = await hmacSign(payload, secret);
    if (providedHmac !== expectedHmac) {
      return { valid: false, score: 100 };
    }

    return { valid: true, score };
  } catch {
    return { valid: false, score: 100 };
  }
}
