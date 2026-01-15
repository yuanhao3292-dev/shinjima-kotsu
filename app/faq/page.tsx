'use client';

import { useState } from 'react';
import { ChevronDown, Mail, MessageCircle, X } from 'lucide-react';
import SmartBackLink from '@/components/SmartBackLink';

// 微信二维码图片路径
const WECHAT_QR_URL = '/wechat-qr.png';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // 預約相關
  {
    category: '預約相關',
    question: '如何預約 TIMC 體檢？',
    answer: '您可以直接在本網站選擇心儀的套餐，填寫預約資訊後完成線上支付即可。支付成功後，我們的客服會在 1-2 個工作日內與您聯繫，確認具體的體檢日期。'
  },
  {
    category: '預約相關',
    question: '可以指定體檢日期嗎？',
    answer: '可以的。在預約時您可以填寫希望的體檢日期，我們會盡量為您安排。但最終日期需要根據醫院的實際排程來確認，我們的客服會與您溝通具體時間。'
  },
  {
    category: '預約相關',
    question: '預約後多久能確認？',
    answer: '通常在您完成支付後的 1-2 個工作日內，我們的客服會透過 LINE、微信或電子郵件與您聯繫，確認體檢日期和相關注意事項。'
  },
  {
    category: '預約相關',
    question: '可以幫家人或朋友預約嗎？',
    answer: '可以的。您在預約時填寫實際體檢者的姓名和聯繫方式即可。如有多人預約，建議分開下單或在備註中說明。'
  },
  // 體檢相關
  {
    category: '體檢相關',
    question: 'TIMC 體檢中心在哪裡？',
    answer: 'TIMC OSAKA（德洲會國際醫療中心）位於大阪市北區梅田三丁目 2 番 2 號 JP TOWER OSAKA 11 樓。交通便利，從大阪站步行約 5 分鐘即可到達。'
  },
  {
    category: '體檢相關',
    question: '體檢當天需要空腹嗎？',
    answer: '是的，大部分體檢項目需要空腹進行。通常要求體檢前一天晚上 9 點後禁食，只可飲用少量清水。具體要求會在確認預約後發送給您的體檢須知中詳細說明。'
  },
  {
    category: '體檢相關',
    question: '體檢需要多長時間？',
    answer: '根據您選擇的套餐不同，體檢時間約為 3-6 小時。基礎套餐約 3 小時，包含胃腸鏡的套餐約需 5-6 小時。我們建議您預留充足的時間。'
  },
  {
    category: '體檢相關',
    question: '有中文服務嗎？',
    answer: '有的。TIMC 配備專業的中文翻譯人員，全程陪同您完成體檢。醫生問診時也會有翻譯在場，確保溝通順暢無障礙。'
  },
  {
    category: '體檢相關',
    question: '體檢報告什麼時候能拿到？',
    answer: '體檢完成後約 30 個工作日，您會收到完整的中文版體檢報告。報告會以國際郵件發送，如需電子版可提前告知。'
  },
  // 付款與退款
  {
    category: '付款與退款',
    question: '支持哪些付款方式？',
    answer: '我們支援信用卡（Visa、MasterCard、JCB、American Express）線上支付，透過國際知名的 Stripe 安全支付平台進行。'
  },
  {
    category: '付款與退款',
    question: '可以取消預約嗎？',
    answer: '可以的，但根據取消時間會有不同的退款政策：體檢前 14 天以上可全額退款；體檢前 7-14 天退還 50% 費用；體檢前 7 天內恕不接受取消，但可改期一次。'
  },
  {
    category: '付款與退款',
    question: '可以改期嗎？',
    answer: '可以的。每筆訂單可免費改期一次，需在原定體檢日期前 3 個工作日以上提出申請。請聯繫我們的客服處理改期事宜。'
  },
  {
    category: '付款與退款',
    question: '退款需要多長時間？',
    answer: '申請退款通過後，款項會在 5-10 個工作日內退回您的原支付帳戶。具體到帳時間可能因銀行處理速度而有所不同。'
  },
  // 套餐選擇
  {
    category: '套餐選擇',
    question: '不同套餐有什麼區別？',
    answer: 'TIMC 提供多種套餐，從基礎的 STANDARD 套餐到高端的 VIP 套餐。主要區別在於檢查項目的全面程度，如是否包含 PET-CT、MRI、胃腸鏡等進階項目。您可以在套餐對比表中查看詳細差異。'
  },
  {
    category: '套餐選擇',
    question: '如何選擇適合我的套餐？',
    answer: '建議根據您的年齡、性別、家族病史和健康關注點來選擇。如果您不確定，可以使用我們的套餐推薦功能，或直接聯繫客服獲取專業建議。'
  },
  {
    category: '套餐選擇',
    question: '可以加購單獨的檢查項目嗎？',
    answer: '可以的。如果您需要在套餐基礎上增加特定檢查項目，請在預約時的備註中說明，我們會為您報價並安排。'
  },
  // 其他
  {
    category: '其他',
    question: '需要提前辦理日本簽證嗎？',
    answer: '是的，您需要持有效的日本簽證才能入境進行體檢。台灣護照持有者可申請觀光簽證或醫療簽證。我們也可協助提供預約確認書等簽證所需材料。'
  },
  {
    category: '其他',
    question: '有接送服務嗎？',
    answer: '我們可以為您安排從關西機場或大阪市區酒店到 TIMC 的專車接送服務（需另外收費）。如有需要，請在預約時的備註中說明或聯繫客服。'
  },
  {
    category: '其他',
    question: '可以推薦住宿嗎？',
    answer: 'TIMC 位於大阪梅田核心區域，周邊有眾多酒店可選。我們也可以為您推薦或代訂合適的住宿。如有需要，請聯繫客服獲取推薦。'
  }
];

