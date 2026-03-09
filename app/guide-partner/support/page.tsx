'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GuideSidebar from '@/components/guide-partner/GuideSidebar';
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

const TICKET_TYPES = [
  { value: 'commission_dispute', label: '報酬糾紛', icon: '💰' },
  { value: 'order_issue', label: '訂單問題', icon: '📋' },
  { value: 'payment_issue', label: '支付問題', icon: '💳' },
  { value: 'technical_issue', label: '技術問題', icon: '🔧' },
  { value: 'suggestion', label: '建議反饋', icon: '💡' },
  { value: 'other', label: '其他問題', icon: '❓' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: '待處理', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  in_progress: { label: '處理中', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
  resolved: { label: '已解決', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  closed: { label: '已關閉', color: 'bg-gray-100 text-gray-700', icon: CheckCircle2 },
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
      console.error('加载数据失败:', error);
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
      console.error('提交工单失败:', error);
      alert('提交失敗，請稍後再試');
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
      console.error('发送回复失败:', error);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSidebar pageTitle="客服支持" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">幫助與支持</h1>
              <p className="text-gray-500 text-sm mt-1">提交問題工單，我們將在 48 小時內回覆</p>
            </div>
            <button
              onClick={() => setShowNewTicket(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
            >
              <Plus size={20} />
              <span>新建工單</span>
            </button>
          </div>

          {/* SLA 提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">服務等級承諾 (SLA)</h3>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• 普通問題：48 小時內首次回覆</li>
                  <li>• 緊急問題：24 小時內首次回覆</li>
                  <li>• 報酬糾紛：72 小時內處理完成</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* 工单列表 */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-900">我的工單</h2>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {tickets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <HeadphonesIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>暫無工單記錄</p>
                    <p className="text-sm mt-1">點擊「新建工單」提交您的問題</p>
                  </div>
                ) : (
                  tickets.map((ticket) => {
                    const statusConfig = STATUS_CONFIG[ticket.status];
                    const typeConfig = TICKET_TYPES.find(t => t.value === ticket.ticket_type);
                    const StatusIcon = statusConfig?.icon || Clock;

                    return (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                          selectedTicket?.id === ticket.id ? 'bg-brand-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{typeConfig?.icon}</span>
                              <span className="font-medium text-gray-900 truncate">
                                {ticket.subject}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                                {statusConfig?.label}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(ticket.created_at).toLocaleDateString('zh-TW')}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* 工单详情 */}
            <div className="bg-white rounded-xl shadow-sm border">
              {selectedTicket ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-bold text-gray-900">{selectedTicket.subject}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_CONFIG[selectedTicket.status]?.color
                          }`}>
                            {STATUS_CONFIG[selectedTicket.status]?.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {TICKET_TYPES.find(t => t.value === selectedTicket.ticket_type)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 对话区域 */}
                  <div className="p-4 max-h-[400px] overflow-y-auto space-y-4">
                    {/* 原始问题 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">我</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(selectedTicket.created_at).toLocaleString('zh-TW')}
                        </p>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* 回复列表 */}
                    {ticketReplies.map((reply) => (
                      <div key={reply.id} className={`flex gap-3 ${reply.is_staff ? '' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          reply.is_staff ? 'bg-blue-100' : 'bg-brand-100'
                        }`}>
                          <span className="text-sm">{reply.is_staff ? '客' : '我'}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm text-gray-500 mb-1 ${reply.is_staff ? '' : 'text-right'}`}>
                            {reply.is_staff ? '客服' : guideName} · {new Date(reply.created_at).toLocaleString('zh-TW')}
                          </p>
                          <div className={`rounded-lg p-3 ${
                            reply.is_staff ? 'bg-blue-50' : 'bg-gray-100'
                          }`}>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 解决说明 */}
                    {selectedTicket.resolution_note && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-800 mb-1">解決方案</p>
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
                          placeholder="輸入回覆內容..."
                          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>選擇一個工單查看詳情</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 新建工单弹窗 */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">新建工單</h2>
              <button onClick={() => setShowNewTicket(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
              {/* 问题类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">問題類型</label>
                <div className="grid grid-cols-2 gap-2">
                  {TICKET_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewTicket({ ...newTicket, ticket_type: type.value })}
                      className={`p-3 rounded-lg border text-left transition ${
                        newTicket.ticket_type === type.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                <label className="block text-sm font-medium text-gray-700 mb-2">優先級</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="low">低 - 一般諮詢</option>
                  <option value="normal">普通 - 需要幫助</option>
                  <option value="high">高 - 影響使用</option>
                  <option value="urgent">緊急 - 嚴重問題</option>
                </select>
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">問題標題</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="簡要描述您的問題"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                  maxLength={200}
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">詳細描述</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="請詳細描述您遇到的問題，包括：&#10;- 發生時間&#10;- 相關訂單號（如有）&#10;- 期望的解決方案"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 h-32 resize-none"
                  required
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1 px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newTicket.subject.trim() || !newTicket.description.trim()}
                  className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    '提交工單'
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
