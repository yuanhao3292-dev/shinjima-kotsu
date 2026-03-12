/**
 * 临床指南知识库 (Clinical Guideline Knowledge Base)
 *
 * 将常见临床场景映射到权威指南引用，注入 AI-2/AI-4 prompt。
 * 让 AI 输出附带循证医学证据级别，提升专业度和可信度。
 *
 * 指南来源：
 * - NCCN (National Comprehensive Cancer Network)
 * - ESMO (European Society for Medical Oncology)
 * - CSCO (Chinese Society of Clinical Oncology)
 * - ESC (European Society of Cardiology)
 * - KDIGO (Kidney Disease: Improving Global Outcomes)
 * - ADA (American Diabetes Association)
 * - AASLD (American Association for the Study of Liver Diseases)
 * - JCS (Japanese Circulation Society)
 *
 * 设计原则：
 * - 纯确定性逻辑，无 AI 调用
 * - 基于 StructuredCase 的关键词触发
 * - 只引用最新的、广泛认可的指南
 * - 输出格式可直接拼接到 AI prompt
 */

import type { StructuredCase } from './types';

// ============================================================
// 指南条目定义
// ============================================================

export interface GuidelineEntry {
  /** 指南 ID */
  id: string;
  /** 触发条件：patient data 中包含的关键词（任一匹配即触发） */
  triggerKeywords: string[];
  /** 需要同时满足的附加条件（可选） */
  requiredCoKeywords?: string[];
  /** 指南来源 + 版本 */
  source: string;
  /** 证据级别 */
  evidenceLevel: string;
  /** 临床建议摘要 */
  recommendation: string;
  /** 适用的检查/处置 */
  applicableTests?: string[];
}

// ============================================================
// 指南数据库
// ============================================================

