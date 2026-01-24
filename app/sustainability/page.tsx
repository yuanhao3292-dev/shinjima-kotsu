'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyLayout from '@/components/CompanyLayout';
import { Leaf, Heart, Globe, Users, ChevronRight } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  sectionPolicy: {
    ja: 'サステナビリティへの取り組み',
    'zh-TW': '永續發展理念',
    'zh-CN': '可持续发展理念',
    en: 'Our Sustainability Commitment',
  },
  policyIntro: {
    ja: '新島交通は、「持続可能な観光」を経営の柱に据え、環境・社会・ガバナンス（ESG）の観点から企業活動を推進しています。旅行業を通じて、地域社会への貢献と地球環境の保全に取り組んでまいります。',
    'zh-TW': '新島交通將「永續觀光」定為經營核心，從環境、社會、公司治理（ESG）的角度推進企業活動。透過旅遊業，致力於地方社會貢獻與地球環境保護。',
    'zh-CN': '新岛交通将"可持续观光"定为经营核心，从环境、社会、公司治理（ESG）的角度推进企业活动。通过旅游业，致力于地方社会贡献与地球环境保护。',
    en: 'NIIJIMA KOTSU places "sustainable tourism" at the core of our management, promoting corporate activities from the perspectives of Environment, Society, and Governance (ESG). Through the travel industry, we are committed to contributing to local communities and preserving the global environment.',
  },
  envTitle: {
    ja: '環境への配慮',
    'zh-TW': '環境關懷',
    'zh-CN': '环境关怀',
    en: 'Environmental Care',
  },
  envPoints: {
    ja: ['ペーパーレス化の推進', 'カーボンオフセット旅行の提案', '環境配慮型宿泊施設の優先案内'],
    'zh-TW': ['推動無紙化', '碳抵消旅行方案', '優先推薦環保住宿'],
    'zh-CN': ['推动无纸化', '碳抵消旅行方案', '优先推荐环保住宿'],
    en: ['Paperless operations', 'Carbon offset travel proposals', 'Priority eco-friendly accommodations'],
  },
  communityTitle: {
    ja: '地域貢献',
    'zh-TW': '地方創生',
    'zh-CN': '地方创生',
    en: 'Community Contribution',
  },
  communityPoints: {
    ja: ['地方創生ツアーの企画', '地域経済への還元', '伝統文化の継承支援'],
    'zh-TW': ['地方創生行程企劃', '回饋地方經濟', '傳統文化傳承支持'],
    'zh-CN': ['地方创生行程企划', '回馈地方经济', '传统文化传承支持'],
    en: ['Regional revitalization tours', 'Economic contribution to local areas', 'Traditional culture preservation'],
  },
  diversityTitle: {
    ja: '多様性の尊重',
    'zh-TW': '多元包容',
    'zh-CN': '多元包容',
    en: 'Diversity & Inclusion',
  },
  diversityPoints: {
    ja: ['多国籍チームの構成', '女性活躍の推進', 'バリアフリー観光の提案'],
    'zh-TW': ['多國籍團隊組成', '推動女性活躍', '無障礙旅遊方案'],
    'zh-CN': ['多国籍团队组成', '推动女性活跃', '无障碍旅游方案'],
    en: ['Multinational team composition', 'Women\'s empowerment', 'Barrier-free tourism proposals'],
  },
  responsibleTitle: {
    ja: '責任ある観光',
    'zh-TW': '負責任旅遊',
    'zh-CN': '负责任旅游',
    en: 'Responsible Tourism',
  },
  responsiblePoints: {
    ja: ['オーバーツーリズム対策', '地域住民との共生', '文化財保護への貢献'],
    'zh-TW': ['過度觀光對策', '與當地居民共生', '文化財保護貢獻'],
    'zh-CN': ['过度观光对策', '与当地居民共生', '文化遗产保护贡献'],
    en: ['Over-tourism countermeasures', 'Coexistence with local residents', 'Cultural heritage preservation'],
  },
  viewDetails: {
    ja: '詳細を見る',
    'zh-TW': '查看詳情',
    'zh-CN': '查看详情',
    en: 'View Details',
  },
  sectionSDGs: {
    ja: 'SDGsへの貢献',
    'zh-TW': 'SDGs貢獻',
    'zh-CN': 'SDGs贡献',
    en: 'SDGs Contributions',
  },
  sdgsIntro: {
    ja: '当社の事業活動は、以下のSDGs（持続可能な開発目標）に貢献しています。',
    'zh-TW': '本公司的事業活動對以下SDGs（永續發展目標）有所貢獻。',
    'zh-CN': '本公司的事业活动对以下SDGs（可持续发展目标）有所贡献。',
    en: 'Our business activities contribute to the following Sustainable Development Goals (SDGs).',
  },
  sdg3: {
    ja: 'すべての人に健康と福祉を',
    'zh-TW': '健康與福祉',
    'zh-CN': '健康与福祉',
    en: 'Good Health and Well-being',
  },
  sdg8: {
    ja: '働きがいも経済成長も',
    'zh-TW': '體面工作和經濟增長',
    'zh-CN': '体面工作和经济增长',
    en: 'Decent Work and Economic Growth',
  },
  sdg11: {
    ja: '住み続けられるまちづくりを',
    'zh-TW': '永續城市和社區',
    'zh-CN': '可持续城市和社区',
    en: 'Sustainable Cities and Communities',
  },
  sdg12: {
    ja: 'つくる責任つかう責任',
    'zh-TW': '負責任消費與生產',
    'zh-CN': '负责任消费与生产',
    en: 'Responsible Consumption and Production',
  },
  sdg17: {
    ja: 'パートナーシップで目標を達成しよう',
    'zh-TW': '促進目標實現的夥伴關係',
    'zh-CN': '促进目标实现的伙伴关系',
    en: 'Partnerships for the Goals',
  },
};

