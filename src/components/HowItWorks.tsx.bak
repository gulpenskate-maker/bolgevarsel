import styles from './HowItWorks.module.css'

const steps = [
  { num: '01', title: 'Velg din lokasjon', desc: 'Søk opp din havn, hytte eller fiskeplass langs norskekysten. Vi har data for hele kystlinjen.' },
  { num: '02', title: 'Legg inn mobilnummeret', desc: 'Oppgi hvem som skal motta varselet — deg selv, samboer, svigerforeldre eller hele familien.' },
  { num: '03', title: 'Motta varsel kl. 07:30', desc: 'Hver morgen får du en kortfattet SMS med bølgehøyde, vindforhold, temperatur og en klar vurdering av dagen.' },
]

export default function HowItWorks() {
  return (
    <section id="hvordan" className={styles.section}>
      <span className={styles.label}>Slik fungerer det</span>
      <h2 className={styles.title}>Tre steg til tryggere<br/>tid på sjøen</h2>
      <div className={styles.steps}>
        {steps.map((step) => (
          <div key={step.num} className={styles.step}>
            <div className={styles.stepNum}>{step.num}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
