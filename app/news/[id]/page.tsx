'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/PublicLayout';
import { localizeText } from '@/lib/utils/text-converter';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

interface NewsDetail {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: 'announcement' | 'press' | 'service';
  image_url: string | null;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

const categoryLabels: Record<string, Record<Language, string>> = {
  announcement: { ja: 'お知らせ', 'zh-TW': '公告', 'zh-CN': '公告', en: 'Notice' },
  press: { ja: 'プレスリリース', 'zh-TW': '新聞稿', 'zh-CN': '新闻稿', en: 'Press' },
  service: { ja: 'サービス', 'zh-TW': '服務', 'zh-CN': '服务', en: 'Service' },
};

const detailTranslations = {
  backToList: { ja: 'ニュース一覧', 'zh-TW': '新聞列表', 'zh-CN': '新闻列表', en: 'News List' },
  backToListFull: { ja: 'ニュース一覧に戻る', 'zh-TW': '返回新聞列表', 'zh-CN': '返回新闻列表', en: 'Back to News List' },
  notFound: { ja: '記事が見つかりませんでした', 'zh-TW': '找不到該文章', 'zh-CN': '找不到该文章', en: 'Article not found' },
  noContent: { ja: '内容がありません', 'zh-TW': '暫無內容', 'zh-CN': '暂无内容', en: 'No content available' },
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language | null>(null);

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
  const t = (key: keyof typeof detailTranslations) => detailTranslations[key][lang];

  useEffect(() => {
    if (!params.id || !currentLang) return;

    fetch(`/api/news?id=${params.id}&lang=${currentLang}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data.id) {
          setNews(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id, currentLang]);

  if (loading) {
    return (
      <PublicLayout activeNav="news">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !news) {
    return (
      <PublicLayout activeNav="news">
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">{t('notFound')}</p>
          <Link href="/news" className="text-teal-600 hover:underline flex items-center gap-2">
            <ArrowLeft size={16} />
            {t('backToListFull')}
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const date = new Date(news.published_at);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  const catLabel = (categoryLabels[news.category] || categoryLabels.announcement)[lang];

  return (
    <PublicLayout activeNav="news">
      <div className="pt-28 pb-20 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            {t('backToList')}
          </Link>

          {/* Category & Date */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {catLabel}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Calendar size={14} />
              {dateStr}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-8 leading-relaxed">
            {localizeText(news.title, lang)}
          </h1>

          {/* Featured Image */}
          {news.image_url && (
            <div className="mb-10 rounded-xl overflow-hidden">
              <Image
                src={news.image_url}
                alt={news.title}
                width={800}
                height={450}
                quality={75}
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            {news.content ? (
              <div
                className="text-gray-700 leading-[2] text-base whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: localizeText(news.content, lang).replace(/\n/g, '<br/>') }}
              />
            ) : news.summary ? (
              <p className="text-gray-700 leading-relaxed">{localizeText(news.summary, lang)}</p>
            ) : (
              <p className="text-gray-400">{t('noContent')}</p>
            )}
          </div>

          {/* Back to list */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft size={16} />
              {t('backToListFull')}
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
