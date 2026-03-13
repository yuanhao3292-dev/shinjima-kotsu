/**
 * 检查安全性拦截器 (Test Safety Interceptor)
 *
 * 确定性逻辑，在 AI-2 输出后执行。
 * 扫描 AI-2 推荐的检查项目，检查是否对此患者存在禁忌/危险。
 * 如果发现不安全的检查建议，自动替换为安全替代方案。
 *
 * 设计原则：
 * - 纯确定性逻辑，无 AI 调用
 * - 宁可过度拦截，不可放过危险推荐
 * - 不删除检查建议，只替换为更安全的替代方案
 * - 所有替换都记录日志，可审计
 */

import type { StructuredCase, TriageAssessment } from './types';
import { type AEMCLang } from './hospital-knowledge-base';

// ============================================================
// 类型定义
// ============================================================

export interface TestSafetyResult {
  /** 修改后的 suggested_tests */
  safeSuggestedTests: string[];
  /** 被替换的检查及原因 */
  replacements: TestReplacement[];
  /** 注入 AI-4 的安全警告文本 */
  safetyWarningsForAdjudicator: string;
}

export interface TestReplacement {
  /** 原始推荐 */
  original: string;
  /** 替换方案 */
  replacement: string;
  /** 替换原因 */
  reason: string;
  /** 规则 ID */
  ruleId: string;
}

// ============================================================
// 辅助：从文本中提取数值
// ============================================================

function extractNumericFromText(
  texts: string[],
  keywords: string[]
): number | null {
  const allText = texts.join(' ').toLowerCase();
  for (const kw of keywords) {
    const pattern = new RegExp(
      kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '[^\\d]*?(\\d+(?:\\.\\d+)?)',
      'i'
    );
    const match = allText.match(pattern);
    if (match) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) return val;
    }
  }
  return null;
}

function textContains(texts: string[], keywords: string[]): boolean {
  const combined = texts.join(' ').toLowerCase();
  return keywords.some((kw) => combined.includes(kw.toLowerCase()));
}

// ============================================================
// 多语言翻译
// ============================================================

