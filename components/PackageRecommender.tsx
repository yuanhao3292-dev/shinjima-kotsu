'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, User, Calendar, Heart, Target, X } from 'lucide-react';

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
}

const QUESTIONS: Question[] = [
  {
    id: 'age',
    title: '您的年齡範圍是？',
    subtitle: '不同年齡段有不同的健康關注重點',
    icon: User,
    options: [
      { value: 'under40', label: '40歲以下', description: '建議基礎檢查' },
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
    id: 'lastCheckup',
    title: '您上次體檢是什麼時候？',
    subtitle: '了解您的體檢頻率',
    icon: Calendar,
    options: [
      { value: 'within1year', label: '1年內', description: '保持良好習慣' },
      { value: '1-2years', label: '1-2年前', description: '建議定期檢查' },
      { value: '2-3years', label: '2-3年前', description: '建議儘快檢查' },
      { value: 'over3years', label: '3年以上/從未', description: '強烈建議全面檢查' },
    ]
  },
  {
    id: 'concerns',
    title: '您最關注的健康問題是？',
    subtitle: '可多選，幫助我們推薦更適合的套餐',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'cancer', label: '癌症篩查', description: 'PET-CT、腫瘤標記物' },
      { value: 'cardio', label: '心血管健康', description: '心臟超音波、血脂' },
      { value: 'digestive', label: '消化系統', description: '胃腸鏡檢查' },
      { value: 'brain', label: '腦部健康', description: '腦部MRI' },
      { value: 'general', label: '全面體檢', description: '整體健康評估' },
    ]
  },
  {
    id: 'familyHistory',
    title: '您的家族是否有以下病史？',
    subtitle: '可多選，家族病史會影響推薦方案',
    icon: Heart,
    multiple: true,
    options: [
      { value: 'cancer', label: '癌症', description: '建議深度篩查' },
      { value: 'heart', label: '心臟病', description: '建議心血管檢查' },
      { value: 'diabetes', label: '糖尿病', description: '建議代謝檢查' },
      { value: 'none', label: '無特殊病史' },
    ]
  },
  {
    id: 'budget',
    title: '您的預算範圍是？',
    subtitle: '我們會在預算內推薦最適合的套餐',
    icon: Target,
    options: [
      { value: 'basic', label: '¥200,000以下', description: '基礎套餐' },
      { value: 'standard', label: '¥200,000-500,000', description: '標準/甄選套餐' },
      { value: 'premium', label: '¥500,000-800,000', description: '尊享套餐' },
      { value: 'vip', label: '¥800,000以上', description: 'VIP至尊套餐' },
    ]
  }
];

const PACKAGE_DATA = [
  { slug: 'standard', name: 'STANDARD 標準套餐', price: 198000 },
  { slug: 'select', name: 'SELECT 甄選套餐', price: 320000 },
  { slug: 'select-gastro', name: 'SELECT 甄選套餐（胃腸鏡）', price: 468000 },
  { slug: 'premium', name: 'PREMIUM 尊享套餐', price: 658000 },
  { slug: 'premium-gastro', name: 'PREMIUM 尊享套餐（胃腸鏡）', price: 825000 },
  { slug: 'vip', name: 'VIP 至尊套餐', price: 1280000 },
];

