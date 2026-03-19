'use client';

import { useEffect } from 'react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const t: Record<string, Record<Language, string>> = {
  title: {
    ja: 'エラーが発生しました',
    'zh-TW': '發生錯誤',
    'zh-CN': '发生错误',
    en: 'Something went wrong',
  },
  desc: {
    ja: 'ページの読み込み中にエラーが発生しました。もう一度お試しください。',
    'zh-TW': '頁面載入時發生錯誤，請重試。',
    'zh-CN': '页面加载时发生错误，请重试。',
    en: 'An error occurred while loading the page. Please try again.',
  },
  retry: {
    ja: '再試行',
    'zh-TW': '重試',
    'zh-CN': '重试',
    en: 'Try again',
  },
  home: {
    ja: 'トップページに戻る',
    'zh-TW': '返回首頁',
    'zh-CN': '返回首页',
    en: 'Go to homepage',
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useLanguage();

  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl text-gray-300">⚠</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {t.title[lang]}
        </h1>
        <p className="text-gray-500">{t.desc[lang]}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.retry[lang]}
          </button>
          <a
            href="/"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t.home[lang]}
          </a>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
