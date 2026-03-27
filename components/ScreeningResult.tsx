'use client';

import Link from 'next/link';
import { type AnalysisResult } from '@/services/aemc/types';
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
  Activity,
  Users,
  Phone,
  Clock,
  ShoppingCart,
} from 'lucide-react';
import { type BodyMapSelectionData } from './BodyMapSelector';
import { BODY_PARTS, MEDICAL_DEPARTMENTS } from '@/lib/body-map-config';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import RecommendedPackages from './RecommendedPackages';
import { MODULE_DETAIL_ROUTES } from '@/lib/config/product-categories';
import { useMemo } from 'react';
import { calculateHealthScoreWithBreakdown } from '@/lib/health-score';
import { MEDICAL_PACKAGES } from '@/lib/config/medical-packages';
import ScoreRing from './ScoreRing';
import ScoreBreakdown from './ScoreBreakdown';

const translations = {
  riskLow: {
    'zh-CN': '低风险',
    'zh-TW': '低風險',
    ja: '低リスク',
    en: 'Low Risk',
  },
  riskLowDesc: {
    'zh-CN': '您的健康状况良好，建议定期进行健康检查。',
    'zh-TW': '您的健康狀況良好，建議定期進行健康檢查。',
    ja: '健康状態は良好です。定期的な健康診断をお勧めします。',
    en: 'Your health condition is good. Regular health checkups are recommended.',
  },
  riskMedium: {
    'zh-CN': '中等风险',
    'zh-TW': '中等風險',
    ja: '中程度リスク',
    en: 'Moderate Risk',
  },
  riskMediumDesc: {
    'zh-CN': '建议您关注以下健康问题，并考虑进行进一步检查。',
    'zh-TW': '建議您關注以下健康問題，並考慮進行進一步檢查。',
    ja: '以下の健康上の問題にご注意いただき、さらなる検査をご検討ください。',
    en: 'Please pay attention to the following health concerns and consider further examination.',
  },
  riskHigh: {
    'zh-CN': '高风险',
    'zh-TW': '高風險',
    ja: '高リスク',
    en: 'High Risk',
  },
  riskHighDesc: {
    'zh-CN': '强烈建议您尽快进行专业医疗检查，及时发现潜在问题。',
    'zh-TW': '強烈建議您儘快進行專業醫療檢查，及時發現潛在問題。',
    ja: '専門的な医療検査をできるだけ早く受けることを強くお勧めします。潜在的な問題を早期に発見しましょう。',
    en: 'We strongly recommend undergoing a professional medical examination as soon as possible to identify potential issues early.',
  },
  shareTitle: {
    'zh-CN': 'AI 健康自测结果',
    'zh-TW': 'AI 健康自測結果',
    ja: 'AI ヘルスチェック結果',
    en: 'AI Health Check Results',
  },
  linkCopied: {
    'zh-CN': '链接已复制到剪贴板',
    'zh-TW': '連結已複製到剪貼簿',
    ja: 'リンクがクリップボードにコピーされました',
    en: 'Link copied to clipboard',
  },
  detailedAssessment: {
    'zh-CN': '详细评估',
    'zh-TW': '詳細評估',
    ja: '詳細評価',
    en: 'Detailed Assessment',
  },
  symptomLocation: {
    'zh-CN': '症状部位',
    'zh-TW': '症狀部位',
    ja: '症状部位',
    en: 'Symptom Location',
  },
  specificSymptoms: {
    'zh-CN': '具体症状',
    'zh-TW': '具體症狀',
    ja: '具体的な症状',
    en: 'Specific Symptoms',
  },
  recommendedDepts: {
    'zh-CN': '推荐就诊科室',
    'zh-TW': '推薦就診科室',
    ja: '推奨受診科',
    en: 'Recommended Departments',
  },
  recommendedTests: {
    'zh-CN': '建议检查项目',
    'zh-TW': '建議檢查項目',
    ja: '推奨検査項目',
    en: 'Recommended Tests',
  },
  treatmentSuggestions: {
    'zh-CN': 'AI 关注的健康事项',
    'zh-TW': 'AI 關注的健康事項',
    ja: 'AIが注目した健康上の考慮事項',
    en: 'Health Considerations Identified by AI',
  },
  recommendedHospitals: {
    'zh-CN': '可供参考的医疗机构',
    'zh-TW': '可供參考的醫療機構',
    ja: 'ご参考いただける医療機関',
    en: 'Medical Institutions for Your Reference',
  },
  commercialDisclaimer: {
    'zh-CN': '以下为新岛交通可协助对接的医疗机构信息，仅供参考，不构成医疗建议。是否咨询完全自愿，与上述 AI 健康分析无直接关联。',
    'zh-TW': '以下為新島交通可協助對接的醫療機構資訊，僅供參考，不構成醫療建議。是否諮詢完全自願，與上述 AI 健康分析無直接關聯。',
    ja: '以下は新島交通がご案内可能な医療機関の情報です。参考情報としてご覧ください。ご相談は任意であり、上記のAIヘルスチェック結果とは直接関連しておりません。',
    en: 'The following medical institutions are available through Niijima Kotsu for your reference only and do not constitute medical advice. Consultation is entirely voluntary and is not directly linked to the AI health check results above.',
  },
  suitableFor: {
    'zh-CN': '适合：',
    'zh-TW': '適合：',
    ja: '適応：',
    en: 'Suitable for: ',
  },
  recommendedDoctors: {
    'zh-CN': '推荐专科医生',
    'zh-TW': '推薦專科醫生',
    ja: '推奨専門医',
    en: 'Recommended Specialists',
  },
  nextSteps: {
    'zh-CN': '下一步建议',
    'zh-TW': '下一步建議',
    ja: '次のステップ',
    en: 'Next Steps',
  },
  disclaimerTitle: {
    'zh-CN': '⚠️ 重要医疗免责声明',
    'zh-TW': '⚠️ 重要醫療免責聲明',
    ja: '⚠️ 重要な医療免責事項',
    en: '⚠️ Important Medical Disclaimer',
  },
  disclaimer1: {
    'zh-CN': '本 AI 健康评估系统仅供健康参考，不构成任何形式的医学诊断、治疗建议或处方。',
    'zh-TW': '本AI健康評估系統僅供健康參考，不構成任何形式的醫學診斷、治療建議或處方。',
    ja: '本AIヘルスチェックは健康参考のみであり、医学的診断や治療提案を構成するものではありません。',
    en: 'This AI health screening is for reference only and does not constitute medical diagnosis, treatment advice, or prescription.',
  },
  disclaimer2: {
    'zh-CN': 'AI 分析结果不能替代专业医疗人员的诊查、诊断和治疗建议。',
    'zh-TW': 'AI分析結果不能替代專業醫療人員的診查、診斷和治療建議。',
    ja: 'AI分析結果は、専門の医療従事者による診察・診断・治療助言に代わるものではありません。',
    en: 'AI analysis results cannot replace examination, diagnosis, and treatment advice from qualified medical professionals.',
  },
  disclaimer3: {
    'zh-CN': '如您被评估为中度或高度健康风险，请尽速咨询专业医疗机构。',
    'zh-TW': '如您被評估為中度或高度健康風險，請儘速諮詢專業醫療機構。',
    ja: '中度または高度の健康リスクと評価された場合は、速やかに医療機関にご相談ください。',
    en: 'If assessed as moderate or high health risk, please consult a professional medical institution promptly.',
  },
  disclaimer4: {
    'zh-CN': '任何健康决策请务必咨询持有执照的医疗专业人员。',
    'zh-TW': '任何健康決策請務必諮詢持有執照的醫療專業人員。',
    ja: '健康に関する決定は、必ず免許を持つ医療専門家にご相談ください。',
    en: 'Always consult licensed medical professionals for any health-related decisions.',
  },
  disclaimer5: {
    'zh-CN': '新岛交通株式会社对因使用本系统所做决策产生的任何后果不承担法律责任。',
    'zh-TW': '新島交通株式會社對因使用本系統所做決策產生的任何後果不承擔法律責任。',
    ja: '新島交通株式会社は、本システムの利用に基づく決定から生じるいかなる結果にも法的責任を負いません。',
    en: 'Niijima Kotsu Co., Ltd. assumes no legal liability for any consequences arising from decisions made using this system.',
  },
  disclaimer6: {
    'zh-CN': '紧急情况请立即拨打急救电话或前往最近医疗机构。',
    'zh-TW': '緊急情況請立即撥打急救電話或前往最近醫療機構。',
    ja: '緊急時は直ちに救急車を呼ぶか、最寄りの医療機関を受診してください。',
    en: 'In case of emergency, call emergency services immediately or visit the nearest medical facility.',
  },
  disclaimerCopyright: {
    'zh-CN': '© 新岛交通株式会社 | 日本精密健检服务',
    'zh-TW': '© 新島交通株式會社 | 日本精密健檢服務',
    ja: '© 新島交通株式会社 | 日本精密健診サービス',
    en: '© Niijima Kotsu Co., Ltd. | Japan Precision Health Screening Services',
  },
  emergencyTitle: {
    'zh-CN': '建议尽早前往医疗机构就诊',
    'zh-TW': '建議盡早前往醫療機構就診',
    ja: '早めの医療機関への受診をお勧めします',
    en: 'We Recommend Visiting a Medical Facility Soon',
  },
  emergencyDesc: {
    'zh-CN': 'AI 筛查检测到需要关注的健康信号，建议您尽早预约专业医生进行详细检查。以下为当地急救电话，如有需要可拨打咨询。',
    'zh-TW': 'AI 篩查檢測到需要關注的健康信號，建議您盡早預約專業醫生進行詳細檢查。以下為當地急救電話，如有需要可撥打諮詢。',
    ja: 'AIヘルスチェックにより注意が必要な健康シグナルが検出されました。早めに専門医の詳しい検査を受けることをお勧めします。必要に応じて下記の緊急連絡先をご利用ください。',
    en: 'Our AI screening detected health signals that warrant attention. We recommend scheduling a detailed examination with a specialist soon. Emergency numbers are provided below if needed.',
  },
  emergencyCallJapan: {
    'zh-CN': '日本急救 119',
    'zh-TW': '日本急救 119',
    ja: '救急車 119',
    en: 'Japan Emergency 119',
  },
  emergencyCallChina: {
    'zh-CN': '中国急救 120',
    'zh-TW': '中國急救 120',
    ja: '中国救急 120',
    en: 'China Emergency 120',
  },
  humanReviewTitle: {
    'zh-CN': '报告待人工审核',
    'zh-TW': '報告待人工審核',
    ja: 'レポートは審査待ちです',
    en: 'Report Pending Human Review',
  },
  humanReviewDesc: {
    'zh-CN': '为保障安全，您的筛查结果需经医疗顾问审核后才能完整展示。我们的团队将在24小时内完成审核并通知您。',
    'zh-TW': '為保障安全，您的篩查結果需經醫療顧問審核後才能完整展示。我們的團隊將在24小時內完成審核並通知您。',
    ja: '安全のため、ヘルスチェック結果は医療アドバイザーの審査後に完全に表示されます。24時間以内に審査を完了しご連絡いたします。',
    en: 'For safety, your screening results require review by a medical advisor before full display. Our team will complete the review within 24 hours and notify you.',
  },
  bookScreening: {
    'zh-CN': '预约日本精密健检',
    'zh-TW': '預約日本精密健檢',
    ja: '日本精密健診を予約する',
    en: 'Book Japan Precision Health Screening',
  },
  shareResult: {
    'zh-CN': '分享结果',
    'zh-TW': '分享結果',
    ja: '結果を共有',
    en: 'Share Results',
  },
  viewHistory: {
    'zh-CN': '查看历史',
    'zh-TW': '查看歷史',
    ja: '履歴を見る',
    en: 'View History',
  },
  healthScore: {
    'zh-CN': '健康评分',
    'zh-TW': '健康評分',
    ja: '健康スコア',
    en: 'Health Score',
  },
  healthScoreDesc: {
    'zh-CN': '基于AI分析结果的综合健康评分',
    'zh-TW': '基於AI分析結果的綜合健康評分',
    ja: 'AI分析結果に基づく総合健康スコア',
    en: 'Comprehensive health score based on AI analysis',
  },
  bookConsultation: {
    'zh-CN': '预约咨询',
    'zh-TW': '預約諮詢',
    ja: '相談を予約する',
    en: 'Book Consultation',
  },
  initialConsultation: {
    'zh-CN': '前期咨询服务',
    'zh-TW': '前期諮詢服務',
    ja: '初期相談サービス',
    en: 'Initial Consultation',
  },
  taxIncl: {
    'zh-CN': '含税',
    'zh-TW': '含稅',
    ja: '税込',
    en: 'tax incl.',
  },
};

