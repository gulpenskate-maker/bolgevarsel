import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: Request) {
  const { subscriber_id } = await req.json()
  if (!subscriber_id) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const { data: sub } = await supabase.from('bv_subscribers').select('stripe_subscription_id').eq('id', subscriber_id).single()
  if (!sub) return NextResponse.json({ error: 'Fant ikke abonnent' }, { status: 404 })

  // Kanseller Stripe-abonnementet umiddelbart
  if (sub.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id)
    } catch (e) {
      // Allerede kansellert — fortsett
    }
  }

  // Merk for sletting om 30 dager
  const deleteAt = new Date()
  deleteAt.setDate(deleteAt.getDate() + 30)

  await supabase.from('bv_subscribers').update({
    status: 'deleted',
    delete_at: deleteAt.toISOString()
  }).eq('id', subscriber_id)

  return NextResponse.json({ ok: true })
}
