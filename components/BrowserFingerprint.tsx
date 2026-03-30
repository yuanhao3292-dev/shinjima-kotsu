'use client';

import { useEffect } from 'react';

/**
 * 浏览器指纹收集组件
 *
 * 延迟 2 秒执行，不影响 LCP。
 * 收集 6 个浏览器环境信号，发送到服务端 API 进行评分和签名。
 * 密钥仅存在于服务端，客户端无法伪造令牌。
 */

function collectSignals(): Record<string, unknown> {
  const signals: Record<string, unknown> = {};

  // 1. navigator.webdriver（Puppeteer/Playwright 为 true）
  signals.webdriver = !!navigator.webdriver;

  // 2. 插件数量（Headless Chrome 通常为 0）
  signals.pluginCount = navigator.plugins.length;

  // 3. 语言设置（无语言 = 可疑）
  signals.hasLanguage = !!(navigator.language || navigator.languages?.length);

  // 4. 屏幕尺寸（完美 0x0 或无 screen = bot）
  signals.hasScreen = typeof screen !== 'undefined';
  signals.screenWidth = typeof screen !== 'undefined' ? screen.width : 0;
  signals.screenHeight = typeof screen !== 'undefined' ? screen.height : 0;

  // 5. WebGL 渲染器检测（SwiftShader = headless Chrome）
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        signals.suspiciousRenderer = typeof renderer === 'string' && /swiftshader|llvmpipe|mesa/i.test(renderer);
      } else {
        signals.suspiciousRenderer = false;
      }
      signals.noWebGL = false;
    } else {
      signals.noWebGL = true;
      signals.suspiciousRenderer = false;
    }
  } catch {
    signals.noWebGL = true;
    signals.suspiciousRenderer = false;
  }

  // 6. 时区检测（无时区 = 可疑）
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    signals.hasTimezone = !!tz;
  } catch {
    signals.hasTimezone = false;
  }

  return signals;
}

async function setFingerprintCookie() {
  try {
    // 如果已有有效 cookie，跳过（httpOnly cookie 无法通过 JS 检测，
    // 但如果之前已经设置过就会随请求发送，服务端 API 可以跳过）
    const signals = collectSignals();

    // 发送到服务端 API 签名
    await fetch('/api/fingerprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signals }),
      credentials: 'same-origin',
    });
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
