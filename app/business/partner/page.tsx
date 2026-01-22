'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Building2,
  Shield,
  Handshake,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  HeartPulse,
  Trophy,
  Factory,
  Loader2,
  Check
} from 'lucide-react';

export default function PartnerBusinessPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    businessType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'b2b_travel_agency' })
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout showFooter={true}>
      {/* Hero Section - 全屏沉浸式 */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop"
            alt="Business Partnership"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-amber-400"></div>
              <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">B2B Partnership</span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
              攜手合作
              <br />
              <span className="text-amber-400">共創日本旅遊新機遇</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light max-w-2xl">
              新島交通是日本正規註冊旅行社，專注高端定制服務12年。我們誠邀中國大陸、台灣、韓國及東南亞地區的旅行社夥伴，共同開拓日本醫療健檢、名門高爾夫、商務考察市場。
            </p>

            {/* 合作地区 */}
            <div className="flex flex-wrap gap-3 mb-10">
              {['中國大陸', '台灣', '韓國', '新加坡', '馬來西亞', '泰國', '越南', '印尼'].map((region, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  {region}
                </span>
              ))}
            </div>

            <a
              href="#contact-form"
              className="inline-flex items-center px-8 py-4 bg-amber-400 text-slate-900 text-sm font-medium tracking-wider hover:bg-amber-300 transition-colors"
            >
              立即洽談合作
              <ArrowRight size={18} className="ml-3" />
            </a>
          </div>
        </div>

        {/* 右下角资质标签 */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 max-w-xs">
            <div className="text-xs text-amber-400 mb-3 uppercase tracking-wider">官方資質</div>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-amber-400" />
                大阪府知事登録旅行業 第2-3115号
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-amber-400" />
                日本旅行業協會（JATA）正會員
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 公司实力 - 数据展示 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">Why Partner With Us</p>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
                為什麼選擇新島交通
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { value: '12', suffix: '年', label: '深耕日本市場' },
                { value: '3000', suffix: '+', label: '服務客戶' },
                { value: '500', suffix: '+', label: '合作企業資源' },
                { value: '98', suffix: '%', label: '客戶滿意度' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-gray-50 rounded-2xl">
                  <div className="text-4xl font-light text-gray-900 mb-2">
                    {stat.value}<span className="text-amber-500">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 核心优势 */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: HeartPulse,
                  title: '獨家醫療資源',
                  desc: '與德洲會、TIMC等日本頂級醫療機構深度合作，提供精密健檢、癌症治療、質子重離子等稀缺醫療資源。',
                  color: 'text-teal-600',
                  bg: 'bg-teal-50'
                },
                {
                  icon: Trophy,
                  title: '名門高爾夫特權',
                  desc: '廣野、霞ヶ関、小野等25+名門球場獨家預約權，無需會員介紹，為您的高端客戶提供稀缺體驗。',
                  color: 'text-amber-600',
                  bg: 'bg-amber-50'
                },
                {
                  icon: Factory,
                  title: '商務考察網絡',
                  desc: '豐田、松下、資生堂等500+企業考察資源，覆蓋16大行業，從工廠參觀到高管對談一站式安排。',
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-8 rounded-2xl ${item.bg}`}>
                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 ${item.color}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 合作模式 */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] text-amber-400 uppercase mb-4">Partnership Model</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                  靈活的合作模式
                </h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                  我們提供多種合作方式，無論是地接服務、產品代理還是聯合推廣，都能找到最適合您的合作模式。全程提供中文對接，讓溝通無障礙。
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: '地接服務合作',
                      desc: '您負責客源，我們提供日本全程地接，包括行程安排、用車、住宿、餐飲、導遊等一站式服務。',
                      items: ['專業行程設計', '全程品質保障', '24小時應急支援']
                    },
                    {
                      title: '產品代理合作',
                      desc: '代理我們的醫療健檢、高爾夫、商務考察等特色產品，享受優惠批發價格和專屬支持。',
                      items: ['產品培訓支持', '銷售資料提供', '利潤空間保障']
                    },
                    {
                      title: '聯合推廣合作',
                      desc: '共同開發市場，聯合舉辦推介會、展會活動，共享客戶資源，實現雙贏。',
                      items: ['品牌聯合曝光', '市場資源共享', '活動費用分擔']
                    }
                  ].map((model, idx) => (
                    <div key={idx} className="border-l-2 border-amber-400/50 pl-6">
                      <h4 className="text-lg font-medium text-white mb-2">{model.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{model.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {model.items.map((item, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-medium text-white mb-6">合作夥伴權益</h3>
                <div className="space-y-4">
                  {[
                    '優惠的批發價格體系',
                    '專屬客戶經理對接',
                    '中文合同與發票',
                    '靈活的結算週期',
                    '產品培訓與銷售支持',
                    '聯合推廣資源',
                    '優先預訂權（旺季）',
                    '年度返利獎勵',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice of Partners - 好评如潮 */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-amber-500 uppercase mb-3">Voice of Partners</p>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
                好評如潮
              </h2>
              <p className="text-lg text-gray-500">
                500+ 旅行社のリアルな評価
              </p>
              <p className="text-sm text-gray-400 mt-2">
                台湾・中国・香港・シンガポールのプロフェッショナルたちから選ばれています
              </p>
            </div>

            {/* 评价总览 */}
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-5xl font-light text-amber-500 mb-1">4.9</div>
                <div className="flex items-center justify-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-gray-500">基於 500+ 評價</div>
              </div>
              <div className="h-16 w-px bg-gray-200"></div>
              <div className="flex gap-4">
                {[
                  { region: '🇹🇼 台灣', count: '180+' },
                  { region: '🇨🇳 中國', count: '150+' },
                  { region: '🇭🇰 香港', count: '90+' },
                  { region: '🇸🇬 新加坡', count: '80+' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center px-4">
                    <div className="text-lg font-medium text-gray-900">{item.count}</div>
                    <div className="text-xs text-gray-500">{item.region}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 评价墙 - 瀑布流效果 */}
            <div className="relative">
              {/* 渐变遮罩 */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

              {/* 第一行 - 向左滚动 */}
              <div className="flex gap-4 mb-4 animate-scroll-left">
                {[
                  { quote: '醫療資源太強了，客戶都說比台灣代理商專業', name: '陳經理', region: '台灣', rating: 5 },
                  { quote: '高爾夫預約真的一流，廣野都能搞定', name: '張總', region: '上海', rating: 5 },
                  { quote: '合作3年，從沒出過問題，非常放心', name: 'Lee代表', region: '首爾', rating: 5 },
                  { quote: '報價速度快，資料齊全，省了我很多時間', name: '林董', region: '台北', rating: 5 },
                  { quote: '商務考察安排得很專業，客戶反饋超好', name: '黃總監', region: '深圳', rating: 5 },
                  { quote: '名門球場的人脈真的不是蓋的', name: 'Tony', region: '香港', rating: 5 },
                  { quote: '健檢報告翻譯很專業，客戶很滿意', name: '吳經理', region: '台中', rating: 5 },
                  { quote: '日本地接找他們就對了', name: '孫總', region: '北京', rating: 5 },
                  // 重复一遍以实现无缝滚动
                  { quote: '醫療資源太強了，客戶都說比台灣代理商專業', name: '陳經理', region: '台灣', rating: 5 },
                  { quote: '高爾夫預約真的一流，廣野都能搞定', name: '張總', region: '上海', rating: 5 },
                  { quote: '合作3年，從沒出過問題，非常放心', name: 'Lee代表', region: '首爾', rating: 5 },
                  { quote: '報價速度快，資料齊全，省了我很多時間', name: '林董', region: '台北', rating: 5 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">"{item.quote}"</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-amber-600">{item.region}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 第二行 - 向右滚动 */}
              <div className="flex gap-4 mb-4 animate-scroll-right">
                {[
                  { quote: '價格透明，不會亂加價，長期合作的好夥伴', name: '周經理', region: '杭州', rating: 5 },
                  { quote: 'VIP客戶指定要他們服務，品質有保證', name: '鄭總', region: '台北', rating: 5 },
                  { quote: '緊急情況處理很及時，24小時真的有人', name: 'David', region: '新加坡', rating: 5 },
                  { quote: '日本通，什麼稀奇古怪的要求都能滿足', name: '劉董', region: '廣州', rating: 5 },
                  { quote: '翻譯陪同很專業，客戶體驗一流', name: '許經理', region: '高雄', rating: 5 },
                  { quote: '企業考察的對接太厲害了，豐田都能進', name: '王總監', region: '成都', rating: 5 },
                  { quote: '做高端團必找他們，口碑好', name: 'Michael', region: '香港', rating: 5 },
                  { quote: '續約5年了，說明一切', name: '趙經理', region: '南京', rating: 5 },
                  // 重复
                  { quote: '價格透明，不會亂加價，長期合作的好夥伴', name: '周經理', region: '杭州', rating: 5 },
                  { quote: 'VIP客戶指定要他們服務，品質有保證', name: '鄭總', region: '台北', rating: 5 },
                  { quote: '緊急情況處理很及時，24小時真的有人', name: 'David', region: '新加坡', rating: 5 },
                  { quote: '日本通，什麼稀奇古怪的要求都能滿足', name: '劉董', region: '廣州', rating: 5 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">"{item.quote}"</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-amber-600">{item.region}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 第三行 - 向左滚动（速度稍慢） */}
              <div className="flex gap-4 animate-scroll-left-slow">
                {[
                  { quote: '找了很久才找到這麼靠譜的日本地接', name: '蔡經理', region: '馬來西亞', rating: 5 },
                  { quote: '精密健檢的安排無可挑剔', name: '楊總', region: '上海', rating: 5 },
                  { quote: '服務細節做得好，客人都很感動', name: '謝董', region: '台北', rating: 5 },
                  { quote: '反應快、執行力強、值得信賴', name: 'Jason', region: '香港', rating: 5 },
                  { quote: '日本高端旅遊的首選合作夥伴', name: '馬經理', region: '蘇州', rating: 5 },
                  { quote: '專業程度超出預期，強烈推薦', name: 'Alan', region: '新加坡', rating: 5 },
                  { quote: '處理問題的能力一流，很安心', name: '方總監', region: '武漢', rating: 5 },
                  { quote: '合作愉快，期待更多項目', name: '葉經理', region: '台南', rating: 5 },
                  // 重复
                  { quote: '找了很久才找到這麼靠譜的日本地接', name: '蔡經理', region: '馬來西亞', rating: 5 },
                  { quote: '精密健檢的安排無可挑剔', name: '楊總', region: '上海', rating: 5 },
                  { quote: '服務細節做得好，客人都很感動', name: '謝董', region: '台北', rating: 5 },
                  { quote: '反應快、執行力強、值得信賴', name: 'Jason', region: '香港', rating: 5 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">"{item.quote}"</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-amber-600">{item.region}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 精选评价 - 大卡片 */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  quote: '與新島交通合作3年，他們的醫療資源是我們在日本見過最專業的。客戶滿意度非常高，回購率達到60%以上。這種合作夥伴可遇不可求。',
                  name: '王總經理',
                  company: '某知名旅行社',
                  region: '🇨🇳 上海',
                  avatar: 'W'
                },
                {
                  quote: '名門高爾夫球場的預約一直是我們的痛點，新島交通幫我們打開了這扇門。現在我們的高端客戶都指名要他們的服務，真的很感謝。',
                  name: '李董事長',
                  company: '高爾夫旅遊專家',
                  region: '🇹🇼 台北',
                  avatar: 'L'
                },
                {
                  quote: '日本商務考察市場競爭激烈，但新島交通的企業資源是獨一無二的。豐田、松下這些大廠，他們都能安排，這才是真正的實力。',
                  name: '金代表',
                  company: '商務旅行社',
                  region: '🇰🇷 首爾',
                  avatar: 'K'
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                      <div className="text-xs text-amber-600 mt-0.5">{testimonial.region}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .animate-scroll-left-slow {
          animation: scroll-left 50s linear infinite;
        }
      `}</style>

      {/* 为什么现在就要合作 - 行业转型 */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* 左侧：行业痛点 */}
              <div>
                <p className="text-xs tracking-[0.3em] text-amber-400 uppercase mb-4">Industry Transformation</p>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight">
                  傳統旅行社的
                  <span className="text-amber-400">轉型契機</span>
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="border-l-2 border-amber-400/50 pl-5">
                    <h4 className="font-medium text-white mb-1">AI 正在改變旅遊市場格局</h4>
                    <p className="text-gray-400 text-sm">機票酒店、常規行程，客戶可以輕鬆自助完成。旅行社需要提供更有價值的專業服務。</p>
                  </div>

                  <div className="border-l-2 border-amber-400/50 pl-5">
                    <h4 className="font-medium text-white mb-1">自由行趨勢持續上升</h4>
                    <p className="text-gray-400 text-sm">新一代旅客更追求個性化體驗，傳統跟團遊市場正在縮小，專業定制成為新趨勢。</p>
                  </div>

                  <div className="border-l-2 border-amber-400/50 pl-5">
                    <h4 className="font-medium text-white mb-1">差異化服務是核心競爭力</h4>
                    <p className="text-gray-400 text-sm">常規旅遊產品同質化嚴重，只有專業資源整合能力才能建立競爭壁壘。</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-3xl font-light text-amber-400 mb-2">3,600萬+</div>
                  <div className="text-sm text-gray-300">2025年預計訪日遊客人次，高端定制市場需求旺盛</div>
                </div>
              </div>

              {/* 右侧：解决方案 */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  轉型高端定制<br/>開拓新市場
                </h3>

                <p className="text-slate-800 mb-8 leading-relaxed">
                  醫療健檢、名門高爾夫、企業考察——這些需要<strong>深度資源整合</strong>和<strong>專業對接能力</strong>的服務領域，正是旅行社轉型的最佳方向。
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    '精密健檢：日本頂級醫療機構資源',
                    '名門高爾夫：25+ 名門球場預約渠道',
                    '商務考察：500+ 企業參訪資源網絡',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-slate-900 flex-shrink-0" />
                      <span className="text-slate-900 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/20 rounded-xl p-6">
                  <div className="text-sm text-slate-800 mb-3 font-medium">這些資源，我們已經準備好了</div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    德洲會醫院的預約渠道、廣野高爾夫的會員人脈、豐田工廠的考察許可——12年深耕日本市場，為您的業務轉型提供強大支持。
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-900/20">
                  <div className="text-slate-900 font-bold text-lg mb-2">攜手合作，共創未來</div>
                  <p className="text-slate-700 text-sm">您有客戶資源，我們有專業服務能力。讓專業的人做專業的事，一起開拓高端旅遊市場。</p>
                </div>
              </div>
            </div>

            {/* 底部数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
              {[
                { value: '12年', label: '深耕日本市場' },
                { value: '500+', label: '企業考察資源' },
                { value: '25+', label: '名門球場合作' },
                { value: '95%', label: '合作夥伴續約率' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-light text-amber-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 联系表单 */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">Contact Us</p>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
                開啟合作洽談
              </h2>
              <p className="text-gray-500">
                填寫以下表單，我們的商務團隊將在24小時內與您聯繫
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-16 bg-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">提交成功</h3>
                <p className="text-gray-600">感謝您的合作意向，我們將儘快與您聯繫！</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">公司名稱 *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="請輸入貴公司名稱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">聯繫人 *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="請輸入聯繫人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電子郵箱 *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">聯繫電話 *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    placeholder="請輸入聯繫電話（含國碼）"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">所在國家/地區 *</label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  >
                    <option value="">請選擇</option>
                    <option value="中國大陸">中國大陸</option>
                    <option value="台灣">台灣</option>
                    <option value="香港">香港</option>
                    <option value="韓國">韓國</option>
                    <option value="新加坡">新加坡</option>
                    <option value="馬來西亞">馬來西亞</option>
                    <option value="泰國">泰國</option>
                    <option value="越南">越南</option>
                    <option value="印尼">印尼</option>
                    <option value="菲律賓">菲律賓</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">業務類型 *</label>
                  <select
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  >
                    <option value="">請選擇</option>
                    <option value="旅行社">旅行社</option>
                    <option value="醫療中介">醫療中介/健康管理</option>
                    <option value="高爾夫旅遊">高爾夫旅遊</option>
                    <option value="商務考察">商務考察/會展</option>
                    <option value="OTA平台">OTA/在線平台</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">合作意向說明</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
                    placeholder="請簡要說明您的合作意向、主要客群、預計業務量等..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>
                        提交合作申請
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-amber-400" />
                </div>
                <div className="text-sm text-gray-400 mb-1">商務郵箱</div>
                <a href="mailto:haoyuan@niijima-koutsu.jp" className="text-white hover:text-amber-400 transition-colors">
                  haoyuan@niijima-koutsu.jp
                </a>
              </div>
              <div>
                <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} className="text-amber-400" />
                </div>
                <div className="text-sm text-gray-400 mb-1">商務電話</div>
                <a href="tel:+81-6-6632-8807" className="text-white hover:text-amber-400 transition-colors">
                  +81-6-6632-8807
                </a>
              </div>
              <div>
                <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-amber-400" />
                </div>
                <div className="text-sm text-gray-400 mb-1">公司地址</div>
                <div className="text-white">
                  大阪府大阪市浪速区大国1-2-21-602
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
