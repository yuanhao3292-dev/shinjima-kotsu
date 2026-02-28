'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  Store,
  Calendar,
  Wallet,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  ArrowLeft,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Banknote,
  Headphones,
} from 'lucide-react';

interface BalanceInfo {
  available: number;
  totalEarned: number;
  totalWithdrawn: number;
  pending: number;
  locked: number;
  nearestUnlockDate: string | null;
}

interface BankInfo {
  bankName: string | null;
  bankBranch: string | null;
  accountType: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  status: string;
  review_note: string | null;
  payment_reference: string | null;
  created_at: string;
  reviewed_at: string | null;
  paid_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: '待審核', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  approved: { label: '已批准', color: 'text-blue-700', bg: 'bg-blue-100' },
  processing: { label: '處理中', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  completed: { label: '已完成', color: 'text-green-700', bg: 'bg-green-100' },
  rejected: { label: '已拒絕', color: 'text-red-700', bg: 'bg-red-100' },
  cancelled: { label: '已取消', color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function WithdrawalPage() {
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [minAmount, setMinAmount] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/guide-partner/login');
        return;
      }

      const res = await fetch('/api/withdrawal', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/guide-partner/login');
          return;
        }
        throw new Error('載入失敗');
      }

      const data = await res.json();
      setBalance(data.balance);
      setBankInfo(data.bankInfo);
      setWithdrawals(data.withdrawals || []);
      setMinAmount(data.minAmount || 5000);
    } catch {
      setError('載入資料失敗，請重新整理頁面');
    } finally {
      setLoading(false);
    }
  }, [router, supabase.auth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasPendingWithdrawal = withdrawals.some(w =>
    ['pending', 'approved', 'processing'].includes(w.status)
  );

  const bankInfoComplete = bankInfo?.bankName && bankInfo?.accountNumber && bankInfo?.accountHolder;

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    const numAmount = parseInt(amount, 10);

    if (!numAmount || numAmount < minAmount) {
      setError(`最低提現金額為 ¥${minAmount.toLocaleString()}`);
      return;
    }

    if (numAmount > (balance?.available || 0)) {
      setError('提現金額超過可提現餘額');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount: numAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || data.error || '提現申請失敗');
        return;
      }

      setSuccess('提現申請已提交，財務將在 7 個工作日內匯款到您的銀行帳戶');
      setAmount('');
      await loadData();
    } catch {
      setError('提現申請失敗，請稍後重試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('確定要取消此提現申請嗎？')) return;

    setCancelling(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/withdrawal?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || '取消失敗');
        return;
      }

      setSuccess('提現申請已取消，餘額已退還');
      await loadData();
    } catch {
      setError('取消失敗，請稍後重試');
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/guide-partner/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: '控制台', href: '/guide-partner/dashboard' },
    { icon: Store, label: '店舖列表', href: '/guide-partner/venues' },
    { icon: Calendar, label: '我的預約', href: '/guide-partner/bookings' },
    { icon: Wallet, label: '報酬結算', href: '/guide-partner/commission' },
    { icon: Users, label: '我的推薦', href: '/guide-partner/referrals' },
    { icon: Headphones, label: '客服支援', href: '/guide-partner/support' },
    { icon: Settings, label: '帳戶設置', href: '/guide-partner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-orange-600" />
          <span className="font-bold">提現申請</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <Logo className="w-8 h-8 text-orange-600" />
          <div>
            <span className="font-bold text-gray-900">NIIJIMA</span>
            <p className="text-xs text-gray-500">Guide Partner</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${item.href === '/guide-partner/commission'
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>退出登入</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/guide-partner/commission" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
              <ArrowLeft size={16} />
              返回報酬結算
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">提現申請</h1>
            <p className="text-gray-500 mt-1">申請將可提現餘額匯款至您的銀行帳戶</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={18} />
                <span className="text-sm opacity-90">可提現</span>
              </div>
              <p className="text-2xl font-bold">¥{(balance?.available || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={18} className="text-gray-400" />
                <span className="text-sm text-gray-500">鎖定中</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(balance?.locked || 0).toLocaleString()}</p>
              {balance?.nearestUnlockDate && (
                <p className="text-xs text-gray-400 mt-1">
                  最近解鎖: {new Date(balance.nearestUnlockDate).toLocaleDateString('zh-TW')}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-yellow-500" />
                <span className="text-sm text-gray-500">處理中</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(balance?.pending || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-center gap-2 mb-2">
                <Banknote size={18} className="text-blue-500" />
                <span className="text-sm text-gray-500">累計已提現</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(balance?.totalWithdrawn || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                <X size={16} />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 size={20} className="text-green-500 mt-0.5 shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
              <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-600">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Withdrawal Form */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">申請提現</h2>

            {!bankInfoComplete ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-medium">銀行帳戶資訊不完整</p>
                    <p className="text-yellow-700 text-sm mt-1">請先前往帳戶設置完善銀行資訊後再申請提現</p>
                    <Link href="/guide-partner/settings" className="inline-block mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
                      前往設置 →
                    </Link>
                  </div>
                </div>
              </div>
            ) : hasPendingWithdrawal ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium">您有正在處理中的提現申請</p>
                    <p className="text-blue-700 text-sm mt-1">請等待當前申請處理完成後再提交新的申請</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Bank Info Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">匯款帳戶</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">銀行：</span>
                      <span className="text-gray-700">{bankInfo?.bankName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">支店：</span>
                      <span className="text-gray-700">{bankInfo?.bankBranch || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">帳號：</span>
                      <span className="text-gray-700">{bankInfo?.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">戶名：</span>
                      <span className="text-gray-700">{bankInfo?.accountHolder}</span>
                    </div>
                  </div>
                  <Link href="/guide-partner/settings" className="text-xs text-orange-600 hover:text-orange-700 mt-2 inline-block">
                    修改銀行資訊
                  </Link>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">提現金額（日圓）</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">¥</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`最低 ${minAmount.toLocaleString()}`}
                      min={minAmount}
                      max={balance?.available || 0}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">最低提現 ¥{minAmount.toLocaleString()}</p>
                    <button
                      onClick={() => setAmount(String(balance?.available || 0))}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      全部提現
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !amount}
                  className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      提交中...
                    </>
                  ) : (
                    '提交提現申請'
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  提交後，財務將在 7 個工作日內匯款至您的銀行帳戶
                </p>
              </>
            )}
          </div>

          {/* Withdrawal History */}
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">提現記錄</h2>
            </div>

            {withdrawals.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Banknote size={40} className="mx-auto mb-3 opacity-30" />
                <p>暫無提現記錄</p>
              </div>
            ) : (
              <div className="divide-y">
                {withdrawals.map((w) => {
                  const status = STATUS_CONFIG[w.status] || STATUS_CONFIG.pending;
                  return (
                    <div key={w.id} className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-bold text-gray-900">¥{Number(w.amount).toLocaleString()}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span>申請: {new Date(w.created_at).toLocaleDateString('zh-TW')}</span>
                        {w.reviewed_at && (
                          <span>審核: {new Date(w.reviewed_at).toLocaleDateString('zh-TW')}</span>
                        )}
                        {w.paid_at && (
                          <span>到帳: {new Date(w.paid_at).toLocaleDateString('zh-TW')}</span>
                        )}
                        {w.payment_reference && (
                          <span>凭證: {w.payment_reference}</span>
                        )}
                      </div>

                      {w.status === 'rejected' && w.review_note && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                          拒絕原因：{w.review_note}
                        </div>
                      )}

                      {w.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(w.id)}
                          disabled={cancelling === w.id}
                          className="mt-2 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          {cancelling === w.id ? '取消中...' : '取消申請'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
