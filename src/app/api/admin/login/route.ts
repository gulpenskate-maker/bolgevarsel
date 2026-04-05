import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { brukernavn, passord } = await req.json()
  const okBrukernavn = process.env.ADMIN_USERNAME || 'admin'
  const okPassord = process.env.ADMIN_PASSWORD || ''

  if (brukernavn === okBrukernavn && passord === okPassord && okPassord !== '') {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('bv_admin', process.env.ADMIN_SECRET || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 timer
      path: '/',
    })
    return res
  }
  return NextResponse.json({ error: 'Ugyldig' }, { status: 401 })
}
