/**
 * AEMC Hospital Matcher
 *
 * 确定性规则引擎：根据 AI 分诊结果匹配最合适的合作医院。
 * 不调用任何 AI API，纯本地计算。
 *
 * 数据源：
 * - 主：Supabase jtb_hospitals 表（159 JTB + 11 直营）
 * - 备：静态 HOSPITAL_KNOWLEDGE_BASE（DB 查询失败时降级）
 *
 * 匹配逻辑：
 * 1. 科室匹配（权重最高）
 * 2. 症状/疾病关键词匹配
 * 3. 急症能力匹配
 * 4. 风险等级适配
 * 5. 优先级加权
 *
 * 输出 top-N 推荐，附带匹配理由和注意事项。
 */

import type {
  StructuredCase,
  TriageAssessment,
  AdjudicatedAssessment,
  HospitalRecommendation,
  HospitalMatch,
} from './types';

import {
  HOSPITAL_KNOWLEDGE_BASE,
  normalizeDepartment,
  getLocalizedHospitalInfo,
  getLocalizedDepartment,
  type HospitalKnowledge,
  type AEMCLang,
} from './hospital-knowledge-base';

import { getSupabaseAdmin } from '@/lib/supabase/api';
import { aemcLog } from './logger';

// ============================================================
// 配置
// ============================================================

/** 最多推荐医院数量 */
const MAX_RECOMMENDATIONS = 3;

/** 最低匹配分数阈值（低于此分的医院不推荐） */
const MIN_MATCH_SCORE = 0.15;

/** 匹配权重 */
const WEIGHTS = {
  /** 科室匹配（累积 + 覆盖率） */
  departmentMatch: 0.35,
  /** 专科/治疗方向匹配 */
  specialtyMatch: 0.20,
  /** 症状/疾病关键词匹配 */
  conditionMatch: 0.15,
  /** 急症能力匹配 */
  emergencyMatch: 0.10,
  /** 机构优先级（规模/综合性） */
  priorityBonus: 0.10,
  /** 科室覆盖率加分（覆盖越多患者需求科室 → 分越高） */
  coverageBonus: 0.10,
};

// ============================================================
// 多语言标签
// ============================================================

const MATCHER_LABELS: Record<string, Record<AEMCLang, string>> = {
  deptMatch: {
    'zh-CN': '科室匹配', 'zh-TW': '科室匹配', en: 'Department match', ja: '診療科一致',
  },
  deptRelated: {
    'zh-CN': '科室相关', 'zh-TW': '科室相關', en: 'Related department', ja: '関連診療科',
  },
  deptNeeded: {
    'zh-CN': '需求', 'zh-TW': '需求', en: 'needed', ja: '必要',
  },
  specialtyMatch: {
    'zh-CN': '专科匹配', 'zh-TW': '專科匹配', en: 'Specialty match', ja: '専門分野一致',
  },
  conditionMatch: {
    'zh-CN': '个症状/疾病关键词匹配', 'zh-TW': '個症狀/疾病關鍵詞匹配',
    en: ' symptom/condition keyword match(es)', ja: '件の症状/疾患キーワード一致',
  },
  hasEmergency: {
    'zh-CN': '具备急诊处理能力', 'zh-TW': '具備急診處理能力',
    en: 'Emergency care capability', ja: '救急対応可能',
  },
  noEmergency: {
    'zh-CN': '该机构不具备急诊能力，紧急情况请就近就医',
    'zh-TW': '該機構不具備急診能力，緊急情況請就近就醫',
    en: 'This facility does not have emergency capability. In emergencies, please seek nearby medical care.',
    ja: 'この施設には救急対応能力がありません。緊急時は最寄りの医療機関を受診してください。',
  },
  clinicCaution: {
    'zh-CN': '该机构为诊所（无住院床位），高风险患者可能需要综合医院',
    'zh-TW': '該機構為診所（無住院床位），高風險患者可能需要綜合醫院',
    en: 'This is a clinic (no inpatient beds). High-risk patients may require a general hospital.',
    ja: 'この施設はクリニック（入院ベッドなし）です。高リスク患者は総合病院が必要な場合があります。',
  },
  noRemote: {
    'zh-CN': '该机构暂不提供线上会诊', 'zh-TW': '該機構暫不提供線上會診',
    en: 'Remote consultation not currently available', ja: 'オンライン診療は現在対応していません',
  },
  noMatch: {
    'zh-CN': '未找到匹配的合作机构，建议联系人工客服进行分诊协调。',
    'zh-TW': '未找到匹配的合作機構，建議聯繫人工客服進行分診協調。',
    en: 'No matching partner facility found. Please contact our team for triage coordination.',
    ja: '該当する提携施設が見つかりませんでした。トリアージのコーディネートについてはスタッフにお問い合わせください。',
  },
  emergencyRouting: {
    'zh-CN': '⚠️ 检测到紧急情况，建议立即就近急诊。如需后续专科治疗，可联系我们协调转诊。',
    'zh-TW': '⚠️ 檢測到緊急情況，建議立即就近急診。如需後續專科治療，可聯繫我們協調轉診。',
    en: '⚠️ Emergency detected. Please seek immediate medical care at the nearest facility. Contact us for specialist referral coordination.',
    ja: '⚠️ 緊急事態が検出されました。最寄りの医療機関で直ちに受診してください。専門的な治療の手配はスタッフにご連絡ください。',
  },
  highMatchRouting: {
    'zh-CN': '推荐优先联系「{name}」的{dept}进行咨询。',
    'zh-TW': '推薦優先聯繫「{name}」的{dept}進行諮詢。',
    en: 'We recommend contacting {dept} at "{name}" for consultation.',
    ja: '「{name}」の{dept}への相談をお勧めします。',
  },
  defaultRouting: {
    'zh-CN': '根据您的症状，建议咨询「{name}」。具体科室安排以医院回复为准。',
    'zh-TW': '根據您的症狀，建議諮詢「{name}」。具體科室安排以醫院回覆為準。',
    en: 'Based on your symptoms, we suggest consulting "{name}". Specific department arrangements are subject to the hospital\'s response.',
    ja: '症状に基づき、「{name}」への相談をお勧めします。具体的な診療科は病院の回答に基づきます。',
  },
  dpcRecord: {
    'zh-CN': 'DPC实绩', 'zh-TW': 'DPC實績', en: 'DPC record', ja: 'DPC実績',
  },
  dpcCases: {
    'zh-CN': '例', 'zh-TW': '例', en: ' cases', ja: '件',
  },
};

