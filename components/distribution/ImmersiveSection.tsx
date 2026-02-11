import { ArrowRight, CheckCircle } from 'lucide-react';
import type { ImmersiveDisplayConfig, ColorTheme } from '@/lib/types/display-config';
import { COLOR_THEMES } from '@/lib/types/display-config';

interface ImmersiveSectionProps {
  config: ImmersiveDisplayConfig;
  /** Override CTA link (e.g., to module detail page) */
  ctaHref?: string;
}

export default function ImmersiveSection({ config, ctaHref }: ImmersiveSectionProps) {
  const theme = COLOR_THEMES[config.colorTheme as ColorTheme] || COLOR_THEMES.teal;

  return (
    <section id={config.sectionId} className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src={config.heroImage}
          alt={config.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} to-transparent`}></div>
      </div>

      <div className="relative container mx-auto px-6 py-24">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`h-[1px] w-12 ${theme.accentBg}`}></div>
            <span className={`text-xs tracking-[0.3em] ${theme.accent} uppercase`}>{config.tagline}</span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 md:mb-6 leading-tight">
            {config.title}
            <br />
            <span className={theme.accent}>{config.subtitle}</span>
          </h2>

          {/* Description */}
          <p className={`text-sm sm:text-base md:text-xl ${theme.descText} mb-6 md:mb-8 leading-relaxed font-light`}>
            {config.description}
          </p>

          {/* Stats */}
          {config.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 py-6 md:py-8 border-y border-white/20">
              {config.stats.map((stat, idx) => (
                <div key={idx} className={`text-center ${idx === 1 ? 'border-x border-white/20 px-2 md:px-6' : ''}`}>
                  <div className="text-2xl md:text-4xl font-light text-white mb-1">
                    {stat.value}<span className={theme.accent}>{stat.unit}</span>
                  </div>
                  <div className={`text-[10px] md:text-xs ${theme.statSubtext} tracking-wider uppercase`}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {config.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {config.tags.map((tag, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <a
            href={ctaHref || '#contact'}
            className={`inline-flex items-center justify-center px-8 py-4 ${theme.ctaBg} ${theme.ctaText} text-sm font-medium rounded-lg ${theme.ctaHover} transition-colors`}
          >
            {config.ctaText}
            <ArrowRight size={18} className="ml-3" />
          </a>
        </div>
      </div>

      {/* Sidebar Card (Desktop) */}
      {config.sidebar && (
        <div className="hidden lg:block absolute right-8 bottom-8 w-80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h4 className="text-white font-medium mb-4">{config.sidebar.title}</h4>
            <div className="space-y-3">
              {config.sidebar.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {config.sidebar?.type === 'steps' ? (
                    <span className={`w-6 h-6 ${theme.sidebarStepBg} rounded-full flex items-center justify-center text-xs ${theme.sidebarSubtext} flex-shrink-0`}>
                      {item.step || String(idx + 1).padStart(2, '0')}
                    </span>
                  ) : (
                    <CheckCircle size={16} className={`${theme.sidebarIcon} flex-shrink-0`} />
                  )}
                  <div>
                    <span className="text-white">{item.name}</span>
                    {item.desc && <span className={`${theme.sidebarSubtext} ml-2`}>{item.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
