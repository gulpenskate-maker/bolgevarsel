import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const auth = req.cookies.get('bv_admin')?.value
    if (auth !== process.env.ADMIN_SECRET) {
      if (pathname === '/admin/login') return NextResponse.next()
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    // Aldri indekser admin
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
