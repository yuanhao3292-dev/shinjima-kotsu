'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDateSimple } from '@/lib/utils/format-date';
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  Star,
  Ban,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Copy,
  X,
} from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string;
  wechat_id: string | null;
  status: 'pending' | 'approved' | 'suspended';
  level: string;
  kyc_status: string;
  total_commission: number;
  total_bookings: number;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
  referrer?: { id: string; name: string; referral_code: string };
  stats?: { bookingCount: number; referralCount: number };
}

interface Stats {
  total: number;
  approved: number;
  pending: number;
  suspended: number;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  growth: { label: '初期', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  gold: { label: '金牌', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待審核', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  approved: { label: '已認證', color: 'text-green-700', bgColor: 'bg-green-100' },
  suspended: { label: '已停用', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 添加导游相关状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuideEmail, setNewGuideEmail] = useState('');
  const [newGuideName, setNewGuideName] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadGuides();
  }, [statusFilter]);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/guides?${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setGuides(data.guides || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load guides error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuideDetail = async (guideId: string) => {
    setDetailLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/guides?id=${guideId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedGuide(data);
      }
    } catch (error) {
      console.error('Load guide detail error:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async (action: string, level?: string) => {
    if (!selectedGuide) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ guideId: selectedGuide.id, action, level }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '操作成功' });
        await loadGuideDetail(selectedGuide.id);
        await loadGuides();
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.error || '操作失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGuides();
  };

  const handleAddGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideEmail || !newGuideName) {
      setMessage({ type: 'error', text: '請填寫所有必填項' });
      return;
    }

    setAddLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/guides', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: newGuideEmail,
          name: newGuideName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedPassword(data.password);
        setMessage({ type: 'success', text: '導遊帳號創建成功！請將密碼提供給導遊。' });
        await loadGuides();
        setNewGuideEmail('');
        setNewGuideName('');
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.error || '創建失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setAddLoading(false);
    }
  };

  const copyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setMessage({ type: 'success', text: '密碼已複製到剪貼板' });
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewGuideEmail('');
    setNewGuideName('');
    setGeneratedPassword(null);
    setMessage(null);
  };


  // Detail View
  if (selectedGuide) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => { setSelectedGuide(null); setMessage(null); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} /> 返回列表
        </button>

        {detailLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {selectedGuide.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{selectedGuide.name}</h1>
                    <p className="text-gray-500">{selectedGuide.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedGuide.status]?.bgColor} ${STATUS_CONFIG[selectedGuide.status]?.color}`}>
                        {STATUS_CONFIG[selectedGuide.status]?.label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${LEVEL_CONFIG[selectedGuide.level]?.bgColor} ${LEVEL_CONFIG[selectedGuide.level]?.color}`}>
                        {LEVEL_CONFIG[selectedGuide.level]?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  推薦碼: <span className="font-mono font-bold">{selectedGuide.referral_code}</span>
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedGuide.total_bookings}</p>
                <p className="text-sm text-gray-500">總訂單</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-green-600">¥{selectedGuide.total_commission?.toLocaleString() || 0}</p>
                <p className="text-sm text-gray-500">總佣金</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">{selectedGuide.stats?.referralCount || 0}</p>
                <p className="text-sm text-gray-500">推薦人數</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedGuide.stats?.bookingCount || 0}</p>
                <p className="text-sm text-gray-500">預約次數</p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4">聯繫信息</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={18} />
                  <span>{selectedGuide.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={18} />
                  <span>{selectedGuide.phone || '-'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <span>註冊於 {formatDateSimple(selectedGuide.created_at)}</span>
                </div>
                {selectedGuide.referrer && (
                  <div className="flex items-center gap-3">
                    <Users className="text-gray-400" size={18} />
                    <span>推薦人: {selectedGuide.referrer.name} ({selectedGuide.referrer.referral_code})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4">管理操作</h2>

              {/* Level Change */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">調整等級</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(LEVEL_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleAction('update_level', key)}
                      disabled={actionLoading || selectedGuide.level === key}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        selectedGuide.level === key
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      <Star className="inline mr-1" size={14} />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-3">
                {selectedGuide.status === 'pending' && (
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                    通過審核
                  </button>
                )}
                {selectedGuide.status === 'approved' && (
                  <button
                    onClick={() => handleAction('suspend')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Ban size={16} />}
                    停用帳號
                  </button>
                )}
                {selectedGuide.status === 'suspended' && (
                  <button
                    onClick={() => handleAction('reactivate')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    重新啟用
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">導遊管理</h1>
            <p className="text-gray-500">管理合夥人帳號</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <UserPlus size={18} />
          添加導遊
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">總導遊數</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-500">已認證</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">待審核</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
            <p className="text-sm text-gray-500">已停用</p>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋姓名、郵箱、電話、推薦碼..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            搜尋
          </button>
        </form>
        <div className="flex gap-2">
          {['all', 'approved', 'pending', 'suspended'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === filter ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:border-indigo-300'
              }`}
            >
              {filter === 'all' ? '全部' : filter === 'approved' ? '已認證' : filter === 'pending' ? '待審核' : '已停用'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : guides.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">導遊</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">狀態</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">等級</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-500">佣金</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-500">訂單</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">註冊時間</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {guides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{guide.name}</p>
                      <p className="text-sm text-gray-500">{guide.email}</p>
                      <p className="text-xs text-gray-400 font-mono">{guide.referral_code}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[guide.status]?.bgColor} ${STATUS_CONFIG[guide.status]?.color}`}>
                        {STATUS_CONFIG[guide.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${LEVEL_CONFIG[guide.level]?.bgColor} ${LEVEL_CONFIG[guide.level]?.color}`}>
                        {LEVEL_CONFIG[guide.level]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-medium text-green-600">¥{guide.total_commission?.toLocaleString() || 0}</p>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-900">{guide.total_bookings || 0}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatDateSimple(guide.created_at)}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => loadGuideDetail(guide.id)}
                        className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        <Eye size={14} /> 詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暫無導遊數據</p>
          </div>
        )}
      </div>

      {/* 添加导游模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">添加新導遊</h2>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {!generatedPassword ? (
              <form onSubmit={handleAddGuide} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    導遊姓名 *
                  </label>
                  <input
                    type="text"
                    value={newGuideName}
                    onChange={(e) => setNewGuideName(e.target.value)}
                    placeholder="請輸入導遊姓名"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    導遊郵箱 *
                  </label>
                  <input
                    type="email"
                    value={newGuideEmail}
                    onChange={(e) => setNewGuideEmail(e.target.value)}
                    placeholder="請輸入導遊郵箱地址"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    此郵箱將作為導遊的登錄帳號
                  </p>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {message.text}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {addLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        創建中...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        創建帳號
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle size={18} />
                    <span className="font-medium">帳號創建成功！</span>
                  </div>
                  <p className="text-sm text-green-600">
                    導遊帳號已創建，請將以下信息提供給導遊。
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      登錄郵箱
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                      {newGuideEmail}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      初始密碼
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                        {generatedPassword}
                      </div>
                      <button
                        onClick={copyPassword}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        title="複製密碼"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      導遊登錄後可在設置頁面修改密碼
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700">
                    <strong>注意：</strong>請務必將密碼安全地提供給導遊，關閉此窗口後將無法再次查看。
                  </p>
                </div>

                <button
                  onClick={closeAddModal}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  完成
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
