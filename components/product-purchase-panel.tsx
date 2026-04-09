'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { Loader2, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { authClient } from '@/lib/auth-client'
import { formatPrice } from '@/lib/utils'

type PricingPackage = {
  pillCount: number
  originalPrice: number
  price: number
  benefits?: string[]
  expiryDate?: string
}

type PricingMatrixEntry = {
  dosage: string
  packages: PricingPackage[]
}

type ProductPurchasePanelProps = {
  productId: Id<'products'>
  productSlug?: string
  unit: string
  inStock: boolean
  dosageOptions: string[]
  pricingMatrix?: PricingMatrixEntry[]
  initialDosage?: string
}

function getSelectionKey(dosage?: string, pillCount?: number) {
  return `${dosage ?? 'simple'}-${pillCount ?? ''}`
}

export function ProductPurchasePanel({
  productId,
  productSlug,
  unit,
  inStock,
  dosageOptions,
  pricingMatrix,
  initialDosage,
}: ProductPurchasePanelProps) {
  const { data: session } = authClient.useSession()
  const cart = useQuery(api.cart.getMyCart)
  const addItem = useMutation(api.cart.addItem)
  const updateItemQuantity = useMutation(api.cart.updateItemQuantity)

  const dosages = pricingMatrix?.map((entry) => entry.dosage) ?? dosageOptions
  const defaultDosage = useMemo(() => {
    if (initialDosage && dosages.includes(initialDosage)) {
      return initialDosage
    }
    return dosages[0] ?? null
  }, [dosages, initialDosage])

  const [selectedDosage, setSelectedDosage] = useState<string | null>(defaultDosage)
  const [selectedPillCount, setSelectedPillCount] = useState<number | null>(null)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null)

  useEffect(() => {
    setSelectedDosage(defaultDosage)
  }, [defaultDosage])

  const selectedDosageData = pricingMatrix?.find((entry) => entry.dosage === selectedDosage)
  const packages = selectedDosageData?.packages ?? []

  useEffect(() => {
    if (packages.length === 0) {
      setSelectedPillCount(null)
      return
    }

    if (selectedPillCount && packages.some((pkg) => pkg.pillCount === selectedPillCount)) {
      return
    }

    setSelectedPillCount(packages[0].pillCount)
  }, [packages, selectedPillCount])

  const selectedPkg = packages.find((pkg) => pkg.pillCount === selectedPillCount) ?? packages[0] ?? null

  const getSelectionQuantity = (dosage?: string, pillCount?: number) =>
    cart?.items.find((item) => item.productId === productId && item.dosage === dosage && item.pillCount === pillCount)
      ?.quantity ?? 0

  const handleAddToCart = async (dosage?: string, pillCount?: number) => {
    if (!session?.user) {
      return
    }

    const key = getSelectionKey(dosage, pillCount)
    try {
      setUpdatingKey(key)
      await addItem({ productId, quantity: 1, dosage, pillCount })
    } finally {
      setUpdatingKey(null)
    }
  }

  const handleDecreaseQuantity = async (dosage?: string, pillCount?: number, quantity?: number) => {
    if (!quantity) return

    const key = getSelectionKey(dosage, pillCount)
    try {
      setUpdatingKey(key)
      await updateItemQuantity({
        productId,
        quantity: quantity - 1,
        dosage,
        pillCount,
      })
    } finally {
      setUpdatingKey(null)
    }
  }

  const handleIncreaseQuantity = async (dosage?: string, pillCount?: number) => {
    await handleAddToCart(dosage, pillCount)
  }

  if (!pricingMatrix?.length || !selectedDosageData || !selectedPkg) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
        <p className="text-sm font-semibold text-slate-500">Pricing not available for this dosage.</p>
        <p className="mt-1 text-xs text-slate-400">Please check back later or contact us for pricing.</p>
      </div>
    )
  }

  const quantity = getSelectionQuantity(selectedDosage ?? undefined, selectedPkg.pillCount)
  const perUnit = selectedPkg.price / selectedPkg.pillCount
  const savings = selectedPkg.originalPrice - selectedPkg.price
  const selectionKey = getSelectionKey(selectedDosage ?? undefined, selectedPkg.pillCount)

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Select Dosage
        </label>
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

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Select Quantity
        </label>
        <select
          value={selectedPkg.pillCount}
          onChange={(event) => setSelectedPillCount(Number(event.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 sm:w-64"
        >
          {packages.map((pkg) => (
            <option key={pkg.pillCount} value={pkg.pillCount}>
              {pkg.pillCount} {unit}
              {pkg.pillCount === 1 ? '' : 's'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-[minmax(0,1fr)_minmax(70px,0.6fr)_minmax(200px,1.4fr)_140px] md:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Quantity</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 md:mt-0">
            {selectedPkg.pillCount} {unit}
            {selectedPkg.pillCount === 1 ? '' : 's'}
          </p>
          {selectedPkg.expiryDate ? (
            <p className="mt-1 text-xs text-slate-500">Expiry: {selectedPkg.expiryDate}</p>
          ) : null}
          {selectedPkg.benefits?.length ? (
            <p className="mt-1 text-xs text-teal-700">{selectedPkg.benefits.join(' • ')}</p>
          ) : null}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Strength</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 md:mt-0">{selectedDosage}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:hidden">Price</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {selectedPkg.originalPrice > selectedPkg.price ? (
              <span className="text-xs text-slate-400 line-through">{formatPrice(selectedPkg.originalPrice)}</span>
            ) : null}
            <span className="text-lg font-extrabold text-slate-900">{formatPrice(selectedPkg.price)}</span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {formatPrice(perUnit)} / {unit}
            </span>
            {savings > 0 ? (
              <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 whitespace-nowrap">
                Save {formatPrice(savings)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 md:w-[140px] md:justify-self-end">
          {!inStock ? (
            <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-600">
              Out of Stock
            </div>
          ) : quantity > 0 ? (
            <div className="inline-flex items-center self-end rounded-full border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                disabled={updatingKey === selectionKey}
                onClick={() =>
                  void handleDecreaseQuantity(selectedDosage ?? undefined, selectedPkg.pillCount, quantity)
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-l-full text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex min-w-10 items-center justify-center text-sm font-bold text-slate-900">
                {updatingKey === selectionKey ? <Loader2 className="h-4 w-4 animate-spin text-teal-600" /> : quantity}
              </span>
              <button
                type="button"
                disabled={updatingKey === selectionKey}
                onClick={() => void handleIncreaseQuantity(selectedDosage ?? undefined, selectedPkg.pillCount)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-r-full text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : session?.user ? (
            <button
              type="button"
              disabled={updatingKey === selectionKey}
              onClick={() => void handleAddToCart(selectedDosage ?? undefined, selectedPkg.pillCount)}
              className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 md:min-w-[112px]"
            >
              {updatingKey === selectionKey ? (
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
          ) : (
            <Link
              href={`/auth/login?next=/${productSlug ?? productId}`}
              className="inline-flex items-center justify-center self-end rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-500 hover:to-cyan-500 md:min-w-[112px]"
            >
              Sign in to buy
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
