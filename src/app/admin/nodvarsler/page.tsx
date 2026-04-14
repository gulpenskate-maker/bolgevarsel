export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import NodvarslerClient from './NodvarslerClient'

export default async function NodvarslerAdmin() {
  const supabase = getSupabaseAdmin()

  const { data: alerts } = await supabase
    .from('bv_emergency_alerts')
    .select('*, bv_subscribers(email, phone, plan)')
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: contacts } = await supabase
    .from('bv_emergency_contacts')
    .select('*, bv_subscribers(email)')
    .order('created_at', { ascending: false })

  return <NodvarslerClient alerts={alerts || []} contacts={contacts || []} />
}
