/**
 * Supabase API 路由客户端工厂
 *
 * 用于 API 路由中统一创建 Supabase 客户端
 * 使用 Service Role Key 进行服务端操作
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 缓存客户端实例，避免重复创建
let supabaseInstance: SupabaseClient | null = null;

/**
 * 获取 Supabase 服务端客户端（使用 Service Role Key）
 *
 * 特点：
 * - 延迟初始化，避免构建时报错
 * - 单例模式，复用客户端实例
 * - 环境变量验证
 *
 * @throws Error 如果环境变量未配置
 */
export function getSupabaseAdmin(): SupabaseClient {
  // 验证环境变量
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  // 单例模式
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return supabaseInstance;
}

/**
 * 获取带有用户认证的 Supabase 客户端
 * 用于需要验证用户身份的操作
 *
 * @param authHeader Authorization header (Bearer token)
 * @returns Supabase 客户端和用户信息
 */
export async function getSupabaseWithAuth(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { supabase: null, user: null, error: '未提供认证令牌' };
  }

  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseAdmin();

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { supabase: null, user: null, error: '认证失败' };
    }

    return { supabase, user, error: null };
  } catch (err) {
    console.error('Auth verification failed:', err);
    return { supabase: null, user: null, error: '认证验证失败' };
  }
}

/**
 * 安全的数据库查询包装器
 * 自动处理错误并记录日志
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string = '数据库查询失败'
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      console.error(`${errorMessage}:`, error);
      return { data: null, error: errorMessage };
    }

    return { data, error: null };
  } catch (err) {
    console.error(`${errorMessage}:`, err);
    return { data: null, error: errorMessage };
  }
}
