/* Week 2 · Meadow badges & tooltips
   One engine, three tones. Each page sets <body data-set="bloom|dandelion|firefly">.
   Every component has two states (shown in the pill above it) and is driven by
   interactions other than plain click / hover. */
(function () {
  const SET = document.body.dataset.set;
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- drawing ---------- */
  const ICON = {
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>'
  };
  function grass() {
    const B = [[7,20,-3,'#5E8C45',3.1,-.4],[12,27,-5,'#3F6B30',2.6,-1.2],[17,22,2,'#6E9A4B',3.4,-2],[22,31,-2,'#355E2B',2.9,-.8],[27,24,3,'#5E8C45',3.6,-1.6],
               [31,30,2,'#3F6B30',3.0,-.2],[36,23,-2,'#6E9A4B',2.7,-2.4],[41,29,5,'#355E2B',3.3,-1],[46,21,3,'#5E8C45',2.8,-1.8],[50,17,4,'#6E9A4B',3.5,-.6]];
    const blade = ([x,h,dx,c,d,dl]) => `<path class="bl" style="--d:${d}s;--dl:${dl}s" fill="${c}" d="M${x-1.9} 56 Q${x+dx*.25} ${56-h*.6} ${x+dx} ${56-h} Q${x+dx*.25+1.3} ${56-h*.55} ${x+1.9} 56Z"/>`;
    return `<svg class="grass" viewBox="0 0 56 56" aria-hidden="true"><g class="gl">${B.filter(b=>b[0]<28).map(blade).join('')}</g><g class="gr">${B.filter(b=>b[0]>=28).map(blade).join('')}</g></svg>`;
  }
  const anchor = (g, label) => `<button class="anchor" aria-label="${label}">${grass()}<span class="glyph"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[g]}</svg></span></button>`;
  const bare = (g, label) => `<button class="anchor bare" aria-label="${label}"><span class="glyph"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[g]}</svg></span></button>`;
  const tAnchor = (g, l) => SET === 'firefly' ? bare(g, l) : anchor(g, l);
  const RING = '<span class="ring" aria-hidden="true"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="36"/></svg></span>';

  function flower(big) {
    const cx = big ? 55 : 52, cy = big ? -2 : 2, rx = big ? 4.6 : 3.2, ry = big ? 7.8 : 5.4, off = big ? -8 : -5.2;
    const p = [0,72,144,216,288].map(a => `<ellipse class="petal" cx="0" cy="${off}" rx="${rx}" ry="${ry}" transform="rotate(${a})"/>`).join('');
    return `<svg viewBox="0 -14 72 70" aria-hidden="true"><path class="bstem" d="M44 56 Q${cx-3} 28 ${cx} ${cy+4}"/><g transform="translate(${cx} ${cy})"><g class="petals">${p}<circle class="pollen" r="${big?8.4:2.7}"/>${big?'<text class="num" y=".5">2</text>':''}</g></g></svg>`;
  }
  function puff(big) {
    const cx = big ? 55 : 52, cy = big ? -2 : 2, R = big ? 13 : 9;
    const seeds = [...Array(14)].map((_, i) => {
      const a = i / 14 * Math.PI * 2, x = (Math.cos(a) * R).toFixed(2), y = (Math.sin(a) * R).toFixed(2);
      const dx = (30 + ((i * 37) % 50)) + 'px', dy = (-25 - ((i * 53) % 45)) + 'px';
      return `<g class="sd" style="--dx:${dx};--dy:${dy};--i:${i}"><line x1="0" y1="0" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r="1.2"/></g>`;
    }).join('');
    return `<svg viewBox="0 -14 72 70" aria-hidden="true"><path class="bstem" d="M44 56 Q${cx-3} 28 ${cx} ${cy+R-2}"/><g transform="translate(${cx} ${cy})">${seeds}<circle class="pcore" r="2.4"/>${big?'<circle class="pface" r="7.6"/><text class="num" y=".4">3</text>':''}</g></svg>`;
  }
  const CHUTE = `<svg class="chute" viewBox="0 0 64 32" aria-hidden="true">${[...Array(11)].map((_, i) => { const a = Math.PI * (1.08 + i * 0.084), x = (32 + Math.cos(a) * 28).toFixed(1), y = (30 + Math.sin(a) * 26).toFixed(1); return `<line x1="32" y1="30" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r="1.1"/>`; }).join('')}<line x1="32" y1="30" x2="32" y2="34"/></svg>`;

  /* ---------- content per tone (components, states, triggers only) ---------- */
  const DATA = {
    bloom: { tone: 'Playful', name: 'Bloom',
      dot:   { in: 'wait', out: 'double-click' },
      count: { in: 'drag a seed in', out: 'drag down' },
      plain: { in: 'hover · or hold', out: 'leave', text: 'Tuck this away' },
      rich:  { in: 'hover · or pull up', out: 'leave · push down', title: 'Your garden is growing', body: 'Every unread note is a bud.', act: 'Got it' } },
    dandelion: { tone: 'Playful', name: 'Dandelion',
      dot:   { in: 'scroll to it', out: 'flick' },
      count: { in: 'wiggle', out: 'flick' },
      plain: { in: 'hover · or scroll', out: 'leave', text: 'Blow it away for now' },
      rich:  { in: 'hover · or hold', out: 'leave · swipe away', title: 'Make a wish', body: 'Send a seed to someone far away.', act: 'Make a wish' } },
    firefly: { tone: 'Intimate', name: 'Firefly',
      dot:   { in: 'be still', out: 'come close' },
      count: { in: 'wait', out: 'hold (cup)' },
      plain: { in: 'firefly lands', out: 'flies off', text: 'keep this for later' },
      rich:  { in: 'firefly lands', out: 'flies off', title: 'a note, just for you', body: 'Only you can see it.', act: 'keep it close' } }
  }[SET];

  const STAGE = { bloom: { tip: 'up' }, dandelion: { tip: 'down' }, firefly: { tip: 'down' } }[SET];
  const badgeSVG = big => SET === 'bloom' ? flower(big) : SET === 'dandelion' ? puff(big) : (big ? '<span class="num">0</span>' : '');

  function card(key, label, states, stageCls, inner, d) {
    return `<article class="card" data-k="${key}">
      <div class="lab">${label}</div>
      <div class="seg" role="group" aria-label="${label} state"><button aria-pressed="true">${states[0]}</button><button aria-pressed="false">${states[1]}</button></div>
      <div class="stage ${stageCls}">${inner}</div>
      <div class="trig"><span><i>in</i>${d.in}</span><span><i>out</i>${d.out}</span></div>
    </article>`;
  }
  const tipPlain = d => `<div class="tw plain">${RING}${tAnchor('archive','Archive')}<div class="pop"><div class="hang"><span class="stem"></span><div class="tip plain" role="tooltip">${d.text}</div></div></div></div>`;
  const tipRich = d => `<div class="tw rich">${RING}${tAnchor('help','Help')}<div class="pop"><div class="hang">${SET==='bloom'?`<div class="petal-wrap" aria-hidden="true">${[-78,-52,-26,0,26,52,78].map((a,i)=>`<span style="--a:${a}deg;--i:${i}"></span>`).join('')}</div>`:''}<span class="stem"></span>${SET==='dandelion'?CHUTE:''}<div class="tip rich" role="dialog" aria-label="${d.title}"><b>${d.title}</b><p>${d.body}</p><button class="act">${d.act}</button></div></div></div></div>`;
  const badgeW = (key, g, label) => `<div class="bw">${RING}${anchor(g,label)}<span class="badge ${key}" aria-hidden="true">${badgeSVG(key==='count')}</span></div>`;

  document.title = `${DATA.name} · Week 2`;
  document.getElementById('app').innerHTML = `
    <header><a class="back" href="../../" aria-label="All projects">←</a><h1>${DATA.name}</h1><span class="tone">${DATA.tone}</span></header>
    <div class="grid">
      ${card('dot', 'Badge · no content', ['None','Badge'], '', badgeW('dot','grid','Rooms') + (SET==='firefly'?'<span class="halo" style="--r:140px"></span>':''), DATA.dot)}
      ${card('count', 'Badge · content', ['None','Badge'], '', badgeW('count','mail','Mail') + (SET==='bloom'?'<button class="chip" aria-label="Seed: drag onto the grass"><span class="seed"></span></button>':''), DATA.count)}
      ${card('plain', 'Tooltip · plain', ['Default','Open'], STAGE.tip, tipPlain(DATA.plain) + (SET==='firefly'?'<span class="ff" aria-hidden="true"></span>':''), DATA.plain)}
      ${card('rich', 'Tooltip · rich', ['Default','Open'], STAGE.tip, tipRich(DATA.rich) + (SET==='firefly'?'<span class="ff" aria-hidden="true"></span>':''), DATA.rich)}
    </div>`;

  /* ---------- state plumbing ---------- */
  function ctl(key, onSel) {
    const c = $(`.card[data-k="${key}"]`), segs = [...c.querySelectorAll('.seg button')];
    const w = c.querySelector('.bw, .tw'), cls = w.classList.contains('bw') ? 'on' : 'show';
    const api = {
      c, w, a: w.querySelector('.anchor'), stage: c.querySelector('.stage'),
      on: () => w.classList.contains(cls),
      set(v) {
        if (!v && api.busy) return;   // a closing animation is playing; it closes itself when done
        const was = api.on();
        if (v && !was && cls === 'on') { w.classList.add('pre'); void w.offsetWidth; w.classList.remove('pre'); }
        w.classList.toggle(cls, v);
        segs[0].setAttribute('aria-pressed', String(!v)); segs[1].setAttribute('aria-pressed', String(v));
        if (cls === 'show' && SET === 'firefly') api.a.classList.toggle('lit', v);
      }
    };
    segs.forEach((b, i) => b.addEventListener('click', () => (onSel ? onSel(!!i) : api.set(!!i))));
    return api;
  }
  function setNum(api, n) {
    const t = api.w.querySelector('.num'), b = api.w.querySelector('.badge');
    if (t) t.textContent = n > 99 ? '99+' : String(n);
    if (api.on()) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const dist = (el, x, y) => { const [cx, cy] = center(el); return Math.hypot(x - cx, y - cy); };
  const ESC = []; document.addEventListener('keydown', e => { if (e.key === 'Escape') ESC.forEach(f => f()); });
  function hold(api, ms, onDone) {
    let t, done = false;
    api.w.style.setProperty('--hold', ms / 1000 + 's');
    const start = e => { done = false; api.w.classList.add('holding'); t = setTimeout(() => { done = true; api.w.classList.remove('holding'); onDone(); }, ms); };
    const stop = () => { clearTimeout(t); api.w.classList.remove('holding'); return done; };
    return { start, stop };
  }
  // brief: anchor default -> anchor hovered -> tooltip. Hover always works; the gestures are extras.
  function hoverTip(api, rich) {
    let ct;
    api.a.addEventListener('mouseenter', () => { clearTimeout(ct); api.a.classList.add('part'); api.set(true); });
    api.a.addEventListener('mouseleave', () => { api.a.classList.remove('part'); if (!rich) api.set(false); });
    if (rich) { api.w.addEventListener('mouseenter', () => clearTimeout(ct)); api.w.addEventListener('mouseleave', () => { clearTimeout(ct); ct = setTimeout(() => api.set(false), 500); }); }
  }
  function outsideClose(api, onAct) {
    document.addEventListener('pointerdown', e => { if (api.on() && !api.w.contains(e.target)) api.set(false); });
    ESC.push(() => api.set(false));
    api.w.querySelector('.act').addEventListener('click', () => (onAct ? onAct() : api.set(false)));
  }

  /* ---------- action exits: the rich tooltip leaves in character ---------- */
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  // run fn(), then close the tooltip and put everything back once the pop has faded
  function exitThen(api, anims, cleanup) {
    Promise.all(anims.map(a => a.finished.catch(() => {}))).then(() => {
      api.busy = false; api.set(false);
      setTimeout(cleanup, 650);
    });
  }

  // Dandelion · "Make a wish": the card breaks into pieces, each piece becomes a seed and drifts off on the wind
  const WISP = '<svg viewBox="0 0 20 26" aria-hidden="true">' +
    [...Array(9)].map((_, i) => { const a = Math.PI * (1.1 + i * 0.1), x = (10 + Math.cos(a) * 9).toFixed(1), y = (11 + Math.sin(a) * 9).toFixed(1); return `<line x1="10" y1="11" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r=".8"/>`; }).join('') +
    '<line x1="10" y1="11" x2="10" y2="21"/><ellipse cx="10" cy="22.5" rx="1.3" ry="2"/></svg>';
  function blowAway(api) {
    if (api.busy) return;
    if (REDUCED) return api.set(false);
    api.busy = true;
    const tip = api.w.querySelector('.tip'), hang = api.w.querySelector('.hang');
    const W = tip.offsetWidth, H = tip.offsetHeight, L = tip.offsetLeft, T = tip.offsetTop;
    const cols = 7, rows = 4, cw = W / cols, rh = H / rows, made = [], anims = [];
    hang.classList.add('blown');
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cx = (c + .5) * cw, cy = (r + .5) * rh;
      const dx = rnd(150, 380) + c * 14, dy = -rnd(70, 230) - (rows - r) * 12, rot = rnd(-70, 70), phase = rnd(0, 6.28);
      const delay = (cols - 1 - c) * 55 + rnd(0, 140);   // the wind peels it from the right edge first
      const p = tip.cloneNode(true);
      p.removeAttribute('role'); p.removeAttribute('aria-label'); p.setAttribute('aria-hidden', 'true'); p.classList.add('shard');
      p.style.cssText = `left:${L}px;top:${T}px;width:${W}px;height:${H}px;transform-origin:${cx}px ${cy}px;clip-path:inset(${r * rh - .5}px ${W - (c + 1) * cw - .5}px ${H - (r + 1) * rh - .5}px ${c * cw - .5}px)`;
      hang.appendChild(p); made.push(p);
      anims.push(p.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translate(${dx * .06}px,${-6}px) rotate(${rot * .1}deg)`, opacity: 1, offset: .14 },
        { transform: `translate(${dx * .4}px,${dy * .35}px) rotate(${rot * .6}deg) scale(.55)`, opacity: .9, offset: .55 },
        { transform: `translate(${dx * .6}px,${dy * .55}px) rotate(${rot}deg) scale(.12)`, opacity: 0 }
      ], { duration: 1250, delay, easing: 'cubic-bezier(.35,.1,.4,1)', fill: 'both' }));
      // the seed that the piece turns into, carried further on with a flutter
      const s = document.createElement('span');
      s.className = 'wisp'; s.innerHTML = WISP; s.style.cssText = `left:${L + cx}px;top:${T + cy}px`;
      hang.appendChild(s); made.push(s);
      const frames = [...Array(9)].map((_, k) => {
        const t = k / 8, x = dx * (.45 + 1.25 * t) + Math.sin(t * 9 + phase) * 16, y = dy * (.4 + 1.1 * t) - t * 50;
        return { transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(Math.sin(t * 6 + phase) * 22).toFixed(1)}deg) scale(${(.6 + t * .3).toFixed(2)})`, opacity: t < .18 ? t / .18 : t > .68 ? (1 - t) / .32 : 1 };
      });
      anims.push(s.animate(frames, { duration: rnd(1800, 2500), delay: delay + 520, easing: 'linear', fill: 'both' }));
    }
    exitThen(api, anims, () => { made.forEach(n => n.remove()); hang.classList.remove('blown'); });
  }

  // Firefly · "keep it close": a swarm lands on the note, then scatters and carries its light away
  function swarm(api) {
    if (api.busy) return;
    if (REDUCED) return api.set(false);
    api.busy = true;
    const tip = api.w.querySelector('.tip'), hang = api.w.querySelector('.hang'), R = tip.getBoundingClientRect();
    const layer = document.createElement('div'); layer.className = 'swarm'; document.body.appendChild(layer);
    const N = innerWidth < 600 ? 80 : 180, ccx = R.left + R.width / 2, ccy = R.top + R.height / 2, OUT = 2900, anims = [];
    hang.classList.add('swarmed');
    for (let i = 0; i < N; i++) {
      const f = document.createElement('span'); f.className = 'sw';
      f.style.animationDelay = `-${rnd(0, 1.4).toFixed(2)}s`; layer.appendChild(f);
      const a = rnd(0, 6.28), d = rnd(260, 780), sx = ccx + Math.cos(a) * d, sy = ccy + Math.sin(a) * d;
      const tx = rnd(R.left + 6, R.right - 6), ty = rnd(R.top + 6, R.bottom - 6);
      const mx = (sx + tx) / 2 + rnd(-140, 140), my = (sy + ty) / 2 + rnd(-140, 140);
      const b = rnd(0, 6.28), e = rnd(320, 900), ox = tx + Math.cos(b) * e, oy = ty + Math.sin(b) * e - 90;
      const qx = (tx + ox) / 2 + rnd(-120, 120), qy = (ty + oy) / 2 + rnd(-120, 120);
      // fly in on a curve and settle on the note
      f.animate([
        { transform: `translate(${sx}px,${sy}px) scale(.5)`, opacity: 0 },
        { transform: `translate(${mx}px,${my}px) scale(.8)`, opacity: 1, offset: .55 },
        { transform: `translate(${tx}px,${ty}px) scale(1)`, opacity: 1 }
      ], { duration: rnd(900, 1600), delay: rnd(0, 1100), easing: 'cubic-bezier(.3,.6,.3,1)', fill: 'both' });
      // then scatter in every direction
      anims.push(f.animate([
        { transform: `translate(${tx}px,${ty}px) scale(1)`, opacity: 1 },
        { transform: `translate(${qx}px,${qy}px) scale(.85)`, opacity: .95, offset: .5 },
        { transform: `translate(${ox}px,${oy}px) scale(.4)`, opacity: 0 }
      ], { duration: rnd(1300, 2200), delay: OUT + rnd(0, 600), easing: 'cubic-bezier(.45,0,.7,.6)', fill: 'forwards' }));
    }
    // the note warms under them, then leaves with their light
    tip.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.28)' }], { duration: 1500, delay: 800, fill: 'forwards', easing: 'ease-out' });
    anims.push(tip.animate([{ opacity: 1, filter: 'brightness(1.28) blur(0)' }, { opacity: 0, filter: 'brightness(1.9) blur(6px)' }], { duration: 1400, delay: OUT + 150, fill: 'forwards', easing: 'ease-in' }));
    exitThen(api, anims, () => { layer.remove(); hang.classList.remove('swarmed'); tip.getAnimations().forEach(x => x.cancel()); });
  }

  /* ================= BLOOM ================= */
  if (SET === 'bloom') {
    // dot · in: wait  · out: double-click (pick it)
    const dot = ctl('dot'); let dt;
    const arrive = ms => { clearTimeout(dt); dt = setTimeout(() => dot.set(true), ms); };
    arrive(1800);
    dot.a.addEventListener('dblclick', () => { if (dot.on()) { dot.set(false); arrive(2600); } });
    dot.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); dot.on() ? (dot.set(false), arrive(2600)) : dot.set(true); } });

    // count · in: drag a seed onto the grass · out: drag the flower down
    let n = 2; const cnt = ctl('count', v => { n = v ? Math.max(n, 1) : 0; setNum(cnt, n); cnt.set(v); });
    cnt.set(true); setNum(cnt, n);
    const chip = cnt.c.querySelector('.chip');
    chip.addEventListener('pointerdown', e => {
      e.preventDefault(); chip.setPointerCapture(e.pointerId);
      const g = document.createElement('span'); g.className = 'ghost seed'; document.body.appendChild(g);
      const mv = ev => { g.style.left = ev.clientX + 'px'; g.style.top = ev.clientY + 'px'; cnt.a.classList.toggle('part', dist(cnt.a, ev.clientX, ev.clientY) < 60); };
      mv(e);
      const up = ev => {
        chip.removeEventListener('pointermove', mv); chip.removeEventListener('pointerup', up); g.remove(); cnt.a.classList.remove('part');
        if (dist(cnt.a, ev.clientX, ev.clientY) < 60) { n++; cnt.set(true); setNum(cnt, n); }
      };
      chip.addEventListener('pointermove', mv); chip.addEventListener('pointerup', up);
    });
    chip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); n++; cnt.set(true); setNum(cnt, n); } });
    let sy = null;
    cnt.a.addEventListener('pointerdown', e => { sy = e.clientY; cnt.a.setPointerCapture(e.pointerId); cnt.a.classList.add('part'); });
    cnt.a.addEventListener('pointermove', e => { if (sy !== null && e.clientY - sy > 40 && cnt.on()) { n = 0; cnt.set(false); } });
    const endC = () => { sy = null; cnt.a.classList.remove('part'); };
    cnt.a.addEventListener('pointerup', endC); cnt.a.addEventListener('pointercancel', endC);
    cnt.a.addEventListener('keydown', e => { if (e.key === 'Backspace' || e.key === 'Delete') { n = 0; cnt.set(false); } });

    // plain · in: press & hold · out: release
    const pl = ctl('plain'); hoverTip(pl, false); const h = hold(pl, 350, () => pl.set(true)); let lt;
    pl.a.addEventListener('pointerdown', e => { clearTimeout(lt); pl.a.setPointerCapture(e.pointerId); h.start(); });
    const rel = () => { h.stop(); lt = setTimeout(() => pl.set(false), 250); };
    pl.a.addEventListener('pointerup', rel); pl.a.addEventListener('pointercancel', rel);
    pl.a.addEventListener('contextmenu', e => e.preventDefault());
    pl.a.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pl.set(true); } });
    pl.a.addEventListener('keyup', () => pl.set(false));

    // rich · in: pull the stem up · out: push it down (or the action / Esc)
    const rc = ctl('rich'); outsideClose(rc); hoverTip(rc, true); let ry = null;
    rc.a.addEventListener('pointerdown', e => { ry = e.clientY; rc.a.setPointerCapture(e.pointerId); rc.a.classList.add('part'); if (!rc.on()) rc.w.classList.add('pulling'); });
    rc.a.addEventListener('pointermove', e => {
      if (ry === null) return; const dy = ry - e.clientY;
      if (!rc.on()) { rc.w.style.setProperty('--grow', Math.max(0, Math.min(1, dy / 70)).toFixed(2)); if (dy > 70) { rc.w.classList.remove('pulling'); rc.set(true); } }
      else if (dy < -40) rc.set(false);
    });
    const endR = () => { ry = null; rc.a.classList.remove('part'); rc.w.classList.remove('pulling'); rc.w.style.setProperty('--grow', 0); };
    rc.a.addEventListener('pointerup', endR); rc.a.addEventListener('pointercancel', endR);
    rc.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); rc.set(!rc.on()); } });
  }

  /* ================= DANDELION ================= */
  if (SET === 'dandelion') {
    // shared "blow": a fast flick across the stage near the puff
    function onFlick(api, cb) {
      let last = null;
      api.stage.addEventListener('pointermove', e => {
        const t = performance.now();
        if (last) { const v = Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(1, t - last.t); if (v > 1.4 && dist(api.a, e.clientX, e.clientY) < 110) cb(); }
        last = { x: e.clientX, y: e.clientY, t };
      });
      api.stage.addEventListener('pointerleave', () => (last = null));
    }
    // dot · in: scroll it into view · out: flick (blow)
    const dot = ctl('dot'); let dt, seen = true;
    new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && !dot.on()) { clearTimeout(dt); dt = setTimeout(() => dot.set(true), 500); } }), { threshold: .6 }).observe(dot.stage);
    onFlick(dot, () => { if (dot.on()) { dot.set(false); clearTimeout(dt); dt = setTimeout(() => dot.set(true), 3500); } });
    dot.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); dot.set(!dot.on()); } });

    // count · in: wiggle over the grass (gathers a wish) · out: flick
    let n = 0; const cnt = ctl('count', v => { n = v ? Math.max(n, 1) : 0; setNum(cnt, n); cnt.set(v); });
    let flips = [], lastX = null, dir = 0;
    cnt.stage.addEventListener('pointermove', e => {
      if (lastX !== null) {
        const d = Math.sign(e.clientX - lastX);
        if (d && d !== dir) { dir = d; const t = performance.now(); flips = flips.filter(f => t - f < 700); flips.push(t);
          if (flips.length >= 5 && dist(cnt.a, e.clientX, e.clientY) < 120) { flips = []; n++; cnt.set(true); setNum(cnt, n); cnt.a.classList.add('part'); setTimeout(() => cnt.a.classList.remove('part'), 400); } }
      }
      lastX = e.clientX;
    });
    onFlick(cnt, () => { if (cnt.on() && flips.length < 2) { n = 0; cnt.set(false); } });
    cnt.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); n++; cnt.set(true); setNum(cnt, n); } if (e.key === 'Backspace' || e.key === 'Delete') { n = 0; cnt.set(false); } });

    // plain · in: scroll wheel over the grass (a breeze) · out: stop
    const pl = ctl('plain'); hoverTip(pl, false); let wt;
    const breeze = () => { pl.set(true); pl.a.classList.add('part'); clearTimeout(wt); wt = setTimeout(() => { pl.set(false); pl.a.classList.remove('part'); }, 1200); };
    pl.stage.addEventListener('wheel', e => { e.preventDefault(); breeze(); }, { passive: false });
    let ty = null; pl.stage.addEventListener('pointerdown', e => (ty = e.clientY));
    pl.stage.addEventListener('pointermove', e => { if (ty !== null && Math.abs(e.clientY - ty) > 12) { ty = e.clientY; breeze(); } });
    pl.stage.addEventListener('pointerup', () => (ty = null));
    pl.a.addEventListener('focus', () => { if (pl.a.matches(':focus-visible')) pl.set(true); }); pl.a.addEventListener('blur', () => pl.set(false));

    // rich · in: hold, then release (a seed floats down) · out: swipe the card away
    const rc = ctl('rich'); outsideClose(rc, () => blowAway(rc)); hoverTip(rc, true);
    const h = hold(rc, 600, () => { rc.ready = true; });
    rc.a.addEventListener('pointerdown', e => { rc.ready = false; rc.a.setPointerCapture(e.pointerId); h.start(); });
    rc.a.addEventListener('pointerup', () => { h.stop(); if (rc.ready) rc.set(true); });
    rc.a.addEventListener('pointercancel', () => h.stop());
    const tip = rc.w.querySelector('.tip'); let sx = null;
    tip.addEventListener('pointerdown', e => { if (e.target.closest('.act')) return; sx = e.clientX; tip.setPointerCapture(e.pointerId); });
    tip.addEventListener('pointermove', e => { if (sx === null) return; const dx = e.clientX - sx; rc.w.querySelector('.hang').style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`; });
    tip.addEventListener('pointerup', e => {
      if (sx === null) return; const dx = e.clientX - sx, hg = rc.w.querySelector('.hang'); sx = null; hg.style.transform = '';
      if (Math.abs(dx) > 80) { rc.w.style.setProperty('--sx', (dx > 0 ? 220 : -220) + 'px'); rc.w.classList.add('gone'); setTimeout(() => { rc.set(false); rc.w.classList.remove('gone'); }, 350); }
    });
    rc.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); rc.set(!rc.on()); } });
  }

  /* ================= FIREFLY ================= */
  if (SET === 'firefly') {
    let lastMove = performance.now();
    ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel'].forEach(ev => addEventListener(ev, () => (lastMove = performance.now()), { passive: true }));

    // dot · in: be still (2.5s) · out: come close and it flies off
    const dot = ctl('dot');
    setInterval(() => { if (!dot.on() && !dot.w.classList.contains('flee') && performance.now() - lastMove > 2500) dot.set(true); }, 250);
    const flee = () => { if (!dot.on()) return; dot.w.classList.add('flee'); setTimeout(() => { dot.set(false); dot.w.classList.remove('flee'); }, 900); };
    dot.stage.addEventListener('pointermove', e => { if (dist(dot.w.querySelector('.badge'), e.clientX, e.clientY) < 70) flee(); });
    dot.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); dot.on() ? flee() : dot.set(true); } });

    // count · in: wait (they gather one by one) · out: hold to cup your hands
    let n = 0, paused = 0; const cnt = ctl('count', v => { n = v ? Math.max(n, 1) : 0; setNum(cnt, n); cnt.set(v); });
    setInterval(() => { if (performance.now() < paused || n >= 5) return; n++; cnt.set(true); setNum(cnt, n); }, 1600);
    const h = hold(cnt, 800, () => { cnt.w.classList.add('cupped'); setTimeout(() => { n = 0; cnt.set(false); cnt.w.classList.remove('cupped'); paused = performance.now() + 3000; }, 600); });
    cnt.a.addEventListener('pointerdown', e => { cnt.a.setPointerCapture(e.pointerId); h.start(); });
    cnt.a.addEventListener('pointerup', () => h.stop()); cnt.a.addEventListener('pointercancel', () => h.stop());
    cnt.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); n = 0; cnt.set(false); paused = performance.now() + 3000; } });

    // tooltips · the cursor becomes a small firefly; when it lands on the icon, a note opens
    function firefly(api) {
      const ff = api.stage.querySelector('.ff'); let tx = 0, ty = 0, x = 0, y = 0, raf = null;
      api.stage.classList.add('ffzone');
      const tick = () => { x += (tx - x) * .22; y += (ty - y) * .22; ff.style.transform = `translate(${x}px,${y}px)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > .3 ? requestAnimationFrame(tick) : null; };
      api.stage.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = api.stage.getBoundingClientRect(), wob = Math.sin(performance.now() / 160) * 2;
        tx = e.clientX - r.left; ty = e.clientY - r.top + wob;
        if (!ff.classList.contains('in')) { x = tx; y = ty; ff.classList.add('in'); }
        if (!raf) raf = requestAnimationFrame(tick);
      });
      api.stage.addEventListener('pointerleave', () => ff.classList.remove('in'));
      const land = v => { ff.classList.toggle('land', v); api.a.classList.toggle('lit', v || api.on()); };
      return { land };
    }
    const pl = ctl('plain'), fpl = firefly(pl);
    pl.a.addEventListener('mouseenter', () => { fpl.land(true); pl.set(true); });
    pl.a.addEventListener('mouseleave', () => { fpl.land(false); pl.set(false); });
    pl.a.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') pl.set(!pl.on()); });
    pl.a.addEventListener('focus', () => { if (pl.a.matches(':focus-visible')) pl.set(true); }); pl.a.addEventListener('blur', () => pl.set(false));

    const rc = ctl('rich'), frc = firefly(rc); outsideClose(rc, () => swarm(rc)); let ct;
    rc.a.addEventListener('mouseenter', () => { clearTimeout(ct); frc.land(true); rc.set(true); });
    rc.a.addEventListener('mouseleave', () => frc.land(false));
    rc.w.addEventListener('mouseenter', () => clearTimeout(ct));
    rc.w.addEventListener('mouseleave', () => { clearTimeout(ct); ct = setTimeout(() => rc.set(false), 500); });
    rc.a.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') rc.set(!rc.on()); });
    rc.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); rc.set(!rc.on()); } });
  }
})();
