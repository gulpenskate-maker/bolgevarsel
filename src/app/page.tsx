import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import ForWho from '@/components/ForWho'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
  description: 'Få daglig bølge- og værvarsel direkte på SMS — skreddersydd for din kystlokasjon langs norskekysten. Enkelt, pålitelig og norsk.',
  alternates: { canonical: 'https://bolgevarsel.no' },
  openGraph: {
    title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
    description: 'Daglig sjøvarsel på SMS for norskekysten. Velg lokasjon og tidspunkt — vi gjør resten.',
    url: 'https://bolgevarsel.no',
  },
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Bølgevarsel',
          url: 'https://bolgevarsel.no',
          description: 'Daglig bølge- og sjøvarsel på SMS for norskekysten',
          publisher: {
            '@type': 'Organization',
            name: 'Stå på Pinne AS',
            url: 'https://bolgevarsel.no',
            contactPoint: { '@type': 'ContactPoint', email: 'hei@bolgevarsel.no', contactType: 'customer support', availableLanguage: 'Norwegian' }
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://bolgevarsel.no/varsel?sok={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }) }}
      />
      <Nav />
      <Hero />
      <HowItWorks />
      <ForWho />
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem 0',background:'#f4f8fb'}}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.18}}>
          <circle cx="32" cy="32" r="30" stroke="#0a2a3d" strokeWidth="2"/>
          <circle cx="32" cy="32" r="22" stroke="#0a2a3d" strokeWidth="1"/>
          <line x1="32" y1="2" x2="32" y2="10" stroke="#0a2a3d" strokeWidth="2" strokeLinecap="round"/>
          <line x1="32" y1="54" x2="32" y2="62" stroke="#0a2a3d" strokeWidth="2" strokeLinecap="round"/>
          <line x1="2" y1="32" x2="10" y2="32" stroke="#0a2a3d" strokeWidth="2" strokeLinecap="round"/>
          <line x1="54" y1="32" x2="62" y2="32" stroke="#0a2a3d" strokeWidth="2" strokeLinecap="round"/>
          <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="#0a2a3d" strokeWidth="1" strokeLinecap="round"/>
          <line x1="49.5" y1="49.5" x2="54.5" y2="54.5" stroke="#0a2a3d" strokeWidth="1" strokeLinecap="round"/>
          <line x1="54.5" y1="9.5" x2="49.5" y2="14.5" stroke="#0a2a3d" strokeWidth="1" strokeLinecap="round"/>
          <line x1="9.5" y1="54.5" x2="14.5" y2="49.5" stroke="#0a2a3d" strokeWidth="1" strokeLinecap="round"/>
          <polygon points="32,10 35,32 32,28 29,32" fill="#1a6080"/>
          <polygon points="32,54 35,32 32,36 29,32" fill="#0a2a3d" opacity="0.4"/>
          <circle cx="32" cy="32" r="2.5" fill="#0a2a3d"/>
        </svg>
      </div>
      <Pricing />
      <Footer />
    </main>
  )
}
