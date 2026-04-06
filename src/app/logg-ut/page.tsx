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
        <p style={{ color: '#6b8fa3', fontSize: '1rem' }}>Logger ut og rydder opp...</p>
      </div>
    </div>
  )
}
