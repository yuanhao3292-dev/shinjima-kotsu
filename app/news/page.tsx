'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  Calendar,
  ChevronRight,
  Newspaper,
  Megaphone,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bell,
  Loader2,
} from 'lucide-react';

// 新闻分类定义
type NewsCategory = 'all' | 'announcement' | 'press' | 'service';

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  category: 'announcement' | 'press' | 'service';
  image_url: string | null;
  is_featured: boolean;
  published_at: string;
}

interface NewsStats {
  all: number;
  announcement: number;
  press: number;
  service: number;
}

// 分类配置
const categoryConfig = {
  all: {
    label: 'すべて',
    labelEn: 'All',
    color: 'bg-slate-900 text-white',
    lightColor: 'bg-slate-100 text-slate-700',
    icon: Newspaper
  },
  announcement: {
    label: 'お知らせ',
    labelEn: 'Announcements',
    color: 'bg-blue-600 text-white',
    lightColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: Bell
  },
  press: {
    label: 'プレスリリース',
    labelEn: 'Press Releases',
    color: 'bg-emerald-600 text-white',
    lightColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: Megaphone
  },
  service: {
    label: 'サービス',
    labelEn: 'Services',
    color: 'bg-amber-500 text-white',
    lightColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: Sparkles
  },
};

// 分类日文名映射
const categoryLabels: Record<string, string> = {
  announcement: 'お知らせ',
  press: 'プレスリリース',
  service: 'サービス',
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 加载新闻数据
  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/news?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNewsList(data.news || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Load news error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 精选新闻（有图片的）
  const featuredNews = useMemo(() => {
    return newsList.filter(news => news.is_featured && news.image_url);
  }, [newsList]);

  // 分页
  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const paginatedNews = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 切换分类时重置页码
  const handleCategoryChange = (category: NewsCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  // 判断是否为新消息（7天内）
  const isNewNews = (dateString: string) => {
    const publishDate = new Date(dateString);
    const now = new Date();
    const diffDays = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">

        {/* Hero Section - 与网站风格统一的大气设计 */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          {/* 背景图片 */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
          </div>

          {/* 装饰元素 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          {/* 内容 */}
          <div className="relative z-10 container mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <Newspaper size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">News Room</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              ニュースルーム
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              新島交通の最新情報、プレスリリース、<br className="hidden md:block" />
              サービスに関するお知らせをご覧いただけます
            </p>

            {/* 面包屑 */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-8">
              <Link href="/" className="hover:text-white transition">ホーム</Link>
              <ChevronRight size={14} />
              <span className="text-gray-300">ニュースルーム</span>
            </div>
          </div>

          {/* 向下滚动提示 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* 精选新闻 Section */}
        {!loading && featuredNews.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-8 bg-blue-600 rounded-full" />
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">注目のニュース</h2>
                  <p className="text-sm text-gray-500">Featured News</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredNews.slice(0, 3).map((news, index) => (
                  <article
                    key={news.id}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                      index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                  >
                    {/* 背景图片 */}
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-[400px]' : 'h-[200px]'}`}>
                      <img
                        src={news.image_url!}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>

                    {/* 内容 */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          categoryConfig[news.category].lightColor
                        }`}>
                          {categoryLabels[news.category]}
                        </span>
                        {isNewNews(news.published_at) && (
                          <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-white mb-2 group-hover:text-blue-300 transition-colors ${
                        index === 0 ? 'text-2xl' : 'text-lg'
                      }`}>
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Calendar size={14} />
                        <span>{formatDate(news.published_at)}</span>
                      </div>
                    </div>

                    {/* Hover 效果 */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <ArrowRight size={18} className="text-white" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 新闻一览 Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">

            {/* 分类筛选器 */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-slate-900 rounded-full" />
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">ニュース一覧</h2>
                  <p className="text-sm text-gray-500">All News</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {(Object.keys(categoryConfig) as NewsCategory[]).map((key) => {
                  const config = categoryConfig[key];
                  const Icon = config.icon;
                  const isActive = selectedCategory === key;
                  const count = stats ? (key === 'all' ? stats.all : stats[key]) : 0;

                  return (
                    <button
                      key={key}
                      onClick={() => handleCategoryChange(key)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? config.color + ' shadow-lg shadow-slate-200'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{config.label}</span>
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        isActive ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 新闻列表 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">読み込み中...</p>
                </div>
              ) : paginatedNews.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {paginatedNews.map((news, index) => {
                    const config = categoryConfig[news.category];
                    const Icon = config.icon;

                    return (
                      <article
                        key={news.id}
                        className="group p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* 日期 */}
                          <div className="flex items-center gap-3 md:w-32 flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                              <Calendar size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {formatDate(news.published_at).split('.').slice(1).join('/')}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(news.published_at).split('.')[0]}
                              </div>
                            </div>
                          </div>

                          {/* 分类标签 */}
                          <div className="flex items-center gap-2 md:w-36 flex-shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${config.lightColor}`}>
                              <Icon size={12} />
                              {categoryLabels[news.category]}
                            </span>
                            {isNewNews(news.published_at) && (
                              <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-lg">
                              {news.title}
                            </h3>
                            {news.summary && (
                              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {news.summary}
                              </p>
                            )}
                          </div>

                          {/* 箭头 */}
                          <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-600 transition-all duration-300 flex-shrink-0">
                            <ChevronRight
                              size={20}
                              className="text-gray-400 group-hover:text-white transition-colors"
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Newspaper size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">該当するニュースがありません</p>
                </div>
              )}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} className="rotate-180" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <TrendingUp size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Stay Updated</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              最新情報をお見逃しなく
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              新島交通の最新サービスや特別プランの情報をいち早くお届けします
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                サービス一覧を見る
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                会社について
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
