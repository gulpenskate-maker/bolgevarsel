export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { fetchBarentsWatchForecast, type BwWavePoint, type BwWindPoint } from '@/lib/barentswatch'
const MET_HEADERS = {
  'User-Agent': 'Bolgevarsel/1.0 bolgevarsel.no kontakt@bolgevarsel.no',
  'Accept-Encoding': 'gzip, deflate',
}

function truncCoord(n: number) { return Math.round(n * 10000) / 10000 }

function dir(deg: number) {
  const d = ['N','NNO','NO','ONO','O','OSO','SO','SSO','S','SSV','SV','VSV','V','VNV','NV','NNV']
  return d[Math.round(deg / 22.5) % 16]
}

function windDesc(s: number) {
  if (s < 2) return 'Stille'; if (s < 4) return 'Svak vind'
  if (s < 8) return 'Lett bris'; if (s < 11) return 'Laber bris'
  if (s < 14) return 'Frisk bris'; if (s < 17) return 'Liten kuling'
  if (s < 21) return 'Stiv kuling'; return 'Kuling'
}

function getSunTimes(lat: number, lon: number, dateStr: string): { sunrise: string; sunset: string } {
  const date = new Date(dateStr + 'T12:00:00Z')
  const JD = date.getTime() / 86400000 + 2440587.5
  const n = JD - 2451545.0
  const L = (280.46 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * Math.PI / 180
  const epsilon = 23.439 * Math.PI / 180
  const sinDec = Math.sin(epsilon) * Math.sin(lambda)
  const dec = Math.asin(sinDec)
  const latR = lat * Math.PI / 180
  const cosHA = (Math.sin(-0.0145) - Math.sin(latR) * Math.sin(dec)) / (Math.cos(latR) * Math.cos(dec))
  if (Math.abs(cosHA) > 1) return { sunrise: '—', sunset: '—' }
  const HA = Math.acos(cosHA) * 180 / Math.PI
  const eqTime = 4 * (L - 0.0057183 - (Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) * 180 / Math.PI) + lon)
  const sunriseUTC = 720 - 4 * lon - HA * 4 + eqTime
  const sunsetUTC  = 720 - 4 * lon + HA * 4 + eqTime
  const fmt = (mins: number) => {
    const total = Math.round(mins + 120) // UTC+2 (sommertid)
    const h = Math.floor((total % 1440) / 60), m = total % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  }
  return { sunrise: fmt(sunriseUTC), sunset: fmt(sunsetUTC) }
}

// Fareindikator 0–5:
// 0 = Ikke aktuelt (for lite vind for seiler etc.)  → grå
// 1 = Perfekte forhold                              → grønn #16a34a
// 2 = Gode forhold                                  → lysgrønn #65a30d
// 3 = Akseptable forhold — vær oppmerksom          → gul #ca8a04
// 4 = Krevende forhold                              → oransje #ea580c
// 5 = Farlige forhold — frarådes                    → rød #dc2626
function fareIndikator(score: number): { farge: string; ikon: string } {
  if (score === 0) return { farge: '#94a3b8', ikon: '—' }
  if (score === 1) return { farge: '#16a34a', ikon: '●' }
  if (score === 2) return { farge: '#65a30d', ikon: '●' }
  if (score === 3) return { farge: '#ca8a04', ikon: '●' }
  if (score === 4) return { farge: '#ea580c', ikon: '●' }
  return { farge: '#dc2626', ikon: '●' }
}

