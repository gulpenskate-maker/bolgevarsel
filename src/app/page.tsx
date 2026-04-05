import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
  description: 'Få daglig bølge- og værvarsel direkte på SMS — skreddersydd for din kystlokasjon langs norskekysten. Enkelt, pålitelig og norsk.',
  alternates: { canonical: 'https://bolgevarsel.no' },
  openGraph: {
    title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
    description: 'Daglig sjøvarsel på SMS for norskekysten. Velg lokasjon, få rapport kl. 07:30.',
    url: 'https://bolgevarsel.no',
  },
}

import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import ForWho from '@/components/ForWho'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

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
      <Pricing />
      <Footer />
    </main>
  )
}
