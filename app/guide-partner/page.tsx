'use client';

import { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import {
  Sparkles,
  HeartPulse,
  Dna,
  Users,
  Shield,
  FileText,
  CheckCircle,
  X,
  Building,
  Award,
  ArrowRight,
  MessageSquare,
  Globe,
  Palette,
  Zap,
  CreditCard,
  Link2,
  Smartphone
} from 'lucide-react';

// 微信二維碼圖片路徑
const WECHAT_QR_URL = '/wechat-qr.png';

export default function GuidePartnerPage() {
  const [showWechatQR, setShowWechatQR] = useState(false);

  return (
    <PublicLayout showFooter={false} activeNav="partner">
      {/* Hero Section - Full screen with background image */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop')`,
          }}
        >
          {/* Orange Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/95 via-amber-900/85 to-orange-900/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl top-1/4 -left-20"></div>
          <div className="absolute w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl bottom-1/4 right-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <Users size={16} className="text-orange-400" />
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Guide Partnership Program</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              導遊提攜夥伴計劃<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300">對接旅行社級資源</span>
            </h1>

            <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
              您直接接觸富裕層客戶，卻沒有旅行社資質？
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              新島交通作為日本第二類旅行社，為您提供合規的客戶介紹通道
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setShowWechatQR(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <MessageSquare size={20} />
                立即申請加入
                <ArrowRight size={18} />
              </button>
              <a
                href="#services"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                了解更多服務
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">日本第二類旅行社</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">JATA正會員</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm">介紹報酬制度</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">您遇到的困境</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>高端夜總會、醫療機構<strong>只和旅行社簽約</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>客戶想去高端場所，您<strong>無法拿到資源</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>帶客消費後，<strong>拿不到任何返傭</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>個人身份與商家合作，<strong>缺乏信任背書</strong></span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">新島為您解決</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>由新島交通<strong>統一簽約、預約下單</strong>，合規對接商家</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>全日本160家高級夜總會</strong>、TIMC體檢等合作資源</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>介紹報酬制度</strong>，成功介紹客戶即可獲得報酬</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>新島作為<strong>旅行服務提供者</strong>，交易有保障</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">三大核心服務</h2>
            <p className="text-gray-500">覆蓋高淨值客戶最需要的高端服務場景</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Nightclub */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-4 group-hover:shadow-2xl transition-shadow">
                <Sparkles className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-bold mb-2">高級夜總會</h3>
                <p className="text-purple-100 text-sm mb-4">全日本頂級店舖合作</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>160家店舖</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>覆蓋全日本（除北海道/沖繩）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>銀座、六本木、北新地等</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-sm text-purple-600 font-medium">客單價 30萬~150萬日元</p>
              </div>
            </div>

            {/* Medical Checkup */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white mb-4 group-hover:shadow-2xl transition-shadow">
                <HeartPulse className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-bold mb-2">TIMC精密體檢</h3>
                <p className="text-blue-100 text-sm mb-4">德洲會集團旗艦設施</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>大阪JP Tower</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>PET-CT、MRI全套</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>中文翻譯全程陪同</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">套餐 50萬~200萬日元</p>
              </div>
            </div>

            {/* Treatment */}
            <div className="group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white mb-4 group-hover:shadow-2xl transition-shadow">
                <Dna className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-bold mb-2">綜合醫療</h3>
                <p className="text-green-100 text-sm mb-4">日本頂尖醫療資源</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>幹細胞治療</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>抗衰老療程</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>專科治療轉介</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm text-green-600 font-medium">治療費 100萬~500萬日元</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">合作規則</h2>
            <p className="text-gray-500">簡單透明，保護雙方利益</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">推薦制準入</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                必須由現有會員推薦才能加入<br/>
                確保圈子品質，防止惡意註冊
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">500元訂金</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                預約夜總會需支付500元人民幣訂金<br/>
                當天取消不退款，篩選認真客戶
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">月結算</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                每月統一結算介紹報酬<br/>
                支持微信、支付寶、銀行轉帳
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us - Reframed as "What You Get" */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-medium text-sm mb-2">加入後您將獲得</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">一張「旅行社級」的入場券</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">成為新島交通的提攜夥伴，為客戶介紹優質旅行服務</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 - Identity Upgrade */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">身份升級</h4>
                  <p className="text-xs text-gray-400">個人導遊 → 旅行社提攜夥伴</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                由<span className="font-semibold text-blue-600">「新島交通株式會社」</span>統一提供服務。<br/>
                高端店舖只認旅行社？現在您可以介紹客戶給我們。
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">大阪府知事登錄旅行業 第2-3115號 / JATA正會員</p>
              </div>
            </div>

            {/* Card 2 - Exclusive Access */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">頂級資源直通</h4>
                  <p className="text-xs text-gray-400">別人約不到，您一個電話搞定</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                銀座、六本木、北新地...<span className="font-semibold text-purple-600">160家高級夜總會</span>隨時待命。<br/>
                客戶想去哪家？您說了算。
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">當日預約</span>
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">專屬通道</span>
              </div>
            </div>

            {/* Card 3 - Medical Resources */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">醫療資源獨家</h4>
                  <p className="text-xs text-gray-400">日本最大民間醫療集團背書</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                德洲會<span className="font-semibold text-green-600">TIMC精密體檢</span>官方合作。<br/>
                PET-CT、MRI全套檢查，無需層層轉介，直連預約。
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">中文翻譯</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">專屬VIP通道</span>
              </div>
            </div>

            {/* Card 4 - Earnings */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">介紹報酬有保障</h4>
                  <p className="text-xs text-gray-400">成功介紹即有報酬</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                以前帶客消費，<span className="line-through text-gray-400">報酬？不存在的。</span><br/>
                現在，<span className="font-semibold text-orange-600">每一單成功介紹都有報酬</span>。明細清楚，準時到帳。
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded">每月15日結算</span>
                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded">明細可查</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Whitelabel Partner Site Section - 痛点驱动 */}
      <section id="whitelabel" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl top-0 -right-20"></div>
          <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl bottom-0 -left-10"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Pain Point Header - 直击痛点 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-400/30 px-4 py-2 rounded-full mb-6">
              <X size={16} className="text-red-400" />
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider">導遊的困境</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              您是不是也遇到這些問題？
            </h2>

            {/* Pain Points Grid */}
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 text-left">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-red-300 text-sm font-medium mb-1">轉發別人的簡介推薦客戶...</p>
                <p className="text-white/60 text-xs">結果客戶直接聯繫對方，您白忙一場</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-red-300 text-sm font-medium mb-1">發一堆 PDF 給客戶...</p>
                <p className="text-white/60 text-xs">客戶懶得看，資訊散亂不清晰</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-red-300 text-sm font-medium mb-1">自己去對接醫院、餐廳...</p>
                <p className="text-white/60 text-xs">耗時耗力，還拿不到好價格</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-red-300 text-sm font-medium mb-1">想建個網站展示服務...</p>
                <p className="text-white/60 text-xs">找設計、找開發，成本動輒幾萬</p>
              </div>
            </div>

            {/* Solution Header */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-400/30 px-4 py-2 rounded-full mb-6">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-xs font-bold text-green-300 uppercase tracking-wider">解決方案</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              一個<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">以您品牌展示</span>的專屬網站
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              套用我們的系統，以您的品牌形象展示服務。<br/>
              所有旅行服務由新島交通提供，您負責客戶介紹。
            </p>
          </div>

          {/* Main Content - Two Columns */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Features - 解决痛点角度 */}
            <div className="space-y-6">
              {/* Feature 1 - 专属品牌展示 */}
              <div className="flex gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">專屬品牌展示</h4>
                  <p className="text-sm text-gray-300">網站以您的品牌形象呈現，客戶通過您認識服務。<span className="text-purple-300 font-medium">成功介紹即獲報酬</span>。</p>
                </div>
              </div>

              {/* Feature 2 - 告别PDF */}
              <div className="flex gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">一個網址勝過十份 PDF</h4>
                  <p className="text-sm text-gray-300">精密體檢、高級夜總會、醫療服務...<span className="text-blue-300 font-medium">一目了然</span>。客戶自己選，您只需收單。</p>
                </div>
              </div>

              {/* Feature 3 - 资源已打通 */}
              <div className="flex gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">資源我們已經打通</h4>
                  <p className="text-sm text-gray-300">德洲會醫療、160家高級夜總會、頂級餐廳...<span className="text-green-300 font-medium">您直接用</span>。無需自己一家家談判。</p>
                </div>
              </div>

              {/* Feature 4 - 成本对比 */}
              <div className="flex gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">自建網站？算一筆帳</h4>
                  <p className="text-sm text-gray-300">
                    <span className="line-through text-gray-500">設計費 ¥50,000+</span>
                    <span className="line-through text-gray-500 ml-2">開發費 ¥100,000+</span>
                    <span className="line-through text-gray-500 ml-2">維護費 ¥5,000/月</span><br/>
                    現在：<span className="text-orange-300 font-bold">¥1,980/月，全包。</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Pricing Card */}
            <div className="lg:pl-8">
              <div className="bg-white rounded-3xl p-8 shadow-2xl text-gray-900 relative overflow-hidden">
                {/* Popular Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  創業首選
                </div>

                {/* Plan Name */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">パートナーサイト利用料</p>
                  <h3 className="text-2xl font-bold">品牌網站套用方案</h3>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">¥1,980</span>
                    <span className="text-gray-500">/月（税込）</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">約 100 元人民幣 / 月 · 一杯咖啡的錢</p>
                </div>

                {/* Features List - 更突出价值 */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm"><span className="font-semibold">專屬品牌展示</span>（以您的品牌呈現）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">專屬域名 yourname.niijima-koutsu.jp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">全套產品一鍵上架（體檢/夜總會/醫療）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">客戶直接在線預約下單</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">訂單自動歸屬 + 介紹報酬</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">5 分鐘開通，無需技術背景</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setShowWechatQR(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  立即開通我的網站
                </button>

                {/* Legal Note */}
                <p className="text-xs text-gray-400 text-center mt-4">
                  本服務為客戶介紹系統使用授權。<br/>
                  所有旅行服務由新島交通株式會社（大阪府知事登錄旅行業 第2-3115號）提供。<br/>
                  您作為介紹人獲得介紹報酬，不構成獨立旅行業經營。
                </p>
              </div>

              {/* Trust Points */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-400" />
                  <span>隨時可取消</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>無隱藏費用</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span>當天開通</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Link Preview */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-sm mb-4">實際效果：點擊查看已開通夥伴的網站</p>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
              <Globe size={18} className="text-purple-300" />
              <code className="text-purple-200 font-mono">demo.niijima-koutsu.jp</code>
              <a
                href="https://demo.niijima-koutsu.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all"
              >
                查看示例 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">立即申請加入</h2>
          <p className="text-gray-300 mb-8">
            成為新島交通的提攜夥伴，為客戶介紹優質旅行服務<br/>
            掃碼添加客服，請注明：提攜夥伴申請 + 您的姓名 + 推薦人
          </p>

          <button
            onClick={() => setShowWechatQR(true)}
            className="inline-flex items-center gap-3 bg-[#07C160] hover:bg-[#06ad56] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
            </svg>
            微信掃碼申請
          </button>

          <p className="mt-6 text-gray-400 text-sm">
            或發送郵件至：<a href="mailto:haoyuan@niijima-koutsu.jp" className="text-orange-400 hover:underline">haoyuan@niijima-koutsu.jp</a>
          </p>
        </div>
      </section>

      {/* Legal Disclaimer Footer */}
      <section className="py-12 bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              重要法律聲明
            </h3>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>1. 服務提供者：</strong>本計劃所涉及的所有旅行相關服務（包括但不限於醫療體檢、高爾夫預約、夜總會預約等）均由<strong>新島交通株式會社</strong>（大阪府知事登錄旅行業 第2-3115號）提供。
              </p>
              <p>
                <strong>2. 提攜夥伴的角色：</strong>提攜夥伴（導遊）的角色為「客戶介紹者」，負責向潛在客戶介紹新島交通的服務。提攜夥伴<strong>不是獨立的旅行服務提供者</strong>，不與客戶簽訂任何旅行服務合同。
              </p>
              <p>
                <strong>3. 合同關係：</strong>所有旅行服務合同均在新島交通株式會社與客戶之間簽訂。提攜夥伴與客戶之間不存在直接的服務合同關係。
              </p>
              <p>
                <strong>4. 介紹報酬：</strong>提攜夥伴因成功介紹客戶而獲得的報酬，性質為「紹介手数料」（介紹費），不構成旅行業務收入。
              </p>
              <p>
                <strong>5. 品牌網站：</strong>提攜夥伴使用的品牌網站為新島交通的系統授權使用，網站上的所有服務由新島交通提供，網站底部將明確標示服務提供者信息。
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>新島交通株式會社</span>
              <span>|</span>
              <span>大阪府知事登錄旅行業 第2-3115號</span>
              <span>|</span>
              <span>一般社團法人 日本旅行業協會（JATA）正會員</span>
            </div>
          </div>
        </div>
      </section>

      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowWechatQR(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">微信掃碼申請</h3>
              <button
                onClick={() => setShowWechatQR(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
              <img
                src={WECHAT_QR_URL}
                alt="WeChat QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>

            <p className="text-center text-gray-600 mt-4 text-sm">
              請用微信掃描二維碼添加客服
            </p>

            <div className="mt-4 bg-orange-50 rounded-xl p-4 text-sm text-orange-700">
              <p className="font-medium mb-1">申請時請注明：</p>
              <p>提攜夥伴申請 + 您的姓名 + 推薦人</p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
