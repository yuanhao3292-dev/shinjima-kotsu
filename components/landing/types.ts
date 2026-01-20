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
  currentLang: Language;
  landingInputText?: string;
  setLandingInputText?: (text: string) => void;
  // 白标模式：隐藏官方品牌内容
  hideOfficialBranding?: boolean;
}
