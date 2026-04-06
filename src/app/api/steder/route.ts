export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  // Søk med Nominatim — to strategier parallelt for best dekning
  // 1) Fritekst med landkode=no (finner lokale navn bedre)
  // 2) Med "Norge" suffiks (fallback for tvetydige navn)
  const baseUrl = 'https://nominatim.openstreetmap.org/search'
  const headers = { 'User-Agent': 'Bolgevarsel/1.0 bolgevarsel.no kontakt@bolgevarsel.no' }
  const common = `format=json&limit=8&accept-language=no&countrycodes=no&addressdetails=1`

  const [res1, res2] = await Promise.all([
    fetch(`${baseUrl}?q=${encodeURIComponent(q)}&${common}`, { headers, cache: 'no-store' }),
    fetch(`${baseUrl}?q=${encodeURIComponent(q + ' Norge')}&${common}`, { headers, cache: 'no-store' }),
  ])

  const [d1, d2] = await Promise.all([
    res1.ok ? res1.json() : [],
    res2.ok ? res2.json() : [],
  ])

  // Slå sammen og dedupliser på place_id
  const seen = new Set()
  const data = [...d1, ...d2].filter((r: any) => {
    if (seen.has(r.place_id)) return false
    seen.add(r.place_id)
    return true
  })

  // Filtrer vekk irrelevante typer — kun stedsnavn og naturtyper er relevante
  const BLOCKED_TYPES = [
    'bus_stop','bus_station','tram_stop','taxi','parking','fuel','atm','bank',
    'pharmacy','hospital','school','church','chapel','place_of_worship',
    'supermarket','restaurant','cafe','fast_food','pub','bar','hotel','motel',
    'shop','mall','post_office','police','fire_station','library','museum',
    'residential','industrial','commercial','retail','office','construction',
    'path','footway','cycleway','track','service','road','street','avenue',
    'unclassified','tertiary','secondary','primary','trunk','motorway',
  ]
  const BLOCKED_CLASSES = ['highway','building','amenity','shop','office','tourism','man_made']

  // Kysttyper prioriteres høyest
  const COASTAL = ['bay','beach','harbour','marina','coastline','cove','inlet','fjord',
    'island','peninsula','cape','strait','water','lake','river','wetland','nature_reserve']

  const filtered = data.filter((r: any) =>
    !BLOCKED_TYPES.includes(r.type) &&
    !BLOCKED_CLASSES.includes(r.class)
  )

  const sorted = (filtered.length > 0 ? filtered : data).sort((a: any, b: any) => {
    const aCoastal = COASTAL.includes(a.type) ? 1 : 0
    const bCoastal = COASTAL.includes(b.type) ? 1 : 0
    return bCoastal - aCoastal || b.importance - a.importance
  })

  const typeMap: Record<string, string> = {
    bay: 'bukt', beach: 'strand', harbour: 'havn', marina: 'marina',
    island: 'øy', islet: 'øy', peninsula: 'halvøy', cape: 'nes',
    fjord: 'fjord', cove: 'vik', inlet: 'vik', strait: 'sund',
    lake: 'innsjø', river: 'elv', nature_reserve: 'naturreservat',
    suburb: 'bydel', village: 'tettsted', hamlet: 'tettsted',
    town: 'by', city: 'by', municipality: 'kommune',
    county: 'fylke', locality: 'sted', neighbourhood: 'nabolag',
    water: 'vann', wetland: 'våtmark',
  }
  function translateType(type: string, cls: string): string {
    return typeMap[type] || typeMap[cls] || ''
  }

  const results = sorted.slice(0, 6).map((r: any) => ({
    name: r.display_name.split(',').slice(0, 3).join(',').trim(),
    fullName: r.display_name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    type: translateType(r.type, r.class),
  }))

  return NextResponse.json(results)
}
