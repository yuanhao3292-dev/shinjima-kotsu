/**
 * AEMC 结构化日志
 *
 * 统一所有 AEMC 模块的日志格式，便于聚合分析和告警。
 * 输出 JSON 格式到 stdout/stderr，Vercel 会自动采集。
 *
 * 用法：
 *   import { aemcLog } from './logger';
 *   aemcLog.info('extractor', 'AI-1 completed', { latencyMs: 2100, tokens: 800 });
 *   aemcLog.warn('triage', 'Retry triggered', { attempt: 2, error: 'RateLimitError' });
 *   aemcLog.error('adjudicator', 'AI-4 failed', { error: err.message });
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: 'aemc';
  module: string;
  message: string;
  data?: Record<string, unknown>;
}

function emit(level: LogLevel, module: string, message: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'aemc',
    module,
    message,
    ...(data && Object.keys(data).length > 0 ? { data } : {}),
  };

  const json = JSON.stringify(entry);

  if (level === 'error') {
    console.error(json);
  } else if (level === 'warn') {
    console.warn(json);
  } else {
    console.info(json);
  }
}

export const aemcLog = {
  info: (module: string, message: string, data?: Record<string, unknown>) =>
    emit('info', module, message, data),
  warn: (module: string, message: string, data?: Record<string, unknown>) =>
    emit('warn', module, message, data),
  error: (module: string, message: string, data?: Record<string, unknown>) =>
    emit('error', module, message, data),

  /** AI 调用完成的标准日志 */
  aiCall: (
    module: string,
    modelName: string,
    opts: {
      latencyMs: number;
      inputTokens?: number;
      outputTokens?: number;
      success: boolean;
      error?: string;
      attempt?: number;
    }
  ) => {
    const data: Record<string, unknown> = {
      model: modelName,
      latencyMs: opts.latencyMs,
      success: opts.success,
    };
    if (opts.inputTokens != null) data.inputTokens = opts.inputTokens;
    if (opts.outputTokens != null) data.outputTokens = opts.outputTokens;
    if (opts.error) data.error = opts.error;
    if (opts.attempt != null) data.attempt = opts.attempt;

    emit(
      opts.success ? 'info' : 'error',
      module,
      opts.success
        ? `${modelName} completed in ${opts.latencyMs}ms`
        : `${modelName} failed: ${opts.error}`,
      data
    );
  },

  /** SafetyGate 结果日志 */
  safetyGate: (gateClass: string, triggeredRules: number, caseId: string) => {
    emit('info', 'safety-gate', `Case ${caseId} → Gate ${gateClass}`, {
      gateClass,
      triggeredRules,
      caseId,
    });
  },

  /** Pipeline 总体日志 */
  pipeline: (
    caseId: string,
    version: string,
    opts: {
      totalLatencyMs: number;
      gateClass: string;
      riskLevel: string;
      aiCallCount: number;
      success: boolean;
      error?: string;
    }
  ) => {
    emit(
      opts.success ? 'info' : 'error',
      'pipeline',
      opts.success
        ? `Pipeline ${version} completed: ${caseId} → Gate ${opts.gateClass} (${opts.totalLatencyMs}ms)`
        : `Pipeline ${version} failed: ${caseId} — ${opts.error}`,
      {
        caseId,
        version,
        totalLatencyMs: opts.totalLatencyMs,
        gateClass: opts.gateClass,
        riskLevel: opts.riskLevel,
        aiCallCount: opts.aiCallCount,
        success: opts.success,
        ...(opts.error ? { error: opts.error } : {}),
      }
    );
  },
};
