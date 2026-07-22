import type { Metadata } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { HomePageContent } from '@/components/home-page-content'
import { buildBreadcrumbSchema, buildProductSchemas } from '@/lib/home-schema'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: siteInputs.home.seoTitle,
  description: siteInputs.home.seoDescription,
  keywords: siteInputs.home.seoKeywords,
  alternates: {
    canonical: '/',
  },
}

export const revalidate = 300

function serializeJsonLd(schema: unknown) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

export default async function HomePage() {
  const [initialSliderImages, initialCategories, recommendedProducts] = await Promise.all([
    fetchQuery(api.admin.listActiveSliderImages),
    fetchQuery(api.categories.list),
    fetchQuery(api.products.listRecommended),
  ])
  const initialProducts =
    recommendedProducts.length > 0 ? recommendedProducts : await fetchQuery(api.products.list, { limit: 8 })
  const schemas = [
    buildBreadcrumbSchema([{ name: 'Home', path: '/' }]),
    ...buildProductSchemas(initialProducts),
  ].filter(Boolean)
  const googleTagId = siteInputs.home.googleTagId.trim()

  return (
    <>
      {googleTagId ? <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} /> : null}
      {googleTagId ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(googleTagId)});
            `,
          }}
        />
      ) : null}
      {schemas.map((schema, index) => (
        <script
          key={`home-page-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      <HomePageContent
        initialSliderImages={initialSliderImages}
        initialCategories={initialCategories}
        initialProducts={initialProducts}
      />
    </>
  )
}