function calculateRecommendation(answers: Record<string, string | string[]>): RecommendationResult {
  let score = 0;
  let reasons: string[] = [];

  // 年龄评分
  const age = answers.age as string;
  if (age === 'over60') {
    score += 3;
    reasons.push('60歲以上建議深度檢查');
  } else if (age === '50-60') {
    score += 2;
    reasons.push('50-60歲是健康篩查關鍵期');
  } else if (age === '40-50') {
    score += 1;
  }

  // 上次体检时间
  const lastCheckup = answers.lastCheckup as string;
  if (lastCheckup === 'over3years') {
    score += 2;
    reasons.push('超過3年未體檢，建議全面檢查');
  } else if (lastCheckup === '2-3years') {
    score += 1;
  }

  // 健康关注
  const concerns = (answers.concerns as string[]) || [];
  if (concerns.includes('cancer')) {
    score += 2;
    reasons.push('癌症篩查需要PET-CT等高級項目');
  }
  if (concerns.includes('digestive')) {
    score += 1;
    reasons.push('消化系統檢查建議含胃腸鏡');
  }
  if (concerns.includes('brain')) {
    score += 1;
  }

  // 家族病史
  const familyHistory = (answers.familyHistory as string[]) || [];
  if (familyHistory.includes('cancer')) {
    score += 2;
    reasons.push('家族有癌症史，建議深度篩查');
  }
  if (familyHistory.includes('heart')) {
    score += 1;
  }

  // 预算约束
  const budget = answers.budget as string;
  let maxPrice = 1500000;
  if (budget === 'basic') maxPrice = 200000;
  else if (budget === 'standard') maxPrice = 500000;
  else if (budget === 'premium') maxPrice = 800000;

  // 根据得分和预算推荐
  let recommendedPackage: typeof PACKAGE_DATA[0];

  if (score >= 5 && maxPrice >= 1280000) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'vip')!;
  } else if (score >= 4 && maxPrice >= 825000) {
    recommendedPackage = concerns.includes('digestive')
      ? PACKAGE_DATA.find(p => p.slug === 'premium-gastro')!
      : PACKAGE_DATA.find(p => p.slug === 'premium')!;
  } else if (score >= 3 && maxPrice >= 468000) {
    recommendedPackage = concerns.includes('digestive')
      ? PACKAGE_DATA.find(p => p.slug === 'select-gastro')!
      : PACKAGE_DATA.find(p => p.slug === 'select')!;
  } else if (maxPrice >= 320000) {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'select')!;
  } else {
    recommendedPackage = PACKAGE_DATA.find(p => p.slug === 'standard')!;
  }

  // 确保在预算内
  if (recommendedPackage.price > maxPrice) {
    recommendedPackage = PACKAGE_DATA.filter(p => p.price <= maxPrice).pop() || PACKAGE_DATA[0];
  }

  return {
    packageSlug: recommendedPackage.slug,
    packageName: recommendedPackage.name,
    price: recommendedPackage.price,
    reason: reasons.length > 0 ? reasons.join('；') : '根據您的情況，這個套餐最適合您的需求',
  };
}

interface PackageRecommenderProps {
  onClose?: () => void;
  onSelectPackage?: (slug: string) => void;
}

export default function PackageRecommender({ onClose, onSelectPackage }: PackageRecommenderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    if (currentQuestion.multiple) {
      const current = (answers[currentQuestion.id] as string[]) || [];
      let newValue: string[];

      if (value === 'none') {
        newValue = ['none'];
      } else {
        if (current.includes(value)) {
          newValue = current.filter(v => v !== value);
        } else {
          newValue = [...current.filter(v => v !== 'none'), value];
        }
      }

      setAnswers({ ...answers, [currentQuestion.id]: newValue });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });

      // 自动进入下一题
      setTimeout(() => {
        if (currentStep < QUESTIONS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // 计算结果
          const result = calculateRecommendation({ ...answers, [currentQuestion.id]: value });
          setRecommendation(result);
          setShowResult(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const result = calculateRecommendation(answers);
      setRecommendation(result);
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isOptionSelected = (value: string) => {
    if (currentQuestion.multiple) {
      return ((answers[currentQuestion.id] as string[]) || []).includes(value);
    }
    return answers[currentQuestion.id] === value;
  };

  const canProceed = () => {
    if (currentQuestion.multiple) {
      return ((answers[currentQuestion.id] as string[]) || []).length > 0;
    }
    return !!answers[currentQuestion.id];
  };

  if (showResult && recommendation) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 text-center relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            )}
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">為您推薦</h2>
            <p className="text-white/80 text-sm">根據您的需求智能分析</p>
          </div>

          {/* Result */}
          <div className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {recommendation.packageName}
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                ¥{recommendation.price.toLocaleString()}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-800">{recommendation.reason}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (onSelectPackage) {
                    onSelectPackage(recommendation.packageSlug);
                  } else {
                    window.location.href = `/medical-packages/${recommendation.packageSlug}`;
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                查看套餐詳情
              </button>
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentStep(0);
                  setAnswers({});
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                重新測試
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const QuestionIcon = currentQuestion.icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <QuestionIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm text-gray-500">
                問題 {currentStep + 1} / {QUESTIONS.length}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-gray-500 text-sm mb-6">{currentQuestion.subtitle}</p>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isOptionSelected(option.value)
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isOptionSelected(option.value) ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    )}
                  </div>
                  {isOptionSelected(option.value) && (
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            上一題
          </button>

          {currentQuestion.multiple && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              {currentStep === QUESTIONS.length - 1 ? '查看結果' : '下一題'}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
