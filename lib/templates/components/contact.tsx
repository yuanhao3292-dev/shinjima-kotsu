/**
 * 联系方式模块模板
 * ============================================
 */

import { Phone, Mail, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react';
import { registerTemplate, type TemplateProps } from '../engine';

// ============================================
// 模板数据类型
// ============================================

export interface ContactData {
  phone?: string | null;
  email?: string | null;
  wechat?: string | null;
  lineId?: string | null;
  address?: string | null;
  businessHours?: string | null;
  mapUrl?: string | null;
}

// ============================================
// Modern Contact 模板
// ============================================

export function ModernContactTemplate({ context, data }: TemplateProps<ContactData>) {
  const { brandColor } = context;

  const hasContactInfo = data.phone || data.email || data.wechat || data.lineId;
  if (!hasContactInfo) return null;

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            随时欢迎咨询，我们将尽快回复您
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Phone size={28} style={{ color: brandColor }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">电话咨询</h3>
              <p className="text-gray-600 group-hover:text-gray-900 transition">{data.phone}</p>
            </a>
          )}

          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Mail size={28} style={{ color: brandColor }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">邮件咨询</h3>
              <p className="text-gray-600 group-hover:text-gray-900 transition text-sm break-all">
                {data.email}
              </p>
            </a>
          )}

          {data.wechat && (
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <MessageCircle size={28} style={{ color: brandColor }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">微信咨询</h3>
              <p className="text-gray-600">{data.wechat}</p>
            </div>
          )}

          {data.lineId && (
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <MessageCircle size={28} style={{ color: brandColor }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">LINE 咨询</h3>
              <p className="text-gray-600">{data.lineId}</p>
            </div>
          )}
        </div>

        {(data.address || data.businessHours) && (
          <div className="mt-8 bg-white rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {data.address && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${brandColor}15` }}
                  >
                    <MapPin size={20} style={{ color: brandColor }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">地址</h4>
                    <p className="text-gray-600 text-sm">{data.address}</p>
                    {data.mapUrl && (
                      <a
                        href={data.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm mt-2 hover:underline"
                        style={{ color: brandColor }}
                      >
                        查看地图 <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {data.businessHours && (
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${brandColor}15` }}
                  >
                    <Clock size={20} style={{ color: brandColor }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">营业时间</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{data.businessHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// Classic Contact 模板
// ============================================

export function ClassicContactTemplate({ context, data }: TemplateProps<ContactData>) {
  const { brandColor } = context;

  const hasContactInfo = data.phone || data.email || data.wechat || data.lineId;
  if (!hasContactInfo) return null;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">联系我们</h2>
          <div className="w-16 h-1 mx-auto" style={{ backgroundColor: brandColor }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-4 p-4 border-l-4 bg-gray-50 hover:bg-gray-100 transition"
                style={{ borderLeftColor: brandColor }}
              >
                <Phone size={24} style={{ color: brandColor }} />
                <div>
                  <p className="text-sm text-gray-500">电话</p>
                  <p className="font-medium text-gray-900">{data.phone}</p>
                </div>
              </a>
            )}

            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-4 p-4 border-l-4 bg-gray-50 hover:bg-gray-100 transition"
                style={{ borderLeftColor: brandColor }}
              >
                <Mail size={24} style={{ color: brandColor }} />
                <div>
                  <p className="text-sm text-gray-500">邮箱</p>
                  <p className="font-medium text-gray-900 break-all">{data.email}</p>
                </div>
              </a>
            )}

            {data.wechat && (
              <div
                className="flex items-center gap-4 p-4 border-l-4 bg-gray-50"
                style={{ borderLeftColor: brandColor }}
              >
                <MessageCircle size={24} style={{ color: brandColor }} />
                <div>
                  <p className="text-sm text-gray-500">微信</p>
                  <p className="font-medium text-gray-900">{data.wechat}</p>
                </div>
              </div>
            )}

            {data.lineId && (
              <div
                className="flex items-center gap-4 p-4 border-l-4 bg-gray-50"
                style={{ borderLeftColor: brandColor }}
              >
                <MessageCircle size={24} style={{ color: brandColor }} />
                <div>
                  <p className="text-sm text-gray-500">LINE</p>
                  <p className="font-medium text-gray-900">{data.lineId}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {data.address && (
              <div
                className="flex items-start gap-4 p-4 border-l-4 bg-gray-50"
                style={{ borderLeftColor: brandColor }}
              >
                <MapPin size={24} style={{ color: brandColor }} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">地址</p>
                  <p className="font-medium text-gray-900">{data.address}</p>
                  {data.mapUrl && (
                    <a
                      href={data.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm mt-2 hover:underline"
                      style={{ color: brandColor }}
                    >
                      在地图中查看 <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {data.businessHours && (
              <div
                className="flex items-start gap-4 p-4 border-l-4 bg-gray-50"
                style={{ borderLeftColor: brandColor }}
              >
                <Clock size={24} style={{ color: brandColor }} className="flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">营业时间</p>
                  <p className="font-medium text-gray-900 whitespace-pre-line">{data.businessHours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Minimal Contact 模板
// ============================================

export function MinimalContactTemplate({ context, data }: TemplateProps<ContactData>) {
  const { brandColor } = context;

  const hasContactInfo = data.phone || data.email || data.wechat || data.lineId;
  if (!hasContactInfo) return null;

  return (
    <section id="contact" className="py-12 border-b">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">联系方式</h2>

        <div className="flex flex-wrap gap-6">
          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <Phone size={18} style={{ color: brandColor }} />
              <span>{data.phone}</span>
            </a>
          )}

          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <Mail size={18} style={{ color: brandColor }} />
              <span className="break-all">{data.email}</span>
            </a>
          )}

          {data.wechat && (
            <span className="inline-flex items-center gap-2 text-gray-600">
              <MessageCircle size={18} style={{ color: brandColor }} />
              <span>微信: {data.wechat}</span>
            </span>
          )}

          {data.lineId && (
            <span className="inline-flex items-center gap-2 text-gray-600">
              <MessageCircle size={18} style={{ color: brandColor }} />
              <span>LINE: {data.lineId}</span>
            </span>
          )}
        </div>

        {(data.address || data.businessHours) && (
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-6 text-sm text-gray-500">
            {data.address && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} style={{ color: brandColor }} />
                <span>{data.address}</span>
                {data.mapUrl && (
                  <a
                    href={data.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: brandColor }}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </span>
            )}

            {data.businessHours && (
              <span className="inline-flex items-center gap-2">
                <Clock size={16} style={{ color: brandColor }} />
                <span>{data.businessHours}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 注册模板
// ============================================

export function initContactTemplates(): void {
  registerTemplate('contact', 'modern', ModernContactTemplate);
  registerTemplate('contact', 'classic', ClassicContactTemplate);
  registerTemplate('contact', 'minimal', MinimalContactTemplate);
}
