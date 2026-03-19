/**
 * AI 筛查结果 → 精准套餐推荐引擎
 *
 * 确定性匹配（无 AI 调用），基于 AnalysisResult 中的
 * riskLevel / recommendedDepartments / recommendedTests / treatmentSuggestions。
 *
 * 3 层优先级：
 *   Tier 1 — 癌症红旗关键词 → 癌症咨询 + DWIBS
 *   Tier 2 — 科室关键词 → 专科套餐
 *   Tier 3 — 风险等级兜底 → VIP / Basic
 */

import type { AnalysisResult } from '@/services/aemc/types';
import type { Language } from '@/hooks/useLanguage';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';

// ============================================================
// Types
// ============================================================

export interface PackageRecommendation {
  slug: string;
  score: number;
  matchReasonKey: string;
}

// ============================================================
// 癌症关键词（中日英）
// ============================================================

const CANCER_KEYWORDS = [
  'cancer', 'tumor', 'tumour', 'malignant', 'oncology', 'carcinoma',
  'lymphoma', 'leukemia', 'metastasis', 'neoplasm', 'sarcoma',
  '癌', '腫瘍', '腫瘤', '肿瘤', '悪性', '恶性', '転移', '轉移',
  'がん', '白血病', 'リンパ腫',
];

// ============================================================
// 科室 → 套餐映射
// ============================================================

interface DeptMapping {
  slug: string;
  score: number;
  reason: string;
}

const DEPT_KEYWORDS: [string[], DeptMapping][] = [
  // 心脏
  [
    ['cardiology', 'cardiac', '心脏', '心臓', '循环', '循環', '心血管'],
    { slug: 'premium-cardiac-course', score: 90, reason: 'deptCardiology' },
  ],
  // 消化道
  [
    ['gastroenterology', 'gastro', '消化', '胃腸', '胃肠', '大肠', '大腸', '结肠', '結腸'],
    { slug: 'select-gastro-colonoscopy', score: 90, reason: 'deptGastro' },
  ],
  // 肝脏
  [
    ['hepatology', 'liver', '肝', '肝臓', '肝脏'],
    { slug: 'select-gastroscopy', score: 80, reason: 'deptGastro' },
  ],
];

// ============================================================
// 套餐亮点（4 语言，每套餐 3 个卖点）
// ============================================================

export const PACKAGE_HIGHLIGHTS: Record<string, Record<Language, string[]>> = {
  'vip-member-course': {
    'zh-CN': ['全身PET-CT + 脑MRI', '上下消化道内视镜', 'VIP专属休息室'],
    'zh-TW': ['全身PET-CT + 腦MRI', '上下消化道內視鏡', 'VIP專屬休息室'],
    ja: ['全身PET-CT + 脳MRI', '上部下部消化管内視鏡', 'VIP専用ラウンジ'],
    en: ['Full-body PET-CT + Brain MRI', 'Upper & Lower GI Endoscopy', 'VIP Lounge'],
  },
  'premium-cardiac-course': {
    'zh-CN': ['心脏CT造影 + 超声波', 'PET-CT全身扫描', '动脉硬化精密检测'],
    'zh-TW': ['心臟CT造影 + 超聲波', 'PET-CT全身掃描', '動脈硬化精密檢測'],
    ja: ['心臓CT造影 + 超音波', 'PET-CT全身スキャン', '動脈硬化精密検査'],
    en: ['Cardiac CT Angiography + Echo', 'Full-body PET-CT Scan', 'Arteriosclerosis Testing'],
  },
  'select-gastro-colonoscopy': {
    'zh-CN': ['上下消化道内视镜', 'PET-CT全身扫描', '幽门螺杆菌检测'],
    'zh-TW': ['上下消化道內視鏡', 'PET-CT全身掃描', '幽門螺桿菌檢測'],
    ja: ['上部下部消化管内視鏡', 'PET-CT全身スキャン', 'ピロリ菌検査'],
    en: ['Upper & Lower GI Endoscopy', 'Full-body PET-CT Scan', 'H. pylori Test'],
  },
  'select-gastroscopy': {
    'zh-CN': ['上消化道内视镜', 'PET-CT全身扫描', '腹部超声波检查'],
    'zh-TW': ['上消化道內視鏡', 'PET-CT全身掃描', '腹部超聲波檢查'],
    ja: ['上部消化管内視鏡', 'PET-CT全身スキャン', '腹部超音波検査'],
    en: ['Upper GI Endoscopy', 'Full-body PET-CT Scan', 'Abdominal Ultrasound'],
  },
  'dwibs-cancer-screening': {
    'zh-CN': ['全身DWIBS无创癌筛', '无辐射MRI技术', '30分钟快速检查'],
    'zh-TW': ['全身DWIBS無創癌篩', '無輻射MRI技術', '30分鐘快速檢查'],
    ja: ['全身DWIBS無侵襲がん検診', '被ばくゼロMRI技術', '30分のスピード検査'],
    en: ['Full-body DWIBS Cancer Screen', 'Radiation-free MRI', '30-min Quick Exam'],
  },
  'basic-checkup': {
    'zh-CN': ['PET-CT全身扫描', '基础血液生化检查', '心电图 + 胸部X光'],
    'zh-TW': ['PET-CT全身掃描', '基礎血液生化檢查', '心電圖 + 胸部X光'],
    ja: ['PET-CT全身スキャン', '基礎血液生化学検査', '心電図 + 胸部X線'],
    en: ['Full-body PET-CT Scan', 'Basic Blood Panel', 'ECG + Chest X-ray'],
  },
  'cancer-initial-consultation': {
    'zh-CN': ['病历资料翻译', '日本专科医生评估', '治疗方案 + 费用概算'],
    'zh-TW': ['病歷資料翻譯', '日本專科醫生評估', '治療方案 + 費用概算'],
    ja: ['医療記録翻訳', '日本専門医評価', '治療計画 + 費用見積'],
    en: ['Medical Record Translation', 'Japanese Specialist Review', 'Treatment Plan + Cost Estimate'],
  },
};

