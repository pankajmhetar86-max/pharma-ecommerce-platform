import { createFileRoute } from '@tanstack/react-router'

const SENTRY_ENVELOPE_ENDPOINT = 'https://o4510954591485952.ingest.us.sentry.io/api/4510954595418112/envelope/'

export const Route = createFileRoute('/tunnel')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const envelope = await request.arrayBuffer()
        const contentType = request.headers.get('content-type') ?? 'application/x-sentry-envelope'
        const userAgent = request.headers.get('user-agent') ?? 'yast-sentry-tunnel'

        const upstream = await fetch(SENTRY_ENVELOPE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
            'User-Agent': userAgent,
          },
          body: envelope,
        })

        return new Response(null, { status: upstream.status })
      },
    },
  },
})
