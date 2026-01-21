'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GolfBusinessPage() {
  return (
    <CompanyLayout
      title="ゴルフツーリズム"
      titleEn="Golf Tourism"
      breadcrumb={[
        { label: '事業領域', path: '/business' },
        { label: 'ゴルフツーリズム' }
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600 leading-relaxed">
            新島交通のゴルフツーリズムは、通常では予約困難な会員制名門ゴルフ場への特別アクセスを提供。
            関西・関東の20以上のプレミアムコースと提携し、送迎、宿泊、食事まで完全サポートいたします。
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '20+', label: '提携名門コース' },
            { value: 'VIP', label: '待遇保証' },
            { value: '1,000+', label: '年間利用者' },
            { value: '100%', label: '予約成功率' },
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-green-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
            サービス特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: '名門コースアクセス', features: ['会員紹介不要', 'トーナメントコース', '完全予約保証'] },
              { title: 'VIPサービス', features: ['専属キャディ', 'ラウンジ利用', '優先スタート'] },
              { title: '送迎・宿泊手配', features: ['空港送迎', '高級旅館手配', '温泉付きプラン'] },
              { title: '多言語対応', features: ['中国語サポート', '英語対応可', '通訳同行'] },
            ].map((service, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-3">{service.title}</h3>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center py-8 bg-green-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">ゴルフツアーのお問い合わせ</h3>
          <Link
            href="/?page=golf"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition"
          >
            詳細を見る <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </CompanyLayout>
  );
}
