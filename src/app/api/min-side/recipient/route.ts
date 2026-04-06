export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { subscriber_id, location_id, phone, name, email, sms_enabled, send_time } = await req.json()
  const supabase = getSupabaseAdmin()
  const { data: recipient, error } = await supabase
    .from('bv_recipients')
    .insert({ subscriber_id, location_id, phone, name, email: email||null, sms_enabled: sms_enabled!==false, send_time: send_time||null, active: true })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ recipient })
}
