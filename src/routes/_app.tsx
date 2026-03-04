import { Outlet, createFileRoute } from '@tanstack/react-router'

import { LogInIcon } from 'lucide-react'
import { Unauthenticated } from 'convex/react'
import { getAccessTokenAction, getAuth, getSignInUrl, switchToOrganization } from '@workos/authkit-tanstack-react-start'
import { OrganizationSwitcher } from '@workos-inc/widgets/organization-switcher'
import { NavUser } from '@/components/app-sidebar/nav-user'
import { Logo } from '@/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { CreateOrganizationDialog } from '@/components/app-sidebar/create-organization'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  loader: async () => {
    const auth = await getAuth()
    const signInUrl = await getSignInUrl()
    const accessToken = await getAccessTokenAction()
    const organizationId = 'organizationId' in auth ? auth.organizationId : undefined
    return { user: auth.user, accessToken, signInUrl, organizationId }
  },
})

function AppLayout() {
  const { user, accessToken, signInUrl, organizationId } = Route.useLoaderData()
  const handleSignIn = () => {
    window.location.href = signInUrl
  }
  return (
    <SidebarProvider
      defaultOpen={user ? true : false}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {organizationId ? (
                  <>
                    <OrganizationSwitcher
                      authToken={accessToken ?? ''}
                      switchToOrganization={async ({ organizationId: orgId }) => {
                        await switchToOrganization({
                          data: { organizationId: orgId, returnTo: location.pathname },
                        })
                        window.location.reload()
                      }}
                    >
                      <CreateOrganizationDialog />
                    </OrganizationSwitcher>
                  </>
                ) : (
                  <Logo />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter>
          {user && <NavUser user={user} organizationId={organizationId ?? null} />}
          <Unauthenticated>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignIn} className="justify-center">
                  <LogInIcon className="size-4" /> Login
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Unauthenticated>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {user && (
          <header>
            <SidebarTrigger />
          </header>
        )}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
