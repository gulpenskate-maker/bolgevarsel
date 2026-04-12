export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!

const profileNavn: Record<string, string> = {
  surfer: 'surfer', kitesurfer: 'kitesurfer', windsurfer: 'windsurfer',
  fisker: 'fisker', familie: 'familie med barn', baatforer: 'båtfører/navigatør',
  kajakk: 'kajakk-padler', seiler: 'seiler', fridykker: 'fridykker',
}

export async function POST(req: NextRequest) {
  const { lokasjon, profile, days } = await req.json()
  if (!days?.length) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const aktivitet = (profile && profileNavn[profile]) || 'sjøfarende'

  // Bygg dagsoversikt
  const dagsoversikt = days.map((d: any) => {
    return `${d.dateLabel}: Bølger ${d.avgWave?.toFixed(1)}m (maks ${d.maxWave?.toFixed(1)}m), periode ${d.avgPeriod?.toFixed(0)}s, vind ${d.windNow?.toFixed(1)}/${d.windMax?.toFixed(1)} m/s fra ${d.windDirLabel || '?'}, vurdering: "${d.rating?.tekst || '—'}"`
  }).join('\n')

  const bestDag = [...days].sort((a: any, b: any) => {
    const scoreMap: Record<string, number> = { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 0: 0 }
    return (scoreMap[b.rating?.score] ?? 0) - (scoreMap[a.rating?.score] ?? 0)
  })[0]

  const prompt = `Du er en erfaren norsk sjømelder. Gi en samlet oversikt over værforholdene for en ${aktivitet} ved ${lokasjon} de neste ${days.length} dagene.

DAGSOVERSIKT:
${dagsoversikt}

BESTE DAG: ${bestDag?.dateLabel} (${bestDag?.rating?.tekst})

Skriv 3-5 setninger som oppsummerer perioden som helhet. Fokuser på:
1. Hvilken dag/dager som er best egnet for ${aktivitet}
2. Trenden i været (bedres det, forverres det, stabilt?)
3. Én konkret anbefaling om når de bør dra ut

Ikke gjenta detaljerte tallverdier — det vises under. Norsk bokmål, uformelt men saklig, ingen kallenavn, ingen emojis, ingen overskrift. Ikke referer til høytider eller spesielle anledninger.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const tekst = data.content?.[0]?.text?.trim()
  if (!tekst) return NextResponse.json({ error: 'Klarte ikke generere oppsummering' }, { status: 500 })

  return NextResponse.json({ ok: true, tekst })
}
