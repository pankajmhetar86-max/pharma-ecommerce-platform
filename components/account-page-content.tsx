'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { PackageCheck, ShoppingCart, User2 } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { authClient } from '@/lib/auth-client'

export function AccountPageContent() {
  const currentUser = useQuery(api.auth.getCurrentUser)
  const itemCount = useQuery(api.cart.getItemCount)
  const orders = useQuery(api.orders.listMyOrders)

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 lg:px-6">
      <section className="pharma-card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-2xl">Account Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your profile, cart, and order history.</p>
          </div>
          <button
            type="button"
            onClick={() => void authClient.signOut()}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <User2 className="h-5 w-5 text-sky-600" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{currentUser?.email ?? 'Loading...'}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ShoppingCart className="h-5 w-5 text-teal-600" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Cart items</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{itemCount ?? 0}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <PackageCheck className="h-5 w-5 text-emerald-600" />
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Orders</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{orders?.length ?? 0}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/cart"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-sky-200 hover:text-sky-700"
        >
          View cart
        </Link>
        <Link
          href="/orders"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-sky-200 hover:text-sky-700"
        >
          View orders
        </Link>
        <Link
          href="/checkout"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-sky-200 hover:text-sky-700"
        >
          Checkout
        </Link>
      </section>
    </div>
  )
}
