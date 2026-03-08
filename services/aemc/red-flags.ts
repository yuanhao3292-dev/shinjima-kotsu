/**
 * 医疗红旗词典 (Medical Red Flag Lexicon)
 *
 * 硬编码的医学危险信号词典，用于安全闸门的第一道防线。
 * 这些规则不依赖任何 AI 模型，是纯确定性逻辑。
 *
 * 设计原则：
 * - 宁可多拦，不可漏判（高召回率优先）
 * - 多语言覆盖（中文简体/繁体/英文/日文）
 * - 按医学分类组织，便于审计和维护
 *
 * 警告：修改此文件前请确认医学准确性。
 */

// ============================================================
// 红旗规则定义
// ============================================================

export interface RedFlagRule {
  id: string;
  category: RedFlagCategory;
  name_cn: string;
  name_en: string;
  /** 匹配关键词（任一命中即触发），支持中/英/日 */
  keywords: string[];
  /** 组合触发条件：同时出现多个关键词中的至少 N 个才触发 */
  combo_trigger?: {
    keywords: string[];
    min_match: number;
  };
  /** 触发后的紧急等级 */
  severity: 'high' | 'emergency';
  /** 建议动作 */
  action: 'escalate_human' | 'emergency_notice';
  /** 医学说明（供审计日志） */
  rationale: string;
}

export type RedFlagCategory =
  | 'cardiovascular'
  | 'neurological'
  | 'gastrointestinal'
  | 'respiratory'
  | 'oncology'
  | 'systemic'
  | 'trauma'
  | 'high_risk_population';

// ============================================================
// 急症类红旗规则
// ============================================================

