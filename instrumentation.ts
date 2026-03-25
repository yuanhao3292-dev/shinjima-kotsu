export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
    // 启动时验证环境变量（仅警告，不阻断启动）
    try {
      const { getServerEnv } = await import('./lib/env');
      getServerEnv();
    } catch (e) {
      console.error('[instrumentation]', (e as Error).message);
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = (await import('@sentry/nextjs')).captureRequestError;
