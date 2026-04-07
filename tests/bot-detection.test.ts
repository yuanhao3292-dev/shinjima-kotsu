import { describe, it, expect } from 'vitest';
import { classifyUserAgent, type BotClassification } from '@/lib/utils/bot-detection';

// ============================================================
// classifyUserAgent
// ============================================================

describe('classifyUserAgent', () => {
  // ---- no_ua ----
  it('returns no_ua for null', () => {
    expect(classifyUserAgent(null)).toBe('no_ua');
  });

  it('returns no_ua for empty string', () => {
    expect(classifyUserAgent('')).toBe('no_ua');
  });

  it('returns no_ua for whitespace only', () => {
    expect(classifyUserAgent('   ')).toBe('no_ua');
  });

  // ---- legitimate_bot ----
  const legitimateBots: [string, string][] = [
    ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
    ['Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'],
    ['Applebot', 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/538.46 (KHTML) Applebot/0.1'],
    ['Facebookexternalhit', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'],
    ['Twitterbot', 'Twitterbot/1.0'],
    ['Slackbot', 'Slackbot 1.0 (+https://api.slack.com/robots)'],
    ['Stripe', 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'],
    ['Vercel', 'Vercel Edge Functions'],
    ['Yandexbot', 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'],
    ['Baiduspider', 'Mozilla/5.0 (compatible; Baiduspider/2.0)'],
    ['DuckDuckBot', 'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)'],
    ['WhatsApp', 'WhatsApp/2.19.258 A'],
    ['Telegrambot', 'TelegramBot (like TwitterBot)'],
    ['Discordbot', 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'],
    ['UptimeRobot', 'Mozilla/5.0 (compatible; UptimeRobot/2.0)'],
    ['Pingdom', 'Pingdom.com_bot_version_1.4'],
    ['LINE', 'facebookexternalhit/1.1;line-poker/1.0'],
  ];

  for (const [name, ua] of legitimateBots) {
    it(`classifies ${name} as legitimate_bot`, () => {
      expect(classifyUserAgent(ua)).toBe('legitimate_bot');
    });
  }

  // ---- blocked_bot ----
  const blockedBots: [string, string][] = [
    ['AhrefsBot', 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)'],
    ['SemrushBot', 'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)'],
    ['GPTBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0)'],
    ['ClaudeBot', 'Mozilla/5.0 ClaudeBot/1.0'],
    ['Anthropic-AI', 'Anthropic-AI'],
    ['CCBot', 'CCBot/2.0 (https://commoncrawl.org/faq/)'],
    ['ByteSpider', 'Mozilla/5.0 (compatible; Bytespider)'],
    ['Scrapy', 'Scrapy/2.5.0 (+https://scrapy.org)'],
    ['Nikto', 'Mozilla/5.0 Nikto/2.1.5'],
    ['SQLMap', 'sqlmap/1.4.7'],
    ['DotBot', 'Mozilla/5.0 (compatible; DotBot/1.2)'],
    ['MJ12bot', 'Mozilla/5.0 (compatible; MJ12bot/v1.4.8)'],
    ['PetalBot', 'Mozilla/5.0 (compatible; PetalBot)'],
    ['PerplexityBot', 'Mozilla/5.0 (compatible; PerplexityBot/1.0)'],
    ['Nmap', 'Mozilla/5.0 Nmap Scripting Engine'],
    ['DirBuster', 'DirBuster-1.0-RC1 (http://www.owasp.org/index.php/Category:OWASP_DirBuster_Project)'],
  ];

  for (const [name, ua] of blockedBots) {
    it(`classifies ${name} as blocked_bot`, () => {
      expect(classifyUserAgent(ua)).toBe('blocked_bot');
    });
  }

  // ---- suspicious_tool ----
  const suspiciousTools: [string, string][] = [
    ['curl', 'curl/7.68.0'],
    ['wget', 'Wget/1.20.3 (linux-gnu)'],
    ['python-requests', 'python-requests/2.28.0'],
    ['python-urllib', 'Python-urllib/3.9'],
    ['Go-http-client', 'Go-http-client/1.1'],
    ['axios', 'axios/0.21.1'],
    ['node-fetch', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'],
    ['Puppeteer', 'Mozilla/5.0 HeadlessChrome/89.0 Puppeteer'],
    ['Playwright', 'Mozilla/5.0 Playwright/1.20'],
    ['Selenium', 'Mozilla/5.0 Selenium'],
    ['OkHttp', 'okhttp/4.9.3'],
    ['httpx', 'python-httpx/0.23.0'],
  ];

  for (const [name, ua] of suspiciousTools) {
    it(`classifies ${name} as suspicious_tool`, () => {
      expect(classifyUserAgent(ua)).toBe('suspicious_tool');
    });
  }

  // ---- human ----
  it('classifies Chrome desktop as human', () => {
    expect(classifyUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )).toBe('human');
  });

  it('classifies Safari mobile as human', () => {
    expect(classifyUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    )).toBe('human');
  });

  it('classifies Firefox as human', () => {
    expect(classifyUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/120.0'
    )).toBe('human');
  });

  // ---- priority: legitimate > blocked ----
  it('legitimate takes priority over blocked keywords', () => {
    // A UA that matches both legitimate and blocked patterns
    // Legitimate patterns are checked first
    const ua = 'Googlebot AhrefsBot'; // Googlebot matches first
    expect(classifyUserAgent(ua)).toBe('legitimate_bot');
  });

  // ---- type exhaustiveness ----
  it('returns one of the 5 valid classifications', () => {
    const validTypes: BotClassification[] = ['legitimate_bot', 'blocked_bot', 'suspicious_tool', 'no_ua', 'human'];
    const result = classifyUserAgent('some random browser');
    expect(validTypes).toContain(result);
  });
});
