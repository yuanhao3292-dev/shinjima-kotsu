/**
 * AEMC Hospital Knowledge Base
 *
 * 结构化医院/诊所数据，供 hospital-matcher 用于
 * 将 AI 分诊结果（科室 + 风险等级 + 症状）匹配到最合适的合作机构。
 *
 * 数据来源：各机构 Content.tsx 组件中的实际信息。
 * 修改须知：新增机构时同步更新 PRODUCT_CATEGORIES 和 page_modules。
 */

// ============================================================
// 类型定义
// ============================================================

export type HospitalCategory =
  | 'general_hospital'
  | 'health_screening'
  | 'aesthetics'
  | 'stem_cell';

export interface HospitalKnowledge {
  /** 对应 page_modules.component_key */
  id: string;
  name: string;
  nameJa: string;
  nameZhTw?: string;
  location: string;
  /** 机构分类 */
  category: HospitalCategory;
  /** 可处理的科室（与 AI 分诊输出的 recommended_departments 匹配） */
  departments: string[];
  /** 特色专科/治疗方向（用于细粒度匹配） */
  specialties: string[];
  /** 可处理的症状/疾病关键词（用于模糊匹配） */
  conditionKeywords: string[];
  /** 机构亮点（用于前端展示） */
  features: string[];
  /** 适合描述（一句话） */
  suitableFor: string;
  /** 是否可处理急症 */
  hasEmergency: boolean;
  /** 是否提供线上会诊 */
  hasRemoteConsultation: boolean;
  /** 床位数（0 = 诊所） */
  bedCount: number;
  /** 优先级权重（同分时优先推荐） */
  priority: number;
}

// ============================================================
// 知识库数据
// ============================================================

