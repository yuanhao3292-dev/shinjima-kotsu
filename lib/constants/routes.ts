/**
 * 应用路由常量
 * 集中管理所有路由，避免硬编码 URL
 */

export const ROUTES = {
  // 主页
  HOME: '/',

  // 业务领域
  BUSINESS: '/business',
  BUSINESS_GOLF: '/business/golf',
  BUSINESS_MEDICAL: '/business/medical',
  BUSINESS_PARTNER: '/business/partner',

  // 企业信息
  COMPANY: '/company',
  COMPANY_ABOUT: '/company/about',

  // 可持续发展
  SUSTAINABILITY: '/sustainability',
  SUSTAINABILITY_COMMUNITY: '/sustainability/community',

  // 新闻
  NEWS: '/news',

  // 其他页面
  FAQ: '/faq',
  ABOUT: '/about',
  // 健康旅游
  HEALTH_SCREENING: '/health-screening',
  CANCER_TREATMENT: '/cancer-treatment',

  // 特殊功能
  GOLF_INQUIRY: '/?page=golf',
  MEDICAL_INQUIRY: '/?page=medical',
  PACKAGE_RECOMMENDER: '/package-recommender',

  // 用户相关
  LOGIN: '/login',
  REGISTER: '/register',
  MY_ACCOUNT: '/my-account',
  MY_ORDERS: '/my-orders',

  // 管理员
  ADMIN: '/admin',
  GUIDE_PARTNER: '/guide-partner',
} as const;

/**
 * 路由类型
 */
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

/**
 * 检查路径是否匹配某个路由
 */
export function isRoute(pathname: string, route: RouteValue): boolean {
  return pathname === route;
}

/**
 * 检查路径是否以某个路由开头
 */
export function isRoutePrefix(pathname: string, route: RouteValue): boolean {
  return pathname.startsWith(route);
}
