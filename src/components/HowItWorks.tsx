import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '01',
    title: 'Velg lokasjon og mottakere',
    desc: 'Søk opp din havn, hytte eller fiskeplass. Legg til hvem som skal få rapporten — deg selv, familien eller svigerforeldre.',
    details: ['Hele norskekysten støttes', 'Opptil 5 mottakere per lokasjon', 'SMS og e-post'],
    preview: false,
  },
  {
    num: '02',
    title: 'Vi analyserer bølger, vind og vær',
    desc: 'Vi henter ferske data fra met.no og Open-Meteo, beregner forholdene for akkurat din lokasjon og setter det sammen til en klar rapport.',
    details: ['Bølgehøyde og periode', 'Vindstyrke og retning', 'Lufttemperatur og skydekke', 'Oppdaterte data hver natt'],
    preview: false,
  },
  {
    num: '03',
    title: 'Du mottar komplett rapport kl. 07:30',
    desc: 'Rapporten gir deg konkrete tall og en tydelig vurdering. SMS for rask oversikt, e-post for full detalj.',
    details: [],
    preview: true,
  },
]

export default function HowItWorks() {
  return (
    <section id="hvordan" className={styles.section}>
      <span className={styles.label}>Slik fungerer det</span>
      <h2 className={styles.title}>Daglig sjørapport,<br/>levert kl. 07:30</h2>
      <p className={styles.sub}>Du velger lokasjon og mottakere — vi gjør resten. Hver morgen får du en komplett rapport med alt du trenger for å ta gode beslutninger på sjøen.</p>

      <div className={styles.steps}>
        {steps.map((step) => (
          <div key={step.num} className={styles.step}>
            <div className={styles.stepNum}>{step.num}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
            {step.details.length > 0 && (
              <ul className={styles.details}>
                {step.details.map((d) => (
                  <li key={d} className={styles.detail}>{d}</li>
                ))}
              </ul>
            )}
            {step.preview && (
              <div className={styles.smsPreview}>
                <div className={styles.smsHeader}>Bølgevarsel · Tånes · søndag</div>
                <div className={styles.smsRow}>🌊 Bølger: 0.4 m · periode 6 s</div>
                <div className={styles.smsRow}>💨 Vind: 3 m/s fra SV</div>
                <div className={styles.smsRow}>🌡️ Luft: 8°C · lettskyet</div>
                <div className={styles.smsGood}>✅ Gode forhold — fin dag på sjøen</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.alert}>
        <div className={styles.alertIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 L18 17 H2 Z" stroke="#cc7700" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <path d="M10 8 V12" stroke="#cc7700" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="14.5" r="0.9" fill="#cc7700"/>
          </svg>
        </div>
        <div className={styles.alertContent}>
          <h3 className={styles.alertTitle}>Kritisk varsling — uavhengig av den daglige rapporten</h3>
          <p className={styles.alertDesc}>Dersom værsituasjonen endrer seg dramatisk i løpet av dagen sender vi umiddelbart et farevarsel til alle mottakere. Ingen farlig situasjon forsvinner ubemerket.</p>
          <div className={styles.alertExample}>
            <div className={styles.alertSms}>
              ⚠️ <strong>Farevarsel · Tånes</strong><br/>
              Kuling varslet fra kl. 14:00 — 20+ m/s fra NV. Unngå sjøen frem til i morgen tidlig.
            </div>
          </div>
          <div className={styles.alertTags}>
            {['Kuling', 'Ekstremvær', 'Sterk strøm', 'SMS umiddelbart'].map((t) => (
              <span key={t} className={styles.alertTag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
