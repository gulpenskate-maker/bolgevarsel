'use client'
import { useState, useEffect } from 'react'

const cameras = [
  {
    id: 1,
    name: 'Stavanger – Vågen',
    location: 'Rogaland',
    region: 'Sørvest',
    url: 'https://www.bulandet-grendalag.org/webkamera/image.jpg',
    fallback: 'https://images.webcams.travel/webcam/1624974610.jpg',
    link: 'https://www.aftenbladet.no/trafikk/i/mqEEp/webkameraer',
  },
  {
    id: 2,
    name: 'Bulandet – Værlandet ferjekai',
    location: 'Vestland',
    region: 'Vestlandet',
    url: 'https://www.bulandet-grendalag.org/webkamera/image.jpg',
    fallback: null,
    link: 'https://www.bulandet-grendalag.org',
  },
  {
    id: 3,
    name: 'Bergen – Bryggen',
    location: 'Vestland',
    region: 'Vestlandet',
    url: 'https://images.webcams.travel/webcam/1573635603.jpg',
    fallback: 'https://images.webcams.travel/preview/1573635603.jpg',
    link: 'https://www.skylinewebcams.com/en/webcam/norge/vestland/bergen/bryggen.html',
  },
  {
    id: 4,
    name: 'Ålesund – Havna',
    location: 'Møre og Romsdal',
    region: 'Vestlandet',
    url: 'https://images.webcams.travel/webcam/1461405756.jpg',
    fallback: 'https://images.webcams.travel/preview/1461405756.jpg',
    link: 'https://www.skylinewebcams.com/en/webcam/norge/more-og-romsdal/alesund/port.html',
  },
  {
    id: 5,
    name: 'Bodø – Havna',
    location: 'Nordland',
    region: 'Nord-Norge',
    url: 'https://images.webcams.travel/webcam/1657030441.jpg',
    fallback: 'https://images.webcams.travel/preview/1657030441.jpg',
    link: 'https://www.skylinewebcams.com/en/webcam/norge/nordland/bodo/harbour.html',
  },
  {
    id: 6,
    name: 'Tromsø – Sentrum',
    location: 'Troms',
    region: 'Nord-Norge',
    url: 'https://images.webcams.travel/webcam/1373344789.jpg',
    fallback: 'https://images.webcams.travel/preview/1373344789.jpg',
    link: 'https://www.skylinewebcams.com/en/webcam/norge/troms/tromso/sentrum.html',
  },
]

function CameraCard({ cam }: { cam: typeof cameras[0] }) {
  const [src, setSrc] = useState(`/api/camera-proxy?url=${encodeURIComponent(cam.url)}&t=${Date.now()}`)
  const [refreshed, setRefreshed] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshed(r => r + 1)
      setSrc(`/api/camera-proxy?url=${encodeURIComponent(cam.url)}&t=${Date.now()}`)
      setError(false)
    }, 60000)
    return () => clearInterval(interval)
  }, [cam.url])

  return (
    <div style={{background:'white',borderRadius:20,overflow:'hidden',border:'1px solid rgba(10,42,61,0.07)',boxShadow:'0 2px 8px rgba(10,42,61,0.06)'}}>
      <div style={{position:'relative',width:'100%',paddingBottom:'62%',background:'#0a2a3d',overflow:'hidden'}}>
        {!error ? (
          <img
            src={src}
            alt={cam.name}
            onError={() => {
              if (cam.fallback && !src.includes('fallback')) {
                setSrc(`/api/camera-proxy?url=${encodeURIComponent(cam.fallback)}&t=${Date.now()}`)
              } else {
                setError(true)
              }
            }}
            style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}}
          />
        ) : (
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.4)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>🌊</div>
            <div style={{fontSize:'0.8rem'}}>Kamera ikke tilgjengelig</div>
          </div>
        )}
        <div style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.5)',borderRadius:100,padding:'3px 8px',fontSize:'0.65rem',color:'rgba(255,255,255,0.8)',display:'flex',alignItems:'center',gap:4}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}></span>
          LIVE
        </div>
      </div>
      <div style={{padding:'0.9rem 1.1rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:500,color:'#0a2a3d',fontSize:'0.95rem'}}>{cam.name}</div>
          <div style={{fontSize:'0.75rem',color:'#6b8fa3',marginTop:'0.1rem'}}>{cam.location}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{background:'#e8f4f8',color:'#2c4a5e',fontSize:'0.68rem',fontWeight:500,padding:'0.2rem 0.6rem',borderRadius:'100px'}}>{cam.region}</span>
          <a href={cam.link} target="_blank" rel="noopener noreferrer" style={{color:'#4da8cc',fontSize:'0.75rem',textDecoration:'none'}}>↗</a>
        </div>
      </div>
    </div>
  )
}

export default function Sjokamera() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('nb-NO', {hour:'2-digit',minute:'2-digit'}))
    update()
    const i = setInterval(update, 10000)
    return () => clearInterval(i)
  }, [])

  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2.5rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.92)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:1200,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:'100px',textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'3rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <span style={{fontSize:'0.75rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',color:'#4da8cc',display:'block',marginBottom:'0.8rem'}}>Live kameraer</span>
          <h1 style={{fontFamily:'serif',fontSize:'clamp(2rem,4vw,3rem)',fontWeight:300,color:'#0a2a3d',letterSpacing:'-0.02em',marginBottom:'1rem'}}>Se sjøen live<br/>langs norskekysten</h1>
          <p style={{color:'#6b8fa3',fontSize:'0.9rem'}}>Oppdateres automatisk hvert minutt · {time && `Sist oppdatert ${time}`}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'1.5rem'}}>
          {cameras.map(cam => <CameraCard key={cam.id} cam={cam} />)}
        </div>

        <div style={{textAlign:'center',marginTop:'4rem',background:'#0a2a3d',borderRadius:24,padding:'3rem 2rem'}}>
          <h2 style={{fontFamily:'serif',fontSize:'1.8rem',fontWeight:300,color:'white',marginBottom:'0.8rem'}}>Vil du ha daglig bølgevarsel?</h2>
          <p style={{color:'rgba(255,255,255,0.6)',marginBottom:'1.5rem'}}>Motta daglig SMS kl. 07:30 med bølgehøyde, vind og vurdering</p>
          <a href="/registrer" style={{display:'inline-block',background:'#4da8cc',color:'white',padding:'0.85rem 2rem',borderRadius:'100px',textDecoration:'none',fontWeight:500}}>Start gratis prøveperiode →</a>
        </div>
      </div>
    </div>
  )
}
