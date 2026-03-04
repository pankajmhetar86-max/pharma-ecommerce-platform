import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import * as Sentry from '@sentry/tanstackstart-react'
import { Authenticated, useAction } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

const appRoute = getRouteApi('/_app')

function Home() {
  const { user, signInUrl } = appRoute.useLoaderData()
  const { data: myNumbers } = useQuery(
    convexQuery(api.myFunctions.listNumbers, {
      count: 10,
    }),
  )
  const getBillingOverview = useAction(api.billing.getBillingOverview)
  const consumeCreditsAction = useAction(api.billing.consumeCredits)
  const [isBillingLoading, setIsBillingLoading] = useState(false)
  const [billingOverview, setBillingOverview] = useState<{
    planName: string
    enabledFeatures: Array<string>
    credits: { included: number; used: number; left: number }
  } | null>(null)
  const [isConsumingCredits, setIsConsumingCredits] = useState(false)
  const [consumeFeedback, setConsumeFeedback] = useState<string | null>(null)
  const [billingError, setBillingError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setBillingOverview(null)
      return
    }

    let isMounted = true
    setIsBillingLoading(true)
    setBillingError(null)
    getBillingOverview({})
      .then((overview) => {
        if (isMounted) {
          setBillingOverview(overview)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setBillingError(`Failed to load billing data: ${String(error)}`)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsBillingLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [getBillingOverview, user])

  const triggerSentryTest = async () => {
    Sentry.metrics.count('test_counter', 1)

    await Sentry.startSpan(
      {
        name: 'Example Frontend Span',
        op: 'test',
      },
      async () => {
        const response = await fetch('/api/sentry-example')
        if (!response.ok) {
          throw new Error('Sentry Example Frontend Error')
        }
      },
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Yast</h1>
        <p className="mt-4 text-muted-foreground">
          A basic landing page for visitors. Sign in to continue to your workspace.
        </p>
        <a
          href={signInUrl}
          className="mt-8 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </a>
        <button
          type="button"
          onClick={triggerSentryTest}
          className="ml-3 mt-8 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          Break the world
        </button>
      </main>
    )
  }

  const consumeCredits = async () => {
    setConsumeFeedback(null)
    setIsConsumingCredits(true)
    try {
      const result = await consumeCreditsAction({ amount: 10 })
      setBillingOverview((current) =>
        current
          ? {
              ...current,
              credits: result.credits,
            }
          : current,
      )
      setConsumeFeedback('Consumed 10 credits successfully.')
    } catch (error) {
      setConsumeFeedback(`Failed to consume credits: ${String(error)}`)
    } finally {
      setIsConsumingCredits(false)
    }
  }

  return (
    <main className="space-y-4 p-4">
      <p>Authenticated as {user.email}</p>
      <Authenticated>
        <section className="rounded-md border p-4 space-y-3">
          <h2 className="font-semibold">Usage Overview</h2>
          {isBillingLoading ? (
            <p className="text-sm text-muted-foreground">Loading billing data...</p>
          ) : billingError ? (
            <p className="text-sm text-destructive">{billingError}</p>
          ) : (
            <>
              <p className="text-sm">
                Current plan: <span className="font-medium">{billingOverview?.planName ?? 'Free'}</span>
              </p>
              <p className="text-sm">
                Credits left: <span className="font-medium">{billingOverview?.credits.left ?? 0}</span>
                {(billingOverview?.credits.included ?? 0) > 0 ? (
                  <span className="text-muted-foreground"> / {billingOverview?.credits.included ?? 0}</span>
                ) : null}
              </p>
              <div>
                <p className="text-sm font-medium">Enabled features</p>
                {(billingOverview?.enabledFeatures.length ?? 0) > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {billingOverview?.enabledFeatures.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No additional features enabled.</p>
                )}
              </div>
              <button
                type="button"
                onClick={consumeCredits}
                disabled={isConsumingCredits}
                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {isConsumingCredits ? 'Consuming...' : 'Consume 10 credits'}
              </button>
              {consumeFeedback ? <p className="text-sm text-muted-foreground">{consumeFeedback}</p> : null}
            </>
          )}
        </section>
        <pre className="text-xs">{JSON.stringify(myNumbers, null, 2)}</pre>
        <button
          type="button"
          onClick={triggerSentryTest}
          className="mt-4 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          Break the world
        </button>
      </Authenticated>
    </main>
  )
}
