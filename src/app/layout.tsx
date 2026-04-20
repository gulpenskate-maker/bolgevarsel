import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const BASE = 'https://bolgevarsel.no'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Bølgevarsel – Daglig sjøvarsel på SMS',
    template: '%s | Bølgevarsel',
  },
  description: 'Få daglig bølge- og værvarsel direkte på SMS — skreddersydd for din kystlokasjon langs norskekysten. Enkelt, pålitelig og norsk.',
  keywords: ['bølgevarsel', 'sjøvarsel', 'bølger SMS', 'værvarsel kyst', 'sjøvær Norge', 'bølgehøyde', 'kystvarsel', 'fiskevarsel', 'havvarsel', 'sjøforhold', 'fiske SMS varsel', 'bølgevarsel fisker'],
  authors: [{ name: 'Bølgevarsel', url: BASE }],
  creator: 'Solidlab.ai',
  publisher: 'Solidlab.ai',
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: BASE,
    siteName: 'Bølgevarsel',
    title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
    description: 'Få daglig bølge- og værvarsel direkte på SMS — skreddersydd for din kystlokasjon langs norskekysten.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bølgevarsel – Daglig sjøvarsel på SMS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
    description: 'Daglig bølge- og værvarsel direkte på SMS for norskekysten.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}<Analytics /><SpeedInsights /></body>
    </html>
  )
}
