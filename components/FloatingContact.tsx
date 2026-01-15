'use client';

import { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';

// 联系方式
const PHONE = '06-6632-8807';
const EMAIL = 'haoyuan@niijima-koutsu.jp';

// LINE 链接（跳转到 LINE 官方页面显示二维码）
const LINE_URL = 'https://line.me/ti/p/j3XxBP50j9';

// 微信二维码图片路径
const WECHAT_QR_URL = '/wechat-qr.png';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWechatQR, setShowWechatQR] = useState(false);

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

      <div className="fixed bottom-6 right-6 z-50">
        {/* 展开的联系方式菜单 */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">聯繫我們</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              有任何問題歡迎諮詢，我們將在 24 小時內回覆您。
            </p>

            <div className="space-y-3">
              {/* LINE 咨询 - 跳转到 LINE 官方页面 */}
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-green-200"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <div>
                  <div className="font-bold text-sm">LINE 諮詢</div>
                  <div className="text-xs text-green-100">即時回覆・推薦</div>
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
                  <div className="font-bold text-sm">微信諮詢</div>
                  <div className="text-xs text-green-100">掃碼添加客服</div>
                </div>
              </button>

              {/* 电话 */}
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200"
              >
                <Phone size={20} className="text-blue-500" />
                <div>
                  <div className="font-medium text-sm">電話諮詢</div>
                  <div className="text-xs text-gray-400">{PHONE}</div>
                </div>
              </a>

              {/* 邮件 */}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200"
              >
                <Mail size={20} className="text-purple-500" />
                <div>
                  <div className="font-medium text-sm">電子郵件</div>
                  <div className="text-xs text-gray-400">{EMAIL}</div>
                </div>
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                營業時間：週一至週五 9:00-18:00 (日本時間)
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
          aria-label="聯繫客服"
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
            <div className="text-sm font-medium text-gray-800">有問題？點我諮詢</div>
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </div>
        )}
      </div>
    </>
  );
}
