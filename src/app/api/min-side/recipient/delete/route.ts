export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  const { id, subscriber_id } = await req.json()
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('bv_recipients').delete().eq('id', id).eq('subscriber_id', subscriber_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
