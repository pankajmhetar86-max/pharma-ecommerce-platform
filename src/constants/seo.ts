import { OG_DESCRIPTION, OG_IMAGE, OG_TITLE, SITE_NAME, SITE_URL } from './site'

export const ROOT_META = [
  {
    charSet: 'utf-8' as const,
  },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1',
  },
  {
    title: SITE_NAME,
  },
  {
    name: 'application-name',
    content: SITE_NAME,
  },
  {
    name: 'apple-mobile-web-app-capable',
    content: 'yes',
  },
  {
    name: 'apple-mobile-web-app-status-bar-style',
    content: 'black-translucent',
  },
  {
    name: 'apple-mobile-web-app-title',
    content: SITE_NAME,
  },
  {
    name: 'mobile-web-app-capable',
    content: 'yes',
  },
  {
    property: 'og:title',
    content: OG_TITLE,
  },
  {
    property: 'og:description',
    content: OG_DESCRIPTION,
  },
  {
    property: 'og:image',
    content: OG_IMAGE,
  },
  {
    property: 'og:url',
    content: SITE_URL,
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    name: 'twitter:url',
    content: SITE_URL,
  },
  {
    name: 'twitter:title',
    content: OG_TITLE,
  },
  {
    name: 'twitter:description',
    content: OG_DESCRIPTION,
  },
  {
    name: 'twitter:image',
    content: OG_IMAGE,
  },
]

export interface SitemapRoute {
  path: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  lastmod?: string
}

export const UNAUTHENTICATED_ROUTES: Array<SitemapRoute> = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/privacy-policy', changefreq: 'monthly', priority: 0.3 },
  { path: '/terms-of-use', changefreq: 'monthly', priority: 0.3 },
]

export function generateSitemapXml(routes: Array<SitemapRoute> = UNAUTHENTICATED_ROUTES): string {
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route.path}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>${route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''}\n  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}
