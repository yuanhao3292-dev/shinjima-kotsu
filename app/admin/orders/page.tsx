'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number | null;
  preferred_date: string | null;
  preferred_time: string | null;
  special_requests: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  confirmed_date: string | null;
  confirmed_time: string | null;
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
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let query = supabase
        .from('medical_orders')
        .select(`
          id,
          created_at,
          status,
          payment_status,
          total_amount,
          preferred_date,
          preferred_time,
          special_requests,
          customer_name,
          customer_email,
          customer_phone,
          confirmed_date,
          confirmed_time,
          medical_packages (
            name_zh_tw,
            slug,
            price_jpy
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders((data as unknown as Order[]) || []);
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('medical_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // 刷新订单列表
      fetchOrders();
      setSelectedOrder(null);
      alert('訂單狀態已更新');
    } catch (error) {
      console.error('更新订单状态失败:', error);
      alert('更新失敗');
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeSlot = (time: string | null) => {
    if (!time) return '-';
    return time === 'morning' ? '上午' : time === 'afternoon' ? '下午' : time;
  };

  // 统计数据
  const stats = {
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
            <p className="text-sm text-gray-500">TIMC 體檢預約後台</p>
          </div>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            ← 返回首頁
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-sm text-gray-500">總訂單</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
            <p className="text-sm text-yellow-600">待付款</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
            <p className="text-sm text-green-600">已付款</p>
            <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200">
            <p className="text-sm text-blue-600">已確認</p>
            <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
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
                    ? 'bg-indigo-600 text-white'
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
                    const displayPrice = order.total_amount || order.medical_packages?.price_jpy || 0;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className="font-mono text-sm text-gray-900">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                            <p className="text-xs text-gray-400">{order.customer_phone || '-'}</p>
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
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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
      </main>

      {/* 订单详情弹窗 */}
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
                    <span className="font-mono font-medium">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
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
                    <span className="font-medium text-indigo-600">
                      ¥{(selectedOrder.total_amount || selectedOrder.medical_packages?.price_jpy || 0).toLocaleString()}
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
                      selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.payment_status === 'paid' ? '已付款' : '待付款'}
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
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">郵箱</span>
                    <a href={`mailto:${selectedOrder.customer_email}`} className="text-indigo-600 hover:underline">
                      {selectedOrder.customer_email}
                    </a>
                  </div>
                  {selectedOrder.customer_phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">電話</span>
                      <a href={`tel:${selectedOrder.customer_phone}`} className="text-indigo-600 hover:underline">
                        {selectedOrder.customer_phone}
                      </a>
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
                  {selectedOrder.confirmed_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">確認日期</span>
                      <span className="text-green-600 font-medium">{selectedOrder.confirmed_date}</span>
                    </div>
                  )}
                  {selectedOrder.special_requests && (
                    <div>
                      <span className="text-gray-600 block mb-1">特殊要求</span>
                      <p className="text-gray-900 bg-white p-2 rounded border">{selectedOrder.special_requests}</p>
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
                    <span>{formatDate(selectedOrder.created_at)}</span>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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
    </div>
  );
}
