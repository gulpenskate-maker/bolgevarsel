export const dynamic = 'force-dynamic'

export default function MinSide() {
  return (
    <div style={{minHeight:'100vh',background:'#e8f4f8',fontFamily:'DM Sans, sans-serif'}}>
      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:680,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>bølge<span style={{color:'#4da8cc'}}>varsel</span></a>
          <div id="navRight"></div>
        </div>
      </nav>

      <div style={{maxWidth:640,margin:'0 auto',padding:'3rem 1.5rem'}} id="main">
        <div style={{textAlign:'center',padding:'3rem'}}>
          <p style={{color:'#6b8fa3'}}>Laster inn...</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html:`
const main = document.getElementById('main')
const navRight = document.getElementById('navRight')

// Styles
const inp = 'width:100%;padding:0.75rem 1rem;border-radius:100px;border:1.5px solid rgba(10,42,61,0.12);background:#f8fbfc;font-size:0.9rem;color:#0a2a3d;outline:none;font-family:inherit;box-sizing:border-box'
const card = 'background:white;border-radius:20px;padding:1.5rem;border:1px solid rgba(10,42,61,0.07);margin-bottom:1.2rem;box-shadow:0 2px 12px rgba(10,42,61,0.06)'
const btnP = 'background:#0a2a3d;color:white;padding:0.7rem 1.2rem;border-radius:100px;border:none;cursor:pointer;font-size:0.88rem;font-weight:500'
const btnD = 'background:#fee2e2;color:#ef4444;padding:0.5rem 0.9rem;border-radius:100px;border:none;cursor:pointer;font-size:0.8rem;font-weight:500'
const btnG = 'background:#f0f8fc;color:#0a2a3d;padding:0.5rem 0.9rem;border-radius:100px;border:none;cursor:pointer;font-size:0.8rem;font-weight:500'
const sTitle = 'font-family:serif;font-size:1.1rem;font-weight:400;color:#0a2a3d;margin:0 0 1rem;padding-bottom:0.6rem;border-bottom:1px solid rgba(10,42,61,0.07)'

let sub = null, locs = [], recs = [], locTimer = null, locSugg = []

async function init() {
  const saved = localStorage.getItem('bv_email')
  if (!saved) { showLogin(); return }
  try {
    const r = await fetch('/api/min-side?email=' + encodeURIComponent(saved))
    const d = await r.json()
    if (d.subscriber) { sub=d.subscriber; locs=d.locations||[]; recs=d.recipients||[]; showDash() }
    else { localStorage.removeItem('bv_email'); showLogin() }
  } catch { showLogin() }
}

function showLogin() {
  main.innerHTML = \`
    <div style="max-width:400px;margin:0 auto;padding:3rem 0;text-align:center">
      <h1 style="font-family:serif;font-size:2rem;font-weight:300;color:#0a2a3d;margin-bottom:0.5rem">Min side</h1>
      <p style="color:#6b8fa3;margin-bottom:2rem">Logg inn med e-posten du registrerte deg med</p>
      <div style="display:flex;flex-direction:column;gap:0.7rem">
        <input id="epost" type="email" placeholder="din@epost.no" style="\${inp}" />
        <button id="loggInn" style="\${btnP};width:100%;padding:0.9rem">Logg inn →</button>
        <div id="loginFeil" style="color:#ef4444;font-size:0.85rem"></div>
      </div>
    </div>\`
  document.getElementById('loggInn').onclick = async () => {
    const e = document.getElementById('epost').value.trim()
    if (!e) return
    document.getElementById('loggInn').textContent = 'Søker...'
    const r = await fetch('/api/min-side?email=' + encodeURIComponent(e))
    const d = await r.json()
    if (d.subscriber) { sub=d.subscriber; locs=d.locations||[]; recs=d.recipients||[]; localStorage.setItem('bv_email',e); showDash() }
    else { document.getElementById('loginFeil').textContent = 'Ingen konto funnet.'; document.getElementById('loggInn').textContent = 'Logg inn →' }
  }
  document.getElementById('epost').onkeydown = e => e.key==='Enter' && document.getElementById('loggInn').click()
}
      `}}/>

      <script dangerouslySetInnerHTML={{__html:`
const planLabel = {basis:'Basis',familie:'Familie',pro:'Pro'}
const planColor = {basis:'#e8f4f8',familie:'#dbeafe',pro:'#fef3c7'}
const planText = {basis:'#0a2a3d',familie:'#1d4ed8',pro:'#92400e'}

function showDash() {
  const badge = \`<span style="background:\${planColor[sub.plan]};color:\${planText[sub.plan]};padding:3px 10px;border-radius:100px;font-size:0.78rem;font-weight:500">\${planLabel[sub.plan]} 🟢</span>\`
  navRight.innerHTML = badge + \` <button onclick="loggUt()" style="background:transparent;border:none;color:rgba(10,42,61,0.4);cursor:pointer;font-size:0.8rem;margin-left:8px">Logg ut</button>\`
  renderAll()
}

function loggUt() { localStorage.removeItem('bv_email'); sub=null; locs=[]; recs=[]; navRight.innerHTML=''; showLogin() }

function renderAll() {
  main.innerHTML = \`
    <div style="margin-bottom:1.5rem">
      <h1 style="font-family:serif;font-size:1.8rem;font-weight:300;color:#0a2a3d;margin:0">Hei! 👋</h1>
      <p style="color:#6b8fa3;margin:4px 0 0">\${sub.email}</p>
    </div>
    <div style="\${card}" id="locCard">
      <h2 style="\${sTitle}">🗺️ Mine lokasjoner</h2>
      <div id="locList"></div>
      <div style="position:relative;margin-bottom:0.6rem">
        <input id="locSok" placeholder="Søk etter sted langs kysten..." autocomplete="off" style="\${inp}" />
        <span id="locOk" style="display:none;position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:0.72rem;color:#22c55e;font-weight:500">✓ funnet</span>
        <div id="locDD" style="display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:white;border-radius:12px;box-shadow:0 8px 24px rgba(10,42,61,0.12);border:1px solid rgba(10,42,61,0.08);overflow:hidden;z-index:999"></div>
      </div>
      <button id="locLeggTil" disabled style="\${btnP};width:100%;padding:0.85rem;opacity:0.4">Søk etter sted for å legge til</button>
    </div>
    <div style="\${card}">
      <h2 style="\${sTitle}">📱 Mine mottakere</h2>
      <div id="recList"></div>
      \${locs.length>0 ? \`
        <div style="display:flex;flex-direction:column;gap:0.6rem">
          <select id="recLoc" style="\${inp}">
            <option value="">Velg lokasjon for varselet</option>
            \${locs.map(l=>\`<option value="\${l.id}">\${l.name}</option>\`).join('')}
          </select>
          <input id="recNavn" placeholder="Navn på mottaker (valgfritt)" style="\${inp}" />
          <input id="recTlf" placeholder="Telefonnummer (+4799...)" style="\${inp}" />
          <button onclick="leggTilMottaker()" style="\${btnP};width:100%;padding:0.85rem">+ Legg til mottaker</button>
        </div>\` : '<p style="color:#6b8fa3;font-size:0.85rem">Legg til en lokasjon først.</p>'}
    </div>
    <div style="\${card}">
      <h2 style="\${sTitle}">⚙️ Min konto</h2>
      <div style="display:flex;flex-direction:column;gap:0.6rem">
        <div style="padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px">
          <div style="font-size:0.75rem;color:#6b8fa3;margin-bottom:2px">E-postadresse</div>
          <div style="font-weight:500;color:#0a2a3d">\${sub.email}</div>
        </div>
        <div style="padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px">
          <div style="font-size:0.75rem;color:#6b8fa3;margin-bottom:2px">Abonnement</div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-weight:500;color:#0a2a3d">\${planLabel[sub.plan]}</span>
            <span style="background:\${sub.status==='active'?'#dcfce7':'#f1f5f9'};color:\${sub.status==='active'?'#16a34a':'#64748b'};padding:2px 8px;border-radius:100px;font-size:0.75rem">\${sub.status==='active'?'Aktivt':'Inaktivt'}</span>
          </div>
        </div>
        <p style="font-size:0.8rem;color:#6b8fa3;padding:0 0.5rem">Kontakt oss på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> for endringer</p>
      </div>
    </div>\`
  renderLocs(); renderRecs(); setupLocSok()
}
      `}}/>

      <script dangerouslySetInnerHTML={{__html:`
function renderLocs() {
  const el = document.getElementById('locList')
  if (!locs.length) { el.innerHTML='<p style="color:#6b8fa3;font-size:0.9rem;margin-bottom:1rem">Ingen lokasjoner ennå.</p>'; return }
  el.innerHTML = locs.map(l=>\`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px;margin-bottom:0.6rem">
      <div>
        <div style="font-weight:500;color:#0a2a3d">\${l.name}</div>
        <div style="font-size:0.75rem;color:#6b8fa3">\${parseFloat(l.lat).toFixed(4)}°N, \${parseFloat(l.lon).toFixed(4)}°Ø</div>
      </div>
      <button onclick="slettLok('\${l.id}')" style="\${btnD}">🗑 Slett</button>
    </div>\`).join('')
}

function renderRecs() {
  const el = document.getElementById('recList')
  if (!el) return
  if (!recs.length) { el.innerHTML='<p style="color:#6b8fa3;font-size:0.9rem;margin-bottom:1rem">Ingen mottakere ennå.</p>'; return }
  el.innerHTML = recs.map(r=>\`
    <div id="rec-\${r.id}" style="padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px;margin-bottom:0.6rem">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:500;color:#0a2a3d">\${r.name||r.phone}</div>
          <div style="font-size:0.75rem;color:#6b8fa3;display:flex;align-items:center;gap:6px">
            \${r.name?r.phone+' · ':''}
            \${locs.find(l=>l.id===r.location_id)?.name||''}
            <span style="background:\${r.active?'#dcfce7':'#f1f5f9'};color:\${r.active?'#16a34a':'#64748b'};padding:1px 7px;border-radius:100px;font-size:0.72rem">\${r.active?'Aktiv':'Pauset'}</span>
          </div>
        </div>
        <div style="display:flex;gap:0.4rem">
          <button onclick="toggleMottaker('\${r.id}',\${!r.active})" style="\${btnG}">\${r.active?'⏸':'▶'}</button>
          <button onclick="redigerMottaker('\${r.id}')" style="\${btnG}">✏️</button>
          <button onclick="slettMottaker('\${r.id}')" style="\${btnD}">🗑</button>
        </div>
      </div>
    </div>\`).join('')
}

async function slettLok(id) {
  if (!confirm('Slett lokasjon og alle tilknyttede mottakere?')) return
  await fetch('/api/min-side/location/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,subscriber_id:sub.id})})
  locs=locs.filter(l=>l.id!==id); recs=recs.filter(r=>r.location_id!==id); renderAll()
}

async function leggTilMottaker() {
  const loc = document.getElementById('recLoc').value
  const navn = document.getElementById('recNavn').value
  const tlf = document.getElementById('recTlf').value
  if (!loc||!tlf) return
  const r = await fetch('/api/min-side/recipient',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub.id,location_id:loc,phone:tlf,name:navn})})
  const d = await r.json()
  if (d.recipient) { recs.push(d.recipient); renderAll() }
}

async function slettMottaker(id) {
  if (!confirm('Slett mottaker?')) return
  await fetch('/api/min-side/recipient/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,subscriber_id:sub.id})})
  recs=recs.filter(r=>r.id!==id); renderRecs()
}

async function toggleMottaker(id, active) {
  const r = await fetch('/api/min-side/recipient/update',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,subscriber_id:sub.id,active})})
  const d = await r.json()
  if (d.recipient) { recs=recs.map(r=>r.id===id?d.recipient:r); renderRecs() }
}

function redigerMottaker(id) {
  const r = recs.find(x=>x.id===id)
  const el = document.getElementById('rec-'+id)
  el.innerHTML = \`
    <div style="font-size:0.78rem;color:#6b8fa3;margin-bottom:6px">✏️ Rediger mottaker</div>
    <input id="eNavn-\${id}" value="\${r.name||''}" placeholder="Navn" style="\${inp};margin-bottom:6px" />
    <input id="eTlf-\${id}" value="\${r.phone}" placeholder="Telefon" style="\${inp};margin-bottom:8px" />
    <div style="display:flex;gap:0.5rem">
      <button onclick="lagreRedigert('\${id}')" style="\${btnP};flex:1;padding:0.7rem">💾 Lagre</button>
      <button onclick="renderRecs()" style="\${btnG};padding:0.7rem 1rem">Avbryt</button>
    </div>\`
}

async function lagreRedigert(id) {
  const navn = document.getElementById('eNavn-'+id).value
  const tlf = document.getElementById('eTlf-'+id).value
  const r = await fetch('/api/min-side/recipient/update',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,subscriber_id:sub.id,phone:tlf,name:navn})})
  const d = await r.json()
  if (d.recipient) { recs=recs.map(r=>r.id===id?d.recipient:r); renderRecs() }
}
      `}}/>

      <script dangerouslySetInnerHTML={{__html:`
let locValgt = null

function setupLocSok() {
  const inp2 = document.getElementById('locSok')
  const dd = document.getElementById('locDD')
  const btn = document.getElementById('locLeggTil')
  if (!inp2) return

  inp2.oninput = () => {
    locValgt = null; document.getElementById('locOk').style.display='none'
    btn.disabled=true; btn.style.opacity='0.4'; btn.textContent='Søk etter sted for å legge til'
    clearTimeout(locTimer)
    if (inp2.value.length<2){dd.style.display='none';return}
    locTimer = setTimeout(async()=>{
      const r = await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(inp2.value)+'&count=6&format=json')
      const d = await r.json()
      locSugg = (d.results||[]).filter(x=>x.country_code==='NO').slice(0,5)
      if (!locSugg.length){dd.style.display='none';return}
      dd.innerHTML = locSugg.map((s,i)=>\`
        <div data-i="\${i}" style="padding:9px 14px;cursor:pointer;border-bottom:\${i<locSugg.length-1?'1px solid #f0f4f8':'none'};font-size:0.88rem;background:white">
          <span style="font-weight:500;color:#0a2a3d">\${s.name}</span>
          \${s.admin1?'<span style="color:#6b8fa3;font-size:0.8rem"> – '+s.admin1.replace(' Fylke','')+'</span>':''}
        </div>\`).join('')
      dd.querySelectorAll('[data-i]').forEach(el=>{
        el.onmousedown=()=>{
          const s=locSugg[+el.dataset.i]
          locValgt={name:s.name+(s.admin1?', '+s.admin1.replace(' Fylke',''):''),lat:s.latitude,lon:s.longitude}
          inp2.value=locValgt.name; dd.style.display='none'
          document.getElementById('locOk').style.display='inline'
          btn.disabled=false; btn.style.opacity='1'; btn.textContent='+ Legg til '+locValgt.name
        }
        el.onmouseenter=()=>el.style.background='#f0f8fc'
        el.onmouseleave=()=>el.style.background='white'
      })
      dd.style.display='block'
    },300)
  }
  inp2.onblur=()=>setTimeout(()=>dd.style.display='none',200)
  inp2.onfocus=()=>locSugg.length>0&&(dd.style.display='block')

  btn.onclick = async() => {
    if (!locValgt) return
    const r = await fetch('/api/min-side/location',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub.id,name:locValgt.name,lat:locValgt.lat,lon:locValgt.lon})})
    const d = await r.json()
    if (d.location) { locs.push(d.location); locValgt=null; renderAll() }
  }
}

init()
      `}}/>
    </div>
  )
}
