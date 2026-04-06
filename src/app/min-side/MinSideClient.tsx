'use client'
import React, { useState, useEffect, useRef } from 'react'
import LokasjonPanel from '@/components/LokasjonPanel'
import LeggTilLokasjon from '@/components/LeggTilLokasjon'

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
  badge: (plan: string) => ({ background: plan==='pro'?'#fef3c7':plan==='familie'?'#dbeafe':'#e8f4f8', color: plan==='pro'?'#92400e':plan==='familie'?'#1d4ed8':'#0a2a3d', padding:'7px 18px', borderRadius:100, fontSize:'0.85rem', fontWeight:500 }) as React.CSSProperties,
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
type Rec = { id:string; location_id:string; phone:string; name:string; email?:string; active:boolean; sms_enabled:boolean; send_time?:string; profile?:string }

export default function MinSideClient() {
  const [email, setEmail] = useState('')
  const [sub, setSub] = useState<Sub|null>(null)
  const [sendTime, setSendTime] = useState('07:30')
  const [sendTimeSaving, setSendTimeSaving] = useState(false)
  const [sendTimeSaved, setSendTimeSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddLoc, setShowAddLoc] = useState(false)
  const [activeTab, setActiveTab] = useState<'lokasjoner'|'mottakere'|'konto'>('lokasjoner')
  const [accountLoading, setAccountLoading] = useState<string|null>(null)
  const [showAddRec, setShowAddRec] = useState(false)
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [csvRows, setCsvRows] = useState<any[]>([])
  const [csvFileName, setCsvFileName] = useState('')
  const [csvImporting, setCsvImporting] = useState(false)
  const [csvResult, setCsvResult] = useState<{imported:number;total:number;results:any[]}|null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [newSmsEnabled, setNewSmsEnabled] = useState(true)
  const [newSendTime, setNewSendTime] = useState('')
  const [newProfile, setNewProfile] = useState('')
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
      const r = await fetch(`/api/steder?q=${encodeURIComponent(locQ)}`)
      const hits = await r.json()
      // Mapper til samme format som resten av koden forventer
      const mapped = hits.map((h: any) => ({
        name: h.name, latitude: h.lat, longitude: h.lon,
        country_code: 'NO', type: h.type,
      }))
      setLocSugg(mapped); setLocOpen(mapped.length>0)
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
    const name = s.name
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
      body: JSON.stringify({ subscriber_id:sub!.id, location_id:newLocId, phone:newPhone, name:newName, email:newEmail||null, sms_enabled:newSmsEnabled, send_time:newSendTime||null, profile:newProfile||null }) })
    const d = await r.json()
    if (d.recipient) { setRecs([...recs, d.recipient]); setNewPhone(''); setNewName(''); setNewLocId(''); setNewEmail(''); setNewSendTime(''); setNewProfile(''); setShowAddRec(false) }
  }
  function parseCsv(text: string) {
    const lines = text.trim().split(/\r?\n/)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim())
      const obj: any = {}
      headers.forEach((h, i) => { obj[h] = vals[i] || '' })
      return obj
    }).filter(r => Object.values(r).some(v => v))
  }
  function handleCsvFile(file: File) {
    setCsvFileName(file.name); setCsvResult(null)
    const reader = new FileReader()
    reader.onload = e => { setCsvRows(parseCsv(e.target?.result as string)) }
    reader.readAsText(file)
  }
  async function importCsv() {
    if (!csvRows.length || !newLocId) return
    setCsvImporting(true)
    const r = await fetch('/api/min-side/import-csv', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ subscriber_id: sub!.id, location_id: newLocId, rows: csvRows }) })
    const d = await r.json()
    setCsvResult(d)
    setCsvImporting(false)
    if (d.ok) {
      const updated = await fetch(`/api/min-side?email=${encodeURIComponent(sub!.email)}`)
      const ud = await updated.json()
      if (ud.recipients) setRecs(ud.recipients)
    }
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
  const tabs = [
    { key: 'lokasjoner', label: 'Lokasjoner', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C4.8 1.5 3 3.3 3 5.5C3 8.2 7 12.5 7 12.5C7 12.5 11 8.2 11 5.5C11 3.3 9.2 1.5 7 1.5Z" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="7" cy="5.5" r="1.3" fill="currentColor"/></svg>, count: locs.length },
    { key: 'mottakere', label: 'Mottakere', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="1" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M5.5 10h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/></svg>, count: recs.length },
    { key: 'konto', label: 'Konto', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M2 12.5c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg>, count: null },
  ] as const

  return (
    <div style={S.page}>
      <div style={{background:'#c8e8f5', overflow:'hidden', position:'relative'}}>
        <div style={{padding:'1.1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', maxWidth:720, margin:'0 auto', position:'relative', zIndex:2}}>
          <a href="/" style={{fontFamily:'Georgia,serif', fontSize:'1.25rem', fontWeight:400, color:'#0a2a3d', textDecoration:'none', letterSpacing:'-0.01em'}}>bølge<span style={{color:'#1a6080'}}>varsel</span></a>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={{...S.badge(sub!.plan)}}>{planLabel[sub!.plan]}</span>
            <button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});localStorage.removeItem('bv_email');setView('login');setSub(null)}}
              style={{background:'transparent',border:'1px solid rgba(10,42,61,0.2)',color:'rgba(10,42,61,0.5)',cursor:'pointer',fontSize:'0.85rem',padding:'7px 18px',borderRadius:100,fontFamily:'inherit'}}>Logg ut</button>
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
          <g className="bv-sun"><circle cx="1340" cy="42" r="26" fill="#fff4e0" opacity="0.4"/><circle cx="1340" cy="42" r="17" fill="#ffd580" opacity="0.5"/><circle cx="1340" cy="42" r="10" fill="#ffbc40" opacity="0.72"/></g>
          <ellipse cx="200" cy="32" rx="55" ry="12" fill="white" opacity="0.2"/>
          <ellipse cx="235" cy="22" rx="38" ry="10" fill="white" opacity="0.15"/>
          <path d="M0 125 L180 72 L320 108 L500 58 L660 95 L820 55 L980 90 L1140 60 L1300 95 L1440 68 L1440 180 L0 180 Z" fill="#6a9ab8" opacity="0.28"/>
          <ellipse cx="380" cy="118" rx="95" ry="16" fill="#2a5a3a" opacity="0.9"/>
          <path d="M295 118 Q338 102 380 97 Q422 102 465 118 Z" fill="#3a6a4a" opacity="0.95"/>
          <rect x="377" y="76" width="9" height="26" fill="#e8e0d0" rx="1.5"/>
          <rect x="373" y="72" width="17" height="6" fill="#cc3333" rx="1.5"/>
          <circle cx="381" cy="72" r="3.5" fill="#ffdd44" opacity="0.9"/>
          <g className="bv-boat"><path d="M820 98 Q855 108 890 98 L886 107 Q855 116 824 107 Z" fill="#0a2a3d" opacity="0.75"/>
          <line x1="855" y1="98" x2="855" y2="60" stroke="#0a2a3d" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
          <path d="M855 62 L884 94 L855 98 Z" fill="rgba(235,228,212,0.88)"/>
          <path d="M855 65 L829 92 L855 98 Z" fill="rgba(235,228,212,0.55)"/></g>
          <path d="M0 126 Q180 112 360 126 Q540 140 720 122 Q900 104 1080 122 Q1260 140 1440 124 L1440 180 L0 180 Z" fill="url(#sea8)"/>
          <path d="M0 138 Q200 128 400 138 Q600 148 800 136 Q1000 124 1200 136 Q1350 144 1440 138 L1440 180 L0 180 Z" fill="url(#sea8b)" opacity="0.55"/>
          <g className="bv-f1"><ellipse cx="240" cy="141" rx="16" ry="6" fill="none" stroke="rgba(77,168,204,0.52)" strokeWidth="1.2"/><path d="M224 141 L215 135 M224 141 L215 147" stroke="rgba(77,168,204,0.52)" strokeWidth="1.2" strokeLinecap="round"/></g>
          <rect x="0" y="172" width="1440" height="8" fill="#e8f4f8"/>
        </svg>
      </div>

      <div style={S.wrap}>
        {/* Header */}
        <div style={{marginBottom:'1.2rem'}}>
          <h1 style={{fontFamily:'Fraunces, Georgia, serif',fontSize:'2rem',fontWeight:300,color:'#0a2a3d',margin:0,letterSpacing:'-0.02em'}}>
            Hei!{' '}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{display:'inline-block',verticalAlign:'middle',marginBottom:'4px'}}>
              <path d="M10 6 C10 6 8 4 6.5 5.5 C5 7 7 9 7 9 L11 14" stroke="#1a6080" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M13 5 C13 5 11 3 9.5 4.5 C8 6 10 8 10 8 L14 13" stroke="#1a6080" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M16 5.5 C16 5.5 14.5 3.5 13 5 C11.5 6.5 13 8.5 13 8.5 L17 13" stroke="#1a6080" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M7 9 L11 18 C11 18 12 21 14 21 C16 21 18 19 18 17 L20 15 L17 13 L14 13 L11 14 Z" stroke="#1a6080" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="rgba(77,168,204,0.12)"/>
            </svg>
          </h1>
          <p style={{color:'#6b8fa3',margin:'4px 0 0',fontSize:'0.9rem'}}>{sub!.email}</p>
        </div>

        {/* Tab-navigasjon */}
        <div style={S.card as React.CSSProperties}>
          {/* Tab-bar */}
          <div style={{display:'flex',borderBottom:'1px solid rgba(10,42,61,0.07)',marginBottom:'1.2rem',gap:0}}>
            {tabs.map(tab => (
              <button key={tab.key} onClick={()=>setActiveTab(tab.key as any)}
                style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px 8px',
                  background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:500,
                  color:activeTab===tab.key?'#1a6080':'#6b8fa3',
                  borderBottom:activeTab===tab.key?'2px solid #1a6080':'2px solid transparent',
                  transition:'all 0.15s',fontFamily:'inherit',
                }}>
                {tab.icon}
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span style={{background:activeTab===tab.key?'#1a6080':'rgba(10,42,61,0.1)',color:activeTab===tab.key?'white':'#6b8fa3',fontSize:'10px',fontWeight:600,padding:'1px 6px',borderRadius:100,minWidth:16,textAlign:'center',transition:'all 0.15s'}}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ===== TAB: LOKASJONER ===== */}
          {activeTab === 'lokasjoner' && (
            <div>
              {locs.length === 0 && <p style={{color:'#6b8fa3',fontSize:'0.9rem',marginBottom:'1rem'}}>Ingen lokasjoner ennå.</p>}
              {locs.length > 0 && <LokasjonPanel locations={locs} />}
              <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:locs.length?'1rem':0}}>
                {locs.map(loc => (
                  <div key={loc.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.7rem 0.9rem',background:'#f8fbfc',borderRadius:10}}>
                    <div>
                      <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.9rem'}}>{loc.name}</div>
                      <div style={{fontSize:'0.72rem',color:'#6b8fa3',marginTop:'1px'}}>{loc.lat.toFixed(4)}°N · {recs.filter(r=>r.location_id===loc.id).length} mottaker(e)</div>
                    </div>
                    <button style={S.btnDanger} onClick={()=>deleteLoc(loc.id)}>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 7h3l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button style={{...S.btnPrimary,width:'100%',padding:'0.8rem'}} onClick={()=>setShowAddLoc(true)}>
                + Legg til lokasjon
              </button>
              {showAddLoc && (
                <LeggTilLokasjon
                  onAdd={async (loc) => {
                    const r = await fetch('/api/min-side/location', { method:'POST', headers:{'Content-Type':'application/json'},
                      body: JSON.stringify({ subscriber_id: sub!.id, name: loc.name, lat: loc.lat, lon: loc.lon }) })
                    const d = await r.json()
                    if (d.location) setLocs([...locs, d.location])
                    setShowAddLoc(false)
                  }}
                  onCancel={() => setShowAddLoc(false)}
                />
              )}
            </div>
          )}

          {/* ===== TAB: MOTTAKERE ===== */}
          {activeTab === 'mottakere' && (
            <div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',marginBottom:'1rem'}}>
                {locs.length > 0 && <>
                  <button style={{...S.btnGhost,fontSize:'0.8rem',padding:'6px 12px',display:'flex',alignItems:'center',gap:'5px'}} onClick={()=>{setShowCsvImport(!showCsvImport);setShowAddRec(false)}}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v8M3.5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 10h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/></svg>
                    Importer CSV
                  </button>
                  <button style={{...S.btnPrimary,fontSize:'0.8rem',padding:'6px 12px',display:'flex',alignItems:'center',gap:'5px'}} onClick={()=>{setShowAddRec(!showAddRec);setShowCsvImport(false)}}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    Legg til
                  </button>
                </>}
              </div>

              {recs.length === 0 && !showAddRec && !showCsvImport && (
                <p style={{color:'#6b8fa3',fontSize:'0.9rem',marginBottom:'1rem'}}>Ingen mottakere ennå. Bruk knappene over for å legge til.</p>
              )}
              {locs.length === 0 && <p style={{color:'#6b8fa3',fontSize:'0.85rem'}}>Legg til en lokasjon i «Lokasjoner»-fanen først.</p>}

              {recs.length > 0 && (
                <div style={{overflowX:'auto',marginBottom:'1rem'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem'}}>
                    <thead>
                      <tr>
                        {['Navn','Telefon','E-post','SMS','Tidspunkt','Profil',''].map(h=>(
                          <th key={h} style={{textAlign:'left',color:'#6b8fa3',fontWeight:500,fontSize:'0.72rem',letterSpacing:'0.06em',textTransform:'uppercase',padding:'0 10px 8px'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recs.map(rec=>(
                        <tr key={rec.id} style={{borderTop:'1px solid rgba(10,42,61,0.06)'}}>
                          {editRec?.id===rec.id ? (
                            <td colSpan={7} style={{padding:'8px 0'}}>
                              <form onSubmit={saveEditRec} style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                                <input style={{...S.inp,flex:1,minWidth:120}} placeholder="Navn" value={editName} onChange={e=>setEditName(e.target.value)} />
                                <input style={{...S.inp,flex:1,minWidth:140}} placeholder="Telefon" value={editPhone} onChange={e=>setEditPhone(e.target.value)} required />
                                <button style={{...S.btnPrimary,padding:'6px 12px'}} type="submit">Lagre</button>
                                <button style={{...S.btnGhost,padding:'6px 12px'}} type="button" onClick={()=>setEditRec(null)}>Avbryt</button>
                              </form>
                            </td>
                          ) : (<>
                            <td style={{padding:'10px'}}>
                              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                <div style={{width:28,height:28,borderRadius:'50%',background:'#e8f4f8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:500,color:'#1a6080',flexShrink:0}}>
                                  {(rec.name||rec.phone).slice(0,2).toUpperCase()}
                                </div>
                                <span style={{fontWeight:500,color:'#0a2a3d'}}>{rec.name||'—'}</span>
                              </div>
                            </td>
                            <td style={{padding:'10px',color:'#6b8fa3',fontSize:'0.82rem'}}>{rec.phone}</td>
                            <td style={{padding:'10px',color:'#6b8fa3',fontSize:'0.82rem'}}>{(rec as any).email||'—'}</td>
                            <td style={{padding:'10px'}}>
                              <span style={{fontSize:'11px',fontWeight:500,padding:'2px 8px',borderRadius:100,background:rec.sms_enabled!==false?'#e8f5ed':'#f1f5f9',color:rec.sms_enabled!==false?'#1a7a50':'#6b8fa3'}}>
                                {rec.sms_enabled!==false?'På':'Av'}
                              </span>
                            </td>
                            <td style={{padding:'10px',color:'#6b8fa3',fontSize:'12px'}}>{rec.send_time||'Standard'}</td>
                            <td style={{padding:'10px'}}>
                              {rec.profile ? (
                                <span style={{fontSize:'11px',fontWeight:500,padding:'2px 8px',borderRadius:100,background:'#e8f4f8',color:'#1a6080'}}>
                                  {({'surfer':'Surfer','fisker':'Fisker','familie':'Barn/ungdom m/båt','baatforer':'Båtfører','kajakk':'Padler','kitesurfer':'Kiting','windsurfer':'Windsurfer','seiler':'Seiler','fridykker':'Fridykker'}[rec.profile]||rec.profile)}
                                </span>
                              ) : <span style={{fontSize:'12px',color:'#6b8fa3'}}>Standard</span>}
                            </td>
                            <td style={{padding:'10px',textAlign:'right',whiteSpace:'nowrap'}}>
                              <button style={S.btnGhost} onClick={()=>toggleSms(rec)} title="Skru SMS av/på">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M3 5h7M3 7.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/></svg>
                              </button>
                              <button style={S.btnGhost} onClick={()=>{setEditRec(rec);setEditPhone(rec.phone);setEditName(rec.name||'')}} title="Rediger">
                                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L5 11H3v-2l6.5-6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                              <button style={S.btnDanger} onClick={()=>deleteRec(rec.id)} title="Slett">
                                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 7h3l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                            </td>
                          </>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {showAddRec && locs.length > 0 && (
                <div style={{background:'#f8fbfc',borderRadius:12,padding:'1rem',marginBottom:'1rem',border:'1px solid rgba(10,42,61,0.07)'}}>
                  <div style={{fontSize:'0.85rem',fontWeight:500,color:'#0a2a3d',marginBottom:'0.75rem'}}>Legg til mottaker</div>
                  <form onSubmit={addRec} style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                      <div><div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>Navn</div><input style={S.inp} placeholder="Ola Nordmann" value={newName} onChange={e=>setNewName(e.target.value)} /></div>
                      <div><div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>Telefonnummer</div><input style={S.inp} placeholder="+47 000 00 000" value={newPhone} onChange={e=>setNewPhone(e.target.value)} required /></div>
                    </div>
                    <div><div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>E-postadresse (valgfritt)</div><input style={S.inp} placeholder="ola@eksempel.no" type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} /></div>
                    <div><div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>Lokasjon</div>
                      <select style={S.inp} value={newLocId} onChange={e=>setNewLocId(e.target.value)} required>
                        <option value="">Velg lokasjon</option>
                        {locs.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0'}}>
                      <div><div style={{fontSize:'13px',color:'#0a2a3d'}}>SMS-varsel</div><div style={{fontSize:'11px',color:'#6b8fa3'}}>Mottaker får daglig SMS og farevarsler</div></div>
                      <div style={{position:'relative',width:36,height:20,cursor:'pointer'}} onClick={()=>setNewSmsEnabled(!newSmsEnabled)}>
                        <div style={{position:'absolute',inset:0,borderRadius:100,background:newSmsEnabled?'#1a6080':'rgba(10,42,61,0.15)',transition:'0.2s'}}/>
                        <div style={{position:'absolute',width:14,height:14,top:3,left:newSmsEnabled?19:3,borderRadius:'50%',background:'white',transition:'0.2s'}}/>
                      </div>
                    </div>
                    <div><div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>Leveringstidspunkt (valgfritt)</div>
                      <select style={S.inp} value={newSendTime} onChange={e=>setNewSendTime(e.target.value)}>
                        <option value="">Standard ({sendTime})</option>
                        {['04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00'].map(t=>(
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div><div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>Aktivitetsprofil (valgfritt)</div>
                      <select style={S.inp} value={newProfile} onChange={e=>setNewProfile(e.target.value)}>
                        <option value="">Standard rapport</option>
                        <option value="surfer">🏄 Surfer</option>
                        <option value="kitesurfer">🪁 Kitesurfer</option>
                        <option value="windsurfer">🏄 Windsurfer</option>
                        <option value="fisker">🎣 Fisker</option>
                        <option value="familie">⛵ Barn/ungdom med båt</option>
                        <option value="baatforer">⛵ Båtfører</option>
                        <option value="kajakk">🛶 Padler / kajakk</option>
                        <option value="seiler">⛵ Seiler</option>
                        <option value="fridykker">🤿 Fridykker / snorkling</option>
                      </select>
                    </div>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button style={{...S.btnPrimary,flex:1}} type="submit">+ Legg til mottaker</button>
                      <button style={S.btnGhost} type="button" onClick={()=>setShowAddRec(false)}>Avbryt</button>
                    </div>
                  </form>
                </div>
              )}

              {showCsvImport && locs.length > 0 && (
                <div style={{background:'#f8fbfc',borderRadius:12,padding:'1rem',marginBottom:'1rem',border:'1px solid rgba(10,42,61,0.07)'}}>
                  <div style={{fontSize:'0.85rem',fontWeight:500,color:'#0a2a3d',marginBottom:'0.75rem'}}>Importer fra CSV</div>
                  <div style={{marginBottom:'0.75rem'}}>
                    <div style={{fontSize:'11px',color:'#6b8fa3',marginBottom:3}}>Velg lokasjon for alle importerte mottakere</div>
                    <select style={S.inp} value={newLocId} onChange={e=>setNewLocId(e.target.value)}>
                      <option value="">Velg lokasjon</option>
                      {locs.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                  <label style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px',border:'1px dashed rgba(10,42,61,0.2)',borderRadius:10,padding:'1.5rem',cursor:'pointer',background:'white',textAlign:'center'}}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4v16M8 14l6 6 6-6" stroke="#1a6080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 22h20" stroke="#1a6080" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>
                    <span style={{fontSize:'0.85rem',fontWeight:500,color:'#0a2a3d'}}>{csvFileName || 'Velg CSV-fil'}</span>
                    <span style={{fontSize:'0.78rem',color:'#6b8fa3'}}>Kolonner: navn, telefon, epost, sms</span>
                    <a href="/bolgevarsel-mottakere-eksempel.csv" download style={{fontSize:'0.75rem',color:'#1a6080'}}>Last ned eksempelfil →</a>
                    <input type="file" accept=".csv" style={{display:'none'}} onChange={e=>{if(e.target.files?.[0]) handleCsvFile(e.target.files[0])}} />
                  </label>
                  {csvRows.length > 0 && !csvResult && (
                    <div style={{marginTop:'0.75rem',background:'white',borderRadius:8,padding:'0.75rem',border:'1px solid rgba(10,42,61,0.07)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                        <span style={{fontSize:'12px',fontWeight:500,color:'#0a2a3d'}}>{csvFileName}</span>
                        <span style={{fontSize:'11px',color:'#6b8fa3'}}>{csvRows.length} rader funnet</span>
                      </div>
                    </div>
                  )}
                  {csvResult && (
                    <div style={{marginTop:'0.75rem',background:csvResult.imported>0?'#f0fdf4':'#fef2f2',borderRadius:8,padding:'0.75rem',border:`1px solid ${csvResult.imported>0?'#bbf7d0':'#fecaca'}`}}>
                      <div style={{fontSize:'13px',fontWeight:500,color:csvResult.imported>0?'#1a7a50':'#dc2626'}}>
                        {csvResult.imported} av {csvResult.total} importert
                      </div>
                    </div>
                  )}
                  <div style={{display:'flex',gap:'8px',marginTop:'0.75rem'}}>
                    <button style={{...S.btnPrimary,flex:1,opacity:(!csvRows.length||!newLocId)?0.4:1}} onClick={importCsv} disabled={!csvRows.length||!newLocId||csvImporting}>
                      {csvImporting?'Importerer...':`Importer ${csvRows.length} mottakere`}
                    </button>
                    <button style={S.btnGhost} onClick={()=>{setShowCsvImport(false);setCsvRows([]);setCsvFileName('');setCsvResult(null)}}>Avbryt</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== TAB: KONTO ===== */}
          {activeTab === 'konto' && (
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
                <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'8px'}}>Abonnementsstatus</div>
                {sub!.status === 'active' ? (
                  <button onClick={async()=>{setAccountLoading('pause');await fetch('/api/min-side/frys',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub!.id,action:'pause'})});setSub({...sub!,status:'paused'});setAccountLoading(null)}}
                    style={{padding:'0.5rem 1rem',borderRadius:8,background:'#fff',border:'1px solid rgba(10,42,61,0.15)',color:'#0a2a3d',cursor:'pointer',fontSize:'0.82rem',fontWeight:500,display:'inline-flex',alignItems:'center',gap:'6px'}}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="2" width="3.5" height="9" rx="0.5" fill="currentColor"/><rect x="7.5" y="2" width="3.5" height="9" rx="0.5" fill="currentColor"/></svg>
                    {accountLoading==='pause'?'Fryser...':'Frys abonnement'}
                  </button>
                ) : sub!.status === 'paused' ? (
                  <button onClick={async()=>{setAccountLoading('resume');await fetch('/api/min-side/frys',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub!.id,action:'resume'})});setSub({...sub!,status:'active'});setAccountLoading(null)}}
                    style={{padding:'0.5rem 1rem',borderRadius:8,background:'#1a6080',border:'none',color:'white',cursor:'pointer',fontSize:'0.82rem',fontWeight:500,display:'inline-flex',alignItems:'center',gap:'6px'}}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 2l8 4.5-8 4.5V2z" fill="currentColor"/></svg>
                    {accountLoading==='resume'?'Aktiverer...':'Reaktiver abonnement'}
                  </button>
                ) : null}
                {sub!.status === 'paused' && <p style={{fontSize:'0.75rem',color:'#6b8fa3',margin:'6px 0 0'}}>Abonnementet er frosset. Reaktiver når du er klar.</p>}
              </div>
              <div style={{padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
                <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'8px'}}>Leveringstidspunkt for daglig rapport</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <select value={sendTime} onChange={e=>setSendTime(e.target.value)}
                    style={{padding:'0.4rem 0.7rem',borderRadius:8,border:'1.5px solid rgba(10,42,61,0.12)',background:'white',fontSize:'0.9rem',color:'#0a2a3d',cursor:'pointer'}}>
                    {['04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00'].map(t=>(
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button onClick={async()=>{setSendTimeSaving(true);setSendTimeSaved(false);await fetch('/api/min-side/send-time',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub!.id,send_time:sendTime})});setSendTimeSaving(false);setSendTimeSaved(true);setTimeout(()=>setSendTimeSaved(false),2500)}}
                    style={{padding:'0.4rem 1rem',borderRadius:8,background:'#0a2a3d',color:'white',border:'none',cursor:'pointer',fontSize:'0.85rem',fontWeight:500}}>
                    {sendTimeSaving?'Lagrer...':sendTimeSaved?'Lagret!':'Lagre'}
                  </button>
                </div>
                <p style={{fontSize:'0.75rem',color:'#6b8fa3',margin:'6px 0 0'}}>Velg når du vil motta rapporten — perfekt for tidlig morgenfiske</p>
              </div>
              <p style={{fontSize:'0.8rem',color:'#6b8fa3',padding:'0 0.5rem'}}>
                Spørsmål? Besøk <a href="/hjelp" style={{color:'#4da8cc'}}>hjelpesenteret</a> eller kontakt oss på <a href="mailto:hei@bolgevarsel.no" style={{color:'#4da8cc'}}>hei@bolgevarsel.no</a>
              </p>
              <div style={{borderTop:'1px solid rgba(10,42,61,0.07)',paddingTop:'0.75rem',marginTop:'0.25rem'}}>
                {!showDeleteConfirm ? (
                  <button onClick={()=>setShowDeleteConfirm(true)} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer',fontSize:'0.8rem',padding:'0 0.5rem',textDecoration:'underline',textUnderlineOffset:'2px'}}>Slett konto</button>
                ) : (
                  <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'0.85rem 1rem'}}>
                    <p style={{fontSize:'0.85rem',color:'#991b1b',fontWeight:500,margin:'0 0 0.3rem'}}>Er du sikker?</p>
                    <p style={{fontSize:'0.78rem',color:'#b91c1c',margin:'0 0 0.75rem',lineHeight:1.5}}>Data slettes permanent etter 30 dager.</p>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button onClick={async()=>{setAccountLoading('delete');await fetch('/api/min-side/slett-konto',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub!.id})});await fetch('/api/auth/logout',{method:'POST'});localStorage.removeItem('bv_email');setView('login');setSub(null)}}
                        style={{padding:'0.45rem 1rem',borderRadius:8,background:'#ef4444',border:'none',color:'white',cursor:'pointer',fontSize:'0.82rem',fontWeight:500}}>
                        {accountLoading==='delete'?'Sletter...':'Ja, slett kontoen'}
                      </button>
                      <button onClick={()=>setShowDeleteConfirm(false)} style={{padding:'0.45rem 1rem',borderRadius:8,background:'white',border:'1px solid #fecaca',color:'#991b1b',cursor:'pointer',fontSize:'0.82rem'}}>Avbryt</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
