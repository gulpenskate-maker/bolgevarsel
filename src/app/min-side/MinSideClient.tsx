'use client'
import { useState, useEffect, useRef } from 'react'

const S = {
  page: { minHeight:'100vh', background:'#e8f4f8', fontFamily:'DM Sans, sans-serif' } as React.CSSProperties,
  nav: { padding:'1.2rem 2rem', borderBottom:'1px solid rgba(10,42,61,0.08)', background:'rgba(232,244,248,0.95)', position:'sticky' as const, top:0, zIndex:100 },
  logo: { fontFamily:'serif', fontSize:'1.3rem', fontWeight:600, color:'#0a2a3d', textDecoration:'none' } as React.CSSProperties,
  wrap: { maxWidth:680, margin:'0 auto', padding:'2.5rem 1.5rem' },
  card: { background:'white', borderRadius:20, padding:'1.5rem', border:'1px solid rgba(10,42,61,0.07)', marginBottom:'1.2rem', boxShadow:'0 2px 12px rgba(10,42,61,0.06)' } as React.CSSProperties,
  sTitle: { fontFamily:'serif', fontSize:'1.2rem', fontWeight:400, color:'#0a2a3d', marginBottom:'1rem', paddingBottom:'0.6rem', borderBottom:'1px solid rgba(10,42,61,0.07)' } as React.CSSProperties,
  inp: { width:'100%', padding:'0.75rem 1rem', borderRadius:100, border:'1.5px solid rgba(10,42,61,0.12)', background:'#f8fbfc', fontSize:'0.9rem', color:'#0a2a3d', outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const },
  btnPrimary: { background:'#0a2a3d', color:'white', padding:'0.7rem 1.2rem', borderRadius:100, border:'none', cursor:'pointer', fontSize:'0.88rem', fontWeight:500 } as React.CSSProperties,
  btnDanger: { background:'#fee2e2', color:'#ef4444', padding:'0.5rem 0.9rem', borderRadius:100, border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:500 } as React.CSSProperties,
  btnGhost: { background:'#f0f8fc', color:'#0a2a3d', padding:'0.5rem 0.9rem', borderRadius:100, border:'none', cursor:'pointer', fontSize:'0.8rem', fontWeight:500 } as React.CSSProperties,
  badge: (plan: string) => ({ background: plan==='pro'?'#fef3c7':plan==='familie'?'#dbeafe':'#e8f4f8', color: plan==='pro'?'#92400e':plan==='familie'?'#1d4ed8':'#0a2a3d', padding:'3px 10px', borderRadius:100, fontSize:'0.78rem', fontWeight:500 }) as React.CSSProperties,
  tag: (active: boolean) => ({ background: active?'#dcfce7':'#f1f5f9', color: active?'#16a34a':'#64748b', padding:'2px 8px', borderRadius:100, fontSize:'0.75rem', fontWeight:500 }) as React.CSSProperties,
}

