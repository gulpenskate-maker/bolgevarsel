'use client'
import { useState, useEffect, useRef } from 'react'

const DIRS = ['N','NØ','Ø','SØ','S','SV','V','NV']
const dir = (d: number) => DIRS[Math.round(d/45)%8]
const assess = (h: number, w: number) => {
  if (h<=0.3&&w<=3) return {t:'Flott dag på sjøen!',e:'⛵',c:'#22c55e'}
  if (h<=0.6&&w<=5) return {t:'Gode forhold',e:'✅',c:'#22c55e'}
  if (h<=1.0&&w<=8) return {t:'Akseptable forhold',e:'⚠️',c:'#f59e0b'}
  if (h<=1.5&&w<=10) return {t:'Krevende forhold',e:'🌊',c:'#f59e0b'}
  return {t:'Frarådes – hardt vær',e:'🚫',c:'#ef4444'}
}

export default function Varsel() {
  const [q, setQ] = useState('')
  const [sugg, setSugg] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [err, setErr] = useState('')
  const t = useRef<any>(null)

  useEffect(()=>{
    if(q.length<2){setSugg([]);setOpen(false);return}
    clearTimeout(t.current)
    t.current=setTimeout(async()=>{
      const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=no&format=json`)
      const d=await r.json()
      // Filtrer på country_code NO istedenfor country-navn
      const hits=(d.results||[]).filter((x:any)=>x.country_code==='NO').slice(0,5)
      setSugg(hits)
      setOpen(hits.length>0)
    },300)
  },[q])

  const go = async(lat:number,lon:number,name:string)=>{
    setBusy(true);setErr('');setReport(null);setSugg([]);setOpen(false)
    try{
      const[w,m]=await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=Europe/Oslo`).then(r=>r.json()),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=Europe/Oslo`).then(r=>r.json())
      ])
      const a=assess(m.current?.wave_height??0,w.current?.wind_speed_10m??0)
      setReport({
        name,
        date:new Date().toLocaleDateString('nb-NO',{weekday:'long',day:'numeric',month:'long'}),
        tid:new Date().toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'}),
        temp:Math.round(w.current?.temperature_2m??0),
        sjø:m.current?.sea_surface_temperature!=null?parseFloat(m.current.sea_surface_temperature).toFixed(1):null,
        vind:parseFloat(w.current?.wind_speed_10m??0).toFixed(1),
        vindDir:dir(w.current?.wind_direction_10m??0),
        bolge:parseFloat(m.current?.wave_height??0).toFixed(1),
        periode:Math.round(m.current?.wave_period??0),
        bolgeDir:dir(m.current?.wave_direction??0),
        ...a
      })
    }catch{setErr('Noe gikk galt. Prøv igjen.')}
    setBusy(false)
  }

  const pick=(s:any)=>{
    const name=`${s.name}${s.admin1?', '+s.admin1.replace(' Fylke',''):''}`
    setQ(name);go(s.latitude,s.longitude,name)
  }

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setOpen(false)
    if(!q.trim()||busy)return
    setBusy(true);setErr('')
    const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=no&format=json`)
    const d=await r.json()
    const h=d.results?.[0]
    if(!h){setErr('Fant ikke stedet. Prøv f.eks: Stavanger, Mandal, Bergen');setBusy(false);return}
    go(h.latitude,h.longitude,`${h.name}${h.admin1?', '+h.admin1.replace(' Fylke',''):''}`)
  }

  const C=(l:string,v:string)=>(
    <div style={{background:'#f0f8fc',borderRadius:12,padding:'0.75rem 1rem'}}>
      <div style={{fontSize:'0.68rem',color:'#6b8fa3',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'0.2rem'}}>{l}</div>
      <div style={{fontSize:'1.1rem',fontWeight:500,color:'#0a2a3d'}}>{v}</div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:640,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:100,textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>
      <div style={{maxWidth:540,margin:'0 auto',padding:'3.5rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <span style={{fontSize:'0.72rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',color:'#4da8cc',display:'block',marginBottom:'0.6rem'}}>Live bølgevarsel</span>
          <h1 style={{fontFamily:'serif',fontSize:'clamp(1.8rem,5vw,2.8rem)',fontWeight:300,color:'#0a2a3d',marginBottom:'0.5rem',letterSpacing:'-0.02em'}}>Sjekk forholdene<br/>ved din lokasjon</h1>
          <p style={{color:'#6b8fa3',fontSize:'0.95rem'}}>Søk på et sted langs kysten</p>
        </div>

        <form onSubmit={submit} style={{position:'relative'}}>
          <div style={{display:'flex',gap:'0.6rem'}}>
            <input value={q}
              onChange={e=>{setQ(e.target.value);setReport(null);setErr('')}}
              onBlur={()=>setTimeout(()=>setOpen(false),200)}
              onFocus={()=>sugg.length>0&&setOpen(true)}
              placeholder="Eks: Stavanger, Mandal, Bergen..."
              autoComplete="off"
              style={{flex:1,padding:'1rem 1.3rem',borderRadius:100,border:'1.5px solid rgba(10,42,61,0.12)',background:'white',fontSize:'1rem',color:'#0a2a3d',outline:'none',fontFamily:'inherit',boxShadow:'0 2px 12px rgba(10,42,61,0.07)'}}
            />
            <button type="submit" disabled={busy} style={{background:'#0a2a3d',color:'white',padding:'1rem 1.4rem',borderRadius:100,border:'none',cursor:'pointer',fontSize:'1rem',fontWeight:500,minWidth:95,opacity:busy?0.6:1}}>
              {busy?'⏳':'Sjekk →'}
            </button>
          </div>
          {open&&sugg.length>0&&(
            <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,right:'100px',background:'white',borderRadius:16,boxShadow:'0 8px 30px rgba(10,42,61,0.12)',border:'1px solid rgba(10,42,61,0.08)',overflow:'hidden',zIndex:999}}>
              {sugg.map((s,i)=>(
                <div key={i} onMouseDown={()=>pick(s)}
                  style={{padding:'0.75rem 1.3rem',cursor:'pointer',borderBottom:i<sugg.length-1?'1px solid #f0f4f8':'none'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f0f8fc')}
                  onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                  <span style={{fontWeight:500,color:'#0a2a3d'}}>{s.name}</span>
                  {s.admin1&&<span style={{color:'#6b8fa3',fontSize:'0.85rem'}}> – {s.admin1.replace(' Fylke','')}</span>}
                </div>
              ))}
            </div>
          )}
        </form>

        {err&&<p style={{color:'#ef4444',fontSize:'0.88rem',textAlign:'center',margin:'1rem 0'}}>{err}</p>}

        {report&&(
          <div style={{background:'white',borderRadius:24,padding:'1.6rem',boxShadow:'0 8px 40px rgba(10,42,61,0.1)',border:'1px solid rgba(10,42,61,0.07)',marginTop:'1.5rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.9rem'}}>
              <span style={{width:9,height:9,borderRadius:'50%',background:'#22c55e',display:'inline-block',boxShadow:'0 0 5px #22c55e'}}></span>
              <span style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',color:'#6b8fa3',textTransform:'uppercase'}}>Bølgevarsel · {report.tid}</span>
            </div>
            <div style={{fontWeight:600,color:'#0a2a3d',marginBottom:'1rem'}}>🗺️ {report.name} – {report.date}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem',marginBottom:'1rem'}}>
              {C('Lufttemperatur',`🌡️ ${report.temp}°C`)}
              {C('Sjøtemperatur',report.sjø?`🏊 ${report.sjø}°C`:'—')}
              {C('Vind',`💨 ${report.vind} m/s fra ${report.vindDir}`)}
              {C('Bølger',`🌊 ${report.bolge}m · ${report.periode}s fra ${report.bolgeDir}`)}
            </div>
            <div style={{background:report.c+'18',border:`1.5px solid ${report.c}40`,borderRadius:12,padding:'0.85rem 1rem',display:'flex',alignItems:'center',gap:'0.7rem',marginBottom:'1.2rem'}}>
              <span style={{fontSize:'1.3rem'}}>{report.e}</span>
              <span style={{fontWeight:600,color:report.c}}>{report.t}</span>
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
