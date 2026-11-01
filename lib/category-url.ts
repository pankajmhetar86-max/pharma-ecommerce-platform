export function categoryUrl(categoryName: string) {
  return `/?category=${encodeURIComponent(categoryName)}`
}
