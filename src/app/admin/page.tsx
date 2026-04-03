export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <div style={{minHeight:'100vh',background:'#071622',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1rem 2rem',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:'0.8rem'}}>
        <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'white',textDecoration:'none'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
        <span style={{background:'#ef4444',color:'white',padding:'2px 8px',borderRadius:100,fontSize:'0.68rem',fontWeight:600}}>ADMIN</span>
      </nav>
      <div style={{maxWidth:700,margin:'0 auto',padding:'2.5rem 1.5rem'}}>
        <div style={{display:'flex',gap:'0.8rem',marginBottom:'2rem'}}>
          <a href="/admin/farevarsel" style={{background:'#ef4444',color:'white',padding:'0.6rem 1.2rem',borderRadius:100,textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>🚨 Farevarsel</a>
          <a href="/admin/brukere" style={{background:'rgba(255,255,255,0.1)',color:'white',padding:'0.6rem 1.2rem',borderRadius:100,textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>👥 Brukere</a>
        </div>
        <div style={{background:'rgba(255,255,255,0.05)',borderRadius:20,padding:'2rem',border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:'0.8rem'}}>⚙️</div>
          <h1 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'white',marginBottom:'0.5rem'}}>Admin-panel</h1>
          <p style={{color:'rgba(255,255,255,0.4)'}}>Velg en funksjon i menyen over</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html:`
        // Sjekk at admin er logget inn
        const key = sessionStorage.getItem('adminKey')
        if (!key) {
          const k = prompt('Admin-nøkkel:')
          if (k) sessionStorage.setItem('adminKey', k)
          else window.location.href = '/'
        }
      `}} />
    </div>
  )
}
