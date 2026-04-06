'use client'
import React, { useEffect, useState, useCallback } from 'react'

type Loc = { id: string; name: string; lat: number; lon: number }

type WeatherData = {
  windNow: number; windDir: number; windMax: number
  temp: number; seaTemp: number | null
  avgWave: number; maxWave: number; avgPeriod: number; waveDir: number
  score: number; hourly: HourlyPoint[]
}

type HourlyPoint = {
  time: string; wave: number; waveDir: number; period: number
  wind: number; windDir: number; temp: number
}

const SCORE_COLORS = ['#94a3b8','#16a34a','#65a30d','#ca8a04','#ea580c','#dc2626']
const SCORE_LABELS = ['Rolig hav','Stille hav','Lett krusning','Moderat','Kuling','Farevarsel']

function ratingScore(wave: number, wind: number) {
  if (wind >= 24.5 || wave >= 4.0) return 5
  if (wind >= 20.8 || wave >= 3.0) return 4
  if (wind >= 13.9 || wave >= 2.0) return 3
  if (wind >= 10.8 || wave >= 1.5) return 2
  if (wind >= 8.0  || wave >= 1.0) return 1
  return 0
}

function dir(deg: number) {
  const d = ['N','NNO','NO','ONO','O','OSO','SO','SSO','S','SSV','SV','VSV','V','VNV','NV','NNV']
  return d[Math.round(deg / 22.5) % 16]
}

function windDesc(s: number) {
  if (s < 2) return 'Stille'; if (s < 4) return 'Svak vind'
  if (s < 8) return 'Lett bris'; if (s < 11) return 'Laber bris'
  if (s < 14) return 'Frisk bris'; if (s < 17) return 'Liten kuling'
  return 'Kuling+'
}

