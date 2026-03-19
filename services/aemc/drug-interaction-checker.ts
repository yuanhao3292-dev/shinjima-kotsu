/**
 * 药物相互作用检查器 (Drug-Drug Interaction Checker)
 *
 * 确定性安全层，扫描患者用药史，检查高危药物相互作用 (DDI)。
 * 在 AI-2 分诊后执行，警告注入 AI-4 仲裁官输入。
 *
 * 覆盖范围：仅高危 DDI（可能导致严重不良事件或死亡）
 * 不替代完整药物数据库（Lexicomp/Micromedex），仅作为安全网。
 *
 * 来源：FDA Drug Interactions Table, UpToDate Drug Interactions, PMDA
 *
 * 设计原则：
 * - 纯确定性逻辑，无 AI 调用
 * - 只覆盖最危险的 DDI（宁可误报，不可漏报）
 * - 仅扫描 medication_history（当前用药）+ AI-2 推荐中的药物
 * - 不扫描 past_history / known_diagnoses（避免已停药误报）
 * - 输出注入 AI-4 供仲裁官参考
 */

import type { StructuredCase, TriageAssessment } from './types';
import { type AEMCLang } from './hospital-knowledge-base';
import { aemcLog } from './logger';

// ============================================================
// DDI 规则定义
// ============================================================

interface DDIRule {
  /** 规则 ID */
  id: string;
  /** 药物 A 的匹配关键词 */
  drugA: string[];
  /** 药物 B 的匹配关键词 */
  drugB: string[];
  /** 严重程度 */
  severity: 'critical' | 'major';
  /** 相互作用描述 */
  interaction: string;
  /** 临床建议 */
  recommendation: string;
}

