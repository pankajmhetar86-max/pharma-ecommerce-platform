import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Bitcoin Online Drug store selling drugs without prescription',
  description:
    'Get answers on ordering, Bitcoin payments, no prescription requirements, shipping, reshipment, and customer support for our online drug store services.',
  keywords: 'Bitcoin Online Drug store, Online Drug store selling drugs without prescription, online drug store services',
}

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Frequently Asked Questions</h1>

      <div className="space-y-6 text-slate-600">
        <div>
          <h2 className="mb-2 font-semibold text-slate-700">How do I place an order?</h2>
          <p>
            To place an order, click on Register to create your account and set a password. Once logged in, browse our product catalog, add your desired items to the cart, and proceed to checkout to complete your payment.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-semibold text-slate-700">What payment methods do you accept?</h2>
          <p>
            We currently accept Bitcoin (BTC) as our payment method, offering a secure and efficient transaction process.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-slate-700">How can I check my order status?</h3>
          <p>
            You can track your order by logging into your account and visiting the Order Status page. Additionally, you will receive email notifications at key stages, including order processing and shipment.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-slate-700">Do I need a prescription?</h3>
          <p>
            No, a prescription is not required to place an order on our platform.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-slate-700">How long does delivery take?</h3>
          <p>
            Delivery times vary based on your location and the shipping option selected at checkout. Standard delivery typically takes 7-14 business days.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-slate-700">What is your return policy?</h4>
          <p>
           We do not accept returns.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-slate-700">What is your reshipment policy?</h4>
          <p>
          Reshipment may be requested in the following cases:</p>
          <br/>
          <ul className="list-disc pl-5 space-y-2">
          <li>Damaged product received</li>
          <li>Incorrect product delivered</li>
          <li>Order not delivered</li>
          </ul>
          <br/>
          <p>For damaged or incorrect items, requests must be submitted within 24 hours of delivery, along with appropriate proof (such as photos).
          In cases of non-delivery, reshipment will be processed 14 days after the last tracking update, subject to review.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-slate-700">How do I contact customer support?</h4>
          <p>
            You can contact our support team through the Contact Us page on our website.
          </p>
        </div>
      </div>
    </div>
  )
}