function ML(key: string, lang: AEMCLang): string {
  return MATCHER_LABELS[key]?.[lang] || MATCHER_LABELS[key]?.['zh-CN'] || key;
}

// ============================================================
// DB 查询：从 jtb_hospitals 表获取候选医院
// ============================================================

interface DBHospitalRow {
  id: string;
  internal_id: string | null;
  source: string;
  name_ja: string;
  name_en: string;
  name_zh_cn: string;
  name_zh_tw: string;
  region: string;
  prefecture: string;
  category: string;
  departments: string[];
  specialties: string[];
  condition_keywords: string[];
  equipment: string[];
  has_emergency: boolean;
  bed_count: number;
  features_ja: string[];
  features_en: string[];
  features_zh_cn: string[];
  features_zh_tw: string[];
  suitable_for_ja: string;
  suitable_for_en: string;
  suitable_for_zh_cn: string;
  suitable_for_zh_tw: string;
  location_ja: string;
  location_en: string;
  location_zh_cn: string;
  location_zh_tw: string;
  languages: string[];
  website_url: string;
  priority: number;
  specialist_doctors: { name: string; qualification: string }[] | null;
  top_treatments: { disease: string; total: number; surgery?: number; non_surgery?: number; pref_rank?: string; national_rank?: string }[] | null;
}

/**
 * 将 DB 行转换为 HospitalKnowledge 兼容对象
 */