type TSStr = Record<AEMCLang, string>;
const TS_I18N: Record<string, TSStr> = {
  // TSR-001: Agatston >400 → 运动负荷试验禁忌，换药物负荷
  tsr001rep: {
    'zh-CN': '药物负荷心肌灌注显像（腺苷/多巴酚丁胺）或冠脉造影（CAG）— 运动负荷试验因冠脉钙化高值(Agatston >400)属禁忌',
    'zh-TW': '藥物負荷心肌灌注顯像（腺苷/多巴酚丁胺）或冠脈造影（CAG）— 運動負荷試驗因冠脈鈣化高值(Agatston >400)屬禁忌',
    en: 'Pharmacological stress myocardial perfusion imaging (adenosine/dobutamine) or coronary angiography (CAG) — Exercise stress test contraindicated due to high coronary calcification (Agatston >400)',
    ja: '薬物負荷心筋シンチグラフィー（アデノシン/ドブタミン）または冠動脈造影（CAG）— 運動負荷試験は冠動脈石灰化高値(Agatston >400)のため禁忌',
  },
  tsr001reason: {
    'zh-CN': 'Agatston {val} >400: 运动负荷试验对重症冠脉疾病患者有心脏事件风险。推荐药物负荷或直接 CAG',
    'zh-TW': 'Agatston {val} >400: 運動負荷試驗對重症冠脈疾病患者有心臟事件風險。推薦藥物負荷或直接 CAG',
    en: 'Agatston {val} >400: Exercise stress test poses cardiac event risk in severe coronary artery disease. Pharmacological stress or direct CAG recommended',
    ja: 'Agatston {val} >400: 運動負荷試験は重症冠動脈疾患患者に心臓イベントリスクあり。薬物負荷または直接 CAG を推奨',
  },
  // TSR-002: Agatston >400 → CTA 精度低下
  tsr002rep: {
    'zh-CN': '冠脉造影（CAG）推荐 — 冠脉 CTA 因钙化伪影导致精度下降(Agatston >400)。CTA 可作为备选',
    'zh-TW': '冠脈造影（CAG）推薦 — 冠脈 CTA 因鈣化偽影導致精度下降(Agatston >400)。CTA 可作為備選',
    en: 'Coronary angiography (CAG) recommended — Coronary CTA accuracy degraded by calcium blooming artifact (Agatston >400). CTA may be considered as alternative',
    ja: '冠動脈造影（CAG）推奨 — 冠動脈CTAはカルシウムブルーミングにより精度低下(Agatston >400)。CTAは代替選択肢として検討可',
  },
  tsr002reason: {
    'zh-CN': 'Agatston {val} >400: 钙化伪影导致冠脉 CTA 狭窄评估精度显著下降。有创 CAG 为首选',
    'zh-TW': 'Agatston {val} >400: 鈣化偽影導致冠脈 CTA 狹窄評估精度顯著下降。有創 CAG 為首選',
    en: 'Agatston {val} >400: Calcium blooming significantly degrades coronary CTA stenosis assessment accuracy. Invasive CAG is first-line',
    ja: 'Agatston {val} >400: カルシウムブルーミングにより冠動脈CTA の狭窄評価精度が著しく低下。侵襲的 CAG が第一選択',
  },
  // TSR-003: eGFR <30 → 造影剂禁忌
  tsr003rep: {
    'zh-CN': '⚠️ 造影剂使用因肾功能严重低下(eGFR <30)属高风险。优先无造影检查，如必须使用需肾内科会诊并充分水化',
    'zh-TW': '⚠️ 造影劑使用因腎功能嚴重低下(eGFR <30)屬高風險。優先無造影檢查，如必須使用需腎內科會診並充分水化',
    en: '⚠️ Contrast agent use is high-risk due to severe renal impairment (eGFR <30). Prioritize non-contrast studies; if unavoidable, nephrology consultation and hydration protocol required',
    ja: '⚠️ 造影剤使用は腎機能高度低下(eGFR <30)のため高リスク。非造影検査を優先、やむを得ない場合は腎臓内科と相談の上、十分な補液プロトコルを実施',
  },
  tsr003reason: {
    'zh-CN': 'eGFR {val} <30: 造影剂肾病高风险。优先无造影检查，使用造影剂时需肾内科会诊',
    'zh-TW': 'eGFR {val} <30: 造影劑腎病高風險。優先無造影檢查，使用造影劑時需腎內科會診',
    en: 'eGFR {val} <30: High risk of contrast-induced nephropathy. Prioritize non-contrast studies; nephrology consultation mandatory if contrast used',
    ja: 'eGFR {val} <30: 造影剤腎症の高リスク。非造影検査を優先し、造影剤使用時は腎臓内科コンサルト必須',
  },
  // TSR-004: eGFR 30-60 → 造影剂注意
  tsr004suffix: {
    'zh-CN': '⚠️ eGFR {val}: 使用造影剂时需水化方案',
    'zh-TW': '⚠️ eGFR {val}: 使用造影劑時需水化方案',
    en: '⚠️ eGFR {val}: Hydration protocol required when using contrast agent',
    ja: '⚠️ eGFR {val}: 造影剤使用時は補液プロトコル必須',
  },
  tsr004reason: {
    'zh-CN': 'eGFR {val} (30-60): 造影剂肾病中风险。附加水化方案并提示注意',
    'zh-TW': 'eGFR {val} (30-60): 造影劑腎病中風險。附加水化方案並提示注意',
    en: 'eGFR {val} (30-60): Moderate risk of contrast-induced nephropathy. Hydration protocol appended with caution',
    ja: 'eGFR {val} (30-60): 造影剤腎症の中リスク。補液プロトコルを添付して注意喚起',
  },
};

function TSL(key: string, lang: AEMCLang): string {
  return TS_I18N[key]?.[lang] || TS_I18N[key]?.['zh-CN'] || key;
}

// ============================================================
// 安全规则定义
// ============================================================

interface SafetyRule {
  id: string;
  /** 检查此规则是否适用于此患者 */
  appliesTo: (sc: StructuredCase) => boolean;
  /** 检查某条建议是否匹配需拦截的危险检查 */
  matchesUnsafeTest: (test: string) => boolean;
  /** 返回替换方案和原因 */
  getReplacement: (originalTest: string, sc: StructuredCase, lang: AEMCLang) => { replacement: string; reason: string };
}

