/**
 * 医疗套餐配置中心
 *
 * 重要：此文件仅用于前端展示和开发参考
 * 生产环境的价格和配置以数据库 medical_packages 表为准
 */

export interface MedicalPackageConfig {
  slug: string;
  nameZhTw: string;
  nameJa: string;
  nameEn: string;
  descriptionZhTw: string;
  /** 参考价格（日元），实际价格以数据库为准 */
  priceJpy: number;
  category: 'cancer_treatment' | 'health_checkup' | 'cosmetic_surgery' | 'other';
  sortOrder: number;
}

/**
 * 医疗套餐配置
 *
 * ⚠️ 警告：这些价格仅供前端展示使用
 * API 和支付流程必须从数据库读取实际价格
 */
export const MEDICAL_PACKAGES: Record<string, MedicalPackageConfig> = {
  'cancer-initial-consultation': {
    slug: 'cancer-initial-consultation',
    nameZhTw: '癌症治療 - 前期諮詢服務',
    nameJa: 'がん治療 - 初期相談サービス',
    nameEn: 'Cancer Treatment - Initial Consultation',
    descriptionZhTw: '資料翻譯、醫院諮詢、治療方案初步評估',
    priceJpy: 221000,
    category: 'cancer_treatment',
    sortOrder: 100,
  },
  'cancer-remote-consultation': {
    slug: 'cancer-remote-consultation',
    nameZhTw: '癌症治療 - 遠程會診服務',
    nameJa: 'がん治療 - 遠隔診療サービス',
    nameEn: 'Cancer Treatment - Remote Consultation',
    descriptionZhTw: '與日本醫生遠程視頻會診、討論治療方案、費用概算',
    priceJpy: 243000,
    category: 'cancer_treatment',
    sortOrder: 101,
  },

  // ─── 兵庫医大 咨询服务 ───
  'hyogo-initial-consultation': {
    slug: 'hyogo-initial-consultation',
    nameZhTw: '兵庫醫大 - 前期諮詢服務',
    nameJa: '兵庫医大 - 初期相談サービス',
    nameEn: 'Hyogo Medical - Initial Consultation',
    descriptionZhTw: '資料翻譯、兵庫醫大諮詢、治療方案初步評估',
    priceJpy: 221000,
    category: 'cancer_treatment',
    sortOrder: 110,
  },
  'hyogo-remote-consultation': {
    slug: 'hyogo-remote-consultation',
    nameZhTw: '兵庫醫大 - 遠程會診服務',
    nameJa: '兵庫医大 - 遠隔診療サービス',
    nameEn: 'Hyogo Medical - Remote Consultation',
    descriptionZhTw: '與兵庫醫大專科醫生遠程視頻會診、討論治療方案、費用概算',
    priceJpy: 243000,
    category: 'cancer_treatment',
    sortOrder: 111,
  },

  // ─── HELENE 干细胞诊所 咨询服务 ───
  'helene-initial-consultation': {
    slug: 'helene-initial-consultation',
    nameZhTw: 'HELENE診所 - 前期諮詢服務',
    nameJa: 'ヘレネクリニック - 初期相談サービス',
    nameEn: 'HELENE Clinic - Initial Consultation',
    descriptionZhTw: '病歷翻譯、診所諮詢、幹細胞治療方案評估、費用概算',
    priceJpy: 221000,
    category: 'other',
    sortOrder: 120,
  },
  'helene-remote-consultation': {
    slug: 'helene-remote-consultation',
    nameZhTw: 'HELENE診所 - 遠程診斷服務',
    nameJa: 'ヘレネクリニック - 遠隔診療サービス',
    nameEn: 'HELENE Clinic - Remote Consultation',
    descriptionZhTw: '與HELENE診所專科醫生遠程視頻會診、幹細胞治療方案評估、費用概算',
    priceJpy: 243000,
    category: 'other',
    sortOrder: 121,
  },

  // ─── 銀座鳳凰クリニック 咨询服务 ───
  'ginza-phoenix-initial-consultation': {
    slug: 'ginza-phoenix-initial-consultation',
    nameZhTw: '銀座鳳凰診所 - 前期諮詢服務',
    nameJa: '銀座鳳凰クリニック - 初期相談サービス',
    nameEn: 'Ginza Phoenix Clinic - Initial Consultation',
    descriptionZhTw: '病歷翻譯、診所諮詢、免疫細胞療法方案評估、費用概算',
    priceJpy: 221000,
    category: 'other',
    sortOrder: 130,
  },
  'ginza-phoenix-remote-consultation': {
    slug: 'ginza-phoenix-remote-consultation',
    nameZhTw: '銀座鳳凰診所 - 遠程診斷服務',
    nameJa: '銀座鳳凰クリニック - 遠隔診療サービス',
    nameEn: 'Ginza Phoenix Clinic - Remote Consultation',
    descriptionZhTw: '與銀座鳳凰クリニック專科醫生遠程視頻會診、免疫細胞療法方案評估、費用概算',
    priceJpy: 243000,
    category: 'other',
    sortOrder: 131,
  },

  // ─── W CLINIC men's 男性专科 咨询服务 ───
  'wclinic-mens-initial-consultation': {
    slug: 'wclinic-mens-initial-consultation',
    nameZhTw: 'W CLINIC men\'s - 前期諮詢服務',
    nameJa: 'Wクリニック メンズ - 初期相談サービス',
    nameEn: 'W CLINIC men\'s - Initial Consultation',
    descriptionZhTw: '病歷翻譯、植村教授初診評估、ED/LOH/AGA治療方案制定、費用概算',
    priceJpy: 221000,
    category: 'other',
    sortOrder: 140,
  },
  'wclinic-mens-remote-consultation': {
    slug: 'wclinic-mens-remote-consultation',
    nameZhTw: 'W CLINIC men\'s - 遠程診斷服務',
    nameJa: 'Wクリニック メンズ - 遠隔診療サービス',
    nameEn: 'W CLINIC men\'s - Remote Consultation',
    descriptionZhTw: '與植村天受教授遠程視頻會診、男性健康治療方案評估、個性化診療計劃',
    priceJpy: 243000,
    category: 'other',
    sortOrder: 141,
  },

  // ─── 先端細胞医療（Cell-Medicine × iPeace）咨询服务 ───
  'cell-medicine-initial-consultation': {
    slug: 'cell-medicine-initial-consultation',
    nameZhTw: '先端細胞醫療 - 前期諮詢服務',
    nameJa: '先端細胞医療 - 初期相談サービス',
    nameEn: 'Advanced Cell Medicine - Initial Consultation',
    descriptionZhTw: '病歷翻譯、醫療機構諮詢、自體癌症疫苗/iPS細胞治療方案評估、費用概算',
    priceJpy: 221000,
    category: 'other',
    sortOrder: 150,
  },
  'cell-medicine-remote-consultation': {
    slug: 'cell-medicine-remote-consultation',
    nameZhTw: '先端細胞醫療 - 遠程診斷服務',
    nameJa: '先端細胞医療 - 遠隔診療サービス',
    nameEn: 'Advanced Cell Medicine - Remote Consultation',
    descriptionZhTw: '與專科醫生遠程視頻會診、自體癌症疫苗/iPS細胞治療方案評估、個性化診療計劃',
    priceJpy: 243000,
    category: 'other',
    sortOrder: 151,
  },

  // ─── AC Cell Clinic (ACセルクリニック) 咨询服务 ───
  'ac-plus-initial-consultation': {
    slug: 'ac-plus-initial-consultation',
    nameZhTw: 'AC Cell Clinic - 前期諮詢服務',
    nameJa: 'ACセルクリニック - 初期相談サービス',
    nameEn: 'AC Cell Clinic - Initial Consultation',
    descriptionZhTw: '病歷翻譯、診所諮詢、再生醫療方案評估、費用概算',
    priceJpy: 221000,
    category: 'other',
    sortOrder: 155,
  },
  'ac-plus-remote-consultation': {
    slug: 'ac-plus-remote-consultation',
    nameZhTw: 'AC Cell Clinic - 遠程診斷服務',
    nameJa: 'ACセルクリニック - 遠隔診療サービス',
    nameEn: 'AC Cell Clinic - Remote Consultation',
    descriptionZhTw: '與ACセルクリニック專科醫生遠程視頻會診、再生醫療方案評估、費用概算',
    priceJpy: 243000,
    category: 'other',
    sortOrder: 156,
  },

  // ─── IGTクリニック 咨询服务 ───
  'igtc-initial-consultation': {
    slug: 'igtc-initial-consultation',
    nameZhTw: 'IGT診所 - 前期諮詢服務',
    nameJa: 'IGTクリニック - 初期相談サービス',
    nameEn: 'IGT Clinic - Initial Consultation',
    descriptionZhTw: '病歷翻譯、IGT診所諮詢、血管內治療可行性評估、費用概算',
    priceJpy: 221000,
    category: 'cancer_treatment',
    sortOrder: 115,
  },
  'igtc-remote-consultation': {
    slug: 'igtc-remote-consultation',
    nameZhTw: 'IGT診所 - 遠程會診服務',
    nameJa: 'IGTクリニック - 遠隔診療サービス',
    nameEn: 'IGT Clinic - Remote Consultation',
    descriptionZhTw: '與IGT診所專科醫生遠程視頻會診、血管內治療方案制定、費用概算',
    priceJpy: 243000,
    category: 'cancer_treatment',
    sortOrder: 116,
  },

  // ─── HELENE 干细胞诊所 治疗套餐 ───
  // 注意：以下价格均为含税价格（税別价格 × 1.1）
  'helene-msc-iv-grade-b-minus': {
    slug: 'helene-msc-iv-grade-b-minus',
    nameZhTw: 'MSC幹細胞 靜脈/皮下 Grade B-（1億個）',
    nameJa: 'MSC幹細胞 静脈/皮下 Grade B-（1億個）',
    nameEn: 'MSC Stem Cell IV/SC Grade B- (100M cells)',
    descriptionZhTw: '間葉系幹細胞靜脈注射或皮下注射·1億個細胞·基礎療程',
    priceJpy: 1452000,
    category: 'other',
    sortOrder: 160,
  },
  'helene-msc-iv-grade-b': {
    slug: 'helene-msc-iv-grade-b',
    nameZhTw: 'MSC幹細胞 靜脈/皮下 Grade B（4億個）',
    nameJa: 'MSC幹細胞 静脈/皮下 Grade B（4億個）',
    nameEn: 'MSC Stem Cell IV/SC Grade B (400M cells)',
    descriptionZhTw: '間葉系幹細胞靜脈注射或皮下注射·4億個細胞·標準療程',
    priceJpy: 2178000,
    category: 'other',
    sortOrder: 161,
  },
  'helene-msc-iv-grade-b-plus': {
    slug: 'helene-msc-iv-grade-b-plus',
    nameZhTw: 'MSC幹細胞 靜脈/皮下 Grade B+（7億個）',
    nameJa: 'MSC幹細胞 静脈/皮下 Grade B+（7億個）',
    nameEn: 'MSC Stem Cell IV/SC Grade B+ (700M cells)',
    descriptionZhTw: '間葉系幹細胞靜脈注射或皮下注射·7億個細胞·增強療程',
    priceJpy: 3630000,
    category: 'other',
    sortOrder: 162,
  },
  'helene-msc-iv-grade-a-minus': {
    slug: 'helene-msc-iv-grade-a-minus',
    nameZhTw: 'MSC幹細胞 靜脈/皮下 Grade A-（10億個）',
    nameJa: 'MSC幹細胞 静脈/皮下 Grade A-（10億個）',
    nameEn: 'MSC Stem Cell IV/SC Grade A- (1B cells)',
    descriptionZhTw: '間葉系幹細胞靜脈注射或皮下注射·10億個細胞·高級療程',
    priceJpy: 4840000,
    category: 'other',
    sortOrder: 163,
  },
  'helene-msc-iv-grade-a': {
    slug: 'helene-msc-iv-grade-a',
    nameZhTw: 'MSC幹細胞 靜脈/皮下 Grade A（22.5億個）',
    nameJa: 'MSC幹細胞 静脈/皮下 Grade A（22.5億個）',
    nameEn: 'MSC Stem Cell IV/SC Grade A (2.25B cells)',
    descriptionZhTw: '間葉系幹細胞靜脈注射或皮下注射·22.5億個細胞·頂級療程',
    priceJpy: 6050000,
    category: 'other',
    sortOrder: 164,
  },
  'helene-msc-knee-single': {
    slug: 'helene-msc-knee-single',
    nameZhTw: 'MSC幹細胞 膝關節注射（單膝）',
    nameJa: 'MSC幹細胞 膝関節内注射（片膝）',
    nameEn: 'MSC Stem Cell Knee Injection (Single)',
    descriptionZhTw: '間葉系幹細胞膝關節內注射·1億個細胞·單膝治療',
    priceJpy: 1185800,
    category: 'other',
    sortOrder: 165,
  },
  'helene-msc-knee-both': {
    slug: 'helene-msc-knee-both',
    nameZhTw: 'MSC幹細胞 膝關節注射（雙膝）',
    nameJa: 'MSC幹細胞 膝関節内注射（両膝）',
    nameEn: 'MSC Stem Cell Knee Injection (Both)',
    descriptionZhTw: '間葉系幹細胞膝關節內注射·2億個細胞·雙膝治療',
    priceJpy: 1633500,
    category: 'other',
    sortOrder: 166,
  },
  'helene-msc-periodontal-single': {
    slug: 'helene-msc-periodontal-single',
    nameZhTw: 'MSC幹細胞 牙周組織注射（單顎）',
    nameJa: 'MSC幹細胞 歯周組織内注射（上顎or下顎）',
    nameEn: 'MSC Stem Cell Periodontal (Single Jaw)',
    descriptionZhTw: '間葉系幹細胞牙周組織內注射·1億個細胞·上顎或下顎',
    priceJpy: 1185800,
    category: 'other',
    sortOrder: 167,
  },
  'helene-msc-periodontal-both': {
    slug: 'helene-msc-periodontal-both',
    nameZhTw: 'MSC幹細胞 牙周組織注射（雙顎）',
    nameJa: 'MSC幹細胞 歯周組織内注射（上下顎）',
    nameEn: 'MSC Stem Cell Periodontal (Both Jaws)',
    descriptionZhTw: '間葉系幹細胞牙周組織內注射·2億個細胞·上下顎',
    priceJpy: 1633500,
    category: 'other',
    sortOrder: 168,
  },
  'helene-msc-hair': {
    slug: 'helene-msc-hair',
    nameZhTw: 'MSC幹細胞 脫髮部位注射 Grade B',
    nameJa: 'MSC幹細胞 脱毛部位注射 Grade B',
    nameEn: 'MSC Stem Cell Hair Loss Treatment Grade B',
    descriptionZhTw: '間葉系幹細胞脫髮部位注射·10億個細胞·毛髮再生療程',
    priceJpy: 3025000,
    category: 'other',
    sortOrder: 169,
  },
  'helene-exosome-topical': {
    slug: 'helene-exosome-topical',
    nameZhTw: '自體外泌體 外用塗抹（6個月份）',
    nameJa: '自己エクソソーム 外用塗布（6ヶ月分）',
    nameEn: 'Autologous Exosome Topical (6 Months)',
    descriptionZhTw: '自體培養外泌體·外用塗抹·6個月療程份量',
    priceJpy: 2178000,
    category: 'other',
    sortOrder: 170,
  },
  'helene-exosome-injection': {
    slug: 'helene-exosome-injection',
    nameZhTw: '自體外泌體 自我注射（1個月份）',
    nameJa: '自己エクソソーム セルフ注射（1ヶ月分）',
    nameEn: 'Autologous Exosome Self-Injection (1 Month)',
    descriptionZhTw: '自體培養外泌體·自我注射·1個月療程份量',
    priceJpy: 550000,
    category: 'other',
    sortOrder: 171,
  },
  'helene-nk-50': {
    slug: 'helene-nk-50',
    nameZhTw: 'NK細胞 靜脈投與（50億個）',
    nameJa: 'NK細胞 静脈投与（50億個）',
    nameEn: 'NK Cell IV Therapy (5B cells)',
    descriptionZhTw: 'NK自然殺手細胞靜脈投與·50億個細胞·免疫增強療程',
    priceJpy: 550000,
    category: 'other',
    sortOrder: 172,
  },
  'helene-nk-100': {
    slug: 'helene-nk-100',
    nameZhTw: 'NK細胞 靜脈投與（100億個）',
    nameJa: 'NK細胞 静脈投与（100億個）',
    nameEn: 'NK Cell IV Therapy (10B cells)',
    descriptionZhTw: 'NK自然殺手細胞靜脈投與·100億個細胞·高劑量免疫療程',
    priceJpy: 660000,
    category: 'other',
    sortOrder: 173,
  },
  'helene-blood-purification': {
    slug: 'helene-blood-purification',
    nameZhTw: '血液淨化療法',
    nameJa: '血液浄化療法',
    nameEn: 'Blood Purification Therapy',
    descriptionZhTw: '血液淨化·排除體內毒素·改善血液循環',
    priceJpy: 880000,
    category: 'other',
    sortOrder: 174,
  },

  // ─── TIMC 健康体检套餐 ───
  'vip-member-course': {
    slug: 'vip-member-course',
    nameZhTw: 'VIP 會員套餐',
    nameJa: 'VIP会員コース',
    nameEn: 'VIP Member Course',
    descriptionZhTw: '全身PET-CT、腦MRI/MRA、上下消化道內視鏡、心臟超聲波、DWIBS、VIP專屬休息室',
    priceJpy: 1512500,
    category: 'health_checkup',
    sortOrder: 200,
  },
  'premium-cardiac-course': {
    slug: 'premium-cardiac-course',
    nameZhTw: '尊享心臟套餐',
    nameJa: 'プレミアム心臓コース',
    nameEn: 'Premium Cardiac Course',
    descriptionZhTw: 'PET-CT、心臟CT/MRI、心臟超聲波、胃鏡、血液檢查',
    priceJpy: 825000,
    category: 'health_checkup',
    sortOrder: 201,
  },
  'select-gastro-colonoscopy': {
    slug: 'select-gastro-colonoscopy',
    nameZhTw: '甄選胃腸套餐',
    nameJa: '胃腸セレクトコース',
    nameEn: 'Gastro + Colonoscopy Course',
    descriptionZhTw: 'PET-CT、上下消化道內視鏡、腹部超聲波、大腸CT、血液檢查',
    priceJpy: 825000,
    category: 'health_checkup',
    sortOrder: 202,
  },
  'select-gastroscopy': {
    slug: 'select-gastroscopy',
    nameZhTw: '甄選胃鏡套餐',
    nameJa: '胃カメラセレクト',
    nameEn: 'Gastroscopy Course',
    descriptionZhTw: 'PET-CT、胃鏡、腹部超聲波、幽門螺旋桿菌、血液檢查',
    priceJpy: 687500,
    category: 'health_checkup',
    sortOrder: 203,
  },
  'dwibs-cancer-screening': {
    slug: 'dwibs-cancer-screening',
    nameZhTw: 'DWIBS 癌症篩查',
    nameJa: 'DWIBSがんスクリーニング',
    nameEn: 'DWIBS Cancer Screening',
    descriptionZhTw: 'DWIBS全身MRI、腫瘤標記物、血液檢查、結果說明、無痛無輻射',
    priceJpy: 275000,
    category: 'health_checkup',
    sortOrder: 204,
  },
  'basic-checkup': {
    slug: 'basic-checkup',
    nameZhTw: '標準健診套餐',
    nameJa: 'スタンダード健診',
    nameEn: 'Standard Checkup Course',
    descriptionZhTw: 'PET-CT、腹部超聲波、血液檢查、尿液檢查、結果說明',
    priceJpy: 550000,
    category: 'health_checkup',
    sortOrder: 205,
  },

  // ─── SAI CLINIC 医美整形 ───
  'sai-lift-try': {
    slug: 'sai-lift-try',
    nameZhTw: 'SAI LIFT TRY 糸リフト體驗',
    nameJa: 'SAI LIFT TRY（糸リフト体験）',
    nameEn: 'SAI LIFT TRY - Thread Lift Trial',
    descriptionZhTw: '初次體驗推薦·自然提升效果·術後恢復快·含術後回診',
    priceJpy: 380000,
    category: 'cosmetic_surgery',
    sortOrder: 300,
  },
  'sai-lift-standard': {
    slug: 'sai-lift-standard',
    nameZhTw: 'SAI LIFT STANDARD 糸リフト標準',
    nameJa: 'SAI LIFT STANDARD（糸リフト標準）',
    nameEn: 'SAI LIFT STANDARD - Thread Lift Standard',
    descriptionZhTw: '最受歡迎·明顯提升效果·效果持續12-18個月·含術後回診',
    priceJpy: 680000,
    category: 'cosmetic_surgery',
    sortOrder: 301,
  },
  'sai-lift-perfect': {
    slug: 'sai-lift-perfect',
    nameZhTw: 'SAI LIFT PERFECT 糸リフト完美',
    nameJa: 'SAI LIFT PERFECT（糸リフト完美）',
    nameEn: 'SAI LIFT PERFECT - Thread Lift Premium',
    descriptionZhTw: '最高級方案·全臉全方位改善·最長持效期·VIP專屬服務',
    priceJpy: 980000,
    category: 'cosmetic_surgery',
    sortOrder: 302,
  },
  'sai-nasolabial-set': {
    slug: 'sai-nasolabial-set',
    nameZhTw: '法令紋改善套餐',
    nameJa: 'ほうれい線セット',
    nameEn: 'Nasolabial Fold Treatment Set',
    descriptionZhTw: '糸リフト+玻尿酸·針對法令紋的綜合解決方案',
    priceJpy: 378000,
    category: 'cosmetic_surgery',
    sortOrder: 310,
  },
  'sai-vline-set': {
    slug: 'sai-vline-set',
    nameZhTw: 'V臉線條套餐',
    nameJa: 'V-Lineセット',
    nameEn: 'V-Line Facial Contouring Set',
    descriptionZhTw: '精準脂肪溶解+線雕提升·打造理想V臉線條',
    priceJpy: 496000,
    category: 'cosmetic_surgery',
    sortOrder: 311,
  },
  'sai-neck-set': {
    slug: 'sai-neck-set',
    nameZhTw: '頸紋改善套餐',
    nameJa: '首シワセット',
    nameEn: 'Neck Wrinkle Treatment Set',
    descriptionZhTw: '糸リフト+玻尿酸·改善頸部細紋和鬆弛',
    priceJpy: 378000,
    category: 'cosmetic_surgery',
    sortOrder: 312,
  },
  'sai-eye-fatigue-set': {
    slug: 'sai-eye-fatigue-set',
    nameZhTw: '眼周疲勞改善套餐',
    nameJa: '目元セット',
    nameEn: 'Eye Fatigue Treatment Set',
    descriptionZhTw: '針對眼周暗沉·細紋的綜合年輕化方案',
    priceJpy: 378000,
    category: 'cosmetic_surgery',
    sortOrder: 313,
  },
  'sai-double-eyelid': {
    slug: 'sai-double-eyelid',
    nameZhTw: '自然雙眼皮（埋線法）',
    nameJa: '二重埋没法（ナチュラル）',
    nameEn: 'Natural Double Eyelid Surgery',
    descriptionZhTw: '微創埋線法·自然雙眼皮效果·1年保障',
    priceJpy: 300000,
    category: 'cosmetic_surgery',
    sortOrder: 320,
  },
  'sai-double-eyelid-premium': {
    slug: 'sai-double-eyelid-premium',
    nameZhTw: '精緻雙眼皮（6點連續法）',
    nameJa: '6点連続法二重',
    nameEn: 'Premium Double Eyelid - 6-Point Method',
    descriptionZhTw: '6點連續縫合法·精緻持久線條·5年保障',
    priceJpy: 580000,
    category: 'cosmetic_surgery',
    sortOrder: 321,
  },
  'sai-under-eye-reversehamra': {
    slug: 'sai-under-eye-reversehamra',
    nameZhTw: '黑眼圈·眼袋去除（Reverse Hamra）',
    nameJa: '裏ハムラ法',
    nameEn: 'Under-Eye Treatment - Reverse Hamra',
    descriptionZhTw: 'Reverse Hamra法·根本解決黑眼圈·脂肪重新分配',
    priceJpy: 880000,
    category: 'cosmetic_surgery',
    sortOrder: 322,
  },
  'sai-nose-thread': {
    slug: 'sai-nose-thread',
    nameZhTw: '線雕隆鼻（8線）',
    nameJa: 'SAI LIFT NOSE 8本',
    nameEn: 'Nose Thread Lift - 8 Threads',
    descriptionZhTw: '8根專用隆鼻線·無需開刀·自然挺拔鼻型',
    priceJpy: 560000,
    category: 'cosmetic_surgery',
    sortOrder: 330,
  },
  'sai-nose-implant': {
    slug: 'sai-nose-implant',
    nameZhTw: '硅膠隆鼻',
    nameJa: 'プロテーゼ隆鼻',
    nameEn: 'Silicone Nose Implant',
    descriptionZhTw: '硅膠假體隆鼻·永久效果·自然手感',
    priceJpy: 480000,
    category: 'cosmetic_surgery',
    sortOrder: 331,
  },
  'sai-botox-full-face': {
    slug: 'sai-botox-full-face',
    nameZhTw: 'Allergan全臉肉毒素（100單位）',
    nameJa: 'ボトックス全顔100単位',
    nameEn: 'Allergan Botox Full Face 100 Units',
    descriptionZhTw: 'Allergan正品100單位·全臉抗皺除紋·認證醫師施術',
    priceJpy: 240000,
    category: 'cosmetic_surgery',
    sortOrder: 340,
  },
  'sai-hyaluronic-1cc': {
    slug: 'sai-hyaluronic-1cc',
    nameZhTw: '玻尿酸注射（Juvéderm 1cc）',
    nameJa: 'ヒアルロン酸 1cc',
    nameEn: 'Hyaluronic Acid Filler 1cc',
    descriptionZhTw: 'Juvéderm系列高端玻尿酸·精準塑形填充',
    priceJpy: 148000,
    category: 'cosmetic_surgery',
    sortOrder: 341,
  },
  'sai-skin-rejuvenation': {
    slug: 'sai-skin-rejuvenation',
    nameZhTw: '肌膚再生·水光注射',
    nameJa: '水光注射+幹細胞エキス',
    nameEn: 'Skin Rejuvenation - Hydro + Stem Cell',
    descriptionZhTw: '水光注射+幹細胞精華·深層修復再生·改善膚質',
    priceJpy: 304000,
    category: 'cosmetic_surgery',
    sortOrder: 342,
  },
  'sai-exosome-therapy': {
    slug: 'sai-exosome-therapy',
    nameZhTw: '幹細胞外泌體療法（2-3次）',
    nameJa: 'エクソソーム療法',
    nameEn: 'Exosome Stem Cell Therapy',
    descriptionZhTw: '最前沿再生醫療·新鮮幹細胞外泌體·2-3次療程',
    priceJpy: 760000,
    category: 'cosmetic_surgery',
    sortOrder: 343,
  },
  'sai-fat-grafting-face': {
    slug: 'sai-fat-grafting-face',
    nameZhTw: '全臉脂肪填充',
    nameJa: '全顔脂肪注入',
    nameEn: 'Full Face Fat Grafting',
    descriptionZhTw: '自體脂肪提取+全臉無限注入·永久自然年輕化',
    priceJpy: 1760000,
    category: 'cosmetic_surgery',
    sortOrder: 350,
  },
  'sai-liposuction-face': {
    slug: 'sai-liposuction-face',
    nameZhTw: '面部吸脂（雙區）',
    nameJa: '脂肪吸引（2部位）',
    nameEn: 'Facial Liposuction - 2 Areas',
    descriptionZhTw: '精準面部吸脂（頰部+下顎）·永久減脂不反彈',
    priceJpy: 480000,
    category: 'cosmetic_surgery',
    sortOrder: 351,
  },
  'sai-nutrition-perfect': {
    slug: 'sai-nutrition-perfect',
    nameZhTw: '精密營養分析（82項）',
    nameJa: 'パーフェクト栄養解析',
    nameEn: 'Precision Nutrition Analysis - Perfect',
    descriptionZhTw: '82項血液檢測+專業營養分析+個人健康方案',
    priceJpy: 118000,
    category: 'cosmetic_surgery',
    sortOrder: 360,
  },
  'sai-vitamin-c-drip': {
    slug: 'sai-vitamin-c-drip',
    nameZhTw: '高濃度維C點滴（20g）',
    nameJa: '高濃度ビタミンC点滴20g',
    nameEn: 'High-Dose Vitamin C IV Drip 20g',
    descriptionZhTw: '超高濃度維生素C靜脈注射·美白抗氧化·免疫力提升',
    priceJpy: 26000,
    category: 'cosmetic_surgery',
    sortOrder: 361,
  },
} as const;

/**
 * 获取套餐配置（用于前端展示）
 *
 * @param slug 套餐 slug
 * @returns 套餐配置，如果不存在返回 null
 */
export function getPackageConfig(slug: string): MedicalPackageConfig | null {
  return MEDICAL_PACKAGES[slug] || null;
}

/**
 * 获取所有套餐配置（用于前端列表展示）
 *
 * @returns 按 sortOrder 排序的套餐配置数组
 */
export function getAllPackageConfigs(): MedicalPackageConfig[] {
  return Object.values(MEDICAL_PACKAGES).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * 按分类获取套餐配置
 *
 * @param category 套餐分类
 * @returns 该分类下的所有套餐配置
 */
export function getPackagesByCategory(
  category: 'cancer_treatment' | 'health_checkup' | 'cosmetic_surgery' | 'other'
): MedicalPackageConfig[] {
  return getAllPackageConfigs().filter(pkg => pkg.category === category);
}

/**
 * 格式化价格显示
 *
 * @param priceJpy 日元价格
 * @param locale 语言
 * @returns 格式化后的价格字符串
 */
export function formatPrice(priceJpy: number, locale: string = 'zh-TW'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(priceJpy);
}
