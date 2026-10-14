export function toCategorySlug(categoryName: string) {
  return categoryName
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function categoryUrl(categoryName: string) {
  return `/category/${toCategorySlug(categoryName)}`
}