const DDI_RULES: DDIRule[] = [
  // ============ 出血风险 ============
  {
    id: 'DDI-001',
    drugA: ['warfarin', '华法林', 'ワーファリン', 'coumadin'],
    drugB: ['nsaid', 'ibuprofen', 'aspirin', '阿司匹林', 'アスピリン', '布洛芬', 'イブプロフェン', 'diclofenac', '双氯芬酸', 'ジクロフェナク', 'loxoprofen', 'ロキソプロフェン', 'celecoxib'],
    severity: 'critical',
    interaction: '华法林 + NSAIDs → 出血风险显著增加（胃肠道出血/颅内出血）',
    recommendation: '避免联用。如需镇痛推荐对乙酰氨基酚。如必须联用需加用 PPI + 密切监测 INR。',
  },
  {
    id: 'DDI-002',
    drugA: ['doac', 'rivaroxaban', '利伐沙班', 'リバーロキサバン', 'apixaban', '阿哌沙班', 'アピキサバン', 'edoxaban', '艾多沙班', 'エドキサバン', 'dabigatran', '达比加群', 'ダビガトラン'],
    drugB: ['nsaid', 'aspirin', '阿司匹林', 'アスピリン', 'clopidogrel', '氯吡格雷', 'クロピドグレル'],
    severity: 'major',
    interaction: 'DOAC + 抗血小板/NSAIDs → 出血风险增加',
    recommendation: '需评估出血 vs 血栓风险。双联抗栓时缩短疗程，加用 PPI。三联抗栓尽量避免。',
  },

  // ============ 他汀相互作用 ============
  {
    id: 'DDI-003',
    drugA: ['simvastatin', '辛伐他汀', 'シンバスタチン', 'lovastatin', '洛伐他汀'],
    drugB: ['clarithromycin', '克拉霉素', 'クラリスロマイシン', 'erythromycin', '红霉素', 'エリスロマイシン', 'itraconazole', '伊曲康唑', 'ketoconazole', '酮康唑', 'cyclosporine', '环孢素'],
    severity: 'critical',
    interaction: '辛伐他汀/洛伐他汀 + 强CYP3A4抑制剂 → 横纹肌溶解风险',
    recommendation: '禁止联用。换用不经CYP3A4代谢的他汀（瑞舒伐他汀/匹伐他汀）。',
  },
  {
    id: 'DDI-004',
    drugA: ['statin', '他汀', 'スタチン', 'atorvastatin', '阿托伐他汀', 'アトルバスタチン', 'rosuvastatin', '瑞舒伐他汀', 'ロスバスタチン', 'simvastatin', '辛伐他汀'],
    drugB: ['gemfibrozil', '吉非贝齐', 'ゲムフィブロジル'],
    severity: 'critical',
    interaction: '他汀 + 吉非贝齐 → 横纹肌溶解风险显著增加',
    recommendation: '禁止联用。如需降甘油三酯，改用非诺贝特（fenofibrate）。',
  },

  // ============ QT 延长 ============
  {
    id: 'DDI-005',
    drugA: ['amiodarone', '胺碘酮', 'アミオダロン'],
    drugB: ['fluoroquinolone', 'levofloxacin', '左氧氟沙星', 'レボフロキサシン', 'moxifloxacin', '莫西沙星', 'モキシフロキサシン', 'azithromycin', '阿奇霉素', 'アジスロマイシン', 'clarithromycin', '克拉霉素'],
    severity: 'critical',
    interaction: '胺碘酮 + QT延长药物 → 尖端扭转型室速 (TdP) 风险',
    recommendation: '避免联用。如必须联用需心电监护 + 监测 QTc + 纠正电解质。',
  },

  // ============ 高钾血症 ============
  {
    id: 'DDI-006',
    drugA: ['acei', 'enalapril', '依那普利', 'エナラプリル', 'lisinopril', 'ramipril', 'arb', 'valsartan', '缬沙坦', 'バルサルタン', 'losartan', '氯沙坦', 'ロサルタン', 'telmisartan', 'olmesartan', 'candesartan'],
    drugB: ['spironolactone', '螺内酯', 'スピロノラクトン', 'eplerenone', '依普利酮', 'エプレレノン', '补钾', '钾片', '氯化钾', 'potassium chloride', 'potassium supplement', 'カリウム製剤', 'trimethoprim', '甲氧苄啶'],
    severity: 'major',
    interaction: 'ACEI/ARB + 保钾利尿剂/钾补充剂 → 高钾血症风险',
    recommendation: '联用时需定期监测血钾。eGFR <30 时风险更高。血钾 >5.5mEq/L 需停药。',
  },

  // ============ 甲氨蝶呤毒性 ============
  {
    id: 'DDI-007',
    drugA: ['methotrexate', '甲氨蝶呤', 'メトトレキサート', 'mtx'],
    drugB: ['nsaid', 'ibuprofen', '布洛芬', 'trimethoprim', '甲氧苄啶', 'probenecid', '丙磺舒'],
    severity: 'critical',
    interaction: '甲氨蝶呤 + NSAIDs/甲氧苄啶 → MTX 血浓度升高，骨髓抑制/肾毒性',
    recommendation: '避免联用。如需镇痛用对乙酰氨基酚。高剂量 MTX 期间严禁 NSAIDs。',
  },

  // ============ 低血糖 ============
  {
    id: 'DDI-008',
    drugA: ['sulfonylurea', '格列', 'グリメピリド', 'glimepiride', 'glipizide', 'glyburide', '格列本脲', '格列齐特'],
    drugB: ['fluconazole', '氟康唑', 'フルコナゾール', 'miconazole', '咪康唑', 'ミコナゾール'],
    severity: 'major',
    interaction: '磺脲类 + 唑类抗真菌药 → 严重低血糖风险（CYP2C9 抑制）',
    recommendation: '联用时需加强血糖监测，考虑减少磺脲剂量。告知患者低血糖症状。',
  },

  // ============ 地高辛毒性 ============
  {
    id: 'DDI-009',
    drugA: ['digoxin', '地高辛', 'ジゴキシン'],
    drugB: ['amiodarone', '胺碘酮', 'アミオダロン', 'verapamil', '维拉帕米', 'ベラパミル', 'quinidine', '奎尼丁', 'キニジン', 'clarithromycin', '克拉霉素'],
    severity: 'critical',
    interaction: '地高辛 + 胺碘酮/维拉帕米/克拉霉素 → 地高辛浓度升高，心律失常/死亡',
    recommendation: '联用时地高辛减量 50%。监测地高辛血浓度和心电图。',
  },

  // ============ 5-HT 综合征 ============
  {
    id: 'DDI-010',
    drugA: ['ssri', 'fluoxetine', '氟西汀', 'フルオキセチン', 'sertraline', '舍曲林', 'セルトラリン', 'paroxetine', '帕罗西汀', 'パロキセチン', 'escitalopram', '艾司西酞普兰', 'エスシタロプラム', 'snri', 'venlafaxine', 'duloxetine'],
    drugB: ['maoi', 'linezolid', '利奈唑胺', 'リネゾリド', 'tramadol', '曲马多', 'トラマドール', 'triptans', 'sumatriptan', '舒马曲坦'],
    severity: 'critical',
    interaction: 'SSRI/SNRI + MAOIs/利奈唑胺/曲马多 → 5-HT 综合征（高热/肌阵挛/意识障碍）',
    recommendation: 'SSRI/SNRI 与 MAOIs 须间隔 ≥2周（氟西汀 ≥5周）。曲马多联用需监测。',
  },
];

