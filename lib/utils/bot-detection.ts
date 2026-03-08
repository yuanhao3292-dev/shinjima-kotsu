/**
 * Edge-compatible bot detection module
 * Pure regex matching — no Node.js API dependencies
 */

export type BotClassification =
  | 'legitimate_bot'
  | 'blocked_bot'
  | 'suspicious_tool'
  | 'no_ua'
  | 'human';

// ============================================================
// Legitimate bots — allowed without rate limiting
// ============================================================
const LEGITIMATE_BOT_PATTERNS: RegExp[] = [
  // Search engines
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i, // Yahoo
  /applebot/i,
  // Social media / messaging previews
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /slackbot/i,
  /line-poker/i, // LINE messenger
  // Payment & infrastructure
  /stripe/i,
  /vercel/i,
  // Monitoring
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
];

// ============================================================
// Blocked bots — immediate 403
// ============================================================
const BLOCKED_BOT_PATTERNS: RegExp[] = [
  // SEO crawlers
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /mj12bot/i,
  /petalbot/i,
  /sogou/i,
  /yisouspider/i,
  /exabot/i,
  /blexbot/i,
  /dataforseo/i,
  /serpstatbot/i,
  /megaindex/i,
  /rogerbot/i,
  /sistrix/i,
  // AI training bots
  /gptbot/i,
  /chatgpt-user/i,
  /ccbot/i,
  /claudebot/i,
  /anthropic-ai/i,
  /bytespider/i,
  /cohere-ai/i,
  /perplexitybot/i,
  /youbot/i,
  /ia_archiver/i,
  /img2dataset/i,
  // Known scrapers & attack tools
  /scrapy/i,
  /nutch/i,
  /httrack/i,
  /harvest/i,
  /emailcollector/i,
  /webzip/i,
  /nikto/i,
  /sqlmap/i,
  /nmap/i,
  /masscan/i,
  /zmeu/i,
  /dirbuster/i,
  /gobuster/i,
];

// ============================================================
// Suspicious tools — not malicious but unusual for browsing
// ============================================================
const SUSPICIOUS_TOOL_PATTERNS: RegExp[] = [
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /httpx/i,
  /aiohttp/i,
  /go-http-client/i,
  /java\//i,
  /okhttp/i,
  /apache-httpclient/i,
  /node-fetch/i,
  /axios\//i,
  /undici/i,
  /puppeteer/i,
  /playwright/i,
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /webdriver/i,
];

/**
 * Classify a User-Agent string into a bot category.
 * Order matters: legitimate → blocked → suspicious → human
 */
export function classifyUserAgent(ua: string | null): BotClassification {
  if (!ua || ua.trim() === '') {
    return 'no_ua';
  }

  // Whitelist check first
  for (const pattern of LEGITIMATE_BOT_PATTERNS) {
    if (pattern.test(ua)) {
      return 'legitimate_bot';
    }
  }

  // Blocklist check
  for (const pattern of BLOCKED_BOT_PATTERNS) {
    if (pattern.test(ua)) {
      return 'blocked_bot';
    }
  }

  // Suspicious tool check
  for (const pattern of SUSPICIOUS_TOOL_PATTERNS) {
    if (pattern.test(ua)) {
      return 'suspicious_tool';
    }
  }

  return 'human';
}
