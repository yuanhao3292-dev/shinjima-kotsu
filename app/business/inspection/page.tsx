'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CompanyLayout from '@/components/CompanyLayout';
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  Building,
  Building2,
  Cpu,
  Stethoscope,
  TrendingUp,
  Users,
  Award,
  Globe,
  Briefcase,
  Star,
  Quote,
  Calendar,
  MapPin,
  Sparkles,
  Target,
  Handshake,
  GraduationCap,
  Lightbulb,
  BarChart3,
  Shield,
  Clock,
  Languages
} from 'lucide-react';

// 视察领域数据
const inspectionFields = [
  {
    icon: Factory,
    title: '製造業',
    titleEn: 'Manufacturing',
    description: '世界に誇る日本の「ものづくり」精神を体感',
    highlights: [
      'トヨタ生産方式（TPS）',
      'カイゼン・5S活動',
      '品質管理（QC）システム',
      '精密加工技術',
      'スマートファクトリー'
    ],
    companies: ['トヨタ自動車', 'ファナック', 'キーエンス', 'SMC'],
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=800'
  },
  {
    icon: Stethoscope,
    title: '医療・ヘルスケア',
    titleEn: 'Healthcare',
    description: '世界最高水準の医療システムと介護モデル',
    highlights: [
      '病院経営・マネジメント',
      '最先端医療機器',
      '介護施設運営',
      '健診センター',
      'リハビリテーション'
    ],
    companies: ['徳洲会グループ', '湘南美容クリニック', 'ニチイ学館'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800'
  },
  {
    icon: Cpu,
    title: 'テクノロジー',
    titleEn: 'Technology',
    description: '日本発のイノベーションと最先端技術',
    highlights: [
      'AI・機械学習',
      '産業用ロボティクス',
      '半導体製造',
      'IoT・スマートシティ',
      '自動運転技術'
    ],
    companies: ['ソフトバンク', 'ソニー', '東京エレクトロン', 'デンソー'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800'
  },
  {
    icon: Building,
    title: '小売・サービス',
    titleEn: 'Retail & Service',
    description: '世界が注目する「おもてなし」の真髄',
    highlights: [
      '店舗運営・VMD',
      'カスタマーサービス',
      'サプライチェーン',
      'フードサービス',
      'ホスピタリティ'
    ],
    companies: ['イオン', 'セブン&アイ', 'ファーストリテイリング', '星野リゾート'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800'
  }
];

// 服务特色
const serviceFeatures = [
  {
    icon: Handshake,
    title: '独占的企業ネットワーク',
    description: '通常では訪問困難な大手企業・工場へのVIPアクセス。長年培った信頼関係により実現。'
  },
  {
    icon: GraduationCap,
    title: '専門家によるアテンド',
    description: '各業界に精通した専門通訳・コーディネーターが同行。深い学びをサポート。'
  },
  {
    icon: Target,
    title: 'カスタマイズプログラム',
    description: '貴社のニーズに合わせた完全オーダーメイドの視察プログラムを設計。'
  },
  {
    icon: Shield,
    title: '機密保持の徹底',
    description: '企業秘密・視察内容の厳重な管理。NDA対応も万全。'
  }
];

// 视察流程
const processSteps = [
  { step: '01', title: 'ヒアリング', description: '視察目的・業界・人数をお伺い' },
  { step: '02', title: '企画提案', description: 'カスタマイズプランをご提案' },
  { step: '03', title: '視察先調整', description: '企業との日程・内容を調整' },
  { step: '04', title: '視察実施', description: '専門スタッフが全行程をサポート' },
  { step: '05', title: 'レポート', description: '視察レポート・フォローアップ' }
];

// 统计数据
const stats = [
  { value: '100+', label: '視察実績企業', subLabel: 'Partner Companies' },
  { value: '500+', label: '年間参加者', subLabel: 'Annual Participants' },
  { value: '15+', label: '対応業界', subLabel: 'Industries Covered' },
  { value: '95%', label: 'リピート率', subLabel: 'Repeat Rate' }
];

export default function InspectionBusinessPage() {
  return (
    <CompanyLayout
      title="ビジネス視察"
      titleEn="Business Inspection"
      breadcrumb={[
        { label: '事業領域', path: '/business' },
        { label: 'ビジネス視察' }
      ]}
    >
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 rounded-2xl -z-10" />

          <div className="py-8">
            {/* 徽章 */}
            <div className="flex items-center gap-3 mb-6">
              <span className="business-badge">
                <Sparkles size={14} />
                訪日ビジネス視察の専門家
              </span>
            </div>

            {/* 主标题 */}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              日本トップ企業への
              <br className="hidden md:block" />
              <span className="business-amber-text">特別アクセス</span>を実現
            </h2>

            {/* 副标题 */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              製造業、医療、テクノロジー、小売サービス — 世界が注目する日本企業への
              <strong className="text-slate-800">完全カスタマイズ視察ツアー</strong>を提供。
              通訳・アテンド・宿泊手配まで、ワンストップでサポートいたします。
            </p>

            {/* 核心优势标签 */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Building2, text: '大手企業アクセス' },
                { icon: Languages, text: '多言語対応' },
                { icon: Clock, text: '柔軟なスケジュール' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100"
                >
                  <item.icon size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 统计数据 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="business-stat-card business-premium-card p-6 rounded-xl text-center"
            >
              <div className="text-3xl md:text-4xl font-bold business-amber-text business-number-glow mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-800">{stat.label}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.subLabel}</div>
            </div>
          ))}
        </section>

        {/* 视察领域 */}
        <section>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 business-title-decorated">
              主要視察分野
            </h2>
            <p className="text-slate-500 mt-4 text-sm">
              Industries We Cover
            </p>
          </div>

          <div className="space-y-6">
            {inspectionFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <div
                  key={index}
                  className="business-premium-card rounded-2xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 图片 */}
                    <div className="md:w-2/5 relative h-48 md:h-auto">
                      <img
                        src={field.image}
                        alt={field.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 business-image-overlay" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white">
                          <Icon size={20} />
                          <span className="font-bold">{field.title}</span>
                          <span className="text-white/60 text-sm">/ {field.titleEn}</span>
                        </div>
                      </div>
                    </div>

                    {/* 内容 */}
                    <div className="md:w-3/5 p-6">
                      <p className="text-slate-600 mb-4">{field.description}</p>

                      {/* 亮点 */}
                      <div className="mb-4">
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                          視察ポイント
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.highlights.map((highlight, hIndex) => (
                            <span
                              key={hIndex}
                              className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-medium rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 合作企业 */}
                      <div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                          主な視察先企業
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {field.companies.map((company, cIndex) => (
                            <span
                              key={cIndex}
                              className="flex items-center gap-1.5 text-sm text-slate-600"
                            >
                              <Building2 size={12} className="text-slate-400" />
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 服务特色 */}
        <section>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 business-title-decorated">
              選ばれる理由
            </h2>
            <p className="text-slate-500 mt-4 text-sm">
              Why Choose Us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="business-premium-card p-6 rounded-xl flex gap-4"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 视察流程 */}
        <section className="business-dark-card rounded-2xl p-8 md:p-10">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-white mb-2">視察までの流れ</h2>
            <p className="text-slate-400 text-sm">From Inquiry to Inspection</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-xl font-bold text-white">{step.step}</span>
                </div>
                <h4 className="font-bold text-white mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 实绩展示 */}
        <section>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 business-title-decorated">
              視察実績
            </h2>
            <p className="text-slate-500 mt-4 text-sm">
              Past Inspection Tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: '中国大手製造企業様',
                type: '製造業視察',
                participants: '経営幹部 12名',
                duration: '5日間',
                destinations: 'トヨタ自動車、ファナック、キーエンス'
              },
              {
                title: '台湾医療グループ様',
                type: '医療視察',
                participants: '医師・経営陣 8名',
                duration: '4日間',
                destinations: '大学病院、介護施設、健診センター'
              },
              {
                title: '香港投資ファンド様',
                type: 'テクノロジー視察',
                participants: 'アナリスト 6名',
                duration: '3日間',
                destinations: 'AI企業、半導体メーカー、スタートアップ'
              }
            ].map((record, index) => (
              <div
                key={index}
                className="business-premium-card p-5 rounded-xl border-l-4 border-amber-500"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                    {record.type}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 mb-3">{record.title}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={14} className="text-slate-400" />
                    {record.participants}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    {record.duration}
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{record.destinations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 客户评价 */}
        <section className="bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">お客様の声</h2>
            <p className="text-slate-500 text-sm">Client Testimonials</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="business-quote text-slate-700 leading-relaxed mb-6">
              通常ではアクセスできない企業への訪問を実現いただき、大変有意義な視察となりました。
              専門通訳の方の知識も深く、質疑応答も充実。次回も必ずお願いしたいと思います。
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                <Users size={20} className="text-slate-500" />
              </div>
              <div>
                <div className="font-medium text-slate-900">中国製造業グループ 経営企画部長</div>
                <div className="text-sm text-slate-500">製造業視察ツアー（2024年参加）</div>
              </div>
            </div>
          </div>
        </section>

        {/* 对应语言 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { lang: '中国語', flag: '🇨🇳', desc: '普通话・繁體中文' },
            { lang: '英語', flag: '🇺🇸', desc: 'Business English' },
            { lang: '日本語', flag: '🇯🇵', desc: 'ネイティブ対応' }
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100"
            >
              <span className="text-3xl">{item.flag}</span>
              <div>
                <div className="font-medium text-slate-900">{item.lang}</div>
                <div className="text-sm text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 business-amber-gradient opacity-95" />
          <div className="relative z-10 text-center py-12 px-8">
            <h3 className="text-2xl font-bold text-white mb-3">
              視察ツアーのご相談
            </h3>
            <p className="text-amber-100 mb-8 max-w-xl mx-auto">
              貴社のニーズに合わせた最適な視察プランをご提案いたします。
              まずはお気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/?page=business"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-700 font-bold rounded-full hover:bg-amber-50 transition shadow-lg shadow-amber-900/20"
              >
                お問い合わせ <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:info@niijima-koutsu.jp"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white/50 hover:bg-white/10 transition"
              >
                メールでのお問い合わせ
              </a>
            </div>
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
