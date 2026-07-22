import type { PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export default async function AuthLayout({ children }: PropsWithChildren) {
  if (await isAuthenticated()) {
    redirect('/')
  }
  return children
}