export const EMERGENCY_RED_FLAGS: RedFlagRule[] = [
  // --- 心血管急症 ---
  {
    id: 'CV-001',
    category: 'cardiovascular',
    name_cn: '疑似急性冠脉综合征',
    name_en: 'Suspected Acute Coronary Syndrome',
    keywords: [],
    combo_trigger: {
      keywords: [
        '胸痛', '胸闷', '心绞痛', '心口痛', '心脏痛',
        '胸部疼痛', '胸部不适', '心前区',
        '放射痛', '左臂痛', '左胳膊痛', '左肩痛', '下颌痛',
        '出汗', '冷汗', '大汗', '盗汗',
        'chest pain', 'chest tightness', 'angina',
        'radiating pain', 'left arm pain', 'jaw pain',
        'diaphoresis', 'cold sweat',
        '胸の痛み', '胸が苦しい', '狭心症', '冷や汗',
      ],
      min_match: 2,
    },
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '胸痛+放射痛/出汗组合高度提示 ACS，需立即急诊评估',
  },
  {
    id: 'CV-002',
    category: 'cardiovascular',
    name_cn: '疑似主动脉夹层',
    name_en: 'Suspected Aortic Dissection',
    keywords: [
      '撕裂样疼痛', '撕裂痛', '背部剧痛', '胸背痛',
      'tearing pain', 'ripping pain',
      '引き裂かれるような痛み',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '撕裂样胸背痛高度提示主动脉夹层，死亡率极高',
  },
  {
    id: 'CV-003',
    category: 'cardiovascular',
    name_cn: '心律失常/心悸伴晕厥',
    name_en: 'Arrhythmia with Syncope',
    keywords: [],
    combo_trigger: {
      keywords: [
        '心悸', '心跳快', '心跳不规律', '心律不齐',
        '晕厥', '昏倒', '失去意识', '眼前发黑',
        'palpitations', 'syncope', 'fainting', 'blackout',
        '動悸', '失神', '気を失う',
      ],
      min_match: 2,
    },
    // [AUDIT-FIX] severity 从 high 升级为 emergency：致命性心律失常可猝死
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '心悸伴晕厥可能提示致命性心律失常，有猝死风险',
  },

  // --- 神经系统急症 ---
  {
    id: 'NEURO-001',
    category: 'neurological',
    name_cn: '疑似脑卒中',
    name_en: 'Suspected Stroke',
    keywords: [
      '突发单侧无力', '一侧手脚无力', '半身不遂',
      '言语障碍', '说话不清', '口齿不清', '口角歪斜',
      '突然看不见', '视力突然下降', '视野缺损',
      'sudden weakness', 'one-sided weakness', 'hemiplegia',
      'slurred speech', 'aphasia', 'vision loss',
      '片麻痺', '構音障害', '失語', '突然の視力低下',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '单侧无力/言语障碍/视力异常是脑卒中典型表现，黄金治疗窗口极短',
  },
  {
    id: 'NEURO-002',
    category: 'neurological',
    name_cn: '癫痫/惊厥发作',
    name_en: 'Seizure/Convulsion',
    keywords: [
      '癫痫', '抽搐', '惊厥', '全身抽搐', '口吐白沫',
      '意识丧失', '意识模糊',
      'seizure', 'convulsion', 'epilepsy', 'loss of consciousness',
      'てんかん', '痙攣', '意識消失',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '癫痫发作需紧急处理，排除颅内病变',
  },
  {
    id: 'NEURO-003',
    category: 'neurological',
    name_cn: '剧烈头痛（雷击样）',
    name_en: 'Thunderclap Headache',
    keywords: [
      '雷击样头痛', '从未有过的剧烈头痛', '最严重的头痛',
      '突发剧烈头痛', '爆炸性头痛',
      'thunderclap headache', 'worst headache of my life',
      '今までにない激しい頭痛', '雷鳴頭痛',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '雷击样头痛需紧急排除蛛网膜下腔出血',
  },

  // --- 消化系统急症 ---
  {
    id: 'GI-001',
    category: 'gastrointestinal',
    name_cn: '消化道出血',
    name_en: 'GI Bleeding',
    keywords: [
      '呕血', '吐血', '黑便', '柏油便', '便血', '大量便血',
      '血便', '鲜血便',
      'hematemesis', 'vomiting blood', 'melena', 'hematochezia',
      'black stool', 'bloody stool',
      '吐血', '黒色便', 'タール便', '血便', '下血',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '消化道出血可导致失血性休克，需紧急处理',
  },
  {
    id: 'GI-002',
    category: 'gastrointestinal',
    name_cn: '急腹症',
    name_en: 'Acute Abdomen',
    keywords: [],
    combo_trigger: {
      keywords: [
        '剧烈腹痛', '腹部剧痛', '肚子剧痛', '腹痛难忍',
        '呕吐', '冷汗', '腹部硬', '板状腹',
        '反跳痛', '压痛',
        'severe abdominal pain', 'acute abdomen', 'rigid abdomen',
        '激しい腹痛', '板状硬', '反跳痛',
      ],
      min_match: 2,
    },
    // [AUDIT-FIX] severity 从 high 升级为 emergency：穿孔/梗阻延误可致死
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '急腹症可能提示穿孔/梗阻/阑尾炎等需紧急手术的情况',
  },

  // --- 呼吸系统急症 ---
  {
    id: 'RESP-001',
    category: 'respiratory',
    name_cn: '严重呼吸困难',
    name_en: 'Severe Dyspnea',
    keywords: [
      '呼吸困难', '喘不上气', '憋气', '窒息感',
      '紫绀', '嘴唇发紫', '指甲发紫',
      '血氧低', '氧饱和度低',
      'dyspnea', 'shortness of breath', 'cyanosis',
      'cannot breathe', 'suffocating',
      '呼吸困難', '息苦しい', 'チアノーゼ',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '严重呼吸困难/紫绀提示危及生命的呼吸衰竭',
  },
  {
    id: 'RESP-002',
    category: 'respiratory',
    name_cn: '疑似肺栓塞',
    name_en: 'Suspected Pulmonary Embolism',
    keywords: [],
    combo_trigger: {
      keywords: [
        '呼吸困难', '胸痛', '咯血', '咳血',
        '下肢肿胀', '小腿肿', '腿肿',
        '长途飞行', '久坐', '术后',
        'hemoptysis', 'coughing blood', 'leg swelling',
        'DVT', 'pulmonary embolism',
        '喀血', '下肢浮腫', '肺塞栓',
      ],
      min_match: 2,
    },
    // [AUDIT-FIX] severity 从 high 升级为 emergency：PE 可在数小时内致死
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '呼吸困难+胸痛+咯血/下肢肿胀组合需排除 PE，肺栓塞可迅速致命',
  },

  // --- 全身性急症 ---
  {
    id: 'SYS-001',
    category: 'systemic',
    name_cn: '高热伴意识异常',
    name_en: 'High Fever with Altered Consciousness',
    keywords: [],
    combo_trigger: {
      keywords: [
        '高热', '高烧', '39度', '40度', '持续发热',
        '意识模糊', '神志不清', '嗜睡', '叫不醒', '胡言乱语',
        '寒战', '全身发抖',
        'high fever', 'altered mental status', 'confusion', 'delirious',
        '高熱', '意識障害', '意識混濁',
      ],
      min_match: 2,
    },
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '高热伴意识改变可能提示严重感染/脑膜炎/败血症',
  },
  {
    id: 'SYS-002',
    category: 'systemic',
    name_cn: '过敏性休克征兆',
    name_en: 'Anaphylaxis Signs',
    keywords: [
      '过敏性休克', '全身荨麻疹', '喉头水肿', '呼吸急促',
      '血压骤降', '嘴唇肿', '舌头肿',
      'anaphylaxis', 'anaphylactic shock', 'throat swelling',
      'アナフィラキシー', '喉頭浮腫',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '过敏性休克可在数分钟内致命',
  },

  // --- [AUDIT-FIX] 以下为审计补充的缺失危险规则 ---

  // --- 败血症 ---
  {
    id: 'SYS-003',
    category: 'systemic',
    name_cn: '疑似败血症/脓毒症',
    name_en: 'Suspected Sepsis',
    keywords: [
      '败血症', '脓毒症', '感染性休克', '全身感染',
      'sepsis', 'septic shock', 'septicemia',
      '敗血症', '感染性ショック',
    ],
    combo_trigger: {
      keywords: [
        '高热', '高烧', '发烧', '寒战',
        '心跳快', '心率快', '呼吸急促',
        '血压低', '低血压', '头晕', '乏力',
        '伤口感染', '术后感染',
        'high fever', 'tachycardia', 'hypotension',
        '高熱', '頻脈', '低血圧',
      ],
      min_match: 3,
    },
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '败血症每延误1小时死亡率增加约7.6%，需紧急处理',
  },

  // --- 糖尿病急症 ---
  {
    id: 'SYS-004',
    category: 'systemic',
    name_cn: '糖尿病急症（DKA/低血糖）',
    name_en: 'Diabetic Emergency (DKA/Hypoglycemia)',
    keywords: [
      '糖尿病酮症酸中毒', '酮症酸中毒', 'DKA',
      '严重低血糖', '低血糖昏迷', '血糖过低',
      'diabetic ketoacidosis', 'severe hypoglycemia', 'hypoglycemic coma',
      '糖尿病性ケトアシドーシス', '低血糖昏睡',
    ],
    combo_trigger: {
      keywords: [
        '糖尿病', '血糖高', '血糖低',
        '口渴', '多尿', '恶心', '呕吐',
        '意识模糊', '嗜睡', '呼吸深快',
        'diabetes', 'high blood sugar', 'low blood sugar',
        'nausea', 'vomiting', 'drowsy',
        '糖尿病', '口渇', '多尿', '嘔吐',
      ],
      min_match: 3,
    },
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: 'DKA和严重低血糖可导致昏迷和死亡，需紧急干预',
  },

  // --- 药物中毒/过量 ---
  {
    id: 'SYS-005',
    category: 'systemic',
    name_cn: '药物过量/中毒',
    name_en: 'Drug Overdose / Poisoning',
    keywords: [
      '药物过量', '服药过量', '吃了很多药', '中毒',
      '农药', '杀虫剂', '安眠药过量', '吞药',
      'overdose', 'poisoning', 'drug overdose', 'OD',
      'took too many pills', 'ingestion',
      '薬物過量', '中毒', '農薬', '服毒',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '药物过量/中毒需紧急洗胃和解毒治疗',
  },

  // --- 自杀/自伤风险 ---
  {
    id: 'SYS-006',
    category: 'systemic',
    name_cn: '自杀/自伤风险',
    name_en: 'Suicide / Self-Harm Risk',
    keywords: [
      '想死', '不想活', '自杀', '自残', '割腕',
      '跳楼', '结束生命', '活着没意思', '了无生趣',
      'suicidal', 'suicide', 'self-harm', 'want to die',
      'end my life', 'kill myself', 'end it all',
      'no reason to live', "don't want to live",
      '死にたい', '自殺', '自傷', 'リストカット',
      '生きていたくない', '生きる意味がない',
    ],
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '自杀/自伤倾向需立即心理危机干预和紧急保护',
  },

  // --- 脑膜炎 ---
  {
    id: 'NEURO-004',
    category: 'neurological',
    name_cn: '疑似脑膜炎',
    name_en: 'Suspected Meningitis',
    // [AUDIT-ADV-1] 添加疾病名称直接关键词，用户明确说 "脑膜炎" 应立即触发
    keywords: [
      '脑膜炎', '脑炎', '脑脊膜炎',
      'meningitis', 'encephalitis',
      '髄膜炎', '脳膜炎', '脳炎',
    ],
    combo_trigger: {
      keywords: [
        '头痛', '发热', '发烧', '颈部僵硬', '脖子硬',
        '畏光', '呕吐', '皮疹',
        'headache', 'fever', 'neck stiffness', 'photophobia',
        '頭痛', '発熱', '項部硬直', '羞明',
      ],
      min_match: 3,
    },
    severity: 'emergency',
    action: 'emergency_notice',
    rationale: '头痛+发热+颈部僵硬三联征高度提示脑膜炎，需紧急抗生素治疗',
  },
];

// ============================================================
// 肿瘤类红旗规则
// ============================================================

export const ONCOLOGY_RED_FLAGS: RedFlagRule[] = [
  {
    id: 'ONC-001',
    category: 'oncology',
    name_cn: '不明原因体重骤降',
    name_en: 'Unexplained Weight Loss',
    keywords: [
      '体重骤降', '体重明显下降', '消瘦', '暴瘦',
      '不明原因消瘦', '半年瘦了',
      'unexplained weight loss', 'unintentional weight loss',
      '原因不明の体重減少', '急激な体重減少',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '不明原因体重下降是多种恶性肿瘤的预警信号',
  },
  {
    id: 'ONC-002',
    category: 'oncology',
    name_cn: '肿块进行性增大',
    name_en: 'Progressive Mass Growth',
    keywords: [
      '肿块增大', '包块增大', '肿瘤增大', '结节增大',
      '淋巴结肿大', '颈部肿块', '腋下肿块', '乳房肿块',
      'growing mass', 'enlarging lump', 'lymphadenopathy',
      '腫瘤増大', 'リンパ節腫大', 'しこり',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '进行性增大的肿块需排除恶性可能',
  },
  {
    id: 'ONC-003',
    category: 'oncology',
    name_cn: '影像/病理提示恶性',
    name_en: 'Imaging/Pathology Malignancy Indication',
    keywords: [
      '恶性', '癌症', '肿瘤', '转移', '浸润', '占位',
      '病理阳性', '癌细胞', '恶性肿瘤',
      'malignant', 'malignancy', 'cancer', 'metastasis', 'carcinoma',
      'tumor', 'neoplasm', 'invasion',
      '悪性', '癌', '転移', '浸潤', '腫瘍',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '明确的恶性相关描述需人工医疗顾问介入',
  },
  {
    id: 'ONC-004',
    category: 'oncology',
    name_cn: '持续异常出血',
    name_en: 'Persistent Abnormal Bleeding',
    keywords: [],
    combo_trigger: {
      keywords: [
        '持续出血', '反复出血', '不规则出血',
        '绝经后出血', '血尿', '尿血',
        '咯血', '咳血', '痰中带血',
        'persistent bleeding', 'recurrent bleeding',
        'postmenopausal bleeding', 'hematuria',
        '持続出血', '不正出血', '血尿', '喀血',
      ],
      min_match: 1,
    },
    severity: 'high',
    action: 'escalate_human',
    rationale: '持续异常出血需排除恶性病变',
  },
];

// ============================================================
// 高危人群规则
// ============================================================

export const HIGH_RISK_POPULATION_FLAGS: RedFlagRule[] = [
  {
    id: 'POP-001',
    category: 'high_risk_population',
    name_cn: '儿童患者',
    name_en: 'Pediatric Patient',
    keywords: [
      '儿童', '小孩', '孩子', '婴儿', '幼儿', '未成年',
      'child', 'pediatric', 'infant', 'baby', 'toddler',
      '小児', '子供', '幼児', '乳児',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '儿科病例需专业儿科评估，AI 分诊可能不适用',
  },
  {
    id: 'POP-002',
    category: 'high_risk_population',
    name_cn: '孕妇',
    name_en: 'Pregnant Patient',
    keywords: [
      '怀孕', '孕妇', '妊娠', '孕期', '预产期',
      '胎动', '胎儿',
      'pregnant', 'pregnancy', 'prenatal', 'expecting',
      '妊娠', '妊婦', '胎動', '予定日',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '孕期病例涉及母婴安全，需人工评估',
  },
  {
    id: 'POP-003',
    category: 'high_risk_population',
    name_cn: '肿瘤术后/化疗中',
    name_en: 'Post-Cancer Surgery / On Chemotherapy',
    keywords: [
      '化疗', '放疗', '靶向治疗', '免疫治疗',
      '术后', '癌症术后', '肿瘤术后',
      'chemotherapy', 'radiation therapy', 'targeted therapy',
      'post-surgery', 'post-operative',
      '化学療法', '放射線治療', '術後',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '肿瘤治疗中的患者病情复杂，需人工医疗顾问评估',
  },
  {
    id: 'POP-004',
    category: 'high_risk_population',
    name_cn: '器官移植后',
    name_en: 'Post Organ Transplant',
    keywords: [
      '器官移植', '肝移植', '肾移植', '心脏移植',
      '抗排异', '免疫抑制',
      'organ transplant', 'transplant recipient', 'immunosuppression',
      '臓器移植', '免疫抑制',
    ],
    severity: 'high',
    action: 'escalate_human',
    rationale: '移植后患者免疫抑制状态，感染和排异风险高',
  },
  {
    id: 'POP-005',
    category: 'high_risk_population',
    name_cn: '严重基础病',
    name_en: 'Severe Comorbidities',
    keywords: [],
    combo_trigger: {
      keywords: [
        '透析', '血液透析', '肾衰竭', '肝硬化', '肝衰竭',
        '心力衰竭', '心衰', '呼吸衰竭',
        'dialysis', 'renal failure', 'liver cirrhosis', 'heart failure',
        '透析', '腎不全', '肝硬変', '心不全',
      ],
      min_match: 1,
    },
    severity: 'high',
    action: 'escalate_human',
    rationale: '严重基础病患者的病情评估需专业人工判断',
  },
];

// ============================================================
// 合并导出所有红旗规则
// ============================================================

export const ALL_RED_FLAG_RULES: RedFlagRule[] = [
  ...EMERGENCY_RED_FLAGS,
  ...ONCOLOGY_RED_FLAGS,
  ...HIGH_RISK_POPULATION_FLAGS,
];

/**
 * 获取所有红旗规则的 ID 列表（用于审计日志）
 */
export function getRedFlagRuleIds(): string[] {
  return ALL_RED_FLAG_RULES.map((r) => r.id);
}

/**
 * 根据 ID 查找红旗规则
 */
export function getRedFlagRuleById(id: string): RedFlagRule | undefined {
  return ALL_RED_FLAG_RULES.find((r) => r.id === id);
}
