import { createFileRoute } from '@tanstack/react-router'
import { PRIVACY_POLICY_LAST_REVISED, PRIVACY_POLICY_VERSION, PrivacyPolicyContent } from '@/constants'

export const Route = createFileRoute('/privacy-policy/')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">
              Version {PRIVACY_POLICY_VERSION}
              <br />
              Last revised on: {PRIVACY_POLICY_LAST_REVISED}
            </p>
          </header>

          <PrivacyPolicyContent />
        </div>
      </div>
    </div>
  )
}
