'use client'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>bølge<span>varsel</span></div>
      <ul className={styles.links}>
        <li><a href="#hvordan">Hvordan det fungerer</a></li>
        <li><a href="#pris">Priser</a></li>
        <li><a href="/min-side">Min side</a></li>
      </ul>
      <a href="/registrer" className={styles.cta}>Kom i gang</a>
    </nav>
  )
}
