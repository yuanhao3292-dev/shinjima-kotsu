import { createHmac } from 'crypto';

/**
 * 生成合同签约令牌（HMAC-based, 无需数据库额外字段）
 * 管理员发送签约链接时使用: /contract/sign/{id}?token={generateSigningToken(id)}
 */
export function generateSigningToken(contractId: string): string {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) throw new Error('ENCRYPTION_KEY not configured');
  return createHmac('sha256', secret).update(contractId).digest('hex').substring(0, 32);
}
