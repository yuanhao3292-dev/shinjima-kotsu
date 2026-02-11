/**
 * 分销页面模块展示配置类型
 * 数据驱动架构：所有展示内容存数据库，代码只负责通用渲染
 */

/** 颜色主题名 — 每个主题对应一组 Tailwind 类 */
export type ColorTheme =
  | 'teal'
  | 'blue-dark'
  | 'amber'
  | 'indigo'
  | 'emerald'
  | 'slate'
  | 'rose'
  | 'purple'
  | 'orange'
  | 'cyan';

/** 统计项 */
export interface StatItem {
  value: string;
  unit: string;
  label: string;
}

/** 侧边栏项 */
export interface SidebarItem {
  name: string;
  desc: string;
  step?: string; // 用于步骤类型的序号
}

/** 沉浸式板块展示配置 */
export interface ImmersiveDisplayConfig {
  template: 'immersive';
  sectionId: string;
  navLabel: string;
  heroImage: string;
  colorTheme: ColorTheme;
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  stats: StatItem[];
  tags: string[];
  ctaText: string;
  sidebar?: {
    title: string;
    type: 'checklist' | 'steps';
    items: SidebarItem[];
  };
}

/** 所有模板类型的联合 */
export type ModuleDisplayConfig = ImmersiveDisplayConfig;

/** 颜色主题的 Tailwind 类映射 */
export interface ThemeColors {
  gradientFrom: string;
  gradientVia: string;
  accent: string;
  accentBg: string;
  descText: string;
  statSubtext: string;
  ctaBg: string;
  ctaText: string;
  ctaHover: string;
  sidebarIcon: string;
  sidebarStepBg: string;
  sidebarSubtext: string;
}

/**
 * 颜色主题映射表
 * 所有 Tailwind 类静态声明，确保构建时不被 purge
 */
export const COLOR_THEMES: Record<ColorTheme, ThemeColors> = {
  teal: {
    gradientFrom: 'from-teal-900/90',
    gradientVia: 'via-teal-900/70',
    accent: 'text-teal-300',
    accentBg: 'bg-teal-300',
    descText: 'text-teal-100/80',
    statSubtext: 'text-teal-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-teal-900',
    ctaHover: 'hover:bg-teal-50',
    sidebarIcon: 'text-teal-300',
    sidebarStepBg: 'bg-teal-400/30',
    sidebarSubtext: 'text-teal-200/60',
  },
  'blue-dark': {
    gradientFrom: 'from-blue-950/90',
    gradientVia: 'via-blue-950/70',
    accent: 'text-sky-300',
    accentBg: 'bg-sky-300',
    descText: 'text-blue-100/80',
    statSubtext: 'text-blue-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-blue-950',
    ctaHover: 'hover:bg-sky-50',
    sidebarIcon: 'text-sky-300',
    sidebarStepBg: 'bg-sky-400/30',
    sidebarSubtext: 'text-sky-200/60',
  },
  amber: {
    gradientFrom: 'from-black/80',
    gradientVia: 'via-black/50',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-400',
    descText: 'text-gray-300',
    statSubtext: 'text-gray-400',
    ctaBg: 'bg-amber-400',
    ctaText: 'text-black',
    ctaHover: 'hover:bg-amber-300',
    sidebarIcon: 'text-amber-400',
    sidebarStepBg: 'bg-amber-400/30',
    sidebarSubtext: 'text-white/80',
  },
  indigo: {
    gradientFrom: 'from-indigo-950/90',
    gradientVia: 'via-indigo-950/70',
    accent: 'text-indigo-300',
    accentBg: 'bg-indigo-300',
    descText: 'text-indigo-100/80',
    statSubtext: 'text-indigo-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-indigo-900',
    ctaHover: 'hover:bg-indigo-50',
    sidebarIcon: 'text-indigo-300',
    sidebarStepBg: 'bg-indigo-400/30',
    sidebarSubtext: 'text-indigo-200/60',
  },
  emerald: {
    gradientFrom: 'from-emerald-950/90',
    gradientVia: 'via-emerald-950/70',
    accent: 'text-emerald-300',
    accentBg: 'bg-emerald-300',
    descText: 'text-emerald-100/80',
    statSubtext: 'text-emerald-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-emerald-900',
    ctaHover: 'hover:bg-emerald-50',
    sidebarIcon: 'text-emerald-300',
    sidebarStepBg: 'bg-emerald-400/30',
    sidebarSubtext: 'text-emerald-200/60',
  },
  slate: {
    gradientFrom: 'from-slate-900/90',
    gradientVia: 'via-slate-900/70',
    accent: 'text-blue-300',
    accentBg: 'bg-blue-300',
    descText: 'text-blue-100/80',
    statSubtext: 'text-blue-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-slate-900',
    ctaHover: 'hover:bg-blue-50',
    sidebarIcon: 'text-blue-300',
    sidebarStepBg: 'bg-blue-400/30',
    sidebarSubtext: 'text-blue-200/60',
  },
  rose: {
    gradientFrom: 'from-rose-950/90',
    gradientVia: 'via-rose-950/70',
    accent: 'text-rose-300',
    accentBg: 'bg-rose-300',
    descText: 'text-rose-100/80',
    statSubtext: 'text-rose-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-rose-900',
    ctaHover: 'hover:bg-rose-50',
    sidebarIcon: 'text-rose-300',
    sidebarStepBg: 'bg-rose-400/30',
    sidebarSubtext: 'text-rose-200/60',
  },
  purple: {
    gradientFrom: 'from-purple-950/90',
    gradientVia: 'via-purple-950/70',
    accent: 'text-purple-300',
    accentBg: 'bg-purple-300',
    descText: 'text-purple-100/80',
    statSubtext: 'text-purple-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-purple-900',
    ctaHover: 'hover:bg-purple-50',
    sidebarIcon: 'text-purple-300',
    sidebarStepBg: 'bg-purple-400/30',
    sidebarSubtext: 'text-purple-200/60',
  },
  orange: {
    gradientFrom: 'from-orange-950/90',
    gradientVia: 'via-orange-950/70',
    accent: 'text-orange-300',
    accentBg: 'bg-orange-300',
    descText: 'text-orange-100/80',
    statSubtext: 'text-orange-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-orange-900',
    ctaHover: 'hover:bg-orange-50',
    sidebarIcon: 'text-orange-300',
    sidebarStepBg: 'bg-orange-400/30',
    sidebarSubtext: 'text-orange-200/60',
  },
  cyan: {
    gradientFrom: 'from-cyan-950/90',
    gradientVia: 'via-cyan-950/70',
    accent: 'text-cyan-300',
    accentBg: 'bg-cyan-300',
    descText: 'text-cyan-100/80',
    statSubtext: 'text-cyan-200/60',
    ctaBg: 'bg-white',
    ctaText: 'text-cyan-900',
    ctaHover: 'hover:bg-cyan-50',
    sidebarIcon: 'text-cyan-300',
    sidebarStepBg: 'bg-cyan-400/30',
    sidebarSubtext: 'text-cyan-200/60',
  },
};
