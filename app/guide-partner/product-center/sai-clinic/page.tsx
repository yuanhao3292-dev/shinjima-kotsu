'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import SaiClinicContent from '@/app/sai-clinic/SaiClinicContent';

const translations = {
  backToProductCenter: {
    ja: '選品センターに戻る',
    'zh-CN': '返回选品中心',
    'zh-TW': '返回選品中心',
    en: 'Back to Product Center',
  },
  cosmeticSurgery: {
    ja: '美容整形',
    'zh-CN': '医美整形',
    'zh-TW': '醫美整形',
    en: 'Cosmetic Surgery',
  },
} as const;

const t = (key: keyof typeof translations, lang: Language): string => {
  return translations[key][lang];
};

export default function SaiClinicProductPage() {
  const router = useRouter();
  const lang = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Product Center */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/guide-partner/product-center')}
            className="flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition text-sm"
          >
            <ArrowLeft size={16} />
            {t('backToProductCenter', lang)}
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-medium">SAI CLINIC</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">{t('cosmeticSurgery', lang)}</span>
          </div>
        </div>
      </div>

      <SaiClinicContent />

      {/* Back to Product Center */}
      <div className="text-center py-12">
        <button onClick={() => router.push('/guide-partner/product-center')} className="inline-flex items-center gap-2 text-neutral-500 hover:text-brand-900 transition">
          <ArrowLeft size={16} /> {t('backToProductCenter', lang)}
        </button>
      </div>
    </div>
  );
}