function BrandIllustration() {
  return (
    <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="loginSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8e8f5"/><stop offset="60%" stopColor="#e8f4f8"/><stop offset="100%" stopColor="#0a2a3d"/></linearGradient>
        <linearGradient id="loginSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a6080"/><stop offset="100%" stopColor="#071622"/></linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#loginSky)"/>
      <circle cx="520" cy="70" r="35" fill="#fff4e0" opacity="0.5"/>
      <circle cx="520" cy="70" r="22" fill="#ffd580" opacity="0.6"/>
      <circle cx="520" cy="70" r="13" fill="#ffbc40" opacity="0.8"/>
      <g opacity="0.6"><ellipse cx="80" cy="55" rx="55" ry="16" fill="white"/><ellipse cx="105" cy="42" rx="38" ry="14" fill="white"/><ellipse cx="58" cy="48" rx="32" ry="13" fill="white"/></g>
      <g opacity="0.4"><ellipse cx="320" cy="40" rx="45" ry="13" fill="white"/><ellipse cx="350" cy="30" rx="30" ry="11" fill="white"/></g>
      <path d="M0 160 L80 100 L160 140 L240 90 L320 130 L400 85 L480 125 L560 95 L600 115 L600 220 L0 220 Z" fill="#2a6a8a" opacity="0.2"/>
      <path d="M0 185 L100 130 L200 165 L300 115 L400 155 L500 120 L600 145 L600 230 L0 230 Z" fill="#1e5a7a" opacity="0.25"/>
      <ellipse cx="140" cy="210" rx="60" ry="16" fill="#2a5a3a" opacity="0.85"/>
      <path d="M90 210 Q120 194 140 190 Q160 194 190 210 Z" fill="#3a6a4a" opacity="0.9"/>
      <rect x="137" y="170" width="6" height="24" fill="#e8e0d0" rx="1"/>
      <rect x="134" y="168" width="11" height="5" fill="#cc3333" rx="1"/>
      <circle cx="140" cy="168" r="3" fill="#ffcc00" opacity="0.9"/>
      <g><line x1="440" y1="210" x2="440" y2="192" stroke="#8a7a6a" strokeWidth="1.4"/><path d="M440 210 L422 204 L440 194 Z" fill="rgba(255,255,255,0.9)"/><path d="M440 210 L456 204 L440 200 Z" fill="rgba(255,255,255,0.65)"/><path d="M426 213 Q440 217 454 213" fill="#5a4a3a"/></g>
      <path d="M0 220 Q75 210 150 220 Q225 230 300 218 Q375 206 450 220 Q525 234 600 218 L600 400 L0 400 Z" fill="url(#loginSea)"/>
      <g opacity="0.3">
        <path d="M-50 250 Q50 242 150 250 Q250 258 350 250 Q450 242 550 250 Q580 252 650 250" fill="none" stroke="white" strokeWidth="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="100 0" dur="4s" repeatCount="indefinite"/></path>
        <path d="M-50 275 Q60 267 160 275 Q260 283 360 273 Q460 263 560 273 Q590 275 650 273" fill="none" stroke="white" strokeWidth="1"><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" dur="5.5s" repeatCount="indefinite"/></path>
        <path d="M-50 310 Q70 302 170 310 Q270 318 370 308 Q470 298 570 308 Q595 310 650 308" fill="none" stroke="white" strokeWidth="0.8" opacity="0.6"><animateTransform attributeName="transform" type="translate" from="0 0" to="60 0" dur="7s" repeatCount="indefinite"/></path>
      </g>
    </svg>
  )
}

type Sub = { id:string; email:string; plan:string; status:string; send_time?:string }
type Loc = { id:string; name:string; lat:number; lon:number }
type Rec = { id:string; location_id:string; phone:string; name:string; active:boolean; sms_enabled:boolean }

