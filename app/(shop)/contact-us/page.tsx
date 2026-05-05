import type { Metadata } from 'next'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: 'Contact Us for ordering medicines at your doorstep',
  description: 'Contact geturpill.com if you wish to order medicines without prescription at your doorstep. Crypto Payment is available, fastest delivery, discreet packing. ',
  keywords: 'order medicines without prescription, ordering medicines at your doorstep, geturpill.com',
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
