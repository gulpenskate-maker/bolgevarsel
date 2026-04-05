'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inp: React.CSSProperties = { padding: '0.7rem 1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }
const btn = (farge: string, tekst: string): React.CSSProperties => ({ background: farge, color: 'white', padding: '0.6rem 1.2rem', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap' as const })
const sectionStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '1.2rem 1.4rem', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1rem' }
const labelStyle: React.CSSProperties = { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem', display: 'block' }

export default function BrukerAdmin({ sub }: { sub: any }) {
  const router = useRouter()
  const [melding, setMelding] = useState<{ tekst: string; ok: boolean } | null>(null)
  const [nyEpost, setNyEpost] = useState(sub.email)
  const [notater, setNotater] = useState(sub.notes || '')
  const [loading, setLoading] = useState<string | null>(null)

  const vis = (tekst: string, ok = true) => { setMelding({ tekst, ok }); setTimeout(() => setMelding(null), 3500) }

  async function patch(felt: string, verdi: any) {
    setLoading(felt)
    const r = await fetch('/api/admin/bruker', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-key': 'ulrik-admin-2026' }, body: JSON.stringify({ subscriber_id: sub.id, field: felt, value: verdi }) })
    const d = await r.json()
    setLoading(null)
    if (d.subscriber) { vis('✅ Lagret!'); router.refresh() }
    else vis('❌ Feil: ' + d.error, false)
  }

  async function slettMottaker(id: string) {
    if (!confirm('Slett mottaker?')) return
    await fetch('/api/admin/mottaker', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-key': 'ulrik-admin-2026' }, body: JSON.stringify({ id }) })
    vis('✅ Mottaker slettet'); router.refresh()
  }

  async function slettLokasjon(id: string) {
    if (!confirm('Slett lokasjon og alle mottakere på den?')) return
    await fetch('/api/min-side/location/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, subscriber_id: sub.id }) })
    vis('✅ Lokasjon slettet'); router.refresh()
  }

  const statusFarge = sub.locked ? '#ef4444' : sub.status === 'active' ? '#4ade80' : '#fb923c'
  const planFarger: Record<string, string> = { kyst: '#4da8cc', familie: '#60a5fa', pro: '#fbbf24' }

  return (
    <div style={{ minHeight: '100vh', background: '#071622', fontFamily: 'DM Sans, sans-serif', color: 'white' }}>
      <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem' }}>← Admin</a>
        <span style={{ fontFamily: 'serif', fontSize: '1.2rem', fontWeight: 600 }}>bølge<span style={{ color: '#4da8cc' }}>varsel</span></span>
        <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600 }}>ADMIN</span>
        {melding && <span style={{ marginLeft: 'auto', color: melding.ok ? '#4ade80' : '#f87171', fontSize: '0.88rem' }}>{melding.tekst}</span>}
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.3rem', fontFamily: 'serif', fontWeight: 400, fontSize: '1.6rem' }}>{sub.email}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: planFarger[sub.plan] + '22', color: planFarger[sub.plan], padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>{sub.plan}</span>
              <span style={{ background: statusFarge + '22', color: statusFarge, padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>{sub.locked ? '🔒 Sperret' : sub.status}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '3px 0' }}>ID: {sub.id.slice(0, 12)}...</span>
            </div>
          </div>
        </div>
        {/* KONTOSTATUS */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Kontostatus</span>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => patch('status', 'active')} disabled={sub.status === 'active' && !sub.locked} style={{ ...btn('#16a34a', ''), opacity: sub.status === 'active' && !sub.locked ? 0.4 : 1 }}>✅ Aktiver</button>
            <button onClick={() => patch('status', 'inactive')} style={btn('#64748b', '')}>⏸ Deaktiver</button>
            <button onClick={() => patch('locked', !sub.locked)} style={btn(sub.locked ? '#16a34a' : '#ef4444', '')}>
              {sub.locked ? '🔓 Lås opp konto' : '🔒 Sperre konto'}
            </button>
            <button onClick={() => patch('status', 'cancelled')} style={btn('#7f1d1d', '')}>🚫 Kanseller</button>
          </div>
          {sub.locked && <p style={{ margin: '0.8rem 0 0', fontSize: '0.82rem', color: '#f87171' }}>⚠️ Kontoen er sperret — abonnenten kan ikke logge inn eller motta varsler.</p>}
        </div>

        {/* ENDRE E-POST */}
        <div style={sectionStyle}>
          <span style={labelStyle}>E-postadresse</span>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input style={{ ...inp, flex: 1 }} value={nyEpost} onChange={e => setNyEpost(e.target.value)} type="email" />
            <button onClick={() => patch('email', nyEpost)} disabled={nyEpost === sub.email} style={{ ...btn('#4da8cc', ''), opacity: nyEpost === sub.email ? 0.4 : 1, padding: '0.6rem 1.4rem' }}>
              {loading === 'email' ? '...' : 'Lagre'}
            </button>
          </div>
        </div>

        {/* ENDRE PLAN */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Abonnementsplan</span>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {['kyst', 'familie', 'pro'].map(p => (
              <button key={p} onClick={() => patch('plan', p)} style={{ ...btn(sub.plan === p ? '#4da8cc' : '#1e293b', ''), border: sub.plan === p ? 'none' : '1px solid rgba(255,255,255,0.15)', opacity: sub.plan === p ? 1 : 0.7 }}>
                {p.charAt(0).toUpperCase() + p.slice(1)} {sub.plan === p ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* MOTTAKERE / TELEFONNUMRE */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Mottakere & telefonnumre</span>
          {sub.bv_recipients?.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', margin: 0 }}>Ingen mottakere registrert.</p>}
          {sub.bv_recipients?.map((r: any) => (
            <RecipientRow key={r.id} r={r} subscriberId={sub.id} onSave={() => router.refresh()} onDelete={() => slettMottaker(r.id)} />
          ))}
        </div>

        {/* LOKASJONER */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Lokasjoner ({sub.bv_locations?.length ?? 0})</span>
          {sub.bv_locations?.map((l: any) => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.9rem' }}>📍 {l.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{l.lat.toFixed(4)}°N, {l.lon.toFixed(4)}°Ø</div>
              </div>
              <button onClick={() => slettLokasjon(l.id)} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '4px 10px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.78rem' }}>🗑 Slett</button>
            </div>
          ))}
        </div>

        {/* STRIPE */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Stripe</span>
          <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Customer ID: {sub.stripe_customer_id || '—'}</div>
          {sub.stripe_customer_id && (
            <a href={`https://dashboard.stripe.com/customers/${sub.stripe_customer_id}`} target="_blank" rel="noopener noreferrer"
              style={{ color: '#4da8cc', fontSize: '0.85rem', textDecoration: 'none' }}>↗ Åpne i Stripe Dashboard</a>
          )}
        </div>

        {/* NOTATER */}
        <div style={sectionStyle}>
          <span style={labelStyle}>Interne notater</span>
          <textarea value={notater} onChange={e => setNotater(e.target.value)}
            style={{ ...inp, borderRadius: 10, resize: 'vertical', minHeight: 80, lineHeight: 1.5 }}
            placeholder="Interne notater om denne kunden..." />
          <button onClick={() => patch('notes', notater)} style={{ ...btn('#4da8cc', ''), marginTop: '0.6rem', padding: '0.6rem 1.4rem' }}>
            {loading === 'notes' ? '...' : '💾 Lagre notater'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Separat komponent for å redigere mottaker inline
function RecipientRow({ r, subscriberId, onSave, onDelete }: { r: any; subscriberId: string; onSave: () => void; onDelete: () => void }) {
  const [phone, setPhone] = useState(r.phone)
  const [name, setName] = useState(r.name || '')
  const [smsEnabled, setSmsEnabled] = useState(r.sms_enabled !== false)
  const [loading, setLoading] = useState(false)

  async function lagre() {
    setLoading(true)
    await fetch('/api/min-side/recipient/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, subscriber_id: subscriberId, phone, name, sms_enabled: smsEnabled }),
    })
    setLoading(false)
    onSave()
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '0.9rem 1rem', marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Navn" style={{ flex: 1, minWidth: 120, padding: '0.5rem 0.8rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }} />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+47..." style={{ flex: 1, minWidth: 140, padding: '0.5rem 0.8rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
          <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} />
          SMS aktivert
        </label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={lagre} disabled={loading} style={{ background: '#4da8cc', color: 'white', padding: '4px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
            {loading ? '...' : '💾 Lagre'}
          </button>
          <button onClick={onDelete} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '4px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>🗑 Slett</button>
        </div>
      </div>
    </div>
  )
}
