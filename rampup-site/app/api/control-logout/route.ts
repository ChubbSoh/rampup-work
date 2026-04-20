import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.redirect(
    new URL('/control-login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
  )
  res.cookies.set('control_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
