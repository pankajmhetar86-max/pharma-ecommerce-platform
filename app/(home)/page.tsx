import type { Metadata } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { HomePageContent } from '@/components/home-page-content'
import { siteInputs } from '@/lib/site-inputs'

export const metadata: Metadata = {
  title: siteInputs.home.seoTitle,
  description: siteInputs.home.seoDescription,
  keywords: siteInputs.home.seoKeywords,
}

export default async function HomePage() {
  const initialSliderImages = await fetchQuery(api.admin.listActiveSliderImages)
  return <HomePageContent initialSliderImages={initialSliderImages} />
}
