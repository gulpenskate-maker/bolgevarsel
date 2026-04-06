'use client'
import { useState, useRef, useEffect } from 'react'

type Sted = { name: string; admin1?: string; latitude: number; longitude: number }

type Varsel = {
  navn: string
  lufttemp: number
  vindStyrke: number
  vindRetning: number
  bolgeHoyde: number
  bolgePeriode: number
  bolgeRetning: number
  sjoTemp: number | null
}

const retning = (v: number) => ['N','NØ','Ø','SØ','S','SV','V','NV'][Math.round(v/45)%8]

const vurdering = (h: number, w: number) => {
  if (h <= 0.3 && w <= 3) return { tekst:'Flott dag på sjøen!', farge:'#22c55e' }
  if (h <= 0.6 && w <= 5) return { tekst:'Gode forhold', farge:'#22c55e' }
  if (h <= 1.0 && w <= 8) return { tekst:'Akseptable forhold', farge:'#f59e0b' }
  if (h <= 1.5 && w <= 10) return { tekst:'Krevende forhold', farge:'#f59e0b' }
  return { tekst:'Frarådes – hardt vær', farge:'#ef4444' }
}

export default function VarselKlient() {
  const [sok, setSok] = useState('')
  const [sugg, setSugg] = useState<Sted[]>([])
  const [apent, setApent] = useState(false)
  const [laster, setLaster] = useState(false)
  const [varsel, setVarsel] = useState<Varsel | null>(null)
  const [feil, setFeil] = useState('')
  const timer = useRef<any>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Lukk dropdown ved klikk utenfor
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setApent(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Søk med debounce
  useEffect(() => {
    if (sok.length < 2) { setSugg([]); setApent(false); return }
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sok)}&count=8&format=json`)
      const d = await r.json()
      const hits = (d.results || []).filter((x: any) => x.country_code === 'NO').slice(0, 5)
      setSugg(hits)
      setApent(hits.length > 0)
    }, 300)
  }, [sok])

  async function hentVarsel(sted: Sted) {
    setSok(sted.name + (sted.admin1 ? ` – ${sted.admin1.replace(' Fylke','')}` : ''))
    setSugg([]); setApent(false); setLaster(true); setFeil(''); setVarsel(null)
    try {
      const [w, m] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${Math.round(sted.latitude*10000)/10000}&longitude=${Math.round(sted.longitude*10000)/10000}&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=Europe/Oslo`).then(r => r.json()),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${Math.round(sted.latitude*10000)/10000}&longitude=${Math.round(sted.longitude*10000)/10000}&current=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=Europe/Oslo`).then(r => r.json()),
      ])
      setVarsel({
        navn: sted.name + (sted.admin1 ? `, ${sted.admin1.replace(' Fylke','')}` : ''),
        lufttemp: Math.round(w.current?.temperature_2m ?? 0),
        vindStyrke: parseFloat((w.current?.wind_speed_10m ?? 0).toFixed(1)),
        vindRetning: w.current?.wind_direction_10m ?? 0,
        bolgeHoyde: parseFloat((m.current?.wave_height ?? 0).toFixed(1)),
        bolgePeriode: Math.round(m.current?.wave_period ?? 0),
        bolgeRetning: m.current?.wave_direction ?? 0,
        sjoTemp: m.current?.sea_surface_temperature ? parseFloat(m.current.sea_surface_temperature) : null,
      })
    } catch { setFeil('Noe gikk galt. Prøv igjen.') }
    setLaster(false)
  }

  async function sokOgHent() {
    if (!sok.trim()) return
    setLaster(true); setFeil('')
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sok)}&count=8&format=json`)
    const d = await r.json()
    const hit = (d.results || []).find((x: any) => x.country_code === 'NO')
    if (!hit) { setFeil('Fant ikke stedet. Prøv f.eks: Bergen, Mandal, Ålesund'); setLaster(false); return }
    hentVarsel(hit)
  }

  const v = varsel ? vurdering(varsel.bolgeHoyde, varsel.vindStyrke) : null
  const dato = new Date().toLocaleDateString('nb-NO', { weekday:'long', day:'numeric', month:'long' })

  const C = ({ label, verdi }: { label: string; verdi: string }) => (
    <div style={{ background:'#f0f8fc', borderRadius:12, padding:'10px 14px' }}>
      <div style={{ fontSize:11, color:'#6b8fa3', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:500, color:'#0a2a3d' }}>{verdi}</div>
    </div>
  )

  return (
    <div style={{ maxWidth:540, margin:'0 auto', padding:'3.5rem 1.5rem' }}>
      <div style={{ textAlign:'center', marginBottom:'2rem' }}>
        <span style={{ fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase' as const, color:'#4da8cc', display:'block', marginBottom:'0.6rem' }}>Live bølgevarsel</span>
        <h1 style={{ fontFamily:'Georgia, serif', fontSize:'clamp(1.8rem,5vw,2.8rem)', fontWeight:400, color:'#0a2a3d', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>Sjekk forholdene<br/>ved din lokasjon</h1>
        <p style={{ color:'#6b8fa3', fontSize:'0.95rem' }}>Søk på et sted langs norskekysten</p>
      </div>

      {/* Søkefelt */}
      <div ref={wrapperRef} style={{ position:'relative', marginBottom:8 }}>
        <div style={{ display:'flex', gap:8 }}>
          <input
            value={sok}
            onChange={e => setSok(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sokOgHent()}
            onFocus={() => sugg.length > 0 && setApent(true)}
            placeholder="Eks: Stavanger, Bergen, Mandal..."
            style={{ flex:1, padding:'12px 16px', borderRadius:100, fontSize:15, border:'1.5px solid rgba(10,42,61,0.12)', background:'white', color:'#0a2a3d', outline:'none', fontFamily:'inherit', boxShadow:'0 2px 12px rgba(10,42,61,0.07)' }}
          />
          <button onClick={sokOgHent} style={{ background:'#0a2a3d', color:'white', padding:'12px 20px', borderRadius:100, border:'none', cursor:'pointer', fontSize:15, fontWeight:500, whiteSpace:'nowrap' as const }}>
            Sjekk →
          </button>
        </div>

        {/* Dropdown */}
        {apent && sugg.length > 0 && (
          <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:90, background:'white', borderRadius:16, boxShadow:'0 8px 30px rgba(10,42,61,0.12)', border:'1px solid rgba(10,42,61,0.08)', overflow:'hidden', zIndex:999 }}>
            {sugg.map((s, i) => (
              <div key={i}
                onMouseDown={() => hentVarsel(s)}
                style={{ padding:'10px 16px', cursor:'pointer', fontSize:14, borderBottom: i < sugg.length-1 ? '1px solid #f0f4f8' : 'none', background:'white' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f8fc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <span style={{ fontWeight:500, color:'#0a2a3d' }}>{s.name}</span>
                {s.admin1 && <span style={{ color:'#6b8fa3' }}> – {s.admin1.replace(' Fylke','')}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {feil && <p style={{ fontSize:13, color:'#ef4444', textAlign:'center', margin:'8px 0' }}>{feil}</p>}
      {laster && <p style={{ fontSize:13, color:'#6b8fa3', textAlign:'center', margin:'8px 0' }}>Henter værdata...</p>}

      {/* Resultat */}
      {varsel && v && (
        <div style={{ background:'white', borderRadius:24, padding:'1.5rem', boxShadow:'0 8px 40px rgba(10,42,61,0.1)', border:'1px solid rgba(10,42,61,0.07)', marginTop:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', color:'#6b8fa3', textTransform:'uppercase' as const }}>Bølgevarsel · {new Date().toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'})}</span>
          </div>
          <div style={{ fontWeight:600, color:'#0a2a3d', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5C5.07 1.5 3.5 3.07 3.5 5c0 2.6 3.5 7.5 3.5 7.5S10.5 7.6 10.5 5C10.5 3.07 8.93 1.5 7 1.5z" stroke="#1a6080" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
              <circle cx="7" cy="5" r="1.3" stroke="#1a6080" strokeWidth="1.1" fill="none"/>
            </svg>
            {varsel.navn} – {dato}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            <C label="Lufttemperatur" verdi={`${varsel.lufttemp}°C`} />
            <C label="Sjøtemperatur" verdi={varsel.sjoTemp != null ? `${varsel.sjoTemp.toFixed(1)}°C` : '—'} />
            <C label="Vind" verdi={`${varsel.vindStyrke} m/s fra ${retning(varsel.vindRetning)}`} />
            <C label="Bølger" verdi={`${varsel.bolgeHoyde}m · ${varsel.bolgePeriode}s fra ${retning(varsel.bolgeRetning)}`} />
          </div>
          <div style={{ background:`${v.farge}18`, border:`1.5px solid ${v.farge}40`, borderRadius:12, padding:'12px 16px', marginBottom:14, fontWeight:600, color:v.farge }}>
            {v.tekst}
          </div>
          <div style={{ textAlign:'center', paddingTop:12, borderTop:'1px solid #f0f4f8' }}>
            <p style={{ fontSize:13, color:'#6b8fa3', marginBottom:8 }}>Vil du ha dette daglig på SMS — levert når du vil?</p>
            <a href="/registrer" style={{ display:'inline-block', background:'#0a2a3d', color:'white', padding:'8px 20px', borderRadius:100, textDecoration:'none', fontSize:13, fontWeight:500 }}>7 dager gratis — kom i gang →</a>
          </div>
        </div>
      )}
    </div>
  )
}
