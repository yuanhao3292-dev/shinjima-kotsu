'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDateJP } from '@/lib/utils/format-date';
import {
  Newspaper,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  CheckCircle,
  Loader2,
  ChevronLeft,
  Calendar,
  FileText,
  AlertCircle,
  Save,
  Bell,
  Megaphone,
  Sparkles,
  Upload,
  X,
  ImageIcon,
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: 'announcement' | 'press' | 'service';
  image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  published: number;
  draft: number;
  featured: number;
}

const CATEGORIES = [
  { value: 'all', label: '全部', icon: Newspaper },
  { value: 'announcement', label: 'お知らせ', icon: Bell },
  { value: 'press', label: 'プレスリリース', icon: Megaphone },
  { value: 'service', label: 'サービス', icon: Sparkles },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: typeof Bell }> = {
  announcement: { label: 'お知らせ', color: 'bg-blue-100 text-blue-700', icon: Bell },
  press: { label: 'プレスリリース', color: 'bg-emerald-100 text-emerald-700', icon: Megaphone },
  service: { label: 'サービス', color: 'bg-amber-100 text-amber-700', icon: Sparkles },
};

const emptyNews: Partial<NewsItem> = {
  title: '',
  summary: '',
  content: '',
  category: 'announcement',
  image_url: '',
  is_published: false,
  is_featured: false,
  published_at: '',
};

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // 图片上传处理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: '不支持的图片格式，请上传 JPG/PNG/WebP/GIF' });
      return;
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '图片大小不能超过 5MB' });
      return;
    }

    setImageUploading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage({ type: 'error', text: '登录已过期，请重新登录' });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/news/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.url) {
        setEditingNews(prev => prev ? { ...prev, image_url: result.url } : null);
        setMessage({ type: 'success', text: '图片上传成功' });
      } else {
        setMessage({ type: 'error', text: result.error || '图片上传失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setImageUploading(false);
      // 清空 input 以便重复上传同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setEditingNews(prev => prev ? { ...prev, image_url: '' } : null);
  };

  useEffect(() => {
    loadNews();
  }, [categoryFilter, publishedFilter]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (publishedFilter === 'published') params.append('published', 'true');
      if (publishedFilter === 'draft') params.append('published', 'false');
      params.append('limit', '50');

      const response = await fetch(`/api/admin/news?${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setNewsList(data.news || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load news error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingNews) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const newsData = {
        title: editingNews.title,
        summary: editingNews.summary || null,
        content: editingNews.content || null,
        category: editingNews.category,
        image_url: editingNews.image_url || null,
        is_published: editingNews.is_published,
        is_featured: editingNews.is_featured,
        published_at: editingNews.published_at || null,
      };

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: isCreating ? 'create' : 'update',
          newsId: editingNews.id,
          newsData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || '保存成功' });
        setEditingNews(null);
        setIsCreating(false);
        await loadNews();
      } else {
        setMessage({ type: 'error', text: result.error || '保存失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (newsId: string) => {
    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'toggle_publish', newsId }),
      });

      if (response.ok) {
        await loadNews();
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (newsId: string) => {
    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'toggle_featured', newsId }),
      });

      if (response.ok) {
        await loadNews();
      }
    } catch (error) {
      console.error('Toggle featured error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm('確定要刪除此新聞嗎？此操作不可恢復。')) return;

    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'delete', newsId }),
      });

      if (response.ok) {
        await loadNews();
        setMessage({ type: 'success', text: '新聞已刪除' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '刪除失敗' });
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (news: NewsItem) => {
    setEditingNews({
      ...news,
      published_at: news.published_at ? news.published_at.slice(0, 16) : '',
    });
    setIsCreating(false);
    setMessage(null);
  };

  const startCreate = () => {
    setEditingNews({ ...emptyNews });
    setIsCreating(true);
    setMessage(null);
  };

  const filteredNews = newsList.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Edit/Create Form
  if (editingNews) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => { setEditingNews(null); setMessage(null); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} /> 返回列表
        </button>

        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {isCreating ? '新增新聞' : '編輯新聞'}
          </h1>

          <div className="space-y-5">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">標題 *</label>
              <input
                type="text"
                value={editingNews.title || ''}
                onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="新聞標題"
              />
            </div>

            {/* 分类和发布日期 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分類 *</label>
                <select
                  value={editingNews.category || 'announcement'}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as NewsItem['category'] })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="announcement">お知らせ</option>
                  <option value="press">プレスリリース</option>
                  <option value="service">サービス</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">發布日期</label>
                <input
                  type="datetime-local"
                  value={editingNews.published_at || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, published_at: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">留空則使用發布時的當前時間</p>
              </div>
            </div>

            {/* 摘要 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">摘要</label>
              <textarea
                value={editingNews.summary || ''}
                onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="新聞摘要（將顯示在列表中）"
              />
            </div>

            {/* 内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">內容</label>
              <textarea
                value={editingNews.content || ''}
                onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="新聞完整內容"
              />
            </div>

            {/* 封面图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">封面圖片</label>

              {/* 隐藏的文件输入 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />

              {editingNews.image_url ? (
                // 已有图片 - 显示预览
                <div className="relative group">
                  <img
                    src={editingNews.image_url}
                    alt="封面图片预览"
                    className="w-full max-w-lg h-48 object-cover rounded-xl border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="%23f3f4f6" width="200" height="150"/><text fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">图片加载失败</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <Upload size={16} />
                      更換圖片
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2"
                    >
                      <X size={16} />
                      移除
                    </button>
                  </div>
                </div>
              ) : (
                // 无图片 - 显示上传区域
                <div
                  onClick={() => !imageUploading && fileInputRef.current?.click()}
                  className={`
                    w-full max-w-lg h-48 border-2 border-dashed rounded-xl
                    flex flex-col items-center justify-center gap-3
                    transition cursor-pointer
                    ${imageUploading
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }
                  `}
                >
                  {imageUploading ? (
                    <>
                      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                      <p className="text-sm text-indigo-600 font-medium">上傳中...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">點擊上傳封面圖片</p>
                        <p className="text-xs text-gray-400 mt-1">支援 JPG、PNG、WebP、GIF，最大 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* URL 输入（备选方案） */}
              <div className="mt-3">
                <details className="group">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    或使用圖片 URL
                  </summary>
                  <input
                    type="url"
                    value={editingNews.image_url || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, image_url: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </details>
              </div>
            </div>

            {/* 发布和精选开关 */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNews.is_published ?? false}
                  onChange={(e) => setEditingNews({ ...editingNews, is_published: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">立即發布</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNews.is_featured ?? false}
                  onChange={(e) => setEditingNews({ ...editingNews, is_featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">設為精選</span>
              </label>
            </div>

            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={actionLoading || !editingNews.title || !editingNews.category}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                保存
              </button>
              <button
                onClick={() => { setEditingNews(null); setMessage(null); }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Newspaper className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新聞管理</h1>
            <p className="text-gray-500">管理公司新聞和公告</p>
          </div>
        </div>
        <button
          onClick={startCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus size={18} />
          新增新聞
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">總數</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            <p className="text-sm text-gray-500">已發布</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-400">{stats.draft}</p>
            <p className="text-sm text-gray-500">草稿</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-amber-500">{stats.featured}</p>
            <p className="text-sm text-gray-500">精選</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋新聞標題..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value as typeof publishedFilter)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">全部狀態</option>
          <option value="published">已發布</option>
          <option value="draft">草稿</option>
        </select>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">新聞</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">分類</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-500">發布日期</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-500">狀態</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredNews.map((news) => {
                  const categoryInfo = CATEGORY_LABELS[news.category];
                  const CategoryIcon = categoryInfo?.icon || Newspaper;
                  return (
                    <tr key={news.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          {news.image_url ? (
                            <img
                              src={news.image_url}
                              alt=""
                              className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 line-clamp-1">{news.title}</p>
                            {news.summary && (
                              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{news.summary}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${categoryInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                          <CategoryIcon size={12} />
                          {categoryInfo?.label || news.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} />
                          {formatDateJP(news.published_at)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {news.is_published ? (
                            <span className="px-2 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">已發布</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">草稿</span>
                          )}
                          {news.is_featured && (
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => startEdit(news)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="編輯"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(news.id)}
                            className={`p-2 rounded-lg transition ${
                              news.is_published
                                ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={news.is_published ? '取消發布' : '發布'}
                          >
                            {news.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(news.id)}
                            className={`p-2 rounded-lg transition ${
                              news.is_featured
                                ? 'text-amber-500 hover:text-gray-500 hover:bg-gray-50'
                                : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                            title={news.is_featured ? '取消精選' : '設為精選'}
                          >
                            {news.is_featured ? <StarOff size={16} /> : <Star size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(news.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="刪除"
                          >
                            <Trash2 size={16} />
                          </button>
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
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暫無新聞數據</p>
          </div>
        )}
      </div>
    </div>
  );
}
