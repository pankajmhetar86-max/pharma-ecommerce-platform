/**
 * Logo path detected at build time from public/logo.{svg,png,webp,jpg,jpeg,ico}.
 * null when no logo exists — Logo component falls back to Avatar.
 * Used for Logo component, favicons, and og:image.
 */
export const LOGO_PATH: string | null = typeof __LOGO_PATH__ !== 'undefined' ? __LOGO_PATH__ : null
