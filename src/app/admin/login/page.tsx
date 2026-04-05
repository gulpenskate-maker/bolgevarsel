'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [brukernavn, setBrukernavn] = useState('')
  const [passord, setPassord] = useState('')
  const [feil, setFeil] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function loggInn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setFeil('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brukernavn, passord }),
    })
    if (res.ok) { router.push('/admin'); router.refresh() }
    else setFeil('Feil brukernavn eller passord')
    setLoading(false)
  }

  const inp: React.CSSProperties = { padding: '0.85rem 1.2rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: '#071622', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'serif', fontSize: '1.8rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>bølge<span style={{ color: '#4da8cc' }}>varsel</span></div>
          <span style={{ background: '#ef4444', color: 'white', padding: '2px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>ADMIN</span>
        </div>
        <form onSubmit={loggInn} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <input style={inp} placeholder="Brukernavn" value={brukernavn} onChange={e => setBrukernavn(e.target.value)} required autoFocus />
          <input style={inp} placeholder="Passord" type="password" value={passord} onChange={e => setPassord(e.target.value)} required />
          {feil && <p style={{ color: '#f87171', fontSize: '0.88rem', textAlign: 'center', margin: 0 }}>{feil}</p>}
          <button type="submit" disabled={loading} style={{ background: '#4da8cc', color: 'white', padding: '0.9rem', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.4rem' }}>
            {loading ? 'Logger inn...' : 'Logg inn →'}
          </button>
        </form>
      </div>
    </div>
  )
}
