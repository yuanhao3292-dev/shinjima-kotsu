/**
 * JTB 日语科室名 → 系统标准科室名（zh-CN）映射
 *
 * 系统标准科室名定义在 hospital-knowledge-base.ts 的 DEPARTMENT_ALIASES 中，
 * 使用简体中文作为 canonical key。
 *
 * 此文件扩展映射以覆盖 JTB 网站上出现的日语科室名及其变体。
 */

/**
 * JTB 日语科室名 → 系统标准科室名（zh-CN）
 *
 * 注意：日语「整形外科」= 骨科（orthopedics），不是美容整形。
 * 日语美容整形 = 「美容外科」「形成外科」。
 */
export const JTB_DEPARTMENT_MAP: Record<string, string> = {
  // ─── 内科系 ───
  '内科': '内科',
  '総合内科': '内科',
  '一般内科': '内科',
  '消化器内科': '消化内科',
  '消化器科': '消化内科',
  '胃腸科': '消化内科',
  '呼吸器内科': '呼吸内科',
  '呼吸器科': '呼吸内科',
  '循環器内科': '循环内科',
  '循環器科': '循环内科',
  '心臓内科': '循环内科',
  '脳神経内科': '神经内科',
  '神経内科': '神经内科',
  '腎臓内科': '肾脏内科',
  '腎臓科': '肾脏内科',
  '内分泌科': '内分泌科',
  '内分泌代謝科': '内分泌科',
  '内分泌・代謝内科': '内分泌科',
  '糖尿病内科': '内分泌科',
  '糖尿病・代謝内科': '内分泌科',
  '血液内科': '血液内科',
  '血液科': '血液内科',
  '腫瘍内科': '肿瘤科',
  'アレルギー科': '内科',
  'リウマチ科': '内科',
  '膠原病科': '内科',
  '感染症科': '内科',
  '肝臓内科': '消化内科',

  // ─── 外科系 ───
  '外科': '外科',
  '一般外科': '外科',
  '消化器外科': '消化外科',
  '心臓外科': '心脏外科',
  '心臓血管外科': '心脏外科',
  '心血管外科': '心脏外科',
  '脳神経外科': '脑神经外科',
  '脳外科': '脑神经外科',
  '整形外科': '骨科',           // 重要：日语整形外科 = 骨科
  '骨科': '骨科',
  '泌尿器科': '泌尿外科',
  '泌尿器外科': '泌尿外科',
  '呼吸器外科': '胸外科',
  '胸部外科': '胸外科',
  '乳腺外科': '外科',
  '乳腺・内分泌外科': '外科',
  '小児外科': '外科',
  '血管外科': '外科',
  '移植外科': '外科',

  // ─── 産婦人科系 ───
  '産婦人科': '妇产科',
  '婦人科': '妇产科',
  '産科': '妇产科',
  '婦人科腫瘍科': '妇科肿瘤科',

  // ─── その他の診療科 ───
  '小児科': '小儿科',
  '新生児科': '小儿科',
  '皮膚科': '皮肤科',
  '眼科': '眼科',
  '耳鼻咽喉科': '耳鼻喉科',
  '耳鼻科': '耳鼻喉科',
  '放射線科': '放射科',
  '放射線診断科': '放射科',
  '放射線治療科': '放射线治疗科',
  '麻酔科': '麻醉科',
  '精神科': '内科',
  '精神神経科': '内科',
  '心療内科': '内科',
  'リハビリテーション科': '康复科',
  '救急科': '急救医疗科',
  '救急医療科': '急救医疗科',
  '口腔外科': '外科',
  '歯科': '外科',
  '歯科口腔外科': '外科',
  '病理診断科': '检验科',
  '臨床検査科': '检验科',
  '緩和ケア科': '姑息医疗科',
  '総合診療科': '内科',

  // ─── 美容・再生医療 ───
  '形成外科': '整形外科',       // 日语形成外科 ≈ 美容/整形
  '美容外科': '整形外科',
  '美容皮膚科': '美容皮肤科',
  '再生医療科': '再生医疗科',

  // ─── 健診・透析 ───
  '健診科': '健康诊断科',
  '健康診断科': '健康诊断科',
  '人間ドック': '健康诊断科',
  '透析科': '肾脏内科',
};

/**
 * JTB 专科/治疗关键词 → 关联的系统标准科室名
 * 用于从 specialties 和 programs 字段推断科室
 */
