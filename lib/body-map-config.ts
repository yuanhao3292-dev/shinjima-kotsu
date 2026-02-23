/**
 * 人体图交互配置 - 科室分类系统
 * 参考 Ubie (日本) 的人体图交互设计
 */

// 身体部位定义
export interface BodyPart {
  id: string;
  name: string;
  nameEn: string;
  // SVG 路径坐标 (相对于 viewBox)
  path: string;
  // 关联的医疗科室
  departments: string[];
  // 关联的症状问题 ID
  symptomQuestionIds: number[];
  // 常见症状列表
  commonSymptoms: string[];
}

// 医疗科室定义
export interface MedicalDepartment {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  // 推荐检查项目
  recommendedTests: string[];
  // 关联的身体部位
  bodyParts: string[];
}

// 症状定义
export interface Symptom {
  id: string;
  bodyPartId: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  // 追问问题
  followUpQuestions: FollowUpQuestion[];
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi' | 'input';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// ==================== 身体部位配置 ====================
export const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    name: '头部',
    nameEn: 'Head',
    path: 'M150,20 C180,20 200,45 200,80 C200,115 180,140 150,140 C120,140 100,115 100,80 C100,45 120,20 150,20',
    departments: ['neurology', 'ophthalmology', 'ent'],
    symptomQuestionIds: [12],
    commonSymptoms: ['头痛', '头晕', '视力变化', '记忆力下降', '耳鸣'],
  },
  {
    id: 'neck',
    name: '颈部',
    nameEn: 'Neck',
    path: 'M130,140 L170,140 L175,180 L125,180 Z',
    departments: ['ent', 'endocrine'],
    symptomQuestionIds: [],
    commonSymptoms: ['颈部肿块', '吞咽困难', '甲状腺肿大'],
  },
  {
    id: 'chest',
    name: '胸部',
    nameEn: 'Chest',
    path: 'M90,180 L210,180 L220,300 L80,300 Z',
    departments: ['cardiology', 'pulmonology'],
    symptomQuestionIds: [11],
    commonSymptoms: ['胸闷', '心悸', '呼吸困难', '长期咳嗽'],
  },
  {
    id: 'abdomen',
    name: '腹部',
    nameEn: 'Abdomen',
    path: 'M80,300 L220,300 L225,420 L75,420 Z',
    departments: ['gastroenterology', 'hepatology'],
    symptomQuestionIds: [10],
    commonSymptoms: ['胃痛', '胃胀', '反酸', '便秘', '腹泻', '便血'],
  },
  {
    id: 'pelvis',
    name: '骨盆/下腹',
    nameEn: 'Pelvis',
    path: 'M75,420 L225,420 L230,480 L70,480 Z',
    departments: ['urology', 'gynecology'],
    symptomQuestionIds: [13],
    commonSymptoms: ['频尿', '尿痛', '血尿', '下腹痛'],
  },
  {
    id: 'left-arm',
    name: '左臂',
    nameEn: 'Left Arm',
    path: 'M50,180 L90,180 L85,200 L70,350 L40,350 L55,200 Z',
    departments: ['orthopedics', 'dermatology'],
    symptomQuestionIds: [],
    commonSymptoms: ['手臂疼痛', '麻木', '无力'],
  },
  {
    id: 'right-arm',
    name: '右臂',
    nameEn: 'Right Arm',
    path: 'M210,180 L250,180 L245,200 L260,350 L230,350 L215,200 Z',
    departments: ['orthopedics', 'dermatology'],
    symptomQuestionIds: [],
    commonSymptoms: ['手臂疼痛', '麻木', '无力'],
  },
  {
    id: 'left-leg',
    name: '左腿',
    nameEn: 'Left Leg',
    path: 'M70,480 L140,480 L135,700 L65,700 Z',
    departments: ['orthopedics', 'vascular'],
    symptomQuestionIds: [],
    commonSymptoms: ['腿痛', '肿胀', '静脉曲张', '行走困难'],
  },
  {
    id: 'right-leg',
    name: '右腿',
    nameEn: 'Right Leg',
    path: 'M160,480 L230,480 L235,700 L165,700 Z',
    departments: ['orthopedics', 'vascular'],
    symptomQuestionIds: [],
    commonSymptoms: ['腿痛', '肿胀', '静脉曲张', '行走困难'],
  },
  {
    id: 'back',
    name: '背部',
    nameEn: 'Back',
    path: '', // 背面图单独处理
    departments: ['orthopedics', 'neurology'],
    symptomQuestionIds: [],
    commonSymptoms: ['腰痛', '背痛', '脊椎问题'],
  },
];

