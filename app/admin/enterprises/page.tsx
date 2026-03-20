'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Building2,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Users,
  MapPin,
  Calendar,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface Enterprise {
  id: string;
  name: string;
  name_en: string | null;
  stock_code: string | null;
  stock_exchange: string | null;
  region: string;
  contact_name: string;
  contact_email: string;
  contact_title: string | null;
  contract_type: string;
  member_limit: number;
  member_count: number;
  annual_fee_jpy: number | null;
  discount_rate: number;
  status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
  suspended: { label: 'Suspended', color: 'text-red-700', bg: 'bg-red-50' },
  expired: { label: 'Expired', color: 'text-gray-700', bg: 'bg-gray-50' },
};

const REGION_FLAGS: Record<string, string> = {
  CN: '🇨🇳',
  HK: '🇭🇰',
  MO: '🇲🇴',
  TW: '🇹🇼',
};

// ============================================================
// Create Enterprise Form
// ============================================================

function CreateEnterpriseForm({
  onClose,
  onSuccess,
  token,
}: {
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}) {
  const [name, setName] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [region, setRegion] = useState('CN');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [memberLimit, setMemberLimit] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactName.trim() || !contactEmail.trim()) {
      setError('Company name, contact name, and email are required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/enterprises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          stockCode: stockCode.trim() || undefined,
          region,
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          contactTitle: contactTitle.trim() || undefined,
          memberLimit,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create enterprise');
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
            <Building2 className="w-5 h-5 text-indigo-600" />
            New Enterprise
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Code</label>
              <input
                type="text"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
                placeholder="e.g. 600519.SH"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="CN">China Mainland</option>
                <option value="HK">Hong Kong</option>
                <option value="MO">Macau</option>
                <option value="TW">Taiwan</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                placeholder="e.g. HR Director"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Limit</label>
              <input
                type="number"
                value={memberLimit}
                onChange={(e) => setMemberLimit(parseInt(e.target.value) || 50)}
                min={1}
                max={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitting ? 'Creating...' : 'Create Enterprise'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function EnterprisesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEnterprises = useMemo(() => {
    let result = enterprises;
    if (statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.name_en && e.name_en.toLowerCase().includes(q)) ||
        (e.stock_code && e.stock_code.toLowerCase().includes(q)) ||
        e.contact_email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [enterprises, statusFilter, searchQuery]);

  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setToken(session.access_token);

      const res = await fetch('/api/admin/enterprises', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) throw new Error('Failed to load enterprises');

      const data = await res.json();
      setEnterprises(data.enterprises || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            <Building2 className="w-7 h-7 text-indigo-600" />
            Enterprise B2B
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            上市公司高管健康管理 · {enterprises.length} enterprises
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            New Enterprise
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Enterprises</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{enterprises.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {enterprises.filter((e) => e.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Members</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {enterprises.reduce((s, e) => s + (e.member_count || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Regions</p>
          <div className="flex gap-1 mt-2">
            {['CN', 'HK', 'MO', 'TW'].map((r) => {
              const count = enterprises.filter((e) => e.region === r).length;
              return count > 0 ? (
                <span key={r} className="text-lg" title={r}>
                  {REGION_FLAGS[r]} {count}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Enterprise List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-gray-900">Enterprises</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索名称 / 股票代码..."
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-56"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {filteredEnterprises.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Building2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>{enterprises.length === 0 ? 'No enterprises yet' : 'No matching enterprises'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredEnterprises.map((ent) => {
              const statusCfg = STATUS_CONFIG[ent.status] || STATUS_CONFIG.pending;
              return (
                <Link
                  key={ent.id}
                  href={`/admin/enterprises/${ent.id}`}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition block"
                >
                  <div className="text-2xl">{REGION_FLAGS[ent.region] || '🏢'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{ent.name}</h3>
                      {ent.stock_code && (
                        <span className="text-xs text-gray-400 font-mono">{ent.stock_code}</span>
                      )}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {ent.member_count}/{ent.member_limit}
                      </span>
                      <span>{ent.contact_name} ({ent.contact_email})</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ent.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                  {ent.annual_fee_jpy ? (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        ¥{ent.annual_fee_jpy.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">/year</p>
                    </div>
                  ) : null}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <CreateEnterpriseForm
          token={token}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
