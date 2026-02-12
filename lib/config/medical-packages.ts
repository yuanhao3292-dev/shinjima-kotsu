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
