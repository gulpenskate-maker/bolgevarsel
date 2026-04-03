import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bølgevarsel – Daglig sjøvarsel på SMS',
  description: 'Daglig bølge- og værvarsel direkte på SMS for norskekysten.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
