import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ExternalLinkIcon, Loader2 } from 'lucide-react'
import { useCustomer } from 'autumn-js/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
})

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function BillingPage() {
  const { customer, isLoading, openBillingPortal, cancel, refetch } = useCustomer({
    expand: ['invoices'],
    errorOnNotFound: false,
  })
  const [cancelProductId, setCancelProductId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center p-6">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (!customer) {
    return (
      <main className="space-y-6 p-6">
        <p className="text-muted-foreground">Unable to load billing information.</p>
      </main>
    )
  }

  const activeProduct =
    customer.products.find((p) => p.status === 'active' && !p.is_add_on) ??
    customer.products.find((p) => p.status === 'trialing' && !p.is_add_on) ??
    customer.products.find((p) => !p.is_add_on)

  const features = customer.features
  const creditsFeature = features['credits']
  const seatsFeature = features['seats']
  const customerWithInvoices = customer as {
    invoices?: Array<{
      created_at: number
      total: number
      currency: string
      status: string
      hosted_invoice_url: string
    }>
  }
  const invoices: Array<{
    created_at: number
    total: number
    currency: string
    status: string
    hosted_invoice_url: string
  }> = customerWithInvoices.invoices ?? []
  const recentInvoices = invoices.slice(0, 10)
  const isCanceled = activeProduct?.canceled_at != null

  const handleOpenBillingPortal = async () => {
    await openBillingPortal({ openInNewTab: true })
  }

  const handleCancelClick = (productId: string) => {
    setCancelProductId(productId)
  }

  const handleCancelConfirm = async () => {
    if (!cancelProductId) return
    setIsCancelling(true)
    try {
      await cancel({ productId: cancelProductId })
      await refetch()
      setCancelProductId(null)
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm">Manage your subscription and invoices.</p>
      </div>

      {/* 1. Subscription Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {activeProduct?.name ?? 'Free'}
              {activeProduct?.status && (
                <Badge
                  variant={
                    activeProduct.status === 'active' || activeProduct.status === 'trialing' ? 'default' : 'secondary'
                  }
                >
                  {activeProduct.status}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {activeProduct &&
              activeProduct.current_period_start != null &&
              activeProduct.current_period_end != null ? (
                <>
                  Current period: {dateFormatter.format(activeProduct.current_period_start * 1000)} –{' '}
                  {dateFormatter.format(activeProduct.current_period_end * 1000)}
                </>
              ) : (
                'No active subscription period.'
              )}
            </CardDescription>
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- isCanceled implies activeProduct; guard for SDK edge cases */}
            {isCanceled && activeProduct && activeProduct.canceled_at != null ? (
              <p className="text-destructive mt-2 text-sm">
                Subscription will end on {dateFormatter.format(activeProduct.canceled_at * 1000)}.
              </p>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={handleOpenBillingPortal} variant="default">
            Manage Subscription
            <ExternalLinkIcon className="ml-2 size-4" />
          </Button>
          <Button asChild variant="outline">
            <Link to="/pricing">Upgrade Plan</Link>
          </Button>
        </CardContent>
      </Card>

      {/* 2. Usage & Seats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Current usage for your plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- show credits only when plan includes it */}
          {creditsFeature ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credits</span>
                <span>
                  {creditsFeature.usage ?? 0} / {creditsFeature.included_usage ?? 0} used
                  {creditsFeature.balance != null && creditsFeature.balance > 0 ? (
                    <span className="text-muted-foreground ml-1">({creditsFeature.balance} remaining)</span>
                  ) : null}
                </span>
              </div>
              <Progress
                value={
                  (creditsFeature.included_usage ?? 0) > 0
                    ? Math.min(100, ((creditsFeature.usage ?? 0) / (creditsFeature.included_usage ?? 1)) * 100)
                    : 0
                }
              />
            </div>
          ) : null}
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- show seats only when plan includes it */}
          {seatsFeature ? (
            <div className="flex justify-between text-sm">
              <span>Seats</span>
              <span>
                {seatsFeature.usage ?? 0} / {seatsFeature.included_usage ?? seatsFeature.usage_limit ?? '—'} used
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* 3. Invoice History */}
      {recentInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Recent invoices. Open in Stripe to download.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((inv, i) => (
                  <TableRow key={i}>
                    <TableCell>{dateFormatter.format(inv.created_at * 1000)}</TableCell>
                    <TableCell>{formatCurrency(inv.total, inv.currency)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{inv.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {inv.hosted_invoice_url ? (
                        <Button asChild variant="ghost" size="sm">
                          <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                            View
                            <ExternalLinkIcon className="ml-1 size-3" />
                          </a>
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 4. Danger Zone */}
      {activeProduct && !isCanceled && activeProduct.status === 'active' && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Cancel Subscription</CardTitle>
            <CardDescription>
              Cancel your plan at the end of the current billing period. You will keep access until then.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="destructive" onClick={() => handleCancelClick(activeProduct.id)} disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <AlertDialog open={cancelProductId != null} onOpenChange={(open) => !open && setCancelProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of the current billing period. After that, you will
              lose access to paid features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep subscription</AlertDialogCancel>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                'Cancel subscription'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
