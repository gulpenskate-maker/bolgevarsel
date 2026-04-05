export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BrukerAdmin from './BrukerAdmin'

export default async function BrukerPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin()
  const { data: sub } = await supabase
    .from('bv_subscribers')
    .select('*, bv_locations(*), bv_recipients(*)')
    .eq('id', params.id)
    .single()
  if (!sub) notFound()
  return <BrukerAdmin sub={sub} />
}
