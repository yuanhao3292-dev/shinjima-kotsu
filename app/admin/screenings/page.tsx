'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { formatDateTime } from '@/lib/utils/format-date';
import Link from 'next/link';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  Activity,
  Building2,
  Stethoscope,
  Sparkles,
  ClipboardList,
  X,
  ChevronRight,
  Clock,
  Heart,
  Brain,
  Users,
  Tag,
  Download,
} from 'lucide-react';
import { BODY_PARTS, MEDICAL_DEPARTMENTS } from '@/lib/body-map-config';

interface ScreeningRecord {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  answers: any[];
  body_map_data: any;
  analysis_result: any;
  created_at: string;
  completed_at: string | null;
}

const RISK_CONFIG = {
  low: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: '低风险 Low',
    badgeClass: 'bg-emerald-100 text-emerald-800',
  },
  medium: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: '中风险 Medium',
    badgeClass: 'bg-amber-100 text-amber-800',
  },
  high: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: '高风险 High',
    badgeClass: 'bg-red-100 text-red-800',
  },
};

// Skeleton Loading Component
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center px-6 py-4 border-b border-slate-100">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-24"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-20 mx-4"></div>
          <div className="h-4 bg-slate-100 rounded w-32 mx-4"></div>
          <div className="h-4 bg-slate-100 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}

