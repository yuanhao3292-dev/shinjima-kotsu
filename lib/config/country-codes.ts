import type { Language } from '@/hooks/useLanguage';

export interface CountryCode {
  code: string;
  label: string;
}

// Grouped by region for readability; flat array for rendering
export const COUNTRY_CODES: CountryCode[] = [
  // East Asia
  { code: '+86',  label: '+86 中国' },
  { code: '+886', label: '+886 台灣' },
  { code: '+852', label: '+852 香港' },
  { code: '+853', label: '+853 澳門' },
  { code: '+81',  label: '+81 日本' },
  { code: '+82',  label: '+82 한국' },

  // Southeast Asia
  { code: '+65',  label: '+65 SG' },
  { code: '+60',  label: '+60 MY' },
  { code: '+66',  label: '+66 TH' },
  { code: '+84',  label: '+84 VN' },
  { code: '+63',  label: '+63 PH' },
  { code: '+62',  label: '+62 ID' },
  { code: '+855', label: '+855 KH' },
  { code: '+95',  label: '+95 MM' },
  { code: '+856', label: '+856 LA' },
  { code: '+673', label: '+673 BN' },

  // Middle East (high-income)
  { code: '+971', label: '+971 UAE' },
  { code: '+966', label: '+966 SA' },
  { code: '+974', label: '+974 QA' },
  { code: '+965', label: '+965 KW' },
  { code: '+973', label: '+973 BH' },
  { code: '+968', label: '+968 OM' },
  { code: '+972', label: '+972 IL' },

  // Europe
  { code: '+44',  label: '+44 UK' },
  { code: '+33',  label: '+33 FR' },
  { code: '+49',  label: '+49 DE' },
  { code: '+39',  label: '+39 IT' },
  { code: '+34',  label: '+34 ES' },
  { code: '+31',  label: '+31 NL' },
  { code: '+41',  label: '+41 CH' },
  { code: '+46',  label: '+46 SE' },
  { code: '+47',  label: '+47 NO' },
  { code: '+45',  label: '+45 DK' },
  { code: '+358', label: '+358 FI' },
  { code: '+32',  label: '+32 BE' },
  { code: '+43',  label: '+43 AT' },
  { code: '+351', label: '+351 PT' },
  { code: '+353', label: '+353 IE' },
  { code: '+48',  label: '+48 PL' },
  { code: '+420', label: '+420 CZ' },
  { code: '+30',  label: '+30 GR' },
  { code: '+7',   label: '+7 RU' },

  // North America
  { code: '+1',   label: '+1 US/CA' },

  // Oceania
  { code: '+61',  label: '+61 AU' },
  { code: '+64',  label: '+64 NZ' },
];

/** Default country code based on UI language */
export const DEFAULT_CODE_BY_LANG: Record<Language, string> = {
  'zh-CN': '+86',
  'zh-TW': '+886',
  ja: '+81',
  en: '+1',
};
