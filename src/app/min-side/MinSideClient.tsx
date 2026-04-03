'use client'
import { useState } from 'react'
import styles from './page.module.css'

type Subscriber = {
  id: string
  email: string
  plan: string
  status: string
  stripe_customer_id: string
}

type Location = {
  id: string
  name: string
  lat: number
  lon: number
}

type Recipient = {
  id: string
  location_id: string
  phone: string
  name: string
  active: boolean
}

export default function MinSideClient() {
  const [email, setEmail] = useState('')
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'login' | 'dashboard'>('login')

  // Ny lokasjon
  const [newLocName, setNewLocName] = useState('')
  const [newLocLat, setNewLocLat] = useState('')
  const [newLocLon, setNewLocLon] = useState('')

  // Ny mottaker
  const [newPhone, setNewPhone] = useState('')
  const [newRecipientName, setNewRecipientName] = useState('')
  const [selectedLocId, setSelectedLocId] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/min-side?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    if (data.subscriber) {
      setSubscriber(data.subscriber)
      setLocations(data.locations || [])
      setRecipients(data.recipients || [])
      setView('dashboard')
    } else {
      alert('Ingen abonnement funnet for denne e-postadressen.')
    }
    setLoading(false)
  }

  async function addLocation(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/min-side/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriber_id: subscriber!.id, name: newLocName, lat: parseFloat(newLocLat), lon: parseFloat(newLocLon) }),
    })
    const data = await res.json()
    if (data.location) { setLocations([...locations, data.location]); setNewLocName(''); setNewLocLat(''); setNewLocLon('') }
  }

  async function addRecipient(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/min-side/recipient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          <div>
            <h1 className={styles.dTitle}>Hei! 👋</h1>
            <p className={styles.dSub}>{subscriber!.email} · <span className={styles.planBadge}>{planLabel[subscriber!.plan]}</span></p>
          </div>
        </div>

        {/* Lokasjoner */}
        <section className={styles.section}>
          <h2 className={styles.sTitle}>🗺️ Mine lokasjoner</h2>
          {locations.length === 0 && <p className={styles.empty}>Ingen lokasjoner ennå. Legg til din første!</p>}
          <div className={styles.cards}>
            {locations.map(loc => (
              <div key={loc.id} className={styles.card}>
                <div className={styles.cardTitle}>{loc.name}</div>
                <div className={styles.cardSub}>{loc.lat.toFixed(4)}, {loc.lon.toFixed(4)}</div>
              </div>
            ))}
          </div>
          <form onSubmit={addLocation} className={styles.addForm}>
            <input className={styles.input} placeholder="Stedsnavn (f.eks. Tånes)" value={newLocName} onChange={e => setNewLocName(e.target.value)} required />
            <input className={styles.input} placeholder="Breddegrad (lat)" value={newLocLat} onChange={e => setNewLocLat(e.target.value)} required />
            <input className={styles.input} placeholder="Lengdegrad (lon)" value={newLocLon} onChange={e => setNewLocLon(e.target.value)} required />
            <button className={styles.addBtn} type="submit">+ Legg til lokasjon</button>
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
