import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { subscriber_id, send_time } = await req.json()
  if (!subscriber_id || !send_time) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const validTimes = ['04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00']
  if (!validTimes.includes(send_time)) return NextResponse.json({ error: 'Ugyldig tidspunkt' }, { status: 400 })

  const { error } = await supabase
    .from('bv_subscribers')
    .update({ send_time })
    .eq('id', subscriber_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, send_time })
}