const t = (key: keyof typeof translations, lang: Language): string =>
  translations[key][lang];

function getConsultationUrl(hospitalId?: string): string | null {
  if (!hospitalId) return null;
  // TIMC (medical_packages) は健診センター — 初回相談ページなし、パッケージ直接購入
  if (hospitalId === 'medical_packages') return null;
  // 直営医院 — 専用ルート
  const baseRoute = MODULE_DETAIL_ROUTES[hospitalId];
  if (baseRoute) return `${baseRoute}/initial-consultation`;
  // JTB 提携医院 — 動的ルート（hospitalId は UUID）
  return `/hospital/${hospitalId}/initial-consultation`;
}

const HOSPITAL_CONSULTATION_SLUGS: Record<string, string> = {
  hyogo_medical: 'hyogo-initial-consultation',
  kindai_hospital: 'kindai-initial-consultation',
  cancer_treatment: 'cancer-initial-consultation',
  osaka_himak: 'osaka-himak-initial-consultation',
  igtc: 'igtc-initial-consultation',
  sai_clinic: 'sai-initial-consultation',
  wclinic_mens: 'wclinic-mens-initial-consultation',
  helene_clinic: 'helene-initial-consultation',
  ginza_phoenix: 'ginza-phoenix-initial-consultation',
  cell_medicine: 'cell-medicine-initial-consultation',
  ac_plus: 'ac-plus-initial-consultation',
  oici: 'oici-initial-consultation',
};

