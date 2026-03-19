/**
 * Admin Pipeline Metrics API
 *
 * GET /api/admin/pipeline-metrics?days=7
 *
 * 查询 AEMC pipeline 运行指标：AI 调用数、错误率、延迟、token 消耗、异常检测。
 * 管理员专用，需 Bearer token + ADMIN_EMAILS 验证。
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/utils/admin-auth';
import { queryPipelineMetrics } from '@/lib/utils/pipeline-metrics';

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request.headers.get('authorization'));
  if (!authResult.isValid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const daysParam = request.nextUrl.searchParams.get('days');
  const days = Math.min(Math.max(parseInt(daysParam || '7', 10) || 7, 1), 30);
  const hours = days * 24;

  try {
    const digest = await queryPipelineMetrics(hours);

    // 估算成本（基于公开定价近似值，仅供参考）
    const costEstimate = estimateCost(digest.roleMetrics);

    return NextResponse.json({
      success: true,
      ...digest,
      costEstimate,
    });
  } catch (error) {
    console.error('[PipelineMetrics] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }
}

// ── 成本估算（OpenRouter 定价近似） ──

interface CostEstimate {
  totalUsd: number;
  byModel: Record<string, { inputTokens: number; outputTokens: number; usd: number }>;
}

function estimateCost(roleMetrics: Array<{
  models: Record<string, number>;
  totalInputTokens: number;
  totalOutputTokens: number;
  role: string;
}>): CostEstimate {
  // OpenRouter 近似定价 (USD per 1M tokens)
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 2.5, output: 10 },
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'gemini-2.5-flash-preview': { input: 0.15, output: 0.6 },
    'grok-3': { input: 3, output: 15 },
    'claude-sonnet-4-5-20250514': { input: 3, output: 15 },
    'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
  };
  const defaultPricing = { input: 3, output: 15 }; // 保守默认

  const byModel: CostEstimate['byModel'] = {};
  let totalUsd = 0;

  for (const rm of roleMetrics) {
    // 按 role 粗略分配 token（各 role 只有总 token 数）
    const modelEntries = Object.entries(rm.models);
    const totalCalls = modelEntries.reduce((s, [, c]) => s + c, 0);

    for (const [modelName, callCount] of modelEntries) {
      const fraction = totalCalls > 0 ? callCount / totalCalls : 0;
      const inputTokens = Math.round(rm.totalInputTokens * fraction);
      const outputTokens = Math.round(rm.totalOutputTokens * fraction);

      // 匹配定价
      const shortName = modelName.split('/').pop() || modelName;
      const price = Object.entries(pricing).find(([key]) => shortName.includes(key))?.[1] || defaultPricing;

      const cost = (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;

      if (!byModel[modelName]) {
        byModel[modelName] = { inputTokens: 0, outputTokens: 0, usd: 0 };
      }
      byModel[modelName].inputTokens += inputTokens;
      byModel[modelName].outputTokens += outputTokens;
      byModel[modelName].usd += cost;
      totalUsd += cost;
    }
  }

  return {
    totalUsd: Math.round(totalUsd * 1000) / 1000,
    byModel,
  };
}
