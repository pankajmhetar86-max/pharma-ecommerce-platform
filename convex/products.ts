import { query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'

export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    bestsellerOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 24, 100))
    const search = args.search?.trim()
    const category = args.category?.trim()
    const onlyBestsellers = args.bestsellerOnly ?? false

    let products: Array<Doc<'products'>> = []

    if (search && search.length > 0) {
      products = await ctx.db
        .query('products')
        .withSearchIndex('search_products', (q) => {
          let searchQuery = q.search('searchText', search)
          if (category && category !== 'Bestsellers') {
            searchQuery = searchQuery.eq('category', category)
          }
          if (onlyBestsellers || category === 'Bestsellers') {
            searchQuery = searchQuery.eq('isBestseller', true)
          }
          return searchQuery
        })
        .take(limit)
      return products
    }

    if (category && category !== 'Bestsellers' && onlyBestsellers) {
      products = await ctx.db
        .query('products')
        .withIndex('by_category_and_is_bestseller_and_name', (q) => q.eq('category', category).eq('isBestseller', true))
        .take(limit)
      return products
    }

    if (category && category !== 'Bestsellers') {
      products = await ctx.db
        .query('products')
        .withIndex('by_category_and_name', (q) => q.eq('category', category))
        .take(limit)
      return products
    }

    if (onlyBestsellers || category === 'Bestsellers') {
      products = await ctx.db
        .query('products')
        .withIndex('by_is_bestseller_and_name', (q) => q.eq('isBestseller', true))
        .take(limit)
      return products
    }

    products = await ctx.db.query('products').order('desc').take(limit)
    return products
  },
})

export const getById = query({
  args: {
    productId: v.id('products'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId)
  },
})

export const related = query({
  args: {
    productId: v.id('products'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId)
    if (!product) {
      return []
    }

    const relatedLimit = Math.max(1, Math.min(args.limit ?? 4, 12))
    const relatedProducts = await ctx.db
      .query('products')
      .withIndex('by_category_and_name', (q) => q.eq('category', product.category))
      .take(relatedLimit + 1)

    return relatedProducts.filter((item) => item._id !== product._id).slice(0, relatedLimit)
  },
})
