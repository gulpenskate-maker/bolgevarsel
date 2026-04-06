'use client'
import React, { useState } from 'react'

type Loc = { id: string; name: string; lat: number; lon: number }

const PROFILER = [
  { value: '', label: 'Standard rapport' },
  { value: 'surfer', label: 'Surfer' },
  { value: 'kitesurfer', label: 'Kitesurfer' },
  { value: 'windsurfer', label: 'Windsurfer' },
  { value: 'seiler', label: 'Seiler' },
  { value: 'fisker', label: 'Fisker' },
  { value: 'familie', label: 'Barn/ungdom med båt' },
  { value: 'baatforer', label: 'Båtfører' },
  { value: 'kajakk', label: 'Padler / kajakk' },
  { value: 'fridykker', label: 'Fridykker / snorkling' },
]

const PERIODER = [
  { value: '1', label: 'I dag' },
  { value: '2', label: 'I dag + i morgen' },
  { value: '3', label: 'Neste 3 dager' },
  { value: '7', label: 'Denne uken' },
]

const SCORE_COLORS = ['#94a3b8', '#16a34a', '#65a30d', '#ca8a04', '#ea580c', '#dc2626']

function WeatherIcon({ symbol, size = 16 }: { symbol: string; size?: number }) {
  const s = symbol.replace('_night', '').replace('_day', '').replace('_polartwilight', '')
  if (s === 'clearsky') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" fill="#f59e0b"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i} x1={8+Math.cos(deg*Math.PI/180)*4.2} y1={8+Math.sin(deg*Math.PI/180)*4.2}
          x2={8+Math.cos(deg*Math.PI/180)*5.5} y2={8+Math.sin(deg*Math.PI/180)*5.5}
          stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round"/>
      ))}
    </svg>
  )
  if (s === 'fair' || s === 'partlycloudy') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="6" r="2.5" fill="#f59e0b"/>
      <ellipse cx="9.5" cy="10" rx="4" ry="2.5" fill="#94a3b8"/>
      <ellipse cx="7" cy="11" rx="3" ry="2" fill="#94a3b8"/>
    </svg>
  )
  if (s === 'cloudy' || s === 'fog') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <ellipse cx="9" cy="8" rx="5" ry="3.5" fill="#94a3b8"/>
      <ellipse cx="6" cy="9.5" rx="4" ry="3" fill="#94a3b8"/>
    </svg>
  )
  if (s.includes('rain') || s.includes('shower') || s === 'drizzle') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="6" rx="5.5" ry="3.5" fill="#475569"/>
      <path d="M4 10.5L3 13.5M7.5 10.5L6.5 13.5M11 10.5L10 13.5" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
  if (s.includes('thunder')) return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="5.5" rx="5.5" ry="3" fill="#475569"/>
      <path d="M8.5 8.5L6.5 12L8 12L7 15L10 10.5L8.5 10.5Z" fill="#fbbf24"/>
    </svg>
  )
  if (s.includes('snow') || s.includes('sleet')) return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="6" rx="5" ry="3.5" fill="#94a3b8"/>
      <circle cx="5" cy="11.5" r="1" fill="white" stroke="#94a3b8" strokeWidth="0.8"/>
      <circle cx="8" cy="12.5" r="1" fill="white" stroke="#94a3b8" strokeWidth="0.8"/>
      <circle cx="11" cy="11.5" r="1" fill="white" stroke="#94a3b8" strokeWidth="0.8"/>
    </svg>
  )
  return null
}