export default function AdminScreeningsPage() {
  const [allScreenings, setAllScreenings] = useState<ScreeningRecord[]>([]); // 全部数据用于统计
  const [displayScreenings, setDisplayScreenings] = useState<ScreeningRecord[]>([]); // 过滤后的数据用于显示
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ScreeningRecord | null>(null);

  // 初始加载全部数据
  useEffect(() => {
    fetchAllScreenings();
  }, []);

  // 筛选变化时更新显示数据
  useEffect(() => {
    applyFilter();
  }, [filter, allScreenings]);

  async function fetchAllScreenings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_screenings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllScreenings((data as ScreeningRecord[]) || []);
    } catch (error) {
      console.error('获取筛查记录失败:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter() {
    let filtered = [...allScreenings];

    if (filter === 'completed') {
      filtered = filtered.filter(s => s.status === 'completed');
    } else if (filter === 'in_progress') {
      filtered = filtered.filter(s => s.status === 'in_progress');
    } else if (filter === 'high_risk') {
      filtered = filtered.filter(s => s.analysis_result?.riskLevel === 'high');
    }

    setDisplayScreenings(filtered);
  }


  // 搜索过滤（在已筛选数据基础上）
  const filteredScreenings = displayScreenings.filter(s =>
    s.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 统计数据始终基于全部数据
  const stats = {
    total: allScreenings.length,
    completed: allScreenings.filter((s) => s.status === 'completed').length,
    inProgress: allScreenings.filter((s) => s.status === 'in_progress').length,
    highRisk: allScreenings.filter(
      (s) => s.analysis_result?.riskLevel === 'high'
    ).length,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ===== Hero Header ===== */}
      <div className="w-full bg-slate-900 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-lg md:text-2xl font-light tracking-wide">
              NIIJIMA <span className="font-bold text-cyan-400">MEDICAL</span> <span className="hidden sm:inline">ADMIN</span>
            </h1>
            <span className="text-slate-500 text-sm hidden md:inline">|</span>
            <span className="text-slate-400 text-sm hidden md:inline">健康筛查管理</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/admin/orders"
              className="text-slate-400 hover:text-white text-xs md:text-sm transition-colors flex items-center gap-1"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">订单管理</span>
            </Link>
            <Link
              href="/"
              className="text-slate-400 hover:text-white text-xs md:text-sm transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Stats Cards (悬浮于背景之上) ===== */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-0 pt-6 md:pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {/* 总记录 */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex justify-between items-center border border-slate-100 hover:shadow-md transition-shadow">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">总记录</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="p-2 md:p-3 bg-slate-100 rounded-full text-slate-500">
              <FileText size={20} className="md:w-6 md:h-6" />
            </div>
          </div>

          {/* 已完成 */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex justify-between items-center border border-slate-100 hover:shadow-md transition-shadow">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">已完成</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <div className="p-2 md:p-3 bg-emerald-50 rounded-full text-emerald-500">
              <CheckCircle size={20} className="md:w-6 md:h-6" />
            </div>
          </div>

          {/* 进行中 */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex justify-between items-center border border-slate-100 hover:shadow-md transition-shadow">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">进行中</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="p-2 md:p-3 bg-blue-50 rounded-full text-blue-500">
              <Clock size={20} className="md:w-6 md:h-6" />
            </div>
          </div>

          {/* 需要关注 (高风险) */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex justify-between items-center border border-slate-100 hover:shadow-md transition-shadow">
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-medium">需要关注</p>
              <p className="text-2xl md:text-3xl font-bold text-red-600 mt-1 animate-pulse">{stats.highRisk}</p>
            </div>
            <div className="p-2 md:p-3 bg-red-50 rounded-full text-red-500">
              <AlertTriangle size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Search & Filter Bar ===== */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 md:mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索邮箱或 User ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: '全部' },
                { key: 'completed', label: '已完成' },
                { key: 'in_progress', label: '进行中' },
                { key: 'high_risk', label: '高风险' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === key
                      ? 'bg-slate-900 text-white'
                      : 'bg-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Table List ===== */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Header - Desktop Only */}
          <div className="hidden md:block bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                用户 (User)
              </div>
              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                风险等级 (Risk)
              </div>
              <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                提交时间 (Date)
              </div>
              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                状态 (Status)
              </div>
              <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                操作
              </div>
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <TableSkeleton />
          ) : filteredScreenings.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">暂无筛查记录</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredScreenings.map((screening) => {
                const riskLevel = screening.analysis_result?.riskLevel;
                const riskConfig = riskLevel ? RISK_CONFIG[riskLevel as keyof typeof RISK_CONFIG] : null;

                return (
                  <div
                    key={screening.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedRecord(screening)}
                  >
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4">
                      {/* User */}
                      <div className="col-span-4">
                        <p className="text-slate-900 font-medium">{screening.user_email}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-mono">
                          ID: #{screening.id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      {/* Risk Level Badge */}
                      <div className="col-span-2 flex items-center">
                        {screening.status === 'completed' && riskConfig ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskConfig.badgeClass}`}>
                            {riskConfig.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            待分析
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="col-span-3 flex items-center text-slate-600 text-sm">
                        {formatDateTime(screening.created_at)}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex items-center">
                        {screening.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                            <CheckCircle size={14} />
                            已完成
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                            <Activity size={14} />
                            进行中
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div className="col-span-1 flex items-center justify-end">
                        <span className="text-slate-400 group-hover:text-cyan-600 flex items-center gap-1 transition-colors text-sm">
                          详情 <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>

                    {/* Mobile View - Card Style */}
                    <div className="md:hidden p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-medium truncate">{screening.user_email}</p>
                          <p className="text-slate-400 text-xs mt-0.5 font-mono">
                            #{screening.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {screening.status === 'completed' && riskConfig ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskConfig.badgeClass}`}>
                            {riskConfig.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            待分析
                          </span>
                        )}
                        {screening.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                            <CheckCircle size={12} />
                            已完成
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600 text-xs">
                            <Activity size={12} />
                            进行中
                          </span>
                        )}
                        <span className="text-slate-400 text-xs">
                          {formatDateTime(screening.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== Side Drawer (Detail View) ===== */}
      {selectedRecord && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSelectedRecord(null)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">筛查详情</h2>
                <p className="text-slate-400 text-sm mt-0.5">{selectedRecord.user_email}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Risk Badge Header */}
            {selectedRecord.status === 'completed' && selectedRecord.analysis_result?.riskLevel && (
              <div className={`px-6 py-4 flex-shrink-0 ${
                RISK_CONFIG[selectedRecord.analysis_result.riskLevel as keyof typeof RISK_CONFIG]?.bg
              } border-b ${
                RISK_CONFIG[selectedRecord.analysis_result.riskLevel as keyof typeof RISK_CONFIG]?.border
              }`}>
                <div className="flex items-center gap-3">
                  {selectedRecord.analysis_result.riskLevel === 'high' && <AlertTriangle className="text-red-600" size={24} />}
                  {selectedRecord.analysis_result.riskLevel === 'medium' && <AlertCircle className="text-amber-600" size={24} />}
                  {selectedRecord.analysis_result.riskLevel === 'low' && <CheckCircle className="text-emerald-600" size={24} />}
                  <div>
                    <p className={`font-bold ${RISK_CONFIG[selectedRecord.analysis_result.riskLevel as keyof typeof RISK_CONFIG]?.color}`}>
                      {RISK_CONFIG[selectedRecord.analysis_result.riskLevel as keyof typeof RISK_CONFIG]?.label}
                    </p>
                    <p className="text-slate-600 text-sm">AI 风险评估结果</p>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Body Map Data Section */}
              {selectedRecord.body_map_data && selectedRecord.body_map_data.selectedBodyParts?.length > 0 && (
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="text-indigo-600" size={18} />
                    <h3 className="font-semibold text-slate-800">症状部位</h3>
                  </div>

                  {/* 选中的部位 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedRecord.body_map_data.selectedBodyParts.map((partId: string) => {
                      const part = BODY_PARTS.find(p => p.id === partId);
                      return part ? (
                        <span key={partId} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {part.name}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {/* 具体症状 */}
                  {selectedRecord.body_map_data.selectedSymptoms?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">具体症状</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.body_map_data.selectedSymptoms.map((symptom: any, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              symptom.severity === 'high'
                                ? 'bg-red-100 text-red-700'
                                : symptom.severity === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {symptom.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 推荐科室 */}
                  {selectedRecord.body_map_data.recommendedDepartments?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Users size={12} />
                        推荐就诊科室
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.body_map_data.recommendedDepartments.map((deptId: string) => {
                          const dept = MEDICAL_DEPARTMENTS.find(d => d.id === deptId);
                          return dept ? (
                            <span key={deptId} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs flex items-center gap-1">
                              <span>{dept.icon}</span>
                              {dept.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Marketing Tags Section */}
              {selectedRecord.status === 'completed' && (
                <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="text-amber-600" size={18} />
                    <h3 className="font-semibold text-slate-800">营销标签</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* 根据风险等级生成标签 */}
                    {selectedRecord.analysis_result?.riskLevel === 'high' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        高优先级跟进
                      </span>
                    )}
                    {/* 根据部位生成标签 */}
                    {selectedRecord.body_map_data?.selectedBodyParts?.includes('chest') && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        心脏健检需求
                      </span>
                    )}
                    {selectedRecord.body_map_data?.selectedBodyParts?.includes('abdomen') && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        消化道检查需求
                      </span>
                    )}
                    {selectedRecord.body_map_data?.selectedBodyParts?.includes('head') && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        脑部MRI需求
                      </span>
                    )}
                    {/* 心理健康标签 */}
                    {selectedRecord.answers?.some((a: any) =>
                      (a.questionId === 17 && (a.answer === 'high' || a.answer === 'extreme')) ||
                      (a.questionId === 9 && (a.answer === 'often' || a.answer === 'daily'))
                    ) && (
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-medium flex items-center gap-1">
                        <Brain size={12} />
                        心理健康关注
                      </span>
                    )}
                    {/* 年龄段标签 */}
                    {selectedRecord.answers?.find((a: any) => a.questionId === 1)?.answer === '50-59' && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        50+ 高端健检
                      </span>
                    )}
                    {selectedRecord.answers?.find((a: any) => a.questionId === 1)?.answer === '60plus' && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        60+ VIP 套餐
                      </span>
                    )}
                    {/* 家族病史标签 */}
                    {selectedRecord.answers?.some((a: any) =>
                      a.questionId === 5 && Array.isArray(a.answer) && !a.answer.includes('none')
                    ) && (
                      <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-medium">
                        癌症筛查需求
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* AI Analysis Section */}
              {selectedRecord.analysis_result && (
                <div className="px-6 py-5 bg-gradient-to-r from-violet-50 to-blue-50 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-violet-600" size={18} />
                    <h3 className="font-semibold text-slate-800">AI 分析摘要</h3>
                  </div>
                  {selectedRecord.analysis_result.riskSummary && (
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedRecord.analysis_result.riskSummary}
                    </p>
                  )}

                  {/* Recommended Tests */}
                  {selectedRecord.analysis_result.recommendedTests?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Stethoscope size={12} />
                        建议检查项目
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.analysis_result.recommendedTests.map((test: string, idx: number) => (
                          <span key={idx} className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Hospitals */}
                  {selectedRecord.analysis_result.recommendedHospitals?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Building2 size={12} />
                        推荐医疗机构
                      </p>
                      <div className="space-y-2">
                        {selectedRecord.analysis_result.recommendedHospitals.map((h: any, idx: number) => (
                          <div key={idx} className="text-sm bg-white border border-slate-200 px-3 py-2 rounded">
                            <span className="font-medium text-slate-800">{h.name}</span>
                            <span className="text-slate-400 ml-2">- {h.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Questionnaire Answers */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="text-slate-600" size={18} />
                  <h3 className="font-semibold text-slate-800">问卷答案</h3>
                  <span className="text-xs text-slate-400 ml-auto">
                    {selectedRecord.answers?.length || 0} / 20 题
                  </span>
                </div>

                {selectedRecord.answers && selectedRecord.answers.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRecord.answers.map((answer: any, idx: number) => {
                      // 检查是否为高风险答案（简单逻辑：包含某些关键词）
                      const answerText = Array.isArray(answer.answer)
                        ? answer.answer.join('、')
                        : answer.answer;
                      const isHighRisk = ['每天吸煙', '每天饮酒', '高', '有', '便血', '血尿', '胸悶'].some(
                        keyword => answerText.includes(keyword)
                      );

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${
                            isHighRisk
                              ? 'bg-red-50 border-red-200'
                              : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <p className="text-slate-600 text-sm mb-1">
                            Q{answer.questionId}. {answer.question}
                          </p>
                          <p className={`font-medium ${isHighRisk ? 'text-red-700' : 'text-slate-900'}`}>
                            {answerText}
                          </p>
                          {answer.note && (
                            <p className="text-slate-500 text-xs mt-1 italic">
                              备注: {answer.note}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-lg">
                    <p className="text-slate-500">尚未回答任何问题</p>
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                  <span>
                    <span className="font-medium">ID:</span> {selectedRecord.id}
                  </span>
                  <span>
                    <span className="font-medium">用户 ID:</span> {selectedRecord.user_id}
                  </span>
                  {selectedRecord.completed_at && (
                    <span>
                      <span className="font-medium">完成时间:</span> {formatDateTime(selectedRecord.completed_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
