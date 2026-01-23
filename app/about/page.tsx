'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import {
  ArrowRight,
  Quote,
  Target,
  Eye,
  Heart,
  Users,
  Building2,
  Globe,
  Award,
  TrendingUp,
  Handshake,
  Shield,
  Sparkles,
  ChevronRight,
  MapPin,
  Calendar,
  Star,
  CheckCircle2
} from 'lucide-react';

// 动画计数器 Hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
};

// 历史沿革数据
const historyTimeline = [
  {
    year: '2018',
    title: '新島交通株式會社 創立',
    description: '以「讓高端日本旅遊體驗更易觸及」為使命，在大阪正式創業',
    icon: Building2,
  },
  {
    year: '2019',
    title: '取得第二種旅行業登録',
    description: '正式獲得日本觀光廳核發的旅行業許可，開始提供完整旅遊服務',
    icon: Award,
  },
  {
    year: '2020',
    title: '醫療觀光事業部成立',
    description: '與德洲會國際醫療中心（TIMC）建立戰略合作，開拓精密體檢市場',
    icon: Heart,
  },
  {
    year: '2021',
    title: '名門高爾夫事業啟動',
    description: '與日本關西地區 20+ 頂級會員制球場建立獨家合作關係',
    icon: Star,
  },
  {
    year: '2023',
    title: 'AI 報價系統上線',
    description: '自主研發 LinkQuote AI 智能報價引擎，實現 24 小時即時報價',
    icon: Sparkles,
  },
  {
    year: '2024',
    title: '導遊合夥人計劃發布',
    description: '推出白標解決方案，賦能 3000+ 在日華人導遊數位轉型',
    icon: Users,
  },
  {
    year: '2025',
    title: '綜合醫療事業拓展',
    description: '新增癌症治療（質子重離子/光免疫/BNCT）轉介服務，深化醫療版圖',
    icon: Globe,
  },
];

