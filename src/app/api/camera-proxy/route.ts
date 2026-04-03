export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

const allowed = [
  'cdn.skylinewebcams.com',
  'bulandet-grendalag.org',
  'images.webcams.travel',
]

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Mangler url' }, { status: 400 })

  let hostname: string
  try { hostname = new URL(url).hostname } catch { return NextResponse.json({ error: 'Ugyldig url' }, { status: 400 }) }
  if (!allowed.some(d => hostname.endsWith(d))) return NextResponse.json({ error: 'Ikke tillatt' }, { status: 403 })

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.skylinewebcams.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) return new NextResponse(null, { status: res.status })
    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch {
    return new NextResponse(null, { status: 502 })
  }
}