// ==================== 医疗科室配置 ====================
export const MEDICAL_DEPARTMENTS: MedicalDepartment[] = [
  {
    id: 'neurology',
    name: '神经内科',
    nameEn: 'Neurology',
    icon: '🧠',
    description: '脑部、神经系统相关疾病',
    recommendedTests: ['脑部 MRI', '脑部 MRA', '脑电图 EEG'],
    bodyParts: ['head'],
  },
  {
    id: 'cardiology',
    name: '心脏内科',
    nameEn: 'Cardiology',
    icon: '❤️',
    description: '心脏、血管循环系统',
    recommendedTests: ['心脏超音波', '心电图', '冠脉钙化 CT', '心脏 MRI'],
    bodyParts: ['chest'],
  },
  {
    id: 'pulmonology',
    name: '呼吸内科',
    nameEn: 'Pulmonology',
    icon: '🫁',
    description: '肺部、呼吸道疾病',
    recommendedTests: ['胸部 CT', '肺功能检查', '支气管镜'],
    bodyParts: ['chest'],
  },
  {
    id: 'gastroenterology',
    name: '消化内科',
    nameEn: 'Gastroenterology',
    icon: '🍽️',
    description: '胃肠道消化系统',
    recommendedTests: ['胃镜', '大肠镜', '腹部超音波', '幽门螺旋杆菌检测'],
    bodyParts: ['abdomen'],
  },
  {
    id: 'hepatology',
    name: '肝胆科',
    nameEn: 'Hepatology',
    icon: '🫀',
    description: '肝脏、胆囊、胰脏',
    recommendedTests: ['腹部超音波', '肝功能检查', 'B/C 型肝炎筛查', 'MRI'],
    bodyParts: ['abdomen'],
  },
  {
    id: 'urology',
    name: '泌尿科',
    nameEn: 'Urology',
    icon: '💧',
    description: '泌尿系统、肾脏',
    recommendedTests: ['尿液分析', '肾脏超音波', 'PSA 检测', '膀胱镜'],
    bodyParts: ['pelvis'],
  },
  {
    id: 'gynecology',
    name: '妇科',
    nameEn: 'Gynecology',
    icon: '🌸',
    description: '女性生殖系统',
    recommendedTests: ['子宫颈抹片', '妇科超音波', '乳房超音波', 'HPV 检测'],
    bodyParts: ['pelvis', 'chest'],
  },
  {
    id: 'orthopedics',
    name: '骨科',
    nameEn: 'Orthopedics',
    icon: '🦴',
    description: '骨骼、关节、肌肉',
    recommendedTests: ['X 光检查', '骨密度检测', 'MRI', '关节超音波'],
    bodyParts: ['back', 'left-arm', 'right-arm', 'left-leg', 'right-leg'],
  },
  {
    id: 'endocrine',
    name: '内分泌科',
    nameEn: 'Endocrinology',
    icon: '⚗️',
    description: '荷尔蒙、甲状腺、糖尿病',
    recommendedTests: ['甲状腺超音波', '甲状腺功能检查', '血糖检测', 'HbA1c'],
    bodyParts: ['neck'],
  },
  {
    id: 'ophthalmology',
    name: '眼科',
    nameEn: 'Ophthalmology',
    icon: '👁️',
    description: '眼睛视力相关',
    recommendedTests: ['视力检查', '眼压检测', '眼底摄影', 'OCT 检查'],
    bodyParts: ['head'],
  },
  {
    id: 'ent',
    name: '耳鼻喉科',
    nameEn: 'ENT',
    icon: '👂',
    description: '耳朵、鼻子、喉咙',
    recommendedTests: ['听力检查', '鼻内视镜', '喉部内视镜'],
    bodyParts: ['head', 'neck'],
  },
  {
    id: 'dermatology',
    name: '皮肤科',
    nameEn: 'Dermatology',
    icon: '🧴',
    description: '皮肤、毛发、指甲',
    recommendedTests: ['皮肤镜检查', '皮肤切片', '过敏原检测'],
    bodyParts: ['left-arm', 'right-arm'],
  },
  {
    id: 'vascular',
    name: '血管外科',
    nameEn: 'Vascular Surgery',
    icon: '🩸',
    description: '动静脉血管疾病',
    recommendedTests: ['下肢血管超音波', 'ABI/CAVI 检测', '血管摄影'],
    bodyParts: ['left-leg', 'right-leg'],
  },
  {
    id: 'mental',
    name: '身心科',
    nameEn: 'Psychiatry',
    icon: '🧘',
    description: '心理健康、压力、睡眠',
    recommendedTests: ['心理评估', '睡眠检测', '压力指数评估'],
    bodyParts: ['head'],
  },
];

