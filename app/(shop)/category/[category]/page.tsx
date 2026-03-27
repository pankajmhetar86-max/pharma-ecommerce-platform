import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ProductsPageContent } from '@/components/products-page-content'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const categoryName = category.replace(/\+/g, ' ')
  return {
    title: `${categoryName} Products`,
    description: `Browse ${categoryName} products`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const categoryName = category.replace(/\+/g, ' ')
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      }
    >
      <ProductsPageContent categoryFromPath={categoryName} />
    </Suspense>
  )
}
