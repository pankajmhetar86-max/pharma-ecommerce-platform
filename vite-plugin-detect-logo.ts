import fs from 'node:fs'
import path from 'node:path'

const LOGO_EXTENSIONS = ['svg', 'png', 'webp', 'jpg', 'jpeg', 'ico']

export function detectLogoPlugin() {
  const publicDir = path.join(process.cwd(), 'public')
  let logoPath: string | null = null

  for (const ext of LOGO_EXTENSIONS) {
    const filePath = path.join(publicDir, `logo.${ext}`)
    if (fs.existsSync(filePath)) {
      logoPath = `/logo.${ext}`
      break
    }
  }

  return {
    name: 'detect-logo',
    config() {
      return {
        define: {
          __LOGO_PATH__: JSON.stringify(logoPath),
        },
      }
    },
  }
}