// ==================== 部位症状详细配置 ====================
export const BODY_PART_SYMPTOMS: Record<string, Symptom[]> = {
  head: [
    {
      id: 'headache',
      bodyPartId: 'head',
      name: '经常头痛',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'headache-type',
          question: '您的头痛类型？',
          type: 'single',
          options: [
            { value: 'tension', label: '紧绷型（两侧压迫感）' },
            { value: 'migraine', label: '偏头痛（单侧搏动性）' },
            { value: 'cluster', label: '丛发性（眼眶周围剧痛）' },
            { value: 'other', label: '其他类型' },
          ],
        },
        {
          id: 'headache-freq',
          question: '头痛发作频率？',
          type: 'single',
          options: [
            { value: 'rare', label: '偶尔（每月1-2次）' },
            { value: 'weekly', label: '每周数次' },
            { value: 'daily', label: '几乎每天' },
          ],
        },
      ],
    },
    {
      id: 'dizziness',
      bodyPartId: 'head',
      name: '头晕',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'dizziness-type',
          question: '头晕的感觉？',
          type: 'single',
          options: [
            { value: 'spinning', label: '天旋地转' },
            { value: 'lightheaded', label: '头重脚轻' },
            { value: 'unsteady', label: '站不稳' },
          ],
        },
      ],
    },
    {
      id: 'vision-change',
      bodyPartId: 'head',
      name: '视力变化',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'vision-type',
          question: '视力变化情况？',
          type: 'multi',
          options: [
            { value: 'blurry', label: '视力模糊' },
            { value: 'double', label: '看东西重影' },
            { value: 'floaters', label: '飞蚊症' },
            { value: 'flash', label: '闪光感' },
            { value: 'blind-spot', label: '视野缺损' },
          ],
        },
      ],
    },
    {
      id: 'memory-decline',
      bodyPartId: 'head',
      name: '记忆力下降',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'memory-duration',
          question: '记忆力下降持续多久？',
          type: 'single',
          options: [
            { value: 'recent', label: '最近几周' },
            { value: 'months', label: '几个月' },
            { value: 'year', label: '一年以上' },
          ],
        },
      ],
    },
  ],
  chest: [
    {
      id: 'chest-tightness',
      bodyPartId: 'chest',
      name: '胸闷',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'chest-trigger',
          question: '胸闷发作时机？',
          type: 'multi',
          options: [
            { value: 'rest', label: '休息时' },
            { value: 'exercise', label: '运动时' },
            { value: 'stress', label: '紧张时' },
            { value: 'eating', label: '饭后' },
          ],
        },
        {
          id: 'chest-duration',
          question: '每次持续多久？',
          type: 'single',
          options: [
            { value: 'seconds', label: '几秒钟' },
            { value: 'minutes', label: '几分钟' },
            { value: 'hours', label: '数小时' },
          ],
        },
      ],
    },
    {
      id: 'palpitation',
      bodyPartId: 'chest',
      name: '心悸',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'palpitation-type',
          question: '心悸的感觉？',
          type: 'multi',
          options: [
            { value: 'fast', label: '心跳加速' },
            { value: 'skip', label: '心跳漏拍' },
            { value: 'pound', label: '心脏狂跳' },
            { value: 'irregular', label: '心跳不规则' },
          ],
        },
      ],
    },
    {
      id: 'breathing-difficulty',
      bodyPartId: 'chest',
      name: '呼吸困难',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'breathing-when',
          question: '什么情况下呼吸困难？',
          type: 'multi',
          options: [
            { value: 'climbing', label: '爬楼梯时' },
            { value: 'lying', label: '平躺时' },
            { value: 'rest', label: '静息时' },
            { value: 'night', label: '夜间睡眠中' },
          ],
        },
      ],
    },
    {
      id: 'chronic-cough',
      bodyPartId: 'chest',
      name: '长期咳嗽',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'cough-duration',
          question: '咳嗽持续多久？',
          type: 'single',
          options: [
            { value: 'weeks', label: '2-4周' },
            { value: 'months', label: '1-3个月' },
            { value: 'long', label: '3个月以上' },
          ],
        },
        {
          id: 'cough-type',
          question: '咳嗽特征？',
          type: 'multi',
          options: [
            { value: 'dry', label: '干咳' },
            { value: 'phlegm', label: '有痰' },
            { value: 'blood', label: '带血丝' },
            { value: 'night', label: '夜间加重' },
          ],
        },
      ],
    },
  ],
  abdomen: [
    {
      id: 'stomach-pain',
      bodyPartId: 'abdomen',
      name: '胃痛',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'stomach-location',
          question: '疼痛位置？',
          type: 'single',
          options: [
            { value: 'upper', label: '上腹部' },
            { value: 'middle', label: '中腹部' },
            { value: 'lower', label: '下腹部' },
            { value: 'all', label: '整个腹部' },
          ],
        },
        {
          id: 'stomach-timing',
          question: '疼痛发作时机？',
          type: 'multi',
          options: [
            { value: 'empty', label: '空腹时' },
            { value: 'after-meal', label: '饭后' },
            { value: 'night', label: '夜间' },
            { value: 'random', label: '无规律' },
          ],
        },
      ],
    },
    {
      id: 'bloating',
      bodyPartId: 'abdomen',
      name: '胃胀',
      severity: 'low',
      followUpQuestions: [
        {
          id: 'bloating-freq',
          question: '胀气频率？',
          type: 'single',
          options: [
            { value: 'occasional', label: '偶尔' },
            { value: 'often', label: '经常' },
            { value: 'always', label: '几乎每餐后' },
          ],
        },
      ],
    },
    {
      id: 'reflux',
      bodyPartId: 'abdomen',
      name: '反酸/烧心',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'reflux-freq',
          question: '反酸频率？',
          type: 'single',
          options: [
            { value: 'rare', label: '每月几次' },
            { value: 'weekly', label: '每周几次' },
            { value: 'daily', label: '每天' },
          ],
        },
      ],
    },
    {
      id: 'bowel-changes',
      bodyPartId: 'abdomen',
      name: '排便异常',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'bowel-type',
          question: '排便问题类型？',
          type: 'multi',
          options: [
            { value: 'constipation', label: '便秘' },
            { value: 'diarrhea', label: '腹泻' },
            { value: 'alternate', label: '便秘腹泻交替' },
            { value: 'blood', label: '便血' },
            { value: 'mucus', label: '黏液便' },
          ],
        },
      ],
    },
  ],
  pelvis: [
    {
      id: 'frequent-urination',
      bodyPartId: 'pelvis',
      name: '频尿',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'urination-freq',
          question: '每天排尿次数？',
          type: 'single',
          options: [
            { value: 'normal', label: '4-8次' },
            { value: 'moderate', label: '8-12次' },
            { value: 'severe', label: '12次以上' },
          ],
        },
        {
          id: 'nocturia',
          question: '夜间起床排尿次数？',
          type: 'single',
          options: [
            { value: '0', label: '0次' },
            { value: '1-2', label: '1-2次' },
            { value: '3+', label: '3次以上' },
          ],
        },
      ],
    },
    {
      id: 'painful-urination',
      bodyPartId: 'pelvis',
      name: '尿痛',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'pain-timing',
          question: '疼痛时机？',
          type: 'single',
          options: [
            { value: 'start', label: '排尿开始时' },
            { value: 'during', label: '排尿过程中' },
            { value: 'end', label: '排尿结束时' },
            { value: 'always', label: '整个过程' },
          ],
        },
      ],
    },
    {
      id: 'blood-urine',
      bodyPartId: 'pelvis',
      name: '血尿',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'blood-visible',
          question: '血尿情况？',
          type: 'single',
          options: [
            { value: 'visible', label: '肉眼可见' },
            { value: 'microscopic', label: '体检发现（潜血）' },
          ],
        },
      ],
    },
    {
      id: 'lower-abdomen-pain',
      bodyPartId: 'pelvis',
      name: '下腹痛',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'pain-side',
          question: '疼痛位置？',
          type: 'single',
          options: [
            { value: 'center', label: '正中间' },
            { value: 'left', label: '左侧' },
            { value: 'right', label: '右侧' },
            { value: 'both', label: '两侧' },
          ],
        },
      ],
    },
  ],
  neck: [
    {
      id: 'neck-lump',
      bodyPartId: 'neck',
      name: '颈部肿块',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'lump-duration',
          question: '发现多久了？',
          type: 'single',
          options: [
            { value: 'recent', label: '最近发现' },
            { value: 'weeks', label: '几周' },
            { value: 'months', label: '几个月' },
          ],
        },
        {
          id: 'lump-growing',
          question: '肿块有变大吗？',
          type: 'single',
          options: [
            { value: 'no', label: '没有变化' },
            { value: 'slow', label: '缓慢增大' },
            { value: 'fast', label: '快速增大' },
          ],
        },
      ],
    },
    {
      id: 'swallowing-difficulty',
      bodyPartId: 'neck',
      name: '吞咽困难',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'swallow-type',
          question: '吞咽困难类型？',
          type: 'multi',
          options: [
            { value: 'solid', label: '固体食物' },
            { value: 'liquid', label: '液体' },
            { value: 'both', label: '都有困难' },
            { value: 'pain', label: '伴随疼痛' },
          ],
        },
      ],
    },
  ],
};

