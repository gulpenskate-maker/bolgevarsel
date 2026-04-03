import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json()

    if (!email || !plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS]

    // Opprett eller hent Stripe-kunde
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer = customers.data[0]

    if (!customer) {
      customer = await stripe.customers.create({ email })
    }

    // Lagre subscriber i Supabase
    await supabaseAdmin.from('bv_subscribers').upsert({
      email,
      stripe_customer_id: customer.id,
      plan,
      status: 'inactive',
    }, { onConflict: 'email' })

    // Opprett Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/velkommen?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/registrer`,
      metadata: { email, plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
