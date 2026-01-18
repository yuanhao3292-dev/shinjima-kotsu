'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useWhiteLabel } from '@/lib/contexts/WhiteLabelContext';

// 生成或获取会话 ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('wl_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('wl_session_id', sessionId);
  }
  return sessionId;
}

export default function WhiteLabelTracker() {
  const { isWhiteLabelMode, isSubscriptionActive, currentSlug } = useWhiteLabel();
  const pathname = usePathname();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    // 只在白标模式且订阅有效时追踪
    if (!isWhiteLabelMode || !isSubscriptionActive || !currentSlug) {
      return;
    }

    // 避免重复追踪同一路径
    if (lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;

    // 发送追踪请求
    const trackPageView = async () => {
      try {
        await fetch('/api/whitelabel/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pagePath: pathname,
            sessionId: getSessionId(),
          }),
        });
      } catch (error) {
        // 静默失败，不影响用户体验
        console.debug('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [isWhiteLabelMode, isSubscriptionActive, currentSlug, pathname]);

  // 这个组件不渲染任何内容
  return null;
}
