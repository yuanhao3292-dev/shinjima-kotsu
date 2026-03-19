/**
 * 服务端环境变量校验
 *
 * 在任何 API route 或 server action 首次导入时执行。
 * 缺少必需变量 → 立即抛错（启动时发现，而非运行时）。
 */

import { z } from 'zod';

const serverSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  // AI — OpenRouter (AEMC pipeline)
  OPENROUTER_API_KEY: z.string().min(1),

  // Email
  RESEND_API_KEY: z.string().min(1),

  // Security
  ADMIN_EMAILS: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(16),

  // Optional
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  AEMC_PIPELINE_MODE: z.enum(['full', 'lite']).optional(),
  CRON_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let _cached: ServerEnv | null = null;

/**
 * 获取已校验的服务端环境变量。
 * 首次调用时解析并缓存，失败时抛出描述性错误。
 */
export function getServerEnv(): ServerEnv {
  if (_cached) return _cached;

  const result = serverSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(
      `[env] Missing or invalid environment variables:\n${missing}`
    );
  }

  _cached = result.data;
  return _cached;
}
