'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { ArrowRight, CheckCircle2, Users, Zap, DollarSign, Shield } from 'lucide-react';

export default function PartnerBusinessPage() {
  return (
    <CompanyLayout
      title="ガイドパートナー"
      titleEn="Guide Partner Program"
      breadcrumb={[
        { label: '事業領域', path: '/business' },
        { label: 'ガイドパートナー' }
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600 leading-relaxed">
            在日華人ガイド向けのホワイトラベルソリューション。旅行会社レベルのリソースと
            AIツールを提供し、個人ガイドのビジネス成長をサポートします。
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '3,000+', label: 'パートナー数' },
            { value: '最大30%', label: 'コミッション' },
            { value: '24h', label: 'AIサポート' },
            { value: '¥0', label: '初期費用' },
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-orange-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-orange-600">
            プログラム特典
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: 'AIツール', features: ['AI自動見積もり', 'ホワイトラベルページ', '予約管理システム'] },
              { icon: DollarSign, title: '高還元率', features: ['最大30%コミッション', '月次決済', '紹介ボーナス'] },
              { icon: Users, title: 'リソース提供', features: ['医療・ゴルフ資源', 'VIP枠優先アクセス', '研修サポート'] },
              { icon: Shield, title: '安心保証', features: ['旅行業許可対応', '保険サポート', '24時間バックアップ'] },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Icon size={20} className="text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={14} className="text-orange-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="text-center py-8 bg-orange-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">パートナー登録</h3>
          <p className="text-gray-600 mb-6">初期費用無料でスタート可能</p>
          <Link
            href="/guide-partner"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition"
          >
            詳細を見る <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </CompanyLayout>
  );
}