// ============================================================
// 多语言翻译
// ============================================================

type DDIStr = Record<AEMCLang, string>;
const DDI_LABELS: Record<string, DDIStr> = {
  recommendation: { 'zh-CN': '建议', 'zh-TW': '建議', en: 'Recommendation', ja: '推奨' },
};
function DL(key: string, lang: AEMCLang): string {
  return DDI_LABELS[key]?.[lang] || DDI_LABELS[key]?.['zh-CN'] || key;
}

interface DDII18n { interaction: string; recommendation: string }
const DDI_I18N: Record<string, Partial<Record<AEMCLang, DDII18n>>> = {
  'DDI-001': {
    'zh-TW': { interaction: '華法林 + NSAIDs → 出血風險顯著增加（胃腸道出血/顱內出血）', recommendation: '避免聯用。如需鎮痛推薦對乙醯氨基酚。如必須聯用需加用 PPI + 密切監測 INR。' },
    en: { interaction: 'Warfarin + NSAIDs → significantly increased bleeding risk (GI/intracranial hemorrhage)', recommendation: 'Avoid combination. Use acetaminophen for pain relief. If unavoidable, add PPI + closely monitor INR.' },
    ja: { interaction: 'ワルファリン + NSAIDs → 出血リスクが著しく増加（消化管出血/頭蓋内出血）', recommendation: '併用回避。鎮痛にはアセトアミノフェンを推奨。やむを得ない場合は PPI 追加＋INR 厳重監視。' },
  },
  'DDI-002': {
    'zh-TW': { interaction: 'DOAC + 抗血小板/NSAIDs → 出血風險增加', recommendation: '需評估出血 vs 血栓風險。雙聯抗栓時縮短療程，加用 PPI。三聯抗栓盡量避免。' },
    en: { interaction: 'DOAC + antiplatelet/NSAIDs → increased bleeding risk', recommendation: 'Assess bleeding vs thrombotic risk. Shorten dual antithrombotic duration, add PPI. Avoid triple antithrombotic therapy.' },
    ja: { interaction: 'DOAC + 抗血小板薬/NSAIDs → 出血リスク増加', recommendation: '出血 vs 血栓リスクを評価。二剤併用抗血栓療法は期間短縮＋PPI 追加。三剤併用はできる限り回避。' },
  },
  'DDI-003': {
    'zh-TW': { interaction: '辛伐他汀/洛伐他汀 + 強CYP3A4抑制劑 → 橫紋肌溶解風險', recommendation: '禁止聯用。換用不經CYP3A4代謝的他汀（瑞舒伐他汀/匹伐他汀）。' },
    en: { interaction: 'Simvastatin/Lovastatin + strong CYP3A4 inhibitors → rhabdomyolysis risk', recommendation: 'Contraindicated. Switch to statins not metabolized by CYP3A4 (rosuvastatin/pitavastatin).' },
    ja: { interaction: 'シンバスタチン/ロバスタチン + 強力CYP3A4阻害薬 → 横紋筋融解症リスク', recommendation: '併用禁忌。CYP3A4 で代謝されないスタチン（ロスバスタチン/ピタバスタチン）に変更。' },
  },
  'DDI-004': {
    'zh-TW': { interaction: '他汀 + 吉非貝齊 → 橫紋肌溶解風險顯著增加', recommendation: '禁止聯用。如需降甘油三酯，改用非諾貝特（fenofibrate）。' },
    en: { interaction: 'Statin + gemfibrozil → significantly increased rhabdomyolysis risk', recommendation: 'Contraindicated. Use fenofibrate for triglyceride reduction instead.' },
    ja: { interaction: 'スタチン + ゲムフィブロジル → 横紋筋融解症リスクが著しく増加', recommendation: '併用禁忌。トリグリセリド低下にはフェノフィブラートを使用。' },
  },
  'DDI-005': {
    'zh-TW': { interaction: '胺碘酮 + QT延長藥物 → 尖端扭轉型室速 (TdP) 風險', recommendation: '避免聯用。如必須聯用需心電監護 + 監測 QTc + 糾正電解質。' },
    en: { interaction: 'Amiodarone + QT-prolonging drugs → Torsades de Pointes (TdP) risk', recommendation: 'Avoid combination. If unavoidable, continuous ECG monitoring + QTc monitoring + correct electrolytes.' },
    ja: { interaction: 'アミオダロン + QT 延長薬 → Torsades de Pointes（TdP）リスク', recommendation: '併用回避。やむを得ない場合は心電図モニタリング＋QTc 監視＋電解質補正。' },
  },
  'DDI-006': {
    'zh-TW': { interaction: 'ACEI/ARB + 保鉀利尿劑/鉀補充劑 → 高鉀血症風險', recommendation: '聯用時需定期監測血鉀。eGFR <30 時風險更高。血鉀 >5.5mEq/L 需停藥。' },
    en: { interaction: 'ACEI/ARB + potassium-sparing diuretics/potassium supplements → hyperkalemia risk', recommendation: 'Monitor serum potassium regularly. Higher risk with eGFR <30. Discontinue if K+ >5.5mEq/L.' },
    ja: { interaction: 'ACEI/ARB + カリウム保持性利尿薬/カリウム製剤 → 高カリウム血症リスク', recommendation: '併用時は定期的に血清カリウムを監視。eGFR <30 でリスク上昇。K+ >5.5mEq/L で中止。' },
  },
  'DDI-007': {
    'zh-TW': { interaction: '甲氨蝶呤 + NSAIDs/甲氧苄啶 → MTX 血濃度升高，骨髓抑制/腎毒性', recommendation: '避免聯用。如需鎮痛用對乙醯氨基酚。高劑量 MTX 期間嚴禁 NSAIDs。' },
    en: { interaction: 'Methotrexate + NSAIDs/trimethoprim → elevated MTX levels, myelosuppression/nephrotoxicity', recommendation: 'Avoid combination. Use acetaminophen for pain. NSAIDs strictly contraindicated during high-dose MTX.' },
    ja: { interaction: 'メトトレキサート + NSAIDs/トリメトプリム → MTX 血中濃度上昇、骨髄抑制/腎毒性', recommendation: '併用回避。鎮痛にはアセトアミノフェン。高用量 MTX 期間中は NSAIDs 厳禁。' },
  },
  'DDI-008': {
    'zh-TW': { interaction: '磺脲類 + 唑類抗真菌藥 → 嚴重低血糖風險（CYP2C9 抑制）', recommendation: '聯用時需加強血糖監測，考慮減少磺脲劑量。告知患者低血糖症狀。' },
    en: { interaction: 'Sulfonylureas + azole antifungals → severe hypoglycemia risk (CYP2C9 inhibition)', recommendation: 'Intensify glucose monitoring, consider sulfonylurea dose reduction. Educate patient on hypoglycemia symptoms.' },
    ja: { interaction: 'スルホニル尿素薬 + アゾール系抗真菌薬 → 重症低血糖リスク（CYP2C9 阻害）', recommendation: '併用時は血糖監視を強化、スルホニル尿素薬の減量を検討。低血糖症状について患者に説明。' },
  },
  'DDI-009': {
    'zh-TW': { interaction: '地高辛 + 胺碘酮/維拉帕米/克拉黴素 → 地高辛濃度升高，心律失常/死亡', recommendation: '聯用時地高辛減量 50%。監測地高辛血濃度和心電圖。' },
    en: { interaction: 'Digoxin + amiodarone/verapamil/clarithromycin → elevated digoxin levels, arrhythmia/death', recommendation: 'Reduce digoxin dose by 50% when combined. Monitor digoxin levels and ECG.' },
    ja: { interaction: 'ジゴキシン + アミオダロン/ベラパミル/クラリスロマイシン → ジゴキシン濃度上昇、不整脈/死亡', recommendation: '併用時ジゴキシンを 50% 減量。ジゴキシン血中濃度と心電図を監視。' },
  },
  'DDI-010': {
    'zh-TW': { interaction: 'SSRI/SNRI + MAOIs/利奈唑胺/曲馬多 → 5-HT 綜合症（高熱/肌陣攣/意識障礙）', recommendation: 'SSRI/SNRI 與 MAOIs 須間隔 ≥2週（氟西汀 ≥5週）。曲馬多聯用需監測。' },
    en: { interaction: 'SSRI/SNRI + MAOIs/linezolid/tramadol → serotonin syndrome (hyperthermia/myoclonus/altered consciousness)', recommendation: 'SSRI/SNRI and MAOIs require ≥2 week washout (fluoxetine ≥5 weeks). Monitor if tramadol combined.' },
    ja: { interaction: 'SSRI/SNRI + MAOIs/リネゾリド/トラマドール → セロトニン症候群（高熱/ミオクローヌス/意識障害）', recommendation: 'SSRI/SNRI と MAOIs は ≥2 週間の休薬期間が必要（フルオキセチンは ≥5 週間）。トラマドール併用時は監視。' },
  },
};

