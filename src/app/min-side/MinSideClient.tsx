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

type Sub = { id:string; email:string; plan:string; status:string }
type Loc = { id:string; name:string; lat:number; lon:number }
type Rec = { id:string; location_id:string; phone:string; name:string; active:boolean }

export default function MinSideClient() {
  const [email, setEmail] = useState('')
  const [sub, setSub] = useState<Sub|null>(null)
  const [locs, setLocs] = useState<Loc[]>([])
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'login'|'dash'>('login')

  // Auto-login ved sideinnlasting
  useEffect(() => {
    const saved = localStorage.getItem('bv_email')
    if (saved) {
      setEmail(saved)
      fetch(`/api/min-side?email=${encodeURIComponent(saved)}`)
        .then(r => r.json())
        .then(d => {
          if (d.subscriber) { setSub(d.subscriber); setLocs(d.locations||[]); setRecs(d.recipients||[]); setView('dash') }
          else localStorage.removeItem('bv_email')
        })
    }
  }, [])

  // Lokasjonssøk
  const [locQ, setLocQ] = useState('')
  const [locSugg, setLocSugg] = useState<any[]>([])
  const [locOpen, setLocOpen] = useState(false)
  const [locValgt, setLocValgt] = useState<{name:string;lat:number;lon:number}|null>(null)
  const locTimer = useRef<any>(null)

  // Rediger mottaker
  const [editRec, setEditRec] = useState<Rec|null>(null)
  const [editPhone, setEditPhone] = useState('')
  const [editName, setEditName] = useState('')

  // Ny mottaker
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
    e.preventDefault(); setLoading(true)
    const r = await fetch(`/api/min-side?email=${encodeURIComponent(email)}`)
    const d = await r.json()
    if (d.subscriber) {
      setSub(d.subscriber); setLocs(d.locations||[]); setRecs(d.recipients||[])
      setView('dash')
      localStorage.setItem('bv_email', email)
    }
    else alert('Ingen konto funnet for denne e-postadressen.')
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

  async function saveEditRec(e: React.FormEvent) {
    e.preventDefault(); if (!editRec) return
    const r = await fetch('/api/min-side/recipient/update', { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id:editRec.id, subscriber_id:sub!.id, phone:editPhone, name:editName }) })
    const d = await r.json()
    if (d.recipient) { setRecs(recs.map(r=>r.id===editRec.id ? d.recipient : r)); setEditRec(null) }
  }

  const planLabel: Record<string,string> = { basis:'Basis', familie:'Familie', pro:'Pro' }

  if (view==='login') return (
    <div style={S.page}>
      <nav style={S.nav}><div style={{maxWidth:680,margin:'0 auto'}}><a href="/" style={S.logo}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a></div></nav>
      <div style={{maxWidth:420,margin:'0 auto',padding:'5rem 1.5rem',textAlign:'center'}}>
        <h1 style={{fontFamily:'serif',fontSize:'2rem',fontWeight:300,color:'#0a2a3d',marginBottom:'0.5rem'}}>Min side</h1>
        <p style={{color:'#6b8fa3',marginBottom:'2rem'}}>Logg inn med e-posten du registrerte deg med</p>
        <form onSubmit={login} style={{display:'flex',flexDirection:'column',gap:'0.7rem'}}>
          <input style={S.inp} type="email" placeholder="din@epost.no" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button style={{...S.btnPrimary,width:'100%',padding:'0.9rem'}} disabled={loading}>{loading?'Søker...':'Logg inn →'}</button>
        </form>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{maxWidth:680,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <a href="/" style={S.logo}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span style={S.badge(sub!.plan)}>{planLabel[sub!.plan]} 🟢</span>
            <button onClick={()=>{localStorage.removeItem('bv_email');setView('login');setSub(null)}}
              style={{background:'transparent',border:'none',color:'rgba(10,42,61,0.4)',cursor:'pointer',fontSize:'0.8rem',padding:'4px 8px'}}>Logg ut</button>
          </div>
        </div>
      </nav>
      <div style={S.wrap}>
        <div style={{marginBottom:'1.5rem'}}>
          <h1 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'#0a2a3d',margin:0}}>Hei! 👋</h1>
          <p style={{color:'#6b8fa3',margin:'4px 0 0'}}>{sub!.email}</p>
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
                <button style={S.btnDanger} onClick={()=>deleteLoc(loc.id)}>🗑 Slett</button>
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
                    <div key={i} onMouseDown={()=>pickLoc(s)}
                      style={{padding:'9px 14px',cursor:'pointer',borderBottom:i<locSugg.length-1?'1px solid #f0f4f8':'none',fontSize:'0.88rem'}}
                      onMouseEnter={e=>(e.currentTarget.style.background='#f0f8fc')}
                      onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                      <span style={{fontWeight:500,color:'#0a2a3d'}}>{s.name}</span>
                      {s.admin1&&<span style={{color:'#6b8fa3',fontSize:'0.8rem'}}> – {s.admin1.replace(' Fylke','')}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button style={{...S.btnPrimary, opacity:locValgt?1:0.5}} type="submit" disabled={!locValgt}>+ Legg til lokasjon</button>
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
                    <div style={{fontSize:'0.78rem',color:'#6b8fa3',fontWeight:500,marginBottom:'2px'}}>Rediger mottaker</div>
                    <input style={S.inp} placeholder="Navn" value={editName} onChange={e=>setEditName(e.target.value)} />
                    <input style={S.inp} placeholder="Telefon (+4799...)" value={editPhone} onChange={e=>setEditPhone(e.target.value)} required />
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button style={S.btnPrimary} type="submit">Lagre</button>
                      <button style={S.btnGhost} type="button" onClick={()=>setEditRec(null)}>Avbryt</button>
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
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'0.4rem'}}>
                      <button style={S.btnGhost} onClick={()=>toggleRec(rec)}>{rec.active?'⏸ Pause':'▶ Aktiver'}</button>
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
                <option value="">Velg lokasjon</option>
                {locs.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <input style={S.inp} placeholder="Navn (valgfritt)" value={newName} onChange={e=>setNewName(e.target.value)} />
              <input style={S.inp} placeholder="Telefon (+4799...)" value={newPhone} onChange={e=>setNewPhone(e.target.value)} required />
              <button style={S.btnPrimary} type="submit">+ Legg til mottaker</button>
            </form>
          )}
          {locs.length===0 && <p style={{color:'#6b8fa3',fontSize:'0.85rem'}}>Legg til en lokasjon først.</p>}
        </div>

        {/* KONTO */}
        <div style={S.card}>
          <h2 style={S.sTitle}>⚙️ Min konto</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
              <div>
                <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'2px'}}>E-postadresse</div>
                <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.95rem'}}>{sub!.email}</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',background:'#f8fbfc',borderRadius:12}}>
              <div>
                <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginBottom:'2px'}}>Abonnement</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.95rem'}}>{planLabel[sub!.plan]}</span>
                  <span style={S.tag(sub!.status==='active')}>{sub!.status==='active'?'Aktivt':'Inaktivt'}</span>
                </div>
              </div>
            </div>
            <p style={{fontSize:'0.8rem',color:'#6b8fa3',padding:'0 0.5rem'}}>For å endre e-post, avslutte abonnement eller andre kontospørsmål — kontakt oss på <a href="mailto:hei@bolgevarsel.no" style={{color:'#4da8cc'}}>hei@bolgevarsel.no</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
