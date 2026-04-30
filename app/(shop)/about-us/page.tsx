import type { Metadata } from 'next'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: 'Geturpill | Trusted Online Drugstore, No prescription Required',
  description:
    'Get to know our online Drugstore, our mission, and how we ensure secure ordering, discreet shipping, Bitcoin payments, and no prescription needed',
  keywords: 'geturpill online pharmacy, bitcoin online pharmacy, trusted Online Drugstore',
}

export default function AboutUsPage() {
  const siteHost = new URL(siteInputs.home.schema.organization.url).host
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Geturpill.com An Online Drug Store</h1>

      <div className="space-y-5 text-slate-600">
        <p>
        Welcome to www.geturpill.com, an online platform focused on making access to pharmaceutical products simpler, more transparent, and dependable.
        </p>

        <p>
        We work with verified suppliers and follow a structured screening process before listing any product on our platform. Each item is checked for authenticity, proper storage conditions, and compliance with applicable standards, so customers know exactly what they are receiving.
        </p>

        <p>
        Over the years, we have built a growing customer base around the world by focusing on consistency timely dispatch, clear communication, and responsible handling of sensitive orders. We understand that purchasing medications online requires trust, and we aim to earn that trust through reliability rather than claims.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-700">Our Mission</h2>
        <p>
        To simplify access to essential medications from our trusted online drugstore by combining verified sourcing, straightforward pricing, and a secure digital purchasing experience.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-700">Why Choose Geturpill.com?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Products sourced through screened and verified distribution channels </li>
          <li>Transparent ordering process with clear product information </li>
          <li>Privacy-focused packaging and shipment handling </li>
          <li>Support team available to assist with order-related queries </li>
          <li>Ongoing monitoring of product quality and supplier reliability</li>
        </ul>
      </div>
    </div>
  )
}
