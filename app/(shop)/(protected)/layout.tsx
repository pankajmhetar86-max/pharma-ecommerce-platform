import type { PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-server'
import { ClientAuthBoundary } from '@/lib/auth-client'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  if (!(await isAuthenticated())) {
    redirect('/auth/login')
  }
  return <ClientAuthBoundary>{children}</ClientAuthBoundary>
}
