export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  // Nominatim — mye bedre på norske lokaliteter enn Open-Meteo Geocoding
  // Filtrerer til Norge og kysttype-steder
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}+Norge&format=json&limit=8&accept-language=no&countrycodes=no&addressdetails=1`
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Bolgevarsel/1.0 bolgevarsel.no kontakt@bolgevarsel.no',
    },
    cache: 'no-store',
  })

  if (!res.ok) return NextResponse.json([])

  const data = await res.json()

  // Filtrer vekk irrelevante typer — vi vil ikke ha bussholdeplasser, kirker osv.
  const BLOCKED_TYPES = [
    'bus_stop','bus_station','tram_stop','ferry_terminal','taxi','parking',
    'fuel','atm','bank','pharmacy','hospital','school','church','chapel',
    'place_of_worship','supermarket','restaurant','cafe','fast_food','pub',
    'hotel','motel','shop','mall','post_office','police','fire_station',
    'residential','industrial','commercial','retail','office','construction',
    'path','footway','cycleway','track','service','road',
  ]
  const BLOCKED_CLASSES = ['highway','building','amenity','shop','office','tourism']

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