export const HOSPITAL_KNOWLEDGE_BASE: HospitalKnowledge[] = [
  // ──────────────────────────────────────────────────────────
  // 综合医院 (general_hospital)
  // ──────────────────────────────────────────────────────────
  {
    id: 'hyogo_medical',
    name: '兵库医科大学病院',
    nameJa: '兵庫医科大学病院',
    nameZhTw: '兵庫醫科大學病院',
    location: '兵库县西宫市',
    category: 'general_hospital',
    departments: [
      '内科', '消化内科', '呼吸内科', '循环内科', '心脏内科',
      '神经内科', '肾脏内科', '内分泌科', '血液内科',
      '外科', '消化外科', '心脏外科', '胸外科', '脑神经外科',
      '骨科', '整形外科', '泌尿外科',
      '妇产科', '小儿科',
      '皮肤科', '眼科', '耳鼻喉科',
      '放射科', '康复科', '麻醉科',
      '急救医疗科', '肿瘤科',
    ],
    specialties: [
      '机器人手术', '微创手术', '心脏搭桥', '冠脉介入',
      '脑卒中治疗', '癫痫手术', '肾移植',
      '消化道内镜', '腹腔镜手术',
      '癌症综合治疗', 'PET-CT诊断',
    ],
    conditionKeywords: [
      '心脏', '心血管', '冠心病', '心律失常', '心肌梗塞',
      '脑中风', '脑出血', '癫痫', '头痛', '头晕',
      '胃痛', '腹痛', '消化不良', '便血', '黄疸',
      '呼吸困难', '咳嗽', '肺炎',
      '骨折', '关节痛', '腰痛', '颈椎',
      '肾脏', '尿血', '排尿困难',
      '肿瘤', '癌症', '淋巴瘤',
      '贫血', '血小板', '白血病',
      '甲状腺', '糖尿病', '内分泌',
      '皮肤', '湿疹', '过敏',
      '眼睛', '视力', '白内障',
      '耳鸣', '听力', '鼻炎', '咽喉',
    ],
    features: [
      '特定機能病院（高度医療认定）',
      '963床位·41个诊疗科',
      '达芬奇机器人手术',
      '2026年新院区开业（801床）',
    ],
    suitableFor: '需要综合医院诊疗、手术、急救的患者',
    hasEmergency: true,
    hasRemoteConsultation: true,
    bedCount: 963,
    priority: 10,
  },
  {
    id: 'kindai_hospital',
    name: '近畿大学病院',
    nameJa: '近畿大学病院',
    nameZhTw: '近畿大學病院',
    location: '大阪府大阪狭山市',
    category: 'general_hospital',
    departments: [
      '内科', '消化内科', '呼吸内科', '循环内科',
      '神经内科', '肾脏内科', '内分泌科', '血液内科',
      '外科', '消化外科', '心脏外科', '脑神经外科',
      '骨科', '整形外科', '泌尿外科',
      '妇产科', '小儿科',
      '皮肤科', '眼科', '耳鼻喉科',
      '放射科', '康复科', '肿瘤科',
    ],
    specialties: [
      '机器人手术', '微创手术', '癌症综合治疗',
      '心脏外科', '脑外科',
      '消化道内镜', '腹腔镜手术',
    ],
    conditionKeywords: [
      '心脏', '心血管', '冠心病',
      '脑中风', '脑出血', '头痛',
      '胃痛', '腹痛', '消化不良', '便血',
      '呼吸困难', '咳嗽',
      '骨折', '关节痛', '腰痛',
      '肿瘤', '癌症',
      '糖尿病', '甲状腺',
      '皮肤', '眼睛', '耳鼻喉',
    ],
    features: [
      '特定機能病院（高度医療认定）',
      '800床位·35诊疗科·20专科中心',
      '达芬奇机器人手术',
      '与近畿大学医学部联合研究',
    ],
    suitableFor: '需要综合诊疗和大学医院水平治疗的患者',
    hasEmergency: true,
    hasRemoteConsultation: true,
    bedCount: 800,
    priority: 9,
  },
  {
    id: 'cancer_treatment',
    name: '大阪国际癌症中心',
    nameJa: '大阪国際がんセンター',
    nameZhTw: '大阪國際癌症中心',
    location: '大阪府大阪市',
    category: 'general_hospital',
    departments: [
      '肿瘤内科', '肿瘤外科', '放射线治疗科',
      '消化器外科', '呼吸器外科', '乳腺外科',
      '泌尿外科', '头颈外科', '妇科肿瘤科',
      '血液内科', '化疗科', '姑息医疗科',
    ],
    specialties: [
      '质子线治疗', '重粒子线治疗',
      '免疫检查点抑制剂', '靶向治疗', '基因组医疗',
      '达芬奇机器人手术', '微创癌症手术',
      'PET-CT诊断', '肿瘤分子诊断',
      '多学科联合会诊（MDT）',
    ],
    conditionKeywords: [
      '癌症', '肿瘤', '恶性', '良性肿瘤',
      '肺癌', '胃癌', '大肠癌', '肝癌', '胰腺癌',
      '乳腺癌', '子宫癌', '卵巢癌',
      '前列腺癌', '膀胱癌', '肾癌',
      '食道癌', '甲状腺癌', '淋巴瘤', '白血病',
      '头颈部癌', '脑肿瘤',
      '转移', '复发', '化疗', '放疗',
    ],
    features: [
      'Lancet 基准 5 年存活率数据',
      '质子线·重粒子线治疗',
      '基因组医疗·精准靶向',
      '多学科联合会诊（MDT）',
    ],
    suitableFor: '确诊或疑似癌症患者，寻求第二诊疗意见',
    hasEmergency: false,
    hasRemoteConsultation: true,
    bedCount: 500,
    priority: 10,
  },
  {
    id: 'osaka_himak',
    name: '大阪重粒子线中心',
    nameJa: '大阪重粒子線センター',
    nameZhTw: '大阪重粒子線中心',
    location: '大阪府大阪市',
    category: 'general_hospital',
    departments: [
      '放射线治疗科', '肿瘤科',
    ],
    specialties: [
      '重粒子线治疗（碳离子线）',
      '精准放射治疗',
      '难治性癌症放疗',
    ],
    conditionKeywords: [
      '癌症', '肿瘤', '重粒子', '放疗', '放射治疗',
      '前列腺癌', '肺癌', '肝癌', '胰腺癌',
      '骨软组织肿瘤', '头颈部癌',
      '手术不可', '复发癌症',
    ],
    features: [
      '日本先进重粒子线治疗设施',
      '碳离子线精准照射',
      '对手术不可的肿瘤有效',
    ],
    suitableFor: '需要重粒子线放疗的癌症患者',
    hasEmergency: false,
    hasRemoteConsultation: true,
    bedCount: 0,
    priority: 7,
  },
  {
    id: 'igtc',
    name: 'IGT 诊所（血管内治疗）',
    nameJa: 'IGTクリニック',
    nameZhTw: 'IGT診所',
    location: '大阪府泉佐野市（关西机场附近）',
    category: 'general_hospital',
    departments: [
      '肿瘤科', '介入放射科', '血管外科',
    ],
    specialties: [
      '动脉栓塞治疗（TACE）',
      '温热疗法（Hyperthermia）',
      '癌症免疫细胞治疗',
      '干细胞治疗',
      'CTC 循环肿瘤细胞检测',
    ],
    conditionKeywords: [
      '癌症', '肿瘤', '肝癌', '转移癌',
      '血管', '动脉', '栓塞',
      '免疫治疗', '免疫细胞',
      '干细胞', 'CTC',
    ],
    features: [
      '血管内介入治疗专科',
      '温热疗法设备',
      '关西机场附近交通便利',
      '免疫细胞+干细胞综合治疗',
    ],
    suitableFor: '需要血管介入治疗或癌症免疫/干细胞治疗的患者',
    hasEmergency: false,
    hasRemoteConsultation: true,
    bedCount: 0,
    priority: 6,
  },

  // ──────────────────────────────────────────────────────────
  // 体检中心 (health_screening)
  // ──────────────────────────────────────────────────────────
  {
    id: 'medical_packages',
    name: 'TIMC 精密健诊中心',
    nameJa: 'TIMC精密健診センター',
    nameZhTw: 'TIMC精密健診中心',
    location: '大阪府',
    category: 'health_screening',
    departments: [
      '健康诊断科', '消化内科', '循环内科',
      '放射科', '检验科',
    ],
    specialties: [
      'PET-CT 全身肿瘤筛查',
      'MRI/CT 影像诊断',
      '上下消化道内镜',
      '心脏超声', '颈动脉超声',
      '肿瘤标志物全套',
      'DWIBS 全身扩散加权成像',
    ],
    conditionKeywords: [
      '体检', '健康检查', '筛查', '预防',
      '肿瘤筛查', 'PET', 'CT', 'MRI',
      '胃镜', '肠镜', '内镜',
      '心电图', '超声',
      '血液检查', '肿瘤标志物',
    ],
    features: [
      'VIP 会员全套精密体检',
      'PET-CT + MRI + 内镜全覆盖',
      'DWIBS 无辐射癌症筛查',
      '一日完成所有检查',
    ],
    suitableFor: '需要全面精密体检或癌症早期筛查的健康人群',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 5,
  },

  // ──────────────────────────────────────────────────────────
  // 医美整形 (aesthetics)
  // ──────────────────────────────────────────────────────────
  {
    id: 'sai_clinic',
    name: 'SAI 整形外科诊所',
    nameJa: 'SAI美容外科クリニック',
    nameZhTw: 'SAI美容外科診所',
    location: '大阪府大阪市梅田',
    category: 'aesthetics',
    departments: [
      '整形外科', '美容皮肤科', '美容外科',
    ],
    specialties: [
      '糸リフト（线雕提升）',
      '双眼皮手术', '眼袋去除',
      '鼻整形（线雕+假体）',
      '玻尿酸注射', '肉毒素注射',
      '脂肪填充', '吸脂',
      '营养分析', '维生素C点滴',
    ],
    conditionKeywords: [
      '整形', '美容', '整容',
      '皱纹', '松弛', '下垂', '法令纹',
      '双眼皮', '眼袋', '眼睛',
      '鼻子', '隆鼻',
      '注射', '玻尿酸', '肉毒素', 'botox',
      '线雕', '提升', '紧致',
      '脂肪', '吸脂', '填充',
      '抗衰', '逆龄',
    ],
    features: [
      '糸リフト（线雕）专科',
      '30+ 种美容项目',
      '面部年轻化综合方案',
    ],
    suitableFor: '寻求面部年轻化、整形美容的患者',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 5,
  },
  {
    id: 'wclinic_mens',
    name: 'W Clinic 男性专科',
    nameJa: 'Wクリニック メンズ',
    nameZhTw: 'W Clinic 男性專科',
    location: '大阪府大阪市梅田',
    category: 'aesthetics',
    departments: [
      '男性科', '美容皮肤科', '泌尿外科',
    ],
    specialties: [
      'ED 治疗（勃起功能障碍）',
      'LOH 男性更年期综合征',
      'AGA 男性脱发治疗',
      '男性抗衰老', 'HIFU', '线雕',
      '外泌体点滴', 'NMN 点滴',
      '干细胞上清液点滴',
      'GLP-1 减重',
    ],
    conditionKeywords: [
      '男性', 'ED', '勃起', '阳痿',
      '脱发', '秃顶', 'AGA', '头发',
      '男性更年期', 'LOH', '睾酮',
      '抗衰', '逆龄', '男士美容',
      '减肥', '减重', 'GLP-1',
      '鼾症', '打鼾',
      '多汗', '腋臭',
    ],
    features: [
      '40年经验泌尿外科教授主诊',
      '男性健康综合方案',
      'AGA + 抗衰老 + ED 一站式',
      '大阪梅田交通便利',
    ],
    suitableFor: '男性健康问题（脱发、ED、更年期、抗衰）',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 5,
  },

  // ──────────────────────────────────────────────────────────
  // 干细胞/再生医疗 (stem_cell)
  // ──────────────────────────────────────────────────────────
  {
    id: 'helene_clinic',
    name: 'Helene 诊所（干细胞再生医疗）',
    nameJa: 'ヘレネクリニック',
    nameZhTw: 'Helene診所',
    location: '东京都表参道',
    category: 'stem_cell',
    departments: [
      '再生医疗科', '免疫细胞治疗科',
    ],
    specialties: [
      'MSC 间充质干细胞治疗（静脉/皮下）',
      '膝关节干细胞注射',
      '牙周组织干细胞注射',
      '脱发干细胞治疗',
      'NK 细胞治疗（癌症免疫）',
      '外泌体治疗',
      '血液净化疗法',
    ],
    conditionKeywords: [
      '干细胞', '再生医疗', '再生',
      '抗衰', '逆龄', '衰老',
      '关节', '膝盖', '关节炎',
      '牙周', '牙齿',
      '脱发', '头发',
      '免疫', 'NK细胞', '免疫细胞',
      '血液净化',
      '慢性疲劳', '亚健康',
    ],
    features: [
      '表参道高端干细胞诊所',
      'MSC 最高 22.5 亿细胞治疗',
      '6 位专科医师团队',
      'NK 细胞癌症免疫治疗',
    ],
    suitableFor: '寻求干细胞抗衰/关节修复/免疫增强的患者',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 7,
  },
  {
    id: 'ginza_phoenix',
    name: '银座 Phoenix 诊所（免疫细胞治疗）',
    nameJa: '銀座フェニックスクリニック',
    nameZhTw: '銀座Phoenix診所',
    location: '东京都千代田区秋叶原',
    category: 'stem_cell',
    departments: [
      '免疫细胞治疗科', '再生医疗科',
    ],
    specialties: [
      '免疫细胞治疗（癌症）',
      '再生医疗',
    ],
    conditionKeywords: [
      '癌症', '免疫治疗', '免疫细胞',
      '再生医疗', '干细胞',
    ],
    features: [
      '银座立地·免疫细胞治疗专科',
      '癌症辅助免疫治疗',
    ],
    suitableFor: '寻求癌症免疫细胞辅助治疗的患者',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 5,
  },
  {
    id: 'cell_medicine',
    name: 'Cell Medicine（先端细胞医疗）',
    nameJa: 'セルメディシン',
    nameZhTw: 'Cell Medicine',
    location: '日本',
    category: 'stem_cell',
    departments: [
      '免疫细胞治疗科', '再生医疗科',
    ],
    specialties: [
      '自家癌症疫苗',
      'iPS 细胞治疗',
      '再生医疗',
    ],
    conditionKeywords: [
      '癌症', '免疫', '疫苗', '癌症疫苗',
      'iPS', '再生', '干细胞',
    ],
    features: [
      '自家癌症疫苗研发',
      'iPS 细胞临床应用',
    ],
    suitableFor: '寻求癌症免疫疫苗或 iPS 细胞治疗的患者',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 5,
  },
  {
    id: 'ac_plus',
    name: 'AC Plus 细胞再生医疗',
    nameJa: 'ACプラス',
    nameZhTw: 'AC Plus 細胞再生醫療',
    location: '大阪府大阪市中央区',
    category: 'stem_cell',
    departments: [
      '再生医疗科',
    ],
    specialties: [
      '自体细胞治疗',
      '再生医疗',
    ],
    conditionKeywords: [
      '干细胞', '再生', '自体细胞',
      '抗衰', '逆龄',
    ],
    features: [
      '自体细胞再生医疗',
    ],
    suitableFor: '寻求自体细胞再生医疗的患者',
    hasEmergency: false,
    hasRemoteConsultation: false,
    bedCount: 0,
    priority: 4,
  },
];

