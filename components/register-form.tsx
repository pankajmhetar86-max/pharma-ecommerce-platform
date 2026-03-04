'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function RegisterForm() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onRequest: () => {
          setIsSubmitting(true)
        },
        onSuccess: () => {
          setIsSubmitting(false)
          router.push('/')
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
      <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-500">Register to manage prescriptions and checkout securely.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-slate-700">Full name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
          />
        </label>

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
            minLength={8}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-sky-200 focus:border-sky-300 focus:ring-2"
          />
        </label>

        {errorMessage && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-sky-700 hover:underline">
          Login
        </Link>
      </p>
    </section>
  )
}
