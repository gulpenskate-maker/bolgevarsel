import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function parsePhone(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, '').replace(/^00/, '+')
  if (/^\+47\d{8}$/.test(cleaned)) return cleaned
  if (/^47\d{8}$/.test(cleaned)) return '+' + cleaned
  if (/^\d{8}$/.test(cleaned)) return '+47' + cleaned
  return null
}

export async function POST(req: Request) {
  const { subscriber_id, location_id, rows } = await req.json()
  if (!subscriber_id || !location_id || !Array.isArray(rows)) {
    return NextResponse.json({ error: 'Mangler data' }, { status: 400 })
  }

  const results: { row: number; name: string; ok: boolean; error?: string }[] = []
  let imported = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const name = (row.navn || row.name || '').trim()
    const phoneRaw = (row.telefon || row.phone || '').trim()
    const email = (row.epost || row.email || '').trim() || null
    const smsRaw = (row.sms || 'ja').toString().toLowerCase().trim()
    const sms_enabled = !['nei', 'no', 'false', '0'].includes(smsRaw)

    const phone = parsePhone(phoneRaw)
    if (!phone) {
      results.push({ row: i + 2, name: name || `Rad ${i + 2}`, ok: false, error: 'Ugyldig telefonnummer' })
      continue
    }

    const { error } = await supabase.from('bv_recipients').insert({
      subscriber_id,
      location_id,
      name: name || null,
      phone,
      email,
      sms_enabled,
      active: true,
    })

    if (error) {
      results.push({ row: i + 2, name: name || phone, ok: false, error: error.message })
    } else {
      results.push({ row: i + 2, name: name || phone, ok: true })
      imported++
    }
  }

  return NextResponse.json({ ok: true, imported, total: rows.length, results })
}
