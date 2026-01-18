'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  Send,
  AlertCircle,
  Banknote,
  Building,
  User,
  CreditCard,
} from 'lucide-react';

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  bank_name: string;
  bank_branch: string;
  account_type: string;
  account_number: string;
  account_holder: string;
  created_at: string;
  reviewed_at: string | null;
  review_note: string | null;
  payment_reference: string | null;
  paid_at: string | null;
  guide: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface Stats {
  pending: { count: number; amount: number };
  approved: { count: number; amount: number };
  processing: { count: number; amount: number };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待審核', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  approved: { label: '已批准', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  processing: { label: '處理中', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  completed: { label: '已完成', color: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { label: '已拒絕', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function SettlementsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedItem, setSelectedItem] = useState<Withdrawal | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadWithdrawals();
  }, [statusFilter]);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/withdrawals?status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load withdrawals error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!selectedItem) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          withdrawalId: selectedItem.id,
          action,
          reviewNote,
          paymentReference: paymentRef,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || '操作成功' });
        setSelectedItem(null);
        setReviewNote('');
        setPaymentRef('');
        await loadWithdrawals();
      } else {
        setMessage({ type: 'error', text: result.error || '操作失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-TW');
  };

  const formatAmount = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  // Detail View
  if (selectedItem) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => { setSelectedItem(null); setMessage(null); setReviewNote(''); setPaymentRef(''); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} /> 返回列表
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formatAmount(selectedItem.amount)}</h1>
                <p className="text-gray-500">{selectedItem.guide?.name} 的提現申請</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_CONFIG[selectedItem.status]?.bgColor} ${STATUS_CONFIG[selectedItem.status]?.color}`}>
                {STATUS_CONFIG[selectedItem.status]?.label}
              </span>
            </div>
          </div>

          {/* Bank Info */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={18} />
              收款銀行信息
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">銀行名稱</p>
                <p className="font-medium">{selectedItem.bank_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">分行名稱</p>
                <p className="font-medium">{selectedItem.bank_branch || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">帳戶類型</p>
                <p className="font-medium">{selectedItem.account_type === 'savings' ? '普通存款' : '活期存款'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">帳戶號碼</p>
                <p className="font-medium font-mono">{selectedItem.account_number}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">帳戶名義人</p>
                <p className="font-medium">{selectedItem.account_holder}</p>
              </div>
            </div>
          </div>

          {/* Guide Info */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} />
              申請人信息
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">姓名</p>
                <p className="font-medium">{selectedItem.guide?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">郵箱</p>
                <p className="font-medium">{selectedItem.guide?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">電話</p>
                <p className="font-medium">{selectedItem.guide?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">申請時間</p>
                <p className="font-medium">{formatDate(selectedItem.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {(selectedItem.reviewed_at || selectedItem.paid_at) && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} />
                處理記錄
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">提交申請 - {formatDate(selectedItem.created_at)}</span>
                </div>
                {selectedItem.reviewed_at && (
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${selectedItem.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm text-gray-600">
                      {selectedItem.status === 'rejected' ? '已拒絕' : '審核通過'} - {formatDate(selectedItem.reviewed_at)}
                      {selectedItem.review_note && <span className="text-gray-400 ml-2">({selectedItem.review_note})</span>}
                    </span>
                  </div>
                )}
                {selectedItem.paid_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      已打款 - {formatDate(selectedItem.paid_at)}
                      {selectedItem.payment_reference && <span className="text-gray-400 ml-2">(憑證: {selectedItem.payment_reference})</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Actions */}
          {selectedItem.status !== 'completed' && selectedItem.status !== 'rejected' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4">處理操作</h2>

              {/* Pending Actions */}
              {selectedItem.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      審核備註（拒絕時請填寫原因）
                    </label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="可選"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction('approve')}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                      批准提現
                    </button>
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
                      拒絕
                    </button>
                  </div>
                </div>
              )}

              {/* Approved Actions */}
              {selectedItem.status === 'approved' && (
                <div className="space-y-4">
                  <button
                    onClick={() => handleAction('process')}
                    disabled={actionLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Banknote size={20} />}
                    開始處理打款
                  </button>
                </div>
              )}

              {/* Processing Actions */}
              {selectedItem.status === 'processing' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      轉帳憑證號 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="請輸入銀行轉帳憑證號"
                    />
                  </div>
                  <button
                    onClick={() => handleAction('complete')}
                    disabled={actionLoading || !paymentRef}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    確認打款完成
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
          <Wallet className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">結算審核</h1>
          <p className="text-gray-500">處理合夥人提現申請</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待審核</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending.count}</p>
              </div>
              <p className="text-lg font-medium text-gray-400">{formatAmount(stats.pending.amount)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已批准待打款</p>
                <p className="text-2xl font-bold text-blue-600">{stats.approved.count}</p>
              </div>
              <p className="text-lg font-medium text-gray-400">{formatAmount(stats.approved.amount)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">處理中</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.processing.count}</p>
              </div>
              <p className="text-lg font-medium text-gray-400">{formatAmount(stats.processing.amount)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: 'pending', label: '待審核', icon: Clock },
          { value: 'approved', label: '已批准', icon: CheckCircle },
          { value: 'processing', label: '處理中', icon: Banknote },
          { value: 'completed', label: '已完成', icon: Send },
          { value: 'rejected', label: '已拒絕', icon: XCircle },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              statusFilter === filter.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border hover:border-indigo-300'
            }`}
          >
            <filter.icon size={16} />
            {filter.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : withdrawals.length > 0 ? (
          <div className="divide-y">
            {withdrawals.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-5 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-xl font-bold text-gray-900">{formatAmount(item.amount)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[item.status]?.bgColor} ${STATUS_CONFIG[item.status]?.color}`}>
                        {STATUS_CONFIG[item.status]?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.guide?.name} · {item.guide?.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <CreditCard size={12} />
                        {item.bank_name} {item.account_number.slice(-4)}
                      </span>
                      <span>申請時間: {formatDate(item.created_at)}</span>
                    </div>
                  </div>
                  <ChevronLeft className="rotate-180 text-gray-400" size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暫無{STATUS_CONFIG[statusFilter]?.label || ''}的提現申請</p>
          </div>
        )}
      </div>
    </div>
  );
}
