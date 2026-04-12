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
    lokasjoner: 1,
    mottakere: 0,
    smsEnabled: false,
    features: [
      '1 kystlokasjon',
      'Daglig e-postrapport — velg ditt tidspunkt',
      'Bølge, vind og temperatur',
      'Aktivitetsprofiler (surfer, fisker, seiler...)',
      'Kritisk farevarsel ved farlige forhold',
      'Ingen SMS',
    ],
  },
  {
    id: 'familie',
    name: 'Familie',
    price: 179,
    priceId: 'price_1TInAnDF2t9Ys3TQJLe4tkWR',
    featured: true,
    lokasjoner: 3,
    mottakere: 5,
    smsEnabled: true,
    features: [
      'Opptil 3 kystlokasjoner',
      'SMS til opptil 5 mottakere',
      'Daglig SMS — velg ditt tidspunkt',
      'Daglig e-postrapport',
      'Aktivitetsprofil per mottaker',
      'Kritisk farevarsel alltid på',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    priceId: 'price_1TIn6ZDF2t9Ys3TQNGP7Rmce',
    featured: false,
    lokasjoner: 5,
    mottakere: 5,
    smsEnabled: true,
    features: [
      'Opptil 5 kystlokasjoner',
      'SMS til opptil 5 mottakere',
      'Daglig SMS — velg ditt tidspunkt',
      'Daglig e-postrapport',
      'Aktivitetsprofil per mottaker',
      'Kritisk farevarsel alltid på',
    ],
  },
]

// Hjelpefunksjoner
export const getPlanById = (id: string) => PLANS.find(p => p.id === id)
export const getPlanByPriceId = (priceId: string) => PLANS.find(p => p.priceId === priceId)
