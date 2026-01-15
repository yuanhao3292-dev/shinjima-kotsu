/**
 * AI 健康筛查问题配置 v3.0
 * 两阶段问诊系统：
 * - 第一阶段：10 题快速筛查 → 立即给出初步建议
 * - 第二阶段：可选的深度问诊 → 更详细的报告
 *
 * 设计原则：
 * 1. 快速筛查优先，降低用户流失
 * 2. 高价值问题前置（家族癌症史、警示症状）
 * 3. 支持中途获取初步结果
 */

export interface ScreeningOption {
  value: string;
  label: string;
}

export interface ScreeningQuestion {
  id: number;
  category: 'basic' | 'family' | 'symptoms' | 'lifestyle' | 'history' | 'mental' | 'cancer_risk' | 'cardiovascular';
  question: string;
  type: 'single' | 'multi' | 'input';
  options?: ScreeningOption[];
  placeholder?: string;
  hasNote?: boolean;
  fields?: string[];
  // 问诊阶段：1 = 快速筛查（必答），2 = 深度问诊（可选）
  phase: 1 | 2;
  // 与身体部位的关联
  relatedBodyParts?: string[];
}

export interface ScreeningAnswer {
  questionId: number;
  question: string;
  answer: string | string[];
  note?: string;
}

export const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  // ==================== 第一阶段：快速筛查 (10题) ====================

  // 基本信息 (2题)
  {
    id: 1,
    category: 'basic',
    phase: 1,
    question: '您的年齡範圍？',
    type: 'single',
    options: [
      { value: 'under30', label: '30歲以下' },
      { value: '30-39', label: '30-39歲' },
      { value: '40-49', label: '40-49歲' },
      { value: '50-59', label: '50-59歲' },
      { value: '60plus', label: '60歲以上' },
    ],
  },
  {
    id: 2,
    category: 'basic',
    phase: 1,
    question: '您的生理性別？',
    type: 'single',
    options: [
      { value: 'male', label: '男性' },
      { value: 'female', label: '女性' },
    ],
  },

  // 家族史 - 高价值 (2题)
  {
    id: 3,
    category: 'family',
    phase: 1,
    question: '直系親屬是否有癌症病史？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'lung', label: '肺癌' },
      { value: 'stomach', label: '胃癌' },
      { value: 'colon', label: '大腸癌' },
      { value: 'liver', label: '肝癌' },
      { value: 'breast', label: '乳癌' },
      { value: 'other', label: '其他癌症' },
    ],
  },
  {
    id: 4,
    category: 'family',
    phase: 1,
    question: '直系親屬是否有心腦血管疾病？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'heart', label: '心臟病/心肌梗塞' },
      { value: 'stroke', label: '中風' },
      { value: 'hypertension', label: '高血壓' },
      { value: 'diabetes', label: '糖尿病' },
    ],
  },

  // 警示症状 - 高价值 (2题)
  {
    id: 5,
    category: 'cancer_risk',
    phase: 1,
    question: '最近3個月是否有以下警示症狀？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'weight_loss', label: '不明原因體重下降（3kg以上）' },
      { value: 'fatigue', label: '持續疲勞/乏力' },
      { value: 'lump', label: '發現腫塊' },
      { value: 'blood', label: '異常出血（便血/尿血/咳血）' },
    ],
  },
  {
    id: 6,
    category: 'symptoms',
    phase: 1,
    question: '您目前最困擾的健康問題是？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '沒有特別困擾' },
      { value: 'digestive', label: '消化問題（胃痛/腹脹/便秘）' },
      { value: 'cardiovascular', label: '心血管問題（胸悶/心悸）' },
      { value: 'respiratory', label: '呼吸問題（咳嗽/氣喘）' },
      { value: 'pain', label: '疼痛問題（頭痛/關節痛）' },
      { value: 'sleep', label: '睡眠問題' },
      { value: 'other', label: '其他' },
    ],
    hasNote: true,
  },

  // 生活方式 - 核心 (2题)
  {
    id: 7,
    category: 'lifestyle',
    phase: 1,
    question: '您的吸煙狀況？',
    type: 'single',
    options: [
      { value: 'never', label: '從不吸煙' },
      { value: 'quit', label: '已戒煙' },
      { value: 'current', label: '目前吸煙' },
    ],
  },
  {
    id: 8,
    category: 'lifestyle',
    phase: 1,
    question: '您的飲酒習慣？',
    type: 'single',
    options: [
      { value: 'never', label: '從不飲酒' },
      { value: 'occasional', label: '偶爾飲酒' },
      { value: 'regular', label: '經常飲酒' },
    ],
  },

  // 健康目标 (2题)
  {
    id: 9,
    category: 'history',
    phase: 1,
    question: '您是否被診斷過以下慢性病？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'hypertension', label: '高血壓' },
      { value: 'diabetes', label: '糖尿病' },
      { value: 'hyperlipidemia', label: '高血脂' },
      { value: 'fatty_liver', label: '脂肪肝' },
      { value: 'coronary', label: '冠心病' },
      { value: 'arrhythmia', label: '心律不整' },
      { value: 'gout', label: '痛風/高尿酸' },
      { value: 'thyroid', label: '甲狀腺疾病' },
      { value: 'kidney', label: '慢性腎病' },
      { value: 'copd', label: '慢性呼吸系統疾病' },
      { value: 'arthritis', label: '關節炎/風濕病' },
      { value: 'hepatitis', label: '肝炎(B/C型)' },
      { value: 'gastric', label: '胃病/胃潰瘍' },
      { value: 'other', label: '其他' },
    ],
    hasNote: true,
  },
  {
    id: 10,
    category: 'history',
    phase: 1,
    question: '您這次體檢最希望了解什麼？',
    type: 'input',
    placeholder: '例如：擔心胃癌、想做全面癌症篩查、關注心血管健康...',
  },

  // ==================== 第二阶段：深度问诊 (10题) ====================

  // 详细基本信息
  {
    id: 11,
    category: 'basic',
    phase: 2,
    question: '您的身高體重？',
    type: 'input',
    fields: ['身高(cm)', '體重(kg)'],
    placeholder: '請填寫身高和體重',
  },
  {
    id: 12,
    category: 'basic',
    phase: 2,
    question: '您是否有藥物過敏史？',
    type: 'single',
    options: [
      { value: 'no', label: '無過敏史' },
      { value: 'yes', label: '有（請說明）' },
    ],
    hasNote: true,
  },

  // 详细症状
  {
    id: 13,
    category: 'symptoms',
    phase: 2,
    question: '您是否有消化系統不適？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'stomach_pain', label: '胃痛/上腹痛' },
      { value: 'bloating', label: '腹脹/消化不良' },
      { value: 'reflux', label: '反酸/燒心' },
      { value: 'constipation', label: '便秘' },
      { value: 'diarrhea', label: '腹瀉' },
      { value: 'blood_stool', label: '便血/黑便' },
    ],
    relatedBodyParts: ['abdomen'],
  },
  {
    id: 14,
    category: 'symptoms',
    phase: 2,
    question: '您是否有胸部或心臟相關症狀？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'chest_tightness', label: '胸悶/胸痛' },
      { value: 'palpitation', label: '心悸/心跳異常' },
      { value: 'shortness_breath', label: '活動後呼吸急促' },
      { value: 'edema', label: '下肢浮腫' },
    ],
    relatedBodyParts: ['chest'],
  },
  {
    id: 15,
    category: 'symptoms',
    phase: 2,
    question: '您是否有頭部相關症狀？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'headache', label: '經常頭痛' },
      { value: 'dizziness', label: '頭暈/眩暈' },
      { value: 'vision', label: '視力變化' },
      { value: 'memory', label: '記憶力下降' },
    ],
    relatedBodyParts: ['head'],
  },
  {
    id: 16,
    category: 'symptoms',
    phase: 2,
    question: '您是否有泌尿系統相關問題？（可多選）',
    type: 'multi',
    options: [
      { value: 'none', label: '無' },
      { value: 'frequent', label: '頻尿' },
      { value: 'painful', label: '排尿疼痛' },
      { value: 'blood', label: '血尿' },
      { value: 'nocturia', label: '夜尿多' },
    ],
    relatedBodyParts: ['pelvis'],
  },

  // 生活方式详情
  {
    id: 17,
    category: 'lifestyle',
    phase: 2,
    question: '您每週運動的頻率？',
    type: 'single',
    options: [
      { value: 'none', label: '幾乎不運動' },
      { value: 'light', label: '每週1-2次' },
      { value: 'moderate', label: '每週3-4次' },
      { value: 'active', label: '每週5次以上' },
    ],
  },
  {
    id: 18,
    category: 'lifestyle',
    phase: 2,
    question: '您的平均睡眠時長？',
    type: 'single',
    options: [
      { value: 'under5', label: '少於5小時' },
      { value: '5-6', label: '5-6小時' },
      { value: '7-8', label: '7-8小時' },
      { value: 'over8', label: '超過8小時' },
    ],
  },

  // 心理健康 (PHQ-2)
  {
    id: 19,
    category: 'mental',
    phase: 2,
    question: '過去兩週內，您是否經常感到心情低落或對事物缺乏興趣？',
    type: 'single',
    options: [
      { value: 'not_at_all', label: '完全沒有' },
      { value: 'several_days', label: '有幾天' },
      { value: 'more_than_half', label: '超過一半的天數' },
      { value: 'nearly_every_day', label: '幾乎每天' },
    ],
  },

  // 其他重要信息
  {
    id: 20,
    category: 'history',
    phase: 2,
    question: '既往是否有重大疾病診斷或手術史？',
    type: 'input',
    placeholder: '如有，請填寫疾病/手術名稱；如無，請填寫「無」',
  },
];

