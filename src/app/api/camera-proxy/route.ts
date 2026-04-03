export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Mangler url' }, { status: 400 })

  // Tillat kun kjente kamera-domener
  const allowed = [
    'images.webcams.travel',
    'bulandet-grendalag.org',
    'skylinewebcams.com',
    'kamera.yr.no',
    'webcam.svorka.net',
  ]
  const hostname = new URL(url).hostname
  if (!allowed.some(d => hostname.endsWith(d))) {
    return NextResponse.json({ error: 'Ikke tillatt' }, { status: 403 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BolgevarselBot/1.0)',
        'Referer': 'https://bolgevarsel.no',
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) return NextResponse.json({ error: 'Kamera ikke tilgjengelig' }, { status: 502 })

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Feil ved henting' }, { status: 500 })
  }
}
