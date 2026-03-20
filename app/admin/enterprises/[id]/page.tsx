'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { use } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Users,
  ShoppingCart,
  Key,
  FileText,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Edit3,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Activity,
  Shield,
  Calendar,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Eye,
  EyeOff,
  ChevronDown,
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
  contact_phone: string | null;
  contact_title: string | null;
  contract_type: string;
  contract_start: string | null;
  contract_end: string | null;
  member_limit: number;
  annual_fee_jpy: number | null;
  per_screening_fee_jpy: number | null;
  discount_rate: number;
  screening_quota: number;
  screening_used: number;
  dedicated_coordinator: boolean;
  priority_booking: boolean;
  chinese_interpreter: boolean;
  airport_transfer: boolean;
  api_key_id: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: string;
  full_name: string;
  full_name_en: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  preferred_language: string;
  last_screening_date: string | null;
  last_health_score: number | null;
  screening_count: number;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  member_count: number;
  unit_price_jpy: number;
  discount_rate: number;
  total_amount_jpy: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  actor_type: string;
  actor_id: string | null;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

interface ApiKeyInfo {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  total_requests: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

// ============================================================
// Constants
// ============================================================

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
  suspended: { label: 'Suspended', color: 'text-red-700', bg: 'bg-red-50' },
  expired: { label: 'Expired', color: 'text-gray-700', bg: 'bg-gray-100' },
};

const REGION_FLAGS: Record<string, string> = { CN: '🇨🇳', HK: '🇭🇰', MO: '🇲🇴', TW: '🇹🇼' };

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600 bg-gray-100' },
  submitted: { label: 'Submitted', color: 'text-blue-600 bg-blue-50' },
  confirmed: { label: 'Confirmed', color: 'text-emerald-600 bg-emerald-50' },
  in_progress: { label: 'In Progress', color: 'text-amber-600 bg-amber-50' },
  completed: { label: 'Completed', color: 'text-emerald-700 bg-emerald-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50' },
};

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  unpaid: { label: 'Unpaid', color: 'text-gray-600 bg-gray-100' },
  invoiced: { label: 'Invoiced', color: 'text-blue-600 bg-blue-50' },
  paid: { label: 'Paid', color: 'text-emerald-600 bg-emerald-50' },
  refunded: { label: 'Refunded', color: 'text-red-600 bg-red-50' },
};

const TABS = [
  { key: 'overview', label: '概览', icon: Building2 },
  { key: 'members', label: '成员', icon: Users },
  { key: 'orders', label: '订单', icon: ShoppingCart },
  { key: 'apiKey', label: 'API Key', icon: Key },
  { key: 'audit', label: '审计日志', icon: FileText },
] as const;

type TabKey = typeof TABS[number]['key'];

// ============================================================
// Page Props
// ============================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

// ============================================================
// Add Member Modal
// ============================================================

