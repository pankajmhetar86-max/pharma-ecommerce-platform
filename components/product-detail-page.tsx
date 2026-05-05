import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Doc } from '@/convex/_generated/dataModel'
import { toProductImagePath } from '@/lib/image-url'
import { renderMarkdownContent } from '@/lib/markdown'
import { ProductPurchasePanel } from './product-purchase-panel'

type ProductDetailPageProps = {
  product: Doc<'products'>
  initialDosage?: string
}

export function ProductDetailPage({ product, initialDosage }: ProductDetailPageProps) {
  const imageSrc = toProductImagePath(product.slug ?? product._id, product.image)

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 lg:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors hover:text-teal-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      {product.category ? (
        <div>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
            {product.category}
          </span>
        </div>
      ) : null}

      <section className="rx-card overflow-hidden">
        <div className="flex flex-wrap items-start gap-6 p-5 md:p-6">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
            <img
              src={imageSrc}
              alt={product.imageAlt ?? product.name}
              title={product.imageTitle ?? product.imageAlt ?? product.name}
              className="h-36 w-36 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {!product.inStock ? (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  Out of Stock
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl lg:text-3xl">{product.genericName}</p>
            {product.name ? <p className="mt-0.5 text-sm text-slate-400">Brand Name: {product.name}</p> : null}
            {product.description ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{product.description}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rx-card overflow-hidden">
        <div className="p-4 md:p-5">
          <ProductPurchasePanel
            productId={product._id}
            productSlug={product.slug}
            unit={product.unit}
            inStock={product.inStock}
            dosageOptions={product.dosageOptions}
            pricingMatrix={product.pricingMatrix}
            initialDosage={initialDosage}
          />
        </div>
      </section>

      {product.fullDescription ? (
        <section className="rx-card overflow-hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Product Description</h2>
              <span className="text-xl leading-none text-slate-400 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="px-5 py-5 prose prose-sm max-w-none">{renderMarkdownContent(product.fullDescription)}</div>
          </details>
        </section>
      ) : null}
    </div>
  )
}
