'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, User, Calendar, Heart, Target, MessageSquare, Briefcase } from 'lucide-react';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';
type I18nStr = string | Record<Language, string>;

const resolveStr = (s: I18nStr, lang: Language): string => {
  if (typeof s === 'string') return s;
  return s[lang] || s['ja'] || '';
};

const uiTranslations = {
  pageTitle: { ja: 'パッケージ推薦', 'zh-TW': '套餐推薦', 'zh-CN': '套餐推荐', en: 'Package Recommendation' } as Record<Language, string>,
  pageBadge: { ja: 'スマート推薦', 'zh-TW': '智能套餐推薦', 'zh-CN': '智能套餐推荐', en: 'Smart Recommendation' } as Record<Language, string>,
  pageHeading: { ja: '最適な健診プランを見つける', 'zh-TW': '找到最適合您的體檢方案', 'zh-CN': '找到最适合您的体检方案', en: 'Find Your Best Health Screening Plan' } as Record<Language, string>,
  pageDesc: { ja: 'いくつかの質問にお答えいただくと、最適なプランをご提案します', 'zh-TW': '回答幾個簡單問題，我們為您推薦最合適的套餐', 'zh-CN': '回答几个简单问题，我们为您推荐最合适的套餐', en: 'Answer a few questions and we\'ll recommend the best package for you' } as Record<Language, string>,
  backHome: { ja: 'ホームに戻る', 'zh-TW': '返回首頁', 'zh-CN': '返回首页', en: 'Back to Home' } as Record<Language, string>,
  questionPrefix: { ja: '問題', 'zh-TW': '問題', 'zh-CN': '问题', en: 'Question' } as Record<Language, string>,
  prevQuestion: { ja: '前の質問', 'zh-TW': '上一題', 'zh-CN': '上一题', en: 'Previous' } as Record<Language, string>,
  nextQuestion: { ja: '次の質問', 'zh-TW': '下一題', 'zh-CN': '下一题', en: 'Next' } as Record<Language, string>,
  viewResult: { ja: '推薦結果を見る', 'zh-TW': '查看推薦結果', 'zh-CN': '查看推荐结果', en: 'View Result' } as Record<Language, string>,
  resultTitle: { ja: 'あなたへの推薦', 'zh-TW': '為您推薦', 'zh-CN': '为您推荐', en: 'Recommended for You' } as Record<Language, string>,
  resultSubtitle: { ja: '健康ニーズに基づくスマート分析', 'zh-TW': '根據您的健康需求智能分析', 'zh-CN': '根据您的健康需求智能分析', en: 'Smart analysis based on your health needs' } as Record<Language, string>,
  resultReason: { ja: '推薦理由', 'zh-TW': '推薦理由', 'zh-CN': '推荐理由', en: 'Recommendation Reason' } as Record<Language, string>,
  resultViewMedical: { ja: '精密健診を見る', 'zh-TW': '查看精密體檢', 'zh-CN': '查看精密体检', en: 'View Health Screening' } as Record<Language, string>,
  resultRetry: { ja: 'もう一度テスト', 'zh-TW': '重新測試', 'zh-CN': '重新测试', en: 'Retake Test' } as Record<Language, string>,
  resultAllPackages: { ja: '全パッケージを見る', 'zh-TW': '查看所有套餐', 'zh-CN': '查看所有套餐', en: 'View All Packages' } as Record<Language, string>,
  priceNote: { ja: '医療通訳・報告翻訳・消費税10%込み', 'zh-TW': '含醫療翻譯・報告翻譯・消費稅10%', 'zh-CN': '含医疗翻译・报告翻译・消费税10%', en: 'Includes medical interpreter, report translation, 10% tax' } as Record<Language, string>,
};

interface RecommendationResult {
  packageSlug: string;
  packageName: I18nStr;
  reason: I18nStr;
  price: number;
}

interface QuestionOption {
  value: string;
  label: I18nStr;
  description?: I18nStr;
}

interface Question {
  id: string;
  title: I18nStr;
  subtitle?: I18nStr;
  icon: any;
  options: QuestionOption[];
  multiple?: boolean;
  showIf?: (answers: Record<string, string | string[]>) => boolean;
}

