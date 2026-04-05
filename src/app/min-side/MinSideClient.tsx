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

// Mini SVG-illustrasjon — samme brand som forsiden
function BrandIllustration() {
  return (
    <svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', display:'block', marginBottom:'-4px' }}>
      <defs>
        <linearGradient id="loginSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8e8f5"/><stop offset="100%" stopColor="#e8f4f8"/></linearGradient>
        <linearGradient id="loginSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a6080"/><stop offset="100%" stopColor="#0a2a3d"/></linearGradient>
      </defs>
      <rect width="600" height="180" fill="url(#loginSky)"/>
      {/* Sol */}
      <circle cx="520" cy="55" r="30" fill="#fff4e0" opacity="0.5"/>
      <circle cx="520" cy="55" r="20" fill="#ffd580" opacity="0.6"/>
      <circle cx="520" cy="55" r="12" fill="#ffbc40" opacity="0.8"/>
      {/* Skyer */}
      <g opacity="0.6"><ellipse cx="80" cy="40" rx="50" ry="15" fill="white"/><ellipse cx="100" cy="30" rx="35" ry="13" fill="white"/><ellipse cx="60" cy="35" rx="30" ry="12" fill="white"/></g>
      <g opacity="0.4"><ellipse cx="320" cy="30" rx="40" ry="12" fill="white"/><ellipse cx="345" cy="22" rx="28" ry="10" fill="white"/></g>
      {/* Fjell */}
      <path d="M0 110 L80 60 L160 100 L240 55 L320 95 L400 50 L480 90 L560 60 L600 80 L600 130 L0 130 Z" fill="#2a6a8a" opacity="0.2"/>
      <path d="M0 120 L100 75 L200 105 L300 65 L400 100 L500 70 L600 90 L600 135 L0 135 Z" fill="#1e5a7a" opacity="0.25"/>
      {/* Øy med fyr */}
      <ellipse cx="140" cy="128" rx="55" ry="14" fill="#2a5a3a" opacity="0.85"/>
      <path d="M95 128 Q120 115 140 112 Q160 115 185 128 Z" fill="#3a6a4a" opacity="0.9"/>
      <rect x="137" y="100" width="6" height="16" fill="#e8e0d0" rx="1"/>
      <rect x="135" y="98" width="10" height="4" fill="#cc3333" rx="1"/>
      <circle cx="140" cy="98" r="2.5" fill="#ffcc00" opacity="0.9"/>
      {/* Liten båt */}
      <g><line x1="440" y1="128" x2="440" y2="114" stroke="#8a7a6a" strokeWidth="1.2"/><path d="M440 128 L425 123 L440 116 Z" fill="rgba(255,255,255,0.9)"/><path d="M440 128 L454 123 L440 120 Z" fill="rgba(255,255,255,0.65)"/><path d="M428 130 Q440 133 452 130" fill="#5a4a3a"/></g>
      {/* Hav */}
      <path d="M0 132 Q75 126 150 132 Q225 138 300 132 Q375 126 450 132 Q525 138 600 132 L600 180 L0 180 Z" fill="url(#loginSea)"/>
      {/* Bølger */}
      <g opacity="0.3">
        <path d="M-50 148 Q50 142 150 148 Q250 154 350 148 Q450 142 550 148 Q580 150 650 148" fill="none" stroke="white" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="100 0" dur="4s" repeatCount="indefinite"/>
        </path>
        <path d="M-50 160 Q60 154 160 160 Q260 166 360 160 Q460 154 560 160 Q590 162 650 160" fill="none" stroke="white" strokeWidth="1">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" dur="5.5s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  )
}

type Sub = { id:string; email:string; plan:string; status:string }
type Loc = { id:string; name:string; lat:number; lon:number }
type Rec = { id:string; location_id:string; phone:string; name:string; active:boolean; sms_enabled:boolean }

