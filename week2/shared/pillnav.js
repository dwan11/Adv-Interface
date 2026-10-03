/* Week 2 · pill bar, added on top of each design (see pillnav.css).
   Load after the page's own script; it reads <body data-set> and puts a "Navigation · pill bar" card first in .grid.
   Tap a tab to switch · a note arrives as a badge (opening the bell clears it) · hover (desktop) or long-press (phone) for a tooltip.
   Until you touch it, the card plays a short demo on its own. */
(function () {
  const SET = document.body.dataset.set;
  const CONCEPT = { bloom: 'spring', dandelion: 'liquid', firefly: 'island', harvest: 'hop', shy: 'shy' }[SET];
  const grid = document.querySelector('.grid');
  if (!CONCEPT || !grid) return;
  const COUNT = { bloom: 3, dandelion: 5, firefly: 2, harvest: 12, shy: 3 }[SET];
  const LABEL = ['Home', 'Links', 'Info', 'Notifications', 'Water the garden'];
  const MOTION = { spring: 'glides under a glass lens', liquid: 'stretches like liquid', island: 'grows into the note', hop: 'hops and rings', shy: 'hesitates, then commits' }[CONCEPT];
  const ICON = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 16h4"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6 2 7.5 2 7.5H4S6 15 6 9z"/><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0"/></svg>'
  ];
  // each design draws its icons its own way: Bloom curly, Shy straight, the rest restyle the base lines in CSS (dotted, hairline, chunky)
  const CURLY = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 10.6 C5.8 13.4 6.1 16.6 6.6 19.3 C10 19.8 14 19.8 17.4 19.3 C17.9 16.6 18.2 13.4 17.8 10.6 C16.2 9 14.2 7.2 12 5 C9.8 7.2 7.8 9 6.2 10.6 Z"/><path d="M4.4 11.6 C3.8 11 4 10.2 4.8 10.4 M19.6 11.6 C20.2 11 20 10.2 19.2 10.4"/><path d="M10.2 15.8 C11.4 16.7 12.8 16.7 13.9 15.6"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.4 13.6 C8.9 12.1 9.2 9.7 10.8 8.3 L13.2 6.1 C14.8 4.7 17.4 4.9 18.7 6.5 C20 8.1 19.8 10.5 18.2 11.8 L17 12.9"/><path d="M13.6 10.4 C15.1 11.9 14.8 14.3 13.2 15.7 L10.8 17.9 C9.2 19.3 6.6 19.1 5.3 17.5 C4 15.9 4.2 13.5 5.8 12.2 L7 11.1"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6 C16.8 3.4 20.6 7.2 20.4 12 C20.2 16.8 16.6 20.5 12 20.4 C7.2 20.3 3.5 16.6 3.6 12 C3.7 7.8 6.8 4.6 10.6 3.8"/><path d="M12.3 11 C11.7 13 12.5 15.2 11.8 16.9"/><path d="M12 7.6 h.01"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 15.6 C7 12.8 6.2 9.8 7.8 7.5 C9.6 5 14.4 5 16.2 7.5 C17.8 9.8 17 12.8 17.6 15.6 C18.1 16.5 19.2 16.7 19.5 17.1 C14.5 17.8 9.5 17.8 4.5 17.1 C4.8 16.7 5.9 16.5 6.4 15.6 Z"/><path d="M10.2 19.6 C11.2 21 12.8 21 13.8 19.6"/><path d="M12 5.2 C11.3 4.1 12.2 3 13.2 3.7"/></svg>'
  ];
  const STRAIGHT = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10 V20 H18 V10"/><path d="M3.5 11.5 L12 4 L20.5 11.5"/><path d="M10 20 V15 H14 V20"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7 L13.5 4.5 L19.5 10.5 L17 13"/><path d="M13 17 L10.5 19.5 L4.5 13.5 L7 11"/><path d="M9.5 14.5 L14.5 9.5"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4 H20 V20 H4 Z"/><path d="M12 10.5 V17"/><path d="M12 7 V8.4"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16 V10 L8.5 5.5 H15.5 L18 10 V16 L20 18 H4 Z"/><path d="M10 20.5 H14"/></svg>'
  ];
  const WATER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 10.5 H14 V18 A1.5 1.5 0 0 1 12.5 19.5 H6 A1.5 1.5 0 0 1 4.5 18 Z"/><path d="M14 12.5 L19.5 8.5"/><path d="M18 7.5 L20.5 9.5"/><path d="M6.5 10.5 C6.5 6.8 12 6.8 12 10.5"/></svg>';
  const ICONS = SET === 'bloom' ? CURLY : SET === 'shy' ? STRAIGHT : ICON;
  const TABS = kind => SET === 'harvest' && kind === 'desk' ? [...ICONS, WATER] : ICONS;
  const CURSOR = '<svg viewBox="0 0 16 22" aria-hidden="true"><path d="M1 1 L1 17 L5.5 13 L8.5 20 L11 19 L8 12 L14 12 Z" fill="#18181B" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const RICH = { bloom: ['Got it', `${COUNT} notes have bloomed.`], dandelion: ['Make a wish', `${COUNT} seeds, ready to send.`], firefly: ['keep it close', `${COUNT} notes, just for you.`],
    harvest: ['Harvest', `${COUNT} things are ready to pick.`], shy: ['Show me', `um… ${COUNT} new notes?`] }[SET];
  const BODY = ['Back to where you started.', 'Everything you’ve saved.', 'How this place works.', RICH[1]];
  const ISL = {
    desk: `${ICON[3]}<span>a note, just for you</span>`,
    mob: `${ICON[3]}<span><b>${COUNT}</b> notes<small>just for you</small></span>`
  };
  const wheels = String(COUNT).split('').map(() => `<span class="pn-wh">${[...Array(10)].map((_, d) => `<span>${d}</span>`).join('')}</span>`).join('');

  /* ---------- each design's own graphics ---------- */
  const GRASS = '<svg class="pn-art" viewBox="0 0 40 22" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
    [[6,14,-2,'#5E8C45',2.8,-.4],[11,20,-3,'#3F6B30',2.4,-1.2],[16,16,1,'#6E9A4B',3.1,-2],[21,21,-1,'#355E2B',2.7,-.8],[26,17,2,'#5E8C45',3.3,-1.6],[31,19,2,'#3F6B30',2.9,-.2],[35,13,3,'#6E9A4B',2.6,-2.4]]
      .map(([x,h,dx,c,d,dl]) => `<path style="--d:${d}s;--dl:${dl}s" fill="${c}" d="M${x-1.6} 22 Q${x+dx*.25} ${22-h*.6} ${x+dx} ${22-h} Q${x+dx*.25+1.1} ${22-h*.55} ${x+1.6} 22Z"/>`).join('') + '</svg>';
  const FLOWER = '<svg class="pn-art" viewBox="-17 -17 34 34" aria-hidden="true">' +
    [0,72,144,216,288].map(a => `<ellipse cx="0" cy="-8.6" rx="5.4" ry="8" transform="rotate(${a})" fill="#F2A7B5"/>`).join('') +
    `<circle r="9.6" fill="#F3C847"/><text y=".6" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#1F2A1C">${COUNT}</text></svg>`;
  const PUFF = '<svg class="pn-art" viewBox="-18 -18 36 36" aria-hidden="true"><g class="sds">' +
    [...Array(16)].map((_,n) => { const a = n / 16 * Math.PI * 2, x = (Math.cos(a) * 15).toFixed(1), y = (Math.sin(a) * 15).toFixed(1); return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#8E9CA4" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.1" fill="#5D6A71"/>`; }).join('') +
    `</g><circle r="10" fill="#fff" stroke="#8E9CA4" stroke-width=".8"/><text y=".6" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#1D2A33">${COUNT}</text></svg>`;
  const CHUTE = '<svg class="pn-chute" viewBox="0 0 44 18" aria-hidden="true">' +
    [...Array(11)].map((_,n) => { const a = Math.PI * (1.08 + n * .084), x = (22 + Math.cos(a) * 20).toFixed(1), y = (18 + Math.sin(a) * 16).toFixed(1); return `<line x1="22" y1="18" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r=".9"/>`; }).join('') + '</svg>';
  const SEARCH = '<svg class="pn-srch" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>';
  const GROC = ['g-carrot', 'g-straw', 'g-banana'].map((id, n) => `<svg viewBox="0 0 24 24" style="--i:${n};--gx:${[-16, 4, 18][n]}px"><use href="#${id}" width="24" height="24"/></svg>`).join('');
  const H1ART = SET === 'bloom' ? GRASS : SET === 'shy' ? '<span class="pn-art"><i></i><i></i></span>' : '';
  const BADGEART = SET === 'bloom' ? FLOWER : SET === 'dandelion' ? PUFF : '';
  const fireflies = n => SET !== 'firefly' ? '' : [...Array(n)].map((_, k) => {
    const r = a => ((Math.sin(k * 12.9898 + a) * 43758.5453) % 1 + 1) % 1;
    return `<span class="pn-ffl" style="left:${(8 + r(1) * 84).toFixed(0)}%;top:${(30 + r(2) * 60).toFixed(0)}%;--d:${(5 + r(3) * 5).toFixed(1)}s;--dl:-${(r(4) * 4).toFixed(1)}s;--x1:${(r(5) * 40 - 20).toFixed(0)}px;--y1:${(r(6) * 30 - 15).toFixed(0)}px;--x2:${(r(7) * 40 - 20).toFixed(0)}px;--y2:${(r(8) * 30 - 15).toFixed(0)}px;--x3:${(r(9) * 40 - 20).toFixed(0)}px;--y3:${(r(10) * 30 - 15).toFixed(0)}px"></span>`; }).join('');
  const ORBS = kind => SET !== 'firefly' ? '' : `<span class="pn-orbs" style="--sy:${kind === 'desk' ? .3 : .42}">${[[3.2, kind === 'desk' ? 125 : 118], [4.4, kind === 'desk' ? 105 : 98], [5.6, kind === 'desk' ? 140 : 132]].map(([d, rr], n) => `<span class="pn-orb" style="--d:${d}s;--r:${rr}px;animation-delay:-${n * 1.3}s"><i></i></span>`).join('')}</span>`;

  if (!document.getElementById('pn-goo')) document.body.insertAdjacentHTML('afterbegin',
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <filter id="pn-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter>
      <filter id="pn-goo-s"><feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter>
    </defs></svg>`);

  const PETALS = '<span class="pn-petals">' + [-78, -52, -26, 0, 26, 52, 78].map((a, n) => `<i style="--a:${a}deg;--n:${n}"></i>`).join('') + '</span>';
  const bar = kind => `<div class="pn-nav" data-c="${CONCEPT}" style="--n:${TABS(kind).length}" role="tablist" aria-label="App navigation (${kind === 'desk' ? 'desktop' : 'phone'})">
      <span class="pn-bg"></span>
      <span class="pn-hl"><span class="pn-h1">${H1ART}</span></span>
      <span class="pn-rip"></span><span class="pn-rip"></span>
      <span class="pn-tabs">${TABS(kind).map((s, k) => `<button class="pn-tb${k ? '' : ' on'}" data-k="${k}" style="--k:${k}" role="tab" aria-selected="${!k}" aria-label="${LABEL[k]}">${s}</button>`).join('')}</span>
      <span class="pn-bd"><i class="d2"></i><i class="d1"></i></span>
      <span class="pn-pets">${[0, 60, 120, 180, 240, 300].map(a => `<i style="--a:${a}deg"></i>`).join('')}</span>
      <span class="pn-badge" aria-hidden="true">${BADGEART}<span class="pn-n">${COUNT}</span><span class="pn-odo">${wheels}</span></span>
      <span class="pn-isl">${ORBS(kind)}${ISL[kind]}</span><span class="pn-groc">${SET === 'harvest' ? GROC : ''}</span>
      <span class="pn-tipwrap">${SET === 'bloom' && kind === 'mob' ? PETALS : ''}<span class="pn-stem"></span>${SET === 'dandelion' ? CHUTE : ''}<span class="pn-tg"><i class="pn-neck"></i><i class="pn-tbd"></i></span><span class="pn-tip" role="tooltip">${SET === 'shy' ? SEARCH : ''}<span class="pn-txt"></span><span class="pn-caret"></span></span></span>
      <span class="pn-ptr">${kind === 'desk' ? CURSOR : '<i></i>'}</span>
    </div>`;
  const card = document.createElement('article');
  card.className = 'card pn-card';
  card.dataset.k = 'nav';
  card.innerHTML = `
    <div class="lab">Navigation · pill bar · ${MOTION}</div>
    <div class="pn-row"><div class="seg" role="group" aria-label="Notification state"><button aria-pressed="true">None</button><button aria-pressed="false">Badge</button></div><button class="pn-play" type="button">Play demo</button></div>
    <div class="pn-stage">
      <div class="pn-desk-wrap"><p class="pn-cap">Desktop · 1024 × 576 · bar on top, tooltip below</p><div class="pn-desk"><div class="pn-bar"><i></i><i></i><i></i></div>
        <div class="pn-view"><div class="pn-screen"><div class="pn-feed">${'<i></i>'.repeat(6)}</div>${fireflies(5)}${bar('desk')}</div></div></div></div>
      <div class="pn-mob-wrap"><p class="pn-cap">Phone · 390 × 844 · bar at bottom, tooltip above</p><div class="pn-mob"><div class="pn-view"><div class="pn-screen"><span class="pn-notch"></span>
        <div class="pn-feed">${'<i></i>'.repeat(6)}</div>${fireflies(4)}${bar('mob')}<span class="pn-homebar"></span></div></div></div></div>
    </div>
    <div class="trig"><span><i>switch</i>tap a tab</span><span><i>badge</i>a note arrives · open the bell</span><span><i>tooltip</i>hover · long-press</span></div>`;
  grid.prepend(card);
  // true scale: each screen keeps its real size (desktop 1024 wide, phone 390 wide) and is shrunk to fit its frame
  const fit = () => card.querySelectorAll('.pn-view').forEach(v => { const sc = v.firstElementChild; v.style.setProperty('--k', v.clientWidth / sc.offsetWidth); });
  new ResizeObserver(fit).observe(card); fit();

  /* ---------- Dandelion: things turn into seeds and the wind takes them ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a), clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v, easeOut = u => 1 - Math.pow(1 - u, 3);
  let SEED;
  const seedSprite = () => SEED || (SEED = (() => {
    const cv = document.createElement('canvas'), k = 3; cv.width = 40 * k; cv.height = 52 * k;
    const c = cv.getContext('2d'); c.scale(k, k); c.translate(20, 16); c.lineCap = 'round';
    c.strokeStyle = 'rgba(142,156,164,.95)'; c.lineWidth = .55;
    for (let n = 0; n < 26; n++) {
      const a = Math.PI * (1.04 + n / 25 * .92), L = 11 + Math.sin(n * 2.3) * 2.5, x = Math.cos(a) * L, y = Math.sin(a) * L * .78;
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(x * .5, y * .62, x, y); c.stroke();
      c.fillStyle = 'rgba(142,156,164,.9)'; c.beginPath(); c.arc(x, y, .55, 0, 7); c.fill();
    }
    c.lineWidth = .7; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 17); c.stroke();
    c.fillStyle = '#5D6A71'; c.beginPath(); c.ellipse(0, 20.5, 1.3, 3.2, 0, 0, 7); c.fill();
    return cv; })());
  function windSeeds(list) {
    const cv = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1), img = seedSprite();
    cv.className = 'pn-fx'; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; document.body.appendChild(cv);
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const end = Math.max(...list.map(p => p.go + p.life)), t0 = performance.now();
    return new Promise(res => {
      const frame = now => {
        const t = now - t0; ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (const p of list) {
          const f = clamp01((t - p.form) / 240); if (!f) continue;
          let x = p.x, y = p.y, rot = p.tilt * .3 + Math.sin(t / 260 + p.ph) * 4, a = f;
          const u = clamp01((t - p.go) / p.life);
          if (u > 0) { const g = Math.pow(u, 1.35); x += p.dx * g + Math.sin(u * 9 + p.ph) * 12 * u; y += p.dy * g + Math.sin(u * 6 + p.ph) * 5;
            rot = p.tilt + Math.sin(u * 11 + p.ph) * 18; a *= u > .62 ? 1 - (u - .62) / .38 : 1; }
          const sc = p.s * (.35 + .65 * easeOut(f));
          ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc); ctx.drawImage(img, -20, -16, 40, 52); ctx.restore();
        }
        if (t < end) requestAnimationFrame(frame); else { cv.remove(); res(); }
      };
      requestAnimationFrame(frame);
    });
  }
  // a card: seeds fill its shape, then a gust lifts them away from the right edge first
  const cardToSeeds = R => { const gap = 17, cols = Math.max(3, Math.round(R.width / gap)), rows = Math.max(2, Math.round(R.height / gap)), out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push({ x: R.left + (c + .5) / cols * R.width + rnd(-4, 4), y: R.top + (r + .5) / rows * R.height + rnd(-4, 4) - 8,
      s: rnd(.45, .75), form: rnd(60, 420), go: 560 + (1 - c / Math.max(1, cols - 1)) * 600 + rnd(0, 280), life: rnd(1700, 2500), dx: rnd(200, 460), dy: -rnd(110, 300), tilt: rnd(-8, 26), ph: rnd(0, 6.28) });
    return windSeeds(out); };
  // the puff: its seeds let go one by one and drift off
  const puffToSeeds = R => { const cx = R.left + R.width / 2, cy = R.top + R.height / 2, n = 12, out = [];
    for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, rr = R.width * .38;
      out.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr - 6, s: rnd(.32, .5), form: 0, go: rnd(0, 380), life: rnd(1500, 2300), dx: rnd(120, 300), dy: -rnd(70, 200), tilt: rnd(-10, 30), ph: rnd(0, 6.28) }); }
    return windSeeds(out); };
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fxCanvas(draw) {
    const cv = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'pn-fx'; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; document.body.appendChild(cv);
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const t0 = performance.now();
    return new Promise(res => { const frame = now => { ctx.clearRect(0, 0, innerWidth, innerHeight); if (draw(ctx, now - t0) === false) { cv.remove(); res(); } else requestAnimationFrame(frame); }; requestAnimationFrame(frame); });
  }
  let GLOW;
  const glowSprite = () => GLOW || (GLOW = (() => { const cv = document.createElement('canvas'), k = 3; cv.width = cv.height = 64 * k; const c = cv.getContext('2d'); c.scale(k, k);
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,246,140,1)'); g.addColorStop(.3, 'rgba(246,222,24,1)'); g.addColorStop(.38, 'rgba(236,206,16,.6)');
    g.addColorStop(.64, 'rgba(230,200,20,.18)'); g.addColorStop(1, 'rgba(230,200,20,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); return cv; })());
  const bez = (a, c, b, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * c + u * u * b, easeIn = u => u * u * u;
  // Firefly · "keep it close": a swarm settles on the note, rests 600ms, then scatters and carries the note's light away
  function swarmOnto(note) {
    const R = note.getBoundingClientRect(), img = glowSprite(), cx = R.left + R.width / 2, cy = R.top + R.height / 2, reach = Math.max(260, Math.hypot(R.width, R.height) * 2.4);
    const N = Math.round(Math.min(900, Math.max(260, R.width * R.height / 12))), flies = [];
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    for (let n = 0; n < N; n++) {
      const a = rnd(0, 6.28), d = reach * rnd(.55, 1.15), sx = cx + Math.cos(a) * d, sy = cy + Math.sin(a) * d, on = Math.random() < .82;
      const tx = on ? R.left + rnd(-.03, 1.03) * R.width : cx + gauss() * R.width * .8, ty = on ? R.top + rnd(-.04, 1.04) * R.height : cy + gauss() * R.height * .9;
      const b = rnd(0, 6.28), e = reach * rnd(.6, 1.3), ox = tx + Math.cos(b) * e, oy = ty + Math.sin(b) * e - 50, big = Math.random() < .1;
      flies.push({ sx, sy, tx, ty, ox, oy, c1x: (sx + tx) / 2 + rnd(-100, 100), c1y: (sy + ty) / 2 + rnd(-100, 100), c2x: (tx + ox) / 2 + rnd(-90, 90), c2y: (ty + oy) / 2 + rnd(-90, 90),
        size: big ? rnd(7, 14) : rnd(2, 5.5), alpha: big ? rnd(.18, .38) : rnd(.7, 1), d0: rnd(0, 520), dIn: rnd(650, 1050), od: rnd(0, 320), dOut: rnd(900, 1500), ph: rnd(0, 6.28) });
    }
    const LAND = Math.max(...flies.map(p => p.d0 + p.dIn)), OUT = LAND + 600, END = OUT + Math.max(...flies.map(p => p.od + p.dOut));
    const warm = note.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.08)' }], { duration: LAND, fill: 'forwards' });
    const gone = note.animate([{ opacity: 1, filter: 'brightness(1.08) blur(0)' }, { opacity: 0, filter: 'brightness(2) blur(6px)' }], { duration: 750, delay: OUT, easing: 'ease-in', fill: 'forwards' });
    const run = fxCanvas((ctx, t) => {
      for (const p of flies) {
        if (t < p.d0) continue; let x, y, a = p.alpha * (.72 + .28 * Math.sin(t / 130 + p.ph));
        const uo = clamp01((t - OUT - p.od) / p.dOut);
        if (uo > 0) { const e = easeIn(uo); x = bez(p.tx, p.c2x, p.ox, e); y = bez(p.ty, p.c2y, p.oy, e); a *= 1 - uo * uo; }
        else { const ui = clamp01((t - p.d0) / p.dIn), e = easeOut(ui); x = bez(p.sx, p.c1x, p.tx, e) + Math.sin(t / 210 + p.ph) * 1.4; y = bez(p.sy, p.c1y, p.ty, e) + Math.cos(t / 190 + p.ph) * 1.4; a *= Math.min(1, ui * 4); }
        ctx.globalAlpha = a; ctx.drawImage(img, x - p.size, y - p.size, p.size * 2, p.size * 2);
      }
      return t < END;
    });
    return { done: Promise.all([run, gone.finished]), anims: [warm, gone] };
  }

  /* ---------- timers live in one list so the demo can be stopped cleanly ---------- */
  let timers = [];
  const later = (f, ms) => setTimeout(f, ms);            // a bar's own follow-up steps: always finish
  const at = (ms, f) => timers.push(setTimeout(f, ms));   // the demo script: cancelled when you take over
  const stopAll = () => { timers.forEach(clearTimeout); timers = []; };
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const segs = [...card.querySelectorAll('.seg button')];

  function Bar(el) {
    const c = CONCEPT, tabs = [...el.querySelectorAll('.pn-tb')], ptr = el.querySelector('.pn-ptr'), badge = el.querySelector('.pn-badge');
    const tipwrap = el.querySelector('.pn-tipwrap'), tip = el.querySelector('.pn-tip'), txt = el.querySelector('.pn-txt'), screen = el.closest('.pn-screen');
    const m = () => { const s = getComputedStyle(el); return { T: parseFloat(s.getPropertyValue('--T')), G: parseFloat(s.getPropertyValue('--G')), P: parseFloat(s.getPropertyValue('--P')) }; };
    const pos = k => { const { T, G, P } = m(); return P + k * (T + G); };
    const isMob = !!el.closest('.pn-mob');
    const K = () => el.getBoundingClientRect().width / el.offsetWidth || 1;
    let i = 0, tipK = -1, typing = [], wishing = false;
    const setHL = (k, instant) => {
      const { T } = m();
      if (c === 'island') { el.style.setProperty('--l', pos(k) + 'px'); el.style.setProperty('--w', T + 'px'); }
      else if (c === 'liquid') { el.style.setProperty('--l', pos(k) + 'px'); el.style.setProperty('--r', (el.offsetWidth - pos(k) - T) + 'px'); }
      else el.style.setProperty('--i', k);
    };
    const api = {
      el,
      reset() { el.classList.add('pn-noanim'); el.classList.remove('b-on', 'ton', 'toff', 'ping', 'unping', 'moving', 'ringing', 'isl-on', 'stretch', 'fwd', 'back', 'commit', 'lean');
        i = 0; setHL(0); tabs.forEach((t, k) => { t.classList.toggle('on', !k); t.setAttribute('aria-selected', String(!k)); });
        el.querySelectorAll('.pn-wh').forEach(w => w.style.setProperty('--d', 0)); badge.querySelector('.pn-n').textContent = COUNT;
        ptr.classList.remove('hold', 'tap'); ptr.style.opacity = 0; void el.offsetWidth; el.classList.remove('pn-noanim'); },
      point(k, away) { const { T, P } = m(); ptr.style.setProperty('--px', pos(k) + T / 2 + 'px'); ptr.style.setProperty('--py', (away ? P + T + 60 : P + T / 2 + 2) + 'px'); ptr.style.opacity = 1; },
      hidePtr() { ptr.style.opacity = 0; ptr.classList.remove('hold', 'tap'); },
      tap() { restart(ptr, 'tap'); later(() => ptr.classList.remove('tap'), 400); },
      hold(v) { ptr.classList.toggle('hold', v); },
      go(k) {
        if (k === i) return; const from = i; i = k;
        tabs.forEach((t, n) => { t.classList.toggle('on', n === k); t.setAttribute('aria-selected', String(n === k)); });
        if (c === 'island') {
          const { T } = m(), a = pos(Math.min(from, k)), b = pos(Math.max(from, k)) + T;
          el.classList.add('stretch'); el.style.setProperty('--l', a + 'px'); el.style.setProperty('--w', (b - a) + 'px');
          later(() => { el.classList.remove('stretch'); setHL(k); }, 360);
        } else if (c === 'liquid') {
          el.classList.toggle('fwd', k > from); el.classList.toggle('back', k < from); restart(el, 'moving'); setHL(k);
        } else if (c === 'shy') {
          // hesitate: lean toward the new tab, pull back, then commit
          el.classList.remove('commit'); el.classList.add('lean');
          el.style.setProperty('--i', from + (k - from) * .38);
          later(() => el.style.setProperty('--i', from + (k - from) * .12), 260);
          later(() => { el.classList.add('commit'); el.classList.remove('lean'); el.style.setProperty('--i', k); }, 560);
        } else setHL(k);
        if (c === 'spring' || c === 'hop') { restart(el, 'moving'); later(() => el.classList.remove('moving'), 520); restart(tabs[k], 'pn-pop'); }
        if (k === 3) api.clear();
      },
      notify() {
        if (el.classList.contains('b-on') || el.classList.contains('isl-on')) return;
        if (c === 'liquid') { el.classList.remove('unping'); restart(el, 'ping'); el.classList.add('b-on'); }
        else if (c === 'spring') { el.classList.add('b-on'); const w = [...el.querySelectorAll('.pn-wh')], d = String(COUNT).split('');
          later(() => w.forEach((x, n) => x.style.setProperty('--d', d[n])), 120); }
        else if (c === 'island') { el.classList.add('isl-on'); later(() => { el.classList.remove('isl-on'); later(() => el.classList.add('b-on'), 700); }, 2400); }
        else if (c === 'hop') { const n = badge.querySelector('.pn-n'); n.textContent = Math.max(1, COUNT - 2); restart(el, 'ringing'); el.classList.add('b-on');
          later(() => (n.textContent = Math.max(1, COUNT - 1)), 260); later(() => (n.textContent = COUNT), 520); later(() => el.classList.remove('ringing'), 1300); }
        else el.classList.add('b-on');
        sync();
      },
      clear() {
        if (!el.classList.contains('b-on')) return;
        if (c === 'liquid') {
          if (SET === 'dandelion' && !REDUCED) { const art = badge.querySelector('.pn-art'); if (art) puffToSeeds(art.getBoundingClientRect()); badge.style.transition = 'none'; }
          el.classList.remove('b-on', 'ping'); restart(el, 'unping'); void badge.offsetWidth; badge.style.transition = '';
        }
        else if (c === 'spring') { el.querySelectorAll('.pn-wh').forEach(w => w.style.setProperty('--d', 0)); later(() => { el.classList.remove('b-on'); sync(); }, 350); }
        else el.classList.remove('b-on');
        sync();
      },
      tip(k, v) {
        typing.forEach(clearTimeout); typing = [];
        if (!v) { if (tipK < 0) return; tipK = -1; el.classList.remove('ton'); if (c === 'liquid') { restart(el, 'toff'); later(() => el.classList.remove('toff'), 450); } return; }
        if (wishing) return;
        const { T } = m(), label = LABEL[k];
        tipK = k; el.style.setProperty('--tipx', pos(k) + T / 2 + 'px');
        tip.classList.toggle('rich', isMob);
        if (isMob) txt.innerHTML = `<b>${label}</b><span class="pn-body">${BODY[k]}</span><button class="pn-act" type="button">${RICH[0]}</button>`;
        else txt.textContent = label;
        tipwrap.style.setProperty('--tx', '0px'); tipwrap.style.removeProperty('--th');
        const w = tip.offsetWidth, h = tip.offsetHeight, sw = screen.offsetWidth;
        const cx = el.offsetLeft + pos(k) + T / 2, left = cx - w / 2, clamped = Math.max(16, Math.min(sw - 16 - w, left));
        tipwrap.style.setProperty('--tx', (clamped - left) + 'px'); tipwrap.style.setProperty('--tw', w + 'px');
        tipwrap.style.setProperty('--th', h + 'px'); tipwrap.style.setProperty('--off', (h / 2 + (SET === 'dandelion' ? 30 : 8)) + 'px');
        if (isMob) { const act = txt.querySelector('.pn-act'); act.addEventListener('click', e => { e.stopPropagation(); takeOver(); api.act(); }); }
        if (isMob && SET === 'shy') {
          const b = txt.querySelector('b'), slip = label.length > 3 ? label.slice(0, -2) + label.slice(-1) + label.slice(-2, -1) : label; let t = 0;
          tip.classList.remove('typed'); b.textContent = '';
          [...slip].forEach(ch => typing.push(setTimeout(() => b.insertAdjacentText('beforeend', ch), t += 65)));
          if (slip !== label) {
            typing.push(setTimeout(() => { b.innerHTML = label.slice(0, -2) + '<s>' + slip.slice(-2) + '</s>'; }, t += 300));
            typing.push(setTimeout(() => { b.textContent = label.slice(0, -2); }, t += 220));
            [...label.slice(-2)].forEach(ch => typing.push(setTimeout(() => b.insertAdjacentText('beforeend', ch), t += 85)));
          }
          typing.push(setTimeout(() => tip.classList.add('typed'), t += 120));
        }
        if (c === 'shy' && !isMob) {  // types its own name, slips, corrects itself
          const slip = label.length > 3 ? label.slice(0, -2) + label.slice(-1) + label.slice(-2, -1) : label;
          txt.textContent = ''; let t = 0;
          [...slip].forEach(ch => typing.push(setTimeout(() => txt.insertAdjacentText('beforeend', ch), t += 70)));
          if (slip !== label) {
            typing.push(setTimeout(() => { txt.innerHTML = label.slice(0, -2) + '<s>' + slip.slice(-2) + '</s>'; }, t += 320));
            typing.push(setTimeout(() => { txt.textContent = label.slice(0, -2); }, t += 240));
            [...label.slice(-2)].forEach(ch => typing.push(setTimeout(() => txt.insertAdjacentText('beforeend', ch), t += 90)));
          }
        }
        el.classList.remove('toff'); el.classList.add('ton');
      },
      act() {
        if (tipK < 0 || wishing) return; const k = tipK;
        const finish = (anims = []) => { tipK = -1; el.classList.remove('ton', 'wished'); later(() => { anims.forEach(a => a.cancel()); wishing = false; }, 450); if (k === 3) api.clear(); };
        const tx = parseFloat(tipwrap.style.getPropertyValue('--tx')) || 0, off = parseFloat(tipwrap.style.getPropertyValue('--off')) || 26, dir = isMob ? -1 : 1;
        if (REDUCED) { api.tip(k, false); if (k === 3) api.clear(); return; }
        if (SET === 'dandelion') {          // the note becomes seeds, and the puff lets go of its seeds too
          wishing = true; el.classList.add('wished'); if (k === 3) api.clear();
          const R = tip.getBoundingClientRect(), fades = [tip, el.querySelector('.pn-tg')].map(n => n.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(3px)' }], { duration: 480, easing: 'ease-in', fill: 'forwards' }));
          cardToSeeds(R).then(() => finish(fades));
        } else if (SET === 'harvest' && window.harvestReward) {   // the note turns into a pot of cooked carrots, rays shining behind
          wishing = true; el.classList.add('wished');
          const fade = tip.animate([{ opacity: 1, scale: '1' }, { opacity: 0, scale: '.5' }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
          window.harvestReward(tipwrap, tx + 'px', dir * off + 'px', isMob ? .9 : .8).then(() => finish([fade]));
        } else if (SET === 'firefly') {     // the fireflies come for the note and carry it off
          wishing = true; el.classList.add('wished');
          const sw = swarmOnto(tip); sw.done.then(() => finish(sw.anims));
        } else { api.tip(k, false); if (k === 3) api.clear(); }
      },
      pointAct() { const b = tip.querySelector('.pn-act'); if (!b) return; const r = b.getBoundingClientRect(), nr = el.getBoundingClientRect(), s = K();
        ptr.style.setProperty('--px', (r.left - nr.left + r.width / 2) / s + 'px'); ptr.style.setProperty('--py', (r.top - nr.top + r.height / 2) / s + 'px'); ptr.style.opacity = 1; },
      isMob,
      still() { api.reset(); el.classList.add('b-on'); if (c === 'liquid') el.classList.add('ping');
        if (c === 'spring') { const w = [...el.querySelectorAll('.pn-wh')], d = String(COUNT).split(''); w.forEach((x, n) => x.style.setProperty('--d', d[n])); } }
    };

    /* ---------- your own hands on it ---------- */
    tabs.forEach((t, k) => {
      let ht, long = false, ht2;
      t.addEventListener('click', e => { takeOver(); if (long) { long = false; return; } api.tip(k, false); api.go(k); });
      if (!isMob) {
        t.addEventListener('mouseenter', () => { if (auto) return; clearTimeout(ht2); ht2 = setTimeout(() => api.tip(k, true), 250); });
        t.addEventListener('mouseleave', () => { clearTimeout(ht2); if (tipK === k) api.tip(k, false); });
      }
      t.addEventListener('pointerdown', e => { if (!isMob && e.pointerType === 'mouse') return; takeOver(); long = false; clearTimeout(ht); ht = setTimeout(() => { long = true; api.tip(k, true); }, 450); });
      const up = () => { clearTimeout(ht); if (long && !isMob) setTimeout(() => api.tip(k, false), 700); };
      t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up); t.addEventListener('pointerleave', () => clearTimeout(ht));
      t.addEventListener('contextmenu', e => e.preventDefault());
      t.addEventListener('focus', () => { if (t.matches(':focus-visible')) api.tip(k, true); });
      // desktop's plain tooltip goes when focus leaves; the phone's rich one stays until you act, tap elsewhere or press Escape
      t.addEventListener('blur', e => { if (!isMob && tipK === k && !(e.relatedTarget && tip.contains(e.relatedTarget))) api.tip(k, false); });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && tipK >= 0 && !wishing) api.tip(tipK, false); });
    // Harvest, desktop: the cursor becomes the gardener; near the watering-can button the can tips and water pours
    if (SET === 'harvest' && !isMob && window.harvestGardener && tabs[4]) {
      screen.insertAdjacentHTML('beforeend', window.harvestGardener);
      const g = screen.querySelector('.gardener'), wt = tabs[4]; let lastDrop = 0, gi;
      screen.classList.add('pn-gz');
      const place = (x, y) => { g.style.transform = `translate(${x}px,${y}px)`; };
      const pour = (x, y) => { const now = performance.now(); if (now - lastDrop < 110) return; lastDrop = now;
        const d = document.createElement('span'); d.className = 'drop'; d.style.left = (x + 26) + 'px'; d.style.top = (y - 2) + 'px'; screen.appendChild(d); setTimeout(() => d.remove(), 650); };
      screen.addEventListener('mousemove', e => {
        if (auto) return; const r = screen.getBoundingClientRect(), s = K(), x = (e.clientX - r.left) / s, y = (e.clientY - r.top) / s; place(x, y); g.classList.add('in');
        const w = wt.getBoundingClientRect(), near = Math.hypot(e.clientX - (w.left + w.width / 2), e.clientY - (w.top + w.height / 2)) < 70;
        g.classList.toggle('water', near); wt.classList.toggle('pn-pour', near); if (near) pour(x, y);
      });
      screen.addEventListener('mouseleave', () => { g.classList.remove('in', 'water'); wt.classList.remove('pn-pour'); });
      api.gardenDemo = on => {
        clearInterval(gi);
        if (!on) { g.classList.remove('in', 'water'); wt.classList.remove('pn-pour'); return; }
        const r = screen.getBoundingClientRect(), w = wt.getBoundingClientRect(), s = K(), x = (w.left - r.left + w.width / 2) / s - 26, y = (w.top - r.top + w.height / 2) / s - 14;
        ptr.style.opacity = 0; place(x, y); g.classList.add('in', 'water'); wt.classList.add('pn-pour'); gi = setInterval(() => pour(x, y), 120);
      };
    }
    screen.addEventListener('pointerdown', e => { if (tipK >= 0 && isMob && !e.target.closest('.pn-tip') && !e.target.closest('.pn-tb')) api.tip(tipK, false); });
    setHL(0);
    return api;
  }
  const bars = [...card.querySelectorAll('.pn-nav')].map(Bar);
  const all = f => bars.forEach(f);
  function sync() { const on = bars.some(b => b.el.classList.contains('b-on') || b.el.classList.contains('isl-on')); segs[0].setAttribute('aria-pressed', String(!on)); segs[1].setAttribute('aria-pressed', String(on)); }
  segs[0].addEventListener('click', () => { takeOver(); all(b => b.clear()); });
  segs[1].addEventListener('click', () => { takeOver(); all(b => b.notify()); });

  /* ---------- demo: tap Links, tap Info, a note arrives, ask about the bell, open it, back Home ---------- */
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let auto = false;
  const slow = CONCEPT === 'island' ? 900 : 0;   // firefly takes its time
  function demo() {
    auto = true; stopAll();
    all(b => { b.reset(); b.point(0, true); }); sync();
    at(450, () => all(b => b.point(1)));
    at(800, () => all(b => { b.tap(); b.go(1); }));
    at(1600, () => all(b => b.point(2)));
    at(1950, () => all(b => { b.tap(); b.go(2); }));
    at(2800, () => all(b => b.point(2, true)));
    at(2900, () => all(b => b.notify()));
    at(4700 + slow, () => all(b => { b.point(3); b.hold(true); }));
    at(5050 + slow, () => all(b => b.tip(3, true)));
    at(5600 + slow, () => all(b => b.hold(false)));
    // phone: reach for the rich tooltip's action and press it; desktop: the plain tooltip just goes
    at(6300 + slow, () => all(b => b.isMob && b.pointAct()));
    at(6750 + slow, () => all(b => { if (b.isMob) { b.tap(); b.act(); } else b.tip(3, false); }));
    at(7900 + slow, () => all(b => { b.point(3); }));
    at(8250 + slow, () => all(b => { b.tap(); b.go(3); }));
    at(9300 + slow, () => all(b => b.point(0)));
    at(9650 + slow, () => all(b => { b.tap(); b.go(0); }));
    if (SET === 'harvest') {
      at(10300, () => all(b => { if (b.gardenDemo) b.point(4); }));
      at(10700, () => all(b => { if (b.gardenDemo) { b.gardenDemo(true); b.tip(4, true); } }));
      at(12600, () => all(b => { if (b.gardenDemo) { b.gardenDemo(false); b.tip(4, false); } b.point(0, true); }));
      at(13300, demo);
    } else {
      at(10500 + slow, () => all(b => b.point(0, true)));
      at(11300 + slow, demo);
    }
  }
  // a click, tap or key press ends the demo and hands the bar to you; a new note always turns up a few
  // seconds after the badge is gone; leave it alone for a while and the demo plays again
  const IDLE = 12000;
  let idle;
  const nudge = () => { clearTimeout(idle); if (!auto && !RM) idle = setTimeout(() => { bars.forEach(b => { clearTimeout(b.pending); b.pending = null; }); demo(); }, IDLE); };
  const noteLater = b => { if (auto || b.pending || b.el.classList.contains('b-on') || b.el.classList.contains('isl-on')) return;
    b.pending = setTimeout(() => { b.pending = null; if (!auto) b.notify(); }, 4000); };
  function takeOver() {
    if (!auto) { nudge(); return; }
    auto = false; stopAll();
    all(b => { b.hidePtr(); b.el.classList.remove('ton', 'toff'); b.hold(false); if (b.gardenDemo) b.gardenDemo(false); });
    bars.forEach(noteLater); nudge();
  }
  const watch = new MutationObserver(() => { if (!auto) bars.forEach(noteLater); });
  bars.forEach(b => watch.observe(b.el, { attributes: true, attributeFilter: ['class'] }));
  ['pointerdown', 'keydown'].forEach(ev => card.addEventListener(ev, () => { if (!auto) nudge(); }));
  card.querySelector('.pn-stage').addEventListener('mousemove', () => { if (!auto) nudge(); });
  card.querySelector('.pn-play').addEventListener('click', () => { clearTimeout(idle); bars.forEach(b => { clearTimeout(b.pending); b.pending = null; }); demo(); });
  if (RM) { all(b => b.still()); sync(); } else demo();
})();
