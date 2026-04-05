// ============================================
// SINGLE SOURCE OF TRUTH FOR ALLE ABONNEMENTER
// Oppdater her — resten av appen følger med
// ============================================

export type Plan = {
  id: string
  name: string
  price: number
  priceId: string
  featured: boolean
  lokasjoner: number
  mottakere: number
  smsEnabled: boolean
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'kyst',
    name: 'Kyst',
    price: 49,
    priceId: 'price_1TIn0GDF2t9Ys3TQxchu6W2q',
    featured: false,
    lokasjoner: 3,
    mottakere: 0,
    smsEnabled: false,
    features: [
      'Opptil 3 lokasjoner',
      'Daglig e-postrapport kl. 07:30',
      'Bølge, vind og temperatur',
      'Farevarsel ved ekstremvær',
      'Ingen SMS',
    ],
  },
  {
    id: 'familie',
    name: 'Familie',
    price: 99,
    priceId: 'price_1TI5otDF2t9Ys3TQQeZqW0Bh',
    featured: true,
    lokasjoner: 1,
    mottakere: 3,
    smsEnabled: true,
    features: [
      '1 lokasjon',
      'Opptil 3 mottakere',
      'Daglig SMS kl. 07:30',
      'Bølge, vind og temperatur',
      'Farevarsel ved kuling',
      'Farevarsel ved ekstremvær',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    priceId: 'price_1TI5owDF2t9Ys3TQai5tcWFQ',
    featured: false,
    lokasjoner: 5,
    mottakere: 5,
    smsEnabled: true,
    features: [
      '5 lokasjoner',
      'Opptil 5 mottakere',
      'Daglig SMS kl. 07:30',
      'Ukentlig rapport',
      'Farevarsel ved kuling',
      'Farevarsel ved ekstremvær',
    ],
  },
]

// Hjelpefunksjoner
export const getPlanById = (id: string) => PLANS.find(p => p.id === id)
export const getPlanByPriceId = (priceId: string) => PLANS.find(p => p.priceId === priceId)