function HourlyBars({ hourly }: { hourly: any[] }) {
  const [hov, setHov] = useState<number | null>(null)
  const maxW = Math.max(...hourly.map(h => h.wave), 0.1)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ fontSize: 10, color: '#6b8fa3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bølgehøyde per time</div>
        {hov !== null && (
          <div style={{ fontSize: 11, fontWeight: 500, color: SCORE_COLORS[Math.min(Math.floor(hourly[hov].wave * 2), 5)] }}>
            {hourly[hov].time} · {hourly[hov].wave.toFixed(1)}m · {hourly[hov].wind.toFixed(1)} m/s
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
        {hourly.map((h, i) => {
          const pct = Math.max((h.wave / maxW) * 100, 4)
          const isHov = hov === i
          const color = h.wave < 0.5 ? '#16a34a' : h.wave < 1.5 ? '#65a30d' : h.wave < 2.5 ? '#ca8a04' : '#dc2626'
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end', cursor: 'pointer' }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <div style={{ opacity: hov === null || isHov ? 1 : 0.4, transition: '0.15s', marginBottom: 1 }}>
                <WeatherIcon symbol={h.symbol} size={13} />
              </div>
              <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: color, height: `${pct.toFixed(0)}%`, minHeight: 3,
                opacity: hov === null || isHov ? 1 : 0.4, transform: isHov ? 'scaleY(1.06)' : 'scaleY(1)', transformOrigin: 'bottom', transition: '0.15s' }} />
              <div style={{ fontSize: 9, color: isHov ? '#0a2a3d' : '#6b8fa3', fontWeight: isHov ? 500 : 400 }}>{h.time.slice(0, 5)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayCard({ day }: { day: any }) {
  const r = day.rating
  return (
    <div style={{ background: '#f8fbfc', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#0a2a3d', textTransform: 'capitalize' }}>{day.dateLabel}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: r.farge + '20', color: r.farge }}>{r.tekst}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginBottom: 12 }}>
        {[
          { label: 'Bølger snitt', val: `${day.avgWave.toFixed(1)}m`, sub: `maks ${day.maxWave.toFixed(1)}m` },
          { label: 'Vind', val: `${day.windNow.toFixed(1)} m/s`, sub: day.windDesc },
          { label: 'Periode / retning', val: `${day.avgPeriod.toFixed(0)}s`, sub: day.waveDir },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#6b8fa3', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 300, color: '#0a2a3d' }}>{s.val}</div>
            <div style={{ fontSize: 10, color: '#6b8fa3', marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <HourlyBars hourly={day.hourly} />
      <div>
        {[
          { label: 'Best tidspunkt', val: `${day.bestTime} — roligst`, green: true },
          { label: 'Lufttemperatur', val: `${Math.round(day.temp)}°C` },
          ...(day.seaTemp !== null ? [{ label: 'Sjøtemperatur', val: `${day.seaTemp.toFixed(1)}°C` }] : []),
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: i === 0 ? 'none' : '0.5px solid rgba(10,42,61,0.07)' }}>
            <span style={{ fontSize: 12, color: '#6b8fa3' }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: row.green ? '#16a34a' : '#0a2a3d' }}>{row.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RapportTab({ locs, subEmail }: { locs: Loc[]; subEmail: string }) {
  const [locId, setLocId] = useState(locs[0]?.id ?? '')
  const [days, setDays] = useState('1')
  const [profile, setProfile] = useState('')
  const [loading, setLoading] = useState(false)
  const [rapport, setRapport] = useState<any[] | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const selectedLoc = locs.find(l => l.id === locId)

  async function generer() {
    if (!selectedLoc) return
    setLoading(true); setRapport(null); setEmailSent(false)
    try {
      const r = await fetch(`/api/min-side/rapport?lat=${selectedLoc.lat}&lon=${selectedLoc.lon}&days=${days}&profile=${profile}`)
      const d = await r.json()
      if (d.ok) setRapport(d.days)
    } finally { setLoading(false) }
  }

  async function sendEmail() {
    if (!rapport || !selectedLoc) return
    setSendingEmail(true)
    try {
      await fetch('/api/min-side/rapport-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail, locName: selectedLoc.name, profile, days: rapport }),
      })
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3000)
    } finally { setSendingEmail(false) }
  }

  function printRapport() {
    window.print()
  }

  const S = {
    inp: { width: '100%', padding: '8px 12px', borderRadius: 8, border: '0.5px solid rgba(10,42,61,0.12)', background: '#f8fbfc', fontSize: 13, color: '#0a2a3d', outline: 'none' } as React.CSSProperties,
    btnP: { background: '#0a2a3d', color: 'white', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' } as React.CSSProperties,
    btnG: { background: '#f8fbfc', color: '#0a2a3d', border: '0.5px solid rgba(10,42,61,0.12)', borderRadius: 8, padding: '9px 12px', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  }

  return (
    <div>
      {/* Konfigurasjon */}
      <div style={{ background: '#f8fbfc', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="#1a6080" strokeWidth="1.2" fill="none"/><path d="M1 5.5h12" stroke="#1a6080" strokeWidth="1.2"/><path d="M4.5 1v2M9.5 1v2" stroke="#1a6080" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0a2a3d' }}>Generer rapport</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b8fa3', marginBottom: 3 }}>Lokasjon</div>
            <select style={S.inp} value={locId} onChange={e => setLocId(e.target.value)}>
              {locs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6b8fa3', marginBottom: 3 }}>Periode</div>
            <select style={S.inp} value={days} onChange={e => setDays(e.target.value)}>
              {PERIODER.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#6b8fa3', marginBottom: 3 }}>Aktivitetsprofil</div>
          <select style={S.inp} value={profile} onChange={e => setProfile(e.target.value)}>
            {PROFILER.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <button style={{ ...S.btnP, width: '100%', opacity: loading ? 0.6 : 1 }} onClick={generer} disabled={loading || !selectedLoc}>
          {loading ? 'Henter data...' : 'Generer rapport'}
        </button>
      </div>

      {/* Rapport */}
      {rapport && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#6b8fa3' }}>{selectedLoc?.name} · {PROFILER.find(p => p.value === profile)?.label || 'Standard'}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={S.btnG} onClick={printRapport}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 4.5V2h7v2.5M2 4.5h9a1 1 0 0 1 1 1v4H10v2H3v-2H1v-4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.1" fill="none"/></svg>
                Last ned PDF
              </button>
              <button style={{ ...S.btnG, opacity: sendingEmail ? 0.6 : 1, color: emailSent ? '#16a34a' : '#0a2a3d' }} onClick={sendEmail} disabled={sendingEmail}>
                {emailSent ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3.5 3.5L11 4" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Sendt!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 2h11l-5 5L1 2z" stroke="currentColor" strokeWidth="1.1" fill="none"/><path d="M1 2v7.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V2" stroke="currentColor" strokeWidth="1.1" fill="none"/></svg>
                    Send til e-post
                  </>
                )}
              </button>
            </div>
          </div>
          {rapport.map((day, i) => <DayCard key={i} day={day} />)}
          <button style={{ ...S.btnG, width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={() => setRapport(null)}>
            Ny rapport
          </button>
        </div>
      )}

      {locs.length === 0 && (
        <p style={{ color: '#6b8fa3', fontSize: 13, textAlign: 'center', padding: '1rem 0' }}>
          Legg til lokasjoner i «Lokasjoner»-fanen for å generere rapporter.
        </p>
      )}
    </div>
  )
}
