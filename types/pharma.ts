import type { Doc, Id } from '@/convex/_generated/dataModel'

export type Category = Doc<'categories'>
export type Product = Doc<'products'>
export type Cart = Doc<'carts'>
export type Order = Doc<'orders'>

export type ProductId = Id<'products'>
