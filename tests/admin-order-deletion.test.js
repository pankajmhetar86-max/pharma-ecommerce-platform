import { describe, expect, mock, test } from 'bun:test'

mock.module('../convex/auth', () => ({
  authComponent: { safeGetAuthUser: async (ctx) => ctx.testUser },
}))
const { deleteOrder } = await import('../convex/admin')

function context({ admin = true, signedIn = true, order = {} } = {}) {
  const removed = []
  return {
    testUser: signedIn ? { _id: 'test-user', email: 'test@example.invalid' } : null,
    db: {
      query: () => ({ withIndex: () => ({ unique: async () => (admin ? { role: 'admin' } : null) }) }),
      get: async () => order,
      delete: async (id) => removed.push(['order', id]),
    },
    storage: { delete: async (id) => removed.push(['proof', id]) },
    removed,
  }
}

describe('admin order deletion', () => {
  test('rejects signed-out users and non-admin customers without deleting data', async () => {
    for (const options of [{ signedIn: false }, { admin: false }]) {
      const ctx = context(options)
      await expect(deleteOrder._handler(ctx, { id: 'order-1' })).rejects.toThrow('Not authorized')
      expect(ctx.removed).toEqual([])
    }
  })

  test('deletes the order and all unique current and historical payment proofs', async () => {
    const ctx = context({
      order: {
        paymentProofStorageId: 'proof-1',
        paymentProofHistory: [{ storageId: 'proof-1' }, { storageId: 'proof-2' }],
      },
    })
    await deleteOrder._handler(ctx, { id: 'order-1' })
    expect(ctx.removed).toEqual([
      ['proof', 'proof-1'],
      ['proof', 'proof-2'],
      ['order', 'order-1'],
    ])
  })

  test('supports orders without payment proofs', async () => {
    const ctx = context()
    await deleteOrder._handler(ctx, { id: 'order-1' })
    expect(ctx.removed).toEqual([['order', 'order-1']])
  })

  test('reports a missing order without deleting files', async () => {
    const ctx = context({ order: null })
    await expect(deleteOrder._handler(ctx, { id: 'missing' })).rejects.toThrow('Order not found')
    expect(ctx.removed).toEqual([])
  })
})
