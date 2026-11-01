import { describe, expect, mock, test } from 'bun:test'

mock.module('../convex/auth', () => ({
  authComponent: { safeGetAuthUser: async (ctx) => ctx.testUser },
}))
const { deleteOrder, listDeletedOrders, getOrderPaymentProofUrl, getPaymentProofHistory } =
  await import('../convex/admin')

function context({ admin = true, signedIn = true, order = {}, insertFails = false } = {}) {
  const documents = new Map(order ? [['order-1', order]] : [])
  const events = []
  return {
    testUser: signedIn ? { _id: 'test-user', email: 'test@example.invalid' } : null,
    db: {
      query: (table) => ({
        withIndex: () => ({ unique: async () => (admin ? { role: 'admin' } : null) }),
        order: () => ({
          collect: async () =>
            [...documents.entries()]
              .filter(([id]) => table === 'deletedOrders' && id === 'archive-1')
              .map(([, record]) => record),
        }),
      }),
      get: async (id) => documents.get(id) ?? null,
      insert: async (table, data) => {
        if (insertFails) throw new Error('Archive unavailable')
        events.push(['insert', table])
        documents.set('archive-1', data)
        return 'archive-1'
      },
      delete: async (id) => {
        events.push(['delete', id])
        documents.delete(id)
      },
    },
    storage: {
      delete: async (id) => events.push(['delete-proof', id]),
      getUrl: async (id) => `https://storage.example/${id}`,
    },
    documents,
    events,
  }
}

describe('deleted orders', () => {
  test('rejects signed-out users and non-admin customers without changing data', async () => {
    for (const options of [{ signedIn: false }, { admin: false }]) {
      const ctx = context(options)
      await expect(deleteOrder._handler(ctx, { id: 'order-1' })).rejects.toThrow('Not authorized')
      expect(ctx.events).toEqual([])
    }
  })

  test('archives the full order and deletion metadata before removing the active record', async () => {
    const order = {
      _id: 'order-1',
      _creationTime: 100,
      userId: 'customer',
      createdAt: 100,
      total: 25,
      status: 'payment_review',
      items: [{ name: 'Medicine' }],
      billingAddress: { email: 'customer@example.invalid' },
      trackingNumber: 'tracking-1',
      paymentProofStorageId: 'proof-1',
      paymentProofHistory: [{ storageId: 'proof-2', uploadedAt: 100, decision: 'rejected', decidedAt: 200 }],
    }
    const ctx = context({ order })
    const before = Date.now()
    await deleteOrder._handler(ctx, { id: 'order-1' })
    expect(ctx.documents.has('order-1')).toBe(false)
    const archive = ctx.documents.get('archive-1')
    expect(archive.order).toEqual(order)
    expect(archive.deletedBy).toBe('test@example.invalid')
    expect(archive.deletedAt).toBeGreaterThanOrEqual(before)
    expect(ctx.events).toEqual([
      ['insert', 'deletedOrders'],
      ['delete', 'order-1'],
    ])
    expect(await getOrderPaymentProofUrl._handler(ctx, { id: 'archive-1' })).toBe('https://storage.example/proof-1')
    expect((await getPaymentProofHistory._handler(ctx, { id: 'archive-1' }))[0].url).toBe(
      'https://storage.example/proof-2',
    )
  })

  test('preserves the active order when creating the archive fails', async () => {
    const ctx = context({ insertFails: true })
    await expect(deleteOrder._handler(ctx, { id: 'order-1' })).rejects.toThrow('Archive unavailable')
    expect(ctx.documents.has('order-1')).toBe(true)
    expect(ctx.events).toEqual([])
  })

  test('supports orders without payment proofs', async () => {
    const ctx = context()
    await deleteOrder._handler(ctx, { id: 'order-1' })
    expect(await getOrderPaymentProofUrl._handler(ctx, { id: 'archive-1' })).toBeNull()
    expect(await getPaymentProofHistory._handler(ctx, { id: 'archive-1' })).toEqual([])
    expect(ctx.documents.get('archive-1').order).toEqual({})
  })

  test('does not create duplicate archives on repeated deletion', async () => {
    const ctx = context()
    await deleteOrder._handler(ctx, { id: 'order-1' })
    await expect(deleteOrder._handler(ctx, { id: 'order-1' })).rejects.toThrow('Order not found')
    expect(ctx.events.filter(([event]) => event === 'insert')).toHaveLength(1)
  })

  test('reports a missing order without changing data', async () => {
    const ctx = context({ order: null })
    await expect(deleteOrder._handler(ctx, { id: 'missing' })).rejects.toThrow('Order not found')
    expect(ctx.events).toEqual([])
  })

  test('allows admins to review archived orders', async () => {
    const ctx = context()
    await deleteOrder._handler(ctx, { id: 'order-1' })
    expect(await listDeletedOrders._handler(ctx, {})).toEqual([ctx.documents.get('archive-1')])
  })

  test('keeps deleted orders and payment proofs private to admins', async () => {
    for (const options of [{ signedIn: false }, { admin: false }]) {
      const ctx = context(options)
      expect(await listDeletedOrders._handler(ctx, {})).toBeNull()
      expect(await getOrderPaymentProofUrl._handler(ctx, { id: 'archive-1' })).toBeNull()
      expect(await getPaymentProofHistory._handler(ctx, { id: 'archive-1' })).toBeNull()
    }
  })

  test('continues serving active order payment proofs', async () => {
    const ctx = context({ order: { paymentProofStorageId: 'active-proof' } })
    expect(await getOrderPaymentProofUrl._handler(ctx, { id: 'order-1' })).toBe('https://storage.example/active-proof')
  })
})
