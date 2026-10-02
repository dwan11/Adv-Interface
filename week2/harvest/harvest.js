/* Harvest · Quirky
   Badges: a kraft grocery bag. Tooltips: a carrot in soil, and the cursor becomes a gardener.
   Tooltip brief: anchor default -> anchor hovered -> tooltip (plain, no action / rich, with action).
   Here hover opens it, and so does circling the carrot (it grows as you circle). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- illustrations ---------- */
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <symbol id="g-carrot" viewBox="0 0 24 24"><path d="M8.5 9 Q12 7 15.5 9 L11.6 23 Q11.2 23.6 10.8 23 Z" fill="#E8772E"/><path d="M9.4 12.5h3M10 16h2.2M10.4 19.5h1.4" stroke="#C85F1F" stroke-width=".9" stroke-linecap="round"/><path d="M12 8.5 Q10 3 7.5 3.5 M12 8.5 Q12 1.5 13.5 2 M12 8.5 Q15 3.5 17.5 4.5" stroke="#4F8A3C" stroke-width="1.8" fill="none" stroke-linecap="round"/></symbol>
    <symbol id="g-straw" viewBox="0 0 24 24"><path d="M12 9 C6 9 5 14 8 18 C10 21 12 23 12 23 C12 23 14 21 16 18 C19 14 18 9 12 9Z" fill="#E0453A"/><g fill="#F6D26B"><ellipse cx="10" cy="13" rx=".6" ry=".9"/><ellipse cx="14" cy="13" rx=".6" ry=".9"/><ellipse cx="12" cy="16" rx=".6" ry=".9"/><ellipse cx="9.6" cy="17" rx=".6" ry=".9"/><ellipse cx="14.4" cy="17" rx=".6" ry=".9"/><ellipse cx="12" cy="20" rx=".6" ry=".9"/></g><path d="M12 10 L8 7.5 L10.5 10 L12 6.5 L13.5 10 L16 7.5 Z" fill="#4F8A3C"/></symbol>
    <symbol id="g-banana" viewBox="0 0 24 24"><path d="M4.5 7.5 Q5.5 20 19.5 19 Q14 17.5 11 13.5 Q8 9.5 8 6 Z" fill="#F2C94C" stroke="#C99A2E" stroke-width=".9" stroke-linejoin="round"/><path d="M5 6.8 L7.6 5.6" stroke="#6B4A2F" stroke-width="1.6" stroke-linecap="round"/></symbol>
    <symbol id="g-broc" viewBox="0 0 24 24"><path d="M10 13.5 L14 13.5 L13.2 22 L10.8 22 Z" fill="#9CC07A"/><g fill="#4F8A3C"><circle cx="8.5" cy="10" r="4"/><circle cx="15.5" cy="10" r="4"/><circle cx="12" cy="7" r="4.4"/></g><g fill="#5E9C46"><circle cx="11.5" cy="11.5" r="3.6"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16" cy="7" r="2.2"/></g></symbol>
  </defs></svg>`;
  const ITEMS = ['g-carrot', 'g-straw', 'g-banana', 'g-broc'];
  const X = ['20px', '56px', '36px', '48px'];
  const MID = [['-4px','-62px'],['64px','-86px'],['22px','-100px'],['90px','-58px']];
  const item = (id, i, extra = '') => `<g class="it" style="--i:${i};--x:${X[i]};--mx:${MID[i][0]};--my:${MID[i][1]}${extra}"><use href="#${id}" x="0" y="0" width="55" height="55"/></g>`;
  // four bag materials: kraft paper, canvas tote, woven straw, glossy plastic
  const STRAW_ROWS = [58, 70, 82, 94, 106, 118, 130, 142].map((y, r) => `<line x1="10" y1="${y}" x2="122" y2="${y}" stroke="#C4943E" stroke-width="7" stroke-dasharray="8 4" stroke-dashoffset="${r % 2 ? 6 : 0}"/><line x1="10" y1="${y + 6}" x2="122" y2="${y + 6}" stroke="#A9772A" stroke-width=".8" opacity=".5"/>`).join('');
  const MAT = {
    paper: {
      back: `<path d="M42 46 C40 12 62 12 62 46" stroke="#A9773F" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M18 46 L114 46 L109 38 L23 38 Z" fill="#7E5C38"/>`,
      body: `<path d="M16 46 H116 L111 148 H21 Z" fill="#C99A64"/><path d="M16 46 L27 56 L27 148 L21 148 Z" fill="rgba(70,40,10,.12)"/><rect x="16" y="46" width="100" height="10" fill="#D9B07B"/><path d="M27 124 H108 M40 66 l6 18 M80 70 l-5 22 M95 98 l7 6 M52 104 l-8 9 M67 82 l3 10" stroke="rgba(80,50,20,.16)" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
      front: `<path d="M68 46 C68 8 96 10 94 46" stroke="#B5844F" stroke-width="7" fill="none" stroke-linecap="round"/>` },
    canvas: {
      back: `<path d="M34 52 C34 2 98 2 98 52" stroke="#22395A" stroke-width="8" fill="none" stroke-linecap="round"/>`,
      body: `<path d="M18 44 H114 L110 148 H22 Z" fill="#2F4A6B"/><path d="M18 44 L28 54 L28 148 L22 148 Z" fill="rgba(0,0,0,.14)"/><rect x="18" y="44" width="96" height="11" fill="#26405E"/><path d="M22 59 H110 M25 143 H107" stroke="rgba(255,255,255,.42)" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/><rect x="50" y="88" width="32" height="22" rx="3" fill="#E9DFC8"/><path d="M56 96 h20 M56 102 h13" stroke="#2F4A6B" stroke-width="1.6" stroke-linecap="round"/>`,
      front: `<path d="M44 54 C44 10 88 10 88 54" stroke="#3E5C80" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M40 50 h8 v9 h-8z M84 50 h8 v9 h-8z" fill="#3E5C80"/><path d="M44 52 l0 5 M88 52 l0 5" stroke="rgba(255,255,255,.45)" stroke-width="1" stroke-dasharray="1.6 1.6"/>` },
    straw: {
      back: `<path d="M40 48 C40 8 92 8 92 48" stroke="#5E361C" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      body: `<clipPath id="hv-straw"><path d="M14 44 H118 L108 148 H24 Z"/></clipPath><path d="M14 44 H118 L108 148 H24 Z" fill="#D9A954"/><g clip-path="url(#hv-straw)">${STRAW_ROWS}<path d="M14 44 L26 54 L30 148 L24 148 Z" fill="rgba(90,50,10,.14)"/></g><rect x="12" y="42" width="108" height="10" rx="4" fill="#B8862F"/><path d="M18 47 l6 -3 M30 47 l6 -3 M42 47 l6 -3 M54 47 l6 -3 M66 47 l6 -3 M78 47 l6 -3 M90 47 l6 -3 M102 47 l6 -3" stroke="#8E6420" stroke-width="1.4" stroke-linecap="round"/>`,
      front: `<path d="M48 48 C48 14 84 14 84 48" stroke="#7A4A2A" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="48" cy="50" r="2.6" fill="#E8C98A"/><circle cx="84" cy="50" r="2.6" fill="#E8C98A"/>` },
    plastic: {
      back: `<path d="M38 46 C36 10 60 10 60 46" stroke="#76C2A2" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M18 46 L114 46 L110 38 L22 38 Z" fill="#6AB596"/>`,
      body: `<path d="M16 46 H116 L111 148 H21 Z" fill="#8FD3B6"/><path d="M16 46 L26 56 L26 148 L21 148 Z" fill="rgba(20,80,60,.12)"/><path d="M32 62 Q37 100 32 138" stroke="rgba(255,255,255,.6)" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M44 66 Q47 84 44 98" stroke="rgba(255,255,255,.35)" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M60 128 l14 -10 M88 70 l10 14 M70 96 l-6 10" stroke="rgba(20,90,65,.16)" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="82" cy="104" r="12" fill="none" stroke="#fff" stroke-width="2.4" opacity=".75"/><path d="M76 106 q6 7 12 0" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/>`,
      front: `<path d="M72 46 C72 8 98 10 96 46" stroke="#A6E0C7" stroke-width="7" fill="none" stroke-linecap="round" opacity=".95"/>` }
  };
  function bag(kind, mat = 'paper') {
    const m = MAT[mat];
    const group = kind === 'loop' ? `<g class="inbag">${ITEMS.map((id, i) => item(id, i)).join('')}</g>` : `<g class="burst">${ITEMS.map((id, i) => item(id, i)).join('')}</g>`;
    return `<svg class="bag" viewBox="0 0 132 154" aria-hidden="true">
      ${m.back}
      ${kind === 'loop' ? group : ''}
      <g class="body">${m.body}</g>
      ${m.front}
      ${kind === 'burst' ? group : ''}
    </svg>`;
  }
  // badge · content is shown as a row of app icons, the way it would sit on a phone
  const APPS = [['Todo', 'paper', 4], ['Record', 'canvas', 2], ['Friend', 'straw', 1], ['Recipes', 'plastic', 7]];
  const SHELF = `<div class="shelf">${APPS.map(([name, mat], i) => `<div class="app"><div class="bw" data-i="${i}">${'<span class="ring" aria-hidden="true"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="36"/></svg></span>'}<button class="bag-a" aria-label="${name}">${bag('burst', mat)}</button><span class="num-badge" aria-hidden="true">0</span></div><span class="app-name">${name}</span></div>`).join('')}</div>`;

  const PATCH = `<svg class="patch" viewBox="0 0 96 96" aria-hidden="true"><clipPath id="hv-clip"><rect x="-20" y="-90" width="136" height="186"/></clipPath>
      <path d="M8 66 Q48 50 88 66 Z" fill="#5A3D25"/>
      <g clip-path="url(#hv-clip)"><g class="carrot">
        <g class="leaves"><path d="M48 42 Q42 26 34 24 M48 42 Q47 18 52 16 M48 42 Q56 28 63 28" stroke="#4F8A3C" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
        <path d="M38 44 Q48 37 58 44 L50.5 92 Q48 96 45.5 92 Z" fill="#E8772E"/>
        <path d="M41 56h6M43 66h5M44 76h4" stroke="#C85F1F" stroke-width="1.5" stroke-linecap="round"/>
        <g class="face"><circle cx="44.5" cy="49" r="1.6" fill="#3A2A1A"/><circle cx="51.5" cy="49" r="1.6" fill="#3A2A1A"/><path d="M45 53.5 Q48 56 51 53.5" stroke="#3A2A1A" stroke-width="1.3" fill="none" stroke-linecap="round"/></g>
      </g></g>
      <path d="M2 96 L2 70 Q48 52 94 70 L94 96 Z" fill="#6B4A2F"/>
      <g fill="#5A3D25"><circle cx="22" cy="78" r="2"/><circle cx="40" cy="84" r="1.6"/><circle cx="62" cy="80" r="2.2"/><circle cx="76" cy="86" r="1.5"/><circle cx="30" cy="90" r="1.4"/><circle cx="54" cy="91" r="1.8"/></g>
      <g class="crumb" fill="#7C5A3B"><circle cx="30" cy="64" r="2"/><circle cx="66" cy="63" r="1.7"/><circle cx="58" cy="60" r="1.3"/></g>
    </svg>`;
  const GARDENER = `<span class="gardener" aria-hidden="true"><svg viewBox="0 0 40 44">
      <path d="M12 26 h16 l2 14 h-20 z" fill="#4F7FA8"/><path d="M15 26 v-2 h10 v2" fill="#4F7FA8"/><rect x="15.5" y="29" width="9" height="5" rx="1" fill="#3E6A90"/>
      <circle cx="20" cy="19" r="7" fill="#F2C7A0"/><circle cx="17.5" cy="19" r="1" fill="#3A2A1A"/><circle cx="22.5" cy="19" r="1" fill="#3A2A1A"/><path d="M17.8 22 Q20 23.6 22.2 22" stroke="#3A2A1A" stroke-width=".9" fill="none" stroke-linecap="round"/>
      <ellipse cx="20" cy="13" rx="14" ry="3.6" fill="#E6C36A"/><path d="M13 13 Q14 5 20 5 Q26 5 27 13 Z" fill="#E6C36A"/><path d="M13.6 11.2 Q20 13.4 26.4 11.2" stroke="#C85F1F" stroke-width="1.6" fill="none"/>
      <g class="can"><rect x="27" y="27" width="9" height="8" rx="1.5" fill="#8FA9B8"/><path d="M36 29 L41 25" stroke="#8FA9B8" stroke-width="2" stroke-linecap="round"/><path d="M28.5 27 Q31.5 23 34.5 27" stroke="#8FA9B8" stroke-width="1.4" fill="none"/></g>
    </svg></span>`;

  /* ---------- page ---------- */
  const card = (key, label, states, inner, tin, tout) => `<article class="card" data-k="${key}">
    <div class="lab">${label}</div>
    <div class="seg" role="group" aria-label="${label} state"><button aria-pressed="true">${states[0]}</button><button aria-pressed="false">${states[1]}</button></div>
    <div class="stage">${inner}</div>
    <div class="trig"><span><i>in</i>${tin}</span><span><i>out</i>${tout}</span></div></article>`;
  const RING = '<span class="ring" aria-hidden="true"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="36"/></svg></span>';
  document.title = 'Harvest · Week 2';
  $('#app').innerHTML = DEFS + `
    <header><a class="back" href="../../" aria-label="All projects">←</a><h1>Harvest</h1><span class="tone">Quirky</span></header>
    <div class="grid">
      ${card('dot', 'Badge · no content', ['None', 'Badge'], `<div class="bw loop">${RING}<button class="bag-a" aria-label="Groceries">${bag('loop')}</button><span class="dot-badge" aria-hidden="true"></span></div>`, 'groceries arrive', 'double-click')}
      ${card('count', 'Badge · content', ['None', 'Badge'], SHELF, 'shake a bag', 'hold')}
      ${card('plain', 'Tooltip · plain', ['Default', 'Open'], `<div class="tw plain"><button class="carrot-a" aria-label="Garden" aria-describedby="hv-tip">${PATCH}</button><div class="pop"><div class="carry"><div class="tag" id="hv-tip" role="tooltip">Check your garden</div></div></div></div>${GARDENER}`, 'hover · or circle it', 'leave')}
      ${card('rich', 'Tooltip · rich', ['Default', 'Open'], `<div class="tw rich"><button class="carrot-a" aria-label="Harvest">${PATCH}</button><div class="pop"><div class="carry"><div class="note" role="dialog" aria-label="Ready to harvest"><b>Ready to harvest</b><p>Three carrots are ready to pick today.</p><button class="act">Harvest</button></div></div></div></div>${GARDENER}`, 'hover · or circle it', 'leave · Harvest')}
    </div>`;

  /* ---------- state plumbing ---------- */
  function ctl(key) {
    const c = $(`.card[data-k="${key}"]`), segs = [...c.querySelectorAll('.seg button')];
    const w = c.querySelector('.bw, .tw'), cls = w.classList.contains('bw') ? 'on' : 'show';
    const api = {
      c, w, a: w.querySelector('button'), stage: c.querySelector('.stage'),
      on: () => w.classList.contains(cls),
      set(v) { w.classList.toggle(cls, v); segs[0].setAttribute('aria-pressed', String(!v)); segs[1].setAttribute('aria-pressed', String(v)); }
    };
    segs.forEach((b, i) => b.addEventListener('click', () => api.set(!!i)));
    return api;
  }
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  /* badge · no content — in: groceries start dropping into the bag (after a moment) · out: double-click */
  const dot = ctl('dot'); let dt;
  const arrive = ms => { clearTimeout(dt); dt = setTimeout(() => dot.set(true), ms); };
  arrive(1500);
  dot.a.addEventListener('dblclick', () => { if (dot.on()) { dot.set(false); arrive(3000); } });
  dot.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); dot.set(!dot.on()); } });

  /* badge · content — four app bags. in: shake one (wiggle over it) and its groceries fly out into its count · out: press & hold it */
  const cc = $('.card[data-k="count"]'), cstage = cc.querySelector('.stage'), csegs = [...cc.querySelectorAll('.seg button')];
  const syncSeg = () => { const on = bags.some(b => b.n > 0); csegs[0].setAttribute('aria-pressed', String(!on)); csegs[1].setAttribute('aria-pressed', String(on)); };
  const bags = APPS.map(([name, , start], i) => {
    const w = cc.querySelector(`.bw[data-i="${i}"]`), a = w.querySelector('.bag-a'), num = w.querySelector('.num-badge');
    const b = { w, a, n: 0, start };
    b.show = () => { num.textContent = b.n > 99 ? '99+' : b.n; a.setAttribute('aria-label', b.n ? `${name}, ${b.n} new` : name); w.classList.toggle('on', b.n > 0); syncSeg(); };
    b.burst = (k = 4) => { const had = b.n > 0; b.n += k; restart(w, 'shake'); restart(w, 'go'); if (had) restart(w, 'bump'); b.show(); };
    b.clear = () => { b.n = 0; w.classList.remove('go', 'bump'); b.show(); };
    let ht; w.style.setProperty('--hold', '.7s');
    a.addEventListener('pointerdown', e => { if (!b.n) return; a.setPointerCapture(e.pointerId); w.classList.add('holding'); ht = setTimeout(() => { w.classList.remove('holding'); b.clear(); }, 700); });
    const stopH = () => { clearTimeout(ht); w.classList.remove('holding'); };
    a.addEventListener('pointerup', stopH); a.addEventListener('pointercancel', stopH);
    a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); b.burst(); } if (e.key === 'Backspace' || e.key === 'Delete') b.clear(); });
    return b;
  });
  csegs[0].addEventListener('click', () => bags.forEach(b => b.clear()));
  csegs[1].addEventListener('click', () => bags.forEach(b => { if (!b.n) b.burst(b.start); }));
  const nearestBag = (x, y) => { let best = null, bd = 80; bags.forEach(b => { const [cx, cy] = center(b.a), d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = b; } }); return best; };
  let flips = [], lastX = null, dir = 0;
  cstage.addEventListener('pointermove', e => {
    if (lastX !== null) {
      const d = Math.sign(e.clientX - lastX);
      if (d && d !== dir) { dir = d; const t = performance.now(); flips = flips.filter(f => t - f < 700); flips.push(t);
        if (flips.length >= 5) { const b = nearestBag(e.clientX, e.clientY); if (b) { flips = []; b.burst(); } } }
    }
    lastX = e.clientX;
  });

  /* rich tooltip · "Harvest": the note turns into a pot of cooked carrots, with reward rays shining behind it */
  const slice = ([x, y, r, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="${r}" ry="${r * .62}" fill="#D9601C"/><ellipse cy="-1" rx="${r * .9}" ry="${r * .54}" fill="#EE8436"/><ellipse cy="-1" rx="${r * .55}" ry="${r * .32}" fill="#F6A65A"/><ellipse cy="-1" rx="${r * .2}" ry="${r * .12}" fill="#FCCB86"/><ellipse cx="${-r * .28}" cy="${-r * .3}" rx="${r * .42}" ry="${r * .14}" fill="rgba(255,255,255,.4)"/></g>`;
  const SLICES = [[34,44,10,-8],[50,46,11,6],[68,47,11,-4],[86,46,11,8],[104,44,10,-6],[42,36,10,10],[58,37,11,-12],[76,36,11,6],[94,37,10,-10],[50,28,10,-4],[67,27,11,8],[84,28,10,-8],[60,19,10,4],[76,19,10,-6],[68,12,9,0]];
  const POT = `<svg viewBox="0 0 140 124" aria-hidden="true">
      <ellipse cx="70" cy="118" rx="50" ry="5" fill="rgba(58,42,26,.22)"/>
      <g class="steam"><path d="M48 6 q-6 -7 0 -14 q6 -7 0 -14"/><path d="M70 0 q-6 -7 0 -14 q6 -7 0 -14"/><path d="M92 6 q-6 -7 0 -14 q6 -7 0 -14"/></g>
      <rect x="2" y="52" width="17" height="11" rx="5" fill="#24575B"/><rect x="121" y="52" width="17" height="11" rx="5" fill="#24575B"/>
      <path d="M14 44 A56 12 0 0 1 126 44 Z" fill="#1F4E52"/>
      <ellipse cx="70" cy="45" rx="52" ry="10" fill="#B4541E"/>
      ${SLICES.map(slice).join('')}
      <g fill="#4F8A3C"><path d="M45 31 l5 -3 l1 3 z"/><path d="M80 22 l4 -4 l2 3 z"/><path d="M97 40 l5 -1 l-1 3 z"/><path d="M63 40 l4 -3 l1 3 z"/><path d="M70 6 q-5 -6 -1 -9 q3 4 1 9z"/></g>
      <path d="M14 44 Q14 104 40 110 H100 Q126 104 126 44 A56 12 0 0 1 14 44 Z" fill="#2E6E73"/>
      <path d="M14 44 A56 12 0 0 0 126 44" stroke="#4A9A9E" stroke-width="5" fill="none"/>
      <path d="M30 62 Q32 88 44 100" stroke="rgba(255,255,255,.3)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M108 62 Q108 82 100 96" stroke="rgba(0,0,0,.14)" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`;
  const SPARKS = [[-125, -55, 16, 0], [112, -82, 12, .3], [-98, 52, 11, .5], [122, 36, 15, .15], [-42, -112, 10, .4], [58, -118, 14, .6]]
    .map(([x, y, s, d]) => `<span class="spark" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;animation-delay:${.35 + d}s"></span>`).join('');
  function cook(api, close) {
    if (api.busy) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return close();
    api.busy = true;
    const note = api.w.querySelector('.note'), carry = api.w.querySelector('.carry');
    const r = document.createElement('div');
    r.className = 'reward'; r.setAttribute('aria-hidden', 'true');
    r.innerHTML = `<span class="rays"></span><span class="glow"></span>${SPARKS}<div class="pot">${POT}</div>`;
    r.style.top = (note.offsetTop + note.offsetHeight / 2) + 'px';
    carry.appendChild(r); carry.classList.add('cooked');
    setTimeout(() => r.classList.add('out'), 2800);
    setTimeout(() => { api.busy = false; close(); setTimeout(() => { r.remove(); carry.classList.remove('cooked'); }, 700); }, 3250);
  }

  /* tooltips — cursor is a gardener; hover the carrot, or circle it, and it grows up carrying the info */
  function garden(api, rich) {
    const g = api.stage.querySelector('.gardener'), carrot = api.w.querySelector('.carrot');
    api.stage.classList.add('gz');
    let acc = 0, lastA = null, lastT = 0, ct, lastDrop = 0;
    const open = () => { clearTimeout(ct); api.w.classList.remove('circling'); carrot.style.removeProperty('--rise'); api.set(true); };
    const close = () => { if (api.busy) return; acc = 0; api.w.classList.remove('circling'); carrot.style.removeProperty('--rise'); api.set(false); };
    api.stage.addEventListener('pointermove', e => {
      const r = api.stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (e.pointerType === 'mouse') { g.style.transform = `translate(${x}px,${y}px)`; g.classList.add('in'); }
      const [cx, cy] = center(api.a), d = Math.hypot(e.clientX - cx, e.clientY - cy), now = performance.now();
      const near = d < 140; g.classList.toggle('water', near && d > 30);
      if (near && d > 30 && now - lastDrop > 110 && e.pointerType === 'mouse') {
        lastDrop = now; const dr = document.createElement('span'); dr.className = 'drop'; dr.style.left = (x + 26) + 'px'; dr.style.top = (y - 2) + 'px';
        api.stage.appendChild(dr); setTimeout(() => dr.remove(), 650);
      }
      // circling: add up the angle travelled around the carrot
      if (!api.on() && d > 34 && d < 150) {
        const a = Math.atan2(e.clientY - cy, e.clientX - cx);
        if (lastA !== null && now - lastT < 400) { let da = a - lastA; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; acc += da; }
        lastA = a; lastT = now;
        const p = Math.min(1, Math.abs(acc) / (Math.PI * 1.8));
        if (p > .05) { api.w.classList.add('circling'); carrot.style.setProperty('--rise', p.toFixed(2)); }
        if (p >= 1) open();
      } else if (!api.on() && d >= 150) { acc = 0; lastA = null; api.w.classList.remove('circling'); carrot.style.removeProperty('--rise'); }
      if (rich && api.on() && d > 220 && !api.w.contains(e.target)) { clearTimeout(ct); ct = setTimeout(close, 300); }
    });
    api.stage.addEventListener('pointerleave', () => { g.classList.remove('in', 'water'); if (!rich) close(); else { clearTimeout(ct); ct = setTimeout(close, 500); } });
    api.a.addEventListener('mouseenter', open);
    if (!rich) api.a.addEventListener('mouseleave', () => { if (!api.w.matches(':hover')) close(); });
    else { api.w.addEventListener('mouseenter', () => clearTimeout(ct)); api.w.addEventListener('mouseleave', () => { clearTimeout(ct); ct = setTimeout(close, 500); }); }
    api.a.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') (api.on() ? close : open)(); });
    api.a.addEventListener('focus', () => { if (api.a.matches(':focus-visible')) open(); });
    if (!rich) api.a.addEventListener('blur', close);
    if (rich) {
      api.w.querySelector('.act').addEventListener('click', () => cook(api, close));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      document.addEventListener('pointerdown', e => { if (api.on() && !api.w.contains(e.target) && e.pointerType !== 'mouse') close(); });
    }
    const segs = api.c.querySelectorAll('.seg button'); segs[0].addEventListener('click', close); segs[1].addEventListener('click', open);
  }
  garden(ctl('plain'), false);
  garden(ctl('rich'), true);
})();
