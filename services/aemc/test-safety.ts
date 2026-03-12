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
// 安全规则定义
// ============================================================

interface SafetyRule {
  id: string;
  /** 检查此规则是否适用于此患者 */
  appliesTo: (sc: StructuredCase) => boolean;
  /** 检查某条建议是否匹配需拦截的危险检查 */
  matchesUnsafeTest: (test: string) => boolean;
  /** 返回替换方案和原因 */
  getReplacement: (originalTest: string, sc: StructuredCase) => { replacement: string; reason: string };
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
    getReplacement: (_orig, sc) => {
      const agatston = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['agatston', 'calcium score', '钙化评分', '钙化积分']
      );
      return {
        replacement: '薬物負荷心筋シンチグラフィー（アデノシン/ドブタミン）または冠動脈造影（CAG）— 運動負荷試験は冠動脈石灰化高値(Agatston >400)のため禁忌',
        reason: `Agatston ${agatston} >400: 運動負荷試験は重症冠動脈疾患患者に心臓イベントリスクあり。薬物負荷または直接 CAG を推奨`,
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
    getReplacement: (_orig, sc) => {
      const agatston = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['agatston', 'calcium score', '钙化評分', '钙化積分']
      );
      return {
        replacement: '冠動脈造影（CAG）推奨 — 冠動脈CTAはカルシウムブルーミングにより精度低下(Agatston >400)。CTAは代替選択肢として検討可',
        reason: `Agatston ${agatston} >400: カルシウムブルーミングにより冠動脈CTA の狭窄評価精度が著しく低下。侵襲的 CAG が第一選択`,
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
    getReplacement: (_orig, sc) => {
      const egfr = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['egfr', 'gfr']
      );
      return {
        replacement: '⚠️ 造影剤使用は腎機能高度低下(eGFR <30)のため高リスク。非造影検査を優先、やむを得ない場合は腎臓内科と相談の上、十分な補液プロトコルを実施',
        reason: `eGFR ${egfr} <30: 造影剤腎症の高リスク。非造影検査を優先し、造影剤使用時は腎臓内科コンサルト必須`,
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
    getReplacement: (orig, sc) => {
      const egfr = extractNumericFromText(
        [...sc.exam_findings, ...sc.known_diagnoses],
        ['egfr', 'gfr']
      );
      return {
        replacement: `${orig}（⚠️ eGFR ${egfr}: 造影剤使用時は補液プロトコル必須）`,
        reason: `eGFR ${egfr} (30-60): 造影剤腎症の中リスク。補液プロトコルを添付して注意喚起`,
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
  triageAssessment: TriageAssessment
): TestSafetyResult {
  const replacements: TestReplacement[] = [];
  const safeSuggestedTests = [...triageAssessment.suggested_tests];

  for (let i = 0; i < safeSuggestedTests.length; i++) {
    const test = safeSuggestedTests[i];

    for (const rule of SAFETY_RULES) {
      if (!rule.appliesTo(structuredCase)) continue;
      if (!rule.matchesUnsafeTest(test)) continue;

      const { replacement, reason } = rule.getReplacement(test, structuredCase);

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
