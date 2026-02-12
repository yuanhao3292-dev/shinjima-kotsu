/**
 * 动态模板引擎
 * ============================================
 * 根据模板配置动态渲染白标分销页面
 *
 * 支持模板类型：
 * - bio: 导游简介模板
 * - service: 服务模块模板
 * - contact: 联系方式模板
 *
 * 使用方式：
 * 1. 注册模板: registerTemplate('modern_bio', ModernBioTemplate)
 * 2. 渲染模板: renderTemplate('bio', 'modern', data)
 *
 * @version 1.0.0
 */

import type { ReactNode } from 'react';
import type { GuideDistributionPage } from '@/lib/services/whitelabel';

// ============================================
// 类型定义
// ============================================

/**
 * 模板类型
 */
export type TemplateType = 'bio' | 'service' | 'contact' | 'hero' | 'footer';

/**
 * 模板主题
 */
export type TemplateTheme = 'modern' | 'classic' | 'minimal' | 'elegant' | 'corporate';

/**
 * 模板配置
 */
export interface TemplateConfig {
  /** 模板类型 */
  type: TemplateType;
  /** 模板主题 */
  theme: TemplateTheme;
  /** 自定义配置 */
  config?: Record<string, unknown>;
}

/**
 * 模板渲染上下文
 */
export interface TemplateContext {
  /** 品牌名称 */
  brandName: string;
  /** 品牌颜色 */
  brandColor: string;
  /** 品牌 Logo URL */
  brandLogoUrl?: string | null;
  /** 页面完整数据 */
  pageData: GuideDistributionPage;
  /** 模板自定义配置 */
  templateConfig?: Record<string, unknown>;
}

/**
 * 模板组件 Props
 */
export interface TemplateProps<T = Record<string, unknown>> {
  context: TemplateContext;
  data: T;
}

/**
 * 模板组件类型
 */
export type TemplateComponent<T = Record<string, unknown>> = (props: TemplateProps<T>) => ReactNode;

// ============================================
// 模板注册表
// ============================================

/**
 * 模板注册表
 * 格式: { [type]: { [theme]: Component } }
 */
const templateRegistry: Map<TemplateType, Map<TemplateTheme, TemplateComponent<any>>> = new Map();

/**
 * 默认模板主题
 */
const defaultTheme: TemplateTheme = 'modern';

/**
 * 注册模板
 *
 * @param type 模板类型
 * @param theme 模板主题
 * @param component 模板组件
 *
 * @example
 * registerTemplate('bio', 'modern', ModernBioTemplate);
 */
export function registerTemplate<T>(
  type: TemplateType,
  theme: TemplateTheme,
  component: TemplateComponent<T>
): void {
  if (!templateRegistry.has(type)) {
    templateRegistry.set(type, new Map());
  }
  // Note: Using `any` here is intentional - the registry stores heterogeneous components
  // with different data types. Type safety is enforced at the renderTemplate call site.
  templateRegistry.get(type)!.set(theme, component as TemplateComponent<any>);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Template] Registered: ${type}/${theme}`);
  }
}

/**
 * 获取模板组件
 *
 * @param type 模板类型
 * @param theme 模板主题（可选，默认使用 'modern'）
 * @returns 模板组件或 null
 */
export function getTemplate<T>(
  type: TemplateType,
  theme?: TemplateTheme
): TemplateComponent<T> | null {
  const typeRegistry = templateRegistry.get(type);
  if (!typeRegistry) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Template] Type not found: ${type}`);
    }
    return null;
  }

  // 尝试获取指定主题
  let template = typeRegistry.get(theme || defaultTheme);

  // 如果找不到，尝试默认主题
  if (!template && theme !== defaultTheme) {
    template = typeRegistry.get(defaultTheme);
  }

  // 如果还找不到，返回任意一个
  if (!template) {
    const firstTemplate = typeRegistry.values().next().value;
    if (firstTemplate) {
      template = firstTemplate;
    }
  }

  return template || null;
}

/**
 * 获取所有已注册的模板
 */
export function getRegisteredTemplates(): Array<{ type: TemplateType; themes: TemplateTheme[] }> {
  const result: Array<{ type: TemplateType; themes: TemplateTheme[] }> = [];

  templateRegistry.forEach((themes, type) => {
    result.push({
      type,
      themes: Array.from(themes.keys()),
    });
  });

  return result;
}

// ============================================
// 模板渲染器
// ============================================

/**
 * 渲染模板
 *
 * @param type 模板类型
 * @param theme 模板主题
 * @param context 渲染上下文
 * @param data 模板数据
 * @returns React 节点或 null
 *
 * @example
 * const bioSection = renderTemplate('bio', 'modern', context, guideData);
 */
