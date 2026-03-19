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
import { type AEMCLang } from './hospital-knowledge-base';
import { aemcLog } from './logger';

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
// 多语言标签 + 指南翻译
// ============================================================

type GLStr = Record<AEMCLang, string>;
const GL_LABELS: Record<string, GLStr> = {
  recommendation: { 'zh-CN': '建议', 'zh-TW': '建議', en: 'Recommendation', ja: '推奨' },
  applicableTests: { 'zh-CN': '适用检查', 'zh-TW': '適用檢查', en: 'Applicable tests', ja: '適用検査' },
};
function GLL(key: string, lang: AEMCLang): string {
  return GL_LABELS[key]?.[lang] || GL_LABELS[key]?.['zh-CN'] || key;
}

/** Per-guideline recommendation translations (master data is zh-CN in GUIDELINE_DATABASE) */
const GUIDELINE_I18N: Record<string, Partial<Record<AEMCLang, string>>> = {
  'GL-HCC-001': {
    'zh-TW': '肝臟占位性病變需進行多期增強 CT/MRI（動脈期+門脈期+延遲期）評估 LI-RADS 分類。AFP + HBV/HCV 篩查為必查項目。符合 Milan 標準者可評估移植/消融。',
    en: 'Liver space-occupying lesion requires multiphasic contrast CT/MRI (arterial + portal venous + delayed phase) for LI-RADS classification. AFP + HBV/HCV screening mandatory. Milan criteria-eligible patients may be evaluated for transplant/ablation.',
    ja: '肝占拠性病変は多相造影 CT/MRI（動脈相＋門脈相＋遅延相）で LI-RADS 分類の評価が必要。AFP + HBV/HCV スクリーニングは必須。Milan 基準を満たす場合、移植/アブレーション評価が可能。',
  },
  'GL-HCC-002': {
    'zh-TW': 'AFP 升高 + 肝臟病變：需行 HBV/HCV 血清學檢查。AFP >400ng/mL 結合影像學特徵可臨床診斷 HCC，無需活檢。AFP 20-400ng/mL 需結合 AFP-L3%、DCP 綜合判斷。',
    en: 'AFP elevation + liver lesion: HBV/HCV serology required. AFP >400ng/mL with characteristic imaging allows clinical HCC diagnosis without biopsy. AFP 20-400ng/mL requires AFP-L3% and DCP combined assessment.',
    ja: 'AFP 上昇＋肝病変：HBV/HCV 血清学検査が必要。AFP >400ng/mL と画像所見の組み合わせで臨床的 HCC 診断が可能（生検不要）。AFP 20-400ng/mL は AFP-L3%・DCP で総合判断。',
  },
  'GL-CUP-001': {
    'zh-TW': '多發轉移灶、原發灶不明時：推薦胸腹盆增強 CT + PET-CT 尋找原發灶。免疫組化 panel（CK7/CK20/TTF-1/CDX2/PAX8 等）輔助定位。需 MDT 討論治療策略。',
    en: 'Multiple metastases with unknown primary: chest/abdomen/pelvis contrast CT + PET-CT recommended to identify primary. IHC panel (CK7/CK20/TTF-1/CDX2/PAX8) for localization. MDT discussion required.',
    ja: '多発転移巣・原発巣不明時：胸腹骨盤造影 CT＋PET-CT で原発巣検索を推奨。免疫組織化学パネル（CK7/CK20/TTF-1/CDX2/PAX8 等）で原発巣推定。MDT で治療方針を検討。',
  },
  'GL-CCA-001': {
    'zh-TW': '疑似膽管細胞癌：MRCP 評估膽道解剖 + CA19-9 + CEA。需組織活檢明確診斷。Bismuth-Corlette 分型指導手術方案。基因檢測（FGFR2 融合/IDH1 突變）指導靶向治療。',
    en: 'Suspected cholangiocarcinoma: MRCP for biliary anatomy + CA19-9 + CEA. Tissue biopsy required for diagnosis. Bismuth-Corlette classification guides surgical approach. Genetic testing (FGFR2 fusion/IDH1 mutation) guides targeted therapy.',
    ja: '胆管細胞癌疑い：MRCP で胆道解剖評価＋CA19-9＋CEA。組織生検で確定診断が必要。Bismuth-Corlette 分類で術式決定。遺伝子検査（FGFR2 融合/IDH1 変異）で分子標的治療を検討。',
  },
  'GL-LUNG-001': {
    'zh-TW': '肺部結節：按 Fleischner Society 標準隨訪。≥8mm 實性結節需 PET-CT 或活檢。毛刺徵/分葉徵提示惡性。低劑量 CT 用於高危人群篩查。',
    en: 'Pulmonary nodule: follow Fleischner Society criteria. Solid nodules ≥8mm require PET-CT or biopsy. Spiculation/lobulation suggest malignancy. Low-dose CT for high-risk screening.',
    ja: '肺結節：Fleischner Society 基準でフォローアップ。≥8mm 充実性結節は PET-CT または生検が必要。スピキュレーション/分葉は悪性を示唆。低線量 CT は高リスク群スクリーニングに使用。',
  },
  'GL-PROSTATE-001': {
    'zh-TW': 'PSA >4ng/mL 或 PSA 密度 >0.15：推薦前列腺 mpMRI (PI-RADS 評分)。PI-RADS ≥3 需系統 + 靶向穿刺。PSA >10 或 Gleason ≥7 需行骨掃描分期。',
    en: 'PSA >4ng/mL or PSA density >0.15: prostate mpMRI (PI-RADS) recommended. PI-RADS ≥3 requires systematic + targeted biopsy. PSA >10 or Gleason ≥7 requires bone scan staging.',
    ja: 'PSA >4ng/mL または PSA 密度 >0.15：前立腺 mpMRI（PI-RADS）を推奨。PI-RADS ≥3 は系統的＋標的生検が必要。PSA >10 または Gleason ≥7 は骨シンチで病期診断。',
  },
  'GL-CAD-001': {
    'zh-TW': 'Agatston >400：直接冠脈造影 (CAG) 優於 CTA（鈣化偽影影響 CTA 精度）。Agatston 100-400：藥物負荷心肌灌注顯像或 CTA。所有患者需強化他汀 + 抗血小板評估。',
    en: 'Agatston >400: coronary angiography (CAG) preferred over CTA (calcification artifacts affect CTA accuracy). Agatston 100-400: stress myocardial perfusion imaging or CTA. All patients require intensive statin + antiplatelet assessment.',
    ja: 'Agatston >400：冠動脈造影（CAG）が CTA より推奨（石灰化アーチファクトの影響）。Agatston 100-400：薬物負荷心筋シンチグラフィーまたは CTA。全患者にスタチン強化＋抗血小板評価。',
  },
  'GL-HF-001': {
    'zh-TW': 'LVEF <40% (HFrEF)：四聯療法（ARNI/ACEI + β受體阻滯劑 + MRA + SGLT2i）。所有疑似心衰需檢測 BNP/NT-proBNP。超聲心動圖為一線影像。',
    en: 'LVEF <40% (HFrEF): quadruple therapy (ARNI/ACEI + beta-blocker + MRA + SGLT2i). All suspected heart failure requires BNP/NT-proBNP. Echocardiography is first-line imaging.',
    ja: 'LVEF <40%（HFrEF）：四剤療法（ARNI/ACEI＋β遮断薬＋MRA＋SGLT2i）。心不全疑い全例に BNP/NT-proBNP 検査。心エコーが第一選択画像検査。',
  },
  'GL-AF-001': {
    'zh-TW': 'CHA2DS2-VASc ≥2 (男) / ≥3 (女)：推薦口服抗凝 (DOAC 優先於華法林)。所有房顫患者需甲狀腺功能檢查。心臟超聲評估瓣膜及左房大小。',
    en: 'CHA2DS2-VASc ≥2 (male) / ≥3 (female): oral anticoagulation recommended (DOAC preferred over warfarin). All AF patients require thyroid function testing. Echocardiography for valvular and left atrial assessment.',
    ja: 'CHA2DS2-VASc ≥2（男性）/ ≥3（女性）：経口抗凝固療法を推奨（DOAC がワルファリンより推奨）。全心房細動患者に甲状腺機能検査。心エコーで弁膜症・左房径を評価。',
  },
  'GL-CKD-001': {
    'zh-TW': 'eGFR <60：確認 CKD 分期 + UACR。CKD G3a 以上需腎內科隨訪。eGFR <30 禁碘造影劑（或充分水化+NAC）。所有 CKD 患者評估心血管風險。',
    en: 'eGFR <60: confirm CKD staging + UACR. CKD G3a+ requires nephrology follow-up. eGFR <30 contraindicates iodinated contrast (or hydration + NAC). All CKD patients need cardiovascular risk assessment.',
    ja: 'eGFR <60：CKD 病期確認＋UACR。CKD G3a 以上は腎臓内科フォローが必要。eGFR <30 はヨード造影剤禁忌（または十分な補液＋NAC）。全 CKD 患者に心血管リスク評価。',
  },
  'GL-DM-001': {
    'zh-TW': 'HbA1c ≥6.5% 或空腹血糖 ≥126mg/dL：確診糖尿病。合併 CKD/CVD 優先 SGLT2i 或 GLP-1RA。每年眼底檢查 + 足部檢查 + UACR。',
    en: 'HbA1c ≥6.5% or fasting glucose ≥126mg/dL: diabetes confirmed. With CKD/CVD comorbidity, SGLT2i or GLP-1RA preferred. Annual fundoscopy + foot exam + UACR.',
    ja: 'HbA1c ≥6.5% または空腹時血糖 ≥126mg/dL：糖尿病確定。CKD/CVD 合併例は SGLT2i または GLP-1RA を優先。年 1 回の眼底検査＋足部検査＋UACR。',
  },
  'GL-THYROID-001': {
    'zh-TW': '甲狀腺結節 >1cm：需行超聲 TI-RADS 評估。TI-RADS 4-5 或 >2cm 需 FNA 穿刺。TSH 低需排除功能性結節（甲亢）。',
    en: 'Thyroid nodule >1cm: ultrasound TI-RADS evaluation required. TI-RADS 4-5 or >2cm requires FNA. Low TSH requires exclusion of functioning nodule (hyperthyroidism).',
    ja: '甲状腺結節 >1cm：超音波 TI-RADS 評価が必要。TI-RADS 4-5 または >2cm は FNA が必要。TSH 低値は機能性結節（甲状腺機能亢進症）の除外が必要。',
  },
  'GL-BONE-001': {
    'zh-TW': '骨轉移確認後：評估 SRE（骨骼相關事件）風險。推薦唑來膦酸或地諾單抗預防 SRE。脊柱轉移需評估 SINS 評分。病理性骨折風險高時需骨科會診。',
    en: 'Confirmed bone metastasis: assess SRE risk. Zoledronic acid or denosumab for SRE prevention. Spinal metastasis requires SINS scoring. High pathological fracture risk requires orthopedic consultation.',
    ja: '骨転移確認後：SRE リスク評価。ゾレドロン酸またはデノスマブで SRE 予防を推奨。脊椎転移は SINS スコア評価が必要。病的骨折リスク高い場合は整形外科コンサルト。',
  },
};

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
  structuredCase: StructuredCase,
  language?: string
): GuidelineMatchResult {
  const lang = (language || 'zh-CN') as AEMCLang;
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

  // 本地化匹配到的指南
  const localizedGuidelines = matchedGuidelines.map((g) => {
    const i18nRec = GUIDELINE_I18N[g.id]?.[lang];
    if (!i18nRec) return g;
    return { ...g, recommendation: i18nRec };
  });

  // 生成 AI prompt 注入文本
  let guidelineContextForAI = '';
  if (localizedGuidelines.length > 0) {
    const labelRec = GLL('recommendation', lang);
    const labelTests = GLL('applicableTests', lang);
    const lines = localizedGuidelines.map(
      (g) =>
        `[${g.id}] ${g.source} (${g.evidenceLevel})\n` +
        `  ${labelRec}: ${g.recommendation}\n` +
        (g.applicableTests ? `  ${labelTests}: ${g.applicableTests.join(', ')}` : '')
    );
    guidelineContextForAI =
      `\n\n--- CLINICAL GUIDELINE REFERENCES (evidence-based) ---\n` +
      `You MUST cite these guidelines in your output when recommending related tests or making risk assessments.\n` +
      `Format: Include guideline ID and evidence level in your reasoning.\n\n` +
      lines.join('\n\n') +
      `\n--- END GUIDELINES ---`;

    aemcLog.info('clinical-guidelines', `Matched ${localizedGuidelines.length} guidelines`, {
      guidelineIds: localizedGuidelines.map((g) => g.id),
    });
  }

  return { matchedGuidelines: localizedGuidelines, guidelineContextForAI };
}
