import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initErrorTracking() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2,
      release: process.env.REACT_APP_VERSION,
      environment: process.env.NODE_ENV
    });
  }
}