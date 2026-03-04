export default async function loadTranslations(locale: string) {
  try {
    // Load translations from ./src/_gt directory (GT recommended path for local storage)
    const t = await import(`./_gt/${locale}.json`)
    return t.default
  } catch (error) {
    console.warn(`Failed to load translations for locale ${locale}:`, error)
    return {}
  }
}
