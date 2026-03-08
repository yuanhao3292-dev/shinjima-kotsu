/**
 * Landing Page 共享类型定义
 */
import { Language } from '../../translations';

export type PageView = 'home' | 'medical' | 'business' | 'golf' | 'partner';

export interface SubViewProps {
  t: any;
  setCurrentPage: (page: PageView) => void;
  onLoginTrigger?: () => void;
  onOpenTIMCQuote?: () => void;
  onOpenPartnerInquiry?: () => void;
  currentLang: Language;
  landingInputText?: string;
  setLandingInputText?: (text: string) => void;
  // 白标模式：隐藏官方品牌内容
  hideOfficialBranding?: boolean;
  // 从数据库获取图片的函数（支持可选的 fallback 参数）
  getImage: (key: string, fallback?: string) => string;
}
