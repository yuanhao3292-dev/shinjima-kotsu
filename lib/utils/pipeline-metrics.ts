/**
 * Pipeline Metrics 查询工具
 * 聚合 screening_ai_runs + screening_adjudications 数据用于监控和告警
 */

import { getSupabaseAdmin } from '@/lib/supabase/api';

// ── 类型 ──

export interface RoleMetrics {
  role: string;
  totalCalls: number;
  errorCount: number;
  errorRate: number; // 0-1
  avgLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  models: Record<string, number>; // model_name → count
}

export interface GateDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface PipelineDigest {
  period: { from: string; to: string; hours: number };
  totalScreenings: number;
  pipelineVersions: Record<string, number>;
  roleMetrics: RoleMetrics[];
  gateDistribution: GateDistribution;
  avgPipelineLatencyMs: number;
  anomalies: AnomalyFlag[];
  // 用于对比的前 7 天基线
  baseline?: { avgDailyCalls: number; avgJudgeSuccessRate: number };
}

export interface AnomalyFlag {
  severity: 'critical' | 'warning';
  message: string;
}

// ── 异常检测阈值 ──

const THRESHOLDS = {
  ERROR_RATE_CRITICAL: 0.2, // 任何 role 错误率 > 20%
  JUDGE_SUCCESS_MIN: 0.8,   // Judge 成功率 < 80%
  CALL_SPIKE_MULTIPLIER: 3, // 单日调用 > 7天均值 × 3
};

// ── 核心查询 ──

