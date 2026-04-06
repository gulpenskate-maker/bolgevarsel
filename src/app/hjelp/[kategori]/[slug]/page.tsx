import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTIKLER } from '@/lib/hjelp-artikler'
import '../../artikkel.css'


import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ kategori: string; slug: string }> }
): Promise<Metadata> {
  const { kategori, slug } = await params
  const artikkel = ARTIKLER[`${kategori}/${slug}`]
  if (!artikkel) return {}
  const url = `https://bolgevarsel.no/hjelp/${kategori}/${slug}`
  return {
    title: artikkel.tittel,
    description: `${artikkel.tittel} — les vår guide på Bølgevarsel hjelpesenteret.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${artikkel.tittel} | Bølgevarsel`,
      description: `${artikkel.tittel} — les vår guide på Bølgevarsel hjelpesenteret.`,
      url,
      type: 'article',
    },
  }
}

export default async function ArtikkelPage({ params }: { params: Promise<{ kategori: string; slug: string }> }) {
  const { kategori, slug } = await params
  const artikkel = ARTIKLER[`${kategori}/${slug}`]
  if (!artikkel) notFound()

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', fontFamily:'DM Sans, sans-serif' }}>
      <nav style={{ padding:'1.2rem 2rem', borderBottom:'1px solid rgba(10,42,61,0.08)', background:'rgba(240,244,248,0.95)', position:'sticky' as const, top:0, zIndex:100 }}>
        <div style={{ maxWidth:780, margin:'0 auto', display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/hjelp" style={{ color:'rgba(10,42,61,0.4)', textDecoration:'none', fontSize:'0.85rem' }}>← Hjelpesenter</Link>
          <Link href="/" style={{ fontFamily:"'Fraunces', Georgia, serif", fontSize:'1.2rem', fontWeight:600, color:'#0a2a3d', textDecoration:'none' }}>
            <svg width="220" height="36" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="#0a2a3d" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="#1a6080" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
              <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill="#0a2a3d" letterSpacing="-0.8">bølgevarsel<tspan fill="#1a6080" fontWeight="400">.no</tspan></text>
            </svg>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'3rem 1.5rem' }}>
        <div style={{ marginBottom:'2rem' }}>
          <span style={{ fontSize:'0.72rem', fontWeight:600, color:'#1a6080', textTransform:'uppercase', letterSpacing:'0.1em' }}>{artikkel.kategori}</span>
          <h1 style={{ margin:'0.4rem 0 0.6rem', fontFamily:"'Fraunces', Georgia, serif", fontWeight:400, fontSize:'2.2rem', color:'#0a2a3d', lineHeight:1.25, letterSpacing:'-0.02em' }}>{artikkel.tittel}</h1>
          <p style={{ margin:0, color:'#94a3b8', fontSize:'0.82rem', fontStyle:'italic' }}>Sist oppdatert: 5. april 2026</p>
        </div>

        <div style={{ background:'white', borderRadius:20, padding:'2.5rem 3rem', boxShadow:'0 2px 12px rgba(10,42,61,0.06)', border:'1px solid rgba(10,42,61,0.07)' }}>
          <div className="artikkel-innhold" dangerouslySetInnerHTML={{ __html: artikkel.html }} />
        </div>

        <div style={{ marginTop:'2rem', padding:'1.5rem', background:'rgba(10,42,61,0.04)', borderRadius:16, textAlign:'center' }}>
          <p style={{ margin:'0 0 0.8rem', fontSize:'0.9rem', color:'#6b8fa3' }}>Var denne artikkelen nyttig?</p>
          <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center' }}>
            <a href="mailto:hei@bolgevarsel.no?subject=Hjelpesenter tilbakemelding" style={{ background:'white', border:'1px solid rgba(10,42,61,0.1)', color:'#334155', padding:'0.5rem 1.2rem', borderRadius:100, textDecoration:'none', fontSize:'0.85rem' }}>
              Kontakt oss
            </a>
            <Link href="/hjelp" style={{ background:'#0a2a3d', color:'white', padding:'0.5rem 1.2rem', borderRadius:100, textDecoration:'none', fontSize:'0.85rem' }}>
              ← Tilbake til hjelpesenter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
