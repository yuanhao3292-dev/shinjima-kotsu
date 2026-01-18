'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Store,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  MapPin,
  DollarSign,
  Tag,
  AlertCircle,
  Save,
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  name_ja: string;
  brand: string;
  city: string;
  area: string;
  category: string;
  min_spend: number;
  avg_spend: number;
  description: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

const CITIES = ['全部', '東京', '大阪', '名古屋', '福岡', '京都', '神戶'];
const CATEGORIES = [
  { value: 'all', label: '全部' },
  { value: 'nightclub', label: '夜總會' },
  { value: 'medical', label: '醫療檢查' },
  { value: 'treatment', label: '綜合治療' },
];

const CATEGORY_LABELS: Record<string, string> = {
  nightclub: '夜總會',
  medical: '醫療檢查',
  treatment: '綜合治療',
};

const emptyVenue: Partial<Venue> = {
  name: '',
  name_ja: '',
  brand: '',
  city: '',
  area: '',
  category: 'nightclub',
  min_spend: 0,
  avg_spend: 0,
  description: '',
  features: [],
  is_active: true,
};

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('全部');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingVenue, setEditingVenue] = useState<Partial<Venue> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');

  const supabase = createClient();

  useEffect(() => {
    loadVenues();
  }, [cityFilter, categoryFilter]);

  const loadVenues = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (cityFilter !== '全部') params.append('city', cityFilter);

      const response = await fetch(`/api/admin/venues?${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load venues error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingVenue) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const venueData = {
        ...editingVenue,
        features: featuresInput.split(',').map(f => f.trim()).filter(Boolean),
      };

      const response = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: isCreating ? 'create' : 'update',
          venueId: editingVenue.id,
          venueData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || '保存成功' });
        setEditingVenue(null);
        setIsCreating(false);
        setFeaturesInput('');
        await loadVenues();
      } else {
        setMessage({ type: 'error', text: result.error || '保存失敗' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '網絡錯誤' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (venueId: string) => {
    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'toggle_active', venueId }),
      });

      if (response.ok) {
        await loadVenues();
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (venueId: string) => {
    if (!confirm('確定要刪除此店鋪嗎？此操作不可恢復。')) return;

    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'delete', venueId }),
      });

      if (response.ok) {
        await loadVenues();
        setMessage({ type: 'success', text: '店鋪已刪除' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '刪除失敗' });
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFeaturesInput((venue.features || []).join(', '));
    setIsCreating(false);
    setMessage(null);
  };

  const startCreate = () => {
    setEditingVenue({ ...emptyVenue });
    setFeaturesInput('');
    setIsCreating(true);
    setMessage(null);
  };

  const filteredVenues = venues.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.name_ja?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Edit/Create Form
  if (editingVenue) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl">
        <button
          onClick={() => { setEditingVenue(null); setMessage(null); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} /> 返回列表
        </button>

        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            {isCreating ? '新增店鋪' : '編輯店鋪'}
          </h1>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">店鋪名稱（中文）*</label>
                <input
                  type="text"
                  value={editingVenue.name || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例：銀座俱樂部"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">店鋪名稱（日文）</label>
                <input
                  type="text"
                  value={editingVenue.name_ja || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, name_ja: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例：銀座クラブ"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">品牌</label>
                <input
                  type="text"
                  value={editingVenue.brand || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, brand: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">類別 *</label>
                <select
                  value={editingVenue.category || 'nightclub'}
                  onChange={(e) => setEditingVenue({ ...editingVenue, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="nightclub">夜總會</option>
                  <option value="medical">醫療檢查</option>
                  <option value="treatment">綜合治療</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市 *</label>
                <select
                  value={editingVenue.city || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">請選擇</option>
                  {CITIES.filter(c => c !== '全部').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">區域</label>
                <input
                  type="text"
                  value={editingVenue.area || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, area: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例：銀座"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最低消費 (¥)</label>
                <input
                  type="number"
                  value={editingVenue.min_spend || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, min_spend: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">平均消費 (¥)</label>
                <input
                  type="number"
                  value={editingVenue.avg_spend || ''}
                  onChange={(e) => setEditingVenue({ ...editingVenue, avg_spend: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
              <textarea
                value={editingVenue.description || ''}
                onChange={(e) => setEditingVenue({ ...editingVenue, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">特色標籤（用逗號分隔）</label>
              <input
                type="text"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例：VIP包廂, 中文服務, 高端酒水"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={editingVenue.is_active ?? true}
                onChange={(e) => setEditingVenue({ ...editingVenue, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">立即上架</label>
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
                disabled={actionLoading || !editingVenue.name || !editingVenue.city || !editingVenue.category}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                保存
              </button>
              <button
                onClick={() => { setEditingVenue(null); setMessage(null); }}
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
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <Store className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">店鋪管理</h1>
            <p className="text-gray-500">管理合作店鋪信息</p>
          </div>
        </div>
        <button
          onClick={startCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus size={18} />
          新增店鋪
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">總店鋪數</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">已上架</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
            <p className="text-sm text-gray-500">已下架</p>
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
            placeholder="搜尋店鋪名稱..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
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
        ) : filteredVenues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">店鋪</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">類別</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">位置</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-500">消費</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-500">狀態</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVenues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{venue.name}</p>
                      {venue.name_ja && <p className="text-sm text-gray-500">{venue.name_ja}</p>}
                      {venue.brand && <p className="text-xs text-gray-400">{venue.brand}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {CATEGORY_LABELS[venue.category] || venue.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={14} />
                        {venue.city} {venue.area && `· ${venue.area}`}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-sm">
                      {venue.avg_spend > 0 && (
                        <p className="text-gray-900">¥{venue.avg_spend.toLocaleString()}</p>
                      )}
                      {venue.min_spend > 0 && (
                        <p className="text-xs text-gray-400">最低 ¥{venue.min_spend.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {venue.is_active ? (
                        <span className="px-2 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">上架</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">下架</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => startEdit(venue)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="編輯"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(venue.id)}
                          className={`p-2 rounded-lg transition ${
                            venue.is_active
                              ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                              : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={venue.is_active ? '下架' : '上架'}
                        >
                          {venue.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(venue.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="刪除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暫無店鋪數據</p>
          </div>
        )}
      </div>
    </div>
  );
}