function AddMemberModal({
  onClose,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitting: boolean;
}) {
  const [fullName, setFullName] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">添加成员</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ fullName, fullNameEn, title, email, phone, gender: gender || undefined });
          }}
          className="p-5 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
            <input type="text" value={fullNameEn} onChange={e => setFullNameEn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="CEO, CFO..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option value="">--</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <button type="submit" disabled={submitting || !fullName.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2 mt-4">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitting ? '添加中...' : '添加成员'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Edit Enterprise Modal
// ============================================================

function EditEnterpriseModal({
  enterprise,
  onClose,
  onSubmit,
  submitting,
}: {
  enterprise: Enterprise;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  submitting: boolean;
}) {
  const [name, setName] = useState(enterprise.name);
  const [nameEn, setNameEn] = useState(enterprise.name_en || '');
  const [stockCode, setStockCode] = useState(enterprise.stock_code || '');
  const [region, setRegion] = useState(enterprise.region);
  const [contactName, setContactName] = useState(enterprise.contact_name);
  const [contactEmail, setContactEmail] = useState(enterprise.contact_email);
  const [contactPhone, setContactPhone] = useState(enterprise.contact_phone || '');
  const [contactTitle, setContactTitle] = useState(enterprise.contact_title || '');
  const [contractType, setContractType] = useState(enterprise.contract_type);
  const [memberLimit, setMemberLimit] = useState(enterprise.member_limit);
  const [screeningQuota, setScreeningQuota] = useState(enterprise.screening_quota);
  const [annualFeeJpy, setAnnualFeeJpy] = useState(enterprise.annual_fee_jpy || 0);
  const [discountRate, setDiscountRate] = useState(enterprise.discount_rate);
  const [notes, setNotes] = useState(enterprise.notes || '');
  const [status, setStatus] = useState(enterprise.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">编辑企业信息</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              name, nameEn: nameEn || null, stockCode: stockCode || null, region,
              contactName, contactEmail, contactPhone: contactPhone || null,
              contactTitle: contactTitle || null, contractType, memberLimit,
              screeningQuota, annualFeeJpy: annualFeeJpy || null,
              discountRate, notes: notes || null, status,
            });
          }}
          className="p-5 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
              <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">股票代码</label>
              <input type="text" value={stockCode} onChange={e => setStockCode(e.target.value)} placeholder="600519.SH"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
              <select value={region} onChange={e => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option value="CN">中国大陆</option>
                <option value="HK">香港</option>
                <option value="MO">澳门</option>
                <option value="TW">台湾</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs font-semibold text-gray-500 uppercase">联系人</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人 *</label>
              <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
              <input type="text" value={contactTitle} onChange={e => setContactTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs font-semibold text-gray-500 uppercase">合同 & 配额</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">合同类型</label>
              <select value={contractType} onChange={e => setContractType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option value="annual">Annual</option>
                <option value="per_use">Per Use</option>
                <option value="trial">Trial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">成员上限</label>
              <input type="number" value={memberLimit} onChange={e => setMemberLimit(parseInt(e.target.value) || 50)} min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">筛查配额</label>
              <input type="number" value={screeningQuota} onChange={e => setScreeningQuota(parseInt(e.target.value) || 200)} min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年费 (JPY)</label>
              <input type="number" value={annualFeeJpy} onChange={e => setAnnualFeeJpy(parseInt(e.target.value) || 0)} min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">折扣率 (%)</label>
              <input type="number" value={discountRate} onChange={e => setDiscountRate(parseFloat(e.target.value) || 0)} min={0} max={100} step={0.1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-60 transition flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {submitting ? '保存中...' : '保存更改'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function EnterpriseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);
  const [apiKey, setApiKey] = useState<ApiKeyInfo | null>(null);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // API Key generation
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setToken(session.access_token);

      const res = await fetch(`/api/admin/enterprises/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load enterprise');
      }

      const data = await res.json();
      setEnterprise(data.enterprise);
      setMembers(data.members || []);
      setOrders(data.orders || []);
      setAuditLog(data.auditLog || []);
      setApiKey(data.apiKey);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── API helpers ──

  const apiCall = useCallback(async (url: string, method: string, body?: any) => {
    setSubmitting(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } finally {
      setSubmitting(false);
    }
  }, [token]);

  const handleEditEnterprise = useCallback(async (data: Record<string, unknown>) => {
    await apiCall(`/api/admin/enterprises/${id}`, 'PATCH', data);
    setShowEditModal(false);
    fetchData();
  }, [apiCall, id, fetchData]);

  const handleAddMember = useCallback(async (data: any) => {
    await apiCall(`/api/admin/enterprises/${id}/members`, 'POST', data);
    setShowAddMember(false);
    fetchData();
  }, [apiCall, id, fetchData]);

  const handleRemoveMember = useCallback(async (memberId: string, name: string) => {
    if (!confirm(`确认移除成员「${name}」？`)) return;
    await apiCall(`/api/admin/enterprises/${id}/members`, 'DELETE', { memberId });
    fetchData();
  }, [apiCall, id, fetchData]);

  const handleGenerateApiKey = useCallback(async () => {
    if (!confirm('生成新 API Key 将停用旧 Key，确认继续？')) return;
    const result = await apiCall(`/api/admin/enterprises/${id}/api-key`, 'POST', {});
    setNewApiKey(result.key);
    fetchData();
  }, [apiCall, id, fetchData]);

  const handleRevokeApiKey = useCallback(async () => {
    if (!confirm('确认停用 API Key？')) return;
    await apiCall(`/api/admin/enterprises/${id}/api-key`, 'DELETE');
    fetchData();
  }, [apiCall, id, fetchData]);

  const handleUpdateOrder = useCallback(async (orderId: string, fields: Record<string, unknown>) => {
    await apiCall(`/api/admin/enterprises/${id}/orders`, 'PATCH', { orderId, ...fields });
    fetchData();
  }, [apiCall, id, fetchData]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // ── Loading / Error ──

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!enterprise) {
    return (
      <div className="p-8">
        <Link href="/admin/enterprises" className="text-indigo-600 hover:underline flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <p className="text-red-600">Enterprise not found</p>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[enterprise.status] || STATUS_CONFIG.pending;
  const quotaPct = enterprise.screening_quota > 0
    ? Math.round((enterprise.screening_used / enterprise.screening_quota) * 100)
    : 0;

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Back */}
      <Link href="/admin/enterprises"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> 企业列表
      </Link>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{REGION_FLAGS[enterprise.region] || '🏢'}</div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{enterprise.name}</h1>
                {enterprise.stock_code && (
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">{enterprise.stock_code}</span>
                )}
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
              {enterprise.name_en && <p className="text-sm text-gray-400 mt-0.5">{enterprise.name_en}</p>}
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{enterprise.contact_email}</span>
                {enterprise.contact_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{enterprise.contact_phone}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(enterprise.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <Edit3 className="w-4 h-4" /> 编辑
            </button>
            <button onClick={fetchData}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">成员</p>
            <p className="text-lg font-bold text-gray-900">{members.filter(m => m.status === 'active').length} / {enterprise.member_limit}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">筛查配额</p>
            <p className="text-lg font-bold text-gray-900">{enterprise.screening_used} / {enterprise.screening_quota}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className={`h-1.5 rounded-full ${quotaPct > 90 ? 'bg-red-500' : quotaPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(quotaPct, 100)}%` }} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">合同类型</p>
            <p className="text-lg font-bold text-gray-900 capitalize">{enterprise.contract_type}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">年费</p>
            <p className="text-lg font-bold text-gray-900">
              {enterprise.annual_fee_jpy ? `¥${enterprise.annual_fee_jpy.toLocaleString()}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">企业信息</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">地区</dt><dd>{REGION_FLAGS[enterprise.region]} {enterprise.region}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">股票</dt><dd>{enterprise.stock_code || '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">折扣</dt><dd>{enterprise.discount_rate}%</dd></div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">联系人</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">姓名</dt><dd>{enterprise.contact_name}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">职位</dt><dd>{enterprise.contact_title || '—'}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{enterprise.contact_email}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">电话</dt><dd>{enterprise.contact_phone || '—'}</dd></div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">增值服务</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'dedicated_coordinator', label: '专属协调员' },
                  { key: 'priority_booking', label: '优先预约' },
                  { key: 'chinese_interpreter', label: '中文翻译' },
                  { key: 'airport_transfer', label: '机场接送' },
                ].map(feature => (
                  <span key={feature.key}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (enterprise as any)[feature.key] ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {(enterprise as any)[feature.key] ? '✓' : '✗'} {feature.label}
                  </span>
                ))}
              </div>
            </div>

            {enterprise.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">备注</h3>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{enterprise.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Members Tab ── */}
        {activeTab === 'members' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                成员列表
                <span className="text-sm text-gray-400 font-normal ml-2">
                  ({members.filter(m => m.status === 'active').length} active / {enterprise.member_limit} limit)
                </span>
              </h2>
              <button onClick={() => setShowAddMember(true)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                <Plus className="w-4 h-4" /> 添加成员
              </button>
            </div>

            {members.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No members yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                    <th className="px-6 py-3">姓名</th>
                    <th className="px-4 py-3">职位</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 text-center">筛查</th>
                    <th className="px-4 py-3 text-center">健康分</th>
                    <th className="px-4 py-3">状态</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{member.full_name}</p>
                        {member.full_name_en && <p className="text-xs text-gray-400">{member.full_name_en}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{member.title || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{member.email || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-medium">{member.screening_count}</span>
                        {member.last_screening_date && (
                          <p className="text-[10px] text-gray-400">{new Date(member.last_screening_date).toLocaleDateString('ja-JP')}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {member.last_health_score != null ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            member.last_health_score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                            member.last_health_score >= 60 ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>{member.last_health_score}</span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          member.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>{member.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {member.status === 'active' && (
                          <button onClick={() => handleRemoveMember(member.id, member.full_name)}
                            className="p-1 text-gray-400 hover:text-red-500 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                订单列表
                <span className="text-sm text-gray-400 font-normal ml-2">({orders.length})</span>
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                    <th className="px-6 py-3">订单号</th>
                    <th className="px-4 py-3">人数</th>
                    <th className="px-4 py-3">金额</th>
                    <th className="px-4 py-3">状态</th>
                    <th className="px-4 py-3">支付</th>
                    <th className="px-4 py-3">日期</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => {
                    const os = ORDER_STATUS[order.status] || ORDER_STATUS.draft;
                    const ps = PAYMENT_STATUS[order.payment_status] || PAYMENT_STATUS.unpaid;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-mono text-xs">{order.order_number}</td>
                        <td className="px-4 py-3">{order.member_count}</td>
                        <td className="px-4 py-3 font-medium">¥{order.total_amount_jpy.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${os.color}`}>{os.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${ps.color}`}>{ps.label}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString('ja-JP')}</td>
                        <td className="px-4 py-3">
                          {order.payment_status === 'unpaid' && (
                            <button onClick={() => handleUpdateOrder(order.id, { paymentStatus: 'invoiced' })}
                              className="text-xs text-indigo-600 hover:underline">开票</button>
                          )}
                          {order.payment_status === 'invoiced' && (
                            <button onClick={() => handleUpdateOrder(order.id, { paymentStatus: 'paid' })}
                              className="text-xs text-emerald-600 hover:underline">确认付款</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── API Key Tab ── */}
        {activeTab === 'apiKey' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">API Key 管理</h2>
              <button onClick={handleGenerateApiKey} disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition">
                <Key className="w-4 h-4" />
                {apiKey ? '重新生成' : '生成 API Key'}
              </button>
            </div>

            {/* Show newly generated key */}
            {newApiKey && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-2">请立即保存此 API Key，它不会再次显示：</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm font-mono break-all">{newApiKey}</code>
                  <button onClick={() => copyToClipboard(newApiKey)}
                    className="p-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-100 transition">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
                  </button>
                </div>
              </div>
            )}

            {apiKey ? (
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">{apiKey.name}</p>
                    <p className="text-sm text-gray-500 font-mono">{apiKey.key_prefix}...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${apiKey.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {apiKey.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {apiKey.is_active && (
                      <button onClick={handleRevokeApiKey} disabled={submitting}
                        className="text-xs text-red-600 hover:underline">停用</button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">总请求</p>
                    <p className="font-semibold">{apiKey.total_requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">速率限制</p>
                    <p className="font-semibold">{apiKey.rate_limit_per_minute}/min, {apiKey.rate_limit_per_day}/day</p>
                  </div>
                  <div>
                    <p className="text-gray-500">最后使用</p>
                    <p className="font-semibold">{apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleString('ja-JP') : '—'}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Scopes</p>
                  <div className="flex gap-1">
                    {apiKey.scopes.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Key className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>未关联 API Key</p>
                <p className="text-xs mt-1">点击上方按钮生成</p>
              </div>
            )}
          </div>
        )}

        {/* ── Audit Log Tab ── */}
        {activeTab === 'audit' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">审计日志</h2>
            </div>

            {auditLog.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No audit logs yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {auditLog.map(log => (
                  <div key={log.id} className="px-6 py-3 flex items-start gap-4">
                    <div className="mt-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                        <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{log.actor_type}</span>
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('ja-JP')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditModal && enterprise && (
        <EditEnterpriseModal
          enterprise={enterprise}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditEnterprise}
          submitting={submitting}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSubmit={handleAddMember}
          submitting={submitting}
        />
      )}
    </div>
  );
}
