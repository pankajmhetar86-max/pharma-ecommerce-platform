'use client'

import { useState } from 'react'
import { ChevronDown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

type CategoryLike = {
  _id?: string
  name: string
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: Array<CategoryLike>
  selectedCategory: string | undefined
  onSelectCategory: (category: string) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const selectedLabel = selectedCategory || 'All categories'

  return (
    <aside className="pharma-card h-fit p-4">
      <button
        type="button"
        onClick={() => setMobileOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left lg:hidden"
        aria-expanded={mobileOpen}
        aria-controls="category-sidebar-list"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</p>
          <p className="truncate text-sm font-medium text-slate-800">{selectedLabel}</p>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-slate-500 transition-transform', mobileOpen && 'rotate-180')}
        />
      </button>

      <ul id="category-sidebar-list" className={cn('space-y-1', mobileOpen ? 'mt-3 block' : 'hidden', 'lg:block')}>
        {categories.map((category) => {
          const isActive = selectedCategory === category.name
          return (
            <li key={category._id ?? category.name}>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(category.name)
                  setMobileOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition',
                  isActive ? 'bg-sky-50 font-semibold text-sky-700' : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                <Heart className={cn('h-4 w-4', isActive ? 'fill-red-500 text-red-500' : 'text-slate-300')} />
                <span>{category.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
