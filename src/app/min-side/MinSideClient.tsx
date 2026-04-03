'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

type Subscriber = { id: string; email: string; plan: string; status: string; stripe_customer_id: string }
type Location = { id: string; name: string; lat: number; lon: number }
type Recipient = { id: string; location_id: string; phone: string; name: string; active: boolean }

export default function MinSideClient() {
  const [email, setEmail] = useState('')
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'login' | 'dashboard'>('login')

  // Lokasjonssøk med autocomplete
  const [locQuery, setLocQuery] = useState('')
  const [locSugg, setLocSugg] = useState<any[]>([])
  const [locOpen, setLocOpen] = useState(false)
  const [locValgt, setLocValgt] = useState<{name:string;lat:number;lon:number} | null>(null)
  const locTimer = useRef<any>(null)

  // Mottaker
  const [newPhone, setNewPhone] = useState('')
  const [newRecipientName, setNewRecipientName] = useState('')
  const [selectedLocId, setSelectedLocId] = useState('')

  // Autocomplete stedssøk
  useEffect(() => {
    if (locQuery.length < 2) { setLocSugg([]); setLocOpen(false); return }
    clearTimeout(locTimer.current)
    locTimer.current = setTimeout(async () => {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locQuery)}&count=6&format=json`)
      const d = await r.json()
      const hits = (d.results || []).filter((x: any) => x.country_code === 'NO').slice(0, 5)
      setLocSugg(hits); setLocOpen(hits.length > 0)
    }, 300)
  }, [locQuery])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch(`/api/min-side?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    if (data.subscriber) { setSubscriber(data.subscriber); setLocations(data.locations || []); setRecipients(data.recipients || []); setView('dashboard') }
    else alert('Ingen abonnement funnet for denne e-postadressen.')
    setLoading(false)
  }

  function pickLoc(s: any) {
    const name = s.name + (s.admin1 ? ', ' + s.admin1.replace(' Fylke','') : '')
    setLocQuery(name); setLocValgt({ name, lat: s.latitude, lon: s.longitude }); setLocOpen(false); setLocSugg([])
  }

  async function addLocation(e: React.FormEvent) {
    e.preventDefault()
    if (!locValgt) return
    const res = await fetch('/api/min-side/location', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriber_id: subscriber!.id, name: locValgt.name, lat: locValgt.lat, lon: locValgt.lon }),
    })
    const data = await res.json()
    if (data.location) { setLocations([...locations, data.location]); setLocQuery(''); setLocValgt(null) }
  }

  async function addRecipient(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/min-side/recipient', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriber_id: subscriber!.id, location_id: selectedLocId, phone: newPhone, name: newRecipientName }),
    })
    const data = await res.json()
    if (data.recipient) { setRecipients([...recipients, data.recipient]); setNewPhone(''); setNewRecipientName('') }
  }

  const planLabel: Record<string, string> = { basis: 'Basis 49 kr/mnd', familie: 'Familie 99 kr/mnd', pro: 'Pro 199 kr/mnd' }


  if (view === 'login') return (
    <div className={styles.page}>
      <nav className={styles.nav}><a href="/" className={styles.logo}>bølge<span>varsel</span></a></nav>
      <div className={styles.center}>
        <h1 className={styles.title}>Min side</h1>
        <p className={styles.sub}>Logg inn med e-postadressen du registrerte deg med</p>
        <form onSubmit={handleLogin} className={styles.form}>
          <input className={styles.input} type="email" placeholder="din@epost.no" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className={styles.btn} disabled={loading}>{loading ? 'Søker...' : 'Logg inn →'}</button>
        </form>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <nav className={styles.nav}><a href="/" className={styles.logo}>bølge<span>varsel</span></a></nav>
      <div className={styles.dashboard}>
        <div className={styles.dHeader}>
          <h1 className={styles.dTitle}>Hei! 👋</h1>
          <p className={styles.dSub}>{subscriber!.email} · <span className={styles.planBadge}>{planLabel[subscriber!.plan]}</span></p>
        </div>

        {/* Lokasjoner */}
        <section className={styles.section}>
          <h2 className={styles.sTitle}>🗺️ Mine lokasjoner</h2>
          {locations.length === 0 && <p className={styles.empty}>Ingen lokasjoner ennå. Legg til din første!</p>}
          <div className={styles.cards}>
            {locations.map(loc => (
              <div key={loc.id} className={styles.card}>
                <div className={styles.cardTitle}>{loc.name}</div>
                <div className={styles.cardSub}>{loc.lat.toFixed(4)}°N, {loc.lon.toFixed(4)}°Ø</div>
              </div>
            ))}
          </div>

          <form onSubmit={addLocation} className={styles.addForm}>
            <div style={{position:'relative'}}>
              <input
                className={styles.input}
                placeholder="Søk etter sted (f.eks. Tånes, Mandal...)"
                value={locQuery}
                onChange={e => { setLocQuery(e.target.value); setLocValgt(null) }}
                onBlur={() => setTimeout(() => setLocOpen(false), 200)}
                onFocus={() => locSugg.length > 0 && setLocOpen(true)}
                autoComplete="off"
              />
              {locValgt && <span style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'0.75rem',color:'#22c55e',fontWeight:500}}>✓ {locValgt.lat.toFixed(3)}, {locValgt.lon.toFixed(3)}</span>}
              {locOpen && locSugg.length > 0 && (
                <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'white',borderRadius:12,boxShadow:'0 8px 24px rgba(10,42,61,0.12)',border:'1px solid rgba(10,42,61,0.08)',overflow:'hidden',zIndex:999}}>
                  {locSugg.map((s, i) => (
                    <div key={i} onMouseDown={() => pickLoc(s)}
                      style={{padding:'10px 14px',cursor:'pointer',borderBottom:i<locSugg.length-1?'1px solid #f0f4f8':'none',fontSize:'0.9rem'}}
                      onMouseEnter={e => (e.currentTarget.style.background='#f0f8fc')}
                      onMouseLeave={e => (e.currentTarget.style.background='white')}>
                      <span style={{fontWeight:500,color:'#0a2a3d'}}>{s.name}</span>
                      {s.admin1 && <span style={{color:'#6b8fa3',fontSize:'0.82rem'}}> – {s.admin1.replace(' Fylke','')}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className={styles.addBtn} type="submit" disabled={!locValgt}>+ Legg til lokasjon</button>
          </form>
        </section>

        {/* Mottakere */}
        <section className={styles.section}>
          <h2 className={styles.sTitle}>📱 Mine mottakere</h2>
          {recipients.length === 0 && <p className={styles.empty}>Ingen mottakere ennå.</p>}
          <div className={styles.cards}>
            {recipients.map(r => (
              <div key={r.id} className={styles.card}>
                <div className={styles.cardTitle}>{r.name || r.phone}</div>
                <div className={styles.cardSub}>{r.phone} · {r.active ? '✅ Aktiv' : '⏸ Pauset'}</div>
              </div>
            ))}
          </div>
          {locations.length > 0 && (
            <form onSubmit={addRecipient} className={styles.addForm}>
              <select className={styles.input} value={selectedLocId} onChange={e => setSelectedLocId(e.target.value)} required>
                <option value="">Velg lokasjon</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <input className={styles.input} placeholder="Navn (valgfritt)" value={newRecipientName} onChange={e => setNewRecipientName(e.target.value)} />
              <input className={styles.input} placeholder="Telefonnummer (+4799..." value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
              <button className={styles.addBtn} type="submit">+ Legg til mottaker</button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
