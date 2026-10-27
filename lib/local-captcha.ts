// Keep the local testing bypass unavailable in production builds.
export function isLocalCaptchaBypassed(hostname: string) {
  return process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1', '[::1]'].includes(hostname)
}
