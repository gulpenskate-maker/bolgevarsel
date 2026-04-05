import styles from './ForWho.module.css'

const personas = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    tittel: 'Familier med barn på sjøen',
    beskrivelse: 'Tenåringen vil ut med båten. Du vil sove godt. Med Bølgevarsel vet du hva sjøen gjør — og kan si ja eller nei med trygghet.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20"/>
        <path d="M5 20V10l7-7 7 7v10"/>
        <path d="M12 3v7"/>
        <path d="M9 20v-5h6v5"/>
      </svg>
    ),
    tittel: 'Fritidsbåteiere og seilere',
    beskrivelse: 'Planlegg turen med faktiske bølge- og vinddata fra akkurat din kystlokasjon. Ikke gå glipp av de beste dagene — eller havne i fare.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l4 4"/>
        <path d="M7 7c1.5-1.5 3.5-2 5.5-1.5"/>
        <path d="M12.5 5.5C15 4 18 5 19.5 7.5s1 5.5-1 7.5"/>
        <path d="M8 16l-5 5"/>
        <circle cx="17" cy="17" r="3"/>
      </svg>
    ),
    tittel: 'Fiskeentusiaster',
    beskrivelse: 'Tidlig morgen, god fangst — men bare hvis forholdene er riktige. Få varselet klokken 07:30 og avgjør om det er verdt turen.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20"/>
        <path d="M6 8c2-2 4-3 6-3s4 1 6 3"/>
        <path d="M6 16c2 2 4 3 6 3s4-1 6-3"/>
        <circle cx="12" cy="5" r="1.5"/>
      </svg>
    ),
    tittel: 'Surfere og kajakkpadlere',
    beskrivelse: 'Bølgehøyde, periode og vindretning direkte på SMS. Perfekt for deg som trenger presis sjøinfo for å planlegge dagen.',
  },
]

export default function ForWho() {
  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>Hvem er det for?</span>
          <h2 className={styles.title}>Laget for alle som<br/>bryr seg om sjøen</h2>
          <p className={styles.sub}>Enten du bekymrer deg for barna på sjøen, planlegger helgeturen eller vil vite om det er verdt å ta ut båten — Bølgevarsel gir deg svaret før du trenger det.</p>
        </div>
        <div className={styles.grid}>
          {personas.map((p) => (
            <div key={p.tittel} className={styles.card}>
              <div className={styles.iconWrap}>{p.icon}</div>
              <h3 className={styles.cardTitle}>{p.tittel}</h3>
              <p className={styles.cardText}>{p.beskrivelse}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
