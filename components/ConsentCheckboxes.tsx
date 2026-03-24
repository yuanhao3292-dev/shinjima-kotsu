'use client';

import Link from 'next/link';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

export interface Consents {
  cancel: boolean;
  tokushoho: boolean;
  privacy: boolean;
}

interface ConsentCheckboxesProps {
  consents: Consents;
  onChange: (consents: Consents) => void;
  lang: Language;
}

const TEXTS: Record<Language, {
  consentCancel: string;
  consentTokushoho: string;
  consentPrivacy: string;
  consentRequired: string;
  medicalDisclaimer: string;
}> = {
  ja: {
    consentCancel: 'キャンセル・返金ポリシーに同意します',
    consentTokushoho: '特定商取引法に基づく表記を確認しました',
    consentPrivacy: 'プライバシーポリシーに同意します',
    consentRequired: '上記すべてに同意してください',
    medicalDisclaimer: '※ 医療サービスは提携医療機関が直接提供します。治療効果には個人差があり、結果を保証するものではありません。',
  },
  'zh-TW': {
    consentCancel: '我同意取消與退款政策',
    consentTokushoho: '我已確認特定商取引法相關標示',
    consentPrivacy: '我同意隱私權政策',
    consentRequired: '請勾選以上所有同意項目',
    medicalDisclaimer: '※ 醫療服務由合作醫療機構直接提供。治療效果因人而異，不保證特定結果。',
  },
  'zh-CN': {
    consentCancel: '我同意取消与退款政策',
    consentTokushoho: '我已确认特定商取引法相关标示',
    consentPrivacy: '我同意隐私政策',
    consentRequired: '请勾选以上所有同意项目',
    medicalDisclaimer: '※ 医疗服务由合作医疗机构直接提供。治疗效果因人而异，不保证特定结果。',
  },
  en: {
    consentCancel: 'I agree to the Cancellation & Refund Policy',
    consentTokushoho: 'I have reviewed the Specified Commercial Transaction Act disclosures',
    consentPrivacy: 'I agree to the Privacy Policy',
    consentRequired: 'Please agree to all items above',
    medicalDisclaimer: '* Medical services are provided directly by partner medical institutions. Treatment outcomes vary by individual and are not guaranteed.',
  },
};

export function allConsented(consents: Consents): boolean {
  return consents.cancel && consents.tokushoho && consents.privacy;
}

export default function ConsentCheckboxes({ consents, onChange, lang }: ConsentCheckboxesProps) {
  const t = TEXTS[lang];
  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500 leading-relaxed">{t.medicalDisclaimer}</p>
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={consents.cancel} onChange={(e) => onChange({ ...consents, cancel: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-900 focus:ring-brand-700" />
          <span className="text-sm text-neutral-700">{t.consentCancel}</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={consents.tokushoho} onChange={(e) => onChange({ ...consents, tokushoho: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-900 focus:ring-brand-700" />
          <span className="text-sm text-neutral-700"><Link href="/legal/tokushoho" target="_blank" className="underline hover:text-brand-900">{t.consentTokushoho}</Link></span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={consents.privacy} onChange={(e) => onChange({ ...consents, privacy: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-900 focus:ring-brand-700" />
          <span className="text-sm text-neutral-700"><Link href="/legal/privacy" target="_blank" className="underline hover:text-brand-900">{t.consentPrivacy}</Link></span>
        </label>
        {!allConsented(consents) && (
          <p className="text-xs text-amber-600">{t.consentRequired}</p>
        )}
      </div>
    </div>
  );
}
