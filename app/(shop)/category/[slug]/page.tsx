import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { ProductGrid } from '@/components/product-grid'
import { CategoryNavigationSidebar } from '@/components/category-navigation-sidebar'
import { buildBreadcrumbSchema } from '@/lib/home-schema'
import { categoryUrl, toCategorySlug } from '@/lib/category-url'

export const revalidate = 300

const getCategories = cache(() => fetchQuery(api.categories.list))

const getCategory = cache(async (slug: string) => {
  const categories = await getCategories()
  return categories.find((category) => toCategorySlug(category.name) === slug) ?? null
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  const title = `${category.name} Products`
  const description = `Browse ${category.name} products available from GetUrPill.`

  return {
    title,
    description,
    alternates: {
      canonical: categoryUrl(category.name),
    },
  }
}

function serializeJsonLd(schema: unknown) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, categories] = await Promise.all([getCategory(slug), getCategories()])

  if (!category) {
    notFound()
  }

  const products = await fetchQuery(api.products.list, { category: category.name, limit: 100 })
  const schema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: category.name, path: categoryUrl(category.name) },
  ])

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />}

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">
        <div className="lg:col-start-1">
          <CategoryNavigationSidebar categories={categories} activeCategory={category.name} />
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors hover:text-teal-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to all products
          </Link>

          <header className="mb-6 mt-4">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{category.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Browse all {category.name} products available from GetUrPill.</p>
          </header>

          <ProductGrid products={products} />
        </div>
      </div>
    </>
  )
}