function bestTime(hourly: HourlyPoint[]) {
  if (!hourly.length) return '—'
  const best = hourly.reduce((b, h) =>
    ratingScore(h.wave, h.wind) < ratingScore(b.wave, b.wind) ? h : b, hourly[0])
  const s = ratingScore(best.wave, best.wind)
  if (s <= 1) return `${best.time} — roligst`
  if (s <= 2) return `${best.time} — akseptabelt`
  return 'Krevende hele dagen'
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const today = new Date().toISOString().slice(0, 10)
  const tLat = Math.round(lat * 10000) / 10000
  const tLon = Math.round(lon * 10000) / 10000

  // met.no via vår proxy (TOS-compliant)
  // Open-Meteo direkte fra klient (tillatt per deres vilkår)
  const [marineRes, metRes, sstRes] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${tLat}&longitude=${tLon}&hourly=wave_height,wave_direction,wave_period&current=wave_height,wave_period,wave_direction&timezone=Europe/Oslo&forecast_days=1`).catch(() => null),
    fetch(`/api/varsel?lat=${tLat}&lon=${tLon}`),
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

  const keyHours = [6, 9, 12, 15, 18, 21]
  const hourly: HourlyPoint[] = keyHours.map(hr => {
    const idx = hours.findIndex(t => t.startsWith(`${today}T${String(hr).padStart(2, '0')}:00`))
    const mi = ts.findIndex(t => t.time?.startsWith(`${today}T${String(hr).padStart(2, '0')}:`))
    return {
      time: `${String(hr).padStart(2, '0')}:00`,
      wave: idx >= 0 ? (wH[idx] ?? 0) : 0,
      waveDir: idx >= 0 ? (wD[idx] ?? 0) : 0,
      period: idx >= 0 ? (wP[idx] ?? 0) : 0,
      wind: mi >= 0 ? (ts[mi]?.data?.instant?.details?.wind_speed ?? 0) : 0,
      windDir: mi >= 0 ? (ts[mi]?.data?.instant?.details?.wind_from_direction ?? 0) : 0,
      temp: mi >= 0 ? (ts[mi]?.data?.instant?.details?.air_temperature ?? 0) : 0,
    }
  })

  const now = ts[0]
  const windNow = now?.data?.instant?.details?.wind_speed ?? 0
  const windDir = now?.data?.instant?.details?.wind_from_direction ?? 0
  const temp = now?.data?.instant?.details?.air_temperature ?? 0
  const maxWind = Math.max(...ts.slice(0, 24).map(t => t?.data?.instant?.details?.wind_speed ?? 0))

  const dayIdx = hours.map((t, i) => ({ t, i })).filter(({ t }) => {
    const h = new Date(t).getHours()
    return t.startsWith(today) && h >= 6 && h <= 20
  })

  const avgWave = dayIdx.reduce((s, { i }) => s + (wH[i] ?? 0), 0) / (dayIdx.length || 1)
  const maxWave = Math.max(0, ...dayIdx.map(({ i }) => wH[i] ?? 0))
  const avgPeriod = dayIdx.reduce((s, { i }) => s + (wP[i] ?? 0), 0) / (dayIdx.length || 1)
  const midI = dayIdx[Math.floor(dayIdx.length / 2)]?.i ?? 0
  const seaTemp = sst.current?.sea_surface_temperature ?? null
  const score = ratingScore(avgWave, maxWind)

  return { windNow, windDir, windMax: maxWind, temp, seaTemp, avgWave, maxWave, avgPeriod, waveDir: wD[midI] ?? 0, score, hourly }
}

function WaveAnimation() {
  return (
    <svg viewBox="0 0 400 50" preserveAspectRatio="none" style={{ width: '100%', height: 40, display: 'block', marginBottom: 12 }}>
      {[0, 1, 2].map(k => (
        <path key={k}
          d={`M ${k * -133} 28 Q ${k * -133 + 66} ${18 + k * 4} ${k * -133 + 133} 28 Q ${k * -133 + 200} ${38 - k * 3} ${k * -133 + 266} 28 Q ${k * -133 + 333} ${18 + k * 2} ${k * -133 + 400} 28 Q ${k * -133 + 466} ${38 - k * 4} ${k * -133 + 533} 28`}
          fill="none" stroke="#1a6080" strokeWidth={1.5 - k * 0.4} opacity={0.35 - k * 0.1}>
          <animateTransform attributeName="transform" type="translate" from="0 0" to={`${133 + k * 20} 0`} dur={`${3 + k * 1.5}s`} repeatCount="indefinite" />
        </path>
      ))}
      <path d="M 0 40 Q 100 20 200 35 Q 300 50 400 30 L 400 50 L 0 50 Z" fill="#1a6080" opacity="0.06" />
    </svg>
  )
}

function HourlyBars({ hourly }: { hourly: HourlyPoint[] }) {
  const maxWave = Math.max(...hourly.map(h => h.wave), 0.1)
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: 10, color: '#6b8fa3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Bølgehøyde per time i dag</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 70 }}>
        {hourly.map((h, i) => {
          const s = ratingScore(h.wave, h.wind)
          const color = SCORE_COLORS[s]
          const pct = Math.max((h.wave / maxWave) * 100, 4)
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: color, height: `${pct.toFixed(0)}%`, minHeight: 4 }} />
              <div style={{ fontSize: 9, color: '#6b8fa3' }}>{h.time.slice(0, 5)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LokasjonPanel({ locations }: { locations: Loc[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [data, setData] = useState<Record<number, WeatherData | 'loading' | 'error'>>({})

  const loaded = React.useRef<Set<number>>(new Set())

  const load = useCallback(async (i: number) => {
    if (loaded.current.has(i)) return
    loaded.current.add(i)
    setData(prev => ({ ...prev, [i]: 'loading' }))
    try {
      const d = await fetchWeather(locations[i].lat, locations[i].lon)
      setData(prev => ({ ...prev, [i]: d }))
    } catch(e) {
      console.error('fetchWeather feil for', locations[i].name, e)
      setData(prev => ({ ...prev, [i]: 'error' }))
    }
  }, [locations])

  useEffect(() => {
    locations.forEach((_, i) => load(i))
  }, [locations, load])

  const toggle = (i: number) => {
    setActiveIdx(prev => prev === i ? null : i)
    load(i)
  }

  const S = {
    card: { background: 'white', border: '0.5px solid rgba(10,42,61,0.08)', borderRadius: 14, overflow: 'hidden' as const, marginBottom: 10 },
    row: (active: boolean): React.CSSProperties => ({
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.9rem 1.1rem', cursor: 'pointer',
      borderBottom: active ? '0.5px solid rgba(10,42,61,0.08)' : 'none',
      background: active ? '#f8fbfc' : 'white',
    }),
    panel: { padding: '1.1rem 1.2rem' },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: '1rem' },
    stat: { background: '#f8fbfc', borderRadius: 8, padding: '9px 10px', textAlign: 'center' as const },
    detailRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '0.5px solid rgba(10,42,61,0.06)' } as React.CSSProperties,
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '0.8rem' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'bvPulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: 12, color: '#6b8fa3' }}>Live sjødata — klikk en lokasjon for detaljer</span>
      </div>
      <style>{`@keyframes bvPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

      {locations.map((loc, i) => {
        const d = data[i]
        const score = d && d !== 'loading' && d !== 'error' ? (d as WeatherData).score : -1
        const color = score >= 0 ? SCORE_COLORS[score] : '#e2e8f0'
        const label = score >= 0 ? SCORE_LABELS[score] : (d === 'loading' || d === undefined ? 'Laster...' : '—')
        const isActive = activeIdx === i
        const wd = isActive && d && d !== 'loading' && d !== 'error' ? d as WeatherData : null

        return (
          <div key={loc.id} style={S.card}>
            <div style={S.row(isActive)} onClick={() => toggle(i)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#e8f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.8 1 3 2.8 3 5C3 7.8 7 13 7 13C7 13 11 7.8 11 5C11 2.8 9.2 1 7 1Z" stroke="#1a6080" strokeWidth="1.2" fill="none"/><circle cx="7" cy="5" r="1.3" fill="#1a6080"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0a2a3d' }}>{loc.name}</div>
                  <div style={{ fontSize: 11, color: '#6b8fa3' }}>{loc.lat.toFixed(4)}°N · {loc.lon.toFixed(4)}°E</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color }}>{label}</span>
                </div>
                <svg style={{ color: '#94a3b8', transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {isActive && (
              <div style={S.panel}>
                {d === 'loading' && <div style={{ textAlign: 'center', color: '#6b8fa3', fontSize: 13, padding: '1rem 0' }}>Henter data...</div>}
                {d === 'error' && <div style={{ textAlign: 'center', color: '#dc2626', fontSize: 13, padding: '1rem 0' }}>Kunne ikke hente data</div>}
                {wd && (<>
                  <div style={S.statGrid}>
                    <div style={S.stat}>
                      <div style={{ fontSize: 10, color: '#6b8fa3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Bølger snitt</div>
                      <div style={{ fontSize: 22, fontWeight: 300, color: '#0a2a3d', lineHeight: 1 }}>{wd.avgWave.toFixed(1)}<span style={{ fontSize: 12, color: '#6b8fa3' }}>m</span></div>
                      <div style={{ fontSize: 11, color: '#6b8fa3', marginTop: 2 }}>maks {wd.maxWave.toFixed(1)}m</div>
                    </div>
                    <div style={S.stat}>
                      <div style={{ fontSize: 10, color: '#6b8fa3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Vind nå</div>
                      <div style={{ fontSize: 22, fontWeight: 300, color: '#0a2a3d', lineHeight: 1 }}>{wd.windNow.toFixed(1)}<span style={{ fontSize: 12, color: '#6b8fa3' }}>m/s</span></div>
                      <div style={{ fontSize: 11, color: '#6b8fa3', marginTop: 2 }}>{windDesc(wd.windNow)}</div>
                    </div>
                    <div style={S.stat}>
                      <div style={{ fontSize: 10, color: '#6b8fa3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Luft / sjø</div>
                      <div style={{ fontSize: 22, fontWeight: 300, color: '#0a2a3d', lineHeight: 1 }}>{Math.round(wd.temp)}<span style={{ fontSize: 12, color: '#6b8fa3' }}>°</span></div>
                      <div style={{ fontSize: 11, color: '#6b8fa3', marginTop: 2 }}>{wd.seaTemp !== null ? `Sjø ${wd.seaTemp.toFixed(1)}°` : '—'}</div>
                    </div>
                  </div>

                  <HourlyBars hourly={wd.hourly} />
                  <WaveAnimation />

                  <div>
                    {[
                      { icon: '~', label: 'Bølgeretning', val: `${dir(wd.waveDir)} · ${wd.avgPeriod.toFixed(0)}s periode` },
                      { icon: '→', label: 'Vind', val: `${dir(wd.windDir)} · maks ${wd.windMax.toFixed(1)} m/s` },
                      { icon: '◎', label: 'Best tidspunkt', val: bestTime(wd.hourly), green: true },
                    ].map((row, j) => (
                      <div key={j} style={{ ...S.detailRow, ...(j === 0 ? { borderTop: 'none' } : {}) }}>
                        <span style={{ fontSize: 13, color: '#6b8fa3' }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: row.green ? '#16a34a' : '#0a2a3d' }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </>)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
