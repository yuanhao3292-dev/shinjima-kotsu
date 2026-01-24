'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PublicLayout from './PublicLayout';
import {
  ChevronRight,
  Building2,
  MessageSquare,
  FileText,
  History,
  Users,
  MapPin,
  Briefcase,
  Heart,
  Stethoscope,
  Globe,
  Leaf,
  Newspaper,
  ExternalLink
} from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const navigationStructure = [
  {
    title: { ja: '企業情報', 'zh-TW': '企業資訊', 'zh-CN': '企业信息', en: 'Company' } as Record<Language, string>,
    titleEn: 'Company',
    basePath: '/company',
    items: [
      { label: { ja: 'トップメッセージ', 'zh-TW': '社長致辭', 'zh-CN': '社长致辞', en: 'CEO Message' } as Record<Language, string>, path: '/company/message', icon: MessageSquare },
      { label: { ja: '会社概要', 'zh-TW': '公司概況', 'zh-CN': '公司概况', en: 'Company Profile' } as Record<Language, string>, path: '/company/profile', icon: FileText },
      { label: { ja: '沿革', 'zh-TW': '發展歷程', 'zh-CN': '发展历程', en: 'History' } as Record<Language, string>, path: '/company/history', icon: History },
      { label: { ja: '組織体制', 'zh-TW': '組織架構', 'zh-CN': '组织架构', en: 'Organization' } as Record<Language, string>, path: '/company/organization', icon: Users },
      { label: { ja: '所在地', 'zh-TW': '辦公據點', 'zh-CN': '办公地点', en: 'Access' } as Record<Language, string>, path: '/company/access', icon: MapPin },
    ]
  },
  {
    title: { ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business' } as Record<Language, string>,
    titleEn: 'Business',
    basePath: '/business',
    items: [
      { label: { ja: '医療ツーリズム', 'zh-TW': '醫療觀光', 'zh-CN': '医疗旅游', en: 'Medical Tourism' } as Record<Language, string>, path: '/business/medical', icon: Stethoscope },
      { label: { ja: 'ゴルフツーリズム', 'zh-TW': '高爾夫旅遊', 'zh-CN': '高尔夫旅游', en: 'Golf Tourism' } as Record<Language, string>, path: '/business/golf', icon: Globe },
      { label: { ja: 'ガイドパートナー', 'zh-TW': '導遊合夥人', 'zh-CN': '导游合伙人', en: 'Guide Partners' } as Record<Language, string>, path: '/business/partner', icon: Users },
    ]
  },
  {
    title: { ja: 'サステナビリティ', 'zh-TW': '永續發展', 'zh-CN': '可持续发展', en: 'Sustainability' } as Record<Language, string>,
    titleEn: 'Sustainability',
    basePath: '/sustainability',
    items: [
      { label: { ja: 'サステナビリティ方針', 'zh-TW': '永續發展方針', 'zh-CN': '可持续发展方针', en: 'Sustainability Policy' } as Record<Language, string>, path: '/sustainability', icon: Leaf },
      { label: { ja: '地域貢献', 'zh-TW': '地方創生', 'zh-CN': '地方创生', en: 'Community' } as Record<Language, string>, path: '/sustainability/community', icon: Heart },
    ]
  },
  {
    title: { ja: 'ニュースルーム', 'zh-TW': '新聞室', 'zh-CN': '新闻室', en: 'Newsroom' } as Record<Language, string>,
    titleEn: 'News',
    basePath: '/news',
    items: [
      { label: { ja: 'お知らせ', 'zh-TW': '最新消息', 'zh-CN': '最新消息', en: 'News' } as Record<Language, string>, path: '/news', icon: Newspaper },
    ]
  },
];

const layoutTranslations = {
  home: { ja: 'ホーム', 'zh-TW': '首頁', 'zh-CN': '首页', en: 'Home' } as Record<Language, string>,
};

interface CompanyLayoutProps {
  children: React.ReactNode;
  title: string | Record<Language, string>;
  titleEn?: string;
  breadcrumb?: { label: string | Record<Language, string>; path?: string }[];
}

export default function CompanyLayout({ children, title, titleEn, breadcrumb }: CompanyLayoutProps) {
  const pathname = usePathname();
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

  const currentCategory = navigationStructure.find(cat =>
    cat.items.some(item => pathname === item.path) || pathname === cat.basePath
  );

  const resolveLabel = (label: string | Record<Language, string>): string => {
    if (typeof label === 'string') return label;
    return label[currentLang] || label['ja'];
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Title */}
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-6 py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/" className="hover:text-white transition">{layoutTranslations.home[currentLang]}</Link>
              {breadcrumb?.map((item, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={14} />
                  {item.path ? (
                    <Link href={item.path} className="hover:text-white transition">{resolveLabel(item.label)}</Link>
                  ) : (
                    <span className="text-gray-300">{resolveLabel(item.label)}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold">{resolveLabel(title)}</h1>
            {titleEn && <p className="text-gray-400 mt-2 text-sm uppercase tracking-wider">{titleEn}</p>}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Side Navigation */}
            <aside className="lg:w-72 flex-shrink-0">
              <nav className="sticky top-24 space-y-8">
                {navigationStructure.map((category, catIndex) => {
                  const isCurrentCategory = currentCategory?.basePath === category.basePath;

                  return (
                    <div key={catIndex}>
                      <div className={`mb-3 pb-2 border-b-2 ${isCurrentCategory ? 'border-blue-600' : 'border-gray-200'}`}>
                        <h3 className={`font-bold ${isCurrentCategory ? 'text-blue-600' : 'text-gray-900'}`}>
                          {category.title[currentLang]}
                        </h3>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{category.titleEn}</p>
                      </div>

                      <ul className="space-y-1">
                        {category.items.map((item, itemIndex) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.path;

                          return (
                            <li key={itemIndex}>
                              <Link
                                href={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                  isActive
                                    ? 'bg-blue-600 text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                                <span>{item.label[currentLang]}</span>
                                {!isActive && <ChevronRight size={14} className="ml-auto text-gray-300" />}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export { navigationStructure };
export type { Language };
