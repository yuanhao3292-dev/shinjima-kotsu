'use client';

import React from 'react';
import Link from 'next/link';
import CompanyLayout, { navigationStructure } from '@/components/CompanyLayout';
import { ChevronRight } from 'lucide-react';

export default function CompanyIndexPage() {
  // 只显示企业情报分类
  const companyNav = navigationStructure.find(cat => cat.basePath === '/company');

  return (
    <CompanyLayout
      title="企業情報"
      titleEn="Company Information"
      breadcrumb={[{ label: '企業情報' }]}
    >
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          新島交通株式会社は、2020年の創業以来、「華人旅客と日本の高品質な観光資源をつなぐ架け橋」として、
          医療ツーリズム、ゴルフツーリズム、ビジネス視察の三大領域で事業を展開しております。
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
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-500">{item.labelZh}</div>
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