export function renderTemplate<T>(
  type: TemplateType,
  theme: TemplateTheme | undefined,
  context: TemplateContext,
  data: T
): ReactNode {
  const Template = getTemplate<T>(type, theme);

  if (!Template) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Template] Cannot render ${type}/${theme}: template not found`);
    }
    return null;
  }

  return Template({ context, data });
}

// ============================================
// 模板工具函数
// ============================================

/**
 * 从模板键解析类型和主题
 *
 * @param templateKey 模板键，格式: "type_theme" 或 "theme"
 * @param defaultType 默认类型
 * @returns { type, theme }
 *
 * @example
 * parseTemplateKey('modern_bio', 'bio') // { type: 'bio', theme: 'modern' }
 * parseTemplateKey('elegant', 'bio') // { type: 'bio', theme: 'elegant' }
 */
export function parseTemplateKey(
  templateKey: string,
  defaultType: TemplateType
): { type: TemplateType; theme: TemplateTheme } {
  if (!templateKey) {
    return { type: defaultType, theme: defaultTheme };
  }

  const parts = templateKey.split('_');

  if (parts.length >= 2) {
    // 格式: theme_type 或 type_theme
    const [first, second] = parts;

    // 检查哪个是类型
    const types: TemplateType[] = ['bio', 'service', 'contact', 'hero', 'footer'];
    const themes: TemplateTheme[] = ['modern', 'classic', 'minimal', 'elegant', 'corporate'];

    if (types.includes(first as TemplateType)) {
      return {
        type: first as TemplateType,
        theme: themes.includes(second as TemplateTheme) ? (second as TemplateTheme) : defaultTheme,
      };
    } else if (types.includes(second as TemplateType)) {
      return {
        type: second as TemplateType,
        theme: themes.includes(first as TemplateTheme) ? (first as TemplateTheme) : defaultTheme,
      };
    }
  }

  // 单个值，尝试作为主题
  const themes: TemplateTheme[] = ['modern', 'classic', 'minimal', 'elegant', 'corporate'];
  if (themes.includes(templateKey as TemplateTheme)) {
    return { type: defaultType, theme: templateKey as TemplateTheme };
  }

  return { type: defaultType, theme: defaultTheme };
}

/**
 * 创建模板上下文
 *
 * @param pageData 页面数据
 * @param templateConfig 模板配置
 * @returns 模板上下文
 */
export function createTemplateContext(
  pageData: GuideDistributionPage,
  templateConfig?: Record<string, unknown>
): TemplateContext {
  return {
    brandName: pageData.guide.brandName || pageData.guide.name,
    brandColor: pageData.guide.brandColor,
    brandLogoUrl: pageData.guide.brandLogoUrl,
    pageData,
    templateConfig,
  };
}

// ============================================
// 颜色工具函数
// ============================================

/** Regex for validating 6-character hex color codes */
const HEX_COLOR_REGEX = /^[0-9A-Fa-f]{6}$/;

/**
 * Validates a hex color string (with or without #)
 *
 * @param color - Color string to validate
 * @returns true if valid 6-character hex color
 */
export function isValidHexColor(color: string): boolean {
  const hex = color.replace('#', '');
  return HEX_COLOR_REGEX.test(hex);
}

/**
 * 调整颜色明暗
 *
 * @param color - Hex color string (e.g., "#ffffff" or "ffffff")
 * @param amount - Amount to adjust (-255 to 255, negative = darker)
 * @returns Adjusted hex color string with # prefix
 */
export function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(255, Math.max(0, num));
  const hex = color.replace('#', '');

  if (!isValidHexColor(hex)) return color;

  const r = clamp(parseInt(hex.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.substring(4, 6), 16) + amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 获取颜色的透明版本
 *
 * @param color - Hex color string (e.g., "#ffffff")
 * @param alpha - Alpha value (0 to 1)
 * @returns RGBA color string
 */
export function getColorWithAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');

  if (!isValidHexColor(hex)) return color;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 判断颜色是否为深色
 *
 * Uses relative luminance formula (ITU-R BT.601) to determine
 * if a color is perceived as dark by human vision.
 *
 * @param color - Hex color string (e.g., "#ffffff")
 * @returns true if the color's relative luminance is < 0.5
 */
export function isColorDark(color: string): boolean {
  const hex = color.replace('#', '');

  if (!isValidHexColor(hex)) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 使用相对亮度公式
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5;
}

/**
 * 获取对比色（用于文字）
 *
 * Returns white (#ffffff) for dark backgrounds and near-black (#1f2937)
 * for light backgrounds, ensuring WCAG AA contrast ratio compliance.
 *
 * @param backgroundColor - Hex color string for the background
 * @returns White or near-black hex color for optimal text readability
 */
export function getContrastColor(backgroundColor: string): string {
  return isColorDark(backgroundColor) ? '#ffffff' : '#1f2937';
}
