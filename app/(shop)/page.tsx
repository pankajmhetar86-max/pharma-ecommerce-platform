import type { Metadata } from 'next'
import { HomePageContent } from '@/components/home-page-content'

export const metadata: Metadata = {
  title: 'Pharma eCommerce Platform',
  description: 'Trusted online pharmaceutical platform with secure authentication and real-time cart sync.',
}

export default function HomePage() {
  return <HomePageContent />
}
