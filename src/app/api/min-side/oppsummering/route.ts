export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!

export async function POST(req: NextRequest) {
  const { lokasjon, profile, day } = await req.json()
  if (!day) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const profileNavn: Record<string, string> = {
    surfer: 'surfer', kitesurfer: 'kitesurfer', windsurfer: 'windsurfer',
    fisker: 'fisker', familie: 'familie med barn', baatforer: 'båtfører/navigatør',
    kajakk: 'kajakk-padler', seiler: 'seiler', fridykker: 'fridykker',
  }
  const aktivitet = (profile && profileNavn[profile]) || 'sjøfarende'

  // Bygg timesvarsel-tekst
  const timer = (day.hourly || []).map((h: any) =>
    `kl. ${h.time}: ${h.wave?.toFixed(1)}m bølger fra ${h.waveDir ? retning(h.waveDir) : '?'}, vind ${h.wind?.toFixed(1)} m/s fra ${h.windDir ? retning(h.windDir) : '?'}, temp ${h.temp?.toFixed(0)}°`
  ).join('\n')

  const prompt = `Du er en erfaren norsk sjømelder. Skriv en kort, naturlig og nyttig oppsummering av sjøforholdene for en ${aktivitet} ved ${lokasjon} i dag.

VÆRDATA:
- Bølger (snitt/maks): ${day.avgWave?.toFixed(1)}m / ${day.maxWave?.toFixed(1)}m fra ${day.waveDir || '?'}
- Vind (nå/maks): ${day.windNow?.toFixed(1)} / ${day.windMax?.toFixed(1)} m/s fra ${day.windDirLabel || '?'} (${day.windDesc || ''})
- Lufttemperatur: ${Math.round(day.temp || 0)}°C
${day.seaTemp != null ? `- Sjøtemperatur: ${day.seaTemp?.toFixed(1)}°C` : ''}
- Stabilitet: ${day.stability || 'stabile forhold'}
- Beste tidspunkt: ${day.bestTime || '—'}
${day.tomorrowForecast ? `- I morgen: ${day.tomorrowForecast.wind?.toFixed(1)} m/s vind, ${day.tomorrowForecast.wave?.toFixed(1)}m bølger` : ''}

TIMESVARSEL:
${timer}

VURDERING: ${day.rating?.tekst || '—'}

Skriv 2-4 setninger. Vær konkret og bruk klokkeslett der det er relevant. Nevn om forholdene endrer seg utover dagen. Gi ett praktisk råd tilpasset en ${aktivitet}. Skriv på norsk bokmål, uformelt og direkte. Ikke bruk overskrift. Ikke bruk emojis.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const tekst = data.content?.[0]?.text?.trim()
  if (!tekst) return NextResponse.json({ error: 'Klarte ikke generere oppsummering', detail: data }, { status: 500 })

  return NextResponse.json({ ok: true, tekst })
}

function retning(deg: number): string {
  const d = ['N','NNO','NO','ONO','O','OSO','SO','SSO','S','SSV','SV','VSV','V','VNV','NV','NNV']
  return d[Math.round(deg / 22.5) % 16]
}
