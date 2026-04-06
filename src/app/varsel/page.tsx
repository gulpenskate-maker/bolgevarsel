import VarselKlient from './VarselKlient'

export default function VarselPage() {
  return (
    <>
      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:640,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'Georgia, serif',fontSize:'1.3rem',fontWeight:400,color:'#0a2a3d',textDecoration:'none'}}>
            <svg width="180" height="30" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 22 Q10 14 16 22 Q22 30 28 22 Q34 14 40 22" stroke="#0a2a3d" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M6 31 Q11 26 16 31 Q21 36 26 31 Q31 26 36 31" stroke="#1a6080" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
              <text x="52" y="30" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="23" fontWeight="600" fill="#0a2a3d" letterSpacing="-0.8">bølgevarsel<tspan fill="#1a6080" fontWeight="400">.no</tspan></text>
            </svg>
          </a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:100,textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>
      <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
        <VarselKlient />
      </div>
    </>
  )
}
