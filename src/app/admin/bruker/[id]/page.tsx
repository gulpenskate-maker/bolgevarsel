export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BrukerAdmin from './BrukerAdmin'

export default async function BrukerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { data: sub } = await supabase
    .from('bv_subscribers')
    .select('*, bv_locations(*), bv_recipients(*)')
    .eq('id', id)
    .single()
  if (!sub) notFound()
  return <BrukerAdmin sub={sub} />
}
