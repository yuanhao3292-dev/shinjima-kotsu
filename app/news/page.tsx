'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { localizeText } from '@/lib/utils/text-converter';
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

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

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
    labels: { ja: 'すべて', 'zh-TW': '全部', 'zh-CN': '全部', en: 'All' },
    color: 'bg-slate-900 text-white',
    lightColor: 'bg-slate-100 text-slate-700',
    icon: Newspaper
  },
  announcement: {
    labels: { ja: 'お知らせ', 'zh-TW': '公告', 'zh-CN': '公告', en: 'Notice' },
    color: 'bg-blue-600 text-white',
    lightColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: Bell
  },
  press: {
    labels: { ja: 'プレスリリース', 'zh-TW': '新聞稿', 'zh-CN': '新闻稿', en: 'Press' },
    color: 'bg-emerald-600 text-white',
    lightColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: Megaphone
  },
  service: {
    labels: { ja: 'サービス', 'zh-TW': '服務', 'zh-CN': '服务', en: 'Service' },
    color: 'bg-amber-500 text-white',
    lightColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: Sparkles
  },
};

// 页面翻译
const pageTranslations = {
  heroTitle: { ja: 'ニュースルーム', 'zh-TW': '新聞中心', 'zh-CN': '新闻中心', en: 'News Room' },
  heroSubtitle: {
    ja: '新島交通の最新情報、プレスリリース、\nサービスに関するお知らせをご覧いただけます',
    'zh-TW': '查看新島交通的最新消息、\n新聞稿和服務公告',
    'zh-CN': '查看新岛交通的最新消息、\n新闻稿和服务公告',
    en: 'Latest news, press releases,\nand service announcements',
  },
  breadcrumbHome: { ja: 'ホーム', 'zh-TW': '首頁', 'zh-CN': '首页', en: 'Home' },
  breadcrumbNews: { ja: 'ニュースルーム', 'zh-TW': '新聞中心', 'zh-CN': '新闻中心', en: 'News Room' },
  featuredTitle: { ja: '注目のニュース', 'zh-TW': '精選新聞', 'zh-CN': '精选新闻', en: 'Featured News' },
  featuredSubtitle: { ja: 'Featured News', 'zh-TW': 'Featured News', 'zh-CN': 'Featured News', en: 'Featured News' },
  allNewsTitle: { ja: 'ニュース一覧', 'zh-TW': '新聞一覽', 'zh-CN': '新闻一览', en: 'All News' },
  allNewsSubtitle: { ja: 'All News', 'zh-TW': 'All News', 'zh-CN': 'All News', en: 'All News' },
  loading: { ja: '読み込み中...', 'zh-TW': '載入中...', 'zh-CN': '加载中...', en: 'Loading...' },
  noNews: { ja: '該当するニュースがありません', 'zh-TW': '沒有相關新聞', 'zh-CN': '没有相关新闻', en: 'No news found' },
  ctaTitle: { ja: '最新情報をお見逃しなく', 'zh-TW': '不要錯過最新消息', 'zh-CN': '不要错过最新消息', en: "Don't Miss the Latest" },
  ctaSubtitle: {
    ja: '新島交通の最新サービスや特別プランの情報をいち早くお届けします',
    'zh-TW': '第一時間為您提供新島交通的最新服務和特別方案資訊',
    'zh-CN': '第一时间为您提供新岛交通的最新服务和特别方案资讯',
    en: 'Get the latest service updates and special plans from Niijima Transport',
  },
  ctaServices: { ja: 'サービス一覧を見る', 'zh-TW': '查看服務列表', 'zh-CN': '查看服务列表', en: 'View Services' },
  ctaAbout: { ja: '会社について', 'zh-TW': '關於我們', 'zh-CN': '关于我们', en: 'About Us' },
  heroBadge: { ja: 'ニュースルーム', 'zh-TW': '新聞中心', 'zh-CN': '新闻中心', en: 'News Room' },
  ctaBadge: { ja: '最新情報', 'zh-TW': '最新動態', 'zh-CN': '最新动态', en: 'Stay Updated' },
  newBadge: { ja: '新着', 'zh-TW': '最新', 'zh-CN': '最新', en: 'NEW' },
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLang, setCurrentLang] = useState<Language | null>(null);
  const itemsPerPage = 5;

  // 读取语言设置
  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
    else setCurrentLang('ja');
  }, []);

  const lang: Language = currentLang || 'ja';
  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][lang];

  // 加载新闻数据（仅在语言确定后才请求）
  useEffect(() => {
    if (!currentLang) return;
    loadNews();
  }, [selectedCategory, currentLang]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('limit', '50');
      params.append('lang', currentLang!);

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
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t('heroBadge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('heroSubtitle').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br className="hidden md:block" />}</span>
              ))}
            </p>

            {/* 面包屑 */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-8">
              <Link href="/" className="hover:text-white transition">{t('breadcrumbHome')}</Link>
              <ChevronRight size={14} />
              <span className="text-gray-300">{t('breadcrumbNews')}</span>
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
                  <h2 className="text-2xl font-serif font-bold text-gray-900">{t('featuredTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('featuredSubtitle')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredNews.slice(0, 3).map((news, index) => (
                  <article
                    key={news.id}
                    onClick={() => window.location.href = `/news/${news.id}`}
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
                          {categoryConfig[news.category].labels[lang]}
                        </span>
                        {isNewNews(news.published_at) && (
                          <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold animate-pulse">
                            {t('newBadge')}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-white mb-2 group-hover:text-blue-300 transition-colors ${
                        index === 0 ? 'text-2xl' : 'text-lg'
                      }`}>
                        {localizeText(news.title, lang)}
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
                  <h2 className="text-2xl font-serif font-bold text-gray-900">{t('allNewsTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('allNewsSubtitle')}</p>
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
                      <span>{config.labels[lang]}</span>
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
                  <p className="text-gray-500">{t('loading')}</p>
                </div>
              ) : paginatedNews.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {paginatedNews.map((news, index) => {
                    const config = categoryConfig[news.category];
                    const Icon = config.icon;

                    return (
                      <article
                        key={news.id}
                        onClick={() => window.location.href = `/news/${news.id}`}
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
                              {config.labels[lang]}
                            </span>
                            {isNewNews(news.published_at) && (
                              <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold animate-pulse">
                                {t('newBadge')}
                              </span>
                            )}
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-lg">
                              {localizeText(news.title, lang)}
                            </h3>
                            {news.summary && (
                              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {localizeText(news.summary, lang)}
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
                  <p className="text-gray-500">{t('noNews')}</p>
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
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t('ctaBadge')}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              {t('ctaSubtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t('ctaServices')}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                {t('ctaAbout')}
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
