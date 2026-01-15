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
    name: '頭部',
    nameEn: 'Head',
    path: 'M150,20 C180,20 200,45 200,80 C200,115 180,140 150,140 C120,140 100,115 100,80 C100,45 120,20 150,20',
    departments: ['neurology', 'ophthalmology', 'ent'],
    symptomQuestionIds: [12],
    commonSymptoms: ['頭痛', '頭暈', '視力變化', '記憶力下降', '耳鳴'],
  },
  {
    id: 'neck',
    name: '頸部',
    nameEn: 'Neck',
    path: 'M130,140 L170,140 L175,180 L125,180 Z',
    departments: ['ent', 'endocrine'],
    symptomQuestionIds: [],
    commonSymptoms: ['頸部腫塊', '吞嚥困難', '甲狀腺腫大'],
  },
  {
    id: 'chest',
    name: '胸部',
    nameEn: 'Chest',
    path: 'M90,180 L210,180 L220,300 L80,300 Z',
    departments: ['cardiology', 'pulmonology'],
    symptomQuestionIds: [11],
    commonSymptoms: ['胸悶', '心悸', '呼吸困難', '長期咳嗽'],
  },
  {
    id: 'abdomen',
    name: '腹部',
    nameEn: 'Abdomen',
    path: 'M80,300 L220,300 L225,420 L75,420 Z',
    departments: ['gastroenterology', 'hepatology'],
    symptomQuestionIds: [10],
    commonSymptoms: ['胃痛', '胃脹', '反酸', '便秘', '腹瀉', '便血'],
  },
  {
    id: 'pelvis',
    name: '骨盆/下腹',
    nameEn: 'Pelvis',
    path: 'M75,420 L225,420 L230,480 L70,480 Z',
    departments: ['urology', 'gynecology'],
    symptomQuestionIds: [13],
    commonSymptoms: ['頻尿', '尿痛', '血尿', '下腹痛'],
  },
  {
    id: 'left-arm',
    name: '左臂',
    nameEn: 'Left Arm',
    path: 'M50,180 L90,180 L85,200 L70,350 L40,350 L55,200 Z',
    departments: ['orthopedics', 'dermatology'],
    symptomQuestionIds: [],
    commonSymptoms: ['手臂疼痛', '麻木', '無力'],
  },
  {
    id: 'right-arm',
    name: '右臂',
    nameEn: 'Right Arm',
    path: 'M210,180 L250,180 L245,200 L260,350 L230,350 L215,200 Z',
    departments: ['orthopedics', 'dermatology'],
    symptomQuestionIds: [],
    commonSymptoms: ['手臂疼痛', '麻木', '無力'],
  },
  {
    id: 'left-leg',
    name: '左腿',
    nameEn: 'Left Leg',
    path: 'M70,480 L140,480 L135,700 L65,700 Z',
    departments: ['orthopedics', 'vascular'],
    symptomQuestionIds: [],
    commonSymptoms: ['腿痛', '腫脹', '靜脈曲張', '行走困難'],
  },
  {
    id: 'right-leg',
    name: '右腿',
    nameEn: 'Right Leg',
    path: 'M160,480 L230,480 L235,700 L165,700 Z',
    departments: ['orthopedics', 'vascular'],
    symptomQuestionIds: [],
    commonSymptoms: ['腿痛', '腫脹', '靜脈曲張', '行走困難'],
  },
  {
    id: 'back',
    name: '背部',
    nameEn: 'Back',
    path: '', // 背面图单独处理
    departments: ['orthopedics', 'neurology'],
    symptomQuestionIds: [],
    commonSymptoms: ['腰痛', '背痛', '脊椎問題'],
  },
];

