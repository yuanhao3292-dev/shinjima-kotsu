'use client';

import { useSearchParams } from 'next/navigation';
import { Building } from 'lucide-react';
import { PROVIDERS, isValidProvider } from '@/lib/config/providers';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const bannerLabel: Record<Language, string> = {
  ja: '提携プログラム経由でご予約中',
  'zh-TW': '您正在通過合作方預約',
  'zh-CN': '您正在通过合作方预约',
  en: 'Booking via Partner Program',
};

interface ProviderBannerProps {
  lang: Language;
}

/**
 * 读取 URL ?provider=xxx 并显示上下文横幅
 * 若无 provider 或 provider 不合法，不渲染任何内容
 */
export default function ProviderBanner({ lang }: ProviderBannerProps) {
  const searchParams = useSearchParams();
  const providerKey = searchParams.get('provider');

  if (!isValidProvider(providerKey)) return null;

  const provider = PROVIDERS[providerKey];

  return (
    <div className="bg-blue-50 border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2 text-sm">
        <Building size={16} className="text-blue-600 shrink-0" />
        <span className="text-blue-700">
          {bannerLabel[lang]}:
          <strong className="ml-1">{provider.name[lang]}</strong>
        </span>
      </div>
    </div>
  );
}

/**
 * 从 searchParams 提取 provider key（用于传给 API）
 */
export function useProviderKey(): string | null {
  const searchParams = useSearchParams();
  const key = searchParams.get('provider');
  return isValidProvider(key) ? key : null;
}
