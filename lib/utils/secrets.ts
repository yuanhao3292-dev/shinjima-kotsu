/**
 * 签名密钥解析
 * ============================================
 * 集中处理 HMAC 密钥的获取，保证生产环境 fail-closed：
 * 密钥缺失时返回 null 或抛错，绝不退化到硬编码常量。
 *
 * 反例（本文件要杜绝的写法）：
 *   process.env.FP_SECRET || process.env.NEXT_PUBLIC_FP_SECRET || 'fp-default-key'
 * 前者会把密钥打进客户端 bundle，后者是公开可知的字面量，
 * 两种情况下攻击者都能自行签发合法令牌。
 */

/** 开发环境专用占位密钥，仅在 NODE_ENV !== 'production' 时使用 */
const DEV_ONLY_SECRET = 'dev-only-insecure-secret-do-not-use-in-production';

function resolve(name: string, value: string | undefined): string | null {
  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    console.error(`[CRITICAL] ${name} 未配置，依赖它的安全校验将拒绝服务`);
    return null;
  }

  return `${DEV_ONLY_SECRET}:${name}`;
}

/**
 * 浏览器指纹令牌密钥。
 * 生产环境未配置时返回 null —— 调用方应当把指纹视为“无法验证”，
 * 按最严格的策略处理，而不是放行。
 */
export function getFingerprintSecret(): string | null {
  return resolve('FP_SECRET', process.env.FP_SECRET);
}

/**
 * 发票/收据下载令牌密钥。
 * 沿用 INVOICE_SECRET → FP_SECRET 的兼容顺序（历史部署可能只配了后者），
 * 但两者都缺失时抛错，不再退化到可猜测的兜底值。
 * 令牌 payload 自带 "invoice:" 前缀，与指纹令牌有域分隔。
 */
export function getInvoiceSecret(): string {
  const secret = resolve('INVOICE_SECRET', process.env.INVOICE_SECRET || process.env.FP_SECRET);
  if (!secret) {
    throw new Error('INVOICE_SECRET (或 FP_SECRET) 未配置，无法签发或校验发票令牌');
  }
  return secret;
}
