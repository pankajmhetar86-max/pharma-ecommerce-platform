import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getAccessTokenAction, getAuth, getSignInUrl } from '@workos/authkit-tanstack-react-start'

export const Route = createFileRoute('/_app/_admin')({
  loader: async ({ location }) => {
    const auth = await getAuth()
    if (!auth.user) {
      const href = await getSignInUrl({ data: { returnPathname: location.pathname } })
      throw redirect({ href })
    }

    const organizationId = 'organizationId' in auth ? auth.organizationId : undefined
    const accessToken = await getAccessTokenAction()

    if (!organizationId || !accessToken) {
      throw redirect({ to: '/' })
    }

    return { organizationId, accessToken }
  },
  component: () => <Outlet />,
})
