import { MetadataRoute } from 'next'

const BASE = 'https://bolgevarsel.no'

const HJELP_SIDER = [
  'kom-i-gang/hva-er-bolgevarsel',
  'kom-i-gang/velg-plan',
  'kom-i-gang/registrering',
  'kom-i-gang/legg-til-lokasjon',
  'kom-i-gang/legg-til-mottakere',
  'varsler/nar-sendes-varsel',
  'varsler/forstaa-sms',
  'varsler/forstaa-epost',
  'varsler/farevarsel',
  'varsler/pause-sms',
  'konto/logg-inn',
  'konto/endre-epost',
  'konto/bytte-plan',
  'konto/si-opp',
  'konto/betaling',
  'faq/hvor-noyaktig',
  'faq/hvilke-lokasjoner',
  'faq/sms-ikke-mottatt',
  'faq/flere-lokasjoner',
  'faq/datakilder',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const statiske: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/hjelp`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/varsel`,      lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/registrer`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/personvern`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const hjelp: MetadataRoute.Sitemap = HJELP_SIDER.map(slug => ({
    url: `${BASE}/hjelp/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...statiske, ...hjelp]
}
