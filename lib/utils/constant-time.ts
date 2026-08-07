/**
 * 常量时间字符串比较
 *
 * 用于比对密钥、令牌、签名。普通的 === 会在第一个不同字符处提前返回，
 * 泄露"猜对了多少个前缀字符"，使攻击者可以逐字节爆破。
 *
 * 实现不依赖 node:crypto，可在 Edge Runtime（middleware、边缘路由）中使用。
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  // 长度差异本身也参与结果，且不提前返回
  let result = a.length ^ b.length;

  for (let i = 0; i < len; i++) {
    const c1 = i < a.length ? a.charCodeAt(i) : 0;
    const c2 = i < b.length ? b.charCodeAt(i) : 0;
    result |= c1 ^ c2;
  }

  return result === 0;
}
