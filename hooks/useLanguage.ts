'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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

// 默认语言与路径前缀解析都定义在 lib/i18n-routing（无 'use client'）——
// 服务端 import 本文件的导出只会拿到 client reference。这里 re-export
// 仅为兼容既有 import 路径。
export { DEFAULT_LANGUAGE, localeFromPathname } from '@/lib/i18n-routing';
import { DEFAULT_LANGUAGE, localeFromPathname, splitLocalePath } from '@/lib/i18n-routing';

/**
 * 去掉语言前缀后的路径。
 *
 * ⚠️ 凡是拿 pathname 去比对路由字面量的地方都必须用它 —— usePathname()
 * 返回的是浏览器地址（带 /ja、/zh-CN 前缀），直接与 '/medical' 比对会全部
 * 落空。实测踩过：/ja/medical 因为匹配不上 PATH_PAGE_MAP，渲染成了首页。
 */
export function useBasePathname(): string {
  return splitLocalePath(usePathname()).basePath;
}

/**
 * 统一的语言检测和管理 Hook
 *
 * 优先级：
 * 1. URL 路径前缀（/ja/... /zh-CN/... /en/... /ko/...）
 * 2. Cookie (NEXT_LOCALE)
 * 3. 浏览器语言
 * 4. DEFAULT_LANGUAGE
 *
 * ⚠️ 路径前缀必须排第一，且带前缀时后面三级一律不参与 ——
 * /ja/medical 无论访客 Cookie 是什么都必须渲染日文。同一个 URL 因人而异
 * 会让 hreflang 失效（Google 抓到的版本与声明的对不上）。
 *
 * @returns {Language} 当前语言代码
 */
export function useLanguage(): Language {
  const pathname = usePathname();
  const pathLang = pathname ? localeFromPathname(pathname) : null;
  const [currentLang, setCurrentLang] = useState<Language>(pathLang ?? DEFAULT_LANGUAGE);

  useEffect(() => {
    // URL 已指定语言 —— 不再看 Cookie 与浏览器语言
    if (pathLang) {
      setCurrentLang(pathLang);
      return;
    }

    // 1. 尝试从 Cookie 读取（使用 js-cookie 库，安全且可靠）
    const cookieLang = Cookies.get(LANGUAGE_COOKIE_NAME);
    if (cookieLang && VALID_LANGUAGES.includes(cookieLang as Language)) {
      setCurrentLang(cookieLang as Language);
      return;
    }

    // 2. 从浏览器语言检测
    const browserLang = navigator.language;
    let detectedLang: Language = DEFAULT_LANGUAGE;

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
  }, [pathLang]);

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
