'use client';

import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getConsent } from './CookieConsent';

/**
 * Wraps Vercel Analytics and SpeedInsights behind cookie consent.
 * Only renders when user has accepted "all" cookies.
 */
export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => setAllowed(getConsent() === 'all');
    check();
    // Re-check when localStorage changes (consent granted in another tab or component)
    window.addEventListener('storage', check);
    // Also poll briefly for same-tab consent updates
    const interval = setInterval(check, 2000);
    return () => {
      window.removeEventListener('storage', check);
      clearInterval(interval);
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
