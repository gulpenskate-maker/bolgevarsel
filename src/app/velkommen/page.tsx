export const dynamic = 'force-dynamic'

export default function Velkommen() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)'}}>
        <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
          bølge<span style={{color:'#4da8cc'}}>varsel</span>
        </a>
      </nav>
      <div style={{maxWidth:520,margin:'0 auto',padding:'6rem 1.5rem',textAlign:'center'}}>
        <div style={{fontSize:'4rem',marginBottom:'1.5rem'}}>🌊</div>
        <h1 style={{fontFamily:'serif',fontSize:'2.5rem',fontWeight:300,color:'#0a2a3d',marginBottom:'1rem'}}>Velkommen om bord!</h1>
        <p style={{color:'#2c4a5e',fontSize:'1.1rem',lineHeight:1.7,marginBottom:'2rem'}}>
          Abonnementet ditt er aktivt. Du mottar nå daglig bølgevarsel kl. 07:30.
        </p>
        <a href="/min-side" style={{display:'inline-block',background:'#0a2a3d',color:'white',padding:'1rem 2rem',borderRadius:'100px',textDecoration:'none',fontWeight:500}}>
          Sett opp din lokasjon og mottakere →
        </a>
      </div>
    </div>
  )
}