// 合作夥伴 Logo（使用文字代替，实际可换成图片）
const partners = [
  { name: 'TIMC OSAKA', category: '醫療' },
  { name: '德洲會醫療集團', category: '醫療' },
  { name: '関西名門ゴルフ倶楽部', category: '高爾夫' },
  { name: '大阪帝国ホテル', category: '酒店' },
  { name: 'The Ritz-Carlton', category: '酒店' },
  { name: 'ANA', category: '航空' },
  { name: 'JAL', category: '航空' },
  { name: 'JR西日本', category: '交通' },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">

        {/* Hero Section - 大气的企业形象首屏 */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* 背景 */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2000&auto=format&fit=crop')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
          </div>

          {/* 装饰元素 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          {/* 内容 */}
          <div className="relative z-10 container mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">About Us</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              用心連結世界與日本
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              自 2018 年創立以來，我們致力於為華人旅客<br className="hidden md:block" />
              打造無與倫比的日本高端旅遊體驗
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                <span>大阪市中央区</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                <span>創立於 2018 年</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-400" />
                <span>第二種旅行業登録</span>
              </div>
            </div>
          </div>

          {/* 向下滚动提示 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* 社长致辞 Section */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* 左侧：照片 */}
              <div className="relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://i.ibb.co/B2mJDvq7/founder.jpg"
                    alt="代表取締役 員昊"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-sm text-gray-300 mb-1">代表取締役</p>
                    <p className="text-2xl font-serif font-bold">員 昊</p>
                    <p className="text-sm text-gray-300">Yuan Hao</p>
                  </div>
                </div>

                {/* 装饰框 */}
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-blue-200 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10" />
              </div>

              {/* 右侧：致辞内容 */}
              <div>
                <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
                  <Quote size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">Message from CEO</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
                  社長致辭
                </h2>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    感謝您對新島交通的關注。
                  </p>

                  <p>
                    我在日本生活多年，深刻體會到日本獨特的「おもてなし」精神——那種發自內心、
                    細緻入微的待客之道。然而，我也看到許多華人旅客因語言障礙和資訊不對稱，
                    無法真正享受到日本最優質的服務。
                  </p>

                  <p>
                    這正是我創立新島交通的初衷：<strong className="text-gray-900">成為連結華人世界與日本高端資源的橋樑</strong>。
                    無論是世界頂級的精密體檢、會員制名門高爾夫、還是深度商務考察，
                    我們都希望讓每一位客戶感受到「原來日本還可以這樣玩」的驚喜。
                  </p>

                  <p>
                    2024 年，我們推出了「導遊合夥人計劃」，希望賦能更多在日華人導遊，
                    讓他們也能擁有旅行社級別的資源和技術支持。這不僅是商業模式的創新，
                    更是我們對整個行業的責任與承諾。
                  </p>

                  <p className="text-lg font-medium text-gray-900">
                    未來，我們將持續深耕醫療觀光、高端定制、商務考察三大領域，
                    以科技賦能服務，以真誠打動人心。
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <img
                    src="https://i.ibb.co/placeholder-signature.png"
                    alt="Signature"
                    className="h-12 opacity-80 hidden"
                  />
                  <p className="text-gray-900 font-serif text-lg">新島交通株式會社</p>
                  <p className="text-gray-500">代表取締役 員 昊</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 企业理念 Section - Mission / Vision / Values */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4">企業理念</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-400">MISSION</h3>
                <h4 className="text-2xl font-serif font-bold mb-4">使命</h4>
                <p className="text-gray-300 leading-relaxed">
                  消除資訊不對稱，讓每一位華人旅客都能平等享有日本最優質的旅遊資源與服務。
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye size={32} className="text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-amber-400">VISION</h3>
                <h4 className="text-2xl font-serif font-bold mb-4">願景</h4>
                <p className="text-gray-300 leading-relaxed">
                  成為亞太地區最值得信賴的日本高端旅遊服務商，連結 10 萬+ 高淨值客戶與日本頂級資源。
                </p>
              </div>

              {/* Values */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-rose-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={32} className="text-rose-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-rose-400">VALUES</h3>
                <h4 className="text-2xl font-serif font-bold mb-4">價值觀</h4>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" />
                    <span>客戶至上，真誠服務</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" />
                    <span>專業精進，追求卓越</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" />
                    <span>合作共贏，賦能夥伴</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-rose-400 flex-shrink-0" />
                    <span>創新驅動，擁抱變化</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 关键数据 Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Key Figures</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">關鍵數據</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                數字見證成長，實力贏得信賴
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  value: 5000,
                  suffix: '+',
                  label: '累計服務客戶',
                  icon: Users,
                  color: 'blue'
                },
                {
                  value: 200,
                  suffix: '+',
                  label: '合作旅行社',
                  icon: Handshake,
                  color: 'amber'
                },
                {
                  value: 50,
                  suffix: '+',
                  label: '合作醫療機構',
                  icon: Heart,
                  color: 'rose'
                },
                {
                  value: 98,
                  suffix: '%',
                  label: '客戶滿意度',
                  icon: Star,
                  color: 'green'
                },
              ].map((stat, index) => {
                const { count, ref } = useCountUp(stat.value);
                const Icon = stat.icon;
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-600',
                  amber: 'bg-amber-50 text-amber-600',
                  rose: 'bg-rose-50 text-rose-600',
                  green: 'bg-green-50 text-green-600',
                };
                return (
                  <div
                    key={index}
                    ref={ref}
                    className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className={`w-14 h-14 ${colorMap[stat.color]} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={28} />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      {count.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-gray-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* 额外数据行 */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: '創立年份', value: '2020年', icon: Calendar },
                { label: '員工人數', value: '25名+', icon: Users },
                { label: '服務覆蓋', value: '日本全國', icon: Globe },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Icon size={24} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-xl font-bold text-gray-900">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 历史沿革 Section */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Our History</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">發展歷程</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                從創立到今天，每一步都是對使命的堅守
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* 中央线 */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 hidden md:block" />

              {historyTimeline.map((item, index) => {
                const Icon = item.icon;
                const isLeft = index % 2 === 0;

                return (
                  <div key={index} className={`relative flex items-center mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* 内容卡片 */}
                    <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className={`inline-flex items-center gap-2 text-blue-600 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <span className="text-2xl font-bold">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>
                    </div>

                    {/* 中央圆点 */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full items-center justify-center shadow-lg z-10">
                      <Icon size={20} className="text-white" />
                    </div>

                    {/* 占位 */}
                    <div className="hidden md:block w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 合作夥伴 Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Partners</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-4">合作夥伴</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                攜手行業頂尖品牌，為您提供極致體驗
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="group p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="text-xs text-blue-600 font-medium mb-2">{partner.category}</div>
                  <div className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>

            {/* 认证徽章 */}
            <div className="mt-16 flex flex-wrap justify-center gap-8">
              {[
                { label: '第二種旅行業登録', icon: Shield },
                { label: '全国旅行業協会 正会員', icon: Award },
                { label: 'TIMC 官方代理', icon: CheckCircle2 },
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full">
                    <Icon size={20} />
                    <span className="font-medium">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              準備好開啟您的日本之旅了嗎？
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              無論是精密體檢、高爾夫之旅還是商務考察，我們都將為您提供最專業的服務
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/?page=medical"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
              >
                了解醫療服務 <ArrowRight size={18} />
              </Link>
              <Link
                href="/business/partner"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                成為合作夥伴 <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
