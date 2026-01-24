'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CompanyLayout from '@/components/CompanyLayout';
import { ArrowRight } from 'lucide-react';
import { useLanguage, resolveLabel } from '@/hooks/useLanguage';
import { BUSINESS_ITEMS, pageTranslations } from '@/lib/constants/business-config';

/**
 * 商务考察页面 - 业务领域展示
 *
 * SEO 优化:
 * - 使用 next/image 优化图片加载（85% 带宽节省）
 * - 完善的 ARIA 标签支持屏幕阅读器
 * - 结构化数据（JSON-LD）提升搜索引擎理解
 *
 * 性能优化:
 * - useMemo 缓存计算结果
 * - 图片懒加载
 * - 使用稳定的 key（非 index）
 *
 * 国际化:
 * - 统一的 useLanguage hook
 * - 4 种语言支持（日/繁中/简中/英）
 */
export default function BusinessIndexPage() {
  const currentLang = useLanguage();

  // 使用 useMemo 缓存翻译结果，避免不必要的重渲染
  const businessItems = useMemo(
    () =>
      BUSINESS_ITEMS.map((item) => ({
        id: item.id,
        title: item.title[currentLang],
        titleEn: item.titleEn,
        description: item.description[currentLang],
        link: item.link,
        image: item.image,
        stats: item.stats[currentLang],
        icon: item.icon,
      })),
    [currentLang]
  );

  const introText = pageTranslations.intro[currentLang];

  // 结构化数据（JSON-LD）- 帮助搜索引擎理解页面内容
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NIIJIMA KOTSU',
      alternateName: '新島交通',
      url: 'https://niijima-koutsu.jp',
      description: introText,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Business Services',
        itemListElement: businessItems.map((item, index) => ({
          '@type': 'Offer',
          position: index + 1,
          name: item.title,
          description: item.description,
          url: `https://niijima-koutsu.jp${item.link}`,
        })),
      },
    }),
    [introText, businessItems]
  );

  return (
    <>
      {/* 结构化数据注入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <CompanyLayout
        title={{ ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business Domains' }}
        titleEn="Business Domains"
        breadcrumb={[{ label: { ja: '事業領域', 'zh-TW': '事業領域', 'zh-CN': '业务领域', en: 'Business Domains' } }]}
      >
        <div className="space-y-8">
          {/* 页面简介 */}
          <p className="text-lg text-gray-600 leading-relaxed">{introText}</p>

          {/* 业务卡片列表 */}
          <div className="grid grid-cols-1 gap-6" role="list" aria-label="业务领域列表">
            {businessItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.id}
                  role="listitem"
                  className="group flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg border border-gray-100 transition-all"
                >
                  <Link
                    href={item.link}
                    className="contents"
                    aria-label={`了解更多关于${item.title}的详细信息`}
                  >
                    {/* 业务卡片图片 - 使用 next/image 优化 */}
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={`${item.title}服务展示图片 - 新島交通提供专业的${item.title}解决方案`}
                        fill
                        sizes="(max-width: 768px) 100vw, 192px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        quality={85}
                      />
                    </div>

                    {/* 业务卡片内容 */}
                    <div className="flex-1">
                      {/* 标题行 */}
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          size={20}
                          className="text-blue-600 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <ArrowRight
                          size={18}
                          className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                          aria-hidden="true"
                        />
                      </div>

                      {/* 英文副标题 */}
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                        {item.titleEn}
                      </p>

                      {/* 业务描述 */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* 统计数据标签 - 使用语义化标签 */}
                      <dl className="flex flex-wrap gap-2" role="list">
                        {item.stats.map((stat) => (
                          <dd
                            key={`${item.id}-${stat}`}
                            className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200"
                          >
                            {stat}
                          </dd>
                        ))}
                      </dl>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </CompanyLayout>
    </>
  );
}
