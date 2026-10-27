(function(){
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ACC = 0x22d3a6, ACC2 = 0x3b82f6;
/* Perfil do aparelho: celulares e aparelhos modestos recebem cenas mais leves. */
const MOBILE = matchMedia('(max-width: 768px), (pointer: coarse)').matches;
const conn = navigator.connection || {};
const LOW = !!conn.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 && MOBILE);
const DPR = Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2);

/* ================= DADOS ================= */
const ICONS = {
  infra:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="6" width="28" height="8" rx="2"/><rect x="6" y="18" width="28" height="8" rx="2"/><path d="M10 10h2M10 22h2M16 10h14M16 22h14M14 30v4M26 30v4M8 34h24"/></svg>',
  wifi:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 16a20 20 0 0 1 28 0M11 21a13 13 0 0 1 18 0M16 26a6 6 0 0 1 8 0"/><circle cx="20" cy="31" r="1.8" fill="currentColor"/></svg>',
  fw:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 5l12 5v9c0 8-5 13-12 16C13 32 8 27 8 19v-9z"/><path d="M14 20l4 4 8-8"/></svg>',
  mon:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="7" width="30" height="20" rx="2"/><path d="M9 21l6-6 5 4 6-8 5 4M14 33h12M20 27v6"/></svg>',
  net:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="12" r="3"/><circle cx="9" cy="28" r="3"/><circle cx="31" cy="20" r="3"/><path d="M12 12c8 0 10 8 16 8M12 28c8 0 10-8 16-8"/></svg>',
  sup:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 22v-3a12 12 0 0 1 24 0v3"/><rect x="5" y="21" width="6" height="9" rx="2"/><rect x="29" y="21" width="6" height="9" rx="2"/><path d="M32 30c0 3-3 5-8 5h-2"/></svg>'
};
const SERVICES = [
  {id:'infra',t:'Redes e infraestrutura',d:'Cabeamento estruturado, racks e patch panels organizados, VLANs, DHCP/DNS e VPN.',items:['Cabeamento estruturado','Racks e patch panels','VLANs','DHCP/DNS','VPN'],L:[1,2,3]},
  {id:'wifi',t:'Wi-Fi profissional',d:'Projeto de cobertura, instalação UniFi/Ubiquiti e separação entre rede corporativa e de convidados.',items:['Projeto de cobertura','UniFi / Ubiquiti','Rede de convidados'],L:[1,2]},
  {id:'fw',t:'Firewall e segurança',d:'Configuração MikroTik, bloqueios, políticas de acesso e VPN para usuários.',items:['MikroTik','Políticas de acesso','Bloqueios','VPN de usuários'],L:[3,4]},
  {id:'mon',t:'Monitoramento e gestão',d:'Zabbix e Grafana com alertas de indisponibilidade e relatórios mensais.',items:['Zabbix','Grafana','Alertas','Relatórios mensais'],L:[3,7]},
  {id:'net',t:'Internet sem parada',d:'Redundância de internet com failover e balanceamento de links.',items:['Redundância','Failover','Balanceamento'],L:[3]},
  {id:'sup',t:'Suporte e gestão',d:'Suporte remoto e presencial, servidores, estações de trabalho, backup e recuperação básica.',items:['Remoto e presencial','Servidores e estações','Backup'],L:[1,2,3,4,5,6,7]}
];
const OSI = ['Física','Enlace','Rede','Transporte','Sessão','Apresentação','Aplicação'];
const SYMPTOMS = [
  {t:'Wi-Fi lento ou instável',s:'wifi',why:'Projeto de cobertura com pontos de acesso UniFi.'},
  {t:'Internet cai constantemente',s:'net',why:'Mais de um link com failover e balanceamento.'},
  {t:'Rede sem organização',s:'infra',why:'Cabeamento estruturado, VLANs e documentação.'},
  {t:'Cabos sem identificação',s:'infra',why:'Rack e patch panels organizados e identificados.'},
  {t:'Roteador ou switch mal configurado',s:'infra',why:'Revisão da configuração de roteador e switch.'},
  {t:'Falta de segurança na rede',s:'fw',why:'Firewall MikroTik com políticas de acesso.'},
  {t:'Câmeras sem acesso remoto',s:'fw',why:'Acesso remoto seguro às câmeras via VPN.'},
  {t:'Falta de monitoramento',s:'mon',why:'Zabbix e Grafana com alertas de indisponibilidade.'},
  {t:'A empresa cresceu e a rede não acompanhou',s:'sup',why:'Projeto proporcional ao novo porte e suporte contínuo.'}
];
const PLANS = [
  {n:'Essencial',f:'Ideal para pequenos escritórios',i:['Suporte remoto','Diagnóstico sob demanda','Manutenção corretiva','Monitoramento básico']},
  {n:'Profissional',f:'Para empresas em crescimento',feat:true,i:['Suporte remoto e presencial','Monitoramento ativo','Manutenção preventiva','Relatórios periódicos']},
  {n:'Gestão',f:'Para operações que não podem parar',i:['Tudo do plano Profissional','Monitoramento contínuo','Gestão de firewall e Wi-Fi','Documentação e acompanhamento mensal']}
];
const CMP = [
  ['Suporte remoto',1,1,1],['Suporte presencial',0,1,1],['Manutenção corretiva',1,1,1],['Manutenção preventiva',0,1,1],
  ['Monitoramento','Básico','Ativo','Contínuo'],['Relatórios',0,'Periódicos','Mensais'],['Gestão de firewall e Wi-Fi',0,0,1],['Documentação da rede',0,0,1]
];
const svcById = Object.fromEntries(SERVICES.map(s=>[s.id,s]));
const check = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';

