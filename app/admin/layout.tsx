import type { PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated, isAuthenticated } from '@/lib/auth-server'

export default async function AdminLayout({ children }: PropsWithChildren) {
  if (!(await isAuthenticated())) {
    redirect('/auth/login')
  }
  if (!(await isAdminAuthenticated())) {
    redirect('/')
  }
  return <>{children}</>
}
