export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import { PLANS } from '@/lib/plans'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = getSupabaseAdmin()

  const { data: subscribers } = await supabase
    .from('bv_subscribers')
    .select('*, bv_locations(*), bv_recipients(*)')
    .order('created_at', { ascending: false })

  const aktive = subscribers?.filter(s => s.status === 'active') ?? []
  const totalMottakere = aktive.reduce((sum, s) => sum + (s.bv_recipients?.filter((r: any) => r.active && r.sms_enabled !== false).length ?? 0), 0)

  const inntektPerMnd = aktive.reduce((sum, s) => {
    const plan = PLANS.find(p => p.id === s.plan)
    return sum + (plan?.price ?? 0)
  }, 0)

  const smsPrMnd = totalMottakere * 30
  const smskostnad = smsPrMnd * 1.43
  const netto = inntektPerMnd - smskostnad

  const planTelling = PLANS.map(p => ({
    ...p,
    antall: aktive.filter(s => s.plan === p.id).length,
  }))

  return (
    <AdminDashboard
      subscribers={subscribers ?? []}
      stats={{ aktive: aktive.length, inntekt: inntektPerMnd, smskostnad, netto, smsPrMnd, totalMottakere }}
      planTelling={planTelling}
    />
  )
}
