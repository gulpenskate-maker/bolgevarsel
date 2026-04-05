import styles from './ForWho.module.css'

const personas = [
  {
    emoji: '👨‍👩‍👧‍👦',
    tittel: 'Familien med ungdommer på sjøen',
    beskrivelse: 'Tenåringen vil ut med båten. Du vil sove godt. Med Bølgevarsel vet du hva sjøen gjør — og kan si ja eller nei med trygghet.',
  },
  {
    emoji: '⛵',
    tittel: 'Seileren og fritidsbåteieren',
    beskrivelse: 'Planlegg turen med faktiske bølge- og vinddata fra akkurat din kystlokasjon. Ikke gå glipp av de beste dagene — eller havne i fare.',
  },
  {
    emoji: '🎣',
    tittel: 'Fiskeentusiasten',
    beskrivelse: 'Tidlig morgen, god fangst — men bare hvis forholdene er riktige. Få varselet klokken 07:30 og avgjør om det er verdt turen.',
  },
  {
    emoji: '🏄',
    tittel: 'Surfer og kajakker',
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
          <p className={styles.sub}>Enten du bekymrer deg for barna dine på sjøen, planlegger helgeturen eller bare vil vite om det er verdt å ta ut båten — Bølgevarsel gir deg svaret før du trenger det.</p>
        </div>
        <div className={styles.grid}>
          {personas.map((p) => (
            <div key={p.tittel} className={styles.card}>
              <span className={styles.emoji}>{p.emoji}</span>
              <h3 className={styles.cardTitle}>{p.tittel}</h3>
              <p className={styles.cardText}>{p.beskrivelse}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
