'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

type Sted = { name: string; admin1?: string; latitude: number; longitude: number }
type TimePoint = { tid: string; bolge: number; vind: number; temp: number; periode: number }
type LiveData = {
  navn: string; lat: number; lon: number
  lufttemp: number; vindMs: number; vindDir: number; vindMaks: number
  bolgeHoyde: number; bolgePeriode: number; bolgeDir: number; sjoTemp: number | null
  timesvarsel: TimePoint[]; oppdatert: string
}

const retning = (v: number) => ['N','NØ','Ø','SØ','S','SV','V','NV'][Math.round(v/45)%8]
const trunc = (n: number) => Math.round(n * 10000) / 10000
const score = (bolge: number, vind: number) => {
  if (vind >= 24.5 || bolge >= 4.0) return 5
  if (vind >= 20.8 || bolge >= 3.0) return 4
  if (vind >= 13.9 || bolge >= 2.0) return 3
  if (vind >= 10.8 || bolge >= 1.5) return 2
  if (vind >= 8.0  || bolge >= 1.0) return 1
  return 0
}
const FARGER = ['#22c55e','#65a30d','#f59e0b','#ea580c','#dc2626','#9f1239']
const TEKST  = ['Flott dag på sjøen','Gode forhold','Moderat','Krevende','Farlige forhold','FAREVARSEL']

const SKALA_INFO = [
  { nivå: 0, farge: '#22c55e', tekst: 'Flott dag på sjøen', bolge: '< 1.0m', vind: '< 8 m/s', eks: 'Ideelt for alle aktiviteter' },
  { nivå: 1, farge: '#65a30d', tekst: 'Gode forhold', bolge: '1.0–1.5m', vind: '8–11 m/s', eks: 'Passer for erfarne brukere' },
  { nivå: 2, farge: '#f59e0b', tekst: 'Moderat', bolge: '1.5–2.0m', vind: '11–14 m/s', eks: 'Vær forsiktig, ikke for nybegynnere' },
  { nivå: 3, farge: '#ea580c', tekst: 'Krevende', bolge: '2.0–3.0m', vind: '14–21 m/s', eks: 'Kun erfarne — vurder å bli på land' },
  { nivå: 4, farge: '#dc2626', tekst: 'Farlige forhold', bolge: '3.0–4.0m', vind: '21–25 m/s', eks: 'Frarådes — sterk kuling' },
  { nivå: 5, farge: '#9f1239', tekst: 'FAREVARSEL', bolge: '> 4.0m', vind: '> 25 m/s', eks: 'Livsfarlig — gå i havn umiddelbart' },
]

