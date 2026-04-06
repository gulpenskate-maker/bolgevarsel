'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

type Suggestion = { name: string; lat: number; lon: number; type: string }
type ValgtLokasjon = { name: string; lat: number; lon: number }

const TYPE_MAP: Record<string,string> = {
  bay:'bukt', beach:'strand', harbour:'havn', marina:'marina',
  island:'øy', islet:'øy', peninsula:'halvøy', cape:'nes',
  fjord:'fjord', cove:'vik', inlet:'vik', strait:'sund',
  lake:'innsjø', river:'elv', nature_reserve:'naturreservat',
  suburb:'bydel', village:'tettsted', hamlet:'tettsted',
  town:'by', city:'by', municipality:'kommune', locality:'sted',
  neighbourhood:'nabolag', water:'vann', wetland:'våtmark',
  administrative:'område',
}
function typeLabel(t: string): string { return TYPE_MAP[t] || '' }

interface Props {
  onAdd: (loc: ValgtLokasjon) => void
  onCancel: () => void
}

export default function LeggTilLokasjon({ onAdd, onCancel }: Props) {
  const [tab, setTab] = useState<'sok' | 'kart'>('sok')
  const [query, setQuery] = useState('')
  const [sugg, setSugg] = useState<Suggestion[]>([])
  const [valgt, setValgt] = useState<ValgtLokasjon | null>(null)
  const [mapPin, setMapPin] = useState<{ lat: number; lon: number } | null>(null)
  const [mapName, setMapName] = useState('')
  const [loading, setLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)
  const marker = useRef<any>(null)
  const timer = useRef<any>(null)

  // Søk med debounce
  useEffect(() => {
    clearTimeout(timer.current)
    if (query.length < 2) { setSugg([]); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/steder?q=${encodeURIComponent(query)}`)
        const data = await r.json()
        setSugg(data)
      } catch { setSugg([]) }
      setLoading(false)
    }, 350)
  }, [query])

  // Init Leaflet kart
  const initMap = useCallback(() => {
    if (leafletMap.current || !mapRef.current) return
    const L = (window as any).L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [59.0, 5.75],
      zoom: 8,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng
      setMapPin({ lat: parseFloat(lat.toFixed(4)), lon: parseFloat(lng.toFixed(4)) })
      if (marker.current) marker.current.setLatLng(e.latlng)
      else {
        marker.current = L.circleMarker(e.latlng, {
          radius: 8, color: '#1a6080', fillColor: '#1a6080', fillOpacity: 0.9, weight: 2.5,
        }).addTo(map)
      }
    })

    leafletMap.current = map
    setTimeout(() => map.invalidateSize(), 100)
  }, [])

  useEffect(() => {
    if (tab !== 'kart') return
    // Last Leaflet dynamisk
    if ((window as any).L) { initMap(); return }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    script.onload = initMap
    document.head.appendChild(script)
  }, [tab, initMap])

  const S = {
    overlay: { position:'fixed' as const, inset:0, background:'rgba(10,42,61,0.35)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' },
    modal: { background:'white', borderRadius:16, width:'100%', maxWidth:480, overflow:'hidden' as const },
    head: { padding:'1.1rem 1.3rem', borderBottom:'1px solid #f0f4f8', display:'flex', alignItems:'center', justifyContent:'space-between' },
    tabs: { display:'flex', borderBottom:'1px solid #f0f4f8' },
    tab: (active: boolean): React.CSSProperties => ({ flex:1, padding:'10px 12px', fontSize:13, textAlign:'center', cursor:'pointer', color: active ? '#1a6080' : '#6b8fa3', borderBottom: active ? '2px solid #1a6080' : '2px solid transparent', fontWeight: active ? 500 : 400, background:'none', border:'none' }),
    body: { padding:'1.1rem 1.3rem' },
    inp: { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(10,42,61,0.12)', fontSize:13, outline:'none', background:'#f8fbfc', color:'#0a2a3d' },
    sugg: { background:'white', border:'1px solid rgba(10,42,61,0.1)', borderRadius:8, marginTop:4, overflow:'hidden' as const },
    suggItem: { padding:'9px 12px', fontSize:13, cursor:'pointer', borderBottom:'1px solid #f8fbfc', display:'flex', justifyContent:'space-between', alignItems:'center' },
    btnPrimary: { background:'#0a2a3d', color:'white', border:'none', borderRadius:8, padding:'10px 16px', fontSize:13, fontWeight:500, cursor:'pointer', width:'100%' },
    btnSecondary: { background:'#f8fbfc', color:'#0a2a3d', border:'1px solid rgba(10,42,61,0.12)', borderRadius:8, padding:'10px 16px', fontSize:13, cursor:'pointer', width:'100%' },
    map: { height:280, borderRadius:8, overflow:'hidden' as const, marginBottom:10, border:'1px solid rgba(10,42,61,0.1)' },
    coord: { background:'#f8fbfc', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#6b8fa3', marginBottom:8, display:'flex', justifyContent:'space-between' },
  }

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.head}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:'#e8f4f8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C5.2 1 3 3.2 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.2 10.8 1 8 1Z" stroke="#1a6080" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                <circle cx="8" cy="6" r="1.8" fill="#1a6080"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'#0a2a3d' }}>Legg til lokasjon</div>
              <div style={{ fontSize:11, color:'#6b8fa3', marginTop:1 }}>Søk eller plasser pin på kart</div>
            </div>
          </div>
          <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', width:28, height:28, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div style={S.tabs}>
          <button style={S.tab(tab==='sok')} onClick={()=>setTab('sok')}>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Søk etter sted
            </span>
          </button>
          <button style={S.tab(tab==='kart')} onClick={()=>setTab('kart')}>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C4.8 1.5 3 3.3 3 5.5C3 8.2 7 12.5 7 12.5C7 12.5 11 8.2 11 5.5C11 3.3 9.2 1.5 7 1.5Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
                <circle cx="7" cy="5.5" r="1.3" fill="currentColor"/>
              </svg>
              Plasser pin på kart
            </span>
          </button>
        </div>

        <div style={S.body}>
          {tab === 'sok' && (<>
            <div style={{ position:'relative', marginBottom:8 }}>
              <div style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.2" stroke="#94a3b8" strokeWidth="1.3"/>
                  <path d="M9.5 9.5L12 12" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                style={{...S.inp, paddingLeft:32}} autoFocus
                placeholder="Søk etter sted langs kysten..."
                value={query}
                onChange={e => { setQuery(e.target.value); setValgt(null) }}
              />
              {loading && <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:11, color:'#6b8fa3' }}>Søker...</div>}
            </div>
            {sugg.length > 0 && !valgt && (
              <div style={S.sugg}>
                {sugg.map((s, i) => (
                  <div key={i} style={{ ...S.suggItem, background: i%2===0 ? 'white' : '#fcfefe' }}
                    onMouseDown={() => { setValgt(s); setQuery(s.name); setSugg([]) }}>
                    <span style={{ color:'#0a2a3d' }}>{s.name}</span>
                    {s.type && typeLabel(s.type) && <span style={{ fontSize:11, color:'#6b8fa3' }}>{typeLabel(s.type)}</span>}
                  </div>
                ))}
              </div>
            )}
            {valgt && (
              <div style={{ background:'#e8f5ed', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#1a7a50', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <span>✓</span>
                <span>{valgt.name} · {valgt.lat.toFixed(4)}°N, {valgt.lon.toFixed(4)}°E</span>
              </div>
            )}
            {!valgt && query.length >= 2 && sugg.length === 0 && !loading && (
              <div style={{ fontSize:12, color:'#6b8fa3', textAlign:'center', padding:'12px 0' }}>
                Ingen treff — prøv kart-fanen for å plassere pin manuelt
              </div>
            )}
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              <button style={{ ...S.btnPrimary, opacity: valgt ? 1 : 0.4 }} disabled={!valgt}
                onClick={() => valgt && onAdd(valgt)}>
                + Legg til lokasjon
              </button>
              <button style={{ ...S.btnSecondary, flex:'0 0 auto', width:'auto', padding:'10px 14px' }} onClick={onCancel}>Avbryt</button>
            </div>
          </>)}

          {tab === 'kart' && (<>
            <div ref={mapRef} style={S.map} />
            <div style={S.coord}>
              <span>Koordinater</span>
              <span style={{ fontWeight:500, color: mapPin ? '#0a2a3d' : '#94a3b8', fontSize:13 }}>
                {mapPin ? `${mapPin.lat}°N · ${mapPin.lon}°E` : 'Klikk på kartet for å plassere pin'}
              </span>
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, color:'#6b8fa3', marginBottom:4 }}>Navn på lokasjon (valgfritt)</div>
              <input style={S.inp} placeholder="F.eks. Kilen, Langenes" value={mapName} onChange={e => setMapName(e.target.value)} />
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ ...S.btnPrimary, opacity: mapPin ? 1 : 0.4 }} disabled={!mapPin}
                onClick={() => mapPin && onAdd({ name: mapName || `${mapPin.lat}°N, ${mapPin.lon}°E`, lat: mapPin.lat, lon: mapPin.lon })}>
                + Legg til lokasjon
              </button>
              <button style={{ ...S.btnSecondary, flex:'0 0 auto', width:'auto', padding:'10px 14px' }} onClick={onCancel}>Avbryt</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  )
}
