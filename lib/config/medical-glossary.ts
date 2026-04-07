/**
 * 医疗术语标准对照表
 * 用于确保所有白标页面的医疗术语翻译一致
 *
 * 使用场景：
 * 1. WebFetch 提取内容时附在 Prompt 中
 * 2. AI 翻译时作为术语约束
 * 3. 人工校对时作为参考
 */

export const MEDICAL_GLOSSARY = {
  // 干细胞相关
  stem_cells: {
    ja: '幹細胞',
    'zh-CN': '干细胞',
    'zh-TW': '幹細胞',
    en: 'Stem Cell',
    ko: '줄기세포',
  },
  autologous_stem_cells: {
    ja: '自家幹細胞',
    'zh-CN': '自体干细胞',
    'zh-TW': '自體幹細胞',
    en: 'Autologous Stem Cell',
    ko: '자가 줄기세포',
  },
  mesenchymal_stem_cells: {
    ja: '間葉系幹細胞',
    'zh-CN': '间充质干细胞',
    'zh-TW': '間質幹細胞',
    en: 'Mesenchymal Stem Cell (MSC)',
    ko: '중간엽 줄기세포 (MSC)',
  },

  // 癌症治疗
  cancer_vaccine: {
    ja: '自家がんワクチン',
    'zh-CN': '自体癌症疫苗',
    'zh-TW': '自體癌症疫苗',
    en: 'Autologous Cancer Vaccine',
    ko: '자가 암 백신',
  },
  immunotherapy: {
    ja: '免疫療法',
    'zh-CN': '免疫疗法',
    'zh-TW': '免疫療法',
    en: 'Immunotherapy',
    ko: '면역요법',
  },
  heavy_ion_therapy: {
    ja: '重粒子線治療',
    'zh-CN': '重离子治疗',
    'zh-TW': '重粒子治療',
    en: 'Heavy Ion Therapy',
    ko: '중입자선 치료',
  },
  carbon_ion: {
    ja: '炭素イオン',
    'zh-CN': '碳离子',
    'zh-TW': '碳離子',
    en: 'Carbon Ion',
    ko: '탄소 이온',
  },

  // 医美相关
  regenerative_medicine: {
    ja: '再生医療',
    'zh-CN': '再生医学',
    'zh-TW': '再生醫學',
    en: 'Regenerative Medicine',
    ko: '재생의학',
  },
  prp_therapy: {
    ja: 'PRP療法',
    'zh-CN': 'PRP疗法',
    'zh-TW': 'PRP療法',
    en: 'Platelet-Rich Plasma (PRP) Therapy',
    ko: 'PRP 요법',
  },
  exosome: {
    ja: 'エクソソーム',
    'zh-CN': '外泌体',
    'zh-TW': '外泌體',
    en: 'Exosome',
    ko: '엑소좀',
  },

  // 体检相关
  health_screening: {
    ja: '健康診断',
    'zh-CN': '健康体检',
    'zh-TW': '健康檢查',
    en: 'Health Screening',
    ko: '건강검진',
  },
  comprehensive_checkup: {
    ja: '人間ドック',
    'zh-CN': '全面体检',
    'zh-TW': '全面健檢',
    en: 'Comprehensive Medical Checkup',
    ko: '종합건강검진',
  },
  pet_ct: {
    ja: 'PET-CT検査',
    'zh-CN': 'PET-CT检查',
    'zh-TW': 'PET-CT檢查',
    en: 'PET-CT Scan',
    ko: 'PET-CT 검사',
  },

  // 医疗机构类型
  university_hospital: {
    ja: '大学病院',
    'zh-CN': '大学附属医院',
    'zh-TW': '大學附屬醫院',
    en: 'University Hospital',
    ko: '대학병원',
  },
  clinic: {
    ja: 'クリニック',
    'zh-CN': '诊所',
    'zh-TW': '診所',
    en: 'Clinic',
    ko: '클리닉',
  },

  // 常用医疗术语
  initial_consultation: {
    ja: '初診',
    'zh-CN': '初诊',
    'zh-TW': '初診',
    en: 'Initial Consultation',
    ko: '초진',
  },
  remote_consultation: {
    ja: 'オンライン診療',
    'zh-CN': '远程会诊',
    'zh-TW': '遠距診療',
    en: 'Remote Consultation',
    ko: '원격 진료',
  },
  follow_up: {
    ja: 'フォローアップ',
    'zh-CN': '随访',
    'zh-TW': '追蹤',
    en: 'Follow-up',
    ko: '후속 진료',
  },
  treatment_plan: {
    ja: '治療計画',
    'zh-CN': '治疗方案',
    'zh-TW': '治療方案',
    en: 'Treatment Plan',
    ko: '치료 계획',
  },
  side_effects: {
    ja: '副作用',
    'zh-CN': '副作用',
    'zh-TW': '副作用',
    en: 'Side Effects',
    ko: '부작용',
  },
  contraindications: {
    ja: '禁忌',
    'zh-CN': '禁忌症',
    'zh-TW': '禁忌症',
    en: 'Contraindications',
    ko: '금기사항',
  },

  // 认证资质
  mhlw_approval: {
    ja: '厚生労働省認可',
    'zh-CN': '厚生劳动省批准',
    'zh-TW': '厚生勞動省核准',
    en: 'Approved by Ministry of Health, Labour and Welfare (MHLW)',
    ko: '후생노동성 승인',
  },
  jmsa_certified: {
    ja: '日本再生医療学会認定',
    'zh-CN': '日本再生医学学会认证',
    'zh-TW': '日本再生醫學學會認證',
    en: 'Certified by Japanese Society for Regenerative Medicine',
    ko: '일본재생의료학회 인증',
  },
} as const;

/**
 * 生成用于 AI Prompt 的术语对照表字符串
 */
export function generateGlossaryPrompt(): string {
  return `
【医疗术语标准翻译对照表】
请严格使用以下术语翻译，不要自行创造：

${Object.entries(MEDICAL_GLOSSARY)
  .map(
    ([key, terms]) =>
      `- ${terms.ja} → 简中: ${terms['zh-CN']} | 繁中: ${terms['zh-TW']} | EN: ${terms.en}`
  )
  .join('\n')}

如遇到未在对照表中的专业术语，请保留日文原文并标注"[需确认译名]"。
`.trim();
}

/**
 * 检查文本中是否包含术语表中的关键词
 */
export function detectMedicalTerms(text: string): string[] {
  const detected: string[] = [];
  Object.entries(MEDICAL_GLOSSARY).forEach(([key, terms]) => {
    if (
      text.includes(terms.ja) ||
      text.includes(terms['zh-CN']) ||
      text.includes(terms['zh-TW'])
    ) {
      detected.push(key);
    }
  });
  return detected;
}
