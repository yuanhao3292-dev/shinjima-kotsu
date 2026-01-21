'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { Calendar, ChevronRight, Tag } from 'lucide-react';

// 模拟新闻数据
const newsData = [
  {
    id: 1,
    date: '2025.01.15',
    category: 'お知らせ',
    categoryColor: 'blue',
    title: '総合医療サービス事業を拡充 - がん治療紹介サービスを新設',
    summary: '陽子線治療、光免疫療法、BNCT（ホウ素中性子捕捉療法）の紹介サービスを開始いたしました。',
    isNew: true,
  },
  {
    id: 2,
    date: '2024.12.20',
    category: 'プレスリリース',
    categoryColor: 'green',
    title: '年末年始の営業について',
    summary: '2024年12月28日（土）～2025年1月5日（日）は休業とさせていただきます。',
    isNew: false,
  },
  {
    id: 3,
    date: '2024.11.01',
    category: 'お知らせ',
    categoryColor: 'blue',
    title: 'Webサイトをリニューアルしました',
    summary: 'より使いやすく、より多くの情報をお届けできるよう、Webサイトを全面リニューアルいたしました。',
    isNew: false,
  },
  {
    id: 4,
    date: '2024.09.15',
    category: 'プレスリリース',
    categoryColor: 'green',
    title: 'ガイドパートナープログラム 登録者3,000名突破',
    summary: '在日華人ガイド向けのパートナープログラムが、登録者3,000名を突破いたしました。',
    isNew: false,
  },
  {
    id: 5,
    date: '2024.08.01',
    category: 'サービス',
    categoryColor: 'amber',
    title: 'AI報価システム「LinkQuote」機能アップデート',
    summary: '24時間即時見積もり対応のAIシステムに、新たに多言語対応機能を追加しました。',
    isNew: false,
  },
  {
    id: 6,
    date: '2024.06.20',
    category: 'お知らせ',
    categoryColor: 'blue',
    title: '夏季の人気プランについて',
    summary: '夏休み期間中は、名門ゴルフツアーおよび精密健診の予約が混み合います。お早めのご予約をお勧めいたします。',
    isNew: false,
  },
  {
    id: 7,
    date: '2024.04.01',
    category: 'プレスリリース',
    categoryColor: 'green',
    title: '新年度のご挨拶',
    summary: '2024年度も引き続き、高品質なサービスの提供に努めてまいります。',
    isNew: false,
  },
  {
    id: 8,
    date: '2024.03.01',
    category: 'サービス',
    categoryColor: 'amber',
    title: 'ガイドパートナープログラム開始',
    summary: '在日華人ガイド向けホワイトラベルソリューションの提供を開始いたしました。',
    isNew: false,
  },
];

export default function NewsPage() {
  const categoryColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return (
    <CompanyLayout
      title="ニュースルーム"
      titleEn="News Room"
      breadcrumb={[{ label: 'ニュースルーム' }]}
    >
      <div className="space-y-8">
        <p className="text-gray-600">
          新島交通の最新情報、プレスリリース、サービスに関するお知らせをご覧いただけます。
        </p>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium">
            すべて
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition">
            お知らせ
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition">
            プレスリリース
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition">
            サービス
          </button>
        </div>

        {/* ニュースリスト */}
        <div className="divide-y divide-gray-100">
          {newsData.map((news) => (
            <article
              key={news.id}
              className="py-6 group cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* 日付 */}
                <div className="flex items-center gap-2 text-sm text-gray-500 md:w-28 flex-shrink-0">
                  <Calendar size={14} />
                  {news.date}
                </div>

                {/* カテゴリ */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[news.categoryColor]}`}>
                    {news.category}
                  </span>
                  {news.isNew && (
                    <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold">
                      NEW
                    </span>
                  )}
                </div>

                {/* タイトル */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition mb-1">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{news.summary}</p>
                </div>

                {/* 矢印 */}
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition hidden md:block" />
              </div>
            </article>
          ))}
        </div>

        {/* ページネーション */}
        <div className="flex justify-center gap-2 pt-8">
          <button className="w-10 h-10 bg-slate-900 text-white rounded-lg font-medium">1</button>
          <button className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition">2</button>
          <button className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition">3</button>
        </div>
      </div>
    </CompanyLayout>
  );
}