// ============================================================
// 套餐 → 详情页 URL
// ============================================================

export const PACKAGE_URLS: Record<string, string> = {
  'vip-member-course': '/medical-packages/vip-member-course',
  'premium-cardiac-course': '/medical-packages/premium-cardiac-course',
  'select-gastro-colonoscopy': '/medical-packages/select-gastro-colonoscopy',
  'select-gastroscopy': '/medical-packages/select-gastroscopy',
  'dwibs-cancer-screening': '/medical-packages/dwibs-cancer-screening',
  'basic-checkup': '/medical-packages/basic-checkup',
  'cancer-initial-consultation': '/cancer-treatment',
};

// ============================================================
// 核心匹配函数
// ============================================================

export function matchPackages(result: AnalysisResult): PackageRecommendation[] {
  // Gate D 急诊不推荐
  if (result.requiresEmergencyNotice || result.safetyGateClass === 'D') {
    return [];
  }

  const candidates: PackageRecommendation[] = [];
  const seenSlugs = new Set<string>();

  const departments = (result.recommendedDepartments || []).map(d => d.toLowerCase());
  const allText = [
    result.riskSummary || '',
    ...result.recommendedTests,
    ...result.treatmentSuggestions,
    ...(result.recommendedDepartments || []),
  ].join(' ').toLowerCase();

  // --- Tier 1: 癌症红旗 ---
  const hasCancerFlag = CANCER_KEYWORDS.some(kw => allText.includes(kw));
  if (hasCancerFlag) {
    addCandidate(candidates, seenSlugs, 'cancer-initial-consultation', 100, 'cancerFlag');
    addCandidate(candidates, seenSlugs, 'dwibs-cancer-screening', 80, 'cancerScreening');
  }

  // --- Tier 2: 科室匹配 ---
  for (const dept of departments) {
    for (const [keywords, mapping] of DEPT_KEYWORDS) {
      if (keywords.some(kw => dept.includes(kw))) {
        addCandidate(candidates, seenSlugs, mapping.slug, mapping.score, mapping.reason);
      }
    }
  }

  // --- Tier 3: 风险等级兜底 ---
  if (result.riskLevel === 'high') {
    addCandidate(candidates, seenSlugs, 'vip-member-course', 70, 'highRisk');
  } else if (result.riskLevel === 'medium' && candidates.length < 3) {
    addCandidate(candidates, seenSlugs, 'basic-checkup', 50, 'generalCheckup');
  } else if (result.riskLevel === 'low' && candidates.length === 0) {
    addCandidate(candidates, seenSlugs, 'basic-checkup', 40, 'preventive');
    addCandidate(candidates, seenSlugs, 'dwibs-cancer-screening', 35, 'preventive');
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function addCandidate(
  candidates: PackageRecommendation[],
  seen: Set<string>,
  slug: string,
  score: number,
  matchReasonKey: string,
): void {
  if (seen.has(slug)) return;
  seen.add(slug);
  candidates.push({ slug, score, matchReasonKey });
}

// ============================================================
// 辅助函数
// ============================================================

export function getPackageName(slug: string, lang: Language): string {
  const pkg = MEDICAL_PACKAGES[slug];
  if (!pkg) return slug;
  if (lang === 'ja') return pkg.nameJa;
  if (lang === 'en') return pkg.nameEn;
  return pkg.nameZhTw; // zh-CN / zh-TW 共用繁体名
}

export function getPackagePrice(slug: string): number {
  return MEDICAL_PACKAGES[slug]?.priceJpy ?? 0;
}

export function formatPriceJPY(price: number): string {
  return `¥${price.toLocaleString()}`;
}
