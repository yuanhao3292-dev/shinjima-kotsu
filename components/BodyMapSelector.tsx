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
            正面
          </button>
          <button
            onClick={() => setViewMode('back')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === 'back'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            背面
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
            {BODY_PARTS.find((p) => p.id === hoveredPart)?.name}
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
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {part.name.charAt(0)}
                </span>
                {part.name}症狀
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
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              全
            </span>
            全身症狀
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
            症狀 {currentSymptomIndex + 1} / {selectedSymptoms.length}
          </span>
          <span>
            問題 {currentFollowUpIndex + 1} / {followUpQuestions.length}
          </span>
        </div>

        {/* 症状标签 */}
        <div className="bg-blue-50 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <span className="text-blue-600 font-medium">{currentSymptom.name}</span>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
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
            我不確定
          </button>
          <button
            onClick={saveFollowUpAndNext}
            disabled={
              !currentFollowUpAnswer ||
              (Array.isArray(currentFollowUpAnswer) && currentFollowUpAnswer.length === 0)
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            下一步
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
      low: { color: 'text-green-600', bg: 'bg-green-100', label: '低風險' },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: '中風險' },
      high: { color: 'text-red-600', bg: 'bg-red-100', label: '高風險' },
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
            基於您選擇的症狀，系統初步評估您的健康風險等級
          </p>
        </div>

        {/* 选中的部位 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">已選擇的部位</h3>
          <div className="flex flex-wrap gap-2">
            {selectedBodyParts.map((partId) => {
              const part = BODY_PARTS.find((p) => p.id === partId);
              return (
                <span
                  key={partId}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {part?.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* 选中的症状 */}
        {selectedSymptoms.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">已選擇的症狀</h3>
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
                    {symptom.severity === 'high' ? '高' : symptom.severity === 'medium' ? '中' : '低'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 推荐科室 */}
        {departments.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">推薦就診科室</h3>
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
            接下來，AI 將根據您的選擇進行更詳細的健康問診，並為您生成專業的健康評估報告。
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
        <h2 className="text-2xl font-bold text-gray-900">
          {step === 'body-select' && '選擇不適部位'}
          {step === 'symptom-select' && '選擇具體症狀'}
          {step === 'followup' && '詳細問診'}
          {step === 'summary' && '問診總結'}
        </h2>
        <p className="text-gray-500 mt-2">
          {step === 'body-select' && '請點擊人體圖上您感到不適的部位（可多選）'}
          {step === 'symptom-select' && '請選擇您正在經歷的症狀'}
          {step === 'followup' && '請回答幾個簡單的追問，幫助我們更好地了解您的情況'}
          {step === 'summary' && '以下是您的問診總結'}
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">已選擇的部位：</h4>
          <div className="flex flex-wrap gap-2">
            {selectedBodyParts.map((partId) => {
              const part = BODY_PARTS.find((p) => p.id === partId);
              return (
                <span
                  key={partId}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  {part?.name}
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
          返回
        </button>

        {step === 'body-select' && (
          <button
            onClick={proceedToSymptoms}
            disabled={selectedBodyParts.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            下一步：選擇症狀
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {step === 'symptom-select' && (
          <button
            onClick={proceedToFollowUp}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {selectedSymptoms.length > 0 ? '下一步：詳細問診' : '跳過症狀選擇'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {step === 'summary' && (
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            開始 AI 健康分析
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
