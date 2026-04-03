export const dynamic = 'force-dynamic'

export default function Personvern() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.9)'}}>
        <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
          bølge<span style={{color:'#4da8cc'}}>varsel</span>
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
