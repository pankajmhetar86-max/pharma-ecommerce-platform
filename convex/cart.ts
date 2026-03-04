import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'

type CartItem = Doc<'carts'>['items'][number]
type ConvexCtx = QueryCtx | MutationCtx

const getAuthenticatedUserId = async (ctx: ConvexCtx) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error('Not authenticated')
  }
  return identity.subject
}

const calculateCartTotal = async (ctx: MutationCtx, items: Array<CartItem>) => {
  let total = 0
  for (const item of items) {
    const product = await ctx.db.get(item.productId)
    if (!product) {
      continue
    }
    total += product.price * item.quantity
  }
  return Number(total.toFixed(2))
}

const getCartForUser = async (ctx: ConvexCtx, userId: string) => {
  return await ctx.db
    .query('carts')
    .withIndex('by_user_id', (q) => q.eq('userId', userId))
    .unique()
}

const findCartItemIndex = (items: Array<CartItem>, productId: Id<'products'>) => {
  return items.findIndex((item) => item.productId === productId)
}

export const getMyCart = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const cart = await getCartForUser(ctx, identity.subject)
    if (!cart) {
      return { items: [], total: 0 }
    }

    const hydratedItems: Array<{
      productId: Id<'products'>
      name: string
      genericName: string
      quantity: number
      image: string
      price: number
      unit: string
      lineTotal: number
      inStock: boolean
    }> = []

    for (const item of cart.items) {
      const product = await ctx.db.get(item.productId)
      if (!product) {
        continue
      }
      hydratedItems.push({
        productId: product._id,
        name: product.name,
        genericName: product.genericName,
        quantity: item.quantity,
        image: product.image,
        price: product.price,
        unit: product.unit,
        lineTotal: Number((product.price * item.quantity).toFixed(2)),
        inStock: product.inStock,
      })
    }

    const total = hydratedItems.reduce((acc, item) => acc + item.lineTotal, 0)

    return {
      items: hydratedItems,
      total: Number(total.toFixed(2)),
    }
  },
})

export const getItemCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return 0
    }
    const cart = await getCartForUser(ctx, identity.subject)
    if (!cart) {
      return 0
    }
    return cart.items.reduce((acc, item) => acc + item.quantity, 0)
  },
})

export const addItem = mutation({
  args: {
    productId: v.id('products'),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx)
    const quantity = Math.max(1, Math.min(args.quantity ?? 1, 99))

    const product = await ctx.db.get(args.productId)
    if (!product || !product.inStock) {
      throw new Error('Product is not available')
    }

    const cart = await getCartForUser(ctx, userId)
    const items = [...(cart?.items ?? [])]

    const existingItemIdx = findCartItemIndex(items, args.productId)
    if (existingItemIdx >= 0) {
      const existingItem = items[existingItemIdx]
      items[existingItemIdx] = {
        ...existingItem,
        quantity: Math.min(existingItem.quantity + quantity, 99),
      }
    } else {
      items.push({
        productId: args.productId,
        quantity,
      })
    }

    const total = await calculateCartTotal(ctx, items)
    const updatedAt = Date.now()

    if (cart) {
      await ctx.db.patch(cart._id, { items, total, updatedAt })
      return { cartId: cart._id }
    }

    const cartId = await ctx.db.insert('carts', {
      userId,
      items,
      total,
      updatedAt,
    })
    return { cartId }
  },
})

export const updateItemQuantity = mutation({
  args: {
    productId: v.id('products'),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx)
    const cart = await getCartForUser(ctx, userId)
    if (!cart) {
      throw new Error('Cart not found')
    }

    const items = [...cart.items]
    const itemIndex = findCartItemIndex(items, args.productId)
    if (itemIndex < 0) {
      throw new Error('Cart item not found')
    }

    if (args.quantity <= 0) {
      items.splice(itemIndex, 1)
    } else {
      items[itemIndex] = {
        ...items[itemIndex],
        quantity: Math.min(Math.max(args.quantity, 1), 99),
      }
    }

    const total = await calculateCartTotal(ctx, items)
    await ctx.db.patch(cart._id, { items, total, updatedAt: Date.now() })
    return { success: true }
  },
})

export const removeItem = mutation({
  args: {
    productId: v.id('products'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx)
    const cart = await getCartForUser(ctx, userId)
    if (!cart) {
      throw new Error('Cart not found')
    }

    const items = cart.items.filter((item) => item.productId !== args.productId)
    const total = await calculateCartTotal(ctx, items)
    await ctx.db.patch(cart._id, { items, total, updatedAt: Date.now() })
    return { success: true }
  },
})

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    const cart = await getCartForUser(ctx, userId)
    if (!cart) {
      return { success: true }
    }
    await ctx.db.patch(cart._id, {
      items: [],
      total: 0,
      updatedAt: Date.now(),
    })
    return { success: true }
  },
})