// ==================== 医疗科室配置 ====================
export const MEDICAL_DEPARTMENTS: MedicalDepartment[] = [
  {
    id: 'neurology',
    name: '神經內科',
    nameEn: 'Neurology',
    icon: '🧠',
    description: '腦部、神經系統相關疾病',
    recommendedTests: ['腦部 MRI', '腦部 MRA', '腦電圖 EEG'],
    bodyParts: ['head'],
  },
  {
    id: 'cardiology',
    name: '心臟內科',
    nameEn: 'Cardiology',
    icon: '❤️',
    description: '心臟、血管循環系統',
    recommendedTests: ['心臟超音波', '心電圖', '冠脈鈣化 CT', '心臟 MRI'],
    bodyParts: ['chest'],
  },
  {
    id: 'pulmonology',
    name: '呼吸內科',
    nameEn: 'Pulmonology',
    icon: '🫁',
    description: '肺部、呼吸道疾病',
    recommendedTests: ['胸部 CT', '肺功能檢查', '支氣管鏡'],
    bodyParts: ['chest'],
  },
  {
    id: 'gastroenterology',
    name: '消化內科',
    nameEn: 'Gastroenterology',
    icon: '🍽️',
    description: '胃腸道消化系統',
    recommendedTests: ['胃鏡', '大腸鏡', '腹部超音波', '幽門螺旋桿菌檢測'],
    bodyParts: ['abdomen'],
  },
  {
    id: 'hepatology',
    name: '肝膽科',
    nameEn: 'Hepatology',
    icon: '🫀',
    description: '肝臟、膽囊、胰臟',
    recommendedTests: ['腹部超音波', '肝功能檢查', 'B/C 型肝炎篩查', 'MRI'],
    bodyParts: ['abdomen'],
  },
  {
    id: 'urology',
    name: '泌尿科',
    nameEn: 'Urology',
    icon: '💧',
    description: '泌尿系統、腎臟',
    recommendedTests: ['尿液分析', '腎臟超音波', 'PSA 檢測', '膀胱鏡'],
    bodyParts: ['pelvis'],
  },
  {
    id: 'gynecology',
    name: '婦科',
    nameEn: 'Gynecology',
    icon: '🌸',
    description: '女性生殖系統',
    recommendedTests: ['子宮頸抹片', '婦科超音波', '乳房超音波', 'HPV 檢測'],
    bodyParts: ['pelvis', 'chest'],
  },
  {
    id: 'orthopedics',
    name: '骨科',
    nameEn: 'Orthopedics',
    icon: '🦴',
    description: '骨骼、關節、肌肉',
    recommendedTests: ['X 光檢查', '骨密度檢測', 'MRI', '關節超音波'],
    bodyParts: ['back', 'left-arm', 'right-arm', 'left-leg', 'right-leg'],
  },
  {
    id: 'endocrine',
    name: '內分泌科',
    nameEn: 'Endocrinology',
    icon: '⚗️',
    description: '荷爾蒙、甲狀腺、糖尿病',
    recommendedTests: ['甲狀腺超音波', '甲狀腺功能檢查', '血糖檢測', 'HbA1c'],
    bodyParts: ['neck'],
  },
  {
    id: 'ophthalmology',
    name: '眼科',
    nameEn: 'Ophthalmology',
    icon: '👁️',
    description: '眼睛視力相關',
    recommendedTests: ['視力檢查', '眼壓檢測', '眼底攝影', 'OCT 檢查'],
    bodyParts: ['head'],
  },
  {
    id: 'ent',
    name: '耳鼻喉科',
    nameEn: 'ENT',
    icon: '👂',
    description: '耳朵、鼻子、喉嚨',
    recommendedTests: ['聽力檢查', '鼻內視鏡', '喉部內視鏡'],
    bodyParts: ['head', 'neck'],
  },
  {
    id: 'dermatology',
    name: '皮膚科',
    nameEn: 'Dermatology',
    icon: '🧴',
    description: '皮膚、毛髮、指甲',
    recommendedTests: ['皮膚鏡檢查', '皮膚切片', '過敏原檢測'],
    bodyParts: ['left-arm', 'right-arm'],
  },
  {
    id: 'vascular',
    name: '血管外科',
    nameEn: 'Vascular Surgery',
    icon: '🩸',
    description: '動靜脈血管疾病',
    recommendedTests: ['下肢血管超音波', 'ABI/CAVI 檢測', '血管攝影'],
    bodyParts: ['left-leg', 'right-leg'],
  },
  {
    id: 'mental',
    name: '身心科',
    nameEn: 'Psychiatry',
    icon: '🧘',
    description: '心理健康、壓力、睡眠',
    recommendedTests: ['心理評估', '睡眠檢測', '壓力指數評估'],
    bodyParts: ['head'],
  },
];

