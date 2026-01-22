'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, User, Calendar, Heart, Target, MessageSquare, Briefcase } from 'lucide-react';

interface RecommendationResult {
  packageSlug: string;
  packageName: string;
  reason: string;
  price: number;
}

interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  options: QuestionOption[];
  multiple?: boolean;
  showIf?: (answers: Record<string, string | string[]>) => boolean;
}

const ALL_QUESTIONS: Question[] = [
  // ========== 基本信息 (1-4) ==========
  {
    id: 'age',
    title: '您的年齡範圍是？',
    subtitle: '不同年齡段有不同的健康關注重點',
    icon: User,
    options: [
      { value: 'under30', label: '30歲以下', description: '建議基礎檢查' },
      { value: '30-40', label: '30-40歲', description: '開始關注代謝指標' },
      { value: '40-50', label: '40-50歲', description: '建議增加腫瘤標記物' },
      { value: '50-60', label: '50-60歲', description: '建議全面篩查' },
      { value: 'over60', label: '60歲以上', description: '建議深度體檢' },
    ]
  },
  {
    id: 'gender',
    title: '您的性別是？',
    subtitle: '部分檢查項目有性別差異',
    icon: User,
    options: [
      { value: 'male', label: '男性' },
      { value: 'female', label: '女性' },
    ]
  },
  {
    id: 'bmi',
    title: '您的體重狀況如何？',
    subtitle: 'BMI會影響多種疾病風險',
    icon: User,
    options: [
      { value: 'underweight', label: '偏瘦 (BMI<18.5)', description: '可能需要營養評估' },
      { value: 'normal', label: '正常 (BMI 18.5-24)', description: '保持健康體重' },
      { value: 'overweight', label: '超重 (BMI 24-28)', description: '建議代謝相關檢查' },
      { value: 'obese', label: '肥胖 (BMI>28)', description: '需關注心血管及代謝' },
    ]
  },
  {
    id: 'waistCircumference',
    title: '您的腰圍情況如何？',
    subtitle: '腹部脂肪與代謝綜合征密切相關',
    icon: User,
    options: [
      { value: 'normal', label: '正常範圍', description: '男<90cm，女<80cm' },
      { value: 'borderline', label: '臨界值', description: '接近標準上限' },
      { value: 'high', label: '超標', description: '男≥90cm，女≥80cm' },
      { value: 'unknown', label: '不確定' },
    ]
  },
  // ========== 生活習慣 (5-11) ==========
  {
    id: 'smoking',
    title: '您是否吸煙？',
    subtitle: '吸煙是多種疾病的重要風險因素',
    icon: Heart,
    options: [
      { value: 'never', label: '從不吸煙' },
      { value: 'quit_long', label: '已戒煙超過5年' },
      { value: 'quit_recent', label: '戒煙不足5年' },
      { value: 'occasional', label: '偶爾吸煙', description: '每週少於5根' },
      { value: 'regular', label: '經常吸煙', description: '每天吸煙' },
    ]
  },
  {
    id: 'smokingYears',
    title: '您的吸煙史有多長？',
    subtitle: '包括已戒煙的年數',
    icon: Heart,
    showIf: (answers) => answers.smoking !== 'never',
    options: [
      { value: 'under10', label: '10年以下' },
      { value: '10-20', label: '10-20年' },
      { value: 'over20', label: '20年以上', description: '肺癌風險顯著增加' },
    ]
  },
  {
    id: 'drinking',
    title: '您的飲酒習慣如何？',
    subtitle: '飲酒會影響肝臟及心血管健康',
    icon: Heart,
    options: [
      { value: 'never', label: '從不飲酒' },
      { value: 'occasional', label: '偶爾小酌', description: '每週1-2次' },
      { value: 'regular', label: '經常飲酒', description: '每週3次以上' },
      { value: 'heavy', label: '每日飲酒', description: '建議肝功能檢查' },
    ]
  },
  {
    id: 'exercise',
    title: '您的運動習慣如何？',
    subtitle: '運動對心肺功能和代謝很重要',
    icon: Heart,
    options: [
      { value: 'sedentary', label: '久坐不動', description: '每週運動少於1次' },
      { value: 'light', label: '輕度運動', description: '每週1-2次' },
      { value: 'moderate', label: '適度運動', description: '每週3-4次' },
      { value: 'active', label: '積極運動', description: '每週5次以上' },
    ]
  },
  {
    id: 'dietAndSalt',
    title: '您的飲食習慣如何？',
    subtitle: '飲食習慣影響消化系統、代謝和血壓',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'balanced', label: '均衡飲食', description: '蔬果肉類搭配合理' },
      { value: 'meat_heavy', label: '偏好肉食', description: '蔬菜攝入較少' },
      { value: 'irregular', label: '飲食不規律', description: '經常外食或應酬' },
      { value: 'processed', label: '加工食品為主', description: '高鹽高油飲食' },
      { value: 'heavy_salt', label: '口味偏重', description: '喜歡重鹹食物' },
    ]
  },
  {
    id: 'sleep',
    title: '您的睡眠質量如何？',
    subtitle: '睡眠影響免疫力和整體健康',
    icon: Calendar,
    options: [
      { value: 'good', label: '睡眠良好', description: '每晚7-8小時' },
      { value: 'fair', label: '偶爾失眠', description: '入睡困難或易醒' },
      { value: 'poor', label: '睡眠較差', description: '經常失眠' },
      { value: 'very_poor', label: '睡眠很差', description: '長期睡眠不足6小時' },
    ]
  },
  {
    id: 'snoring',
    title: '您是否有打鼾問題？',
    subtitle: '打鼾可能與睡眠呼吸暫停相關',
    icon: Calendar,
    options: [
      { value: 'no', label: '沒有打鼾' },
      { value: 'occasional', label: '偶爾打鼾' },
      { value: 'frequent', label: '經常打鼾', description: '伴侶反映' },
      { value: 'apnea', label: '嚴重打鼾/呼吸暫停', description: '需要心肺檢查' },
    ]
  },
  // ========== 工作與環境 (12-14) ==========
  {
    id: 'workStyle',
    title: '您的工作性質如何？',
    subtitle: '工作環境會影響健康風險',
    icon: Briefcase,
    options: [
      { value: 'desk', label: '辦公室工作', description: '長期坐姿' },
      { value: 'active', label: '需要走動', description: '適度活動' },
      { value: 'physical', label: '體力勞動', description: '較大體力消耗' },
      { value: 'shift', label: '輪班工作', description: '作息不規律' },
    ]
  },
  {
    id: 'occupationalExposure',
    title: '您的工作是否接觸以下環境？',
    subtitle: '可多選，職業暴露會增加特定疾病風險',
    icon: Briefcase,
    multiple: true,
    options: [
      { value: 'chemicals', label: '化學物質', description: '有機溶劑、農藥等' },
      { value: 'radiation', label: '輻射環境', description: 'X光、CT等' },
      { value: 'dust', label: '粉塵環境', description: '礦場、建築工地等' },
      { value: 'asbestos', label: '石棉接觸史', description: '老舊建築裝修等' },
      { value: 'none', label: '無特殊職業暴露' },
    ]
  },
  {
    id: 'stressLevel',
    title: '您的壓力程度如何？',
    subtitle: '長期壓力影響心血管和免疫系統',
    icon: Calendar,
    options: [
      { value: 'low', label: '壓力較小', description: '生活輕鬆' },
      { value: 'moderate', label: '適度壓力', description: '可以應對' },
      { value: 'high', label: '壓力較大', description: '經常感到焦慮' },
      { value: 'severe', label: '壓力很大', description: '嚴重影響生活' },
    ]
  },
  // ========== 既往病史 (15-20) ==========
  {
    id: 'chronicConditions',
    title: '您是否有以下慢性疾病？',
    subtitle: '可多選，了解您的健康狀況',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'hypertension', label: '高血壓', description: '需要心血管檢查' },
      { value: 'diabetes', label: '糖尿病', description: '需要代謝相關檢查' },
      { value: 'hyperlipidemia', label: '高血脂', description: '需要血脂檢測' },
      { value: 'fatty_liver', label: '脂肪肝', description: '需要肝功能檢查' },
      { value: 'none', label: '無慢性疾病' },
    ]
  },
  {
    id: 'infectiousHistory',
    title: '您是否有以下感染史？',
    subtitle: '可多選，這些感染與癌症風險相關',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'hpylori', label: '幽門螺杆菌(Hp)感染', description: '胃癌風險因素' },
      { value: 'hbv', label: 'B型肝炎帶原者/曾感染', description: '肝癌風險因素' },
      { value: 'hcv', label: 'C型肝炎感染史', description: '肝癌風險因素' },
      { value: 'hpv', label: 'HPV感染史（女性）', description: '子宮頸癌風險' },
      { value: 'none', label: '無以上感染史/不確定' },
    ]
  },
  {
    id: 'pastDiseases',
    title: '您是否曾患過以下疾病？',
    subtitle: '可多選，既往病史影響篩查重點',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'gastric_ulcer', label: '胃潰瘍/十二指腸潰瘍' },
      { value: 'polyps', label: '腸道息肉', description: '需定期腸鏡隨訪' },
      { value: 'thyroid_nodule', label: '甲狀腺結節', description: '需要追蹤' },
      { value: 'breast_nodule', label: '乳房結節/纖維腺瘤', description: '女性需追蹤' },
      { value: 'atrophic_gastritis', label: '萎縮性胃炎', description: '胃癌前病變' },
      { value: 'none', label: '無特殊病史' },
    ]
  },
  {
    id: 'medications',
    title: '您是否長期服用以下藥物？',
    subtitle: '可多選，某些藥物可能影響體檢或提示健康問題',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'aspirin', label: '阿司匹林/抗血小板藥', description: '需注意消化道出血風險' },
      { value: 'antihypertensive', label: '降血壓藥' },
      { value: 'diabetes_med', label: '降血糖藥/胰島素' },
      { value: 'hormones', label: '激素類藥物', description: '包括避孕藥、HRT' },
      { value: 'none', label: '無長期服藥' },
    ]
  },
  {
    id: 'lastCheckup',
    title: '您上次全面體檢是什麼時候？',
    subtitle: '了解您的體檢頻率',
    icon: Calendar,
    options: [
      { value: 'within1year', label: '1年內', description: '保持良好習慣' },
      { value: '1-2years', label: '1-2年前', description: '建議定期檢查' },
      { value: '2-3years', label: '2-3年前', description: '建議儘快檢查' },
      { value: 'over3years', label: '3年以上/從未', description: '強烈建議全面檢查' },
    ]
  },
  // ========== 女性專屬問題 (21-22) ==========
  {
    id: 'femaleReproductive',
    title: '您的生育情況如何？',
    subtitle: '生育史與女性癌症風險相關',
    icon: User,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'nulliparous', label: '未生育', description: '乳腺癌風險略高' },
      { value: 'late_first', label: '30歲後首次生育' },
      { value: 'normal', label: '30歲前已生育' },
      { value: 'multiple', label: '多次生育（3次以上）' },
    ]
  },
  {
    id: 'femaleMenstruation',
    title: '您的月經/更年期情況如何？',
    subtitle: '雌激素暴露時間與女性癌症風險相關',
    icon: User,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'regular', label: '月經規律', description: '週期正常' },
      { value: 'irregular', label: '月經不規律', description: '需要婦科檢查' },
      { value: 'early_menarche', label: '初經較早（<12歲）', description: '雌激素暴露較長' },
      { value: 'menopause', label: '已停經' },
      { value: 'late_menopause', label: '停經較晚（>55歲）', description: '雌激素暴露較長' },
    ]
  },
  // ========== 男性專屬問題 (23) ==========
  {
    id: 'maleProstate',
    title: '您是否有前列腺相關問題？',
    subtitle: '前列腺問題在中老年男性中常見',
    icon: User,
    showIf: (answers) => answers.gender === 'male',
    options: [
      { value: 'none', label: '無相關問題' },
      { value: 'bph', label: '良性前列腺增生', description: '已確診' },
      { value: 'elevated_psa', label: 'PSA曾經升高', description: '需要追蹤' },
      { value: 'symptoms', label: '有排尿症狀但未檢查' },
    ]
  },
  // ========== 家族病史 (24-27) ==========
  {
    id: 'familyCancer',
    title: '您的直系親屬是否有癌症病史？',
    subtitle: '可多選，家族癌症史會增加患病風險',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'lung', label: '肺癌', description: '建議低劑量CT篩查' },
      { value: 'gastric', label: '胃癌', description: '建議胃鏡檢查' },
      { value: 'colorectal', label: '大腸癌', description: '建議腸鏡檢查' },
      { value: 'liver', label: '肝癌', description: '建議肝功能及超聲波' },
      { value: 'pancreatic', label: '胰臟癌', description: '難以早期發現' },
      { value: 'none', label: '無癌症家族史' },
    ]
  },
  {
    id: 'familyCancerFemale',
    title: '家族中女性是否有以下癌症？',
    subtitle: '可多選，女性特有癌症的家族史',
    icon: Heart,
    multiple: true,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'breast', label: '乳腺癌', description: '建議乳房檢查' },
      { value: 'ovarian', label: '卵巢癌' },
      { value: 'cervical', label: '子宮頸癌' },
      { value: 'uterine', label: '子宮內膜癌' },
      { value: 'none', label: '無女性癌症家族史' },
    ]
  },
  {
    id: 'familyCardio',
    title: '您的直系親屬是否有心腦血管疾病？',
    subtitle: '可多選，家族史會影響發病風險',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'heartDisease', label: '心臟病', description: '冠心病、心肌梗塞等' },
      { value: 'stroke', label: '中風', description: '腦梗塞、腦出血' },
      { value: 'hypertension', label: '高血壓', description: '長期高血壓' },
      { value: 'aneurysm', label: '動脈瘤', description: '需要血管檢查' },
      { value: 'none', label: '無心腦血管家族史' },
    ]
  },
  {
    id: 'familyMetabolic',
    title: '您的直系親屬是否有代謝相關疾病？',
    subtitle: '可多選，代謝疾病有遺傳傾向',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'diabetes', label: '糖尿病', description: '1型或2型糖尿病' },
      { value: 'thyroid', label: '甲狀腺疾病', description: '甲亢、甲減、甲狀腺癌' },
      { value: 'gout', label: '痛風', description: '尿酸過高' },
      { value: 'kidney', label: '腎病', description: '慢性腎病或腎衰竭' },
      { value: 'none', label: '無代謝疾病家族史' },
    ]
  },
  // ========== 當前症狀 (28-32) ==========
  {
    id: 'digestiveSymptoms',
    title: '您是否有消化系統相關症狀？',
    subtitle: '可多選，這些症狀可能需要胃腸鏡檢查',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'reflux', label: '胃酸倒流/燒心', description: '進食後感到不適' },
      { value: 'bloating', label: '腹脹/消化不良', description: '經常感到脹氣' },
      { value: 'stomachPain', label: '胃痛/腹痛', description: '反覆發作' },
      { value: 'bowelChange', label: '排便習慣改變', description: '便秘或腹瀉' },
      { value: 'blood', label: '便血/黑便', description: '需要立即檢查' },
      { value: 'none', label: '無消化系統症狀' },
    ]
  },
  {
    id: 'cardioSymptoms',
    title: '您是否有心血管相關症狀？',
    subtitle: '可多選，這些症狀需要心臟檢查',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'chestPain', label: '胸悶/胸痛', description: '活動或休息時發生' },
      { value: 'palpitation', label: '心悸/心跳不規則', description: '感覺心跳很快或漏跳' },
      { value: 'breathless', label: '氣促/呼吸困難', description: '輕度活動即感喘' },
      { value: 'edema', label: '下肢水腫', description: '腳踝或小腿浮腫' },
      { value: 'none', label: '無心血管症狀' },
    ]
  },
  {
    id: 'neuroSymptoms',
    title: '您是否有神經系統相關症狀？',
    subtitle: '可多選，這些症狀可能需要腦部檢查',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'headache', label: '經常頭痛', description: '反覆發作的頭痛' },
      { value: 'dizziness', label: '頭暈/眩暈', description: '經常感到頭暈' },
      { value: 'numbness', label: '手腳麻木', description: '感覺異常' },
      { value: 'memory', label: '記憶力下降', description: '明顯健忘' },
      { value: 'none', label: '無神經系統症狀' },
    ]
  },
  {
    id: 'urinarySymptomsMale',
    title: '您是否有泌尿系統相關症狀？',
    subtitle: '可多選，這些症狀可能需要前列腺檢查',
    icon: Heart,
    multiple: true,
    showIf: (answers) => answers.gender === 'male',
    options: [
      { value: 'frequency', label: '頻尿', description: '排尿次數增多' },
      { value: 'urgency', label: '尿急', description: '難以控制' },
      { value: 'difficulty', label: '排尿困難', description: '尿流細或中斷' },
      { value: 'nocturia', label: '夜尿增多', description: '夜間多次起床' },
      { value: 'none', label: '無泌尿系統症狀' },
    ]
  },
  {
    id: 'urinarySymptomsFemale',
    title: '您是否有泌尿/婦科相關症狀？',
    subtitle: '可多選，這些症狀可能需要婦科檢查',
    icon: Heart,
    multiple: true,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'frequency', label: '頻尿/尿急' },
      { value: 'abnormal_bleeding', label: '異常陰道出血', description: '非經期出血' },
      { value: 'discharge', label: '異常分泌物' },
      { value: 'pelvic_pain', label: '盆腔疼痛' },
      { value: 'none', label: '無相關症狀' },
    ]
  },
  {
    id: 'generalSymptoms',
    title: '您是否有其他全身性症狀？',
    subtitle: '可多選，這些症狀可能反映整體健康',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'fatigue', label: '持續疲勞', description: '休息後仍感疲倦' },
      { value: 'weightLoss', label: '體重下降', description: '無原因的減輕' },
      { value: 'weightGain', label: '體重增加', description: '無原因的增加' },
      { value: 'nightSweats', label: '盜汗', description: '夜間大量出汗' },
      { value: 'fever', label: '不明原因發燒', description: '反覆低燒' },
      { value: 'none', label: '無其他不適' },
    ]
  },
  // ========== 健康目標 (33-35) ==========
  {
    id: 'concerns',
    title: '您最關注的健康檢查項目是？',
    subtitle: '可多選，幫助我們推薦更適合的套餐',
    icon: Target,
    multiple: true,
    options: [
      { value: 'cancer', label: '癌症早期篩查', description: 'PET-CT、腫瘤標記物' },
      { value: 'cardio', label: '心血管健康', description: '心臟超音波、冠狀動脈CT' },
      { value: 'digestive', label: '消化系統', description: '胃腸鏡檢查' },
      { value: 'brain', label: '腦部健康', description: '腦部MRI/MRA' },
      { value: 'comprehensive', label: '全面體檢', description: '各系統綜合檢查' },
    ]
  },
  {
    id: 'checkupPurpose',
    title: '您此次體檢的主要目的是？',
    subtitle: '了解您的需求，提供最佳方案',
    icon: Target,
    options: [
      { value: 'routine', label: '定期健康維護', description: '預防為主' },
      { value: 'specific', label: '針對特定問題', description: '有明確的檢查目標' },
      { value: 'followup', label: '既往問題追蹤', description: '監測已知健康問題' },
      { value: 'comprehensive', label: '全面深度檢查', description: '想要最全面的了解' },
    ]
  },
  {
    id: 'checkupDepth',
    title: '您希望體檢的深度如何？',
    subtitle: '根據您的需求選擇檢查深度',
    icon: Target,
    options: [
      { value: 'basic', label: '基礎篩查', description: '覆蓋主要健康指標' },
      { value: 'standard', label: '標準體檢', description: '較全面的健康評估' },
      { value: 'advanced', label: '深度體檢', description: '包含進階影像檢查' },
      { value: 'premium', label: '頂級全面', description: '最全面的健康篩查' },
    ]
  }
];

