import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from './convex-client-provider'
import { getToken } from '@/lib/auth-server'

export const metadata: Metadata = {
  title: 'Pharma eCommerce Platform',
  description: 'Trusted online pharmaceutical platform with secure authentication and real-time cart sync.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await getToken()

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <ConvexClientProvider initialToken={token}>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
