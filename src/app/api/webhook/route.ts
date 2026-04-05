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
    console.error('Webhook signature feil:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  try {
    switch (event.type) {

      // Ny kunde har betalt
      case 'checkout.session.completed': {
        const session = event.data.object
        const email = session.metadata?.email || session.customer_details?.email
        const plan = session.metadata?.plan || 'kyst'
        const customerId = session.customer
        const subscriptionId = session.subscription

        if (!email) break

        const { data: existing } = await supabase
          .from('bv_subscribers')
          .select('id')
          .eq('email', email)
          .maybeSingle()

        if (existing) {
          // Oppdater eksisterende
          await supabase.from('bv_subscribers').update({
            status: 'active',
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          }).eq('email', email)
        } else {
          // Opprett ny subscriber
          await supabase.from('bv_subscribers').insert({
            email,
            plan,
            status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
        }
        console.log(`✅ Ny/oppdatert abonnent: ${email}, plan: ${plan}`)
        break
      }

      // Abonnement aktivt (f.eks. etter trial)
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const status = sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'cancelled' : 'inactive'
        await supabase.from('bv_subscribers').update({ status })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      // Abonnement kansellert
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await supabase.from('bv_subscribers').update({ status: 'cancelled' })
          .eq('stripe_subscription_id', sub.id)
        console.log(`❌ Abonnement kansellert: ${sub.id}`)
        break
      }

      // Betaling mislyktes
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await supabase.from('bv_subscribers').update({ status: 'inactive' })
          .eq('stripe_customer_id', invoice.customer)
        console.log(`⚠️ Betaling feilet for kunde: ${invoice.customer}`)
        break
      }

      // Betaling vellykket (fornyelse)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        if (invoice.billing_reason === 'subscription_cycle') {
          await supabase.from('bv_subscribers').update({ status: 'active' })
            .eq('stripe_customer_id', invoice.customer)
        }
        break
      }
    }
  } catch (err: any) {
    console.error('Webhook handler feil:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
