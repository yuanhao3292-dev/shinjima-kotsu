export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
    // 启动时验证环境变量（缺少必需变量立即报错）
    const { getServerEnv } = await import('./lib/env');
    getServerEnv();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = (await import('@sentry/nextjs')).captureRequestError;
