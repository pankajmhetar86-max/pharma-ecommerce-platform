import Link from 'next/link'
import { RegisterForm } from '@/components/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-12">
      <div className="mx-auto mb-6 max-w-md text-center">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Back to store
        </Link>
      </div>
      <RegisterForm />
    </div>
  )
}
