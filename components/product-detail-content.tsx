'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'
import { ShoppingCart, Minus, Plus, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { authClient } from '@/lib/auth-client'
import { formatPrice } from '@/lib/utils'

type Product = NonNullable<FunctionReturnType<typeof api.products.getBySlugOrId>>

// ── Package row ────────────────────────────────────────────────────────────────

type PackageRowProps = {
  dosage: string
  pillCount: number
  originalPrice: number
  price: number
  benefits: string[]
  expiryDate?: string
  unit: string
  inStock: boolean
  onAddToCart: (dosage: string, pillCount: number) => void
  onIncreaseQuantity: (dosage: string, pillCount: number, quantity: number) => void
  onDecreaseQuantity: (dosage: string, pillCount: number, quantity: number) => void
  quantity: number
  updating: boolean
}

function PackageRow({
  dosage,
  pillCount,
  originalPrice,
  price,
  benefits,
  expiryDate,
  unit,
  inStock,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  quantity,
  updating,
}: PackageRowProps) {
  const perUnit = price / pillCount
  const savings = originalPrice - price
  const unitCountLabel = `${pillCount} ${unit}${pillCount === 1 ? '' : 's'}`
  const expiry = expiryDate ? new Date(`${expiryDate}T00:00:00`) : null
  const formattedExpiryDate =
    expiry && !Number.isNaN(expiry.valueOf())
      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(expiry)
      : expiryDate || null

  return (
    <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-teal-200 hover:bg-teal-50/30 md:grid-cols-[minmax(0,1fr)_minmax(70px,0.6fr)_minmax(200px,1.4fr)_140px] md:items-start">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Quantity</p>
        <p className="mt-1 text-sm font-semibold text-slate-900 md:mt-0">{unitCountLabel}</p>
        {formattedExpiryDate && <p className="mt-1 text-xs text-slate-500">Expiry: {formattedExpiryDate}</p>}
        {benefits.length > 0 && <p className="mt-1 text-xs text-teal-700">{benefits.join(' • ')}</p>}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Strength</p>
        <p className="mt-1 text-sm font-semibold text-slate-900 md:mt-0">{dosage}</p>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Price</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="inline-flex items-center gap-x-2">
            {originalPrice > price && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(originalPrice)}</span>
            )}
            <span className="text-lg font-extrabold text-slate-900">{formatPrice(price)}</span>
          </span>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {formatPrice(perUnit)} / {unit}
          </span>
          {savings > 0 && (
            <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 whitespace-nowrap">
              Save {formatPrice(savings)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 md:w-[140px] md:justify-self-end">
        {quantity > 0 ? (
          <div className="inline-flex items-center self-end rounded-full border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              disabled={updating || !inStock}
              onClick={() => onDecreaseQuantity(dosage, pillCount, quantity)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-l-full text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex min-w-10 items-center justify-center text-sm font-bold text-slate-900">
              {updating ? <Loader2 className="h-4 w-4 animate-spin text-teal-600" /> : quantity}
            </span>
            <button
              type="button"
              disabled={updating || !inStock}
              onClick={() => onIncreaseQuantity(dosage, pillCount, quantity)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-r-full text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={updating || !inStock}
            onClick={() => onAddToCart(dosage, pillCount)}
            className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 md:min-w-[112px]"
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Dosage + cart (interactive only) ─────────────────────────────────────────
// All static text (name, description, fullDescription) is rendered server-side
// in the page component so it is always present in the initial HTML for SEO.

export function ProductDosageCart({ productId, initialProduct }: { productId: string; initialProduct: Product }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = authClient.useSession()
  const cart = useQuery(api.cart.getMyCart)
  const addItem = useMutation(api.cart.addItem)
  const updateItemQuantity = useMutation(api.cart.updateItemQuantity)

  // Use live Convex query for real-time updates; fall back to server-fetched
  // initialProduct until the client subscription resolves.
  const productFromQuery = useQuery(api.products.getBySlugOrId, { identifier: productId })
  const product: Product =
    productFromQuery !== undefined && productFromQuery !== null ? productFromQuery : initialProduct

  const dosages = product.pricingMatrix?.map((d) => d.dosage) ?? product.dosageOptions ?? []
  const hasPricingMatrix = !!(product.pricingMatrix && product.pricingMatrix.length > 0)

  // Initialise to the first dosage so the correct packages render on first paint.
  const [selectedDosage, setSelectedDosage] = useState<string | null>(
    () => product.pricingMatrix?.[0]?.dosage ?? product.dosageOptions?.[0] ?? null,
  )
  const [selectedPillCount, setSelectedPillCount] = useState<number | null>(null)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null)

  useEffect(() => {
    const paramDosage = searchParams?.get('dosage')
    if (paramDosage && dosages.includes(paramDosage)) {
      setSelectedDosage(paramDosage)
    } else if (dosages.length > 0 && !selectedDosage) {
      setSelectedDosage(dosages[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  const getSelectionKey = (dosage?: string, pillCount?: number) => `${dosage ?? 'simple'}-${pillCount ?? ''}`
  const getSelectionQuantity = (dosage?: string, pillCount?: number) =>
    cart?.items.find((item) => item.productId === product._id && item.dosage === dosage && item.pillCount === pillCount)
      ?.quantity ?? 0

  const handleAddToCart = async (dosage?: string, pillCount?: number) => {
    if (!session?.user) {
      router.push(`/auth/login?next=/${product.slug ?? product._id}`)
      return
    }
    const key = getSelectionKey(dosage, pillCount)
    try {
      setUpdatingKey(key)
      await addItem({ productId: product._id, quantity: 1, dosage, pillCount })
    } finally {
      setUpdatingKey(null)
    }
  }

  const handleDecreaseQuantity = async (dosage?: string, pillCount?: number, quantity?: number) => {
    if (!quantity) return
    const key = getSelectionKey(dosage, pillCount)
    try {
      setUpdatingKey(key)
      await updateItemQuantity({ productId: product._id, quantity: quantity - 1, dosage, pillCount })
    } finally {
      setUpdatingKey(null)
    }
  }

  const handleIncreaseQuantity = async (dosage?: string, pillCount?: number) => {
    await handleAddToCart(dosage, pillCount)
  }

  if (dosages.length === 0) return null

  const selectedDosageData = product.pricingMatrix?.find((d) => d.dosage === selectedDosage)
  const packages = selectedDosageData?.packages ?? []
  const effectivePillCount = selectedPillCount ?? packages[0]?.pillCount ?? null
  const selectedPkg = packages.find((p) => p.pillCount === effectivePillCount) ?? packages[0] ?? null

  return (
    <section className="rx-card overflow-hidden">
      {/* Dosage selector */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Select Dosage</p>
        <div className="flex flex-wrap gap-2">
          {dosages.map((dosage) => (
            <button
              key={dosage}
              type="button"
              onClick={() => setSelectedDosage(dosage)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                selectedDosage === dosage
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {dosage}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4">
        {hasPricingMatrix && selectedDosageData && selectedPkg ? (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Select Quantity
              </label>
              <select
                value={effectivePillCount ?? ''}
                onChange={(e: { target: { value: string } }) => setSelectedPillCount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 sm:w-64"
              >
                {packages.map((pkg: { pillCount: number }) => (
                  <option key={pkg.pillCount} value={pkg.pillCount}>
                    {pkg.pillCount} {product.unit}
                    {pkg.pillCount === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(70px,0.6fr)_minmax(200px,1.4fr)_140px] gap-3 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 md:grid">
              <span className="text-left">Quantity</span>
              <span className="text-left">Strength</span>
              <span className="text-left">Price</span>
              <span className="justify-self-end text-right">Action</span>
            </div>
            <PackageRow
              dosage={selectedDosage!}
              pillCount={selectedPkg.pillCount}
              originalPrice={selectedPkg.originalPrice}
              price={selectedPkg.price}
              benefits={selectedPkg.benefits ?? []}
              expiryDate={selectedPkg.expiryDate}
              unit={product.unit}
              inStock={product.inStock}
              onAddToCart={(d, pc) => void handleAddToCart(d, pc)}
              onIncreaseQuantity={(d, pc) => void handleIncreaseQuantity(d, pc)}
              onDecreaseQuantity={(d, pc, quantity) => void handleDecreaseQuantity(d, pc, quantity)}
              quantity={getSelectionQuantity(selectedDosage ?? undefined, selectedPkg.pillCount)}
              updating={updatingKey === getSelectionKey(selectedDosage ?? undefined, selectedPkg.pillCount)}
            />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-sm font-semibold text-slate-500">Pricing not available for this dosage.</p>
            <p className="mt-1 text-xs text-slate-400">Please check back later or contact us for pricing.</p>
          </div>
        )}
      </div>
    </section>
  )
}
