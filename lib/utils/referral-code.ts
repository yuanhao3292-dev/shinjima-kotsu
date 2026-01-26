/**
 * 推荐码生成工具
 *
 * 生成唯一的 6 位推荐码（大写字母 + 数字）
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * 生成随机推荐码（6位大写字母+数字）
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * 生成唯一推荐码（带数据库检查）
 *
 * @param supabase - Supabase 客户端（必须有权限查询 guides 表）
 * @param maxAttempts - 最大尝试次数（默认 10）
 * @returns 唯一的推荐码，或在超过最大尝试次数后抛出错误
 */
export async function generateUniqueReferralCode(
  supabase: SupabaseClient,
  maxAttempts: number = 10
): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const code = generateReferralCode();

    // 检查是否已存在
    const { data, error } = await supabase
      .from('guides')
      .select('referral_code')
      .eq('referral_code', code)
      .maybeSingle();

    // 数据库查询错误
    if (error) {
      throw new Error(`数据库查询失败: ${error.message}`);
    }

    // 未找到重复，返回此码
    if (!data) {
      return code;
    }

    attempts++;
  }

  throw new Error(`无法生成唯一推荐码（已尝试 ${maxAttempts} 次）`);
}

/**
 * 生成随机密码（12位，包含大小写字母、数字和特殊字符）
 */
export function generateRandomPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  // 确保至少包含每种类型的字符
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // 填充到12位
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // 打乱顺序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
