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
      'Daglig e-postrapport til deg — kl. du bestemmer',
      'Bølgehøyde, vind, periode og sjøtemperatur',
      'AI-oppsummering tilpasset din aktivitet',
      'Surfer, fisker, seiler, kajakk og mer',
      'Rapportgenerator — generer rapport på forespørsel',
      'Soloppgang og solnedgang per dag',
      'Kritisk farevarsel ved kuling — alltid på',
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
      'SMS-varsel til hele familien — opptil 5 personer',
      'Opptil 3 kyststeder (hytta, hjemsted, favorittspot)',
      'Egen aktivitetsprofil per mottaker',
      'Daglig e-post + SMS — velg tidspunkt per person',
      'Rapportgenerator — sjekk opptil 7 dager frem',
      'AI-oppsummering tilpasset hver aktivitet',
      'Kritisk farevarsel til alle — kan ikke skrus av',
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
      'Opptil 5 kyststeder langs hele norskekysten',
      'SMS til opptil 5 mottakere med ulike profiler',
      'Rapportgenerator — flerdag AI-analyse opptil 7 dager',
      'Finn beste dag i uken for din aktivitet',
      'Nedbør, vindkast og bølgeperiode inkludert',
      'Daglig e-post + SMS — individuelt tidspunkt',
      'Kritisk farevarsel til alle — kan ikke skrus av',
    ],
  },
]

// Hjelpefunksjoner
export const getPlanById = (id: string) => PLANS.find(p => p.id === id)
export const getPlanByPriceId = (priceId: string) => PLANS.find(p => p.priceId === priceId)