function dbRowToKnowledge(row: DBHospitalRow): HospitalKnowledge {
  return {
    id: row.internal_id || row.id,
    name: row.name_zh_cn || row.name_ja,
    nameJa: row.name_ja,
    nameZhTw: row.name_zh_tw || undefined,
    nameEn: row.name_en || undefined,
    location: row.location_zh_cn || row.location_ja || `${row.prefecture}`,
    category: (row.category as HospitalKnowledge['category']) || 'general_hospital',
    departments: row.departments || [],
    specialties: row.specialties || [],
    conditionKeywords: row.condition_keywords || [],
    features: row.features_zh_cn?.length > 0 ? row.features_zh_cn : row.features_ja || [],
    suitableFor: row.suitable_for_zh_cn || row.suitable_for_ja || '',
    hasEmergency: row.has_emergency || false,
    hasRemoteConsultation: false,
    bedCount: row.bed_count || 0,
    priority: row.priority || 5,
    // Store i18n data for localization
    _i18n: {
      location: { ja: row.location_ja, en: row.location_en, 'zh-CN': row.location_zh_cn, 'zh-TW': row.location_zh_tw },
      features: { ja: row.features_ja, en: row.features_en, 'zh-CN': row.features_zh_cn, 'zh-TW': row.features_zh_tw },
      suitableFor: { ja: row.suitable_for_ja, en: row.suitable_for_en, 'zh-CN': row.suitable_for_zh_cn, 'zh-TW': row.suitable_for_zh_tw },
      name: { ja: row.name_ja, en: row.name_en, 'zh-CN': row.name_zh_cn, 'zh-TW': row.name_zh_tw },
    },
    _specialistDoctors: row.specialist_doctors || [],
    _topTreatments: row.top_treatments || [],
  } as HospitalKnowledge & { _i18n: unknown };
}

/**
 * 获取本地化医院信息（支持 DB 行的 _i18n 字段）
 */
function getLocalizedInfo(hospital: HospitalKnowledge, lang: AEMCLang) {
  const i18n = (hospital as HospitalKnowledge & { _i18n?: Record<string, Record<string, string | string[]>> })._i18n;

  if (i18n) {
    const name = (i18n.name?.[lang] as string) || hospital.nameJa || hospital.name;
    const location = (i18n.location?.[lang] as string) || hospital.location;
    const features = (i18n.features?.[lang] as string[]) || hospital.features;
    const suitableFor = (i18n.suitableFor?.[lang] as string) || hospital.suitableFor;
    return { name: name || hospital.name, location, features, suitableFor };
  }

  // Fallback to original function for static data
  return getLocalizedHospitalInfo(hospital, lang);
}

/**
 * 从 DB 查询候选医院
 * 使用 GIN 索引按科室 overlap 过滤，返回候选集
 */
/** 查询所需的列（排除 raw_data 等大字段） */
const DB_SELECT_COLUMNS = [
  'id', 'internal_id', 'source', 'name_ja', 'name_en', 'name_zh_cn', 'name_zh_tw',
  'region', 'prefecture', 'category',
  'departments', 'specialties', 'condition_keywords', 'equipment',
  'has_emergency', 'bed_count',
  'features_ja', 'features_en', 'features_zh_cn', 'features_zh_tw',
  'suitable_for_ja', 'suitable_for_en', 'suitable_for_zh_cn', 'suitable_for_zh_tw',
  'location_ja', 'location_en', 'location_zh_cn', 'location_zh_tw',
  'languages', 'website_url', 'priority',
  'specialist_doctors', 'top_treatments',
].join(',');

