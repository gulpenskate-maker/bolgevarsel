export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PLANS, getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json()
    if (!email || !plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }
    const supabase = getSupabaseAdmin()
    const selectedPlan = PLANS[plan as keyof typeof PLANS]
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
