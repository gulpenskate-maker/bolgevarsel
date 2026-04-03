export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const { id, subscriber_id, phone, name, active } = await req.json()
  const supabase = getSupabaseAdmin()
  const update: any = {}
  if (phone !== undefined) update.phone = phone
  if (name !== undefined) update.name = name
  if (active !== undefined) update.active = active
  const { data, error } = await supabase.from('bv_recipients').update(update).eq('id', id).eq('subscriber_id', subscriber_id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ recipient: data })
}
