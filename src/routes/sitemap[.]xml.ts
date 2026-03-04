import { createFileRoute } from '@tanstack/react-router'
import { generateSitemapXml } from '@/constants'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        return new Response(generateSitemapXml(), {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        })
      },
    },
  },
})
