import type { Metadata } from 'next'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: 'Contact Us | Pharma eCommerce Platform',
  description: 'Contact our support team for order help, product questions, and general assistance.',
  keywords: 'contact pharmacy, customer support, pharma help',
}

export default function ContactUsPage() {
  const { email, telephone } = siteInputs.home.schema.organization
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Contact Us</h1>

      <p className="mb-8 text-slate-600">
        Whether you are checking on an order, looking for product details, or need general assistance, we are here for you. We aim to respond within 24 hours on working days.
      </p>

      <div className="space-y-6 text-slate-600">
        <div>
          
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              Email:{' '}
              <a className="font-medium text-teal-700 underline underline-offset-2" href={`mailto:${email}`}>
                {email}
              </a>
            </li>
            
          </ul>
        </div>

        
        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Business Hours</h2>
          <p>Monday – Friday: 9:00 AM – 6:00 PM (GMT)</p>
          <p>Saturday – Sunday: Closed</p>
        </div>
      </div>
    </div>
  )
}
