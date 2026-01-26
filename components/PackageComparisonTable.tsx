'use client';

import React, { useState, useEffect } from 'react';
import { Check, Circle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { localizeText } from '@/lib/utils/text-converter';
import type { Language } from '@/translations';

// 套餐定义 - 按PDF顺序：DWIBS → 基础 → 甄选(胃镜) → 甄选(胃肠镜) → 尊享(心脏) → VIP
const PACKAGES = [
  { id: 'dwibs', name: 'DWIBS', nameZh: '防癌篩查', price: 275000, color: 'purple', slug: 'dwibs-cancer-screening' },
  { id: 'basic', name: 'BASIC', nameZh: '基礎套餐', price: 550000, color: 'gray', slug: 'basic-checkup' },
  { id: 'select-gastro', name: 'SELECT', nameZh: '胃鏡', price: 687500, color: 'teal', slug: 'select-gastroscopy' },
  { id: 'select-both', name: 'SELECT', nameZh: '胃腸鏡', price: 825000, color: 'green', slug: 'select-gastro-colonoscopy' },
  { id: 'premium', name: 'PREMIUM', nameZh: '心臟精密', price: 825000, color: 'blue', slug: 'premium-cardiac-course' },
  { id: 'vip', name: 'VIP', nameZh: '頂級全能', price: 1512500, color: 'yellow', slug: 'vip-member-course' },
];

// 检查项目数据 - 严格按照PDF中文版核对
// ● included: 套餐包含, ○ optional: 可选(需加价), partial: 部分包含(仅做XXX), none: 不包含
type ItemStatus = 'included' | 'optional' | 'partial' | 'none';

interface CheckItem {
  name: string;
  detail?: string;
  partialNote?: string; // 部分包含时的备注
  packages: Record<string, ItemStatus>;
}

interface CheckCategory {
  category: string;
  items: CheckItem[];
}

// 严格按照PDF【中国語】TIMC健診項目 Ver.9.5 核对
const CHECK_ITEMS: CheckCategory[] = [
  {
    category: '基礎測量',
    items: [
      {
        name: '身體測量・血壓',
        detail: '身高・體重・BMI・腰圍・肥胖程度・體脂肪・血壓',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '視力・聽力',
        detail: '視力檢查(5米距離)・測聽器聽力檢查',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '眼壓・眼底',
        detail: '眼壓測量(雙眼)・眼部精密(廣角眼底攝影)・OCT(光學相干斷層掃描)',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '心電圖・動脈硬化檢查',
        detail: '靜態心電圖・心率・ABI・CAVI',
        partialNote: 'DWIBS僅做心電圖和心率',
        packages: { dwibs: 'partial', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
    ]
  },
  {
    category: '血液檢查',
    items: [
      {
        name: '血常規',
        detail: '白血球數・紅血球數・血紅蛋白・Ht・MCV・MCH・MCHC・血小板',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '白血球成像',
        detail: '嗜中性細胞・淋巴細胞・單球細胞・嗜酸性粒細胞・嗜鹼性粒細胞',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '肝功能',
        detail: '總膽紅素・AST・ALT・γ-GT・ALP・LD・CHE・Fe・TIBC・UIBC・Zn',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '血清蛋白',
        detail: '總蛋白・白蛋白・A/G比',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '糖代謝・胰腺',
        detail: '血糖・血紅蛋白・血清澱粉酶・胰島素',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '脂質',
        detail: '總膽固醇・甘油三酯・高密度脂蛋白膽固醇・低密度/非高密度脂蛋白膽固醇・小而密低密度脂蛋白・脂蛋白a',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '腎功能',
        detail: '肌酐・eGFR・尿素氮・尿酸・Cu',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '電解質',
        detail: 'Na・K・Cl・Mg・P・Ca',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '血清免疫',
        detail: 'CRP・肝炎病毒(HBs抗原・HCV抗體)',
        partialNote: 'DWIBS僅做CRP',
        packages: { dwibs: 'partial', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '甲狀腺功能',
        detail: 'FT3・FT4・TSH',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '心臟功能',
        detail: 'NTproBNP・CPK・心肌蛋白T檢查',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '凝血和纖溶系統',
        detail: 'D二聚體定量・PT',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '血型',
        detail: 'ABO式・Rh(D)式',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '胃癌風險篩查',
        detail: 'H・幽門螺旋桿菌抗體・丙種球蛋白・ABC分類',
        packages: { dwibs: 'included', basic: 'none', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '類風濕因子',
        detail: 'RF',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '腫瘤標誌物（男）',
        detail: 'CEA・AFP・CA19-9・CYFRA・ProGRP・PSA・SCC',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '腫瘤標誌物（女）',
        detail: 'CEA・AFP・CA19-9・CYFRA・ProGRP・CA125・SCC・CA15-3',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '傳染病檢查',
        detail: 'HIV・梅毒・HTLV-1・小DNA病毒B19IgM・支原體',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: '尿檢・便檢',
    items: [
      {
        name: '尿液檢查',
        detail: '蛋白・糖・尿蛋白原・膽紅素・潛血・PH・比重・酮體',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '尿沉渣',
        detail: '紅血球・白血球・鱗狀上皮・細菌・尿微量白蛋白測定',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '便潛血檢查',
        detail: '潛血反應（2回法）',
        packages: { dwibs: 'none', basic: 'none', 'select-gastro': 'none', 'select-both': 'included', premium: 'none', vip: 'included' }
      },
    ]
  },
  {
    category: '齒科檢查',
    items: [
      {
        name: '3D口腔內掃描儀',
        detail: '圖像檢查',
        packages: { dwibs: 'optional', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: 'X線檢查',
        detail: '由panorama最新設備拍攝的X線檢查',
        packages: { dwibs: 'optional', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '齒科診察',
        detail: '醫生面談',
        packages: { dwibs: 'optional', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '保養',
        detail: '去除牙垢',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: '婦科檢查（女性）',
    items: [
      {
        name: '婦科檢查',
        detail: '內診・子宮頸部細胞診・陰超・HPV・AMH',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: '內窺鏡檢查',
    items: [
      {
        name: '上部消化道內視鏡（胃鏡）',
        detail: '胃鏡檢查（鎮靜麻醉）',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'included', 'select-both': 'included', premium: 'optional', vip: 'included' }
      },
      {
        name: '下部消化道內視鏡（大腸鏡）',
        detail: '大腸鏡檢查（鎮靜麻醉）',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'included', premium: 'optional', vip: 'included' }
      },
      {
        name: '大腸息肉切除術',
        detail: '有切除條件限制',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: '超聲波檢查',
    items: [
      {
        name: '腹部超聲波',
        detail: '肝・膽・胰腺・腎臟・脾臟・腹部主動脈',
        packages: { dwibs: 'optional', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '心臟超聲波',
        detail: '心臟結構與功能評估',
        packages: { dwibs: 'optional', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '頸動脈・甲狀腺',
        detail: '頸動脈・甲狀腺超聲波',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'included', vip: 'included' }
      },
      {
        name: '腿部動脈・腿部靜脈',
        detail: '下肢動脈・靜脈超聲波',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'included', vip: 'included' }
      },
      {
        name: '乳房超聲波',
        detail: '乳腺超聲波（女性）',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: 'X線檢查',
    items: [
      {
        name: '胸部X線',
        detail: '1個方向',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '骨密度測量',
        detail: 'DEXA法（腰椎・大腿骨）',
        packages: { dwibs: 'none', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '乳腺鉬靶檢查',
        detail: '2D+3D拍攝（女性）',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: 'MRI 檢查',
    items: [
      {
        name: '腦MRI・MRA',
        detail: '腦部MRI・腦血管MRA',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'included', vip: 'included' }
      },
      {
        name: '心臟MRI',
        detail: '心臟MRI（非造影劑增強）',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'included', vip: 'included' }
      },
      {
        name: 'DWIBS全身癌篩',
        detail: 'MRI全身癌症篩查（頸部至骨盆）',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '其他MRI',
        detail: '前列腺/子宮卵巢/乳腺/MRCP等',
        packages: { dwibs: 'optional', basic: 'optional', 'select-gastro': 'optional', 'select-both': 'optional', premium: 'optional', vip: 'included' }
      },
    ]
  },
  {
    category: 'CT 檢查',
    items: [
      {
        name: '胸部CT・冠狀動脈鈣化CT',
        detail: '鈣化評分測定',
        partialNote: 'DWIBS僅做肺CT',
        packages: { dwibs: 'partial', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '腹部CT',
        detail: '腹部CT檢查及腹腔內脂肪量測定',
        packages: { dwibs: 'optional', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
    ]
  },
  {
    category: '醫生面談',
    items: [
      {
        name: '內科診察',
        detail: '專業醫師問診',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '結果說明',
        detail: '當日或日後書面說明',
        partialNote: 'DWIBS/基礎為日後書面',
        packages: { dwibs: 'partial', basic: 'partial', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
    ]
  },
  {
    category: '其他服務',
    items: [
      {
        name: '單間休息室',
        detail: '專屬個室使用',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
      {
        name: '餐券',
        detail: '精緻餐券',
        packages: { dwibs: 'included', basic: 'included', 'select-gastro': 'included', 'select-both': 'included', premium: 'included', vip: 'included' }
      },
    ]
  },
];

const StatusIcon = ({ status, partialNote, currentLang = 'zh-TW' }: { status: ItemStatus; partialNote?: string; currentLang?: string }) => {
  switch (status) {
    case 'included':
      return <Check className="w-5 h-5 text-green-600" />;
    case 'optional':
      return <Circle className="w-4 h-4 text-orange-400" />;
    case 'partial':
      return (
        <span className="text-[10px] text-blue-500 font-medium leading-tight text-center">
          {localizeText('部分', currentLang || 'ja')}
        </span>
      );
    case 'none':
      return <X className="w-4 h-4 text-gray-300" />;
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
  const lt = (text: string | undefined) => localizeText(text, currentLang);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    CHECK_ITEMS.map(c => c.category) // 默认全部展开
  );
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center flex-1">
              <div className={`text-lg font-bold ${selectedPackage.id === 'vip' ? 'text-yellow-600' : 'text-gray-900'}`}>
                {selectedPackage.name}
              </div>
              <div className="text-sm text-gray-500">{lt(selectedPackage.nameZh)}</div>
              <div className={`text-xl font-bold mt-1 ${selectedPackage.id === 'vip' ? 'text-yellow-600' : 'text-blue-600'}`}>
                {formatPrice(selectedPackage.price)}
              </div>
            </div>

            <button
              onClick={() => setSelectedPackageIndex(prev => prev < PACKAGES.length - 1 ? prev + 1 : 0)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
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
                    ? 'bg-blue-600 w-4'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 检查项目列表 */}
        <div className="divide-y divide-gray-100">
          {CHECK_ITEMS.map(category => (
            <div key={category.category}>
              {/* 分类标题 */}
              <div
                className="bg-gray-100 p-3 flex items-center gap-2 cursor-pointer active:bg-gray-200"
                onClick={() => toggleCategory(category.category)}
              >
                <span className={`transform transition-transform text-gray-500 ${
                  expandedCategories.includes(category.category) ? 'rotate-90' : ''
                }`}>
                  ▶
                </span>
                <span className="font-bold text-gray-700">{lt(category.category)}</span>
                <span className="text-xs text-gray-400 ml-auto">{category.items.length}{lt('項')}</span>
              </div>

              {/* 项目列表 */}
              {expandedCategories.includes(category.category) && (
                <div className="divide-y divide-gray-50">
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
                            status === 'included' ? 'text-gray-900' :
                            status === 'optional' ? 'text-orange-600' :
                            status === 'partial' ? 'text-blue-600' :
                            'text-gray-400'
                          }`}>
                            {lt(item.name)}
                          </div>
                          {item.detail && (
                            <div className="text-xs text-gray-400 mt-0.5 leading-tight">
                              {lt(item.detail)}
                            </div>
                          )}
                          {status === 'partial' && item.partialNote && (
                            <div className="text-xs text-blue-500 mt-1">
                              {lt(item.partialNote)}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-xs text-gray-400">
                          {status === 'included' && lt('包含')}
                          {status === 'optional' && lt('可選')}
                          {status === 'partial' && lt('部分')}
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
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {lt('立即預約')} {selectedPackage.name}
          </button>
          <div className="text-center text-xs text-gray-400 mt-2">
            {lt('含醫療翻譯・報告翻譯・消費稅10%')}
          </div>
        </div>

        {/* 图例 */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex gap-4 justify-center text-xs flex-wrap">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>{lt('包含')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-orange-400" />
              <span>{lt('可選')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-blue-500 font-medium">{lt('部分')}</span>
              <span>{lt('部分含')}</span>
            </div>
            <div className="flex items-center gap-1">
              <X className="w-3 h-3 text-gray-300" />
              <span>{lt('不含')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 桌面端视图 (原有代码)
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px]">
        {/* 表头：套餐名称和价格 */}
        <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
          <div className="grid grid-cols-7 gap-1">
            {/* 项目列 */}
            <div className="p-4 bg-gray-50">
              <div className="text-sm font-bold text-gray-700">{lt('檢查項目')}</div>
              <div className="text-xs text-gray-400 mt-1">● {lt('包含')} ○ {lt('可選')}</div>
            </div>

            {/* 套餐列 */}
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`p-3 text-center ${
                  pkg.id === 'vip'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50'
                }`}
              >
                <div className={`text-sm font-bold ${
                  pkg.id === 'vip' ? 'text-yellow-400' : 'text-gray-800'
                }`}>
                  {pkg.name}
                </div>
                <div className={`text-xs ${
                  pkg.id === 'vip' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {lt(pkg.nameZh)}
                </div>
                <div className={`text-base font-bold mt-1 ${
                  pkg.id === 'vip' ? 'text-yellow-400' : 'text-gray-900'
                }`}>
                  {formatPrice(pkg.price)}
                </div>
                <button
                  onClick={() => onBookNow?.(pkg.id)}
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded ${
                    pkg.id === 'vip'
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition`}
                >
                  {lt('預約')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 表格内容 */}
        <div className="divide-y divide-gray-100">
          {CHECK_ITEMS.map(category => (
            <div key={category.category}>
              {/* 分类标题行 */}
              <div
                className="grid grid-cols-7 gap-1 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => toggleCategory(category.category)}
              >
                <div className="col-span-7 p-3 flex items-center gap-2">
                  <span className={`transform transition-transform ${
                    expandedCategories.includes(category.category) ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </span>
                  <span className="font-bold text-gray-700">{lt(category.category)}</span>
                  <span className="text-xs text-gray-400">({category.items.length}{lt('項')})</span>
                </div>
              </div>

              {/* 检查项目行 */}
              {expandedCategories.includes(category.category) && (
                category.items.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`grid grid-cols-7 gap-1 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } hover:bg-blue-50 transition`}
                  >
                    {/* 项目名称 */}
                    <div className="p-3 border-r border-gray-100">
                      <div className="text-sm text-gray-800">{lt(item.name)}</div>
                      {item.detail && (
                        <div className="text-xs text-gray-400 mt-0.5 leading-tight">{lt(item.detail)}</div>
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
        <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
          <div className="flex gap-6 justify-center text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">{lt('套餐包含')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-orange-400" />
              <span className="text-gray-600">{lt('可選加購')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-blue-500 font-medium">{lt('部分')}</span>
              <span className="text-gray-600">{lt('部分包含')}</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-gray-300" />
              <span className="text-gray-600">{lt('不包含')}</span>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 mt-3">
            {lt('所有價格均含醫療翻譯・報告翻譯・消費稅10%')}
          </div>
          <div className="text-center text-xs text-gray-400 mt-1">
            {lt('資料來源')}：TOKUSHUKAI INTERNATIONAL Medical Check-up OSAKA (TIMC) Ver.9.5
          </div>
        </div>
      </div>
    </div>
  );
}
