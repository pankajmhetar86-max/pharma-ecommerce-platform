'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setIsSubmitting(true)
        },
        onSuccess: () => {
          setIsSubmitting(false)
          router.push(nextPath as Route)
        },
        onError: (ctx) => {
          setIsSubmitting(false)
          setErrorMessage(ctx.error.message)
        },
      },
    )
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-500">Access your account to manage cart and orders.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
          />
        </label>

        {errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        New here?{' '}
        <Link href="/auth/register" className="font-semibold text-sky-700 hover:underline">
          Create account
        </Link>
      </p>
    </section>
  )
}
