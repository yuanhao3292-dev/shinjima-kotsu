'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MemberLayout from '@/components/MemberLayout';
import Logo from '@/components/Logo';
import {
  ArrowLeft, ArrowRight, CheckCircle, Shield, Heart, Activity,
  Zap, Brain, Target, Microscope, Dna, Syringe, Stethoscope,
  FileText, Phone, Mail, Clock, Users, Building, Globe,
  ChevronDown, MessageSquare, Sparkles, Scan, Bot, CircleDot,
  Atom, Pill, Radio, FlaskConical, HeartPulse, Leaf, CreditCard, Loader2
} from 'lucide-react';

// 咨询服务产品定义
const CONSULTATION_SERVICES = {
  initial: {
    id: 'cancer-initial-consultation',
    slug: 'cancer-initial-consultation',
    name: '前期諮詢服務',
    nameEn: 'Initial Consultation',
    price: 221000,
    description: '資料翻譯、醫院諮詢、治療方案初步評估',
  },
  remote: {
    id: 'cancer-remote-consultation',
    slug: 'cancer-remote-consultation',
    name: '遠程會診服務',
    nameEn: 'Remote Consultation',
    price: 243000,
    description: '與日本醫生遠程視頻會診、討論治療方案、費用概算',
  },
};

// 治疗流程步骤数据
const TREATMENT_FLOW = [
  { step: 1, title: '前期咨詢', subtitle: '提交申請・提供資料', fee: '221,000', feeLabel: '日元', from: '患者', to: '中介', desc: '治療信息提供書、血液/病理報告、CT/MRI/PET數據、手術記錄等', serviceKey: 'initial' as const },
  { step: 2, title: '支付前期諮詢費', subtitle: '選擇合適的醫院與醫生', fee: null, feeLabel: null, from: '患者', to: '中介', desc: null, serviceKey: null },
  { step: 3, title: '資料翻譯', subtitle: '諮詢醫院', fee: null, feeLabel: null, from: '中介', to: '醫院/患者', desc: null, serviceKey: null },
  { step: 4, title: '赴日前遠程會診', subtitle: '討論治療方案', fee: '243,000', feeLabel: '日元', from: '醫院', to: '患者', desc: '討論治療方案，提供治療計劃，提示治療費概算金額', serviceKey: 'remote' as const },
  { step: 5, title: '決定來日治療', subtitle: '支付預付金', fee: null, feeLabel: null, from: '患者', to: '中介', desc: null, serviceKey: null },
  { step: 6, title: '確定來日日期', subtitle: '如需要申請醫療簽證', fee: null, feeLabel: null, from: '患者', to: '中介', desc: null, serviceKey: null },
  { step: 7, title: '預約就診', subtitle: '安排翻譯', fee: null, feeLabel: null, from: '中介', to: '醫院/患者', desc: '安排有經驗及資格的專業醫療翻譯', serviceKey: null },
  { step: 8, title: '來日治療', subtitle: '就診支援', fee: null, feeLabel: null, from: '中介/醫院', to: '患者', desc: null, serviceKey: null },
  { step: 9, title: '治療結束', subtitle: '費用結算', fee: null, feeLabel: null, from: '中介/醫院', to: '患者', desc: null, serviceKey: null },
  { step: 10, title: '後續支持', subtitle: '遠程隨訪', fee: null, feeLabel: null, from: '醫院', to: '患者', desc: '提供病歷以及給中國醫生的治療總結與建議，必要時做線上隨訪或遠程諮詢', serviceKey: null },
];

// 標準治療方式
const STANDARD_TREATMENTS = [
  {
    id: 'surgery',
    icon: Stethoscope,
    title: '手術',
    color: 'blue',
    features: ['創傷小、恢復快、安全性高', '不僅追求生存率，更重視術後生活質量', '進食、排尿、說話等功能保護'],
    desc: '日本微創手術技術世界領先，在追求治癒的同時最大限度保護患者的生活質量。'
  },
  {
    id: 'chemo',
    icon: Pill,
    title: '化學治療',
    color: 'green',
    features: ['根據患者年齡、體力、合併症調整劑量', '副作用管理非常細緻', '適合高齡患者、慢性腫瘤患者'],
    desc: '不一味追求最大劑量，而是根據個體差異制定最適合的方案，把副作用降到最低。'
  },
  {
    id: 'radiation',
    icon: Radio,
    title: '放射線治療',
    color: 'purple',
    features: ['陽子線、重離子線治療世界領先', '立體定向放射治療技術成熟', '最大限度保護正常組織，減少併發症'],
    desc: '高精度放射線技術可精準打擊腫瘤細胞，同時將對周圍正常組織的損傷降到最低。'
  },
  {
    id: 'immune',
    icon: Shield,
    title: '免疫治療',
    color: 'orange',
    features: ['嚴格篩選適應症', '高度警惕免疫相關不良反應', '把對正常器官的「誤傷」控制到最低'],
    desc: '在發揮免疫治療效果的同時，通過精細管理避免免疫系統攻擊正常器官。'
  },
  {
    id: 'targeted',
    icon: Target,
    title: '靶向治療',
    color: 'red',
    features: ['針對癌細胞特定基因進行精準治療', '「無基因證據，不輕易用藥」', '避免無效治療和不必要副作用'],
    desc: '基於基因檢測結果選擇最適合的靶向藥物，真正做到精準醫療。'
  },
];

