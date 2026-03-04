'use client'

import { FormEvent, useState } from 'react'
import { useAction, useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { formatPrice } from '@/lib/utils'

export function CheckoutPageContent() {
  const router = useRouter()
  const cart = useQuery(api.cart.getMyCart)
  const createOrder = useMutation(api.orders.createFromCart)
  const createPendingCryptoOrder = useMutation(api.orders.createPendingCryptoOrder)
  const createNowPaymentsInvoice = useAction(api.orders.createNowPaymentsInvoice)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCryptoSubmitting, setIsCryptoSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    if (!cart || cart.items.length === 0) {
      setErrorMessage('Your cart is empty.')
      return
    }
    try {
      setIsSubmitting(true)
      await createOrder({})
      router.push('/orders')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to place order.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCryptoCheckout = async () => {
    setErrorMessage(null)
    if (!cart || cart.items.length === 0) {
      setErrorMessage('Your cart is empty.')
      return
    }
    try {
      setIsCryptoSubmitting(true)
      const { orderId, total } = await createPendingCryptoOrder({})
      const { invoiceUrl } = await createNowPaymentsInvoice({ orderId, total })
      window.location.href = invoiceUrl
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initiate crypto payment.')
      setIsCryptoSubmitting(false)
    }
  }

  if (cart === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <p className="text-sm text-slate-500">Loading checkout...</p>
      </div>
    )
  }

  const cartEmpty = !cart || cart.items.length === 0

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[1fr_320px] lg:px-6">
      <section className="pharma-card p-5 md:p-6">
        <h1 className="text-3xl font-bold text-slate-900 md:text-2xl">Secure Checkout</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in your delivery details and choose how you'd like to pay.
        </p>

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
              />
            </label>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Delivery address</span>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
            />
          </label>

          {errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isCryptoSubmitting || cartEmpty}
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Processing...' : 'Place order'}
            </button>

            <button
              type="button"
              onClick={() => void handleCryptoCheckout()}
              disabled={isSubmitting || isCryptoSubmitting || cartEmpty}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCryptoSubmitting ? (
                'Redirecting...'
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                  </svg>
                  Pay with Crypto
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <aside className="pharma-card h-fit p-5">
        <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
        <ul className="mt-4 space-y-2">
          {cart?.items.map((item) => (
            <li key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-slate-900">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-slate-200 pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900">{formatPrice(cart?.total ?? 0)}</span>
          </div>
        </div>
      </aside>
    </div>
  )
}
