export const dynamic = 'force-dynamic'

export default function VarselPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #e8f4f8; font-family: DM Sans, sans-serif; }
        input { flex:1;padding:12px 16px;border-radius:100px;font-size:15px;border:1.5px solid rgba(10,42,61,0.12);background:white;color:#0a2a3d;outline:none;font-family:inherit;box-shadow:0 2px 12px rgba(10,42,61,0.07);width:100% }
        input:focus { border-color: #4da8cc; }
        .sug:hover { background: #f0f8fc; }
      `}</style>

      <nav style={{padding:'1.2rem 2rem',borderBottom:'1px solid rgba(10,42,61,0.08)',background:'rgba(232,244,248,0.95)',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:640,margin:'0 auto'}}>
          <a href="/" style={{fontFamily:'serif',fontSize:'1.3rem',fontWeight:600,color:'#0a2a3d',textDecoration:'none'}}>
            bølge<span style={{color:'#4da8cc'}}>varsel</span>
          </a>
          <a href="/registrer" style={{background:'#0a2a3d',color:'white',padding:'0.5rem 1.2rem',borderRadius:100,textDecoration:'none',fontSize:'0.88rem',fontWeight:500}}>Kom i gang</a>
        </div>
      </nav>

      <div style={{maxWidth:540,margin:'0 auto',padding:'3.5rem 1.5rem'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <span style={{fontSize:'0.72rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',color:'#4da8cc',display:'block',marginBottom:'0.6rem'}}>Live bølgevarsel</span>
          <h1 style={{fontFamily:'serif',fontSize:'clamp(1.8rem,5vw,2.8rem)',fontWeight:300,color:'#0a2a3d',marginBottom:'0.5rem',letterSpacing:'-0.02em'}}>Sjekk forholdene<br/>ved din lokasjon</h1>
          <p style={{color:'#6b8fa3',fontSize:'0.95rem'}}>Søk på et sted langs norskekysten</p>
        </div>

        <div style={{position:'relative'}}>
          <div style={{display:'flex',gap:'8px',marginBottom:'4px'}}>
            <input id="sok" type="text" placeholder="Eks: Stavanger, Bergen, Mandal..." autoComplete="off" />
            <button id="sjekk" style={{background:'#0a2a3d',color:'white',padding:'12px 20px',borderRadius:100,border:'none',cursor:'pointer',fontSize:'15px',fontWeight:500,whiteSpace:'nowrap'}}>Sjekk →</button>
          </div>
          <div id="dd" style={{display:'none',position:'absolute',top:'calc(100% + 4px)',left:0,right:'100px',background:'white',borderRadius:16,boxShadow:'0 8px 30px rgba(10,42,61,0.12)',border:'1px solid rgba(10,42,61,0.08)',overflow:'hidden',zIndex:999}}></div>
        </div>

        <div id="status" style={{fontSize:'13px',color:'#6b8fa3',textAlign:'center',minHeight:'20px',margin:'8px 0'}}></div>
        <div id="rapport"></div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
const inp=document.getElementById('sok'),dd=document.getElementById('dd'),st=document.getElementById('status'),rap=document.getElementById('rapport');
let timer,sugg=[],sel=-1;

inp.addEventListener('input',()=>{
  sel=-1;clearTimeout(timer);
  const q=inp.value.trim();
  if(q.length<2){dd.style.display='none';return}
  timer=setTimeout(async()=>{
    try{
      const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=8&format=json');
      const d=await r.json();
      sugg=(d.results||[]).filter(x=>x.country_code==='NO').slice(0,5);
      renderDD();
    }catch{}
  },300);
});

inp.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,sugg.length-1);renderDD();}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,-1);renderDD();}
  else if(e.key==='Enter'){
    e.preventDefault();
    if(sel>=0&&sugg.length>0){pick(sugg[sel]);}
    else if(sugg.length>0){pick(sugg[0]);}
    else{document.getElementById('sjekk').click();}
  }
  else if(e.key==='Escape'){dd.style.display='none';sel=-1;}
});

inp.addEventListener('blur',()=>setTimeout(()=>{dd.style.display='none';sel=-1;},300));
dd.addEventListener('mousedown',e=>e.preventDefault());
inp.addEventListener('focus',()=>sugg.length>0&&renderDD());

function renderDD(){
  if(!sugg.length){dd.style.display='none';return}
  dd.innerHTML=sugg.map((s,i)=>'<div class="sug" data-i="'+i+'" style="padding:10px 16px;cursor:pointer;font-size:14px;background:'+(i===sel?'#f0f8fc':'white')+';border-bottom:1px solid #f0f4f8"><span style="font-weight:500;color:#0a2a3d">'+s.name+'</span>'+(s.admin1?'<span style="color:#6b8fa3"> – '+s.admin1.replace(' Fylke','')+'</span>':'')+'</div>').join('');
  dd.querySelectorAll('.sug').forEach(el=>{
    el.addEventListener('mousedown',e=>{e.preventDefault();pick(sugg[+el.dataset.i]);});
    el.addEventListener('mouseenter',()=>{sel=+el.dataset.i;renderDD();});
  });
  dd.style.display='block';
}

function pick(s){
  const navn=s.name+(s.admin1?' – '+s.admin1.replace(' Fylke',''):'');
  inp.value=navn;dd.style.display='none';sugg=[];sel=-1;go(s.latitude,s.longitude,navn);
}

document.getElementById('sjekk').addEventListener('click',async()=>{
  const q=inp.value.trim();if(!q)return;
  st.textContent='Søker...';
  const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=8&format=json');
  const d=await r.json();
  const hit=(d.results||[]).find(x=>x.country_code==='NO');
  if(!hit){st.textContent='Fant ikke stedet. Prøv f.eks: Bergen, Mandal, Ålesund';return}
  pick(hit);
});

async function go(lat,lon,navn){
  st.textContent='Henter værdata...';rap.innerHTML='';
  try{
    const[w,m]=await Promise.all([
      fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=Europe/Oslo').then(r=>r.json()),
      fetch('https://marine-api.open-meteo.com/v1/marine?latitude='+lat+'&longitude='+lon+'&current=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=Europe/Oslo').then(r=>r.json())
    ]);
    const dirs=['N','NØ','Ø','SØ','S','SV','V','NV'];
    const d=v=>dirs[Math.round(v/45)%8];
    const h=m.current?.wave_height??0,ww=w.current?.wind_speed_10m??0;
    const v=h<=0.3&&ww<=3?{t:'Flott dag på sjøen!',e:'⛵',c:'#22c55e'}:h<=0.6&&ww<=5?{t:'Gode forhold',e:'✅',c:'#22c55e'}:h<=1.0&&ww<=8?{t:'Akseptable forhold',e:'⚠️',c:'#f59e0b'}:h<=1.5&&ww<=10?{t:'Krevende forhold',e:'🌊',c:'#f59e0b'}:{t:'Frarådes – hardt vær',e:'🚫',c:'#ef4444'};
    const tid=new Date().toLocaleTimeString('nb-NO',{hour:'2-digit',minute:'2-digit'});
    const dato=new Date().toLocaleDateString('nb-NO',{weekday:'long',day:'numeric',month:'long'});
    const sjo=m.current?.sea_surface_temperature;
    st.textContent='';
    const C=(l,val)=>'<div style="background:#f0f8fc;border-radius:12px;padding:10px 12px"><div style="font-size:11px;color:#6b8fa3;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px">'+l+'</div><div style="font-size:14px;font-weight:500;color:#0a2a3d">'+val+'</div></div>';
    rap.innerHTML='<div style="background:white;border-radius:24px;padding:1.5rem;box-shadow:0 8px 40px rgba(10,42,61,0.1);border:1px solid rgba(10,42,61,0.07)">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block"></span><span style="font-size:11px;font-weight:600;letter-spacing:0.1em;color:#6b8fa3;text-transform:uppercase">Bølgevarsel · '+tid+'</span></div>'
      +'<div style="font-weight:600;color:#0a2a3d;margin-bottom:12px">🗺️ '+navn+' – '+dato+'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'
      +C('Lufttemperatur','🌡️ '+Math.round(w.current?.temperature_2m??0)+'°C')
      +C('Sjøtemperatur',sjo!=null?'🏊 '+parseFloat(sjo).toFixed(1)+'°C':'—')
      +C('Vind','💨 '+parseFloat(ww).toFixed(1)+' m/s fra '+d(w.current?.wind_direction_10m??0))
      +C('Bølger','🌊 '+parseFloat(h).toFixed(1)+'m · '+Math.round(m.current?.wave_period??0)+'s fra '+d(m.current?.wave_direction??0))
      +'</div>'
      +'<div style="background:'+v.c+'18;border:1.5px solid '+v.c+'40;border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px;margin-bottom:14px"><span style="font-size:18px">'+v.e+'</span><span style="font-weight:600;color:'+v.c+'">'+v.t+'</span></div>'
      +'<div style="text-align:center;padding-top:12px;border-top:1px solid #f0f4f8"><p style="font-size:13px;color:#6b8fa3;margin-bottom:8px">Vil du ha dette daglig på SMS kl. 07:30?</p>'
      +'<a href="/registrer" style="display:inline-block;background:#0a2a3d;color:white;padding:8px 20px;border-radius:100px;text-decoration:none;font-size:13px;font-weight:500">Start gratis prøveperiode →</a></div>'
      +'</div>';
  }catch{st.textContent='Noe gikk galt. Prøv igjen.';}
}
      `}} />
    </>
  )
}
