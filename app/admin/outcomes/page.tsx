'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Target,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Plus,
  X,
  RefreshCw,
  Search,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

type OutcomeLabel = 'accurate' | 'under_triage' | 'over_triage' | 'missed';

interface OutcomeRecord {
  id: string;
  screening_id: string;
  screening_type: string;
  contacted_hospital_id: string | null;
  actual_department: string | null;
  doctor_feedback: string | null;
  final_clinical_direction: string | null;
  was_admitted: boolean | null;
  surgery_performed: boolean | null;
  urgency_confirmed: boolean | null;
  outcome_label: OutcomeLabel | null;
  notes: string | null;
  created_at: string;
}

interface Stats {
  accurate: number;
  under_triage: number;
  over_triage: number;
  missed: number;
}

const LABEL_CONFIG: Record<
  OutcomeLabel,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  accurate: {
    label: 'Accurate',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: CheckCircle2,
  },
  under_triage: {
    label: 'Under-Triage',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: TrendingDown,
  },
  over_triage: {
    label: 'Over-Triage',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: TrendingUp,
  },
  missed: {
    label: 'Missed',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    icon: AlertTriangle,
  },
};

// ============================================================
// Record Outcome Form
// ============================================================

function RecordOutcomeForm({
  onClose,
  onSuccess,
  token,
}: {
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}) {
  const [screeningId, setScreeningId] = useState('');
  const [outcomeLabel, setOutcomeLabel] = useState<OutcomeLabel | ''>('');
  const [actualDepartment, setActualDepartment] = useState('');
  const [doctorFeedback, setDoctorFeedback] = useState('');
  const [urgencyConfirmed, setUrgencyConfirmed] = useState<boolean | null>(null);
  const [wasAdmitted, setWasAdmitted] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screeningId.trim() || !outcomeLabel) {
      setError('Screening ID and outcome label are required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/outcomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          screeningId: screeningId.trim(),
          outcomeLabel,
          actualDepartment: actualDepartment.trim() || undefined,
          doctorFeedback: doctorFeedback.trim() || undefined,
          urgencyConfirmed,
          wasAdmitted,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to record outcome');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Record Outcome
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Screening ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screening ID *
            </label>
            <input
              type="text"
              value={screeningId}
              onChange={(e) => setScreeningId(e.target.value)}
              placeholder="UUID"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Outcome Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outcome *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(LABEL_CONFIG) as OutcomeLabel[]).map((label) => {
                const cfg = LABEL_CONFIG[label];
                const Icon = cfg.icon;
                const selected = outcomeLabel === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setOutcomeLabel(label)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                      selected
                        ? `${cfg.bg} ${cfg.color} border-current`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actual Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Department
            </label>
            <input
              type="text"
              value={actualDepartment}
              onChange={(e) => setActualDepartment(e.target.value)}
              placeholder="e.g. Cardiology"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Boolean flags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Confirmed?
              </label>
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setUrgencyConfirmed(val)}
                    className={`px-3 py-1.5 rounded text-xs font-medium border ${
                      urgencyConfirmed === val
                        ? val
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {val ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Was Admitted?
              </label>
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setWasAdmitted(val)}
                    className={`px-3 py-1.5 rounded text-xs font-medium border ${
                      wasAdmitted === val
                        ? val
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {val ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Doctor Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Feedback
            </label>
            <textarea
              value={doctorFeedback}
              onChange={(e) => setDoctorFeedback(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {submitting ? 'Saving...' : 'Record Outcome'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function OutcomesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterLabel, setFilterLabel] = useState<OutcomeLabel | 'all'>('all');
  const [token, setToken] = useState('');

  const fetchData = useCallback(
    async (label?: OutcomeLabel) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;
        setToken(session.access_token);

        const params = new URLSearchParams({ limit: '100' });
        if (label) params.set('label', label);

        const res = await fetch(`/api/admin/outcomes?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) throw new Error('Failed to load outcomes');

        const data = await res.json();
        setOutcomes(data.outcomes || []);
        setStats(data.stats || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    fetchData(filterLabel === 'all' ? undefined : filterLabel);
  }, [fetchData, filterLabel]);

  const totalOutcomes = stats
    ? stats.accurate + stats.under_triage + stats.over_triage + stats.missed
    : 0;
  const accuracyRate =
    totalOutcomes > 0 ? Math.round((stats!.accurate / totalOutcomes) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-7 h-7 text-indigo-600" />
            Data Flywheel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            AI 分诊准确性追踪 · {totalOutcomes} outcomes recorded
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(filterLabel === 'all' ? undefined : filterLabel)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Record Outcome
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Accuracy KPIs */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Accuracy Rate</p>
            <p className={`text-3xl font-bold mt-1 ${accuracyRate >= 80 ? 'text-emerald-600' : accuracyRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {accuracyRate}%
            </p>
            <p className="text-xs text-gray-400 mt-1">{totalOutcomes} total</p>
          </div>
          {(Object.keys(LABEL_CONFIG) as OutcomeLabel[]).map((label) => {
            const cfg = LABEL_CONFIG[label];
            const count = stats[label];
            return (
              <button
                key={label}
                onClick={() => setFilterLabel(filterLabel === label ? 'all' : label)}
                className={`rounded-2xl p-5 shadow-sm border text-left transition ${
                  filterLabel === label ? cfg.bg : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
              >
                <p className="text-sm text-gray-500">{cfg.label}</p>
                <p className={`text-2xl font-bold mt-1 ${cfg.color}`}>{count}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Outcomes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Recorded Outcomes
            {filterLabel !== 'all' && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                — filtered by {LABEL_CONFIG[filterLabel].label}
              </span>
            )}
          </h2>
        </div>

        {outcomes.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No outcomes recorded yet</p>
            <p className="text-sm mt-1">
              Record your first outcome to start tracking AI accuracy
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {outcomes.map((o) => {
              const cfg = o.outcome_label ? LABEL_CONFIG[o.outcome_label] : null;
              const Icon = cfg?.icon || AlertCircle;
              return (
                <div
                  key={o.id}
                  className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition"
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg ${
                      cfg ? cfg.bg : 'bg-gray-50 border-gray-200'
                    } border`}
                  >
                    <Icon className={`w-4 h-4 ${cfg?.color || 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-gray-700">
                        {o.screening_id.slice(0, 8)}
                      </span>
                      {cfg && (
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${cfg.bg} ${cfg.color} border`}
                        >
                          {cfg.label}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {o.screening_type}
                      </span>
                    </div>
                    {o.actual_department && (
                      <p className="text-sm text-gray-600">
                        Dept: {o.actual_department}
                      </p>
                    )}
                    {o.doctor_feedback && (
                      <p className="text-sm text-gray-500 truncate">
                        {o.doctor_feedback}
                      </p>
                    )}
                    {o.notes && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {o.notes}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      {o.urgency_confirmed !== null && (
                        <span>
                          Urgency: {o.urgency_confirmed ? 'Yes' : 'No'}
                        </span>
                      )}
                      {o.was_admitted !== null && (
                        <span>
                          Admitted: {o.was_admitted ? 'Yes' : 'No'}
                        </span>
                      )}
                      {o.surgery_performed !== null && (
                        <span>
                          Surgery: {o.surgery_performed ? 'Yes' : 'No'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Record Form Modal */}
      {showForm && (
        <RecordOutcomeForm
          token={token}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchData(filterLabel === 'all' ? undefined : filterLabel);
          }}
        />
      )}
    </div>
  );
}
