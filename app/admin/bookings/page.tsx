'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  CalendarCheck,
  Search,
  Clock,
  Users,
  Store,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  DollarSign,
  Filter,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'no_show' | 'cancelled';
type DepositStatus = 'pending' | 'paid' | 'refunded' | 'forfeited';

interface BookingVenue {
  id: string;
  name: string;
}

interface BookingGuide {
  id: string;
  name: string;
  email: string;
}

interface BookingCustomer {
  name: string;
  phone: string;
  email: string;
}

interface Booking {
  id: string;
  venue: BookingVenue;
  guide: BookingGuide;
  customer: BookingCustomer;
  party_size: number;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  deposit_status: DepositStatus;
  deposit_amount: number;
  actual_spend: number | null;
  admin_notes: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  no_show: number;
  cancelled: number;
}

type ActionType = 'confirm' | 'complete' | 'no_show' | 'cancel';

interface ModalState {
  open: boolean;
  action: ActionType | null;
  booking: Booking | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'completed', label: '已完成' },
  { value: 'no_show', label: '未到店' },
  { value: 'cancelled', label: '已取消' },
];

const STATUS_BADGE_MAP: Record<string, { label: string; className: string }> = {
  'pending:pending': {
    label: '待付款',
    className: 'bg-gray-100 text-gray-600',
  },
  'pending:paid': {
    label: '待確認',
    className: 'bg-amber-100 text-amber-700',
  },
  confirmed: {
    label: '已確認',
    className: 'bg-blue-100 text-blue-700',
  },
  completed: {
    label: '已完成',
    className: 'bg-green-100 text-green-700',
  },
  no_show: {
    label: '未到店',
    className: 'bg-red-100 text-red-700',
  },
  cancelled: {
    label: '已取消',
    className: 'bg-gray-100 text-gray-500',
  },
};

