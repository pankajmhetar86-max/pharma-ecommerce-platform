import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const cartItemValidator = v.object({
  productId: v.id('products'),
  dosage: v.string(),
  quantity: v.number(),
})

const orderItemValidator = v.object({
  productId: v.id('products'),
  name: v.string(),
  genericName: v.string(),
  dosage: v.string(),
  quantity: v.number(),
  unitPrice: v.number(),
  unit: v.string(),
  lineTotal: v.number(),
  image: v.string(),
})

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    icon: v.string(),
    sortOrder: v.optional(v.number()),
  }),

  products: defineTable({
    name: v.string(),
    genericName: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.number(),
    unit: v.string(),
    dosageOptions: v.array(v.string()),
    image: v.string(),
    discount: v.number(),
    inStock: v.boolean(),
    isBestseller: v.boolean(),
    isVisible: v.optional(v.boolean()), // undefined / true = visible, false = hidden from shop
    searchText: v.string(),
  })
    .index('by_category_and_name', ['category', 'name'])
    .index('by_category_and_is_bestseller_and_name', ['category', 'isBestseller', 'name'])
    .index('by_is_bestseller_and_name', ['isBestseller', 'name'])
    .searchIndex('search_products', {
      searchField: 'searchText',
      filterFields: ['category', 'isBestseller', 'inStock'],
    }),

  carts: defineTable({
    userId: v.string(),
    items: v.array(cartItemValidator),
    total: v.number(),
    updatedAt: v.number(),
  }).index('by_user_id', ['userId']),

  orders: defineTable({
    userId: v.string(),
    items: v.array(orderItemValidator),
    status: v.union(
      v.literal('pending'),
      v.literal('paid'),
      v.literal('processing'),
      v.literal('shipped'),
      v.literal('delivered'),
      v.literal('cancelled'),
    ),
    total: v.number(),
    createdAt: v.number(),
  }).index('by_user_id_and_created_at', ['userId', 'createdAt']),
})
