// @ts-nocheck
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export const PLANS = {
  basis: {
    name: 'Basis',
    price: 49,
    priceId: 'price_1TI5ooDF2t9Ys3TQvOQMK6c7',
    features: ['1 lokasjon', '1 mottaker', 'Daglig SMS kl. 07:30'],
  },
  familie: {
    name: 'Familie',
    price: 99,
    priceId: 'price_1TI5otDF2t9Ys3TQQeZqW0Bh',
    features: ['1 lokasjon', 'Opptil 3 mottakere', 'Daglig SMS', 'Farevarsel'],
  },
  pro: {
    name: 'Pro',
    price: 199,
    priceId: 'price_1TI5owDF2t9Ys3TQai5tcWFQ',
    features: ['5 lokasjoner', 'Opptil 5 mottakere', 'Ukentlig rapport', 'Farevarsel'],
  },
}
