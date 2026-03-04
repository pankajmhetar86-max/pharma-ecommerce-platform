import { BarChartIcon, CreditCardIcon, LogOutIcon, MoreVerticalIcon, ShieldIcon, UserCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@workos/authkit-tanstack-react-start/client'
import { useTranslations } from 'gt-react'
import { useCustomer } from 'autumn-js/react'
import type { User } from '@workos/authkit-tanstack-react-start'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

export function NavUser({ user, organizationId }: { user: User; organizationId?: string | null }) {
  const { isMobile } = useSidebar()
  const { signOut } = useAuth()
  const { customer } = useCustomer()
  const plan = customer?.products.find((p) => p.status === 'active')?.name ?? 'Free'
  const isLoading = !customer
  const [showEmail, setShowEmail] = useState(false)
  const t = useTranslations()

  const User = () => {
    return (
      <div
        className="flex items-center gap-2 flex-1"
        onClick={(e) => {
          e.stopPropagation()
          setShowEmail(!showEmail)
        }}
      >
        <Avatar className="h-8 w-8 rounded-lg grayscale">
          <AvatarImage src={user.profilePictureUrl || ''} alt={user.firstName || 'User'} />
          <AvatarFallback className="rounded-lg">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">
            {user.firstName} {user.lastName}{' '}
            <Badge variant="secondary" className="sm">
              {!isLoading && plan}
            </Badge>
          </span>
          <span
            className="text-muted-foreground truncate text-xs"
            style={{
              filter: showEmail ? 'none' : 'blur(4px)',
              transition: 'filter 0.2s ease-in-out',
            }}
          >
            {user.email}
          </span>
        </div>
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <User />
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <User />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserCircleIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing">
                  <CreditCardIcon />
                  {t('billing')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChartIcon />
                {t('usage')}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin">
                  <ShieldIcon />
                  Admin Portal
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <LogOutIcon />
              {t('logOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
