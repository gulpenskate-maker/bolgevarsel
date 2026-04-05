export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const sessionEmail = req.cookies.get('bv_session')?.value
  if (!sessionEmail) return NextResponse.json({ subscriber: null })

  const supabase = getSupabaseAdmin()
  const { data: subscriber } = await supabase.from('bv_subscribers').select('*').eq('email', sessionEmail).single()
  if (!subscriber) return NextResponse.json({ subscriber: null })

  const { data: locations } = await supabase.from('bv_locations').select('*').eq('subscriber_id', subscriber.id)
  const { data: recipients } = await supabase.from('bv_recipients').select('*').eq('subscriber_id', subscriber.id)
  return NextResponse.json({ subscriber, locations: locations || [], recipients: recipients || [] })
}
