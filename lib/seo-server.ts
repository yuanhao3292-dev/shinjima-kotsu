/**
 * 需要读请求头的 metadata 辅助 —— 只能在 Server Component / generateMetadata 里用。
 *
 * 与 lib/seo.ts 分开，是因为后者会被客户端组件间接引入
 * （app/faq/page.tsx 'use client' → lib/structured-data → lib/seo），
 * 而 next/headers 出现在那条链上会直接让构建失败。
 */
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { buildMetadata } from './seo';
import { PAGE_COPY, type MetaLocale } from './seo-copy';

/**
 * 当前请求的 metadata 语言。取自 middleware 透出的 x-locale。
 *
 * ko 映射到 ja：/ko/* 的正文在多数页面本就回退日语（见 useLanguage4），
 * 标题跟着回退才不会出现「韩语 URL + 日文正文 + 繁体标题」三方打架。
 */
export async function metaLocale(): Promise<MetaLocale> {
  const loc = (await headers()).get('x-locale');
  if (loc === 'ja' || loc === 'ko') return 'ja';
  if (loc === 'zh-CN') return 'zh-CN';
  if (loc === 'en') return 'en';
  return 'zh-TW';
}

/**
 * 按当前语言生成单页 metadata。文案取自 lib/seo-copy 的 PAGE_COPY。
 *
 * ⚠️ 调用方必须用 generateMetadata（而非 `export const metadata`）——
 * 这里要读请求头，静态导出的 metadata 在构建期求值，拿不到 x-locale。
 */
export async function localizedPageMetadata(path: string): Promise<Metadata> {
  const copy = PAGE_COPY[path];
  if (!copy) {
    throw new Error(`lib/seo-copy 缺少 ${path} 的文案，请先补齐四种语言`);
  }
  const locale = await metaLocale();
  return buildMetadata(copy[locale], locale);
}

