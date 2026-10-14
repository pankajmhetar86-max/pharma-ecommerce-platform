'use client'

import { useRouter } from 'next/navigation'
import { CategorySidebar, type SidebarView } from '@/components/category-sidebar'
import { categoryUrl } from '@/lib/category-url'

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
  const router = useRouter()

  const handleSelect = (view: SidebarView) => {
    router.push(view === 'recommended' || view === 'all' ? '/' : categoryUrl(view))
  }

  return (
    <CategorySidebar categories={categories} selectedView={activeCategory ?? 'recommended'} onSelect={handleSelect} />
  )
}
