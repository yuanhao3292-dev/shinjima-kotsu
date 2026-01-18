import { cookies, headers } from "next/headers";
import { getGuideBySlug } from "@/lib/services/whitelabel";
import {
  GuideWhiteLabelConfig,
  WHITELABEL_COOKIE_NAME,
  DOMAINS,
} from "@/lib/types/whitelabel";

/**
 * 服务端获取白标配置
 * 用于 Server Components 和 Server Actions
 *
 * 白标模式判断逻辑：
 * 1. 白标域名（bespoketrip.jp）访问 → 白标模式
 * 2. 官方域名但有有效的导游 Cookie → 白标模式
 * 3. 其他情况 → 官方模式
 */
export async function getWhiteLabelConfig(): Promise<{
  isWhiteLabelMode: boolean;
  guideConfig: GuideWhiteLabelConfig | null;
  currentSlug: string | null;
}> {
  const headersList = await headers();
  const cookieStore = await cookies();

  // 从 header 或 Cookie 获取导游 slug
  const currentSlug =
    headersList.get("x-whitelabel-slug") ||
    cookieStore.get(WHITELABEL_COOKIE_NAME)?.value ||
    null;

  // 如果没有 slug，直接返回官方模式
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