export const SPECIALTY_TO_DEPARTMENTS: Record<string, string[]> = {
  '人間ドック': ['健康诊断科'],
  '脳ドック': ['健康诊断科', '神经内科'],
  'がん検診': ['健康诊断科', '肿瘤科'],
  'PET検診': ['健康诊断科', '放射科'],
  'PET-CT': ['健康诊断科', '放射科'],
  '心臓ドック': ['健康诊断科', '循环内科'],
  'レディースドック': ['健康诊断科', '妇产科'],
  '再生医療': ['再生医疗科'],
  '幹細胞': ['再生医疗科'],
  '免疫療法': ['免疫细胞治疗科'],
  '免疫細胞': ['免疫细胞治疗科'],
  'NK細胞': ['免疫细胞治疗科'],
  '遺伝子治療': ['免疫细胞治疗科'],
  'ロボット手術': ['外科'],
  'ダヴィンチ': ['外科'],
  'da Vinci': ['外科'],
  '重粒子線治療': ['放射线治疗科'],
  '陽子線治療': ['放射线治疗科'],
  '放射線治療': ['放射线治疗科'],
  'カテーテル治療': ['循环内科'],
  '内視鏡手術': ['消化内科', '消化外科'],
  '内視鏡': ['消化内科'],
  '腹腔鏡手術': ['外科'],
  '化学療法': ['化疗科'],
  '透析': ['肾脏内科'],
  '美容外科手術': ['整形外科'],
  '歯科インプラント': ['外科'],
  '矯正歯科': ['外科'],
  'リハビリ': ['康复科'],
  'がん': ['肿瘤科'],
  '脊椎': ['骨科'],
  '関節': ['骨科'],
  '白内障': ['眼科'],
  '近視矯正': ['眼科'],
  'レーシック': ['眼科'],
  'AGA': ['男性科'],
  'ED': ['男性科'],
  '糸リフト': ['整形外科'],
  '脂肪吸引': ['整形外科'],
};

/**
 * 从 JTB 日语科室名转换为系统标准科室名
 */
export function normalizeJTBDepartment(jaName: string): string | null {
  return JTB_DEPARTMENT_MAP[jaName.trim()] || null;
}

/**
 * 从 JTB 医院数据的多个字段推断标准科室列表
 */
export function inferDepartments(
  rawDepartments: string[],
  specialties: string[],
  programs: Array<{ name: string; category: string }>,
  overview: string,
  salesPoints: string
): string[] {
  const depts = new Set<string>();

  // 1. 从原始科室名直接映射
  for (const d of rawDepartments) {
    const mapped = normalizeJTBDepartment(d);
    if (mapped) depts.add(mapped);
  }

  // 2. 从 specialties 推断
  for (const spec of specialties) {
    for (const [keyword, departments] of Object.entries(SPECIALTY_TO_DEPARTMENTS)) {
      if (spec.includes(keyword)) {
        departments.forEach((d) => depts.add(d));
      }
    }
  }

  // 3. 从 programs 推断
  for (const prog of programs) {
    const text = `${prog.name} ${prog.category}`;
    for (const [keyword, departments] of Object.entries(SPECIALTY_TO_DEPARTMENTS)) {
      if (text.includes(keyword)) {
        departments.forEach((d) => depts.add(d));
      }
    }
  }

  // 4. 从概要和卖点文本推断
  const combined = `${overview} ${salesPoints}`;
  for (const [keyword, departments] of Object.entries(SPECIALTY_TO_DEPARTMENTS)) {
    if (combined.includes(keyword)) {
      departments.forEach((d) => depts.add(d));
    }
  }

  return [...depts];
}

/**
 * 推断医院分类
 */
export function inferCategory(
  specialties: string[],
  genres: string[],
  programs: Array<{ name: string; category: string }>,
  overview: string
): 'general_hospital' | 'health_screening' | 'aesthetics' | 'stem_cell' {
  const allText = [
    ...specialties,
    ...genres,
    ...programs.map((p) => p.name),
    overview,
  ].join(' ');

  // 干细胞/再生医疗
  if (/幹細胞|再生医療|iPS/.test(allText)) return 'stem_cell';

  // 美容
  if (/美容|糸リフト|脂肪吸引|ヒアルロン酸|ボトックス/.test(allText)) return 'aesthetics';

  // 健诊
  if (/人間ドック|健診|PET-CT|脳ドック/.test(allText) && !/外科|内科|手術/.test(allText)) {
    return 'health_screening';
  }

  return 'general_hospital';
}
