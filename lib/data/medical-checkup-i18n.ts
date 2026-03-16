/**
 * TIMC 健診項目 — 多語言翻譯數據
 *
 * 語言策略：
 * - zh-TW: 基準語言（現有數據）
 * - zh-CN: 由 traditionalToSimplified() 自動從 zh-TW 轉換
 * - ja: 日文醫學術語（參照 TIMC 原始 PDF 日文版）
 * - en: 標準英文醫學術語
 */

import { traditionalToSimplified } from '@/lib/utils/text-converter';
import type { Language } from '@/translations';

// ============================================
// 類型定義
// ============================================

type ItemStatus = 'included' | 'optional' | 'partial' | 'none';

interface PackageDef {
  id: string;
  name: string;      // 英文品牌名（不翻譯）
  nameZh: string;    // 已本地化的副標題
  price: number;
  color: string;
  slug: string;
}

interface CheckItem {
  name: string;
  detail?: string;
  partialNote?: string;
  packages: Record<string, ItemStatus>;
}

interface CheckCategory {
  category: string;
  items: CheckItem[];
}

interface Testimonial {
  name: string;
  loc: string;
  flag: string;
  pkg: string;
  text: string;
  highlight: string;
}

// ============================================
// 內部翻譯函數
// ============================================

/** 根據語言選擇文案，zh-CN 自動從 zh-TW 轉換 */
function pick(translations: { ja: string; 'zh-TW': string; en: string }, lang: Language): string {
  if (lang === 'zh-CN') return traditionalToSimplified(translations['zh-TW']);
  return translations[lang] || translations['zh-TW'];
}

// ============================================
// 1. 套餐定義
// ============================================

const PACKAGES_DATA: Array<{
  id: string; name: string; price: number; color: string; slug: string;
  nameZh: { ja: string; 'zh-TW': string; en: string };
}> = [
  { id: 'dwibs', name: 'DWIBS', price: 275000, color: 'purple', slug: 'dwibs-cancer-screening',
    nameZh: { ja: 'がんスクリーニング', 'zh-TW': '防癌篩查', en: 'Cancer Screening' } },
  { id: 'basic', name: 'BASIC', price: 550000, color: 'gray', slug: 'basic-checkup',
    nameZh: { ja: '基本コース', 'zh-TW': '基礎套餐', en: 'Basic Plan' } },
  { id: 'select-gastro', name: 'SELECT', price: 687500, color: 'teal', slug: 'select-gastroscopy',
    nameZh: { ja: '胃カメラ', 'zh-TW': '胃鏡', en: 'Gastroscopy' } },
  { id: 'select-both', name: 'SELECT', price: 825000, color: 'green', slug: 'select-gastro-colonoscopy',
    nameZh: { ja: '胃・大腸カメラ', 'zh-TW': '胃腸鏡', en: 'Gastro-Colonoscopy' } },
  { id: 'premium', name: 'PREMIUM', price: 825000, color: 'blue', slug: 'premium-cardiac-course',
    nameZh: { ja: '心臓精密', 'zh-TW': '心臟精密', en: 'Cardiac Precision' } },
  { id: 'vip', name: 'VIP', price: 1512500, color: 'yellow', slug: 'vip-member-course',
    nameZh: { ja: 'プレミアム総合', 'zh-TW': '頂級全能', en: 'Ultimate Comprehensive' } },
];

export function getPackages(lang: Language): PackageDef[] {
  return PACKAGES_DATA.map(p => ({
    id: p.id, name: p.name, price: p.price, color: p.color, slug: p.slug,
    nameZh: pick(p.nameZh, lang),
  }));
}

// ============================================
// 2. 體檢項目
// ============================================

interface RawItem {
  name: { ja: string; 'zh-TW': string; en: string };
  detail?: { ja: string; 'zh-TW': string; en: string };
  partialNote?: { ja: string; 'zh-TW': string; en: string };
  packages: Record<string, ItemStatus>;
}

interface RawCategory {
  category: { ja: string; 'zh-TW': string; en: string };
  items: RawItem[];
}

const all: ItemStatus = 'included';
const opt: ItemStatus = 'optional';
const non: ItemStatus = 'none';
const par: ItemStatus = 'partial';

// 快捷：6 套餐全包含
const ALL6 = { dwibs: all, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all };
const NO_DWIBS = { dwibs: non, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all };
const OPT_VIP = { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: opt, vip: all };

