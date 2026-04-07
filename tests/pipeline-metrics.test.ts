import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase chainable query builder
function mockQueryBuilder(resolvedValue: { data: any; error: any }) {
  const builder: Record<string, any> = {};
  for (const m of ['select', 'eq', 'gte', 'lte', 'lt', 'single', 'insert', 'update', 'delete', 'order', 'limit']) {
    builder[m] = vi.fn().mockReturnValue(builder);
  }
  // Make it thenable
  builder.then = (resolve: any) => resolve(resolvedValue);
  return builder;
}

const mockFrom = vi.fn();
vi.mock('@/lib/supabase/api', () => ({
  getSupabaseAdmin: () => ({ from: mockFrom }),
}));

import { queryPipelineMetrics } from '@/lib/utils/pipeline-metrics';

describe('queryPipelineMetrics', () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it('returns digest with empty data', async () => {
    // 3 calls to supabase.from(): ai_runs, adjudications, baseline
    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }));

    const digest = await queryPipelineMetrics(24);
    expect(digest.totalScreenings).toBe(0);
    expect(digest.roleMetrics).toEqual([]);
    expect(digest.gateDistribution).toEqual({ A: 0, B: 0, C: 0, D: 0 });
    expect(digest.avgPipelineLatencyMs).toBe(0);
    expect(digest.anomalies).toEqual([]);
    expect(digest.period.hours).toBe(24);
  });

  it('aggregates role metrics correctly', async () => {
    const aiRuns = [
      { role: 'extractor', model_name: 'gpt-4o', latency_ms: 2000, input_tokens: 500, output_tokens: 300, error: null },
      { role: 'extractor', model_name: 'gpt-4o', latency_ms: 3000, input_tokens: 600, output_tokens: 400, error: null },
      { role: 'triage', model_name: 'gemini', latency_ms: 1500, input_tokens: 400, output_tokens: 200, error: 'timeout' },
    ];

    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: aiRuns, error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }));

    const digest = await queryPipelineMetrics(24);
    expect(digest.roleMetrics).toHaveLength(2);

    const extractor = digest.roleMetrics.find(r => r.role === 'extractor')!;
    expect(extractor.totalCalls).toBe(2);
    expect(extractor.errorCount).toBe(0);
    expect(extractor.avgLatencyMs).toBe(2500);
    expect(extractor.totalInputTokens).toBe(1100);

    const triage = digest.roleMetrics.find(r => r.role === 'triage')!;
    expect(triage.totalCalls).toBe(1);
    expect(triage.errorCount).toBe(1);
    expect(triage.errorRate).toBe(1);
  });

  it('calculates gate distribution', async () => {
    const adjs = [
      { pipeline_version: 'v4.0', safety_gate_class: 'A', total_latency_ms: 5000 },
      { pipeline_version: 'v4.0', safety_gate_class: 'A', total_latency_ms: 6000 },
      { pipeline_version: 'v4.0', safety_gate_class: 'B', total_latency_ms: 7000 },
      { pipeline_version: 'v4.0', safety_gate_class: 'C', total_latency_ms: 8000 },
    ];

    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: adjs, error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }));

    const digest = await queryPipelineMetrics(24);
    expect(digest.gateDistribution.A).toBe(2);
    expect(digest.gateDistribution.B).toBe(1);
    expect(digest.gateDistribution.C).toBe(1);
    expect(digest.gateDistribution.D).toBe(0);
    expect(digest.totalScreenings).toBe(4);
    expect(digest.avgPipelineLatencyMs).toBe(6500);
  });

  it('detects error rate anomaly', async () => {
    // 4 runs, 3 errors for judge = 75% error rate (> 20% threshold)
    const aiRuns = [
      { role: 'judge', model_name: 'claude', latency_ms: 1000, input_tokens: 100, output_tokens: 50, error: 'fail' },
      { role: 'judge', model_name: 'claude', latency_ms: 1000, input_tokens: 100, output_tokens: 50, error: 'fail' },
      { role: 'judge', model_name: 'claude', latency_ms: 1000, input_tokens: 100, output_tokens: 50, error: 'fail' },
      { role: 'judge', model_name: 'claude', latency_ms: 1000, input_tokens: 100, output_tokens: 50, error: null },
    ];

    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: aiRuns, error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }));

    const digest = await queryPipelineMetrics(24);
    expect(digest.anomalies.length).toBeGreaterThan(0);
    const critical = digest.anomalies.find(a => a.severity === 'critical');
    expect(critical).toBeDefined();
  });

  it('detects Gate D anomaly', async () => {
    const adjs = [
      { pipeline_version: 'v4.0', safety_gate_class: 'D', total_latency_ms: 1000 },
    ];

    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: adjs, error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }));

    const digest = await queryPipelineMetrics(24);
    const gateD = digest.anomalies.find(a => a.message.includes('Gate D'));
    expect(gateD).toBeDefined();
    expect(gateD!.severity).toBe('warning');
  });

  it('throws on AI runs query error', async () => {
    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: null, error: { message: 'DB error' } }));

    await expect(queryPipelineMetrics(24)).rejects.toThrow('AI runs query failed');
  });

  it('throws on adjudications query error', async () => {
    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: null, error: { message: 'DB error' } }));

    await expect(queryPipelineMetrics(24)).rejects.toThrow('Adjudications query failed');
  });

  it('calculates baseline comparison', async () => {
    const baselineRuns = Array.from({ length: 70 }, (_, i) => ({
      role: i % 5 === 0 ? 'judge' : 'extractor',
      error: null,
      created_at: new Date().toISOString(),
    }));

    mockFrom
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: [], error: null }))
      .mockReturnValueOnce(mockQueryBuilder({ data: baselineRuns, error: null }));

    const digest = await queryPipelineMetrics(24);
    expect(digest.baseline).toBeDefined();
    expect(digest.baseline!.avgDailyCalls).toBe(10); // 70 / 7 days
    expect(digest.baseline!.avgJudgeSuccessRate).toBe(1); // no errors
  });
});
