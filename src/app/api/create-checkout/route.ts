export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe'
import { getPlanById } from '@/lib/plans'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json()
    const selectedPlan = getPlanById(plan)
    if (!email || !selectedPlan) {
      return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }
    const supabase = getSupabaseAdmin()
    const customer = await getOrCreateCustomer(email)
    await supabase.from('bv_subscribers').upsert({
      email, stripe_customer_id: customer.id, plan, status: 'inactive',
    }, { onConflict: 'email' })
    const session = await createCheckoutSession(customer.id, selectedPlan.priceId, email, plan)
    if (!session.url) return NextResponse.json({ error: session.error?.message || 'Stripe feil' }, { status: 500 })
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
