import Link from 'next/link'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-12">
      <div className="mx-auto mb-6 max-w-md text-center">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Back to store
        </Link>
      </div>
      <LoginForm />
    </div>
  )
}
