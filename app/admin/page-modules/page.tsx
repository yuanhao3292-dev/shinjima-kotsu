'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Puzzle,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  Percent,
  AlertCircle,
  Save,
  Package,
  Car,
  User,
} from 'lucide-react';

interface PageModule {
  id: string;
  module_type: 'bio' | 'vehicle' | 'medical';
  name: string;
  name_ja: string | null;
  name_zh: string | null;
  description: string | null;
  description_ja: string | null;
  description_zh: string | null;
  icon_url: string | null;
  is_required: boolean;
  commission_rate_min: number;
  commission_rate_max: number;
  status: 'active' | 'inactive';
  display_order: number;
  config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

const MODULE_TYPES = [
  { value: 'all', label: '全部', icon: Puzzle },
  { value: 'bio', label: '自我介绍', icon: User },
  { value: 'vehicle', label: '车辆介绍', icon: Car },
  { value: 'medical', label: '医疗服务', icon: Package },
];

const MODULE_TYPE_LABELS: Record<string, string> = {
  bio: '自我介绍',
  vehicle: '车辆介绍',
  medical: '医疗服务',
};

const emptyModule: Partial<PageModule> = {
  module_type: 'medical',
  name: '',
  name_ja: '',
  name_zh: '',
  description: '',
  description_ja: '',
  description_zh: '',
  icon_url: '',
  is_required: false,
  commission_rate_min: 0,
  commission_rate_max: 25,
  status: 'active',
  display_order: 0,
};

export default function PageModulesPage() {
  const [modules, setModules] = useState<PageModule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingModule, setEditingModule] = useState<Partial<PageModule> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadModules();
  }, [typeFilter, statusFilter]);

  const loadModules = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/page-modules?${params}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setModules(data.modules || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load modules error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingModule) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const moduleData = {
        moduleType: editingModule.module_type,
        name: editingModule.name,
        nameJa: editingModule.name_ja || null,
        nameZh: editingModule.name_zh || null,
        description: editingModule.description || null,
        descriptionJa: editingModule.description_ja || null,
        descriptionZh: editingModule.description_zh || null,
        iconUrl: editingModule.icon_url || null,
        isRequired: editingModule.is_required,
        commissionRateMin: editingModule.commission_rate_min,
        commissionRateMax: editingModule.commission_rate_max,
        status: editingModule.status,
        displayOrder: editingModule.display_order,
      };

      const response = await fetch('/api/admin/page-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: isCreating ? 'create' : 'update',
          moduleId: editingModule.id,
          moduleData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || '保存成功' });
        setEditingModule(null);
        setIsCreating(false);
        await loadModules();
      } else {
        setMessage({ type: 'error', text: result.error || '保存失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (moduleId: string) => {
    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/page-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'toggle_status', moduleId }),
      });

      if (response.ok) {
        await loadModules();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (moduleId: string) => {
    if (!confirm('确定要删除此模块吗？此操作不可恢复。')) return;

    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/page-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'delete', moduleId }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || '删除成功' });
        await loadModules();
      } else {
        setMessage({ type: 'error', text: result.error || '删除失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredModules = modules.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.name_ja?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.name_zh?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getModuleTypeIcon = (type: string) => {
    switch (type) {
      case 'bio': return <User size={18} className="text-blue-500" />;
      case 'vehicle': return <Car size={18} className="text-green-500" />;
      case 'medical': return <Package size={18} className="text-purple-500" />;
      default: return <Puzzle size={18} className="text-gray-500" />;
    }
  };

  // Edit Form View
  if (editingModule) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <button
          onClick={() => { setEditingModule(null); setIsCreating(false); setMessage(null); }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft size={20} />
          返回列表
        </button>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h1 className="text-xl font-bold text-gray-900">
              {isCreating ? '新增模块' : '编辑模块'}
            </h1>
          </div>

          <div className="p-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">模块类型 *</label>
                <select
                  value={editingModule.module_type || 'medical'}
                  onChange={(e) => setEditingModule({ ...editingModule, module_type: e.target.value as PageModule['module_type'] })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  disabled={!isCreating}
                >
                  <option value="bio">自我介绍</option>
                  <option value="vehicle">车辆介绍</option>
                  <option value="medical">医疗服务</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">显示顺序</label>
                <input
                  type="number"
                  value={editingModule.display_order || 0}
                  onChange={(e) => setEditingModule({ ...editingModule, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 名称 */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">名称 (英文) *</label>
                <input
                  type="text"
                  value={editingModule.name || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="TIMC Tokyo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">名称 (日文)</label>
                <input
                  type="text"
                  value={editingModule.name_ja || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, name_ja: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="TIMC東京"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">名称 (中文)</label>
                <input
                  type="text"
                  value={editingModule.name_zh || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, name_zh: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="东京国际医疗中心"
                />
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">描述 (英文)</label>
              <textarea
                value={editingModule.description || ''}
                onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="模块描述..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述 (日文)</label>
                <textarea
                  value={editingModule.description_ja || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, description_ja: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述 (中文)</label>
                <textarea
                  value={editingModule.description_zh || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, description_zh: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 佣金设置 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最低佣金比例 (%)</label>
                <input
                  type="number"
                  value={editingModule.commission_rate_min || 0}
                  onChange={(e) => setEditingModule({ ...editingModule, commission_rate_min: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">最高佣金比例 (%)</label>
                <input
                  type="number"
                  value={editingModule.commission_rate_max || 25}
                  onChange={(e) => setEditingModule({ ...editingModule, commission_rate_max: parseFloat(e.target.value) || 25 })}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 选项 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_required"
                  checked={editingModule.is_required || false}
                  onChange={(e) => setEditingModule({ ...editingModule, is_required: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_required" className="text-sm text-gray-700">
                  必选模块（所有导游必须启用）
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingModule.status === 'active'}
                  onChange={(e) => setEditingModule({ ...editingModule, status: e.target.checked ? 'active' : 'inactive' })}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  启用状态
                </label>
              </div>
            </div>

            {/* 图标URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">图标 URL</label>
              <input
                type="url"
                value={editingModule.icon_url || ''}
                onChange={(e) => setEditingModule({ ...editingModule, icon_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="https://..."
              />
            </div>

            {/* 消息 */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <AlertCircle size={18} />
                {message.text}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleSave}
                disabled={actionLoading || !editingModule.name}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                保存
              </button>
              <button
                onClick={() => { setEditingModule(null); setIsCreating(false); setMessage(null); }}
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
            <Puzzle className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">页面模块管理</h1>
            <p className="text-gray-500">管理白标页面的可用模块</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingModule(emptyModule); setIsCreating(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          新增模块
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">全部模块</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">已启用</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">已禁用</p>
            <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索模块名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {MODULE_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                typeFilter === type.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border hover:border-indigo-300'
              }`}
            >
              <type.icon size={16} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <AlertCircle size={18} />
          {message.text}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : filteredModules.length > 0 ? (
          <div className="divide-y">
            {filteredModules.map((module) => (
              <div key={module.id} className="p-5 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getModuleTypeIcon(module.module_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{module.name}</p>
                        {module.is_required && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            必选
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          module.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {module.status === 'active' ? '已启用' : '已禁用'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {module.name_zh || module.name_ja || module.description?.slice(0, 50)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          {MODULE_TYPE_LABELS[module.module_type] || module.module_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Percent size={12} />
                          {module.commission_rate_min}-{module.commission_rate_max}%
                        </span>
                        <span>排序: {module.display_order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(module.id)}
                      disabled={actionLoading}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      title={module.status === 'active' ? '禁用' : '启用'}
                    >
                      {module.status === 'active' ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => setEditingModule(module)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="编辑"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(module.id)}
                      disabled={actionLoading || module.is_required}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title={module.is_required ? '必选模块无法删除' : '删除'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Puzzle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无模块数据</p>
          </div>
        )}
      </div>
    </div>
  );
}
