import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: 'https://ce61458da1fa6a48b503fb4f9a0ff16d@o4510954591485952.ingest.us.sentry.io/4510954595418112',
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
})
