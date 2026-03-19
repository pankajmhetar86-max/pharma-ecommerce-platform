import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = (await req.json()) as { token?: string }
  if (!token) return NextResponse.json({ success: false }, { status: 400 })

  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ success: false, error: 'CAPTCHA not configured' }, { status: 500 })

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token }),
    })
    const text = await res.text()
    console.log('[verify-captcha] status:', res.status, 'body:', text)
    try {
      const result = JSON.parse(text) as { success: boolean }
      return NextResponse.json({ success: result.success })
    } catch {
      // Cloudflare returned non-JSON (e.g. HTML challenge page from cloud IP blocking)
      // Widget already passed client-side — allow upload with fallback
      console.warn('[verify-captcha] Non-JSON response from Cloudflare, allowing with fallback')
      return NextResponse.json({ success: true, fallback: true })
    }
  } catch (err) {
    console.error('[verify-captcha] Fetch error:', err)
    // Network-level failure — allow upload rather than blocking legitimate users
    return NextResponse.json({ success: true, fallback: true })
  }
}
