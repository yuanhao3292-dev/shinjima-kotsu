'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  Shield,
  Users,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  LogOut,
  ChevronRight,
  Eye,
  MessageSquare,
  AlertTriangle,
  Wallet,
  BanknoteIcon,
  Send
} from 'lucide-react';

interface KYCItem {
  id: string;
  name: string;
  email: string;
  kyc_status: string;
  id_document_type: string;
  legal_name: string;
  nationality: string;
  kyc_submitted_at: string;
}

interface Ticket {
  id: string;
  ticket_type: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  guide: {
    id: string;
    name: string;
    email: string;
  };
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
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
  pendingKYC: number;
  openTickets: number;
  inProgressTickets: number;
  pendingWithdrawals: number;
  pendingWithdrawalAmount: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingKYC, setPendingKYC] = useState<KYCItem[]>([]);
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<Stats>({
    pendingKYC: 0,
    openTickets: 0,
    inProgressTickets: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
  });
  const [activeTab, setActiveTab] = useState<'kyc' | 'tickets' | 'withdrawals'>('kyc');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        router.push('/login');
        return;
      }

      // 检查是否是管理员（通过环境变量配置的邮箱）
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
      if (!adminEmails.includes(user.email.toLowerCase())) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // 加载数据
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push('/login');
        return;
      }

      // 获取待审核 KYC
      const kycResponse = await fetch('/api/admin/kyc?status=submitted', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (kycResponse.ok) {
        const kycData = await kycResponse.json();
        setPendingKYC(kycData.guides || []);
        setStats(prev => ({ ...prev, pendingKYC: kycData.guides?.length || 0 }));
      }

      // 获取工单
      const ticketsResponse = await fetch('/api/admin/tickets', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json();
        setOpenTickets(ticketsData.tickets || []);
        setStats(prev => ({
          ...prev,
          openTickets: ticketsData.stats?.open || 0,
          inProgressTickets: ticketsData.stats?.in_progress || 0,
        }));
      }

      // 获取提现申请
      const withdrawalsResponse = await fetch('/api/admin/withdrawals?status=pending', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (withdrawalsResponse.ok) {
        const withdrawalsData = await withdrawalsResponse.json();
        setWithdrawals(withdrawalsData.withdrawals || []);
        setStats(prev => ({
          ...prev,
          pendingWithdrawals: withdrawalsData.stats?.pending?.count || 0,
          pendingWithdrawalAmount: withdrawalsData.stats?.pending?.amount || 0,
        }));
      }

    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKYCAction = async (guideId: string, action: 'approve' | 'reject') => {
    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          guideId,
          action,
          reviewNote,
        }),
      });

      if (response.ok) {
        // 重新加载数据
        await checkAdminAndLoad();
        setSelectedItem(null);
        setReviewNote('');
      }
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdrawalAction = async (
    withdrawalId: string,
    action: 'approve' | 'reject' | 'complete'
  ) => {
    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          withdrawalId,
          action,
          reviewNote,
          paymentReference: paymentRef,
        }),
      });

      if (response.ok) {
        await checkAdminAndLoad();
        setSelectedItem(null);
        setReviewNote('');
        setPaymentRef('');
      } else {
        const data = await response.json();
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTicketTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      commission_dispute: '佣金纠纷',
      order_issue: '订单问题',
      payment_issue: '支付问题',
      technical_issue: '技术问题',
      suggestion: '建议反馈',
      other: '其他',
    };
    return labels[type] || type;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    const labels: Record<string, string> = {
      low: '低',
      normal: '普通',
      high: '高',
      urgent: '紧急',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[priority] || styles.normal}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">无访问权限</h1>
          <p className="text-gray-500 mb-4">您没有管理员权限</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-blue-600" />
            <div>
              <span className="font-bold text-gray-900">NIIJIMA</span>
              <span className="text-xs text-gray-500 ml-2">Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <LogOut size={18} />
            <span>退出</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</p>
                <p className="text-sm text-gray-500">待审核 KYC</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.openTickets}</p>
                <p className="text-sm text-gray-500">待处理工单</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressTickets}</p>
                <p className="text-sm text-gray-500">处理中工单</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingWithdrawals}</p>
                <p className="text-sm text-gray-500">待处理提现</p>
                {stats.pendingWithdrawalAmount > 0 && (
                  <p className="text-xs text-green-600">¥{stats.pendingWithdrawalAmount.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              activeTab === 'kyc'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:border-blue-300'
            }`}
          >
            <Shield className="inline w-5 h-5 mr-2" />
            KYC 审核
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              activeTab === 'tickets'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:border-blue-300'
            }`}
          >
            <Ticket className="inline w-5 h-5 mr-2" />
            工单管理
          </button>
        </div>

        {/* Content */}
        {activeTab === 'kyc' && (
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">待审核 KYC</h2>
            </div>
            {pendingKYC.length > 0 ? (
              <div className="divide-y">
                {pendingKYC.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>证件类型: {item.id_document_type}</span>
                          <span>证件姓名: {item.legal_name}</span>
                          <span>国籍: {item.nationality}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          提交时间: {formatDate(item.kyc_submitted_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="审核备注（可选）"
                              value={reviewNote}
                              onChange={(e) => setReviewNote(e.target.value)}
                              className="px-3 py-2 border rounded-lg text-sm w-48"
                            />
                            <button
                              onClick={() => handleKYCAction(item.id, 'approve')}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                            >
                              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '通过'}
                            </button>
                            <button
                              onClick={() => handleKYCAction(item.id, 'reject')}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                              拒绝
                            </button>
                            <button
                              onClick={() => { setSelectedItem(null); setReviewNote(''); }}
                              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm"
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedItem(item.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            <Eye size={16} />
                            审核
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>暂无待审核的 KYC</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">工单列表</h2>
            </div>
            {openTickets.length > 0 ? (
              <div className="divide-y">
                {openTickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-gray-900">{ticket.subject}</p>
                          {getPriorityBadge(ticket.priority)}
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-600' :
                            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {ticket.status === 'open' ? '待处理' :
                             ticket.status === 'in_progress' ? '处理中' :
                             ticket.status === 'resolved' ? '已解决' : '已关闭'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {getTicketTypeLabel(ticket.ticket_type)} · {ticket.guide?.name} ({ticket.guide?.email})
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          创建时间: {formatDate(ticket.created_at)}
                        </p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600">
                        <MessageSquare size={16} />
                        查看详情
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>暂无工单</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