async function queryHospitalCandidates(): Promise<HospitalKnowledge[] | null> {
  try {
    const supabase = getSupabaseAdmin();

    // 全量查询所有活跃医院，由评分算法决定排名
    // 174 家医院全量评分无性能压力，避免 overlaps 预过滤遗漏专科中心
    const { data, error } = await supabase
      .from('jtb_hospitals')
      .select(DB_SELECT_COLUMNS)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) {
      aemcLog.warn('hospital-matcher', 'DB query failed', { error: error.message });
      return null;
    }

    if (!data || data.length === 0) return null;

    return (data as unknown as DBHospitalRow[]).map(dbRowToKnowledge);
  } catch (err) {
    aemcLog.warn('hospital-matcher', 'DB query error', { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

// ============================================================
// 专科中心识别：名称/专科关键词 → 对应科室
// 当医院是某领域的专科中心且患者需要该科室时，额外加分
// ============================================================

const SPECIALTY_CENTER_INDICATORS: { keywords: string[]; depts: string[] }[] = [
  { keywords: ['循環器', '循环器', '心臓', '心脏', 'cardiovascular', 'cardiac', 'heart'], depts: ['循环内科', '心脏外科'] },
  { keywords: ['がん', '癌', 'cancer', '腫瘍', '肿瘤', 'oncology'], depts: ['肿瘤科', '放射线治疗科', '化疗科'] },
  { keywords: ['脳', '脑', 'neuro', '神経', '神经'], depts: ['脑神经外科', '神经内科'] },
  { keywords: ['呼吸', 'respiratory', 'pulmonary', '肺'], depts: ['呼吸内科'] },
  { keywords: ['消化', 'gastro', '胃', '肝'], depts: ['消化内科', '消化外科'] },
  { keywords: ['腎', '肾', 'kidney', 'renal', 'nephro'], depts: ['肾脏内科'] },
  { keywords: ['眼', 'eye', 'ophthalm'], depts: ['眼科'] },
  { keywords: ['整形', 'orthop', '骨'], depts: ['骨科'] },
  { keywords: ['小児', '小儿', '儿童', 'pediatr', 'children'], depts: ['小儿科'] },
];

/**
 * 检测医院是否为某领域的专科中心
 * 依据：医院名称 / specialties / category 含有专科指标词
 * 返回该专科中心对应的科室列表
 */
function detectSpecialtyCenterDepts(hospital: HospitalKnowledge): string[] {
  const texts = [
    hospital.name, hospital.nameJa, hospital.nameEn || '',
    ...hospital.specialties,
    hospital.suitableFor,
  ].map((t) => t.toLowerCase());

  const matched: string[] = [];
  for (const indicator of SPECIALTY_CENTER_INDICATORS) {
    const isCenter = indicator.keywords.some((kw) =>
      texts.some((t) => t.includes(kw.toLowerCase()))
    );
    if (isCenter) {
      matched.push(...indicator.depts);
    }
  }
  return [...new Set(matched)];
}

// ============================================================
// 专科医生资质 → 科室匹配（日语资质 → 中文科室关键词）
// ============================================================

const QUALIFICATION_DEPT_MAP: Record<string, string[]> = {
  '総合診療': ['内科', '全科'],
  '循環器': ['循环', '心脏'],
  '消化器': ['消化'],
  '呼吸器': ['呼吸'],
  '内分泌': ['内分泌'],
  '糖尿病': ['内分泌', '糖尿'],
  '腎臓': ['肾'],
  '血液': ['血液'],
  '脳神経': ['脑', '神经'],
  '神経内科': ['神经'],
  '整形外科': ['骨科', '整形'],
  '皮膚': ['皮肤'],
  '眼科': ['眼科'],
  '耳鼻咽喉': ['耳鼻'],
  '泌尿器': ['泌尿'],
  '産婦人科': ['妇产'],
  '小児': ['小儿', '儿科'],
  '放射線': ['放射'],
  '麻酔': ['麻醉'],
  'リハビリ': ['康复'],
  '外科': ['外科'],
  '乳腺': ['乳腺'],
  '感染症': ['感染'],
  'アレルギー': ['过敏'],
  '肝臓': ['肝'],
  '救急': ['急救', '急诊'],
  'がん': ['肿瘤'],
  '腫瘍': ['肿瘤'],
};

/**
 * 根据患者需要的科室，从医院专科医生中筛选匹配的医生
 */
function matchDoctorsToNeededDepts(
  doctors: { name: string; qualification: string }[],
  neededDepts: string[],
  maxResults = 3
): { name: string; qualification: string }[] {
  if (!doctors || doctors.length === 0 || neededDepts.length === 0) return [];

  const matched: { name: string; qualification: string }[] = [];
  const seen = new Set<string>();

  for (const doctor of doctors) {
    if (seen.has(doctor.name)) continue;

    for (const [qualKeyword, deptKeywords] of Object.entries(QUALIFICATION_DEPT_MAP)) {
      if (doctor.qualification.includes(qualKeyword)) {
        const isRelevant = neededDepts.some((dept) =>
          deptKeywords.some((dk) => dept.includes(dk))
        );
        if (isRelevant) {
          matched.push(doctor);
          seen.add(doctor.name);
          break;
        }
      }
    }

    if (matched.length >= maxResults) break;
  }

  return matched;
}

/**
 * 获取医院的 DPC 治疗实绩展示文本（不影响评分，仅展示）
 */
function getDPCReasons(
  treatments: { disease: string; total: number; pref_rank?: string; national_rank?: string }[] | null,
  lang: AEMCLang,
  maxResults = 2
): string[] {
  if (!treatments || treatments.length === 0) return [];

  const top = [...treatments]
    .sort((a, b) => b.total - a.total)
    .slice(0, maxResults);

  return top.map((t) => {
    const rankInfo = t.national_rank || t.pref_rank || '';
    const rankSuffix = rankInfo ? `（${rankInfo}）` : '';
    return `${ML('dpcRecord', lang)}: ${t.disease} ${t.total}${ML('dpcCases', lang)}${rankSuffix}`;
  });
}

// ============================================================
// 主入口
// ============================================================

/**
 * 根据分诊结果匹配合适的医院
 *
 * 数据流：DB 查询 → 加权评分 → top-N 推荐
 * 降级：DB 不可用时使用静态 HOSPITAL_KNOWLEDGE_BASE
 *
 * @param structuredCase AI-1 抽取的病历
 * @param triageAssessment AI-2 分诊判断
 * @param adjudicatedAssessment AI-4 仲裁结果
 * @param language 输出语言
 * @returns HospitalRecommendation
 */
export async function matchHospitals(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  adjudicatedAssessment: AdjudicatedAssessment,
  language?: string
): Promise<HospitalRecommendation> {
  const lang = (language || 'zh-CN') as AEMCLang;

  // 提取匹配特征
  const features = extractMatchingFeatures(
    structuredCase,
    triageAssessment,
    adjudicatedAssessment
  );

  // 从 DB 查询候选医院，失败时降级到静态数据
  let candidates: HospitalKnowledge[];
  let useDB = false;

  const dbCandidates = await queryHospitalCandidates();
  if (dbCandidates && dbCandidates.length > 0) {
    candidates = dbCandidates;
    useDB = true;
  } else {
    candidates = HOSPITAL_KNOWLEDGE_BASE;
    aemcLog.info('hospital-matcher', 'Using static knowledge base as fallback');
  }

  // 对每个医院计算匹配分数
  const scoredHospitals: ScoredHospital[] = candidates.map((hospital) => {
    const scoreResult = calculateMatchScore(hospital, features, lang);
    return {
      hospital,
      score: scoreResult.score,
      matchReasons: scoreResult.matchReasons,
      cautions: scoreResult.cautions,
      departmentMatched: scoreResult.departmentMatched,
    };
  });

  // 排序：分数降序 → 优先级降序 → ID 字母序（确保完全确定性）
  scoredHospitals.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.hospital.priority !== b.hospital.priority) return b.hospital.priority - a.hospital.priority;
    return a.hospital.id.localeCompare(b.hospital.id);
  });

  // 过滤低于阈值的
  const qualified = scoredHospitals.filter((s) => s.score >= MIN_MATCH_SCORE);

  // 取 top-N
  const topN = qualified.slice(0, MAX_RECOMMENDATIONS);

  // 构建输出（使用本地化名称，附加医生推荐和 DPC 实绩）
  const recommendedHospitals: HospitalMatch[] = topN.map((s) => {
    const localized = useDB ? getLocalizedInfo(s.hospital, lang) : getLocalizedHospitalInfo(s.hospital, lang);
    const enriched = s.hospital as HospitalKnowledge & {
      _specialistDoctors?: { name: string; qualification: string }[];
      _topTreatments?: { disease: string; total: number; pref_rank?: string; national_rank?: string }[];
    };

    // DPC 实绩展示（不影响评分）
    const dpcReasons = getDPCReasons(enriched._topTreatments || null, lang);
    const allReasons = [...s.matchReasons, ...dpcReasons];

    // 匹配相关科室的专科医生
    const doctors = matchDoctorsToNeededDepts(
      enriched._specialistDoctors || [],
      features.normalizedDepartments
    );

    return {
      hospital_id: s.hospital.id,
      hospital_name: localized.name,
      hospital_name_ja: s.hospital.nameJa,
      location: localized.location || s.hospital.location,
      department: getLocalizedDepartment(s.departmentMatched || s.hospital.departments[0], lang),
      match_score: Math.round(s.score * 100) / 100,
      match_reasons: allReasons,
      cautions: s.cautions,
      recommended_doctors: doctors.length > 0 ? doctors : undefined,
    };
  });

  // 路由建议
  const routingSuggestion = generateRoutingSuggestion(topN, features, lang, useDB);

  // 是否需要人工协调员介入
  const requiresManualReview =
    features.isEmergency ||
    features.riskLevel === 'emergency' ||
    features.normalizedDepartments.length === 0 ||
    qualified.length === 0;

  return {
    recommended_hospitals: recommendedHospitals,
    routing_suggestion: routingSuggestion,
    requires_manual_coordinator_review: requiresManualReview,
  };
}

