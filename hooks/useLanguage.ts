'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en' | 'ko';

/**
 * 多语言文案对象。医院专题页的内联字典请统一标注此类型，
 * 缺了标注 noImplicitAny 会把索引访问推断成 any。
 */
export type LocalizedText = Record<Language, string>;
/** 四语言变体：部分页面不提供韩语 */
export type LocalizedText4 = Record<Exclude<Language, 'ko'>, string>;

/** 医院专题页实际提供的语种 */
export type Language4 = Exclude<Language, 'ko'>;

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
 * 医院专题页专用：把语言收窄到页面实际提供的四语种。
 *
 * 语言切换器提供韩语，但各医院页的内联文案字典只写了 ja/zh-TW/zh-CN/en。
 * 直接拿 'ko' 去索引会得到 undefined，React 渲染成空白 —— 韩语用户看到的
 * 是一个个空标题、空段落。缺口规模（2026-08 实测）：8 个页面完全没有韩语，
 * 兵库医大缺 35 处、癌症治疗缺 7 处、大阪 HIMAK 缺 3 处。
 *
 * 在补齐真实韩语文案之前，统一回退到日语 —— 与 resolveLabel 的回退语种一致，
 * 也比"一半韩文一半空白"更可用。
 *
 * 文案补齐后，把对应页面改回 useLanguage() 即可。
 * ac-plus 的韩语已完整，未使用本 hook。
 */
export function useLanguage4(): Language4 {
  const lang = useLanguage();
  return lang === 'ko' ? 'ja' : lang;
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
