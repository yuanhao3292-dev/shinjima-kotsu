'use client';

/**
 * AI 審核工作台 — 人工医疗協調員審核頁面
 *
 * 用途：
 * - 查看 Class C/D 安全閘門標記的篩查案例
 * - 人工審核 AI 分析報告後釋放或攔截
 * - 記錄審核備註用於審計追溯
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage, type Language } from '@/hooks/useLanguage';
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
  Upload,
  FileText,
  Image,
  ExternalLink,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  i18n translations                                                  */
/* ------------------------------------------------------------------ */

const translations = {
  sessionExpired: {
    'zh-CN': '会话已过期，请重新登录',
    'zh-TW': '會話已過期，請重新登入',
    ja: 'セッションが期限切れです。再度ログインしてください',
    en: 'Session expired. Please log in again.',
  },
  requestFailed: {
    'zh-CN': '请求失败',
    'zh-TW': '請求失敗',
    ja: 'リクエストに失敗しました',
    en: 'Request failed',
  },
  networkError: {
    'zh-CN': '网络错误，无法连接服务器',
    'zh-TW': '網路錯誤，無法連線伺服器',
    ja: 'ネットワークエラー：サーバーに接続できません',
    en: 'Network error: unable to connect to server',
  },
  actionFailed: {
    'zh-CN': '操作失败',
    'zh-TW': '操作失敗',
    ja: '操作に失敗しました',
    en: 'Action failed',
  },
  networkActionError: {
    'zh-CN': '网络错误，操作未完成',
    'zh-TW': '網路錯誤，操作未完成',
    ja: 'ネットワークエラー：操作が完了しませんでした',
    en: 'Network error: action incomplete',
  },
  pageTitle: {
    'zh-CN': 'AI 审核工作台',
    'zh-TW': 'AI 審核工作台',
    ja: 'AI レビューワークベンチ',
    en: 'AI Review Workbench',
  },
  refresh: {
    'zh-CN': '刷新',
    'zh-TW': '重新整理',
    ja: '更新',
    en: 'Refresh',
  },
  refreshAriaLabel: {
    'zh-CN': '刷新审核列表',
    'zh-TW': '重新整理審核列表',
    ja: 'レビューリストを更新',
    en: 'Refresh review list',
  },
  close: {
    'zh-CN': '关闭',
    'zh-TW': '關閉',
    ja: '閉じる',
    en: 'Close',
  },
  pendingReview: {
    'zh-CN': '待审核',
    'zh-TW': '待審核',
    ja: '審査待ち',
    en: 'Pending Review',
  },
  classCLabel: {
    'zh-CN': 'Class C (需审核)',
    'zh-TW': 'Class C (需審核)',
    ja: 'Class C（要審査）',
    en: 'Class C (Review Required)',
  },
  classDLabel: {
    'zh-CN': 'Class D (紧急)',
    'zh-TW': 'Class D (緊急)',
    ja: 'Class D（緊急）',
    en: 'Class D (Urgent)',
  },
  statusFilter: {
    'zh-CN': '状态过滤',
    'zh-TW': '狀態篩選',
    ja: 'ステータスフィルター',
    en: 'Status filter',
  },
  filterPending: {
    'zh-CN': '待审核',
    'zh-TW': '待審核',
    ja: '審査待ち',
    en: 'Pending',
  },
  filterAll: {
    'zh-CN': '全部',
    'zh-TW': '全部',
    ja: 'すべて',
    en: 'All',
  },
  gateFilter: {
    'zh-CN': '闸门等级过滤',
    'zh-TW': '閘門等級篩選',
    ja: 'ゲートレベルフィルター',
    en: 'Gate level filter',
  },
  allGates: {
    'zh-CN': '所有等级',
    'zh-TW': '所有等級',
    ja: 'すべてのレベル',
    en: 'All levels',
  },
  noCases: {
    'zh-CN': '没有需要审核的案例',
    'zh-TW': '沒有需要審核的案例',
    ja: '審査が必要なケースはありません',
    en: 'No cases require review',
  },
  allPassed: {
    'zh-CN': '所有 AI 分析报告已通过安全闸门',
    'zh-TW': '所有 AI 分析報告已通過安全閘門',
    ja: 'すべてのAI分析レポートはセーフティゲートを通過しました',
    en: 'All AI analysis reports have passed the safety gate',
  },
  needsReview: {
    'zh-CN': '需审核',
    'zh-TW': '需審核',
    ja: '要審査',
    en: 'Needs Review',
  },
  adjudicationSummary: {
    'zh-CN': '仲裁摘要',
    'zh-TW': '仲裁摘要',
    ja: '裁定サマリー',
    en: 'Adjudication Summary',
  },
  recommendedDepts: {
    'zh-CN': '推荐科室',
    'zh-TW': '推薦科室',
    ja: '推奨診療科',
    en: 'Recommended Departments',
  },
  criticalReasons: {
    'zh-CN': '关键原因',
    'zh-TW': '關鍵原因',
    ja: '重要な理由',
    en: 'Critical Reasons',
  },
  suggestedFollowups: {
    'zh-CN': '建议追问',
    'zh-TW': '建議追問',
    ja: '推奨フォローアップ質問',
    en: 'Suggested Follow-ups',
  },
  conflictNotes: {
    'zh-CN': 'AI 分歧记录',
    'zh-TW': 'AI 分歧記錄',
    ja: 'AI 意見相違の記録',
    en: 'AI Conflict Notes',
  },
  safetyGateExplanation: {
    'zh-CN': '安全闸门说明',
    'zh-TW': '安全閘門說明',
    ja: 'セーフティゲートの説明',
    en: 'Safety Gate Explanation',
  },
  escalationReason: {
    'zh-CN': '升级原因',
    'zh-TW': '升級原因',
    ja: 'エスカレーション理由',
    en: 'Escalation Reason',
  },
  confidence: {
    'zh-CN': '置信度:',
    'zh-TW': '置信度:',
    ja: '信頼度:',
    en: 'Confidence:',
  },
  latency: {
    'zh-CN': '延迟:',
    'zh-TW': '延遲:',
    ja: 'レイテンシー:',
    en: 'Latency:',
  },
  type: {
    'zh-CN': '类型:',
    'zh-TW': '類型:',
    ja: 'タイプ:',
    en: 'Type:',
  },
  reviewNoteLabel: {
    'zh-CN': '审核备注',
    'zh-TW': '審核備註',
    ja: 'レビューメモ',
    en: 'Review Note',
  },
  reviewNotePlaceholder: {
    'zh-CN': '审核备注（可选）',
    'zh-TW': '審核備註（可選）',
    ja: 'レビューメモ（任意）',
    en: 'Review note (optional)',
  },
  approve: {
    'zh-CN': '通过释放',
    'zh-TW': '通過釋放',
    ja: '承認・リリース',
    en: 'Approve & Release',
  },
  reject: {
    'zh-CN': '拦截拒绝',
    'zh-TW': '攔截拒絕',
    ja: '却下・ブロック',
    en: 'Reject & Block',
  },
  escalate: {
    'zh-CN': '升级',
    'zh-TW': '升級',
    ja: 'エスカレーション',
    en: 'Escalate',
  },
  uploadedDocument: {
    'zh-CN': '上传文档',
    'zh-TW': '上傳文檔',
    ja: 'アップロード文書',
    en: 'Uploaded Document',
  },
  viewOriginal: {
    'zh-CN': '查看原件',
    'zh-TW': '查看原件',
    ja: '原本を表示',
    en: 'View Original',
  },
  extractedText: {
    'zh-CN': 'AI 提取文本',
    'zh-TW': 'AI 提取文字',
    ja: 'AI 抽出テキスト',
    en: 'AI Extracted Text',
  },
  inputMode: {
    'zh-CN': '输入模式:',
    'zh-TW': '輸入模式:',
    ja: '入力モード:',
    en: 'Input mode:',
  },
  modeQuestionnaire: {
    'zh-CN': '问卷',
    'zh-TW': '問卷',
    ja: '問診',
    en: 'Questionnaire',
  },
  modeDocument: {
    'zh-CN': '文档',
    'zh-TW': '文檔',
    ja: '文書',
    en: 'Document',
  },
  modeHybrid: {
    'zh-CN': '混合',
    'zh-TW': '混合',
    ja: '混合',
    en: 'Hybrid',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string =>
  translations[key][lang];

/* ------------------------------------------------------------------ */
/*  Locale mapping for date formatting                                 */
/* ------------------------------------------------------------------ */

const dateLocaleMap: Record<Language, string> = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  ja: 'ja-JP',
  en: 'en-US',
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  document_url: string | null;
  document_name: string | null;
  document_type: string | null;
  document_extracted_text: string | null;
  input_mode: string;
}

interface ReviewStats {
  pendingReview: number;
  classC: number;
  classD: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReviewsPage() {
  const lang = useLanguage();

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
        setError(t('sessionExpired', lang));
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
        setError(errData?.error?.message || `${t('requestFailed', lang)} (${res.status})`);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError(t('networkError', lang));
    } finally {
      setLoading(false);
    }
  }, [supabase, filter, gateFilter, lang]);

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
        setActionError(t('sessionExpired', lang));
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
        setActionError(errData?.error?.message || `${t('actionFailed', lang)} (${res.status})`);
      }
    } catch (err) {
      console.error('Review action failed:', err);
      setActionError(t('networkActionError', lang));
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
          <h1 className="text-2xl font-bold text-gray-900">{t('pageTitle', lang)}</h1>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          aria-label={t('refreshAriaLabel', lang)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh', lang)}
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
            {t('close', lang)}
          </button>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{t('pendingReview', lang)}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">{t('classCLabel', lang)}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.classC}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{t('classDLabel', lang)}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.classD}</p>
        </div>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="status-filter">{t('statusFilter', lang)}</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="pending">{t('filterPending', lang)}</option>
          <option value="all">{t('filterAll', lang)}</option>
        </select>
        <label className="sr-only" htmlFor="gate-filter">{t('gateFilter', lang)}</label>
        <select
          id="gate-filter"
          value={gateFilter}
          onChange={(e) => setGateFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">{t('allGates', lang)}</option>
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
          <p className="text-lg font-medium">{t('noCases', lang)}</p>
          <p className="text-sm mt-1">{t('allPassed', lang)}</p>
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
                  {adj.input_mode && adj.input_mode !== 'questionnaire' && (
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      adj.input_mode === 'document'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {adj.input_mode === 'document' ? '文档' : '混合'}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(adj.created_at).toLocaleString(dateLocaleMap[lang])}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {adj.escalate_to_human && (
                    <span className="text-xs text-orange-600 font-medium">{t('needsReview', lang)}</span>
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
                      <h4 className="text-sm font-medium text-gray-700 mb-1">{t('adjudicationSummary', lang)}</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{adj.final_summary}</p>
                    </div>
                  )}

                  {/* 上传文档 */}
                  {adj.document_url && (
                    <div className="bg-cyan-50 p-3 rounded border border-cyan-100">
                      <h4 className="text-sm font-medium text-cyan-800 mb-2 flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        {t('uploadedDocument', lang)}
                        <span className="ml-auto text-xs font-normal text-cyan-600">
                          {t('inputMode', lang)}{' '}
                          {adj.input_mode === 'document'
                            ? t('modeDocument', lang)
                            : adj.input_mode === 'hybrid'
                            ? t('modeHybrid', lang)
                            : t('modeQuestionnaire', lang)}
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 bg-white rounded p-2 border border-cyan-100">
                        {adj.document_type === 'pdf' ? (
                          <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        ) : (
                          <Image className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                        <span className="text-sm text-gray-700 truncate flex-1">{adj.document_name}</span>
                        <a
                          href={adj.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700 transition-colors shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {t('viewOriginal', lang)}
                        </a>
                      </div>
                      {adj.document_extracted_text && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-cyan-700 mb-1">{t('extractedText', lang)}</p>
                          <div className="max-h-32 overflow-y-auto bg-white rounded p-2 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap border border-cyan-100">
                            {adj.document_extracted_text.length > 500
                              ? adj.document_extracted_text.substring(0, 500) + '...'
                              : adj.document_extracted_text}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 推荐科室 */}
                  {adj.final_departments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">{t('recommendedDepts', lang)}</h4>
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
                      <h4 className="text-sm font-medium text-gray-700 mb-1">{t('criticalReasons', lang)}</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {adj.critical_reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* 建议追问 */}
                  {adj.must_ask_followups.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-1">
                        <MessageCircleQuestion className="w-4 h-4" />
                        {t('suggestedFollowups', lang)} ({adj.must_ask_followups.length})
                      </h4>
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {adj.must_ask_followups.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* 冲突记录 */}
                  {adj.conflict_notes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-1">{t('conflictNotes', lang)}</h4>
                      <ul className="list-disc list-inside text-sm text-orange-600 space-y-1">
                        {adj.conflict_notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* 安全闸门说明 */}
                  {adj.safety_gate_explanation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">{t('safetyGateExplanation', lang)}</h4>
                      <p className="text-sm text-gray-600">{adj.safety_gate_explanation}</p>
                    </div>
                  )}

                  {/* 升级原因 */}
                  {adj.escalation_reason && (
                    <div className="bg-orange-50 p-3 rounded">
                      <h4 className="text-sm font-medium text-orange-800 mb-1">{t('escalationReason', lang)}</h4>
                      <p className="text-sm text-orange-700">{adj.escalation_reason}</p>
                    </div>
                  )}

                  {/* 元信息 */}
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>{t('confidence', lang)} {adj.confidence != null ? `${(adj.confidence * 100).toFixed(0)}%` : 'N/A'}</span>
                    <span>{t('latency', lang)} {adj.total_latency_ms != null ? `${adj.total_latency_ms}ms` : 'N/A'}</span>
                    <span>{t('type', lang)} {adj.screening_type}</span>
                  </div>

                  {/* 审核操作 */}
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <label className="sr-only" htmlFor={`review-note-${adj.id}`}>{t('reviewNoteLabel', lang)}</label>
                    <textarea
                      id={`review-note-${adj.id}`}
                      placeholder={t('reviewNotePlaceholder', lang)}
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
                        {t('approve', lang)}
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
                        {t('reject', lang)}
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
                        {t('escalate', lang)}
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
