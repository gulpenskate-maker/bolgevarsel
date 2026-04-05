export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/min-side?feil=ugyldig-token', req.url))

  const supabase = getSupabaseAdmin()

  // Hent og valider token
  const { data: tokenRow } = await supabase
    .from('bv_magic_tokens')
    .select('*, bv_subscribers(email)')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!tokenRow) return NextResponse.redirect(new URL('/logg-inn?feil=utlopt', req.url))

  // Merk token som brukt
  await supabase.from('bv_magic_tokens').update({ used_at: new Date().toISOString() }).eq('id', tokenRow.id)

  // Sett cookie og redirect til min-side
  const email = tokenRow.bv_subscribers?.email
  const res = NextResponse.redirect(new URL('/min-side', req.url))
  res.cookies.set('bv_session', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 dager
    path: '/',
  })
  return res
}
