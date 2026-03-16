/**
 * 输入标准化器 (Input Normalizer)
 *
 * 将现有的问卷答案和 BodyMap 数据转换为 AEMC 统一输入格式 CasePacket。
 * 这是 AEMC pipeline 的 Layer 0。
 *
 * 设计原则：
 * - 不丢弃任何用户输入
 * - 将非结构化数据（问卷选项值）映射为可读文本
 * - 输出唯一的 CasePacket，所有 AI 基于此工作
 */

import type { ScreeningAnswer } from '@/lib/screening-questions';
import type { CasePacket, CaseSymptom, Demographics } from './types';

// 上传文档提取文本的最大长度（约 8000 tokens）
const MAX_REPORT_TEXT_LENGTH = 15_000;

// ============================================================
// 年龄范围 → 中间值映射
// ============================================================

const AGE_RANGE_MAP: Record<string, number> = {
  under30: 25,
  '30-39': 35,
  '40-49': 45,
  '50-59': 55,
  '60plus': 68,
};

// ============================================================
// 主入口：标准化输入
// ============================================================

export interface NormalizerInput {
  screeningId: string;
  answers: ScreeningAnswer[];
  bodyMapData?: {
    selectedBodyParts?: string[];
    selectedSymptoms?: Array<{
      symptomId: string;
      bodyPartId: string;
      name: string;
      severity: string;
      followUpAnswers?: Record<string, string | string[]>;
    }>;
  };
  userType: 'authenticated' | 'whitelabel';
  userId?: string;
  sessionId?: string;
  language?: string;
  uploadedReportText?: string;
}

/**
 * 将问卷答案和 BodyMap 数据标准化为 CasePacket
 */
export function normalizeToCasePacket(input: NormalizerInput): CasePacket {
  const demographics = extractDemographics(input.answers);
  const bodyRegions = input.bodyMapData?.selectedBodyParts || [];
  const selectedSymptoms = extractSymptoms(input.bodyMapData);
  const questionnaireAnswers = extractQuestionnaireAnswers(input.answers);
  const rawTextBundle = buildRawTextBundle(input.answers);
  const language = input.language || detectLanguage(input.answers);

  // 确定输入来源类型
  const sourceTypes: CasePacket['source_type'] = [];
  if (input.answers.length > 0) {
    sourceTypes.push('questionnaire');
  }
  if (input.uploadedReportText) {
    sourceTypes.push('medical_report');
    // 截断过长的文档文本，防止消耗过多 AI token
    const truncatedText = input.uploadedReportText.length > MAX_REPORT_TEXT_LENGTH
      ? input.uploadedReportText.slice(0, MAX_REPORT_TEXT_LENGTH) + '\n\n[... 文档内容已截断，仅分析前 15000 字符 ...]'
      : input.uploadedReportText;
    rawTextBundle.push({
      source: 'uploaded_document',
      text: truncatedText,
    });
  }
  // 至少标记一个来源
  if (sourceTypes.length === 0) {
    sourceTypes.push('questionnaire');
  }

  return {
    case_id: input.screeningId,
    source_type: sourceTypes,
    user_type: input.userType,
    language: language as CasePacket['language'],
    demographics,
    body_regions: bodyRegions,
    selected_symptoms: selectedSymptoms,
    questionnaire_answers: questionnaireAnswers,
    uploaded_report_text: input.uploadedReportText
      ? (input.uploadedReportText.length > MAX_REPORT_TEXT_LENGTH
          ? input.uploadedReportText.slice(0, MAX_REPORT_TEXT_LENGTH)
          : input.uploadedReportText)
      : undefined,
    timeline: [],
    raw_text_bundle: rawTextBundle,
    metadata: {
      screening_id: input.screeningId,
      session_id: input.sessionId,
      user_id: input.userId,
      created_at: new Date().toISOString(),
    },
  };
}

// ============================================================
// 人口统计信息提取
// ============================================================

function extractDemographics(answers: ScreeningAnswer[]): Demographics {
  const result: Demographics = {};

  // 问题 1: 年龄范围
  const ageAnswer = answers.find((a) => a.questionId === 1);
  if (ageAnswer && typeof ageAnswer.answer === 'string') {
    result.age = AGE_RANGE_MAP[ageAnswer.answer] || undefined;
  }

  // 问题 2: 性别
  const sexAnswer = answers.find((a) => a.questionId === 2);
  if (sexAnswer && typeof sexAnswer.answer === 'string') {
    if (sexAnswer.answer === 'male' || sexAnswer.answer === 'female') {
      result.sex = sexAnswer.answer;
    }
  }

  return result;
}

// ============================================================
// 症状提取（从 BodyMap 数据）
// ============================================================

function extractSymptoms(
  bodyMapData?: NormalizerInput['bodyMapData']
): CaseSymptom[] {
  if (!bodyMapData?.selectedSymptoms) return [];

  return bodyMapData.selectedSymptoms.map((s) => ({
    symptom_id: s.symptomId,
    body_part_id: s.bodyPartId,
    name: s.name,
    severity: mapSeverity(s.severity),
    follow_up_answers: s.followUpAnswers || {},
  }));
}

function mapSeverity(severity: string): CaseSymptom['severity'] {
  const map: Record<string, CaseSymptom['severity']> = {
    low: 'low',
    mild: 'low',
    medium: 'medium',
    moderate: 'medium',
    high: 'high',
    severe: 'high',
  };
  return map[severity.toLowerCase()] || 'medium';
}

// ============================================================
// 问卷答案提取
// ============================================================

function extractQuestionnaireAnswers(
  answers: ScreeningAnswer[]
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  for (const a of answers) {
    const key = `q${a.questionId}`;
    result[key] = a.answer;

    // 如果有补充说明，单独存储
    if (a.note) {
      result[`${key}_note`] = a.note;
    }
  }

  return result;
}

// ============================================================
// 原始文本捆绑（保留所有用户输入的原始文本）
// ============================================================

function buildRawTextBundle(
  answers: ScreeningAnswer[]
): Array<{ source: string; text: string }> {
  const bundle: Array<{ source: string; text: string }> = [];

  for (const a of answers) {
    // 问题+答案 的完整文本
    const answerText = Array.isArray(a.answer) ? a.answer.join('、') : String(a.answer);
    bundle.push({
      source: `questionnaire_q${a.questionId}`,
      text: `${a.question}: ${answerText}`,
    });

    // 补充说明
    if (a.note) {
      bundle.push({
        source: `questionnaire_q${a.questionId}_note`,
        text: a.note,
      });
    }
  }

  return bundle;
}

// ============================================================
// 语言检测（简单启发式）
// ============================================================

function detectLanguage(answers: ScreeningAnswer[]): string {
  // 检查问卷问题文本判断语言
  const sampleText = answers
    .slice(0, 3)
    .map((a) => a.question)
    .join('');

  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(sampleText)) return 'ja';
  if (/[\u4e00-\u9fff]/.test(sampleText)) {
    // 区分简体和繁体 — 检查繁体特有字符
    if (/[們點這還與對開關說實際讓設計過國學問題費點準備體適進環經議護範圍選據該繼續]/.test(sampleText)) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  if (/^[a-zA-Z\s.,!?]+$/.test(sampleText.replace(/\d/g, ''))) return 'en';

  return 'zh-CN'; // 默认简体中文
}
