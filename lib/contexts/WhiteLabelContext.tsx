"use client";

import { createContext, useContext, ReactNode } from "react";
import {
  WhiteLabelContextValue,
  GuideWhiteLabelConfig,
  DEFAULT_OFFICIAL_BRANDING,
} from "@/lib/types/whitelabel";
import { DEFAULT_CONTACT } from "@/lib/whitelabel-config";

// 创建 Context
const WhiteLabelContext = createContext<WhiteLabelContextValue | null>(null);

interface WhiteLabelProviderProps {
  children: ReactNode;
  // 从服务端传入的初始值
  initialConfig?: {
    isWhiteLabelMode: boolean;
    guideConfig: GuideWhiteLabelConfig | null;
    currentSlug: string | null;
  };
}

export function WhiteLabelProvider({
  children,
  initialConfig,
}: WhiteLabelProviderProps) {
  const isWhiteLabelMode = initialConfig?.isWhiteLabelMode ?? false;
  const guideConfig = initialConfig?.guideConfig ?? null;
  const currentSlug = initialConfig?.currentSlug ?? null;

  // 判断订阅是否有效
  const isSubscriptionActive =
    guideConfig?.subscriptionStatus === "active" &&
    (guideConfig?.subscriptionEndDate
      ? new Date(guideConfig.subscriptionEndDate) > new Date()
      : true);

  // 构建品牌信息
  const branding = {
    name:
      isWhiteLabelMode && guideConfig?.brandName
        ? guideConfig.brandName
        : DEFAULT_OFFICIAL_BRANDING.name,
    logoUrl:
      isWhiteLabelMode && guideConfig?.brandLogoUrl
        ? guideConfig.brandLogoUrl
        : DEFAULT_OFFICIAL_BRANDING.logoUrl,
    color:
      isWhiteLabelMode && guideConfig?.brandColor
        ? guideConfig.brandColor
        : DEFAULT_OFFICIAL_BRANDING.color,
    // 官方模式或未激活订阅时显示官方品牌
    showOfficialBranding: !isWhiteLabelMode || !isSubscriptionActive,
  };

  // 构建联系方式
  const contact =
    isWhiteLabelMode && guideConfig
      ? {
          wechat: guideConfig.contactWechat,
          line: guideConfig.contactLine,
          phone: guideConfig.contactDisplayPhone,
          email: guideConfig.email,
        }
      : {
          wechat: null,
          line: null,
          phone: DEFAULT_CONTACT.PHONE,
          email: DEFAULT_CONTACT.EMAIL,
        };

  const value: WhiteLabelContextValue = {
    isWhiteLabelMode,
    domain: isWhiteLabelMode ? "whitelabel" : "official",
    guideConfig,
    currentSlug,
    isSubscriptionActive,
    branding,
    contact,
  };

  return (
    <WhiteLabelContext.Provider value={value}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

// 自定义 Hook
export function useWhiteLabel(): WhiteLabelContextValue {
  const context = useContext(WhiteLabelContext);

  if (!context) {
    // 警告：在 Provider 外部使用 hook
    if (typeof window !== "undefined") {
      console.warn(
        "[WhiteLabel] useWhiteLabel() called outside of WhiteLabelProvider. " +
        "Returning default official mode values."
      );
    }

    // 返回默认值（官方模式）
    return {
      isWhiteLabelMode: false,
      domain: "official",
      guideConfig: null,
      currentSlug: null,
      isSubscriptionActive: false,
      branding: {
        name: DEFAULT_OFFICIAL_BRANDING.name,
        logoUrl: DEFAULT_OFFICIAL_BRANDING.logoUrl,
        color: DEFAULT_OFFICIAL_BRANDING.color,
        showOfficialBranding: true,
      },
      contact: {
        wechat: null,
        line: null,
        phone: DEFAULT_CONTACT.PHONE,
        email: DEFAULT_CONTACT.EMAIL,
      },
    };
  }

  return context;
}

// 辅助 Hook: 判断是否应该隐藏某个元素
export function useWhiteLabelVisibility() {
  const { isWhiteLabelMode, isSubscriptionActive } = useWhiteLabel();

  return {
    // 隐藏导游合伙人相关内容
    hideGuidePartnerContent: isWhiteLabelMode && isSubscriptionActive,
    // 隐藏官方品牌
    hideOfficialBranding: isWhiteLabelMode && isSubscriptionActive,
    // 显示导游品牌
    showGuideBranding: isWhiteLabelMode && isSubscriptionActive,
  };
}
