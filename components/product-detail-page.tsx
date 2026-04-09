import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Doc } from '@/convex/_generated/dataModel'
import { toProductImagePath } from '@/lib/image-url'
import { renderMarkdownContent } from '@/lib/markdown'
import { formatPrice } from '@/lib/utils'
import { ProductPurchasePanel } from './product-purchase-panel'

type ProductDetailPageProps = {
  product: Doc<'products'>
  initialDosage?: string
}

function formatExpiryDate(expiryDate?: string) {
  if (!expiryDate) return null

  const expiry = new Date(`${expiryDate}T00:00:00`)
  if (Number.isNaN(expiry.valueOf())) {
    return expiryDate
  }

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(expiry)
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
            <img src={imageSrc} alt={product.imageAlt ?? product.name} className="h-36 w-36 object-contain" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {!product.inStock ? (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  Out of Stock
                </span>
              ) : null}
            </div>

            <h1 className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl lg:text-3xl">
              {product.genericName}
            </h1>
            {product.name ? <p className="mt-0.5 text-sm text-slate-400">Brand Name: {product.name}</p> : null}
            {product.description ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{product.description}</p>
            ) : null}
          </div>
        </div>
      </section>

      {product.pricingMatrix?.length ? (
        <section className="rx-card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">Available Packages</h2>
            <p className="mt-1 text-sm text-slate-500">
              All dosage and quantity options are rendered in the initial HTML.
            </p>
          </div>

          <div className="space-y-4 p-4">
            {product.pricingMatrix.map((dosage) => (
              <section key={dosage.dosage} className="rounded-xl border border-slate-100 bg-white p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{dosage.dosage}</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.16em] text-slate-400">
                        <th className="px-0 py-2 pr-4 font-semibold">Quantity</th>
                        <th className="px-0 py-2 pr-4 font-semibold">Price</th>
                        <th className="px-0 py-2 pr-4 font-semibold">Per Unit</th>
                        <th className="px-0 py-2 pr-4 font-semibold">Savings</th>
                        <th className="px-0 py-2 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dosage.packages.map((pkg) => {
                        const notes = [
                          formatExpiryDate(pkg.expiryDate) ? `Expiry: ${formatExpiryDate(pkg.expiryDate)}` : null,
                          pkg.benefits?.length ? pkg.benefits.join(' • ') : null,
                        ]
                          .filter(Boolean)
                          .join(' • ')

                        return (
                          <tr
                            key={`${dosage.dosage}-${pkg.pillCount}`}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td className="px-0 py-3 pr-4 font-semibold text-slate-900">
                              {pkg.pillCount} {product.unit}
                              {pkg.pillCount === 1 ? '' : 's'}
                            </td>
                            <td className="px-0 py-3 pr-4 text-slate-900">
                              {pkg.originalPrice > pkg.price ? (
                                <span className="mr-2 text-xs text-slate-400 line-through">
                                  {formatPrice(pkg.originalPrice)}
                                </span>
                              ) : null}
                              <span className="font-semibold">{formatPrice(pkg.price)}</span>
                            </td>
                            <td className="px-0 py-3 pr-4 text-slate-600">{formatPrice(pkg.price / pkg.pillCount)}</td>
                            <td className="px-0 py-3 pr-4 text-slate-600">
                              {pkg.originalPrice > pkg.price ? formatPrice(pkg.originalPrice - pkg.price) : '—'}
                            </td>
                            <td className="px-0 py-3 text-slate-600">{notes || '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rx-card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Order This Product</h2>
        </div>
        <div className="p-4">
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
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <h2 className="text-base font-bold text-slate-900">Product Description</h2>
          </div>
          <div className="px-5 py-5 prose prose-sm max-w-none">{renderMarkdownContent(product.fullDescription)}</div>
        </section>
      ) : null}
    </div>
  )
}
