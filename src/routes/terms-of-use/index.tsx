import { createFileRoute } from '@tanstack/react-router'
import { TERMS_OF_USE_LAST_REVISED, TERMS_OF_USE_VERSION, TermsOfUseContent } from '@/constants'

export const Route = createFileRoute('/terms-of-use/')({
  component: TermsOfUsePage,
})

function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
            <p className="text-sm text-muted-foreground">
              Version {TERMS_OF_USE_VERSION}
              <br />
              Last revised on: {TERMS_OF_USE_LAST_REVISED}
            </p>
          </header>

          <TermsOfUseContent />
        </div>
      </div>
    </div>
  )
}
