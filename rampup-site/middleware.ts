import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('control_auth')
  if (!cookie || cookie.value !== 'granted') {
    return NextResponse.redirect(new URL('/control-login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/control'],
}
