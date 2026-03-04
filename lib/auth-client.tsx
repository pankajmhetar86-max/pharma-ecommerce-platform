'use client'

import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { AuthBoundary } from '@convex-dev/better-auth/react'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { api } from '@/convex/_generated/api'

export const authClient = createAuthClient({
  plugins: [convexClient()],
})

export function ClientAuthBoundary({ children }: PropsWithChildren) {
  const router = useRouter()

  return (
    <AuthBoundary
      authClient={authClient}
      getAuthUserFn={api.auth.getAuthUser}
      onUnauth={() => router.push('/auth/login')}
      isAuthError={(error) => error instanceof Error && /auth|token|session/i.test(error.message)}
    >
      {children}
    </AuthBoundary>
  )
}
