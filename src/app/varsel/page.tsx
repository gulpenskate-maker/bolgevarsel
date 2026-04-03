'use client'
import { useState } from 'react'

interface WeatherReport {
  location: string
  date: string
  temp: number
  seaTemp: number | null
  windSpeed: number
  windDir: string
  waveHeight: number
  wavePeriod: number
  waveDir: string
  assessment: string
  assessmentEmoji: string
  color: string
}

const WIND_DIRS = ['N','NØ','Ø','SØ','S','SV','V','NV']
const WAVE_DIRS = ['N','NØ','Ø','SØ','S','SV','V','NV']

function degToDir(deg: number, dirs: string[]) {
  return dirs[Math.round(deg / 45) % 8]
}

function assess(waveH: number, windSpeed: number): { text: string; emoji: string; color: string } {
  if (waveH <= 0.3 && windSpeed <= 3) return { text: 'Flott dag på sjøen!', emoji: '⛵', color: '#22c55e' }
  if (waveH <= 0.6 && windSpeed <= 5) return { text: 'Gode forhold', emoji: '✅', color: '#22c55e' }
  if (waveH <= 1.0 && windSpeed <= 8) return { text: 'Akseptable forhold', emoji: '⚠️', color: '#f59e0b' }
  if (waveH <= 1.5 && windSpeed <= 10) return { text: 'Krevende forhold', emoji: '🌊', color: '#f59e0b' }
  return { text: 'Frarådes – hardt vær', emoji: '🚫', color: '#ef4444' }
}

