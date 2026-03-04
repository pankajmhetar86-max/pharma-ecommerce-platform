import type { Doc } from '@/convex/_generated/dataModel'
import { ProductCard } from './product-card'

export function ProductGrid({ products }: { products: Array<Doc<'products'>> | undefined }) {
  if (products === undefined) {
    return <p className="text-sm text-slate-500">Loading products...</p>
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No products match this filter.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
