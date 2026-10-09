/* Two material systems share one geometry, state and persistence model. */
const SETS={
  tide:{name:'Tidal glass',number:'03',tone:'Serene',context:'Personal evening ritual settings: independent sensory options and one session duration.',switch:'Quiet session',checks:['Candlelight','Rain sounds','Botanical steam'],radios:['10 minutes','20 minutes','30 minutes'],longChecks:['Warm candlelight throughout the evening ritual','Gentle rain sounds in the background','Botanical steam with a subtle cedar scent'],longRadios:['10 minutes · a short pause','20 minutes · time to unwind','30 minutes · an extended evening ritual']},
  console:{name:'Night console',number:'04',tone:'Rugged',context:'A personal music player: continuous playback, independent sound processing options, and one sound profile.',switch:'Continuous play',checks:['Bass warmth','Level balancing','Noise filter'],radios:['Original','Warm','Bright'],longChecks:['Add subtle warmth to low-frequency audio','Balance volume between tracks in the queue','Reduce background noise during playback'],longRadios:['Original · preserve the recording','Warm · a softer listening profile','Bright · emphasize upper frequencies']}
};
const STORAGE_KEY='week3-material-selectors-v3';
const memories={};
const review={tide:{state:'live',long:false},console:{state:'live',long:false}};
const svg=(body,box='0 0 30 30')=>`<svg viewBox="${box}" aria-hidden="true" focusable="false">${body}</svg>`;
function normalize(value){return {on:typeof value?.on==='boolean'?value.on:false,checks:[0,1,2].map(i=>typeof value?.checks?.[i]==='boolean'?value.checks[i]:i===0),radio:Number.isInteger(value?.radio)&&value.radio>=0&&value.radio<3?value.radio:1};}
function restore(){let saved;try{saved=JSON.parse(localStorage.getItem(STORAGE_KEY))}catch{}for(const key of Object.keys(SETS))memories[key]=normalize(saved?.[key]);}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(memories))}catch{/* The controls also work when browser storage is unavailable. */}}
function control(kind,key,index=0){
const uid=`${key}-${kind}-${index}`;
if(key==='console'){
if(kind==='switch')return `<span class="graphic switch mechanical" aria-hidden="true"><span class="knob"><span class="grip"></span></span><span class="contact"></span></span>`;
if(kind==='check')return `<span class="graphic check mechanical" aria-hidden="true"><span class="socket"><span class="cap">${svg('<path class="check-path check-bevel" d="M8 14 L12 18 L20 9"/><path class="check-path check-recess" d="M8 14 L12 18 L20 9"/>','0 0 28 28')}<span class="cap-grip"></span></span></span><span class="contact"></span></span>`;
if(kind==='radio')return `<span class="graphic radio mechanical" aria-hidden="true"><span class="flange"><span class="dial-cap"><span class="dial-grip"></span></span></span><span class="contact"></span></span>`;
}
if(kind==='switch')return `<span class="graphic switch" aria-hidden="true"><span class="onoff"><span>ON</span><span>OFF</span></span><span class="knob"></span></span>`;
if(kind==='check'){
let body='';const check='<path class="check-path" d="M8 14 L12 18 L20 9"/>';
if(key==='tide')body=`<defs><clipPath id="${uid}-clip"><rect x="2" y="2" width="24" height="24" rx="7"/></clipPath></defs><rect class="well" x="2" y="2" width="24" height="24" rx="7"/><g clip-path="url(#${uid}-clip)"><path class="water" d="M0 5 Q7 0 14 4 T28 3 L28 29 H0Z"/></g>${check}`;
if(key==='console')body=`<rect class="well" x="2" y="2" width="24" height="24" rx="3"/><rect class="plunger" x="5" y="5" width="18" height="18" rx="2"/>${check}`;
return `<span class="graphic check">${svg(body,'0 0 28 28')}</span>`;}
let body='';if(key==='tide')body='<circle class="selection-wave" cx="15" cy="15" r="14"/><circle class="ripple-ring" cx="15" cy="15" r="14"/><circle class="ripple-ring" cx="15" cy="15" r="10"/><circle class="ripple-ring" cx="15" cy="15" r="6"/><circle class="core" cx="15" cy="15" r="5"/>';
if(key==='console')body='<circle class="rim" cx="15" cy="15" r="13"/><path stroke="#6b7c5d" stroke-width=".8" d="M7 8L9 10 M15 4V7 M23 8L21 10"/><path class="needle" d="M15 15V7"/><circle class="core" cx="15" cy="15" r="3"/>';

return `<span class="graphic radio">${svg(body)}</span>`;
}function row(key,label,type,index,checked){
  const id=`${key}-${type}-${index}`,isSwitch=type==='switch';
  return `<label class="row ${isSwitch?'switch-row':''}" for="${id}"><input id="${id}" type="${type==='radio'?'radio':'checkbox'}" ${isSwitch?'role="switch"':''} name="${type==='radio'?key+'-profile':id}" data-kind="${type}" data-index="${index}" value="${type==='radio'?(key==='tide'?[10,20,30]:['original','warm','bright'])[index]:type==='switch'?'enabled':index}" ${checked?'checked':''}>
  ${isSwitch?'':control(type,key,index)}<span class="text"><span class="label-text">${label}</span>${isSwitch?`<small class="switch-state" aria-hidden="true">${checked?'On':'Off'}</small>`:''}</span>${isSwitch?control(type,key,index):''}</label>`;
}
function specifications(key){return `<dl>
<dt>Context</dt><dd>${SETS[key].context}</dd>
<dt>Anchors</dt><dd>Fixed control column: ${key==='console'?'96':'40'}px. Each face is centered within it. Text has a separate flexible column; selection never changes row height. Labels have a small material-specific displacement within their reserved space.</dd>
<dt>Spacing</dt><dd>${key==='console'?'28px panel inset, 18px control-to-label gap, 76px minimum row, 92px switch row; below 350px, inset is 20px.':'28px panel inset, 16px control-to-label gap, 64px minimum row; below 760px, inset is 24px; below 350px, 20px.'} 28px between groups. Long labels wrap.</dd>
<dt>Type</dt><dd>${key==='console'?'Space Grotesk':'DM Sans'} 14px / 20px, weight 500. Section labels: IBM Plex Mono 10px / 16px with 1.1px tracking.</dd>
<dt>Geometry</dt><dd>${key==='console'?'Mounting column 96 × 64px. Rotary face Ø56px; grip 13 × 44px, r9. Square socket 46 × 48px, r12; cap inset 2px, r10. Radio flange Ø52px; face inset 1px. Indicator Ø10px. Housing r28.':'Switch 76 × 38px, r22; thumb 30 × 30px, 4px inset. Checkbox 28 × 28px, r7. Radio 30 × 30px; dot Ø10px anchored at (15,15).'} All centers are fixed; only the specified face moves.</dd>
<dt>Material</dt><dd>${key==='console'?'Warm gray textured housing, ivory molded controls and orange selected radio faces. One upper-left key light; soft shadows fall down and right. Recessed orange lamps indicate engaged contacts.':'Translucent mineral glass with one upper-left key light. Thin bright upper rims, soft lower shadows. The track, square and circular inset share the same olive depth and edge finish.'}</dd>
<dt>Motion</dt><dd>${key==='console'?'Hover lifts faces to 104.5% over 260ms and nudges grips. Press compresses to 90% over 85ms. Selection turns grips over 560ms with a slight overshoot; release turns back over 320ms. Lamps engage after 160ms and label highlights spread over 520ms. The label compresses subtly around its fixed center and the plate seats over 180ms; the contact illuminates after the mechanical travel.':'The lens rolls over 620ms; liquid rises over 560ms; the check resolves after 150ms. The wash expands over 680ms, the label floats upward 2px over 620ms, and the radio ring expands over 700ms.'} Native state updates immediately. Text moves only within its reserved space. Reversals continue from the current visual position; no animation queue. Reduced motion applies the final state immediately.</dd>
<dt>States</dt><dd>Default, hover, pressed, selected, focus, disabled and error. Selected + hover keeps the selection surface. Focus uses an outline; disabled blocks native input; errors use text and a symbol. Review below previews each state.</dd>
<dt>Persistence</dt><dd>Selections save locally. Restored state appears without an entrance animation. Radio groups remain independent; no row depends on another set.</dd>
<dt>References</dt><dd><a href="https://www.inspora.design/posts/soft-glass-workspace-picker">Inspora: soft glass workspace picker</a> — distinct selected surface with a steady label. <a href="https://refero.design/search">Refero</a> — product previews; detailed screens required sign-in.</dd>
</dl>`;}
function reviewMarkup(key){return `<details class="component-review"><summary>State review</summary><div class="review-tools"><label>Preview state <select data-preview="${key}"><option value="live">Live interaction</option><option value="hover">Hovered</option><option value="pressed">Pressed</option><option value="focus">Keyboard focus</option><option value="disabled">Disabled</option><option value="error">Save error</option></select></label><label class="long-label-toggle"><input type="checkbox" data-long="${key}"> Test longer labels</label></div></details>`;}
function render(){
  document.querySelector('#prototype').innerHTML=Object.entries(SETS).filter(([key])=>!document.body.dataset.set||document.body.dataset.set===key).map(([key,d])=>{const s=memories[key];return `<section class="component-set"><div class="set-caption"><span>${d.number}</span><h1>${d.name}</h1><span>${d.tone.toUpperCase()}</span></div><div class="device ${key} restoring" data-key="${key}" data-on="${s.on}" data-preview="live"><div class="content"><div class="group-label"><span>SWITCH</span><span>on / off</span></div>${row(key,d.switch,'switch',0,s.on)}<fieldset class="control-group"><legend>CHECKBOXES / choose any</legend>${d.checks.map((label,i)=>row(key,label,'check',i,s.checks[i])).join('')}</fieldset><fieldset class="control-group"><legend>RADIO BUTTONS / choose one</legend>${d.radios.map((label,i)=>row(key,label,'radio',i,s.radio===i)).join('')}</fieldset><p class="error-message" id="${key}-error" hidden><span aria-hidden="true">!</span> Couldn’t save these settings. Your selections are kept.</p></div></div><details class="component-specs"><summary>System & specifications</summary>${specifications(key)}</details>${reviewMarkup(key)}</section>`}).join('');
  document.querySelectorAll('.device input').forEach(input=>input.addEventListener('change',()=>{const device=input.closest('.device'),key=device.dataset.key,s=memories[key],kind=input.dataset.kind,i=Number(input.dataset.index);if(kind==='switch')s.on=input.checked;else if(kind==='check')s.checks[i]=input.checked;else s.radio=i;device.dataset.on=String(s.on);device.querySelector('.switch-state').textContent=s.on?'On':'Off';persist();}));
  document.querySelectorAll('[data-preview]').forEach(select=>{if(select.tagName!=='SELECT')return;select.value=review[select.dataset.preview].state;select.addEventListener('change',()=>{review[select.dataset.preview].state=select.value;applyReview(select.dataset.preview);});});
  document.querySelectorAll('[data-long]').forEach(input=>{input.checked=review[input.dataset.long].long;input.addEventListener('change',()=>{review[input.dataset.long].long=input.checked;applyReview(input.dataset.long);});});
  document.querySelectorAll('.console .row input').forEach(input=>{
    const row=input.closest('.row');
    input.addEventListener('keydown',e=>{if(e.code==='Space'&&!input.disabled)row.dataset.press='true';});
    input.addEventListener('keyup',()=>delete row.dataset.press);
    input.addEventListener('blur',()=>delete row.dataset.press);
  });
  for(const key of Object.keys(SETS))if(document.querySelector(`.device[data-key="${key}"]`))applyReview(key);
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll('.restoring').forEach(el=>el.classList.remove('restoring'))));
}
function applyReview(key){const device=document.querySelector(`.device[data-key="${key}"]`),r=review[key],d=SETS[key];device.dataset.preview=r.state;device.querySelectorAll('input').forEach(input=>{input.disabled=r.state==='disabled';if(r.state==='error'){input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',`${key}-error`);}else{input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');}const type=input.dataset.kind,i=Number(input.dataset.index);input.closest('.row').querySelector('.label-text').textContent=type==='switch'?d.switch:type==='check'?(r.long?d.longChecks:d.checks)[i]:(r.long?d.longRadios:d.radios)[i];});const error=device.querySelector('.error-message');error.hidden=r.state!=='error';if(r.state==='error')error.setAttribute('role','alert');else error.removeAttribute('role');}
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY){restore();render();}});
restore();render();