/* ================= CONTATOS ================= */
const WPP = "5569993645405";
const NUMS = { "1": WPP, "2": "5565996186913" };
const FB = "https://www.facebook.com/share/1C8AF8hphh/";
const ALLOWED = ["https://wa.me/", "https://www.facebook.com/", "https://www.speedtest.net/"];
const SPEEDTEST = "https://www.speedtest.net/";
const safeHref = url => ALLOWED.some(a => url.startsWith(a)) ? url : "#";
const ext = (a, url) => { a.href = safeHref(url); a.target = "_blank"; a.rel = "noopener noreferrer"; };
const clean = (v, max) => String(v || "").replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
const wa = (t, n) => "https://wa.me/" + (NUMS[n] || WPP) + "?text=" + encodeURIComponent(t.slice(0, 1500));
function bindLinks(root){
  root.querySelectorAll("[data-fb]").forEach(a => ext(a, FB));
  root.querySelectorAll("[data-speed]").forEach(a => ext(a, SPEEDTEST));
  root.querySelectorAll("[data-wpp]").forEach(a => ext(a, wa(a.dataset.wpp, a.dataset.num)));
}
document.querySelectorAll("[data-mail]").forEach(a => {
  const [u, d] = a.dataset.mail.split("|"); const addr = u + "@" + d;
  a.href = "mailto:" + addr; const t = a.querySelector(".mail-txt"); if (t) t.textContent = addr;
});
const ano = document.getElementById("ano"); if (ano) ano.textContent = String(new Date().getFullYear());
// Fotos ausentes: mantém o espaço reservado com a legenda.
document.querySelectorAll(".ph img").forEach(img => {
  const drop = () => img.remove();
  if (img.complete && img.naturalWidth === 0) drop(); else img.addEventListener("error", drop, { once: true });
});

/* ================= RENDER DE CONTEÚDO ================= */
document.getElementById('svcGrid').innerHTML = SERVICES.map(s=>
  `<a class="svc" href="#servicos" data-svc="${s.id}"><span class="ic">${ICONS[s.id]}</span><h3>${s.t}</h3><p>${s.d}</p><span class="layers">OSI · camada${s.L.length>1?'s':''} ${s.L.length===7?'1–7':s.L.join(', ')}</span></a>`).join('');

document.getElementById('svcList').innerHTML = SERVICES.map(s=>
  `<div class="svc-item" data-id="${s.id}" tabindex="0"><span class="ic">${ICONS[s.id]}</span><div><h3>${s.t}</h3><p class="muted" style="margin-top:6px;font-size:15px">${s.d}</p><ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul></div></div>`).join('');

const osi = document.getElementById('osi');
osi.innerHTML = OSI.map((n,i)=>`<div class="osi-l" data-l="${i+1}" style="transform:translateZ(${i*30}px)"><span>L${i+1} · ${n}</span></div>`).join('');
const osiCap = document.getElementById('osiCap');
function hlOSI(id){
  const s = svcById[id];
  osi.querySelectorAll('.osi-l').forEach(el=>el.classList.toggle('hl', !!s && s.L.includes(+el.dataset.l)));
  document.querySelectorAll('.svc-item').forEach(el=>el.classList.toggle('act', el.dataset.id===id));
  osiCap.textContent = s ? `${s.t} · ${s.L.length===7?'todas as camadas':'camada'+(s.L.length>1?'s ':' ')+s.L.join(', ')}` : 'Modelo OSI · 7 camadas';
}
document.querySelectorAll('.svc-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>hlOSI(el.dataset.id));
  el.addEventListener('focus',()=>hlOSI(el.dataset.id));
  el.addEventListener('click',()=>hlOSI(el.dataset.id));
});
hlOSI('infra');

document.getElementById('plans').innerHTML = PLANS.map(p=>
  `<div class="plan${p.feat?' feat':''}">${p.feat?'<span class="badge">MAIS PROCURADO</span>':''}<h3>${p.n}</h3><p class="for">${p.f}</p><ul>${p.i.map(i=>`<li>${check}<span>${i}</span></li>`).join('')}</ul><div class="price">Proposta sob medida<br><a class="btn ${p.feat?'btn-p':'btn-g'}" href="#contato" style="margin-top:14px" data-wpp="Olá! Vim pelo site e tenho interesse no plano ${p.n} de suporte mensal.">Quero o ${p.n}</a></div></div>`).join('');
const cell = v => v===1?'<span class="yes">●</span>':v===0?'<span class="no">—</span>':`<span>${v}</span>`;
document.getElementById('cmp').innerHTML = `<thead><tr><th>Recurso</th><th class="c">Essencial</th><th class="c">Profissional</th><th class="c">Gestão</th></tr></thead><tbody>${CMP.map(r=>`<tr><td>${r[0]}</td><td class="c">${cell(r[1])}</td><td class="c">${cell(r[2])}</td><td class="c">${cell(r[3])}</td></tr>`).join('')}</tbody>`;
bindLinks(document);

/* Diagnóstico */
const chips = document.getElementById('chips');
chips.innerHTML = SYMPTOMS.map((s,i)=>`<button type="button" class="chip" aria-pressed="false" data-i="${i}">${s.t}</button>`).join('');
const diagCta=document.getElementById('diagCta');
function updDiag(){
  const sel=[...chips.querySelectorAll('[aria-pressed="true"]')].map(b=>SYMPTOMS[+b.dataset.i]);
  const list=document.getElementById('diagList');
  document.getElementById('diagTitle').textContent = sel.length===1?'1 problema selecionado':`${sel.length} problemas selecionados`;
  const txt = sel.length
    ? "Olá! Fiz o diagnóstico rápido no site. Minha empresa está com:\n- " + sel.map(s=>s.t).join("\n- ") + "\n\nPodem me ajudar?"
    : "Olá! Quero um diagnóstico da rede da minha empresa.";
  ext(diagCta, wa(txt));
  if(!sel.length){list.innerHTML='<li><span class="k">--</span><div><b>Aguardando sintomas</b><span>As frentes recomendadas aparecem aqui.</span></div></li>';return;}
  const grouped={}; sel.forEach(s=>{(grouped[s.s]=grouped[s.s]||[]).push(s.why)});
  list.innerHTML = Object.entries(grouped).map(([k,w])=>`<li><span class="k">${svcById[k].L.length===7?'L1–7':'L'+svcById[k].L.join('/')}</span><div><b>${svcById[k].t}</b><span>${[...new Set(w)].join(' ')}</span></div></li>`).join('');
}
chips.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');updDiag();});
updDiag();

