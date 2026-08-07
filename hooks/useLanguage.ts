'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en' | 'ko';

const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';
const VALID_LANGUAGES: Language[] = ['ja', 'zh-TW', 'zh-CN', 'en', 'ko'];

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
    } else if (browserLang.startsWith('ko')) {
      detectedLang = 'ko';
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
    'en': 'en-US',
    'ko': 'ko-KR'
  };

  return new Intl.NumberFormat(localeMap[lang]).format(num);
}

/**
 * 获取语言的人类可读名称（语言切换器使用）
 *
 * 这里刻意用 \u 转义而非 CJK 字面量：这些字符串曾在一次工具链
 * 非 UTF-8 写入中损坏成 U+FFFD（见 commit 3a1b4e3），转义形式对
 * 编码往返免疫。
 */
export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    'ja': '\u65E5\u672C\u8A9E',
    'zh-TW': '\u7E41\u9AD4\u4E2D\u6587',
    'zh-CN': '\u7B80\u4F53\u4E2D\u6587',
    'en': 'English',
    'ko': '\uD55C\uAD6D\uC5B4',
  };
  return names[lang];
}

/**
 * 获取语言的旗帜 emoji
 */
export function getLanguageFlag(lang: Language): string {
  const flags: Record<Language, string> = {
    'ja': '🇯🇵',
    'zh-TW': '🇹🇼',
    'zh-CN': '🇨🇳',
    'en': '🇺🇸',
    'ko': '🇰🇷',
  };
  return flags[lang];
}