function getConsultationPackageSlug(hospitalId?: string): string | null {
  if (!hospitalId) return null;
  // 直営医院 — 専用 Stripe パッケージ
  if (HOSPITAL_CONSULTATION_SLUGS[hospitalId]) return HOSPITAL_CONSULTATION_SLUGS[hospitalId];
  // JTB 提携医院 — 共有パッケージ
  if (hospitalId !== 'medical_packages' && !MODULE_DETAIL_ROUTES[hospitalId]) return 'jtb-initial-consultation';
  return null;
}

interface ScreeningResultProps {
  result: AnalysisResult;
  screeningId: string;
  bodyMapData?: BodyMapSelectionData;
  isGuideEmbed?: boolean;
  overrideLanguage?: Language;
}

export default function ScreeningResult({
  result,
  screeningId,
  bodyMapData,
  isGuideEmbed,
  overrideLanguage,
}: ScreeningResultProps) {
  const siteLang = useLanguage();
  const lang = overrideLanguage || siteLang;
  // 健康评分详情
  const breakdown = useMemo(() => calculateHealthScoreWithBreakdown(result), [result]);

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
      label: t('riskLow', lang),
      description: t('riskLowDesc', lang),
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertCircle,
      label: t('riskMedium', lang),
      description: t('riskMediumDesc', lang),
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertTriangle,
      label: t('riskHigh', lang),
      description: t('riskHighDesc', lang),
    },
  };

  const risk = riskConfig[result.riskLevel];
  const RiskIcon = risk.icon;

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('shareTitle', lang),
          text: lang === 'zh-CN'
            ? `我完成了AI健康筛查，风险等级：${risk.label}`
            : lang === 'zh-TW'
            ? `我完成了AI健康篩查，風險等級：${risk.label}`
            : lang === 'ja'
            ? `AIヘルスチェックを完了しました。リスクレベル：${risk.label}`
            : `I completed the AI health screening. Risk level: ${risk.label}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // 复制链接
      await navigator.clipboard.writeText(window.location.href);
      alert(t('linkCopied', lang));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Gate C: 人工审核通知横幅 */}
      {result.requiresHumanReview && !result.requiresEmergencyNotice && (
        <div className="bg-amber-50 border-2 border-amber-300 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-full flex-shrink-0">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-amber-800 mb-2">{t('humanReviewTitle', lang)}</h2>
              <p className="text-amber-700 text-sm leading-relaxed">{t('humanReviewDesc', lang)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 风险等级卡片 */}
      <div
        className={`${risk.bg} ${risk.border} border-2 p-6 md:p-8`}
      >
        <div className="flex items-start gap-4">
          <div className={`${risk.color} p-3 rounded-full ${risk.bg}`}>
            <RiskIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${risk.color} mb-2`}>
              {risk.label}
            </h2>
            <p className="text-neutral-600">{risk.description}</p>
          </div>
        </div>

        {/* 风险摘要 */}
        <div className="mt-6 p-4 bg-white/60">
          <h3 className="font-semibold text-neutral-800 mb-2">{t('detailedAssessment', lang)}</h3>
          <div className="text-neutral-700 whitespace-pre-wrap text-sm leading-relaxed">
            {result.riskSummary}
          </div>
        </div>
      </div>

      {/* 健康评分卡片 */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">
              {t('healthScore', lang)}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">{t('healthScoreDesc', lang)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <ScoreRing score={breakdown.finalScore} size={120} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-3xl font-bold ${
                  breakdown.finalScore >= 80
                    ? 'text-emerald-600'
                    : breakdown.finalScore >= 60
                      ? 'text-amber-500'
                      : 'text-red-500'
                }`}
              >
                {breakdown.finalScore}
              </span>
              <span className="text-[10px] text-neutral-400">/100</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <ScoreBreakdown breakdown={breakdown} lang={lang} />
          </div>
        </div>
      </div>

      {/* 症状部位（如果有 bodyMapData）*/}
      {bodyMapData && bodyMapData.selectedBodyParts.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">{t('symptomLocation', lang)}</h3>
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
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <h4 className="text-sm font-medium text-neutral-700 mb-3">{t('specificSymptoms', lang)}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {bodyMapData.selectedSymptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 text-sm flex items-center gap-2 ${
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
        <div className="bg-white border border-neutral-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-100">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">{t('recommendedDepts', lang)}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {getRecommendedDepartments().map((dept: any, idx) => (
              <div
                key={idx}
                className="p-4 bg-neutral-50 flex items-start gap-3"
              >
                <span className="text-2xl">{dept.icon}</span>
                <div>
                  <h4 className="font-semibold text-neutral-900">{dept.name}</h4>
                  <p className="text-sm text-neutral-500 mt-1">{dept.description}</p>
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
        <div className="bg-white border border-neutral-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">{t('recommendedTests', lang)}</h3>
          </div>

          <div className="space-y-3">
            {result.recommendedTests.map((test, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-neutral-50"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <p className="text-neutral-700">{test}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 日本先端治疗建议 */}
      {result.treatmentSuggestions.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100">
              <Pill className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">
              {t('treatmentSuggestions', lang)}
            </h3>
          </div>

          <div className="grid gap-3">
            {result.treatmentSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-purple-50"
              >
                <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-neutral-700">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 商业信息分隔 + 推荐医疗机构 */}
      {result.recommendedHospitals.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 tracking-wide">{t('recommendedHospitals', lang)}</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed border-b border-neutral-100 pb-4">
            {t('commercialDisclaimer', lang)}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {result.recommendedHospitals.map((hospital, index) => {
              const packageSlug = getConsultationPackageSlug(hospital.hospitalId);
              const packagePrice = packageSlug ? MEDICAL_PACKAGES[packageSlug]?.priceJpy : null;
              const consultUrl = getConsultationUrl(hospital.hospitalId);
              return (
                <div
                  key={index}
                  className="border border-neutral-200 p-5"
                >
                  <h4 className="font-bold text-lg text-brand-900 mb-1">
                    {hospital.name}
                  </h4>
                  <div className="flex items-center gap-1 text-neutral-500 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{hospital.location}</span>
                  </div>

                  {hospital.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {hospital.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">{t('suitableFor', lang)}</span>
                    {hospital.suitableFor}
                  </p>

                  {hospital.doctors && hospital.doctors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <p className="text-xs font-medium text-neutral-500 mb-2">
                        {t('recommendedDoctors', lang)}
                      </p>
                      <div className="space-y-1">
                        {hospital.doctors.map((doc, docIdx) => (
                          <div key={docIdx} className="flex items-center gap-2 text-sm">
                            <Stethoscope className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            <span className="font-medium text-neutral-800">{doc.name}</span>
                            <span className="text-xs text-neutral-400">({doc.qualification})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {consultUrl ? (
                    <div className="mt-4 pt-3 border-t border-neutral-200">
                      {packagePrice && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-neutral-500">{t('initialConsultation', lang)}</span>
                          <span className="text-sm font-bold text-brand-900">¥{packagePrice.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">({t('taxIncl', lang)})</span></span>
                        </div>
                      )}
                      <Link
                        href={consultUrl}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gold-400 hover:bg-gold-300 text-brand-900 font-medium text-sm tracking-wider transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('bookConsultation', lang)}
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 推荐健检套餐 */}
      <RecommendedPackages result={result} lang={lang} />

      {/* 下一步建议 */}
      {result.nextSteps.length > 0 && (
        <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-8">
          <h3 className="text-xl font-semibold text-neutral-900 tracking-wide mb-4">{t('nextSteps', lang)}</h3>
          <div className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-brand-700 mt-0.5 flex-shrink-0" />
                <p className="text-neutral-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 完整医疗免责声明 */}
      <div className="bg-amber-50 border border-amber-200 p-5 text-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-amber-800">{t('disclaimerTitle', lang)}</h4>
            <ul className="text-amber-700 space-y-1 list-disc list-inside">
              <li>{t('disclaimer1', lang)}</li>
              <li>{t('disclaimer2', lang)}</li>
              <li>{t('disclaimer3', lang)}</li>
              <li>{t('disclaimer4', lang)}</li>
              <li>{t('disclaimer5', lang)}</li>
              <li>{t('disclaimer6', lang)}</li>
            </ul>
            <p className="text-amber-600 text-xs mt-3">{t('disclaimerCopyright', lang)}</p>
          </div>
        </div>
      </div>

      {/* 操作按钮（白标模式下隐藏，由白标结果页自行渲染导游联系 CTA） */}
      {!isGuideEmbed && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/medical"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gold-400 hover:bg-gold-300 text-brand-900 font-medium text-sm tracking-wider transition-colors"
          >
            <Stethoscope className="w-5 h-5" />
            {t('bookScreening', lang)}
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-4 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm"
          >
            <Share2 className="w-5 h-5" />
            {t('shareResult', lang)}
          </button>

          <Link
            href="/health-screening/history"
            className="flex items-center justify-center gap-2 px-6 py-4 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm"
          >
            <FileText className="w-5 h-5" />
            {t('viewHistory', lang)}
          </Link>
        </div>
      )}

    </div>
  );
}
