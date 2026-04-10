'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  useEffect(() => {
    if (countdown === 0) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-6xl font-bold text-teal-600">404</p>
        <p className="mt-3 text-lg font-semibold text-slate-700">Page not found</p>
        <p className="mt-1 text-sm text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-sm text-slate-500">
            Redirecting to home page in <span className="font-bold text-teal-600 tabular-nums">{countdown}</span> second
            {countdown !== 1 ? 's' : ''}…
          </p>

          <div className="flex gap-1">
            {[5, 4, 3, 2, 1].map((n) => (
              <span
                key={n}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  countdown >= n ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-300 line-through'
                }`}
              >
                {n}
              </span>
            ))}
          </div>

          <Link
            href="/"
            className="mt-2 inline-flex items-center rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
          >
            Go home now
          </Link>
        </div>
      </div>
    </div>
  )
}
