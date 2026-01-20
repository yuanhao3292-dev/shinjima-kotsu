/**
 * 性能監控模塊
 * 用於追蹤 AI 分析的性能指標
 */

export interface PerformanceMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  phase: 1 | 2;
  answersCount: number;
  source: 'ai' | 'rule-based' | 'cache';
  success: boolean;
  errorType?: string;
}

// 內存中的性能指標存儲（生產環境應該使用持久化存儲）
const metricsStore: PerformanceMetrics[] = [];
const MAX_METRICS_IN_MEMORY = 100;

/**
 * 記錄性能指標
 */
export function recordMetrics(metrics: PerformanceMetrics): void {
  // 計算持續時間
  if (metrics.endTime && metrics.startTime) {
    metrics.duration = metrics.endTime - metrics.startTime;
  }

  // 添加到存儲
  metricsStore.push(metrics);

  // 限制內存中的指標數量
  while (metricsStore.length > MAX_METRICS_IN_MEMORY) {
    metricsStore.shift();
  }

  // 日誌輸出（生產環境可發送到監控系統）
  if (process.env.NODE_ENV !== 'test') {
    console.info(
      `[Perf] ${metrics.requestId} | ` +
        `source=${metrics.source} | ` +
        `duration=${metrics.duration}ms | ` +
        `success=${metrics.success}` +
        (metrics.errorType ? ` | error=${metrics.errorType}` : '')
    );
  }
}

/**
 * 獲取性能統計摘要
 */
export function getPerformanceStats(): {
  totalRequests: number;
  averageDuration: number;
  successRate: number;
  aiUsageRate: number;
  cacheHitRate: number;
  fallbackRate: number;
} {
  if (metricsStore.length === 0) {
    return {
      totalRequests: 0,
      averageDuration: 0,
      successRate: 0,
      aiUsageRate: 0,
      cacheHitRate: 0,
      fallbackRate: 0,
    };
  }

  const totalRequests = metricsStore.length;
  const successfulRequests = metricsStore.filter((m) => m.success);
  const aiRequests = metricsStore.filter((m) => m.source === 'ai');
  const cacheRequests = metricsStore.filter((m) => m.source === 'cache');
  const fallbackRequests = metricsStore.filter((m) => m.source === 'rule-based');

  const durations = metricsStore
    .filter((m) => m.duration !== undefined)
    .map((m) => m.duration!);

  const averageDuration =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

  return {
    totalRequests,
    averageDuration,
    successRate: Math.round((successfulRequests.length / totalRequests) * 100),
    aiUsageRate: Math.round((aiRequests.length / totalRequests) * 100),
    cacheHitRate: Math.round((cacheRequests.length / totalRequests) * 100),
    fallbackRate: Math.round((fallbackRequests.length / totalRequests) * 100),
  };
}

/**
 * 清除性能指標（用於測試）
 */
export function clearMetrics(): void {
  metricsStore.length = 0;
}

/**
 * 創建性能計時器
 */
export function createPerformanceTimer(
  requestId: string,
  phase: 1 | 2,
  answersCount: number
): {
  end: (
    source: 'ai' | 'rule-based' | 'cache',
    success: boolean,
    errorType?: string
  ) => PerformanceMetrics;
} {
  const startTime = Date.now();

  return {
    end: (source, success, errorType) => {
      const metrics: PerformanceMetrics = {
        requestId,
        startTime,
        endTime: Date.now(),
        phase,
        answersCount,
        source,
        success,
        errorType,
      };
      metrics.duration = metrics.endTime - startTime;
      recordMetrics(metrics);
      return metrics;
    },
  };
}