export default function MinSideClient() {
  const [email, setEmail] = useState('')
  const [sub, setSub] = useState<Sub|null>(null)
  const [sendTime, setSendTime] = useState('07:30')
  const [sendTimeSaving, setSendTimeSaving] = useState(false)
  const [sendTimeSaved, setSendTimeSaved] = useState(false)
  const [locs, setLocs] = useState<Loc[]>([])
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'login'|'dash'>('login')
  const [magicSendt, setMagicSendt] = useState(false)
  const [feil, setFeil] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    fetch('/api/min-side/session', { signal: controller.signal })
      .then(r => r.json())
      .then(async d => {
        clearTimeout(timeout)
        if (d.subscriber) {
          setSub(d.subscriber); setLocs(d.locations||[]); setRecs(d.recipients||[])
          setEmail(d.subscriber.email); setSendTime(d.subscriber.send_time||'07:30'); setView('dash')
        } else {
          const saved = localStorage.getItem('bv_email')
          if (saved) {
            setEmail(saved)
            const r2 = await fetch(`/api/min-side?email=${encodeURIComponent(saved)}`)
            const d2 = await r2.json()
            if (d2.subscriber) {
              setSub(d2.subscriber); setLocs(d2.locations||[]); setRecs(d2.recipients||[])
              setView('dash')
            } else localStorage.removeItem('bv_email')
          }
        }
      })
      .catch(() => clearTimeout(timeout))
  }, [])

  const [locQ, setLocQ] = useState('')
  const [locSugg, setLocSugg] = useState<any[]>([])
  const [locOpen, setLocOpen] = useState(false)
  const [locValgt, setLocValgt] = useState<{name:string;lat:number;lon:number}|null>(null)
  const locTimer = useRef<any>(null)
  const [editRec, setEditRec] = useState<Rec|null>(null)
  const [editPhone, setEditPhone] = useState('')
  const [editName, setEditName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newName, setNewName] = useState('')
  const [newLocId, setNewLocId] = useState('')

  useEffect(() => {
    if (locQ.length < 2) { setLocSugg([]); setLocOpen(false); return }
    clearTimeout(locTimer.current)
    locTimer.current = setTimeout(async () => {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locQ)}&count=6&format=json`)
      const d = await r.json()
      const hits = (d.results||[]).filter((x:any) => x.country_code==='NO').slice(0,5)
      setLocSugg(hits); setLocOpen(hits.length>0)
    }, 300)
  }, [locQ])

  async function login(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setFeil('')
    const r = await fetch('/api/auth/send-magic-link', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email }),
    })
    const d = await r.json()
    if (d.ok) setMagicSendt(true)
    else setFeil(d.error || 'Ingen konto funnet for denne e-postadressen.')
    setLoading(false)
  }

  function pickLoc(s: any) {
    const name = s.name + (s.admin1 ? ', '+s.admin1.replace(' Fylke','') : '')
    setLocQ(name); setLocValgt({name, lat:s.latitude, lon:s.longitude}); setLocOpen(false); setLocSugg([])
  }

  async function addLoc(e: React.FormEvent) {
    e.preventDefault(); if (!locValgt) return
    const r = await fetch('/api/min-side/location', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ subscriber_id:sub!.id, name:locValgt.name, lat:locValgt.lat, lon:locValgt.lon }) })
    const d = await r.json()
    if (d.location) { setLocs([...locs, d.location]); setLocQ(''); setLocValgt(null) }
  }

  async function deleteLoc(id: string) {
    if (!confirm('Slett lokasjon og alle tilknyttede mottakere?')) return
    await fetch('/api/min-side/location/delete', { method:'DELETE', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id, subscriber_id:sub!.id }) })
    setLocs(locs.filter(l=>l.id!==id)); setRecs(recs.filter(r=>r.location_id!==id))
  }

  async function addRec(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch('/api/min-side/recipient', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ subscriber_id:sub!.id, location_id:newLocId, phone:newPhone, name:newName }) })
    const d = await r.json()
    if (d.recipient) { setRecs([...recs, d.recipient]); setNewPhone(''); setNewName(''); setNewLocId('') }
  }

  async function deleteRec(id: string) {
    if (!confirm('Slett mottaker?')) return
    await fetch('/api/min-side/recipient/delete', { method:'DELETE', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id, subscriber_id:sub!.id }) })
    setRecs(recs.filter(r=>r.id!==id))
  }

  async function toggleRec(rec: Rec) {
    const r = await fetch('/api/min-side/recipient/update', { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id:rec.id, subscriber_id:sub!.id, active:!rec.active }) })
    const d = await r.json()
    if (d.recipient) setRecs(recs.map(r=>r.id===rec.id ? d.recipient : r))
  }

  async function toggleSms(rec: Rec) {
    const r = await fetch('/api/min-side/recipient/update', { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id:rec.id, subscriber_id:sub!.id, sms_enabled:!rec.sms_enabled }) })
    const d = await r.json()
    if (d.recipient) setRecs(recs.map(r=>r.id===rec.id ? d.recipient : r))
  }

  async function saveEditRec(e: React.FormEvent) {
    e.preventDefault(); if (!editRec) return
    const r = await fetch('/api/min-side/recipient/update', { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id:editRec.id, subscriber_id:sub!.id, phone:editPhone, name:editName }) })
    const d = await r.json()
    if (d.recipient) { setRecs(recs.map(r=>r.id===editRec.id ? d.recipient : r)); setEditRec(null) }
  }

  const planLabel: Record<string,string> = { kyst:'Kyst', familie:'Familie', pro:'Pro' }

  // LOGIN VIEW
  if (view==='login') return (
    <div style={{ minHeight:'100vh', fontFamily:'DM Sans, sans-serif', position:'relative' }}>
      {/* Full-side illustrasjon */}
      <div style={{ position:'fixed', inset:0, zIndex:0 }}>
        <BrandIllustration />
        {/* Fyller resten under SVG med havfarge */}
        <div style={{ background:'#0a2a3d', flex:1, minHeight:'100vh' }}/>
      </div>

      {/* Nav over illustrasjonen */}
      <nav style={{ position:'relative', zIndex:10, padding:'1.2rem 2rem', display:'flex', alignItems:'center' }}>
        <a href="/" style={{ fontFamily:'serif', fontSize:'1.3rem', fontWeight:600, color:'#0a2a3d', textDecoration:'none' }}>
          bølge<span style={{color:'#1a6080'}}>varsel</span>
        </a>
      </nav>

      {/* Innhold over illustrasjonen */}
      <div style={{ position:'relative', zIndex:10, maxWidth:420, margin:'0 auto', padding:'1rem 1.5rem 3rem', textAlign:'center' }}>
        {magicSendt ? (
          <div style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)', borderRadius:24, padding:'2.5rem 2rem', boxShadow:'0 8px 40px rgba(10,42,61,0.15)' }}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📬</div>
            <h1 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'#0a2a3d',marginBottom:'0.5rem'}}>Sjekk innboksen!</h1>
            <p style={{color:'#6b8fa3',marginBottom:'0.3rem'}}>Vi har sendt en innloggingslenke til</p>
            <p style={{color:'#0a2a3d',fontWeight:600,marginBottom:'1.5rem'}}>{email}</p>
            <p style={{color:'#6b8fa3',fontSize:'0.85rem',marginBottom:'1.5rem'}}>Lenken er gyldig i 1 time. Sjekk eventuelt søppelpost.</p>
            <button onClick={()=>{setMagicSendt(false);setFeil('')}} style={{...S.btnGhost,fontSize:'0.85rem'}}>← Prøv en annen e-post</button>
          </div>
        ) : (
          <>
            {/* Hovedkort — glassmorphism */}
            <div style={{ background:'rgba(255,255,255,0.82)', backdropFilter:'blur(16px)', borderRadius:24, padding:'2.5rem 2rem', boxShadow:'0 8px 40px rgba(10,42,61,0.15)', marginBottom:'1rem' }}>
              <h1 style={{fontFamily:'serif',fontSize:'2rem',fontWeight:300,color:'#0a2a3d',marginBottom:'0.4rem'}}>Min side</h1>
              <p style={{color:'#6b8fa3',marginBottom:'1.5rem',fontSize:'0.95rem'}}>Skriv inn e-posten din — vi sender deg en innloggingslenke</p>
              <form onSubmit={login} style={{display:'flex',flexDirection:'column',gap:'0.7rem'}}>
                <input style={{...S.inp, background:'rgba(248,251,252,0.9)'}} type="email" placeholder="din@epost.no" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus />
                {feil && <p style={{color:'#ef4444',fontSize:'0.85rem',margin:0}}>{feil}</p>}
                <button style={{...S.btnPrimary,width:'100%',padding:'0.9rem',fontSize:'0.95rem'}} disabled={loading}>
                  {loading ? 'Sender...' : 'Send innloggingslenke →'}
                </button>
              </form>
            </div>

            {/* Hjelpekort — lett transparent */}
            <div style={{ background:'rgba(255,255,255,0.65)', backdropFilter:'blur(12px)', borderRadius:16, padding:'1.2rem 1.4rem', textAlign:'left', boxShadow:'0 4px 20px rgba(10,42,61,0.1)' }}>
              <p style={{margin:'0 0 0.7rem',fontSize:'0.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.06em'}}>Hjelp</p>
              <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                <div style={{fontSize:'0.88rem',color:'#334155'}}>
                  <strong>Trenger du hjelp?</strong>{' '}
                  <a href="/hjelp" style={{color:'#1a6080',textDecoration:'none',fontWeight:500}}>Se hjelpesenter →</a>
                </div>
                <div style={{fontSize:'0.88rem',color:'#334155'}}>
                  <strong>Ny kunde?</strong>{' '}
                  <a href="/registrer" style={{color:'#1a6080',textDecoration:'none',fontWeight:500}}>Start gratis prøveperiode →</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  // DASHBOARD VIEW
  return (
    <div style={S.page}>
      <div style={{background:'#c8e8f5', overflow:'hidden', position:'relative'}}>
        <div style={{padding:'1.1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', maxWidth:720, margin:'0 auto', position:'relative', zIndex:2}}>
          <a href="/" style={{fontFamily:'Georgia,serif', fontSize:'1.25rem', fontWeight:400, color:'#0a2a3d', textDecoration:'none', letterSpacing:'-0.01em'}}>bølge<span style={{color:'#1a6080'}}>varsel</span></a>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={{...S.badge(sub!.plan)}}>{planLabel[sub!.plan]}</span>
            <button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});localStorage.removeItem('bv_email');setView('login');setSub(null)}}
              style={{background:'transparent',border:'1px solid rgba(10,42,61,0.15)',color:'rgba(10,42,61,0.4)',cursor:'pointer',fontSize:'0.78rem',padding:'4px 14px',borderRadius:100}}>Logg ut</button>
          </div>
        </div>
        <svg viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',display:'block',marginTop:'-6px'}}>
          <style>{`
            .bv-sun  { animation: bv-bob  8s ease-in-out infinite; }
            .bv-boat { animation: bv-sail 7s ease-in-out infinite; }
            .bv-f1   { animation: bv-swim  5s ease-in-out infinite; }
            .bv-f2   { animation: bv-swim2 7s ease-in-out 1.5s infinite; }
            .bv-f3   { animation: bv-swim  9s ease-in-out 3s infinite reverse; }
          `}</style>
          <defs>
            <linearGradient id="sky8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8e8f5"/><stop offset="100%" stopColor="#a8d4e8"/></linearGradient>
            <linearGradient id="sea8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a6080"/><stop offset="100%" stopColor="#0a2a3d"/></linearGradient>
            <linearGradient id="sea8b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e5a7a"/><stop offset="100%" stopColor="#0d3350"/></linearGradient>
          </defs>
          <rect width="1440" height="180" fill="url(#sky8)"/>
          {/* Sol */}
          <g className="bv-sun"><circle cx="1340" cy="42" r="26" fill="#fff4e0" opacity="0.4"/>
          <circle cx="1340" cy="42" r="17" fill="#ffd580" opacity="0.5"/>
          <circle cx="1340" cy="42" r="10" fill="#ffbc40" opacity="0.72"/></g>
          {/* Sky */}
          <ellipse cx="200" cy="32" rx="55" ry="12" fill="white" opacity="0.2"/>
          <ellipse cx="235" cy="22" rx="38" ry="10" fill="white" opacity="0.15"/>
          {/* Fjell */}
          <path d="M0 125 L180 72 L320 108 L500 58 L660 95 L820 55 L980 90 L1140 60 L1300 95 L1440 68 L1440 180 L0 180 Z" fill="#6a9ab8" opacity="0.28"/>
          {/* Øy */}
          <ellipse cx="380" cy="118" rx="95" ry="16" fill="#2a5a3a" opacity="0.9"/>
          <path d="M295 118 Q338 102 380 97 Q422 102 465 118 Z" fill="#3a6a4a" opacity="0.95"/>
          {/* Fyrtårn */}
          <rect x="377" y="76" width="9" height="26" fill="#e8e0d0" rx="1.5"/>
          <rect x="379" y="83" width="3" height="4" fill="#a8c8d8" rx="0.5" opacity="0.7"/>
          <rect x="373" y="72" width="17" height="6" fill="#cc3333" rx="1.5"/>
          <circle cx="381" cy="72" r="6" fill="#ffdd44" opacity="0.15"/>
          <circle cx="381" cy="72" r="3.5" fill="#ffdd44" opacity="0.9"/>
          {/* Båt */}
          <g className="bv-boat"><path d="M820 118 Q855 130 890 118 L885 128 Q855 138 825 128 Z" fill="#0a2a3d" opacity="0.75"/>
          <line x1="825" y1="128" x2="885" y2="128" stroke="#c8b89a" strokeWidth="1" opacity="0.45"/>
          <line x1="855" y1="118" x2="855" y2="82" stroke="#0a2a3d" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
          <line x1="843" y1="92" x2="867" y2="92" stroke="#0a2a3d" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
          <path d="M855 84 L884 114 L855 118 Z" fill="rgba(235,228,212,0.88)"/>
          <path d="M855 87 L829 112 L855 118 Z" fill="rgba(235,228,212,0.55)"/>
          <path d="M855 82 L867 86 L855 90 Z" fill="#cc3333" opacity="0.9"/></g>
          {/* Hav */}
          <path d="M0 126 Q180 112 360 126 Q540 140 720 122 Q900 104 1080 122 Q1260 140 1440 124 L1440 180 L0 180 Z" fill="url(#sea8)"/>
          <path d="M0 138 Q200 128 400 138 Q600 148 800 136 Q1000 124 1200 136 Q1350 144 1440 138 L1440 180 L0 180 Z" fill="url(#sea8b)" opacity="0.55"/>
          {/* Bølgelinjer */}
          <path d="M0 147 Q180 141 360 147 Q540 153 720 147 Q900 141 1080 147 Q1260 153 1440 147" fill="none" stroke="rgba(255,255,255,0.17)" strokeWidth="1.2"/>
          <path d="M0 157 Q180 151 360 157 Q540 163 720 155 Q900 147 1080 155 Q1260 163 1440 157" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
          {/* Fisk 1 */}
          <g className="bv-f1"><ellipse cx="240" cy="141" rx="16" ry="6" fill="none" stroke="rgba(77,168,204,0.52)" strokeWidth="1.2"/>
          <path d="M224 141 L215 135 M224 141 L215 147" stroke="rgba(77,168,204,0.52)" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="252" cy="139" r="1.5" fill="rgba(77,168,204,0.52)"/>
          <path d="M238 135 Q242 130 246 135" fill="none" stroke="rgba(77,168,204,0.38)" strokeWidth="1"/></g>
          {/* Fisk 2 */}
          <g className="bv-f2"><ellipse cx="1060" cy="152" rx="11" ry="4.5" fill="none" stroke="rgba(77,168,204,0.36)" strokeWidth="1"/>
          <path d="M1049 152 L1041 147 M1049 152 L1041 157" stroke="rgba(77,168,204,0.36)" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="1069" cy="150" r="1.2" fill="rgba(77,168,204,0.36)"/></g>
          {/* Fisk 3 */}
          <g className="bv-f3"><ellipse cx="620" cy="163" rx="8" ry="3" fill="none" stroke="rgba(77,168,204,0.2)" strokeWidth="0.9"/>
          <path d="M612 163 L607 160 M612 163 L607 166" stroke="rgba(77,168,204,0.2)" strokeWidth="0.9" strokeLinecap="round"/></g>
          {/* Overgang */}
          <path d="M0 171 Q360 163 720 171 Q1080 179 1440 171 L1440 180 L0 180 Z" fill="#e8f4f8"/>
        </svg>
      </div>

      <div style={S.wrap}>
        <div style={{marginBottom:'1.5rem'}}>
          <h1 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'#0a2a3d',margin:0}}>Hei! 👋</h1>
          <p style={{color:'#6b8fa3',margin:'4px 0 0',fontSize:'0.9rem'}}>{sub!.email}</p>
        </div>

        <div style={S.card}>
          <h2 style={S.sTitle}><span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.48-2.02-4.5-4.5-4.5z" stroke="#1a6080" strokeWidth="1.3" fill="none" strokeLinejoin="round"/><circle cx="8" cy="6" r="1.5" stroke="#1a6080" strokeWidth="1.2" fill="none"/></svg>Mine lokasjoner</span></h2>
          {locs.length===0 && <p style={{color:'#6b8fa3',fontSize:'0.9rem',marginBottom:'1rem'}}>Ingen lokasjoner ennå.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:locs.length?'1.2rem':0}}>
            {locs.map(loc => (
              <div key={loc.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
                <div>
                  <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.95rem'}}>{loc.name}</div>
                  <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginTop:'2px'}}>{loc.lat.toFixed(4)}°N · {recs.filter(r=>r.location_id===loc.id).length} mottaker(e)</div>
                </div>
                <button style={S.btnDanger} onClick={()=>deleteLoc(loc.id)}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 7h3l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              </div>
            ))}
          </div>
          <form onSubmit={addLoc}>
            <div style={{position:'relative',marginBottom:'0.6rem'}}>
              <input style={S.inp} placeholder="Søk etter sted langs kysten..." value={locQ}
                onChange={e=>{setLocQ(e.target.value);setLocValgt(null)}}
                onBlur={()=>setTimeout(()=>setLocOpen(false),200)}
                onFocus={()=>locSugg.length>0&&setLocOpen(true)} autoComplete="off" />
              {locValgt && <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'0.72rem',color:'#22c55e',fontWeight:500}}>✓ funnet</span>}
              {locOpen && locSugg.length>0 && (
                <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'white',borderRadius:12,boxShadow:'0 8px 24px rgba(10,42,61,0.12)',border:'1px solid rgba(10,42,61,0.08)',overflow:'hidden',zIndex:999}}>
                  {locSugg.map((s,i)=>(
                    <div key={i} onMouseDown={()=>pickLoc(s)} style={{padding:'9px 14px',cursor:'pointer',borderBottom:i<locSugg.length-1?'1px solid #f0f4f8':'none',fontSize:'0.88rem'}}
                      onMouseEnter={e=>(e.currentTarget.style.background='#f0f8fc')} onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                      <span style={{fontWeight:500,color:'#0a2a3d'}}>{s.name}</span>
                      {s.admin1&&<span style={{color:'#6b8fa3',fontSize:'0.8rem'}}> – {s.admin1.replace(' Fylke','')}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button style={{...S.btnPrimary,opacity:locValgt?1:0.4,width:'100%',padding:'0.85rem'}} type="submit" disabled={!locValgt}>
              {locValgt ? `+ Legg til ${locValgt.name}` : 'Søk etter sted for å legge til'}
            </button>
          </form>
        </div>

        <div style={S.card}>
          <h2 style={S.sTitle}><span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4.5" y="1" width="7" height="13" rx="1.5" stroke="#1a6080" strokeWidth="1.3" fill="none"/><path d="M6.5 11h3" stroke="#1a6080" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/></svg>Mine mottakere</span></h2>
          {recs.length===0 && <p style={{color:'#6b8fa3',fontSize:'0.9rem',marginBottom:'1rem'}}>Ingen mottakere ennå.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:locs.length?'1.2rem':0}}>
            {recs.map(rec => (
              <div key={rec.id}>
                {editRec?.id===rec.id ? (
                  <form onSubmit={saveEditRec} style={{background:'#f0f8fc',borderRadius:12,padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    <input style={S.inp} placeholder="Navn (valgfritt)" value={editName} onChange={e=>setEditName(e.target.value)} />
                    <input style={S.inp} placeholder="Telefon (+4799...)" value={editPhone} onChange={e=>setEditPhone(e.target.value)} required />
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button style={{...S.btnPrimary,flex:1,padding:'0.7rem'}} type="submit"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> Lagre</button>
                      <button style={{...S.btnGhost,padding:'0.7rem 1rem'}} type="button" onClick={()=>setEditRec(null)}>Avbryt</button>
                    </div>
                  </form>
                ) : (
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
                    <div>
                      <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.95rem'}}>{rec.name||rec.phone}</div>
                      <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginTop:'2px',display:'flex',alignItems:'center',gap:'6px'}}>
                        {rec.name&&<span>{rec.phone} · </span>}
                        <span>{locs.find(l=>l.id===rec.location_id)?.name||'Ukjent lokasjon'}</span>
                        <span style={S.tag(rec.active)}>{rec.active?'Aktiv':'Pauset'}</span>
                        <span style={{...S.tag(rec.sms_enabled!==false),fontSize:'0.7rem'}}>{rec.sms_enabled!==false?'SMS på':'SMS av'}</span>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'0.4rem'}}>
                      <button style={S.btnGhost} onClick={()=>toggleRec(rec)}>{rec.active?(<><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="3" height="8" rx="0.5" fill="currentColor"/><rect x="7" y="2" width="3" height="8" rx="0.5" fill="currentColor"/></svg></>):(<><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 2l7 4-7 4V2z" fill="currentColor"/></svg></>)}</button>
                      <button style={{...S.btnGhost,background:rec.sms_enabled!==false?'#f0fdf4':'#fef9c3',color:rec.sms_enabled!==false?'#16a34a':'#854d0e'}} onClick={()=>toggleSms(rec)}>
                        {rec.sms_enabled!==false?(<><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M3.5 5.5h5M3.5 7.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/></svg></>):(<><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M3 3.5l6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/></svg></>)}
                      </button>
                      <button style={S.btnGhost} onClick={()=>{setEditRec(rec);setEditPhone(rec.phone);setEditName(rec.name||'')}}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L5 11H3v-2l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      <button style={S.btnDanger} onClick={()=>deleteRec(rec.id)}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 7h3l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {locs.length>0 && (
            <form onSubmit={addRec} style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
              <select style={S.inp} value={newLocId} onChange={e=>setNewLocId(e.target.value)} required>
                <option value="">Velg lokasjon for varselet</option>
                {locs.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <input style={S.inp} placeholder="Navn på mottaker (valgfritt)" value={newName} onChange={e=>setNewName(e.target.value)} />
              <input style={S.inp} placeholder="Telefonnummer (+4799...)" value={newPhone} onChange={e=>setNewPhone(e.target.value)} required />
              <button style={{...S.btnPrimary,padding:'0.85rem',width:'100%'}} type="submit">+ Legg til mottaker</button>
            </form>
          )}
          {locs.length===0 && <p style={{color:'#6b8fa3',fontSize:'0.85rem'}}>Legg til en lokasjon først.</p>}
        </div>

        <div style={S.card}>
          <h2 style={S.sTitle}><span style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="#1a6080" strokeWidth="1.3" fill="none"/><path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l0.9 0.9M11.7 11.7l0.9 0.9M3.4 12.6l0.9-0.9M11.7 4.3l0.9-0.9" stroke="#1a6080" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/></svg>Min konto</span></h2>
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
            <div style={{padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
              <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'2px'}}>E-postadresse</div>
              <div style={{fontWeight:500,color:'#0a2a3d'}}>{sub!.email}</div>
            </div>
            <div style={{padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
              <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'2px'}}>Abonnement</div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <span style={{fontWeight:500,color:'#0a2a3d'}}>{planLabel[sub!.plan]}</span>
                <span style={S.tag(sub!.status==='active')}>{sub!.status==='active'?'Aktivt':'Inaktivt'}</span>
              </div>
            </div>
            <div style={{padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
              <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'8px'}}>Leveringstidspunkt for daglig rapport</div>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                <select
                  value={sendTime}
                  onChange={e=>setSendTime(e.target.value)}
                  style={{padding:'0.4rem 0.7rem',borderRadius:8,border:'1.5px solid rgba(10,42,61,0.12)',background:'white',fontSize:'0.9rem',color:'#0a2a3d',cursor:'pointer'}}
                >
                  {['04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00'].map(t=>(
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button
                  onClick={async()=>{
                    setSendTimeSaving(true); setSendTimeSaved(false)
                    await fetch('/api/min-side/send-time',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub!.id,send_time:sendTime})})
                    setSendTimeSaving(false); setSendTimeSaved(true)
                    setTimeout(()=>setSendTimeSaved(false),2500)
                  }}
                  style={{padding:'0.4rem 1rem',borderRadius:8,background:'#0a2a3d',color:'white',border:'none',cursor:'pointer',fontSize:'0.85rem',fontWeight:500}}
                >{sendTimeSaving?'Lagrer...':sendTimeSaved?'Lagret!':'Lagre'}</button>
              </div>
              <p style={{fontSize:'0.75rem',color:'#6b8fa3',margin:'6px 0 0'}}>Velg når du vil motta rapporten — perfekt for tidlig morgenfiske</p>
            </div>
            <p style={{fontSize:'0.8rem',color:'#6b8fa3',padding:'0 0.5rem'}}>
              Spørsmål? Besøk <a href="/hjelp" style={{color:'#4da8cc'}}>hjelpesenteret</a> eller kontakt oss på <a href="mailto:hei@bolgevarsel.no" style={{color:'#4da8cc'}}>hei@bolgevarsel.no</a>
            </p>
          </div>
        </div>

        <div style={{textAlign:'center',padding:'1rem 0',opacity:0.4}}>
          <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg" style={{width:120}}>
            <path d="M0 15 Q25 5 50 15 Q75 25 100 15 Q125 5 150 15 Q175 25 200 15" fill="none" stroke="#0a2a3d" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
