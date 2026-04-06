export const dynamic = 'force-dynamic'

export default function Personvern() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.9)'}}>
        <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
          <svg width="180" height="30" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="#0a2a3d" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="#1a6080" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
              <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill="#0a2a3d" letterSpacing="-0.8">bølgevarsel<tspan fill="#1a6080" fontWeight="400">.no</tspan></text>
            </svg>
        </a>
      </nav>
      <div style={{maxWidth:720,margin:'0 auto',padding:'4rem 1.5rem'}}>
        <h1 style={{fontFamily:'serif',fontSize:'2.5rem',fontWeight:300,color:'#0a2a3d',marginBottom:'2rem'}}>Personvern</h1>
        <h2 style={{fontSize:'1.2rem',fontWeight:500,color:'#0a2a3d',marginTop:'2rem',marginBottom:'0.5rem'}}>Hvem er vi</h2>
        <p style={{color:'#2c4a5e',lineHeight:1.7}}>Bølgevarsel.no er en tjeneste drevet av Stå på Pinne AS, Stavanger. Kontakt: hei@bolgevarsel.no</p>
        <h2 style={{fontSize:'1.2rem',fontWeight:500,color:'#0a2a3d',marginTop:'2rem',marginBottom:'0.5rem'}}>Hvilke data samler vi inn</h2>
        <p style={{color:'#2c4a5e',lineHeight:1.7}}>Vi samler inn e-postadresse og telefonnummer(e) du oppgir for SMS-varsler. Betalingsinformasjon håndteres av Stripe — vi lagrer aldri kortdata direkte.</p>
        <h2 style={{fontSize:'1.2rem',fontWeight:500,color:'#0a2a3d',marginTop:'2rem',marginBottom:'0.5rem'}}>Hvordan bruker vi dataene</h2>
        <p style={{color:'#2c4a5e',lineHeight:1.7}}>Dataene brukes utelukkende til å levere daglige bølgevarsler på SMS og administrere abonnementet. Vi selger aldri data til tredjeparter.</p>
        <h2 style={{fontSize:'1.2rem',fontWeight:500,color:'#0a2a3d',marginTop:'2rem',marginBottom:'0.5rem'}}>Dine rettigheter</h2>
        <p style={{color:'#2c4a5e',lineHeight:1.7}}>Du har rett til innsyn, retting og sletting. Send e-post til hei@bolgevarsel.no.</p>
        <h2 style={{fontSize:'1.2rem',fontWeight:500,color:'#0a2a3d',marginTop:'2rem',marginBottom:'0.5rem'}}>Datalagring</h2>
        <p style={{color:'#2c4a5e',lineHeight:1.7}}>Data lagres på Supabase (EU). Betaling via Stripe. SMS via 46elks.</p>
        <p style={{color:'#6b8fa3',marginTop:'3rem',fontSize:'0.9rem'}}>Sist oppdatert: april 2026</p>
      </div>
    </div>
  )
}
