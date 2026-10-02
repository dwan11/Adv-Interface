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
    <header><a class="back" href="../../#week2" aria-label="Back to Week 2">←</a><h1>${DATA.name}</h1><span class="tone">${DATA.tone}</span></header>
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
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const easeOut = u => 1 - Math.pow(1 - u, 3), easeIn = u => u * u * u;
  const bez = (a, c, b, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * c + u * u * b;
  // wait for every animation / promise, then close the tooltip and tidy up once the pop has faded
  function exitThen(api, list, cleanup) {
    Promise.all(list.map(x => (x.finished || x).catch(() => {}))).then(() => {
      api.busy = false; api.set(false);
      setTimeout(cleanup, 650);
    });
  }
  // a full-screen canvas above the page; draw(ctx, ms) returns false when the scene is over
  function overlay(draw) {
    const cv = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'fx'; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return new Promise(res => {
      const t0 = performance.now();
      const frame = now => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        if (draw(ctx, now - t0) === false) { cv.remove(); res(); } else requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }
  function sprite(w, h, paint) {
    const s = document.createElement('canvas'), k = 3; s.width = w * k; s.height = h * k;
    const c = s.getContext('2d'); c.scale(k, k); paint(c); return s;
  }

  // Dandelion · "Make a wish": the card turns into seeds, and the wind carries them off
  let SEED;
  const seedSprite = () => SEED || (SEED = sprite(40, 52, c => {
    c.translate(20, 16); c.lineCap = 'round';
    c.strokeStyle = 'rgba(142,156,164,.95)'; c.lineWidth = .55;
    for (let i = 0; i < 26; i++) {                                // the pappus: fine filaments fanning upward
      const a = Math.PI * (1.04 + i / 25 * .92), L = 11 + Math.sin(i * 2.3) * 2.5;
      const x = Math.cos(a) * L, y = Math.sin(a) * L * .78;
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(x * .5, y * .62, x, y); c.stroke();
      c.fillStyle = 'rgba(142,156,164,.9)'; c.beginPath(); c.arc(x, y, .55, 0, 7); c.fill();
    }
    c.lineWidth = .7; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 17); c.stroke();   // the beak
    c.fillStyle = '#5D6A71'; c.beginPath(); c.ellipse(0, 20.5, 1.3, 3.2, 0, 0, 7); c.fill();   // the seed
  }));
  function blowAway(api) {
    if (api.busy) return;
    if (REDUCED) return api.set(false);
    api.busy = true;
    const tip = api.w.querySelector('.tip'), hang = api.w.querySelector('.hang'), R = tip.getBoundingClientRect(), img = seedSprite();
    hang.classList.add('blown');
    const fade = tip.animate([{ opacity: 1, filter: 'blur(0)', transform: 'scale(1)' }, { opacity: 0, filter: 'blur(3px)', transform: 'scale(.97)' }], { duration: 520, easing: 'ease-in', fill: 'forwards' });
    // seeds fill the card's shape, so the card reads as having become them
    const gap = 21, cols = Math.max(4, Math.round(R.width / gap)), rows = Math.max(3, Math.round(R.height / gap)), seeds = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = R.left + (c + .5) / cols * R.width + rnd(-5, 5), y = R.top + (r + .5) / rows * R.height + rnd(-5, 5) - 8, xn = c / (cols - 1);
      seeds.push({ x, y, s: rnd(.6, .95), form: rnd(80, 480), go: 620 + (1 - xn) * 650 + rnd(0, 320), life: rnd(1900, 2700),
        dx: rnd(260, 560), dy: -rnd(130, 340), tilt: rnd(-8, 26), ph: rnd(0, 6.28) });
    }
    const end = Math.max(...seeds.map(p => p.go + p.life));
    const run = overlay((ctx, t) => {
      for (const p of seeds) {
        const f = clamp01((t - p.form) / 260); if (!f) continue;
        let x = p.x, y = p.y, rot = p.tilt * .3 + Math.sin(t / 260 + p.ph) * 4, a = f;
        const u = clamp01((t - p.go) / p.life);
        if (u > 0) {
          const g = Math.pow(u, 1.35);                                   // a gust that picks up
          x += p.dx * g + Math.sin(u * 9 + p.ph) * 14 * u;
          y += p.dy * g + Math.sin(u * 6 + p.ph) * 6;
          rot = p.tilt + Math.sin(u * 11 + p.ph) * 18;
          a *= u > .62 ? 1 - (u - .62) / .38 : 1;
        }
        const sc = p.s * (.35 + .65 * easeOut(f));
        ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc);
        ctx.drawImage(img, -20, -16, 40, 52); ctx.restore();
      }
      return t < end;
    });
    exitThen(api, [fade, run], () => { hang.classList.remove('blown'); fade.cancel(); });
  }

  // Firefly · "keep it close": a dense swarm settles on the note, rests there 600ms, then bursts away and takes the note with it
  let GLOW;
  const glowSprite = () => GLOW || (GLOW = sprite(64, 64, c => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,246,140,1)'); g.addColorStop(.3, 'rgba(246,222,24,1)'); g.addColorStop(.38, 'rgba(236,206,16,.6)');
    g.addColorStop(.64, 'rgba(230,200,20,.18)'); g.addColorStop(1, 'rgba(230,200,20,0)');
    c.fillStyle = g; c.fillRect(0, 0, 64, 64);
  }));
  function swarm(api) {
    if (api.busy) return;
    if (REDUCED) return api.set(false);
    api.busy = true;
    const tip = api.w.querySelector('.tip'), hang = api.w.querySelector('.hang'), R = tip.getBoundingClientRect(), img = glowSprite();
    const W = innerWidth, H = innerHeight, cx = R.left + R.width / 2, cy = R.top + R.height / 2, reach = Math.hypot(W, H) * .6;
    const N = W < 600 ? 950 : 2000, flies = [];
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    for (let i = 0; i < N; i++) {
      const a = rnd(0, 6.28), d = reach * rnd(.55, 1.15), sx = cx + Math.cos(a) * d, sy = cy + Math.sin(a) * d;
      const on = Math.random() < .82;                                   // most settle on the note, the rest spill past its edges
      const tx = on ? R.left + rnd(-.03, 1.03) * R.width : cx + gauss() * R.width * .8, ty = on ? R.top + rnd(-.04, 1.04) * R.height : cy + gauss() * R.height * .9;
      const b = rnd(0, 6.28), e = reach * rnd(.6, 1.3), ox = tx + Math.cos(b) * e, oy = ty + Math.sin(b) * e - 60;
      const big = Math.random() < .12;                                // a few out-of-focus ones, like bokeh
      flies.push({ sx, sy, tx, ty, ox, oy, c1x: (sx + tx) / 2 + rnd(-160, 160), c1y: (sy + ty) / 2 + rnd(-160, 160),
        c2x: (tx + ox) / 2 + rnd(-140, 140), c2y: (ty + oy) / 2 + rnd(-140, 140),
        size: big ? rnd(12, 24) : rnd(3.5, 9), alpha: big ? rnd(.18, .38) : rnd(.7, 1),
        d0: rnd(0, 520), dIn: rnd(650, 1050), od: rnd(0, 320), dOut: rnd(900, 1500), ph: rnd(0, 6.28) });
    }
    const LAND = Math.max(...flies.map(p => p.d0 + p.dIn)), OUT = LAND + 600, END = OUT + Math.max(...flies.map(p => p.od + p.dOut));
    hang.classList.add('swarmed');
    const warm = tip.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.08)' }], { duration: LAND, fill: 'forwards' });
    const gone = tip.animate([{ opacity: 1, filter: 'brightness(1.08) blur(0)' }, { opacity: 0, filter: 'brightness(2) blur(6px)' }], { duration: 750, delay: OUT, easing: 'ease-in', fill: 'forwards' });
    const run = overlay((ctx, t) => {
            for (const p of flies) {
        if (t < p.d0) continue;
        let x, y, a = p.alpha * (.72 + .28 * Math.sin(t / 130 + p.ph));
        const uo = clamp01((t - OUT - p.od) / p.dOut);
        if (uo > 0) { const e = easeIn(uo); x = bez(p.tx, p.c2x, p.ox, e); y = bez(p.ty, p.c2y, p.oy, e); a *= 1 - uo * uo; }
        else {
          const ui = clamp01((t - p.d0) / p.dIn), e = easeOut(ui);
          x = bez(p.sx, p.c1x, p.tx, e) + Math.sin(t / 210 + p.ph) * 1.6; y = bez(p.sy, p.c1y, p.ty, e) + Math.cos(t / 190 + p.ph) * 1.6;
          a *= Math.min(1, ui * 4);
        }
        ctx.globalAlpha = a; ctx.drawImage(img, x - p.size, y - p.size, p.size * 2, p.size * 2);
      }
      return t < END;
    });
    exitThen(api, [gone, run], () => { hang.classList.remove('swarmed'); warm.cancel(); gone.cancel(); });
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
