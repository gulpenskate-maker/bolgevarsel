import styles from './ForWho.module.css'

const personas = [
  {
    img: '/images/familie.png',
    imgAlt: 'Familie på sjøen',
    tag: 'For familier',
    tittel: 'Når ungene vil ut — og du vil sove godt',
    beskrivelse: 'Det er lørdag morgen og sønnen din vil ut med båten. Du vil si ja — men du vet ikke hva sjøen gjør. Med Bølgevarsel har du allerede fått varselet klokken 07:30. Du vet om bølgehøyde, vind og forhold akkurat der han skal. Du kan si ja med ro i magen — eller nei med fakta i hånden.',
  },
  {
    img: '/images/baateier.png',
    imgAlt: 'Fritidsbåteier på fjorden',
    tag: 'For båteiere',
    tittel: 'Planlegg helgeturen — ikke gå glipp av de beste dagene',
    beskrivelse: 'Båten ligger klar. Helgen er her. Men er sjøen det? I stedet for å tolke symboler og prognoser fra fem ulike tjenester, får du ett enkelt varsel — skreddersydd for din havn, din kyst, din tur.',
  },
  {
    img: '/images/fisker.png',
    imgAlt: 'Fisker tidlig morgen',
    tag: 'For fiskeentusiaster',
    tittel: 'Opp klokken fem — men bare når det er verdt det',
    beskrivelse: 'God fisk henger ikke i kalenderen — den henger i forholdene. Riktig bølgehøyde, riktig vind, riktig tidspunkt. Bølgevarsel forteller deg når det stemmer.',
  },
  {
    img: '/images/surfer.png',
    imgAlt: 'Surfer på bølgene',
    tag: 'For aktive på vannet',
    tittel: 'Bølgehøyde, periode og retning — rett i lomma',
    beskrivelse: 'De beste øktene skjer ikke ved en tilfeldighet. De skjer fordi du sjekket forholdene dagen før — og visste at i morgen blir bra.',
  },
]

export default function ForWho() {
  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>Hvem er det for?</span>
          <h2 className={styles.title}>Laget for alle som<br/>bryr seg om sjøen</h2>
        </div>
        <div className={styles.grid}>
          {personas.map((p) => (
            <div key={p.tittel} className={styles.card}>
              <div className={styles.imgWrap}>
                <img src={p.img} alt={p.imgAlt} className={styles.img} />
                <div className={styles.imgFallback} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.cardTitle}>{p.tittel}</h3>
                <p className={styles.cardText}>{p.beskrivelse}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
