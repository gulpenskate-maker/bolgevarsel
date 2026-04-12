'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import styles from './ForWho.module.css'

const personas = [
  {
    img: '/images/familie-ny.jpg',
    imgAlt: 'Familie med barn i trebåt på norsk kyst',
    tag: 'For familier med hytte og båt',
    tittel: 'Vet du om det er trygt — før ungene er i redningsvesten?',
    beskrivelse: 'Bølgevarsel sender deg rapporten mens du lager frokost. Bølgehøyde, vind, sjøtemperatur og en klar anbefaling — tilpasset barn og båt. Du bestemmer. Med fakta.',
    datapunkter: [
      { ikon: '🌊', tekst: 'Bølgehøyde og vindstyrke time for time' },
      { ikon: '🌡️', tekst: 'Sjøtemperatur — er det for kaldt for bading?' },
      { ikon: '🌧️', tekst: 'Nedbørsvarsel — pakk regntøy eller shorts?' },
      { ikon: '🚨', tekst: 'Kritisk farevarsel til hele familien på SMS' },
    ],
    sitat: '"Vi fikk varselet kl. 07:00. Innen vi hadde spist frokost visste vi at Tånes var perfekt — og ungene lå allerede i båten."',
  },
  {
    img: '/images/baateier-ny.jpg',
    imgAlt: 'Båteier på brygge ved naust med telefon',
    tag: 'For båteiere og hytteeiere',
    tittel: 'Finn den ene gode dagen — ikke håp på at helgen holder',
    beskrivelse: 'Rapportgeneratoren viser deg hele uken frem i tid. AI-en analyserer hvilken dag som er best for din tur og hvorfor. Ikke mer synsing — én tydelig anbefaling.',
    datapunkter: [
      { ikon: '📅', tekst: '7-dagers rapport — finn beste dag i uken' },
      { ikon: '💨', tekst: 'Vindkast og Beaufort-skala for sikker navigasjon' },
      { ikon: '🌅', tekst: 'Soloppgang og solnedgang — planlegg turen' },
      { ikon: '🤖', tekst: 'AI-oppsummering: "Tirsdag er klart best denne uken"' },
    ],
    sitat: '"Jeg trengte ikke lenger å tolke symboler fra fem ulike tjenester. Bølgevarsel sa bare: dra tirsdag."',
  },
  {
    img: '/images/fisker-ny.jpg',
    imgAlt: 'Erfaren fisker på båt i tidlig morgenblått lys',
    tag: 'For fiskere',
    tittel: 'Opp klokken fem — men bare når det faktisk er verdt det',
    beskrivelse: 'God fisk henger ikke i kalenderen — den henger i forholdene. Bølgevarsel gir deg fiskerens vurdering: bølgehøyde, vindstyrke og sjøtemperatur rett på telefonen.',
    datapunkter: [
      { ikon: '🌊', tekst: 'Bølgehøyde og periode — når er sjøen flat nok?' },
      { ikon: '💨', tekst: 'Vindstyrke og retning — trygt å legge ut?' },
      { ikon: '🌡️', tekst: 'Sjøtemperatur — aktivitetsnivå hos fisken' },
      { ikon: '⏰', tekst: 'SMS kl. 04:00 — vet du svaret før alarmen ringer' },
    ],
    sitat: '"Jeg satte rapporten til 04:30. Tre av fire ganger er jeg tilbake i senga. Men når det er bra — da er jeg ute."',
  },
  {
    img: '/images/surfer-ny.jpg',
    imgAlt: 'Surfer på norsk strandbreak med snødekte fjell',
    tag: 'For surfere og aktive på vannet',
    tittel: 'Periode, retning og offshore-vind — ikke bare bølgehøyde',
    beskrivelse: '5 sekunder periode og onshore vind? Da er det ikke verdt det. Bølgevarsel vet det — og sier det rett ut. AI-oppsummeringen er skrevet av en som faktisk surfer.',
    datapunkter: [
      { ikon: '📐', tekst: 'Bølgeperiode — choppy eller god swell?' },
      { ikon: '🧭', tekst: 'Offshore vs. onshore — vinden som ødelegger bølgene' },
      { ikon: '🤿', tekst: 'Drakt-anbefaling basert på sjøtemperatur' },
      { ikon: '🏄', tekst: 'Profilspesifikk vurdering: surfer, kiter, kajakk' },
    ],
    sitat: '"Endelig en tjeneste som sier «5s periode og onshore — ikke verdt det» i stedet for bare å vise høyde og vind."',
  },
  {
    img: '/images/seiler-ny.jpg',
    imgAlt: 'Par seiler i norsk fjord med dramatiske fjell',
    tag: 'For seilere',
    tittel: 'Riktig seiloppsett — allerede på bryggekanten',
    beskrivelse: 'Storseil og spinnaker, eller reif seilet? Bølgevarsel gir deg seilerens vurdering basert på vindstyrke, vindretning og bølgeforhold — skreddersydd din rute.',
    datapunkter: [
      { ikon: '🌬️', tekst: 'Vind 6–12 m/s — ideell seilvindu' },
      { ikon: '⛵', tekst: 'Seiloppsett-anbefaling: spinnaker eller reif?' },
      { ikon: '🗺️', tekst: 'Opptil 5 lokasjoner — følg ruten langs kysten' },
      { ikon: '📆', tekst: 'Flerdag-analyse — planlegg kryssingen' },
    ],
    sitat: '"Vi seiler fra Stavanger til Kristiansand hvert år. Nå sjekker vi Bølgevarsel for hvert stoppested underveis."',
  },
  {
    img: '/images/kajakk-ny.jpg',
    imgAlt: 'Havkajakk-padler i norsk sund mellom dramatiske klipper',
    tag: 'For kajakk og havpadlere',
    tittel: 'Tidevannsstrøm og vindretning — kritisk for paddlere',
    beskrivelse: 'Over 8 m/s og du bør bli på land. Offshore vind driver deg ut. Bølgevarsel gir deg padlerens vurdering — med fokus på sikkerhet og de riktige parameterne.',
    datapunkter: [
      { ikon: '💨', tekst: 'Vindstyrke og retning — offshore er farlig' },
      { ikon: '🌊', tekst: 'Bølgehøyde under 0.7m — padlerparadis' },
      { ikon: '🔴', tekst: 'Farevarsel på SMS ved kuling — alltid på' },
      { ikon: '🧭', tekst: 'Vurdering: trygt for erfarne / kun for eksperter' },
    ],
    sitat: '"Som instruktør tar jeg aldri gruppen ut uten å ha sjekket Bølgevarsel. Det er det eneste varselet som forstår kajakk."',
  },
  {
    img: '/images/fridykker-ny.jpg',
    imgAlt: 'Fridykker under vann i norsk kystfarvann med tare',
    tag: 'For fridykkere og snorklere',
    tittel: 'Sikt, strøm og temperatur — alt du trenger før du dykker',
    beskrivelse: 'Bølger over 0.4m gir dårlig sikt og overflatestrøm. 6°C krever tørdrakt. Bølgevarsel gir deg dykkervurderingen — ærlig og presis.',
    datapunkter: [
      { ikon: '👁️', tekst: 'Bølgehøyde og vind påvirker sikt direkte' },
      { ikon: '🌡️', tekst: 'Sjøtemperatur — hvilken drakt trenger du?' },
      { ikon: '🌊', tekst: 'Strøm fra tidevannet — farlig for fridykkere' },
      { ikon: '🤿', tekst: 'Drakt-anbefaling: 7mm, 5mm eller tørdrakt' },
    ],
    sitat: '"Bølgevarsel er det første jeg åpner om morgenen. Sikt og strøm avgjør alt — og de to tingene får jeg rett der."',
  },
]

