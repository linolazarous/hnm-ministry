import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

export function initErrorTracking() {
  if (import.meta.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: import.meta.env.NODE_ENV
    })
  }
  
  return Sentry
}
