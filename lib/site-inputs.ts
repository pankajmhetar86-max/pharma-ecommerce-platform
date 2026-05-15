export const SITE_NAME = 'GetUrPill.com'
const DEFAULT_SITE_URL = 'https://www.geturpill.com'

function normalizeSiteUrl(value: string) {
  try {
    const url = new URL(value)
    url.hostname = url.hostname.toLowerCase()

    if (url.hostname === 'geturpill.com') {
      url.hostname = 'www.geturpill.com'
    }

    return url.toString().replace(/\/+$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL)

function normalizeGoogleTagId(value: string | undefined) {
  const trimmed = (value ?? '').trim()
  if (!trimmed || trimmed === 'G-XXXXX') return ''
  return trimmed
}

export const siteInputs = {
  home: {
    seoTitle: 'Geturpill | Bitcoin Online Pharmacy for Medicines Without Prescription',
    seoDescription: 'Geturpill - A Trusted Bitcoin online pharmacy for purchasing genuine medicines online with discreet delivery, secure payments, and easy ordering process.',
    seoKeywords: 'online pharmacy, Bitcoin Online Pharmacy, Online Pharmacy for Medicines Without Prescription, Bitcoin online pharmacy for purchasing genuine medicines online, medicines online with discreet delivery ',
    googleTagId: normalizeGoogleTagId(process.env.NEXT_PUBLIC_GOOGLE_TAG_ID),
    schema: {
      enabled: true,
      organization: {
        name: SITE_NAME,
        url: SITE_URL,
        logoPath: '/favicon.ico',
        telephone: process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || 'coming soon',
        email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || 'support@geturpill.com',
        contactType: 'Customer Service',
        areaServed: 'IN',
        availableLanguages: ['English'],
        sameAs: [],
      },
      localBusiness: {
        enabled: true,
        priceRange: '$10',
        openingHours: 'Mo-Fr 09:00-18:00',
        address: {
          streetAddress: 'Creative Industrial Estate, 205/A, Sunder Nagar Rd Number 2, Kalina, Santacruz East',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          postalCode: '400098',
          addressCountry: 'IN',
        },
      },
      breadcrumbs: {
        enabled: true,
        paths: ['/', '/about-us', '/contact-us'],
      },
      products: {
        enabled: true,
        currency: 'USD',
        priceValidUntil: '2099-12-31',
        maxItems: 8,
      },
    },
  },
} as const