// ============================================================
// 结果类型
// ============================================================

export interface DDICheckResult {
  /** 检测到的危险 DDI */
  interactions: DetectedDDI[];
  /** 注入 AI-4 的警告文本 */
  ddiWarningsForAdjudicator: string;
}

export interface DetectedDDI {
  ruleId: string;
  severity: 'critical' | 'major';
  drugA: string;
  drugB: string;
  interaction: string;
  recommendation: string;
}

// ============================================================
// 主入口
// ============================================================

/**
 * 检查患者用药的危险相互作用
 *
 * 扫描源：
 * 1. StructuredCase.medication_history（当前用药）— 主要来源
 * 2. TriageAssessment.suggested_tests 中隐含的药物（如推荐抗凝时）
 *
 * 不扫描 past_history / known_diagnoses：
 * - past_history 可能含已停药记录（"2019年停用华法林"）→ 误报
 * - known_diagnoses 含疾病名非药物（"低钾血症"中的"钾"→ 误报）
 */
export function checkDrugInteractions(
  structuredCase: StructuredCase,
  triage: TriageAssessment,
  language?: string
): DDICheckResult {
  const lang = (language || 'zh-CN') as AEMCLang;
  const interactions: DetectedDDI[] = [];

  // 仅扫描当前用药（medication_history 是 AI-1 提取的当前正在服用的药物）
  const medicationText = structuredCase.medication_history
    .join(' ')
    .toLowerCase();

  // 也检查 AI-2 推荐的检查/建议中是否含药物（如 "recommend anticoagulation"）
  const triageText = [
    ...triage.suggested_tests,
    triage.reasoning_summary,
  ]
    .join(' ')
    .toLowerCase();

  const allText = medicationText + ' ' + triageText;

  for (const rule of DDI_RULES) {
    const matchA = rule.drugA.some((kw) => allText.includes(kw.toLowerCase()));
    const matchB = rule.drugB.some((kw) => allText.includes(kw.toLowerCase()));

    if (matchA && matchB) {
      // 找出实际匹配的药物名
      const drugAName = rule.drugA.find((kw) => allText.includes(kw.toLowerCase())) || rule.drugA[0];
      const drugBName = rule.drugB.find((kw) => allText.includes(kw.toLowerCase())) || rule.drugB[0];

      const i18n = DDI_I18N[rule.id]?.[lang];
      interactions.push({
        ruleId: rule.id,
        severity: rule.severity,
        drugA: drugAName,
        drugB: drugBName,
        interaction: i18n?.interaction || rule.interaction,
        recommendation: i18n?.recommendation || rule.recommendation,
      });

      aemcLog.info('ddi-checker', `${rule.id}: ${drugAName} + ${drugBName}`, { severity: rule.severity });
    }
  }

  // 生成警告文本
  let ddiWarningsForAdjudicator = '';
  if (interactions.length > 0) {
    const lines = interactions.map(
      (ddi) =>
        `[${ddi.ruleId}] ⚠️ ${ddi.severity.toUpperCase()}: ${ddi.interaction}\n` +
        `  ${DL('recommendation', lang)}: ${ddi.recommendation}`
    );
    ddiWarningsForAdjudicator =
      `\n\n--- DRUG-DRUG INTERACTION ALERTS (deterministic, non-AI) ---\n` +
      lines.join('\n') +
      `\n--- END DDI ALERTS ---`;

    aemcLog.info('ddi-checker', `Detected ${interactions.length} DDIs`, {
      ddis: interactions.map((d) => `${d.ruleId}(${d.severity})`),
    });
  }

  return { interactions, ddiWarningsForAdjudicator };
}
