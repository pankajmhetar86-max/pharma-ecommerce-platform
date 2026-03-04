import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import type { MutationCtx, QueryCtx } from './_generated/server'

type ConvexCtx = QueryCtx | MutationCtx

const getAuthenticatedUserId = async (ctx: ConvexCtx) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new Error('Not authenticated')
  }
  return identity.subject
}

export const listMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    return await ctx.db
      .query('orders')
      .withIndex('by_user_id_and_created_at', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
  },
})

export const getById = query({
  args: {
    orderId: v.id('orders'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx)
    const order = await ctx.db.get(args.orderId)
    if (!order || order.userId !== userId) {
      throw new Error('Order not found')
    }
    return order
  },
})

export const createFromCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx)
    const cart = await ctx.db
      .query('carts')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .unique()

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty')
    }

    const orderItems: Array<{
      productId: (typeof cart.items)[number]['productId']
      name: string
      genericName: string
      dosage: string
      quantity: number
      unitPrice: number
      unit: string
      lineTotal: number
      image: string
    }> = []

    for (const cartItem of cart.items) {
      const product = await ctx.db.get(cartItem.productId)
      if (!product || !product.inStock) {
        continue
      }
      if (!product.dosageOptions.includes(cartItem.dosage)) {
        continue
      }
      const lineTotal = Number((product.price * cartItem.quantity).toFixed(2))
      orderItems.push({
        productId: product._id,
        name: product.name,
        genericName: product.genericName,
        dosage: cartItem.dosage,
        quantity: cartItem.quantity,
        unitPrice: product.price,
        unit: product.unit,
        lineTotal,
        image: product.image,
      })
    }

    if (orderItems.length === 0) {
      throw new Error('No valid items found in cart')
    }

    const total = Number(orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2))
    const orderId = await ctx.db.insert('orders', {
      userId,
      items: orderItems,
      status: 'processing',
      total,
      createdAt: Date.now(),
    })

    await ctx.db.patch(cart._id, {
      items: [],
      total: 0,
      updatedAt: Date.now(),
    })

    return { orderId }
  },
})
