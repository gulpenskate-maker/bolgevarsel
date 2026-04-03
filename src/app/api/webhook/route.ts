export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event: any
  try {
    event = await constructWebhookEvent(body, sig)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
  const supabase = getSupabaseAdmin()
  if (event.type === 'checkout.session.completed') {
    const { email, plan } = event.data.object.metadata
    await supabase.from('bv_subscribers').update({
      status: 'active', stripe_subscription_id: event.data.object.subscription, plan,
    }).eq('email', email)
  }
  if (event.type === 'customer.subscription.deleted') {
    await supabase.from('bv_subscribers').update({ status: 'cancelled' }).eq('stripe_subscription_id', event.data.object.id)
  }
  return NextResponse.json({ received: true })
}
