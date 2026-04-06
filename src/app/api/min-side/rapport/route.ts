export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

function profileRating(profile: string | null, w: any) {
  const wind = w.windNow, windMax = w.windMax, wave = w.avgWave, period = w.avgPeriod
  if (profile === 'surfer') {
    if (wave < 0.3) return { score: 0, tekst: 'For små bølger', farge: '#94a3b8' }
    if (wave >= 0.5 && wave <= 2.5 && period >= 9 && wind < 8) return { score: 5, tekst: 'Perfekte surfeforhold!', farge: '#16a34a' }
    if (wave >= 0.5 && wave <= 3.0 && period >= 7 && wind < 12) return { score: 4, tekst: 'Bra surfeforhold', farge: '#65a30d' }
    if (wave >= 0.3 && wind < 15) return { score: 3, tekst: 'Greit for erfarne', farge: '#ca8a04' }
    return { score: 2, tekst: 'Middels forhold', farge: '#ca8a04' }
  }
  if (profile === 'seiler') {
    if (wind < 3) return { score: 0, tekst: 'For lite vind', farge: '#94a3b8' }
    if (windMax >= 20.8 || wave >= 3.0) return { score: 1, tekst: 'Bli i havn', farge: '#dc2626' }
    if (wind >= 8 && wind <= 15 && windMax < 18 && wave < 1.5) return { score: 5, tekst: 'Perfekte seilingsforhold!', farge: '#16a34a' }
    if (wind >= 5 && wind <= 18 && windMax < 20) return { score: 4, tekst: 'Gode seilingsforhold', farge: '#65a30d' }
    return { score: 3, tekst: 'Akseptable forhold', farge: '#ca8a04' }
  }
  if (profile === 'fisker') {
    if (windMax >= 13.9 || wave >= 2.0) return { score: 1, tekst: 'Ikke anbefalt', farge: '#dc2626' }
    if (windMax < 8 && wave < 0.8) return { score: 5, tekst: 'Perfekte fiskeforhold', farge: '#16a34a' }
    if (windMax < 10.8 && wave < 1.5) return { score: 4, tekst: 'Gode fiskeforhold', farge: '#65a30d' }
    return { score: 3, tekst: 'Akseptable fiskeforhold', farge: '#ca8a04' }
  }
  if (profile === 'kajakk') {
    if (windMax >= 10.8 || wave >= 1.0) return { score: 1, tekst: 'Ikke anbefalt', farge: '#dc2626' }
    if (wind < 4 && wave < 0.4) return { score: 5, tekst: 'Perfekte padleforhold!', farge: '#16a34a' }
    if (wind < 7 && wave < 0.7) return { score: 4, tekst: 'Gode padleforhold', farge: '#65a30d' }
    return { score: 3, tekst: 'Kun erfarne padlere', farge: '#ca8a04' }
  }
  if (profile === 'fridykker') {
    const st = w.seaTemp
    if (windMax >= 8.0 || wave >= 0.8) return { score: 1, tekst: 'For urolig', farge: '#dc2626' }
    if (wave < 0.3 && wind < 4 && st !== null && st >= 14) return { score: 5, tekst: 'Perfekte dykkforhold!', farge: '#16a34a' }
    if (wave < 0.5 && wind < 6) return { score: 4, tekst: 'Gode dykkforhold', farge: '#65a30d' }
    return { score: 3, tekst: 'Akseptabelt', farge: '#ca8a04' }
  }
  if (profile === 'familie') {
    if (windMax >= 10.8 || wave >= 1.2) return { score: 1, tekst: 'Ikke trygt for barn', farge: '#dc2626' }
    if (wave < 0.5 && wind < 6) return { score: 5, tekst: 'Perfekt for familien!', farge: '#16a34a' }
    if (wave < 0.8 && wind < 8) return { score: 4, tekst: 'Rolig og trygt', farge: '#65a30d' }
    return { score: 3, tekst: 'Hold ungene nær land', farge: '#ca8a04' }
  }
  if (profile === 'baatforer') {
    if (windMax >= 20.8 || wave >= 3.0) return { score: 1, tekst: 'Bli i havn', farge: '#dc2626' }
    if (windMax < 8 && wave < 0.8) return { score: 5, tekst: 'Utmerkede forhold', farge: '#16a34a' }
    return { score: 4, tekst: 'Gode seilingsforhold', farge: '#65a30d' }
  }
  // Standard
  if (windMax >= 24.5 || wave >= 4.0) return { score: 5, tekst: 'FAREVARSEL', farge: '#dc2626' }
  if (windMax >= 13.9 || wave >= 2.0) return { score: 3, tekst: 'Kuling ventes', farge: '#ea580c' }
  if (wave < 0.5 && windMax < 8) return { score: 1, tekst: 'Stille hav', farge: '#16a34a' }
  return { score: 2, tekst: 'Moderat sjø', farge: '#ca8a04' }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get('lat') ?? '0')
  const lon = parseFloat(searchParams.get('lon') ?? '0')
  const profile = searchParams.get('profile') || null
  const days = parseInt(searchParams.get('days') ?? '1')

  if (!lat || !lon) return NextResponse.json({ error: 'Mangler koordinater' }, { status: 400 })

  const tLat = truncCoord(lat), tLon = truncCoord(lon)

  const [marineRes, metRes, sstRes] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${tLat}&longitude=${tLon}&hourly=wave_height,wave_direction,wave_period&timezone=Europe/Oslo&forecast_days=${days}`).catch(() => null),
    fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${tLat}&lon=${tLon}`, { headers: MET_HEADERS }),
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${tLat}&longitude=${tLon}&current=sea_surface_temperature&timezone=Europe/Oslo`).catch(() => null),
  ])

  const [marine, met, sst] = await Promise.all([
    marineRes?.ok ? marineRes.json() : Promise.resolve({}),
    metRes.json(),
    sstRes?.ok ? sstRes.json() : Promise.resolve({}),
  ])

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

    const avgWave = dayIdx.reduce((s, { i }) => s + (wH[i] ?? 0), 0) / (dayIdx.length || 1)
    const maxWave = Math.max(0, ...dayIdx.map(({ i }) => wH[i] ?? 0))
    const avgPeriod = dayIdx.reduce((s, { i }) => s + (wP[i] ?? 0), 0) / (dayIdx.length || 1)
    const midI = dayIdx[Math.floor(dayIdx.length / 2)]?.i ?? 0

    const dayTs = ts.filter(t => t.time?.startsWith(dateStr))
    const windMax = Math.max(0, ...dayTs.map(t => t.data?.instant?.details?.wind_speed ?? 0))
    const noon = dayTs.find(t => t.time?.includes('T09:')) ?? dayTs[0]
    const windNow = noon?.data?.instant?.details?.wind_speed ?? 0
    const windDir = noon?.data?.instant?.details?.wind_from_direction ?? 0
    const temp = noon?.data?.instant?.details?.air_temperature ?? 0

    const keyHours = [6, 9, 12, 15, 18, 21]
    const hourly = keyHours.map(hr => {
      const idx = hours.findIndex(t => t.startsWith(`${dateStr}T${String(hr).padStart(2, '0')}:00`))
      const mi = ts.findIndex(t => t.time?.startsWith(`${dateStr}T${String(hr).padStart(2, '0')}:`))
      return {
        time: `${String(hr).padStart(2, '0')}:00`,
        wave: idx >= 0 ? (wH[idx] ?? 0) : 0,
        waveDir: idx >= 0 ? (wD[idx] ?? 0) : 0,
        period: idx >= 0 ? (wP[idx] ?? 0) : 0,
        wind: mi >= 0 ? (ts[mi]?.data?.instant?.details?.wind_speed ?? 0) : 0,
        windDir: mi >= 0 ? (ts[mi]?.data?.instant?.details?.wind_from_direction ?? 0) : 0,
        temp: mi >= 0 ? (ts[mi]?.data?.instant?.details?.air_temperature ?? 0) : 0,
        symbol: mi >= 0 ? (ts[mi]?.data?.next_1_hours?.summary?.symbol_code ?? ts[mi]?.data?.next_6_hours?.summary?.symbol_code ?? '') : '',
      }
    })

    const w = { avgWave, maxWave, avgPeriod, waveDir: wD[midI] ?? 0, windNow, windDir, windMax, temp, seaTemp: sst.current?.sea_surface_temperature ?? null }
    const rating = profileRating(profile, w)

    // Best tidspunkt
    const bestH = hourly.reduce((b, h) => {
      const hs = h.wave + h.wind * 0.1
      const bs = b.wave + b.wind * 0.1
      return hs < bs ? h : b
    }, hourly[0])

    dailyData.push({
      date: dateStr,
      dateLabel: d.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' }),
      ...w,
      windDesc: windDesc(windNow),
      waveDir: dir(wD[midI] ?? 0),
      windDirLabel: dir(windDir),
      rating,
      hourly,
      bestTime: bestH?.time ?? '—',
    })
  }

  return NextResponse.json({ ok: true, days: dailyData })
}
