import styles from './ForWho.module.css'

const personas = [
  {
    img: '/images/familie.jpg',
    imgAlt: 'Familie på sjøen',
    tag: 'For familier',
    tittel: 'Når ungene vil ut — og du vil sove godt',
    beskrivelse: 'Det er fredag ettermiddag og tenåringen vil ut med båten i morgen tidlig. Du vil si ja — men du er usikker på været. Med Bølgevarsel får du varselet klokken 07:30, med eksakt informasjon om bølger, vind og forhold akkurat der de skal dra. Du kan si ja med trygghet. Eller nei med fakta i hånden.',
  },
  {
    img: '/images/baateier.jpg',
    imgAlt: 'Fritidsbåteier på fjorden',
    tag: 'For båteiere',
    tittel: 'Planlegg helgeturen — ikke gå glipp av de beste dagene',
    beskrivelse: 'Du har båten liggende i havna, helgen nærmer seg og du lurer på om det er verdt å dra ut. I stedet for å sjekke fem ulike værtjenester og prøve å tolke symboler og prognoser, får du ett enkelt varsel tilpasset din kystlokasjon. Ingen gjetting. Bare en klar beskjed om hva sjøen gjør i morgen.',
  },
  {
    img: '/images/fisker.jpg',
    imgAlt: 'Fisker tidlig morgen',
    tag: 'For fiskeentusiaster',
    tittel: 'Opp klokken fem — men bare når det er verdt det',
    beskrivelse: 'Den perfekte fiskemorgenen starter kvelden før. Du setter alarmen bare hvis forholdene er riktige — rolig sjø, passe vind, riktig temperatur. Bølgevarsel gir deg akkurat det du trenger for å ta den avgjørelsen. Sov godt, vit at du får beskjed i tide, og møt opp på sjøen når det faktisk lønner seg.',
  },
  {
    img: '/images/surfer.jpg',
    imgAlt: 'Surfer på bølgene',
    tag: 'For aktive på vannet',
    tittel: 'Bølgehøyde, periode og retning — rett i lomma',
    beskrivelse: 'Enten du surfer, padler kajakk eller driver med kitesurfing, er presis sjødata gull verdt. Bølgehøyde, periode og vindretning fra akkurat din lokasjon — ikke et gjennomsnittsvarsel for hele kysten. Du vet om det er verdt å pakke brettet før du i det hele tatt har stått opp.',
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
                <img src={p.img} alt={p.imgAlt} className={styles.img} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
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
