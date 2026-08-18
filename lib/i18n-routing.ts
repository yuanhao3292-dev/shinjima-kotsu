/**
 * 语言路径前缀 —— 让每种语言有自己的 URL。
 *
 * 背景：五种语言此前共用同一个 URL，靠 Cookie 切换。对 Google 来说
 * 一个 URL 只能对应一个版本，另外四种语言等于不存在，也无从声明 hreflang。
 *
 * 方案：默认语言（繁中）继续占用无前缀路径，其余四种各带一个前缀：
 *     /medical         → zh-TW（同时是 x-default）
 *     /ja/medical      → 日本語
 *     /zh-CN/medical   → 简体中文
 *     /en/medical      → English
 *     /ko/medical      → 한국어
 *
 * ⚠️ 默认语言刻意不给前缀：如果既有 /medical 又有 /zh-TW/medical，
 * 两个 URL 内容完全相同，等于自己造重复内容。
 *
 * 前缀由 middleware 剥掉并 rewrite 到无前缀路由，因此不需要为每种语言
 * 复制一份页面文件。
 */

import type { Language } from '@/hooks/useLanguage';

/**
 * 服务端渲染 / 首帧的默认语言，也是 Googlebot 看到的语言。
 *
 * ⚠️ 定义在这里而不是 hooks/useLanguage.ts —— 那个文件带 'use client'，
 * 服务端（layout 的 generateMetadata、middleware）import 它的导出拿到的是
 * client reference 而非真实值。实测踩过：DEFAULT_LANGUAGE 在服务端成了
 * undefined，于是 localePath('zh-TW', '/') 里的相等判断永远为假，
 * 繁中版的 hreflang 被指向了并不存在的 /zh-TW。
 *
 * 取 zh-TW 而非 ja 的理由：站点差异化价值（中文陪同、报告翻译、赴日就医
 * 代办）对应华语检索意图；日文「人間ドック」类查询由本土医院主导。
 * 要改回日文优先，只改这一行。
 */
export const DEFAULT_LANGUAGE = 'zh-TW' satisfies Language;

/** 从 URL 路径前缀取语言。/ja/medical → 'ja'；无前缀 → null。 */
export function localeFromPathname(pathname: string): Language | null {
  for (const loc of PREFIXED_LOCALES) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) return loc;
  }
  return null;
}

/** 带前缀的语言（默认语言不在此列） */
export const PREFIXED_LOCALES = ['ja', 'zh-CN', 'en', 'ko'] as const;
export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];

/** hreflang 属性值。中文必须用 Hant/Hans 书写系统标记，zh-TW/zh-CN 是地区标记，
 *  对「用繁体但不在台湾」的用户（港澳、海外华人）不适用。 */
export const HREFLANG: Record<Language, string> = {
  'zh-TW': 'zh-Hant',
  'zh-CN': 'zh-Hans',
  ja: 'ja',
  en: 'en',
  ko: 'ko',
};

/**
 * 拆出路径里的语言前缀。
 * `/ja/medical` → { locale: 'ja', basePath: '/medical' }
 * `/medical`    → { locale: null, basePath: '/medical' }
 */
export function splitLocalePath(pathname: string): {
  locale: PrefixedLocale | null;
  basePath: string;
} {
  for (const loc of PREFIXED_LOCALES) {
    if (pathname === `/${loc}`) return { locale: loc, basePath: '/' };
    if (pathname.startsWith(`/${loc}/`)) {
      return { locale: loc, basePath: pathname.slice(loc.length + 1) };
    }
  }
  return { locale: null, basePath: pathname };
}

/** 反向：给定语言与无前缀路径，拼出该语言的 URL 路径 */
export function localePath(locale: Language, basePath: string): string {
  if (locale === DEFAULT_LANGUAGE) return basePath;
  const clean = basePath === '/' ? '' : basePath;
  return `/${locale}${clean}` || '/';
}

/**
 * 会向搜索引擎声明 hreflang 的语言 —— 刻意不含韩语。
 *
 * /ko/... 仍然可访问（语言切换器要用），但站内 54 个页面走的是
 * useLanguage4()，它在韩语文案缺失时回退日语（见该 hook 的注释：8 个页面
 * 完全没有韩语，兵库医大缺 35 处）。实测 /ko/cancer-treatment 吐出的是
 * 1361 个假名的日文页。
 *
 * 声明 hreflang="ko" 却提供日文内容，对 Google 是一条假声明。
 * 等韩语文案补齐，把 'ko' 加回本数组即可 —— 路由那边不用动。
 */
export const HREFLANG_LOCALES = ['zh-TW', 'ja', 'zh-CN', 'en'] as const;

/** 该页面各语言版本的路径，用于 hreflang 与 sitemap 的 alternates */
export function allLocalePaths(basePath: string): Record<string, string> {
  return Object.fromEntries(
    HREFLANG_LOCALES.map((loc) => [loc, localePath(loc, basePath)])
  );
}