// ==================== 通用症状（不限部位） ====================
export const GENERAL_SYMPTOMS: Symptom[] = [
  {
    id: 'weight-loss',
    bodyPartId: 'general',
    name: '不明原因体重下降',
    severity: 'high',
    followUpQuestions: [
      {
        id: 'weight-amount',
        question: '体重下降幅度？',
        type: 'single',
        options: [
          { value: '3-5kg', label: '3-5公斤' },
          { value: '5-10kg', label: '5-10公斤' },
          { value: '10kg+', label: '10公斤以上' },
        ],
      },
      {
        id: 'weight-duration',
        question: '多长时间内下降的？',
        type: 'single',
        options: [
          { value: '1month', label: '1个月内' },
          { value: '3months', label: '3个月内' },
          { value: '6months', label: '6个月内' },
        ],
      },
    ],
  },
  {
    id: 'fatigue',
    bodyPartId: 'general',
    name: '持续疲劳',
    severity: 'medium',
    followUpQuestions: [
      {
        id: 'fatigue-level',
        question: '疲劳程度？',
        type: 'single',
        options: [
          { value: 'mild', label: '轻度（可正常工作）' },
          { value: 'moderate', label: '中度（影响工作效率）' },
          { value: 'severe', label: '重度（无法正常工作）' },
        ],
      },
      {
        id: 'fatigue-duration',
        question: '持续多久？',
        type: 'single',
        options: [
          { value: 'weeks', label: '几周' },
          { value: 'months', label: '几个月' },
          { value: 'long', label: '半年以上' },
        ],
      },
    ],
  },
  {
    id: 'night-sweats',
    bodyPartId: 'general',
    name: '夜间盗汗',
    severity: 'medium',
    followUpQuestions: [
      {
        id: 'sweats-freq',
        question: '盗汗频率？',
        type: 'single',
        options: [
          { value: 'occasional', label: '偶尔' },
          { value: 'weekly', label: '每周几次' },
          { value: 'nightly', label: '几乎每晚' },
        ],
      },
    ],
  },
  {
    id: 'fever',
    bodyPartId: 'general',
    name: '反复发烧',
    severity: 'high',
    followUpQuestions: [
      {
        id: 'fever-pattern',
        question: '发烧规律？',
        type: 'single',
        options: [
          { value: 'continuous', label: '持续发烧' },
          { value: 'intermittent', label: '间歇性发烧' },
          { value: 'periodic', label: '周期性发烧' },
        ],
      },
    ],
  },
];

