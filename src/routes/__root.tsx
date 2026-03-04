import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getAuth } from '@workos/authkit-tanstack-react-start'
import { AuthKitProvider, useAccessToken, useAuth } from '@workos/authkit-tanstack-react-start/client'
import { ThemeProvider, useTheme } from 'next-themes'
import { getLocaleDirection } from 'generaltranslation'
import { GTProvider, useLocale } from 'gt-react'
import { AutumnProvider } from 'autumn-js/react'
import { useCallback, useMemo } from 'react'
import { ConvexProviderWithAuth } from 'convex/react'
import { WorkOsWidgets } from '@workos-inc/widgets'
import { api } from '../../convex/_generated/api'
import appCssUrl from '../app.css?url'
import config from '../../gt.config.json'
import dictionary from '../_gt/en.json'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'
import { PostHogProvider } from '@/lib/posthog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DirectionProvider } from '@/components/ui/direction'
import { Toaster } from '@/components/ui/sonner'
import { LOGO_PATH, ROOT_META } from '@/constants'
import loadTranslations from '@/loadTranslations'

const faviconHref = LOGO_PATH ?? '/favicon.ico'

const fetchWorkosAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const auth = await getAuth()
  const { user } = auth

  return {
    userId: user?.id ?? null,
    token: user ? auth.accessToken : null,
  }
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: ROOT_META,
    links: [
      { rel: 'stylesheet', href: appCssUrl },
      { rel: 'icon', href: faviconHref },
      { rel: 'apple-touch-icon', href: faviconHref },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>Not Found</div>,
  beforeLoad: async (ctx) => {
    const { userId, token } = await fetchWorkosAuth()

    // During SSR only (the only time serverHttpClient exists),
    // set the WorkOS auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    return { userId, token }
  },
})

function RootComponent() {
  const { convexQueryClient } = Route.useRouteContext()

  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convexQueryClient.convexClient} useAuth={useAuthFromWorkOS}>
        <AutumnProvider convex={convexQueryClient.convexClient} convexApi={(api as any).autumn}>
          <GTProvider config={config} dictionary={dictionary} loadTranslations={loadTranslations}>
            <RootDocument>
              <WorkOsWidgets queryClient={convexQueryClient.queryClient}>
                <Outlet />
              </WorkOsWidgets>
            </RootDocument>
          </GTProvider>
        </AutumnProvider>
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  )
}

function useAuthFromWorkOS() {
  const { loading, user } = useAuth()
  const { getAccessToken, refresh } = useAccessToken()

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) {
        return null
      }

      if (forceRefreshToken) {
        return (await refresh()) ?? null
      }

      return (await getAccessToken()) ?? null
    },
    [user, refresh, getAccessToken],
  )

  return useMemo(
    () => ({
      isLoading: loading,
      isAuthenticated: !!user,
      fetchAccessToken,
    }),
    [loading, user, fetchAccessToken],
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const locale = useLocale()
  const { theme } = useTheme()
  const dir = getLocaleDirection(locale)
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PostHogProvider>
          <DirectionProvider dir={dir}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster theme={theme as 'light' | 'dark' | 'system'} position="top-center" />
            </ThemeProvider>
          </DirectionProvider>
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}