/* Links (NOC) */
const LINKS=[{n:'Link de internet · Online',u:62},{n:'Firewall · Ativo',u:34},{n:'Wi-Fi corporativo · Online',u:47},{n:'Alertas de falha · Ligados',u:12}];
const linkRows=document.getElementById('linkRows');
linkRows.innerHTML=LINKS.map((l,i)=>`<div class="link-row"><span class="dot"></span><div><b>${l.n}</b><div class="bar"><i id="lb${i}" style="width:${l.u}%"></i></div></div><small id="lv${i}">${l.u}%</small></div>`).join('');

/* Formulário */
const form=document.getElementById('form');
const opts = { porte: [...form.porte.options].map(o => o.text), servico: [...form.servico.options].map(o => o.text) };
let lastSend = 0;
form.addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(form), err=document.getElementById('fErr');
  if(!clean(fd.get('nome'),80)||!clean(fd.get('empresa'),100)){err.hidden=false;return;} err.hidden=true;
  const now=Date.now(); if(now-lastSend<3000) return; lastSend=now;   // evita cliques repetidos
  const pick = k => opts[k].includes(fd.get(k)) ? fd.get(k) : opts[k][0];
  const t = "Olá! Vim pelo site." +
    "\nNome: " + clean(fd.get("nome"), 80) +
    "\nEmpresa: " + clean(fd.get("empresa"), 100) +
    "\nCidade: " + (clean(fd.get("cidade"), 60) || "-") +
    "\nFuncionários: " + pick("porte") +
    "\nNecessidade: " + pick("servico") +
    "\nDetalhes: " + (clean(fd.get("msg"), 500) || "-");
  const url=wa(t);
  const link=document.getElementById('waLink'); ext(link,url); link.hidden=false;
  try{ window.open(url,'_blank','noopener,noreferrer'); }catch(_){}
});
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
  const done=ok=>{b.textContent=ok?'Copiado':'Selecionado';setTimeout(()=>b.textContent='Copiar',1800)};
  const fallback=()=>{const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);
    let ok=false;try{ok=document.execCommand('copy');}catch(_){} done(ok);};
  if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(b.dataset.copy).then(()=>done(true)).catch(fallback); else fallback();
}));

/* ================= ROTEAMENTO ================= */
const routes=[...document.querySelectorAll('section.page')].map(s=>s.dataset.route);
const nav=document.getElementById('nav'), menuT=document.getElementById('menuT');
menuT.addEventListener('click',()=>{const o=nav.classList.toggle('open');menuT.setAttribute('aria-expanded',o)});
let current='inicio';
const ALIAS={faq:'duvidas',problemas:'inicio'};
function go(){
  const r=(location.hash||'#inicio').slice(1);
  const route=routes.includes(r)?r:(ALIAS[r]||'inicio');
  document.querySelectorAll('section.page').forEach(s=>s.classList.toggle('on',s.dataset.route===route));
  nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+route));
  nav.classList.remove('open');menuT.setAttribute('aria-expanded','false');
  document.body.classList.toggle('inner',route!=='inicio');
  if(r==='problemas') requestAnimationFrame(()=>document.getElementById('problemas').scrollIntoView({behavior:RM?'auto':'smooth'}));
  else if(route!==current) window.scrollTo(0,0);
  current=route;
  document.title = route==='inicio'?'Conexa Network | Redes, Wi-Fi Corporativo e Suporte de TI em Rondônia':`${document.querySelector(`nav.main a[href="#${route}"]`).textContent} · Conexa Network`;
  if(bg) bg.setRoute(route);
  if(route==='projetos') topo.start(); else topo.stop();
}
window.addEventListener('hashchange',go);
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  const svc=a.dataset.svc; if(svc) setTimeout(()=>hlOSI(svc),0);
  if(a.getAttribute('href')==='#problemas'){ if(location.hash==='#problemas'){e.preventDefault();document.getElementById('problemas').scrollIntoView({behavior:RM?'auto':'smooth'});} return; }
  if(a.getAttribute('href')===location.hash || (a.getAttribute('href')==='#inicio'&&!location.hash)){
    e.preventDefault(); nav.classList.remove('open'); menuT.setAttribute('aria-expanded','false');
    window.scrollTo({top:0,behavior:RM?'auto':'smooth'});
  }
});

/* ================= SPARKLINE ================= */
const spark=document.getElementById('spark'), sctx=spark.getContext('2d');
/* Latência real do visitante.
   PING_URL opcional: no servidor de produção, crie um endpoint leve (ex.: '/ping' que responde 204)
   e coloque o caminho aqui. Sem ele, usa o favicon do próprio site. */
const PING_URL = null;
const SAMPLES = 60, INTERVAL = 2000, TIMEOUT = 3000;
const onWeb = /^https?:$/.test(location.protocol);
const target = new URL(PING_URL || 'favicon.svg', location.href).href;
const sameOrigin = true;
if(!onWeb){
  document.getElementById('mTarget').textContent = 'A medição funciona quando o site está publicado. Aberto como arquivo local, não há servidor para medir.';
  const lv=document.getElementById('liveTag'); lv.lastChild.textContent='disponível no site publicado'; lv.style.color='var(--muted)'; lv.querySelector('i').style.cssText='background:var(--muted);animation:none';
}
let sdata=[], hist=[], warm=false;
const fmt = (v,d=1)=>v.toFixed(d).replace('.',',');

