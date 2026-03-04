import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SITE_NAME } from '@/constants'
import { cn } from '@/lib/utils'
import { LOGO_PATH } from '@/constants/logo'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const firstLetter = SITE_NAME.charAt(0).toUpperCase()

export const Logo = () => {
  const [logoSrc, setLogoSrc] = useState<string | null>(LOGO_PATH)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
    setLogoSrc(null)
  }

  const showAvatar = !logoSrc || imageError

  return (
    <Link to="/" className="flex items-center justify-center gap-2">
      {showAvatar ? (
        <Avatar className={cn('size-12 shrink-0')}>
          <AvatarFallback className="text-lg font-semibold">{firstLetter}</AvatarFallback>
        </Avatar>
      ) : (
        <img
          src={logoSrc}
          alt={`${SITE_NAME} logo`}
          width={48}
          height={48}
          className="size-12 object-contain"
          onError={handleImageError}
        />
      )}
      <span className="text-xl font-semibold">{SITE_NAME}</span>
    </Link>
  )
}

export const LogoIcon = ({ className }: { className?: string }) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(LOGO_PATH)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
    setLogoSrc(null)
  }

  const showAvatar = !logoSrc || imageError

  if (showAvatar) {
    return (
      <Avatar size="lg" className={cn('size-10', className)}>
        <AvatarFallback className="text-sm font-semibold">{firstLetter}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <img
      src={logoSrc}
      alt={`${SITE_NAME} logo`}
      width={40}
      height={40}
      className={className}
      onError={handleImageError}
    />
  )
}
