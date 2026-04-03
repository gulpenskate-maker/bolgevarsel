export const dynamic = 'force-dynamic'

const cameras = [
  {
    id: 1,
    name: 'Stavanger havn',
    location: 'Rogaland',
    region: 'Sørvest',
    embed: 'https://www.windy.com/webcams/embed/1624974610?pano',
    thumb: 'https://images.webcams.travel/preview/1624974610.jpg',
  },
  {
    id: 2,
    name: 'Mandal',
    location: 'Agder',
    region: 'Sørlandet',
    embed: 'https://www.windy.com/webcams/embed/1511942461?pano',
    thumb: 'https://images.webcams.travel/preview/1511942461.jpg',
  },
  {
    id: 3,
    name: 'Bergen Bryggen',
    location: 'Vestland',
    region: 'Vestlandet',
    embed: 'https://www.windy.com/webcams/embed/1573635603?pano',
    thumb: 'https://images.webcams.travel/preview/1573635603.jpg',
  },
  {
    id: 4,
    name: 'Ålesund havn',
    location: 'Møre og Romsdal',
    region: 'Vestlandet',
    embed: 'https://www.windy.com/webcams/embed/1461405756?pano',
    thumb: 'https://images.webcams.travel/preview/1461405756.jpg',
  },
  {
    id: 5,
    name: 'Kristiansand',
    location: 'Agder',
    region: 'Sørlandet',
    embed: 'https://www.windy.com/webcams/embed/1533816001?pano',
    thumb: 'https://images.webcams.travel/preview/1533816001.jpg',
  },
  {
    id: 6,
    name: 'Tromsø',
    location: 'Troms',
    region: 'Nord-Norge',
    embed: 'https://www.windy.com/webcams/embed/1373344789?pano',
    thumb: 'https://images.webcams.travel/preview/1373344789.jpg',
  },
]

export default function Sjokamera() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.92)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:1200,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
            bølge<span style={{color:'#4da8cc'}}>varsel</span>
          </a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:'100px',textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'3rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <span style={{fontSize:'0.75rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',color:'#4da8cc',display:'block',marginBottom:'0.8rem'}}>Live kameraer</span>
          <h1 style={{fontFamily:'serif',fontSize:'clamp(2rem,4vw,3rem)',fontWeight:300,color:'#0a2a3d',letterSpacing:'-0.02em',marginBottom:'1rem'}}>
            Se sjøen live<br/>langs norskekysten
          </h1>
          <p style={{color:'#6b8fa3',fontSize:'1rem',maxWidth:520,margin:'0 auto'}}>
            Live webkameraer fra utvalgte havner og kystlokasjoner. Oppdateres kontinuerlig.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:'1.5rem'}}>
          {cameras.map(cam => (
            <div key={cam.id} style={{background:'white',borderRadius:20,overflow:'hidden',border:'1px solid rgba(10,42,61,0.07)',transition:'transform 0.2s, box-shadow 0.2s',boxShadow:'0 2px 8px rgba(10,42,61,0.06)'}}>
              <div style={{position:'relative',width:'100%',paddingBottom:'56.25%',background:'#0a2a3d',overflow:'hidden'}}>
                <iframe
                  src={cam.embed}
                  style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
                  allowFullScreen
                  loading="lazy"
                  title={cam.name}
                />
              </div>
              <div style={{padding:'1rem 1.2rem'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'1rem'}}>{cam.name}</div>
                    <div style={{fontSize:'0.8rem',color:'#6b8fa3',marginTop:'0.15rem'}}>{cam.location}</div>
                  </div>
                  <span style={{background:'#e8f4f8',color:'#0a2a3d',fontSize:'0.7rem',fontWeight:500,padding:'0.25rem 0.7rem',borderRadius:'100px',letterSpacing:'0.05em'}}>{cam.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:'4rem',background:'#0a2a3d',borderRadius:24,padding:'3rem 2rem'}}>
          <h2 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'white',marginBottom:'0.8rem'}}>Vil du ha daglig bølgevarsel?</h2>
          <p style={{color:'rgba(255,255,255,0.6)',marginBottom:'1.5rem'}}>Motta daglig SMS kl. 07:30 med bølgehøyde, vind og vurdering for din kystlokasjon</p>
          <a href="/registrer" style={{display:'inline-block',background:'#4da8cc',color:'white',padding:'0.85rem 2rem',borderRadius:'100px',textDecoration:'none',fontWeight:500,fontSize:'1rem'}}>Start gratis prøveperiode →</a>
        </div>
      </div>

      <footer style={{background:'#071622',color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'2rem',fontSize:'0.82rem',marginTop:'4rem'}}>
        <p>Kamera-feeds levert av <a href="https://windy.com" style={{color:'rgba(255,255,255,0.5)'}} target="_blank" rel="noopener">Windy.com</a> · <strong style={{color:'rgba(255,255,255,0.7)'}}>bølgevarsel.no</strong></p>
      </footer>
    </div>
  )
}
