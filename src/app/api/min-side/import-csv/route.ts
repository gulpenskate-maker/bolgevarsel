import { getSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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
    const smsRaw = (row.sms || '').toString().toLowerCase().trim()
    const sms_daily = ['ja', 'yes', 'true', '1'].includes(smsRaw)

    const phone = parsePhone(phoneRaw)
    if (!phone) {
      results.push({ row: i + 2, name: name || `Rad ${i + 2}`, ok: false, error: 'Ugyldig telefonnummer' })
      continue
    }

    const { error } = await getSupabaseAdmin().from('bv_recipients').insert({
      subscriber_id,
      location_id,
      name: name || null,
      phone,
      email,
      sms_enabled: true,
      sms_daily,
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