const ALL_QUESTIONS: Question[] = [
  // ========== 基本信息 (1-4) ==========
  {
    id: 'age',
    title: { ja: 'ご年齢は？', 'zh-TW': '您的年齡範圍是？', 'zh-CN': '您的年龄范围是？', en: 'What is your age range?' } as Record<Language, string>,
    subtitle: { ja: '年齢層により健康上の注目点が異なります', 'zh-TW': '不同年齡段有不同的健康關注重點', 'zh-CN': '不同年龄段有不同的健康关注重点', en: 'Different age groups have different health focus areas' } as Record<Language, string>,
    icon: User,
    options: [
      { value: 'under30', label: { ja: '30歳未満', 'zh-TW': '30歲以下', 'zh-CN': '30岁以下', en: 'Under 30' } as Record<Language, string>, description: { ja: '基礎検査を推奨', 'zh-TW': '建議基礎檢查', 'zh-CN': '建议基础检查', en: 'Basic screening recommended' } as Record<Language, string> },
      { value: '30-40', label: { ja: '30〜40歳', 'zh-TW': '30-40歲', 'zh-CN': '30-40岁', en: '30-40 years old' } as Record<Language, string>, description: { ja: '代謝指標に注目開始', 'zh-TW': '開始關注代謝指標', 'zh-CN': '开始关注代谢指标', en: 'Start monitoring metabolic indicators' } as Record<Language, string> },
      { value: '40-50', label: { ja: '40〜50歳', 'zh-TW': '40-50歲', 'zh-CN': '40-50岁', en: '40-50 years old' } as Record<Language, string>, description: { ja: '腫瘍マーカー追加を推奨', 'zh-TW': '建議增加腫瘤標記物', 'zh-CN': '建议增加肿瘤标记物', en: 'Tumor markers recommended' } as Record<Language, string> },
      { value: '50-60', label: { ja: '50〜60歳', 'zh-TW': '50-60歲', 'zh-CN': '50-60岁', en: '50-60 years old' } as Record<Language, string>, description: { ja: '総合スクリーニングを推奨', 'zh-TW': '建議全面篩查', 'zh-CN': '建议全面筛查', en: 'Comprehensive screening recommended' } as Record<Language, string> },
      { value: 'over60', label: { ja: '60歳以上', 'zh-TW': '60歲以上', 'zh-CN': '60岁以上', en: 'Over 60' } as Record<Language, string>, description: { ja: '精密検査を推奨', 'zh-TW': '建議深度體檢', 'zh-CN': '建议深度体检', en: 'In-depth examination recommended' } as Record<Language, string> },
    ]
  },
  {
    id: 'gender',
    title: { ja: '性別は？', 'zh-TW': '您的性別是？', 'zh-CN': '您的性别是？', en: 'What is your gender?' } as Record<Language, string>,
    subtitle: { ja: '一部の検査項目は性別により異なります', 'zh-TW': '部分檢查項目有性別差異', 'zh-CN': '部分检查项目有性别差异', en: 'Some examination items differ by gender' } as Record<Language, string>,
    icon: User,
    options: [
      { value: 'male', label: { ja: '男性', 'zh-TW': '男性', 'zh-CN': '男性', en: 'Male' } as Record<Language, string> },
      { value: 'female', label: { ja: '女性', 'zh-TW': '女性', 'zh-CN': '女性', en: 'Female' } as Record<Language, string> },
    ]
  },
  {
    id: 'bmi',
    title: { ja: '体重の状況は？', 'zh-TW': '您的體重狀況如何？', 'zh-CN': '您的体重状况如何？', en: 'What is your weight status?' } as Record<Language, string>,
    subtitle: { ja: 'BMIは多くの疾患リスクに影響します', 'zh-TW': 'BMI會影響多種疾病風險', 'zh-CN': 'BMI会影响多种疾病风险', en: 'BMI affects the risk of various diseases' } as Record<Language, string>,
    icon: User,
    options: [
      { value: 'underweight', label: { ja: 'やせ型 (BMI<18.5)', 'zh-TW': '偏瘦 (BMI<18.5)', 'zh-CN': '偏瘦 (BMI<18.5)', en: 'Underweight (BMI<18.5)' } as Record<Language, string>, description: { ja: '栄養評価が必要な場合あり', 'zh-TW': '可能需要營養評估', 'zh-CN': '可能需要营养评估', en: 'Nutritional assessment may be needed' } as Record<Language, string> },
      { value: 'normal', label: { ja: '標準 (BMI 18.5-24)', 'zh-TW': '正常 (BMI 18.5-24)', 'zh-CN': '正常 (BMI 18.5-24)', en: 'Normal (BMI 18.5-24)' } as Record<Language, string>, description: { ja: '健康的な体重を維持', 'zh-TW': '保持健康體重', 'zh-CN': '保持健康体重', en: 'Maintain healthy weight' } as Record<Language, string> },
      { value: 'overweight', label: { ja: '過体重 (BMI 24-28)', 'zh-TW': '超重 (BMI 24-28)', 'zh-CN': '超重 (BMI 24-28)', en: 'Overweight (BMI 24-28)' } as Record<Language, string>, description: { ja: '代謝関連検査を推奨', 'zh-TW': '建議代謝相關檢查', 'zh-CN': '建议代谢相关检查', en: 'Metabolic screening recommended' } as Record<Language, string> },
      { value: 'obese', label: { ja: '肥満 (BMI>28)', 'zh-TW': '肥胖 (BMI>28)', 'zh-CN': '肥胖 (BMI>28)', en: 'Obese (BMI>28)' } as Record<Language, string>, description: { ja: '心血管・代謝に注意が必要', 'zh-TW': '需關注心血管及代謝', 'zh-CN': '需关注心血管及代谢', en: 'Cardiovascular and metabolic attention needed' } as Record<Language, string> },
    ]
  },
  {
    id: 'waistCircumference',
    title: { ja: 'ウエスト周囲径は？', 'zh-TW': '您的腰圍情況如何？', 'zh-CN': '您的腰围情况如何？', en: 'What is your waist circumference?' } as Record<Language, string>,
    subtitle: { ja: '腹部脂肪はメタボリックシンドロームと密接に関連します', 'zh-TW': '腹部脂肪與代謝綜合征密切相關', 'zh-CN': '腹部脂肪与代谢综合征密切相关', en: 'Abdominal fat is closely related to metabolic syndrome' } as Record<Language, string>,
    icon: User,
    options: [
      { value: 'normal', label: { ja: '正常範囲', 'zh-TW': '正常範圍', 'zh-CN': '正常范围', en: 'Normal range' } as Record<Language, string>, description: { ja: '男性<90cm、女性<80cm', 'zh-TW': '男<90cm，女<80cm', 'zh-CN': '男<90cm，女<80cm', en: 'Male<90cm, Female<80cm' } as Record<Language, string> },
      { value: 'borderline', label: { ja: '境界値', 'zh-TW': '臨界值', 'zh-CN': '临界值', en: 'Borderline' } as Record<Language, string>, description: { ja: '基準上限に近い', 'zh-TW': '接近標準上限', 'zh-CN': '接近标准上限', en: 'Near the upper limit' } as Record<Language, string> },
      { value: 'high', label: { ja: '基準超過', 'zh-TW': '超標', 'zh-CN': '超标', en: 'Above standard' } as Record<Language, string>, description: { ja: '男性≥90cm、女性≥80cm', 'zh-TW': '男≥90cm，女≥80cm', 'zh-CN': '男≥90cm，女≥80cm', en: 'Male≥90cm, Female≥80cm' } as Record<Language, string> },
      { value: 'unknown', label: { ja: '不明', 'zh-TW': '不確定', 'zh-CN': '不确定', en: 'Not sure' } as Record<Language, string> },
    ]
  },
  // ========== 生活習慣 (5-11) ==========
  {
    id: 'smoking',
    title: { ja: '喫煙されますか？', 'zh-TW': '您是否吸煙？', 'zh-CN': '您是否吸烟？', en: 'Do you smoke?' } as Record<Language, string>,
    subtitle: { ja: '喫煙は多くの疾患の重要なリスク要因です', 'zh-TW': '吸煙是多種疾病的重要風險因素', 'zh-CN': '吸烟是多种疾病的重要风险因素', en: 'Smoking is an important risk factor for many diseases' } as Record<Language, string>,
    icon: Heart,
    options: [
      { value: 'never', label: { ja: '喫煙歴なし', 'zh-TW': '從不吸煙', 'zh-CN': '从不吸烟', en: 'Never smoked' } as Record<Language, string> },
      { value: 'quit_long', label: { ja: '禁煙5年以上', 'zh-TW': '已戒煙超過5年', 'zh-CN': '已戒烟超过5年', en: 'Quit over 5 years ago' } as Record<Language, string> },
      { value: 'quit_recent', label: { ja: '禁煙5年未満', 'zh-TW': '戒煙不足5年', 'zh-CN': '戒烟不足5年', en: 'Quit less than 5 years ago' } as Record<Language, string> },
      { value: 'occasional', label: { ja: 'たまに喫煙', 'zh-TW': '偶爾吸煙', 'zh-CN': '偶尔吸烟', en: 'Occasional smoker' } as Record<Language, string>, description: { ja: '週5本未満', 'zh-TW': '每週少於5根', 'zh-CN': '每周少于5根', en: 'Less than 5 per week' } as Record<Language, string> },
      { value: 'regular', label: { ja: '日常的に喫煙', 'zh-TW': '經常吸煙', 'zh-CN': '经常吸烟', en: 'Regular smoker' } as Record<Language, string>, description: { ja: '毎日喫煙', 'zh-TW': '每天吸煙', 'zh-CN': '每天吸烟', en: 'Smokes daily' } as Record<Language, string> },
    ]
  },
  {
    id: 'smokingYears',
    title: { ja: '喫煙歴はどのくらいですか？', 'zh-TW': '您的吸煙史有多長？', 'zh-CN': '您的吸烟史有多长？', en: 'How long is your smoking history?' } as Record<Language, string>,
    subtitle: { ja: '禁煙した年数も含みます', 'zh-TW': '包括已戒煙的年數', 'zh-CN': '包括已戒烟的年数', en: 'Including years since quitting' } as Record<Language, string>,
    icon: Heart,
    showIf: (answers) => answers.smoking !== 'never',
    options: [
      { value: 'under10', label: { ja: '10年未満', 'zh-TW': '10年以下', 'zh-CN': '10年以下', en: 'Less than 10 years' } as Record<Language, string> },
      { value: '10-20', label: { ja: '10〜20年', 'zh-TW': '10-20年', 'zh-CN': '10-20年', en: '10-20 years' } as Record<Language, string> },
      { value: 'over20', label: { ja: '20年以上', 'zh-TW': '20年以上', 'zh-CN': '20年以上', en: 'Over 20 years' } as Record<Language, string>, description: { ja: '肺がんリスクが著しく増加', 'zh-TW': '肺癌風險顯著增加', 'zh-CN': '肺癌风险显著增加', en: 'Lung cancer risk significantly increased' } as Record<Language, string> },
    ]
  },
  {
    id: 'drinking',
    title: { ja: '飲酒習慣は？', 'zh-TW': '您的飲酒習慣如何？', 'zh-CN': '您的饮酒习惯如何？', en: 'What are your drinking habits?' } as Record<Language, string>,
    subtitle: { ja: '飲酒は肝臓や心血管の健康に影響します', 'zh-TW': '飲酒會影響肝臟及心血管健康', 'zh-CN': '饮酒会影响肝脏及心血管健康', en: 'Drinking affects liver and cardiovascular health' } as Record<Language, string>,
    icon: Heart,
    options: [
      { value: 'never', label: { ja: '飲酒しない', 'zh-TW': '從不飲酒', 'zh-CN': '从不饮酒', en: 'Never drink' } as Record<Language, string> },
      { value: 'occasional', label: { ja: 'たまに飲む', 'zh-TW': '偶爾小酌', 'zh-CN': '偶尔小酌', en: 'Occasional drinker' } as Record<Language, string>, description: { ja: '週1〜2回', 'zh-TW': '每週1-2次', 'zh-CN': '每周1-2次', en: '1-2 times per week' } as Record<Language, string> },
      { value: 'regular', label: { ja: '頻繁に飲む', 'zh-TW': '經常飲酒', 'zh-CN': '经常饮酒', en: 'Regular drinker' } as Record<Language, string>, description: { ja: '週3回以上', 'zh-TW': '每週3次以上', 'zh-CN': '每周3次以上', en: '3+ times per week' } as Record<Language, string> },
      { value: 'heavy', label: { ja: '毎日飲む', 'zh-TW': '每日飲酒', 'zh-CN': '每日饮酒', en: 'Daily drinker' } as Record<Language, string>, description: { ja: '肝機能検査を推奨', 'zh-TW': '建議肝功能檢查', 'zh-CN': '建议肝功能检查', en: 'Liver function test recommended' } as Record<Language, string> },
    ]
  },
  {
    id: 'exercise',
    title: { ja: '運動習慣は？', 'zh-TW': '您的運動習慣如何？', 'zh-CN': '您的运动习惯如何？', en: 'What are your exercise habits?' } as Record<Language, string>,
    subtitle: { ja: '運動は心肺機能と代謝に重要です', 'zh-TW': '運動對心肺功能和代謝很重要', 'zh-CN': '运动对心肺功能和代谢很重要', en: 'Exercise is important for cardiopulmonary function and metabolism' } as Record<Language, string>,
    icon: Heart,
    options: [
      { value: 'sedentary', label: { ja: '運動不足', 'zh-TW': '久坐不動', 'zh-CN': '久坐不动', en: 'Sedentary' } as Record<Language, string>, description: { ja: '週1回未満', 'zh-TW': '每週運動少於1次', 'zh-CN': '每周运动少于1次', en: 'Less than once a week' } as Record<Language, string> },
      { value: 'light', label: { ja: '軽い運動', 'zh-TW': '輕度運動', 'zh-CN': '轻度运动', en: 'Light exercise' } as Record<Language, string>, description: { ja: '週1〜2回', 'zh-TW': '每週1-2次', 'zh-CN': '每周1-2次', en: '1-2 times per week' } as Record<Language, string> },
      { value: 'moderate', label: { ja: '適度な運動', 'zh-TW': '適度運動', 'zh-CN': '适度运动', en: 'Moderate exercise' } as Record<Language, string>, description: { ja: '週3〜4回', 'zh-TW': '每週3-4次', 'zh-CN': '每周3-4次', en: '3-4 times per week' } as Record<Language, string> },
      { value: 'active', label: { ja: '積極的に運動', 'zh-TW': '積極運動', 'zh-CN': '积极运动', en: 'Active exercise' } as Record<Language, string>, description: { ja: '週5回以上', 'zh-TW': '每週5次以上', 'zh-CN': '每周5次以上', en: '5+ times per week' } as Record<Language, string> },
    ]
  },
  {
    id: 'dietAndSalt',
    title: { ja: '食事の習慣は？', 'zh-TW': '您的飲食習慣如何？', 'zh-CN': '您的饮食习惯如何？', en: 'What are your dietary habits?' } as Record<Language, string>,
    subtitle: { ja: '食習慣は消化器系、代謝、血圧に影響します', 'zh-TW': '飲食習慣影響消化系統、代謝和血壓', 'zh-CN': '饮食习惯影响消化系统、代谢和血压', en: 'Dietary habits affect digestive system, metabolism, and blood pressure' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'balanced', label: { ja: 'バランスの良い食事', 'zh-TW': '均衡飲食', 'zh-CN': '均衡饮食', en: 'Balanced diet' } as Record<Language, string>, description: { ja: '野菜・果物・肉類のバランスが良い', 'zh-TW': '蔬果肉類搭配合理', 'zh-CN': '蔬果肉类搭配合理', en: 'Good balance of vegetables, fruits, and meat' } as Record<Language, string> },
      { value: 'meat_heavy', label: { ja: '肉食中心', 'zh-TW': '偏好肉食', 'zh-CN': '偏好肉食', en: 'Meat-heavy diet' } as Record<Language, string>, description: { ja: '野菜の摂取が少ない', 'zh-TW': '蔬菜攝入較少', 'zh-CN': '蔬菜摄入较少', en: 'Low vegetable intake' } as Record<Language, string> },
      { value: 'irregular', label: { ja: '不規則な食事', 'zh-TW': '飲食不規律', 'zh-CN': '饮食不规律', en: 'Irregular diet' } as Record<Language, string>, description: { ja: '外食や付き合いが多い', 'zh-TW': '經常外食或應酬', 'zh-CN': '经常外食或应酬', en: 'Frequent dining out or social eating' } as Record<Language, string> },
      { value: 'processed', label: { ja: '加工食品中心', 'zh-TW': '加工食品為主', 'zh-CN': '加工食品为主', en: 'Mostly processed food' } as Record<Language, string>, description: { ja: '高塩分・高脂肪の食事', 'zh-TW': '高鹽高油飲食', 'zh-CN': '高盐高油饮食', en: 'High salt, high fat diet' } as Record<Language, string> },
      { value: 'heavy_salt', label: { ja: '濃い味付けが好き', 'zh-TW': '口味偏重', 'zh-CN': '口味偏重', en: 'Prefer strong flavors' } as Record<Language, string>, description: { ja: '塩辛い食べ物が好き', 'zh-TW': '喜歡重鹹食物', 'zh-CN': '喜欢重咸食物', en: 'Prefer salty foods' } as Record<Language, string> },
    ]
  },
  {
    id: 'sleep',
    title: { ja: '睡眠の質は？', 'zh-TW': '您的睡眠質量如何？', 'zh-CN': '您的睡眠质量如何？', en: 'How is your sleep quality?' } as Record<Language, string>,
    subtitle: { ja: '睡眠は免疫力と全体的な健康に影響します', 'zh-TW': '睡眠影響免疫力和整體健康', 'zh-CN': '睡眠影响免疫力和整体健康', en: 'Sleep affects immunity and overall health' } as Record<Language, string>,
    icon: Calendar,
    options: [
      { value: 'good', label: { ja: '良好', 'zh-TW': '睡眠良好', 'zh-CN': '睡眠良好', en: 'Good sleep' } as Record<Language, string>, description: { ja: '毎晩7〜8時間', 'zh-TW': '每晚7-8小時', 'zh-CN': '每晚7-8小时', en: '7-8 hours per night' } as Record<Language, string> },
      { value: 'fair', label: { ja: '時々不眠', 'zh-TW': '偶爾失眠', 'zh-CN': '偶尔失眠', en: 'Occasional insomnia' } as Record<Language, string>, description: { ja: '入眠困難または中途覚醒', 'zh-TW': '入睡困難或易醒', 'zh-CN': '入睡困难或易醒', en: 'Difficulty falling asleep or waking easily' } as Record<Language, string> },
      { value: 'poor', label: { ja: '睡眠不良', 'zh-TW': '睡眠較差', 'zh-CN': '睡眠较差', en: 'Poor sleep' } as Record<Language, string>, description: { ja: '頻繁に不眠', 'zh-TW': '經常失眠', 'zh-CN': '经常失眠', en: 'Frequent insomnia' } as Record<Language, string> },
      { value: 'very_poor', label: { ja: '睡眠が非常に悪い', 'zh-TW': '睡眠很差', 'zh-CN': '睡眠很差', en: 'Very poor sleep' } as Record<Language, string>, description: { ja: '慢性的に6時間未満', 'zh-TW': '長期睡眠不足6小時', 'zh-CN': '长期睡眠不足6小时', en: 'Chronically less than 6 hours' } as Record<Language, string> },
    ]
  },
  {
    id: 'snoring',
    title: { ja: 'いびきはありますか？', 'zh-TW': '您是否有打鼾問題？', 'zh-CN': '您是否有打鼾问题？', en: 'Do you have a snoring problem?' } as Record<Language, string>,
    subtitle: { ja: 'いびきは睡眠時無呼吸症候群と関連する可能性があります', 'zh-TW': '打鼾可能與睡眠呼吸暫停相關', 'zh-CN': '打鼾可能与睡眠呼吸暂停相关', en: 'Snoring may be related to sleep apnea' } as Record<Language, string>,
    icon: Calendar,
    options: [
      { value: 'no', label: { ja: 'いびきなし', 'zh-TW': '沒有打鼾', 'zh-CN': '没有打鼾', en: 'No snoring' } as Record<Language, string> },
      { value: 'occasional', label: { ja: 'たまにいびき', 'zh-TW': '偶爾打鼾', 'zh-CN': '偶尔打鼾', en: 'Occasional snoring' } as Record<Language, string> },
      { value: 'frequent', label: { ja: '頻繁にいびき', 'zh-TW': '經常打鼾', 'zh-CN': '经常打鼾', en: 'Frequent snoring' } as Record<Language, string>, description: { ja: 'パートナーからの指摘', 'zh-TW': '伴侶反映', 'zh-CN': '伴侣反映', en: 'Reported by partner' } as Record<Language, string> },
      { value: 'apnea', label: { ja: '重度いびき/無呼吸', 'zh-TW': '嚴重打鼾/呼吸暫停', 'zh-CN': '严重打鼾/呼吸暂停', en: 'Severe snoring/apnea' } as Record<Language, string>, description: { ja: '心肺検査が必要', 'zh-TW': '需要心肺檢查', 'zh-CN': '需要心肺检查', en: 'Cardiopulmonary examination needed' } as Record<Language, string> },
    ]
  },
  // ========== 工作與環境 (12-14) ==========
  {
    id: 'workStyle',
    title: { ja: 'お仕事の内容は？', 'zh-TW': '您的工作性質如何？', 'zh-CN': '您的工作性质如何？', en: 'What is the nature of your work?' } as Record<Language, string>,
    subtitle: { ja: '職場環境は健康リスクに影響します', 'zh-TW': '工作環境會影響健康風險', 'zh-CN': '工作环境会影响健康风险', en: 'Work environment affects health risks' } as Record<Language, string>,
    icon: Briefcase,
    options: [
      { value: 'desk', label: { ja: 'デスクワーク', 'zh-TW': '辦公室工作', 'zh-CN': '办公室工作', en: 'Desk work' } as Record<Language, string>, description: { ja: '長時間の座位', 'zh-TW': '長期坐姿', 'zh-CN': '长期坐姿', en: 'Prolonged sitting' } as Record<Language, string> },
      { value: 'active', label: { ja: '動き回る仕事', 'zh-TW': '需要走動', 'zh-CN': '需要走动', en: 'Active work' } as Record<Language, string>, description: { ja: '適度な活動あり', 'zh-TW': '適度活動', 'zh-CN': '适度活动', en: 'Moderate activity' } as Record<Language, string> },
      { value: 'physical', label: { ja: '肉体労働', 'zh-TW': '體力勞動', 'zh-CN': '体力劳动', en: 'Physical labor' } as Record<Language, string>, description: { ja: '体力消耗が大きい', 'zh-TW': '較大體力消耗', 'zh-CN': '较大体力消耗', en: 'High physical exertion' } as Record<Language, string> },
      { value: 'shift', label: { ja: 'シフト勤務', 'zh-TW': '輪班工作', 'zh-CN': '轮班工作', en: 'Shift work' } as Record<Language, string>, description: { ja: '不規則な生活リズム', 'zh-TW': '作息不規律', 'zh-CN': '作息不规律', en: 'Irregular schedule' } as Record<Language, string> },
    ]
  },
  {
    id: 'occupationalExposure',
    title: { ja: '職場で以下の環境に接触しますか？', 'zh-TW': '您的工作是否接觸以下環境？', 'zh-CN': '您的工作是否接触以下环境？', en: 'Are you exposed to any of the following at work?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、職業性曝露は特定疾患のリスクを高めます', 'zh-TW': '可多選，職業暴露會增加特定疾病風險', 'zh-CN': '可多选，职业暴露会增加特定疾病风险', en: 'Select all that apply. Occupational exposure increases specific disease risks' } as Record<Language, string>,
    icon: Briefcase,
    multiple: true,
    options: [
      { value: 'chemicals', label: { ja: '化学物質', 'zh-TW': '化學物質', 'zh-CN': '化学物质', en: 'Chemicals' } as Record<Language, string>, description: { ja: '有機溶剤、農薬など', 'zh-TW': '有機溶劑、農藥等', 'zh-CN': '有机溶剂、农药等', en: 'Organic solvents, pesticides, etc.' } as Record<Language, string> },
      { value: 'radiation', label: { ja: '放射線環境', 'zh-TW': '輻射環境', 'zh-CN': '辐射环境', en: 'Radiation' } as Record<Language, string>, description: { ja: 'X線、CTなど', 'zh-TW': 'X光、CT等', 'zh-CN': 'X光、CT等', en: 'X-ray, CT, etc.' } as Record<Language, string> },
      { value: 'dust', label: { ja: '粉塵環境', 'zh-TW': '粉塵環境', 'zh-CN': '粉尘环境', en: 'Dust environment' } as Record<Language, string>, description: { ja: '鉱山、建設現場など', 'zh-TW': '礦場、建築工地等', 'zh-CN': '矿场、建筑工地等', en: 'Mines, construction sites, etc.' } as Record<Language, string> },
      { value: 'asbestos', label: { ja: 'アスベスト接触歴', 'zh-TW': '石棉接觸史', 'zh-CN': '石棉接触史', en: 'Asbestos exposure history' } as Record<Language, string>, description: { ja: '古い建物の改修など', 'zh-TW': '老舊建築裝修等', 'zh-CN': '老旧建筑装修等', en: 'Old building renovations, etc.' } as Record<Language, string> },
      { value: 'none', label: { ja: '特に職業性曝露なし', 'zh-TW': '無特殊職業暴露', 'zh-CN': '无特殊职业暴露', en: 'No special occupational exposure' } as Record<Language, string> },
    ]
  },
  {
    id: 'stressLevel',
    title: { ja: 'ストレスの程度は？', 'zh-TW': '您的壓力程度如何？', 'zh-CN': '您的压力程度如何？', en: 'What is your stress level?' } as Record<Language, string>,
    subtitle: { ja: '慢性的なストレスは心血管系と免疫系に影響します', 'zh-TW': '長期壓力影響心血管和免疫系統', 'zh-CN': '长期压力影响心血管和免疫系统', en: 'Chronic stress affects cardiovascular and immune systems' } as Record<Language, string>,
    icon: Calendar,
    options: [
      { value: 'low', label: { ja: 'ストレス少ない', 'zh-TW': '壓力較小', 'zh-CN': '压力较小', en: 'Low stress' } as Record<Language, string>, description: { ja: 'リラックスした生活', 'zh-TW': '生活輕鬆', 'zh-CN': '生活轻松', en: 'Relaxed lifestyle' } as Record<Language, string> },
      { value: 'moderate', label: { ja: '適度なストレス', 'zh-TW': '適度壓力', 'zh-CN': '适度压力', en: 'Moderate stress' } as Record<Language, string>, description: { ja: '対処可能', 'zh-TW': '可以應對', 'zh-CN': '可以应对', en: 'Manageable' } as Record<Language, string> },
      { value: 'high', label: { ja: 'ストレス大きい', 'zh-TW': '壓力較大', 'zh-CN': '压力较大', en: 'High stress' } as Record<Language, string>, description: { ja: 'よく不安を感じる', 'zh-TW': '經常感到焦慮', 'zh-CN': '经常感到焦虑', en: 'Often feel anxious' } as Record<Language, string> },
      { value: 'severe', label: { ja: 'ストレス非常に大きい', 'zh-TW': '壓力很大', 'zh-CN': '压力很大', en: 'Severe stress' } as Record<Language, string>, description: { ja: '生活に深刻な影響', 'zh-TW': '嚴重影響生活', 'zh-CN': '严重影响生活', en: 'Severely affects daily life' } as Record<Language, string> },
    ]
  },
  // ========== 既往病史 (15-20) ==========
  {
    id: 'chronicConditions',
    title: { ja: '以下の慢性疾患はありますか？', 'zh-TW': '您是否有以下慢性疾病？', 'zh-CN': '您是否有以下慢性疾病？', en: 'Do you have any of the following chronic conditions?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、健康状態を把握します', 'zh-TW': '可多選，了解您的健康狀況', 'zh-CN': '可多选，了解您的健康状况', en: 'Select all that apply to understand your health status' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'hypertension', label: { ja: '高血圧', 'zh-TW': '高血壓', 'zh-CN': '高血压', en: 'Hypertension' } as Record<Language, string>, description: { ja: '心血管検査が必要', 'zh-TW': '需要心血管檢查', 'zh-CN': '需要心血管检查', en: 'Cardiovascular examination needed' } as Record<Language, string> },
      { value: 'diabetes', label: { ja: '糖尿病', 'zh-TW': '糖尿病', 'zh-CN': '糖尿病', en: 'Diabetes' } as Record<Language, string>, description: { ja: '代謝関連検査が必要', 'zh-TW': '需要代謝相關檢查', 'zh-CN': '需要代谢相关检查', en: 'Metabolic examination needed' } as Record<Language, string> },
      { value: 'hyperlipidemia', label: { ja: '脂質異常症', 'zh-TW': '高血脂', 'zh-CN': '高血脂', en: 'Hyperlipidemia' } as Record<Language, string>, description: { ja: '血中脂質検査が必要', 'zh-TW': '需要血脂檢測', 'zh-CN': '需要血脂检测', en: 'Blood lipid testing needed' } as Record<Language, string> },
      { value: 'fatty_liver', label: { ja: '脂肪肝', 'zh-TW': '脂肪肝', 'zh-CN': '脂肪肝', en: 'Fatty liver' } as Record<Language, string>, description: { ja: '肝機能検査が必要', 'zh-TW': '需要肝功能檢查', 'zh-CN': '需要肝功能检查', en: 'Liver function test needed' } as Record<Language, string> },
      { value: 'none', label: { ja: '慢性疾患なし', 'zh-TW': '無慢性疾病', 'zh-CN': '无慢性疾病', en: 'No chronic conditions' } as Record<Language, string> },
    ]
  },
  {
    id: 'infectiousHistory',
    title: { ja: '以下の感染歴はありますか？', 'zh-TW': '您是否有以下感染史？', 'zh-CN': '您是否有以下感染史？', en: 'Do you have any of the following infection history?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、これらの感染はがんリスクに関連します', 'zh-TW': '可多選，這些感染與癌症風險相關', 'zh-CN': '可多选，这些感染与癌症风险相关', en: 'Select all that apply. These infections are related to cancer risk' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'hpylori', label: { ja: 'ピロリ菌(Hp)感染', 'zh-TW': '幽門螺杆菌(Hp)感染', 'zh-CN': '幽门螺杆菌(Hp)感染', en: 'H. pylori (Hp) infection' } as Record<Language, string>, description: { ja: '胃がんのリスク因子', 'zh-TW': '胃癌風險因素', 'zh-CN': '胃癌风险因素', en: 'Gastric cancer risk factor' } as Record<Language, string> },
      { value: 'hbv', label: { ja: 'B型肝炎キャリア/既感染', 'zh-TW': 'B型肝炎帶原者/曾感染', 'zh-CN': 'B型肝炎携带者/曾感染', en: 'Hepatitis B carrier/prior infection' } as Record<Language, string>, description: { ja: '肝がんのリスク因子', 'zh-TW': '肝癌風險因素', 'zh-CN': '肝癌风险因素', en: 'Liver cancer risk factor' } as Record<Language, string> },
      { value: 'hcv', label: { ja: 'C型肝炎感染歴', 'zh-TW': 'C型肝炎感染史', 'zh-CN': 'C型肝炎感染史', en: 'Hepatitis C infection history' } as Record<Language, string>, description: { ja: '肝がんのリスク因子', 'zh-TW': '肝癌風險因素', 'zh-CN': '肝癌风险因素', en: 'Liver cancer risk factor' } as Record<Language, string> },
      { value: 'hpv', label: { ja: 'HPV感染歴（女性）', 'zh-TW': 'HPV感染史（女性）', 'zh-CN': 'HPV感染史（女性）', en: 'HPV infection history (female)' } as Record<Language, string>, description: { ja: '子宮頸がんリスク', 'zh-TW': '子宮頸癌風險', 'zh-CN': '子宫颈癌风险', en: 'Cervical cancer risk' } as Record<Language, string> },
      { value: 'none', label: { ja: '上記感染歴なし/不明', 'zh-TW': '無以上感染史/不確定', 'zh-CN': '无以上感染史/不确定', en: 'None of the above/unsure' } as Record<Language, string> },
    ]
  },
  {
    id: 'pastDiseases',
    title: { ja: '以下の疾患にかかったことはありますか？', 'zh-TW': '您是否曾患過以下疾病？', 'zh-CN': '您是否曾患过以下疾病？', en: 'Have you ever had any of the following conditions?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、既往歴はスクリーニングの重点に影響します', 'zh-TW': '可多選，既往病史影響篩查重點', 'zh-CN': '可多选，既往病史影响筛查重点', en: 'Select all that apply. Past medical history affects screening priorities' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'gastric_ulcer', label: { ja: '胃潰瘍/十二指腸潰瘍', 'zh-TW': '胃潰瘍/十二指腸潰瘍', 'zh-CN': '胃溃疡/十二指肠溃疡', en: 'Gastric/duodenal ulcer' } as Record<Language, string> },
      { value: 'polyps', label: { ja: '大腸ポリープ', 'zh-TW': '腸道息肉', 'zh-CN': '肠道息肉', en: 'Intestinal polyps' } as Record<Language, string>, description: { ja: '定期的な大腸内視鏡フォロー必要', 'zh-TW': '需定期腸鏡隨訪', 'zh-CN': '需定期肠镜随访', en: 'Regular colonoscopy follow-up needed' } as Record<Language, string> },
      { value: 'thyroid_nodule', label: { ja: '甲状腺結節', 'zh-TW': '甲狀腺結節', 'zh-CN': '甲状腺结节', en: 'Thyroid nodule' } as Record<Language, string>, description: { ja: '経過観察が必要', 'zh-TW': '需要追蹤', 'zh-CN': '需要追踪', en: 'Follow-up needed' } as Record<Language, string> },
      { value: 'breast_nodule', label: { ja: '乳房結節/線維腺腫', 'zh-TW': '乳房結節/纖維腺瘤', 'zh-CN': '乳房结节/纤维腺瘤', en: 'Breast nodule/fibroadenoma' } as Record<Language, string>, description: { ja: '女性は経過観察必要', 'zh-TW': '女性需追蹤', 'zh-CN': '女性需追踪', en: 'Follow-up needed for women' } as Record<Language, string> },
      { value: 'atrophic_gastritis', label: { ja: '萎縮性胃炎', 'zh-TW': '萎縮性胃炎', 'zh-CN': '萎缩性胃炎', en: 'Atrophic gastritis' } as Record<Language, string>, description: { ja: '胃がん前がん病変', 'zh-TW': '胃癌前病變', 'zh-CN': '胃癌前病变', en: 'Precancerous lesion for gastric cancer' } as Record<Language, string> },
      { value: 'none', label: { ja: '特記すべき病歴なし', 'zh-TW': '無特殊病史', 'zh-CN': '无特殊病史', en: 'No significant medical history' } as Record<Language, string> },
    ]
  },
  {
    id: 'medications',
    title: { ja: '以下の薬を長期服用していますか？', 'zh-TW': '您是否長期服用以下藥物？', 'zh-CN': '您是否长期服用以下药物？', en: 'Are you taking any of the following medications long-term?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、一部の薬は健診に影響したり健康問題を示唆します', 'zh-TW': '可多選，某些藥物可能影響體檢或提示健康問題', 'zh-CN': '可多选，某些药物可能影响体检或提示健康问题', en: 'Select all that apply. Some medications may affect examinations or indicate health issues' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'aspirin', label: { ja: 'アスピリン/抗血小板薬', 'zh-TW': '阿司匹林/抗血小板藥', 'zh-CN': '阿司匹林/抗血小板药', en: 'Aspirin/antiplatelet drugs' } as Record<Language, string>, description: { ja: '消化管出血リスクに注意', 'zh-TW': '需注意消化道出血風險', 'zh-CN': '需注意消化道出血风险', en: 'Watch for GI bleeding risk' } as Record<Language, string> },
      { value: 'antihypertensive', label: { ja: '降圧薬', 'zh-TW': '降血壓藥', 'zh-CN': '降血压药', en: 'Antihypertensive medication' } as Record<Language, string> },
      { value: 'diabetes_med', label: { ja: '血糖降下薬/インスリン', 'zh-TW': '降血糖藥/胰島素', 'zh-CN': '降血糖药/胰岛素', en: 'Glucose-lowering drugs/insulin' } as Record<Language, string> },
      { value: 'hormones', label: { ja: 'ホルモン製剤', 'zh-TW': '激素類藥物', 'zh-CN': '激素类药物', en: 'Hormone medications' } as Record<Language, string>, description: { ja: '経口避妊薬、HRTを含む', 'zh-TW': '包括避孕藥、HRT', 'zh-CN': '包括避孕药、HRT', en: 'Including contraceptives, HRT' } as Record<Language, string> },
      { value: 'none', label: { ja: '長期服薬なし', 'zh-TW': '無長期服藥', 'zh-CN': '无长期服药', en: 'No long-term medications' } as Record<Language, string> },
    ]
  },
  {
    id: 'lastCheckup',
    title: { ja: '最後に総合健診を受けたのはいつですか？', 'zh-TW': '您上次全面體檢是什麼時候？', 'zh-CN': '您上次全面体检是什么时候？', en: 'When was your last comprehensive checkup?' } as Record<Language, string>,
    subtitle: { ja: '健診頻度を把握します', 'zh-TW': '了解您的體檢頻率', 'zh-CN': '了解您的体检频率', en: 'Understanding your checkup frequency' } as Record<Language, string>,
    icon: Calendar,
    options: [
      { value: 'within1year', label: { ja: '1年以内', 'zh-TW': '1年內', 'zh-CN': '1年内', en: 'Within 1 year' } as Record<Language, string>, description: { ja: '良い習慣を維持', 'zh-TW': '保持良好習慣', 'zh-CN': '保持良好习惯', en: 'Maintain good habits' } as Record<Language, string> },
      { value: '1-2years', label: { ja: '1〜2年前', 'zh-TW': '1-2年前', 'zh-CN': '1-2年前', en: '1-2 years ago' } as Record<Language, string>, description: { ja: '定期検査を推奨', 'zh-TW': '建議定期檢查', 'zh-CN': '建议定期检查', en: 'Regular checkup recommended' } as Record<Language, string> },
      { value: '2-3years', label: { ja: '2〜3年前', 'zh-TW': '2-3年前', 'zh-CN': '2-3年前', en: '2-3 years ago' } as Record<Language, string>, description: { ja: 'できるだけ早く検査を推奨', 'zh-TW': '建議儘快檢查', 'zh-CN': '建议尽快检查', en: 'Checkup recommended soon' } as Record<Language, string> },
      { value: 'over3years', label: { ja: '3年以上/受けたことがない', 'zh-TW': '3年以上/從未', 'zh-CN': '3年以上/从未', en: 'Over 3 years/never' } as Record<Language, string>, description: { ja: '総合検査を強く推奨', 'zh-TW': '強烈建議全面檢查', 'zh-CN': '强烈建议全面检查', en: 'Comprehensive checkup strongly recommended' } as Record<Language, string> },
    ]
  },
  // ========== 女性專屬問題 (21-22) ==========
  {
    id: 'femaleReproductive',
    title: { ja: '出産歴は？', 'zh-TW': '您的生育情況如何？', 'zh-CN': '您的生育情况如何？', en: 'What is your reproductive history?' } as Record<Language, string>,
    subtitle: { ja: '出産歴は女性のがんリスクに関連します', 'zh-TW': '生育史與女性癌症風險相關', 'zh-CN': '生育史与女性癌症风险相关', en: 'Reproductive history is related to female cancer risk' } as Record<Language, string>,
    icon: User,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'nulliparous', label: { ja: '出産経験なし', 'zh-TW': '未生育', 'zh-CN': '未生育', en: 'No pregnancies' } as Record<Language, string>, description: { ja: '乳がんリスクがやや高い', 'zh-TW': '乳腺癌風險略高', 'zh-CN': '乳腺癌风险略高', en: 'Slightly higher breast cancer risk' } as Record<Language, string> },
      { value: 'late_first', label: { ja: '30歳以降に初産', 'zh-TW': '30歲後首次生育', 'zh-CN': '30岁后首次生育', en: 'First birth after 30' } as Record<Language, string> },
      { value: 'normal', label: { ja: '30歳前に出産', 'zh-TW': '30歲前已生育', 'zh-CN': '30岁前已生育', en: 'First birth before 30' } as Record<Language, string> },
      { value: 'multiple', label: { ja: '多産（3回以上）', 'zh-TW': '多次生育（3次以上）', 'zh-CN': '多次生育（3次以上）', en: 'Multiple births (3+)' } as Record<Language, string> },
    ]
  },
  {
    id: 'femaleMenstruation',
    title: { ja: '月経/更年期の状況は？', 'zh-TW': '您的月經/更年期情況如何？', 'zh-CN': '您的月经/更年期情况如何？', en: 'What is your menstrual/menopausal status?' } as Record<Language, string>,
    subtitle: { ja: 'エストロゲン曝露期間は女性のがんリスクに関連します', 'zh-TW': '雌激素暴露時間與女性癌症風險相關', 'zh-CN': '雌激素暴露时间与女性癌症风险相关', en: 'Estrogen exposure duration is related to female cancer risk' } as Record<Language, string>,
    icon: User,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'regular', label: { ja: '月経規則的', 'zh-TW': '月經規律', 'zh-CN': '月经规律', en: 'Regular menstruation' } as Record<Language, string>, description: { ja: '周期正常', 'zh-TW': '週期正常', 'zh-CN': '周期正常', en: 'Normal cycle' } as Record<Language, string> },
      { value: 'irregular', label: { ja: '月経不規則', 'zh-TW': '月經不規律', 'zh-CN': '月经不规律', en: 'Irregular menstruation' } as Record<Language, string>, description: { ja: '婦人科検査が必要', 'zh-TW': '需要婦科檢查', 'zh-CN': '需要妇科检查', en: 'Gynecological examination needed' } as Record<Language, string> },
      { value: 'early_menarche', label: { ja: '初経が早い（<12歳）', 'zh-TW': '初經較早（<12歲）', 'zh-CN': '初经较早（<12岁）', en: 'Early menarche (<12 years)' } as Record<Language, string>, description: { ja: 'エストロゲン曝露が長い', 'zh-TW': '雌激素暴露較長', 'zh-CN': '雌激素暴露较长', en: 'Longer estrogen exposure' } as Record<Language, string> },
      { value: 'menopause', label: { ja: '閉経済み', 'zh-TW': '已停經', 'zh-CN': '已停经', en: 'Postmenopausal' } as Record<Language, string> },
      { value: 'late_menopause', label: { ja: '閉経が遅い（>55歳）', 'zh-TW': '停經較晚（>55歲）', 'zh-CN': '停经较晚（>55岁）', en: 'Late menopause (>55 years)' } as Record<Language, string>, description: { ja: 'エストロゲン曝露が長い', 'zh-TW': '雌激素暴露較長', 'zh-CN': '雌激素暴露较长', en: 'Longer estrogen exposure' } as Record<Language, string> },
    ]
  },
  // ========== 男性專屬問題 (23) ==========
  {
    id: 'maleProstate',
    title: { ja: '前立腺に関する問題はありますか？', 'zh-TW': '您是否有前列腺相關問題？', 'zh-CN': '您是否有前列腺相关问题？', en: 'Do you have any prostate-related issues?' } as Record<Language, string>,
    subtitle: { ja: '前立腺の問題は中高年男性に多く見られます', 'zh-TW': '前列腺問題在中老年男性中常見', 'zh-CN': '前列腺问题在中老年男性中常见', en: 'Prostate issues are common in middle-aged and older men' } as Record<Language, string>,
    icon: User,
    showIf: (answers) => answers.gender === 'male',
    options: [
      { value: 'none', label: { ja: '関連問題なし', 'zh-TW': '無相關問題', 'zh-CN': '无相关问题', en: 'No related issues' } as Record<Language, string> },
      { value: 'bph', label: { ja: '前立腺肥大症', 'zh-TW': '良性前列腺增生', 'zh-CN': '良性前列腺增生', en: 'Benign prostatic hyperplasia' } as Record<Language, string>, description: { ja: '診断済み', 'zh-TW': '已確診', 'zh-CN': '已确诊', en: 'Diagnosed' } as Record<Language, string> },
      { value: 'elevated_psa', label: { ja: 'PSA高値の既往', 'zh-TW': 'PSA曾經升高', 'zh-CN': 'PSA曾经升高', en: 'Previously elevated PSA' } as Record<Language, string>, description: { ja: '経過観察が必要', 'zh-TW': '需要追蹤', 'zh-CN': '需要追踪', en: 'Follow-up needed' } as Record<Language, string> },
      { value: 'symptoms', label: { ja: '排尿症状あるが未検査', 'zh-TW': '有排尿症狀但未檢查', 'zh-CN': '有排尿症状但未检查', en: 'Urinary symptoms but not examined' } as Record<Language, string> },
    ]
  },
  // ========== 家族病史 (24-27) ==========
  {
    id: 'familyCancer',
    title: { ja: '直系親族にがんの既往はありますか？', 'zh-TW': '您的直系親屬是否有癌症病史？', 'zh-CN': '您的直系亲属是否有癌症病史？', en: 'Do your immediate family members have a history of cancer?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、がんの家族歴は発症リスクを高めます', 'zh-TW': '可多選，家族癌症史會增加患病風險', 'zh-CN': '可多选，家族癌症史会增加患病风险', en: 'Select all that apply. Family cancer history increases disease risk' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'lung', label: { ja: '肺がん', 'zh-TW': '肺癌', 'zh-CN': '肺癌', en: 'Lung cancer' } as Record<Language, string>, description: { ja: '低線量CTスクリーニングを推奨', 'zh-TW': '建議低劑量CT篩查', 'zh-CN': '建议低剂量CT筛查', en: 'Low-dose CT screening recommended' } as Record<Language, string> },
      { value: 'gastric', label: { ja: '胃がん', 'zh-TW': '胃癌', 'zh-CN': '胃癌', en: 'Gastric cancer' } as Record<Language, string>, description: { ja: '胃内視鏡検査を推奨', 'zh-TW': '建議胃鏡檢查', 'zh-CN': '建议胃镜检查', en: 'Gastroscopy recommended' } as Record<Language, string> },
      { value: 'colorectal', label: { ja: '大腸がん', 'zh-TW': '大腸癌', 'zh-CN': '大肠癌', en: 'Colorectal cancer' } as Record<Language, string>, description: { ja: '大腸内視鏡検査を推奨', 'zh-TW': '建議腸鏡檢查', 'zh-CN': '建议肠镜检查', en: 'Colonoscopy recommended' } as Record<Language, string> },
      { value: 'liver', label: { ja: '肝がん', 'zh-TW': '肝癌', 'zh-CN': '肝癌', en: 'Liver cancer' } as Record<Language, string>, description: { ja: '肝機能・超音波検査を推奨', 'zh-TW': '建議肝功能及超聲波', 'zh-CN': '建议肝功能及超声波', en: 'Liver function and ultrasound recommended' } as Record<Language, string> },
      { value: 'pancreatic', label: { ja: '膵がん', 'zh-TW': '胰臟癌', 'zh-CN': '胰腺癌', en: 'Pancreatic cancer' } as Record<Language, string>, description: { ja: '早期発見が困難', 'zh-TW': '難以早期發現', 'zh-CN': '难以早期发现', en: 'Difficult to detect early' } as Record<Language, string> },
      { value: 'none', label: { ja: 'がんの家族歴なし', 'zh-TW': '無癌症家族史', 'zh-CN': '无癌症家族史', en: 'No family cancer history' } as Record<Language, string> },
    ]
  },
  {
    id: 'familyCancerFemale',
    title: { ja: '家族の女性に以下のがんはありますか？', 'zh-TW': '家族中女性是否有以下癌症？', 'zh-CN': '家族中女性是否有以下癌症？', en: 'Do female family members have any of the following cancers?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、女性特有がんの家族歴', 'zh-TW': '可多選，女性特有癌症的家族史', 'zh-CN': '可多选，女性特有癌症的家族史', en: 'Select all that apply. Family history of female-specific cancers' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'breast', label: { ja: '乳がん', 'zh-TW': '乳腺癌', 'zh-CN': '乳腺癌', en: 'Breast cancer' } as Record<Language, string>, description: { ja: '乳房検査を推奨', 'zh-TW': '建議乳房檢查', 'zh-CN': '建议乳房检查', en: 'Breast examination recommended' } as Record<Language, string> },
      { value: 'ovarian', label: { ja: '卵巣がん', 'zh-TW': '卵巢癌', 'zh-CN': '卵巢癌', en: 'Ovarian cancer' } as Record<Language, string> },
      { value: 'cervical', label: { ja: '子宮頸がん', 'zh-TW': '子宮頸癌', 'zh-CN': '子宫颈癌', en: 'Cervical cancer' } as Record<Language, string> },
      { value: 'uterine', label: { ja: '子宮体がん', 'zh-TW': '子宮內膜癌', 'zh-CN': '子宫内膜癌', en: 'Endometrial cancer' } as Record<Language, string> },
      { value: 'none', label: { ja: '女性がんの家族歴なし', 'zh-TW': '無女性癌症家族史', 'zh-CN': '无女性癌症家族史', en: 'No female cancer family history' } as Record<Language, string> },
    ]
  },
  {
    id: 'familyCardio',
    title: { ja: '直系親族に心脳血管疾患はありますか？', 'zh-TW': '您的直系親屬是否有心腦血管疾病？', 'zh-CN': '您的直系亲属是否有心脑血管疾病？', en: 'Do your immediate family members have cardiovascular/cerebrovascular diseases?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、家族歴は発症リスクに影響します', 'zh-TW': '可多選，家族史會影響發病風險', 'zh-CN': '可多选，家族史会影响发病风险', en: 'Select all that apply. Family history affects disease risk' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'heartDisease', label: { ja: '心臓病', 'zh-TW': '心臟病', 'zh-CN': '心脏病', en: 'Heart disease' } as Record<Language, string>, description: { ja: '冠動脈疾患、心筋梗塞など', 'zh-TW': '冠心病、心肌梗塞等', 'zh-CN': '冠心病、心肌梗塞等', en: 'Coronary heart disease, myocardial infarction, etc.' } as Record<Language, string> },
      { value: 'stroke', label: { ja: '脳卒中', 'zh-TW': '中風', 'zh-CN': '中风', en: 'Stroke' } as Record<Language, string>, description: { ja: '脳梗塞、脳出血', 'zh-TW': '腦梗塞、腦出血', 'zh-CN': '脑梗塞、脑出血', en: 'Cerebral infarction, cerebral hemorrhage' } as Record<Language, string> },
      { value: 'hypertension', label: { ja: '高血圧', 'zh-TW': '高血壓', 'zh-CN': '高血压', en: 'Hypertension' } as Record<Language, string>, description: { ja: '長期の高血圧', 'zh-TW': '長期高血壓', 'zh-CN': '长期高血压', en: 'Chronic hypertension' } as Record<Language, string> },
      { value: 'aneurysm', label: { ja: '動脈瘤', 'zh-TW': '動脈瘤', 'zh-CN': '动脉瘤', en: 'Aneurysm' } as Record<Language, string>, description: { ja: '血管検査が必要', 'zh-TW': '需要血管檢查', 'zh-CN': '需要血管检查', en: 'Vascular examination needed' } as Record<Language, string> },
      { value: 'none', label: { ja: '心脳血管疾患の家族歴なし', 'zh-TW': '無心腦血管家族史', 'zh-CN': '无心脑血管家族史', en: 'No cardiovascular/cerebrovascular family history' } as Record<Language, string> },
    ]
  },
  {
    id: 'familyMetabolic',
    title: { ja: '直系親族に代謝関連疾患はありますか？', 'zh-TW': '您的直系親屬是否有代謝相關疾病？', 'zh-CN': '您的直系亲属是否有代谢相关疾病？', en: 'Do your immediate family members have metabolic diseases?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、代謝疾患は遺伝的傾向があります', 'zh-TW': '可多選，代謝疾病有遺傳傾向', 'zh-CN': '可多选，代谢疾病有遗传倾向', en: 'Select all that apply. Metabolic diseases have genetic tendencies' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'diabetes', label: { ja: '糖尿病', 'zh-TW': '糖尿病', 'zh-CN': '糖尿病', en: 'Diabetes' } as Record<Language, string>, description: { ja: '1型または2型糖尿病', 'zh-TW': '1型或2型糖尿病', 'zh-CN': '1型或2型糖尿病', en: 'Type 1 or type 2 diabetes' } as Record<Language, string> },
      { value: 'thyroid', label: { ja: '甲状腺疾患', 'zh-TW': '甲狀腺疾病', 'zh-CN': '甲状腺疾病', en: 'Thyroid disease' } as Record<Language, string>, description: { ja: 'バセドウ病、橋本病、甲状腺がん', 'zh-TW': '甲亢、甲減、甲狀腺癌', 'zh-CN': '甲亢、甲减、甲状腺癌', en: 'Hyperthyroidism, hypothyroidism, thyroid cancer' } as Record<Language, string> },
      { value: 'gout', label: { ja: '痛風', 'zh-TW': '痛風', 'zh-CN': '痛风', en: 'Gout' } as Record<Language, string>, description: { ja: '高尿酸血症', 'zh-TW': '尿酸過高', 'zh-CN': '尿酸过高', en: 'High uric acid' } as Record<Language, string> },
      { value: 'kidney', label: { ja: '腎臓病', 'zh-TW': '腎病', 'zh-CN': '肾病', en: 'Kidney disease' } as Record<Language, string>, description: { ja: '慢性腎臓病または腎不全', 'zh-TW': '慢性腎病或腎衰竭', 'zh-CN': '慢性肾病或肾衰竭', en: 'Chronic kidney disease or renal failure' } as Record<Language, string> },
      { value: 'none', label: { ja: '代謝疾患の家族歴なし', 'zh-TW': '無代謝疾病家族史', 'zh-CN': '无代谢疾病家族史', en: 'No metabolic disease family history' } as Record<Language, string> },
    ]
  },
  // ========== 當前症狀 (28-32) ==========
  {
    id: 'digestiveSymptoms',
    title: { ja: '消化器系の症状はありますか？', 'zh-TW': '您是否有消化系統相關症狀？', 'zh-CN': '您是否有消化系统相关症状？', en: 'Do you have any digestive system symptoms?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、胃腸内視鏡検査が必要な場合があります', 'zh-TW': '可多選，這些症狀可能需要胃腸鏡檢查', 'zh-CN': '可多选，这些症状可能需要胃肠镜检查', en: 'Select all that apply. These symptoms may require endoscopy' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'reflux', label: { ja: '胃酸逆流/胸やけ', 'zh-TW': '胃酸倒流/燒心', 'zh-CN': '胃酸倒流/烧心', en: 'Acid reflux/heartburn' } as Record<Language, string>, description: { ja: '食後に不快感', 'zh-TW': '進食後感到不適', 'zh-CN': '进食后感到不适', en: 'Discomfort after eating' } as Record<Language, string> },
      { value: 'bloating', label: { ja: '腹部膨満/消化不良', 'zh-TW': '腹脹/消化不良', 'zh-CN': '腹胀/消化不良', en: 'Bloating/indigestion' } as Record<Language, string>, description: { ja: 'よくお腹が張る', 'zh-TW': '經常感到脹氣', 'zh-CN': '经常感到胀气', en: 'Frequent bloating' } as Record<Language, string> },
      { value: 'stomachPain', label: { ja: '胃痛/腹痛', 'zh-TW': '胃痛/腹痛', 'zh-CN': '胃痛/腹痛', en: 'Stomach/abdominal pain' } as Record<Language, string>, description: { ja: '繰り返し発生', 'zh-TW': '反覆發作', 'zh-CN': '反复发作', en: 'Recurring episodes' } as Record<Language, string> },
      { value: 'bowelChange', label: { ja: '排便習慣の変化', 'zh-TW': '排便習慣改變', 'zh-CN': '排便习惯改变', en: 'Change in bowel habits' } as Record<Language, string>, description: { ja: '便秘または下痢', 'zh-TW': '便秘或腹瀉', 'zh-CN': '便秘或腹泻', en: 'Constipation or diarrhea' } as Record<Language, string> },
      { value: 'blood', label: { ja: '血便/黒色便', 'zh-TW': '便血/黑便', 'zh-CN': '便血/黑便', en: 'Blood in stool/black stool' } as Record<Language, string>, description: { ja: '早急な検査が必要', 'zh-TW': '需要立即檢查', 'zh-CN': '需要立即检查', en: 'Immediate examination needed' } as Record<Language, string> },
      { value: 'none', label: { ja: '消化器症状なし', 'zh-TW': '無消化系統症狀', 'zh-CN': '无消化系统症状', en: 'No digestive symptoms' } as Record<Language, string> },
    ]
  },
  {
    id: 'cardioSymptoms',
    title: { ja: '心血管系の症状はありますか？', 'zh-TW': '您是否有心血管相關症狀？', 'zh-CN': '您是否有心血管相关症状？', en: 'Do you have any cardiovascular symptoms?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、心臓検査が必要な場合があります', 'zh-TW': '可多選，這些症狀需要心臟檢查', 'zh-CN': '可多选，这些症状需要心脏检查', en: 'Select all that apply. These symptoms require cardiac examination' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'chestPain', label: { ja: '胸の圧迫感/胸痛', 'zh-TW': '胸悶/胸痛', 'zh-CN': '胸闷/胸痛', en: 'Chest tightness/pain' } as Record<Language, string>, description: { ja: '活動時または安静時に発生', 'zh-TW': '活動或休息時發生', 'zh-CN': '活动或休息时发生', en: 'During activity or at rest' } as Record<Language, string> },
      { value: 'palpitation', label: { ja: '動悸/不整脈', 'zh-TW': '心悸/心跳不規則', 'zh-CN': '心悸/心跳不规则', en: 'Palpitations/irregular heartbeat' } as Record<Language, string>, description: { ja: '心拍が速い、飛ぶ感じ', 'zh-TW': '感覺心跳很快或漏跳', 'zh-CN': '感觉心跳很快或漏跳', en: 'Rapid or skipped heartbeats' } as Record<Language, string> },
      { value: 'breathless', label: { ja: '息切れ/呼吸困難', 'zh-TW': '氣促/呼吸困難', 'zh-CN': '气促/呼吸困难', en: 'Shortness of breath' } as Record<Language, string>, description: { ja: '軽い活動で息切れ', 'zh-TW': '輕度活動即感喘', 'zh-CN': '轻度活动即感喘', en: 'Breathless with light activity' } as Record<Language, string> },
      { value: 'edema', label: { ja: '下肢浮腫', 'zh-TW': '下肢水腫', 'zh-CN': '下肢水肿', en: 'Lower limb edema' } as Record<Language, string>, description: { ja: '足首やふくらはぎのむくみ', 'zh-TW': '腳踝或小腿浮腫', 'zh-CN': '脚踝或小腿浮肿', en: 'Swollen ankles or calves' } as Record<Language, string> },
      { value: 'none', label: { ja: '心血管症状なし', 'zh-TW': '無心血管症狀', 'zh-CN': '无心血管症状', en: 'No cardiovascular symptoms' } as Record<Language, string> },
    ]
  },
  {
    id: 'neuroSymptoms',
    title: { ja: '神経系の症状はありますか？', 'zh-TW': '您是否有神經系統相關症狀？', 'zh-CN': '您是否有神经系统相关症状？', en: 'Do you have any neurological symptoms?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、脳の検査が必要な場合があります', 'zh-TW': '可多選，這些症狀可能需要腦部檢查', 'zh-CN': '可多选，这些症状可能需要脑部检查', en: 'Select all that apply. These symptoms may require brain examination' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'headache', label: { ja: '頻繁な頭痛', 'zh-TW': '經常頭痛', 'zh-CN': '经常头痛', en: 'Frequent headaches' } as Record<Language, string>, description: { ja: '繰り返す頭痛', 'zh-TW': '反覆發作的頭痛', 'zh-CN': '反复发作的头痛', en: 'Recurring headaches' } as Record<Language, string> },
      { value: 'dizziness', label: { ja: 'めまい', 'zh-TW': '頭暈/眩暈', 'zh-CN': '头晕/眩晕', en: 'Dizziness/vertigo' } as Record<Language, string>, description: { ja: 'よくめまいを感じる', 'zh-TW': '經常感到頭暈', 'zh-CN': '经常感到头晕', en: 'Frequently feel dizzy' } as Record<Language, string> },
      { value: 'numbness', label: { ja: '手足のしびれ', 'zh-TW': '手腳麻木', 'zh-CN': '手脚麻木', en: 'Numbness in hands/feet' } as Record<Language, string>, description: { ja: '感覚異常', 'zh-TW': '感覺異常', 'zh-CN': '感觉异常', en: 'Abnormal sensation' } as Record<Language, string> },
      { value: 'memory', label: { ja: '記憶力低下', 'zh-TW': '記憶力下降', 'zh-CN': '记忆力下降', en: 'Memory decline' } as Record<Language, string>, description: { ja: '明らかな物忘れ', 'zh-TW': '明顯健忘', 'zh-CN': '明显健忘', en: 'Noticeable forgetfulness' } as Record<Language, string> },
      { value: 'none', label: { ja: '神経系症状なし', 'zh-TW': '無神經系統症狀', 'zh-CN': '无神经系统症状', en: 'No neurological symptoms' } as Record<Language, string> },
    ]
  },
  {
    id: 'urinarySymptomsMale',
    title: { ja: '泌尿器系の症状はありますか？', 'zh-TW': '您是否有泌尿系統相關症狀？', 'zh-CN': '您是否有泌尿系统相关症状？', en: 'Do you have any urinary symptoms?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、前立腺検査が必要な場合があります', 'zh-TW': '可多選，這些症狀可能需要前列腺檢查', 'zh-CN': '可多选，这些症状可能需要前列腺检查', en: 'Select all that apply. These symptoms may require prostate examination' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    showIf: (answers) => answers.gender === 'male',
    options: [
      { value: 'frequency', label: { ja: '頻尿', 'zh-TW': '頻尿', 'zh-CN': '频尿', en: 'Frequent urination' } as Record<Language, string>, description: { ja: '排尿回数の増加', 'zh-TW': '排尿次數增多', 'zh-CN': '排尿次数增多', en: 'Increased urination frequency' } as Record<Language, string> },
      { value: 'urgency', label: { ja: '尿意切迫', 'zh-TW': '尿急', 'zh-CN': '尿急', en: 'Urinary urgency' } as Record<Language, string>, description: { ja: 'コントロールが困難', 'zh-TW': '難以控制', 'zh-CN': '难以控制', en: 'Difficult to control' } as Record<Language, string> },
      { value: 'difficulty', label: { ja: '排尿困難', 'zh-TW': '排尿困難', 'zh-CN': '排尿困难', en: 'Difficulty urinating' } as Record<Language, string>, description: { ja: '尿線が細い・途切れる', 'zh-TW': '尿流細或中斷', 'zh-CN': '尿流细或中断', en: 'Weak or interrupted stream' } as Record<Language, string> },
      { value: 'nocturia', label: { ja: '夜間頻尿', 'zh-TW': '夜尿增多', 'zh-CN': '夜尿增多', en: 'Nocturia' } as Record<Language, string>, description: { ja: '夜間に何度も起きる', 'zh-TW': '夜間多次起床', 'zh-CN': '夜间多次起床', en: 'Waking multiple times at night' } as Record<Language, string> },
      { value: 'none', label: { ja: '泌尿器症状なし', 'zh-TW': '無泌尿系統症狀', 'zh-CN': '无泌尿系统症状', en: 'No urinary symptoms' } as Record<Language, string> },
    ]
  },
  {
    id: 'urinarySymptomsFemale',
    title: { ja: '泌尿器/婦人科の症状はありますか？', 'zh-TW': '您是否有泌尿/婦科相關症狀？', 'zh-CN': '您是否有泌尿/妇科相关症状？', en: 'Do you have any urinary/gynecological symptoms?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、婦人科検査が必要な場合があります', 'zh-TW': '可多選，這些症狀可能需要婦科檢查', 'zh-CN': '可多选，这些症状可能需要妇科检查', en: 'Select all that apply. These symptoms may require gynecological examination' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    showIf: (answers) => answers.gender === 'female',
    options: [
      { value: 'frequency', label: { ja: '頻尿/尿意切迫', 'zh-TW': '頻尿/尿急', 'zh-CN': '频尿/尿急', en: 'Frequent urination/urgency' } as Record<Language, string> },
      { value: 'abnormal_bleeding', label: { ja: '不正性器出血', 'zh-TW': '異常陰道出血', 'zh-CN': '异常阴道出血', en: 'Abnormal vaginal bleeding' } as Record<Language, string>, description: { ja: '月経以外の出血', 'zh-TW': '非經期出血', 'zh-CN': '非经期出血', en: 'Bleeding outside of periods' } as Record<Language, string> },
      { value: 'discharge', label: { ja: '異常なおりもの', 'zh-TW': '異常分泌物', 'zh-CN': '异常分泌物', en: 'Abnormal discharge' } as Record<Language, string> },
      { value: 'pelvic_pain', label: { ja: '骨盤痛', 'zh-TW': '盆腔疼痛', 'zh-CN': '盆腔疼痛', en: 'Pelvic pain' } as Record<Language, string> },
      { value: 'none', label: { ja: '関連症状なし', 'zh-TW': '無相關症狀', 'zh-CN': '无相关症状', en: 'No related symptoms' } as Record<Language, string> },
    ]
  },
  {
    id: 'generalSymptoms',
    title: { ja: 'その他の全身症状はありますか？', 'zh-TW': '您是否有其他全身性症狀？', 'zh-CN': '您是否有其他全身性症状？', en: 'Do you have any other systemic symptoms?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、全体的な健康状態を反映する可能性があります', 'zh-TW': '可多選，這些症狀可能反映整體健康', 'zh-CN': '可多选，这些症状可能反映整体健康', en: 'Select all that apply. These symptoms may reflect overall health' } as Record<Language, string>,
    icon: Heart,
    multiple: true,
    options: [
      { value: 'fatigue', label: { ja: '持続的な疲労', 'zh-TW': '持續疲勞', 'zh-CN': '持续疲劳', en: 'Persistent fatigue' } as Record<Language, string>, description: { ja: '休んでも疲れが取れない', 'zh-TW': '休息後仍感疲倦', 'zh-CN': '休息后仍感疲倦', en: 'Still tired after rest' } as Record<Language, string> },
      { value: 'weightLoss', label: { ja: '体重減少', 'zh-TW': '體重下降', 'zh-CN': '体重下降', en: 'Weight loss' } as Record<Language, string>, description: { ja: '原因不明の減少', 'zh-TW': '無原因的減輕', 'zh-CN': '无原因的减轻', en: 'Unexplained weight loss' } as Record<Language, string> },
      { value: 'weightGain', label: { ja: '体重増加', 'zh-TW': '體重增加', 'zh-CN': '体重增加', en: 'Weight gain' } as Record<Language, string>, description: { ja: '原因不明の増加', 'zh-TW': '無原因的增加', 'zh-CN': '无原因的增加', en: 'Unexplained weight gain' } as Record<Language, string> },
      { value: 'nightSweats', label: { ja: '寝汗', 'zh-TW': '盜汗', 'zh-CN': '盗汗', en: 'Night sweats' } as Record<Language, string>, description: { ja: '夜間の大量発汗', 'zh-TW': '夜間大量出汗', 'zh-CN': '夜间大量出汗', en: 'Heavy sweating at night' } as Record<Language, string> },
      { value: 'fever', label: { ja: '原因不明の発熱', 'zh-TW': '不明原因發燒', 'zh-CN': '不明原因发烧', en: 'Unexplained fever' } as Record<Language, string>, description: { ja: '繰り返す微熱', 'zh-TW': '反覆低燒', 'zh-CN': '反复低烧', en: 'Recurring low-grade fever' } as Record<Language, string> },
      { value: 'none', label: { ja: 'その他の不調なし', 'zh-TW': '無其他不適', 'zh-CN': '无其他不适', en: 'No other discomfort' } as Record<Language, string> },
    ]
  },
  // ========== 健康目標 (33-35) ==========
  {
    id: 'concerns',
    title: { ja: '最も関心のある健康検査項目は？', 'zh-TW': '您最關注的健康檢查項目是？', 'zh-CN': '您最关注的健康检查项目是？', en: 'Which health examination areas concern you most?' } as Record<Language, string>,
    subtitle: { ja: '複数選択可、最適なプランの推薦に役立ちます', 'zh-TW': '可多選，幫助我們推薦更適合的套餐', 'zh-CN': '可多选，帮助我们推荐更适合的套餐', en: 'Select all that apply to help us recommend the best package' } as Record<Language, string>,
    icon: Target,
    multiple: true,
    options: [
      { value: 'cancer', label: { ja: 'がん早期スクリーニング', 'zh-TW': '癌症早期篩查', 'zh-CN': '癌症早期筛查', en: 'Early cancer screening' } as Record<Language, string>, description: { ja: 'PET-CT、腫瘍マーカー', 'zh-TW': 'PET-CT、腫瘤標記物', 'zh-CN': 'PET-CT、肿瘤标记物', en: 'PET-CT, tumor markers' } as Record<Language, string> },
      { value: 'cardio', label: { ja: '心血管の健康', 'zh-TW': '心血管健康', 'zh-CN': '心血管健康', en: 'Cardiovascular health' } as Record<Language, string>, description: { ja: '心エコー、冠動脈CT', 'zh-TW': '心臟超音波、冠狀動脈CT', 'zh-CN': '心脏超声波、冠状动脉CT', en: 'Cardiac ultrasound, coronary CT' } as Record<Language, string> },
      { value: 'digestive', label: { ja: '消化器系', 'zh-TW': '消化系統', 'zh-CN': '消化系统', en: 'Digestive system' } as Record<Language, string>, description: { ja: '胃腸内視鏡検査', 'zh-TW': '胃腸鏡檢查', 'zh-CN': '胃肠镜检查', en: 'Gastroscopy and colonoscopy' } as Record<Language, string> },
      { value: 'brain', label: { ja: '脳の健康', 'zh-TW': '腦部健康', 'zh-CN': '脑部健康', en: 'Brain health' } as Record<Language, string>, description: { ja: '脳MRI/MRA', 'zh-TW': '腦部MRI/MRA', 'zh-CN': '脑部MRI/MRA', en: 'Brain MRI/MRA' } as Record<Language, string> },
      { value: 'comprehensive', label: { ja: '総合健診', 'zh-TW': '全面體檢', 'zh-CN': '全面体检', en: 'Comprehensive checkup' } as Record<Language, string>, description: { ja: '各システムの総合検査', 'zh-TW': '各系統綜合檢查', 'zh-CN': '各系统综合检查', en: 'All-system comprehensive examination' } as Record<Language, string> },
    ]
  },
  {
    id: 'checkupPurpose',
    title: { ja: '今回の健診の主な目的は？', 'zh-TW': '您此次體檢的主要目的是？', 'zh-CN': '您此次体检的主要目的是？', en: 'What is the main purpose of this checkup?' } as Record<Language, string>,
    subtitle: { ja: 'ニーズを把握し、最適なプランを提供します', 'zh-TW': '了解您的需求，提供最佳方案', 'zh-CN': '了解您的需求，提供最佳方案', en: 'Understanding your needs to provide the best plan' } as Record<Language, string>,
    icon: Target,
    options: [
      { value: 'routine', label: { ja: '定期的な健康維持', 'zh-TW': '定期健康維護', 'zh-CN': '定期健康维护', en: 'Routine health maintenance' } as Record<Language, string>, description: { ja: '予防が中心', 'zh-TW': '預防為主', 'zh-CN': '预防为主', en: 'Prevention-focused' } as Record<Language, string> },
      { value: 'specific', label: { ja: '特定の問題に対応', 'zh-TW': '針對特定問題', 'zh-CN': '针对特定问题', en: 'Address specific concerns' } as Record<Language, string>, description: { ja: '明確な検査目標あり', 'zh-TW': '有明確的檢查目標', 'zh-CN': '有明确的检查目标', en: 'Have specific examination goals' } as Record<Language, string> },
      { value: 'followup', label: { ja: '既往問題のフォロー', 'zh-TW': '既往問題追蹤', 'zh-CN': '既往问题追踪', en: 'Follow-up on existing issues' } as Record<Language, string>, description: { ja: '既知の健康問題を監視', 'zh-TW': '監測已知健康問題', 'zh-CN': '监测已知健康问题', en: 'Monitor known health issues' } as Record<Language, string> },
      { value: 'comprehensive', label: { ja: '総合的な精密検査', 'zh-TW': '全面深度檢查', 'zh-CN': '全面深度检查', en: 'Comprehensive in-depth examination' } as Record<Language, string>, description: { ja: '最も全面的に把握したい', 'zh-TW': '想要最全面的了解', 'zh-CN': '想要最全面的了解', en: 'Want the most thorough understanding' } as Record<Language, string> },
    ]
  },
  {
    id: 'checkupDepth',
    title: { ja: 'ご希望の検査の深さは？', 'zh-TW': '您希望體檢的深度如何？', 'zh-CN': '您希望体检的深度如何？', en: 'What level of examination depth do you prefer?' } as Record<Language, string>,
    subtitle: { ja: 'ニーズに応じた検査深度をお選びください', 'zh-TW': '根據您的需求選擇檢查深度', 'zh-CN': '根据您的需求选择检查深度', en: 'Choose the examination depth based on your needs' } as Record<Language, string>,
    icon: Target,
    options: [
      { value: 'basic', label: { ja: '基礎スクリーニング', 'zh-TW': '基礎篩查', 'zh-CN': '基础筛查', en: 'Basic screening' } as Record<Language, string>, description: { ja: '主要な健康指標をカバー', 'zh-TW': '覆蓋主要健康指標', 'zh-CN': '覆盖主要健康指标', en: 'Covers major health indicators' } as Record<Language, string> },
      { value: 'standard', label: { ja: '標準健診', 'zh-TW': '標準體檢', 'zh-CN': '标准体检', en: 'Standard checkup' } as Record<Language, string>, description: { ja: '比較的全面な健康評価', 'zh-TW': '較全面的健康評估', 'zh-CN': '较全面的健康评估', en: 'Fairly comprehensive health assessment' } as Record<Language, string> },
      { value: 'advanced', label: { ja: '精密検査', 'zh-TW': '深度體檢', 'zh-CN': '深度体检', en: 'Advanced checkup' } as Record<Language, string>, description: { ja: '高度な画像検査を含む', 'zh-TW': '包含進階影像檢查', 'zh-CN': '包含进阶影像检查', en: 'Includes advanced imaging' } as Record<Language, string> },
      { value: 'premium', label: { ja: 'プレミアム総合', 'zh-TW': '頂級全面', 'zh-CN': '顶级全面', en: 'Premium comprehensive' } as Record<Language, string>, description: { ja: '最も全面的な健康スクリーニング', 'zh-TW': '最全面的健康篩查', 'zh-CN': '最全面的健康筛查', en: 'Most comprehensive health screening' } as Record<Language, string> },
    ]
  }
];

const PACKAGE_DATA = [
  { slug: 'basic-checkup', name: { ja: 'BASIC 基礎コース', 'zh-TW': 'BASIC 基礎套餐', 'zh-CN': 'BASIC 基础套餐', en: 'BASIC Health Screening' } as Record<Language, string>, price: 550000 },
  { slug: 'dwibs-cancer-screening', name: { ja: 'DWIBS がん検診', 'zh-TW': 'DWIBS 防癌篩查', 'zh-CN': 'DWIBS 防癌筛查', en: 'DWIBS Cancer Screening' } as Record<Language, string>, price: 275000 },
  { slug: 'select-gastroscopy', name: { ja: 'SELECT 胃カメラコース', 'zh-TW': 'SELECT 胃鏡套餐', 'zh-CN': 'SELECT 胃镜套餐', en: 'SELECT Gastroscopy Package' } as Record<Language, string>, price: 687500 },
  { slug: 'select-gastro-colonoscopy', name: { ja: 'SELECT 胃+大腸カメラコース', 'zh-TW': 'SELECT 胃+大腸鏡套餐', 'zh-CN': 'SELECT 胃+大肠镜套餐', en: 'SELECT Gastro-Colonoscopy Package' } as Record<Language, string>, price: 825000 },
  { slug: 'premium-cardiac-course', name: { ja: 'PREMIUM 心臓精密コース', 'zh-TW': 'PREMIUM 心臟精密套餐', 'zh-CN': 'PREMIUM 心脏精密套餐', en: 'PREMIUM Cardiac Course' } as Record<Language, string>, price: 825000 },
  { slug: 'vip-member-course', name: { ja: 'VIP 総合プレミアムコース', 'zh-TW': 'VIP 頂級全能套餐', 'zh-CN': 'VIP 顶级全能套餐', en: 'VIP Premium Course' } as Record<Language, string>, price: 1512500 },
];

const R = {
  ageOver60: { ja: '60歳以上は多くの疾患の好発期です', 'zh-TW': '60歲以上是多種疾病高發期', 'zh-CN': '60岁以上是多种疾病高发期', en: 'Age 60+ increases risk for many conditions' } as Record<Language, string>,
  age50to60: { ja: '50-60歳は健康スクリーニングの重要な時期', 'zh-TW': '50-60歲是健康篩查關鍵期', 'zh-CN': '50-60岁是健康筛查关键期', en: '50-60 is a critical period for health screening' } as Record<Language, string>,
  bmiHigh: { ja: '体重超過は心血管・代謝疾患リスクを増加', 'zh-TW': '體重超標增加心血管及代謝疾病風險', 'zh-CN': '体重超标增加心血管及代谢疾病风险', en: 'Being overweight increases cardiovascular and metabolic risk' } as Record<Language, string>,
  smokingRegular: { ja: '長期喫煙は肺がん・心血管疾患リスクを大幅増加', 'zh-TW': '長期吸煙大幅增加肺癌及心血管疾病風險', 'zh-CN': '长期吸烟大幅增加肺癌及心血管疾病风险', en: 'Long-term smoking significantly increases lung cancer and cardiovascular risk' } as Record<Language, string>,
  smokingYearsOver20: { ja: '喫煙20年以上、肺の精密検査を推奨', 'zh-TW': '吸煙超過20年，建議肺部深度篩查', 'zh-CN': '吸烟超过20年，建议肺部深度筛查', en: '20+ years of smoking history, deep lung screening recommended' } as Record<Language, string>,
  drinkingHeavy: { ja: '毎日飲酒は肝機能検査が必要', 'zh-TW': '每日飲酒需要重點檢查肝臟功能', 'zh-CN': '每日饮酒需要重点检查肝脏功能', en: 'Daily alcohol consumption requires liver function screening' } as Record<Language, string>,
  snoringApnea: { ja: '睡眠時無呼吸は心肺機能評価が必要', 'zh-TW': '睡眠呼吸暫停需要心肺功能評估', 'zh-CN': '睡眠呼吸暂停需要心肺功能评估', en: 'Sleep apnea requires cardiopulmonary evaluation' } as Record<Language, string>,
  asbestos: { ja: 'アスベスト接触歴は肺疾患リスク増加', 'zh-TW': '石棉接觸史增加肺部疾病風險', 'zh-CN': '石棉接触史增加肺部疾病风险', en: 'Asbestos exposure history increases lung disease risk' } as Record<Language, string>,
  hypertension: { ja: '高血圧患者は心血管専門検査が必要', 'zh-TW': '高血壓患者需要心血管專項檢查', 'zh-CN': '高血压患者需要心血管专项检查', en: 'Hypertension patients need cardiovascular screening' } as Record<Language, string>,
  diabetes: { ja: '糖尿病患者は全面的な代謝評価が必要', 'zh-TW': '糖尿病患者需要全面代謝評估', 'zh-CN': '糖尿病患者需要全面代谢评估', en: 'Diabetes patients need comprehensive metabolic assessment' } as Record<Language, string>,
  hpylori: { ja: 'ピロリ菌感染歴、胃カメラ検査を強く推奨', 'zh-TW': '幽門螺杆菌感染史，強烈建議胃鏡檢查', 'zh-CN': '幽门螺杆菌感染史，强烈建议胃镜检查', en: 'H. pylori history, gastroscopy strongly recommended' } as Record<Language, string>,
  hbv: { ja: 'B型肝炎は肝臓の精密検査が必要', 'zh-TW': 'B肝帶原需要肝臟深度篩查', 'zh-CN': '乙肝携带需要肝脏深度筛查', en: 'Hepatitis B carrier needs deep liver screening' } as Record<Language, string>,
  hcv: { ja: 'C型肝炎感染歴は肝臓精密検査が必要', 'zh-TW': 'C肝感染史需要肝臟深度篩查', 'zh-CN': '丙肝感染史需要肝脏深度筛查', en: 'Hepatitis C history needs deep liver screening' } as Record<Language, string>,
  hpv: { ja: 'HPV感染歴は婦人科検査を推奨', 'zh-TW': 'HPV感染史建議婦科檢查', 'zh-CN': 'HPV感染史建议妇科检查', en: 'HPV history, gynecological exam recommended' } as Record<Language, string>,
  polyps: { ja: '腸ポリープ歴は定期大腸カメラが必要', 'zh-TW': '腸道息肉病史需定期腸鏡隨訪', 'zh-CN': '肠道息肉病史需定期肠镜随访', en: 'Colon polyp history requires regular colonoscopy follow-up' } as Record<Language, string>,
  breastNodule: { ja: '乳房結節は定期追跡が必要', 'zh-TW': '乳房結節需要定期追蹤', 'zh-CN': '乳房结节需要定期追踪', en: 'Breast nodule requires regular follow-up' } as Record<Language, string>,
  atrophicGastritis: { ja: '萎縮性胃炎は胃がん前病変、胃カメラ監視が必要', 'zh-TW': '萎縮性胃炎是胃癌前病變，需要胃鏡監測', 'zh-CN': '萎缩性胃炎是胃癌前病变，需要胃镜监测', en: 'Atrophic gastritis is precancerous, gastroscopy monitoring needed' } as Record<Language, string>,
  noCheckup3Years: { ja: '3年以上健診なし、全面検査を推奨', 'zh-TW': '超過3年未體檢，建議全面檢查', 'zh-CN': '超过3年未体检，建议全面检查', en: 'No checkup in 3+ years, comprehensive exam recommended' } as Record<Language, string>,
  psaElevated: { ja: 'PSA上昇歴は前立腺精密検査が必要', 'zh-TW': 'PSA曾升高需要前列腺深度檢查', 'zh-CN': 'PSA曾升高需要前列腺深度检查', en: 'Elevated PSA history requires prostate screening' } as Record<Language, string>,
  familyDigestiveCancer: { ja: '消化器がん家族歴、胃腸カメラを推奨', 'zh-TW': '家族有消化道癌症史，建議胃腸鏡檢查', 'zh-CN': '家族有消化道癌症史，建议胃肠镜检查', en: 'Family digestive cancer history, gastro-colonoscopy recommended' } as Record<Language, string>,
  familyLungCancer: { ja: '肺がん家族歴、低線量CTを推奨', 'zh-TW': '家族有肺癌史，建議低劑量CT篩查', 'zh-CN': '家族有肺癌史，建议低剂量CT筛查', en: 'Family lung cancer history, low-dose CT recommended' } as Record<Language, string>,
  familyMultiCancer: { ja: '複数のがん家族歴、深度がんスクリーニングを推奨', 'zh-TW': '多種癌症家族史，建議深度癌症篩查', 'zh-CN': '多种癌症家族史，建议深度癌症筛查', en: 'Multiple family cancer history, deep cancer screening recommended' } as Record<Language, string>,
  familyBreastCancer: { ja: '乳がん家族歴、乳房専門検査を推奨', 'zh-TW': '家族有乳腺癌史，建議乳房專項檢查', 'zh-CN': '家族有乳腺癌史，建议乳房专项检查', en: 'Family breast cancer history, breast exam recommended' } as Record<Language, string>,
  familyCardio: { ja: '心脳血管疾患家族歴、心臓精密検査を推奨', 'zh-TW': '家族有心腦血管疾病史，建議心臟精密檢查', 'zh-CN': '家族有心脑血管疾病史，建议心脏精密检查', en: 'Family cardiovascular history, cardiac screening recommended' } as Record<Language, string>,
  bloodInStool: { ja: '血便は直ちに大腸カメラ検査が必要', 'zh-TW': '便血症狀需要立即進行腸鏡檢查', 'zh-CN': '便血症状需要立即进行肠镜检查', en: 'Blood in stool requires immediate colonoscopy' } as Record<Language, string>,
  digestiveDiscomfort: { ja: '消化器症状は胃カメラ検査を推奨', 'zh-TW': '消化不適症狀建議胃鏡檢查', 'zh-CN': '消化不适症状建议胃镜检查', en: 'Digestive symptoms, gastroscopy recommended' } as Record<Language, string>,
  chestPain: { ja: '胸の痛みは心臓精密検査が必要', 'zh-TW': '胸悶胸痛需要心臟精密檢查', 'zh-CN': '胸闷胸痛需要心脏精密检查', en: 'Chest pain requires cardiac screening' } as Record<Language, string>,
  neuroSymptoms: { ja: '神経系症状は脳MRI検査を推奨', 'zh-TW': '神經系統症狀建議腦部MRI檢查', 'zh-CN': '神经系统症状建议脑部MRI检查', en: 'Neurological symptoms, brain MRI recommended' } as Record<Language, string>,
  urinaryMale: { ja: '複数の排尿症状は前立腺検査を推奨', 'zh-TW': '多項泌尿症狀建議前列腺檢查', 'zh-CN': '多项泌尿症状建议前列腺检查', en: 'Multiple urinary symptoms, prostate exam recommended' } as Record<Language, string>,
  abnormalBleeding: { ja: '不正出血は婦人科検査が必要', 'zh-TW': '異常陰道出血需要婦科檢查', 'zh-CN': '异常阴道出血需要妇科检查', en: 'Abnormal bleeding requires gynecological exam' } as Record<Language, string>,
  weightLoss: { ja: '原因不明の体重減少は腫瘍の除外が必要', 'zh-TW': '無原因體重下降需要排除腫瘤', 'zh-CN': '无原因体重下降需要排除肿瘤', en: 'Unexplained weight loss requires tumor screening' } as Record<Language, string>,
  comprehensiveWish: { ja: '全面的な精密検査をご希望', 'zh-TW': '您希望進行全面深度檢查', 'zh-CN': '您希望进行全面深度检查', en: 'You prefer a comprehensive deep examination' } as Record<Language, string>,
  recommendVIP: { ja: '総合評価によりVIPプレミアムコースを推奨', 'zh-TW': '綜合評估建議VIP全面套餐', 'zh-CN': '综合评估建议VIP全面套餐', en: 'Comprehensive assessment recommends VIP package' } as Record<Language, string>,
  recommendCardiac: { ja: '心血管リスクが高く、心臓精密検査を推奨', 'zh-TW': '心血管風險較高，建議心臟精密檢查', 'zh-CN': '心血管风险较高，建议心脏精密检查', en: 'High cardiovascular risk, cardiac screening recommended' } as Record<Language, string>,
  recommendGastroColono: { ja: '消化器リスクが高く、胃腸カメラを推奨', 'zh-TW': '消化系統風險較高，建議胃腸鏡檢查', 'zh-CN': '消化系统风险较高，建议胃肠镜检查', en: 'High digestive risk, gastro-colonoscopy recommended' } as Record<Language, string>,
  recommendGastro: { ja: '胃カメラ検査を推奨', 'zh-TW': '建議進行胃鏡檢查', 'zh-CN': '建议进行胃镜检查', en: 'Gastroscopy recommended' } as Record<Language, string>,
  recommendDWIBS: { ja: '無症状ですががんリスク因子あり、DWIBS全身がん検診を推奨', 'zh-TW': '無明顯症狀但有癌症風險因素，建議DWIBS全身防癌篩查', 'zh-CN': '无明显症状但有癌症风险因素，建议DWIBS全身防癌筛查', en: 'No obvious symptoms but cancer risk factors present, DWIBS screening recommended' } as Record<Language, string>,
  defaultReason: { ja: 'お客様の健康状況に基づき、このコースが最適です', 'zh-TW': '根據您的健康狀況，這個套餐最適合您的需求', 'zh-CN': '根据您的健康状况，这个套餐最适合您的需求', en: 'Based on your health profile, this package best suits your needs' } as Record<Language, string>,
};

function calculateRecommendation(answers: Record<string, string | string[]>): RecommendationResult {
  let riskScore = 0;
  let cancerRisk = 0;
  let cardioRisk = 0;
  let digestiveRisk = 0;
  let metabolicRisk = 0;
  let brainRisk = 0;
  let liverRisk = 0;
  const reasons: Record<Language, string>[] = [];

  const gender = answers.gender as string;
  const age = answers.age as string;

  // 年龄动态调整基础风险
  const ageMultiplier = age === 'over60' ? 1.3 : age === '50-60' ? 1.2 : age === '40-50' ? 1.1 : 1.0;

  // 1. 年龄
  if (age === 'over60') { riskScore += 5; cancerRisk += 4; cardioRisk += 4; brainRisk += 3; reasons.push(R.ageOver60); }
  else if (age === '50-60') { riskScore += 4; cancerRisk += 3; cardioRisk += 3; brainRisk += 2; reasons.push(R.age50to60); }
  else if (age === '40-50') { riskScore += 3; cancerRisk += 2; cardioRisk += 2; }
  else if (age === '30-40') { riskScore += 1; }

  // 2. BMI
  const bmi = answers.bmi as string;
  if (bmi === 'obese') { riskScore += 4; cardioRisk += 3; metabolicRisk += 4; reasons.push(R.bmiHigh); }
  else if (bmi === 'overweight') { riskScore += 2; cardioRisk += 2; metabolicRisk += 2; }

  // 3. 腰围
  const waist = answers.waistCircumference as string;
  if (waist === 'high') { riskScore += 3; metabolicRisk += 3; cardioRisk += 2; }
  else if (waist === 'borderline') { riskScore += 1; metabolicRisk += 1; }

  // 4-5. 吸烟
  const smoking = answers.smoking as string;
  const smokingYears = answers.smokingYears as string;
  if (smoking === 'regular') { riskScore += 5; cancerRisk += 5; cardioRisk += 4; reasons.push(R.smokingRegular); }
  else if (smoking === 'occasional') { riskScore += 2; cancerRisk += 2; cardioRisk += 1; }
  else if (smoking === 'quit_recent') { riskScore += 2; cancerRisk += 2; }
  else if (smoking === 'quit_long') { riskScore += 1; cancerRisk += 1; }
  if (smokingYears === 'over20') { cancerRisk += 4; reasons.push(R.smokingYearsOver20); }
  else if (smokingYears === '10-20') { cancerRisk += 2; }

  // 6. 饮酒
  const drinking = answers.drinking as string;
  if (drinking === 'heavy') { riskScore += 4; digestiveRisk += 4; liverRisk += 5; cancerRisk += 3; reasons.push(R.drinkingHeavy); }
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
  if (snoring === 'apnea') { riskScore += 4; cardioRisk += 4; brainRisk += 2; reasons.push(R.snoringApnea); }
  else if (snoring === 'frequent') { riskScore += 2; cardioRisk += 2; }

  // 11. 工作
  const work = answers.workStyle as string;
  if (work === 'shift') { riskScore += 2; metabolicRisk += 2; cancerRisk += 1; }
  else if (work === 'desk') { riskScore += 1; cardioRisk += 1; }

  // 12. 职业暴露（新增）
  const occupationalExposure = (answers.occupationalExposure as string[]) || [];
  if (!occupationalExposure.includes('none')) {
    if (occupationalExposure.includes('asbestos')) { cancerRisk += 4; reasons.push(R.asbestos); }
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
    if (chronicConditions.includes('hypertension')) { cardioRisk += 4; brainRisk += 2; riskScore += 3; reasons.push(R.hypertension); }
    if (chronicConditions.includes('diabetes')) { metabolicRisk += 4; cardioRisk += 3; riskScore += 3; reasons.push(R.diabetes); }
    if (chronicConditions.includes('hyperlipidemia')) { cardioRisk += 3; metabolicRisk += 2; riskScore += 2; }
    if (chronicConditions.includes('fatty_liver')) { digestiveRisk += 3; liverRisk += 3; metabolicRisk += 2; riskScore += 2; }
  }

  // 15. 感染史（新增：核心问题）
  const infectiousHistory = (answers.infectiousHistory as string[]) || [];
  if (!infectiousHistory.includes('none')) {
    if (infectiousHistory.includes('hpylori')) { digestiveRisk += 5; cancerRisk += 3; reasons.push(R.hpylori); }
    if (infectiousHistory.includes('hbv')) { liverRisk += 5; cancerRisk += 4; reasons.push(R.hbv); }
    if (infectiousHistory.includes('hcv')) { liverRisk += 5; cancerRisk += 4; reasons.push(R.hcv); }
    if (infectiousHistory.includes('hpv') && gender === 'female') { cancerRisk += 3; reasons.push(R.hpv); }
  }

  // 16. 既往病史
  const pastDiseases = (answers.pastDiseases as string[]) || [];
  if (!pastDiseases.includes('none')) {
    if (pastDiseases.includes('gastric_ulcer')) { digestiveRisk += 3; riskScore += 2; }
    if (pastDiseases.includes('polyps')) { digestiveRisk += 5; cancerRisk += 4; riskScore += 3; reasons.push(R.polyps); }
    if (pastDiseases.includes('thyroid_nodule')) { metabolicRisk += 2; cancerRisk += 2; riskScore += 1; }
    if (pastDiseases.includes('breast_nodule') && gender === 'female') { cancerRisk += 3; reasons.push(R.breastNodule); }
    if (pastDiseases.includes('atrophic_gastritis')) { digestiveRisk += 5; cancerRisk += 4; reasons.push(R.atrophicGastritis); }
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
  if (lastCheckup === 'over3years') { riskScore += 4; reasons.push(R.noCheckup3Years); }
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
    if (maleProstate === 'elevated_psa') { cancerRisk += 4; reasons.push(R.psaElevated); }
    else if (maleProstate === 'bph') { riskScore += 2; }
    else if (maleProstate === 'symptoms') { riskScore += 2; cancerRisk += 1; }
  }

  // 22. 癌症家族史
  const familyCancer = (answers.familyCancer as string[]) || [];
  if (!familyCancer.includes('none')) {
    cancerRisk += Math.round(familyCancer.length * 3 * ageMultiplier); riskScore += familyCancer.length * 2;
    if (familyCancer.includes('gastric') || familyCancer.includes('colorectal')) { digestiveRisk += 4; reasons.push(R.familyDigestiveCancer); }
    if (familyCancer.includes('lung')) { reasons.push(R.familyLungCancer); }
    if (familyCancer.includes('liver')) { liverRisk += 4; digestiveRisk += 3; }
    if (familyCancer.includes('pancreatic')) { cancerRisk += 2; digestiveRisk += 2; }
    if (familyCancer.length >= 2) { reasons.push(R.familyMultiCancer); }
  }

  // 23. 女性癌症家族史
  const familyCancerFemale = (answers.familyCancerFemale as string[]) || [];
  if (!familyCancerFemale.includes('none') && gender === 'female') {
    cancerRisk += familyCancerFemale.length * 3; riskScore += familyCancerFemale.length * 2;
    if (familyCancerFemale.includes('breast')) { cancerRisk += 4; reasons.push(R.familyBreastCancer); }
    if (familyCancerFemale.includes('ovarian')) { cancerRisk += 4; }
  }

  // 24. 心血管家族史
  const familyCardio = (answers.familyCardio as string[]) || [];
  if (!familyCardio.includes('none')) {
    cardioRisk += Math.round(familyCardio.length * 3 * ageMultiplier); riskScore += familyCardio.length * 2;
    if (familyCardio.includes('heartDisease') || familyCardio.includes('stroke')) { reasons.push(R.familyCardio); }
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
    if (digestiveSymptoms.includes('blood')) { digestiveRisk += 8; cancerRisk += 4; reasons.push(R.bloodInStool); }
    if (digestiveSymptoms.includes('stomachPain') || digestiveSymptoms.includes('reflux')) { reasons.push(R.digestiveDiscomfort); }
  }

  // 27. 心血管症状
  const cardioSymptoms = (answers.cardioSymptoms as string[]) || [];
  if (!cardioSymptoms.includes('none')) {
    cardioRisk += cardioSymptoms.length * 3; riskScore += cardioSymptoms.length * 2;
    if (cardioSymptoms.includes('chestPain')) { cardioRisk += 6; reasons.push(R.chestPain); }
    if (cardioSymptoms.includes('breathless') || cardioSymptoms.includes('edema')) { cardioRisk += 3; }
  }

  // 28. 神经症状
  const neuroSymptoms = (answers.neuroSymptoms as string[]) || [];
  if (!neuroSymptoms.includes('none')) {
    brainRisk += neuroSymptoms.length * 2; riskScore += neuroSymptoms.length;
    if (neuroSymptoms.includes('headache') || neuroSymptoms.includes('dizziness')) { brainRisk += 3; reasons.push(R.neuroSymptoms); }
    if (neuroSymptoms.includes('numbness')) { cardioRisk += 2; brainRisk += 2; }
    if (neuroSymptoms.includes('memory')) { brainRisk += 3; }
  }

  // 29. 泌尿症状（性别分开）
  const urinarySymptomsMale = (answers.urinarySymptomsMale as string[]) || [];
  const urinarySymptomsFemale = (answers.urinarySymptomsFemale as string[]) || [];
  if (gender === 'male' && !urinarySymptomsMale.includes('none')) {
    riskScore += urinarySymptomsMale.length;
    if (urinarySymptomsMale.length >= 2) { cancerRisk += 3; reasons.push(R.urinaryMale); }
  }
  if (gender === 'female' && !urinarySymptomsFemale.includes('none')) {
    riskScore += urinarySymptomsFemale.length;
    if (urinarySymptomsFemale.includes('abnormal_bleeding')) { cancerRisk += 4; reasons.push(R.abnormalBleeding); }
  }

  // 30. 全身症状
  const generalSymptoms = (answers.generalSymptoms as string[]) || [];
  if (!generalSymptoms.includes('none')) {
    riskScore += generalSymptoms.length * 2;
    if (generalSymptoms.includes('weightLoss')) { cancerRisk += 5; reasons.push(R.weightLoss); }
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
  if (purpose === 'comprehensive') { riskScore += 5; reasons.push(R.comprehensiveWish); }
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
    if (!reasons.some(r => r['zh-TW'].includes('全面'))) { reasons.push(R.recommendVIP); }
  } else if (needsCardiac) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'premium-cardiac-course')!;
    if (!reasons.some(r => r['zh-TW'].includes('心'))) { reasons.push(R.recommendCardiac); }
  } else if (needsGastroColono) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'select-gastro-colonoscopy')!;
    if (!reasons.some(r => r['zh-TW'].includes('腸'))) { reasons.push(R.recommendGastroColono); }
  } else if (needsGastro) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'select-gastroscopy')!;
    if (!reasons.some(r => r['zh-TW'].includes('胃'))) { reasons.push(R.recommendGastro); }
  } else if (needsDWIBS) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'dwibs-cancer-screening')!;
    reasons.push(R.recommendDWIBS);
  } else if (riskScore >= 15 || depth === 'advanced') {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'basic-checkup')!;
  } else if (depth === 'standard' || riskScore >= 10) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'basic-checkup')!;
  } else {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'dwibs-cancer-screening')!;
  }

  // Deduplicate by zh-TW text
  const seen = new Set<string>();
  const uniqueReasons = reasons.filter(r => {
    if (seen.has(r['zh-TW'])) return false;
    seen.add(r['zh-TW']);
    return true;
  });

  let finalReason: I18nStr;
  if (uniqueReasons.length > 0) {
    const top3 = uniqueReasons.slice(0, 3);
    finalReason = {
      ja: top3.map(r => r.ja).join('；'),
      'zh-TW': top3.map(r => r['zh-TW']).join('；'),
      'zh-CN': top3.map(r => r['zh-CN']).join('；'),
      en: top3.map(r => r.en).join('; '),
    };
  } else {
    finalReason = R.defaultReason;
  }

  return { packageSlug: recommendedPackage.slug, packageName: recommendedPackage.name, price: recommendedPackage.price, reason: finalReason };
}

