import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ARTIKLER } from '@/lib/hjelp-artikler'
import '../../artikkel.css'

export default async function ArtikkelPage({ params }: { params: Promise<{ kategori: string; slug: string }> }) {
  const { kategori, slug } = await params
  const artikkel = ARTIKLER[`${kategori}/${slug}`]
  if (!artikkel) notFound()

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', fontFamily:'DM Sans, sans-serif' }}>
      <nav style={{ padding:'1.2rem 2rem', borderBottom:'1px solid rgba(10,42,61,0.08)', background:'rgba(240,244,248,0.95)', position:'sticky' as const, top:0, zIndex:100 }}>
        <div style={{ maxWidth:780, margin:'0 auto', display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/hjelp" style={{ color:'rgba(10,42,61,0.4)', textDecoration:'none', fontSize:'0.85rem' }}>← Hjelpesenter</Link>
          <Link href="/" style={{ fontFamily:'serif', fontSize:'1.2rem', fontWeight:600, color:'#0a2a3d', textDecoration:'none' }}>
            bølge<span style={{color:'#4da8cc'}}>varsel</span>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'3rem 1.5rem' }}>
        <div style={{ marginBottom:'2rem' }}>
          <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#4da8cc', textTransform:'uppercase', letterSpacing:'0.08em' }}>{artikkel.kategori}</span>
          <h1 style={{ margin:'0.4rem 0 0.6rem', fontFamily:'serif', fontWeight:400, fontSize:'2rem', color:'#0a2a3d', lineHeight:1.3 }}>{artikkel.tittel}</h1>
          <p style={{ margin:0, color:'#6b8fa3', fontSize:'0.9rem' }}>Sist oppdatert: 5. april 2026</p>
        </div>

        <div style={{ background:'white', borderRadius:20, padding:'2.5rem', boxShadow:'0 2px 12px rgba(10,42,61,0.06)', border:'1px solid rgba(10,42,61,0.07)' }}>
          <div className="artikkel-innhold" dangerouslySetInnerHTML={{ __html: artikkel.html }} />
        </div>

        <div style={{ marginTop:'2rem', padding:'1.5rem', background:'rgba(10,42,61,0.04)', borderRadius:16, textAlign:'center' }}>
          <p style={{ margin:'0 0 0.8rem', fontSize:'0.9rem', color:'#6b8fa3' }}>Var denne artikkelen nyttig?</p>
          <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center' }}>
            <a href="mailto:hei@bolgevarsel.no?subject=Hjelpesenter tilbakemelding" style={{ background:'white', border:'1px solid rgba(10,42,61,0.1)', color:'#334155', padding:'0.5rem 1.2rem', borderRadius:100, textDecoration:'none', fontSize:'0.85rem' }}>
              ✉️ Kontakt oss
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