// ============================================================
// 内部类型
// ============================================================

interface MatchingFeatures {
  /** 标准化后的推荐科室 */
  normalizedDepartments: string[];
  /** 原始科室名称 */
  rawDepartments: string[];
  /** 症状名称列表 */
  symptoms: string[];
  /** 鉴别方向 */
  differentialNames: string[];
  /** 建议检查 */
  suggestedTests: string[];
  /** 红旗标志 */
  redFlags: string[];
  /** 是否需要急诊 */
  isEmergency: boolean;
  /** 最终风险等级 */
  riskLevel: string;
  /** 主诉文本 */
  chiefComplaint: string;
}

interface ScoredHospital {
  hospital: HospitalKnowledge;
  score: number;
  matchReasons: string[];
  cautions: string[];
  departmentMatched: string;
}

interface ScoreResult {
  score: number;
  matchReasons: string[];
  cautions: string[];
  departmentMatched: string;
}

// ============================================================
// 特征提取
// ============================================================

function extractMatchingFeatures(
  structuredCase: StructuredCase,
  triageAssessment: TriageAssessment,
  adjudicatedAssessment: AdjudicatedAssessment
): MatchingFeatures {
  const rawDepartments = adjudicatedAssessment.final_departments;
  const normalizedDepartments = rawDepartments.map(normalizeDepartment);

  const symptoms = structuredCase.present_illness.symptoms.map((s) => s.name);

  const differentialNames = triageAssessment.differential_directions.map((d) => d.name);

  return {
    normalizedDepartments,
    rawDepartments,
    symptoms,
    differentialNames,
    suggestedTests: triageAssessment.suggested_tests,
    redFlags: structuredCase.red_flags,
    isEmergency: triageAssessment.needs_emergency_evaluation,
    riskLevel: adjudicatedAssessment.final_risk_level,
    chiefComplaint: structuredCase.chief_complaint,
  };
}

