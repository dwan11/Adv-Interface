/* Five Tones · Week 2: data, banner markup and interactions for the five tone sets. */
const ICONS={
  grid:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>',
  home:'<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  star:'<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>'
};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">${ICONS[n]}</svg>`;
const SETS=[
 {cls:'t-playful',name:'Playful',el:'Gravity',colors:['#FFEFC2','#2A1A47','#FF4F8B','#2EC4B6'],
  dot:{mode:'arrive'},content:{mode:'send',start:2,btn:'+1'},
  plain:{mode:'press',text:'Tuck it away'},rich:{mode:'coach',rt:'Psst!',rb:'Drag anything here to snooze it.',ra:'Show me'}},
 {cls:'t-future',name:'Futuristic',el:'Line',colors:['#060A12','#BDEFFF','#00E5FF','#FF2E88'],
  dot:{mode:'key',key:'s'},content:{mode:'live'},
  plain:{mode:'dwell',text:'Cold storage'},rich:{mode:'keytip',key:'h',rt:'SYNC',rb:'Link to 2 nearby nodes.',ra:'Initiate'}},
 {cls:'t-elegant',name:'Elegant',el:'Space',colors:['#1C2B26','#ECE4D3','#C8A76A','#243630'],
  dot:{mode:'inview'},content:{mode:'visit'},
  plain:{mode:'hover',delay:700,text:'Set aside'},rich:{mode:'toggletip',rt:'The Collection',rb:'Pieces kept for later.',ra:'Explore'}},
 {cls:'t-raw',name:'Raw',el:'Size',colors:['#E3E3DE','#000000','#1F3BFF','#FFFFFF'],
  dot:{mode:'click'},content:{mode:'dragaway',content:'12'},
  plain:{mode:'follow',text:'Archive'},rich:{mode:'timed',rt:'Shared.',rb:'Anyone with the link can edit.',ra:'Turn off'}},
 {cls:'t-retro',name:'Nostalgic',el:'Texture',colors:['#0B7A75','#C0C0C0','#000080','#FFFFE1'],
  dot:{mode:'dbl'},content:{mode:'drop'},
  plain:{mode:'hover',delay:600,text:'Move to Archive'},rich:{mode:'whatsthis',rt:'Tip',rb:'Drag files onto the Briefcase to sync.',ra:'OK'}}
];
let uid=0;
/* Each part lives in a banner of five icons. One slot is live; the other four are plain. */
const ROW=['home','grid','mail','star','user'];
const slot=n=>`<span class="slot"><span class="anchor" aria-hidden="true">${icon(n)}</span></span>`;
const banner=(live,html)=>`<div class="dock">${ROW.map((n,i)=>i===live?html:slot(n)).join('')}</div>`;
const LABEL={dot:'Badge',content:'Badge · count',plain:'Tooltip',rich:'Tooltip · rich'};
const badgeCell=(s,which)=>{const c=s[which],live=which==='dot'?1:2;return `
 <div class="cell"><div class="cell-label">${LABEL[which]}</div>
  <div class="stage badge-stage">${banner(live,`<div class="bw m-${c.mode}" data-set="${s.cls}" data-which="${which}">
    <button class="anchor" aria-label="${which==='dot'?'Grid':'Mail'}">${icon(ROW[live])}</button><span class="badge ${which}" aria-hidden="true"></span></div>`)}
   <div class="ctrl"></div></div></div>`};
const tipCell=(s,rich)=>{const c=rich?s.rich:s.plain,id='tip'+(++uid),ic=rich?'help':'archive';return `
 <div class="cell"><div class="cell-label">${LABEL[rich?'rich':'plain']}</div>
  <div class="stage">${banner(2,`<div class="tw ${rich?'rich':'plain'} m-${c.mode}" data-set="${s.cls}" data-which="${rich?'rich':'plain'}">
   <span class="ring" aria-hidden="true"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="36"/></svg></span>
   <button class="anchor" aria-describedby="${id}" aria-label="${rich?'Help':'Archive'}">${icon(ic)}</button>
   <div class="pop"><div class="hang"><span class="stem" aria-hidden="true"></span>${rich
     ?`<div class="tip rich" id="${id}" role="dialog" aria-label="${c.rt}"><div class="rt-title">${c.rt}</div><div class="rt-body"><p>${c.rb}</p><button class="rt-act">${c.ra}</button>${c.mode==='timed'?'<div class="bar"></div>':''}</div></div>`
     :`<div class="tip plain" id="${id}" role="tooltip">${c.text}</div>`}</div></div></div>`)}
  <div class="ctrl"></div></div></div>`};
const setHTML=s=>`
 <section class="set ${s.cls}" id="${s.name.toLowerCase()}" aria-label="${s.name}">
  <div class="set-head"><h2 class="set-name">${s.name}</h2><span class="el-chip">${s.el}</span></div>
  <div class="sys"><div class="sw">${s.colors.map(c=>`<span style="background:${c}"></span>`).join('')}</div></div>
  <div class="grid">${badgeCell(s,'dot')}${badgeCell(s,'content')}${tipCell(s,false)}${tipCell(s,true)}</div>
 </section>`;
