'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import { User } from '@supabase/supabase-js';
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  LucideIcon
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount_jpy: number;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  customer_snapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  medical_packages: {
    name_zh_tw: string;
    slug: string;
  }[] | null;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: LucideIcon }> = {
  pending: { label: '待付款', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', icon: Clock },
  paid: { label: '已付款', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: CreditCard },
  confirmed: { label: '已確認', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200', icon: CheckCircle },
  completed: { label: '已完成', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
  refunded: { label: '已退款', color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200', icon: XCircle },
};

export default function MyOrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/my-orders');
          return;
        }
        setUser(user);

        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!customer) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            total_amount_jpy,
            preferred_date,
            preferred_time,
            notes,
            created_at,
            paid_at,
            customer_snapshot,
            medical_packages (
              name_zh_tw,
              slug
            )
          `)
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setError('無法載入訂單資料');
        } else {
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('發生錯誤，請稍後重試');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [supabase, router]);

  if (loading) {
    return (
      <MemberLayout showFooter={false}>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">載入訂單中...</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MemberLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="w-12 h-12 text-white" />
              <div>
                <span className="font-serif font-bold text-2xl tracking-wide">NIIJIMA</span>
                <p className="text-xs text-blue-200 uppercase tracking-widest">Medical Tourism</p>
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-6 leading-tight">
              我的訂單<br />
              <span className="text-blue-400">預約記錄</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-sm">
              查看您的所有健檢預約記錄，追蹤訂單狀態，隨時掌握行程安排。
            </p>
          </div>
        </div>

        {/* Right Side - Orders List */}
        <div className="w-full lg:w-3/5 bg-gray-50 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <Logo className="w-10 h-10 text-blue-600" />
              <span className="font-serif font-bold text-xl">NIIJIMA</span>
            </div>

            {/* Back Link */}
            <Link
              href="/my-account"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition"
            >
              <ArrowLeft size={16} />
              返回會員中心
            </Link>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900">我的訂單</h1>
                  <p className="text-gray-500 text-sm">查看您的所有健檢預約記錄</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">尚無訂單</h3>
                <p className="text-gray-500 mb-8">您還沒有任何健檢預約記錄</p>
                <Link
                  href="/?page=medical"
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
                >
                  <Package className="w-5 h-5" />
                  瀏覽健檢套餐
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon: LucideIcon = status.icon;
                  const orderDate = new Date(order.created_at).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const preferredDate = order.preferred_date
                    ? new Date(order.preferred_date).toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })
                    : '待確認';

                  const packageName = order.medical_packages?.[0]?.name_zh_tw || '健檢套餐';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">訂單編號</p>
                          <p className="font-mono font-bold text-gray-900">{order.order_number}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{packageName}</span>
                        </div>
                        {order.preferred_date && (
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-600 text-sm">
                              預約日期：{preferredDate}
                              {order.preferred_time && ` ${order.preferred_time}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                          <span className="text-sm text-gray-400">下單時間：{orderDate}</span>
                          <span className="text-xl font-bold text-blue-600">
                            ¥{order.total_amount_jpy?.toLocaleString() || '-'}
                          </span>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">備註：{order.notes}</p>
                        </div>
                      )}

                      {order.paid_at && (
                        <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          已於 {new Date(order.paid_at).toLocaleDateString('zh-TW')} 付款
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
