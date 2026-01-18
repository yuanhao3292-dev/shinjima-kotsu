/**
 * 管理员认证工具
 *
 * 管理员通过环境变量 ADMIN_EMAILS 配置（逗号分隔）
 */

import { createClient } from '@supabase/supabase-js';

// 获取管理员邮箱列表
function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS || '';
  return adminEmails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
}

/**
 * 检查用户是否是管理员
 * @param email 用户邮箱
 * @returns 是否是管理员
 */
export function isAdmin(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

/**
 * 验证管理员身份（用于 API 路由）
 * @param authHeader Authorization header
 * @returns { isValid: boolean, error?: string, userId?: string, email?: string }
 */
export async function verifyAdminAuth(authHeader: string | null): Promise<{
  isValid: boolean;
  error?: string;
  userId?: string;
  email?: string;
}> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, error: '未授权' };
  }

  const token = authHeader.substring(7);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { isValid: false, error: '无效的认证令牌' };
  }

  if (!user.email) {
    return { isValid: false, error: '用户邮箱缺失' };
  }

  if (!isAdmin(user.email)) {
    return { isValid: false, error: '无管理员权限' };
  }

  return {
    isValid: true,
    userId: user.id,
    email: user.email,
  };
}
