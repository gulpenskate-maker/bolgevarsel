export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Mangler e-post' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolgevarsel.no'

  // Finn abonnenten
  const { data: sub } = await supabase.from('bv_subscribers').select('id, email, status').eq('email', email).maybeSingle()
  if (!sub) return NextResponse.json({ error: 'Ingen konto funnet for denne e-postadressen' }, { status: 404 })
  if (sub.status === 'inactive' || sub.status === 'cancelled') return NextResponse.json({ error: 'Kontoen er deaktivert eller kansellert. Kontakt hei@bolgevarsel.no for hjelp.' }, { status: 403 })

  // Slett gamle tokens og generer nytt
  await supabase.from('bv_magic_tokens').delete().eq('subscriber_id', sub.id)
  const { data: tokenRow } = await supabase.from('bv_magic_tokens').insert({ subscriber_id: sub.id }).select().single()
  if (!tokenRow) return NextResponse.json({ error: 'Kunne ikke generere token' }, { status: 500 })

  const link = `${siteUrl}/api/auth/verify?token=${tokenRow.token}`
  const resendKey = process.env.RESEND_API_KEY

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Bølgevarsel <noreply@getlara.app>',
      to: [email],
      subject: 'Din innloggingslenke til Bølgevarsel',
      html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px"><tr><td align="center">
<table width="520" style="max-width:520px;width:100%">
<tr><td style="background:linear-gradient(135deg,#0a2a3d,#1a6080);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center">
  <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.12em">Bølgevarsel</p>
  <h1 style="margin:0;font-size:22px;font-weight:300;color:white">Din innloggingslenke</h1>
</td></tr>
<tr><td style="background:white;padding:36px 40px;text-align:center">
  <p style="margin:0 0 8px;font-size:16px;color:#334155">Klikk på knappen under for å logge inn på Min side</p>
  <p style="margin:0 0 28px;font-size:13px;color:#94a3b8">Lenken er gyldig i 1 time og kan kun brukes én gang</p>
  <a href="${link}" style="display:inline-block;background:#0a2a3d;color:white;padding:14px 32px;border-radius:100px;text-decoration:none;font-size:15px;font-weight:600">Logg inn på Min side →</a>
  <p style="margin:24px 0 0;font-size:12px;color:#cbd5e1">Lenken utløper om 1 time</p>
</td></tr>
<tr><td style="background:#0a2a3d;border-radius:0 0 16px 16px;padding:16px 40px;text-align:center">
  <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3)">Hvis du ikke ba om denne lenken kan du ignorere e-posten</p>
</td></tr>
</table></td></tr></table></body></html>`,
    }),
  })

  const emailJson = await emailRes.json()
  if (emailJson.id) return NextResponse.json({ ok: true })
  return NextResponse.json({ error: 'E-post feilet' }, { status: 500 })
}
