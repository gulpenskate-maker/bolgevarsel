import Image from 'next/image'
import styles from './ForWho.module.css'

const personas = [
  {
    img: '/images/familie.png',
    imgAlt: 'Familie på sjøen',
    tag: 'For familier',
    tittel: 'Vet du om det er trygt — før ungene er i redningsvesten?',
    beskrivelse: 'Bølgevarsel sender deg rapporten mens du lager frokost. Bølgehøyde, vind, sjøtemperatur og en klar anbefaling — tilpasset barn og båt. Du bestemmer. Med fakta.',
  },
  {
    img: '/images/baateier.png',
    imgAlt: 'Fritidsbåteier på fjorden',
    tag: 'For båteiere',
    tittel: 'Finn den ene gode dagen — ikke håp på at helgen holder',
    beskrivelse: 'Rapportgeneratoren viser deg hele uken frem i tid. AI-en analyserer hvilken dag som er best for din tur, og hvorfor. Ikke mer synsing — bare én tydelig anbefaling.',
  },
  {
    img: '/images/fisker.jpg',
    imgAlt: 'Fisker ute på sjøen langs norskekysten',
    tag: 'For fiskere',
    tittel: 'Opp klokken fem — men bare når det faktisk er verdt det',
    beskrivelse: 'God fisk henger ikke i kalenderen — den henger i forholdene. Bølgevarsel gir deg fiskerens vurdering: bølgehøyde, vindstyrke, sjøtemperatur og om det er verdt å legge ut.',
  },
  {
    img: '/images/surfer.png',
    imgAlt: 'Surfer på bølgene',
    tag: 'For surfere og havkajakk',
    tittel: 'Periode, retning og offshore-vind — ikke bare bølgehøyde',
    beskrivelse: '5 sekunder periode og onshore vind? Da er det ikke verdt det. Bølgevarsel vet det — og sier det rett ut. AI-oppsummeringen er skrevet av en som faktisk surfer, ikke en værtjeneste.',
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
                <Image src={p.img} alt={p.imgAlt} fill className={styles.img} style={{ objectFit: 'cover' }} />
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
