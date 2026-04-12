'use client'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="/" className={styles.logoLink}>
        <svg width="220" height="36" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="#0a2a3d" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="#1a6080" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
          <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill="#0a2a3d" letterSpacing="-0.8">bølgevarsel<tspan fill="#1a6080" fontWeight="400">.no</tspan></text>
        </svg>
      </a>
      <ul className={styles.links}>
        <li><a href="#hvordan">Hvordan det fungerer</a></li>
        <li><a href="#pris">Priser</a></li>
        <li><a href="/varsel">Sjekk bølger</a></li>
        <li><a href="/sjokamera">Sjøkamera</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/hjelp">Hjelp</a></li>
      </ul>
      <a href="/min-side" className={styles.cta}>Logg inn</a>
    </nav>
  )
}
