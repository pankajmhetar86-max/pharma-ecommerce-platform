import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router'
import { UsersManagement } from '@workos-inc/widgets'

export const Route = createFileRoute('/_app/_admin/admin')({
  component: AdminPage,
})

const adminRoute = getRouteApi('/_app/_admin')
function AdminPage() {
  const { accessToken } = adminRoute.useLoaderData()
  return (
    <main className="p-6">
      <UsersManagement authToken={accessToken} />
    </main>
  )
}
