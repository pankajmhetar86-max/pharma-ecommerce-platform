'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { formatPrice } from '@/lib/utils'

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp)
}

export function OrdersPageContent() {
  const orders = useQuery(api.orders.listMyOrders)

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 lg:px-6">
      <h1 className="text-3xl font-bold text-slate-900 md:text-2xl">Order History</h1>

      {orders === undefined ? (
        <p className="text-sm text-slate-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">No orders yet.</p>
          <Link
            href="/products"
            className="mt-3 inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order._id} className="pharma-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {order.paymentMethod === 'crypto' && (
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      Crypto
                    </span>
                  )}
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold capitalize text-sky-700">
                    {order.status === 'pending_payment' ? 'Pending Payment' : order.status}
                  </span>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center justify-between">
                    <span className="text-slate-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-900">{formatPrice(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-slate-200 pt-3 text-right text-lg font-bold text-slate-900">
                {formatPrice(order.total)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
