import { ErrorComponent, createRouter } from '@tanstack/react-router'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ConvexReactClient } from 'convex/react'
import { useEffect } from 'react'
import * as Sentry from '@sentry/tanstackstart-react'
import { routeTree } from './routeTree.gen'
import type { ErrorComponentProps } from '@tanstack/react-router'

const SENTRY_DSN = 'https://ce61458da1fa6a48b503fb4f9a0ff16d@o4510954591485952.ingest.us.sentry.io/4510954595418112'

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    throw new Error('missing VITE_CONVEX_URL env var')
  }
  const convex = new ConvexReactClient(CONVEX_URL)
  const convexQueryClient = new ConvexQueryClient(convex)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPreloadStaleTime: 0, // Let React Query handle all caching
    defaultErrorComponent,
    defaultNotFoundComponent,
    context: { queryClient, convexClient: convex, convexQueryClient },
  })
  setupRouterSsrQueryIntegration({ router, queryClient })

  if (!router.isServer && !Sentry.getClient()) {
    Sentry.init({
      dsn: SENTRY_DSN,
      sendDefaultPii: true,
      integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router), Sentry.replayIntegration()],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      tunnel: '/tunnel',
    })
  }

  return router
}

function defaultNotFoundComponent() {
  return <div>Not Found</div>
}

function defaultErrorComponent(props: ErrorComponentProps) {
  useEffect(() => {
    Sentry.captureException(props.error)
  }, [props.error])

  const isProduction = (import.meta as any).env.VERCEL_ENV === 'production'

  if (isProduction) {
    return <div>Something went wrong</div>
  }
  return <ErrorComponent {...props} />
}
