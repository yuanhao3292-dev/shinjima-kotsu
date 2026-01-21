'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { ArrowRight, CheckCircle2, Building2, Award, Users, Clock } from 'lucide-react';

export default function MedicalBusinessPage() {
  return (
    <CompanyLayout
      title="医療ツーリズム"
      titleEn="Medical Tourism"
      breadcrumb={[
        { label: '事業領域', path: '/business' },
        { label: '医療ツーリズム' }
      ]}
    >
      <div className="space-y-12">
        {/* 概要 */}
        <section>
          <p className="text-lg text-gray-600 leading-relaxed">
            新島交通の医療ツーリズム事業は、日本最先端の医療技術を活用した精密健診サービスを提供しています。
            徳洲会国際医療センター（TIMC）との戦略的パートナーシップにより、
            PET-CT、MRI、胃腸内視鏡など世界トップクラスの検査機器による健診をご案内いたします。
          </p>
        </section>

        {/* 実績数字 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '5,000+', label: '累計健診者数' },
            { value: '98%', label: '満足度' },
            { value: '50+', label: '提携医療機関' },
            { value: '24h', label: '予約対応' },
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* サービス内容 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            サービス内容
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: '精密健康診断',
                description: 'PET-CT、MRI、内視鏡検査など、最新設備による包括的な健診',
                features: ['早期がん発見', '脳ドック', '心臓ドック'],
              },
              {
                title: 'がん治療紹介',
                description: '陽子線治療、光免疫療法、BNCTなど最先端のがん治療',
                features: ['セカンドオピニオン', '治療計画相談', '入院手配'],
              },
              {
                title: '再生医療',
                description: '幹細胞治療、PRP療法など再生医療サービスの紹介',
                features: ['アンチエイジング', '関節治療', '美容医療'],
              },
              {
                title: '中国語サポート',
                description: '医療通訳、書類翻訳、アテンドまで完全サポート',
                features: ['医療通訳同行', '報告書翻訳', '24時間対応'],
              },
            ].map((service, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <ul className="space-y-1">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 提携医療機関 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
            主要提携医療機関
          </h2>

          <div className="p-6 bg-slate-900 text-white rounded-2xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400"
                  alt="TIMC OSAKA"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
              <div className="flex-1">
                <div className="text-blue-400 text-sm font-medium mb-2">公式予約代理店</div>
                <h3 className="text-2xl font-bold mb-2">TIMC OSAKA</h3>
                <p className="text-gray-300 text-sm mb-4">
                  徳洲会国際医療センター（TIMC）は、日本最大級の医療グループである徳洲会が運営する
                  外国人専用の健診センターです。最新の医療機器と多言語対応スタッフで、
                  快適な健診体験を提供しています。
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs">JR大阪駅直結</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs">JP TOWER OSAKA 11F</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs">中国語対応</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 bg-blue-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">医療サービスについてのお問い合わせ</h3>
          <p className="text-gray-600 mb-6">専門スタッフが日本語・中国語でご対応いたします</p>
          <Link
            href="/?page=medical"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition"
          >
            詳細を見る <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </CompanyLayout>
  );
}
