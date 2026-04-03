const main = document.getElementById('main');
const navRight = document.getElementById('navRight');
const inp = 'width:100%;padding:0.75rem 1rem;border-radius:100px;border:1.5px solid rgba(10,42,61,0.12);background:#f8fbfc;font-size:0.9rem;color:#0a2a3d;outline:none;font-family:inherit;box-sizing:border-box';
const card = 'background:white;border-radius:20px;padding:1.5rem;border:1px solid rgba(10,42,61,0.07);margin-bottom:1.2rem;box-shadow:0 2px 12px rgba(10,42,61,0.06)';
const btnP = 'background:#0a2a3d;color:white;padding:0.7rem 1.2rem;border-radius:100px;border:none;cursor:pointer;font-size:0.88rem;font-weight:500';
const btnD = 'background:#fee2e2;color:#ef4444;padding:0.5rem 0.9rem;border-radius:100px;border:none;cursor:pointer;font-size:0.8rem;font-weight:500';
const btnG = 'background:#f0f8fc;color:#0a2a3d;padding:0.5rem 0.9rem;border-radius:100px;border:none;cursor:pointer;font-size:0.8rem;font-weight:500';
const sTitle = 'font-family:serif;font-size:1.1rem;font-weight:400;color:#0a2a3d;margin:0 0 1rem;padding-bottom:0.6rem;border-bottom:1px solid rgba(10,42,61,0.07)';
const planLabel = {basis:'Basis',familie:'Familie',pro:'Pro'};
const planColor = {basis:'#e8f4f8',familie:'#dbeafe',pro:'#fef3c7'};
const planText = {basis:'#0a2a3d',familie:'#1d4ed8',pro:'#92400e'};
let sub=null,locs=[],recs=[],locTimer=null,locSugg=[],locValgt=null;

async function init(){
  const saved=localStorage.getItem('bv_email');
  if(!saved){showLogin();return;}
  try{
    const r=await fetch('/api/min-side?email='+encodeURIComponent(saved));
    const d=await r.json();
    if(d.subscriber){sub=d.subscriber;locs=d.locations||[];recs=d.recipients||[];showDash();}
    else{localStorage.removeItem('bv_email');showLogin();}
  }catch(e){showLogin();}
}

function showLogin(){
  navRight.innerHTML='';
  main.innerHTML='<div style="max-width:400px;margin:0 auto;padding:3rem 0;text-align:center">'
    +'<h1 style="font-family:serif;font-size:2rem;font-weight:300;color:#0a2a3d;margin-bottom:0.5rem">Min side</h1>'
    +'<p style="color:#6b8fa3;margin-bottom:2rem">Logg inn med e-posten du registrerte deg med</p>'
    +'<div style="display:flex;flex-direction:column;gap:0.7rem">'
    +'<input id="epost" type="email" placeholder="din@epost.no" style="'+inp+'" />'
    +'<button id="loggInn" style="'+btnP+';width:100%;padding:0.9rem">Logg inn \u2192</button>'
    +'<div id="loginFeil" style="color:#ef4444;font-size:0.85rem"></div>'
    +'</div></div>';
  const btn=document.getElementById('loggInn');
  const ei=document.getElementById('epost');
  btn.onclick=async function(){
    const e=ei.value.trim();if(!e)return;
    btn.textContent='S\u00f8ker...';
    const r=await fetch('/api/min-side?email='+encodeURIComponent(e));
    const d=await r.json();
    if(d.subscriber){sub=d.subscriber;locs=d.locations||[];recs=d.recipients||[];localStorage.setItem('bv_email',e);showDash();}
    else{document.getElementById('loginFeil').textContent='Ingen konto funnet.';btn.textContent='Logg inn \u2192';}
  };
  ei.onkeydown=function(e){if(e.key==='Enter')btn.click();};
}

function loggUt(){localStorage.removeItem('bv_email');sub=null;locs=[];recs=[];showLogin();}

