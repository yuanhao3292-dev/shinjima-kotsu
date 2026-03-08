'use client';

import { useEffect } from 'react';

/**
 * 浏览器指纹收集组件
 *
 * 延迟 2 秒执行，不影响 LCP。
 * 收集 6 个浏览器环境信号，计算 bot 评分（0-100），
 * HMAC 签名后写入 cookie `__bfp`，供 middleware 读取。
 *
 * 评分越高 = 越可能是 bot
 */

// 签名密钥从环境变量获取（构建时注入）
const FP_SECRET = process.env.NEXT_PUBLIC_FP_SECRET || 'fp-default-key';

function collectFingerprint(): number {
  let score = 0;

  // 1. navigator.webdriver（Puppeteer/Playwright 为 true）
  if (navigator.webdriver) {
    score += 25;
  }

  // 2. 插件数量（Headless Chrome 通常为 0）
  if (navigator.plugins.length === 0) {
    score += 15;
  }

  // 3. 语言设置（无语言 = 可疑）
  if (!navigator.language && !navigator.languages?.length) {
    score += 10;
  }

  // 4. 屏幕尺寸（完美 0x0 或无 screen = bot）
  if (typeof screen === 'undefined' || screen.width === 0 || screen.height === 0) {
    score += 15;
  }

  // 5. WebGL 渲染器检测（SwiftShader = headless Chrome）
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (typeof renderer === 'string' && /swiftshader|llvmpipe|mesa/i.test(renderer)) {
          score += 20;
        }
      }
    } else {
      // 无 WebGL = 可疑
      score += 10;
    }
  } catch {
    score += 5;
  }

  // 6. 时区检测（无时区 = 可疑）
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) {
      score += 10;
    }
  } catch {
    score += 10;
  }

  return Math.min(score, 100);
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function setFingerprintCookie() {
  try {
    // 如果已有有效 cookie，跳过
    if (document.cookie.includes('__bfp=')) return;

    const score = collectFingerprint();
    const timestamp = Date.now();
    const payload = `v1.${score}.${timestamp}`;
    const hmac = await hmacSign(payload, FP_SECRET);
    const token = `${payload}.${hmac}`;

    // 设置 cookie，1 小时过期，SameSite=Lax
    document.cookie = `__bfp=${token}; path=/; max-age=3600; SameSite=Lax`;
  } catch {
    // 静默失败，不影响用户体验
  }
}

export default function BrowserFingerprint() {
  useEffect(() => {
    // 延迟 2 秒执行，不影响 LCP
    const timer = setTimeout(setFingerprintCookie, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null; // 无 UI 输出
}
