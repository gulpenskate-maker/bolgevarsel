export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { fetchBarentsWatchForecast } from '@/lib/barentswatch'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') ?? '0')
  const lon = parseFloat(searchParams.get('lon') ?? '0')

  if (!lat || !lon) return NextResponse.json({ error: 'Mangler koordinater' }, { status: 400 })

  try {
    const forecast = await fetchBarentsWatchForecast(lat, lon)
    return NextResponse.json(forecast, {
      headers: { 'Cache-Control': 'public, max-age=1800, stale-while-revalidate=300' },
    })
  } catch (e: any) {
    console.error('BarentsWatch feil:', e.message)
    return NextResponse.json({ error: 'BarentsWatch utilgjengelig' }, { status: 502 })
  }
}
