/// <reference types="vite/client" />

declare const __LOGO_PATH__: string | null

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
