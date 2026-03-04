import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderBase } from '@posthog/react'
import { useEffect, useState } from 'react'
import type { PostHog } from 'posthog-js'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthogClient, setPosthogClient] = useState<PostHog | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Track if component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only initialize in production and on client side
    if (!isMounted || !import.meta.env.PROD || typeof window === 'undefined') {
      return
    }

    const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY || import.meta.env.VITE_POSTHOG_KEY

    if (!posthogKey) {
      console.warn('PostHog key not found. PostHog will not be initialized.')
      return
    }

    // Initialize PostHog
    const client = posthog.init(posthogKey, {
      api_host: '/prod-data',
      ui_host: 'https://us.posthog.com',
      loaded: (ph) => {
        if (import.meta.env.DEV) {
          console.log('PostHog loaded', ph)
        }
      },
    })

    setPosthogClient(client)
  }, [isMounted])

  // Only render PostHogProvider when client is initialized and mounted
  if (!isMounted || !posthogClient) {
    return <>{children}</>
  }

  return <PostHogProviderBase client={posthogClient}>{children}</PostHogProviderBase>
}
