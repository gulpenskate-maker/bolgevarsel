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
    next: { revalidate: 3600 }, // cache 1 time
  })

  if (!res.ok) return NextResponse.json([])

  const data = await res.json()

  // Prioriter kysttyper (bay, beach, harbour, marina) men ta med alt
  const sorted = data.sort((a: any, b: any) => {
    const coastal = ['bay','beach','harbour','marina','coastline','cove','inlet','fjord']
    const aCoastal = coastal.includes(a.type) ? 1 : 0
    const bCoastal = coastal.includes(b.type) ? 1 : 0
    return bCoastal - aCoastal || b.importance - a.importance
  })

  const results = sorted.slice(0, 6).map((r: any) => ({
    name: r.display_name.split(',').slice(0, 3).join(',').trim(),
    fullName: r.display_name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    type: r.type,
  }))

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'public, max-age=3600' }
  })
}
