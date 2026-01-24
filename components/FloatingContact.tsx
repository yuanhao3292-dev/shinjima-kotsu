'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { useWhiteLabel } from '@/lib/contexts/WhiteLabelContext';
import { DEFAULT_CONTACT } from '@/lib/whitelabel-config';

type Language = 'ja' | 'zh-TW' | 'zh-CN' | 'en';

const contactTranslations = {
  title: { ja: 'お問い合わせ', 'zh-TW': '聯繫我們', 'zh-CN': '联系我们', en: 'Contact Us' },
  subtitle: {
    ja: 'ご質問がございましたらお気軽にお問い合わせください。24時間以内にご返信いたします。',
    'zh-TW': '有任何問題歡迎諮詢，我們將在 24 小時內回覆您。',
    'zh-CN': '有任何问题欢迎咨询，我们将在 24 小时内回复您。',
    en: 'Feel free to contact us. We will reply within 24 hours.',
  },
  lineConsult: { ja: 'LINEで相談', 'zh-TW': 'LINE 諮詢', 'zh-CN': 'LINE 咨询', en: 'LINE Chat' },
  lineDesc: { ja: '即時対応・おすすめ', 'zh-TW': '即時回覆・推薦', 'zh-CN': '即时回复・推荐', en: 'Instant Reply' },
  wechatConsult: { ja: 'WeChat相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' },
  wechatDesc: { ja: 'QRコードで追加', 'zh-TW': '掃碼添加客服', 'zh-CN': '扫码添加客服', en: 'Scan QR Code' },
  phoneConsult: { ja: '電話相談', 'zh-TW': '電話諮詢', 'zh-CN': '电话咨询', en: 'Call Us' },
  emailConsult: { ja: 'メール', 'zh-TW': '電子郵件', 'zh-CN': '电子邮件', en: 'Email' },
  businessHours: {
    ja: '営業時間：月〜金 9:00-18:00（日本時間）',
    'zh-TW': '營業時間：週一至週五 9:00-18:00 (日本時間)',
    'zh-CN': '营业时间：周一至周五 9:00-18:00（日本时间）',
    en: 'Hours: Mon-Fri 9:00-18:00 (JST)',
  },
  bubble: { ja: 'お問い合わせ', 'zh-TW': '有問題？點我諮詢', 'zh-CN': '有问题？点我咨询', en: 'Need Help?' },
  wechatTitle: { ja: 'WeChat相談', 'zh-TW': '微信諮詢', 'zh-CN': '微信咨询', en: 'WeChat' },
  wechatAddId: { ja: 'WeChat IDを追加：', 'zh-TW': '請添加微信號：', 'zh-CN': '请添加微信号：', en: 'Add WeChat ID:' },
  wechatScanQR: { ja: 'QRコードをスキャンして追加', 'zh-TW': '請用微信掃描二維碼添加客服', 'zh-CN': '请用微信扫描二维码添加客服', en: 'Scan QR code to add' },
  wechatAfterAdd: { ja: '追加後にご用件をお伝えください', 'zh-TW': '添加微信後請說明來意', 'zh-CN': '添加微信后请说明来意', en: 'Please state your inquiry after adding' },
  wechatOnline: { ja: 'WeChat オンライン', 'zh-TW': '微信客服在線', 'zh-CN': '微信客服在线', en: 'WeChat Online' },
  legalProvider: {
    ja: '本サービスは新島交通株式会社が提供',
    'zh-TW': '本服務由新島交通株式會社提供',
    'zh-CN': '本服务由新岛交通株式会社提供',
    en: 'Service provided by Niijima Transport Co., Ltd.',
  },
  legalLicense: {
    ja: '大阪府知事登録旅行業 第2-3115号',
    'zh-TW': '大阪府知事登錄旅行業 第2-3115號',
    'zh-CN': '大阪府知事登录旅行业 第2-3115号',
    en: 'Osaka Gov. Registered Travel Agency No. 2-3115',
  },
  ariaContact: { ja: 'お問い合わせ', 'zh-TW': '聯繫客服', 'zh-CN': '联系客服', en: 'Contact Support' },
  wechatQrAlt: { ja: 'WeChat QRコード', 'zh-TW': '微信二維碼', 'zh-CN': '微信二维码', en: 'WeChat QR Code' },
};

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('ja');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'NEXT_LOCALE' && ['ja', 'zh-TW', 'zh-CN', 'en'].includes(value)) {
        setCurrentLang(value as Language);
        return;
      }
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith('ja')) setCurrentLang('ja');
    else if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') setCurrentLang('zh-TW');
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans' || browserLang.startsWith('zh')) setCurrentLang('zh-CN');
    else if (browserLang.startsWith('en')) setCurrentLang('en');
  }, []);

  const ct = (key: keyof typeof contactTranslations) => contactTranslations[key][currentLang];

  // 获取白标配置
  const { isWhiteLabelMode, contact, isSubscriptionActive, guideConfig } = useWhiteLabel();

  // 白标模式下使用导游联系方式
  const displayPhone = isWhiteLabelMode && isSubscriptionActive && contact.phone
    ? contact.phone
    : DEFAULT_CONTACT.PHONE;

  const displayEmail = isWhiteLabelMode && isSubscriptionActive && contact.email
    ? contact.email
    : DEFAULT_CONTACT.EMAIL;

  const displayWechat = isWhiteLabelMode && isSubscriptionActive && contact.wechat
    ? contact.wechat
    : null;

  const displayLine = isWhiteLabelMode && isSubscriptionActive && contact.line
    ? contact.line
    : null;

  // 白标模式下如果没有配置联系方式，使用官方 LINE
  const lineUrl = displayLine
    ? `https://line.me/ti/p/${displayLine}`
    : DEFAULT_CONTACT.LINE_URL;

  return (
    <>
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
              <h3 className="font-bold text-lg text-gray-900">{ct('wechatTitle')}</h3>
              <button
                onClick={() => setShowWechatQR(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center">
              {/* 白标模式显示微信号，官方模式显示二维码 */}
              {displayWechat ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-3">{ct('wechatAddId')}</p>
                  <p className="text-2xl font-bold text-gray-800 select-all">{displayWechat}</p>
                </div>
              ) : (
                <img
                  src={DEFAULT_CONTACT.WECHAT_QR_URL}
                  alt={ct('wechatQrAlt')}
                  className="w-64 h-64 object-contain"
                />
              )}
            </div>

            <p className="text-center text-gray-600 mt-4 text-sm">
              {displayWechat ? ct('wechatAfterAdd') : ct('wechatScanQR')}
            </p>

            <div className="mt-4 text-center text-xs px-3 py-2 rounded-lg bg-[#07C160]/10 text-[#07C160]">
              {ct('wechatOnline')}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* 展开的联系方式菜单 */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">{ct('title')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {ct('subtitle')}
            </p>

            <div className="space-y-3">
              {/* LINE 咨询 - 跳转到 LINE 官方页面 */}
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-green-200"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <div>
                  <div className="font-bold text-sm">{ct('lineConsult')}</div>
                  <div className="text-xs text-green-100">{displayLine ? `ID: ${displayLine}` : ct('lineDesc')}</div>
                </div>
              </a>

              {/* 微信咨询 - 弹窗显示二维码 */}
              <button
                onClick={() => setShowWechatQR(true)}
                className="w-full flex items-center gap-3 bg-[#07C160] hover:bg-[#06ad56] text-white px-4 py-3 rounded-xl transition-all duration-200"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.118-.04-.177l-.327-1.233a.49.49 0 01-.009-.102c0-.142.062-.28.177-.375C23.116 17.715 24 16.046 24 14.194c0-2.942-2.696-5.336-7.062-5.336zm-2.745 3.086c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.97-.983zm5.49 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.543.434-.983.969-.983z"/>
                </svg>
                <div>
                  <div className="font-bold text-sm">{ct('wechatConsult')}</div>
                  <div className="text-xs text-green-100">{ct('wechatDesc')}</div>
                </div>
              </button>

              {/* 电话 */}
              <a
                href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200"
              >
                <Phone size={20} className="text-blue-500" />
                <div>
                  <div className="font-medium text-sm">{ct('phoneConsult')}</div>
                  <div className="text-xs text-gray-400">{displayPhone}</div>
                </div>
              </a>

              {/* 邮件 */}
              <a
                href={`mailto:${displayEmail}`}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200"
              >
                <Mail size={20} className="text-purple-500" />
                <div>
                  <div className="font-medium text-sm">{ct('emailConsult')}</div>
                  <div className="text-xs text-gray-400">{displayEmail}</div>
                </div>
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-400 text-center">
                {ct('businessHours')}
              </p>
              {/* 服务提供者声明 - 法律合规必须显示 */}
              <p className="text-[10px] text-gray-400 text-center leading-tight">
                {ct('legalProvider')}<br/>
                {ct('legalLicense')}
              </p>
            </div>
          </div>
        )}

        {/* 浮动按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full shadow-2xl flex items-center justify-center
            transition-all duration-300 transform hover:scale-110
            ${isOpen
              ? 'bg-gray-800 text-white rotate-0'
              : 'bg-[#06C755] text-white animate-pulse'
            }
          `}
          aria-label={ct('ariaContact')}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageCircle size={24} />
          )}
        </button>

        {/* 提示气泡 (仅首次显示) */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg px-4 py-2 whitespace-nowrap animate-bounce">
            <div className="text-sm font-medium text-gray-800">{ct('bubble')}</div>
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </div>
        )}
      </div>
    </>
  );
}
