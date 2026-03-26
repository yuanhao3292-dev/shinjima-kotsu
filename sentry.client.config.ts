import * as Sentry from '@sentry/nextjs';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function scrubPii(text: string | undefined): string | undefined {
  if (!text) return text;
  return text.replace(EMAIL_REGEX, '[EMAIL]');
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Sample 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Capture 100% of errors
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,

  // Scrub PII from error reports
  beforeSend(event) {
    // Scrub email from error messages
    if (event.message) {
      event.message = scrubPii(event.message)!;
    }
    if (event.exception?.values) {
      for (const exception of event.exception.values) {
        exception.value = scrubPii(exception.value);
      }
    }
    // Scrub email from breadcrumbs
    if (event.breadcrumbs) {
      for (const breadcrumb of event.breadcrumbs) {
        if (breadcrumb.message) {
          breadcrumb.message = scrubPii(breadcrumb.message)!;
        }
      }
    }
    // Remove user email/ip if set
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },

  // Don't send default PII
  sendDefaultPii: false,

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop',
    'Network request failed',
    'Load failed',
    'ChunkLoadError',
  ],
});
