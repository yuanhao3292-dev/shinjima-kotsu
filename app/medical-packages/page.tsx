'use client';

import Link from 'next/link';
import { CheckCircle, MessageCircle } from 'lucide-react';
import SmartBackLink from '@/components/SmartBackLink';

// 套餐数据（与主页 LandingPage.tsx 保持一致）
const packages = [
  {
    id: 'vip',
    slug: 'vip-member-course',
    name: 'VIP 頂級全能套裝',
    nameEn: 'VIP Member Course',
    price: 1512500,
    description: '針對企業領袖的終極方案。包含腦、心、全身癌篩及消化道內視鏡的「全包式」檢查。',
    features: [
      'MRI: 腦(MRA)+心臟+DWIBS+骨盆',
      'CT: 胸部+冠脈鈣化+內臟脂肪',
      '內視鏡: 胃鏡+大腸鏡 (鎮靜麻醉)',
      '超音波: 頸/心/腹/下肢/乳房(女)',
      'PET/CT: 全身癌症掃描',
      '尊享: 個室使用・精緻餐券×2',
    ],
    badge: 'Flagship',
    style: {
      card: 'border-gray-900 bg-gray-900 text-white',
      title: 'text-yellow-400',
      subtitle: 'text-gray-400',
      price: 'text-yellow-400',
      check: 'text-yellow-500',
      button: 'bg-yellow-500 text-black hover:bg-yellow-400',
      badgeBg: 'bg-yellow-500 text-black',
    },
  },
  {
    id: 'premium',
    slug: 'premium-cardiac-course',
    name: 'PREMIUM (心臟精密)',
    nameEn: 'Premium Cardiac Course',
    price: 825000,
    description: '針對高壓力、缺乏運動菁英人士。深度評估猝死與動脈硬化風險。',
    features: [
      'MRI: 心臟(非造影)+腦MRA+DWIBS',
      'CT: 胸部+冠脈鈣化積分',
      '超音波: 心臟・頸動脈・下肢',
      '血液: NTproBNP・心肌蛋白T・CPK',
      '機能: ABI/CAVI (血管年齡)',
    ],
    style: {
      card: 'border-blue-100 bg-gradient-to-br from-blue-50 to-white',
      title: 'text-blue-900',
      subtitle: 'text-blue-400',
      price: 'text-blue-900',
      check: 'text-blue-500',
      button: 'border border-blue-200 text-blue-600 hover:bg-blue-50',
    },
  },
  {
    id: 'select-both',
    slug: 'select-gastro-colonoscopy',
    name: 'SELECT (胃+大腸鏡)',
    nameEn: 'Gastro + Colonoscopy Course',
    price: 825000,
    description: '應酬頻繁者的最佳選擇。一次完成上下消化道精密檢查 (鎮靜麻醉)。',
    features: [
      '內視鏡: 胃鏡+大腸鏡 (鎮靜)',
      '處置: 可當場切除息肉',
      '超音波: 腹部 (肝膽胰脾腎)',
      '感染: 幽門螺旋桿菌抗體',
      '血液: 消化道腫瘤標誌物',
    ],
    style: {
      card: 'border-green-100 bg-white',
      title: 'text-green-900',
      subtitle: 'text-green-500',
      price: 'text-green-900',
      check: 'text-green-500',
      button: 'border border-green-200 text-green-600 hover:bg-green-50',
    },
  },
  {
    id: 'select-gastro',
    slug: 'select-gastroscopy',
    name: 'SELECT (胃鏡)',
    nameEn: 'Gastroscopy Course',
    price: 687500,
    description: '針對胃癌高風險族群。無需清腸，檢查時間短，負擔較輕。',
    features: [
      '內視鏡: 胃鏡 (經口/經鼻)',
      '超音波: 腹部 (肝膽胰脾腎)',
      '感染: 幽門螺旋桿菌抗體',
      '血液: 胃癌風險指標・腫瘤標誌物',
      '基礎: 身體測量・視力聽力・心電圖',
    ],
    style: {
      card: 'border-teal-100 bg-white',
      title: 'text-teal-800',
      subtitle: 'text-teal-500',
      price: 'text-teal-800',
      check: 'text-teal-500',
      button: 'border border-teal-200 text-teal-600 hover:bg-teal-50',
    },
  },
  {
    id: 'dwibs',
    slug: 'dwibs-cancer-screening',
    name: 'DWIBS (防癌篩查)',
    nameEn: 'DWIBS Cancer Screening',
    price: 275000,
    description: '無輻射全身癌症篩查 MRI。無需顯影劑，適合定期追蹤。',
    features: [
      'MRI: DWIBS (頸部至骨盆)',
      '血液: 全套腫瘤標誌物',
      '血液: 肝腎功能・甲狀腺',
      '特點: 無輻射・無痛・非侵入',
      '基礎: 身體測量・視力聽力・心電圖',
    ],
    style: {
      card: 'border-purple-100 bg-white',
      title: 'text-purple-900',
      subtitle: 'text-purple-500',
      price: 'text-purple-900',
      check: 'text-purple-500',
      button: 'border border-purple-200 text-purple-600 hover:bg-purple-50',
    },
  },
  {
    id: 'basic',
    slug: 'basic-checkup',
    name: 'BASIC (基礎套餐)',
    nameEn: 'Standard Checkup Course',
    price: 550000,
    description: '包含血液、影像、超音波的標準健檢。高性價比的企業團體首選。',
    features: [
      '影像: 胸部X光・腹部超音波',
      '血液: 肝腎脂糖・甲狀腺・腫瘤標誌物',
      '基礎: 視力・聽力・眼壓・眼底・心電圖',
      '檢體: 尿液・便潛血(2日法)',
      '歯科: 口腔掃描・X線・餐券',
    ],
    style: {
      card: 'border-gray-200 bg-gray-50',
      title: 'text-gray-800',
      subtitle: 'text-gray-500',
      price: 'text-gray-800',
      check: 'text-gray-500',
      button: 'border border-gray-300 text-gray-600 hover:bg-gray-100',
    },
  },
];

