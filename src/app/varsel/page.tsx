import VarselKlient from './VarselKlient'

export default function VarselPage() {
  return (
    <>
      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:640,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'Georgia, serif',fontSize:'1.3rem',fontWeight:400,color:'#0a2a3d',textDecoration:'none'}}>
            bølge<span style={{color:'#4da8cc'}}>varsel</span>
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
