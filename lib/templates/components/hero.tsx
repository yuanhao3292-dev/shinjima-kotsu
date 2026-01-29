/**
 * Hero 区域模板
 * ============================================
 */

import { registerTemplate, adjustColor, type TemplateProps } from '../engine';

// ============================================
// 模板数据类型
// ============================================

export interface HeroData {
  title: string;
  subtitle: string;
}

// ============================================
// Modern Hero 模板
// ============================================

export function ModernHeroTemplate({ context, data }: TemplateProps<HeroData>) {
  const { brandColor } = context;

  return (
    <section
      className="py-20 text-white"
      style={{
        background: `linear-gradient(135deg, ${brandColor} 0%, ${adjustColor(brandColor, -30)} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
    </section>
  );
}

// ============================================
// Classic Hero 模板
// ============================================

export function ClassicHeroTemplate({ context, data }: TemplateProps<HeroData>) {
  const { brandColor, brandLogoUrl, brandName } = context;

  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="flex flex-col items-center text-center">
          {brandLogoUrl && (
            <img
              src={brandLogoUrl}
              alt={brandName}
              className="h-20 mb-8 brightness-0 invert"
            />
          )}
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{data.title}</h1>
          <div
            className="w-24 h-1 mb-6"
            style={{ backgroundColor: brandColor }}
          />
          <p className="text-xl text-gray-300 max-w-2xl">{data.subtitle}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Minimal Hero 模板
// ============================================

export function MinimalHeroTemplate({ context, data }: TemplateProps<HeroData>) {
  const { brandColor } = context;

  return (
    <section className="py-16 bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1
          className="text-3xl md:text-4xl font-medium mb-4"
          style={{ color: brandColor }}
        >
          {data.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">{data.subtitle}</p>
      </div>
    </section>
  );
}

// ============================================
// 注册模板
// ============================================

export function initHeroTemplates(): void {
  registerTemplate('hero', 'modern', ModernHeroTemplate);
  registerTemplate('hero', 'classic', ClassicHeroTemplate);
  registerTemplate('hero', 'minimal', MinimalHeroTemplate);
}