export default function PackageRecommenderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('ja');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const ut = (key: keyof typeof uiTranslations) => uiTranslations[key][currentLang];
  const rs = (s: I18nStr) => resolveStr(s, currentLang);

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
              <ArrowLeft size={20} /><span>{ut('backHome')}</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{ut('pageTitle')}</h1>
            <div className="w-20"></div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur"><Sparkles className="w-10 h-10" /></div>
                <h2 className="text-3xl font-serif font-bold mb-3">{ut('resultTitle')}</h2>
                <p className="text-blue-100 text-sm">{ut('resultSubtitle')}</p>
              </div>
            </div>
            <div className="p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{rs(recommendation.packageName)}</h3>
                <p className="text-4xl font-bold text-indigo-600">¥{recommendation.price.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">{ut('priceNote')}</p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div><p className="font-semibold text-indigo-900 mb-1">{ut('resultReason')}</p><p className="text-sm text-indigo-700 leading-relaxed">{rs(recommendation.reason)}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <a href="/?page=medical" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-center">{ut('resultViewMedical')}</a>
                <button onClick={() => { setShowResult(false); setCurrentStep(0); setAnswers({}); }} className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors text-center">{ut('resultRetry')}</button>
                <Link href="/" className="block w-full text-center text-gray-500 hover:text-gray-700 py-2 transition-colors">{ut('resultAllPackages')}</Link>
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
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"><ArrowLeft size={20} /><span>{ut('backHome')}</span></Link>
          <h1 className="text-lg font-bold text-gray-900">{ut('pageTitle')}</h1>
          <div className="w-20"></div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4"><MessageSquare size={16} />{ut('pageBadge')}</div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">{ut('pageHeading')}</h1>
          <p className="text-gray-500">{ut('pageDesc')}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gray-100"><div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"><QuestionIcon className="w-6 h-6 text-indigo-600" /></div>
                <div><span className="text-sm text-gray-400">{ut('questionPrefix')} {currentStep + 1} / {visibleQuestions.length}</span></div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{rs(currentQuestion.title)}</h2>
            {currentQuestion.subtitle && <p className="text-gray-500 text-sm mb-8">{rs(currentQuestion.subtitle)}</p>}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button key={option.value} onClick={() => handleSelect(option.value)} className={`w-full p-5 rounded-xl border-2 text-left transition-all ${isOptionSelected(option.value) ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isOptionSelected(option.value) ? 'text-indigo-700' : 'text-gray-900'}`}>{rs(option.label)}</p>
                      {option.description && <p className="text-sm text-gray-500 mt-1">{rs(option.description)}</p>}
                    </div>
                    {isOptionSelected(option.value) && <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50">
            <button onClick={handleBack} disabled={currentStep === 0} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ArrowLeft size={18} />{ut('prevQuestion')}</button>
            {currentQuestion.multiple && <button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold px-8 py-3 rounded-xl transition-colors">{currentStep === visibleQuestions.length - 1 ? ut('viewResult') : ut('nextQuestion')}<ArrowRight size={18} /></button>}
          </div>
        </div>
      </main>
    </div>
  );
}