const SAFETY_RULES: SafetyRule[] = [
  // TSR-001: Agatston >400 → 禁止运动负荷试验
  {
    id: 'TSR-001',
    appliesTo: (sc) => {
      const agatston = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['agatston', 'calcium score', '钙化评分', '钙化积分', 'カルシウムスコア']
      );
      return agatston !== null && agatston > 400;
    },
    matchesUnsafeTest: (test) => {
      const t = test.toLowerCase();
      return (
        (t.includes('stress') && t.includes('test')) ||
        (t.includes('exercise') && (t.includes('stress') || t.includes('test'))) ||
        t.includes('运动负荷') ||
        t.includes('トレッドミル') ||
        t.includes('treadmill') ||
        t.includes('ergometer') ||
        (t.includes('負荷') && t.includes('心電'))
      );
    },
    getReplacement: (_orig, sc, lang) => {
      const agatston = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['agatston', 'calcium score', '钙化评分', '钙化积分']
      );
      return {
        replacement: TSL('tsr001rep', lang),
        reason: TSL('tsr001reason', lang).replace('{val}', String(agatston)),
      };
    },
  },

  // TSR-002: Agatston >400 → CTA の精度低下を警告
  {
    id: 'TSR-002',
    appliesTo: (sc) => {
      const agatston = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['agatston', 'calcium score', '钙化评分', '钙化積分']
      );
      return agatston !== null && agatston > 400;
    },
    matchesUnsafeTest: (test) => {
      const t = test.toLowerCase();
      return (
        t.includes('冠動脈cta') ||
        t.includes('冠动脉cta') ||
        t.includes('coronary cta') ||
        t.includes('ct angiography') ||
        t.includes('ctアンギオ') ||
        (t.includes('冠動脈') && t.includes('ct')) ||
        (t.includes('冠动脉') && t.includes('ct')) ||
        (t.includes('coronary') && t.includes('ct'))
      );
    },
    getReplacement: (_orig, sc, lang) => {
      const agatston = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['agatston', 'calcium score', '钙化評分', '钙化積分']
      );
      return {
        replacement: TSL('tsr002rep', lang),
        reason: TSL('tsr002reason', lang).replace('{val}', String(agatston)),
      };
    },
  },

  // TSR-003: eGFR <30 → 造影剤禁忌
  {
    id: 'TSR-003',
    appliesTo: (sc) => {
      const egfr = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['egfr', 'gfr']
      );
      return egfr !== null && egfr < 30;
    },
    matchesUnsafeTest: (test) => {
      const t = test.toLowerCase();
      return (
        t.includes('造影') ||
        t.includes('contrast') ||
        t.includes('ガドリニウム') ||
        t.includes('gadolinium') ||
        (t.includes('enhanced') && (t.includes('ct') || t.includes('mri')))
      );
    },
    getReplacement: (orig, sc, lang) => {
      const egfr = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['egfr', 'gfr']
      );
      return {
        replacement: `${orig}（${TSL('tsr003rep', lang)}）`,
        reason: TSL('tsr003reason', lang).replace('{val}', String(egfr)),
      };
    },
  },

  // TSR-004: eGFR 30-60 → 造影剤注意（警告追加、置換はしない）
  {
    id: 'TSR-004',
    appliesTo: (sc) => {
      const egfr = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['egfr', 'gfr']
      );
      return egfr !== null && egfr >= 30 && egfr < 60;
    },
    matchesUnsafeTest: (test) => {
      const t = test.toLowerCase();
      return (
        t.includes('造影') ||
        t.includes('contrast') ||
        (t.includes('enhanced') && (t.includes('ct') || t.includes('mri')))
      );
    },
    getReplacement: (orig, sc, lang) => {
      const egfr = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['egfr', 'gfr']
      );
      return {
        replacement: `${orig}（${TSL('tsr004suffix', lang).replace('{val}', String(egfr))}）`,
        reason: TSL('tsr004reason', lang).replace('{val}', String(egfr)),
      };
    },
  },
];

// ============================================================
// 主入口
// ============================================================

/**
 * 検査安全性チェック：AI-2 の suggested_tests を走査し、
 * 患者の状態に対して危険な検査を安全な代替案に置換する
 */
export function interceptUnsafeTests(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  language?: string
): TestSafetyResult {
  const lang = (language || 'zh-CN') as AEMCLang;
  const replacements: TestReplacement[] = [];
  const safeSuggestedTests = [...triageAssessment.suggested_tests];

  for (let i = 0; i < safeSuggestedTests.length; i++) {
    const test = safeSuggestedTests[i];

    for (const rule of SAFETY_RULES) {
      if (!rule.appliesTo(structuredCase)) continue;
      if (!rule.matchesUnsafeTest(test)) continue;

      const { replacement, reason } = rule.getReplacement(test, structuredCase, lang);

      replacements.push({
        original: test,
        replacement,
        reason,
        ruleId: rule.id,
      });

      safeSuggestedTests[i] = replacement;
      console.info(`[TestSafety] ${rule.id}: 替换 "${test}" → "${replacement}"`);

      // 每条检查只匹配第一个适用的安全规则
      break;
    }
  }

  // 生成安全警告文本（注入 AI-4 仲裁官输入）
  let safetyWarningsForAdjudicator = '';
  if (replacements.length > 0) {
    const lines = replacements.map(
      (r) => `[${r.ruleId}] "${r.original}" → "${r.replacement}" (${r.reason})`
    );
    safetyWarningsForAdjudicator =
      `\n\n--- TEST SAFETY INTERCEPTIONS (deterministic, non-AI) ---\n` +
      lines.join('\n') +
      `\n--- END TEST SAFETY ---`;

    console.info(
      `[TestSafety] Intercepted ${replacements.length} unsafe test recommendations`
    );
  }

  return {
    safeSuggestedTests,
    replacements,
    safetyWarningsForAdjudicator,
  };
}
