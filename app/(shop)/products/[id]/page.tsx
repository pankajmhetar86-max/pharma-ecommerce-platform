import { ProductDetailContent } from '@/components/product-detail-content'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailContent productId={params.id} />
}
