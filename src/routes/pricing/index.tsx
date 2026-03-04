import { createFileRoute } from '@tanstack/react-router'
import { getAuth } from '@workos/authkit-tanstack-react-start'
import PricingTable from '@/components/autumn/pricing-table'

export const Route = createFileRoute('/pricing/')({
  loader: async () => {
    const auth = await getAuth()
    const organizationId = 'organizationId' in auth ? auth.organizationId : undefined
    return { organizationId }
  },
  component: PricingPage,
})

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pricing</h1>
          <p className="text-muted-foreground"> Choose the plan that's right for you.</p>
        </header>

        <PricingTable />
      </div>
    </div>
  )
}
