export const dynamic = 'force-dynamic'

export default function MinSide() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:680,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
            bølge<span style={{color:'#4da8cc'}}>varsel</span>
          </a>
          <div id="navRight"></div>
        </div>
      </nav>
      <div style={{maxWidth:640,margin:'0 auto',padding:'3rem 1.5rem'}} id="main">
        <div style={{textAlign:'center',padding:'3rem'}}>
          <p style={{color:'#6b8fa3'}}>Laster inn...</p>
        </div>
      </div>
      <script src="/min-side.js"></script>
    </div>
  )
}