function showDash(){
  const badge='<span style="background:'+planColor[sub.plan]+';color:'+planText[sub.plan]+';padding:3px 10px;border-radius:100px;font-size:0.78rem;font-weight:500">'+planLabel[sub.plan]+' \uD83D\uDFE2</span>';
  navRight.innerHTML=badge+' <button onclick="loggUt()" style="background:transparent;border:none;color:rgba(10,42,61,0.4);cursor:pointer;font-size:0.8rem;margin-left:8px">Logg ut</button>';
  renderAll();
}

function locNavn(id){const l=locs.find(function(x){return x.id===id;});return l?l.name:'';}

function renderAll(){
  const recForm=locs.length>0
    ?'<div style="display:flex;flex-direction:column;gap:0.6rem">'
      +'<select id="recLoc" style="'+inp+'"><option value="">Velg lokasjon</option>'
      +locs.map(function(l){return '<option value="'+l.id+'">'+l.name+'</option>';}).join('')
      +'</select>'
      +'<input id="recNavn" placeholder="Navn p\u00e5 mottaker (valgfritt)" style="'+inp+'" />'
      +'<input id="recTlf" placeholder="Telefonnummer (+4799...)" style="'+inp+'" />'
      +'<button onclick="leggTilMottaker()" style="'+btnP+';width:100%;padding:0.85rem">+ Legg til mottaker</button>'
      +'</div>'
    :'<p style="color:#6b8fa3;font-size:0.85rem">Legg til en lokasjon f\u00f8rst.</p>';

  main.innerHTML=
    '<div style="margin-bottom:1.5rem">'
      +'<h1 style="font-family:serif;font-size:1.8rem;font-weight:300;color:#0a2a3d;margin:0">Hei! \uD83D\uDC4B</h1>'
      +'<p style="color:#6b8fa3;margin:4px 0 0">'+sub.email+'</p>'
    +'</div>'
    +'<div style="'+card+'">'
      +'<h2 style="'+sTitle+'">&#x1F5FA;&#xFE0F; Mine lokasjoner</h2>'
      +'<div id="locList"></div>'
      +'<div style="position:relative;margin-bottom:0.6rem">'
        +'<input id="locSok" placeholder="S\u00f8k etter sted langs kysten..." autocomplete="off" style="'+inp+'" />'
        +'<span id="locOk" style="display:none;position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:0.72rem;color:#22c55e;font-weight:500">\u2713 funnet</span>'
        +'<div id="locDD" style="display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:white;border-radius:12px;box-shadow:0 8px 24px rgba(10,42,61,0.12);border:1px solid rgba(10,42,61,0.08);overflow:hidden;z-index:999"></div>'
      +'</div>'
      +'<button id="locBtn" disabled style="'+btnP+';width:100%;padding:0.85rem;opacity:0.4">S\u00f8k etter sted for \u00e5 legge til</button>'
    +'</div>'
    +'<div style="'+card+'">'
      +'<h2 style="'+sTitle+'">\uD83D\uDCF1 Mine mottakere</h2>'
      +'<div id="recList"></div>'
      +recForm
    +'</div>'
    +'<div style="'+card+'">'
      +'<h2 style="'+sTitle+'">\u2699\uFE0F Min konto</h2>'
      +'<div style="display:flex;flex-direction:column;gap:0.6rem">'
        +'<div style="padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px">'
          +'<div style="font-size:0.75rem;color:#6b8fa3;margin-bottom:2px">E-postadresse</div>'
          +'<div style="font-weight:500;color:#0a2a3d">'+sub.email+'</div>'
        +'</div>'
        +'<div style="padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px">'
          +'<div style="font-size:0.75rem;color:#6b8fa3;margin-bottom:2px">Abonnement</div>'
          +'<div style="display:flex;align-items:center;gap:8px">'
            +'<span style="font-weight:500;color:#0a2a3d">'+planLabel[sub.plan]+'</span>'
            +'<span style="background:'+(sub.status==='active'?'#dcfce7':'#f1f5f9')+';color:'+(sub.status==='active'?'#16a34a':'#64748b')+';padding:2px 8px;border-radius:100px;font-size:0.75rem">'+(sub.status==='active'?'Aktivt':'Inaktivt')+'</span>'
          +'</div>'
        +'</div>'
        +'<p style="font-size:0.8rem;color:#6b8fa3;padding:0 0.5rem">Kontakt <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> for endringer</p>'
      +'</div>'
    +'</div>';
  renderLocs();renderRecs();setupLocSok();
}