const CHECK_ITEMS_DATA: RawCategory[] = [
  {
    category: { ja: '基本測定', 'zh-TW': '基礎測量', en: 'Basic Measurements' },
    items: [
      {
        name: { ja: '身体測定・血圧', 'zh-TW': '身體測量・血壓', en: 'Body Measurements & Blood Pressure' },
        detail: { ja: '身長・体重・BMI・腹囲・肥満度・体脂肪・血圧', 'zh-TW': '身高・體重・BMI・腰圍・肥胖程度・體脂肪・血壓', en: 'Height, Weight, BMI, Waist, Obesity, Body Fat, Blood Pressure' },
        packages: ALL6,
      },
      {
        name: { ja: '視力・聴力', 'zh-TW': '視力・聽力', en: 'Vision & Hearing' },
        detail: { ja: '視力検査(5m距離)・オージオメーター聴力検査', 'zh-TW': '視力檢查(5米距離)・測聽器聽力檢查', en: 'Visual Acuity (5m), Audiometry' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '眼圧・眼底', 'zh-TW': '眼壓・眼底', en: 'Intraocular Pressure & Fundoscopy' },
        detail: { ja: '眼圧測定(両眼)・眼底精密(広角眼底撮影)・OCT(光干渉断層計)', 'zh-TW': '眼壓測量(雙眼)・眼部精密(廣角眼底攝影)・OCT(光學相干斷層掃描)', en: 'IOP (Both Eyes), Wide-angle Fundus Photography, OCT' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '心電図・動脈硬化検査', 'zh-TW': '心電圖・動脈硬化檢查', en: 'ECG & Arteriosclerosis Test' },
        detail: { ja: '安静時心電図・心拍数・ABI・CAVI', 'zh-TW': '靜態心電圖・心率・ABI・CAVI', en: 'Resting ECG, Heart Rate, ABI, CAVI' },
        partialNote: { ja: 'DWIBSは心電図・心拍数のみ', 'zh-TW': 'DWIBS僅做心電圖和心率', en: 'DWIBS: ECG & Heart Rate only' },
        packages: { dwibs: par, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
    ],
  },
  {
    category: { ja: '血液検査', 'zh-TW': '血液檢查', en: 'Blood Tests' },
    items: [
      {
        name: { ja: '血球算定', 'zh-TW': '血常規', en: 'Complete Blood Count' },
        detail: { ja: '白血球数・赤血球数・ヘモグロビン・Ht・MCV・MCH・MCHC・血小板', 'zh-TW': '白血球數・紅血球數・血紅蛋白・Ht・MCV・MCH・MCHC・血小板', en: 'WBC, RBC, Hemoglobin, Ht, MCV, MCH, MCHC, Platelets' },
        packages: ALL6,
      },
      {
        name: { ja: '白血球像', 'zh-TW': '白血球成像', en: 'WBC Differential' },
        detail: { ja: '好中球・リンパ球・単球・好酸球・好塩基球', 'zh-TW': '嗜中性細胞・淋巴細胞・單球細胞・嗜酸性粒細胞・嗜鹼性粒細胞', en: 'Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils' },
        packages: ALL6,
      },
      {
        name: { ja: '肝機能', 'zh-TW': '肝功能', en: 'Liver Function' },
        detail: { ja: '総ビリルビン・AST・ALT・γ-GT・ALP・LD・CHE・Fe・TIBC・UIBC・Zn', 'zh-TW': '總膽紅素・AST・ALT・γ-GT・ALP・LD・CHE・Fe・TIBC・UIBC・Zn', en: 'T-Bil, AST, ALT, γ-GT, ALP, LD, CHE, Fe, TIBC, UIBC, Zn' },
        packages: ALL6,
      },
      {
        name: { ja: '血清蛋白', 'zh-TW': '血清蛋白', en: 'Serum Protein' },
        detail: { ja: '総蛋白・アルブミン・A/G比', 'zh-TW': '總蛋白・白蛋白・A/G比', en: 'Total Protein, Albumin, A/G Ratio' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '糖代謝・膵臓', 'zh-TW': '糖代謝・胰腺', en: 'Glucose Metabolism & Pancreas' },
        detail: { ja: '血糖・HbA1c・血清アミラーゼ・インスリン', 'zh-TW': '血糖・血紅蛋白・血清澱粉酶・胰島素', en: 'Blood Glucose, HbA1c, Amylase, Insulin' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '脂質', 'zh-TW': '脂質', en: 'Lipid Profile' },
        detail: { ja: '総コレステロール・中性脂肪・HDL-C・LDL/non-HDL-C・small dense LDL・Lp(a)', 'zh-TW': '總膽固醇・甘油三酯・高密度脂蛋白膽固醇・低密度/非高密度脂蛋白膽固醇・小而密低密度脂蛋白・脂蛋白a', en: 'T-Chol, TG, HDL-C, LDL/non-HDL-C, sd-LDL, Lp(a)' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '腎機能', 'zh-TW': '腎功能', en: 'Renal Function' },
        detail: { ja: 'クレアチニン・eGFR・尿素窒素・尿酸・Cu', 'zh-TW': '肌酐・eGFR・尿素氮・尿酸・Cu', en: 'Creatinine, eGFR, BUN, Uric Acid, Cu' },
        packages: ALL6,
      },
      {
        name: { ja: '電解質', 'zh-TW': '電解質', en: 'Electrolytes' },
        detail: { ja: 'Na・K・Cl・Mg・P・Ca', 'zh-TW': 'Na・K・Cl・Mg・P・Ca', en: 'Na, K, Cl, Mg, P, Ca' },
        packages: ALL6,
      },
      {
        name: { ja: '血清免疫', 'zh-TW': '血清免疫', en: 'Serum Immunology' },
        detail: { ja: 'CRP・肝炎ウイルス(HBs抗原・HCV抗体)', 'zh-TW': 'CRP・肝炎病毒(HBs抗原・HCV抗體)', en: 'CRP, Hepatitis (HBs Ag, HCV Ab)' },
        partialNote: { ja: 'DWIBSはCRPのみ', 'zh-TW': 'DWIBS僅做CRP', en: 'DWIBS: CRP only' },
        packages: { dwibs: par, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '甲状腺機能', 'zh-TW': '甲狀腺功能', en: 'Thyroid Function' },
        detail: { ja: 'FT3・FT4・TSH', 'zh-TW': 'FT3・FT4・TSH', en: 'FT3, FT4, TSH' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '心臓機能', 'zh-TW': '心臟功能', en: 'Cardiac Markers' },
        detail: { ja: 'NTproBNP・CPK・心筋トロポニンT検査', 'zh-TW': 'NTproBNP・CPK・心肌蛋白T檢查', en: 'NT-proBNP, CPK, Troponin T' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '凝固・線溶系', 'zh-TW': '凝血和纖溶系統', en: 'Coagulation & Fibrinolysis' },
        detail: { ja: 'Dダイマー定量・PT', 'zh-TW': 'D二聚體定量・PT', en: 'D-Dimer, PT' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '血液型', 'zh-TW': '血型', en: 'Blood Type' },
        detail: { ja: 'ABO式・Rh(D)式', 'zh-TW': 'ABO式・Rh(D)式', en: 'ABO, Rh(D)' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '胃がんリスク', 'zh-TW': '胃癌風險篩查', en: 'Gastric Cancer Risk' },
        detail: { ja: 'H・ピロリ菌抗体・ペプシノゲン・ABC分類', 'zh-TW': 'H・幽門螺旋桿菌抗體・丙種球蛋白・ABC分類', en: 'H. Pylori Ab, Pepsinogen, ABC Classification' },
        packages: { dwibs: all, basic: non, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: 'リウマチ因子', 'zh-TW': '類風濕因子', en: 'Rheumatoid Factor' },
        detail: { ja: 'RF', 'zh-TW': 'RF', en: 'RF' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '腫瘍マーカー（男性）', 'zh-TW': '腫瘤標誌物（男）', en: 'Tumor Markers (Male)' },
        detail: { ja: 'CEA・AFP・CA19-9・CYFRA・ProGRP・PSA・SCC', 'zh-TW': 'CEA・AFP・CA19-9・CYFRA・ProGRP・PSA・SCC', en: 'CEA, AFP, CA19-9, CYFRA, ProGRP, PSA, SCC' },
        packages: ALL6,
      },
      {
        name: { ja: '腫瘍マーカー（女性）', 'zh-TW': '腫瘤標誌物（女）', en: 'Tumor Markers (Female)' },
        detail: { ja: 'CEA・AFP・CA19-9・CYFRA・ProGRP・CA125・SCC・CA15-3', 'zh-TW': 'CEA・AFP・CA19-9・CYFRA・ProGRP・CA125・SCC・CA15-3', en: 'CEA, AFP, CA19-9, CYFRA, ProGRP, CA125, SCC, CA15-3' },
        packages: ALL6,
      },
      {
        name: { ja: '感染症検査', 'zh-TW': '傳染病檢查', en: 'Infectious Disease Panel' },
        detail: { ja: 'HIV・梅毒・HTLV-1・パルボウイルスB19 IgM・マイコプラズマ', 'zh-TW': 'HIV・梅毒・HTLV-1・小DNA病毒B19IgM・支原體', en: 'HIV, Syphilis, HTLV-1, Parvovirus B19 IgM, Mycoplasma' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: '尿検査・便検査', 'zh-TW': '尿檢・便檢', en: 'Urinalysis & Stool Test' },
    items: [
      {
        name: { ja: '尿検査', 'zh-TW': '尿液檢查', en: 'Urinalysis' },
        detail: { ja: '蛋白・糖・ウロビリノゲン・ビリルビン・潜血・PH・比重・ケトン体', 'zh-TW': '蛋白・糖・尿蛋白原・膽紅素・潛血・PH・比重・酮體', en: 'Protein, Glucose, Urobilinogen, Bilirubin, Occult Blood, pH, SG, Ketones' },
        packages: ALL6,
      },
      {
        name: { ja: '尿沈渣', 'zh-TW': '尿沉渣', en: 'Urine Sediment' },
        detail: { ja: '赤血球・白血球・扁平上皮・細菌・尿微量アルブミン測定', 'zh-TW': '紅血球・白血球・鱗狀上皮・細菌・尿微量白蛋白測定', en: 'RBC, WBC, Squamous Epithelium, Bacteria, Microalbumin' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '便潜血検査', 'zh-TW': '便潛血檢查', en: 'Fecal Occult Blood Test' },
        detail: { ja: '潜血反応（2回法）', 'zh-TW': '潛血反應（2回法）', en: 'Occult Blood (2-sample method)' },
        packages: { dwibs: non, basic: non, 'select-gastro': non, 'select-both': all, premium: non, vip: all },
      },
    ],
  },
  {
    category: { ja: '歯科検査', 'zh-TW': '齒科檢查', en: 'Dental Examination' },
    items: [
      {
        name: { ja: '3D口腔内スキャナー', 'zh-TW': '3D口腔內掃描儀', en: '3D Intraoral Scanner' },
        detail: { ja: '画像検査', 'zh-TW': '圖像檢查', en: 'Image Scan' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: 'X線検査', 'zh-TW': 'X線檢查', en: 'X-ray Examination' },
        detail: { ja: 'パノラマ最新機器によるX線検査', 'zh-TW': '由panorama最新設備拍攝的X線檢查', en: 'Panoramic X-ray with latest equipment' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '歯科診察', 'zh-TW': '齒科診察', en: 'Dental Consultation' },
        detail: { ja: '医師面談', 'zh-TW': '醫生面談', en: 'Doctor Consultation' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: 'メンテナンス', 'zh-TW': '保養', en: 'Maintenance' },
        detail: { ja: '歯石除去', 'zh-TW': '去除牙垢', en: 'Scaling / Teeth Cleaning' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: opt, vip: all },
      },
    ],
  },
  {
    category: { ja: '婦人科検査（女性）', 'zh-TW': '婦科檢查（女性）', en: 'Gynecological Exam (Female)' },
    items: [
      {
        name: { ja: '婦人科検査', 'zh-TW': '婦科檢查', en: 'Gynecological Exam' },
        detail: { ja: '内診・子宮頸部細胞診・経腟超音波・HPV・AMH', 'zh-TW': '內診・子宮頸部細胞診・陰超・HPV・AMH', en: 'Pelvic Exam, Pap Smear, Transvaginal US, HPV, AMH' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: '内視鏡検査', 'zh-TW': '內窺鏡檢查', en: 'Endoscopy' },
    items: [
      {
        name: { ja: '上部消化管内視鏡（胃カメラ）', 'zh-TW': '上部消化道內視鏡（胃鏡）', en: 'Upper GI Endoscopy (Gastroscopy)' },
        detail: { ja: '胃カメラ検査（鎮静麻酔）', 'zh-TW': '胃鏡檢查（鎮靜麻醉）', en: 'Gastroscopy (with sedation)' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': all, 'select-both': all, premium: opt, vip: all },
      },
      {
        name: { ja: '下部消化管内視鏡（大腸カメラ）', 'zh-TW': '下部消化道內視鏡（大腸鏡）', en: 'Lower GI Endoscopy (Colonoscopy)' },
        detail: { ja: '大腸カメラ検査（鎮静麻酔）', 'zh-TW': '大腸鏡檢查（鎮靜麻醉）', en: 'Colonoscopy (with sedation)' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': all, premium: opt, vip: all },
      },
      {
        name: { ja: '大腸ポリープ切除術', 'zh-TW': '大腸息肉切除術', en: 'Colon Polyp Removal' },
        detail: { ja: '切除条件制限あり', 'zh-TW': '有切除條件限制', en: 'Subject to conditions' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: opt, vip: all },
      },
    ],
  },
  {
    category: { ja: '超音波検査', 'zh-TW': '超聲波檢查', en: 'Ultrasound' },
    items: [
      {
        name: { ja: '腹部超音波', 'zh-TW': '腹部超聲波', en: 'Abdominal Ultrasound' },
        detail: { ja: '肝・胆・膵・腎・脾・腹部大動脈', 'zh-TW': '肝・膽・胰腺・腎臟・脾臟・腹部主動脈', en: 'Liver, Gallbladder, Pancreas, Kidney, Spleen, Aorta' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '心臓超音波', 'zh-TW': '心臟超聲波', en: 'Cardiac Ultrasound' },
        detail: { ja: '心臓の構造と機能の評価', 'zh-TW': '心臟結構與功能評估', en: 'Cardiac structure and function assessment' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '頸動脈・甲状腺', 'zh-TW': '頸動脈・甲狀腺', en: 'Carotid & Thyroid' },
        detail: { ja: '頸動脈・甲状腺超音波', 'zh-TW': '頸動脈・甲狀腺超聲波', en: 'Carotid & Thyroid Ultrasound' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: '下肢動脈・下肢静脈', 'zh-TW': '腿部動脈・腿部靜脈', en: 'Lower Extremity Vessels' },
        detail: { ja: '下肢動脈・静脈超音波', 'zh-TW': '下肢動脈・靜脈超聲波', en: 'Lower Extremity Arterial & Venous Ultrasound' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: '乳房超音波', 'zh-TW': '乳房超聲波', en: 'Breast Ultrasound' },
        detail: { ja: '乳腺超音波（女性）', 'zh-TW': '乳腺超聲波（女性）', en: 'Breast Ultrasound (Female)' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: 'X線検査', 'zh-TW': 'X線檢查', en: 'X-ray Imaging' },
    items: [
      {
        name: { ja: '胸部X線', 'zh-TW': '胸部X線', en: 'Chest X-ray' },
        detail: { ja: '1方向', 'zh-TW': '1個方向', en: '1 view' },
        packages: ALL6,
      },
      {
        name: { ja: '骨密度測定', 'zh-TW': '骨密度測量', en: 'Bone Density (DEXA)' },
        detail: { ja: 'DEXA法（腰椎・大腿骨）', 'zh-TW': 'DEXA法（腰椎・大腿骨）', en: 'DEXA method (Lumbar Spine & Femur)' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: 'マンモグラフィ', 'zh-TW': '乳腺鉬靶檢查', en: 'Mammography' },
        detail: { ja: '2D+3D撮影（女性）', 'zh-TW': '2D+3D拍攝（女性）', en: '2D+3D imaging (Female)' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: 'MRI検査', 'zh-TW': 'MRI 檢查', en: 'MRI Imaging' },
    items: [
      {
        name: { ja: '脳MRI・MRA', 'zh-TW': '腦MRI・MRA', en: 'Brain MRI & MRA' },
        detail: { ja: '脳部MRI・脳血管MRA', 'zh-TW': '腦部MRI・腦血管MRA', en: 'Brain MRI & Cerebrovascular MRA' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: '心臓MRI', 'zh-TW': '心臟MRI', en: 'Cardiac MRI' },
        detail: { ja: '心臓MRI（非造影）', 'zh-TW': '心臟MRI（非造影劑增強）', en: 'Cardiac MRI (non-contrast)' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: 'DWIBS全身がんスクリーニング', 'zh-TW': 'DWIBS全身癌篩', en: 'DWIBS Whole-body Cancer Screening' },
        detail: { ja: 'MRI全身がんスクリーニング（頸部〜骨盤）', 'zh-TW': 'MRI全身癌症篩查（頸部至骨盆）', en: 'Whole-body MRI Cancer Screening (Neck to Pelvis)' },
        packages: ALL6,
      },
      {
        name: { ja: 'その他MRI', 'zh-TW': '其他MRI', en: 'Other MRI' },
        detail: { ja: '前立腺/子宮卵巣/乳腺/MRCP等', 'zh-TW': '前列腺/子宮卵巢/乳腺/MRCP等', en: 'Prostate / Uterus & Ovary / Breast / MRCP, etc.' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: 'CT検査', 'zh-TW': 'CT 檢查', en: 'CT Imaging' },
    items: [
      {
        name: { ja: '胸部CT・冠動脈石灰化CT', 'zh-TW': '胸部CT・冠狀動脈鈣化CT', en: 'Chest CT & Coronary Calcium CT' },
        detail: { ja: 'カルシウムスコア測定', 'zh-TW': '鈣化評分測定', en: 'Calcium Score Assessment' },
        partialNote: { ja: 'DWIBSは肺CTのみ', 'zh-TW': 'DWIBS僅做肺CT', en: 'DWIBS: Lung CT only' },
        packages: { dwibs: par, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '腹部CT', 'zh-TW': '腹部CT', en: 'Abdominal CT' },
        detail: { ja: '腹部CT検査及び内臓脂肪量測定', 'zh-TW': '腹部CT檢查及腹腔內脂肪量測定', en: 'Abdominal CT & Visceral Fat Measurement' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
    ],
  },
  {
    category: { ja: '医師面談', 'zh-TW': '醫生面談', en: 'Doctor Consultation' },
    items: [
      {
        name: { ja: '内科診察', 'zh-TW': '內科診察', en: 'Internal Medicine Exam' },
        detail: { ja: '専門医問診', 'zh-TW': '專業醫師問診', en: 'Specialist Consultation' },
        packages: ALL6,
      },
      {
        name: { ja: '結果説明', 'zh-TW': '結果說明', en: 'Results Explanation' },
        detail: { ja: '当日または後日書面説明', 'zh-TW': '當日或日後書面說明', en: 'Same-day or follow-up written report' },
        partialNote: { ja: 'DWIBS/基本は後日書面', 'zh-TW': 'DWIBS/基礎為日後書面', en: 'DWIBS/BASIC: Written report only' },
        packages: { dwibs: par, basic: par, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
    ],
  },
  {
    category: { ja: 'その他サービス', 'zh-TW': '其他服務', en: 'Other Services' },
    items: [
      {
        name: { ja: '個室休憩室', 'zh-TW': '單間休息室', en: 'Private Rest Room' },
        detail: { ja: '専用個室ご利用', 'zh-TW': '專屬個室使用', en: 'Private room access' },
        packages: ALL6,
      },
      {
        name: { ja: '食事券', 'zh-TW': '餐券', en: 'Meal Voucher' },
        detail: { ja: 'お食事券', 'zh-TW': '精緻餐券', en: 'Complimentary meal voucher' },
        packages: ALL6,
      },
    ],
  },
];

export function getCheckItems(lang: Language): CheckCategory[] {
  return CHECK_ITEMS_DATA.map(cat => ({
    category: pick(cat.category, lang),
    items: cat.items.map(item => ({
      name: pick(item.name, lang),
      detail: item.detail ? pick(item.detail, lang) : undefined,
      partialNote: item.partialNote ? pick(item.partialNote, lang) : undefined,
      packages: item.packages,
    })),
  }));
}

// ============================================
// 3. 客戶評價
// ============================================

interface RawTestimonial {
  name: { ja: string; 'zh-TW': string; en: string };
  loc: { ja: string; 'zh-TW': string; en: string };
  flag: string;
  pkg: { ja: string; 'zh-TW': string; en: string };
  text: { ja: string; 'zh-TW': string; en: string };
  highlight: { ja: string; 'zh-TW': string; en: string };
}

const TESTIMONIALS_DATA: RawTestimonial[] = [
  {
    name: { ja: '陳様', 'zh-TW': '陳先生', en: 'Mr. Chen' },
    loc: { ja: '台北', 'zh-TW': '台北', en: 'Taipei' },
    flag: '🇹🇼',
    pkg: { ja: 'SELECT セレクトコース', 'zh-TW': 'SELECT 甄選套餐', en: 'SELECT Plan' },
    text: {
      ja: '初めて日本で健診を受けましたが、予約から完了まで非常にスムーズでした。TIMCの設備は本当に先進的で、環境もとても快適でした。',
      'zh-TW': '第一次來日本做健檢，從預約到體檢完成都非常順暢。TIMC的設備真的很先進，整個環境也很舒適。',
      en: 'My first health check-up in Japan was incredibly smooth from booking to completion. TIMC\'s facilities are truly state-of-the-art and the environment was very comfortable.',
    },
    highlight: { ja: '設備先進・環境快適', 'zh-TW': '設備先進、環境舒適', en: 'Advanced equipment, comfortable environment' },
  },
  {
    name: { ja: '林様', 'zh-TW': '林小姐', en: 'Ms. Lin' },
    loc: { ja: '高雄', 'zh-TW': '高雄', en: 'Kaohsiung' },
    flag: '🇹🇼',
    pkg: { ja: 'PREMIUM プレミアムコース', 'zh-TW': 'PREMIUM 尊享套餐', en: 'PREMIUM Plan' },
    text: {
      ja: 'PET-CT全身検査を受けました。医師が一つ一つの結果を丁寧に解説してくれました。中国語の報告書も詳細で、次回は両親も連れて来ます。',
      'zh-TW': '做了PET-CT全身檢查，醫生非常仔細地解說了每一項結果。中文報告很詳盡，下次會帶爸媽一起來。',
      en: 'Had a full PET-CT scan. The doctor thoroughly explained every single result. The translated report was very detailed. I\'ll bring my parents next time.',
    },
    highlight: { ja: 'PET-CT検査が専門的', 'zh-TW': 'PET-CT檢查專業', en: 'Professional PET-CT examination' },
  },
  {
    name: { ja: '王様', 'zh-TW': '王先生', en: 'Mr. Wang' },
    loc: { ja: '新竹', 'zh-TW': '新竹', en: 'Hsinchu' },
    flag: '🇹🇼',
    pkg: { ja: 'VIP 至尊コース', 'zh-TW': 'VIP 至尊套餐', en: 'VIP Plan' },
    text: {
      ja: '会社の役員健診でVIPコースを選びました。空港送迎から検査後の休憩まで行き届いた配慮でした。内視鏡は無痛で、寝ている間に終わりました。',
      'zh-TW': '公司高管健檢選擇了VIP套餐，從機場接送到檢查後的休息都安排得很周到。腸胃鏡是無痛的，睡一覺就做完了。',
      en: 'Chose the VIP plan for executive health screening. Everything from airport transfer to post-exam rest was well arranged. The endoscopy was painless — I fell asleep and it was done.',
    },
    highlight: { ja: '無痛内視鏡・サービス充実', 'zh-TW': '無痛腸胃鏡、服務周到', en: 'Painless endoscopy, excellent service' },
  },
  {
    name: { ja: '黄様', 'zh-TW': '黃先生', en: 'Mr. Huang' },
    loc: { ja: '上海', 'zh-TW': '上海', en: 'Shanghai' },
    flag: '🇨🇳',
    pkg: { ja: 'PREMIUM プレミアムコース', 'zh-TW': 'PREMIUM 尊享套餐', en: 'PREMIUM Plan' },
    text: {
      ja: '上海からわざわざ健診に来ましたが、全体的に素晴らしい体験でした。日本の医療水準は確かに優れており、MRI検査が非常に精密でした。',
      'zh-TW': '專程從上海飛過來做體檢，整體體驗非常好。日本的醫療水平確實領先，MRI檢查非常細緻。',
      en: 'Flew from Shanghai specifically for the checkup and the overall experience was excellent. Japan\'s medical standards are truly advanced — the MRI examination was remarkably detailed.',
    },
    highlight: { ja: 'MRI検査が精密', 'zh-TW': 'MRI檢查細緻', en: 'Detailed MRI examination' },
  },
  {
    name: { ja: '張様', 'zh-TW': '張小姐', en: 'Ms. Zhang' },
    loc: { ja: '香港', 'zh-TW': '香港', en: 'Hong Kong' },
    flag: '🇭🇰',
    pkg: { ja: 'SELECT セレクトコース', 'zh-TW': 'SELECT 甄選套餐', en: 'SELECT Plan' },
    text: {
      ja: '香港からのアクセスも便利で、飛行機で2時間でした。検査の流れもスムーズで、通訳が終始同行し、言語の壁は全くありませんでした。',
      'zh-TW': '香港過來很方便，兩個小時飛機就到。檢查流程很順，翻譯全程陪同，完全沒有語言障礙。',
      en: 'Very convenient from Hong Kong — just a 2-hour flight. The checkup process was smooth, with a dedicated interpreter throughout. No language barriers at all.',
    },
    highlight: { ja: '中国語サービスが心強い', 'zh-TW': '中文服務貼心', en: 'Excellent multilingual service' },
  },
  {
    name: { ja: '李様', 'zh-TW': '李先生', en: 'Mr. Li' },
    loc: { ja: '深圳', 'zh-TW': '深圳', en: 'Shenzhen' },
    flag: '🇨🇳',
    pkg: { ja: 'VIP 至尊コース', 'zh-TW': 'VIP 至尊套餐', en: 'VIP Plan' },
    text: {
      ja: '両親と一緒に年次健診に来ました。VIPコースの休憩室はとても快適で、年配の方も疲れません。結果説明も非常に詳しかったです。',
      'zh-TW': '帶父母一起來做年度健檢，VIP套餐的休息室非常舒適，老人家也不會覺得累。報告解讀很詳細。',
      en: 'Brought my parents for annual checkups. The VIP rest lounge was very comfortable — even elderly family members didn\'t feel tired. The report explanation was very thorough.',
    },
    highlight: { ja: '家族健診に最適', 'zh-TW': '適合全家健檢', en: 'Perfect for family checkups' },
  },
  {
    name: { ja: '呉様', 'zh-TW': '吳小姐', en: 'Ms. Wu' },
    loc: { ja: '台中', 'zh-TW': '台中', en: 'Taichung' },
    flag: '🇹🇼',
    pkg: { ja: 'PREMIUM プレミアムコース', 'zh-TW': 'PREMIUM 尊享套餐', en: 'PREMIUM Plan' },
    text: {
      ja: '友人の推薦で来ました。全身MRIと腫瘍マーカー検査を受けました。健康状態が良好とのことで、とても安心しました。',
      'zh-TW': '朋友推薦來的，做了全身MRI和腫瘤標記物檢測。醫生說我的健康狀況很好，讓我安心不少。',
      en: 'Came on a friend\'s recommendation. Had a full-body MRI and tumor marker tests. The doctor said I\'m in great health, which put my mind at ease.',
    },
    highlight: { ja: '全身MRIが精密', 'zh-TW': '全身MRI精準', en: 'Precise full-body MRI' },
  },
  {
    name: { ja: '許様', 'zh-TW': '許先生', en: 'Mr. Xu' },
    loc: { ja: '北京', 'zh-TW': '北京', en: 'Beijing' },
    flag: '🇨🇳',
    pkg: { ja: 'SELECT セレクトコース', 'zh-TW': 'SELECT 甄選套餐', en: 'SELECT Plan' },
    text: {
      ja: '日本の医療サービスは噂通りでした。空港のお迎えからプロフェッショナルを感じました。すでに何人かの友人に勧めています。',
      'zh-TW': '日本醫療服務果然名不虛傳，從接機開始就感受到專業。已經推薦給好幾個朋友了。',
      en: 'Japanese medical services lived up to their reputation. Felt the professionalism from the airport pickup. Already recommended to several friends.',
    },
    highlight: { ja: '空港送迎が行き届く', 'zh-TW': '接機服務周到', en: 'Thorough airport transfer service' },
  },
];

export function getTestimonials(lang: Language): Testimonial[] {
  return TESTIMONIALS_DATA.map(t => ({
    name: pick(t.name, lang),
    loc: pick(t.loc, lang),
    flag: t.flag,
    pkg: pick(t.pkg, lang),
    text: pick(t.text, lang),
    highlight: pick(t.highlight, lang),
  }));
}

// ============================================
// 4. UI 文案（表格圖例、按鈕等）
// ============================================

type UIKey =
  | 'checkItems' | 'included' | 'optional' | 'partial' | 'notIncluded'
  | 'book' | 'bookNow' | 'items'
  | 'legendIncluded' | 'legendOptional' | 'legendPartial' | 'legendNone'
  | 'priceNote' | 'source';

const UI_STRINGS: Record<UIKey, { ja: string; 'zh-TW': string; en: string }> = {
  checkItems:      { ja: '検査項目', 'zh-TW': '檢查項目', en: 'Exam Items' },
  included:        { ja: '含む', 'zh-TW': '包含', en: 'Included' },
  optional:        { ja: 'オプション', 'zh-TW': '可選', en: 'Optional' },
  partial:         { ja: '一部', 'zh-TW': '部分', en: 'Partial' },
  notIncluded:     { ja: '含まない', 'zh-TW': '不含', en: 'Not Included' },
  book:            { ja: '予約', 'zh-TW': '預約', en: 'Book' },
  bookNow:         { ja: '今すぐ予約', 'zh-TW': '立即預約', en: 'Book Now' },
  items:           { ja: '項', 'zh-TW': '項', en: 'items' },
  legendIncluded:  { ja: 'コース含む', 'zh-TW': '套餐包含', en: 'Included in plan' },
  legendOptional:  { ja: 'オプション追加', 'zh-TW': '可選加購', en: 'Optional add-on' },
  legendPartial:   { ja: '一部含む', 'zh-TW': '部分包含', en: 'Partially included' },
  legendNone:      { ja: '含まない', 'zh-TW': '不包含', en: 'Not included' },
  priceNote:       { ja: '全ての価格に医療通訳・報告書翻訳・消費税10%が含まれています', 'zh-TW': '所有價格均含醫療翻譯・報告翻譯・消費稅10%', en: 'All prices include medical interpretation, report translation & 10% consumption tax' },
  source:          { ja: '出典', 'zh-TW': '資料來源', en: 'Source' },
};

export function ui(key: UIKey, lang: Language): string {
  const entry = UI_STRINGS[key];
  if (!entry) return key;
  return pick(entry, lang);
}

// 重新導出類型供組件使用
export type { PackageDef, CheckItem, CheckCategory, ItemStatus, Testimonial };