export default function MinSideClient() {
  const [email, setEmail] = useState('')
  const [sub, setSub] = useState<Sub|null>(null)
  const [locs, setLocs] = useState<Loc[]>([])
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(false) // ikke vis spinner på innlogging
  const [sessionSjekket, setSessionSjekket] = useState(false)
  const [view, setView] = useState<'login'|'dash'>('login')
  const [magicSendt, setMagicSendt] = useState(false)
  const [feil, setFeil] = useState('')

  // Auto-login: sjekk cookie i bakgrunnen, vis skjema umiddelbart
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    fetch('/api/min-side/session', { signal: controller.signal })
      .then(r => r.json())
      .then(async d => {
        clearTimeout(timeout)
        if (d.subscriber) {
          setSub(d.subscriber); setLocs(d.locations || []); setRecs(d.recipients || [])
          setEmail(d.subscriber.email); setView('dash')
        } else {
          const saved = localStorage.getItem('bv_email')
          if (saved) {
            setEmail(saved)
            const r2 = await fetch(`/api/min-side?email=${encodeURIComponent(saved)}`)
            const d2 = await r2.json()
            if (d2.subscriber) {
              setSub(d2.subscriber); setLocs(d2.locations || []); setRecs(d2.recipients || [])
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
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

  // === LOGIN VIEW ===
  if (view==='login') return (
    <div style={{ minHeight:'100vh', background:'#e8f4f8', fontFamily:'DM Sans, sans-serif' }}>
      <nav style={S.nav}><div style={{maxWidth:680,margin:'0 auto'}}><a href="/" style={S.logo}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a></div></nav>

      {/* Illustrasjon øverst */}
      <div style={{ overflow:'hidden', maxHeight:180 }}>
        <BrandIllustration />
      </div>

      <div style={{ maxWidth:420, margin:'0 auto', padding:'2.5rem 1.5rem', textAlign:'center' }}>
        {magicSendt ? (
          <>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📬</div>
            <h1 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'#0a2a3d',marginBottom:'0.5rem'}}>Sjekk innboksen!</h1>
            <p style={{color:'#6b8fa3',marginBottom:'0.3rem'}}>Vi har sendt en innloggingslenke til</p>
            <p style={{color:'#0a2a3d',fontWeight:600,marginBottom:'1.5rem'}}>{email}</p>
            <p style={{color:'#6b8fa3',fontSize:'0.85rem',marginBottom:'1.5rem'}}>Lenken er gyldig i 1 time. Sjekk eventuelt søppelpost.</p>
            <button onClick={()=>{setMagicSendt(false);setFeil('')}} style={{...S.btnGhost,fontSize:'0.85rem'}}>← Prøv en annen e-post</button>
          </>
        ) : (
          <>
            <div style={{fontSize:'2.5rem',marginBottom:'0.8rem'}}>🌊</div>
            <h1 style={{fontFamily:'serif',fontSize:'2rem',fontWeight:300,color:'#0a2a3d',marginBottom:'0.4rem'}}>Min side</h1>
            <p style={{color:'#6b8fa3',marginBottom:'2rem',fontSize:'0.95rem'}}>Skriv inn e-posten din — vi sender deg en innloggingslenke</p>
            <form onSubmit={login} style={{display:'flex',flexDirection:'column',gap:'0.7rem'}}>
              <input style={S.inp} type="email" placeholder="din@epost.no" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus />
              {feil && <p style={{color:'#ef4444',fontSize:'0.85rem',margin:0}}>{feil}</p>}
              <button style={{...S.btnPrimary,width:'100%',padding:'0.9rem',fontSize:'0.95rem'}} disabled={loading}>
                {loading ? 'Sender...' : 'Send innloggingslenke →'}
              </button>
            </form>
            <p style={{marginTop:'1.5rem',fontSize:'0.8rem',color:'rgba(10,42,61,0.35)'}}>
              Ikke abonnent ennå? <a href="/registrer" style={{color:'#4da8cc',textDecoration:'none',fontWeight:500}}>Start gratis prøveperiode →</a>
            </p>
          </>
        )}
      </div>
    </div>
  )

  // === DASHBOARD VIEW ===
  return (
    <div style={S.page}>
      {/* Liten bølge-header */}
      <div style={{ overflow:'hidden', maxHeight:80 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',display:'block'}}>
          <defs><linearGradient id="dashSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a6080"/><stop offset="100%" stopColor="#0a2a3d"/></linearGradient></defs>
          <rect width="1440" height="80" fill="#c8e8f5"/>
          <circle cx="1350" cy="25" r="18" fill="#ffd580" opacity="0.6"/>
          <path d="M0 35 Q180 20 360 35 Q540 50 720 32 Q900 15 1080 32 Q1260 49 1440 35 L1440 80 L0 80 Z" fill="url(#dashSea)"/>
          <g opacity="0.25"><path d="M0 55 Q120 48 240 55 Q360 62 480 55 Q600 48 720 55 Q840 62 960 55 Q1080 48 1200 55 Q1320 62 1440 55" fill="none" stroke="white" strokeWidth="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="100 0" dur="4s" repeatCount="indefinite"/></path></g>
        </svg>
      </div>

      <nav style={{...S.nav, background:'#0a2a3d', borderBottom:'none', marginTop:'-1px'}}>
        <div style={{maxWidth:680,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={{...S.logo, color:'white'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={{...S.badge(sub!.plan), background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)'}}>{planLabel[sub!.plan]}</span>
            <button onClick={async ()=>{await fetch('/api/auth/logout',{method:'POST'});localStorage.removeItem('bv_email');setView('login');setSub(null)}}
              style={{background:'transparent',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'0.78rem',padding:'4px 12px',borderRadius:100}}>Logg ut</button>
          </div>
        </div>
      </nav>

      <div style={S.wrap}>
        <div style={{marginBottom:'1.5rem'}}>
          <h1 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'#0a2a3d',margin:0}}>Hei! 👋</h1>
          <p style={{color:'#6b8fa3',margin:'4px 0 0',fontSize:'0.9rem'}}>{sub!.email}</p>
        </div>

        {/* LOKASJONER */}
        <div style={S.card}>
          <h2 style={S.sTitle}>🗺️ Mine lokasjoner</h2>
          {locs.length===0 && <p style={{color:'#6b8fa3',fontSize:'0.9rem',marginBottom:'1rem'}}>Ingen lokasjoner ennå.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:locs.length?'1.2rem':0}}>
            {locs.map(loc => (
              <div key={loc.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
                <div>
                  <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.95rem'}}>{loc.name}</div>
                  <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginTop:'2px'}}>{loc.lat.toFixed(4)}°N, {loc.lon.toFixed(4)}°Ø · {recs.filter(r=>r.location_id===loc.id).length} mottaker(e)</div>
                </div>
                <button style={S.btnDanger} onClick={()=>deleteLoc(loc.id)}>🗑</button>
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

        {/* MOTTAKERE */}
        <div style={S.card}>
          <h2 style={S.sTitle}>📱 Mine mottakere</h2>
          {recs.length===0 && <p style={{color:'#6b8fa3',fontSize:'0.9rem',marginBottom:'1rem'}}>Ingen mottakere ennå.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:locs.length?'1.2rem':0}}>
            {recs.map(rec => (
              <div key={rec.id}>
                {editRec?.id===rec.id ? (
                  <form onSubmit={saveEditRec} style={{background:'#f0f8fc',borderRadius:12,padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    <input style={S.inp} placeholder="Navn (valgfritt)" value={editName} onChange={e=>setEditName(e.target.value)} />
                    <input style={S.inp} placeholder="Telefon (+4799...)" value={editPhone} onChange={e=>setEditPhone(e.target.value)} required />
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button style={{...S.btnPrimary,flex:1,padding:'0.7rem'}} type="submit">💾 Lagre</button>
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
                        <span style={{...S.tag(rec.sms_enabled!==false),fontSize:'0.7rem'}}>{rec.sms_enabled!==false?'📱 SMS på':'🔕 SMS av'}</span>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'0.4rem'}}>
                      <button style={S.btnGhost} onClick={()=>toggleRec(rec)}>{rec.active?'⏸':'▶'}</button>
                      <button style={{...S.btnGhost,background:rec.sms_enabled!==false?'#f0fdf4':'#fef9c3',color:rec.sms_enabled!==false?'#16a34a':'#854d0e'}} onClick={()=>toggleSms(rec)}>
                        {rec.sms_enabled!==false?'📱':'🔕'}
                      </button>
                      <button style={S.btnGhost} onClick={()=>{setEditRec(rec);setEditPhone(rec.phone);setEditName(rec.name||'')}}>✏️</button>
                      <button style={S.btnDanger} onClick={()=>deleteRec(rec.id)}>🗑</button>
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

        {/* KONTO */}
        <div style={S.card}>
          <h2 style={S.sTitle}>⚙️ Min konto</h2>
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
            <p style={{fontSize:'0.8rem',color:'#6b8fa3',padding:'0 0.5rem'}}>
              Spørsmål om abonnement? Kontakt oss på <a href="mailto:hei@bolgevarsel.no" style={{color:'#4da8cc'}}>hei@bolgevarsel.no</a>
            </p>
          </div>
        </div>

        {/* BØLGE-DEKOR FOOTER */}
        <div style={{textAlign:'center',padding:'1rem 0 0',opacity:0.4}}>
          <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg" style={{width:120}}>
            <path d="M0 15 Q25 5 50 15 Q75 25 100 15 Q125 5 150 15 Q175 25 200 15" fill="none" stroke="#0a2a3d" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