function renderLocs(){
  const el=document.getElementById('locList');if(!el)return;
  if(!locs.length){el.innerHTML='<p style="color:#6b8fa3;font-size:0.9rem;margin-bottom:1rem">Ingen lokasjoner enn\u00e5.</p>';return;}
  el.innerHTML=locs.map(function(l){
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px;margin-bottom:0.6rem">'
      +'<div><div style="font-weight:500;color:#0a2a3d">'+l.name+'</div>'
      +'<div style="font-size:0.75rem;color:#6b8fa3">'+parseFloat(l.lat).toFixed(4)+'\u00b0N, '+parseFloat(l.lon).toFixed(4)+'\u00b0\u00d8</div></div>'
      +'<button onclick="slettLok(\''+l.id+'\')" style="'+btnD+'">&#x1F5D1; Slett</button>'
      +'</div>';
  }).join('');
}

function renderRecs(){
  const el=document.getElementById('recList');if(!el)return;
  if(!recs.length){el.innerHTML='<p style="color:#6b8fa3;font-size:0.9rem;margin-bottom:1rem">Ingen mottakere enn\u00e5.</p>';return;}
  el.innerHTML=recs.map(function(r){
    const aktiv=r.active?'#dcfce7':'#f1f5f9';
    const aktivT=r.active?'#16a34a':'#64748b';
    const aktivL=r.active?'Aktiv':'Pauset';
    return '<div id="rec-'+r.id+'" style="padding:0.75rem 1rem;background:#f8fbfc;border-radius:12px;margin-bottom:0.6rem">'
      +'<div style="display:flex;align-items:center;justify-content:space-between">'
        +'<div><div style="font-weight:500;color:#0a2a3d">'+(r.name||r.phone)+'</div>'
        +'<div style="font-size:0.75rem;color:#6b8fa3">'+(r.name?r.phone+' &middot; ':'')+locNavn(r.location_id)
        +' <span style="background:'+aktiv+';color:'+aktivT+';padding:1px 7px;border-radius:100px;font-size:0.72rem;margin-left:4px">'+aktivL+'</span></div></div>'
        +'<div style="display:flex;gap:0.4rem">'
          +'<button onclick="toggleMottaker(\''+r.id+'\','+(!r.active)+')" style="'+btnG+'">'+(r.active?'\u23f8':'\u25b6')+'</button>'
          +'<button onclick="redigerMottaker(\''+r.id+'\')" style="'+btnG+'">\u270f\ufe0f</button>'
          +'<button onclick="slettMottaker(\''+r.id+'\')" style="'+btnD+'">\uD83D\uDDD1</button>'
        +'</div>'
      +'</div></div>';
  }).join('');
}

async function slettLok(id){
  if(!confirm('Slett lokasjon og alle mottakere?'))return;
  await fetch('/api/min-side/location/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,subscriber_id:sub.id})});
  locs=locs.filter(function(l){return l.id!==id;});
  recs=recs.filter(function(r){return r.location_id!==id;});
  renderAll();
}

async function leggTilMottaker(){
  const loc=document.getElementById('recLoc')?document.getElementById('recLoc').value:'';
  const navn=document.getElementById('recNavn')?document.getElementById('recNavn').value:'';
  const tlf=document.getElementById('recTlf')?document.getElementById('recTlf').value:'';
  if(!loc||!tlf)return;
  const r=await fetch('/api/min-side/recipient',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub.id,location_id:loc,phone:tlf,name:navn})});
  const d=await r.json();
  if(d.recipient){recs.push(d.recipient);renderAll();}
}

async function slettMottaker(id){
  if(!confirm('Slett mottaker?'))return;
  await fetch('/api/min-side/recipient/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,subscriber_id:sub.id})});
  recs=recs.filter(function(r){return r.id!==id;});renderRecs();
}

async function toggleMottaker(id,active){
  const r=await fetch('/api/min-side/recipient/update',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,subscriber_id:sub.id,active:active})});
  const d=await r.json();
  if(d.recipient){recs=recs.map(function(r){return r.id===id?d.recipient:r;});renderRecs();}
}

