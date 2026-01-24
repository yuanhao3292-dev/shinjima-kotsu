'use client';

import { useState, useEffect } from 'react';

export type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

/**
 * 从浏览器语言代码检测最合适的语言
 * 处理各种语言变体和 fallback
 */
function detectLanguageFromBrowser(browserLang: string): Language {
  const lang = browserLang.toLowerCase();

  // 日语
  if (lang.startsWith('ja')) return 'ja';

  // 繁体中文（台湾、香港）
  if (['zh-tw', 'zh-hk', 'zh-hant'].some(l => lang.startsWith(l))) {
    return 'zh-TW';
  }

  // 简体中文（中国大陆、新加坡）
  if (['zh-cn', 'zh-sg', 'zh-hans'].some(l => lang.startsWith(l))) {
    return 'zh-CN';
  }

  // 其他中文变体默认简体
  if (lang.startsWith('zh')) return 'zh-CN';

  // 英语（所有变体）
  if (lang.startsWith('en')) return 'en';

  // 默认 fallback 到日语
  return 'ja';
}

/**
 * 从 Cookie 中获取语言设置
 */
function getLanguageFromCookie(): Language | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'NEXT_LOCALE') {
      const lang = value as string;
      if (['ja', 'zh-TW', 'zh-CN', 'en'].includes(lang)) {
        return lang as Language;
      }
    }
  }

  return null;
}

/**
 * 统一的语言管理 Hook
 *
 * 优先级：
 * 1. Cookie 中的语言设置（用户手动选择）
 * 2. 浏览器语言（自动检测）
 * 3. 默认语言（日语）
 *
 * @returns {Language} currentLang - 当前语言
 */
export function useLanguage(): Language {
  // SSR 安全的初始化：服务端渲染时使用默认语言
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ja';

    // 客户端初始化时立即检测语言
    const cookieLang = getLanguageFromCookie();
    if (cookieLang) return cookieLang;

    return detectLanguageFromBrowser(navigator.language);
  });

  useEffect(() => {
    // 仅在客户端执行语言检测
    const cookieLang = getLanguageFromCookie();
    if (cookieLang) {
      setCurrentLang(cookieLang);
      return;
    }

    const browserLang = detectLanguageFromBrowser(navigator.language);
    setCurrentLang(browserLang);
  }, []); // 空依赖数组：仅在组件挂载时执行一次

  return currentLang;
}

/**
 * 获取语言的人类可读名称
 */
export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    'ja': '日本語',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    'en': 'English',
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
  };
  return flags[lang];
}
