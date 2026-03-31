'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CategorySidebar } from './category-sidebar'
import { ImageSlider } from './image-slider'
import { ProductGrid } from './product-grid'
import type { Route } from 'next'

export function HomePageContent() {
  const router = useRouter()

  const fetchedCategories = useQuery(api.categories.list)
  const recommendedProducts = useQuery(api.products.listRecommended)

  const categories =
    fetchedCategories?.map((category) => ({ _id: category._id, name: category.name })) ?? []

  const heading = 'Recommended'
  const emptyMessage =
    recommendedProducts?.length === 0
      ? 'No recommended products yet. Ask your admin to mark some products as recommended.'
      : undefined

  const handleSelectCategory = (cat: string) => {
    const categoryPath = cat.replace(/ /g, '+')
    router.push(`/category/${categoryPath}` as Route)
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[260px_1fr] lg:px-6">
      <div className="order-2 lg:order-1">
        <CategorySidebar
          categories={categories}
          selectedCategory={undefined}
          onSelectCategory={handleSelectCategory}
        />
      </div>
      <div className="order-1 space-y-4 lg:order-2">
        <ImageSlider />
        <section className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 md:text-2xl">{heading}</h2>
          {emptyMessage ? (
            <p className="py-12 text-center text-slate-400">{emptyMessage}</p>
          ) : (
            <ProductGrid products={recommendedProducts} />
          )}
        </section>
      </div>
    </div>
  )
}
