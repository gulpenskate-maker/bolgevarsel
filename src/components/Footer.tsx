import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}><strong>bølgevarsel.no</strong> — daglig sjøvarsel på SMS</p>
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