// ============================================================
// 分数计算
// ============================================================

function calculateMatchScore(
  hospital: HospitalKnowledge,
  features: MatchingFeatures,
  lang: AEMCLang
): ScoreResult {
  const matchReasons: string[] = [];
  const cautions: string[] = [];
  let departmentMatched = '';

  // --- 1. 科室匹配（累积制：匹配越多科室 → 分越高） ---
  const hospitalNormalizedDepts = hospital.departments.map(normalizeDepartment);
  const totalNeeded = features.normalizedDepartments.length || 1;
  let exactMatches = 0;
  let partialMatches = 0;
  const matchedDeptNames: string[] = [];

  for (const reqDept of features.normalizedDepartments) {
    // 精确匹配
    if (hospitalNormalizedDepts.includes(reqDept)) {
      exactMatches++;
      if (!departmentMatched) departmentMatched = reqDept;
      matchedDeptNames.push(getLocalizedDepartment(reqDept, lang));
      continue;
    }
    // 部分匹配：科室名称包含关系
    let found = false;
    for (const hospDept of hospitalNormalizedDepts) {
      if (reqDept.includes(hospDept) || hospDept.includes(reqDept)) {
        partialMatches++;
        if (!departmentMatched) departmentMatched = hospDept;
        matchedDeptNames.push(getLocalizedDepartment(hospDept, lang));
        found = true;
        break;
      }
    }
    if (found) continue;
  }

  // 科室分数：精确匹配 1.0/个，部分匹配 0.6/个，取平均
  const totalDeptHits = exactMatches + partialMatches;
  const deptScore = totalDeptHits > 0
    ? (exactMatches * 1.0 + partialMatches * 0.6) / totalNeeded
    : 0;

  if (matchedDeptNames.length > 0) {
    matchReasons.push(`${ML('deptMatch', lang)}: ${matchedDeptNames.join(', ')}`);
  }

  // 覆盖率分数：覆盖患者多少比例的科室需求
  const coverageScore = Math.min(totalDeptHits / totalNeeded, 1);

  // --- 2. 专科匹配 ---
  let specialtyScore = 0;
  const allFeatureTexts = [
    ...features.differentialNames,
    ...features.suggestedTests,
    features.chiefComplaint,
  ].map((t) => t.toLowerCase());

  for (const specialty of hospital.specialties) {
    const specialtyLower = specialty.toLowerCase();
    if (allFeatureTexts.some((t) => t.includes(specialtyLower) || specialtyLower.includes(t))) {
      specialtyScore = Math.min(specialtyScore + 0.3, 1);
      matchReasons.push(`${ML('specialtyMatch', lang)}: ${specialty}`);
    }
  }

  // --- 2b. 专科中心加分 ---
  // 如果医院是某领域的专科中心，且患者需要该科室，给予 specialty 额外加分
  const centerDepts = detectSpecialtyCenterDepts(hospital);
  if (centerDepts.length > 0) {
    const centerMatchCount = features.normalizedDepartments.filter((d) =>
      centerDepts.includes(d)
    ).length;
    if (centerMatchCount > 0) {
      // 专科中心匹配患者关键科室 → specialty 分数直接拉满
      specialtyScore = Math.min(specialtyScore + 0.5 * centerMatchCount, 1);
      if (!matchReasons.some((r) => r.includes(ML('specialtyMatch', lang)))) {
        matchReasons.push(`${ML('specialtyMatch', lang)}: ${centerDepts[0]}`);
      }
    }
  }

  // --- 3. 症状/疾病关键词匹配 ---
  let conditionScore = 0;
  const patientTexts = [
    ...features.symptoms,
    ...features.differentialNames,
    features.chiefComplaint,
    ...features.redFlags,
  ].map((t) => t.toLowerCase());

  let conditionMatches = 0;
  for (const keyword of hospital.conditionKeywords) {
    const keywordLower = keyword.toLowerCase();
    if (patientTexts.some((t) => t.includes(keywordLower) || keywordLower.includes(t))) {
      conditionMatches++;
    }
  }
  if (hospital.conditionKeywords.length > 0) {
    conditionScore = Math.min(conditionMatches / Math.min(hospital.conditionKeywords.length, 5), 1);
  }
  if (conditionMatches > 0) {
    matchReasons.push(`${conditionMatches} ${ML('conditionMatch', lang)}`);
  }

  // --- 4. 急症能力匹配 ---
  let emergencyScore = 0;
  if (features.isEmergency || features.riskLevel === 'emergency') {
    if (hospital.hasEmergency) {
      emergencyScore = 1;
      matchReasons.push(ML('hasEmergency', lang));
    } else {
      emergencyScore = 0;
      cautions.push(ML('noEmergency', lang));
    }
  } else {
    // 非急症时，急症能力不影响分数
    emergencyScore = 0.5;
  }

  // --- 5. 优先级加权 ---
  const priorityScore = hospital.priority / 10; // normalize to 0-1

  // --- 综合分数 ---
  let score =
    deptScore * WEIGHTS.departmentMatch +
    specialtyScore * WEIGHTS.specialtyMatch +
    conditionScore * WEIGHTS.conditionMatch +
    emergencyScore * WEIGHTS.emergencyMatch +
    priorityScore * WEIGHTS.priorityBonus +
    coverageScore * WEIGHTS.coverageBonus;

  // 急症降级：非急诊机构在紧急情况下大幅降分，避免推荐到无急救能力的诊所
  if ((features.isEmergency || features.riskLevel === 'emergency') && !hospital.hasEmergency) {
    score *= 0.3;
  }

  // --- 注意事项 ---
  if (hospital.bedCount === 0 && features.riskLevel === 'high') {
    cautions.push(ML('clinicCaution', lang));
  }
  if (!hospital.hasRemoteConsultation) {
    cautions.push(ML('noRemote', lang));
  }

  return {
    score,
    matchReasons,
    cautions,
    departmentMatched,
  };
}

// ============================================================
// 路由建议生成
// ============================================================

function generateRoutingSuggestion(
  topHospitals: ScoredHospital[],
  features: MatchingFeatures,
  lang: AEMCLang,
  useDB = false
): string {
  if (topHospitals.length === 0) {
    return ML('noMatch', lang);
  }

  if (features.isEmergency || features.riskLevel === 'emergency') {
    return ML('emergencyRouting', lang);
  }

  const top = topHospitals[0];
  const localized = useDB ? getLocalizedInfo(top.hospital, lang) : getLocalizedHospitalInfo(top.hospital, lang);
  const dept = getLocalizedDepartment(top.departmentMatched || top.hospital.departments[0], lang);

  if (top.score >= 0.6) {
    return ML('highMatchRouting', lang)
      .replace('{name}', localized.name)
      .replace('{dept}', dept);
  }

  return ML('defaultRouting', lang)
    .replace('{name}', localized.name);
}
