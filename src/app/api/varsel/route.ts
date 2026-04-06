export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') ?? '0')
  const lon = parseFloat(searchParams.get('lon') ?? '0')

  if (!lat || !lon) return NextResponse.json({ error: 'Mangler koordinater' }, { status: 400 })

  // Truncer til 4 desimaler — påkrevd av api.met.no TOS
  const tLat = Math.round(lat * 10000) / 10000
  const tLon = Math.round(lon * 10000) / 10000

  const res = await fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${tLat}&lon=${tLon}`,
    {
      headers: {
        'User-Agent': 'Bolgevarsel/1.0 bolgevarsel.no kontakt@bolgevarsel.no',
        'Accept-Encoding': 'gzip, deflate',
      },
      next: { revalidate: 1800 }, // cache 30 min server-side
    }
  )

  if (!res.ok) return NextResponse.json({ error: 'met.no feil' }, { status: res.status })
  if (res.status === 203) console.warn(`met.no 203 Deprecated for lat=${tLat}&lon=${tLon}`)

  const data = await res.json()

  // Sett cache-headers slik klienten ikke spammer
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=300',
    },
  })
}