const CARD_WIDTH = 340 + 20 // kortbredde + gap

export default function ForWho() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function scrollTo(index: number) {
    const el = sliderRef.current
    if (!el) return
    el.scrollTo({ left: index * CARD_WIDTH, behavior: 'smooth' })
    setActive(index)
  }

  function prev() { scrollTo(Math.max(0, active - 1)) }
  function next() { scrollTo(Math.min(personas.length - 1, active + 1)) }

  function onScroll() {
    const el = sliderRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / CARD_WIDTH)
    setActive(idx)
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>Hvem er det for?</span>
          <h2 className={styles.title}>Laget for alle som<br/>bryr seg om sjøen</h2>
          <p className={styles.subtitle}>Samme tjeneste — tilpasset din aktivitet. Bølgevarsel forstår hva som faktisk betyr noe for deg på sjøen.</p>
        </div>

        <div className={styles.sliderWrap}>
          <div className={styles.slider} ref={sliderRef} onScroll={onScroll}>
            {personas.map((p) => (
              <div key={p.tittel} className={styles.card}>
                <div className={styles.imgWrap}>
                  <Image src={p.img} alt={p.imgAlt} fill className={styles.img} style={{ objectFit: 'cover' }} />
                  <div className={styles.imgOverlay} />
                  <span className={styles.tagOverlay}>{p.tag}</span>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{p.tittel}</h3>
                  <p className={styles.cardText}>{p.beskrivelse}</p>
                  <div className={styles.datapunkter}>
                    {p.datapunkter.map((d, i) => (
                      <div key={i} className={styles.datapunkt}>
                        <span className={styles.datapunktIkon}>{d.ikon}</span>
                        <span className={styles.datapunktTekst}>{d.tekst}</span>
                      </div>
                    ))}
                  </div>
                  <blockquote className={styles.sitat}>{p.sitat}</blockquote>
                  <Link href="/registrer" className={styles.cta}>
                    Prøv gratis i 7 dager →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.navRow}>
          <div className={styles.dots}>
            {personas.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} onClick={() => scrollTo(i)} aria-label={`Gå til kort ${i + 1}`} />
            ))}
          </div>
          <div className={styles.arrows}>
            <button className={styles.arrow} onClick={prev} disabled={active === 0} aria-label="Forrige">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className={styles.arrow} onClick={next} disabled={active === personas.length - 1} aria-label="Neste">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
