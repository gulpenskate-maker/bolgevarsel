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
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌊</div>
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