function redigerMottaker(id){
  const r=recs.find(function(x){return x.id===id;});
  const el=document.getElementById('rec-'+id);
  el.innerHTML='<div style="font-size:0.78rem;color:#6b8fa3;margin-bottom:6px">\u270f\ufe0f Rediger</div>'
    +'<input id="eNavn-'+id+'" value="'+(r.name||'')+'" placeholder="Navn" style="'+inp+';margin-bottom:6px" />'
    +'<input id="eTlf-'+id+'" value="'+r.phone+'" placeholder="Telefon" style="'+inp+';margin-bottom:8px" />'
    +'<div style="display:flex;gap:0.5rem">'
      +'<button onclick="lagreRedigert(\''+id+'\')" style="'+btnP+';flex:1;padding:0.7rem">\uD83D\uDCBE Lagre</button>'
      +'<button onclick="renderRecs()" style="'+btnG+';padding:0.7rem 1rem">Avbryt</button>'
    +'</div>';
}

async function lagreRedigert(id){
  const navn=document.getElementById('eNavn-'+id).value;
  const tlf=document.getElementById('eTlf-'+id).value;
  const r=await fetch('/api/min-side/recipient/update',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,subscriber_id:sub.id,phone:tlf,name:navn})});
  const d=await r.json();
  if(d.recipient){recs=recs.map(function(r){return r.id===id?d.recipient:r;});renderRecs();}
}

function setupLocSok(){
  const si=document.getElementById('locSok');
  const dd=document.getElementById('locDD');
  const btn=document.getElementById('locBtn');
  if(!si||!dd||!btn)return;
  si.oninput=function(){
    locValgt=null;
    document.getElementById('locOk').style.display='none';
    btn.disabled=true;btn.style.opacity='0.4';btn.textContent='S\u00f8k etter sted for \u00e5 legge til';
    clearTimeout(locTimer);
    if(si.value.length<2){dd.style.display='none';return;}
    locTimer=setTimeout(async function(){
      const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(si.value)+'&count=6&format=json');
      const d=await r.json();
      locSugg=(d.results||[]).filter(function(x){return x.country_code==='NO';}).slice(0,5);
      if(!locSugg.length){dd.style.display='none';return;}
      dd.innerHTML=locSugg.map(function(s,i){
        return '<div data-i="'+i+'" style="padding:9px 14px;cursor:pointer;border-bottom:'+(i<locSugg.length-1?'1px solid #f0f4f8':'none')+';font-size:0.88rem;background:white">'
          +'<span style="font-weight:500;color:#0a2a3d">'+s.name+'</span>'
          +(s.admin1?'<span style="color:#6b8fa3;font-size:0.8rem"> \u2013 '+s.admin1.replace(' Fylke','')+'</span>':'')
          +'</div>';
      }).join('');
      dd.querySelectorAll('[data-i]').forEach(function(el){
        el.onmousedown=function(){
          const s=locSugg[+el.dataset.i];
          locValgt={name:s.name+(s.admin1?', '+s.admin1.replace(' Fylke',''):''),lat:s.latitude,lon:s.longitude};
          si.value=locValgt.name;dd.style.display='none';
          document.getElementById('locOk').style.display='inline';
          btn.disabled=false;btn.style.opacity='1';btn.textContent='+ Legg til '+locValgt.name;
        };
        el.onmouseenter=function(){el.style.background='#f0f8fc';};
        el.onmouseleave=function(){el.style.background='white';};
      });
      dd.style.display='block';
    },300);
  };
  si.onblur=function(){setTimeout(function(){dd.style.display='none';},200);};
  btn.onclick=async function(){
    if(!locValgt)return;
    btn.textContent='Lagrer...';btn.disabled=true;
    const r=await fetch('/api/min-side/location',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriber_id:sub.id,name:locValgt.name,lat:locValgt.lat,lon:locValgt.lon})});
    const d=await r.json();
    if(d.location){locs.push(d.location);locValgt=null;renderAll();}
    else{btn.disabled=false;btn.style.opacity='1';}
  };
}

init();
