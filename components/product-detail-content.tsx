'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { ChevronLeft, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { authClient } from '@/lib/auth-client'
import { formatPrice } from '@/lib/utils'
import { ProductGrid } from './product-grid'

export function ProductDetailContent({ productId }: { productId: string }) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const addItem = useMutation(api.cart.addItem)

  const product = useQuery(api.products.getById, {
    productId: productId as Id<'products'>,
  })
  const relatedProducts = useQuery(api.products.related, {
    productId: productId as Id<'products'>,
    limit: 4,
  })

  const [selectedDosage, setSelectedDosage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (product?.dosageOptions[0]) {
      setSelectedDosage(product.dosageOptions[0])
    }
  }, [product?.dosageOptions])

  const handleAddToCart = async () => {
    if (!selectedDosage || !product) {
      return
    }
    if (!session?.user) {
      router.push(`/auth/login?next=/products/${product._id}`)
      return
    }
    try {
      setIsSubmitting(true)
      await addItem({ productId: product._id, dosage: selectedDosage, quantity: 1 })
      router.push('/cart')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <p className="text-sm text-slate-500">Loading product...</p>
      </div>
    )
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">Product not found.</p>
          <Link
            href="/products"
            className="mt-3 inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <section className="pharma-card p-5 md:p-6">
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <div className="rounded-3xl bg-slate-50 p-6">
            <img src={product.image} alt={product.name} className="mx-auto h-56 w-56 object-contain" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                -{product.discount}%
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {product.category}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">{product.name}</h1>
            <p className="text-base text-slate-500">{product.genericName}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {formatPrice(product.price)}
              <span className="ml-1 text-base font-medium text-slate-500">per {product.unit}</span>
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{product.description}</p>

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-slate-700">Dosage options</p>
              <div className="flex flex-wrap gap-2">
                {product.dosageOptions.map((dosage) => (
                  <button
                    key={dosage}
                    type="button"
                    onClick={() => setSelectedDosage(dosage)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      selectedDosage === dosage
                        ? 'bg-sky-600 text-white'
                        : 'border border-slate-300 text-slate-700 hover:border-sky-300 hover:text-sky-700'
                    }`}
                  >
                    {dosage}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleAddToCart()}
              disabled={isSubmitting}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart className="h-4 w-4" />
              {isSubmitting ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">Related products</h2>
        <ProductGrid products={relatedProducts} />
      </section>
    </div>
  )
}
