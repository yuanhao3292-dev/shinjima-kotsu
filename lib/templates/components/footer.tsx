/**
 * 页脚模块模板
 * ============================================
 */

import { Phone, Mail, MessageCircle } from 'lucide-react';
import { registerTemplate, type TemplateProps } from '../engine';

// ============================================
// 模板数据类型
// ============================================

export interface FooterData {
  guideName: string;
  companyName?: string | null;
  phone?: string | null;
  email?: string | null;
  wechat?: string | null;
  licenseNumber?: string | null;
  copyrightYear?: number;
}

// ============================================
// Modern Footer 模板
// ============================================

export function ModernFooterTemplate({ context, data }: TemplateProps<FooterData>) {
  const { brandColor } = context;
  const year = data.copyrightYear || new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 品牌信息 */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: brandColor }}>
              {data.companyName || data.guideName}
            </h3>
            {data.licenseNumber && (
              <p className="text-gray-400 text-sm">
                营业执照号: {data.licenseNumber}
              </p>
            )}
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="font-medium mb-4">联系方式</h4>
            <div className="space-y-3 text-gray-400">
              {data.phone && (
                <a
                  href={`tel:${data.phone}`}
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Phone size={16} />
                  <span>{data.phone}</span>
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Mail size={16} />
                  <span className="break-all">{data.email}</span>
                </a>
              )}
              {data.wechat && (
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>微信: {data.wechat}</span>
                </div>
              )}
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-medium mb-4">快速导航</h4>
            <div className="space-y-2 text-gray-400">
              <a href="#services" className="block hover:text-white transition">
                服务项目
              </a>
              <a href="#vehicles" className="block hover:text-white transition">
                车辆展示
              </a>
              <a href="#contact" className="block hover:text-white transition">
                联系我们
              </a>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {year} {data.companyName || data.guideName}. All rights reserved.</p>
          <p className="mt-2">
            Powered by{' '}
            <a
              href="https://niijima-koutsu.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              style={{ color: brandColor }}
            >
              新岛交通
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Classic Footer 模板
// ============================================

export function ClassicFooterTemplate({ context, data }: TemplateProps<FooterData>) {
  const { brandColor } = context;
  const year = data.copyrightYear || new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* 品牌名称 */}
          <h3
            className="text-2xl font-serif font-bold mb-2"
            style={{ color: brandColor }}
          >
            {data.companyName || data.guideName}
          </h3>

          {data.licenseNumber && (
            <p className="text-gray-500 text-sm mb-8">
              营业执照号: {data.licenseNumber}
            </p>
          )}

          {/* 联系方式 */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-600">
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-2 hover:text-gray-900 transition"
              >
                <Phone size={18} style={{ color: brandColor }} />
                <span>{data.phone}</span>
              </a>
            )}
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-2 hover:text-gray-900 transition"
              >
                <Mail size={18} style={{ color: brandColor }} />
                <span>{data.email}</span>
              </a>
            )}
            {data.wechat && (
              <span className="flex items-center gap-2">
                <MessageCircle size={18} style={{ color: brandColor }} />
                <span>微信: {data.wechat}</span>
              </span>
            )}
          </div>

          {/* 分隔线 */}
          <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: brandColor }} />

          {/* 版权信息 */}
          <p className="text-gray-500 text-sm">
            © {year} {data.companyName || data.guideName}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Powered by{' '}
            <a
              href="https://niijima-koutsu.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              新岛交通
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Minimal Footer 模板
// ============================================

export function MinimalFooterTemplate({ context, data }: TemplateProps<FooterData>) {
  const { brandColor } = context;
  const year = data.copyrightYear || new Date().getFullYear();

  return (
    <footer className="py-8 border-t">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 左侧：品牌和版权 */}
          <div className="text-sm text-gray-500">
            <p>
              © {year}{' '}
              <span className="font-medium text-gray-900">
                {data.companyName || data.guideName}
              </span>
            </p>
            {data.licenseNumber && (
              <p className="text-xs mt-1">执照号: {data.licenseNumber}</p>
            )}
          </div>

          {/* 右侧：联系方式 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-1 hover:text-gray-900 transition"
              >
                <Phone size={14} style={{ color: brandColor }} />
                <span>{data.phone}</span>
              </a>
            )}
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-1 hover:text-gray-900 transition"
              >
                <Mail size={14} style={{ color: brandColor }} />
                <span>{data.email}</span>
              </a>
            )}
            {data.wechat && (
              <span className="flex items-center gap-1">
                <MessageCircle size={14} style={{ color: brandColor }} />
                <span>{data.wechat}</span>
              </span>
            )}
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-4 pt-4 border-t text-center text-xs text-gray-400">
          Powered by{' '}
          <a
            href="https://niijima-koutsu.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition"
            style={{ color: brandColor }}
          >
            新岛交通
          </a>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// 注册模板
// ============================================

export function initFooterTemplates(): void {
  registerTemplate('footer', 'modern', ModernFooterTemplate);
  registerTemplate('footer', 'classic', ClassicFooterTemplate);
  registerTemplate('footer', 'minimal', MinimalFooterTemplate);
}
