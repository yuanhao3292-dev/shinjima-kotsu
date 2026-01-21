'use client';

import React from 'react';
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

// 导航结构定义
const navigationStructure = [
  {
    title: '企業情報',
    titleEn: 'Company',
    basePath: '/company',
    items: [
      { label: 'トップメッセージ', labelZh: '社長致辭', path: '/company/message', icon: MessageSquare },
      { label: '会社概要', labelZh: '公司概況', path: '/company/profile', icon: FileText },
      { label: '沿革', labelZh: '發展歷程', path: '/company/history', icon: History },
      { label: '組織体制', labelZh: '組織架構', path: '/company/organization', icon: Users },
      { label: '所在地', labelZh: '辦公據點', path: '/company/access', icon: MapPin },
    ]
  },
  {
    title: '事業領域',
    titleEn: 'Business',
    basePath: '/business',
    items: [
      { label: '医療ツーリズム', labelZh: '醫療觀光', path: '/business/medical', icon: Stethoscope },
      { label: 'ゴルフツーリズム', labelZh: '高爾夫旅遊', path: '/business/golf', icon: Globe },
      { label: 'ビジネス視察', labelZh: '商務考察', path: '/business/inspection', icon: Briefcase },
      { label: 'ガイドパートナー', labelZh: '導遊合夥人', path: '/business/partner', icon: Users },
    ]
  },
  {
    title: 'サステナビリティ',
    titleEn: 'Sustainability',
    basePath: '/sustainability',
    items: [
      { label: 'サステナビリティ方針', labelZh: '永續發展方針', path: '/sustainability', icon: Leaf },
      { label: '地域貢献', labelZh: '地方創生', path: '/sustainability/community', icon: Heart },
    ]
  },
  {
    title: 'ニュースルーム',
    titleEn: 'News',
    basePath: '/news',
    items: [
      { label: 'お知らせ', labelZh: '最新消息', path: '/news', icon: Newspaper },
    ]
  },
];

interface CompanyLayoutProps {
  children: React.ReactNode;
  title: string;
  titleEn?: string;
  breadcrumb?: { label: string; path?: string }[];
}

export default function CompanyLayout({ children, title, titleEn, breadcrumb }: CompanyLayoutProps) {
  const pathname = usePathname();

  // 找到当前所在的分类
  const currentCategory = navigationStructure.find(cat =>
    cat.items.some(item => pathname === item.path) || pathname === cat.basePath
  );

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 页面标题区 */}
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-6 py-16">
            {/* 面包屑 */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/" className="hover:text-white transition">ホーム</Link>
              {breadcrumb?.map((item, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={14} />
                  {item.path ? (
                    <Link href={item.path} className="hover:text-white transition">{item.label}</Link>
                  ) : (
                    <span className="text-gray-300">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 标题 */}
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            {titleEn && <p className="text-gray-400 mt-2 text-sm uppercase tracking-wider">{titleEn}</p>}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* 侧边导航 */}
            <aside className="lg:w-72 flex-shrink-0">
              <nav className="sticky top-24 space-y-8">
                {navigationStructure.map((category, catIndex) => {
                  const isCurrentCategory = currentCategory?.basePath === category.basePath;

                  return (
                    <div key={catIndex}>
                      {/* 分类标题 */}
                      <div className={`mb-3 pb-2 border-b-2 ${isCurrentCategory ? 'border-blue-600' : 'border-gray-200'}`}>
                        <h3 className={`font-bold ${isCurrentCategory ? 'text-blue-600' : 'text-gray-900'}`}>
                          {category.title}
                        </h3>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{category.titleEn}</p>
                      </div>

                      {/* 子项目 */}
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
                                <span>{item.label}</span>
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

            {/* 主内容 */}
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

// 导出导航结构供其他组件使用
export { navigationStructure };
