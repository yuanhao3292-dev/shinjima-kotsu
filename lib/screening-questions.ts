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
    question: '您的年龄范围？',
    type: 'single',
    options: [
      { value: 'under30', label: '30岁以下' },
      { value: '30-39', label: '30-39岁' },
      { value: '40-49', label: '40-49岁' },
      { value: '50-59', label: '50-59岁' },
      { value: '60plus', label: '60岁以上' },
    ],
  },
  {
    id: 2,
    category: 'basic',
    phase: 1,
    question: '您的生理性别？',
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
    question: '直系親属是否有癌症病史？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'lung', label: '肺癌' },
      { value: 'stomach', label: '胃癌' },
      { value: 'colon', label: '大肠癌' },
      { value: 'liver', label: '肝癌' },
      { value: 'breast', label: '乳癌' },
      { value: 'other', label: '其他癌症' },
    ],
  },
  {
    id: 4,
    category: 'family',
    phase: 1,
    question: '直系親属是否有心脑血管疾病？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'heart', label: '心脏病/心肌梗塞' },
      { value: 'stroke', label: '中风' },
      { value: 'hypertension', label: '高血压' },
      { value: 'diabetes', label: '糖尿病' },
    ],
  },

  // 警示症状 - 高价值 (2题)
  {
    id: 5,
    category: 'cancer_risk',
    phase: 1,
    question: '最近3个月是否有以下警示症状？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'weight_loss', label: '不明原因体重下降（3kg以上）' },
      { value: 'fatigue', label: '持续疲劳/乏力' },
      { value: 'lump', label: '发現肿塊' },
      { value: 'blood', label: '异常出血（便血/尿血/咳血）' },
    ],
  },
  {
    id: 6,
    category: 'symptoms',
    phase: 1,
    question: '您目前最困扰的健康问题是？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '没有特别困扰' },
      { value: 'digestive', label: '消化问题（胃痛/腹胀/便秘）' },
      { value: 'cardiovascular', label: '心血管问题（胸闷/心悸）' },
      { value: 'respiratory', label: '呼吸问题（咳嗽/气喘）' },
      { value: 'pain', label: '疼痛问题（头痛/关节痛）' },
      { value: 'sleep', label: '睡眠问题' },
      { value: 'other', label: '其他' },
    ],
    hasNote: true,
  },

  // 生活方式 - 核心 (2题)
  {
    id: 7,
    category: 'lifestyle',
    phase: 1,
    question: '您的吸烟状況？',
    type: 'single',
    options: [
      { value: 'never', label: '从不吸烟' },
      { value: 'quit', label: '已戒烟' },
      { value: 'current', label: '目前吸烟' },
    ],
  },
  {
    id: 8,
    category: 'lifestyle',
    phase: 1,
    question: '您的饮酒習惯？',
    type: 'single',
    options: [
      { value: 'never', label: '从不饮酒' },
      { value: 'occasional', label: '偶尔饮酒' },
      { value: 'regular', label: '经常饮酒' },
    ],
  },

  // 健康目标 (2题)
  {
    id: 9,
    category: 'history',
    phase: 1,
    question: '您是否被诊断过以下慢性病？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'hypertension', label: '高血压' },
      { value: 'diabetes', label: '糖尿病' },
      { value: 'hyperlipidemia', label: '高血脂' },
      { value: 'fatty_liver', label: '脂肪肝' },
      { value: 'coronary', label: '冠心病' },
      { value: 'arrhythmia', label: '心律不齐' },
      { value: 'gout', label: '痛风/高尿酸' },
      { value: 'thyroid', label: '甲状腺疾病' },
      { value: 'kidney', label: '慢性肾病' },
      { value: 'copd', label: '慢性呼吸系统疾病' },
      { value: 'arthritis', label: '关节炎/风湿病' },
      { value: 'hepatitis', label: '肝炎(B/C型)' },
      { value: 'gastric', label: '胃病/胃溃疡' },
      { value: 'other', label: '其他' },
    ],
    hasNote: true,
  },
  {
    id: 10,
    category: 'history',
    phase: 1,
    question: '您這次体检最希望了解什么？',
    type: 'input',
    placeholder: '例如：担心胃癌、想做全面癌症筛查、关注心血管健康...',
  },

  // ==================== 第二阶段：深度问诊 (10题) ====================

  // 详细基本信息
  {
    id: 11,
    category: 'basic',
    phase: 2,
    question: '您的身高体重？',
    type: 'input',
    fields: ['身高(cm)', '体重(kg)'],
    placeholder: '请填写身高和体重',
  },
  {
    id: 12,
    category: 'basic',
    phase: 2,
    question: '您是否有藥物过敏史？',
    type: 'single',
    options: [
      { value: 'no', label: '无过敏史' },
      { value: 'yes', label: '有（请说明）' },
    ],
    hasNote: true,
  },

  // 详细症状
  {
    id: 13,
    category: 'symptoms',
    phase: 2,
    question: '您是否有消化系统不适？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'stomach_pain', label: '胃痛/上腹痛' },
      { value: 'bloating', label: '腹胀/消化不良' },
      { value: 'reflux', label: '反酸/燒心' },
      { value: 'constipation', label: '便秘' },
      { value: 'diarrhea', label: '腹泻' },
      { value: 'blood_stool', label: '便血/黑便' },
    ],
    relatedBodyParts: ['abdomen'],
  },
  {
    id: 14,
    category: 'symptoms',
    phase: 2,
    question: '您是否有胸部或心脏相关症状？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'chest_tightness', label: '胸闷/胸痛' },
      { value: 'palpitation', label: '心悸/心跳异常' },
      { value: 'shortness_breath', label: '活动后呼吸急促' },
      { value: 'edema', label: '下肢浮肿' },
    ],
    relatedBodyParts: ['chest'],
  },
  {
    id: 15,
    category: 'symptoms',
    phase: 2,
    question: '您是否有头部相关症状？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'headache', label: '经常头痛' },
      { value: 'dizziness', label: '头暈/眩暈' },
      { value: 'vision', label: '视力变化' },
      { value: 'memory', label: '記忆力下降' },
    ],
    relatedBodyParts: ['head'],
  },
  {
    id: 16,
    category: 'symptoms',
    phase: 2,
    question: '您是否有泌尿系统相关问题？（可多选）',
    type: 'multi',
    options: [
      { value: 'none', label: '无' },
      { value: 'frequent', label: '频尿' },
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
    question: '您每周运动的频率？',
    type: 'single',
    options: [
      { value: 'none', label: '几乎不运动' },
      { value: 'light', label: '每周1-2次' },
      { value: 'moderate', label: '每周3-4次' },
      { value: 'active', label: '每周5次以上' },
    ],
  },
  {
    id: 18,
    category: 'lifestyle',
    phase: 2,
    question: '您的平均睡眠时长？',
    type: 'single',
    options: [
      { value: 'under5', label: '少于5小时' },
      { value: '5-6', label: '5-6小时' },
      { value: '7-8', label: '7-8小时' },
      { value: 'over8', label: '超过8小时' },
    ],
  },

  // 心理健康 (PHQ-2)
  {
    id: 19,
    category: 'mental',
    phase: 2,
    question: '过去两周內，您是否经常感到心情低落或对事物缺乏興趣？',
    type: 'single',
    options: [
      { value: 'not_at_all', label: '完全没有' },
      { value: 'several_days', label: '有几天' },
      { value: 'more_than_half', label: '超过一半的天数' },
      { value: 'nearly_every_day', label: '几乎每天' },
    ],
  },

  // 其他重要信息
  {
    id: 20,
    category: 'history',
    phase: 2,
    question: '既往是否有重大疾病诊断或手术史？',
    type: 'input',
    placeholder: '如有，请填写疾病/手术名稱；如无，请填写「无」',
  },
];

// 问题分类名称
export const CATEGORY_NAMES: Record<string, string> = {
  basic: '基本信息',
  family: '家族病史',
  symptoms: '症状筛查',
  lifestyle: '生活方式',
  history: '健康状況',
  mental: '心理健康',
  cancer_risk: '警示症状',
  cardiovascular: '心血管风险',
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
