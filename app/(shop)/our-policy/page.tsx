import type { Metadata } from 'next'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: 'Geturpill | Online drug store policies, Bitcoin Pharmacy',
  description:
    'Explore our online drug store policies on ordering, Bitcoin payments, shipping, reshipment terms, privacy practices, and compliance guidelines.',
  keywords: 'online drug store policies, Bitcoin pharmacy policy, shipping policy, privacy policy',
}

export default function OurPolicyPage() {
  const siteHost = new URL(siteInputs.home.schema.organization.url).host
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Geturpill - Policy</h1>

      <div className="space-y-6 text-slate-600">
        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Ordering Policy from Online Drug Store</h2>
          <p>
            All orders placed through www.geturpill.com are subject to product availability and order confirmation. We reserve the right to decline or cancel any order at our discretion, including cases involving incomplete or inaccurate information. Customers are responsible for providing correct shipping details to ensure successful delivery.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Payment Policy</h2>
          <p>
            We currently accept Bitcoin (BTC) as our primary payment method. Orders are processed only after the transaction has been confirmed on the blockchain network. For security reasons, we do not store or retain any payment related credentials on our systems.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Shipping Policy</h2>
          <p>
            We offer worldwide shipping using discreet packaging and trackable delivery services. Estimated delivery times may vary depending on the destination and local logistics conditions. While we ensure timely dispatch, delays caused by courier or postal services are beyond our control and cannot be guaranteed against.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Returns & Reshipment Policy</h2>
          <p>
            Due to the sensitive nature of pharmaceutical products, returns are not accepted. However, in cases where items are damaged or incorrect, customers may request a reshipment.
          To be eligible:
          <ul className="list-disc pl-5 space-y-2">
          <li>Requests must be submitted within 24 hours of delivery</li>
          <li>Clear photographic evidence must be provided</li>
          </ul>
          If a shipment is delayed or shows no movement, a reshipment may be initiated 15 days after the last tracking update, subject to review.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Privacy Policy</h2>
          <p>
            We are committed to safeguarding customer privacy. Any personal information collected during the ordering process is used strictly for order fulfillment and communication purposes. We do not sell, share, or distribute customer data to third parties.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">Compliance</h2>
          <p>
            Customers are responsible for understanding and complying with the laws and regulations applicable to their location before placing an order. We do not assume responsibility for orders that may be restricted or prohibited in specific jurisdictions.
          </p>
        </div>
      </div>
    </div>
  )
}
