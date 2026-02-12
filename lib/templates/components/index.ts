/**
 * 模板组件导出
 * ============================================
 * 集中导出所有模板组件并注册到引擎
 *
 * @version 1.0.0
 */

// 导出模板引擎
export * from '../engine';

// 导出各类型模板
export * from './hero';
export * from './bio';
export * from './services';
export * from './contact';
export * from './footer';

// 初始化函数（在应用启动时调用）
import { initHeroTemplates } from './hero';
import { initBioTemplates } from './bio';
import { initServiceTemplates } from './services';
import { initContactTemplates } from './contact';
import { initFooterTemplates } from './footer';

let initialized = false;

/**
 * 初始化所有模板
 * 在使用模板引擎前调用
 */
export function initAllTemplates(): void {
  if (initialized) return;

  initHeroTemplates();
  initBioTemplates();
  initServiceTemplates();
  initContactTemplates();
  initFooterTemplates();

  initialized = true;

  if (process.env.NODE_ENV === 'development') {
    console.log('[Templates] All templates initialized');
  }
}