const PACKAGE_DATA = [
  { slug: 'basic-checkup', name: 'BASIC 基礎套餐', price: 550000 },
  { slug: 'dwibs-cancer-screening', name: 'DWIBS 防癌篩查', price: 275000 },
  { slug: 'select-gastroscopy', name: 'SELECT 胃鏡套餐', price: 687500 },
  { slug: 'select-gastro-colonoscopy', name: 'SELECT 胃+大腸鏡套餐', price: 825000 },
  { slug: 'premium-cardiac-course', name: 'PREMIUM 心臟精密套餐', price: 825000 },
  { slug: 'vip-member-course', name: 'VIP 頂級全能套餐', price: 1512500 },
];

function calculateRecommendation(answers: Record<string, string | string[]>): RecommendationResult {
  let riskScore = 0;
  let cancerRisk = 0;
  let cardioRisk = 0;
  let digestiveRisk = 0;
  let metabolicRisk = 0;
  let brainRisk = 0;
  let liverRisk = 0;
  const reasons: string[] = [];

  const gender = answers.gender as string;
  const age = answers.age as string;

  // 年龄动态调整基础风险
  const ageMultiplier = age === 'over60' ? 1.3 : age === '50-60' ? 1.2 : age === '40-50' ? 1.1 : 1.0;

  // 1. 年龄
  if (age === 'over60') { riskScore += 5; cancerRisk += 4; cardioRisk += 4; brainRisk += 3; reasons.push('60歲以上是多種疾病高發期'); }
  else if (age === '50-60') { riskScore += 4; cancerRisk += 3; cardioRisk += 3; brainRisk += 2; reasons.push('50-60歲是健康篩查關鍵期'); }
  else if (age === '40-50') { riskScore += 3; cancerRisk += 2; cardioRisk += 2; }
  else if (age === '30-40') { riskScore += 1; }

  // 2. BMI
  const bmi = answers.bmi as string;
  if (bmi === 'obese') { riskScore += 4; cardioRisk += 3; metabolicRisk += 4; reasons.push('體重超標增加心血管及代謝疾病風險'); }
  else if (bmi === 'overweight') { riskScore += 2; cardioRisk += 2; metabolicRisk += 2; }

  // 3. 腰围
  const waist = answers.waistCircumference as string;
  if (waist === 'high') { riskScore += 3; metabolicRisk += 3; cardioRisk += 2; }
  else if (waist === 'borderline') { riskScore += 1; metabolicRisk += 1; }

  // 4-5. 吸烟
  const smoking = answers.smoking as string;
  const smokingYears = answers.smokingYears as string;
  if (smoking === 'regular') { riskScore += 5; cancerRisk += 5; cardioRisk += 4; reasons.push('長期吸煙大幅增加肺癌及心血管疾病風險'); }
  else if (smoking === 'occasional') { riskScore += 2; cancerRisk += 2; cardioRisk += 1; }
  else if (smoking === 'quit_recent') { riskScore += 2; cancerRisk += 2; }
  else if (smoking === 'quit_long') { riskScore += 1; cancerRisk += 1; }
  if (smokingYears === 'over20') { cancerRisk += 4; reasons.push('吸煙超過20年，建議肺部深度篩查'); }
  else if (smokingYears === '10-20') { cancerRisk += 2; }

  // 6. 饮酒
  const drinking = answers.drinking as string;
  if (drinking === 'heavy') { riskScore += 4; digestiveRisk += 4; liverRisk += 5; cancerRisk += 3; reasons.push('每日飲酒需要重點檢查肝臟功能'); }
  else if (drinking === 'regular') { riskScore += 2; digestiveRisk += 2; liverRisk += 2; cancerRisk += 1; }

  // 7. 运动
  const exercise = answers.exercise as string;
  if (exercise === 'sedentary') { riskScore += 3; cardioRisk += 3; metabolicRisk += 3; }
  else if (exercise === 'light') { riskScore += 1; cardioRisk += 1; }

  // 8. 饮食（合并口味）
  const dietAndSalt = (answers.dietAndSalt as string[]) || [];
  if (dietAndSalt.includes('processed') || dietAndSalt.includes('irregular')) { riskScore += 3; digestiveRisk += 3; metabolicRisk += 2; cancerRisk += 1; }
  if (dietAndSalt.includes('meat_heavy')) { riskScore += 2; digestiveRisk += 2; cancerRisk += 1; }
  if (dietAndSalt.includes('heavy_salt')) { riskScore += 2; cardioRisk += 2; digestiveRisk += 1; }

  // 9. 睡眠
  const sleep = answers.sleep as string;
  if (sleep === 'very_poor') { riskScore += 3; cardioRisk += 2; brainRisk += 1; }
  else if (sleep === 'poor') { riskScore += 2; cardioRisk += 1; }

  // 10. 打鼾
  const snoring = answers.snoring as string;
  if (snoring === 'apnea') { riskScore += 4; cardioRisk += 4; brainRisk += 2; reasons.push('睡眠呼吸暫停需要心肺功能評估'); }
  else if (snoring === 'frequent') { riskScore += 2; cardioRisk += 2; }

  // 11. 工作
  const work = answers.workStyle as string;
  if (work === 'shift') { riskScore += 2; metabolicRisk += 2; cancerRisk += 1; }
  else if (work === 'desk') { riskScore += 1; cardioRisk += 1; }

  // 12. 职业暴露（新增）
  const occupationalExposure = (answers.occupationalExposure as string[]) || [];
  if (!occupationalExposure.includes('none')) {
    if (occupationalExposure.includes('asbestos')) { cancerRisk += 4; reasons.push('石棉接觸史增加肺部疾病風險'); }
    if (occupationalExposure.includes('radiation')) { cancerRisk += 3; }
    if (occupationalExposure.includes('chemicals')) { cancerRisk += 2; liverRisk += 2; }
    if (occupationalExposure.includes('dust')) { cancerRisk += 2; }
    riskScore += occupationalExposure.filter(e => e !== 'none').length * 2;
  }

  // 13. 压力
  const stress = answers.stressLevel as string;
  if (stress === 'severe') { riskScore += 3; cardioRisk += 3; digestiveRisk += 2; }
  else if (stress === 'high') { riskScore += 2; cardioRisk += 2; }

  // 14. 慢性病
  const chronicConditions = (answers.chronicConditions as string[]) || [];
  if (!chronicConditions.includes('none')) {
    if (chronicConditions.includes('hypertension')) { cardioRisk += 4; brainRisk += 2; riskScore += 3; reasons.push('高血壓患者需要心血管專項檢查'); }
    if (chronicConditions.includes('diabetes')) { metabolicRisk += 4; cardioRisk += 3; riskScore += 3; reasons.push('糖尿病患者需要全面代謝評估'); }
    if (chronicConditions.includes('hyperlipidemia')) { cardioRisk += 3; metabolicRisk += 2; riskScore += 2; }
    if (chronicConditions.includes('fatty_liver')) { digestiveRisk += 3; liverRisk += 3; metabolicRisk += 2; riskScore += 2; }
  }

  // 15. 感染史（新增：核心问题）
  const infectiousHistory = (answers.infectiousHistory as string[]) || [];
  if (!infectiousHistory.includes('none')) {
    if (infectiousHistory.includes('hpylori')) { digestiveRisk += 5; cancerRisk += 3; reasons.push('幽門螺杆菌感染史，強烈建議胃鏡檢查'); }
    if (infectiousHistory.includes('hbv')) { liverRisk += 5; cancerRisk += 4; reasons.push('B肝帶原需要肝臟深度篩查'); }
    if (infectiousHistory.includes('hcv')) { liverRisk += 5; cancerRisk += 4; reasons.push('C肝感染史需要肝臟深度篩查'); }
    if (infectiousHistory.includes('hpv') && gender === 'female') { cancerRisk += 3; reasons.push('HPV感染史建議婦科檢查'); }
  }

  // 16. 既往病史
  const pastDiseases = (answers.pastDiseases as string[]) || [];
  if (!pastDiseases.includes('none')) {
    if (pastDiseases.includes('gastric_ulcer')) { digestiveRisk += 3; riskScore += 2; }
    if (pastDiseases.includes('polyps')) { digestiveRisk += 5; cancerRisk += 4; riskScore += 3; reasons.push('腸道息肉病史需定期腸鏡隨訪'); }
    if (pastDiseases.includes('thyroid_nodule')) { metabolicRisk += 2; cancerRisk += 2; riskScore += 1; }
    if (pastDiseases.includes('breast_nodule') && gender === 'female') { cancerRisk += 3; reasons.push('乳房結節需要定期追蹤'); }
    if (pastDiseases.includes('atrophic_gastritis')) { digestiveRisk += 5; cancerRisk += 4; reasons.push('萎縮性胃炎是胃癌前病變，需要胃鏡監測'); }
  }

  // 17. 用药（细化）
  const medications = (answers.medications as string[]) || [];
  if (!medications.includes('none')) {
    if (medications.includes('aspirin')) { digestiveRisk += 2; }
    if (medications.includes('antihypertensive')) { cardioRisk += 2; }
    if (medications.includes('diabetes_med')) { metabolicRisk += 2; }
    if (medications.includes('hormones') && gender === 'female') { cancerRisk += 2; }
    riskScore += medications.filter(m => m !== 'none').length;
  }

  // 18. 上次体检
  const lastCheckup = answers.lastCheckup as string;
  if (lastCheckup === 'over3years') { riskScore += 4; reasons.push('超過3年未體檢，建議全面檢查'); }
  else if (lastCheckup === '2-3years') { riskScore += 2; }
  else if (lastCheckup === '1-2years') { riskScore += 1; }

  // 19-20. 女性专属问题
  if (gender === 'female') {
    const femaleReproductive = answers.femaleReproductive as string;
    if (femaleReproductive === 'nulliparous') { cancerRisk += 2; }
    else if (femaleReproductive === 'late_first') { cancerRisk += 1; }

    const femaleMenstruation = answers.femaleMenstruation as string;
    if (femaleMenstruation === 'early_menarche' || femaleMenstruation === 'late_menopause') { cancerRisk += 2; }
    if (femaleMenstruation === 'irregular') { riskScore += 1; }
  }

  // 21. 男性专属问题
  if (gender === 'male') {
    const maleProstate = answers.maleProstate as string;
    if (maleProstate === 'elevated_psa') { cancerRisk += 4; reasons.push('PSA曾升高需要前列腺深度檢查'); }
    else if (maleProstate === 'bph') { riskScore += 2; }
    else if (maleProstate === 'symptoms') { riskScore += 2; cancerRisk += 1; }
  }

  // 22. 癌症家族史
  const familyCancer = (answers.familyCancer as string[]) || [];
  if (!familyCancer.includes('none')) {
    cancerRisk += Math.round(familyCancer.length * 3 * ageMultiplier); riskScore += familyCancer.length * 2;
    if (familyCancer.includes('gastric') || familyCancer.includes('colorectal')) { digestiveRisk += 4; reasons.push('家族有消化道癌症史，建議胃腸鏡檢查'); }
    if (familyCancer.includes('lung')) { reasons.push('家族有肺癌史，建議低劑量CT篩查'); }
    if (familyCancer.includes('liver')) { liverRisk += 4; digestiveRisk += 3; }
    if (familyCancer.includes('pancreatic')) { cancerRisk += 2; digestiveRisk += 2; }
    if (familyCancer.length >= 2) { reasons.push('多種癌症家族史，建議深度癌症篩查'); }
  }

  // 23. 女性癌症家族史
  const familyCancerFemale = (answers.familyCancerFemale as string[]) || [];
  if (!familyCancerFemale.includes('none') && gender === 'female') {
    cancerRisk += familyCancerFemale.length * 3; riskScore += familyCancerFemale.length * 2;
    if (familyCancerFemale.includes('breast')) { cancerRisk += 4; reasons.push('家族有乳腺癌史，建議乳房專項檢查'); }
    if (familyCancerFemale.includes('ovarian')) { cancerRisk += 4; }
  }

  // 24. 心血管家族史
  const familyCardio = (answers.familyCardio as string[]) || [];
  if (!familyCardio.includes('none')) {
    cardioRisk += Math.round(familyCardio.length * 3 * ageMultiplier); riskScore += familyCardio.length * 2;
    if (familyCardio.includes('heartDisease') || familyCardio.includes('stroke')) { reasons.push('家族有心腦血管疾病史，建議心臟精密檢查'); }
    if (familyCardio.includes('aneurysm')) { cardioRisk += 3; brainRisk += 3; }
  }

  // 25. 代谢家族史
  const familyMetabolic = (answers.familyMetabolic as string[]) || [];
  if (!familyMetabolic.includes('none')) {
    metabolicRisk += familyMetabolic.length * 2; riskScore += familyMetabolic.length;
    if (familyMetabolic.includes('thyroid')) { cancerRisk += 2; }
    if (familyMetabolic.includes('kidney')) { riskScore += 2; }
  }

  // 26. 消化症状
  const digestiveSymptoms = (answers.digestiveSymptoms as string[]) || [];
  if (!digestiveSymptoms.includes('none')) {
    digestiveRisk += digestiveSymptoms.length * 2; riskScore += digestiveSymptoms.length;
    if (digestiveSymptoms.includes('blood')) { digestiveRisk += 8; cancerRisk += 4; reasons.push('便血症狀需要立即進行腸鏡檢查'); }
    if (digestiveSymptoms.includes('stomachPain') || digestiveSymptoms.includes('reflux')) { reasons.push('消化不適症狀建議胃鏡檢查'); }
  }

  // 27. 心血管症状
  const cardioSymptoms = (answers.cardioSymptoms as string[]) || [];
  if (!cardioSymptoms.includes('none')) {
    cardioRisk += cardioSymptoms.length * 3; riskScore += cardioSymptoms.length * 2;
    if (cardioSymptoms.includes('chestPain')) { cardioRisk += 6; reasons.push('胸悶胸痛需要心臟精密檢查'); }
    if (cardioSymptoms.includes('breathless') || cardioSymptoms.includes('edema')) { cardioRisk += 3; }
  }

  // 28. 神经症状
  const neuroSymptoms = (answers.neuroSymptoms as string[]) || [];
  if (!neuroSymptoms.includes('none')) {
    brainRisk += neuroSymptoms.length * 2; riskScore += neuroSymptoms.length;
    if (neuroSymptoms.includes('headache') || neuroSymptoms.includes('dizziness')) { brainRisk += 3; reasons.push('神經系統症狀建議腦部MRI檢查'); }
    if (neuroSymptoms.includes('numbness')) { cardioRisk += 2; brainRisk += 2; }
    if (neuroSymptoms.includes('memory')) { brainRisk += 3; }
  }

  // 29. 泌尿症状（性别分开）
  const urinarySymptomsMale = (answers.urinarySymptomsMale as string[]) || [];
  const urinarySymptomsFemale = (answers.urinarySymptomsFemale as string[]) || [];
  if (gender === 'male' && !urinarySymptomsMale.includes('none')) {
    riskScore += urinarySymptomsMale.length;
    if (urinarySymptomsMale.length >= 2) { cancerRisk += 3; reasons.push('多項泌尿症狀建議前列腺檢查'); }
  }
  if (gender === 'female' && !urinarySymptomsFemale.includes('none')) {
    riskScore += urinarySymptomsFemale.length;
    if (urinarySymptomsFemale.includes('abnormal_bleeding')) { cancerRisk += 4; reasons.push('異常陰道出血需要婦科檢查'); }
  }

  // 30. 全身症状
  const generalSymptoms = (answers.generalSymptoms as string[]) || [];
  if (!generalSymptoms.includes('none')) {
    riskScore += generalSymptoms.length * 2;
    if (generalSymptoms.includes('weightLoss')) { cancerRisk += 5; reasons.push('無原因體重下降需要排除腫瘤'); }
    if (generalSymptoms.includes('nightSweats') || generalSymptoms.includes('fever')) { cancerRisk += 3; riskScore += 2; }
    if (generalSymptoms.includes('fatigue')) { riskScore += 1; }
  }

  // 31. 健康关注
  const concerns = (answers.concerns as string[]) || [];
  if (concerns.includes('cancer')) { cancerRisk += 4; }
  if (concerns.includes('cardio')) { cardioRisk += 4; }
  if (concerns.includes('digestive')) { digestiveRisk += 4; }
  if (concerns.includes('brain')) { brainRisk += 4; }
  if (concerns.includes('comprehensive')) { riskScore += 5; }

  // 32. 体检目的
  const purpose = answers.checkupPurpose as string;
  if (purpose === 'comprehensive') { riskScore += 5; reasons.push('您希望進行全面深度檢查'); }
  else if (purpose === 'followup') { riskScore += 3; }
  else if (purpose === 'specific') { riskScore += 2; }

  // 33. 体检深度
  const depth = answers.checkupDepth as string;
  if (depth === 'premium') { riskScore += 6; }
  else if (depth === 'advanced') { riskScore += 4; }
  else if (depth === 'standard') { riskScore += 2; }

  // 推荐逻辑（优化）
  let recommendedPackage: typeof PACKAGE_DATA[0];

  // VIP条件
  const needsVIP = riskScore >= 25 ||
                   (cancerRisk >= 12 && cardioRisk >= 8) ||
                   cancerRisk >= 15 ||
                   depth === 'premium' ||
                   (age === 'over60' && cancerRisk >= 10);

  // 心脏套餐条件
  const needsCardiac = cardioRisk >= 10 ||
                       (cardioRisk >= 8 && brainRisk >= 5) ||
                       cardioSymptoms.includes('chestPain');

  // 胃肠镜条件
  const needsGastroColono = digestiveRisk >= 12 ||
                            digestiveSymptoms.includes('blood') ||
                            pastDiseases.includes('polyps');

  // 胃镜条件
  const needsGastro = digestiveRisk >= 8 ||
                      infectiousHistory.includes('hpylori') ||
                      pastDiseases.includes('atrophic_gastritis');

  // DWIBS防癌条件（优化：无症状但有风险因素时推荐）
  const needsDWIBS = (cancerRisk >= 6 && cancerRisk < 10) &&
                     !digestiveSymptoms.some(s => s !== 'none') &&
                     !cardioSymptoms.some(s => s !== 'none') &&
                     depth !== 'basic';

  if (needsVIP) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'vip-member-course')!;
    if (!reasons.some(r => r.includes('全面'))) { reasons.push('綜合評估建議VIP全面套餐'); }
  } else if (needsCardiac) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'premium-cardiac-course')!;
    if (!reasons.some(r => r.includes('心'))) { reasons.push('心血管風險較高，建議心臟精密檢查'); }
  } else if (needsGastroColono) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'select-gastro-colonoscopy')!;
    if (!reasons.some(r => r.includes('腸'))) { reasons.push('消化系統風險較高，建議胃腸鏡檢查'); }
  } else if (needsGastro) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'select-gastroscopy')!;
    if (!reasons.some(r => r.includes('胃'))) { reasons.push('建議進行胃鏡檢查'); }
  } else if (needsDWIBS) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'dwibs-cancer-screening')!;
    reasons.push('無明顯症狀但有癌症風險因素，建議DWIBS全身防癌篩查');
  } else if (riskScore >= 15 || depth === 'advanced') {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'basic-checkup')!;
  } else if (depth === 'standard' || riskScore >= 10) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'basic-checkup')!;
  } else {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'dwibs-cancer-screening')!;
  }

  const uniqueReasons = [...new Set(reasons)];
  const finalReason = uniqueReasons.length > 0 ? uniqueReasons.slice(0, 3).join('；') : '根據您的健康狀況，這個套餐最適合您的需求';

  return { packageSlug: recommendedPackage.slug, packageName: recommendedPackage.name, price: recommendedPackage.price, reason: finalReason };
}