async function probe(){
  if(document.hidden||!onWeb) return;
  const ctrl = new AbortController(), timer = setTimeout(()=>ctrl.abort(), TIMEOUT);
  const url = target + (target.includes('?')?'&':'?') + '_=' + Date.now();
  const t0 = performance.now(); let ms = null;
  try{
    await fetch(url, {method: sameOrigin?'HEAD':'GET', mode: sameOrigin?'same-origin':'no-cors', cache:'no-store', signal: ctrl.signal});
    ms = performance.now() - t0;
  }catch(e){ ms = null; }
  clearTimeout(timer);
  if(!warm){ warm = true; if(ms!==null) return; }   // 1ª amostra inclui DNS + TLS; descarta
  hist.push(ms); if(hist.length>SAMPLES) hist.shift();
  if(ms!==null){ sdata.push(ms); if(sdata.length>SAMPLES) sdata.shift(); }
  updateMetrics(ms);
  if(current==='inicio') drawSpark();
}
function updateMetrics(last){
  const ok = sdata, lost = hist.filter(v=>v===null).length;
  const live = document.getElementById('liveTag');
  if(!ok.length){
    document.getElementById('mLat').textContent='indisponível';
    document.getElementById('mStats').textContent='Não foi possível medir a partir deste navegador. Use o teste completo abaixo.';
    live.lastChild.textContent='medição indisponível'; live.style.color='var(--warn)'; live.querySelector('i').style.background='var(--warn)'; return; }
  live.lastChild.textContent='medindo ao vivo';
  const cur = last ?? ok[ok.length-1];
  const jit = ok.length>1 ? ok.slice(1).reduce((a,v,i)=>a+Math.abs(v-ok[i]),0)/(ok.length-1) : 0;
  const avg = ok.reduce((a,v)=>a+v,0)/ok.length;
  document.getElementById('mLat').textContent = last===null ? 'timeout' : Math.round(cur)+' ms';
  document.getElementById('mJit').textContent = fmt(jit)+' ms';
  document.getElementById('mLoss').textContent = fmt(lost/hist.length*100)+' %';
  document.getElementById('mStats').textContent = `Mín. ${Math.round(Math.min(...ok))} ms · méd. ${Math.round(avg)} ms · máx. ${Math.round(Math.max(...ok))} ms · ${hist.length} amostras`;
  const q = avg<60?'var(--ok)':avg<150?'var(--warn)':'var(--err)';
  live.style.color=q; live.querySelector('i').style.background=q;
  const c = navigator.connection;
  document.getElementById('mCon').textContent = c && c.effectiveType ? c.effectiveType.toUpperCase() : '—';
  if(c && c.downlink) document.getElementById('mStats').textContent += ` · banda estimada ${fmt(c.downlink)} Mb/s`;
}
function niceMax(v){ const s=[20,50,100,200,300,500,1000,2000,3000]; return s.find(x=>x>=v*1.15)||3000; }

function drawSpark(){
  const dpr=Math.min(devicePixelRatio,2), w=spark.clientWidth, h=spark.clientHeight;
  if(spark.width!==w*dpr){spark.width=w*dpr;spark.height=h*dpr;}
  sctx.setTransform(dpr,0,0,dpr,0,0); sctx.clearRect(0,0,w,h);
  sctx.font='10px JetBrains Mono, monospace'; sctx.fillStyle='#8d9ab4'; sctx.strokeStyle='rgba(141,154,180,.12)'; sctx.lineWidth=1;
  if(sdata.length<2){ sctx.fillText(onWeb?'Coletando as primeiras medições…':'Disponível com o site publicado.',4,h/2); return; }
  const max=niceMax(Math.max(...sdata)), pad=30, x=i=>pad+((i+SAMPLES-sdata.length)/(SAMPLES-1))*(w-pad), y=v=>h-14-(v/max)*(h-24);
  [0,max/2,max].forEach(t=>{sctx.beginPath();sctx.moveTo(pad,y(t));sctx.lineTo(w,y(t));sctx.stroke();sctx.fillText(Math.round(t),0,y(t)+3)});
  const g=sctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(34,211,166,.28)'); g.addColorStop(1,'rgba(34,211,166,0)');
  sctx.beginPath(); sdata.forEach((v,i)=>i?sctx.lineTo(x(i),y(v)):sctx.moveTo(x(i),y(v)));
  sctx.lineTo(x(sdata.length-1),h-14); sctx.lineTo(x(0),h-14); sctx.closePath(); sctx.fillStyle=g; sctx.fill();
  sctx.beginPath(); sdata.forEach((v,i)=>i?sctx.lineTo(x(i),y(v)):sctx.moveTo(x(i),y(v))); sctx.strokeStyle='#22d3a6'; sctx.lineWidth=1.8; sctx.stroke();
  const lx=x(sdata.length-1), ly=y(sdata[sdata.length-1]); sctx.fillStyle='#22d3a6'; sctx.beginPath(); sctx.arc(lx,ly,3.5,0,7); sctx.fill();
}
function tickLinks(){
  LINKS.forEach((l,i)=>{l.u=Math.max(8,Math.min(92,l.u+(Math.random()-.5)*8));document.getElementById('lb'+i).style.width=l.u+'%';document.getElementById('lv'+i).textContent=Math.round(l.u)+'%'});
}
drawSpark(); probe(); setInterval(probe,INTERVAL); if(!RM) setInterval(tickLinks,1200);
window.addEventListener('resize',drawSpark);

/* ================= UTIL 3D ================= */
function dotTexture(){
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.8)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);
}

