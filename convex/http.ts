import { httpRouter } from 'convex/server'
import { authComponent, createAuth } from './auth'
import { handleIPN } from './cryptoWebhook'

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)

http.route({
  path: '/nowpayments-ipn',
  method: 'POST',
  handler: handleIPN,
})

export default http
