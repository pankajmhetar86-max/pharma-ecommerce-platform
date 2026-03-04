'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CATEGORY_LIST } from '@/lib/category-list'
import { CategorySidebar } from './category-sidebar'
import { HeroSection } from './hero-section'
import { ProductGrid } from './product-grid'

export function HomePageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Bestsellers')
  const fetchedCategories = useQuery(api.categories.list)
  const products = useQuery(api.products.list, {
    category: selectedCategory === 'Bestsellers' ? undefined : selectedCategory,
    bestsellerOnly: selectedCategory === 'Bestsellers',
    limit: 12,
  })

  const categories =
    fetchedCategories?.map((category) => ({ _id: category._id, name: category.name })) ??
    CATEGORY_LIST.map((name) => ({ name }))

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[260px_1fr] lg:px-6">
      <div className="order-2 lg:order-1">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <div className="order-1 space-y-4 lg:order-2">
        <HeroSection />
        <section className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 md:text-2xl">
            {selectedCategory === 'Bestsellers' ? 'Bestsellers' : selectedCategory}
          </h2>
          <ProductGrid products={products} />
        </section>
      </div>
    </div>
  )
}