function FarevarselSkala({ aktivt }: { aktivt: number }) {
  const [hov, setHov] = useState<number|null>(null)
  const vis = hov !== null ? hov : aktivt
  const info = SKALA_INFO[Math.min(vis, 5)]
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
      {/* Stolpene */}
      <div style={{display:'flex',gap:4,alignItems:'flex-end',position:'relative'}}>
        {SKALA_INFO.map((s,i)=>(
          <div key={i}
            style={{
              width:10,
              height:10+i*7,
              borderRadius:4,
              background: i<=aktivt ? s.farge : 'rgba(10,42,61,0.08)',
              border: hov===i ? '2px solid '+s.farge : '2px solid transparent',
              cursor:'pointer',
              transition:'all 0.15s',
              transform: hov===i ? 'scaleY(1.08)' : 'scaleY(1)',
              transformOrigin:'bottom',
            }}
            onMouseEnter={()=>setHov(i)}
            onMouseLeave={()=>setHov(null)}
          />
        ))}
      </div>
      {/* Tooltip/forklaring */}
      {hov!==null && (
        <div style={{
          position:'absolute',
          right:0,
          top:'100%',
          marginTop:8,
          background:'white',
          borderRadius:12,
          padding:'12px 14px',
          boxShadow:'0 4px 20px rgba(10,42,61,0.15)',
          border:'1px solid rgba(10,42,61,0.08)',
          minWidth:200,
          zIndex:50,
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <div style={{width:10,height:10,borderRadius:3,background:info.farge}}/>
            <span style={{fontSize:13,fontWeight:600,color:info.farge}}>Nivå {vis} — {info.tekst}</span>
          </div>
          <div style={{fontSize:12,color:'#6b8fa3',lineHeight:1.6}}>
            <div>Bølgehøyde: <strong style={{color:'#0a2a3d'}}>{info.bolge}</strong></div>
            <div>Vind: <strong style={{color:'#0a2a3d'}}>{info.vind}</strong></div>
            <div style={{marginTop:4,color:'#94a3b8',fontStyle:'italic'}}>{info.eks}</div>
          </div>
        </div>
      )}
    </div>
  )
}

async function fetchLiveData(sted: Sted): Promise<LiveData> {
  const lat = trunc(sted.latitude), lon = trunc(sted.longitude)
  const [metRes, marineRes] = await Promise.all([
    fetch(`/api/varsel?lat=${lat}&lon=${lon}`),
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_period,wave_direction,sea_surface_temperature&hourly=wave_height,wave_period&timezone=Europe/Oslo&forecast_days=2`),
  ])
  const [met, marine] = await Promise.all([metRes.json(), marineRes.json()])
  const ts = met.properties?.timeseries ?? []
  const now = ts[0]?.data?.instant?.details ?? {}
  const vindMaks = Math.max(0, ...ts.slice(0,24).map((t: any) => t.data?.instant?.details?.wind_speed ?? 0))
  const keyHours = Array.from({length:12},(_,i) => {
    const slot = ts[i]; const d = slot?.data?.instant?.details ?? {}
    const mIdx = (marine.hourly?.time ?? []).findIndex((t: string) => t === slot?.time?.slice(0,16))
    return {
      tid: slot?.time ? new Date(slot.time).toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'}) : String(i)+':00',
      bolge: mIdx>=0 ? parseFloat((marine.hourly.wave_height[mIdx]??0).toFixed(2)) : 0,
      vind: parseFloat((d.wind_speed??0).toFixed(1)),
      temp: Math.round(d.air_temperature??0),
      periode: mIdx>=0 ? Math.round(marine.hourly.wave_period?.[mIdx]??0) : 0,
    }
  })
  return {
    navn: sted.name+(sted.admin1 ? ', '+sted.admin1.replace(' Fylke','') : ''),
    lat, lon,
    lufttemp: Math.round(now.air_temperature??0),
    vindMs: parseFloat((now.wind_speed??0).toFixed(1)),
    vindDir: Math.round(now.wind_from_direction??0),
    vindMaks: parseFloat(vindMaks.toFixed(1)),
    bolgeHoyde: parseFloat((marine.current?.wave_height??0).toFixed(2)),
    bolgePeriode: Math.round(marine.current?.wave_period??0),
    bolgeDir: Math.round(marine.current?.wave_direction??0),
    sjoTemp: marine.current?.sea_surface_temperature ? parseFloat(marine.current.sea_surface_temperature.toFixed(1)) : null,
    timesvarsel: keyHours,
    oppdatert: new Date().toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'}),
  }
}

function BolgeGraf({ data }: { data: TimePoint[] }) {
  const [hov, setHov] = useState<number|null>(null)
  const W=100, H=72, padL=2, padR=2, padT=6, padB=4
  const maxVal = Math.max(...data.map(d=>d.bolge), 0.5)
  const x = (i: number) => padL + (i / (data.length - 1)) * (W - padL - padR)
  const y = (v: number) => padT + (1 - v / maxVal) * (H - padT - padB)
  const path = data.map((d,i)=>(i===0?'M':'L')+' '+x(i).toFixed(2)+' '+y(d.bolge).toFixed(2)).join(' ')
  const area = path+' L '+x(data.length-1).toFixed(2)+' '+H+' L '+x(0).toFixed(2)+' '+H+' Z'
  const slotW = (W - padL - padR) / (data.length - 1)

  return (
    <div style={{position:'relative',userSelect:'none'}}>
      <svg viewBox={'0 0 '+W+' '+H} style={{width:'100%',height:130,overflow:'visible',display:'block'}}>
        <defs>
          <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a6080" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#1a6080" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {/* Y-akse guidelinjer */}
        {[0.25,0.5,0.75,1].map(f=>(
          <line key={f} x1={padL} x2={W-padR} y1={y(maxVal*f)} y2={y(maxVal*f)}
            stroke="rgba(10,42,61,0.05)" strokeWidth="0.4"/>
        ))}
        <path d={area} fill="url(#wg2)"/>
        <path d={path} fill="none" stroke="#1a6080" strokeWidth="0.9" strokeLinejoin="round"/>
        {/* Datapunkter */}
        {data.map((d,i)=>(
          <circle key={i} cx={x(i)} cy={y(d.bolge)} r={hov===i ? 2.5 : 1.4}
            fill={hov===i ? '#0a2a3d' : FARGER[Math.min(score(d.bolge,d.vind),5)]}
            stroke={hov===i ? FARGER[Math.min(score(d.bolge,d.vind),5)] : 'none'}
            strokeWidth="0.8"
            style={{transition:'r 0.12s, fill 0.12s'}}/>
        ))}
        {/* Tooltip */}
        {hov!==null&&(()=>{
          const tx = x(hov), ty = y(data[hov].bolge)
          const boxW = 32, boxH = 14
          const bx = Math.max(padL, Math.min(tx - boxW/2, W - padR - boxW))
          const by = ty - boxH - 3 < padT ? ty + 3 : ty - boxH - 3
          return (
            <g>
              <line x1={tx} x2={tx} y1={padT} y2={H} stroke="rgba(10,42,61,0.15)" strokeWidth="0.5" strokeDasharray="1.5,1.5"/>
              <rect x={bx} y={by} width={boxW} height={boxH} rx="2" fill="#0a2a3d"/>
              <text x={bx+boxW/2} y={by+5.5} fill="white" fontSize="3.8" textAnchor="middle" fontWeight="600">{data[hov].bolge.toFixed(1)}m</text>
              <text x={bx+boxW/2} y={by+10} fill="rgba(255,255,255,0.7)" fontSize="3.2" textAnchor="middle">{data[hov].vind} m/s vind</text>
            </g>
          )
        })()}
        {/* Usynlige hover-soner */}
        {data.map((d,i)=>(
          <rect key={'h'+i}
            x={Math.max(0, x(i) - slotW/2)} y={0}
            width={slotW} height={H}
            fill="transparent"
            style={{cursor:'crosshair'}}
            onMouseEnter={()=>setHov(i)}
            onMouseLeave={()=>setHov(null)}/>
        ))}
      </svg>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
        {data.filter((_,i)=>i%3===0||i===data.length-1).map((d,i)=>(
          <span key={i} style={{fontSize:10,color:'#94a3b8'}}>{d.tid}</span>
        ))}
      </div>
    </div>
  )
}

function Vindrose({ dir, ms }: { dir: number; ms: number }) {
  const rad = (dir-90)*Math.PI/180
  const cx=40,cy=40,r=28
  const ax=cx+r*Math.cos(rad), ay=cy+r*Math.sin(rad)
  return (
    <svg width="90" height="90" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(10,42,61,0.08)" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={r*0.66} fill="none" stroke="rgba(10,42,61,0.05)" strokeWidth="0.5" strokeDasharray="2,2"/>
      {['N','Ø','S','V'].map((l,i)=>{
        const a=i*90*Math.PI/180
        return <text key={l} x={cx+(r+7)*Math.cos(a-Math.PI/2)} y={cy+(r+7)*Math.sin(a-Math.PI/2)+1.5} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#94a3b8">{l}</text>
      })}
      <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#1a6080" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="3.5" fill="#1a6080"/>
      <circle cx={ax} cy={ay} r="2.5" fill="#0a2a3d"/>
      <text x={cx} y={cy+r+14} textAnchor="middle" fontSize="8" fontWeight="600" fill="#0a2a3d">{ms} m/s</text>
    </svg>
  )
}

function Stat({ label, value, sub, farge }: { label:string;value:string;sub?:string;farge?:string }) {
  return (
    <div style={{background:'#f8fbfc',borderRadius:12,padding:'14px 16px',flex:1,minWidth:120}}>
      <div style={{fontSize:11,color:'#6b8fa3',textTransform:'uppercase' as const,letterSpacing:'0.06em',marginBottom:4}}>{label}</div>
      <div style={{fontSize:26,fontWeight:300,color:farge||'#0a2a3d',lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:'#94a3b8',marginTop:4}}>{sub}</div>}
    </div>
  )
}

export default function DashboardKlient() {
  const [sok, setSok] = useState('')
  const [sugg, setSugg] = useState<Sted[]>([])
  const [apent, setApent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<LiveData|null>(null)
  const [feil, setFeil] = useState('')
  const [refreshCd, setRefreshCd] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>|null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stedRef = useRef<Sted|null>(null)

  useEffect(()=>{
    const h=(e:MouseEvent)=>{if(wrapRef.current&&!wrapRef.current.contains(e.target as Node))setApent(false)}
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h)
  },[])

  useEffect(()=>{
    if(sok.length<2){setSugg([]);setApent(false);return}
    if(timer.current) clearTimeout(timer.current)
    timer.current=setTimeout(async()=>{
      const r=await fetch('/api/steder?q='+encodeURIComponent(sok))
      const d=await r.json()
      const steder=Array.isArray(d)?d:(d.steder||[])
      setSugg(steder.slice(0,6)); setApent(steder.length>0)
    },300)
  },[sok])

  const hent=useCallback(async(raw:any)=>{
    // API returnerer {lat, lon} — mapper til {latitude, longitude} for fetchLiveData
    const sted:Sted = {
      name: raw.name,
      admin1: raw.admin1,
      latitude: raw.latitude ?? raw.lat,
      longitude: raw.longitude ?? raw.lon,
    }
    stedRef.current=sted
    setSok(sted.name+(sted.admin1?' — '+sted.admin1.replace(' Fylke',''):''))
    setSugg([]);setApent(false);setLoading(true);setFeil('');setData(null)
    try { const d=await fetchLiveData(sted); setData(d) }
    catch(e) { console.error(e); setFeil('Kunne ikke hente data. Prøv igjen.') }
    setLoading(false)
  },[])

  useEffect(()=>{
    if(!data)return
    setRefreshCd(600)
    const iv=setInterval(()=>setRefreshCd(c=>Math.max(0,c-1)),1000)
    const rf=setInterval(async()=>{if(stedRef.current){const d=await fetchLiveData(stedRef.current);setData(d);setRefreshCd(600)}},600000)
    return ()=>{clearInterval(iv);clearInterval(rf)}
  },[data])

  const s = data ? score(data.bolgeHoyde,data.vindMaks) : 0
  const farge = data ? FARGER[Math.min(s,5)] : '#1a6080'

  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}`}</style>

      <nav style={{background:'rgba(232,244,248,0.97)',borderBottom:'0.5px solid rgba(10,42,61,0.1)',padding:'1rem 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <a href="/" style={{textDecoration:'none',display:'flex',alignItems:'center'}}>
          <svg width="200" height="32" viewBox="0 0 280 44" fill="none">
            <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="#0a2a3d" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="#1a6080" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
            <text x="52" y="30" fontFamily="-apple-system,sans-serif" fontSize="23" fontWeight="600" fill="#0a2a3d" letterSpacing="-0.8">bolgevarsel<tspan fill="#1a6080" fontWeight="400">.no</tspan></text>
          </svg>
        </a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:11,fontWeight:600,color:'#1a6080',background:'#e8f4f8',border:'1px solid rgba(26,96,128,0.2)',padding:'4px 12px',borderRadius:100,letterSpacing:'0.05em',textTransform:'uppercase' as const}}>Bedriftsdashboard</span>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'8px 20px',borderRadius:100,textDecoration:'none',fontSize:13,fontWeight:600}}>Start 7 dager gratis</a>
        </div>
      </nav>

      <div style={{background:'linear-gradient(135deg,#0a2a3d 0%,#1a6080 100%)',padding:'3.5rem 2rem 5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <svg style={{position:'absolute',bottom:0,left:0,width:'100%',opacity:0.12}} viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0 30 Q180 0 360 30 Q540 60 720 30 Q900 0 1080 30 Q1260 60 1440 30 L1440 60 L0 60Z" fill="white"/>
        </svg>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.4)',marginBottom:12}}>Live sjodashboard</div>
        <h1 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:400,color:'white',margin:'0 0 0.75rem',letterSpacing:'-0.02em'}}>Sjodata for norskekysten — live</h1>
        <p style={{color:'rgba(255,255,255,0.55)',fontSize:'1rem',maxWidth:480,margin:'0 auto 2.5rem'}}>Bolgehoyde, vindstyrke, sjotemp og timesgrafer. Sok opp en kystlokasjon.</p>
        <div ref={wrapRef} style={{maxWidth:540,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',background:'white',borderRadius:14,padding:'0 1.2rem',boxShadow:'0 8px 40px rgba(0,0,0,0.25)',gap:10}}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#94a3b8" strokeWidth="1.4"/><path d="M12.5 12.5L16 16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input value={sok} onChange={e=>setSok(e.target.value)} onFocus={()=>sugg.length>0&&setApent(true)}
              placeholder="Sok etter kyststed, havn eller fjord..."
              style={{flex:1,padding:'1rem 0',border:'none',outline:'none',fontSize:'1rem',color:'#0a2a3d',background:'transparent'}}/>
            {loading&&<div style={{width:18,height:18,border:'2px solid #e2e8f0',borderTopColor:'#1a6080',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>}
          </div>
          {apent&&sugg.length>0&&(
            <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,right:0,background:'white',borderRadius:12,boxShadow:'0 8px 32px rgba(0,0,0,0.15)',overflow:'hidden',zIndex:50}}>
              {sugg.map((st,i)=>(
                <div key={i} onClick={()=>hent(st)} style={{padding:'0.75rem 1.2rem',cursor:'pointer',display:'flex',alignItems:'center',gap:10,borderBottom:i<sugg.length-1?'0.5px solid #f1f5f9':'none'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f8fbfc')}
                  onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                  <div><div style={{fontSize:14,color:'#0a2a3d',fontWeight:500}}>{st.name}</div>{st.admin1&&<div style={{fontSize:12,color:'#6b8fa3'}}>{st.admin1.replace(' Fylke','')}</div>}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{marginTop:'1.2rem',display:'flex',gap:'0.5rem',justifyContent:'center',flexWrap:'wrap'}}>
          {['Stavanger','Tanes','Alesund','Bergen','Bodo','Tromso','Kristiansand','Haugesund'].map((n,idx)=>{
            const names=['Stavanger','Tånes','Ålesund','Bergen','Bodø','Tromsø','Kristiansand','Haugesund']
            return (
              <button key={n} onClick={async()=>{
                const nm=names[idx]; setSok(nm);setApent(false)
                const r=await fetch('/api/steder?q='+encodeURIComponent(nm))
                const d=await r.json()
                const st=Array.isArray(d)?d:(d.steder||[])
                if(st.length>0)hent(st[0])
              }} style={{background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.75)',padding:'5px 14px',borderRadius:100,fontSize:12,cursor:'pointer'}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.2)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,255,255,0.1)')}>{names[idx]}</button>
            )
          })}
        </div>
      </div>

      {feil&&<div style={{maxWidth:960,margin:'1.5rem auto',padding:'1rem 1.5rem',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:12,color:'#dc2626',textAlign:'center'}}>{feil}</div>}

      {!data&&!loading&&!feil&&(
        <div style={{maxWidth:960,margin:'4rem auto',padding:'0 1.5rem',textAlign:'center'}}>
          <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'1.5rem',fontWeight:400,color:'#0a2a3d',margin:'0 0 0.5rem'}}>Sok opp en kystlokasjon for live data</h2>
          <p style={{color:'#6b8fa3',marginBottom:'3rem'}}>Bolger, vind, sjotemp, grafer og vurdering — oppdatert hvert 30. minutt.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',textAlign:'left'}}>
            {[['Bolgehoyde og periode','Open-Meteo Marine API'],['Vindanalyse','Vindrose og 24t maksimum fra met.no'],['Sjotemp','Overflatetemp langs hele kysten'],['12-timers graf','Interaktiv med fargekodet vurdering'],['Farevarsel-score','0-5 basert pa bolge og vind'],['Widget-klar','Bygg inn i din nettside eller app']].map(([t,d])=>(
              <div key={t} style={{background:'white',borderRadius:12,padding:'1.2rem',border:'0.5px solid rgba(10,42,61,0.08)'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#0a2a3d',marginBottom:4}}>{t}</div>
                <div style={{fontSize:12,color:'#6b8fa3',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data&&(
        <div style={{maxWidth:1100,margin:'0 auto',padding:'2rem 1.5rem'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <div style={{width:9,height:9,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 0 3px rgba(34,197,94,0.25)'}}/>
                <span style={{fontSize:11,fontWeight:600,color:'#6b8fa3',textTransform:'uppercase' as const,letterSpacing:'0.07em'}}>Live · oppdatert {data.oppdatert}</span>
              </div>
              <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:'2rem',fontWeight:400,color:'#0a2a3d',margin:'0 0 2px',letterSpacing:'-0.02em'}}>{data.navn}</h2>
              <div style={{fontSize:12,color:'#94a3b8'}}>{data.lat.toFixed(4)}N · {data.lon.toFixed(4)}E</div>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <span style={{fontSize:12,color:'#6b8fa3'}}>Auto-refresh om {Math.floor(refreshCd/60)}:{String(refreshCd%60).padStart(2,'0')}</span>
              <button onClick={()=>stedRef.current&&hent(stedRef.current)}
                style={{fontSize:12,padding:'7px 16px',borderRadius:100,border:'0.5px solid rgba(10,42,61,0.15)',background:'white',color:'#0a2a3d',cursor:'pointer',fontWeight:500}}>
                Oppdater na
              </button>
            </div>
          </div>

          <div style={{background:farge+'18',border:'1px solid '+farge+'35',borderRadius:14,padding:'1.1rem 1.5rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:48,height:48,borderRadius:12,background:farge,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:22,fontWeight:300}}>{s}</div>
              <div>
                <div style={{fontSize:17,fontWeight:600,color:farge,marginBottom:2}}>{TEKST[Math.min(s,5)]}</div>
                <div style={{fontSize:12,color:'#6b8fa3'}}>Bolger {data.bolgeHoyde.toFixed(1)}m · maks vind {data.vindMaks} m/s (neste 24t)</div>
              </div>
            </div>
            <div style={{position:'relative'}}>
              <FarevarselSkala aktivt={s}/>
            </div>
          </div>

          <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
            <Stat label="Bolgehoyde" value={data.bolgeHoyde.toFixed(1)+' m'} sub={data.bolgePeriode+'s periode · fra '+retning(data.bolgeDir)} farge={FARGER[Math.min(score(data.bolgeHoyde,0),5)]}/>
            <Stat label="Vind na" value={data.vindMs+' m/s'} sub={'Maks '+data.vindMaks+' m/s · fra '+retning(data.vindDir)}/>
            <Stat label="Lufttemp" value={data.lufttemp+'°C'}/>
            {data.sjoTemp&&<Stat label="Sjotemp" value={data.sjoTemp+'°C'} sub="Overflate"/>}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'1.5rem',marginBottom:'1.5rem'}}>
            <div style={{background:'white',borderRadius:16,padding:'1.5rem',border:'0.5px solid rgba(10,42,61,0.08)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                <div style={{fontSize:14,fontWeight:600,color:'#0a2a3d'}}>Bolgehoyde — neste 12 timer</div>
                <span style={{fontSize:11,color:'#94a3b8'}}>Hover for detaljer</span>
              </div>
              <BolgeGraf data={data.timesvarsel}/>
            </div>
            <div style={{background:'white',borderRadius:16,padding:'1.5rem',border:'0.5px solid rgba(10,42,61,0.08)'}}>
              <div style={{fontSize:14,fontWeight:600,color:'#0a2a3d',marginBottom:'1rem'}}>Vindrose</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.75rem'}}>
                <Vindrose dir={data.vindDir} ms={data.vindMs}/>
                {[['Navarende',data.vindMs+' m/s'],['Maks 24t',data.vindMaks+' m/s'],['Retning',retning(data.vindDir)]].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',width:'100%',fontSize:13,padding:'5px 0',borderBottom:'0.5px solid #f1f5f9'}}>
                    <span style={{color:'#6b8fa3'}}>{l}</span><span style={{fontWeight:500,color:'#0a2a3d'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{background:'white',borderRadius:16,padding:'1.5rem',border:'0.5px solid rgba(10,42,61,0.08)',marginBottom:'1.5rem'}}>
            <div style={{fontSize:14,fontWeight:600,color:'#0a2a3d',marginBottom:'1rem'}}>Timebasert prognose</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{background:'#f8fbfc'}}>
                    {['Tid','Bolger','Periode','Vind','Temp','Vurdering'].map(h=>(
                      <th key={h} style={{padding:'8px 14px',textAlign:'left',fontWeight:600,color:'#6b8fa3',fontSize:11,textTransform:'uppercase' as const,letterSpacing:'0.05em',borderBottom:'1px solid #f1f5f9',whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.timesvarsel.map((t,i)=>{
                    const sc=score(t.bolge,t.vind); const f=FARGER[Math.min(sc,5)]
                    return (
                      <tr key={i} style={{borderBottom:'0.5px solid #f8fbfc'}}
                        onMouseEnter={e=>(e.currentTarget.style.background='#f8fbfc')}
                        onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                        <td style={{padding:'10px 14px',fontWeight:500,color:'#0a2a3d',whiteSpace:'nowrap'}}>{t.tid}</td>
                        <td style={{padding:'10px 14px'}}>
                          <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
                            <span style={{width:7,height:7,borderRadius:'50%',background:f,flexShrink:0,display:'inline-block'}}/>
                            <span style={{fontWeight:500,color:'#0a2a3d'}}>{t.bolge.toFixed(1)} m</span>
                          </span>
                        </td>
                        <td style={{padding:'10px 14px',color:'#6b8fa3'}}>{t.periode}s</td>
                        <td style={{padding:'10px 14px',color:'#0a2a3d'}}>{t.vind} m/s</td>
                        <td style={{padding:'10px 14px',color:'#0a2a3d'}}>{t.temp}°C</td>
                        <td style={{padding:'10px 14px'}}>
                          <span style={{fontSize:11,fontWeight:500,padding:'3px 9px',borderRadius:100,background:f+'22',color:f,whiteSpace:'nowrap'}}>{TEKST[Math.min(sc,5)]}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:'1.5rem',alignItems:'start'}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:'#0a2a3d',marginBottom:'0.75rem'}}>Widget-forhandsvisning</div>
              <div style={{background:'white',borderRadius:16,padding:'1.2rem 1.4rem',border:'2px solid '+farge+'30',boxShadow:'0 4px 20px '+farge+'15'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:600,color:'#6b8fa3',textTransform:'uppercase' as const,letterSpacing:'0.07em',marginBottom:1}}>Bolgevarsel</div>
                    <div style={{fontSize:14,fontWeight:500,color:'#0a2a3d'}}>{data.navn.split(',')[0]}</div>
                  </div>
                  <div style={{width:8,height:8,borderRadius:'50%',background:farge}}/>
                </div>
                <div style={{background:farge+'15',borderLeft:'3px solid '+farge,padding:'8px 10px',borderRadius:'0 8px 8px 0',marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:600,color:farge}}>{TEKST[Math.min(s,5)]}</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[['Bolger',data.bolgeHoyde.toFixed(1)+' m'],['Periode',data.bolgePeriode+'s'],['Vind',data.vindMs+' m/s'],['Luft',data.lufttemp+'°C']].map(([l,v])=>(
                    <div key={l} style={{background:'#f8fbfc',borderRadius:8,padding:'8px 10px'}}>
                      <div style={{fontSize:10,color:'#6b8fa3'}}>{l}</div>
                      <div style={{fontSize:15,fontWeight:500,color:'#0a2a3d'}}>{v}</div>
                    </div>
                  ))}
                </div>
                {data.sjoTemp&&<div style={{marginTop:8,fontSize:12,color:'#6b8fa3',textAlign:'center'}}>Sjotemp: <strong style={{color:'#0a2a3d'}}>{data.sjoTemp}°C</strong></div>}
                <div style={{marginTop:10,fontSize:10,color:'#94a3b8',textAlign:'center'}}>bolgevarsel.no · {data.oppdatert}</div>
              </div>
            </div>
            <div style={{background:'white',borderRadius:16,padding:'1.5rem 2rem',border:'0.5px solid rgba(10,42,61,0.08)'}}>
              <div style={{fontSize:14,fontWeight:600,color:'#0a2a3d',marginBottom:'0.75rem'}}>Integrer sjodata i din bedrift</div>
              <p style={{fontSize:13,color:'#6b8fa3',lineHeight:1.7,margin:'0 0 1.2rem'}}>Bolgevarsel leverer daglig sjovarsel pa SMS og e-post til dine ansatte, kunder eller gjester — skreddersydd per kystlokasjon og aktivitet.</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.6rem',marginBottom:'1.5rem'}}>
                {[['SMS-varsel til ansatte','Automatisk kl. du velger'],['Kritisk farevarsel','Alltid pa — sendes umiddelbart'],['9 aktivitetsprofiler','Surfer, seiler, fisker...'],['Opptil 5 lokasjoner','Ulike kyststeder samlet'],['Detaljert e-postrapport','Med grafer og tips'],['API-integrasjon','Egne systemer og apper']].map(([t,d])=>(
                  <div key={t} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                    <div style={{width:16,height:16,borderRadius:'50%',background:'#e8f5ed',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:'#0a2a3d'}}>{t}</div>
                      <div style={{fontSize:11,color:'#6b8fa3'}}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                <a href="/registrer" style={{flex:1,display:'block',background:'#0a2a3d',color:'white',padding:'0.85rem 1.5rem',borderRadius:100,textDecoration:'none',fontSize:13,fontWeight:600,textAlign:'center'}}>Kom i gang — 7 dager gratis</a>
                <a href="mailto:hei@bolgevarsel.no" style={{display:'block',background:'#f0f8fc',color:'#1a6080',padding:'0.85rem 1.5rem',borderRadius:100,textDecoration:'none',fontSize:13,fontWeight:500}}>Kontakt oss</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