export async function queryPipelineMetrics(hours: number): Promise<PipelineDigest> {
  const supabase = getSupabaseAdmin();
  const now = new Date();
  const from = new Date(now.getTime() - hours * 60 * 60 * 1000);

  // 1. 查询 AI 调用记录
  const { data: aiRuns, error: aiErr } = await supabase
    .from('screening_ai_runs')
    .select('role, model_name, latency_ms, input_tokens, output_tokens, error, created_at')
    .gte('created_at', from.toISOString())
    .lte('created_at', now.toISOString());

  if (aiErr) {
    console.error('[PipelineMetrics] AI runs query failed:', aiErr.message);
    throw new Error(`AI runs query failed: ${aiErr.message}`);
  }

  // 2. 查询裁决记录
  const { data: adjudications, error: adjErr } = await supabase
    .from('screening_adjudications')
    .select('pipeline_version, safety_gate_class, total_latency_ms, created_at')
    .gte('created_at', from.toISOString())
    .lte('created_at', now.toISOString());

  if (adjErr) {
    console.error('[PipelineMetrics] Adjudications query failed:', adjErr.message);
    throw new Error(`Adjudications query failed: ${adjErr.message}`);
  }

  const runs = aiRuns ?? [];
  const adjs = adjudications ?? [];

  // 3. 按 role 聚合
  const roleMap = new Map<string, {
    total: number; errors: number; latencies: number[];
    inputTokens: number; outputTokens: number; models: Record<string, number>;
  }>();

  for (const run of runs) {
    const role = run.role || 'unknown';
    if (!roleMap.has(role)) {
      roleMap.set(role, { total: 0, errors: 0, latencies: [], inputTokens: 0, outputTokens: 0, models: {} });
    }
    const m = roleMap.get(role)!;
    m.total++;
    if (run.error) m.errors++;
    if (run.latency_ms) m.latencies.push(run.latency_ms);
    m.inputTokens += run.input_tokens || 0;
    m.outputTokens += run.output_tokens || 0;
    const model = run.model_name || 'unknown';
    m.models[model] = (m.models[model] || 0) + 1;
  }

  const roleMetrics: RoleMetrics[] = Array.from(roleMap.entries()).map(([role, m]) => ({
    role,
    totalCalls: m.total,
    errorCount: m.errors,
    errorRate: m.total > 0 ? m.errors / m.total : 0,
    avgLatencyMs: m.latencies.length > 0 ? Math.round(m.latencies.reduce((a, b) => a + b, 0) / m.latencies.length) : 0,
    totalInputTokens: m.inputTokens,
    totalOutputTokens: m.outputTokens,
    models: m.models,
  }));

  // 4. Pipeline 版本分布
  const versionMap: Record<string, number> = {};
  for (const adj of adjs) {
    const v = adj.pipeline_version || 'unknown';
    versionMap[v] = (versionMap[v] || 0) + 1;
  }

  // 5. Safety Gate 分布
  const gateDistribution: GateDistribution = { A: 0, B: 0, C: 0, D: 0 };
  for (const adj of adjs) {
    const g = adj.safety_gate_class as keyof GateDistribution;
    if (g in gateDistribution) gateDistribution[g]++;
  }

  // 6. 平均 Pipeline 延迟
  const latencies = adjs.filter(a => a.total_latency_ms).map(a => a.total_latency_ms);
  const avgPipelineLatencyMs = latencies.length > 0
    ? Math.round(latencies.reduce((a: number, b: number) => a + b, 0) / latencies.length)
    : 0;

  // 7. 查询前 7 天基线（用于异常检测）
  const baselineFrom = new Date(from.getTime() - 7 * 24 * 60 * 60 * 1000);
  const { data: baselineRuns } = await supabase
    .from('screening_ai_runs')
    .select('role, error, created_at')
    .gte('created_at', baselineFrom.toISOString())
    .lt('created_at', from.toISOString());

  const baselineData = baselineRuns ?? [];
  const baselineDays = 7;
  const avgDailyCalls = baselineData.length > 0 ? baselineData.length / baselineDays : 0;

  const baselineJudge = baselineData.filter(r => r.role === 'judge');
  const baselineJudgeErrors = baselineJudge.filter(r => r.error);
  const avgJudgeSuccessRate = baselineJudge.length > 0
    ? 1 - baselineJudgeErrors.length / baselineJudge.length
    : 1;

  // 8. 异常检测
  const anomalies: AnomalyFlag[] = [];

  // 8a. 错误率检测
  for (const rm of roleMetrics) {
    if (rm.totalCalls >= 3 && rm.errorRate > THRESHOLDS.ERROR_RATE_CRITICAL) {
      anomalies.push({
        severity: 'critical',
        message: `${rm.role} error rate ${(rm.errorRate * 100).toFixed(1)}% (${rm.errorCount}/${rm.totalCalls}) exceeds ${THRESHOLDS.ERROR_RATE_CRITICAL * 100}% threshold`,
      });
    }
  }

  // 8b. Judge 成功率
  const judgeMetrics = roleMetrics.find(r => r.role === 'judge');
  if (judgeMetrics && judgeMetrics.totalCalls >= 3) {
    const judgeSuccessRate = 1 - judgeMetrics.errorRate;
    if (judgeSuccessRate < THRESHOLDS.JUDGE_SUCCESS_MIN) {
      anomalies.push({
        severity: 'critical',
        message: `Judge success rate ${(judgeSuccessRate * 100).toFixed(1)}% below ${THRESHOLDS.JUDGE_SUCCESS_MIN * 100}% threshold`,
      });
    }
  }

  // 8c. 调用量异常飙升
  const dailyCallRate = runs.length / (hours / 24);
  if (avgDailyCalls > 0 && dailyCallRate > avgDailyCalls * THRESHOLDS.CALL_SPIKE_MULTIPLIER) {
    anomalies.push({
      severity: 'warning',
      message: `Daily call rate ${Math.round(dailyCallRate)} is ${(dailyCallRate / avgDailyCalls).toFixed(1)}x the 7-day average (${Math.round(avgDailyCalls)})`,
    });
  }

  // 8d. Gate D 出现
  if (gateDistribution.D > 0) {
    anomalies.push({
      severity: 'warning',
      message: `${gateDistribution.D} screening(s) triggered Gate D (suspected emergency)`,
    });
  }

  return {
    period: { from: from.toISOString(), to: now.toISOString(), hours },
    totalScreenings: adjs.length,
    pipelineVersions: versionMap,
    roleMetrics,
    gateDistribution,
    avgPipelineLatencyMs,
    anomalies,
    baseline: { avgDailyCalls, avgJudgeSuccessRate },
  };
}
