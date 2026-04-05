import { useState, useEffect } from 'react'
import styles from './Hero.module.css'

const locations = [
  {
    name: 'Tånes',
    date: 'fredag 3. april',
    vær: '11°C',
    vind: 'Svak bris 3.2 m/s fra SV',
    bølger: '0.4m – Stille 🟢',
    status: 'Flott dag på sjøen! ⛵',
  },
  {
    name: 'Stavanger havn',
    date: 'fredag 3. april',
    vær: '10°C',
    vind: 'Lett bris 4.1 m/s fra V',
    bølger: '0.6m – Rolig 🟡',
    status: 'Greit for erfarne 🚤',
  },
  {
    name: 'Jærstrendene',
    date: 'fredag 3. april',
    vær: '9°C',
    vind: 'Frisk bris 7.8 m/s fra SV',
    bølger: '1.2m – Moderat 🟠',
    status: 'Vær forsiktig i dag! 🏄',
  },
  {
    name: 'Tananger',
    date: 'fredag 3. april',
    vær: '11°C',
    vind: 'Svak bris 2.9 m/s fra S',
    bølger: '0.3m – Stille 🟢',
    status: 'Perfekt dag på sjøen! ⛵',
  },
  {
    name: 'Karmøy',
    date: 'fredag 3. april',
    vær: '10°C',
    vind: 'Lett bris 5.2 m/s fra NV',
    bølger: '0.8m – Rolig 🟡',
    status: 'Bra forhold i dag 🎣',
  },
  {
    name: 'Haugesund',
    date: 'fredag 3. april',
    vær: '12°C',
    vind: 'Svak bris 3.5 m/s fra N',
    bølger: '0.5m – Stille 🟢',
    status: 'Flott dag på sjøen! ⛵',
  },
  {
    name: 'Kristiansand',
    date: 'fredag 3. april',
    vær: '13°C',
    vind: 'Lett bris 4.4 m/s fra SØ',
    bølger: '0.5m – Stille 🟢',
    status: 'Flott dag på sjøen! ⛵',
  },
  {
    name: 'Lillesand',
    date: 'fredag 3. april',
    vær: '13°C',
    vind: 'Svak bris 2.8 m/s fra S',
    bølger: '0.3m – Stille 🟢',
    status: 'Perfekt skjærgårdsdag! 🏝️',
  },
  {
    name: 'Grimstad',
    date: 'fredag 3. april',
    vær: '14°C',
    vind: 'Svak bris 3.1 m/s fra SV',
    bølger: '0.4m – Stille 🟢',
    status: 'Perfekt for kajakk! 🚣',
  },
  {
    name: 'Drøbak',
    date: 'fredag 3. april',
    vær: '12°C',
    vind: 'Lett bris 4.8 m/s fra N',
    bølger: '0.3m – Stille 🟢',
    status: 'Bra dag i fjorden! ⛵',
  },
  {
    name: 'Oslofjorden',
    date: 'fredag 3. april',
    vær: '11°C',
    vind: 'Frisk bris 6.2 m/s fra SV',
    bølger: '0.7m – Rolig 🟡',
    status: 'Greit for erfarne 🚤',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % locations.length)
        setFading(false)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const loc = locations[current]

  return (
    <section className={styles.hero}>
      <svg className={styles.heroBg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8e8f5"/><stop offset="100%" stopColor="#e8f4f8"/></linearGradient>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a6080"/><stop offset="100%" stopColor="#0a2a3d"/></linearGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#skyGrad)"/>
        <circle cx="1100" cy="200" r="80" fill="#fff4e0" opacity="0.4"/>
        <circle cx="1100" cy="200" r="50" fill="#ffd580" opacity="0.5"/>
        <circle cx="1100" cy="200" r="30" fill="#ffbc40" opacity="0.7"/>
        <g opacity="0.7"><ellipse cx="200" cy="140" rx="90" ry="30" fill="white"/><ellipse cx="240" cy="125" rx="60" ry="25" fill="white"/><ellipse cx="160" cy="130" rx="50" ry="22" fill="white"/></g>
        <g opacity="0.5"><ellipse cx="700" cy="100" rx="70" ry="22" fill="white"/><ellipse cx="740" cy="88" rx="50" ry="20" fill="white"/></g>
        <path d="M0 480 L120 380 L260 440 L380 360 L500 420 L620 350 L760 420 L900 380 L1040 430 L1180 370 L1320 420 L1440 380 L1440 580 L0 580 Z" fill="#2a6a8a" opacity="0.25"/>
        <path d="M0 520 L150 440 L300 490 L450 420 L600 475 L750 430 L900 470 L1100 420 L1260 460 L1440 430 L1440 600 L0 600 Z" fill="#1e5a7a" opacity="0.3"/>
        <ellipse cx="300" cy="540" rx="110" ry="28" fill="#2a5a3a" opacity="0.85"/>
        <path d="M210 540 Q260 510 300 505 Q340 510 390 540 Z" fill="#3a6a4a" opacity="0.9"/>
        <rect x="296" y="490" width="8" height="22" fill="#e8e0d0" rx="1"/>
        <rect x="293" y="487" width="14" height="5" fill="#cc3333" rx="1"/>
        <circle cx="300" cy="487" r="3" fill="#ffcc00" opacity="0.9"/>
        <ellipse cx="1180" cy="560" rx="80" ry="20" fill="#2a5a3a" opacity="0.7"/>
        <path d="M1120 558 Q1160 535 1180 532 Q1200 535 1240 558 Z" fill="#3a6a4a" opacity="0.8"/>
        <path d="M0 570 Q180 550 360 565 Q540 580 720 562 Q900 545 1080 560 Q1260 575 1440 558 L1440 900 L0 900 Z" fill="url(#seaGrad)"/>
        <g opacity="0.35">
          <path d="M-100 610 Q60 595 200 612 Q340 629 480 610 Q620 591 760 610 Q900 629 1040 610 Q1180 591 1320 610 Q1400 619 1540 610" fill="none" stroke="white" strokeWidth="2"><animateTransform attributeName="transform" type="translate" from="0 0" to="100 0" dur="4s" repeatCount="indefinite"/></path>
          <path d="M-100 635 Q80 620 220 637 Q360 654 500 634 Q640 614 780 634 Q920 654 1060 634 Q1200 614 1340 634 Q1420 643 1540 634" fill="none" stroke="white" strokeWidth="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" dur="5.5s" repeatCount="indefinite"/></path>
        </g>
        <g><line x1="900" y1="550" x2="900" y2="520" stroke="#8a7a6a" strokeWidth="1.5"/><path d="M900 550 L878 545 L900 525 Z" fill="rgba(255,255,255,0.85)"/><path d="M900 550 L920 545 L900 535 Z" fill="rgba(255,255,255,0.6)"/><path d="M882 550 Q900 554 918 550" fill="#5a4a3a"/></g>
      </svg>
      <div className={styles.content}>
        <div className={styles.eyebrow}><span className={styles.line}/>Sjøvarseltjeneste for norskekysten<span className={styles.line}/></div>
        <h1 className={styles.h1}>Vet hva sjøen<br/>gjør i <em>morgen</em></h1>
        <p className={styles.sub}>Daglig bølge- og værvarsel direkte på SMS — skreddersydd for din kystlokasjon. Enkelt, pålitelig, norsk.</p>
        <div className={styles.actions}>
          <a href="/registrer" className={styles.btnPrimary}>Start gratis prøveperiode</a>
          <a href="#hvordan" className={styles.btnGhost}>Se hvordan det fungerer →</a>
        </div>
      </div>
      <div className={styles.smsFloat} style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        <div className={styles.smsHeader}><div className={styles.smsDot}/><span className={styles.smsLabel}>Bølgevarsel · 07:30</span></div>
        <div className={styles.smsBody}>
          <div className={styles.smsRow}>🌊 <strong>{loc.name} – {loc.date}</strong></div>
          <div className={styles.smsRow}>⛅ Vær: {loc.vær}</div>
          <div className={styles.smsRow}>💨 Vind: {loc.vind}</div>
          <div className={styles.smsRow}>🌊 Bølger: {loc.bølger}</div>
          <div className={styles.smsRow}>✅ {loc.status}</div>
          <span className={styles.smsTag}>Levert kl. 07:30</span>
        </div>
      </div>
    </section>
  )
}
