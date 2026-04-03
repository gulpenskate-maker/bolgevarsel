'use client'
import { useState, useEffect, useRef } from 'react'

const WIND_DIRS = ['N','NØ','Ø','SØ','S','SV','V','NV']
function degToDir(deg: number) { return WIND_DIRS[Math.round(deg / 45) % 8] }
function assess(h: number, w: number) {
  if (h <= 0.3 && w <= 3) return { text: 'Flott dag på sjøen!', emoji: '⛵', color: '#22c55e' }
  if (h <= 0.6 && w <= 5) return { text: 'Gode forhold', emoji: '✅', color: '#22c55e' }
  if (h <= 1.0 && w <= 8) return { text: 'Akseptable forhold', emoji: '⚠️', color: '#f59e0b' }
  if (h <= 1.5 && w <= 10) return { text: 'Krevende forhold', emoji: '🌊', color: '#f59e0b' }
  return { text: 'Frarådes – hardt vær', emoji: '🚫', color: '#ef4444' }
}

export default function Varsel() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [error, setError] = useState('')
  const [showSug, setShowSug] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced autocomplete
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); setShowSug(false); return }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=no&format=json`)
        const d = await r.json()
        const hits = (d.results || []).filter((x: any) => x.country === 'Norway')
        setSuggestions(hits)
        setShowSug(hits.length > 0)
      } catch {}
    }, 350)
  }, [query])

  async function fetchWeather(lat: number, lon: number, name: string) {
    setLoading(true); setError(''); setReport(null); setShowSug(false)
    try {
      const [w, m] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=Europe/Oslo`).then(r=>r.json()),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=Europe/Oslo`).then(r=>r.json())
      ])
      const a = assess(m.current?.wave_height ?? 0, w.current?.wind_speed_10m ?? 0)
      setReport({
        name, date: new Date().toLocaleDateString('nb-NO',{weekday:'long',day:'numeric',month:'long'}),
        time: new Date().toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'}),
        temp: Math.round(w.current?.temperature_2m ?? 0),
        seaTemp: m.current?.sea_surface_temperature != null ? parseFloat(m.current.sea_surface_temperature).toFixed(1) : null,
        wind: parseFloat(w.current?.wind_speed_10m ?? 0).toFixed(1),
        windDir: degToDir(w.current?.wind_direction_10m ?? 0),
        wave: parseFloat(m.current?.wave_height ?? 0).toFixed(1),
        period: Math.round(m.current?.wave_period ?? 0),
        waveDir: degToDir(m.current?.wave_direction ?? 0),
        ...a
      })
    } catch { setError('Noe gikk galt. Prøv igjen.') }
    setLoading(false)
  }

  function pick(s: any) {
    const name = s.admin1 ? `${s.name}, ${s.admin1}` : s.name
    setQuery(name); fetchWeather(s.latitude, s.longitude, name)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setShowSug(false)
    if (!query.trim() || loading) return
    setLoading(true); setError('')
    try {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=no&format=json`)
      const d = await r.json()
      const hit = d.results?.[0]
      if (!hit) { setError('Fant ikke stedet. Prøv f.eks: Stavanger, Mandal, Bergen'); setLoading(false); return }
      fetchWeather(hit.latitude, hit.longitude, hit.admin1 ? `${hit.name}, ${hit.admin1}` : hit.name)
    } catch { setError('Noe gikk galt.'); setLoading(false) }
  }


  const Card = (label: string, val: string) => (
    <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.75rem 1rem'}}>
      <div style={{fontSize:'0.68rem',color:'#6b8fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.2rem'}}>{label}</div>
      <div style={{fontSize:'1.1rem',fontWeight:500,color:'#0a2a3d'}}>{val}</div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:640,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:100,textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>

      <div style={{maxWidth:560,margin:'0 auto',padding:'3.5rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'2.2rem'}}>
          <span style={{fontSize:'0.72rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',color:'#4da8cc',display:'block',marginBottom:'0.6rem'}}>Live bølgevarsel</span>
          <h1 style={{fontFamily:'serif',fontSize:'clamp(1.8rem,5vw,2.8rem)',fontWeight:300,color:'#0a2a3d',marginBottom:'0.5rem',letterSpacing:'-0.02em'}}>Sjekk forholdene<br/>ved din lokasjon</h1>
          <p style={{color:'#6b8fa3',fontSize:'0.95rem'}}>Søk på et sted langs kysten</p>
        </div>

        <form onSubmit={submit}>
          <div style={{display:'flex',gap:'0.6rem',marginBottom:'0.4rem'}}>
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setReport(null); setError('') }}
              onFocus={() => suggestions.length > 0 && setShowSug(true)}
              onBlur={() => setTimeout(() => setShowSug(false), 150)}
              placeholder="Eks: Stavanger, Mandal, Bergen..."
              autoComplete="off"
              style={{flex:1,padding:'1rem 1.3rem',borderRadius:100,border:'1.5px solid rgba(10,42,61,0.12)',background:'white',fontSize:'1rem',color:'#0a2a3d',outline:'none',fontFamily:'inherit',boxShadow:'0 2px 12px rgba(10,42,61,0.07)'}}
            />
            <button type="submit" disabled={loading} style={{background:'#0a2a3d',color:'white',padding:'1rem 1.4rem',borderRadius:100,border:'none',cursor:loading?'not-allowed':'pointer',fontSize:'1rem',fontWeight:500,minWidth:95,opacity:loading?0.7:1}}>
              {loading ? '⏳' : 'Sjekk →'}
            </button>
          </div>
          {showSug && suggestions.length > 0 && (
            <div style={{background:'white',borderRadius:16,boxShadow:'0 8px 30px rgba(10,42,61,0.12)',border:'1px solid rgba(10,42,61,0.08)',overflow:'hidden',zIndex:100,position:'relative'}}>
              {suggestions.map((s, i) => (
                <div key={i} onMouseDown={() => pick(s)}
                  style={{padding:'0.75rem 1.3rem',cursor:'pointer',borderBottom:i<suggestions.length-1?'1px solid #f0f4f8':'none'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f0f8fc')}
                  onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                  <span style={{fontWeight:500,color:'#0a2a3d'}}>{s.name}</span>
                  {s.admin1 && <span style={{color:'#6b8fa3',fontSize:'0.85rem'}}> – {s.admin1}</span>}
                </div>
              ))}
            </div>
          )}
        </form>

        {error && <p style={{color:'#ef4444',fontSize:'0.88rem',textAlign:'center',margin:'0.8rem 0'}}>{error}</p>}

        {report && (
          <div style={{background:'white',borderRadius:24,padding:'1.6rem',boxShadow:'0 8px 40px rgba(10,42,61,0.1)',border:'1px solid rgba(10,42,61,0.07)',marginTop:'1.5rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1rem'}}>
              <span style={{width:9,height:9,borderRadius:'50%',background:'#22c55e',display:'inline-block',boxShadow:'0 0 5px #22c55e'}}></span>
              <span style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',color:'#6b8fa3',textTransform:'uppercase'}}>Bølgevarsel · {report.time}</span>
            </div>
            <div style={{fontWeight:600,color:'#0a2a3d',marginBottom:'1rem'}}>🗺️ {report.name} – {report.date}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem',marginBottom:'1rem'}}>
              {Card('Lufttemperatur', `🌡️ ${report.temp}°C`)}
              {Card('Sjøtemperatur', report.seaTemp ? `🏊 ${report.seaTemp}°C` : '—')}
              {Card('Vind', `💨 ${report.wind} m/s fra ${report.windDir}`)}
              {Card('Bølger', `🌊 ${report.wave}m · ${report.period}s fra ${report.waveDir}`)}
            </div>
            <div style={{background:report.color+'18',border:`1.5px solid ${report.color}40`,borderRadius:12,padding:'0.85rem 1rem',display:'flex',alignItems:'center',gap:'0.7rem',marginBottom:'1.2rem'}}>
              <span style={{fontSize:'1.3rem'}}>{report.emoji}</span>
              <span style={{fontWeight:600,color:report.color}}>{report.text}</span>
            </div>
            <div style={{textAlign:'center',paddingTop:'1rem',borderTop:'1px solid #f0f4f8'}}>
              <p style={{color:'#6b8fa3',fontSize:'0.83rem',marginBottom:'0.8rem'}}>Vil du ha dette daglig på SMS kl. 07:30?</p>
              <a href="/registrer" style={{display:'inline-block',background:'#0a2a3d',color:'white',padding:'0.7rem 1.6rem',borderRadius:100,textDecoration:'none',fontWeight:500,fontSize:'0.88rem'}}>Start gratis prøveperiode →</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
