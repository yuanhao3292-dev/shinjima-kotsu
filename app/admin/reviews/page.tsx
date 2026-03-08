'use client';

/**
 * AI 审核工作台 — 人工医疗协调员审核页面
 *
 * 用途：
 * - 查看 Class C/D 安全闸门标记的筛查案例
 * - 人工审核 AI 分析报告后释放或拦截
 * - 记录审核备注用于审计追溯
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  MessageCircleQuestion,
} from 'lucide-react';

interface AdjudicationRecord {
  id: string;
  screening_id: string;
  screening_type: string;
  pipeline_version: string;
  final_risk_level: string;
  final_departments: string[];
  final_summary: string | null;
  critical_reasons: string[];
  must_ask_followups: string[];
  conflict_notes: string[];
  safe_to_auto_display: boolean;
  escalate_to_human: boolean;
  escalation_reason: string | null;
  confidence: number | null;
  safety_gate_class: string;
  safety_gate_triggers: unknown;
  safety_gate_explanation: string | null;
  total_latency_ms: number | null;
  created_at: string;
}

interface ReviewStats {
  pendingReview: number;
  classC: number;
  classD: number;
}

export default function ReviewsPage() {
  const [adjudications, setAdjudications] = useState<AdjudicationRecord[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ pendingReview: 0, classC: 0, classD: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [actionLoadingSet, setActionLoadingSet] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('pending');
  const [gateFilter, setGateFilter] = useState<string>('');

  const supabase = useMemo(() => createClient(), []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('会话已过期，请重新登录');
        return;
      }

      const params = new URLSearchParams({ status: filter });
      if (gateFilter) params.set('gate_class', gateFilter);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAdjudications(data.adjudications || []);
        setStats(data.stats || { pendingReview: 0, classC: 0, classD: 0 });
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.error?.message || `请求失败 (${res.status})`);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('网络错误，无法连接服务器');
    } finally {
      setLoading(false);
    }
  }, [supabase, filter, gateFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAction = async (
    adjudicationId: string,
    screeningId: string,
    screeningType: string,
    action: 'approve' | 'reject' | 'escalate'
  ) => {
    setActionError(null);
    setActionLoadingSet((prev) => new Set(prev).add(adjudicationId));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setActionError('会话已过期，请重新登录');
        return;
      }

      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          adjudicationId,
          screeningId,
          screeningType,
          action,
          reviewNote: reviewNotes[adjudicationId] || '',
        }),
      });

      if (res.ok) {
        await fetchReviews();
        setExpandedId(null);
      } else {
        const errData = await res.json().catch(() => null);
        setActionError(errData?.error?.message || `操作失败 (${res.status})`);
      }
    } catch (err) {
      console.error('Review action failed:', err);
      setActionError('网络错误，操作未完成');
    } finally {
      setActionLoadingSet((prev) => {
        const next = new Set(prev);
        next.delete(adjudicationId);
        return next;
      });
    }
  };

  const isActionLoading = (id: string) => actionLoadingSet.has(id);

  const getGateClassBadge = (gateClass: string) => {
    const styles: Record<string, string> = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-yellow-100 text-yellow-800',
      C: 'bg-orange-100 text-orange-800',
      D: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[gateClass] || 'bg-gray-100 text-gray-800'}`}>
        Class {gateClass}
      </span>
    );
  };

  const getRiskBadge = (level: string) => {
    const styles: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      emergency: 'bg-red-200 text-red-900 font-bold',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs ${styles[level] || 'bg-gray-100 text-gray-800'}`}>
        {level.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">AI 审核工作台</h1>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          aria-label="刷新审核列表"
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 操作错误提示 */}
      {actionError && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-orange-500 hover:text-orange-700 text-xs ml-4">
            关闭
          </button>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">待审核</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Class C (需审核)</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.classC}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Class D (紧急)</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.classD}</p>
        </div>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="status-filter">状态过滤</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="pending">待审核</option>
          <option value="all">全部</option>
        </select>
        <label className="sr-only" htmlFor="gate-filter">闸门等级过滤</label>
        <select
          id="gate-filter"
          value={gateFilter}
          onChange={(e) => setGateFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">所有等级</option>
          <option value="C">Class C</option>
          <option value="D">Class D</option>
          <option value="B">Class B</option>
        </select>
      </div>

      {/* 审核列表 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : adjudications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <p className="text-lg font-medium">没有需要审核的案例</p>
          <p className="text-sm mt-1">所有 AI 分析报告已通过安全闸门</p>
        </div>
      ) : (
        <div className="space-y-3">
          {adjudications.map((adj) => (
            <div key={adj.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* 摘要行 */}
              <button
                onClick={() => setExpandedId(expandedId === adj.id ? null : adj.id)}
                aria-expanded={expandedId === adj.id}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getGateClassBadge(adj.safety_gate_class)}
                  {getRiskBadge(adj.final_risk_level)}
                  <span className="text-sm text-gray-600">
                    {adj.screening_id.substring(0, 8)}...
                  </span>
                  <span className="text-xs text-gray-400">
                    {adj.pipeline_version}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(adj.created_at).toLocaleString('zh-CN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {adj.escalate_to_human && (
                    <span className="text-xs text-orange-600 font-medium">需审核</span>
                  )}
                  {expandedId === adj.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* 展开详情 */}
              {expandedId === adj.id && (
                <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                  {/* 仲裁摘要 */}
                  {adj.final_summary && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">仲裁摘要</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{adj.final_summary}</p>
                    </div>
                  )}

                  {/* 推荐科室 */}
                  {adj.final_departments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">推荐科室</h4>
                      <div className="flex flex-wrap gap-1">
                        {adj.final_departments.map((dept, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 关键原因 */}
                  {adj.critical_reasons.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">关键原因</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {adj.critical_reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* 建议追问 — 审核员必须看到的临床关键信息 */}
                  {adj.must_ask_followups.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-1">
                        <MessageCircleQuestion className="w-4 h-4" />
                        建议追问 ({adj.must_ask_followups.length})
                      </h4>
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {adj.must_ask_followups.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* 冲突记录 */}
                  {adj.conflict_notes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-1">AI 分歧记录</h4>
                      <ul className="list-disc list-inside text-sm text-orange-600 space-y-1">
                        {adj.conflict_notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* 安全闸门说明 */}
                  {adj.safety_gate_explanation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">安全闸门说明</h4>
                      <p className="text-sm text-gray-600">{adj.safety_gate_explanation}</p>
                    </div>
                  )}

                  {/* 升级原因 */}
                  {adj.escalation_reason && (
                    <div className="bg-orange-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-orange-800 mb-1">升级原因</h4>
                      <p className="text-sm text-orange-700">{adj.escalation_reason}</p>
                    </div>
                  )}

                  {/* 元信息 */}
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>置信度: {adj.confidence != null ? `${(adj.confidence * 100).toFixed(0)}%` : 'N/A'}</span>
                    <span>延迟: {adj.total_latency_ms != null ? `${adj.total_latency_ms}ms` : 'N/A'}</span>
                    <span>类型: {adj.screening_type}</span>
                  </div>

                  {/* 审核操作 */}
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <label className="sr-only" htmlFor={`review-note-${adj.id}`}>审核备注</label>
                    <textarea
                      id={`review-note-${adj.id}`}
                      placeholder="审核备注（可选）"
                      value={reviewNotes[adj.id] || ''}
                      onChange={(e) => setReviewNotes((prev) => ({ ...prev, [adj.id]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(adj.id, adj.screening_id, adj.screening_type, 'approve')}
                        disabled={isActionLoading(adj.id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {isActionLoading(adj.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        通过释放
                      </button>
                      <button
                        onClick={() => handleAction(adj.id, adj.screening_id, adj.screening_type, 'reject')}
                        disabled={isActionLoading(adj.id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {isActionLoading(adj.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        拦截拒绝
                      </button>
                      <button
                        onClick={() => handleAction(adj.id, adj.screening_id, adj.screening_type, 'escalate')}
                        disabled={isActionLoading(adj.id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                      >
                        {isActionLoading(adj.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowUpCircle className="w-4 h-4" />
                        )}
                        升级
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
