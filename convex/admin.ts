import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { authComponent } from './auth'

// Checks that the current user's email matches the ADMIN_EMAIL env var set in Convex dashboard.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAdminUser(ctx: any) {
  const user = await authComponent.safeGetAuthUser(ctx)
  if (!user) return null
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const email = (user as any).email as string | undefined
  if (!email || email !== adminEmail) return null
  return user
}

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAdminUser(ctx)
    return user !== null
  },
})

export const listAllProducts = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) return null
    const search = args.search?.trim()
    if (search) {
      return ctx.db
        .query('products')
        .withSearchIndex('search_products', (q) => q.search('searchText', search))
        .take(100)
    }
    return ctx.db.query('products').order('desc').collect()
  },
})

export const createProduct = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    const searchText = `${args.name} ${args.genericName} ${args.category} ${args.description}`.toLowerCase()
    return ctx.db.insert('products', { ...args, searchText })
  },
})

export const updateProduct = mutation({
  args: {
    id: v.id('products'),
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
  },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    const { id, ...fields } = args
    const searchText = `${fields.name} ${fields.genericName} ${fields.category} ${fields.description}`.toLowerCase()
    await ctx.db.patch(id, { ...fields, searchText })
  },
})

export const deleteProduct = mutation({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    await ctx.db.delete(args.id)
  },
})

export const toggleStock = mutation({
  args: { id: v.id('products'), inStock: v.boolean() },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    await ctx.db.patch(args.id, { inStock: args.inStock })
  },
})

export const toggleBestseller = mutation({
  args: { id: v.id('products'), isBestseller: v.boolean() },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    await ctx.db.patch(args.id, { isBestseller: args.isBestseller })
  },
})

export const toggleVisibility = mutation({
  args: { id: v.id('products'), isVisible: v.boolean() },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    await ctx.db.patch(args.id, { isVisible: args.isVisible })
  },
})

// ── Categories ────────────────────────────────────────────────────────────────

export const listAdminCategories = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdminUser(ctx)
    if (!admin) return null
    const cats = await ctx.db.query('categories').collect()
    return cats.sort((a, b) => a.name.localeCompare(b.name))
  },
})

export const createCategory = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    return ctx.db.insert('categories', { name: args.name.trim(), icon: 'pill' })
  },
})

export const updateCategory = mutation({
  args: { id: v.id('categories'), name: v.string() },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    await ctx.db.patch(args.id, { name: args.name.trim() })
  },
})

export const deleteCategory = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    await ctx.db.delete(args.id)
  },
})

// ── File storage ──────────────────────────────────────────────────────────────
// File storage — generates a short-lived signed URL for the client to POST an image to
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    return ctx.storage.generateUploadUrl()
  },
})

// After upload, resolves the storageId into a permanent CDN URL
export const getUploadedImageUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const admin = await getAdminUser(ctx)
    if (!admin) throw new Error('Not authorized')
    return ctx.storage.getUrl(args.storageId as Id<'_storage'>)
  },
})
