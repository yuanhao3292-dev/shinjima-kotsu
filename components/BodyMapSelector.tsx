'use client';

import React, { useState } from 'react';
import {
  BODY_PARTS,
  BODY_PART_SYMPTOMS,
  GENERAL_SYMPTOMS,
  MEDICAL_DEPARTMENTS,
  getSymptomsByBodyPart,
  getDepartmentsByBodyPart,
  type BodyPart,
  type Symptom,
  type MedicalDepartment,
} from '@/lib/body-map-config';
import { Check, ChevronRight, AlertTriangle, Info } from 'lucide-react';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const translations: Record<string, Record<Language, string>> = {
  front: { ja: '前面', 'zh-CN': '正面', 'zh-TW': '正面', en: 'Front' },
  back: { ja: '背面', 'zh-CN': '背面', 'zh-TW': '背面', en: 'Back' },
  partSymptoms: { ja: 'の症状', 'zh-CN': '症状', 'zh-TW': '症狀', en: ' Symptoms' },
  generalShort: { ja: '全', 'zh-CN': '全', 'zh-TW': '全', en: 'All' },
  generalSymptoms: { ja: '全身症状', 'zh-CN': '全身症状', 'zh-TW': '全身症狀', en: 'General Symptoms' },
  symptomProgress: { ja: '症状', 'zh-CN': '症状', 'zh-TW': '症狀', en: 'Symptom' },
  questionProgress: { ja: '質問', 'zh-CN': '问题', 'zh-TW': '問題', en: 'Question' },
  notSure: { ja: 'わからない', 'zh-CN': '我不确定', 'zh-TW': '我不確定', en: 'Not sure' },
  next: { ja: '次へ', 'zh-CN': '下一步', 'zh-TW': '下一步', en: 'Next' },
  riskLow: { ja: '低リスク', 'zh-CN': '低风险', 'zh-TW': '低風險', en: 'Low Risk' },
  riskMedium: { ja: '中リスク', 'zh-CN': '中风险', 'zh-TW': '中風險', en: 'Medium Risk' },
  riskHigh: { ja: '高リスク', 'zh-CN': '高风险', 'zh-TW': '高風險', en: 'High Risk' },
  riskDescription: {
    ja: 'お選びいただいた症状に基づき、システムが健康リスクレベルを初期評価しました',
    'zh-CN': '基于您选择的症状，系统初步评估您的健康风险等级',
    'zh-TW': '基於您選擇的症狀，系統初步評估您的健康風險等級',
    en: 'Based on your selected symptoms, the system has made a preliminary assessment of your health risk level',
  },
  selectedParts: { ja: '選択した部位', 'zh-CN': '已选择的部位', 'zh-TW': '已選擇的部位', en: 'Selected Body Parts' },
  selectedSymptoms: { ja: '選択した症状', 'zh-CN': '已选择的症状', 'zh-TW': '已選擇的症狀', en: 'Selected Symptoms' },
  severityHigh: { ja: '高', 'zh-CN': '高', 'zh-TW': '高', en: 'High' },
  severityMedium: { ja: '中', 'zh-CN': '中', 'zh-TW': '中', en: 'Med' },
  severityLow: { ja: '低', 'zh-CN': '低', 'zh-TW': '低', en: 'Low' },
  recommendedDepts: { ja: '推奨診療科', 'zh-CN': '推荐就诊科室', 'zh-TW': '推薦就診科室', en: 'Recommended Departments' },
  aiDescription: {
    ja: '次に、AIがあなたの選択に基づいてより詳しい健康問診を行い、専門的な健康評価レポートを作成します。',
    'zh-CN': '接下来，AI 将根据您的选择进行更详细的健康问诊，并为您生成专业的健康评估报告。',
    'zh-TW': '接下來，AI 將根據您的選擇進行更詳細的健康問診，並為您生成專業的健康評估報告。',
    en: 'Next, AI will conduct a more detailed health consultation based on your selections and generate a professional health assessment report for you.',
  },
  stepBodySelectTitle: { ja: '不調のある部位を選択', 'zh-CN': '选择不适部位', 'zh-TW': '選擇不適部位', en: 'Select Affected Areas' },
  stepSymptomSelectTitle: { ja: '具体的な症状を選択', 'zh-CN': '选择具体症状', 'zh-TW': '選擇具體症狀', en: 'Select Specific Symptoms' },
  stepFollowUpTitle: { ja: '詳細問診', 'zh-CN': '详细问诊', 'zh-TW': '詳細問診', en: 'Detailed Inquiry' },
  stepSummaryTitle: { ja: '問診まとめ', 'zh-CN': '问诊总结', 'zh-TW': '問診總結', en: 'Consultation Summary' },
  stepBodySelectDesc: {
    ja: '人体図上の不調を感じる部位をクリックしてください（複数選択可）',
    'zh-CN': '请点击人体图上您感到不适的部位（可多选）',
    'zh-TW': '請點擊人體圖上您感到不適的部位（可多選）',
    en: 'Click on the body map where you feel discomfort (multiple selections allowed)',
  },
  stepSymptomSelectDesc: {
    ja: '現在経験している症状を選択してください',
    'zh-CN': '请选择您正在经历的症状',
    'zh-TW': '請選擇您正在經歷的症狀',
    en: 'Please select the symptoms you are experiencing',
  },
  stepFollowUpDesc: {
    ja: 'いくつかの簡単な質問にお答えください。より正確な評価に役立ちます',
    'zh-CN': '请回答几个简单的追问，帮助我们更好地了解您的情况',
    'zh-TW': '請回答幾個簡單的追問，幫助我們更好地了解您的情況',
    en: 'Please answer a few follow-up questions to help us better understand your condition',
  },
  stepSummaryDesc: {
    ja: '以下は問診のまとめです',
    'zh-CN': '以下是您的问诊总结',
    'zh-TW': '以下是您的問診總結',
    en: 'Here is your consultation summary',
  },
  selectedPartsLabel: { ja: '選択した部位：', 'zh-CN': '已选择的部位：', 'zh-TW': '已選擇的部位：', en: 'Selected:' },
  goBack: { ja: '戻る', 'zh-CN': '返回', 'zh-TW': '返回', en: 'Back' },
  nextSelectSymptoms: { ja: '次へ：症状を選択', 'zh-CN': '下一步：选择症状', 'zh-TW': '下一步：選擇症狀', en: 'Next: Select Symptoms' },
  nextDetailedInquiry: { ja: '次へ：詳細問診', 'zh-CN': '下一步：详细问诊', 'zh-TW': '下一步：詳細問診', en: 'Next: Detailed Inquiry' },
  skipSymptomSelection: { ja: '症状選択をスキップ', 'zh-CN': '跳过症状选择', 'zh-TW': '跳過症狀選擇', en: 'Skip Symptom Selection' },
  startAiAnalysis: { ja: 'AI 健康分析を開始', 'zh-CN': '开始 AI 健康分析', 'zh-TW': '開始 AI 健康分析', en: 'Start AI Health Analysis' },
};

