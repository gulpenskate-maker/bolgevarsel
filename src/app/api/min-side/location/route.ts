export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { subscriber_id, name, lat, lon } = await req.json()
  const { data: location, error } = await supabaseAdmin
    .from('bv_locations').insert({ subscriber_id, name, lat, lon }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ location })
}
