import { createFileRoute } from '@tanstack/react-router'
import { BillingPage } from '@/components/billing/billing-page'

export const Route = createFileRoute('/_app/_authenticated/billing')({
  component: BillingPage,
})
