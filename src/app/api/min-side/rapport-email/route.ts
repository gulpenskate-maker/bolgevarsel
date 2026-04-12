export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

const RESEND_KEY = process.env.RESEND_API_KEY!

export async function POST(req: NextRequest) {
  const { email, locName, profile, days } = await req.json()
  if (!email || !days?.length) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const profileNames: Record<string, string> = {
    surfer: 'Surferapport', kitesurfer: 'Kiterapport', windsurfer: 'Windsurfrapport',
    fisker: 'Fiskerapport', familie: 'Familerapport', baatforer: 'Navigasjonsrapport',
    kajakk: 'Padlerapport', seiler: 'Seilerapport', fridykker: 'Dykkerapport',
  }
  const reportType = (profile && profileNames[profile]) || 'Sjørapport'
  const day = days[0]

  const html = `<!DOCTYPE html><html lang="nb"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table width="560" style="max-width:560px;width:100%">
<tr><td style="background:linear-gradient(135deg,#0a2a3d,#1a6080);border-radius:16px 16px 0 0;padding:32px 40px">
  <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.12em">Bølgevarsel · ${reportType}</p>
  <h1 style="margin:0 0 4px;font-size:24px;font-weight:300;color:#fff">${locName}</h1>
  <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.55)">${day.dateLabel}</p>
</td></tr>
<tr><td style="background:#fff;padding:28px 40px">
  <div style="background:${day.rating?.farge || '#1a6080'}18;border-left:4px solid ${day.rating?.farge || '#1a6080'};padding:12px 14px;border-radius:0 8px 8px 0;margin-bottom:20px">
    <p style="margin:0;font-size:16px;font-weight:700;color:${day.rating?.farge || '#1a6080'}">${day.rating?.tekst || '—'}</p>
  </div>
  <table width="100%" cellpadding="0" cellspacing="4" style="margin-bottom:20px">
    <tr>
      <td style="padding:10px;background:#f8fafc;border-radius:8px;text-align:center;width:32%">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase">Bølger</p>
        <p style="margin:0;font-size:22px;font-weight:300;color:#0a2a3d">${day.avgWave?.toFixed(1) || '—'}m</p>
      </td>
      <td width="2%"></td>
      <td style="padding:10px;background:#f8fafc;border-radius:8px;text-align:center;width:32%">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase">Vind</p>
        <p style="margin:0;font-size:22px;font-weight:300;color:#0a2a3d">${day.windNow?.toFixed(1) || '—'} m/s</p>
      </td>
      <td width="2%"></td>
      <td style="padding:10px;background:#f8fafc;border-radius:8px;text-align:center;width:32%">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase">Temp</p>
        <p style="margin:0;font-size:22px;font-weight:300;color:#0a2a3d">${Math.round(day.temp || 0)}°</p>
      </td>
    </tr>
  </table>
  <p style="margin:0 0 6px;font-size:12px;color:#64748b">Beste tidspunkt: <strong>${day.bestTime || '—'}</strong></p>
  ${day.seaTemp !== null && day.seaTemp !== undefined ? `<p style="margin:0;font-size:12px;color:#64748b">Sjøtemperatur: <strong>${day.seaTemp?.toFixed(1)}°C</strong></p>` : ''}
</td></tr>
<tr><td style="background:#0a2a3d;border-radius:0 0 16px 16px;padding:16px 40px;text-align:center">
  <a href="https://bolgevarsel.no/min-side" style="font-size:12px;color:rgba(255,255,255,0.5)">Min side →</a>
</td></tr>
</table></td></tr></table></body></html>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Bølgevarsel <noreply@bolgevarsel.no>',
      to: [email],
      subject: `${day.rating?.tekst || 'Sjørapport'} — ${locName} ${day.dateLabel}`,
      html,
    }),
  })

  const data = await res.json()
  if (data.id) return NextResponse.json({ ok: true })
  return NextResponse.json({ error: 'E-post feilet', detail: data }, { status: 500 })
}
