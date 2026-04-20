import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const expected = process.env.CONTROL_PANEL_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('control_auth', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return res
}