/* ================= FUNDO 3D: GLOBO DE REDE ================= */
let bg=null;
if(window.THREE && !LOW){ try{ bg=(function(){
  const canvas=document.getElementById('bg3d');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:!MOBILE,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(DPR);
  const scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x070b14,0.045);
  const camera=new THREE.PerspectiveCamera(48,1,0.1,200); camera.position.set(0,0.6,10);
  const world=new THREE.Group(); scene.add(world);
  const globe=new THREE.Group(); world.add(globe);
  const tex=dotTexture(), R=3;

  const D = window.WORLD_DATA;
  // lat/lon (graus) -> ponto na esfera; longitude 0 voltada para a câmera
  const LL=(lat,lon,r)=>{const f=lat*Math.PI/180,l=lon*Math.PI/180,c=Math.cos(f);return new THREE.Vector3(r*c*Math.sin(l),r*Math.sin(f),r*c*Math.cos(l));};

  // luz para dar volume ao relevo
  scene.add(new THREE.AmbientLight(0x7fb6d8,.55));
  const sun=new THREE.DirectionalLight(0xffffff,.95); sun.position.set(-6,5,8); scene.add(sun);

  // oceano: núcleo escuro que também esconde o lado de trás
  const core=new THREE.Mesh(new THREE.SphereGeometry(R*.995,64,64),new THREE.MeshBasicMaterial({color:0x08111f}));
  core.renderOrder=-1; globe.add(core);

  // grade de latitude/longitude discreta
  const grat=[];
  for(let lat=-60;lat<=60;lat+=30){for(let lon=-180;lon<180;lon+=3){grat.push(LL(lat,lon,R*1.003),LL(lat,lon+3,R*1.003));}}
  for(let lon=-180;lon<180;lon+=30){for(let lat=-87;lat<87;lat+=3){grat.push(LL(lat,lon,R*1.003),LL(lat+3,lon,R*1.003));}}
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grat),new THREE.LineBasicMaterial({color:ACC2,transparent:true,opacity:.07})));

  // relevo: uma coluna por célula de terra (1° no computador, 2° no celular)
  const STEP=MOBILE?2:1, cells=[];
  if(D){
    D.mask.split(';').forEach((row,y)=>{
      if(y%STEP) return; let x=0, land=false;
      for(const r of row.split(',')){const n=parseInt(r,36); if(land){for(let i=x;i<x+n;i++) if(i%STEP===0) cells.push([89.5-y,i-179.5]);} x+=n; land=!land;}
    });
  }
  const relief=(lat,lon)=>{ // relevo estilizado e contínuo
    const a=Math.sin(lat*.19+lon*.07)*Math.cos(lon*.13-lat*.05), b=Math.sin(lat*.47+1.3)*Math.sin(lon*.39+.7);
    return Math.max(0,Math.min(1,.45+.35*a+.2*b));
  };
  const cellW=(Math.PI/180)*R*STEP*.86;
  const boxes=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({color:0xffffff,roughness:.55,metalness:.15,emissive:0x0b3b3a,emissiveIntensity:.35}), Math.max(1,cells.length));
  const up=new THREE.Vector3(0,1,0), m4=new THREE.Matrix4(), q=new THREE.Quaternion(), sc=new THREE.Vector3(), col=new THREE.Color();
  const cLow=new THREE.Color(0x0f4a5a), cMid=new THREE.Color(0x22d3a6), cHigh=new THREE.Color(0x8ff5dc);
  cells.forEach(([lat,lon],i)=>{
    const h=.025+relief(lat,lon)*.11, n=LL(lat,lon,1);
    q.setFromUnitVectors(up,n);
    sc.set(cellW*Math.max(.25,Math.cos(lat*Math.PI/180)),h,cellW);
    m4.compose(n.clone().multiplyScalar(R+h/2),q,sc); boxes.setMatrixAt(i,m4);
    const k=relief(lat,lon); col.copy(cLow).lerp(cMid,Math.min(1,k*1.4)); if(k>.75) col.lerp(cHigh,(k-.75)*2.4);
    boxes.setColorAt(i,col);
  });
  boxes.count=cells.length; boxes.instanceMatrix.needsUpdate=true; if(boxes.instanceColor) boxes.instanceColor.needsUpdate=true;
  globe.add(boxes);

  // fronteiras entre países, acima do relevo
  if(D){
    const bp=[], RB=R+.15;
    D.borders.split(';').forEach(line=>{
      let px=null,py=null,prev=null;
      line.split(',').forEach((tok,i)=>{
        const [u,v]=tok.split('.').map(t=>parseInt(t,36));
        if(i===0){px=u;py=v;} else {px+=u;py+=v;}
        const cur={lat:py/2,lon:px/2};
        if(prev){
          const d=Math.max(Math.abs(cur.lat-prev.lat),Math.abs(cur.lon-prev.lon)), n=Math.max(1,Math.ceil(d/1.5));
          for(let k=0;k<n;k++){const t0=k/n,t1=(k+1)/n;
            bp.push(LL(prev.lat+(cur.lat-prev.lat)*t0,prev.lon+(cur.lon-prev.lon)*t0,RB),LL(prev.lat+(cur.lat-prev.lat)*t1,prev.lon+(cur.lon-prev.lon)*t1,RB));}
        }
        prev=cur;
      });
    });
    globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(bp),new THREE.LineBasicMaterial({color:0xbffbe9,transparent:true,opacity:.55})));
  }

  // halo atmosférico
  const halo=new THREE.Mesh(new THREE.SphereGeometry(R*1.16,48,48),new THREE.ShaderMaterial({
    transparent:true,side:THREE.BackSide,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 vN;void main(){float i=pow(.72-dot(vN,vec3(0,0,1.)),3.);gl_FragColor=vec4(.13,.72,.75,1.)*i*.6;}'
  })); world.add(halo);

  // cidades e base da Conexa (Porto Velho, RO)
  const CITIES=[[-8.76,-63.9],[-15.6,-56.1],[-23.55,-46.63],[-22.9,-43.2],[-15.8,-47.9],[-3.1,-60.0],[-34.6,-58.4],[-33.45,-70.67],[4.71,-74.07],[19.43,-99.13],[40.71,-74.0],[34.05,-118.24],[41.88,-87.63],[43.65,-79.38],
    [51.5,-0.12],[50.11,8.68],[48.86,2.35],[40.42,-3.7],[55.75,37.62],[52.52,13.4],[30.04,31.24],[6.52,3.38],[-26.2,28.05],[-1.29,36.82],[25.2,55.27],[19.08,72.88],[28.61,77.2],
    [1.35,103.82],[22.3,114.17],[31.23,121.47],[39.9,116.4],[35.68,139.69],[37.57,126.98],[-33.87,151.21],[-37.81,144.96],[14.6,120.98],[-6.2,106.85],[41.0,28.98],[59.33,18.07],[64.14,-21.9]];
  const cityPos=CITIES.map(([a,b])=>LL(a,b,R+.16));
  globe.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(cityPos),new THREE.PointsMaterial({size:.12,map:tex,color:0xd9fff4,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));
  const home=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:ACC,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  home.position.copy(LL(-8.76,-63.9,R+.2)); globe.add(home);

  // arcos de tráfego com rastro luminoso + impacto no destino
  const SEG=64, arcCols=[new THREE.Color(ACC),new THREE.Color(ACC),new THREE.Color(ACC),new THREE.Color(ACC2),new THREE.Color(0xffb04a)];
  const arcMat=()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uHead:{value:0},uLen:{value:.35},uColor:{value:new THREE.Color(ACC)}},
    vertexShader:'attribute float aT;varying float vT;void main(){vT=aT;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float uHead;uniform float uLen;uniform vec3 uColor;varying float vT;void main(){float a=vT<=uHead?clamp((vT-(uHead-uLen))/uLen,0.,1.):0.;gl_FragColor=vec4(uColor,a*a);}'});
  const ringGeo=new THREE.RingGeometry(.03,.06,32), arcs=[], impacts=[];
  for(let i=0;i<(MOBILE?6:9);i++){const m=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:ACC,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));globe.add(m);impacts.push({m,t:1});}
  function impact(pos,color){const it=impacts.find(x=>x.t>=1)||impacts[0];it.t=0;it.m.position.copy(pos);it.m.lookAt(pos.clone().multiplyScalar(2));it.m.material.color.copy(color);}
  function spawn(a){
    const rnd=()=>Math.floor(Math.random()*CITIES.length);
    let i=rnd(), j;
    if(i!==0 && Math.random()<.35) j=0;   // parte do tráfego chega a Rondônia
    else do{ j=rnd(); }while(j===i);
    const p=LL(...CITIES[i],1), q2=LL(...CITIES[j],1), ang=p.angleTo(q2), hgt=.15+ang*.45, pos=a.geo.attributes.position;
    for(let k=0;k<=SEG;k++){const t=k/SEG, v=new THREE.Vector3().copy(p).lerp(q2,t).normalize().multiplyScalar(R+.16+Math.sin(Math.PI*t)*hgt);pos.setXYZ(k,v.x,v.y,v.z);}
    pos.needsUpdate=true; a.geo.computeBoundingSphere();
    a.end=LL(...CITIES[j],R+.17); a.head=-Math.random()*.8; a.v=.004+Math.random()*.004;
    a.mat.uniforms.uColor.value.copy(arcCols[Math.floor(Math.random()*arcCols.length)]); a.hit=false;
  }
  for(let i=0;i<(MOBILE?8:18);i++){
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array((SEG+1)*3),3));
    const tt=new Float32Array(SEG+1); for(let k=0;k<=SEG;k++) tt[k]=k/SEG; geo.setAttribute('aT',new THREE.BufferAttribute(tt,1));
    const mat=arcMat(), line=new THREE.Line(geo,mat); globe.add(line);
    const a={geo,mat,line}; spawn(a); a.head=-Math.random()*1.5; arcs.push(a);
  }

  // anéis orbitais
  const rings=[];
  [[3.9,.35,.3],[4.5,-.5,.9]].forEach(([r,tx,tz])=>{
    const g=new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0,0,r,r,0,Math.PI*2).getPoints(160).map(p=>new THREE.Vector3(p.x,0,p.y)));
    const l=new THREE.LineLoop(g,new THREE.LineBasicMaterial({color:ACC,transparent:true,opacity:.18}));
    l.rotation.set(tx,0,tz); world.add(l);
    const sat=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:ACC,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    sat.scale.setScalar(.28); l.add(sat); rings.push({l,sat,r,a:Math.random()*6});
  });

  // grade do "piso de dados" + poeira
  const grid=new THREE.GridHelper(60,60,0x1f3a5c,0x13223a); grid.position.y=-4.6; grid.material.transparent=true; grid.material.opacity=.45; scene.add(grid);
  const dust=[]; for(let i=0;i<(MOBILE?220:700);i++) dust.push(new THREE.Vector3((Math.random()-.5)*60,(Math.random()-.3)*30,(Math.random()-.5)*60-10));
  scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(dust),new THREE.PointsMaterial({size:.06,map:tex,color:0x7fa8d8,transparent:true,opacity:.6,depthWrite:false})));

  // estados por rota
  let tgt={x:2.9,y:.2,s:1}, cur={x:2.9,y:.2,s:1};
  const mouse={x:0,y:0};
  addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth-.5;mouse.y=e.clientY/innerHeight-.5;});
  function layout(route){
    const narrow=innerWidth<900;
    if(route==='inicio') tgt=narrow?{x:0,y:2.2,s:.72}:{x:2.9,y:.2,s:1};
    else tgt=narrow?{x:1.6,y:2.6,s:.6}:{x:4.6,y:.4,s:1.25};
  }
  let route='inicio';
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();layout(route);}
  addEventListener('resize',resize); resize();

  let scrollY=0; addEventListener('scroll',()=>{scrollY=window.scrollY},{passive:true});
  const clock=new THREE.Clock();
  let lastT=0;
  function frame(now){
    // Pausa com a aba oculta; no celular, pausa durante a topologia 3D e limita a ~30 fps.
    if(!RM && (document.hidden || (MOBILE && current==='projetos') || (MOBILE && now-lastT<32))){ requestAnimationFrame(frame); return; }
    lastT=now||0;
    const t=clock.getElapsedTime();
    for(const k of ['x','y','s']) cur[k]+=(tgt[k]-cur[k])*.05;
    world.position.set(cur.x,cur.y+scrollY*.0012,0); world.scale.setScalar(cur.s);
    // começa com o Brasil de frente e gira devagar
    globe.rotation.y=1.12-t*.035+scrollY*.0006; globe.rotation.x=.12+Math.sin(t*.2)*.03;
    home.scale.setScalar(.45+Math.sin(t*3)*.15);
    arcs.forEach(a=>{a.head+=RM?0:a.v; const L=a.mat.uniforms.uLen.value; a.mat.uniforms.uHead.value=a.head;
      if(!a.hit&&a.head>=1){a.hit=true;impact(a.end,a.mat.uniforms.uColor.value);} if(a.head>1+L) spawn(a);});
    impacts.forEach(it=>{if(it.t<1){it.t+=.02;it.m.scale.setScalar(1+it.t*5);it.m.material.opacity=(1-it.t)*.9;}});
    rings.forEach((r,i)=>{r.a+=.004*(i?-.7:1);r.sat.position.set(Math.cos(r.a)*r.r,0,Math.sin(r.a)*r.r);});
    camera.position.x+=(mouse.x*1.2-camera.position.x)*.03;
    camera.position.y+=(.6-mouse.y*.8-camera.position.y)*.03;
    camera.lookAt(0,0,0);
    grid.position.z=(t*.6)%1;
    renderer.render(scene,camera);
    if(!RM) requestAnimationFrame(frame);
  }
  frame(0);
  return {setRoute(r){route=r;layout(r);if(RM)frame(0);}};
})(); }catch(e){ console.warn('WebGL indisponível',e); } }

