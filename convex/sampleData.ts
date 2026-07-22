type SeedPackage = {
  pillCount: number
  originalPrice: number
  price: number
  benefits?: string[]
  expiryDate?: string
}

type SeedDosagePricing = {
  dosage: string
  packages: SeedPackage[]
}

export type SeedProduct = {
  name: string
  genericName: string
  category: string
  description: string
  fullDescription?: string
  price?: number
  unit: string
  dosageOptions: string[]
  pricingMatrix?: SeedDosagePricing[]
  image: string
  imageAlt?: string
  imageTitle?: string
  discount?: number
  inStock: boolean
  isBestseller?: boolean
  isVisible?: boolean
  isRecommended?: boolean
  slug: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}

export const SEED_CATEGORIES = [
  { name: 'Intimate health', icon: 'heart', sortOrder: 0 },
  { name: 'Eye care', icon: 'eye', sortOrder: 1 },
] as const

export const CATEGORY_NAMES = SEED_CATEGORIES.map((category) => category.name)

const FREE_SHIPPING = ['Free Shipping']

const standardPackages = (basePrice: number): SeedPackage[] => [
  { pillCount: 60, originalPrice: basePrice + 10, price: basePrice, benefits: FREE_SHIPPING },
  { pillCount: 90, originalPrice: basePrice + 25, price: basePrice + 15, benefits: FREE_SHIPPING },
  { pillCount: 120, originalPrice: basePrice + 40, price: basePrice + 25, benefits: FREE_SHIPPING },
  { pillCount: 240, originalPrice: basePrice + 120, price: basePrice + 80, benefits: FREE_SHIPPING },
]

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Viagra Tablets',
    genericName: 'Cenforce',
    category: 'Intimate health',
    description:
      'Sildenafil citrate tablet options for customers comparing available dosage and package choices.',
    fullDescription:
      'Sildenafil citrate products should be used only with appropriate medical guidance. Review dosage, package size, safety warnings, and shipping details before ordering.',
    price: 30,
    unit: 'pill',
    dosageOptions: ['25mg', '50mg', '100mg'],
    pricingMatrix: [
      { dosage: '25mg', packages: standardPackages(30) },
      { dosage: '50mg', packages: standardPackages(35) },
      { dosage: '100mg', packages: standardPackages(40) },
    ],
    image: '/products/viagra.svg',
    imageAlt: 'Blue sildenafil tablets',
    imageTitle: 'Sildenafil tablets',
    discount: 0,
    inStock: true,
    isBestseller: true,
    isVisible: true,
    isRecommended: true,
    slug: 'blue-generic-viagra-pills',
    seoTitle: 'Sildenafil Tablet Options | Dosage and Package Information',
    seoDescription:
      'Compare sildenafil tablet package options, dosage choices, pricing, and safety information before placing an order.',
    seoKeywords: 'sildenafil tablets, sildenafil dosage options, sildenafil package pricing',
  },
  {
    name: 'Cialis Tadalafil',
    genericName: 'Tadalafil',
    category: 'Intimate health',
    description:
      'Tadalafil tablet options with package pricing for customers comparing longer-duration ED treatment choices.',
    fullDescription:
      'Tadalafil may not be appropriate for every customer. Review product details and consult a qualified medical professional if you have questions about use, dosage, or interactions.',
    price: 30,
    unit: 'pill',
    dosageOptions: ['10mg', '20mg'],
    pricingMatrix: [
      { dosage: '10mg', packages: standardPackages(30) },
      { dosage: '20mg', packages: standardPackages(40) },
    ],
    image: '/products/cialis.svg',
    imageAlt: 'Tadalafil tablets',
    imageTitle: 'Tadalafil tablet options',
    discount: 0,
    inStock: true,
    isBestseller: true,
    isVisible: true,
    isRecommended: true,
    slug: 'generic-cialis-tadalafil',
    seoTitle: 'Tadalafil Tablet Options | Dosage and Package Information',
    seoDescription:
      'Compare tadalafil tablet package options, dosage choices, pricing, and safety information before placing an order.',
    seoKeywords: 'tadalafil tablets, tadalafil dosage options, tadalafil package pricing',
  },
  {
    name: 'Bimatoprost Ophthalmic Solution 0.03%',
    genericName: 'Bimatoprost',
    category: 'Eye care',
    description:
      'Bimatoprost ophthalmic solution package options for customers comparing eye-care product choices.',
    fullDescription:
      'Bimatoprost ophthalmic solution should be used according to label directions and applicable medical guidance. Review package details and safety information before ordering.',
    price: 30,
    unit: 'bottle',
    dosageOptions: ['0.03%'],
    pricingMatrix: [{ dosage: '0.03%', packages: standardPackages(30) }],
    image: '/products/eye-drop.svg',
    imageAlt: 'Bimatoprost ophthalmic solution bottle',
    imageTitle: 'Bimatoprost ophthalmic solution',
    discount: 0,
    inStock: true,
    isVisible: true,
    isRecommended: true,
    slug: 'bimatoprost-latisse-online',
    seoTitle: 'Bimatoprost Ophthalmic Solution | Package Information',
    seoDescription:
      'Review bimatoprost ophthalmic solution package options, pricing, and product information before placing an order.',
    seoKeywords: 'bimatoprost ophthalmic solution, eye care product, bimatoprost package pricing',
  },
  {
    name: 'Levitra Tablets',
    genericName: 'Vardenafil',
    category: 'Intimate health',
    description:
      'Vardenafil tablet options with dosage and package pricing for customers comparing ED treatment choices.',
    fullDescription:
      'Vardenafil products should be reviewed carefully before use. Check dosage options, package sizes, and safety information, and seek medical guidance when needed.',
    price: 45,
    unit: 'pill',
    dosageOptions: ['10mg', '20mg'],
    pricingMatrix: [
      { dosage: '10mg', packages: standardPackages(45) },
      { dosage: '20mg', packages: standardPackages(55) },
    ],
    image: '/products/cialis.svg',
    imageAlt: 'Vardenafil tablets',
    imageTitle: 'Vardenafil tablet options',
    discount: 0,
    inStock: true,
    isVisible: true,
    isRecommended: true,
    slug: 'levitra-tablets-vilitra',
    seoTitle: 'Vardenafil Tablet Options | Dosage and Package Information',
    seoDescription:
      'Compare vardenafil tablet package options, dosage choices, pricing, and safety information before placing an order.',
    seoKeywords: 'vardenafil tablets, levitra tablet options, vardenafil package pricing',
  },
]
