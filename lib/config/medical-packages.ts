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
  category: 'cancer_treatment' | 'health_checkup' | 'other';
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
  category: 'cancer_treatment' | 'health_checkup' | 'other'
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