if(!bg) document.body.classList.add('no3d');

/* ================= TOPOLOGIA 3D (PROJETOS) ================= */
function topoFallback(){
  const stage=document.getElementById('topoStage'), st=document.getElementById('topoStatus');
  const bBal=document.getElementById('mBal'), bFail=document.getElementById('mFail');
  stage.innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:var(--muted);font:500 13px var(--f-mono)">O 3D não pôde ser carregado neste navegador.<br>Os controles do cenário continuam funcionando.</div>';
  stage.style.cursor='default';
  const set=f=>{bBal.setAttribute('aria-pressed',String(!f));bFail.setAttribute('aria-pressed',String(f));st.className='status '+(f?'fail':'ok');
    st.textContent=f?'Link 1 fora do ar. Failover ativo: todo o tráfego segue pelo Link 2 e a operação continua.':'Balanceamento ativo: tráfego dividido entre Link 1 e Link 2.';};
  bBal.addEventListener('click',()=>set(false)); bFail.addEventListener('click',()=>set(true));
  return {start(){},stop(){}};
}
const topo=(function(){
  if(!window.THREE) return topoFallback();
  const stage=document.getElementById('topoStage'), canvas=document.getElementById('topo3d'), lbls=document.getElementById('lbls');
  let renderer; try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){return topoFallback();}
  renderer.setPixelRatio(DPR);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(42,1,.1,100);
  camera.position.set(0,1.2,13);
  scene.add(new THREE.AmbientLight(0x8fb6ff,.55));
  const dl=new THREE.DirectionalLight(0xffffff,.9); dl.position.set(4,8,6); scene.add(dl);
  const pl=new THREE.PointLight(ACC,1.2,20); pl.position.set(0,0,4); scene.add(pl);
  const G=new THREE.Group(); scene.add(G);
  const tex=dotTexture();

  const NODES={
    isp1:{p:[-2.4,3.4,0],k:'cloud',n:'Link 1 · Operadora A',d:'Primeiro link de internet. Em operação normal, divide o tráfego com o Link 2 (balanceamento).'},
    isp2:{p:[2.4,3.4,0],k:'cloud',n:'Link 2 · Operadora B',d:'Segundo link, de outra operadora. Se o Link 1 cair, assume todo o tráfego automaticamente (failover).'},
    fw:{p:[0,1.8,0],k:'box',w:2.2,n:'Firewall MikroTik',d:'Porta de entrada da rede. Aplica políticas de acesso, bloqueios, VPN para usuários e decide por qual link o tráfego sai.'},
    core:{p:[0,.2,0],k:'box',w:2.6,n:'Switch core',d:'Centro da rede interna. Separa os departamentos em VLANs para que um problema em uma área não afete as outras.'},
    mon:{p:[4.1,1.2,-1],k:'box',w:1.4,n:'Zabbix + Grafana',d:'Coleta métricas de todos os equipamentos e dispara alertas de indisponibilidade. Gera os relatórios mensais.'},
    vCorp:{p:[-3.6,-1.5,.6],k:'ring',n:'VLAN Corporativa',d:'Rede dos colaboradores, com acesso aos sistemas internos e servidores.'},
    vGuest:{p:[-1.2,-1.5,1.3],k:'ring',n:'VLAN Convidados',d:'Wi-Fi para visitantes, isolado da rede interna. O visitante navega, mas não enxerga os computadores da empresa.'},
    vCam:{p:[1.2,-1.5,1.3],k:'ring',n:'VLAN Câmeras IP',d:'Câmeras em rede própria, para que o tráfego de vídeo não dispute banda com o resto da operação.'},
    srv:{p:[3.6,-1.5,.6],k:'box',w:1.4,n:'Servidores e backup',d:'Servidores e rotina de backup com recuperação básica.'},
    ap1:{p:[-4.2,-3.2,1],k:'ap',n:'AP UniFi',d:'Ponto de acesso UniFi. A cobertura é projetada para eliminar áreas sem sinal.'},
    ap2:{p:[-2.2,-3.2,1.6],k:'ap',n:'AP UniFi',d:'Ponto de acesso UniFi transmitindo as redes corporativa e de convidados em SSIDs separados.'},
    cam:{p:[1.2,-3.2,2],k:'box',w:.8,n:'Câmera IP',d:'Câmera IP conectada à VLAN de câmeras.'}
  };
  const EDGES=[['isp1','fw'],['isp2','fw'],['fw','core'],['core','mon'],['core','vCorp'],['core','vGuest'],['core','vCam'],['core','srv'],['vCorp','ap1'],['vGuest','ap2'],['vCorp','ap2'],['vCam','cam']];
  const meshes=[], V=k=>new THREE.Vector3(...NODES[k].p);
  const mat=c=>new THREE.MeshStandardMaterial({color:c,metalness:.4,roughness:.35,emissive:c,emissiveIntensity:.18});
  for(const [k,n] of Object.entries(NODES)){
    let m;
    if(n.k==='cloud') m=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),new THREE.MeshStandardMaterial({color:ACC2,wireframe:true,emissive:ACC2,emissiveIntensity:.5}));
    else if(n.k==='box'){m=new THREE.Mesh(new THREE.BoxGeometry(n.w,.42,.9),mat(0x16243d));
      const led=new THREE.Mesh(new THREE.BoxGeometry(n.w*.7,.05,.02),new THREE.MeshBasicMaterial({color:ACC}));led.position.set(0,0,.46);m.add(led);}
    else if(n.k==='ring') m=new THREE.Mesh(new THREE.TorusGeometry(.42,.07,12,40),mat(0x2a6f95));
    else {m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.14,32),mat(0xdfe8f5));}
    m.position.copy(V(k)); m.userData.key=k; G.add(m); meshes.push(m); n.mesh=m;
    const el=document.createElement('div'); el.className='lbl'; el.textContent=n.n; lbls.appendChild(el); n.el=el;
  }
  const edgeObjs={};
  EDGES.forEach(([a,b])=>{
    const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(a),V(b)]),new THREE.LineBasicMaterial({color:ACC,transparent:true,opacity:.45}));
    G.add(l); edgeObjs[a+'-'+b]=l;
  });
  // anel de Wi-Fi nos APs
  const waves=[]; ['ap1','ap2'].forEach(k=>{for(let i=0;i<2;i++){const w=new THREE.Mesh(new THREE.RingGeometry(.5,.53,40),new THREE.MeshBasicMaterial({color:ACC,transparent:true,side:THREE.DoubleSide}));w.rotation.x=-Math.PI/2;w.position.copy(V(k));w.userData.o=i*.5;G.add(w);waves.push(w);}});
  // plataforma
  const plat=new THREE.Mesh(new THREE.CylinderGeometry(6.2,6.2,.05,64),new THREE.MeshBasicMaterial({color:0x0e1a2e,transparent:true,opacity:.6}));plat.position.y=-3.6;G.add(plat);
  const pg=new THREE.GridHelper(12,24,0x1f3a5c,0x14243c);pg.position.y=-3.57;G.add(pg);

  // pacotes
  const LEAVES=[['vCorp','ap1'],['vGuest','ap2'],['vCam','cam'],['srv'],['mon'],['vCorp','ap2']];
  let failover=false;
  const packets=[];
  function newPath(){
    const isp=failover?'isp2':(Math.random()<.5?'isp1':'isp2');
    return [isp,'fw','core',...LEAVES[Math.floor(Math.random()*LEAVES.length)]].map(V);
  }
  for(let i=0;i<(MOBILE?12:22);i++){
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:0xffffff,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    s.scale.setScalar(.32); G.add(s); packets.push({s,path:newPath(),t:Math.random()*3,v:.012+Math.random()*.01});
  }
  function placePacket(p){
    const segs=p.path.length-1; if(p.t>=segs){p.path=newPath();p.t=0;}
    const i=Math.floor(p.t), f=p.t-i; p.s.position.lerpVectors(p.path[i],p.path[i+1],f);
  }

  // estado
  const statusEl=document.getElementById('topoStatus'), info=document.getElementById('nodeInfo');
  const bBal=document.getElementById('mBal'), bFail=document.getElementById('mFail');
  function setMode(f){
    failover=f; bBal.setAttribute('aria-pressed',String(!f)); bFail.setAttribute('aria-pressed',String(f));
    const e=edgeObjs['isp1-fw']; e.material.color.set(f?0xff5d6c:ACC); e.material.opacity=f?.9:.45;
    NODES.isp1.mesh.material.color.set(f?0xff5d6c:ACC2); NODES.isp1.mesh.material.emissive.set(f?0xff5d6c:ACC2);
    NODES.isp1.el.classList.toggle('down',f);
    packets.forEach(p=>{if(f&&p.path[0].equals(V('isp1'))){p.path=newPath();p.t=Math.random()*.5;}});
    statusEl.className='status '+(f?'fail':'ok');
    statusEl.textContent=f?'Link 1 fora do ar. Failover ativo: todo o tráfego segue pelo Link 2 e a operação continua.':'Balanceamento ativo: tráfego dividido entre Link 1 e Link 2.';
    if(f) select('isp2');
  }
  bBal.addEventListener('click',()=>setMode(false)); bFail.addEventListener('click',()=>setMode(true));
  let sel='fw';
  function select(k){sel=k;const n=NODES[k];info.innerHTML=`<h3>${n.n}</h3><p>${n.d}</p>`;
    Object.entries(NODES).forEach(([kk,nn])=>nn.el.classList.toggle('sel',kk===k));}
  select('fw');

  // interação: arrastar para girar, clicar para selecionar
  let rotY=-.35, rotX=.12, dragging=false, moved=0, lx=0, ly=0, idle=0;
  stage.addEventListener('pointerdown',e=>{dragging=true;moved=0;lx=e.clientX;ly=e.clientY;stage.setPointerCapture(e.pointerId);});
  stage.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lx,dy=e.clientY-ly;moved+=Math.abs(dx)+Math.abs(dy);rotY+=dx*.006;rotX=Math.max(-.3,Math.min(.6,rotX+dy*.004));lx=e.clientX;ly=e.clientY;idle=0;});
  const ray=new THREE.Raycaster(), m2=new THREE.Vector2();
  stage.addEventListener('pointercancel',()=>{dragging=false;});
  stage.addEventListener('pointerup',e=>{dragging=false;if(moved>6)return;
    const r=canvas.getBoundingClientRect(); m2.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
    ray.setFromCamera(m2,camera); const hit=ray.intersectObjects(meshes,false)[0]; if(hit) select(hit.object.userData.key);});

  function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;
    camera.position.z=w<560?17:13; camera.updateProjectionMatrix();}
  addEventListener('resize',()=>{if(running)resize();});

  let running=false, raf=0; const clock=new THREE.Clock(), tmp=new THREE.Vector3();
  function frame(){
    const t=clock.getElapsedTime(); idle+=1;
    if(!dragging&&idle>120&&!RM) rotY+=.0015;
    G.rotation.set(rotX,rotY,0);
    packets.forEach(p=>{p.t+=RM?0:p.v*1.6;placePacket(p);});
    waves.forEach(w=>{const k=((t*.6+w.userData.o)%1);w.scale.setScalar(1+k*2.2);w.material.opacity=(1-k)*.6;});
    NODES.isp1.mesh.rotation.y=t*.4; NODES.isp2.mesh.rotation.y=-t*.4;
    renderer.render(scene,camera);
    const w=stage.clientWidth,h=stage.clientHeight;
    for(const n of Object.values(NODES)){
      n.mesh.getWorldPosition(tmp); tmp.y+=.45; tmp.project(camera);
      n.el.style.left=((tmp.x+1)/2*w)+'px'; n.el.style.top=((1-tmp.y)/2*h)+'px';
    }
    if(running) raf=requestAnimationFrame(frame);
  }
  return {
    start(){if(running)return;running=true;requestAnimationFrame(()=>{resize();frame();});},
    stop(){running=false;cancelAnimationFrame(raf);}
  };
})();

go();
})();