const DEPOSIT_BADGE_MAP: Record<DepositStatus, { label: string; className: string }> = {
  pending: { label: '未付款', className: 'bg-gray-100 text-gray-600' },
  paid: { label: '已付款', className: 'bg-green-100 text-green-700' },
  refunded: { label: '已退款', className: 'bg-amber-100 text-amber-700' },
  forfeited: { label: '已沒收', className: 'bg-red-100 text-red-700' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusBadge(status: BookingStatus, depositStatus: DepositStatus) {
  if (status === 'pending') {
    const key = `pending:${depositStatus}`;
    return STATUS_BADGE_MAP[key] ?? STATUS_BADGE_MAP['pending:pending'];
  }
  return STATUS_BADGE_MAP[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
}

function getDepositBadge(depositStatus: DepositStatus) {
  return DEPOSIT_BADGE_MAP[depositStatus] ?? { label: depositStatus, className: 'bg-gray-100 text-gray-600' };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modal, setModal] = useState<ModalState>({ open: false, action: null, booking: null });
  const [adminNotes, setAdminNotes] = useState('');
  const [actualSpend, setActualSpend] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const supabase = useMemo(() => createClient(), []);

  // ─── Data Loading ────────────────────────────────────────────────────────

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await fetch(`/api/admin/bookings?${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Load bookings error:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, statusFilter, dateFilter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Auto-clear message after 5 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const openActionModal = (action: ActionType, booking: Booking) => {
    setModal({ open: true, action, booking });
    setAdminNotes('');
    setActualSpend('');
    setCancelReason('');
  };

  const closeModal = () => {
    setModal({ open: false, action: null, booking: null });
    setAdminNotes('');
    setActualSpend('');
    setCancelReason('');
  };

  const handleAction = async () => {
    if (!modal.action || !modal.booking) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const payload: Record<string, string | number | null> = {
        action: modal.action,
        bookingId: modal.booking.id,
        adminNotes: adminNotes || null,
      };

      if (modal.action === 'complete') {
        const spend = parseFloat(actualSpend);
        if (isNaN(spend) || spend < 0) {
          setMessage({ type: 'error', text: '請輸入有效的消費金額' });
          setActionLoading(false);
          return;
        }
        payload.actualSpend = spend;
      }

      if (modal.action === 'cancel') {
        if (!cancelReason.trim()) {
          setMessage({ type: 'error', text: '請輸入取消原因' });
          setActionLoading(false);
          return;
        }
        payload.cancelReason = cancelReason.trim();
      }

      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || '操作成功' });
        closeModal();
        await loadBookings();
      } else {
        setMessage({ type: 'error', text: result.error || '操作失敗' });
      }
    } catch (error) {
      console.error('Action error:', error);
      setMessage({ type: 'error', text: '網絡錯誤，請稍後重試' });
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Filtering ───────────────────────────────────────────────────────────

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.venue.name.toLowerCase().includes(q) ||
      b.guide.name.toLowerCase().includes(q) ||
      b.guide.email.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.customer.phone.includes(q) ||
      b.customer.email.toLowerCase().includes(q)
    );
  });

  // ─── Modal Label Helpers ─────────────────────────────────────────────────

  const getActionTitle = (action: ActionType): string => {
    const titles: Record<ActionType, string> = {
      confirm: '確認預約',
      complete: '錄入消費',
      no_show: '標記未到店',
      cancel: '取消預約',
    };
    return titles[action];
  };

  const getActionDescription = (action: ActionType): string => {
    const descriptions: Record<ActionType, string> = {
      confirm: '確認此預約後，客戶將收到確認通知。',
      complete: '錄入客戶實際消費金額，完成此預約。',
      no_show: '標記客戶未到店，定金將被沒收。',
      cancel: '取消此預約。請輸入取消原因。',
    };
    return descriptions[action];
  };

  const getActionButtonStyle = (action: ActionType): string => {
    const styles: Record<ActionType, string> = {
      confirm: 'bg-green-600 hover:bg-green-700 text-white',
      complete: 'bg-blue-600 hover:bg-blue-700 text-white',
      no_show: 'bg-amber-600 hover:bg-amber-700 text-white',
      cancel: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return styles[action];
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
            <CalendarCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">預約管理</h1>
            <p className="text-gray-500">管理夜總會預約訂單</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">總預約數</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">待確認</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            <p className="text-sm text-gray-500">已確認</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-500">已完成</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-red-600">{stats.no_show}</p>
            <p className="text-sm text-gray-500">未到店</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-400">{stats.cancelled}</p>
            <p className="text-sm text-gray-500">已取消</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                statusFilter === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Date Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋店鋪、導遊、客戶..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={18} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
                title="清除日期篩選"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">店鋪名</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">導遊</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">客戶</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-500">人數</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">預約日期/時間</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-500">定金狀態</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-500">狀態</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBookings.map((booking) => {
                  const statusBadge = getStatusBadge(booking.status, booking.deposit_status);
                  const depositBadge = getDepositBadge(booking.deposit_status);

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      {/* Venue */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Store size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900">{booking.venue.name}</span>
                        </div>
                      </td>

                      {/* Guide */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">{booking.guide.name}</p>
                        <p className="text-xs text-gray-400">{booking.guide.email}</p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">{booking.customer.name}</p>
                        <p className="text-xs text-gray-400">{booking.customer.phone}</p>
                      </td>

                      {/* Party Size */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
                          <Users size={14} className="text-gray-400" />
                          {booking.party_size}
                        </div>
                      </td>

                      {/* Date/Time */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-900">
                          <Clock size={14} className="text-gray-400 flex-shrink-0" />
                          <span>{booking.booking_date}</span>
                          <span className="text-gray-400">{booking.booking_time}</span>
                        </div>
                      </td>

                      {/* Deposit Status */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${depositBadge.className}`}
                        >
                          <DollarSign size={12} />
                          {depositBadge.label}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          {/* Pending + deposit paid => Confirm button */}
                          {booking.status === 'pending' && booking.deposit_status === 'paid' && (
                            <button
                              onClick={() => openActionModal('confirm', booking)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition"
                            >
                              確認預約
                            </button>
                          )}

                          {/* Confirmed => Complete + No Show + Cancel */}
                          {booking.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => openActionModal('complete', booking)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                              >
                                錄入消費
                              </button>
                              <button
                                onClick={() => openActionModal('no_show', booking)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition"
                              >
                                標記未到店
                              </button>
                              <button
                                onClick={() => openActionModal('cancel', booking)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition"
                              >
                                取消
                              </button>
                            </>
                          )}

                          {/* Other statuses - no actions, badge already visible */}
                          {booking.status !== 'pending' &&
                            booking.status !== 'confirmed' &&
                            booking.actual_spend != null && (
                              <span className="text-xs text-gray-500">
                                實際消費: &yen;{booking.actual_spend.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暫無預約數據</p>
          </div>
        )}
      </div>

      {/* ─── Action Modal ─────────────────────────────────────────────────── */}
      {modal.open && modal.action && modal.booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {getActionTitle(modal.action)}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-4">
              {getActionDescription(modal.action)}
            </p>

            {/* Booking Info Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Store size={14} className="text-gray-400" />
                <span className="font-medium">{modal.booking.venue.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={14} className="text-gray-400" />
                <span>
                  {modal.booking.customer.name} - {modal.booking.party_size} 人
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={14} className="text-gray-400" />
                <span>
                  {modal.booking.booking_date} {modal.booking.booking_time}
                </span>
              </div>
              {modal.booking.deposit_amount > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign size={14} className="text-gray-400" />
                  <span>定金: &yen;{modal.booking.deposit_amount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Actual Spend (complete action only) */}
            {modal.action === 'complete' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  實際消費金額 (&yen;) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={actualSpend}
                  onChange={(e) => setActualSpend(e.target.value)}
                  placeholder="例：50000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Cancel Reason (cancel action only) */}
            {modal.action === 'cancel' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  取消原因 *
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="請輸入取消預約的原因"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Admin Notes (all actions) */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理員備註（選填）
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="內部備註，不會顯示給客戶"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Modal Message */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            {/* Warning for destructive actions */}
            {(modal.action === 'no_show' || modal.action === 'cancel') && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 flex items-start gap-2 text-sm text-amber-700">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  {modal.action === 'no_show'
                    ? '標記未到店後，定金將被沒收且無法恢復。'
                    : '取消預約後將無法恢復，請確認操作。'}
                </span>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`flex-1 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 ${getActionButtonStyle(modal.action)}`}
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
                {getActionTitle(modal.action)}
              </button>
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