document.getElementById('setlist').innerHTML=SETS.map(setHTML).join('');

/* ---------- helpers ---------- */
const KEYS={},ESC=[];
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey||/input|textarea|select/i.test(e.target.tagName))return;
  if(e.key==='Escape'){ESC.forEach(f=>f());return}
  (KEYS[e.key.toLowerCase()]||[]).forEach(f=>f());
});
const onKey=(k,f)=>(KEYS[k]=KEYS[k]||[]).push(f);
const btn=(ctrl,html,f)=>{const b=document.createElement('button');b.className='ctl';b.innerHTML=html;b.addEventListener('click',f);ctrl.appendChild(b);return b};
const cfgOf=el=>SETS.find(s=>s.cls===el.dataset.set)[el.dataset.which];
const inView=(el,f)=>new IntersectionObserver(es=>es.forEach(e=>f(e.isIntersecting)),{threshold:.6}).observe(el);

/* ---------- badges ---------- */
document.querySelectorAll('.setlist .bw').forEach(w=>{
  const c=cfgOf(w),a=w.querySelector('.anchor'),b=w.querySelector('.badge'),stage=w.closest('.stage'),ctrl=stage.querySelector('.ctrl');
  const isDot=w.dataset.which==='dot';
  const tgt=b.querySelector('.num')||(b.querySelector('svg')?null:b);
  const set=(on,txt)=>{const was=w.classList.contains('on'),prev=tgt?tgt.textContent:'';if(txt!==undefined&&tgt)tgt.textContent=txt;if(on&&was&&txt!==undefined&&txt!==prev){b.style.animation='none';b.classList.remove('bump');void b.offsetWidth;b.style.animation='';b.classList.add('bump')}if(on&&!was){w.classList.add('pre');void w.offsetWidth;w.classList.remove('pre')}w.classList.toggle('on',on);
    a.setAttribute('aria-label',(isDot?'Grid':'Mail')+(on?(isDot?', has updates':`, ${tgt?tgt.textContent:''} new`):''))};
  const on=()=>w.classList.contains('on');
  let t,n=0;
  const defaultTxt={'t-playful':'3','t-future':'03','t-elegant':'New','t-raw':'12','t-retro':'3'}[w.dataset.set];
  switch(c.mode){
    case 'click': set(true,isDot?'':defaultTxt); a.onclick=()=>set(!on()); break;
    case 'arrive': set(false,''); t=setTimeout(()=>set(true),1500);
      a.onclick=()=>{if(on()){set(false);clearTimeout(t);t=setTimeout(()=>set(true),2500)}}; break;
    case 'send': n=c.start||0; set(n>0,String(n));
      btn(ctrl,c.btn||'Send sticker',()=>{n++;set(true,n>9?'9+':String(n))});
      a.onclick=()=>{n=0;set(false)}; break;
    case 'key': set(false,isDot?'':defaultTxt);
      const press=()=>set(true); onKey(c.key,press);
      btn(ctrl,`<kbd>${c.key.toUpperCase()}</kbd>`,press);
      a.onclick=()=>set(false); break;
    case 'live': n=1; set(true,'01');
      setInterval(()=>{if(on()){n++;set(true,n>99?'99+':String(n).padStart(2,'0'))}},1800);
      a.onclick=()=>{if(!on())return;set(false);n=0;clearTimeout(t);t=setTimeout(()=>{n=1;set(true,'01')},3000)}; break;
    case 'inview': { set(false,''); let armed=true;
      inView(w,vis=>{if(vis&&armed){clearTimeout(t);t=setTimeout(()=>set(true),700)} if(!vis)armed=true});
      const seen=()=>{if(on()){armed=false;clearTimeout(t);t=setTimeout(()=>set(false),450)}};
      a.addEventListener('mouseenter',seen);a.addEventListener('focus',seen);
      btn(ctrl,'Replay',()=>set(true)); break; }
    case 'visit': { set(true,defaultTxt); let entered=false;
      a.addEventListener('mouseenter',()=>entered=true);a.addEventListener('focus',()=>entered=true);
      const leave=()=>{if(entered&&on())set(false);entered=false};
      a.addEventListener('mouseleave',leave);a.addEventListener('blur',leave);
      btn(ctrl,'Replay',()=>set(true)); break; }
    case 'dragaway': { set(false,c.content||defaultTxt); t=setTimeout(()=>set(true),1200);
      let sx,sy,drag=false;
      b.addEventListener('pointerdown',e=>{if(!on())return;drag=true;sx=e.clientX;sy=e.clientY;b.setPointerCapture(e.pointerId);w.classList.add('dragging')});
      b.addEventListener('pointermove',e=>{if(drag)b.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px)`});
      const end=e=>{if(!drag)return;drag=false;w.classList.remove('dragging');b.style.transform='';
        if(Math.hypot(e.clientX-sx,e.clientY-sy)>40){set(false);clearTimeout(t);t=setTimeout(()=>set(true),2000)}};
      b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
      a.onclick=()=>{}; break; }
    case 'dbl': set(true,''); a.ondblclick=()=>set(!on());
      a.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();set(!on())}}); break;
    case 'drop': { n=0; set(false,'');
      const f=btn(ctrl,'♪ file',()=>{n++;set(true,String(n))});
      f.classList.add('file');f.draggable=true;f.title='Drag onto the icon (or click)';
      f.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','track');e.dataTransfer.effectAllowed='copy'});
      a.addEventListener('dragover',e=>{e.preventDefault();w.classList.add('drop')});
      a.addEventListener('dragleave',()=>w.classList.remove('drop'));
      a.addEventListener('drop',e=>{e.preventDefault();w.classList.remove('drop');n++;set(true,String(n))});
      a.onclick=()=>{n=0;set(false)}; break; }
  }
});

/* ---------- tooltips ---------- */
document.querySelectorAll('.setlist .tw').forEach(w=>{
  const c=cfgOf(w),a=w.querySelector('.anchor'),pop=w.querySelector('.pop'),act=w.querySelector('.rt-act'),stage=w.closest('.stage'),ctrl=stage.querySelector('.ctrl');
  const show=()=>w.classList.add('show'),hide=()=>{w.classList.remove('show','dwelling','timing')};
  const kbFocus=()=>a.matches(':focus-visible');
  let t;
  switch(c.mode){
    case 'hover':
      a.addEventListener('mouseenter',()=>{clearTimeout(t);t=setTimeout(show,c.delay||250)});
      a.addEventListener('mouseleave',()=>{clearTimeout(t);hide()});
      a.addEventListener('focus',()=>{if(kbFocus())show()});a.addEventListener('blur',hide); break;
    case 'press':
      a.addEventListener('pointerdown',show);
      ['pointerup','pointerleave','pointercancel'].forEach(ev=>a.addEventListener(ev,hide));
      a.addEventListener('contextmenu',e=>e.preventDefault());
      a.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();show()}});
      a.addEventListener('keyup',hide);a.addEventListener('blur',hide); break;
    case 'dwell':
      a.addEventListener('mouseenter',()=>{w.classList.add('dwelling');clearTimeout(t);t=setTimeout(show,900)});
      a.addEventListener('mouseleave',()=>{clearTimeout(t);hide()});
      a.addEventListener('focus',()=>{if(kbFocus())show()});a.addEventListener('blur',hide); break;
    case 'follow':
      a.addEventListener('mousemove',e=>{const r=w.getBoundingClientRect();w.classList.add('following');
        pop.style.left=(e.clientX-r.left+14)+'px';pop.style.top=(e.clientY-r.top+18)+'px';show()});
      a.addEventListener('mouseleave',()=>{hide();w.classList.remove('following');pop.style.left=pop.style.top=''});
      a.addEventListener('focus',()=>{if(kbFocus())show()});a.addEventListener('blur',hide); break;
    case 'coach': { let done=false;
      inView(w,vis=>{if(vis&&!done){clearTimeout(t);t=setTimeout(show,900)}});
      act.onclick=()=>{done=true;hide()};
      a.onclick=()=>w.classList.toggle('show');
      btn(ctrl,'Replay',()=>{done=false;show()}); break; }
    case 'keytip': {
      const tog=()=>w.classList.toggle('show');
      onKey(c.key,tog);ESC.push(hide);
      btn(ctrl,`<kbd>${c.key.toUpperCase()}</kbd>`,tog);
      a.onclick=tog;act.onclick=hide; break; }
    case 'near': { const R=100;
      stage.addEventListener('mousemove',e=>{const r=a.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));
        if(d<R){w.style.setProperty('--near',Math.max(.15,Math.min(1,(R-d)/(R-40))).toFixed(2));show()}else hide()});
      stage.addEventListener('mouseleave',hide);
      a.addEventListener('focus',()=>{w.style.setProperty('--near',1);show()});a.addEventListener('blur',hide); break; }
    case 'toggletip':
      a.onclick=e=>{e.stopPropagation();w.classList.toggle('show')};
      document.addEventListener('click',e=>{if(!w.contains(e.target))hide()});
      ESC.push(hide);act.onclick=hide; break;
    case 'timed':
      a.onclick=()=>{clearTimeout(t);w.classList.remove('timing');void w.offsetWidth;show();w.classList.add('timing');t=setTimeout(hide,4000)};
      act.onclick=()=>{clearTimeout(t);hide()};ESC.push(hide); break;
    case 'whatsthis': {
      const h=btn(ctrl,'?',()=>{stage.classList.toggle('helpmode')});
      a.onclick=()=>{if(stage.classList.contains('helpmode')){stage.classList.remove('helpmode');show()}};
      act.onclick=hide;ESC.push(()=>{hide();stage.classList.remove('helpmode')}); break; }
  }
});
