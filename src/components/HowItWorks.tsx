import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '01',
    title: 'Velg lokasjon og mottakere',
    desc: 'Søk opp din havn, hytte eller fiskeplass. Legg til hvem som skal få rapporten — deg selv, familien eller svigerforeldre.',
    details: ['Hele norskekysten støttes', 'Opptil 5 mottakere per lokasjon', 'Aktivitetsprofil per mottaker', 'SMS og e-post'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C10.13 3 7 6.13 7 10c0 5.25 7 15 7 15s7-9.75 7-15c0-3.87-3.13-7-7-7z" stroke="#1a6080" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
        <circle cx="14" cy="10" r="2.5" stroke="#1a6080" strokeWidth="1.4" fill="none"/>
        <path d="M4 24 Q7 22 10 24 Q13 26 16 24 Q19 22 22 24 Q24 25 26 24" stroke="#4da8cc" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
      </svg>
    ),
    preview: false,
  },
  {
    num: '02',
    title: 'Vi analyserer bølger, vind og vær',
    desc: 'Vi henter ferske data fra met.no og Open-Meteo, beregner forholdene for akkurat din lokasjon og setter det sammen til en klar rapport.',
    details: ['Bølgehøyde og periode', 'Vindstyrke og retning', 'Lufttemperatur og sjøtemperatur', 'Data fra met.no og Open-Meteo'],
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="9" r="3" stroke="#cc7700" strokeWidth="1.4" fill="none"/>
        <path d="M14 4V5.5M14 12.5V14M9 9H7.5M20.5 9H19M10.5 5.5L11.5 6.5M17.5 11.5L18.5 12.5M10.5 12.5L11.5 11.5M17.5 6.5L18.5 5.5" stroke="#cc7700" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
        <path d="M4 18 Q7 15 10 18 Q13 21 16 18 Q19 15 24 18" stroke="#1a6080" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        <path d="M4 22 Q7 19.5 10 22 Q13 24.5 16 22 Q19 19.5 24 22" stroke="#4da8cc" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
      </svg>
    ),
    preview: false,
  },
  {
    num: '03',
    title: 'Du mottar din daglige sjørapport',
    desc: 'SMS for rask oversikt, e-post for full detalj — og rapport-fanen på Min side lar deg sjekke forholdene når som helst.',
    details: [],
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="3" width="12" height="20" rx="2.5" stroke="#1a6080" strokeWidth="1.6" fill="none"/>
        <path d="M11 9h6M11 12h6M11 15h4" stroke="#1a6080" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <circle cx="20" cy="5" r="3.5" fill="#1a6080"/>
        <path d="M20 3.5V5.5M19 5.5h2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    preview: true,
  },
]

function SmsRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={styles.smsRow}>
      <span className={styles.smsIcon}>{icon}</span>
      {children}
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="hvordan" className={styles.section}>
      <span className={styles.label}>Slik fungerer det</span>
      <h2 className={styles.title}>Daglig sjørapport<br/>levert når du vil</h2>
      <p className={styles.sub}>Du velger lokasjon, mottakere og tidspunkt — vi gjør resten. Hver dag får du en komplett sjørapport tilpasset din aktivitet og kystlokasjon.</p>

      <div className={styles.steps}>
        {steps.map((step) => (
          <div key={step.num} className={styles.step}>
            
            <div className={styles.stepIcon}>{step.icon}</div>
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
                <div className={styles.smsHeader}>Bølgevarsel · Tånes · din kyst</div>
                <SmsRow icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 7 Q3 5 5 7 Q7 9 9 7 Q11 5 13 7 Q14 8 15 7" stroke="#1a6080" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M1 10.5 Q3 8.5 5 10.5 Q7 12.5 9 10.5 Q11 8.5 13 10.5 Q14 11.5 15 10.5" stroke="#4da8cc" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                }>Bølger: 0.4 m · periode 6 s</SmsRow>
                <SmsRow icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 6 Q6 4 10 6 Q12 7 14 6" stroke="#1a6080" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M1 9.5 Q5 8 8 9.5 Q10 10.5 12 9.5" stroke="#1a6080" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
                    <path d="M14 6 Q16 6 16 7.5 Q16 9 14 9 H9" stroke="#1a6080" strokeWidth="1.1" strokeLinecap="round" opacity="0.35"/>
                  </svg>
                }>Vind: 3 m/s fra SV</SmsRow>
                <SmsRow icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2 V9" stroke="#1a6080" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="8" cy="12" r="2.5" stroke="#1a6080" strokeWidth="1.3" fill="none"/>
                    <path d="M10 4.5 H12 M10 6.5 H11.5" stroke="#1a6080" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                }>Luft: 8°C · lettskyet</SmsRow>
                <SmsRow icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2 C8 2 4 7 4 10 C4 12.2 5.8 14 8 14 C10.2 14 12 12.2 12 10 C12 7 8 2 8 2Z" stroke="#4da8cc" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
                    <path d="M8 11 V8" stroke="#4da8cc" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                }>Sjø: 8.2°C</SmsRow>
                <div className={styles.smsGood}>
                  <span className={styles.smsGoodIcon}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5 L4.5 7.5 L8.5 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Gode forhold — fin dag på sjøen
                </div>
                <div className={styles.smsStability}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{flexShrink:0, marginTop:2}}>
                    <path d="M1 6.5 H11 M8.5 4 L11 6.5 L8.5 9" stroke="#6b8fa3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Forholdene holder seg stabile de neste 6 timene
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.alert}>
        <div className={styles.alertIcon}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2 L20 19 H2 Z" stroke="#cc7700" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
            <path d="M11 8 V13" stroke="#cc7700" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="11" cy="16" r="1" fill="#cc7700"/>
          </svg>
        </div>
        <div className={styles.alertContent}>
          <h3 className={styles.alertTitle}>Kritisk farevarsel — alltid på, kan ikke skrus av</h3>
          <p className={styles.alertDesc}>Dersom sjøforholdene blir farlige sender vi umiddelbart et farevarsel til alle aktive mottakere — uansett tidspunkt og uavhengig av SMS-innstillingene. Sikkerhet går foran alt.</p>
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
