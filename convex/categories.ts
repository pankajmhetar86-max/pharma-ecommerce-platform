import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query('categories').collect()
    return cats.sort((a, b) => a.name.localeCompare(b.name))
  },
})
