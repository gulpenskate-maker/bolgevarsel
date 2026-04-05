import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: Request) {
  const { subscriber_id, action } = await req.json()
  if (!subscriber_id || !['pause', 'resume'].includes(action)) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const { data: sub } = await supabase.from('bv_subscribers').select('stripe_subscription_id, status').eq('id', subscriber_id).single()
  if (!sub) return NextResponse.json({ error: 'Fant ikke abonnent' }, { status: 404 })

  if (sub.stripe_subscription_id) {
    if (action === 'pause') {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        pause_collection: { behavior: 'void' }
      })
    } else {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        pause_collection: ''  as any
      })
    }
  }

  const newStatus = action === 'pause' ? 'paused' : 'active'
  await supabase.from('bv_subscribers').update({ status: newStatus }).eq('id', subscriber_id)

  return NextResponse.json({ ok: true, status: newStatus })
}
