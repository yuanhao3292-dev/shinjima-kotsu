'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils/format-date';
import Link from 'next/link';

// ============================================
// 醫療訂單相關
// ============================================

interface Order {
  id: string;
  order_number: string | null;
  created_at: string;
  status: string;
  total_amount_jpy: number | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  customer_snapshot: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    line?: string;
    wechat?: string;
    whatsapp?: string;
  } | null;
  paid_at: string | null;
  confirmed_at: string | null;
  refunded_at: string | null;
  referred_by_guide_slug: string | null;
  medical_packages: {
    name_zh_tw: string;
    slug: string;
    price_jpy: number;
  } | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '待付款', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: '已付款', color: 'bg-green-100 text-green-800' },
  confirmed: { label: '已確認', color: 'bg-blue-100 text-blue-800' },
  completed: { label: '已完成', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' },
  refunded: { label: '已退款', color: 'bg-purple-100 text-purple-800' },
};

export default function AdminOrdersPage() {
  const supabase = createClient();

  // 醫療訂單
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refunding, setRefunding] = useState(false);
  const [refundModal, setRefundModal] = useState<{ visible: boolean; orderId?: string; amount?: number; reason: string }>({ visible: false, reason: '' });


  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filter]);


  // ============================================
  // 醫療訂單 - 數據操作
  // ============================================

  // 真订单在 `orders` 表（RLS 只允许客户读自己的单），必须经服务端 admin API。
  // 此前这里直接查 `medical_orders`（手工建的空表），后台永远是「暂无订单」。
  async function fetchOrders() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/admin/orders?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '获取订单失败');
      setOrders((result.orders as Order[]) || []);
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '更新失敗');

      fetchOrders();
      setSelectedOrder(null);
      alert('訂單狀態已更新');
    } catch (error) {
      console.error('更新订单状态失败:', error);
      alert(error instanceof Error ? error.message : '更新失敗');
    }
  }

  function openRefundModal(orderId: string) {
    const order = orders.find(o => o.id === orderId);
    setRefundModal({ visible: true, orderId, amount: order?.total_amount_jpy || 0, reason: '' });
  }

  async function confirmRefund() {
    if (!refundModal.orderId) return;

    setRefunding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/admin/orders/${refundModal.orderId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ reason: refundModal.reason || undefined }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || '退款失敗');
      }

      alert(`退款成功！Stripe Refund ID: ${result.refundId}`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('退款失败:', error);
      alert(`退款失敗: ${error.message}`);
    } finally {
      setRefunding(false);
      setRefundModal({ visible: false, reason: '' });
    }
  }

  // ============================================
  // 共用工具函數
  // ============================================


  const formatTimeSlot = (time: string | null) => {
    if (!time) return '-';
    return time === 'morning' ? '上午' : time === 'afternoon' ? '下午' : time;
  };

  // 统计数据
  const medicalStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
            <p className="text-sm text-gray-500">NIIJIMA 管理後台</p>
          </div>
          <Link
            href="/"
            className="text-brand-600 hover:text-brand-800 text-sm"
          >
            ← 返回首頁
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab 切換：導遊預約有专门页面（走 admin API），这里只留跳转，
            不再维护一份浏览器端直查 bookings 的坏副本 */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          <span className="px-6 py-2.5 rounded-lg text-sm font-medium bg-white text-gray-900 shadow-sm">
            醫療訂單
            {medicalStats.pending > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                {medicalStats.pending}
              </span>
            )}
          </span>
          <Link
            href="/admin/bookings"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition"
          >
            導遊預約 →
          </Link>
        </div>

        {/* ============================================ */}
        {/* 醫療訂單 Tab */}
        {/* ============================================ */}
        <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <p className="text-sm text-gray-500">總訂單</p>
                <p className="text-3xl font-bold text-gray-900">{medicalStats.total}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
                <p className="text-sm text-yellow-600">待付款</p>
                <p className="text-3xl font-bold text-yellow-600">{medicalStats.pending}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                <p className="text-sm text-green-600">已付款</p>
                <p className="text-3xl font-bold text-green-600">{medicalStats.paid}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200">
                <p className="text-sm text-blue-600">已確認</p>
                <p className="text-3xl font-bold text-blue-600">{medicalStats.confirmed}</p>
              </div>
            </div>

            {/* 筛选器 */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === 'all'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === key
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 订单列表 */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">載入中...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                <div className="text-gray-500">暫無訂單</div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">訂單編號</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">客戶</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">希望日期</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">建立時間</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => {
                        const displayPrice = order.total_amount_jpy || order.medical_packages?.price_jpy || 0;
                        return (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <span className="font-mono text-sm text-gray-900">
                                {order.order_number || `#${order.id.slice(-8).toUpperCase()}`}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{order.customer_snapshot?.name || '-'}</p>
                                <p className="text-sm text-gray-500">{order.customer_snapshot?.email || '-'}</p>
                                <p className="text-xs text-gray-400">{order.customer_snapshot?.phone || '-'}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-900">
                                {order.medical_packages?.name_zh_tw || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-medium text-gray-900">
                                ¥{displayPrice.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm">
                                <p className="text-gray-900">{order.preferred_date || '-'}</p>
                                <p className="text-gray-500">{formatTimeSlot(order.preferred_time)}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                STATUS_LABELS[order.status]?.color || 'bg-gray-100 text-gray-800'
                              }`}>
                                {STATUS_LABELS[order.status]?.label || order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {formatDateTime(order.created_at)}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                              >
                                查看詳情
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </>
      </main>

      {/* ============================================ */}
      {/* 醫療訂單詳情彈窗 */}
      {/* ============================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  訂單詳情
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 订单信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">訂單信息</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">訂單編號</span>
                    <span className="font-mono font-medium">{selectedOrder.order_number || `#${selectedOrder.id.slice(-8).toUpperCase()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">完整ID</span>
                    <span className="font-mono text-xs text-gray-400">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">套餐</span>
                    <span className="font-medium">{selectedOrder.medical_packages?.name_zh_tw || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">金額</span>
                    <span className="font-medium text-brand-600">
                      ¥{(selectedOrder.total_amount_jpy || selectedOrder.medical_packages?.price_jpy || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">訂單狀態</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      STATUS_LABELS[selectedOrder.status]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {STATUS_LABELS[selectedOrder.status]?.label || selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">付款狀態</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedOrder.paid_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.paid_at ? '已付款' : '待付款'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 客户信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">客戶信息</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">姓名</span>
                    <span className="font-medium">{selectedOrder.customer_snapshot?.name || '-'}</span>
                  </div>
                  {selectedOrder.customer_snapshot?.company && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">公司</span>
                      <span>{selectedOrder.customer_snapshot.company}</span>
                    </div>
                  )}
                  {selectedOrder.customer_snapshot?.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">郵箱</span>
                      <a href={`mailto:${selectedOrder.customer_snapshot.email}`} className="text-brand-600 hover:underline">
                        {selectedOrder.customer_snapshot.email}
                      </a>
                    </div>
                  )}
                  {selectedOrder.customer_snapshot?.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">電話</span>
                      <a href={`tel:${selectedOrder.customer_snapshot.phone}`} className="text-brand-600 hover:underline">
                        {selectedOrder.customer_snapshot.phone}
                      </a>
                    </div>
                  )}
                  {selectedOrder.customer_snapshot?.line && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">LINE</span>
                      <span className="font-mono">{selectedOrder.customer_snapshot.line}</span>
                    </div>
                  )}
                  {selectedOrder.customer_snapshot?.wechat && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">微信</span>
                      <span className="font-mono">{selectedOrder.customer_snapshot.wechat}</span>
                    </div>
                  )}
                  {selectedOrder.customer_snapshot?.whatsapp && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">WhatsApp</span>
                      <span className="font-mono">{selectedOrder.customer_snapshot.whatsapp}</span>
                    </div>
                  )}
                  {selectedOrder.referred_by_guide_slug && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">分銷來源</span>
                      <span className="font-mono text-orange-600">{selectedOrder.referred_by_guide_slug}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 预约信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">預約信息</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">希望日期</span>
                    <span>{selectedOrder.preferred_date || '未指定'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">希望時段</span>
                    <span>{formatTimeSlot(selectedOrder.preferred_time)}</span>
                  </div>
                  {selectedOrder.confirmed_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">確認時間</span>
                      <span className="text-green-600 font-medium">{formatDateTime(selectedOrder.confirmed_at)}</span>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div>
                      <span className="text-gray-600 block mb-1">備注</span>
                      <p className="text-gray-900 bg-white p-2 rounded border whitespace-pre-line">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 时间信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">時間記錄</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">建立時間</span>
                    <span>{formatDateTime(selectedOrder.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-3">更新狀態</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === 'paid' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium"
                    >
                      確認預約
                    </button>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      標記完成
                    </button>
                  )}
                  {['paid', 'confirmed', 'completed'].includes(selectedOrder.status) && (
                    <button
                      onClick={() => openRefundModal(selectedOrder.id)}
                      disabled={refunding}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
                    >
                      退款（Stripe）
                    </button>
                  )}
                  {['pending', 'paid', 'confirmed'].includes(selectedOrder.status) && (
                    <button
                      onClick={() => {
                        if (confirm('確定要取消此訂單嗎？')) {
                          updateOrderStatus(selectedOrder.id, 'cancelled');
                        }
                      }}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium"
                    >
                      取消訂單
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 退款确认 Modal */}
      {refundModal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">確認退款</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">退款金額</p>
              <p className="text-2xl font-bold text-red-600">¥{(refundModal.amount || 0).toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">退款原因（可選）</label>
              <textarea
                value={refundModal.reason}
                onChange={(e) => setRefundModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="例：客戶取消預約"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <p className="text-xs text-gray-400 mb-4">退款將通過 Stripe 退回客戶信用卡，處理需 5-10 個工作日。此操作不可撤銷。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setRefundModal({ visible: false, reason: '' })}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmRefund}
                disabled={refunding}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
              >
                {refunding ? '處理中...' : '確認退款'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
