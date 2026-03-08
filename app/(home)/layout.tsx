import type { PropsWithChildren } from 'react'
import Script from 'next/script'
import { ShopShell } from '@/components/shop-shell'
import { siteInputs } from '@/lib/site-inputs'

export default function HomeLayout({ children }: PropsWithChildren) {
  const googleTagId = siteInputs.home.googleTagId.trim()

  return (
    <>
      {googleTagId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="beforeInteractive" />
          <Script id="home-google-tag" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(googleTagId)});
            `}
          </Script>
        </>
      ) : null}
      <ShopShell>{children}</ShopShell>
    </>
  )
}
