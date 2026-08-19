'use client';

import React, { useState, useEffect } from 'react';
import { Check, Circle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Language } from '@/translations';
import {
  getPackages,
  getCheckItems,
  ui,
  type ItemStatus,
} from '@/lib/data/medical-checkup-i18n';

const StatusIcon = ({ status, currentLang = 'zh-TW' }: { status: ItemStatus; partialNote?: string; currentLang?: Language }) => {
  switch (status) {
    case 'included':
      return <Check className="w-5 h-5 text-brand-600" />;
    case 'optional':
      return <Circle className="w-4 h-4 text-brand-500" />;
    case 'partial':
      return (
        <span className="text-[10px] text-brand-700 font-medium leading-tight text-center">
          {ui('partial', currentLang)}
        </span>
      );
    case 'none':
      // 「不含此项」是承载信息的图形元素，WCAG 要求 3:1。
      // neutral-300 仅 1.53:1、neutral-400 也只有 2.53:1，故用 500（4.79:1）。
      return <X className="w-4 h-4 text-neutral-500" />;
  }
};

const formatPrice = (price: number) => {
  return `¥${price.toLocaleString()}`;
};

interface PackageComparisonTableProps {
  onBookNow?: (packageSlug: string) => void;
  currentLang?: Language;
}

export default function PackageComparisonTable({ onBookNow, currentLang = 'zh-TW' }: PackageComparisonTableProps) {
  const PACKAGES = getPackages(currentLang);
  const CHECK_ITEMS = getCheckItems(currentLang);

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    CHECK_ITEMS.map(c => c.category)
  );
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 語言切換時重新展開所有分類
  useEffect(() => {
    setExpandedCategories(CHECK_ITEMS.map(c => c.category));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectedPackage = PACKAGES[selectedPackageIndex];

  // 移动端视图
  if (isMobile) {
    return (
      <div className="w-full">
        {/* 套餐选择器 - 左右滑动 */}
        <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={() => setSelectedPackageIndex(prev => prev > 0 ? prev - 1 : PACKAGES.length - 1)}
              className="p-2 rounded-full bg-neutral-200 hover:bg-neutral-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center flex-1">
              <div className={`text-lg font-bold ${selectedPackage.id === 'vip' ? 'text-brand-700' : 'text-neutral-900'}`}>
                {selectedPackage.name}
              </div>
              <div className="text-sm text-neutral-500">{selectedPackage.nameZh}</div>
              <div className={`text-xl font-bold mt-1 ${selectedPackage.id === 'vip' ? 'text-brand-700' : 'text-brand-700'}`}>
                {formatPrice(selectedPackage.price)}
              </div>
            </div>

            <button
              onClick={() => setSelectedPackageIndex(prev => prev < PACKAGES.length - 1 ? prev + 1 : 0)}
              className="p-2 rounded-full bg-neutral-200 hover:bg-neutral-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 套餐指示器 */}
          <div className="flex justify-center gap-1.5 pb-3">
            {PACKAGES.map((pkg, idx) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === selectedPackageIndex
                    ? 'bg-brand-600 w-4'
                    : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 检查项目列表 */}
        <div className="divide-y divide-neutral-200">
          {CHECK_ITEMS.map(category => (
            <div key={category.category}>
              {/* 分类标题 */}
              <div
                className="bg-neutral-200 p-3 flex items-center gap-2 cursor-pointer active:bg-neutral-200"
                onClick={() => toggleCategory(category.category)}
              >
                <span className={`transform transition-transform text-neutral-500 ${
                  expandedCategories.includes(category.category) ? 'rotate-90' : ''
                }`}>
                  ▶
                </span>
                <span className="font-bold text-neutral-700">{category.category}</span>
                <span className="text-xs text-neutral-600 ml-auto">{category.items.length}{ui('items', currentLang)}</span>
              </div>

              {/* 项目列表 */}
              {expandedCategories.includes(category.category) && (
                <div className="divide-y divide-neutral-50">
                  {category.items.map((item) => {
                    const status = item.packages[selectedPackage.id];
                    return (
                      <div
                        key={item.name}
                        className="p-3 flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          <StatusIcon status={status} currentLang={currentLang} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${
                            status === 'included' ? 'text-neutral-900' :
                            status === 'optional' ? 'text-brand-700' :
                            status === 'partial' ? 'text-brand-700' :
                            'text-neutral-600'
                          }`}>
                            {item.name}
                          </div>
                          {item.detail && (
                            <div className="text-xs text-neutral-600 mt-0.5 leading-tight">
                              {item.detail}
                            </div>
                          )}
                          {status === 'partial' && item.partialNote && (
                            <div className="text-xs text-brand-700 mt-1">
                              {item.partialNote}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-xs text-neutral-600">
                          {status === 'included' && ui('included', currentLang)}
                          {status === 'optional' && ui('optional', currentLang)}
                          {status === 'partial' && ui('partial', currentLang)}
                          {status === 'none' && '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部下单按钮 */}
        <div className="sticky bottom-0 p-4 bg-white border-t shadow-lg">
          <button
            onClick={() => onBookNow?.(selectedPackage.id)}
            className={`block w-full text-center py-3 rounded-xl font-bold text-lg transition ${
              selectedPackage.id === 'vip'
                ? 'bg-gradient-to-r from-brand-500 to-brand-700 text-black'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {ui('bookNow', currentLang)} {selectedPackage.name}
          </button>
          <div className="text-center text-xs text-neutral-600 mt-2">
            {ui('priceNote', currentLang)}
          </div>
        </div>

        {/* 图例 */}
        <div className="p-4 bg-neutral-50 border-t">
          <div className="flex gap-4 justify-center text-xs flex-wrap">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-brand-600" />
              <span>{ui('included', currentLang)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-neutral-900" />
              <span>{ui('optional', currentLang)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-brand-700 font-medium">{ui('partial', currentLang)}</span>
              <span>{ui('legendPartial', currentLang)}</span>
            </div>
            <div className="flex items-center gap-1">
              <X className="w-3 h-3 text-neutral-500" />
              <span>{ui('notIncluded', currentLang)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 桌面端视图
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px]">
        {/* 表头：套餐名称和价格 */}
        <div className="sticky top-0 z-10 bg-white border-b-2 border-neutral-200">
          <div className="grid grid-cols-7 gap-1">
            {/* 项目列 */}
            <div className="p-4 bg-neutral-50">
              <div className="text-sm font-bold text-neutral-700">{ui('checkItems', currentLang)}</div>
              <div className="text-xs text-neutral-600 mt-1">● {ui('included', currentLang)} ○ {ui('optional', currentLang)}</div>
            </div>

            {/* 套餐列 */}
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`p-3 text-center ${
                  pkg.id === 'vip'
                    ? 'brand-gradient-deep text-white'
                    : 'bg-neutral-50'
                }`}
              >
                <div className={`text-sm font-bold ${
                  pkg.id === 'vip' ? 'text-brand-300' : 'text-neutral-800'
                }`}>
                  {pkg.name}
                </div>
                <div className={`text-xs ${
                  pkg.id === 'vip' ? 'text-neutral-300' : 'text-neutral-500'
                }`}>
                  {pkg.nameZh}
                </div>
                <div className={`text-base font-bold mt-1 ${
                  pkg.id === 'vip' ? 'text-brand-300' : 'text-neutral-900'
                }`}>
                  {formatPrice(pkg.price)}
                </div>
                <button
                  onClick={() => onBookNow?.(pkg.id)}
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded ${
                    pkg.id === 'vip'
                      ? 'bg-brand-500 text-black hover:bg-brand-400'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  } transition`}
                >
                  {ui('book', currentLang)}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 表格内容 */}
        <div className="divide-y divide-neutral-200">
          {CHECK_ITEMS.map(category => (
            <div key={category.category}>
              {/* 分类标题行 */}
              <div
                className="grid grid-cols-7 gap-1 bg-neutral-200 cursor-pointer hover:bg-neutral-200 transition"
                onClick={() => toggleCategory(category.category)}
              >
                <div className="col-span-7 p-3 flex items-center gap-2">
                  <span className={`transform transition-transform ${
                    expandedCategories.includes(category.category) ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </span>
                  <span className="font-bold text-neutral-700">{category.category}</span>
                  <span className="text-xs text-neutral-600">({category.items.length}{ui('items', currentLang)})</span>
                </div>
              </div>

              {/* 检查项目行 */}
              {expandedCategories.includes(category.category) && (
                category.items.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`grid grid-cols-7 gap-1 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
                    } hover:bg-brand-50 transition`}
                  >
                    {/* 项目名称 */}
                    <div className="p-3 border-r border-neutral-200">
                      <div className="text-sm text-neutral-800">{item.name}</div>
                      {item.detail && (
                        <div className="text-xs text-neutral-600 mt-0.5 leading-tight">{item.detail}</div>
                      )}
                    </div>

                    {/* 各套餐状态 */}
                    {PACKAGES.map(pkg => (
                      <div
                        key={pkg.id}
                        className="p-3 flex items-center justify-center"
                      >
                        <StatusIcon
                          status={item.packages[pkg.id]}
                          partialNote={item.partialNote}
                          currentLang={currentLang}
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="p-4 bg-neutral-50 border-t-2 border-neutral-200">
          <div className="flex gap-6 justify-center text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-600" />
              <span className="text-neutral-600">{ui('legendIncluded', currentLang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-neutral-900" />
              <span className="text-neutral-600">{ui('legendOptional', currentLang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-brand-700 font-medium">{ui('partial', currentLang)}</span>
              <span className="text-neutral-600">{ui('legendPartial', currentLang)}</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600">{ui('legendNone', currentLang)}</span>
            </div>
          </div>
          <div className="text-center text-xs text-neutral-600 mt-3">
            {ui('priceNote', currentLang)}
          </div>
          <div className="text-center text-xs text-neutral-600 mt-1">
            {ui('source', currentLang)}：TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA (TIMC) Ver.9.5
          </div>
        </div>
      </div>
    </div>
  );
}
