import { createStart } from '@tanstack/react-start'
import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
  wrapMiddlewaresWithSentry,
} from '@sentry/tanstackstart-react'
import { authkitMiddleware } from '@workos/authkit-tanstack-react-start'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: wrapMiddlewaresWithSentry({
      sentryGlobalRequestMiddleware,
      authkitMiddleware: authkitMiddleware(),
    }),
    functionMiddleware: wrapMiddlewaresWithSentry({
      sentryGlobalFunctionMiddleware,
    }),
  }
})
