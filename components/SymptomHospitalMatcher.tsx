'use client';

import { useState } from 'react';
import { Loader2, Search, ArrowRight, AlertTriangle } from 'lucide-react';
import type { Language } from '@/hooks/useLanguage';

// 病症 → 定位医院（综合治疗页原型）。调 /api/hospital-match，
// 一次轻量 AI 分诊 + 本地匹配 174 家 JTB/直营医院。
// ⚠️ 定位为就诊科别与医院参考，非医疗诊断。

interface Hospital {
  id: string;
  name: string;
  nameJa?: string;
  location?: string;
  department: string;
  score: number;
  reasons: string[];
}
interface MatchResult {
  triage: { departments: string[]; symptoms: string[]; riskLevel: string; chiefComplaint: string };
  hospitals: Hospital[];
  needsCoordinator: boolean;
}

const T = {
  eyebrow: { ja: 'AI 病院マッチング', 'zh-TW': 'AI 智能配對醫院', 'zh-CN': 'AI 智能匹配医院', en: 'AI Hospital Match', ko: 'AI 병원 매칭' },
  title: { ja: '症状から適した医療機関を探す', 'zh-TW': '輸入病症，定位適合的醫院', 'zh-CN': '输入病症，定位适合的医院', en: 'Describe symptoms, find the right hospital', ko: '증상으로 적합한 병원 찾기' },
  sub: { ja: 'ご病状・ご希望を入力すると、AI が診療科を判定し、提携する日本の医療機関から適したものをご提案します。', 'zh-TW': '輸入病狀或需求，AI 判定就診科別，並從合作的日本醫療機構中為您推薦。', 'zh-CN': '输入病状或需求，AI 判定就诊科别，并从合作的日本医疗机构中为您推荐。', en: 'Enter your condition; AI identifies the department and suggests suitable partner hospitals in Japan.', ko: '증상을 입력하면 AI가 진료과를 판정하고 제휴 병원을 추천합니다.' },
  placeholder: { ja: '例：胃の痛みがあり、便が黒く、体重が減ってきた', 'zh-TW': '例：胃痛，大便發黑，體重下降', 'zh-CN': '例：胃痛，大便发黑，体重下降', en: 'e.g. stomach pain, black stool, weight loss', ko: '예: 위통, 검은 변, 체중 감소' },
  button: { ja: '医療機関を探す', 'zh-TW': '匹配醫院', 'zh-CN': '匹配医院', en: 'Find Hospitals', ko: '병원 찾기' },
  matching: { ja: '判定中…', 'zh-TW': '匹配中…', 'zh-CN': '匹配中…', en: 'Matching…', ko: '매칭 중…' },
  deptLabel: { ja: '推奨診療科', 'zh-TW': '建議就診科別', 'zh-CN': '建议就诊科别', en: 'Suggested department', ko: '추천 진료과' },
  resultTitle: { ja: '適した医療機関', 'zh-TW': '適合的醫療機構', 'zh-CN': '适合的医疗机构', en: 'Matched hospitals', ko: '매칭된 병원' },
  consult: { ja: '相談する', 'zh-TW': '諮詢', 'zh-CN': '咨询', en: 'Consult', ko: '상담' },
  emergency: { ja: '緊急性の可能性があります。重い症状の場合はすぐに現地の救急（119）をご利用ください。', 'zh-TW': '可能具緊急性。若症狀嚴重，請立即撥打當地急救電話。', 'zh-CN': '可能具紧急性。若症状严重，请立即拨打当地急救电话。', en: 'This may be urgent. If severe, contact local emergency services immediately.', ko: '응급 가능성이 있습니다. 심할 경우 즉시 현지 응급 서비스에 연락하세요.' },
  disclaimer: { ja: '※ 本結果は AI による診療科の目安であり、医学的診断ではありません。最終的な受診先はコーディネーターが調整します。', 'zh-TW': '※ 本結果為 AI 判定的就診科別參考，非醫學診斷。最終就診安排由專屬顧問協調。', 'zh-CN': '※ 本结果为 AI 判定的就诊科别参考，非医学诊断。最终就诊安排由专属顾问协调。', en: '※ Results are an AI department guide, not a medical diagnosis. Final arrangements are coordinated by our team.', ko: '※ 본 결과는 AI 진료과 안내이며 의학적 진단이 아닙니다.' },
  err: { ja: 'マッチングに失敗しました。もう一度お試しください。', 'zh-TW': '匹配失敗，請重試。', 'zh-CN': '匹配失败，请重试。', en: 'Match failed. Please try again.', ko: '매칭 실패. 다시 시도해 주세요.' },
} as const;

