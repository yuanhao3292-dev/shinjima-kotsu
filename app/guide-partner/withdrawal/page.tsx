'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import {
  Wallet,
  X,
  Loader2,
  ArrowLeft,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Banknote,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations = {
  pageTitle: {
    ja: '出金申請',
    'zh-CN': '提现申请',
    'zh-TW': '提現申請',
    en: 'Withdrawal',
  },
  loading: {
    ja: '読み込み中...',
    'zh-CN': '加载中...',
    'zh-TW': '載入中...',
    en: 'Loading...',
  },
  backToCommission: {
    ja: '報酬精算に戻る',
    'zh-CN': '返回报酬结算',
    'zh-TW': '返回報酬結算',
    en: 'Back to Commission',
  },
  heading: {
    ja: '出金申請',
    'zh-CN': '提现申请',
    'zh-TW': '提現申請',
    en: 'Withdrawal Request',
  },
  subtitle: {
    ja: '出金可能残高をお客様の銀行口座に振り込み申請',
    'zh-CN': '申请将可提现余额汇款至您的银行账户',
    'zh-TW': '申請將可提現餘額匯款至您的銀行帳戶',
    en: 'Request to transfer your available balance to your bank account',
  },
  available: {
    ja: '出金可能',
    'zh-CN': '可提现',
    'zh-TW': '可提現',
    en: 'Available',
  },
  locked: {
    ja: 'ロック中',
    'zh-CN': '锁定中',
    'zh-TW': '鎖定中',
    en: 'Locked',
  },
  nearestUnlock: {
    ja: '最近の解除',
    'zh-CN': '最近解锁',
    'zh-TW': '最近解鎖',
    en: 'Next unlock',
  },
  processing: {
    ja: '処理中',
    'zh-CN': '处理中',
    'zh-TW': '處理中',
    en: 'Processing',
  },
  totalWithdrawn: {
    ja: '累計出金済み',
    'zh-CN': '累计已提现',
    'zh-TW': '累計已提現',
    en: 'Total Withdrawn',
  },
  applyWithdrawal: {
    ja: '出金を申請',
    'zh-CN': '申请提现',
    'zh-TW': '申請提現',
    en: 'Request Withdrawal',
  },
  bankIncomplete: {
    ja: '銀行口座情報が不完全です',
    'zh-CN': '银行账户资讯不完整',
    'zh-TW': '銀行帳戶資訊不完整',
    en: 'Bank account information is incomplete',
  },
  bankIncompleteDesc: {
    ja: 'アカウント設定で銀行情報を入力してから出金を申請してください',
    'zh-CN': '请先前往账户设置完善银行资讯后再申请提现',
    'zh-TW': '請先前往帳戶設置完善銀行資訊後再申請提現',
    en: 'Please complete your bank info in account settings before requesting a withdrawal',
  },
  goToSettings: {
    ja: '設定へ →',
    'zh-CN': '前往设置 →',
    'zh-TW': '前往設置 →',
    en: 'Go to Settings →',
  },
  pendingWithdrawal: {
    ja: '処理中の出金申請があります',
    'zh-CN': '您有正在处理中的提现申请',
    'zh-TW': '您有正在處理中的提現申請',
    en: 'You have a pending withdrawal request',
  },
  pendingWithdrawalDesc: {
    ja: '現在の申請が完了してから新しい申請を提出してください',
    'zh-CN': '请等待当前申请处理完成后再提交新的申请',
    'zh-TW': '請等待當前申請處理完成後再提交新的申請',
    en: 'Please wait for the current request to be processed before submitting a new one',
  },
  remitAccount: {
    ja: '振込口座',
    'zh-CN': '汇款账户',
    'zh-TW': '匯款帳戶',
    en: 'Remittance Account',
  },
  bankLabel: {
    ja: '銀行：',
    'zh-CN': '银行：',
    'zh-TW': '銀行：',
    en: 'Bank: ',
  },
  branchLabel: {
    ja: '支店：',
    'zh-CN': '支店：',
    'zh-TW': '支店：',
    en: 'Branch: ',
  },
  accountLabel: {
    ja: '口座番号：',
    'zh-CN': '账号：',
    'zh-TW': '帳號：',
    en: 'Account: ',
  },
  holderLabel: {
    ja: '名義人：',
    'zh-CN': '户名：',
    'zh-TW': '戶名：',
    en: 'Holder: ',
  },
  editBankInfo: {
    ja: '銀行情報を変更',
    'zh-CN': '修改银行资讯',
    'zh-TW': '修改銀行資訊',
    en: 'Edit bank info',
  },
  withdrawAmountLabel: {
    ja: '出金金額（日本円）',
    'zh-CN': '提现金额（日圆）',
    'zh-TW': '提現金額（日圓）',
    en: 'Withdrawal Amount (JPY)',
  },
  minAmountPlaceholder: {
    ja: '最低',
    'zh-CN': '最低',
    'zh-TW': '最低',
    en: 'Minimum',
  },
  minWithdrawal: {
    ja: '最低出金額',
    'zh-CN': '最低提现',
    'zh-TW': '最低提現',
    en: 'Minimum withdrawal',
  },
  withdrawAll: {
    ja: '全額出金',
    'zh-CN': '全部提现',
    'zh-TW': '全部提現',
    en: 'Withdraw all',
  },
  submitting: {
    ja: '送信中...',
    'zh-CN': '提交中...',
    'zh-TW': '提交中...',
    en: 'Submitting...',
  },
  submitWithdrawal: {
    ja: '出金申請を提出',
    'zh-CN': '提交提现申请',
    'zh-TW': '提交提現申請',
    en: 'Submit Withdrawal Request',
  },
  submitNote: {
    ja: '送信後、財務が7営業日以内にお客様の銀行口座に振り込みます',
    'zh-CN': '提交后，财务将在 7 个工作日内汇款至您的银行账户',
    'zh-TW': '提交後，財務將在 7 個工作日內匯款至您的銀行帳戶',
    en: 'After submission, funds will be transferred to your bank account within 7 business days',
  },
  withdrawalHistory: {
    ja: '出金履歴',
    'zh-CN': '提现记录',
    'zh-TW': '提現記錄',
    en: 'Withdrawal History',
  },
  noWithdrawals: {
    ja: '出金履歴なし',
    'zh-CN': '暂无提现记录',
    'zh-TW': '暫無提現記錄',
    en: 'No withdrawal records',
  },
  applicationDate: {
    ja: '申請',
    'zh-CN': '申请',
    'zh-TW': '申請',
    en: 'Applied',
  },
  reviewDate: {
    ja: '審査',
    'zh-CN': '审核',
    'zh-TW': '審核',
    en: 'Reviewed',
  },
  paidDate: {
    ja: '入金',
    'zh-CN': '到账',
    'zh-TW': '到帳',
    en: 'Paid',
  },
  referenceLabel: {
    ja: '証憑',
    'zh-CN': '凭证',
    'zh-TW': '凭證',
    en: 'Ref',
  },
  rejectionReason: {
    ja: '却下理由：',
    'zh-CN': '拒绝原因：',
    'zh-TW': '拒絕原因：',
    en: 'Rejection reason: ',
  },
  cancelling: {
    ja: 'キャンセル中...',
    'zh-CN': '取消中...',
    'zh-TW': '取消中...',
    en: 'Cancelling...',
  },
  cancelRequest: {
    ja: '申請をキャンセル',
    'zh-CN': '取消申请',
    'zh-TW': '取消申請',
    en: 'Cancel Request',
  },
  // Status labels
  statusPending: {
    ja: '審査待ち',
    'zh-CN': '待审核',
    'zh-TW': '待審核',
    en: 'Pending',
  },
  statusApproved: {
    ja: '承認済み',
    'zh-CN': '已批准',
    'zh-TW': '已批准',
    en: 'Approved',
  },
  statusProcessing: {
    ja: '処理中',
    'zh-CN': '处理中',
    'zh-TW': '處理中',
    en: 'Processing',
  },
  statusCompleted: {
    ja: '完了',
    'zh-CN': '已完成',
    'zh-TW': '已完成',
    en: 'Completed',
  },
  statusRejected: {
    ja: '却下',
    'zh-CN': '已拒绝',
    'zh-TW': '已拒絕',
    en: 'Rejected',
  },
  statusCancelled: {
    ja: 'キャンセル済み',
    'zh-CN': '已取消',
    'zh-TW': '已取消',
    en: 'Cancelled',
  },
  // Error messages
  errorLoadFailed: {
    ja: 'データの読み込みに失敗しました。ページを更新してください',
    'zh-CN': '加载资料失败，请重新刷新页面',
    'zh-TW': '載入資料失敗，請重新整理頁面',
    en: 'Failed to load data. Please refresh the page',
  },
  errorMinAmount: {
    ja: '最低出金額は',
    'zh-CN': '最低提现金额为',
    'zh-TW': '最低提現金額為',
    en: 'Minimum withdrawal amount is',
  },
  errorExceedBalance: {
    ja: '出金金額が出金可能残高を超えています',
    'zh-CN': '提现金额超过可提现余额',
    'zh-TW': '提現金額超過可提現餘額',
    en: 'Withdrawal amount exceeds available balance',
  },
  errorWithdrawFailed: {
    ja: '出金申請に失敗しました。後ほど再度お試しください',
    'zh-CN': '提现申请失败，请稍后重试',
    'zh-TW': '提現申請失敗，請稍後重試',
    en: 'Withdrawal request failed. Please try again later',
  },
  successSubmitted: {
    ja: '出金申請が送信されました。財務が7営業日以内にお客様の銀行口座に振り込みます',
    'zh-CN': '提现申请已提交，财务将在 7 个工作日内汇款到您的银行账户',
    'zh-TW': '提現申請已提交，財務將在 7 個工作日內匯款到您的銀行帳戶',
    en: 'Withdrawal request submitted. Funds will be transferred within 7 business days',
  },
  confirmCancel: {
    ja: 'この出金申請をキャンセルしてもよろしいですか？',
    'zh-CN': '确定要取消此提现申请吗？',
    'zh-TW': '確定要取消此提現申請嗎？',
    en: 'Are you sure you want to cancel this withdrawal request?',
  },
  errorCancelFailed: {
    ja: 'キャンセルに失敗しました',
    'zh-CN': '取消失败',
    'zh-TW': '取消失敗',
    en: 'Cancel failed',
  },
  errorCancelRetry: {
    ja: 'キャンセルに失敗しました。後ほど再度お試しください',
    'zh-CN': '取消失败，请稍后重试',
    'zh-TW': '取消失敗，請稍後重試',
    en: 'Cancel failed. Please try again later',
  },
  successCancelled: {
    ja: '出金申請がキャンセルされ、残高が復元されました',
    'zh-CN': '提现申请已取消，余额已退还',
    'zh-TW': '提現申請已取消，餘額已退還',
    en: 'Withdrawal request cancelled. Balance has been restored',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

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

const dateLocaleMap: Record<Language, string> = { ja: 'ja-JP', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US' };

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
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: t('statusPending', lang), color: 'text-yellow-700', bg: 'bg-yellow-100' },
    approved: { label: t('statusApproved', lang), color: 'text-blue-700', bg: 'bg-blue-100' },
    processing: { label: t('statusProcessing', lang), color: 'text-indigo-700', bg: 'bg-indigo-100' },
    completed: { label: t('statusCompleted', lang), color: 'text-green-700', bg: 'bg-green-100' },
    rejected: { label: t('statusRejected', lang), color: 'text-red-700', bg: 'bg-red-100' },
    cancelled: { label: t('statusCancelled', lang), color: 'text-gray-700', bg: 'bg-gray-100' },
  };

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
        throw new Error('Load failed');
      }

      const data = await res.json();
      setBalance(data.balance);
      setBankInfo(data.bankInfo);
      setWithdrawals(data.withdrawals || []);
      setMinAmount(data.minAmount || 5000);
    } catch {
      setError(t('errorLoadFailed', lang));
    } finally {
      setLoading(false);
    }
  }, [router, supabase.auth, lang]);

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
      setError(`${t('errorMinAmount', lang)} ¥${minAmount.toLocaleString()}`);
      return;
    }

    if (numAmount > (balance?.available || 0)) {
      setError(t('errorExceedBalance', lang));
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
        setError(data.error?.message || data.error || t('errorWithdrawFailed', lang));
        return;
      }

      setSuccess(t('successSubmitted', lang));
      setAmount('');
      await loadData();
    } catch {
      setError(t('errorWithdrawFailed', lang));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm(t('confirmCancel', lang))) return;

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
        setError(data.error?.message || t('errorCancelFailed', lang));
        return;
      }

      setSuccess(t('successCancelled', lang));
      await loadData();
    } catch {
      setError(t('errorCancelRetry', lang));
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/guide-partner/commission" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-900 mb-2">
              <ArrowLeft size={16} />
              {t('backToCommission', lang)}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('heading', lang)}</h1>
            <p className="text-gray-500 mt-1">{t('subtitle', lang)}</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={18} />
                <span className="text-sm opacity-90">{t('available', lang)}</span>
              </div>
              <p className="text-2xl font-bold">¥{(balance?.available || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={18} className="text-gray-400" />
                <span className="text-sm text-gray-500">{t('locked', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(balance?.locked || 0).toLocaleString()}</p>
              {balance?.nearestUnlockDate && (
                <p className="text-xs text-gray-400 mt-1">
                  {t('nearestUnlock', lang)}: {new Date(balance.nearestUnlockDate).toLocaleDateString(dateLocaleMap[lang])}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-yellow-500" />
                <span className="text-sm text-gray-500">{t('processing', lang)}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">¥{(balance?.pending || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-center gap-2 mb-2">
                <Banknote size={18} className="text-blue-500" />
                <span className="text-sm text-gray-500">{t('totalWithdrawn', lang)}</span>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('applyWithdrawal', lang)}</h2>

            {!bankInfoComplete ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-medium">{t('bankIncomplete', lang)}</p>
                    <p className="text-yellow-700 text-sm mt-1">{t('bankIncompleteDesc', lang)}</p>
                    <Link href="/guide-partner/settings" className="inline-block mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium">
                      {t('goToSettings', lang)}
                    </Link>
                  </div>
                </div>
              </div>
            ) : hasPendingWithdrawal ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium">{t('pendingWithdrawal', lang)}</p>
                    <p className="text-blue-700 text-sm mt-1">{t('pendingWithdrawalDesc', lang)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Bank Info Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">{t('remitAccount', lang)}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">{t('bankLabel', lang)}</span>
                      <span className="text-gray-700">{bankInfo?.bankName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('branchLabel', lang)}</span>
                      <span className="text-gray-700">{bankInfo?.bankBranch || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('accountLabel', lang)}</span>
                      <span className="text-gray-700">{bankInfo?.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('holderLabel', lang)}</span>
                      <span className="text-gray-700">{bankInfo?.accountHolder}</span>
                    </div>
                  </div>
                  <Link href="/guide-partner/settings" className="text-xs text-brand-600 hover:text-brand-700 mt-2 inline-block">
                    {t('editBankInfo', lang)}
                  </Link>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('withdrawAmountLabel', lang)}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">¥</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`${t('minAmountPlaceholder', lang)} ${minAmount.toLocaleString()}`}
                      min={minAmount}
                      max={balance?.available || 0}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">{t('minWithdrawal', lang)} ¥{minAmount.toLocaleString()}</p>
                    <button
                      onClick={() => setAmount(String(balance?.available || 0))}
                      className="text-xs text-brand-600 hover:text-brand-700"
                    >
                      {t('withdrawAll', lang)}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !amount}
                  className="w-full py-3 bg-brand-700 text-white rounded-lg font-medium hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t('submitting', lang)}
                    </>
                  ) : (
                    t('submitWithdrawal', lang)
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  {t('submitNote', lang)}
                </p>
              </>
            )}
          </div>

          {/* Withdrawal History */}
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">{t('withdrawalHistory', lang)}</h2>
            </div>

            {withdrawals.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Banknote size={40} className="mx-auto mb-3 opacity-30" />
                <p>{t('noWithdrawals', lang)}</p>
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
                        <span>{t('applicationDate', lang)}: {new Date(w.created_at).toLocaleDateString(dateLocaleMap[lang])}</span>
                        {w.reviewed_at && (
                          <span>{t('reviewDate', lang)}: {new Date(w.reviewed_at).toLocaleDateString(dateLocaleMap[lang])}</span>
                        )}
                        {w.paid_at && (
                          <span>{t('paidDate', lang)}: {new Date(w.paid_at).toLocaleDateString(dateLocaleMap[lang])}</span>
                        )}
                        {w.payment_reference && (
                          <span>{t('referenceLabel', lang)}: {w.payment_reference}</span>
                        )}
                      </div>

                      {w.status === 'rejected' && w.review_note && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                          {t('rejectionReason', lang)}{w.review_note}
                        </div>
                      )}

                      {w.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(w.id)}
                          disabled={cancelling === w.id}
                          className="mt-2 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          {cancelling === w.id ? t('cancelling', lang) : t('cancelRequest', lang)}
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
