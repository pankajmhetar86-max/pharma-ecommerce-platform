import { createFileRoute, redirect } from '@tanstack/react-router'
import { Pipes, UserProfile, UserSecurity, UserSessions } from '@workos-inc/widgets'
import { getAccessTokenAction, getAuth, getSignInUrl } from '@workos/authkit-tanstack-react-start'

export const Route = createFileRoute('/_app/_authenticated/profile')({
  loader: async ({ location }) => {
    const auth = await getAuth()
    if (!auth.user) {
      const href = await getSignInUrl({ data: { returnPathname: location.pathname } })
      throw redirect({ href })
    }

    const accessToken = await getAccessTokenAction()
    if (!accessToken) {
      throw redirect({ to: '/' })
    }

    const currentSessionId = 'sessionId' in auth ? auth.sessionId : null

    return { accessToken, currentSessionId }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { accessToken, currentSessionId } = Route.useLoaderData()

  return (
    <main className="space-y-6 p-6">
      <UserProfile authToken={accessToken} />
      {currentSessionId ? <UserSessions authToken={accessToken} currentSessionId={currentSessionId} /> : null}
      <UserSecurity authToken={accessToken} />
      <Pipes authToken={accessToken} />
    </main>
  )
}
