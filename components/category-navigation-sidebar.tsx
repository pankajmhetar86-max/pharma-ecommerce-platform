'use client'

import { CategorySidebar } from '@/components/category-sidebar'
import { useCategoryNavigation } from '@/components/category-view-provider'

type Category = {
  _id?: string
  name: string
}

export function CategoryNavigationSidebar({
  categories,
  activeCategory,
}: {
  categories: Category[]
  activeCategory?: string
}) {
  const handleSelect = useCategoryNavigation()

  return (
    <CategorySidebar categories={categories} selectedView={activeCategory ?? 'recommended'} onSelect={handleSelect} />
  )
}
