'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils/format-date';
import {
  UserCheck,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileCheck,
  AlertCircle,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';

interface KYCItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  id_document_type: string | null;
  id_document_number_masked: string | null;
  legal_name: string | null;
  nationality: string | null;
  id_document_front_url: string | null;
  id_document_back_url: string | null;
  kyc_submitted_at: string | null;
  created_at: string;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  passport: '護照',
  id_card: '身份證',
  residence_card: '在留卡',
  other: '其他',
};

const NATIONALITY_LABELS: Record<string, string> = {
  CN: '中國',
  TW: '台灣',
  HK: '香港',
  JP: '日本',
  KR: '韓國',
  SG: '新加坡',
  MY: '馬來西亞',
  OTHER: '其他',
};

export default function KYCReviewPage() {
  const [items, setItems] = useState<KYCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('submitted');
  const [selectedItem, setSelectedItem] = useState<KYCItem | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadKYCItems();
  }, [statusFilter]);

  const loadKYCItems = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/kyc?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.guides || []);
      }
    } catch (error) {
      console.error('Load KYC error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadKYCDetail = async (guideId: string) => {
    setDetailLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/kyc?id=${guideId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedItem(data);
      }
    } catch (error) {
      console.error('Load KYC detail error:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedItem) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          guideId: selectedItem.id,
          action,
          reviewNote,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: action === 'approve' ? 'KYC 已通過審核' : 'KYC 已拒絕',
        });
        setSelectedItem(null);
        setReviewNote('');
        await loadKYCItems();
      } else {
        setMessage({ type: 'error', text: result.error || '操作失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };


  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-600', label: '未提交' },
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待審核' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: '已通過' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '已拒絕' },
    };
    const c = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  // Detail View
  if (selectedItem) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => { setSelectedItem(null); setReviewNote(''); setMessage(null); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} />
          返回列表
        </button>

        <div className="bg-white rounded-xl border overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedItem.name}</h1>
                <p className="text-gray-500">{selectedItem.email}</p>
              </div>
              {getStatusBadge(selectedItem.kyc_status)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">證件類型</p>
                <p className="font-medium">
                  {DOCUMENT_TYPE_LABELS[selectedItem.id_document_type || ''] || selectedItem.id_document_type || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">證件姓名</p>
                <p className="font-medium">{selectedItem.legal_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">證件號碼</p>
                <p className="font-medium font-mono">{selectedItem.id_document_number_masked || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">國籍</p>
                <p className="font-medium">
                  {NATIONALITY_LABELS[selectedItem.nationality || ''] || selectedItem.nationality || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">提交時間</p>
                <p className="font-medium">{formatDateTime(selectedItem.kyc_submitted_at)}</p>
              </div>
            </div>

            {/* Document Images */}
            <div>
              <p className="text-sm text-gray-500 mb-3">證件照片</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2">正面</p>
                  {selectedItem.id_document_front_url ? (
                    <a
                      href={selectedItem.id_document_front_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={selectedItem.id_document_front_url}
                        alt="證件正面"
                        className="w-full h-48 object-cover rounded-lg border hover:opacity-90 transition"
                      />
                      <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                        <ExternalLink size={12} /> 點擊查看大圖
                      </p>
                    </a>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      未上傳
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">背面</p>
                  {selectedItem.id_document_back_url ? (
                    <a
                      href={selectedItem.id_document_back_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={selectedItem.id_document_back_url}
                        alt="證件背面"
                        className="w-full h-48 object-cover rounded-lg border hover:opacity-90 transition"
                      />
                      <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                        <ExternalLink size={12} /> 點擊查看大圖
                      </p>
                    </a>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      未上傳
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            {/* Review Actions */}
            {selectedItem.kyc_status === 'submitted' && (
              <div className="border-t pt-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    審核備註（選填，拒絕時建議填寫原因）
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="例如：照片模糊，請重新上傳"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    通過審核
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                    拒絕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <UserCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC 審核</h1>
            <p className="text-gray-500">身份驗證審核管理</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'submitted', label: '待審核', icon: Clock },
          { value: 'approved', label: '已通過', icon: CheckCircle },
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
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
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
        ) : items.length > 0 ? (
          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-gray-50 transition flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {getStatusBadge(item.kyc_status)}
                  </div>
                  <p className="text-sm text-gray-500">{item.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>
                      證件: {DOCUMENT_TYPE_LABELS[item.id_document_type || ''] || item.id_document_type || '-'}
                    </span>
                    <span>姓名: {item.legal_name || '-'}</span>
                    <span>
                      國籍: {NATIONALITY_LABELS[item.nationality || ''] || item.nationality || '-'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    提交時間: {formatDateTime(item.kyc_submitted_at)}
                  </p>
                </div>
                <button
                  onClick={() => loadKYCDetail(item.id)}
                  disabled={detailLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  {detailLoading ? <Loader2 className="animate-spin" size={16} /> : <Eye size={16} />}
                  查看詳情
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {statusFilter === 'submitted' ? '暫無待審核的 KYC' :
               statusFilter === 'approved' ? '暫無已通過的 KYC' :
               '暫無已拒絕的 KYC'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