export default function MedicalPackagesPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SmartBackLink />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-[#faf9f7] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            TIMC × NIIJIMA KOTSU
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            醫療健檢套餐
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            日本頂級醫療機構 TIMC 大阪中央高級醫療センター，為您提供精密健康檢查服務
          </p>

          {/* 智能推薦入口 */}
          <Link
            href="/package-recommender"
            className="inline-flex items-center gap-3 mt-8 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all group"
          >
            <MessageCircle size={18} />
            <span>不知道選哪個？智能推薦適合您的套餐</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`border rounded-2xl p-6 hover:shadow-xl transition hover:-translate-y-1 relative overflow-hidden flex flex-col ${pkg.style.card}`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider ${pkg.style.badgeBg}`}>
                  {pkg.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-4">
                <h4 className={`text-xl font-serif font-bold ${pkg.style.title}`}>
                  {pkg.name}
                </h4>
                <p className={`text-xs mt-1 ${pkg.style.subtitle}`}>
                  {pkg.nameEn}
                </p>
                <p className={`text-2xl font-bold mt-2 ${pkg.style.price}`}>
                  ¥{pkg.price.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500">
                  含醫療翻譯・報告翻譯・消費稅10%
                </p>
              </div>

              {/* Description */}
              <p className={`text-xs mb-4 leading-relaxed flex-grow ${pkg.id === 'vip' ? 'text-gray-300' : 'text-gray-500'}`}>
                {pkg.description}
              </p>

              {/* Features */}
              <div className={`space-y-1.5 mb-4 text-xs ${pkg.id === 'vip' ? '' : 'text-gray-700'}`}>
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle size={14} className={`shrink-0 ${pkg.style.check}`} />
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href={`/medical-packages/${pkg.slug}`}
                className={`w-full py-2.5 text-xs font-bold rounded text-center block transition ${pkg.style.button}`}
              >
                立即下單
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-2">
            所有套餐均由 TIMC 大阪中央高級醫療センター 提供服務
          </p>
          <p className="text-xs text-gray-400">
            價格包含醫療翻譯、報告翻譯及消費稅10%・預約需提前2週確認
          </p>
        </div>
      </div>
    </div>
  );
}
