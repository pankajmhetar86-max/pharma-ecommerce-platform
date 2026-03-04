import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs'

type AuthBridge = ReturnType<typeof convexBetterAuthNextJs>
type AuthMethod = 'preloadAuthQuery' | 'fetchAuthQuery' | 'fetchAuthMutation' | 'fetchAuthAction'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL

const authConfigError =
  !convexUrl || !convexSiteUrl ? 'Missing NEXT_PUBLIC_CONVEX_URL or NEXT_PUBLIC_CONVEX_SITE_URL in runtime env.' : null

let authBridge: AuthBridge | null = null

function getAuthBridge(): AuthBridge | null {
  if (!convexUrl || !convexSiteUrl) {
    return null
  }
  if (!authBridge) {
    authBridge = convexBetterAuthNextJs({
      convexUrl: convexUrl,
      convexSiteUrl: convexSiteUrl,
    })
  }
  return authBridge
}

function logAuthServerWarning(context: string, error?: unknown) {
  // Keep SSR alive in production even if auth backend is temporarily unavailable.
  console.error(`[auth-server] ${context}`, error ?? authConfigError ?? 'Unknown auth error')
}

export const handler: AuthBridge['handler'] = {
  GET: async (request) => {
    const bridge = getAuthBridge()
    if (!bridge) {
      logAuthServerWarning('Auth route requested but auth env is not configured.')
      return new Response('Auth server is not configured.', { status: 503 })
    }
    try {
      return await bridge.handler.GET(request)
    } catch (error) {
      logAuthServerWarning('Auth GET proxy failed.', error)
      return new Response('Auth service temporarily unavailable.', { status: 503 })
    }
  },
  POST: async (request) => {
    const bridge = getAuthBridge()
    if (!bridge) {
      logAuthServerWarning('Auth route requested but auth env is not configured.')
      return new Response('Auth server is not configured.', { status: 503 })
    }
    try {
      return await bridge.handler.POST(request)
    } catch (error) {
      logAuthServerWarning('Auth POST proxy failed.', error)
      return new Response('Auth service temporarily unavailable.', { status: 503 })
    }
  },
}

export const getToken: AuthBridge['getToken'] = async () => {
  const bridge = getAuthBridge()
  if (!bridge) {
    logAuthServerWarning('getToken called with missing auth env.')
    return undefined
  }
  try {
    return await bridge.getToken()
  } catch (error) {
    logAuthServerWarning('getToken failed.', error)
    return undefined
  }
}

export const isAuthenticated: AuthBridge['isAuthenticated'] = async () => {
  const token = await getToken()
  return !!token
}

async function callAuthMethod(method: AuthMethod, args: unknown[]) {
  const bridge = getAuthBridge()
  if (!bridge) {
    throw new Error(authConfigError ?? 'Auth service is not configured.')
  }
  const fn = bridge[method] as unknown as (...params: unknown[]) => Promise<unknown>
  return await fn(...args)
}

export const preloadAuthQuery = ((...args: unknown[]) =>
  callAuthMethod('preloadAuthQuery', args)) as AuthBridge['preloadAuthQuery']

export const fetchAuthQuery = ((...args: unknown[]) =>
  callAuthMethod('fetchAuthQuery', args)) as AuthBridge['fetchAuthQuery']

export const fetchAuthMutation = ((...args: unknown[]) =>
  callAuthMethod('fetchAuthMutation', args)) as AuthBridge['fetchAuthMutation']

export const fetchAuthAction = ((...args: unknown[]) =>
  callAuthMethod('fetchAuthAction', args)) as AuthBridge['fetchAuthAction']