export default function Varsel() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<WeatherReport | null>(null)
  const [error, setError] = useState('')

  async function fetchReport(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setReport(null)
    try {
      // Geokode stedsnavnet
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=no&format=json`)
      const geoData = await geoRes.json()
      if (!geoData.results?.length) { setError('Fant ikke stedet. Prøv et annet navn.'); setLoading(false); return }
      const { latitude, longitude, name, country } = geoData.results[0]

      // Hent vær og bølgedata
      const [wxRes, marineRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=Europe/Oslo`),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&current=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=Europe/Oslo`)
      ])
      const [wx, marine] = await Promise.all([wxRes.json(), marineRes.json()])

      const temp = Math.round(wx.current?.temperature_2m ?? 0)
      const windSpeed = parseFloat((wx.current?.wind_speed_10m ?? 0).toFixed(1))
      const windDeg = wx.current?.wind_direction_10m ?? 0
      const waveHeight = parseFloat((marine.current?.wave_height ?? 0).toFixed(1))
      const wavePeriod = Math.round(marine.current?.wave_period ?? 0)
      const waveDeg = marine.current?.wave_direction ?? 0
      const seaTemp = marine.current?.sea_surface_temperature != null ? parseFloat(marine.current.sea_surface_temperature.toFixed(1)) : null
      const { text, emoji, color } = assess(waveHeight, windSpeed)
      const now = new Date()
      const dateStr = now.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })

      setReport({
        location: `${name}${country !== 'Norway' ? ', ' + country : ''}`,
        date: dateStr,
        temp,
        seaTemp,
        windSpeed,
        windDir: degToDir(windDeg, WIND_DIRS),
        waveHeight,
        wavePeriod,
        waveDir: degToDir(waveDeg, WAVE_DIRS),
        assessment: text,
        assessmentEmoji: emoji,
        color,
      })
    } catch {
      setError('Noe gikk galt. Prøv igjen.')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.92)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:800,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:'100px',textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>

      <div style={{maxWidth:600,margin:'0 auto',padding:'4rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <span style={{fontSize:'0.75rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',color:'#4da8cc',display:'block',marginBottom:'0.8rem'}}>Live bølgevarsel</span>
          <h1 style={{fontFamily:'serif',fontSize:'clamp(2rem,5vw,3rem)',fontWeight:300,color:'#0a2a3d',marginBottom:'0.8rem',letterSpacing:'-0.02em'}}>Sjekk forholdene<br/>ved din lokasjon</h1>
          <p style={{color:'#6b8fa3',fontSize:'1rem'}}>Skriv inn et sted langs norskekysten og få øyeblikkelig bølge- og værrapport</p>
        </div>

        <form onSubmit={fetchReport} style={{display:'flex',gap:'0.7rem',marginBottom:'2rem'}}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Eks: Stavanger, Mandal, Ålesund..."
            style={{flex:1,padding:'0.9rem 1.2rem',borderRadius:100,border:'1.5px solid rgba(10,42,61,0.15)',background:'white',fontSize:'1rem',color:'#0a2a3d',outline:'none',fontFamily:'inherit'}}
          />
          <button type="submit" disabled={loading} style={{background:'#0a2a3d',color:'white',padding:'0.9rem 1.5rem',borderRadius:100,border:'none',cursor:'pointer',fontSize:'1rem',fontWeight:500,whiteSpace:'nowrap',opacity:loading?0.7:1}}>
            {loading ? '...' : 'Sjekk →'}
          </button>
        </form>

        {error && <p style={{textAlign:'center',color:'#ef4444',marginBottom:'1.5rem'}}>{error}</p>}

        {report && (
          <div style={{background:'white',borderRadius:24,padding:'1.8rem',boxShadow:'0 8px 40px rgba(10,42,61,0.12)',border:'1px solid rgba(10,42,61,0.07)'}}>
            {/* Header — SMS-stil */}
            <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1.2rem'}}>
              <span style={{width:10,height:10,borderRadius:'50%',background:'#22c55e',display:'inline-block',boxShadow:'0 0 6px #22c55e'}}></span>
              <span style={{fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.1em',color:'#6b8fa3',textTransform:'uppercase'}}>Bølgevarsel · {new Date().toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'})}</span>
            </div>

            <div style={{marginBottom:'1.2rem'}}>
              <div style={{fontSize:'1.1rem',fontWeight:600,color:'#0a2a3d',marginBottom:'0.2rem'}}>🗺️ {report.location} – {report.date}</div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.7rem',marginBottom:'1.2rem'}}>
              <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.8rem 1rem'}}>
                <div style={{fontSize:'0.72rem',color:'#6b8fa3',marginBottom:'0.2rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Lufttemperatur</div>
                <div style={{fontSize:'1.3rem',fontWeight:500,color:'#0a2a3d'}}>🌡️ {report.temp}°C</div>
              </div>
              <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.8rem 1rem'}}>
                <div style={{fontSize:'0.72rem',color:'#6b8fa3',marginBottom:'0.2rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Sjøtemperatur</div>
                <div style={{fontSize:'1.3rem',fontWeight:500,color:'#0a2a3d'}}>{report.seaTemp != null ? `🏊 ${report.seaTemp}°C` : '– ikke tilgjengelig'}</div>
              </div>
              <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.8rem 1rem'}}>
                <div style={{fontSize:'0.72rem',color:'#6b8fa3',marginBottom:'0.2rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Vind</div>
                <div style={{fontSize:'1.3rem',fontWeight:500,color:'#0a2a3d'}}>💨 {report.windSpeed} m/s {report.windDir}</div>
              </div>
              <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.8rem 1rem'}}>
                <div style={{fontSize:'0.72rem',color:'#6b8fa3',marginBottom:'0.2rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Bølgehøyde</div>
                <div style={{fontSize:'1.3rem',fontWeight:500,color:'#0a2a3d'}}>🌊 {report.waveHeight}m</div>
              </div>
              <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.8rem 1rem'}}>
                <div style={{fontSize:'0.72rem',color:'#6b8fa3',marginBottom:'0.2rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>Periode / retning</div>
                <div style={{fontSize:'1.3rem',fontWeight:500,color:'#0a2a3d'}}>🔄 {report.wavePeriod}s fra {report.waveDir}</div>
              </div>
            </div>

            <div style={{background:report.color+'18',border:`1.5px solid ${report.color}40`,borderRadius:12,padding:'0.9rem 1.1rem',display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1.5rem'}}>
              <span style={{fontSize:'1.3rem'}}>{report.assessmentEmoji}</span>
              <span style={{fontWeight:600,color:report.color,fontSize:'1rem'}}>{report.assessment}</span>
            </div>

            <div style={{textAlign:'center',paddingTop:'1rem',borderTop:'1px solid rgba(10,42,61,0.07)'}}>
              <p style={{color:'#6b8fa3',fontSize:'0.85rem',marginBottom:'1rem'}}>Vil du ha dette daglig på SMS kl. 07:30?</p>
              <a href="/registrer" style={{display:'inline-block',background:'#0a2a3d',color:'white',padding:'0.75rem 1.8rem',borderRadius:100,textDecoration:'none',fontWeight:500,fontSize:'0.9rem'}}>Start gratis prøveperiode →</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
