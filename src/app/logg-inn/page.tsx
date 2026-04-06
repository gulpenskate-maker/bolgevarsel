'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function LoggInnContent() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')
  const feil = params.get('feil')
  const [status, setStatus] = useState<'loading' | 'ok' | 'feil'>(token ? 'loading' : 'feil')

  useEffect(() => {
    if (!token) return
    // Redirect til verify-ruten
    router.push(`/api/auth/verify?token=${token}`)
  }, [token, router])

  if (feil === 'utlopt') return (
    <div style={page}>
      <div style={box}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱</div>
        <h1 style={h1}>Lenken er utløpt</h1>
        <p style={sub}>Innloggingslenker er gyldige i 1 time. Be om en ny lenke.</p>
        <a href="/min-side" style={btn}>Gå til innlogging →</a>
      </div>
    </div>
  )

  return (
    <div style={page}>
      <div style={box}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'1rem' }}>
          <div style={{ width:56, height:56, borderRadius:14, background:'#0a2a3d', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
              <path d="M5 30 Q12 20 19 30 Q26 40 33 30 Q40 20 47 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              <path d="M4 38 Q11 33 18 38 Q25 43 32 38 Q39 33 46 38" stroke="rgba(125,211,240,0.6)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <circle cx="38" cy="13" r="6" fill="#fcd34d"/>
              <path d="M38 5L38 4M38 22L38 21M30 13L29 13M47 13L46 13M32.5 7.5L31.5 6.5M44 7.5L45 6.5" stroke="#fcd34d" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <h1 style={h1}>Logger inn...</h1>
        <p style={sub}>Du blir straks sendt til Min side</p>
      </div>
    </div>
  )
}

const page: React.CSSProperties = { minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }
const box: React.CSSProperties = { background: 'white', borderRadius: 20, padding: '3rem 2.5rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(10,42,61,0.08)', maxWidth: 400, width: '100%' }
const h1: React.CSSProperties = { margin: '0 0 0.5rem', fontFamily: 'serif', fontWeight: 400, fontSize: '1.6rem', color: '#0a2a3d' }
const sub: React.CSSProperties = { margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.95rem' }
const btn: React.CSSProperties = { display: 'inline-block', background: '#0a2a3d', color: 'white', padding: '0.8rem 1.8rem', borderRadius: 100, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }

export default function LoggInn() {
  return <Suspense fallback={<div style={page}><div style={box}><p style={sub}>Laster...</p></div></div>}><LoggInnContent /></Suspense>
}
