'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';
const VALID_LANGUAGES: Language[] = ['ja', 'zh-TW', 'zh-CN', 'en'];

/**
 * 统一的语言检测和管理 Hook
 *
 * 优先级：
 * 1. Cookie (NEXT_LOCALE)
 * 2. 浏览器语言
 * 3. 默认日语
 *
 * @returns {Language} 当前语言代码
 */
export function useLanguage(): Language {
  const [currentLang, setCurrentLang] = useState<Language>('ja');

  useEffect(() => {
    // 1. 尝试从 Cookie 读取（使用 js-cookie 库，安全且可靠）
    const cookieLang = Cookies.get(LANGUAGE_COOKIE_NAME);
    if (cookieLang && VALID_LANGUAGES.includes(cookieLang as Language)) {
      setCurrentLang(cookieLang as Language);
      return;
    }

    // 2. 从浏览器语言检测
    const browserLang = navigator.language;
    let detectedLang: Language = 'ja';

    if (browserLang.startsWith('ja')) {
      detectedLang = 'ja';
    } else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') {
      detectedLang = 'zh-TW';
    } else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) {
      detectedLang = 'zh-CN';
    } else if (browserLang.startsWith('en')) {
      detectedLang = 'en';
    }

    setCurrentLang(detectedLang);
  }, []);

  return currentLang;
}

/**
 * 辅助函数：解析多语言标签
 * @param label - 字符串或多语言对象
 * @param lang - 当前语言
 * @returns 解析后的字符串
 */
export function resolveLabel(
  label: string | Record<Language, string>,
  lang: Language
): string {
  if (typeof label === 'string') return label;
  return label[lang] || label['ja'];
}

/**
 * 数字格式化（适配不同语言习惯）
 * @param num - 数字
 * @param lang - 语言
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, lang: Language): string {
  const localeMap: Record<Language, string> = {
    'ja': 'ja-JP',
    'zh-TW': 'zh-TW',
    'zh-CN': 'zh-CN',
    'en': 'en-US'
  };

  return new Intl.NumberFormat(localeMap[lang]).format(num);
}
