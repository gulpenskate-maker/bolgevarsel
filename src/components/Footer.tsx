import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.name}>
        <svg width="160" height="26" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="rgba(125,211,240,0.55)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill="white" letterSpacing="-0.8">bølgevarsel<tspan fill="#7dd3fc" fontWeight="400">.no</tspan></text>
        </svg>
        <p style={{margin:'4px 0 0',fontSize:'0.82rem',opacity:0.55}}>daglig sjøvarsel på SMS</p>
      </div>
      <p className={styles.links}>
        <a href="/varsel">Sjekk bølger</a>
        &nbsp;·&nbsp;<a href="/hjelp">Hjelpesenter</a>
        &nbsp;·&nbsp;<a href="/hjelp/faq/hvor-noyaktig">FAQ</a>
        &nbsp;·&nbsp;<a href="/personvern">Personvern</a>
        &nbsp;·&nbsp;<a href="mailto:hei@bolgevarsel.no">Kontakt</a>
      </p>
      <p className={styles.links} style={{fontSize:'0.78rem', opacity:0.5}}>
        Data fra <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a> og <a href="https://met.no" target="_blank" rel="noopener">MET Norge</a> · Værvarselsdata fra MET Norge er lisensiert under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>
      </p>
      <p className={styles.copy}>© 2026 Stå på Pinne AS</p>
    </footer>
  )
}
