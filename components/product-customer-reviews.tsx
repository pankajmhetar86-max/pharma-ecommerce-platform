'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Doc } from '@/convex/_generated/dataModel'

export function ProductCustomerReviews({
  productName,
  reviews = [],
}: {
  productName: string
  reviews?: Doc<'products'>['customerReviews']
}) {
  const [index, setIndex] = useState(0)
  if (reviews.length === 0) return null
  const activeIndex = index % reviews.length
  const review = reviews[activeIndex]

  return (
    <section className="rounded-2xl bg-[#f0e9df] px-4 py-6 sm:px-6" aria-label={`Customer reviews on ${productName}`}>
      <h2 className="mb-5 text-center text-xl font-bold text-[#996337] md:text-2xl">
        Customer Reviews on {productName}
      </h2>
      <div className="flex items-center gap-2 sm:gap-4">
        {reviews.length > 1 && (
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => setIndex((activeIndex + reviews.length - 1) % reviews.length)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#885400] text-white hover:bg-[#684000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <figure
          className="min-w-0 flex-1 rounded-lg bg-white px-4 py-6 text-center sm:px-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="mb-2 flex justify-center gap-1" role="img" aria-label={`${review.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                aria-hidden="true"
                className={`h-5 w-5 ${star <= review.rating ? 'fill-[#b58050] text-[#b58050]' : 'text-slate-300'}`}
              />
            ))}
          </div>
          <figcaption className="font-semibold text-[#996337]">
            {review.name}
            {review.location ? `, ${review.location}` : ''}
          </figcaption>
          <blockquote className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-800 sm:text-base">
            {review.text}
          </blockquote>
          {reviews.length > 1 && (
            <p className="mt-4 text-xs text-slate-500">
              {activeIndex + 1} of {reviews.length}
            </p>
          )}
        </figure>
        {reviews.length > 1 && (
          <button
            type="button"
            aria-label="Next review"
            onClick={() => setIndex((activeIndex + 1) % reviews.length)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#885400] text-white hover:bg-[#684000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  )
}