const GUIDELINE_DATABASE: GuidelineEntry[] = [
  // ============ 肿瘤学 ============

  // 肝细胞癌
  {
    id: 'GL-HCC-001',
    triggerKeywords: ['肝占位', '肝脏占位', '肝细胞癌', '肝癌', 'hepatocellular', 'hcc', '肝腫瘍'],
    source: 'NCCN Hepatocellular Carcinoma v2.2024; AASLD HCC Guidance 2023',
    evidenceLevel: 'Category 1 / Strong Recommendation',
    recommendation: '肝脏占位性病变需进行多期增强 CT/MRI（动脉期+门脉期+延迟期）评估 LI-RADS 分类。AFP + HBV/HCV 筛查为必查项目。符合 Milan 标准者可评估移植/消融。',
    applicableTests: ['多期增强 CT/MRI', 'AFP', 'HBsAg', 'HBV DNA', 'Anti-HCV', 'PET-CT (分期)'],
  },
  {
    id: 'GL-HCC-002',
    triggerKeywords: ['afp', '甲胎蛋白'],
    requiredCoKeywords: ['肝', 'liver', '肝脏'],
    source: 'AASLD Practice Guidance 2023',
    evidenceLevel: 'Strong Recommendation',
    recommendation: 'AFP 升高 + 肝脏病变：需行 HBV/HCV 血清学检查。AFP >400ng/mL 结合影像学特征可临床诊断 HCC，无需活检。AFP 20-400ng/mL 需结合 AFP-L3%、DCP 综合判断。',
    applicableTests: ['HBsAg', 'HBV DNA', 'Anti-HCV', 'AFP-L3%', 'DCP/PIVKA-II'],
  },

  // 肝转移 / 原发灶不明
  {
    id: 'GL-CUP-001',
    triggerKeywords: ['转移', 'metasta', '転移'],
    requiredCoKeywords: ['肝', 'liver', '肝脏', '淋巴结', 'lymph', '骨', 'bone'],
    source: 'NCCN Occult Primary (Cancer of Unknown Primary) v1.2025; ESMO CUP Guidelines 2023',
    evidenceLevel: 'Category 2A',
    recommendation: '多发转移灶、原发灶不明时：推荐胸腹盆增强 CT + PET-CT 寻找原发灶。免疫组化 panel（CK7/CK20/TTF-1/CDX2/PAX8 等）辅助定位。需 MDT 讨论治疗策略。',
    applicableTests: ['PET-CT', '胸腹盆增强 CT', '活检 + 免疫组化', 'MDT 多学科会诊'],
  },

  // 胆管细胞癌
  {
    id: 'GL-CCA-001',
    triggerKeywords: ['胆管', 'cholangiocarcinoma', '胆管癌', '肝内胆管', 'intrahepatic'],
    source: 'NCCN Biliary Tract Cancers v2.2024; ESMO Biliary Tract Cancer Guidelines 2023',
    evidenceLevel: 'Category 2A',
    recommendation: '疑似胆管细胞癌：MRCP 评估胆道解剖 + CA19-9 + CEA。需组织活检明确诊断。Bismuth-Corlette 分型指导手术方案。基因检测（FGFR2 融合/IDH1 突变）指导靶向治疗。',
    applicableTests: ['MRCP', 'CA19-9', 'CEA', '活检', '基因检测 (FGFR2/IDH1)'],
  },

  // 肺癌筛查
  {
    id: 'GL-LUNG-001',
    triggerKeywords: ['肺结节', '肺占位', 'lung nodule', 'lung mass', '肺腫瘤', '肺部肿块'],
    source: 'NCCN Lung Cancer Screening v1.2025; Fleischner Society 2017',
    evidenceLevel: 'Category 1',
    recommendation: '肺部结节：按 Fleischner Society 标准随访。≥8mm 实性结节需 PET-CT 或活检。毛刺征/分叶征提示恶性。低剂量 CT 用于高危人群筛查。',
    applicableTests: ['低剂量胸部 CT', 'PET-CT', '支气管镜 + 活检', 'CEA/CYFRA/SCC/NSE'],
  },

  // 前列腺癌
  {
    id: 'GL-PROSTATE-001',
    triggerKeywords: ['psa', '前列腺'],
    source: 'NCCN Prostate Cancer v4.2024; EAU Guidelines 2024',
    evidenceLevel: 'Category 1',
    recommendation: 'PSA >4ng/mL 或 PSA 密度 >0.15：推荐前列腺 mpMRI (PI-RADS 评分)。PI-RADS ≥3 需系统 + 靶向穿刺。PSA >10 或 Gleason ≥7 需行骨扫描分期。',
    applicableTests: ['前列腺 mpMRI', 'PSA 密度', '前列腺穿刺活检', '骨扫描'],
  },

  // ============ 心血管 ============

  // 冠脉钙化 / 冠心病
  {
    id: 'GL-CAD-001',
    triggerKeywords: ['agatston', '钙化评分', '钙化积分', 'calcium score', '冠動脈'],
    source: 'ESC Chronic Coronary Syndromes 2024; AHA/ACC Chest Pain Guideline 2021',
    evidenceLevel: 'Class I / Level A',
    recommendation: 'Agatston >400：直接冠脉造影 (CAG) 优于 CTA（钙化伪影影响 CTA 精度）。Agatston 100-400：药物负荷心肌灌注显像或 CTA。所有患者需强化他汀 + 抗血小板评估。',
    applicableTests: ['冠脉造影 (CAG)', '药物负荷心肌灌注显像', '血脂全套', '高敏 CRP'],
  },

  // 心力衰竭
  {
    id: 'GL-HF-001',
    triggerKeywords: ['心力衰竭', 'heart failure', '心不全', 'lvef', '射血分数', '駆出率'],
    source: 'ESC Heart Failure Guidelines 2023; JCS 急性・慢性心不全診療ガイドライン 2021',
    evidenceLevel: 'Class I / Level A',
    recommendation: 'LVEF <40% (HFrEF)：四联疗法（ARNI/ACEI + β受体阻滞剂 + MRA + SGLT2i）。所有疑似心衰需检测 BNP/NT-proBNP。超声心动图为一线影像。',
    applicableTests: ['BNP/NT-proBNP', '超声心动图', '心脏 MRI (CMR)', '冠脉评估'],
  },

  // 房颤
  {
    id: 'GL-AF-001',
    triggerKeywords: ['房颤', 'atrial fibrillation', '心房細動', 'afib'],
    source: 'ESC Atrial Fibrillation Guidelines 2024; JCS 不整脈ガイドライン 2022',
    evidenceLevel: 'Class I / Level A',
    recommendation: 'CHA2DS2-VASc ≥2 (男) / ≥3 (女)：推荐口服抗凝 (DOAC 优先于华法林)。所有房颤患者需甲状腺功能检查。心脏超声评估瓣膜及左房大小。',
    applicableTests: ['CHA2DS2-VASc 评分', 'TSH/FT4', '超声心动图', '24h 动态心电图'],
  },

  // ============ 肾脏 ============

  {
    id: 'GL-CKD-001',
    triggerKeywords: ['egfr', 'ckd', '慢性肾', '肾功能', '肌酐', 'creatinine'],
    source: 'KDIGO CKD Guidelines 2024',
    evidenceLevel: 'Level 1 / Grade A',
    recommendation: 'eGFR <60：确认 CKD 分期 + UACR。CKD G3a 以上需肾内科随访。eGFR <30 禁碘造影剂（或充分水化+NAC）。所有 CKD 患者评估心血管风险。',
    applicableTests: ['eGFR (CKD-EPI)', 'UACR (尿白蛋白/肌酐比)', '肾脏超声', '电解质/血气'],
  },

  // ============ 代谢 ============

  {
    id: 'GL-DM-001',
    triggerKeywords: ['糖尿病', 'diabetes', 'hba1c', '血糖升高', '高血糖'],
    source: 'ADA Standards of Care 2025; JDS 糖尿病診療ガイドライン 2024',
    evidenceLevel: 'Level A',
    recommendation: 'HbA1c ≥6.5% 或空腹血糖 ≥126mg/dL：确诊糖尿病。合并 CKD/CVD 优先 SGLT2i 或 GLP-1RA。每年眼底检查 + 足部检查 + UACR。',
    applicableTests: ['HbA1c', '空腹血糖', 'UACR', '眼底检查', '足部感觉检查'],
  },

  // ============ 甲状腺 ============

  {
    id: 'GL-THYROID-001',
    triggerKeywords: ['甲状腺结节', 'thyroid nodule', '甲状腺腫瘍', '甲状腺'],
    requiredCoKeywords: ['结节', 'nodule', '腫瘍', '肿块'],
    source: 'ATA Thyroid Nodule Guidelines 2015; NCCN Thyroid Carcinoma v3.2024',
    evidenceLevel: 'Strong Recommendation',
    recommendation: '甲状腺结节 >1cm：需行超声 TI-RADS 评估。TI-RADS 4-5 或 >2cm 需 FNA 穿刺。TSH 低需排除功能性结节（甲亢）。',
    applicableTests: ['甲状腺超声 (TI-RADS)', 'TSH/FT3/FT4', 'FNA 穿刺', '甲状腺球蛋白'],
  },

  // ============ 骨转移 ============

  {
    id: 'GL-BONE-001',
    triggerKeywords: ['骨转移', 'bone metasta', '骨転移', '椎体', 'vertebra'],
    requiredCoKeywords: ['转移', 'metasta', '転移', '恶性', '癌', 'cancer', '信号异常'],
    source: 'NCCN Cancer-Related Bone Disease v1.2024; ESMO Bone Metastases Guidelines 2020',
    evidenceLevel: 'Category 2A',
    recommendation: '骨转移确认后：评估 SRE (骨骼相关事件) 风险。推荐唑来膦酸或地诺单抗预防 SRE。脊柱转移需评估 SINS 评分（脊柱不稳定性）。病理性骨折风险高时需骨科会诊。',
    applicableTests: ['全身骨扫描', 'PET-CT', 'SINS 评分', '血钙/碱性磷酸酶', '骨科会诊'],
  },
];