// ==================== 工具函数 ====================

// 根据部位 ID 获取部位信息
export function getBodyPartById(id: string): BodyPart | undefined {
  return BODY_PARTS.find((part) => part.id === id);
}

// 根据部位获取相关科室
export function getDepartmentsByBodyPart(bodyPartId: string): MedicalDepartment[] {
  const bodyPart = getBodyPartById(bodyPartId);
  if (!bodyPart) return [];
  return MEDICAL_DEPARTMENTS.filter((dept) =>
    bodyPart.departments.includes(dept.id)
  );
}

// 根据部位获取症状列表
export function getSymptomsByBodyPart(bodyPartId: string): Symptom[] {
  return BODY_PART_SYMPTOMS[bodyPartId] || [];
}

// 根据选中的症状获取推荐科室
export function getRecommendedDepartments(
  selectedSymptoms: string[]
): MedicalDepartment[] {
  const departmentIds = new Set<string>();

  selectedSymptoms.forEach((symptomId) => {
    // 查找症状所属部位
    for (const [bodyPartId, symptoms] of Object.entries(BODY_PART_SYMPTOMS)) {
      const symptom = symptoms.find((s) => s.id === symptomId);
      if (symptom) {
        const bodyPart = getBodyPartById(bodyPartId);
        if (bodyPart) {
          bodyPart.departments.forEach((deptId) => departmentIds.add(deptId));
        }
      }
    }
  });

  return MEDICAL_DEPARTMENTS.filter((dept) => departmentIds.has(dept.id));
}

// 根据选中症状计算风险等级
export function calculateRiskLevel(
  selectedSymptoms: Symptom[]
): 'low' | 'medium' | 'high' {
  const highRiskCount = selectedSymptoms.filter((s) => s.severity === 'high').length;
  const mediumRiskCount = selectedSymptoms.filter((s) => s.severity === 'medium').length;

  if (highRiskCount >= 2 || (highRiskCount >= 1 && mediumRiskCount >= 2)) {
    return 'high';
  }
  if (highRiskCount >= 1 || mediumRiskCount >= 3) {
    return 'medium';
  }
  return 'low';
}

// 获取所有症状的扁平列表
export function getAllSymptoms(): Symptom[] {
  const allSymptoms: Symptom[] = [];
  Object.values(BODY_PART_SYMPTOMS).forEach((symptoms) => {
    allSymptoms.push(...symptoms);
  });
  allSymptoms.push(...GENERAL_SYMPTOMS);
  return allSymptoms;
}
