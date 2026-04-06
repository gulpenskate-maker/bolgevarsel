'use client'
import { useState } from 'react'

const S = {
  page: { minHeight: '100vh', background: '#071622', fontFamily: 'DM Sans, sans-serif', color: 'white' } as React.CSSProperties,
  nav: { padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  wrap: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' } as React.CSSProperties,
  card: { background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' } as React.CSSProperties,
  statCard: { background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.2rem 1.5rem', border: '1px solid rgba(255,255,255,0.08)', flex: 1 } as React.CSSProperties,
  badge: (active: boolean) => ({ background: active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: active ? '#4ade80' : '#f87171', padding: '2px 8px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600 }) as React.CSSProperties,
  planBadge: (plan: string) => ({ background: plan === 'pro' ? 'rgba(251,191,36,0.15)' : plan === 'familie' ? 'rgba(96,165,250,0.15)' : 'rgba(77,168,204,0.15)', color: plan === 'pro' ? '#fbbf24' : plan === 'familie' ? '#60a5fa' : '#4da8cc', padding: '2px 8px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600 }) as React.CSSProperties,
}

type Props = {
  subscribers: any[]
  stats: { aktive: number; inntekt: number; smskostnad: number; netto: number; smsPrMnd: number; totalMottakere: number }
  planTelling: any[]
}

export default function AdminDashboard({ subscribers, stats, planTelling }: Props) {
  const [søk, setSøk] = useState('')
  const [valgt, setValgt] = useState<any>(null)
  const [melding, setMelding] = useState('')
  const [testLoading, setTestLoading] = useState(false)

  const filtrert = subscribers.filter(s =>
    s.email.toLowerCase().includes(søk.toLowerCase())
  )

  async function loggUt() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  async function sendTestVarsel() {
    setTestLoading(true)
    const res = await fetch('https://zqodoekmswibvjzhtixf.supabase.co/functions/v1/bolgevarsel', { method: 'POST' })
    const d = await res.json()
    setMelding(d.ok ? '✅ Varsel sendt!' : '❌ Feil: ' + d.error)
    setTimeout(() => setMelding(''), 4000)
    setTestLoading(false)
  }

  async function oppdaterStatus(id: string, status: string) {
    await fetch('/api/admin/bruker', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-key': 'ulrik-admin-2026' }, body: JSON.stringify({ subscriber_id: id, field: 'status', value: status }) })
    window.location.reload()
  }

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '1.3rem', fontWeight: 600 }}><svg width="180" height="30" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="rgba(125,211,240,0.55)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
              <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill="white" letterSpacing="-0.8">bølgevarsel<tspan fill="#7dd3fc" fontWeight="400">.no</tspan></text>
            </svg></span>
          <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {melding && <span style={{ fontSize: '0.85rem', color: melding.startsWith('✅') ? '#4ade80' : '#f87171' }}>{melding}</span>}
          <button onClick={sendTestVarsel} disabled={testLoading} style={{ background: 'rgba(77,168,204,0.2)', color: '#4da8cc', padding: '0.5rem 1rem', borderRadius: 100, border: '1px solid rgba(77,168,204,0.3)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>
            {testLoading ? '...' : '📨 Send test'}
          </button>
          <a href="/admin/farevarsel" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.5rem 1rem', borderRadius: 100, border: '1px solid rgba(239,68,68,0.2)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500 }}>🚨 Farevarsel</a>
          <button onClick={loggUt} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', padding: '0.5rem 1rem', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>Logg ut</button>
        </div>
      </nav>

      <div style={S.wrap}>
        {/* STATS */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Aktive abonnenter', verdi: stats.aktive, farge: '#4da8cc' },
            { label: 'Inntekt/mnd', verdi: stats.inntekt + ' kr', farge: '#4ade80' },
            { label: 'SMS-kostnad/mnd', verdi: Math.round(stats.smskostnad) + ' kr', farge: '#fb923c' },
            { label: 'Netto/mnd', verdi: Math.round(stats.netto) + ' kr', farge: stats.netto > 0 ? '#4ade80' : '#f87171' },
            { label: 'SMS-mottakere', verdi: stats.totalMottakere, farge: '#a78bfa' },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 300, color: s.farge }}>{s.verdi}</div>
            </div>
          ))}
        </div>

        {/* PLAN-FORDELING */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {planTelling.map(p => (
            <div key={p.id} style={{ ...S.card, flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{p.name}</div>
              <div style={{ fontSize: '2rem', fontWeight: 300 }}>{p.antall}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{p.price} kr/mnd</div>
            </div>
          ))}
        </div>

        {/* ABONNENTER */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontFamily: "'Fraunces', Georgia, serif", fontWeight: 400, fontSize: '1.2rem' }}>👥 Abonnenter ({subscribers.length})</h2>
            <input placeholder="Søk e-post..." value={søk} onChange={e => setSøk(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', width: 220 }} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.8rem', fontWeight: 500 }}>E-post</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.8rem', fontWeight: 500 }}>Plan</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.8rem', fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.8rem', fontWeight: 500 }}>Lokasjoner</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.8rem', fontWeight: 500 }}>SMS-mott.</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.8rem', fontWeight: 500 }}>Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {filtrert.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }} onClick={() => window.location.href = `/admin/bruker/${s.id}`}>
                  <td style={{ padding: '0.75rem 0.8rem', fontSize: '0.9rem' }}>{s.email}</td>
                  <td style={{ padding: '0.75rem 0.8rem' }}><span style={S.planBadge(s.plan)}>{s.plan}</span></td>
                  <td style={{ padding: '0.75rem 0.8rem' }}><span style={S.badge(s.status === 'active')}>{s.status}</span></td>
                  <td style={{ padding: '0.75rem 0.8rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>{s.bv_locations?.length ?? 0}</td>
                  <td style={{ padding: '0.75rem 0.8rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>{s.bv_recipients?.filter((r: any) => r.active && r.sms_enabled !== false).length ?? 0}</td>
                  <td style={{ padding: '0.75rem 0.8rem' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {s.status !== 'active' && <button onClick={() => oppdaterStatus(s.id, 'active')} style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Aktiver</button>}
                      {s.status === 'active' && <button onClick={() => oppdaterStatus(s.id, 'inactive')} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '3px 8px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Deaktiver</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DETALJER VED KLIKK */}
          {valgt && (
            <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '1.2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detaljer — {valgt.email}</div>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Lokasjoner</div>
                  {valgt.bv_locations?.map((l: any) => <div key={l.id} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>📍 {l.name}</div>)}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Mottakere</div>
                  {valgt.bv_recipients?.map((r: any) => (
                    <div key={r.id} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
                      📱 {r.name || r.phone} · {r.phone} · <span style={{ color: r.active ? '#4ade80' : '#f87171' }}>{r.active ? 'Aktiv' : 'Pauset'}</span> · SMS: {r.sms_enabled !== false ? 'På' : 'Av'}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Stripe</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{valgt.stripe_customer_id || 'Ikke koblet'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
