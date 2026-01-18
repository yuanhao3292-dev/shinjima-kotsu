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
  MessageSquare
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
              導遊合夥人計劃<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300">對接旅行社級資源</span>
            </h1>

            <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
              您直接接觸富裕層客戶，卻沒有旅行社資質？
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              新島交通作為日本第二類旅行社，為您提供合規的高端服務對接通道
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
                <span className="text-sm">業績獎勵制度</span>
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
                  <span>由新島交通<strong>代為預約下單</strong>，合規對接商家</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>全日本160家高級夜總會</strong>、TIMC體檢等合作資源</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>業績獎勵制度</strong>，加入後詳細說明</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>新島作為<strong>第三方信用背書</strong>，交易有保障</span>
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
                每月統一結算返金<br/>
                支持微信、支付寶、銀行轉帳
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">為什麼選擇新島？</h2>
            <p className="text-gray-500">合規資質 + 優質資源 = 您的專業後盾</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">日本第二類旅行社資質</h4>
                <p className="text-sm text-gray-500">大阪府知事登録旅行業 第2-3115號，JATA正會員</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">160家高級夜總會資源</h4>
                <p className="text-sm text-gray-500">覆蓋銀座、六本木、北新地等全日本主要繁華區</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <HeartPulse className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">德洲會醫療集團合作</h4>
                <p className="text-sm text-gray-500">日本大型民間醫療集團，TIMC官方合作夥伴</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">透明結算保障</h4>
                <p className="text-sm text-gray-500">返金計算公開透明，每月準時結算到帳</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">立即申請加入</h2>
          <p className="text-gray-300 mb-8">
            加入我們，獲取旅行社級別的資源對接能力<br/>
            掃碼添加客服，請注明：導遊合夥人 + 您的姓名 + 推薦人
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
              <p>導遊合夥人 + 您的姓名 + 推薦人</p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