// ============================================================
// 科室名称标准化映射
// AI 分诊输出可能使用不同的科室名称，这里做归一化
// ============================================================

export const DEPARTMENT_ALIASES: Record<string, string[]> = {
  '内科': ['内科', '综合内科', 'internal medicine', '一般内科'],
  '消化内科': ['消化内科', '胃肠科', '消化科', 'gastroenterology', '消化器内科'],
  '呼吸内科': ['呼吸内科', '呼吸科', '肺科', 'pulmonology', '呼吸器内科'],
  '循环内科': ['循环内科', '心脏内科', '心内科', '心血管内科', 'cardiology', '循環器内科'],
  '神经内科': ['神经内科', '脑神经内科', 'neurology', '神經内科'],
  '肾脏内科': ['肾脏内科', '肾内科', 'nephrology', '腎臓内科'],
  '内分泌科': ['内分泌科', '内分泌代谢科', '糖尿病科', 'endocrinology'],
  '血液内科': ['血液内科', '血液科', 'hematology'],
  '外科': ['外科', '一般外科', 'surgery', 'general surgery'],
  '消化外科': ['消化外科', '胃肠外科', '消化器外科', 'gastrointestinal surgery'],
  '心脏外科': ['心脏外科', '心外科', '心血管外科', 'cardiac surgery', '心臓外科'],
  '脑神经外科': ['脑神经外科', '脑外科', '神经外科', 'neurosurgery'],
  // 注意：日语「整形外科」= 骨科（orthopedics），不是美容整形
  '骨科': ['骨科', '骨外科', 'orthopedics', '整形外科（骨科）'],
  '泌尿外科': ['泌尿外科', '泌尿科', 'urology'],
  '妇产科': ['妇产科', '妇科', '产科', 'obstetrics', 'gynecology', 'OB/GYN'],
  '小儿科': ['小儿科', '儿科', 'pediatrics'],
  '皮肤科': ['皮肤科', 'dermatology'],
  '眼科': ['眼科', 'ophthalmology'],
  '耳鼻喉科': ['耳鼻喉科', '耳鼻科', 'ENT', 'otolaryngology'],
  '放射科': ['放射科', '放射线科', '影像科', 'radiology'],
  '肿瘤科': ['肿瘤科', '肿瘤内科', '肿瘤外科', 'oncology', '癌症科'],
  '放射线治疗科': ['放射线治疗科', '放疗科', '放射治疗科', 'radiation oncology'],
  '康复科': ['康复科', '康复医学科', 'rehabilitation'],
  '整形外科': ['整形外科', '整形外科（美容）', '美容外科', '整形美容科', 'plastic surgery', 'cosmetic surgery'],
  '美容皮肤科': ['美容皮肤科', '医学美肤', 'cosmetic dermatology'],
  '男性科': ['男性科', '男科', '男性健康', "men's health"],
  '再生医疗科': ['再生医疗科', '干细胞科', '再生医学', 'regenerative medicine'],
  '免疫细胞治疗科': ['免疫细胞治疗科', '免疫治疗科', 'immunotherapy'],
  '健康诊断科': ['健康诊断科', '体检科', '健诊科', 'health screening'],
  '介入放射科': ['介入放射科', '介入治疗科', 'interventional radiology'],
  '化疗科': ['化疗科', '化学疗法科', 'chemotherapy'],
  '姑息医疗科': ['姑息医疗科', '缓和医疗科', '安宁疗护', 'palliative care'],
  '检验科': ['检验科', '临床检验科', '检查科', 'laboratory medicine'],
  '妇科肿瘤科': ['妇科肿瘤科', '妇科癌症科', 'gynecologic oncology'],
};

// ============================================================
// 辅助函数
// ============================================================

/**
 * 标准化科室名称
 * 将 AI 输出的各种科室名称映射到标准名称
 */
export function normalizeDepartment(department: string): string {
  const lower = department.toLowerCase().trim();
  for (const [standard, aliases] of Object.entries(DEPARTMENT_ALIASES)) {
    if (aliases.some((alias) => alias.toLowerCase() === lower)) {
      return standard;
    }
  }
  return department.trim();
}

/**
 * 获取指定分类的所有医院
 */
export function getHospitalsByCategory(category: HospitalCategory): HospitalKnowledge[] {
  return HOSPITAL_KNOWLEDGE_BASE.filter((h) => h.category === category);
}
