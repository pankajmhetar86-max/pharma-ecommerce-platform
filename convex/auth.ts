import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth/minimal'
import { components } from './_generated/api'
import { query } from './_generated/server'
import type { DataModel } from './_generated/dataModel'
import authConfig from './auth.config'

const siteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL

if (!siteUrl) {
  throw new Error('Missing SITE_URL or NEXT_PUBLIC_APP_URL in Convex environment')
}

export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  })

export const { getAuthUser } = authComponent.clientApi()

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx)
  },
})