const CATEGORIES = ['全部', '預約相關', '體檢相關', '付款與退款', '套餐選擇', '其他'];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [showWechatQR, setShowWechatQR] = useState(false);

  const filteredFAQs = activeCategory === '全部'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <SmartBackLink />
          <h1 className="text-xl font-bold text-gray-900">常見問題</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">常見問題 FAQ</h1>
          <p className="text-xl text-gray-600">
            關於 TIMC 體檢預約的常見問題解答
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const globalIndex = FAQ_DATA.indexOf(faq);
            const isOpen = openItems.includes(globalIndex);

            return (
              <div
                key={globalIndex}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 pr-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      Q
                    </span>
                    <span className="font-medium text-gray-900">{faq.question}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="flex gap-4 pl-0 md:pl-12">
                      <span className="hidden md:flex flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full items-center justify-center font-bold text-sm">
                        A
                      </span>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">還有其他問題？</h2>
          <p className="text-gray-600 mb-8">
            如果您的問題未在上述列表中找到答案，歡迎直接聯繫我們的客服團隊。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://line.me/ti/p/j3XxBP50j9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <MessageCircle size={20} />
              LINE 諮詢
            </a>
            <button
              onClick={() => setShowWechatQR(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#07C160] hover:bg-[#06ad56] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
              </svg>
              微信諮詢
            </button>
            <a
              href="mailto:haoyuan@niijima-koutsu.jp"
              className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Mail size={20} />
              發送郵件
            </a>
          </div>
        </div>

        {/* 微信二维码弹窗 */}
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
                <h3 className="font-bold text-lg text-gray-900">微信諮詢</h3>
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

              <div className="mt-4 text-center text-xs px-3 py-2 rounded-lg bg-[#07C160]/10 text-[#07C160]">
                微信客服在線
              </div>
            </div>
          </div>
        )}

        {/* SEO Text */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>TIMC OSAKA（德洲會國際醫療中心）體檢預約服務由新島交通株式会社提供</p>
        </div>
      </main>
    </div>
  );
}
