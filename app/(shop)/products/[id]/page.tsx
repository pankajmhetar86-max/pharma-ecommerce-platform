import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { ProductDosageCart } from '@/components/product-detail-content'
import { buildProductDetailSchema } from '@/lib/home-schema'
import { toProductImagePath } from '@/lib/image-url'
import { renderMarkdownContent } from '@/lib/markdown'

function serializeJsonLd(schema: unknown) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

export default async function ProductDetailByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await fetchQuery(api.products.getBySlugOrId, { identifier: id })

  if (!product) {
    return null
  }

  const productSchema = buildProductDetailSchema(product)
  const imageSrc = toProductImagePath(product.slug ?? product._id, product.image)

  return (
    <>
      {productSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }} />
      ) : null}

      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 lg:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>

        {/* Category badge */}
        {product.category && (
          <div>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
              {product.category}
            </span>
          </div>
        )}

        {/* Product header — server-rendered so name + description are always in the HTML */}
        <section className="rx-card overflow-hidden">
          <div className="flex flex-wrap items-start gap-6 p-5 md:p-6">
            <div className="shrink-0 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
              <img src={imageSrc} alt={product.imageAlt ?? product.name} className="h-36 w-36 object-contain" />
            </div>

            <div className="min-w-0 flex-1">
              {!product.inStock && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                    Out of Stock
                  </span>
                </div>
              )}
              <h1 className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl lg:text-3xl">
                {product.genericName}
              </h1>
              {product.name && <p className="mt-0.5 text-sm text-slate-400">Brand Name: {product.name}</p>}
              {product.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{product.description}</p>
              )}
            </div>
          </div>
        </section>

        {/* Dosage selector + cart — client component, interactive only */}
        <Suspense fallback={<div className="rx-card h-32 animate-pulse bg-slate-50" />}>
          <ProductDosageCart productId={id} initialProduct={product} />
        </Suspense>

        {/* Full product description — server-rendered and kept in the HTML for SEO */}
        {product.fullDescription && (
          <section className="rx-card overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
                <span className="text-base font-bold text-slate-900">Product Description</span>
                <span className="text-xl leading-none text-slate-400 transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <div className="max-w-none px-5 py-5 prose prose-sm">
                {renderMarkdownContent(product.fullDescription)}
              </div>
            </details>
          </section>
        )}
      </div>
    </>
  )
}
