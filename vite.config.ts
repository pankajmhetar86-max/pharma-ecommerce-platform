import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import viteReact from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import { nitro } from 'nitro/vite'
import { detectLogoPlugin } from './vite-plugin-detect-logo'

dotenv.config({ path: '.env.local', quiet: true })
dotenv.config({ path: '.env', quiet: true })

const isCiBuild = process.env.CI === 'true' || process.env.VERCEL === '1'

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'recharts'
            if (id.includes('convex') || id.includes('@convex-dev')) return 'convex'
            if (id.includes('posthog')) return 'posthog'
            if (id.includes('@workos')) return 'workos'
            if (id.includes('generaltranslation') || id.includes('gt-react')) return 'i18n'
            if (id.includes('radix-ui') || id.includes('@radix-ui')) return 'radix-ui'
            if (id.includes('lucide-react')) return 'lucide'
          }
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: '@/convex', replacement: fileURLToPath(new URL('./convex', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  plugins: [
    detectLogoPlugin(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    ...(isCiBuild
      ? [
          sentryTanstackStart({
            org: 'yast-ai-inc',
            project: 'yast',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            autoInstrumentMiddleware: false,
            telemetry: false,
          }),
        ]
      : []),
    nitro({ preset: 'vercel' }),
    viteReact(),
  ],
})
