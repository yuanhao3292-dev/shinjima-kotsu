/**
 * TIMC 健診項目 — 多語言翻譯數據
 *
 * 語言策略：
 * - zh-TW: 基準語言（現有數據）
 * - zh-CN: 由 traditionalToSimplified() 自動從 zh-TW 轉換
 * - ja: 日文醫學術語（參照 TIMC 原始 PDF 日文版）
 * - en: 標準英文醫學術語
 * - ko: 韓文翻譯（手動添加）
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
function pick(translations: { ja: string; 'zh-TW': string; en: string; ko?: string }, lang: Language): string {
  if (lang === 'zh-CN') return traditionalToSimplified(translations['zh-TW']);
  // Korean support — will be fully typed after Language type update
  if ((lang as string) === 'ko' && translations.ko) return translations.ko;
  return translations[lang] || translations['zh-TW'];
}

// ============================================
// 1. 套餐定義
// ============================================

const PACKAGES_DATA: Array<{
  id: string; name: string; price: number; color: string; slug: string;
  nameZh: { ja: string; 'zh-TW': string; en: string; ko?: string };
}> = [
  { id: 'dwibs', name: 'DWIBS', price: 275000, color: 'purple', slug: 'dwibs-cancer-screening',
    nameZh: { ja: 'がんスクリーニング', 'zh-TW': '防癌篩查', en: 'Cancer Screening', ko: '암 선별검사' } },
  { id: 'basic', name: 'BASIC', price: 550000, color: 'gray', slug: 'basic-checkup',
    nameZh: { ja: '基本コース', 'zh-TW': '基礎套餐', en: 'Basic Plan', ko: '기본 코스' } },
  { id: 'select-gastro', name: 'SELECT', price: 687500, color: 'teal', slug: 'select-gastroscopy',
    nameZh: { ja: '胃カメラ', 'zh-TW': '胃鏡', en: 'Gastroscopy', ko: '위내시경' } },
  { id: 'select-both', name: 'SELECT', price: 825000, color: 'green', slug: 'select-gastro-colonoscopy',
    nameZh: { ja: '胃・大腸カメラ', 'zh-TW': '胃腸鏡', en: 'Gastro-Colonoscopy', ko: '위장내시경' } },
  { id: 'premium', name: 'PREMIUM', price: 825000, color: 'blue', slug: 'premium-cardiac-course',
    nameZh: { ja: '心臓精密', 'zh-TW': '心臟精密', en: 'Cardiac Precision', ko: '심장 정밀' } },
  { id: 'vip', name: 'VIP', price: 1512500, color: 'yellow', slug: 'vip-member-course',
    nameZh: { ja: 'プレミアム総合', 'zh-TW': '頂級全能', en: 'Ultimate Comprehensive', ko: '프리미엄 종합' } },
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
  name: { ja: string; 'zh-TW': string; en: string; ko?: string };
  detail?: { ja: string; 'zh-TW': string; en: string; ko?: string };
  partialNote?: { ja: string; 'zh-TW': string; en: string; ko?: string };
  packages: Record<string, ItemStatus>;
}

interface RawCategory {
  category: { ja: string; 'zh-TW': string; en: string; ko?: string };
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
    category: { ja: '基本測定', 'zh-TW': '基礎測量', en: 'Basic Measurements', ko: '기초 측정' },
    items: [
      {
        name: { ja: '身体測定・血圧', 'zh-TW': '身體測量・血壓', en: 'Body Measurements & Blood Pressure', ko: '신체측정·혈압' },
        detail: { ja: '身長・体重・BMI・腹囲・肥満度・体脂肪・血圧', 'zh-TW': '身高・體重・BMI・腰圍・肥胖程度・體脂肪・血壓', en: 'Height, Weight, BMI, Waist, Obesity, Body Fat, Blood Pressure', ko: '신장·체중·BMI·허리둘레·비만도·체지방·혈압' },
        packages: ALL6,
      },
      {
        name: { ja: '視力・聴力', 'zh-TW': '視力・聽力', en: 'Vision & Hearing', ko: '시력·청력' },
        detail: { ja: '視力検査(5m距離)・オージオメーター聴力検査', 'zh-TW': '視力檢查(5米距離)・測聽器聽力檢查', en: 'Visual Acuity (5m), Audiometry', ko: '시력검사(5m 거리)·청력검사' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '眼圧・眼底', 'zh-TW': '眼壓・眼底', en: 'Intraocular Pressure & Fundoscopy', ko: '안압·안저' },
        detail: { ja: '眼圧測定(両眼)・眼底精密(広角眼底撮影)・OCT(光干渉断層計)', 'zh-TW': '眼壓測量(雙眼)・眼部精密(廣角眼底攝影)・OCT(光學相干斷層掃描)', en: 'IOP (Both Eyes), Wide-angle Fundus Photography, OCT', ko: '안압측정(양안)·안저정밀(광각안저촬영)·OCT(광간섭단층촬영)' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '心電図・動脈硬化検査', 'zh-TW': '心電圖・動脈硬化檢查', en: 'ECG & Arteriosclerosis Test', ko: '심전도·동맥경화검사' },
        detail: { ja: '安静時心電図・心拍数・ABI・CAVI', 'zh-TW': '靜態心電圖・心率・ABI・CAVI', en: 'Resting ECG, Heart Rate, ABI, CAVI', ko: '안정시 심전도·심박수·ABI·CAVI' },
        partialNote: { ja: 'DWIBSは心電図・心拍数のみ', 'zh-TW': 'DWIBS僅做心電圖和心率', en: 'DWIBS: ECG & Heart Rate only', ko: 'DWIBS는 심전도·심박수만' },
        packages: { dwibs: par, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
    ],
  },
  {
    category: { ja: '血液検査', 'zh-TW': '血液檢查', en: 'Blood Tests', ko: '혈액검사' },
    items: [
      {
        name: { ja: '血球算定', 'zh-TW': '血常規', en: 'Complete Blood Count', ko: '혈구산정' },
        detail: { ja: '白血球数・赤血球数・ヘモグロビン・Ht・MCV・MCH・MCHC・血小板', 'zh-TW': '白血球數・紅血球數・血紅蛋白・Ht・MCV・MCH・MCHC・血小板', en: 'WBC, RBC, Hemoglobin, Ht, MCV, MCH, MCHC, Platelets', ko: '백혈구수·적혈구수·헤모글로빈·Ht·MCV·MCH·MCHC·혈소판' },
        packages: ALL6,
      },
      {
        name: { ja: '白血球像', 'zh-TW': '白血球成像', en: 'WBC Differential', ko: '백혈구상' },
        detail: { ja: '好中球・リンパ球・単球・好酸球・好塩基球', 'zh-TW': '嗜中性細胞・淋巴細胞・單球細胞・嗜酸性粒細胞・嗜鹼性粒細胞', en: 'Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils', ko: '호중구·림프구·단구·호산구·호염기구' },
        packages: ALL6,
      },
      {
        name: { ja: '肝機能', 'zh-TW': '肝功能', en: 'Liver Function', ko: '간기능' },
        detail: { ja: '総ビリルビン・AST・ALT・γ-GT・ALP・LD・CHE・Fe・TIBC・UIBC・Zn', 'zh-TW': '總膽紅素・AST・ALT・γ-GT・ALP・LD・CHE・Fe・TIBC・UIBC・Zn', en: 'T-Bil, AST, ALT, γ-GT, ALP, LD, CHE, Fe, TIBC, UIBC, Zn', ko: '총빌리루빈·AST·ALT·γ-GT·ALP·LD·CHE·Fe·TIBC·UIBC·Zn' },
        packages: ALL6,
      },
      {
        name: { ja: '血清蛋白', 'zh-TW': '血清蛋白', en: 'Serum Protein', ko: '혈청단백' },
        detail: { ja: '総蛋白・アルブミン・A/G比', 'zh-TW': '總蛋白・白蛋白・A/G比', en: 'Total Protein, Albumin, A/G Ratio', ko: '총단백·알부민·A/G비' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '糖代謝・膵臓', 'zh-TW': '糖代謝・胰腺', en: 'Glucose Metabolism & Pancreas', ko: '당대사·췌장' },
        detail: { ja: '血糖・HbA1c・血清アミラーゼ・インスリン', 'zh-TW': '血糖・血紅蛋白・血清澱粉酶・胰島素', en: 'Blood Glucose, HbA1c, Amylase, Insulin', ko: '혈당·HbA1c·혈청아밀라아제·인슐린' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '脂質', 'zh-TW': '脂質', en: 'Lipid Profile', ko: '지질' },
        detail: { ja: '総コレステロール・中性脂肪・HDL-C・LDL/non-HDL-C・small dense LDL・Lp(a)', 'zh-TW': '總膽固醇・甘油三酯・高密度脂蛋白膽固醇・低密度/非高密度脂蛋白膽固醇・小而密低密度脂蛋白・脂蛋白a', en: 'T-Chol, TG, HDL-C, LDL/non-HDL-C, sd-LDL, Lp(a)', ko: '총콜레스테롤·중성지방·HDL-C·LDL/non-HDL-C·소밀도LDL·Lp(a)' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '腎機能', 'zh-TW': '腎功能', en: 'Renal Function', ko: '신기능' },
        detail: { ja: 'クレアチニン・eGFR・尿素窒素・尿酸・Cu', 'zh-TW': '肌酐・eGFR・尿素氮・尿酸・Cu', en: 'Creatinine, eGFR, BUN, Uric Acid, Cu', ko: '크레아티닌·eGFR·요소질소·요산·Cu' },
        packages: ALL6,
      },
      {
        name: { ja: '電解質', 'zh-TW': '電解質', en: 'Electrolytes', ko: '전해질' },
        detail: { ja: 'Na・K・Cl・Mg・P・Ca', 'zh-TW': 'Na・K・Cl・Mg・P・Ca', en: 'Na, K, Cl, Mg, P, Ca', ko: 'Na·K·Cl·Mg·P·Ca' },
        packages: ALL6,
      },
      {
        name: { ja: '血清免疫', 'zh-TW': '血清免疫', en: 'Serum Immunology', ko: '혈청면역' },
        detail: { ja: 'CRP・肝炎ウイルス(HBs抗原・HCV抗体)', 'zh-TW': 'CRP・肝炎病毒(HBs抗原・HCV抗體)', en: 'CRP, Hepatitis (HBs Ag, HCV Ab)', ko: 'CRP·간염바이러스(HBs항원·HCV항체)' },
        partialNote: { ja: 'DWIBSはCRPのみ', 'zh-TW': 'DWIBS僅做CRP', en: 'DWIBS: CRP only', ko: 'DWIBS는 CRP만' },
        packages: { dwibs: par, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '甲状腺機能', 'zh-TW': '甲狀腺功能', en: 'Thyroid Function', ko: '갑상선기능' },
        detail: { ja: 'FT3・FT4・TSH', 'zh-TW': 'FT3・FT4・TSH', en: 'FT3, FT4, TSH', ko: 'FT3·FT4·TSH' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '心臓機能', 'zh-TW': '心臟功能', en: 'Cardiac Markers', ko: '심장기능' },
        detail: { ja: 'NTproBNP・CPK・心筋トロポニンT検査', 'zh-TW': 'NTproBNP・CPK・心肌蛋白T檢查', en: 'NT-proBNP, CPK, Troponin T', ko: 'NTproBNP·CPK·심근트로포닌T검사' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '凝固・線溶系', 'zh-TW': '凝血和纖溶系統', en: 'Coagulation & Fibrinolysis', ko: '응고·섬용계' },
        detail: { ja: 'Dダイマー定量・PT', 'zh-TW': 'D二聚體定量・PT', en: 'D-Dimer, PT', ko: 'D-다이머 정량·PT' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '血液型', 'zh-TW': '血型', en: 'Blood Type', ko: '혈액형' },
        detail: { ja: 'ABO式・Rh(D)式', 'zh-TW': 'ABO式・Rh(D)式', en: 'ABO, Rh(D)', ko: 'ABO식·Rh(D)식' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '胃がんリスク', 'zh-TW': '胃癌風險篩查', en: 'Gastric Cancer Risk', ko: '위암 위험' },
        detail: { ja: 'H・ピロリ菌抗体・ペプシノゲン・ABC分類', 'zh-TW': 'H・幽門螺旋桿菌抗體・丙種球蛋白・ABC分類', en: 'H. Pylori Ab, Pepsinogen, ABC Classification', ko: 'H·피롤리균항체·펩시노겐·ABC분류' },
        packages: { dwibs: all, basic: non, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: 'リウマチ因子', 'zh-TW': '類風濕因子', en: 'Rheumatoid Factor', ko: '류마티스 인자' },
        detail: { ja: 'RF', 'zh-TW': 'RF', en: 'RF', ko: 'RF' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '腫瘍マーカー（男性）', 'zh-TW': '腫瘤標誌物（男）', en: 'Tumor Markers (Male)', ko: '종양표지자 (남성)' },
        detail: { ja: 'CEA・AFP・CA19-9・CYFRA・ProGRP・PSA・SCC', 'zh-TW': 'CEA・AFP・CA19-9・CYFRA・ProGRP・PSA・SCC', en: 'CEA, AFP, CA19-9, CYFRA, ProGRP, PSA, SCC', ko: 'CEA·AFP·CA19-9·CYFRA·ProGRP·PSA·SCC' },
        packages: ALL6,
      },
      {
        name: { ja: '腫瘍マーカー（女性）', 'zh-TW': '腫瘤標誌物（女）', en: 'Tumor Markers (Female)', ko: '종양표지자 (여성)' },
        detail: { ja: 'CEA・AFP・CA19-9・CYFRA・ProGRP・CA125・SCC・CA15-3', 'zh-TW': 'CEA・AFP・CA19-9・CYFRA・ProGRP・CA125・SCC・CA15-3', en: 'CEA, AFP, CA19-9, CYFRA, ProGRP, CA125, SCC, CA15-3', ko: 'CEA·AFP·CA19-9·CYFRA·ProGRP·CA125·SCC·CA15-3' },
        packages: ALL6,
      },
      {
        name: { ja: '感染症検査', 'zh-TW': '傳染病檢查', en: 'Infectious Disease Panel', ko: '감염증검사' },
        detail: { ja: 'HIV・梅毒・HTLV-1・パルボウイルスB19 IgM・マイコプラズマ', 'zh-TW': 'HIV・梅毒・HTLV-1・小DNA病毒B19IgM・支原體', en: 'HIV, Syphilis, HTLV-1, Parvovirus B19 IgM, Mycoplasma', ko: 'HIV·매독·HTLV-1·파보바이러스B19 IgM·마이코플라즈마' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: '尿検査・便検査', 'zh-TW': '尿檢・便檢', en: 'Urinalysis & Stool Test', ko: '소변·대변 검사' },
    items: [
      {
        name: { ja: '尿検査', 'zh-TW': '尿液檢查', en: 'Urinalysis', ko: '소변검사' },
        detail: { ja: '蛋白・糖・ウロビリノゲン・ビリルビン・潜血・PH・比重・ケトン体', 'zh-TW': '蛋白・糖・尿蛋白原・膽紅素・潛血・PH・比重・酮體', en: 'Protein, Glucose, Urobilinogen, Bilirubin, Occult Blood, pH, SG, Ketones', ko: '단백·당·유로빌리노겐·빌리루빈·잠혈·PH·비중·케톤체' },
        packages: ALL6,
      },
      {
        name: { ja: '尿沈渣', 'zh-TW': '尿沉渣', en: 'Urine Sediment', ko: '요침사' },
        detail: { ja: '赤血球・白血球・扁平上皮・細菌・尿微量アルブミン測定', 'zh-TW': '紅血球・白血球・鱗狀上皮・細菌・尿微量白蛋白測定', en: 'RBC, WBC, Squamous Epithelium, Bacteria, Microalbumin', ko: '적혈구·백혈구·편평상피·세균·요미량알부민측정' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: '便潜血検査', 'zh-TW': '便潛血檢查', en: 'Fecal Occult Blood Test', ko: '대변잠혈검사' },
        detail: { ja: '潜血反応（2回法）', 'zh-TW': '潛血反應（2回法）', en: 'Occult Blood (2-sample method)', ko: '잠혈반응(2회법)' },
        packages: { dwibs: non, basic: non, 'select-gastro': non, 'select-both': all, premium: non, vip: all },
      },
    ],
  },
  {
    category: { ja: '歯科検査', 'zh-TW': '齒科檢查', en: 'Dental Examination', ko: '치과 검사' },
    items: [
      {
        name: { ja: '3D口腔内スキャナー', 'zh-TW': '3D口腔內掃描儀', en: '3D Intraoral Scanner', ko: '3D 구강내 스캐너' },
        detail: { ja: '画像検査', 'zh-TW': '圖像檢查', en: 'Image Scan', ko: '영상 검사' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: 'X線検査', 'zh-TW': 'X線檢查', en: 'X-ray Examination', ko: 'X선 검사' },
        detail: { ja: 'パノラマ最新機器によるX線検査', 'zh-TW': '由panorama最新設備拍攝的X線檢查', en: 'Panoramic X-ray with latest equipment', ko: '파노라마 최신 장비 X선 검사' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '歯科診察', 'zh-TW': '齒科診察', en: 'Dental Consultation', ko: '치과 진찰' },
        detail: { ja: '医師面談', 'zh-TW': '醫生面談', en: 'Doctor Consultation', ko: '의사 면담' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: 'メンテナンス', 'zh-TW': '保養', en: 'Maintenance', ko: '유지보수' },
        detail: { ja: '歯石除去', 'zh-TW': '去除牙垢', en: 'Scaling / Teeth Cleaning', ko: '치석 제거' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: opt, vip: all },
      },
    ],
  },
  {
    category: { ja: '婦人科検査（女性）', 'zh-TW': '婦科檢查（女性）', en: 'Gynecological Exam (Female)', ko: '부인과 검사 (여성)' },
    items: [
      {
        name: { ja: '婦人科検査', 'zh-TW': '婦科檢查', en: 'Gynecological Exam', ko: '부인과 검사' },
        detail: { ja: '内診・子宮頸部細胞診・経腟超音波・HPV・AMH', 'zh-TW': '內診・子宮頸部細胞診・陰超・HPV・AMH', en: 'Pelvic Exam, Pap Smear, Transvaginal US, HPV, AMH', ko: '내진·자궁경부세포진·경질초음파·HPV·AMH' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: '内視鏡検査', 'zh-TW': '內窺鏡檢查', en: 'Endoscopy', ko: '내시경 검사' },
    items: [
      {
        name: { ja: '上部消化管内視鏡（胃カメラ）', 'zh-TW': '上部消化道內視鏡（胃鏡）', en: 'Upper GI Endoscopy (Gastroscopy)', ko: '상부소화관내시경(위내시경)' },
        detail: { ja: '胃カメラ検査（鎮静麻酔）', 'zh-TW': '胃鏡檢查（鎮靜麻醉）', en: 'Gastroscopy (with sedation)', ko: '위내시경 검사(진정마취)' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': all, 'select-both': all, premium: opt, vip: all },
      },
      {
        name: { ja: '下部消化管内視鏡（大腸カメラ）', 'zh-TW': '下部消化道內視鏡（大腸鏡）', en: 'Lower GI Endoscopy (Colonoscopy)', ko: '하부소화관내시경(대장내시경)' },
        detail: { ja: '大腸カメラ検査（鎮静麻酔）', 'zh-TW': '大腸鏡檢查（鎮靜麻醉）', en: 'Colonoscopy (with sedation)', ko: '대장내시경 검사(진정마취)' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': all, premium: opt, vip: all },
      },
      {
        name: { ja: '大腸ポリープ切除術', 'zh-TW': '大腸息肉切除術', en: 'Colon Polyp Removal', ko: '대장폴립절제술' },
        detail: { ja: '切除条件制限あり', 'zh-TW': '有切除條件限制', en: 'Subject to conditions', ko: '절제 조건 제한 있음' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: opt, vip: all },
      },
    ],
  },
  {
    category: { ja: '超音波検査', 'zh-TW': '超聲波檢查', en: 'Ultrasound', ko: '초음파 검사' },
    items: [
      {
        name: { ja: '腹部超音波', 'zh-TW': '腹部超聲波', en: 'Abdominal Ultrasound', ko: '복부초음파' },
        detail: { ja: '肝・胆・膵・腎・脾・腹部大動脈', 'zh-TW': '肝・膽・胰腺・腎臟・脾臟・腹部主動脈', en: 'Liver, Gallbladder, Pancreas, Kidney, Spleen, Aorta', ko: '간·담낭·췌장·신장·비장·복부대동맥' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '心臓超音波', 'zh-TW': '心臟超聲波', en: 'Cardiac Ultrasound', ko: '심장초음파' },
        detail: { ja: '心臓の構造と機能の評価', 'zh-TW': '心臟結構與功能評估', en: 'Cardiac structure and function assessment', ko: '심장 구조와 기능 평가' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '頸動脈・甲状腺', 'zh-TW': '頸動脈・甲狀腺', en: 'Carotid & Thyroid', ko: '경동맥·갑상선' },
        detail: { ja: '頸動脈・甲状腺超音波', 'zh-TW': '頸動脈・甲狀腺超聲波', en: 'Carotid & Thyroid Ultrasound', ko: '경동맥·갑상선 초음파' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: '下肢動脈・下肢静脈', 'zh-TW': '腿部動脈・腿部靜脈', en: 'Lower Extremity Vessels', ko: '하지동맥·하지정맥' },
        detail: { ja: '下肢動脈・静脈超音波', 'zh-TW': '下肢動脈・靜脈超聲波', en: 'Lower Extremity Arterial & Venous Ultrasound', ko: '하지 동맥·정맥 초음파' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: '乳房超音波', 'zh-TW': '乳房超聲波', en: 'Breast Ultrasound', ko: '유방초음파' },
        detail: { ja: '乳腺超音波（女性）', 'zh-TW': '乳腺超聲波（女性）', en: 'Breast Ultrasound (Female)', ko: '유선초음파(여성)' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: 'X線検査', 'zh-TW': 'X線檢查', en: 'X-ray Imaging', ko: 'X선 검사' },
    items: [
      {
        name: { ja: '胸部X線', 'zh-TW': '胸部X線', en: 'Chest X-ray', ko: '흉부 X선' },
        detail: { ja: '1方向', 'zh-TW': '1個方向', en: '1 view', ko: '1방향' },
        packages: ALL6,
      },
      {
        name: { ja: '骨密度測定', 'zh-TW': '骨密度測量', en: 'Bone Density (DEXA)', ko: '골밀도 측정' },
        detail: { ja: 'DEXA法（腰椎・大腿骨）', 'zh-TW': 'DEXA法（腰椎・大腿骨）', en: 'DEXA method (Lumbar Spine & Femur)', ko: 'DEXA법(요추·대퇴골)' },
        packages: NO_DWIBS,
      },
      {
        name: { ja: 'マンモグラフィ', 'zh-TW': '乳腺鉬靶檢查', en: 'Mammography', ko: '유방촬영술' },
        detail: { ja: '2D+3D撮影（女性）', 'zh-TW': '2D+3D拍攝（女性）', en: '2D+3D imaging (Female)', ko: '2D+3D 촬영(여성)' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: 'MRI検査', 'zh-TW': 'MRI 檢查', en: 'MRI Imaging', ko: 'MRI 검사' },
    items: [
      {
        name: { ja: '脳MRI・MRA', 'zh-TW': '腦MRI・MRA', en: 'Brain MRI & MRA', ko: '뇌MRI·MRA' },
        detail: { ja: '脳部MRI・脳血管MRA', 'zh-TW': '腦部MRI・腦血管MRA', en: 'Brain MRI & Cerebrovascular MRA', ko: '뇌부MRI·뇌혈관MRA' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: '心臓MRI', 'zh-TW': '心臟MRI', en: 'Cardiac MRI', ko: '심장MRI' },
        detail: { ja: '心臓MRI（非造影）', 'zh-TW': '心臟MRI（非造影劑增強）', en: 'Cardiac MRI (non-contrast)', ko: '심장MRI(비조영)' },
        packages: { dwibs: opt, basic: opt, 'select-gastro': opt, 'select-both': opt, premium: all, vip: all },
      },
      {
        name: { ja: 'DWIBS全身がんスクリーニング', 'zh-TW': 'DWIBS全身癌篩', en: 'DWIBS Whole-body Cancer Screening', ko: 'DWIBS 전신암선별검사' },
        detail: { ja: 'MRI全身がんスクリーニング（頸部〜骨盤）', 'zh-TW': 'MRI全身癌症篩查（頸部至骨盆）', en: 'Whole-body MRI Cancer Screening (Neck to Pelvis)', ko: 'MRI 전신암선별검사(경부~골반)' },
        packages: ALL6,
      },
      {
        name: { ja: 'その他MRI', 'zh-TW': '其他MRI', en: 'Other MRI', ko: '기타MRI' },
        detail: { ja: '前立腺/子宮卵巣/乳腺/MRCP等', 'zh-TW': '前列腺/子宮卵巢/乳腺/MRCP等', en: 'Prostate / Uterus & Ovary / Breast / MRCP, etc.', ko: '전립선/자궁난소/유선/MRCP 등' },
        packages: OPT_VIP,
      },
    ],
  },
  {
    category: { ja: 'CT検査', 'zh-TW': 'CT 檢查', en: 'CT Imaging', ko: 'CT 검사' },
    items: [
      {
        name: { ja: '胸部CT・冠動脈石灰化CT', 'zh-TW': '胸部CT・冠狀動脈鈣化CT', en: 'Chest CT & Coronary Calcium CT', ko: '흉부CT·관상동맥석회화CT' },
        detail: { ja: 'カルシウムスコア測定', 'zh-TW': '鈣化評分測定', en: 'Calcium Score Assessment', ko: '칼슘스코어 측정' },
        partialNote: { ja: 'DWIBSは肺CTのみ', 'zh-TW': 'DWIBS僅做肺CT', en: 'DWIBS: Lung CT only', ko: 'DWIBS는 폐CT만' },
        packages: { dwibs: par, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
      {
        name: { ja: '腹部CT', 'zh-TW': '腹部CT', en: 'Abdominal CT', ko: '복부CT' },
        detail: { ja: '腹部CT検査及び内臓脂肪量測定', 'zh-TW': '腹部CT檢查及腹腔內脂肪量測定', en: 'Abdominal CT & Visceral Fat Measurement', ko: '복부CT검사 및 내장지방량 측정' },
        packages: { dwibs: opt, basic: all, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
    ],
  },
  {
    category: { ja: '医師面談', 'zh-TW': '醫生面談', en: 'Doctor Consultation', ko: '의사 면담' },
    items: [
      {
        name: { ja: '内科診察', 'zh-TW': '內科診察', en: 'Internal Medicine Exam', ko: '내과 진찰' },
        detail: { ja: '専門医問診', 'zh-TW': '專業醫師問診', en: 'Specialist Consultation', ko: '전문의 문진' },
        packages: ALL6,
      },
      {
        name: { ja: '結果説明', 'zh-TW': '結果說明', en: 'Results Explanation', ko: '결과 설명' },
        detail: { ja: '当日または後日書面説明', 'zh-TW': '當日或日後書面說明', en: 'Same-day or follow-up written report', ko: '당일 또는 추후 서면 설명' },
        partialNote: { ja: 'DWIBS/基本は後日書面', 'zh-TW': 'DWIBS/基礎為日後書面', en: 'DWIBS/BASIC: Written report only', ko: 'DWIBS/기본은 추후 서면' },
        packages: { dwibs: par, basic: par, 'select-gastro': all, 'select-both': all, premium: all, vip: all },
      },
    ],
  },
  {
    category: { ja: 'その他サービス', 'zh-TW': '其他服務', en: 'Other Services', ko: '기타 서비스' },
    items: [
      {
        name: { ja: '個室休憩室', 'zh-TW': '單間休息室', en: 'Private Rest Room', ko: '개인 휴게실' },
        detail: { ja: '専用個室ご利用', 'zh-TW': '專屬個室使用', en: 'Private room access', ko: '전용 개인실 이용' },
        packages: ALL6,
      },
      {
        name: { ja: '食事券', 'zh-TW': '餐券', en: 'Meal Voucher', ko: '식사권' },
        detail: { ja: 'お食事券', 'zh-TW': '精緻餐券', en: 'Complimentary meal voucher', ko: '식사권' },
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
  name: { ja: string; 'zh-TW': string; en: string; ko?: string };
  loc: { ja: string; 'zh-TW': string; en: string; ko?: string };
  flag: string;
  pkg: { ja: string; 'zh-TW': string; en: string; ko?: string };
  text: { ja: string; 'zh-TW': string; en: string; ko?: string };
  highlight: { ja: string; 'zh-TW': string; en: string; ko?: string };
}

const TESTIMONIALS_DATA: RawTestimonial[] = [
  {
    name: { ja: '陳様', 'zh-TW': '陳先生', en: 'Mr. Chen', ko: '천 님' },
    loc: { ja: '台北', 'zh-TW': '台北', en: 'Taipei', ko: '타이베이' },
    flag: '🇹🇼',
    pkg: { ja: 'SELECT セレクトコース', 'zh-TW': 'SELECT 甄選套餐', en: 'SELECT Plan', ko: 'SELECT 셀렉트 코스' },
    text: {
      ja: '初めて日本で健診を受けましたが、予約から完了まで非常にスムーズでした。TIMCの設備は本当に先進的で、環境もとても快適でした。',
      'zh-TW': '第一次來日本做健檢，從預約到體檢完成都非常順暢。TIMC的設備真的很先進，整個環境也很舒適。',
      en: 'My first health check-up in Japan was incredibly smooth from booking to completion. TIMC\'s facilities are truly state-of-the-art and the environment was very comfortable.',
      ko: '처음으로 일본에서 건강검진을 받았는데, 예약부터 완료까지 매우 순조로웠습니다. TIMC의 시설은 정말 첨단이고, 환경도 매우 쾌적했습니다.',
    },
    highlight: { ja: '設備先進・環境快適', 'zh-TW': '設備先進、環境舒適', en: 'Advanced equipment, comfortable environment', ko: '첨단 시설, 쾌적한 환경' },
  },
  {
    name: { ja: '林様', 'zh-TW': '林小姐', en: 'Ms. Lin', ko: '린 님' },
    loc: { ja: '高雄', 'zh-TW': '高雄', en: 'Kaohsiung', ko: '가오슝' },
    flag: '🇹🇼',
    pkg: { ja: 'PREMIUM プレミアムコース', 'zh-TW': 'PREMIUM 尊享套餐', en: 'PREMIUM Plan', ko: 'PREMIUM 프리미엄 코스' },
    text: {
      ja: 'PET-CT全身検査を受けました。医師が一つ一つの結果を丁寧に解説してくれました。中国語の報告書も詳細で、次回は両親も連れて来ます。',
      'zh-TW': '做了PET-CT全身檢查，醫生非常仔細地解說了每一項結果。中文報告很詳盡，下次會帶爸媽一起來。',
      en: 'Had a full PET-CT scan. The doctor thoroughly explained every single result. The translated report was very detailed. I\'ll bring my parents next time.',
      ko: 'PET-CT 전신검사를 받았습니다. 의사가 각 결과를 정성껏 설명해 주었습니다. 한국어 보고서도 상세했고, 다음에는 부모님도 모시고 오겠습니다.',
    },
    highlight: { ja: 'PET-CT検査が専門的', 'zh-TW': 'PET-CT檢查專業', en: 'Professional PET-CT examination', ko: 'PET-CT 검사 전문적' },
  },
  {
    name: { ja: '王様', 'zh-TW': '王先生', en: 'Mr. Wang', ko: '왕 님' },
    loc: { ja: '新竹', 'zh-TW': '新竹', en: 'Hsinchu', ko: '신주' },
    flag: '🇹🇼',
    pkg: { ja: 'VIP 至尊コース', 'zh-TW': 'VIP 至尊套餐', en: 'VIP Plan', ko: 'VIP 지존 코스' },
    text: {
      ja: '会社の役員健診でVIPコースを選びました。空港送迎から検査後の休憩まで行き届いた配慮でした。内視鏡は無痛で、寝ている間に終わりました。',
      'zh-TW': '公司高管健檢選擇了VIP套餐，從機場接送到檢查後的休息都安排得很周到。腸胃鏡是無痛的，睡一覺就做完了。',
      en: 'Chose the VIP plan for executive health screening. Everything from airport transfer to post-exam rest was well arranged. The endoscopy was painless — I fell asleep and it was done.',
      ko: '회사 임원 건강검진으로 VIP 코스를 선택했습니다. 공항 픽업부터 검사 후 휴식까지 세심한 배려였습니다. 내시경은 무통으로, 자는 사이에 끝났습니다.',
    },
    highlight: { ja: '無痛内視鏡・サービス充実', 'zh-TW': '無痛腸胃鏡、服務周到', en: 'Painless endoscopy, excellent service', ko: '무통 내시경, 충실한 서비스' },
  },
  {
    name: { ja: '黄様', 'zh-TW': '黃先生', en: 'Mr. Huang', ko: '황 님' },
    loc: { ja: '上海', 'zh-TW': '上海', en: 'Shanghai', ko: '상하이' },
    flag: '🇨🇳',
    pkg: { ja: 'PREMIUM プレミアムコース', 'zh-TW': 'PREMIUM 尊享套餐', en: 'PREMIUM Plan', ko: 'PREMIUM 프리미엄 코스' },
    text: {
      ja: '上海からわざわざ健診に来ましたが、全体的に素晴らしい体験でした。日本の医療水準は確かに優れており、MRI検査が非常に精密でした。',
      'zh-TW': '專程從上海飛過來做體檢，整體體驗非常好。日本的醫療水平確實領先，MRI檢查非常細緻。',
      en: 'Flew from Shanghai specifically for the checkup and the overall experience was excellent. Japan\'s medical standards are truly advanced — the MRI examination was remarkably detailed.',
      ko: '상하이에서 일부러 검진하러 왔는데, 전체적으로 훌륭한 경험이었습니다. 일본 의료 수준은 확실히 뛰어나며, MRI 검사가 매우 정밀했습니다.',
    },
    highlight: { ja: 'MRI検査が精密', 'zh-TW': 'MRI檢查細緻', en: 'Detailed MRI examination', ko: 'MRI 검사 정밀' },
  },
  {
    name: { ja: '張様', 'zh-TW': '張小姐', en: 'Ms. Zhang', ko: '장 님' },
    loc: { ja: '香港', 'zh-TW': '香港', en: 'Hong Kong', ko: '홍콩' },
    flag: '🇭🇰',
    pkg: { ja: 'SELECT セレクトコース', 'zh-TW': 'SELECT 甄選套餐', en: 'SELECT Plan', ko: 'SELECT 셀렉트 코스' },
    text: {
      ja: '香港からのアクセスも便利で、飛行機で2時間でした。検査の流れもスムーズで、通訳が終始同行し、言語の壁は全くありませんでした。',
      'zh-TW': '香港過來很方便，兩個小時飛機就到。檢查流程很順，翻譯全程陪同，完全沒有語言障礙。',
      en: 'Very convenient from Hong Kong — just a 2-hour flight. The checkup process was smooth, with a dedicated interpreter throughout. No language barriers at all.',
      ko: '홍콩에서의 접근도 편리하고, 비행기로 2시간이었습니다. 검사 흐름도 원활했고, 통역이 처음부터 끝까지 동행하여 언어 장벽은 전혀 없었습니다.',
    },
    highlight: { ja: '中国語サービスが心強い', 'zh-TW': '中文服務貼心', en: 'Excellent multilingual service', ko: '다국어 서비스가 든든' },
  },
  {
    name: { ja: '李様', 'zh-TW': '李先生', en: 'Mr. Li', ko: '이 님' },
    loc: { ja: '深圳', 'zh-TW': '深圳', en: 'Shenzhen', ko: '선전' },
    flag: '🇨🇳',
    pkg: { ja: 'VIP 至尊コース', 'zh-TW': 'VIP 至尊套餐', en: 'VIP Plan', ko: 'VIP 지존 코스' },
    text: {
      ja: '両親と一緒に年次健診に来ました。VIPコースの休憩室はとても快適で、年配の方も疲れません。結果説明も非常に詳しかったです。',
      'zh-TW': '帶父母一起來做年度健檢，VIP套餐的休息室非常舒適，老人家也不會覺得累。報告解讀很詳細。',
      en: 'Brought my parents for annual checkups. The VIP rest lounge was very comfortable — even elderly family members didn\'t feel tired. The report explanation was very thorough.',
      ko: '부모님과 함께 연간 건강검진을 받으러 왔습니다. VIP 코스의 휴게실은 매우 쾌적해서, 어르신도 피곤하지 않습니다. 결과 설명도 매우 상세했습니다.',
    },
    highlight: { ja: '家族健診に最適', 'zh-TW': '適合全家健檢', en: 'Perfect for family checkups', ko: '가족 검진에 최적' },
  },
  {
    name: { ja: '呉様', 'zh-TW': '吳小姐', en: 'Ms. Wu', ko: '오 님' },
    loc: { ja: '台中', 'zh-TW': '台中', en: 'Taichung', ko: '타이중' },
    flag: '🇹🇼',
    pkg: { ja: 'PREMIUM プレミアムコース', 'zh-TW': 'PREMIUM 尊享套餐', en: 'PREMIUM Plan', ko: 'PREMIUM 프리미엄 코스' },
    text: {
      ja: '友人の推薦で来ました。全身MRIと腫瘍マーカー検査を受けました。健康状態が良好とのことで、とても安心しました。',
      'zh-TW': '朋友推薦來的，做了全身MRI和腫瘤標記物檢測。醫生說我的健康狀況很好，讓我安心不少。',
      en: 'Came on a friend\'s recommendation. Had a full-body MRI and tumor marker tests. The doctor said I\'m in great health, which put my mind at ease.',
      ko: '친구의 추천으로 왔습니다. 전신 MRI와 종양표지자 검사를 받았습니다. 건강 상태가 양호하다는 말을 듣고 매우 안심했습니다.',
    },
    highlight: { ja: '全身MRIが精密', 'zh-TW': '全身MRI精準', en: 'Precise full-body MRI', ko: '전신 MRI 정밀' },
  },
  {
    name: { ja: '許様', 'zh-TW': '許先生', en: 'Mr. Xu', ko: '허 님' },
    loc: { ja: '北京', 'zh-TW': '北京', en: 'Beijing', ko: '베이징' },
    flag: '🇨🇳',
    pkg: { ja: 'SELECT セレクトコース', 'zh-TW': 'SELECT 甄選套餐', en: 'SELECT Plan', ko: 'SELECT 셀렉트 코스' },
    text: {
      ja: '日本の医療サービスは噂通りでした。空港のお迎えからプロフェッショナルを感じました。すでに何人かの友人に勧めています。',
      'zh-TW': '日本醫療服務果然名不虛傳，從接機開始就感受到專業。已經推薦給好幾個朋友了。',
      en: 'Japanese medical services lived up to their reputation. Felt the professionalism from the airport pickup. Already recommended to several friends.',
      ko: '일본의 의료 서비스는 소문대로였습니다. 공항 픽업부터 프로페셔널함을 느꼈습니다. 이미 여러 친구에게 추천했습니다.',
    },
    highlight: { ja: '空港送迎が行き届く', 'zh-TW': '接機服務周到', en: 'Thorough airport transfer service', ko: '공항 픽업 서비스 철저' },
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

const UI_STRINGS: Record<UIKey, { ja: string; 'zh-TW': string; en: string; ko?: string }> = {
  checkItems:      { ja: '検査項目', 'zh-TW': '檢查項目', en: 'Exam Items', ko: '검사 항목' },
  included:        { ja: '含む', 'zh-TW': '包含', en: 'Included', ko: '포함' },
  optional:        { ja: 'オプション', 'zh-TW': '可選', en: 'Optional', ko: '선택' },
  partial:         { ja: '一部', 'zh-TW': '部分', en: 'Partial', ko: '부분' },
  notIncluded:     { ja: '含まない', 'zh-TW': '不含', en: 'Not Included', ko: '미포함' },
  book:            { ja: '予約', 'zh-TW': '預約', en: 'Book', ko: '예약' },
  bookNow:         { ja: '今すぐ予約', 'zh-TW': '立即預約', en: 'Book Now', ko: '지금 예약' },
  items:           { ja: '項', 'zh-TW': '項', en: 'items', ko: '항목' },
  legendIncluded:  { ja: 'コース含む', 'zh-TW': '套餐包含', en: 'Included in plan', ko: '코스 포함' },
  legendOptional:  { ja: 'オプション追加', 'zh-TW': '可選加購', en: 'Optional add-on', ko: '선택 추가' },
  legendPartial:   { ja: '一部含む', 'zh-TW': '部分包含', en: 'Partially included', ko: '부분 포함' },
  legendNone:      { ja: '含まない', 'zh-TW': '不包含', en: 'Not included', ko: '미포함' },
  priceNote:       { ja: '全ての価格に医療通訳・報告書翻訳・消費税10%が含まれています', 'zh-TW': '所有價格均含醫療翻譯・報告翻譯・消費稅10%', en: 'All prices include medical interpretation, report translation & 10% consumption tax', ko: '모든 가격에 의료 통역·보고서 번역·소비세 10%가 포함되어 있습니다' },
  source:          { ja: '出典', 'zh-TW': '資料來源', en: 'Source', ko: '출처' },
};

export function ui(key: UIKey, lang: Language): string {
  const entry = UI_STRINGS[key];
  if (!entry) return key;
  return pick(entry, lang);
}

// 重新導出類型供組件使用
export type { PackageDef, CheckItem, CheckCategory, ItemStatus, Testimonial };
