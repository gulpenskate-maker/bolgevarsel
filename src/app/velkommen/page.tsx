import styles from './page.module.css'

export default function Velkommen() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>bølge<span>varsel</span></a>
      </nav>
      <div className={styles.container}>
        <div className={styles.icon}>🌊</div>
        <h1 className={styles.title}>Velkommen om bord!</h1>
        <p className={styles.sub}>Abonnementet ditt er aktivt. Du mottar nå daglig bølgevarsel kl. 07:30.</p>
        <a href="/min-side" className={styles.btn}>Sett opp din lokasjon og mottakere →</a>
      </div>
    </div>
  )
}
