'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Eye,
  ThumbsUp,
  Loader2,
  ArrowLeft,
  Plus,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

// ============================================================
// i18n
// ============================================================

const T: Record<string, Record<Language, string>> = {
  title: {
    ja: 'ヘルスコミュニティ',
    'zh-CN': '健康社区',
    'zh-TW': '健康社區',
    en: 'Health Community',
    ko: '건강 커뮤니티',
  },
  subtitle: {
    ja: 'ヘルスチェックの体験をシェアしましょう',
    'zh-CN': '分享您的健康筛查体验',
    'zh-TW': '分享您的健康篩查體驗',
    en: 'Share your health screening experiences',
    ko: '건강 검진 체험을 공유해 주세요',
  },
  experience: { ja: '体験談', 'zh-CN': '体验分享', 'zh-TW': '體驗分享', en: 'Experience', ko: '체험담' },
  tip: { ja: 'ヒント', 'zh-CN': '健康贴士', 'zh-TW': '健康貼士', en: 'Health Tip', ko: '건강 팁' },
  question: { ja: '質問', 'zh-CN': '提问', 'zh-TW': '提問', en: 'Question', ko: '질문' },
  review: { ja: 'レビュー', 'zh-CN': '评价', 'zh-TW': '評價', en: 'Review', ko: '후기' },
  all: { ja: 'すべて', 'zh-CN': '全部', 'zh-TW': '全部', en: 'All', ko: '전체' },
  helpful: { ja: '参考になった', 'zh-CN': '有帮助', 'zh-TW': '有幫助', en: 'Helpful', ko: '도움이 됨' },
  views: { ja: '閲覧', 'zh-CN': '浏览', 'zh-TW': '瀏覽', en: 'views', ko: '조회' },
  shareStory: { ja: '体験をシェア', 'zh-CN': '分享故事', 'zh-TW': '分享故事', en: 'Share Your Story', ko: '체험 공유하기' },
  noStories: { ja: 'まだ投稿がありません', 'zh-CN': '暂无投稿', 'zh-TW': '暫無投稿', en: 'No stories yet', ko: '게시물이 없습니다' },
  loadMore: { ja: 'もっと見る', 'zh-CN': '加载更多', 'zh-TW': '載入更多', en: 'Load More', ko: '더 보기' },
  loading: { ja: '読み込み中...', 'zh-CN': '载入中...', 'zh-TW': '載入中...', en: 'Loading...', ko: '불러오는 중...' },
  anonymous: { ja: '匿名ユーザー', 'zh-CN': '匿名用户', 'zh-TW': '匿名用戶', en: 'Anonymous', ko: '익명 사용자' },
  back: { ja: 'ホームに戻る', 'zh-CN': '返回首页', 'zh-TW': '返回首頁', en: 'Back to Home', ko: '홈으로 돌아가기' },
};

const t = (key: string, lang: Language): string => T[key]?.[lang] ?? key;

// ============================================================
// Types
// ============================================================

interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  risk_level: string | null;
  author_display_name: string | null;
  is_anonymous: boolean;
  view_count: number;
  helpful_count: number;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  experience: 'bg-blue-100 text-blue-700',
  tip: 'bg-emerald-100 text-emerald-700',
  question: 'bg-amber-100 text-amber-700',
  review: 'bg-purple-100 text-purple-700',
};

const RISK_COLORS: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  high: 'bg-red-50 text-red-600',
};

// ============================================================
// Component
// ============================================================

export default function CommunityPage() {
  const lang = useLanguage();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async (cat: string, offset = 0) => {
    try {
      const params = new URLSearchParams({ lang, limit: '20', offset: String(offset) });
      if (cat !== 'all') params.set('category', cat);

      const res = await fetch(`/api/community/stories?${params}`);
      if (!res.ok) throw new Error('Failed to load');

      const data = await res.json();
      if (offset === 0) {
        setStories(data.stories);
      } else {
        setStories((prev) => [...prev, ...data.stories]);
      }
      setHasMore(data.hasMore);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStories(category);
  }, [category, lang]);

  const categories = ['all', 'experience', 'tip', 'question', 'review'];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{t('back', lang)}</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-white to-[#faf9f7] py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 tracking-wide">
            {t('title', lang)}
          </h1>
          <p className="text-neutral-500 mt-2 max-w-md mx-auto">
            {t('subtitle', lang)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                category === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {t(cat, lang)}
            </button>
          ))}

          <Link
            href="/community/submit"
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t('shareStory', lang)}
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
            <p className="text-neutral-500">{t('loading', lang)}</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">{t('noStories', lang)}</p>
          </div>
        ) : (
          <>
            {/* Stories Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition"
                >
                  {/* Category + Risk */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        CATEGORY_COLORS[story.category] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t(story.category, lang)}
                    </span>
                    {story.risk_level && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          RISK_COLORS[story.risk_level] || ''
                        }`}
                      >
                        {story.risk_level}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-neutral-900 mb-2 leading-snug">
                    {story.title}
                  </h3>

                  {/* Content preview */}
                  <p className="text-sm text-neutral-600 line-clamp-3 mb-3">
                    {story.content}
                  </p>

                  {/* Tags */}
                  {story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {story.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-400">
                    <span>
                      {story.is_anonymous
                        ? t('anonymous', lang)
                        : story.author_display_name || t('anonymous', lang)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {story.helpful_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {story.view_count}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchStories(category, stories.length)}
                  className="px-6 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 transition"
                >
                  {t('loadMore', lang)}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
