import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  CONTROL_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
} from '@/lib/control-session'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const expected = process.env.CONTROL_PANEL_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 401 })
  }

  // Issue a signed, expiring token instead of the old static "granted" value,
  // which could be forged by anyone who knew the cookie name.
  const token = await createSessionToken()
  if (!token) {
    return NextResponse.json(
      { error: 'Server misconfiguration: no session secret configured.' },
      { status: 500 }
    )
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(CONTROL_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return res
}
