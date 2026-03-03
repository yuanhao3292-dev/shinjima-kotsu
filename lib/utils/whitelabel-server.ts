import { headers } from "next/headers";
import { getGuideBySlug } from "@/lib/services/whitelabel";
import {
  GuideWhiteLabelConfig,
  DOMAINS,
} from "@/lib/types/whitelabel";

/**
 * 服务端获取白标配置
 * 用于 Server Components 和 Server Actions
 *
 * 白标模式判断逻辑（仅通过 middleware 设置的请求头判断）：
 * 1. 白标域名（bespoketrip.jp）访问 → middleware 设置 x-whitelabel-mode 头 → 白标模式
 * 2. 分销路径（/g/[slug]）访问 → middleware 设置 x-whitelabel-mode 头 → 白标模式
 * 3. 其他情况 → 官方模式（即使有残留 Cookie 也不进入白标）
 *
 * ⚠️ 不直接读取 Cookie，避免官方域名被 Cookie 污染
 *    Cookie 仅供 API 路由（checkout、order-lookup、track）用于导游归属追踪
 */
export async function getWhiteLabelConfig(): Promise<{
  isWhiteLabelMode: boolean;
  guideConfig: GuideWhiteLabelConfig | null;
  currentSlug: string | null;
}> {
  const headersList = await headers();

  // 仅通过 middleware 设置的请求头判断白标模式
  // middleware 只在以下情况设置这些头：
  // - bespoketrip.jp 域名访问（含子域名）
  // - /g/[slug] 路由访问
  const currentSlug = headersList.get("x-whitelabel-slug") || null;

  // 如果没有 slug header，直接返回官方模式
  if (!currentSlug) {
    return {
      isWhiteLabelMode: false,
      guideConfig: null,
      currentSlug: null,
    };
  }

  // 有 slug，尝试获取导游配置
  const guideConfig = await getGuideBySlug(currentSlug);

  // 只有当导游配置存在且订阅有效时，才进入白标模式
  const isWhiteLabelMode =
    guideConfig !== null && guideConfig.subscriptionStatus === "active";

  return {
    isWhiteLabelMode,
    guideConfig,
    currentSlug,
  };
}

/**
 * 检测当前域名类型
 */
export async function getDomainType(): Promise<"official" | "whitelabel"> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (
    host.includes(DOMAINS.whitelabel) ||
    host.includes("localhost:3001")
  ) {
    return "whitelabel";
  }

  return "official";
}
