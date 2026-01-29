/**
 * 导游简介模板
 * ============================================
 */

import { User } from 'lucide-react';
import { registerTemplate, type TemplateProps } from '../engine';

// ============================================
// 模板数据类型
// ============================================

export interface BioData {
  name: string;
  description: string;
  tags: string[];
  avatarUrl?: string | null;
}

// ============================================
// Modern Bio 模板
// ============================================

export function ModernBioTemplate({ context, data }: TemplateProps<BioData>) {
  const { brandColor, brandLogoUrl } = context;

  return (
    <section id="about" className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">关于我们</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            为您提供最优质的日本旅行和医疗服务体验
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
              {data.avatarUrl || brandLogoUrl ? (
                <img
                  src={data.avatarUrl || brandLogoUrl || ''}
                  alt={data.name}
                  className="w-24 h-24 object-contain rounded-full"
                />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.name}</h3>
              <p className="text-gray-600 mb-4">{data.description}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {data.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: `${brandColor}15`,
                      color: brandColor,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Classic Bio 模板
// ============================================

export function ClassicBioTemplate({ context, data }: TemplateProps<BioData>) {
  const { brandColor, brandLogoUrl } = context;

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center">
          <div className="w-40 h-40 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-8">
            {data.avatarUrl || brandLogoUrl ? (
              <img
                src={data.avatarUrl || brandLogoUrl || ''}
                alt={data.name}
                className="w-32 h-32 object-contain rounded-full"
              />
            ) : (
              <User size={64} className="text-gray-400" />
            )}
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{data.name}</h2>
          <div
            className="w-16 h-1 mx-auto mb-6"
            style={{ backgroundColor: brandColor }}
          />
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            {data.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 border-2 rounded-none text-sm font-medium"
                style={{ borderColor: brandColor, color: brandColor }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Minimal Bio 模板
// ============================================

export function MinimalBioTemplate({ context, data }: TemplateProps<BioData>) {
  const { brandColor } = context;

  return (
    <section id="about" className="py-12 border-b">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-start gap-6">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: brandColor }}
          >
            {data.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{data.name}</h2>
            <p className="text-gray-600 mb-3">{data.description}</p>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 注册模板
// ============================================

export function initBioTemplates(): void {
  registerTemplate('bio', 'modern', ModernBioTemplate);
  registerTemplate('bio', 'classic', ClassicBioTemplate);
  registerTemplate('bio', 'minimal', MinimalBioTemplate);
}
