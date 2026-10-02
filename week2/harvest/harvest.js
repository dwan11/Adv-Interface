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
  function bag(kind) {
    const group = kind === 'loop' ? `<g class="inbag">${ITEMS.map((id, i) => item(id, i)).join('')}</g>` : `<g class="burst">${ITEMS.map((id, i) => item(id, i)).join('')}</g>`;
    return `<svg class="bag" viewBox="0 0 132 154" aria-hidden="true">
      <path d="M42 46 C40 12 62 12 62 46" stroke="#A9773F" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M18 46 L114 46 L109 38 L23 38 Z" fill="#7E5C38"/>
      ${kind === 'loop' ? group : ''}
      <g class="body">
        <path d="M16 46 H116 L111 148 H21 Z" fill="#C99A64"/>
        <path d="M16 46 L27 56 L27 148 L21 148 Z" fill="rgba(70,40,10,.12)"/>
        <rect x="16" y="46" width="100" height="10" fill="#D9B07B"/>
        <path d="M27 124 H108 M40 66 l6 18 M80 70 l-5 22 M95 98 l7 6 M52 104 l-8 9 M67 82 l3 10" stroke="rgba(80,50,20,.16)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      </g>
      <path d="M68 46 C68 8 96 10 94 46" stroke="#B5844F" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${kind === 'burst' ? group : ''}
    </svg>`;
  }
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
      ${card('count', 'Badge · content', ['None', 'Badge'], `<div class="bw">${RING}<button class="bag-a" aria-label="Groceries">${bag('burst')}</button><span class="num-badge" aria-hidden="true">4</span></div>`, 'shake the bag', 'hold')}
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

  /* badge · content — in: shake the bag (wiggle over it), groceries fly out into a number · out: press & hold */
  const cnt = ctl('count'); let n = 0; const num = cnt.w.querySelector('.num-badge');
  const burst = () => { n += 4; num.textContent = n > 99 ? '99+' : n; restart(cnt.w, 'shake'); restart(cnt.w, 'go'); if (cnt.on()) restart(cnt.w, 'bump'); cnt.set(true); };
  let flips = [], lastX = null, dir = 0;
  cnt.stage.addEventListener('pointermove', e => {
    if (lastX !== null) {
      const d = Math.sign(e.clientX - lastX);
      if (d && d !== dir) { dir = d; const t = performance.now(); flips = flips.filter(f => t - f < 700); flips.push(t);
        const [cx, cy] = center(cnt.a); if (flips.length >= 5 && Math.hypot(e.clientX - cx, e.clientY - cy) < 130) { flips = []; burst(); } }
    }
    lastX = e.clientX;
  });
  let ht; cnt.w.style.setProperty('--hold', '.7s');
  cnt.a.addEventListener('pointerdown', e => { if (!cnt.on()) return; cnt.a.setPointerCapture(e.pointerId); cnt.w.classList.add('holding'); ht = setTimeout(() => { cnt.w.classList.remove('holding'); n = 0; cnt.set(false); cnt.w.classList.remove('go'); }, 700); });
  const stopH = () => { clearTimeout(ht); cnt.w.classList.remove('holding'); };
  cnt.a.addEventListener('pointerup', stopH); cnt.a.addEventListener('pointercancel', stopH);
  cnt.a.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); burst(); } if (e.key === 'Backspace' || e.key === 'Delete') { n = 0; cnt.set(false); } });
  cnt.c.querySelector('.seg button:last-child').addEventListener('click', () => { if (!n) { n = 4; num.textContent = 4; } restart(cnt.w, 'go'); });

  /* tooltips — cursor is a gardener; hover the carrot, or circle it, and it grows up carrying the info */
  function garden(api, rich) {
    const g = api.stage.querySelector('.gardener'), carrot = api.w.querySelector('.carrot');
    api.stage.classList.add('gz');
    let acc = 0, lastA = null, lastT = 0, ct, lastDrop = 0;
    const open = () => { clearTimeout(ct); api.w.classList.remove('circling'); carrot.style.removeProperty('--rise'); api.set(true); };
    const close = () => { acc = 0; api.w.classList.remove('circling'); carrot.style.removeProperty('--rise'); api.set(false); };
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
      api.w.querySelector('.act').addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      document.addEventListener('pointerdown', e => { if (api.on() && !api.w.contains(e.target) && e.pointerType !== 'mouse') close(); });
    }
    const segs = api.c.querySelectorAll('.seg button'); segs[0].addEventListener('click', close); segs[1].addEventListener('click', open);
  }
  garden(ctl('plain'), false);
  garden(ctl('rich'), true);
})();