// ==================== 部位症状详细配置 ====================
export const BODY_PART_SYMPTOMS: Record<string, Symptom[]> = {
  head: [
    {
      id: 'headache',
      bodyPartId: 'head',
      name: '經常頭痛',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'headache-type',
          question: '您的頭痛類型？',
          type: 'single',
          options: [
            { value: 'tension', label: '緊繃型（兩側壓迫感）' },
            { value: 'migraine', label: '偏頭痛（單側搏動性）' },
            { value: 'cluster', label: '叢發性（眼眶周圍劇痛）' },
            { value: 'other', label: '其他類型' },
          ],
        },
        {
          id: 'headache-freq',
          question: '頭痛發作頻率？',
          type: 'single',
          options: [
            { value: 'rare', label: '偶爾（每月1-2次）' },
            { value: 'weekly', label: '每週數次' },
            { value: 'daily', label: '幾乎每天' },
          ],
        },
      ],
    },
    {
      id: 'dizziness',
      bodyPartId: 'head',
      name: '頭暈',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'dizziness-type',
          question: '頭暈的感覺？',
          type: 'single',
          options: [
            { value: 'spinning', label: '天旋地轉' },
            { value: 'lightheaded', label: '頭重腳輕' },
            { value: 'unsteady', label: '站不穩' },
          ],
        },
      ],
    },
    {
      id: 'vision-change',
      bodyPartId: 'head',
      name: '視力變化',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'vision-type',
          question: '視力變化情況？',
          type: 'multi',
          options: [
            { value: 'blurry', label: '視力模糊' },
            { value: 'double', label: '看東西重影' },
            { value: 'floaters', label: '飛蚊症' },
            { value: 'flash', label: '閃光感' },
            { value: 'blind-spot', label: '視野缺損' },
          ],
        },
      ],
    },
    {
      id: 'memory-decline',
      bodyPartId: 'head',
      name: '記憶力下降',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'memory-duration',
          question: '記憶力下降持續多久？',
          type: 'single',
          options: [
            { value: 'recent', label: '最近幾週' },
            { value: 'months', label: '幾個月' },
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
      name: '胸悶',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'chest-trigger',
          question: '胸悶發作時機？',
          type: 'multi',
          options: [
            { value: 'rest', label: '休息時' },
            { value: 'exercise', label: '運動時' },
            { value: 'stress', label: '緊張時' },
            { value: 'eating', label: '飯後' },
          ],
        },
        {
          id: 'chest-duration',
          question: '每次持續多久？',
          type: 'single',
          options: [
            { value: 'seconds', label: '幾秒鐘' },
            { value: 'minutes', label: '幾分鐘' },
            { value: 'hours', label: '數小時' },
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
          question: '心悸的感覺？',
          type: 'multi',
          options: [
            { value: 'fast', label: '心跳加速' },
            { value: 'skip', label: '心跳漏拍' },
            { value: 'pound', label: '心臟狂跳' },
            { value: 'irregular', label: '心跳不規則' },
          ],
        },
      ],
    },
    {
      id: 'breathing-difficulty',
      bodyPartId: 'chest',
      name: '呼吸困難',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'breathing-when',
          question: '什麼情況下呼吸困難？',
          type: 'multi',
          options: [
            { value: 'climbing', label: '爬樓梯時' },
            { value: 'lying', label: '平躺時' },
            { value: 'rest', label: '靜息時' },
            { value: 'night', label: '夜間睡眠中' },
          ],
        },
      ],
    },
    {
      id: 'chronic-cough',
      bodyPartId: 'chest',
      name: '長期咳嗽',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'cough-duration',
          question: '咳嗽持續多久？',
          type: 'single',
          options: [
            { value: 'weeks', label: '2-4週' },
            { value: 'months', label: '1-3個月' },
            { value: 'long', label: '3個月以上' },
          ],
        },
        {
          id: 'cough-type',
          question: '咳嗽特徵？',
          type: 'multi',
          options: [
            { value: 'dry', label: '乾咳' },
            { value: 'phlegm', label: '有痰' },
            { value: 'blood', label: '帶血絲' },
            { value: 'night', label: '夜間加重' },
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
            { value: 'all', label: '整個腹部' },
          ],
        },
        {
          id: 'stomach-timing',
          question: '疼痛發作時機？',
          type: 'multi',
          options: [
            { value: 'empty', label: '空腹時' },
            { value: 'after-meal', label: '飯後' },
            { value: 'night', label: '夜間' },
            { value: 'random', label: '無規律' },
          ],
        },
      ],
    },
    {
      id: 'bloating',
      bodyPartId: 'abdomen',
      name: '胃脹',
      severity: 'low',
      followUpQuestions: [
        {
          id: 'bloating-freq',
          question: '脹氣頻率？',
          type: 'single',
          options: [
            { value: 'occasional', label: '偶爾' },
            { value: 'often', label: '經常' },
            { value: 'always', label: '幾乎每餐後' },
          ],
        },
      ],
    },
    {
      id: 'reflux',
      bodyPartId: 'abdomen',
      name: '反酸/燒心',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'reflux-freq',
          question: '反酸頻率？',
          type: 'single',
          options: [
            { value: 'rare', label: '每月幾次' },
            { value: 'weekly', label: '每週幾次' },
            { value: 'daily', label: '每天' },
          ],
        },
      ],
    },
    {
      id: 'bowel-changes',
      bodyPartId: 'abdomen',
      name: '排便異常',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'bowel-type',
          question: '排便問題類型？',
          type: 'multi',
          options: [
            { value: 'constipation', label: '便秘' },
            { value: 'diarrhea', label: '腹瀉' },
            { value: 'alternate', label: '便秘腹瀉交替' },
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
      name: '頻尿',
      severity: 'medium',
      followUpQuestions: [
        {
          id: 'urination-freq',
          question: '每天排尿次數？',
          type: 'single',
          options: [
            { value: 'normal', label: '4-8次' },
            { value: 'moderate', label: '8-12次' },
            { value: 'severe', label: '12次以上' },
          ],
        },
        {
          id: 'nocturia',
          question: '夜間起床排尿次數？',
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
          question: '疼痛時機？',
          type: 'single',
          options: [
            { value: 'start', label: '排尿開始時' },
            { value: 'during', label: '排尿過程中' },
            { value: 'end', label: '排尿結束時' },
            { value: 'always', label: '整個過程' },
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
          question: '血尿情況？',
          type: 'single',
          options: [
            { value: 'visible', label: '肉眼可見' },
            { value: 'microscopic', label: '體檢發現（潛血）' },
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
            { value: 'center', label: '正中間' },
            { value: 'left', label: '左側' },
            { value: 'right', label: '右側' },
            { value: 'both', label: '兩側' },
          ],
        },
      ],
    },
  ],
  neck: [
    {
      id: 'neck-lump',
      bodyPartId: 'neck',
      name: '頸部腫塊',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'lump-duration',
          question: '發現多久了？',
          type: 'single',
          options: [
            { value: 'recent', label: '最近發現' },
            { value: 'weeks', label: '幾週' },
            { value: 'months', label: '幾個月' },
          ],
        },
        {
          id: 'lump-growing',
          question: '腫塊有變大嗎？',
          type: 'single',
          options: [
            { value: 'no', label: '沒有變化' },
            { value: 'slow', label: '緩慢增大' },
            { value: 'fast', label: '快速增大' },
          ],
        },
      ],
    },
    {
      id: 'swallowing-difficulty',
      bodyPartId: 'neck',
      name: '吞嚥困難',
      severity: 'high',
      followUpQuestions: [
        {
          id: 'swallow-type',
          question: '吞嚥困難類型？',
          type: 'multi',
          options: [
            { value: 'solid', label: '固體食物' },
            { value: 'liquid', label: '液體' },
            { value: 'both', label: '都有困難' },
            { value: 'pain', label: '伴隨疼痛' },
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
    name: '不明原因體重下降',
    severity: 'high',
    followUpQuestions: [
      {
        id: 'weight-amount',
        question: '體重下降幅度？',
        type: 'single',
        options: [
          { value: '3-5kg', label: '3-5公斤' },
          { value: '5-10kg', label: '5-10公斤' },
          { value: '10kg+', label: '10公斤以上' },
        ],
      },
      {
        id: 'weight-duration',
        question: '多長時間內下降的？',
        type: 'single',
        options: [
          { value: '1month', label: '1個月內' },
          { value: '3months', label: '3個月內' },
          { value: '6months', label: '6個月內' },
        ],
      },
    ],
  },
  {
    id: 'fatigue',
    bodyPartId: 'general',
    name: '持續疲勞',
    severity: 'medium',
    followUpQuestions: [
      {
        id: 'fatigue-level',
        question: '疲勞程度？',
        type: 'single',
        options: [
          { value: 'mild', label: '輕度（可正常工作）' },
          { value: 'moderate', label: '中度（影響工作效率）' },
          { value: 'severe', label: '重度（無法正常工作）' },
        ],
      },
      {
        id: 'fatigue-duration',
        question: '持續多久？',
        type: 'single',
        options: [
          { value: 'weeks', label: '幾週' },
          { value: 'months', label: '幾個月' },
          { value: 'long', label: '半年以上' },
        ],
      },
    ],
  },
  {
    id: 'night-sweats',
    bodyPartId: 'general',
    name: '夜間盜汗',
    severity: 'medium',
    followUpQuestions: [
      {
        id: 'sweats-freq',
        question: '盜汗頻率？',
        type: 'single',
        options: [
          { value: 'occasional', label: '偶爾' },
          { value: 'weekly', label: '每週幾次' },
          { value: 'nightly', label: '幾乎每晚' },
        ],
      },
    ],
  },
  {
    id: 'fever',
    bodyPartId: 'general',
    name: '反覆發燒',
    severity: 'high',
    followUpQuestions: [
      {
        id: 'fever-pattern',
        question: '發燒規律？',
        type: 'single',
        options: [
          { value: 'continuous', label: '持續發燒' },
          { value: 'intermittent', label: '間歇性發燒' },
          { value: 'periodic', label: '週期性發燒' },
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
