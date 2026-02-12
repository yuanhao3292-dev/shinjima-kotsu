'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ContactInfo {
  wechat: string | null;
  line: string | null;
  phone: string | null;
  email: string | null;
}

interface FloatingContactProps {
  brandColor: string;
  contactInfo: ContactInfo;
}

export default function FloatingContact({ brandColor, contactInfo }: FloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 如果没有任何联系方式，不显示按钮
  const hasContact = contactInfo.wechat || contactInfo.line || contactInfo.phone || contactInfo.email;
  if (!hasContact) return null;

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        style={{ backgroundColor: brandColor }}
        aria-label="联系我们"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* 联系方式弹窗 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl p-6 animate-fade-in-up">
          <h3 className="text-lg font-bold text-gray-900 mb-4">联系我们</h3>
          <div className="space-y-3">
            {contactInfo.wechat && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">微信</div>
                <div className="text-sm text-gray-600 mt-1">{contactInfo.wechat}</div>
              </div>
            )}
            {contactInfo.line && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">LINE</div>
                <div className="text-sm text-gray-600 mt-1">{contactInfo.line}</div>
              </div>
            )}
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="text-sm font-medium text-gray-900">电话</div>
                <div className="text-sm text-blue-600 mt-1">{contactInfo.phone}</div>
              </a>
            )}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="text-sm font-medium text-gray-900">邮箱</div>
                <div className="text-sm text-gray-600 mt-1">{contactInfo.email}</div>
              </a>
            )}
          </div>
          <div className="mt-4 pt-4 border-t text-xs text-gray-400">
            有任何问题欢迎咨询
          </div>
        </div>
      )}

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
