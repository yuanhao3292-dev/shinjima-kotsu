'use client';

import Link from 'next/link';
import { AnalysisResult } from '@/services/deepseekService';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Building2,
  MapPin,
  Stethoscope,
  Pill,
  ArrowRight,
  FileText,
  Share2,
  MessageCircle,
  Activity,
  Users,
} from 'lucide-react';
import { type BodyMapSelectionData } from './BodyMapSelector';
import { BODY_PARTS, MEDICAL_DEPARTMENTS } from '@/lib/body-map-config';

interface ScreeningResultProps {
  result: AnalysisResult;
  screeningId: string;
  bodyMapData?: BodyMapSelectionData;
}

export default function ScreeningResult({
  result,
  screeningId: _screeningId,
  bodyMapData,
}: ScreeningResultProps) {
  // 获取选中的身体部位名称
  const getSelectedBodyPartNames = () => {
    if (!bodyMapData?.selectedBodyParts) return [];
    return bodyMapData.selectedBodyParts
      .map((id) => BODY_PARTS.find((p) => p.id === id)?.name)
      .filter(Boolean) as string[];
  };

  // 获取推荐科室信息
  const getRecommendedDepartments = () => {
    if (!bodyMapData?.recommendedDepartments) return [];
    return bodyMapData.recommendedDepartments
      .map((id) => MEDICAL_DEPARTMENTS.find((d) => d.id === id))
      .filter(Boolean);
  };

  // 风险等级配置
  const riskConfig = {
    low: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      label: '低風險',
      description: '您的健康狀況良好，建議定期進行健康檢查。',
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertCircle,
      label: '中等風險',
      description: '建議您關注以下健康問題，並考慮進行進一步檢查。',
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertTriangle,
      label: '高風險',
      description: '強烈建議您儘快進行專業醫療檢查，及時發現潛在問題。',
    },
  };

  const risk = riskConfig[result.riskLevel];
  const RiskIcon = risk.icon;

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI 健康筛查結果',
          text: `我完成了AI健康筛查，風險等級：${risk.label}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // 复制链接
      await navigator.clipboard.writeText(window.location.href);
      alert('鏈接已複製到剪貼板');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 风险等级卡片 */}
      <div
        className={`${risk.bg} ${risk.border} border-2 rounded-2xl p-6 md:p-8`}
      >
        <div className="flex items-start gap-4">
          <div className={`${risk.color} p-3 rounded-full ${risk.bg}`}>
            <RiskIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${risk.color} mb-2`}>
              {risk.label}
            </h2>
            <p className="text-gray-600">{risk.description}</p>
          </div>
        </div>

        {/* 风险摘要 */}
        <div className="mt-6 p-4 bg-white/60 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">詳細評估</h3>
          <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {result.riskSummary}
          </div>
        </div>
      </div>

      {/* 症状部位（如果有 bodyMapData）*/}
      {bodyMapData && bodyMapData.selectedBodyParts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">症狀部位</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {getSelectedBodyPartNames().map((name, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>

          {bodyMapData.selectedSymptoms.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">具體症狀</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {bodyMapData.selectedSymptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      symptom.severity === 'high'
                        ? 'bg-red-50 text-red-700'
                        : symptom.severity === 'medium'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        symptom.severity === 'high'
                          ? 'bg-red-500'
                          : symptom.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                    {symptom.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 推荐科室（如果有 bodyMapData）*/}
      {bodyMapData && getRecommendedDepartments().length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">推薦就診科室</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {getRecommendedDepartments().map((dept: any, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-xl flex items-start gap-3"
              >
                <span className="text-2xl">{dept.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900">{dept.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dept.recommendedTests.slice(0, 3).map((test: string, testIdx: number) => (
                      <span
                        key={testIdx}
                        className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 建议检查项目 */}
      {result.recommendedTests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">建議檢查項目</h3>
          </div>

          <div className="space-y-3">
            {result.recommendedTests.map((test, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700">{test}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 日本先端治疗建议 */}
      {result.treatmentSuggestions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              日本先端治療建議
            </h3>
          </div>

          <div className="grid gap-3">
            {result.treatmentSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 推荐医疗机构 */}
      {result.recommendedHospitals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">推薦醫療機構</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {result.recommendedHospitals.map((hospital, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-lg text-gray-900 mb-1">
                  {hospital.name}
                </h4>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{hospital.location}</span>
                </div>

                {hospital.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hospital.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  <span className="font-medium">適合：</span>
                  {hospital.suitableFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 下一步建议 */}
      {result.nextSteps.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">下一步建議</h3>
          <div className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 完整医疗免责声明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-amber-800">⚠️ 重要醫療免責聲明</h4>
            <ul className="text-amber-700 space-y-1 list-disc list-inside">
              <li>本 AI 健康評估系統僅供健康參考，不構成任何形式的醫學診斷、治療建議或處方。</li>
              <li>AI 分析結果不能替代專業醫療人員的診查、診斷和治療建議。</li>
              <li>如您被評估為中度或高度健康風險，請儘速諮詢專業醫療機構。</li>
              <li>任何健康決策請務必諮詢持有執照的醫療專業人員。</li>
              <li>新島交通株式會社對因使用本系統所做決策產生的任何後果不承擔法律責任。</li>
              <li>緊急情況請立即撥打急救電話或前往最近醫療機構。</li>
            </ul>
            <p className="text-amber-600 text-xs mt-3">© 新島交通株式會社 | 日本精密健檢服務</p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          href="/medical-packages"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          <Stethoscope className="w-5 h-5" />
          預約日本精密健檢
        </Link>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          分享結果
        </button>

        <Link
          href="/health-screening/history"
          className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-5 h-5" />
          查看歷史
        </Link>
      </div>

      {/* 咨询入口 */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">需要專業諮詢？</h3>
            <p className="text-gray-400">
              我們的醫療顧問可以根據您的筛查結果，為您推薦最適合的日本醫療服務。
            </p>
          </div>
          <a
            href="https://line.me/R/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5" />
            LINE 諮詢
          </a>
        </div>
      </div>
    </div>
  );
}
