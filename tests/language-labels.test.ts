/**
 * 语言标签一致性测试
 *
 * 存在的理由：语言切换器的文案用 `\uXXXX` 转义书写（历史上 CJK 字面量被
 * 工具链写坏成 U+FFFD，见 commit 3a1b4e3），但转义码的代价是**人眼看不出错**。
 *
 * 2026-08 实测就有两类问题：
 *   1. `DynamicScreeningForm` 里写成 `한국얶`（한국얶）——
 *      比正确的 `어` 差一个码位，渲染出来是无意义的字，而代码上完全看不出来。
 *   2. 三处按钮标签写成「한국」（国名）而非「한국어」（语言名），与下拉项不一致。
 *
 * 这个测试把散落在各组件里的语言标签集中断言，让同类错误在 CI 就暴露。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getLanguageName, getLanguageFlag, type Language } from '@/hooks/useLanguage';

const ROOT = join(__dirname, '..');

/** 把源码里的 \uXXXX 转义还原成实际字符，便于断言 */
function decodeEscapes(source: string): string {
  return source.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/** 各语种的规范母语名称——所有语言选择器都应当与此一致 */
const CANONICAL: Record<Language, string> = {
  ja: '日本語',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  en: 'English',
  ko: '한국어',
};

/** 含语言选择器的组件 */
const FILES_WITH_LANGUAGE_PICKERS = [
  'components/PublicLayout.tsx',
  'components/LanguageSwitcher.tsx',
  'components/DynamicScreeningForm.tsx',
];

describe('语言标签', () => {
  it('useLanguage 的语种名称与规范一致', () => {
    for (const [code, expected] of Object.entries(CANONICAL)) {
      expect(getLanguageName(code as Language)).toBe(expected);
    }
  });

  it('每个语种都有旗帜', () => {
    for (const code of Object.keys(CANONICAL) as Language[]) {
      expect(getLanguageFlag(code)).toBeTruthy();
    }
  });

  it('组件里不出现坏掉的韩文音节', () => {
    // 「한국」后面只可能跟「어」。曾经出现过 얶（얶）这种差一个码位的错字，
    // 它在源码里和正确写法几乎无法用肉眼区分。
    for (const file of FILES_WITH_LANGUAGE_PICKERS) {
      const decoded = decodeEscapes(readFileSync(join(ROOT, file), 'utf-8'));
      const broken = decoded.match(/한국(?!어)[가-힣]/g);
      expect(broken, `${file} 出现了非「한국어」的韩文组合: ${broken?.join('、')}`).toBeNull();
    }
  });

  it('组件里的韩语标签都用语言名而非国名', () => {
    // 「한국」是国名，「한국어」才是语言名。其它语种用的都是语言名，
    // 韩语也应当保持一致。
    for (const file of FILES_WITH_LANGUAGE_PICKERS) {
      const decoded = decodeEscapes(readFileSync(join(ROOT, file), 'utf-8'));
      const bareCountryName = decoded.match(/'한국'/g);
      expect(bareCountryName, `${file} 用了国名「한국」，应为语言名「한국어」`).toBeNull();
    }
  });

  it('组件里出现的语种名称都在规范集合内', () => {
    const allowed = new Set<string>([
      ...Object.values(CANONICAL),
      // 窄版 UI 刻意使用的缩写
      '简中',
      '繁中',
      '繁体中文', // 简体「体」的变体，两种写法在库中并存
    ]);

    for (const file of FILES_WITH_LANGUAGE_PICKERS) {
      const decoded = decodeEscapes(readFileSync(join(ROOT, file), 'utf-8'));
      // 只检查作为完整字符串字面量出现的标签
      for (const match of decoded.matchAll(/label:\s*'([^']+)'/g)) {
        const label = match[1];
        // 跳过非语言标签（该正则也会命中其它 label 字段）
        if (!/[가-힣ぁ-ゖァ-ヺ一-龥]/.test(label) && label !== 'English') continue;
        expect(allowed.has(label), `${file} 出现未登记的语种标签「${label}」`).toBe(true);
      }
    }
  });
});
