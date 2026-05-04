import type { Metadata } from 'next'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: 'GetUrPill Bitcoin Online Pharmacy | Terms & Conditions',
  description: 'Understand Bitcoin Online Pharmacy Terms & Conditions for website use, product orders, pricing policies, liability limits, and how disputes are handled',
  keywords: 'terms and conditions, Bitcoin Online Pharmacy, ',
}

export default function TermsConditionsPage() {
  const siteHost = new URL(siteInputs.home.schema.organization.url).host
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Terms And Conditions of Geturpill.com a Bitcoin Online Pharmacy </h1>

      <div className="space-y-6 text-slate-600">
        <p>
          Your use of <a href="/" target="_blank"> www.geturpill.com </a> indicates your acceptance of these Terms & Conditions. If you disagree with them, you should not continue using the website.
        </p>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">1. Use of the Website</h2>
          <p>
            Bitcoin Online Pharmacy is intended for legitimate use only. You are expected to interact with it responsibly and not engage in any activity that could harm, misuse, or interfere with other users or the platform itself.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">2. Products and Orders</h2>
          <p>
            Our product listings and services may change over time. We may remove, replace, or update items without prior notice. While we aim to present accurate information, details such as descriptions or availability may occasionally vary.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-slate-700">3. Pricing</h3>
          <p>
           Prices are displayed in USD and may be revised at any time. If an order is placed based on incorrect pricing due to technical or human error, we reserve the right to cancel or adjust that order.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-slate-700">4. Intellectual Property</h3>
          <p>
           All materials on this site belong to www.geturpill.com. They are protected by law and cannot be copied, reused, or distributed without permission.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-slate-700">5. Limitation of Liability</h3>
          <p>
            We are not responsible for losses that occur indirectly or as a side effect of using our website or products. In any case, our responsibility will not exceed the amount paid for the order in question.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-slate-700">6. Changes to Terms</h4>
          <p>
            These terms may be revised as our services evolve. By continuing to use the website after updates, you acknowledge and accept the revised terms.
          </p>
        </div>

        
      </div>
    </div>
  )
}