function profileRating(profile: string | null, w: any) {
  const wind = w.windNow, windMax = w.windMax, wave = w.avgWave, period = w.avgPeriod
  const precip = w.totalPrecip ?? 0
  let score: number
  let tekst: string

  if (profile === 'surfer') {
    // Offshore-retninger på norsk vestkyst (vind fra land = rene bølger)
    const offshoreDir = ['N','NNO','NO','ONO','O','OSO']
    const windDirLabel = w.windDirLabel ?? dir(w.windDir ?? 0)
    const isOffshore = offshoreDir.includes(windDirLabel)
    const isOnshore = ['SV','VSV','V','VNV','S','SSV'].includes(windDirLabel)

    if (wave < 0.3) { score = 0; tekst = 'For små bølger' }
    else if (period < 6) { score = 4; tekst = 'For kort periode — rotete swell' }
    else if (isOnshore && wind > 6) { score = 4; tekst = 'Onshore vind — ødelegger bølgene' }
    else if (wave >= 0.5 && wave <= 2.5 && period >= 9 && wind < 8 && isOffshore) { score = 1; tekst = 'Perfekte surfeforhold!' }
    else if (wave >= 0.5 && wave <= 3.0 && period >= 7 && wind < 10) { score = 2; tekst = 'Gode surfeforhold' }
    else if (wave >= 3.5 || windMax >= 15) { score = 5; tekst = 'Farlig — stor sjø og sterk vind' }
    else if (wave >= 2.5 || isOnshore) { score = 3; tekst = 'Krevende — kun erfarne' }
    else { score = 3; tekst = 'Akseptabelt — kun erfarne' }
  } else if (profile === 'seiler') {
    if (wind < 3) { score = 0; tekst = 'For lite vind' }
    else if (windMax >= 24.5 || wave >= 4.0) { score = 5; tekst = 'Farlige forhold — bli i havn' }
    else if (windMax >= 20.8 || wave >= 3.0) { score = 4; tekst = 'Krevende — erfarne seglere' }
    else if (wind >= 8 && wind <= 15 && windMax < 18 && wave < 1.5) { score = 1; tekst = 'Perfekte seilingsforhold!' }
    else if (wind >= 5 && wind <= 18 && windMax < 20) { score = 2; tekst = 'Gode seilingsforhold' }
    else { score = 3; tekst = 'Akseptable forhold — vær oppmerksom' }
  } else if (profile === 'fisker') {
    if (windMax >= 24.5 || wave >= 3.0) { score = 5; tekst = 'Farlige forhold — frarådes' }
    else if (windMax >= 13.9 || wave >= 2.0) { score = 4; tekst = 'Krevende fiskeforhold' }
    else if (windMax < 8 && wave < 0.8) { score = 1; tekst = 'Perfekte fiskeforhold!' }
    else if (windMax < 10.8 && wave < 1.5) { score = 2; tekst = 'Gode fiskeforhold' }
    else { score = 3; tekst = 'Akseptable fiskeforhold' }
  } else if (profile === 'kajakk') {
    if (windMax >= 13.9 || wave >= 1.5) { score = 5; tekst = 'Farlige forhold — frarådes' }
    else if (windMax >= 10.8 || wave >= 1.0) { score = 4; tekst = 'Krevende — kun erfarne' }
    else if (wind < 4 && wave < 0.4) { score = 1; tekst = 'Perfekte padleforhold!' }
    else if (wind < 7 && wave < 0.7) { score = 2; tekst = 'Gode padleforhold' }
    else { score = 3; tekst = 'Akseptabelt — vær oppmerksom' }
  } else if (profile === 'fridykker') {
    const st = w.seaTemp
    if (windMax >= 13.9 || wave >= 1.5) { score = 5; tekst = 'Farlige forhold — frarådes' }
    else if (windMax >= 8.0 || wave >= 0.8) { score = 4; tekst = 'Krevende — for urolig' }
    else if (wave < 0.3 && wind < 4 && st !== null && st >= 14) { score = 1; tekst: 'Perfekte dykkforhold!' }
    else if (wave < 0.5 && wind < 6) { score = 2; tekst = 'Gode dykkforhold' }
    else { score = 3; tekst = 'Akseptabelt — vær oppmerksom' }
  } else if (profile === 'familie') {
    if (windMax >= 13.9 || wave >= 2.0) { score = 5; tekst = 'Farlige forhold — frarådes' }
    else if (windMax >= 10.8 || wave >= 1.2) { score = 4; tekst = 'Krevende — ikke trygt for barn' }
    else if (wave < 0.5 && wind < 6) { score = 1; tekst = 'Perfekt for familien!' }
    else if (wave < 0.8 && wind < 8) { score = 2; tekst = 'Rolig og trygt' }
    else { score = 3; tekst = 'Akseptabelt — hold ungene nær land' }
  } else if (profile === 'baatforer') {
    if (windMax >= 24.5 || wave >= 4.0) { score = 5; tekst = 'Farlige forhold — bli i havn' }
    else if (windMax >= 20.8 || wave >= 3.0) { score = 4; tekst = 'Krevende navigasjonsforhold' }
    else if (windMax < 8 && wave < 0.8) { score = 1; tekst = 'Perfekte navigasjonsforhold!' }
    else if (windMax < 14 && wave < 1.5) { score = 2; tekst = 'Gode navigasjonsforhold' }
    else { score = 3; tekst = 'Akseptable forhold — vær oppmerksom' }
  } else {
    // Standard / ingen profil
    if (windMax >= 24.5 || wave >= 4.0) { score = 5; tekst = 'Farlige forhold — frarådes' }
    else if (windMax >= 13.9 || wave >= 2.0) { score = 4; tekst = 'Krevende forhold' }
    else if (wave < 0.5 && windMax < 8) { score = 1; tekst = 'Perfekte forhold' }
    else if (wave < 1.5 && windMax < 13) { score = 2; tekst = 'Gode forhold' }
    else { score = 3; tekst = 'Akseptable forhold — vær oppmerksom' }
  }

  const { farge } = fareIndikator(score)

  // Nedbør overstyrer aldri farefargen oppover, men kan trekke ned scoren
  if (precip >= 10 && score < 3) { score = 3; tekst = 'Mye nedbør — ta regntøy' }
  else if (precip >= 20 && score < 4) { score = 4; tekst = 'Kraftig nedbør — ikke ideelt' }
  else if (precip >= 5 && score < 2) { score = 2; tekst = tekst + ' — noe nedbør' }

  const { farge: fargeFinal } = fareIndikator(score)
  return { score, tekst, farge: fargeFinal }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') ?? '0')
  const lon = parseFloat(searchParams.get('lon') ?? '0')
  const profile = searchParams.get('profile') || null
  const days = parseInt(searchParams.get('days') ?? '1')

  if (!lat || !lon) return NextResponse.json({ error: 'Mangler koordinater' }, { status: 400 })

  const tLat = truncCoord(lat), tLon = truncCoord(lon)

  const [marineRes, metRes, sstRes, bw] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${tLat}&longitude=${tLon}&hourly=wave_height,wave_direction,wave_period&timezone=Europe/Oslo&forecast_days=${days}`).catch(() => null),
    fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${tLat}&lon=${tLon}`, { headers: MET_HEADERS }),
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${tLat}&longitude=${tLon}&current=sea_surface_temperature&timezone=Europe/Oslo`).catch(() => null),
    fetchBarentsWatchForecast(tLat, tLon).catch(() => ({ wave: [] as BwWavePoint[], wind: [] as BwWindPoint[] })),
  ])

  const [marine, met, sst] = await Promise.all([
    marineRes?.ok ? marineRes.json() : Promise.resolve({}),
    metRes.json(),
    sstRes?.ok ? sstRes.json() : Promise.resolve({}),
  ])

  // Index BarentsWatch data by hour for easy lookup
  const bwWaveByHour: Record<string, BwWavePoint> = {}
  for (const p of bw.wave) {
    if (p.forecastTime) bwWaveByHour[p.forecastTime.slice(0, 13)] = p
  }
  const bwWindByHour: Record<string, BwWindPoint> = {}
  for (const p of bw.wind) {
    if (p.forecastTime) bwWindByHour[p.forecastTime.slice(0, 13)] = p
  }

  const hours: string[] = marine.hourly?.time ?? []
  const wH: number[] = marine.hourly?.wave_height ?? []
  const wD: number[] = marine.hourly?.wave_direction ?? []
  const wP: number[] = marine.hourly?.wave_period ?? []
  const ts: any[] = met.properties?.timeseries ?? []

  // Bygg daglig data
  const dailyData = []
  for (let day = 0; day < days; day++) {
    const d = new Date(); d.setDate(d.getDate() + day)
    const dateStr = d.toISOString().slice(0, 10)

    const dayIdx = hours.map((t, i) => ({ t, i })).filter(({ t }) => {
      const h = new Date(t).getHours(); return t.startsWith(dateStr) && h >= 6 && h <= 20
    })

    // BarentsWatch wave data for this day (prefer over Open-Meteo for Norwegian coast)
    const bwDayWave = bw.wave.filter(p => p.forecastTime?.startsWith(dateStr) &&
      new Date(p.forecastTime!).getHours() >= 6 && new Date(p.forecastTime!).getHours() <= 20)
    const hasBw = bwDayWave.length > 0

    const avgWave = hasBw
      ? bwDayWave.reduce((s, p) => s + (p.totalSignificantWaveHeight ?? 0), 0) / bwDayWave.length
      : dayIdx.reduce((s, { i }) => s + (wH[i] ?? 0), 0) / (dayIdx.length || 1)
    const maxWave = hasBw
      ? Math.max(0, ...bwDayWave.map(p => p.expectedMaximumWaveHeight ?? p.totalSignificantWaveHeight ?? 0))
      : Math.max(0, ...dayIdx.map(({ i }) => wH[i] ?? 0))
    const avgPeriod = hasBw
      ? bwDayWave.reduce((s, p) => s + (p.totalPeakPeriod ?? 0), 0) / bwDayWave.length
      : dayIdx.reduce((s, { i }) => s + (wP[i] ?? 0), 0) / (dayIdx.length || 1)
    const midI = dayIdx[Math.floor(dayIdx.length / 2)]?.i ?? 0

    // BarentsWatch wind gust data for windMax (supplements met.no)
    const bwDayWind = bw.wind.filter(p => p.forecastTime?.startsWith(dateStr))
    const bwGustMax = bwDayWind.length > 0
      ? Math.max(0, ...bwDayWind.map(p => p.windSpeedOfGust ?? p.windSpeed ?? 0))
      : 0

    const dayTs = ts.filter(t => t.time?.startsWith(dateStr))
    const metWindMax = Math.max(0, ...dayTs.map(t => t.data?.instant?.details?.wind_speed ?? 0))
    const windMax = Math.max(metWindMax, bwGustMax)
    const noon = dayTs.find(t => t.time?.includes('T09:')) ?? dayTs[0]
    const windNow = noon?.data?.instant?.details?.wind_speed ?? 0
    const windDir = noon?.data?.instant?.details?.wind_from_direction ?? 0
    const temp = noon?.data?.instant?.details?.air_temperature ?? 0

    // Nedbør: summer next_1_hours precipitation for hele dagen
    const totalPrecip = dayTs.reduce((sum, t) => {
      return sum + (t.data?.next_1_hours?.details?.precipitation_amount ?? 0)
    }, 0)
    // Sjekk om det er signifikant nedbør (over 1mm totalt)
    const precipDesc = totalPrecip < 1 ? null : totalPrecip < 5 ? `${totalPrecip.toFixed(1)}mm lett nedbør` : totalPrecip < 15 ? `${totalPrecip.toFixed(1)}mm moderat nedbør` : `${totalPrecip.toFixed(1)}mm kraftig nedbør`

    const keyHours = [6, 9, 12, 15, 18, 21]
    const hourly = keyHours.map(hr => {
      const hrStr = String(hr).padStart(2, '0')
      const bwKey = `${dateStr}T${hrStr}`
      const bwW = bwWaveByHour[bwKey]
      const bwWi = bwWindByHour[bwKey]
      const idx = hours.findIndex(t => t.startsWith(`${dateStr}T${hrStr}:00`))
      const mi = ts.findIndex(t => t.time?.startsWith(`${dateStr}T${hrStr}:`))
      return {
        time: `${hrStr}:00`,
        wave: bwW?.totalSignificantWaveHeight ?? (idx >= 0 ? (wH[idx] ?? 0) : 0),
        waveDir: bwW?.totalMeanWaveDirection ?? (idx >= 0 ? (wD[idx] ?? 0) : 0),
        period: bwW?.totalPeakPeriod ?? (idx >= 0 ? (wP[idx] ?? 0) : 0),
        wind: mi >= 0 ? (ts[mi]?.data?.instant?.details?.wind_speed ?? 0) : 0,
        gust: bwWi?.windSpeedOfGust ?? null,
        windDir: mi >= 0 ? (ts[mi]?.data?.instant?.details?.wind_from_direction ?? 0) : 0,
        temp: mi >= 0 ? (ts[mi]?.data?.instant?.details?.air_temperature ?? 0) : 0,
        symbol: mi >= 0 ? (ts[mi]?.data?.next_1_hours?.summary?.symbol_code ?? ts[mi]?.data?.next_6_hours?.summary?.symbol_code ?? '') : '',
        source: bwW ? 'barentswatch' : 'open-meteo',
      }
    })

    const waveDirDeg = hasBw
      ? (bwDayWave[Math.floor(bwDayWave.length / 2)]?.totalMeanWaveDirection ?? wD[midI] ?? 0)
      : (wD[midI] ?? 0)
    const w = { avgWave, maxWave, avgPeriod, waveDir: waveDirDeg, windNow, windDir, windMax, temp, seaTemp: sst.current?.sea_surface_temperature ?? null, totalPrecip }
    const rating = profileRating(profile, w)

    const bestH = hourly.reduce((b, h) => {
      const hs = h.wave + h.wind * 0.1
      const bs = b.wave + b.wind * 0.1
      return hs < bs ? h : b
    }, hourly[0])

    const sunTimes = getSunTimes(tLat, tLon, dateStr)

    dailyData.push({
      date: dateStr,
      dateLabel: d.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' }),
      ...w,
      windDesc: windDesc(windNow),
      waveDir: dir(waveDirDeg),
      windDirLabel: dir(windDir),
      rating,
      hourly,
      bestTime: bestH?.time ?? '—',
      waveSource: hasBw ? 'barentswatch' : 'open-meteo',
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      totalPrecip: Math.round(totalPrecip * 10) / 10,
      precipDesc,
    })
  }

  return NextResponse.json({ ok: true, days: dailyData })
}