export default function SustainabilityPage() {
  const [currentLang, setCurrentLang] = useState<Language>('ja');

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
  }, []);

  const t = (key: keyof typeof pageTranslations) => pageTranslations[key][currentLang];

  const policyCards = [
    {
      icon: Leaf,
      color: 'green',
      title: t('envTitle') as string,
      titleEn: 'Environment',
      points: t('envPoints') as string[],
    },
    {
      icon: Heart,
      color: 'rose',
      title: t('communityTitle') as string,
      titleEn: 'Community',
      points: t('communityPoints') as string[],
      link: '/sustainability/community',
    },
    {
      icon: Users,
      color: 'blue',
      title: t('diversityTitle') as string,
      titleEn: 'Diversity & Inclusion',
      points: t('diversityPoints') as string[],
    },
    {
      icon: Globe,
      color: 'amber',
      title: t('responsibleTitle') as string,
      titleEn: 'Responsible Tourism',
      points: t('responsiblePoints') as string[],
    },
  ];

  const sdgs = [
    { num: 3, label: t('sdg3'), color: 'bg-green-500' },
    { num: 8, label: t('sdg8'), color: 'bg-red-600' },
    { num: 11, label: t('sdg11'), color: 'bg-amber-500' },
    { num: 12, label: t('sdg12'), color: 'bg-yellow-600' },
    { num: 17, label: t('sdg17'), color: 'bg-blue-800' },
  ];

  return (
    <CompanyLayout
      title={{ ja: 'サステナビリティ', 'zh-TW': '永續發展', 'zh-CN': '可持续发展', en: 'Sustainability' }}
      titleEn="Sustainability"
      breadcrumb={[{ label: { ja: 'サステナビリティ', 'zh-TW': '永續發展', 'zh-CN': '可持续发展', en: 'Sustainability' } }]}
    >
      <div className="space-y-12">
        {/* トップメッセージ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
            {t('sectionPolicy')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {t('policyIntro')}
          </p>
        </section>

        {/* 方針カード */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policyCards.map((item, index) => {
            const Icon = item.icon;
            const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
              green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
              rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200' },
              blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
              amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' },
            };
            const colors = colorClasses[item.color];

            return (
              <div key={index} className={`p-6 rounded-xl border ${colors.bg} ${colors.border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Icon size={24} className={colors.icon} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 uppercase">{item.titleEn}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {item.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                {item.link && (
                  <Link
                    href={item.link}
                    className={`inline-flex items-center gap-1 text-sm font-medium ${colors.icon} hover:underline`}
                  >
                    {t('viewDetails')} <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </section>

        {/* SDGs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-600">
            {t('sectionSDGs')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('sdgsIntro')}
          </p>
          <div className="flex flex-wrap gap-3">
            {sdgs.map((sdg, index) => (
              <div
                key={index}
                className={`${sdg.color} text-white px-4 py-2 rounded-lg text-sm font-medium`}
              >
                SDG {sdg.num}
              </div>
            ))}
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