// 问题分类名称
export const CATEGORY_NAMES: Record<string, string> = {
  basic: '基本信息',
  family: '家族病史',
  symptoms: '症狀篩查',
  lifestyle: '生活方式',
  history: '健康狀況',
  mental: '心理健康',
  cancer_risk: '警示症狀',
  cardiovascular: '心血管風險',
};

// 分类图标
export const CATEGORY_ICONS: Record<string, string> = {
  basic: '📋',
  family: '👨‍👩‍👧‍👦',
  symptoms: '🩺',
  lifestyle: '🏃',
  history: '📅',
  mental: '🧠',
  cancer_risk: '⚠️',
  cardiovascular: '❤️',
};

// 获取指定分类的问题
export function getQuestionsByCategory(category: string): ScreeningQuestion[] {
  return SCREENING_QUESTIONS.filter((q) => q.category === category);
}

// 获取问题总数
export const TOTAL_QUESTIONS = SCREENING_QUESTIONS.length;

// 第一阶段问题数
export const PHASE_1_QUESTIONS = SCREENING_QUESTIONS.filter((q) => q.phase === 1).length;

// 第二阶段问题数
export const PHASE_2_QUESTIONS = SCREENING_QUESTIONS.filter((q) => q.phase === 2).length;

// 每周免费次数
export const FREE_SCREENING_LIMIT = 5;

