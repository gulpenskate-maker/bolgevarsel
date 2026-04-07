import type { Metadata } from 'next'
import DashboardKlient from './DashboardKlient'

export const metadata: Metadata = {
  title: 'Sjødashboard — Live bølge- og værdata | Bølgevarsel',
  description: 'Kraftig live sjødashboard med bølgehøyde, vindstyrke, sjøtemperatur og timebaserte grafer for alle kyststeder i Norge.',
  alternates: { canonical: 'https://bolgevarsel.no/dashboard' },
}

export default function DashboardPage() {
  return <DashboardKlient />
}