// ============================================================
// 主入口
// ============================================================

export interface GuidelineMatchResult {
  /** 匹配到的指南条目 */
  matchedGuidelines: GuidelineEntry[];
  /** 注入 AI prompt 的格式化文本 */
  guidelineContextForAI: string;
}

/**
 * 根据 StructuredCase 匹配适用的临床指南
 */
export function matchClinicalGuidelines(
  structuredCase: StructuredCase
): GuidelineMatchResult {
  const matchedGuidelines: GuidelineEntry[] = [];

  // 汇集所有患者文本
  const combinedText = [
    structuredCase.chief_complaint,
    ...structuredCase.exam_findings,
    ...structuredCase.known_diagnoses,
    ...structuredCase.red_flags,
    ...structuredCase.past_history,
    ...structuredCase.medication_history,
    ...structuredCase.present_illness.symptoms.map((s) => s.name + ' ' + s.evidence),
  ]
    .join(' ')
    .toLowerCase();

  for (const guideline of GUIDELINE_DATABASE) {
    // 检查主触发关键词
    const primaryMatch = guideline.triggerKeywords.some((kw) =>
      combinedText.includes(kw.toLowerCase())
    );
    if (!primaryMatch) continue;

    // 检查附加条件（如果有）
    if (guideline.requiredCoKeywords) {
      const coMatch = guideline.requiredCoKeywords.some((kw) =>
        combinedText.includes(kw.toLowerCase())
      );
      if (!coMatch) continue;
    }

    matchedGuidelines.push(guideline);
  }

  // 生成 AI prompt 注入文本
  let guidelineContextForAI = '';
  if (matchedGuidelines.length > 0) {
    const lines = matchedGuidelines.map(
      (g) =>
        `[${g.id}] ${g.source} (${g.evidenceLevel})\n` +
        `  建议: ${g.recommendation}\n` +
        (g.applicableTests ? `  适用检查: ${g.applicableTests.join(', ')}` : '')
    );
    guidelineContextForAI =
      `\n\n--- CLINICAL GUIDELINE REFERENCES (evidence-based) ---\n` +
      `You MUST cite these guidelines in your output when recommending related tests or making risk assessments.\n` +
      `Format: Include guideline ID and evidence level in your reasoning.\n\n` +
      lines.join('\n\n') +
      `\n--- END GUIDELINES ---`;

    console.info(
      `[ClinicalGuidelines] Matched ${matchedGuidelines.length} guidelines: ${matchedGuidelines.map((g) => g.id).join(', ')}`
    );
  }

  return { matchedGuidelines, guidelineContextForAI };
}