// ==================== 动态问诊辅助函数 ====================

// 获取第一阶段问题
export function getPhase1Questions(): ScreeningQuestion[] {
  return SCREENING_QUESTIONS.filter((q) => q.phase === 1);
}

// 获取第二阶段问题
export function getPhase2Questions(): ScreeningQuestion[] {
  return SCREENING_QUESTIONS.filter((q) => q.phase === 2);
}

// 身体部位到症状问题的映射（仅第二阶段）
export const BODY_PART_QUESTION_MAPPING: Record<string, number[]> = {
  head: [15],
  neck: [],
  chest: [14],
  abdomen: [13],
  pelvis: [16],
  'left-arm': [],
  'right-arm': [],
  'left-leg': [],
  'right-leg': [],
  back: [],
};

// 始终显示的第一阶段问题
export const ALWAYS_SHOW_QUESTIONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 根据身体部位获取相关的第二阶段问题
export function getPhase2QuestionsByBodyParts(bodyPartIds: string[]): ScreeningQuestion[] {
  if (!bodyPartIds || bodyPartIds.length === 0) {
    return getPhase2Questions();
  }

  const phase2 = getPhase2Questions();
  const relevantIds = new Set<number>();

  // 始终包含的第二阶段问题（非症状相关）
  phase2.forEach((q) => {
    if (!q.relatedBodyParts) {
      relevantIds.add(q.id);
    }
  });

  // 根据选中部位添加相关问题
  bodyPartIds.forEach((partId) => {
    const ids = BODY_PART_QUESTION_MAPPING[partId] || [];
    ids.forEach((id) => relevantIds.add(id));
  });

  return phase2.filter((q) => relevantIds.has(q.id));
}