// 再生醫療輔助治療
const REGENERATIVE_TREATMENTS = [
  {
    id: 'msc',
    icon: Dna,
    title: '間充質幹細胞',
    subtitle: 'MSC Therapy',
    purpose: '身體恢復',
    color: 'blue',
    features: ['抗炎與免疫調節', '化療、放療後的身體恢復', '促進組織再生'],
  },
  {
    id: 'exosome',
    icon: Atom,
    title: '外泌體',
    subtitle: 'Exosome Therapy',
    purpose: '長期健康管理',
    color: 'purple',
    features: ['促進細胞修復', '治療後的長期健康管理', '抗衰老調理'],
  },
  {
    id: 'nk',
    icon: Shield,
    title: 'NK等免疫細胞',
    subtitle: 'NK Cell Therapy',
    purpose: '預防復發',
    color: 'green',
    features: ['增強機體免疫功能', '提高抗腫瘤防禦能力', '預防癌症復發'],
  },
];

// 合作醫療機構類型
const PARTNER_INSTITUTIONS = [
  { icon: Building, label: '大學醫院、綜合醫院' },
  { icon: Atom, label: '重粒子線、陽子線治療設施' },
  { icon: Stethoscope, label: '專門診所' },
  { icon: FlaskConical, label: '再生醫療診所' },
];

