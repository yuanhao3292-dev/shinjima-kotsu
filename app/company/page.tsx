'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyLayout, { navigationStructure } from '@/components/CompanyLayout';
import { ChevronRight } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const pageTranslations = {
  intro: {
    ja: '新島交通株式会社は、2020年の創業以来、「華人旅客と日本の高品質な観光資源をつなぐ架け橋」として、医療ツーリズム、ゴルフツーリズム、ビジネス視察の三大領域で事業を展開しております。',
    'zh-TW': '新島交通株式會社自2020年創業以來，以「連結華人旅客與日本高品質觀光資源的橋樑」為使命，在醫療旅遊、高爾夫旅遊、商務考察三大領域展開事業。',
    'zh-CN': '新岛交通株式会社自2020年创业以来，以"连接华人旅客与日本高品质观光资源的桥梁"为使命，在医疗旅游、高尔夫旅游、商务考察三大领域展开事业。',
    en: 'Since its founding in 2020, NIIJIMA KOTSU Co., Ltd. has been a bridge connecting Chinese-speaking travelers with Japan\'s premium tourism resources, operating across three major domains: medical tourism, golf tourism, and business inspections.',
  },
};

export default function CompanyIndexPage() {
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

  const companyNav = navigationStructure.find(cat => cat.basePath === '/company');

  const resolveLabel = (label: string | Record<string, string>): string => {
    if (typeof label === 'string') return label;
    return label[currentLang] || label['ja'];
  };

  return (
    <CompanyLayout
      title={{ ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company Information' }}
      titleEn="Company Information"
      breadcrumb={[{ label: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company Information' } }]}
    >
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          {companyNav?.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.path}
                className="group flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-100 transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
                  <Icon size={24} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {resolveLabel(item.label)}
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </CompanyLayout>
  );
}