const bodyPartNames: Record<string, Record<Language, string>> = {
  head: { ja: '頭部', 'zh-CN': '头部', 'zh-TW': '頭部', en: 'Head' },
  neck: { ja: '首', 'zh-CN': '颈部', 'zh-TW': '頸部', en: 'Neck' },
  chest: { ja: '胸部', 'zh-CN': '胸部', 'zh-TW': '胸部', en: 'Chest' },
  abdomen: { ja: '腹部', 'zh-CN': '腹部', 'zh-TW': '腹部', en: 'Abdomen' },
  pelvis: { ja: '骨盤/下腹部', 'zh-CN': '骨盆/下腹', 'zh-TW': '骨盆/下腹', en: 'Pelvis' },
  'left-arm': { ja: '左腕', 'zh-CN': '左臂', 'zh-TW': '左臂', en: 'Left Arm' },
  'right-arm': { ja: '右腕', 'zh-CN': '右臂', 'zh-TW': '右臂', en: 'Right Arm' },
  'left-leg': { ja: '左脚', 'zh-CN': '左腿', 'zh-TW': '左腿', en: 'Left Leg' },
  'right-leg': { ja: '右脚', 'zh-CN': '右腿', 'zh-TW': '右腿', en: 'Right Leg' },
  back: { ja: '背中', 'zh-CN': '背部', 'zh-TW': '背部', en: 'Back' },
};

