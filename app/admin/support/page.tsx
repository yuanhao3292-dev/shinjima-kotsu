'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDateTimeSimple } from '@/lib/utils/format-date';
import {
  Headphones,
  CheckCircle,
  Clock,
  Loader2,
  ChevronLeft,
  Send,
  AlertCircle,
  MessageSquare,
  User,
  Tag,
} from 'lucide-react';

interface Ticket {
  id: string;
  ticket_type: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
  assigned_to: string | null;
  guide: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface Reply {
  id: string;
  content: string;
  reply_by: string;
  is_staff: boolean;
  created_at: string;
}

interface Stats {
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  open: { label: '待處理', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  in_progress: { label: '處理中', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  resolved: { label: '已解決', color: 'text-green-700', bgColor: 'bg-green-100' },
  closed: { label: '已關閉', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: '低', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  normal: { label: '普通', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  high: { label: '高', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  urgent: { label: '緊急', color: 'text-red-600', bgColor: 'bg-red-100' },
};

const TYPE_LABELS: Record<string, string> = {
  commission_dispute: '佣金糾紛',
  order_issue: '訂單問題',
  payment_issue: '支付問題',
  technical_issue: '技術問題',
  suggestion: '建議反饋',
  other: '其他',
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('open');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(`/api/admin/tickets${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load tickets error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetail = async (ticketId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/tickets?id=${ticketId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTicket(data.ticket);
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Load ticket detail error:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          action: 'reply',
          replyContent,
        }),
      });

      if (response.ok) {
        setReplyContent('');
        await loadTicketDetail(selectedTicket.id);
        setMessage({ type: 'success', text: '回覆已發送' });
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.error || '發送失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          action: 'update_status',
          status,
          resolutionNote: status === 'resolved' ? resolutionNote : undefined,
        }),
      });

      if (response.ok) {
        setResolutionNote('');
        await loadTicketDetail(selectedTicket.id);
        await loadTickets();
        setMessage({ type: 'success', text: '狀態已更新' });
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.error || '更新失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };


  // Detail View
  if (selectedTicket) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => { setSelectedTicket(null); setMessage(null); setReplies([]); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} /> 返回列表
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{selectedTicket.subject}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedTicket.status]?.bgColor} ${STATUS_CONFIG[selectedTicket.status]?.color}`}>
                    {STATUS_CONFIG[selectedTicket.status]?.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_CONFIG[selectedTicket.priority]?.bgColor} ${PRIORITY_CONFIG[selectedTicket.priority]?.color}`}>
                    {PRIORITY_CONFIG[selectedTicket.priority]?.label}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                    {TYPE_LABELS[selectedTicket.ticket_type] || selectedTicket.ticket_type}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User size={14} />
                {selectedTicket.guide?.name} ({selectedTicket.guide?.email})
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDateTimeSimple(selectedTicket.created_at)}
              </span>
            </div>
          </div>

          {/* Replies */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              對話記錄
            </h2>

            {replies.length > 0 ? (
              <div className="space-y-4 mb-6">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${reply.is_staff ? 'bg-indigo-50 ml-8' : 'bg-gray-50 mr-8'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${reply.is_staff ? 'text-indigo-600' : 'text-gray-600'}`}>
                        {reply.is_staff ? '客服' : selectedTicket.guide?.name}
                      </span>
                      <span className="text-xs text-gray-400">{formatDateTimeSimple(reply.created_at)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 mb-6">暫無對話記錄</p>
            )}

            {/* Reply Form */}
            {selectedTicket.status !== 'closed' && (
              <div className="border-t pt-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
                  placeholder="輸入回覆內容..."
                />
                <button
                  onClick={handleReply}
                  disabled={actionLoading || !replyContent.trim()}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  發送回覆
                </button>
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Actions */}
          {selectedTicket.status !== 'closed' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-gray-900 mb-4">狀態管理</h2>

              {selectedTicket.status === 'open' && (
                <button
                  onClick={() => handleUpdateStatus('in_progress')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                >
                  開始處理
                </button>
              )}

              {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    解決備註
                  </label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
                    placeholder="描述問題是如何解決的..."
                  />
                  <button
                    onClick={() => handleUpdateStatus('resolved')}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                  >
                    標記為已解決
                  </button>
                </div>
              )}

              {selectedTicket.status === 'resolved' && (
                <button
                  onClick={() => handleUpdateStatus('closed')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                >
                  關閉工單
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
          <Headphones className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客服工單</h1>
          <p className="text-gray-500">處理合夥人支援請求</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
            <p className="text-sm text-gray-500">待處理</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
            <p className="text-sm text-gray-500">處理中</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            <p className="text-sm text-gray-500">已解決</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            <p className="text-sm text-gray-500">已關閉</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: 'open', label: '待處理' },
          { value: 'in_progress', label: '處理中' },
          { value: 'resolved', label: '已解決' },
          { value: 'closed', label: '已關閉' },
          { value: 'all', label: '全部' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === filter.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border hover:border-indigo-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : tickets.length > 0 ? (
          <div className="divide-y">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => loadTicketDetail(ticket.id)}
                className="p-5 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-gray-900">{ticket.subject}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[ticket.status]?.bgColor} ${STATUS_CONFIG[ticket.status]?.color}`}>
                        {STATUS_CONFIG[ticket.status]?.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[ticket.priority]?.bgColor} ${PRIORITY_CONFIG[ticket.priority]?.color}`}>
                        {PRIORITY_CONFIG[ticket.priority]?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {TYPE_LABELS[ticket.ticket_type] || ticket.ticket_type} · {ticket.guide?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTimeSimple(ticket.created_at)}</p>
                  </div>
                  <ChevronLeft className="rotate-180 text-gray-400 mt-1" size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Headphones className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暫無{STATUS_CONFIG[statusFilter]?.label || ''}的工單</p>
          </div>
        )}
      </div>
    </div>
  );
}
