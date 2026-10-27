import { v } from 'convex/values'

export const customerReviewsValidator = v.array(
  v.object({
    name: v.string(),
    location: v.string(),
    rating: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    text: v.string(),
  }),
)

export function normalizeCustomerReviews(
  reviews: { name: string; location: string; rating: 1 | 2 | 3 | 4 | 5; text: string }[] = [],
) {
  return reviews.map((review) => {
    const name = review.name.trim()
    const text = review.text.trim()
    if (!name || !text) throw new Error('Each customer review needs a name and review text.')
    return { ...review, name, text, location: review.location.trim() }
  })
}
