'use client';

import { useState } from 'react';
import PublicLayout from '@/components/PublicLayout';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';

// 微信二維碼圖片路徑
const WECHAT_QR_URL = '/wechat-qr.png';

export default function GuidePartnerPage() {
  const [showWechatQR, setShowWechatQR] = useState(false);

  return (
    <PublicLayout showFooter={false} activeNav="partner">
      {/* Hero - 简洁有力 */}
      <section className="relative min-h-[70vh] flex items-center text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/85 to-[#1a1a2e]/70"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
          <p className="text-amber-400 text-sm font-medium mb-4 tracking-wide">
            新島交通 · 導遊提攜夥伴計劃
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            您帶客戶，我們出資源<br />
            <span className="text-amber-400">成功即有報酬</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-10">
            精密體檢、高級夜總會、醫療服務——這些高端資源，我們已經談好了。<br />
            您只需要做一件事：把客戶介紹過來。
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowWechatQR(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded transition-colors"
              aria-label="打開微信二維碼申請加入"
            >
              微信申請加入
            </button>
            <a
              href="#how-it-works"
              className="border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded transition-colors"
            >
              了解運作方式
            </a>
          </div>
        </div>
      </section>

      {/* 三句话说清楚 */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">01</div>
              <h3 className="font-bold text-gray-900 mb-2">您介紹客戶</h3>
              <p className="text-gray-500 text-sm">客戶想做體檢、想去夜總會，您推薦給我們</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">02</div>
              <h3 className="font-bold text-gray-900 mb-2">我們提供服務</h3>
              <p className="text-gray-500 text-sm">新島交通負責預約、接待、全程服務</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">03</div>
              <h3 className="font-bold text-gray-900 mb-2">您收介紹報酬</h3>
              <p className="text-gray-500 text-sm">客戶成交後，您獲得介紹報酬，每月結算</p>
            </div>
          </div>
        </div>
      </section>

      {/* 我们有什么资源 */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">我們有什麼資源？</h2>
          <p className="text-gray-500 mb-12">這些都是我們已經談好的合作，您可以直接用</p>

          <div className="space-y-6">
            {/* 夜总会 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded">夜總會</span>
                    <span className="text-gray-400 text-sm">全日本 160+ 店舖</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">高級夜總會預約</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    銀座、六本木、北新地、中洲……全日本主要城市的頂級店舖，我們都有合作。<br />
                    客戶想去哪家？您跟我們說，可當天安排。
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">銀座</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">六本木</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">北新地</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">中洲</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">+20城市</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">參考客單價</p>
                  <p className="text-2xl font-bold text-gray-900">30~150萬<span className="text-sm font-normal text-gray-500">日元</span></p>
                </div>
              </div>
            </div>

            {/* 体检 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded">精密體檢</span>
                    <span className="text-gray-400 text-sm">德洲會 TIMC</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">TIMC 精密體檢</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    德洲會醫療集團旗下的國際醫療中心，位於大阪 JP Tower。<br />
                    PET-CT、MRI、腫瘤篩查全套。中文翻譯全程陪同，報告中文出具。
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">PET-CT</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">MRI</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">腫瘤篩查</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">中文翻譯</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">參考套餐價格</p>
                  <p className="text-2xl font-bold text-gray-900">50~200萬<span className="text-sm font-normal text-gray-500">日元</span></p>
                </div>
              </div>
            </div>

            {/* 医疗 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">綜合醫療</span>
                    <span className="text-gray-400 text-sm">日本頂尖醫療資源</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">綜合醫療服務</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    幹細胞治療、抗衰老療程、專科治療轉介……<br />
                    日本的醫療資源，我們可以幫您對接。
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">幹細胞</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">抗衰老</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">專科轉介</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">參考治療費用</p>
                  <p className="text-2xl font-bold text-gray-900">100~500萬<span className="text-sm font-normal text-gray-500">日元</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 合作规则 - 简化 */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">合作規則</h2>
          <p className="text-gray-500 mb-12">簡單透明，沒有套路</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">如何加入？</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>需要現有夥伴推薦</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>微信聯繫客服，說明推薦人</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>審核通過後開通帳號</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">報酬怎麼算？</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>成功介紹客戶即獲報酬</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>每月 15 日結算上月款項</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>支持微信、支付寶、銀行轉帳</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">夜總會預約規則</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>預約需付 500 元人民幣訂金</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>當天取消訂金不退</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>訂金從最終消費中扣除</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">客戶服務由誰負責？</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>所有服務由新島交通提供</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>合同與新島交通簽訂</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>您負責介紹，服務由新島交通全權負責</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 可选：品牌网站 */}
      <section className="bg-[#1a1a2e] text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="md:flex md:items-center md:gap-12">
            <div className="flex-1 mb-10 md:mb-0">
              <p className="text-amber-400 text-sm font-medium mb-4">可選增值服務</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                想要一個以您品牌展示的網站？
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                我們可以為您開通一個專屬網站，以您的品牌展示服務。<br />
                客戶通過您的網站諮詢下單，系統自動追蹤至您的帳戶。
              </p>
              <ul className="space-y-3 text-gray-300 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  yourname.niijima-koutsu.jp 專屬域名
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  體檢、夜總會、醫療服務一鍵上架
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  客戶在線諮詢，訂單自動追蹤
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  無需技術背景，快速開通
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  網站底部顯示新島交通為服務提供者
                </li>
              </ul>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-amber-400">¥1,980</span>
                <span className="text-gray-500">/月（約 100 元人民幣）</span>
              </div>
              <button
                onClick={() => setShowWechatQR(true)}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded transition-colors"
                aria-label="打開微信二維碼諮詢開通品牌網站"
              >
                諮詢開通
              </button>
            </div>
            <div className="flex-1">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-4">實際效果預覽</p>
                <div className="bg-gray-900 rounded p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-500 text-xs ml-2">demo.niijima-koutsu.jp</span>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">您的品牌 Logo</p>
                    <p className="text-white font-bold text-xl my-4">您的品牌名稱</p>
                    <p className="text-gray-500 text-xs">精密體檢 · 高級夜總會 · 醫療服務</p>
                  </div>
                </div>
                <a
                  href="https://demo.niijima-koutsu.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-amber-400 text-sm mt-4 hover:underline"
                >
                  查看線上示例 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            有興趣？微信聯繫我們
          </h2>
          <p className="text-black/70 mb-8">
            請注明：提攜夥伴申請 + 您的姓名 + 推薦人
          </p>
          <button
            onClick={() => setShowWechatQR(true)}
            className="bg-black hover:bg-gray-900 text-white font-bold px-10 py-4 rounded transition-colors inline-flex items-center gap-3"
            aria-label="打開微信二維碼申請成為提攜夥伴"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
            </svg>
            微信掃碼申請
          </button>
          <p className="text-black/60 text-sm mt-4">
            或郵件：<a href="mailto:haoyuan@niijima-koutsu.jp" className="underline">haoyuan@niijima-koutsu.jp</a>
          </p>
        </div>
      </section>

      {/* 法律声明 */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">法律聲明</h3>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                本計劃所有旅行服務均由<strong>新島交通株式會社</strong>提供。提攜夥伴的角色為「客戶介紹者」，負責向潛在客戶介紹服務。所有旅行服務合同在新島交通與客戶之間簽訂。提攜夥伴獲得的報酬性質為「紹介手数料」（介紹費）。
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              新島交通株式會社 ｜ 大阪府知事登錄旅行業 第2-3115號 ｜ JATA正會員
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="md:flex md:justify-between md:items-start">
            <div className="mb-8 md:mb-0">
              <h4 className="font-bold text-lg mb-4">新島交通株式會社</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin size={14} />
                  〒556-0014 大阪府大阪市浪速区大国1-2-21-602
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} />
                  06-6632-8807
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  info@niijima-koutsu.jp
                </p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <p>大阪府知事登錄旅行業 第2-3115號</p>
              <p>一般社團法人 日本旅行業協會（JATA）正會員</p>
              <div className="mt-4 flex gap-4">
                <Link href="/legal/tokushoho" className="hover:text-white transition">特定商取引法</Link>
                <Link href="/legal/privacy" className="hover:text-white transition">隱私政策</Link>
                <Link href="/legal/terms" className="hover:text-white transition">利用規約</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
            <p>© {new Date().getFullYear()} 新島交通株式會社. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WeChat QR Modal */}
      {showWechatQR && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowWechatQR(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wechat-modal-title"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="wechat-modal-title" className="font-bold text-lg text-gray-900">微信掃碼申請</h3>
              <button
                onClick={() => setShowWechatQR(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="關閉微信二維碼彈窗"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
              <img
                src={WECHAT_QR_URL}
                alt="WeChat QR Code"
                className="w-56 h-56 object-contain"
              />
            </div>

            <p className="text-center text-gray-600 mt-4 text-sm">
              掃碼添加客服微信
            </p>

            <div className="mt-4 bg-amber-50 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-1">申請時請注明：</p>
              <p>提攜夥伴申請 + 您的姓名 + 推薦人</p>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
