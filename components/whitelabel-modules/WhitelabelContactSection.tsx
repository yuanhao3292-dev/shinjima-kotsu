'use client';

import { MessageCircle, Phone, Mail } from 'lucide-react';

interface ContactSectionProps {
  brandColor: string;
  brandName: string;
  contactInfo: {
    wechat: string | null;
    line: string | null;
    phone: string | null;
    email: string | null;
  };
}

export default function WhitelabelContactSection({ brandColor, brandName, contactInfo }: ContactSectionProps) {
  const hasContact = contactInfo.wechat || contactInfo.line || contactInfo.phone || contactInfo.email;

  if (!hasContact) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">联系我们</h2>
          <p className="text-gray-600">欢迎随时咨询，我们为您提供专业服务</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {contactInfo.wechat && (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${brandColor}15` }}
                >
                  <MessageCircle size={24} style={{ color: brandColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">微信号</p>
                  <p className="font-medium text-gray-900">{contactInfo.wechat}</p>
                </div>
              </div>
            )}
            {contactInfo.line && (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${brandColor}15` }}
                >
                  <MessageCircle size={24} style={{ color: brandColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">LINE</p>
                  <p className="font-medium text-gray-900">{contactInfo.line}</p>
                </div>
              </div>
            )}
            {contactInfo.phone && (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${brandColor}15` }}
                >
                  <Phone size={24} style={{ color: brandColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">电话</p>
                  <p className="font-medium text-gray-900">{contactInfo.phone}</p>
                </div>
              </div>
            )}
            {contactInfo.email && (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${brandColor}15` }}
                >
                  <Mail size={24} style={{ color: brandColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">邮箱</p>
                  <p className="font-medium text-gray-900">{contactInfo.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          旅行服务由 {brandName} 提供
        </p>
      </div>
    </section>
  );
}
