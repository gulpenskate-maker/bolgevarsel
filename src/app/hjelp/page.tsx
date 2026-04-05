import Link from 'next/link'

const KATEGORIER = [
  {
    slug: 'kom-i-gang',
    tittel: 'Kom i gang',
    ikon: '🚀',
    beskrivelse: 'Alt du trenger for å sette opp ditt første bølgevarsel',
    artikler: [
      { slug: 'hva-er-bolgevarsel', tittel: 'Hva er Bølgevarsel?' },
      { slug: 'velg-plan', tittel: 'Hvilken plan passer for meg?' },
      { slug: 'registrering', tittel: 'Slik registrerer du deg' },
      { slug: 'legg-til-lokasjon', tittel: 'Legg til din kystlokasjon' },
      { slug: 'legg-til-mottakere', tittel: 'Legg til mottakere (barn, ektefelle)' },
    ],
  },
  {
    slug: 'varsler',
    tittel: 'Varsler og rapporter',
    ikon: '🌊',
    beskrivelse: 'Forstå SMS-varslene og e-postrapportene dine',
    artikler: [
      { slug: 'nar-sendes-varsel', tittel: 'Når sendes varselet?' },
      { slug: 'forstå-sms', tittel: 'Forstå SMS-varselet' },
      { slug: 'forstå-epost', tittel: 'Forstå e-postrapporten' },
      { slug: 'farevarsel', tittel: 'Hva er et farevarsel?' },
      { slug: 'pause-sms', tittel: 'Pause eller skru av SMS-varsler' },
    ],
  },
  {
    slug: 'konto',
    tittel: 'Konto og abonnement',
    ikon: '⚙️',
    beskrivelse: 'Administrer kontoen din, bytt plan eller si opp',
    artikler: [
      { slug: 'logg-inn', tittel: 'Slik logger du inn' },
      { slug: 'endre-epost', tittel: 'Endre e-postadresse' },
      { slug: 'bytte-plan', tittel: 'Bytte abonnementsplan' },
      { slug: 'si-opp', tittel: 'Si opp abonnementet' },
      { slug: 'betaling', tittel: 'Betaling og faktura' },
    ],
  },
  {
    slug: 'faq',
    tittel: 'Vanlige spørsmål',
    ikon: '❓',
    beskrivelse: 'Svar på de mest stilte spørsmålene',
    artikler: [
      { slug: 'hvor-noyaktig', tittel: 'Hvor nøyaktig er værdataene?' },
      { slug: 'hvilke-lokasjoner', tittel: 'Hvilke lokasjoner kan jeg velge?' },
      { slug: 'sms-ikke-mottatt', tittel: 'Jeg har ikke mottatt SMS — hva gjør jeg?' },
      { slug: 'flere-lokasjoner', tittel: 'Kan jeg ha flere lokasjoner?' },
      { slug: 'datakilder', tittel: 'Hvilke datakilder bruker dere?' },
    ],
  },
]

export default function HjelpPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', fontFamily:'DM Sans, sans-serif' }}>
      <nav style={{ padding:'1.2rem 2rem', borderBottom:'1px solid rgba(10,42,61,0.08)', background:'rgba(240,244,248,0.95)', position:'sticky' as const, top:0, zIndex:100 }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ fontFamily:'serif', fontSize:'1.3rem', fontWeight:600, color:'#0a2a3d', textDecoration:'none' }}>
            bølge<span style={{color:'#4da8cc'}}>varsel</span>
          </Link>
          <Link href="/min-side" style={{ background:'#0a2a3d', color:'white', padding:'0.5rem 1.2rem', borderRadius:100, textDecoration:'none', fontSize:'0.85rem', fontWeight:500 }}>
            Min side →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#0a2a3d,#1a6080)', padding:'4rem 2rem', textAlign:'center', color:'white' }}>
        <p style={{ margin:'0 0 8px', fontSize:'11px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Hjelpesenter</p>
        <h1 style={{ margin:'0 0 1rem', fontFamily:'serif', fontSize:'2.5rem', fontWeight:300 }}>Hvordan kan vi hjelpe deg?</h1>
        <p style={{ margin:'0 auto 2rem', fontSize:'1.05rem', color:'rgba(255,255,255,0.7)', maxWidth:500 }}>
          Alt du trenger for å komme i gang med daglige sjøvarsler
        </p>
        <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/min-side" style={{ background:'rgba(255,255,255,0.15)', color:'white', padding:'0.6rem 1.4rem', borderRadius:100, textDecoration:'none', fontSize:'0.9rem', border:'1px solid rgba(255,255,255,0.2)' }}>
            📬 Logg inn på Min side
          </Link>
          <a href="mailto:hei@bolgevarsel.no" style={{ background:'rgba(255,255,255,0.15)', color:'white', padding:'0.6rem 1.4rem', borderRadius:100, textDecoration:'none', fontSize:'0.9rem', border:'1px solid rgba(255,255,255,0.2)' }}>
            ✉️ Kontakt oss
          </a>
        </div>
      </div>

      {/* Kategorier */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'3rem 1.5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(380px,1fr))', gap:'1.5rem' }}>
          {KATEGORIER.map(kat => (
            <div key={kat.slug} style={{ background:'white', borderRadius:20, padding:'1.8rem', boxShadow:'0 2px 12px rgba(10,42,61,0.06)', border:'1px solid rgba(10,42,61,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'1.6rem' }}>{kat.ikon}</span>
                <h2 style={{ margin:0, fontFamily:'serif', fontWeight:400, fontSize:'1.2rem', color:'#0a2a3d' }}>{kat.tittel}</h2>
              </div>
              <p style={{ margin:'0 0 1.2rem', fontSize:'0.88rem', color:'#6b8fa3' }}>{kat.beskrivelse}</p>
              <div style={{ display:'flex', flexDirection:'column' as const, gap:'0.1rem' }}>
                {kat.artikler.map(art => (
                  <Link key={art.slug} href={`/hjelp/${kat.slug}/${art.slug}`}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.6rem 0.8rem', borderRadius:10, textDecoration:'none', color:'#334155', fontSize:'0.9rem', transition:'background 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.background='#f0f8fc')}
                    onMouseOut={e => (e.currentTarget.style.background='transparent')}>
                    <span>{art.tittel}</span>
                    <span style={{ color:'#4da8cc', fontSize:'0.8rem' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Kontaktboks */}
        <div style={{ marginTop:'3rem', background:'linear-gradient(135deg,#0a2a3d,#1a6080)', borderRadius:20, padding:'2.5rem', textAlign:'center', color:'white' }}>
          <h2 style={{ margin:'0 0 0.5rem', fontFamily:'serif', fontWeight:300, fontSize:'1.6rem' }}>Fant du ikke svaret?</h2>
          <p style={{ margin:'0 0 1.5rem', color:'rgba(255,255,255,0.7)' }}>Vi svarer raskt på e-post i hverdagene</p>
          <a href="mailto:hei@bolgevarsel.no" style={{ display:'inline-block', background:'white', color:'#0a2a3d', padding:'0.9rem 2rem', borderRadius:100, textDecoration:'none', fontWeight:600, fontSize:'0.95rem' }}>
            Send oss en e-post →
          </a>
        </div>
      </div>
    </div>
  )
}
