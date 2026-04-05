'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoggUt() {
  const router = useRouter()

  useEffect(() => {
    // Slett localStorage
    localStorage.removeItem('bv_email')
    // Kall logout API for å slette cookie
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      setTimeout(() => router.push('/min-side'), 1000)
    })
  }, [router])

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌊</div>
        <p style={{ color: '#6b8fa3', fontSize: '1rem' }}>Logger ut og rydder opp...</p>
      </div>
    </div>
  )
}
