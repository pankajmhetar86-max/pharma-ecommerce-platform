import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from './convex-client-provider'
import { buildSiteSchemas } from '@/lib/home-schema'
import { SITE_URL } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: 'Pharma eCommerce Platform',
  description: 'Trusted online pharmaceutical platform with secure authentication and real-time cart sync.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
}

function serializeJsonLd(schema: unknown) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const schemas = buildSiteSchemas()

  return (
    <html lang="en">
      <head>
        {schemas.map((schema, index) => (
          <script
            key={`home-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
          />
        ))}
      </head>
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js');
  navigator.serviceWorker.addEventListener('message', (e) => {
    if(e.data?.type === 'IMAGE_UPDATED'){
      document.querySelectorAll('img[src="' + e.data.url + '"]').forEach((img) => {
        img.src = e.data.url + '?t=' + Date.now();
      });
    }
  });
}`,
          }}
        />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
