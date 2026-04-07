'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import {
  X,
  HeadphonesIcon,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  Send
} from 'lucide-react';

interface Ticket {
  id: string;
  ticket_type: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolution_note: string | null;
}

interface TicketReply {
  id: string;
  reply_by: string;
  is_staff: boolean;
  content: string;
  created_at: string;
}

const translations = {
  pageTitle: {
    ja: 'サポート',
    'zh-CN': '客服支持',
    'zh-TW': '客服支持',
    en: 'Support',
    ko: '지원',
  },
  helpAndSupport: {
    ja: 'ヘルプとサポート',
    'zh-CN': '帮助与支持',
    'zh-TW': '幫助與支持',
    en: 'Help & Support',
    ko: '도움말 및 지원',
  },
  submitTicketHint: {
    ja: '問題チケットを送信してください。48時間以内に返信いたします',
    'zh-CN': '提交问题工单，我们将在 48 小时内回复',
    'zh-TW': '提交問題工單，我們將在 48 小時內回覆',
    en: 'Submit a ticket and we will respond within 48 hours',
    ko: '문의 티켓을 제출해 주시면 48시간 이내에 답변드리겠습니다',
  },
  newTicket: {
    ja: '新規チケット',
    'zh-CN': '新建工单',
    'zh-TW': '新建工單',
    en: 'New Ticket',
    ko: '새 티켓',
  },
  slaTitle: {
    ja: 'サービスレベル契約 (SLA)',
    'zh-CN': '服务等级承诺 (SLA)',
    'zh-TW': '服務等級承諾 (SLA)',
    en: 'Service Level Agreement (SLA)',
    ko: '서비스 수준 협약 (SLA)',
  },
  slaNormal: {
    ja: '通常の問題：48時間以内に初回返信',
    'zh-CN': '普通问题：48 小时内首次回复',
    'zh-TW': '普通問題：48 小時內首次回覆',
    en: 'Standard issues: first response within 48 hours',
    ko: '일반 문의: 48시간 이내 첫 응답',
  },
  slaUrgent: {
    ja: '緊急の問題：24時間以内に初回返信',
    'zh-CN': '紧急问题：24 小时内首次回复',
    'zh-TW': '緊急問題：24 小時內首次回覆',
    en: 'Urgent issues: first response within 24 hours',
    ko: '긴급 문의: 24시간 이내 첫 응답',
  },
  slaDispute: {
    ja: '報酬紛争：72時間以内に処理完了',
    'zh-CN': '报酬纠纷：72 小时内处理完成',
    'zh-TW': '報酬糾紛：72 小時內處理完成',
    en: 'Commission disputes: resolved within 72 hours',
    ko: '커미션 분쟁: 72시간 이내 처리 완료',
  },
  myTickets: {
    ja: 'マイチケット',
    'zh-CN': '我的工单',
    'zh-TW': '我的工單',
    en: 'My Tickets',
    ko: '내 티켓',
  },
  noTickets: {
    ja: 'チケットの記録がありません',
    'zh-CN': '暂无工单记录',
    'zh-TW': '暫無工單記錄',
    en: 'No tickets yet',
    ko: '티켓 기록이 없습니다',
  },
  noTicketsHint: {
    ja: '「新規チケット」をクリックして問題を送信してください',
    'zh-CN': '点击「新建工单」提交您的问题',
    'zh-TW': '點擊「新建工單」提交您的問題',
    en: 'Click "New Ticket" to submit your issue',
    ko: '"새 티켓"을 클릭하여 문의를 제출하세요',
  },
  selectTicket: {
    ja: 'チケットを選択して詳細を表示',
    'zh-CN': '选择一个工单查看详情',
    'zh-TW': '選擇一個工單查看詳情',
    en: 'Select a ticket to view details',
    ko: '티켓을 선택하여 상세 내용을 확인하세요',
  },
  meLabel: {
    ja: '私',
    'zh-CN': '我',
    'zh-TW': '我',
    en: 'Me',
    ko: '나',
  },
  staffLabel: {
    ja: 'CS',
    'zh-CN': '客',
    'zh-TW': '客',
    en: 'CS',
    ko: 'CS',
  },
  staffName: {
    ja: 'カスタマーサポート',
    'zh-CN': '客服',
    'zh-TW': '客服',
    en: 'Customer Support',
    ko: '고객 지원',
  },
  resolutionNote: {
    ja: '解決方法',
    'zh-CN': '解决方案',
    'zh-TW': '解決方案',
    en: 'Resolution',
    ko: '해결 방안',
  },
  replyPlaceholder: {
    ja: '返信内容を入力...',
    'zh-CN': '输入回复内容...',
    'zh-TW': '輸入回覆內容...',
    en: 'Type your reply...',
    ko: '답변 내용을 입력하세요...',
  },
  newTicketTitle: {
    ja: '新規チケット',
    'zh-CN': '新建工单',
    'zh-TW': '新建工單',
    en: 'New Ticket',
    ko: '새 티켓',
  },
  ticketTypeLabel: {
    ja: '問題の種類',
    'zh-CN': '问题类型',
    'zh-TW': '問題類型',
    en: 'Issue Type',
    ko: '문의 유형',
  },
  priorityLabel: {
    ja: '優先度',
    'zh-CN': '优先级',
    'zh-TW': '優先級',
    en: 'Priority',
    ko: '우선순위',
  },
  priorityLow: {
    ja: '低 - 一般的なお問い合わせ',
    'zh-CN': '低 - 一般咨询',
    'zh-TW': '低 - 一般諮詢',
    en: 'Low - General inquiry',
    ko: '낮음 - 일반 문의',
  },
  priorityNormal: {
    ja: '普通 - サポートが必要',
    'zh-CN': '普通 - 需要帮助',
    'zh-TW': '普通 - 需要幫助',
    en: 'Normal - Need help',
    ko: '보통 - 도움 필요',
  },
  priorityHigh: {
    ja: '高 - 使用に影響あり',
    'zh-CN': '高 - 影响使用',
    'zh-TW': '高 - 影響使用',
    en: 'High - Affecting usage',
    ko: '높음 - 사용에 영향',
  },
  priorityUrgent: {
    ja: '緊急 - 重大な問題',
    'zh-CN': '紧急 - 严重问题',
    'zh-TW': '緊急 - 嚴重問題',
    en: 'Urgent - Critical issue',
    ko: '긴급 - 심각한 문제',
  },
  subjectLabel: {
    ja: '問題のタイトル',
    'zh-CN': '问题标题',
    'zh-TW': '問題標題',
    en: 'Subject',
    ko: '제목',
  },
  subjectPlaceholder: {
    ja: '問題を簡潔に説明してください',
    'zh-CN': '简要描述您的问题',
    'zh-TW': '簡要描述您的問題',
    en: 'Briefly describe your issue',
    ko: '문의 내용을 간략히 설명해 주세요',
  },
  descriptionLabel: {
    ja: '詳細な説明',
    'zh-CN': '详细描述',
    'zh-TW': '詳細描述',
    en: 'Description',
    ko: '상세 설명',
  },
  descriptionPlaceholder: {
    ja: '遭遇した問題を詳しく説明してください：\n- 発生日時\n- 関連する注文番号（もしあれば）\n- ご希望の解決方法',
    'zh-CN': '请详细描述您遇到的问题，包括：\n- 发生时间\n- 相关订单号（如有）\n- 期望的解决方案',
    'zh-TW': '請詳細描述您遇到的問題，包括：\n- 發生時間\n- 相關訂單號（如有）\n- 期望的解決方案',
    en: 'Please describe your issue in detail, including:\n- When it occurred\n- Related order number (if any)\n- Expected resolution',
    ko: '겪고 계신 문제를 자세히 설명해 주세요:\n- 발생 시간\n- 관련 주문번호 (있는 경우)\n- 원하시는 해결 방안',
  },
  cancelBtn: {
    ja: 'キャンセル',
    'zh-CN': '取消',
    'zh-TW': '取消',
    en: 'Cancel',
    ko: '취소',
  },
  submittingBtn: {
    ja: '送信中...',
    'zh-CN': '提交中...',
    'zh-TW': '提交中...',
    en: 'Submitting...',
    ko: '제출 중...',
  },
  submitBtn: {
    ja: 'チケットを送信',
    'zh-CN': '提交工单',
    'zh-TW': '提交工單',
    en: 'Submit Ticket',
    ko: '티켓 제출',
  },
  submitError: {
    ja: '送信に失敗しました。後ほど再度お試しください',
    'zh-CN': '提交失败，请稍后再试',
    'zh-TW': '提交失敗，請稍後再試',
    en: 'Submission failed. Please try again later',
    ko: '제출에 실패했습니다. 나중에 다시 시도해 주세요',
  },
  typeCommissionDispute: {
    ja: '報酬紛争',
    'zh-CN': '报酬纠纷',
    'zh-TW': '報酬糾紛',
    en: 'Commission Dispute',
    ko: '커미션 분쟁',
  },
  typeOrderIssue: {
    ja: '注文の問題',
    'zh-CN': '订单问题',
    'zh-TW': '訂單問題',
    en: 'Order Issue',
    ko: '주문 문제',
  },
  typePaymentIssue: {
    ja: '支払いの問題',
    'zh-CN': '支付问题',
    'zh-TW': '支付問題',
    en: 'Payment Issue',
    ko: '결제 문제',
  },
  typeTechnicalIssue: {
    ja: '技術的な問題',
    'zh-CN': '技术问题',
    'zh-TW': '技術問題',
    en: 'Technical Issue',
    ko: '기술 문제',
  },
  typeSuggestion: {
    ja: 'ご意見・ご要望',
    'zh-CN': '建议反馈',
    'zh-TW': '建議反饋',
    en: 'Suggestion',
    ko: '건의 사항',
  },
  typeOther: {
    ja: 'その他',
    'zh-CN': '其他问题',
    'zh-TW': '其他問題',
    en: 'Other',
    ko: '기타',
  },
  statusOpen: {
    ja: '未対応',
    'zh-CN': '待处理',
    'zh-TW': '待處理',
    en: 'Open',
    ko: '미처리',
  },
  statusInProgress: {
    ja: '対応中',
    'zh-CN': '处理中',
    'zh-TW': '處理中',
    en: 'In Progress',
    ko: '처리 중',
  },
  statusResolved: {
    ja: '解決済み',
    'zh-CN': '已解决',
    'zh-TW': '已解決',
    en: 'Resolved',
    ko: '해결됨',
  },
  statusClosed: {
    ja: 'クローズ',
    'zh-CN': '已关闭',
    'zh-TW': '已關閉',
    en: 'Closed',
    ko: '종료',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

const getTicketTypes = (lang: Language) => [
  { value: 'commission_dispute', label: t('typeCommissionDispute', lang), icon: '💰' },
  { value: 'order_issue', label: t('typeOrderIssue', lang), icon: '📋' },
  { value: 'payment_issue', label: t('typePaymentIssue', lang), icon: '💳' },
  { value: 'technical_issue', label: t('typeTechnicalIssue', lang), icon: '🔧' },
  { value: 'suggestion', label: t('typeSuggestion', lang), icon: '💡' },
  { value: 'other', label: t('typeOther', lang), icon: '❓' },
];

const getStatusConfig = (lang: Language): Record<string, { label: string; color: string; icon: any }> => ({
  open: { label: t('statusOpen', lang), color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  in_progress: { label: t('statusInProgress', lang), color: 'bg-brand-100 text-brand-700', icon: MessageSquare },
  resolved: { label: t('statusResolved', lang), color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  closed: { label: t('statusClosed', lang), color: 'bg-neutral-100 text-neutral-700', icon: CheckCircle2 },
});

const getDateLocale = (lang: Language): string => {
  const localeMap: Record<Language, string> = {
    ja: 'ja-JP',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    en: 'en-US',
    ko: 'ko-KR',
  };
  return localeMap[lang];
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [guideName, setGuideName] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();
  const lang = useLanguage();

  // 新工单表单
  const [newTicket, setNewTicket] = useState({
    ticket_type: 'order_issue',
    subject: '',
    description: '',
    priority: 'normal',
  });
  const [submitting, setSubmitting] = useState(false);

  // 回复表单
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const TICKET_TYPES = getTicketTypes(lang);
  const STATUS_CONFIG = getStatusConfig(lang);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/guide-partner/login');
        return;
      }

      const { data: guide } = await supabase
        .from('guides')
        .select('id, name, status')
        .eq('auth_user_id', user.id)
        .single();

      if (!guide || guide.status !== 'approved') {
        router.push('/guide-partner/login');
        return;
      }

      setGuideId(guide.id);
      setGuideName(guide.name);

      // 加载工单列表
      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('guide_id', guide.id)
        .order('created_at', { ascending: false });

      setTickets(ticketsData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketReplies = async (ticketId: string) => {
    const { data } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    setTicketReplies(data || []);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideId || !newTicket.subject.trim() || !newTicket.description.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          guide_id: guideId,
          ticket_type: newTicket.ticket_type,
          subject: newTicket.subject.trim(),
          description: newTicket.description.trim(),
          priority: newTicket.priority,
          status: 'open',
        });

      if (error) throw error;

      // 重置表单并刷新列表
      setNewTicket({ ticket_type: 'order_issue', subject: '', description: '', priority: 'normal' });
      setShowNewTicket(false);
      loadData();
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert(t('submitError', lang));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;

    setSendingReply(true);
    try {
      const { error } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: selectedTicket.id,
          reply_by: guideName,
          is_staff: false,
          content: replyContent.trim(),
        });

      if (error) throw error;

      setReplyContent('');
      loadTicketReplies(selectedTicket.id);
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    loadTicketReplies(ticket.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <GuideSidebar pageTitle={t('pageTitle', lang)} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-brand-900">{t('helpAndSupport', lang)}</h1>
              <p className="text-neutral-500 text-sm mt-1">{t('submitTicketHint', lang)}</p>
            </div>
            <button
              onClick={() => setShowNewTicket(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 transition"
            >
              <Plus size={20} />
              <span>{t('newTicket', lang)}</span>
            </button>
          </div>

          {/* SLA 提示 */}
          <div className="bg-brand-50 border border-brand-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-brand-900">{t('slaTitle', lang)}</h3>
                <ul className="text-sm text-brand-700 mt-1 space-y-1">
                  <li>• {t('slaNormal', lang)}</li>
                  <li>• {t('slaUrgent', lang)}</li>
                  <li>• {t('slaDispute', lang)}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* 工单列表 */}
            <div className="bg-white border">
              <div className="p-4 border-b">
                <h2 className="font-bold font-serif text-brand-900">{t('myTickets', lang)}</h2>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {tickets.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500">
                    <HeadphonesIcon className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                    <p>{t('noTickets', lang)}</p>
                    <p className="text-sm mt-1">{t('noTicketsHint', lang)}</p>
                  </div>
                ) : (
                  tickets.map((ticket) => {
                    const statusConfig = STATUS_CONFIG[ticket.status];
                    const typeConfig = TICKET_TYPES.find(tt => tt.value === ticket.ticket_type);
                    const StatusIcon = statusConfig?.icon || Clock;

                    return (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        className={`w-full p-4 text-left hover:bg-neutral-50 transition ${
                          selectedTicket?.id === ticket.id ? 'bg-brand-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{typeConfig?.icon}</span>
                              <span className="font-medium text-brand-900 truncate">
                                {ticket.subject}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-500 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 text-xs font-medium ${statusConfig?.color}`}>
                                {statusConfig?.label}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {new Date(ticket.created_at).toLocaleDateString(getDateLocale(lang))}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* 工单详情 */}
            <div className="bg-white border">
              {selectedTicket ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-bold font-serif text-brand-900">{selectedTicket.subject}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs font-medium ${
                            STATUS_CONFIG[selectedTicket.status]?.color
                          }`}>
                            {STATUS_CONFIG[selectedTicket.status]?.label}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {TICKET_TYPES.find(tt => tt.value === selectedTicket.ticket_type)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 对话区域 */}
                  <div className="p-4 max-h-[400px] overflow-y-auto space-y-4">
                    {/* 原始问题 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{t('meLabel', lang)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-500 mb-1">
                          {new Date(selectedTicket.created_at).toLocaleString(getDateLocale(lang))}
                        </p>
                        <div className="bg-neutral-100 p-3">
                          <p className="text-neutral-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* 回复列表 */}
                    {ticketReplies.map((reply) => (
                      <div key={reply.id} className={`flex gap-3 ${reply.is_staff ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                          reply.is_staff ? 'bg-brand-100' : 'bg-brand-100'
                        }`}>
                          <span className="text-sm">{reply.is_staff ? t('staffLabel', lang) : t('meLabel', lang)}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm text-neutral-500 mb-1 ${reply.is_staff ? '' : 'text-right'}`}>
                            {reply.is_staff ? t('staffName', lang) : guideName} · {new Date(reply.created_at).toLocaleString(getDateLocale(lang))}
                          </p>
                          <div className={`p-3 ${
                            reply.is_staff ? 'bg-brand-50' : 'bg-neutral-100'
                          }`}>
                            <p className="text-neutral-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 解决说明 */}
                    {selectedTicket.resolution_note && (
                      <div className="bg-green-50 border border-green-200 p-4">
                        <p className="text-sm font-medium text-green-800 mb-1">{t('resolutionNote', lang)}</p>
                        <p className="text-green-700">{selectedTicket.resolution_note}</p>
                      </div>
                    )}
                  </div>

                  {/* 回复输入 */}
                  {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={t('replyPlaceholder', lang)}
                          className="flex-1 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-brand-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendReply();
                            }
                          }}
                        />
                        <button
                          onClick={handleSendReply}
                          disabled={sendingReply || !replyContent.trim()}
                          className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingReply ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-neutral-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>{t('selectTicket', lang)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 新建工单弹窗 */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-brand-900">{t('newTicketTitle', lang)}</h2>
              <button onClick={() => setShowNewTicket(false)} className="p-2 hover:bg-neutral-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
              {/* 问题类型 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('ticketTypeLabel', lang)}</label>
                <div className="grid grid-cols-2 gap-2">
                  {TICKET_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewTicket({ ...newTicket, ticket_type: type.value })}
                      className={`p-3 border text-left transition ${
                        newTicket.ticket_type === type.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-xl mr-2">{type.icon}</span>
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 优先级 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('priorityLabel', lang)}</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="low">{t('priorityLow', lang)}</option>
                  <option value="normal">{t('priorityNormal', lang)}</option>
                  <option value="high">{t('priorityHigh', lang)}</option>
                  <option value="urgent">{t('priorityUrgent', lang)}</option>
                </select>
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('subjectLabel', lang)}</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder={t('subjectPlaceholder', lang)}
                  className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                  maxLength={200}
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('descriptionLabel', lang)}</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder={t('descriptionPlaceholder', lang)}
                  className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-brand-500 h-32 resize-none"
                  required
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 px-4 py-3 border hover:bg-neutral-50 transition"
                >
                  {t('cancelBtn', lang)}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newTicket.subject.trim() || !newTicket.description.trim()}
                  className="flex-1 px-4 py-3 bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('submittingBtn', lang)}
                    </>
                  ) : (
                    t('submitBtn', lang)
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
