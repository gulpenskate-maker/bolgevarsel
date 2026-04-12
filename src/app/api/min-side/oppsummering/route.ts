export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!

function retning(deg: number): string {
  const d = ['N','NNO','NO','ONO','O','OSO','SO','SSO','S','SSV','SV','VSV','V','VNV','NV','NNV']
  return d[Math.round(deg / 22.5) % 16]
}

function byggPrompt(aktivitet: string, profile: string | null, lokasjon: string, day: any, timer: string): string {
  const base = `VÆRDATA FOR ${lokasjon.toUpperCase()} — ${day.dateLabel?.toUpperCase() || new Date().toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}:
- Bølger (snitt/maks): ${day.avgWave?.toFixed(1)}m / ${day.maxWave?.toFixed(1)}m fra ${day.waveDir || '?'}
- Bølgeperiode: ${day.avgPeriod?.toFixed(0) ?? '?'}s
- Vind (nå/maks): ${day.windNow?.toFixed(1)} / ${day.windMax?.toFixed(1)} m/s fra ${day.windDirLabel || '?'} (${day.windDesc || ''})
- Nedbør: ${day.precipDesc || 'Ingen nedbør'}
- Lufttemperatur: ${Math.round(day.temp || 0)}°C${day.seaTemp != null ? `\n- Sjøtemperatur: ${day.seaTemp?.toFixed(1)}°C` : ''}
- Stabilitet: ${day.stability || 'stabile forhold'}${day.tomorrowForecast ? `\n- I morgen: ${day.tomorrowForecast.wind?.toFixed(1)} m/s vind, ${day.tomorrowForecast.wave?.toFixed(1)}m bølger` : ''}

VIKTIG: Ikke referer til høytider, helligdager eller spesielle anledninger. Hold deg til værdata og aktivitetsråd.
${day.totalPrecip > 5 ? `VIKTIG: Det er varslet ${day.precipDesc} denne dagen. Dette MÅ nevnes i oppsummeringen — kraftig nedbør påvirker komfort, sikt og sikkerheten på sjøen.` : day.totalPrecip > 1 ? `Merk: Det er varslet ${day.precipDesc}. Nevn dette kort.` : ''}

TIMESVARSEL:
${timer}

VURDERING: ${day.rating?.tekst || '—'}`

  const regler: Record<string, string> = {
    surfer: `Du er en erfaren surfer og surfeblogger i Norge. Vurder forholdene presist for surfing.

VIKTIGE SURFEFAKTORER du MÅ ta stilling til:
1. BØLGEPERIODE: Under 7s = choppy og rotete, uverdig surfing. 7-9s = akseptabelt. Over 9s = god swell. SI DETTE EKSPLISITT.
2. VINDKVALITET: Offshore (vind fra land, typisk N/NØ/Ø på vestkysten) = perfekt, gir rene bølger. Onshore (vind mot land, V/SV/S) = ødelegger bølgene. Side-shore = akseptabelt. VURDER VINDRETNINGEN mot typisk norsk kyst.
3. BØLGEHØYDE: Under 0.5m = for lite. 0.5-1.5m = fint for de fleste. Over 2m = kun erfarne.
4. VÅTDRAKT: Sjøtemp under 10°C = 5/4mm hette og boots er NØDVENDIG. Under 8°C = tørdrakt vurderes. Si konkret hvilken drakt.
5. BRETT-ANBEFALING basert på bølgestørrelse og periode.

${base}

Skriv 3-4 setninger som en lokal surfer ville sagt til en kamerat. Vær ærlig — hvis forholdene er dårlige, si det klart. Nevn periode, vindkvalitet (offshore/onshore), drakt og eventuelt beste tidspunkt. Norsk bokmål, uformelt men saklig, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    kitesurfer: `Du er en erfaren kitesurfer i Norge. Vurder forholdene presist for kiting.

VIKTIGE KITEFAKTORER:
1. VINDSTYRKE: Under 6 m/s = for lite (avhengig av kite-størrelse). 7-14 m/s = sweet spot. Over 18 m/s maks = farlig.
2. VINDSTABILITET: Gusty/variabel vind er farlig for kiting — si om vinden er stabil eller kaster.
3. VINDRETNING: Side-shore eller side-onshore = tryggeste. Offshore (vind fra land) = farlig, driver deg ut.
4. BØLGER: Over 1.5m + sterk vind = krevende forvann. Flatt vann med god vind = ideelt for freeride.

${base}

Skriv 3-4 setninger som en erfaren kitesurfer. Vær tydelig på vindstyrke, stabilitet og retning. Norsk bokmål, uformelt, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    seiler: `Du er en erfaren norsk seiler/kystlos. Vurder forholdene for seilas.

VIKTIGE SEILERFAKTORER:
1. VINDSTYRKE: Under 3 m/s = for lite. 6-12 m/s = ideelt. 13+ m/s = krevende, kun erfarne. Over 17 m/s = kuling, bli i havn.
2. BØLGEHØYDE: Over 1.5m på åpent hav = krevende. Fjorder og skjærgård er mer skjermet.
3. SEILOPPSETT: Si konkret hva som passer — storseil + spinnaker, fullt seil, eller reif.
4. VINDRETNING: Medhavsbris vs. motvind — kommenter om det er gunstig for vanlige ruter.

${base}

Skriv 3-4 setninger som en erfaren skipper. Gi konkret råd om seiloppsett og trygghet. Norsk bokmål, uformelt, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    fisker: `Du er en erfaren kystfisker i Norge. Vurder forholdene for fiske fra båt.

VIKTIGE FISKERFAKTORER:
1. BØLGER og VIND: Over 1m bølger og 10+ m/s vind = ubehagelig/farlig for åpne båter. Under 0.5m og 5 m/s = ideelt.
2. SJØTEMPERATUR: Kommenter om den er typisk for årstiden og hva det betyr for fisk.
3. KONKRET RÅD: Si om det er verdt å legge ut, og eventuelt hvilken tid på dagen som er best.
4. SIKKERHET: Nevn hvis forholdene krever forsiktighet.

${base}

Skriv 3-4 setninger som en erfaren fisker. Vær konkret og praktisk. Norsk bokmål, uformelt, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    kajakk: `Du er en erfaren havkajakk-padler i Norge. Vurder forholdene for kajakk.

VIKTIGE KAJAKK-FAKTORER:
1. VIND: Over 8 m/s = krevende for kajakk, kun erfarne. Over 12 m/s = farlig, bli på land.
2. BØLGER: Over 0.7m = krevende. Over 1m = svært krevende.
3. VINDRETNING: Offshore (fra land) er spesielt farlig — driver paddleren ut.
4. SIKKERHET: Alltid paddle med noen, hold land i sikte, ha kommunikasjon.

${base}

Skriv 3-4 setninger som en erfaren padler. Prioriter sikkerhet. Norsk bokmål, uformelt, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    familie: `Du er en trygg og erfaren båtfører som vurderer forhold for familieturer med barn.

VIKTIGE FAKTORER FOR FAMILIETUR:
1. BØLGER: Over 0.8m = ubehagelig for barn. Over 1.2m = ikke anbefalt.
2. VIND: Over 8 m/s = for mye for åpne småbåter med barn.
3. SJØTEMPERATUR: Under 14°C = bading ikke anbefalt for barn. Si tydelig.
4. TRYGGHET: Gi konkrete råd om redningsvester og avstand fra land.

${base}

Skriv 3-4 setninger med fokus på trygghet for familien. Norsk bokmål, vennlig, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    baatforer: `Du er en erfaren norsk båtfører og navigatør. Gi en navigasjonsmessig vurdering.

VIKTIGE NAVIGASJONSFAKTORER:
1. BEAUFORT: Angi Beaufort-skala og hva det betyr for sikker navigasjon.
2. BØLGER: Vurder for åpen sjø vs. fjord/skjærgård.
3. SIKT og VÆR: Kommenter evt. nedbør og sikt.
4. RÅD: Gi konkret råd om fartsreduksjon, rute eller om man bør vente.

${base}

Skriv 3-4 setninger som en erfaren skipper. Norsk bokmål, presist, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,

    fridykker: `Du er en erfaren fridykker og snorklist i Norge. Vurder forholdene for fridykking.

VIKTIGE FAKTORER FOR FRIDYKKING:
1. SIKT: Bølger over 0.4m og vind over 6 m/s gir dårlig sikt og strøm — si dette tydelig.
2. SJØTEMPERATUR: Under 10°C = tørdrakt nødvendig. 10-15°C = 7mm våtdrakt. Over 15°C = 5mm.
3. STRØM: Sterk vind gir overflatestrøm — farlig for fridykkere.
4. SIKKERHETSREGEL: Aldri dykk alene, ha alltid sikkerhetsdykker på overflaten.

${base}

Skriv 3-4 setninger som en erfaren fridykker. Vær tydelig om sikt og drakt. Norsk bokmål, uformelt, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`,
  }

  const spesifikk = profile && regler[profile]
  if (spesifikk) return spesifikk

  // Generell prompt
  return `Du er en erfaren norsk sjømelder. Skriv en kort, naturlig oppsummering av sjøforholdene for en ${aktivitet} ved ${lokasjon} i dag.

${base}

Skriv 2-4 setninger. Vær konkret og bruk klokkeslett der relevant. Norsk bokmål, uformelt, ingen kallenavn eller tiltaleord som "bror", "kompis", "mann" e.l., ingen emojis, ingen overskrift.`
}

export async function POST(req: NextRequest) {
  const { lokasjon, profile, day } = await req.json()
  if (!day) return NextResponse.json({ error: 'Mangler data' }, { status: 400 })

  const profileNavn: Record<string, string> = {
    surfer: 'surfer', kitesurfer: 'kitesurfer', windsurfer: 'windsurfer',
    fisker: 'fisker', familie: 'familie med barn', baatforer: 'båtfører/navigatør',
    kajakk: 'kajakk-padler', seiler: 'seiler', fridykker: 'fridykker',
  }
  const aktivitet = (profile && profileNavn[profile]) || 'sjøfarende'

  const timer = (day.hourly || []).map((h: any) =>
    `kl. ${h.time}: ${h.wave?.toFixed(1)}m bølger fra ${h.waveDir ? retning(h.waveDir) : '?'}, vind ${h.wind?.toFixed(1)} m/s fra ${h.windDir ? retning(h.windDir) : '?'}, temp ${h.temp?.toFixed(0)}°`
  ).join('\n')

  const prompt = byggPrompt(aktivitet, profile || null, lokasjon || '?', day, timer)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const tekst = data.content?.[0]?.text?.trim()
  if (!tekst) return NextResponse.json({ error: 'Klarte ikke generere oppsummering', detail: data }, { status: 500 })

  return NextResponse.json({ ok: true, tekst })
}

