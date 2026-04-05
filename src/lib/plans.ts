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
    price: 179,
    priceId: 'price_1TInAnDF2t9Ys3TQJLe4tkWR',
    featured: true,
    lokasjoner: 1,
    mottakere: 3,
    smsEnabled: true,
    features: [
      '1 kystlokasjon',
      'SMS til deg + opptil 3 barn/mottakere',
      'Daglig SMS kl. 07:30',
      'Daglig e-postrapport',
      'Bølge, vind og temperatur',
      'Farevarsel ved ekstremvær',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    priceId: 'price_1TIn6ZDF2t9Ys3TQNGP7Rmce',
    featured: false,
    lokasjoner: 3,
    mottakere: 5,
    smsEnabled: true,
    features: [
      'Opptil 3 kystlokasjoner',
      'SMS til opptil 5 mottakere',
      'Daglig SMS kl. 07:30',
      'Daglig e-postrapport',
      'Farevarsel ved kuling',
      'Farevarsel ved ekstremvær',
    ],
  },
]

// Hjelpefunksjoner
export const getPlanById = (id: string) => PLANS.find(p => p.id === id)
export const getPlanByPriceId = (priceId: string) => PLANS.find(p => p.priceId === priceId)