interface BodyMapSelectorProps {
  onComplete: (data: BodyMapSelectionData) => void;
  onBack?: () => void;
}

export interface BodyMapSelectionData {
  selectedBodyParts: string[];
  selectedSymptoms: SelectedSymptom[];
  recommendedDepartments: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SelectedSymptom {
  symptomId: string;
  bodyPartId: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  followUpAnswers: Record<string, string | string[]>;
}

type ViewMode = 'front' | 'back';
type Step = 'body-select' | 'symptom-select' | 'followup' | 'summary';

export default function BodyMapSelector({ onComplete, onBack }: BodyMapSelectorProps) {
  const lang = useLanguage();
  const t = (key: string) => (translations as any)[key]?.[lang] || (translations as any)[key]?.['ja'] || key;
  const getPartName = (partId: string) => bodyPartNames[partId]?.[lang] || partId;

  const [viewMode, setViewMode] = useState<ViewMode>('front');
  const [step, setStep] = useState<Step>('body-select');
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [currentFollowUpIndex, setCurrentFollowUpIndex] = useState(0);
  const [currentFollowUpAnswer, setCurrentFollowUpAnswer] = useState<string | string[]>('');
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // 前面身体部位
  const frontParts = BODY_PARTS.filter(
    (p) => !['back'].includes(p.id)
  );

  // 切换身体部位选择
  const toggleBodyPart = (partId: string) => {
    setSelectedBodyParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  // 切换症状选择
  const toggleSymptom = (symptom: Symptom, bodyPartId: string) => {
    const existing = selectedSymptoms.find((s) => s.symptomId === symptom.id);
    if (existing) {
      setSelectedSymptoms((prev) =>
        prev.filter((s) => s.symptomId !== symptom.id)
      );
    } else {
      setSelectedSymptoms((prev) => [
        ...prev,
        {
          symptomId: symptom.id,
          bodyPartId,
          name: symptom.name,
          severity: symptom.severity,
          followUpAnswers: {},
        },
      ]);
    }
  };

  // 获取当前症状的追问问题
  const getCurrentFollowUpQuestions = () => {
    const currentSymptom = selectedSymptoms[currentSymptomIndex];
    if (!currentSymptom) return [];

    // 从症状库中找到对应的追问问题
    const bodyPartSymptoms = BODY_PART_SYMPTOMS[currentSymptom.bodyPartId] || [];
    const symptom = bodyPartSymptoms.find((s) => s.id === currentSymptom.symptomId);

    if (!symptom) {
      // 检查通用症状
      const generalSymptom = GENERAL_SYMPTOMS.find((s) => s.id === currentSymptom.symptomId);
      return generalSymptom?.followUpQuestions || [];
    }

    return symptom.followUpQuestions;
  };

  // 保存追问答案并进入下一个
  const saveFollowUpAndNext = () => {
    const followUpQuestions = getCurrentFollowUpQuestions();
    const currentQuestion = followUpQuestions[currentFollowUpIndex];

    if (currentQuestion && currentFollowUpAnswer) {
      // 保存答案
      setSelectedSymptoms((prev) =>
        prev.map((s, idx) =>
          idx === currentSymptomIndex
            ? {
                ...s,
                followUpAnswers: {
                  ...s.followUpAnswers,
                  [currentQuestion.id]: currentFollowUpAnswer,
                },
              }
            : s
        )
      );
    }

    // 重置答案
    setCurrentFollowUpAnswer('');

    // 检查是否还有更多追问
    if (currentFollowUpIndex < followUpQuestions.length - 1) {
      setCurrentFollowUpIndex((prev) => prev + 1);
    } else {
      // 检查是否还有更多症状需要追问
      if (currentSymptomIndex < selectedSymptoms.length - 1) {
        setCurrentSymptomIndex((prev) => prev + 1);
        setCurrentFollowUpIndex(0);
      } else {
        // 所有追问完成，进入总结
        setStep('summary');
      }
    }
  };

  // 跳过追问
  const skipFollowUp = () => {
    const followUpQuestions = getCurrentFollowUpQuestions();

    if (currentFollowUpIndex < followUpQuestions.length - 1) {
      setCurrentFollowUpIndex((prev) => prev + 1);
    } else {
      if (currentSymptomIndex < selectedSymptoms.length - 1) {
        setCurrentSymptomIndex((prev) => prev + 1);
        setCurrentFollowUpIndex(0);
      } else {
        setStep('summary');
      }
    }
  };

  // 计算推荐科室
  const getRecommendedDepartments = (): MedicalDepartment[] => {
    const deptIds = new Set<string>();
    selectedBodyParts.forEach((partId) => {
      const depts = getDepartmentsByBodyPart(partId);
      depts.forEach((d) => deptIds.add(d.id));
    });
    return MEDICAL_DEPARTMENTS.filter((d) => deptIds.has(d.id));
  };

  // 计算风险等级
  const calculateRiskLevel = (): 'low' | 'medium' | 'high' => {
    const highCount = selectedSymptoms.filter((s) => s.severity === 'high').length;
    const mediumCount = selectedSymptoms.filter((s) => s.severity === 'medium').length;

    if (highCount >= 2 || (highCount >= 1 && mediumCount >= 2)) return 'high';
    if (highCount >= 1 || mediumCount >= 3) return 'medium';
    return 'low';
  };

  // 完成选择
  const handleComplete = () => {
    const departments = getRecommendedDepartments();
    onComplete({
      selectedBodyParts,
      selectedSymptoms,
      recommendedDepartments: departments.map((d) => d.id),
      riskLevel: calculateRiskLevel(),
    });
  };

  // 从部位选择进入症状选择
  const proceedToSymptoms = () => {
    if (selectedBodyParts.length === 0) return;
    setStep('symptom-select');
  };

  // 从症状选择进入追问
  const proceedToFollowUp = () => {
    if (selectedSymptoms.length === 0) {
      // 没有选择症状，直接进入总结
      setStep('summary');
      return;
    }

    // 检查是否有需要追问的症状
    const hasFollowUp = selectedSymptoms.some((symptom) => {
      const bodyPartSymptoms = BODY_PART_SYMPTOMS[symptom.bodyPartId] || [];
      const s = bodyPartSymptoms.find((bs) => bs.id === symptom.symptomId);
      return s && s.followUpQuestions.length > 0;
    });

    if (hasFollowUp) {
      setCurrentSymptomIndex(0);
      setCurrentFollowUpIndex(0);
      setStep('followup');
    } else {
      setStep('summary');
    }
  };

  // 渲染人体图
  const renderBodyMap = () => {
    return (
      <div className="relative w-full max-w-sm mx-auto">
        {/* 视图切换 */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setViewMode('front')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'front'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('front')}
          </button>
          <button
            onClick={() => setViewMode('back')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'back'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('back')}
          </button>
        </div>

        {/* SVG 人体图 */}
        <svg
          viewBox="0 0 300 750"
          className="w-full h-auto"
          style={{ maxHeight: '500px' }}
        >
          {/* 背景人形轮廓 */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>

          {/* 渲染各个身体部位 */}
          {(viewMode === 'front' ? frontParts : [BODY_PARTS.find(p => p.id === 'back')!]).map((part) => {
            if (!part || !part.path) return null;
            const isSelected = selectedBodyParts.includes(part.id);
            const isHovered = hoveredPart === part.id;

            return (
              <g key={part.id}>
                <path
                  d={part.path}
                  fill={
                    isSelected
                      ? '#3b82f6'
                      : isHovered
                      ? '#93c5fd'
                      : '#e5e7eb'
                  }
                  stroke={isSelected ? '#1d4ed8' : '#9ca3af'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => toggleBodyPart(part.id)}
                  onMouseEnter={() => setHoveredPart(part.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                {/* 选中标记 */}
                {isSelected && (
                  <circle
                    cx={
                      part.id === 'head' ? 150 :
                      part.id === 'chest' ? 150 :
                      part.id === 'abdomen' ? 150 :
                      part.id === 'pelvis' ? 150 :
                      part.id === 'left-arm' ? 65 :
                      part.id === 'right-arm' ? 235 :
                      part.id === 'left-leg' ? 100 :
                      part.id === 'right-leg' ? 200 :
                      150
                    }
                    cy={
                      part.id === 'head' ? 80 :
                      part.id === 'chest' ? 240 :
                      part.id === 'abdomen' ? 360 :
                      part.id === 'pelvis' ? 450 :
                      part.id === 'left-arm' ? 260 :
                      part.id === 'right-arm' ? 260 :
                      part.id === 'left-leg' ? 590 :
                      part.id === 'right-leg' ? 590 :
                      200
                    }
                    r="12"
                    fill="white"
                    stroke="#1d4ed8"
                    strokeWidth="2"
                  />
                )}
                {isSelected && (
                  <text
                    x={
                      part.id === 'head' ? 150 :
                      part.id === 'chest' ? 150 :
                      part.id === 'abdomen' ? 150 :
                      part.id === 'pelvis' ? 150 :
                      part.id === 'left-arm' ? 65 :
                      part.id === 'right-arm' ? 235 :
                      part.id === 'left-leg' ? 100 :
                      part.id === 'right-leg' ? 200 :
                      150
                    }
                    y={
                      part.id === 'head' ? 85 :
                      part.id === 'chest' ? 245 :
                      part.id === 'abdomen' ? 365 :
                      part.id === 'pelvis' ? 455 :
                      part.id === 'left-arm' ? 265 :
                      part.id === 'right-arm' ? 265 :
                      part.id === 'left-leg' ? 595 :
                      part.id === 'right-leg' ? 595 :
                      205
                    }
                    textAnchor="middle"
                    fontSize="14"
                    fill="#1d4ed8"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                )}
              </g>
            );
          })}

          {/* 背面特殊处理 */}
          {viewMode === 'back' && (
            <g>
              {/* 背部 */}
              <path
                d="M90,180 L210,180 L220,420 L80,420 Z"
                fill={
                  selectedBodyParts.includes('back')
                    ? '#3b82f6'
                    : hoveredPart === 'back'
                    ? '#93c5fd'
                    : '#e5e7eb'
                }
                stroke={selectedBodyParts.includes('back') ? '#1d4ed8' : '#9ca3af'}
                strokeWidth={selectedBodyParts.includes('back') ? 2 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => toggleBodyPart('back')}
                onMouseEnter={() => setHoveredPart('back')}
                onMouseLeave={() => setHoveredPart(null)}
              />
              {/* 头部背面 */}
              <ellipse
                cx="150"
                cy="80"
                rx="50"
                ry="60"
                fill={
                  selectedBodyParts.includes('head')
                    ? '#3b82f6'
                    : '#e5e7eb'
                }
                stroke="#9ca3af"
                strokeWidth="1"
                className="cursor-pointer"
                onClick={() => toggleBodyPart('head')}
              />
              {/* 颈部背面 */}
              <rect
                x="130"
                y="140"
                width="40"
                height="40"
                fill={
                  selectedBodyParts.includes('neck')
                    ? '#3b82f6'
                    : '#e5e7eb'
                }
                stroke="#9ca3af"
                className="cursor-pointer"
                onClick={() => toggleBodyPart('neck')}
              />
            </g>
          )}
        </svg>

        {/* 悬浮提示 */}
        {hoveredPart && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg z-10">
            {getPartName(hoveredPart)}
          </div>
        )}
      </div>
    );
  };

  // 渲染症状选择
  const renderSymptomSelect = () => {
    return (
      <div className="space-y-6">
        {selectedBodyParts.map((partId) => {
          const part = BODY_PARTS.find((p) => p.id === partId);
          const symptoms = getSymptomsByBodyPart(partId);

          if (!part || symptoms.length === 0) return null;

          return (
            <div key={partId} className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {getPartName(partId).charAt(0)}
                </span>
                {getPartName(partId)}{t('partSymptoms')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {symptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.some(
                    (s) => s.symptomId === symptom.id
                  );
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom, partId)}
                      className={`p-3 rounded-lg text-left text-sm transition-all ${
                        isSelected
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{symptom.name}</span>
                        {symptom.severity === 'high' && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 通用症状 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              {t('generalShort')}
            </span>
            {t('generalSymptoms')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {GENERAL_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.some(
                (s) => s.symptomId === symptom.id
              );
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom, 'general')}
                  className={`p-3 rounded-lg text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-900'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{symptom.name}</span>
                    {symptom.severity === 'high' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-purple-600 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 渲染追问问题
  const renderFollowUp = () => {
    const currentSymptom = selectedSymptoms[currentSymptomIndex];
    const followUpQuestions = getCurrentFollowUpQuestions();
    const currentQuestion = followUpQuestions[currentFollowUpIndex];

    if (!currentSymptom || !currentQuestion) {
      return null;
    }

    return (
      <div className="space-y-6">
        {/* 进度 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>
            {t('symptomProgress')} {currentSymptomIndex + 1} / {selectedSymptoms.length}
          </span>
          <span>
            {t('questionProgress')} {currentFollowUpIndex + 1} / {followUpQuestions.length}
          </span>
        </div>

        {/* 症状标签 */}
        <div className="bg-blue-50 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <span className="text-blue-600 font-medium">{currentSymptom.name}</span>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            {currentQuestion.question}
          </h3>

          {currentQuestion.type === 'single' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCurrentFollowUpAnswer(option.value)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    currentFollowUpAnswer === option.value
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multi' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => {
                const selected = Array.isArray(currentFollowUpAnswer)
                  ? currentFollowUpAnswer.includes(option.value)
                  : false;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setCurrentFollowUpAnswer((prev) => {
                        const arr = Array.isArray(prev) ? prev : [];
                        return selected
                          ? arr.filter((v) => v !== option.value)
                          : [...arr, option.value];
                      });
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span>{option.label}</span>
                    {selected && <Check className="w-5 h-5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'input' && (
            <textarea
              value={typeof currentFollowUpAnswer === 'string' ? currentFollowUpAnswer : ''}
              onChange={(e) => setCurrentFollowUpAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        {/* 按钮 */}
        <div className="flex justify-between">
          <button
            onClick={skipFollowUp}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            {t('notSure')}
          </button>
          <button
            onClick={saveFollowUpAndNext}
            disabled={
              !currentFollowUpAnswer ||
              (Array.isArray(currentFollowUpAnswer) && currentFollowUpAnswer.length === 0)
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {t('next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // 渲染总结
  const renderSummary = () => {
    const departments = getRecommendedDepartments();
    const riskLevel = calculateRiskLevel();

    const riskConfig = {
      low: { color: 'text-green-600', bg: 'bg-green-100', label: t('riskLow') },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: t('riskMedium') },
      high: { color: 'text-red-600', bg: 'bg-red-100', label: t('riskHigh') },
    };

    return (
      <div className="space-y-6">
        {/* 风险等级 */}
        <div className={`p-4 rounded-xl ${riskConfig[riskLevel].bg}`}>
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${riskConfig[riskLevel].color}`}>
              {riskConfig[riskLevel].label}
            </div>
            <Info className={`w-5 h-5 ${riskConfig[riskLevel].color}`} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {t('riskDescription')}
          </p>
        </div>

        {/* 选中的部位 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-neutral-900 mb-3">{t('selectedParts')}</h3>
          <div className="flex flex-wrap gap-2">
            {selectedBodyParts.map((partId) => {
              return (
                <span
                  key={partId}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {getPartName(partId)}
                </span>
              );
            })}
          </div>
        </div>

        {/* 选中的症状 */}
        {selectedSymptoms.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-neutral-900 mb-3">{t('selectedSymptoms')}</h3>
            <div className="space-y-2">
              {selectedSymptoms.map((symptom) => (
                <div
                  key={symptom.symptomId}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{symptom.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      symptom.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : symptom.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {symptom.severity === 'high' ? t('severityHigh') : symptom.severity === 'medium' ? t('severityMedium') : t('severityLow')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 推荐科室 */}
        {departments.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-neutral-900 mb-3">{t('recommendedDepts')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{dept.icon}</span>
                    <span className="font-medium text-sm">{dept.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 提示 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            {t('aiDescription')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['body-select', 'symptom-select', 'followup', 'summary'].map((s, idx) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? 'bg-blue-600 text-white'
                  : idx < ['body-select', 'symptom-select', 'followup', 'summary'].indexOf(step)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {idx + 1}
            </div>
            {idx < 3 && (
              <div
                className={`w-12 h-0.5 ${
                  idx < ['body-select', 'symptom-select', 'followup', 'summary'].indexOf(step)
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-neutral-900 tracking-wide">
          {step === 'body-select' && t('stepBodySelectTitle')}
          {step === 'symptom-select' && t('stepSymptomSelectTitle')}
          {step === 'followup' && t('stepFollowUpTitle')}
          {step === 'summary' && t('stepSummaryTitle')}
        </h2>
        <p className="text-gray-500 mt-2">
          {step === 'body-select' && t('stepBodySelectDesc')}
          {step === 'symptom-select' && t('stepSymptomSelectDesc')}
          {step === 'followup' && t('stepFollowUpDesc')}
          {step === 'summary' && t('stepSummaryDesc')}
        </p>
      </div>

      {/* 内容区 */}
      <div className="mb-8">
        {step === 'body-select' && renderBodyMap()}
        {step === 'symptom-select' && renderSymptomSelect()}
        {step === 'followup' && renderFollowUp()}
        {step === 'summary' && renderSummary()}
      </div>

      {/* 已选部位显示 (body-select 步骤) */}
      {step === 'body-select' && selectedBodyParts.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t('selectedPartsLabel')}</h4>
          <div className="flex flex-wrap gap-2">
            {selectedBodyParts.map((partId) => {
              return (
                <span
                  key={partId}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  {getPartName(partId)}
                  <button
                    onClick={() => toggleBodyPart(partId)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (step === 'body-select') {
              onBack?.();
            } else if (step === 'symptom-select') {
              setStep('body-select');
            } else if (step === 'followup') {
              setStep('symptom-select');
            } else {
              setStep('followup');
            }
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          {t('goBack')}
        </button>

        {step === 'body-select' && (
          <button
            onClick={proceedToSymptoms}
            disabled={selectedBodyParts.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {t('nextSelectSymptoms')}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {step === 'symptom-select' && (
          <button
            onClick={proceedToFollowUp}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {selectedSymptoms.length > 0 ? t('nextDetailedInquiry') : t('skipSymptomSelection')}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {step === 'summary' && (
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {t('startAiAnalysis')}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
