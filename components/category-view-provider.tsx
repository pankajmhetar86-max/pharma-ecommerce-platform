'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { SidebarView } from './category-sidebar'

const CategoryViewContext = createContext<{
  selectedView: SidebarView
  setSelectedView: (view: SidebarView) => void
} | null>(null)

export function CategoryViewProvider({ children }: { children: ReactNode }) {
  const [selectedView, setSelectedView] = useState<SidebarView>('recommended')
  return (
    <CategoryViewContext.Provider value={{ selectedView, setSelectedView }}>{children}</CategoryViewContext.Provider>
  )
}

export function useCategoryView() {
  const context = useContext(CategoryViewContext)
  if (!context) throw new Error('CategoryViewProvider is required')
  return context
}

export function useCategoryNavigation() {
  const { setSelectedView } = useCategoryView()
  const router = useRouter()
  return (view: SidebarView) => {
    setSelectedView(view)
    router.push('/')
  }
}

export function CategoryButton({
  category,
  children,
  className,
}: {
  category: string
  children: ReactNode
  className?: string
}) {
  const selectCategory = useCategoryNavigation()
  return (
    <button type="button" className={className} onClick={() => selectCategory(category)}>
      {children}
    </button>
  )
}
