// i18n configuration
// Note: Full URL-based routing requires migrating pages to [locale] directory structure
// Currently using a simplified cookie-based approach via LanguageSwitcher component

export const locales = ['ja', 'zh-TW', 'zh-CN', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ja';

export const localeNames: Record<Locale, string> = {
  'ja': '日本語',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'en': 'English',
};

export const localeFlags: Record<Locale, string> = {
  'ja': '🇯🇵',
  'zh-TW': '🇹🇼',
  'zh-CN': '🇨🇳',
  'en': '🇺🇸',
};

// Helper function to get messages for a locale
export async function getMessages(locale: Locale) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch {
    // Fallback to Japanese
    return (await import('./messages/ja.json')).default;
  }
}