export default function PackageRecommenderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  // 根据答案动态过滤问题
  const visibleQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => !q.showIf || q.showIf(answers));
  }, [answers]);

  const currentQuestion = visibleQuestions[currentStep];
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100;

  const handleSelect = (value: string) => {
    if (currentQuestion.multiple) {
      const current = (answers[currentQuestion.id] as string[]) || [];
      let newValue: string[];
      if (value === 'none') { newValue = ['none']; }
      else {
        if (current.includes(value)) { newValue = current.filter(v => v !== value); }
        else { newValue = [...current.filter(v => v !== 'none'), value]; }
      }
      setAnswers({ ...answers, [currentQuestion.id]: newValue });
    } else {
      const newAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(newAnswers);
      setTimeout(() => {
        // 重新计算可见问题
        const newVisibleQuestions = ALL_QUESTIONS.filter(q => !q.showIf || q.showIf(newAnswers));
        const currentIndex = newVisibleQuestions.findIndex(q => q.id === currentQuestion.id);
        if (currentIndex < newVisibleQuestions.length - 1) {
          setCurrentStep(currentIndex + 1);
        } else {
          const result = calculateRecommendation(newAnswers);
          setRecommendation(result);
          setShowResult(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentStep < visibleQuestions.length - 1) { setCurrentStep(currentStep + 1); }
    else {
      const result = calculateRecommendation(answers);
      setRecommendation(result);
      setShowResult(true);
    }
  };

  const handleBack = () => { if (currentStep > 0) { setCurrentStep(currentStep - 1); } };

  const isOptionSelected = (value: string) => {
    if (currentQuestion.multiple) { return ((answers[currentQuestion.id] as string[]) || []).includes(value); }
    return answers[currentQuestion.id] === value;
  };

  const canProceed = () => {
    if (currentQuestion.multiple) { return ((answers[currentQuestion.id] as string[]) || []).length > 0; }
    return !!answers[currentQuestion.id];
  };

  if (showResult && recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={20} /><span>返回首頁</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">套餐推薦</h1>
            <div className="w-20"></div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur"><Sparkles className="w-10 h-10" /></div>
                <h2 className="text-3xl font-serif font-bold mb-3">為您推薦</h2>
                <p className="text-blue-100 text-sm">根據您的健康需求智能分析</p>
              </div>
            </div>
            <div className="p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{recommendation.packageName}</h3>
                <p className="text-4xl font-bold text-indigo-600">¥{recommendation.price.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">含醫療翻譯・報告翻譯・消費稅10%</p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div><p className="font-semibold text-indigo-900 mb-1">推薦理由</p><p className="text-sm text-indigo-700 leading-relaxed">{recommendation.reason}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <a href="/?page=medical" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-center">查看精密體檢</a>
                <button onClick={() => { setShowResult(false); setCurrentStep(0); setAnswers({}); }} className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors text-center">重新測試</button>
                <Link href="/" className="block w-full text-center text-gray-500 hover:text-gray-700 py-2 transition-colors">查看所有套餐</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const QuestionIcon = currentQuestion.icon;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"><ArrowLeft size={20} /><span>返回首頁</span></Link>
          <h1 className="text-lg font-bold text-gray-900">套餐推薦</h1>
          <div className="w-20"></div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4"><MessageSquare size={16} />智能套餐推薦</div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">找到最適合您的體檢方案</h1>
          <p className="text-gray-500">回答幾個簡單問題，我們為您推薦最合適的套餐</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gray-100"><div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"><QuestionIcon className="w-6 h-6 text-indigo-600" /></div>
                <div><span className="text-sm text-gray-400">問題 {currentStep + 1} / {visibleQuestions.length}</span></div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
            {currentQuestion.subtitle && <p className="text-gray-500 text-sm mb-8">{currentQuestion.subtitle}</p>}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button key={option.value} onClick={() => handleSelect(option.value)} className={`w-full p-5 rounded-xl border-2 text-left transition-all ${isOptionSelected(option.value) ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isOptionSelected(option.value) ? 'text-indigo-700' : 'text-gray-900'}`}>{option.label}</p>
                      {option.description && <p className="text-sm text-gray-500 mt-1">{option.description}</p>}
                    </div>
                    {isOptionSelected(option.value) && <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50">
            <button onClick={handleBack} disabled={currentStep === 0} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ArrowLeft size={18} />上一題</button>
            {currentQuestion.multiple && <button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold px-8 py-3 rounded-xl transition-colors">{currentStep === visibleQuestions.length - 1 ? '查看推薦結果' : '下一題'}<ArrowRight size={18} /></button>}
          </div>
        </div>
      </main>
    </div>
  );
}
