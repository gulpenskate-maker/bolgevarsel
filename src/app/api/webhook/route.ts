import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { email, plan } = session.metadata!

    await supabaseAdmin.from('bv_subscribers').update({
      status: 'active',
      stripe_subscription_id: session.subscription as string,
      plan,
    }).eq('email', email)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabaseAdmin.from('bv_subscribers').update({
      status: 'cancelled',
    }).eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