export default function CancerTreatmentPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <MemberLayout showFooter={true}>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical.png')]"></div>
        </div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <HeartPulse size={16} className="text-red-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">日本綜合治療</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              癌症患者<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">赴日治療服務</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              安全性高、治療精準、重視生活質量（QOL）<br/>
              強調循證醫學與多學科協作
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <MessageSquare size={20} />
                諮詢治療方案
                <ArrowRight size={18} />
              </a>
              <a
                href="#treatment-flow"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                了解治療流程
              </a>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">專業醫療翻譯全程陪同</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">遠程會診確認方案後再來日</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">治療後持續隨訪支持</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Flow Section */}
      <section id="treatment-flow" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Treatment Process</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              癌症患者赴日治療流程
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              從前期諮詢到治療完成，全程專業支援，讓您安心治療
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden md:block"></div>

              <div className="space-y-6">
                {TREATMENT_FLOW.map((item, index) => (
                  <div
                    key={item.step}
                    className="relative flex gap-6 group"
                  >
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>

                    {/* Content Card */}
                    <div
                      className={`flex-grow bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer ${expandedStep === item.step ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                      onClick={() => setExpandedStep(expandedStep === item.step ? null : item.step)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                            {item.fee && (
                              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                ¥{item.fee}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">{item.subtitle}</p>

                          {/* Expanded Content */}
                          {expandedStep === item.step && item.desc && (
                            <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                          )}
                        </div>

                        {/* Flow Direction */}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="bg-gray-200 px-2 py-1 rounded">{item.from}</span>
                          <ArrowRight size={12} />
                          <span className="bg-gray-200 px-2 py-1 rounded">{item.to}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Treatments Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-purple-600 text-xs tracking-widest uppercase font-bold">Standard Treatment</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              癌症標準治療
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              安全性高、治療精準、重視生活質量（QOL）、強調循證醫學與多學科協作
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {STANDARD_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
                blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
                green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
                purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
                orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
                red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
              };
              const colors = colorClasses[treatment.color];

              return (
                <div
                  key={treatment.id}
                  className={`bg-white rounded-2xl p-8 border ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">{treatment.title}</h3>
                  <ul className="space-y-2 mb-4">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {treatment.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regenerative Medicine Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 text-xs tracking-widest uppercase font-bold">Regenerative Medicine</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
              再生醫療等輔助治療
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              結合最新再生醫療技術，幫助患者身體恢復並預防癌症復發
            </p>
          </div>

          {/* Purpose Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
              <HeartPulse size={16} />
              身體恢復
            </div>
            <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold">
              <Leaf size={16} />
              長期健康管理
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              <Shield size={16} />
              預防復發
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {REGENERATIVE_TREATMENTS.map((treatment) => {
              const Icon = treatment.icon;
              const colorClasses: Record<string, { gradient: string; bg: string; text: string }> = {
                blue: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
                purple: { gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-600' },
                green: { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600' },
              };
              const colors = colorClasses[treatment.color];

              return (
                <div key={treatment.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={32} />
                  </div>
                  <div className={`inline-block ${colors.bg} ${colors.text} text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                    {treatment.purpose}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{treatment.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{treatment.subtitle}</p>
                  <ul className="space-y-2">
                    {treatment.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Institutions */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">日本合作醫療機構</h2>
            <p className="text-gray-300">與日本頂尖醫療機構建立合作關係</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {PARTNER_INSTITUTIONS.map((inst, i) => {
              const Icon = inst.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-sm text-white/90">{inst.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Purchase Section */}
      <section id="contact-form" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-xs tracking-widest uppercase font-bold">Book Service</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-4">
                諮詢服務預約
              </h2>
              <p className="text-gray-500">
                選擇您需要的服務，在線支付後我們將在 24 小時內與您聯繫
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Service Card 1: Initial Consultation */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{CONSULTATION_SERVICES.initial.name}</h3>
                      <p className="text-blue-200 text-sm">{CONSULTATION_SERVICES.initial.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">¥{CONSULTATION_SERVICES.initial.price.toLocaleString()}</p>
                      <p className="text-xs text-blue-200">含稅</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">{CONSULTATION_SERVICES.initial.description}</p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>病歷資料翻譯（中→日）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>日本醫院初步諮詢</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>治療可行性評估報告</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>費用概算說明</span>
                    </li>
                  </ul>
                  <Link
                    href="/cancer-treatment/initial-consultation"
                    className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center font-bold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition shadow-lg"
                  >
                    立即預約
                  </Link>
                </div>
              </div>

              {/* Service Card 2: Remote Consultation */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all group">
                <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{CONSULTATION_SERVICES.remote.name}</h3>
                      <p className="text-purple-200 text-sm">{CONSULTATION_SERVICES.remote.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">¥{CONSULTATION_SERVICES.remote.price.toLocaleString()}</p>
                      <p className="text-xs text-purple-200">含稅</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">{CONSULTATION_SERVICES.remote.description}</p>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>日本專科醫生視頻會診</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>專業醫療翻譯全程陪同</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>詳細治療方案說明</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>治療費用明細報價</span>
                    </li>
                  </ul>
                  <Link
                    href="/cancer-treatment/remote-consultation"
                    className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white text-center font-bold rounded-xl hover:from-purple-700 hover:to-pink-800 transition shadow-lg"
                  >
                    立即預約
                  </Link>
                </div>
              </div>
            </div>

            {/* Member System Notice */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">會員體系說明</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    癌症治療諮詢服務與 TIMC 體檢服務共用同一會員體系。購買任一服務後，您將自動成為 NIIJIMA 會員，
                    可在「我的訂單」中查看所有預約記錄，並享受會員專屬服務。
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Methods - For inquiries only */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-600" />
                付款前有疑問？歡迎諮詢
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://line.me/ti/p/j3XxBP50j9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#06C755] text-white p-3 rounded-xl hover:bg-[#05b04c] transition text-sm"
                >
                  <MessageSquare size={18} />
                  <span className="font-bold">LINE 諮詢</span>
                </a>
                <a
                  href="mailto:info@niijima-koutsu.jp"
                  className="flex items-center gap-3 bg-gray-800 text-white p-3 rounded-xl hover:bg-gray-700 transition text-sm"
                >
                  <Mail size={18} />
                  <span className="font-bold">郵件諮詢</span>
                </a>
                <a
                  href="tel:+81-70-2173-8304"
                  className="flex items-center gap-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition text-sm"
                >
                  <Phone size={18} />
                  <span className="font-bold">電話諮詢</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="py-8 bg-white text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} />
          返回首頁
        </Link>
      </div>
    </MemberLayout>
  );
}