export default function SymptomHospitalMatcher({ lang, variant = 'section' }: { lang: Language; variant?: 'section' | 'hero' }) {
  const t = (k: keyof typeof T) => T[k][lang] ?? T[k]['zh-CN'];
  const [symptom, setSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState('');

  const submit = async () => {
    if (symptom.trim().length < 2 || loading) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await fetch('/api/hospital-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: symptom.trim(), language: lang }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || t('err')); return; }
      setResult(d);
    } catch {
      setError(t('err'));
    } finally {
      setLoading(false);
    }
  };

  // 搜索卡：hero 形态下更大、带厚阴影，浮在深色底图上
  const searchCard = (
    <div className={variant === 'hero'
      ? 'bg-white rounded-2xl p-2.5 md:p-3 shadow-2xl'
      : 'bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 shadow-sm'}>
      <div className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
          rows={variant === 'hero' ? 1 : 2}
          maxLength={500}
          placeholder={t('placeholder')}
          className={variant === 'hero'
            ? 'flex-1 resize-none px-4 py-3.5 rounded-xl text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500'
            : 'flex-1 resize-none px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent'}
        />
        <button
          onClick={submit}
          disabled={loading || symptom.trim().length < 2}
          className={`shrink-0 self-stretch sm:self-auto brand-gradient-solid text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 ${variant === 'hero' ? 'px-7 py-3.5 text-base' : 'px-6 py-3'}`}
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{t('matching')}</> : <><Search className="w-4 h-4" />{t('button')}</>}
        </button>
      </div>
      {error && <p className={`mt-3 text-sm text-rose-600 ${variant === 'hero' ? 'px-2 pb-1' : ''}`}>{error}</p>}
    </div>
  );

  const results = result && (
    <div className={variant === 'hero' ? 'mt-4 bg-white/95 backdrop-blur rounded-2xl p-5 md:p-6 shadow-2xl text-left' : 'mt-6'}>
      {result.needsCoordinator && (
        <div className="mb-4 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{t('emergency')}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-neutral-500">{t('deptLabel')}：</span>
        {result.triage.departments.map((d) => (
          <span key={d} className="px-3 py-1 bg-brand-50 text-brand-700 text-sm rounded-full border border-brand-200">{d}</span>
        ))}
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-3">{t('resultTitle')}</h3>
      <div className="space-y-3">
        {result.hospitals.map((h) => (
          <div key={h.id} className={`flex items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-xl hover:border-brand-300 transition`}>
            <div className="min-w-0">
              <p className="font-bold text-neutral-900 truncate">{h.name}</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                {h.department}{h.location ? ` · ${h.location}` : ''}
              </p>
            </div>
            <a
              href={variant === 'hero' ? '#contact-form' : '#contact'}
              className="shrink-0 inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-brand-700 border border-brand-300 rounded-lg hover:bg-brand-50 transition"
            >
              {t('consult')}<ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      <p className={`mt-5 text-xs leading-relaxed ${variant === 'hero' ? 'text-neutral-500' : 'text-neutral-400'}`}>{t('disclaimer')}</p>
    </div>
  );

  if (variant === 'hero') {
    // 无 section 外壳，直接嵌进 hero 的内容流
    return (
      <div className="w-full max-w-3xl">
        {searchCard}
        {results}
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <span className="text-neutral-700 text-xs tracking-widest uppercase font-bold">{t('eyebrow')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-3 mb-4">{t('title')}</h2>
          <p className="text-neutral-600 text-sm max-w-2xl mx-auto leading-relaxed">{t('sub')}</p>
        </div>
        {searchCard}
        {results}
      </div>
    </section>
  );
}
