export const dynamic = 'force-dynamic'

export default function Velkommen() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)'}}>
        <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
          bølge<span style={{color:'#4da8cc'}}>varsel</span>
        </a>
      </nav>
      <div style={{maxWidth:560,margin:'0 auto',padding:'4rem 1.5rem',textAlign:'center'}}>
        <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🌊</div>
        <h1 style={{fontFamily:'serif',fontSize:'2.2rem',fontWeight:300,color:'#0a2a3d',marginBottom:'0.6rem'}}>
          Velkommen om bord!
        </h1>
        <p style={{color:'#4a6a7a',fontSize:'1.05rem',lineHeight:1.7,marginBottom:'2.5rem'}}>
          Abonnementet ditt er aktivt og du mottar daglig bølgevarsel kl. 07:30 fra i morgen.
        </p>

        {/* E-post info */}
        <div style={{background:'white',borderRadius:20,padding:'2rem',boxShadow:'0 2px 20px rgba(10,42,61,0.08)',border:'1px solid rgba(10,42,61,0.07)',marginBottom:'1.5rem',textAlign:'left'}}>
          <div style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
            <div style={{fontSize:'2rem',flexShrink:0}}>📬</div>
            <div>
              <h2 style={{margin:'0 0 0.4rem',fontSize:'1.1rem',fontWeight:600,color:'#0a2a3d'}}>Sjekk innboksen din!</h2>
              <p style={{margin:0,color:'#4a6a7a',fontSize:'0.95rem',lineHeight:1.6}}>
                Vi har sendt deg en e-post med en <strong>innloggingslenke</strong> og ordrebekreftelse. Klikk på lenken for å logge inn og sette opp din kystlokasjon og mottakere.
              </p>
            </div>
          </div>
        </div>

        <div style={{background:'white',borderRadius:20,padding:'2rem',boxShadow:'0 2px 20px rgba(10,42,61,0.08)',border:'1px solid rgba(10,42,61,0.07)',marginBottom:'2rem',textAlign:'left'}}>
          <h3 style={{margin:'0 0 1rem',fontSize:'0.85rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.08em'}}>Hva skjer videre?</h3>
          {[
            { ikon:'📬', tekst:'Du mottar en innloggingslenke på e-post — klikk den for å komme til Min side' },
            { ikon:'📍', tekst:'Legg til din kystlokasjon (f.eks. Tånes, Stavanger havn)' },
            { ikon:'📱', tekst:'Legg til telefonnumre som skal motta SMS-varsel' },
            { ikon:'🌊', tekst:'Fra i morgen kl. 07:30 mottar du daglig bølge- og værvarsel' },
          ].map((s, i) => (
            <div key={i} style={{display:'flex',gap:'0.8rem',alignItems:'flex-start',padding:'0.6rem 0',borderTop:i>0?'1px solid #f1f5f9':'none'}}>
              <span style={{fontSize:'1.2rem',flexShrink:0}}>{s.ikon}</span>
              <p style={{margin:0,fontSize:'0.92rem',color:'#334155',lineHeight:1.5}}>{s.tekst}</p>
            </div>
          ))}
        </div>

        <a href="/min-side" style={{display:'inline-block',background:'#0a2a3d',color:'white',padding:'1rem 2.5rem',borderRadius:'100px',textDecoration:'none',fontWeight:600,fontSize:'1rem'}}>
          Gå til Min side →
        </a>
        <p style={{marginTop:'1rem',fontSize:'0.82rem',color:'rgba(10,42,61,0.4)'}}>
          Ikke funnet e-posten? Sjekk søppelpost eller <a href="/min-side" style={{color:'#4da8cc'}}>logg inn med e-postadressen din</a>
        </p>
      </div>
    </div>
  )
}
