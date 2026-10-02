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
  const LABEL = ['Home', 'Links', 'Info', 'Notifications'];
  const MOTION = { spring: 'springs over and squashes', liquid: 'stretches like liquid', island: 'grows into the note', hop: 'hops and rings', shy: 'hesitates, then commits' }[CONCEPT];
  const ICON = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 16h4"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6 2 7.5 2 7.5H4S6 15 6 9z"/><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0"/></svg>'
  ];
  const CURSOR = '<svg viewBox="0 0 16 22" aria-hidden="true"><path d="M1 1 L1 17 L5.5 13 L8.5 20 L11 19 L8 12 L14 12 Z" fill="#18181B" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const ISL = {
    desk: `${ICON[3]}<span><b>${COUNT}</b> notes, just for you</span>`,
    mob: `${ICON[3]}<span><b>${COUNT}</b> notes<small>just for you</small></span>`
  };
  const wheels = String(COUNT).split('').map(() => `<span class="pn-wh">${[...Array(10)].map((_, d) => `<span>${d}</span>`).join('')}</span>`).join('');

  /* ---------- each design's own graphics ---------- */
  const GRASS = '<svg class="pn-art" viewBox="0 0 40 22" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
    [[6,14,-2,'#5E8C45',2.8,-.4],[11,20,-3,'#3F6B30',2.4,-1.2],[16,16,1,'#6E9A4B',3.1,-2],[21,21,-1,'#355E2B',2.7,-.8],[26,17,2,'#5E8C45',3.3,-1.6],[31,19,2,'#3F6B30',2.9,-.2],[35,13,3,'#6E9A4B',2.6,-2.4]]
      .map(([x,h,dx,c,d,dl]) => `<path style="--d:${d}s;--dl:${dl}s" fill="${c}" d="M${x-1.6} 22 Q${x+dx*.25} ${22-h*.6} ${x+dx} ${22-h} Q${x+dx*.25+1.1} ${22-h*.55} ${x+1.6} 22Z"/>`).join('') + '</svg>';
  const FLOWER = '<svg class="pn-art" viewBox="-17 -17 34 34" aria-hidden="true">' +
    [0,72,144,216,288].map((a,n) => `<ellipse cx="0" cy="-8" rx="5.6" ry="8.6" transform="rotate(${a})" fill="${n % 2 ? '#F7C59F' : '#F2A7B5'}"/>`).join('') +
    `<circle r="8" fill="#F3C847"/><text y=".6" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="#1F2A1C">${COUNT}</text></svg>`;
  const PUFF = '<svg class="pn-art" viewBox="-18 -18 36 36" aria-hidden="true"><g class="sds">' +
    [...Array(16)].map((_,n) => { const a = n / 16 * Math.PI * 2, x = (Math.cos(a) * 15).toFixed(1), y = (Math.sin(a) * 15).toFixed(1); return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#8E9CA4" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.1" fill="#5D6A71"/>`; }).join('') +
    `</g><circle r="8.5" fill="#fff" stroke="#8E9CA4" stroke-width=".8"/><text y=".6" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="#1D2A33">${COUNT}</text></svg>`;
  const CHUTE = '<svg class="pn-chute" viewBox="0 0 44 18" aria-hidden="true">' +
    [...Array(11)].map((_,n) => { const a = Math.PI * (1.08 + n * .084), x = (22 + Math.cos(a) * 20).toFixed(1), y = (18 + Math.sin(a) * 16).toFixed(1); return `<line x1="22" y1="18" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r=".9"/>`; }).join('') + '</svg>';
  const SEARCH = '<svg class="pn-srch" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>';
  const GROC = ['g-carrot', 'g-straw', 'g-banana'].map((id, n) => `<svg viewBox="0 0 24 24" style="--i:${n};--gx:${[-16, 4, 18][n]}px"><use href="#${id}" width="24" height="24"/></svg>`).join('');
  const H1ART = SET === 'bloom' ? GRASS : SET === 'shy' ? '<span class="pn-art"><i></i><i></i></span>' : '';
  const BADGEART = SET === 'bloom' ? FLOWER : SET === 'dandelion' ? PUFF : '';
  const fireflies = n => SET !== 'firefly' ? '' : [...Array(n)].map((_, k) => {
    const r = a => ((Math.sin(k * 12.9898 + a) * 43758.5453) % 1 + 1) % 1;
    return `<span class="pn-ffl" style="left:${(8 + r(1) * 84).toFixed(0)}%;top:${(30 + r(2) * 60).toFixed(0)}%;--d:${(5 + r(3) * 5).toFixed(1)}s;--dl:-${(r(4) * 4).toFixed(1)}s;--x1:${(r(5) * 40 - 20).toFixed(0)}px;--y1:${(r(6) * 30 - 15).toFixed(0)}px;--x2:${(r(7) * 40 - 20).toFixed(0)}px;--y2:${(r(8) * 30 - 15).toFixed(0)}px;--x3:${(r(9) * 40 - 20).toFixed(0)}px;--y3:${(r(10) * 30 - 15).toFixed(0)}px"></span>`; }).join('');
  const ORBS = kind => SET !== 'firefly' ? '' : `<span class="pn-orbs" style="--sy:${kind === 'desk' ? .3 : .55}">${[[3.2, kind === 'desk' ? 125 : 70], [4.4, kind === 'desk' ? 105 : 58], [5.6, kind === 'desk' ? 140 : 76]].map(([d, rr], n) => `<span class="pn-orb" style="--d:${d}s;--r:${rr}px;animation-delay:-${n * 1.3}s"><i></i></span>`).join('')}</span>`;

  if (!document.getElementById('pn-goo')) document.body.insertAdjacentHTML('afterbegin',
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <filter id="pn-goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter>
      <filter id="pn-goo-s"><feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter>
    </defs></svg>`);

  const bar = kind => `<div class="pn-nav" data-c="${CONCEPT}" role="tablist" aria-label="App navigation (${kind === 'desk' ? 'desktop' : 'phone'})">
      <span class="pn-bg"></span>
      <span class="pn-hl"><span class="pn-h1">${H1ART}</span></span>
      <span class="pn-rip"></span><span class="pn-rip"></span>
      <span class="pn-tabs">${ICON.map((s, k) => `<button class="pn-tb${k ? '' : ' on'}" data-k="${k}" style="--k:${k}" role="tab" aria-selected="${!k}" aria-label="${LABEL[k]}">${s}</button>`).join('')}</span>
      <span class="pn-bd"><i class="d2"></i><i class="d1"></i></span>
      <span class="pn-pets">${[0, 60, 120, 180, 240, 300].map(a => `<i style="--a:${a}deg"></i>`).join('')}</span>
      <span class="pn-badge" aria-hidden="true">${BADGEART}<span class="pn-n">${COUNT}</span><span class="pn-odo">${wheels}</span></span>
      <span class="pn-isl">${ORBS(kind)}${ISL[kind]}</span><span class="pn-groc">${SET === 'harvest' ? GROC : ''}</span>
      <span class="pn-tipwrap"><span class="pn-stem"></span>${SET === 'dandelion' ? CHUTE : ''}<span class="pn-tg"><i class="pn-neck"></i><i class="pn-tbd"></i></span><span class="pn-tip" role="tooltip">${SET === 'shy' ? SEARCH : ''}<span class="pn-txt"></span><span class="pn-caret"></span></span></span>
      <span class="pn-ptr">${kind === 'desk' ? CURSOR : '<i></i>'}</span>
    </div>`;
  const card = document.createElement('article');
  card.className = 'card pn-card';
  card.dataset.k = 'nav';
  card.innerHTML = `
    <div class="lab">Navigation · pill bar · ${MOTION}</div>
    <div class="pn-row"><div class="seg" role="group" aria-label="Notification state"><button aria-pressed="true">None</button><button aria-pressed="false">Badge</button></div><button class="pn-play" type="button">Play demo</button></div>
    <div class="pn-stage">
      <div class="pn-desk-wrap"><p class="pn-cap">Desktop · bar on top, tooltip below</p><div class="pn-desk"><div class="pn-bar"><i></i><i></i><i></i></div>
        <div class="pn-screen"><div class="pn-feed">${'<i></i>'.repeat(6)}</div>${fireflies(5)}${bar('desk')}</div></div></div>
      <div class="pn-mob-wrap"><p class="pn-cap">Phone · bar at bottom, tooltip above</p><div class="pn-mob"><div class="pn-screen"><span class="pn-notch"></span>
        <div class="pn-feed">${'<i></i>'.repeat(6)}</div>${fireflies(4)}${bar('mob')}<span class="pn-homebar"></span></div></div></div>
    </div>
    <div class="trig"><span><i>switch</i>tap a tab</span><span><i>badge</i>a note arrives · open the bell</span><span><i>tooltip</i>hover · long-press</span></div>`;
  grid.prepend(card);

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
    let i = 0, tipK = -1, typing = [];
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
        if (c === 'liquid') { el.classList.remove('b-on', 'ping'); restart(el, 'unping'); }
        else if (c === 'spring') { el.querySelectorAll('.pn-wh').forEach(w => w.style.setProperty('--d', 0)); later(() => { el.classList.remove('b-on'); sync(); }, 350); }
        else el.classList.remove('b-on');
        sync();
      },
      tip(k, v) {
        typing.forEach(clearTimeout); typing = [];
        if (!v) { if (tipK < 0) return; tipK = -1; el.classList.remove('ton'); if (c === 'liquid') { restart(el, 'toff'); later(() => el.classList.remove('toff'), 450); } return; }
        const { T } = m(), label = LABEL[k];
        tipK = k; el.style.setProperty('--tipx', pos(k) + T / 2 + 'px');
        txt.textContent = label; tipwrap.style.setProperty('--tx', '0px');
        const w = tip.offsetWidth, sr = screen.getBoundingClientRect(), nr = el.getBoundingClientRect();
        const cx = nr.left - sr.left + pos(k) + T / 2, left = cx - w / 2, clamped = Math.max(8, Math.min(sr.width - 8 - w, left));
        tipwrap.style.setProperty('--tx', (clamped - left) + 'px'); tipwrap.style.setProperty('--tw', w + 'px');
        if (c === 'shy') {  // types its own name, slips, corrects itself
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
      still() { api.reset(); el.classList.add('b-on'); if (c === 'liquid') el.classList.add('ping');
        if (c === 'spring') { const w = [...el.querySelectorAll('.pn-wh')], d = String(COUNT).split(''); w.forEach((x, n) => x.style.setProperty('--d', d[n])); } }
    };

    /* ---------- your own hands on it ---------- */
    const isMob = !!el.closest('.pn-mob');
    tabs.forEach((t, k) => {
      let ht, long = false, ht2;
      t.addEventListener('click', e => { takeOver(); if (long) { long = false; return; } api.tip(k, false); api.go(k); });
      if (!isMob) {
        t.addEventListener('mouseenter', () => { takeOver(); clearTimeout(ht2); ht2 = setTimeout(() => api.tip(k, true), 250); });
        t.addEventListener('mouseleave', () => { clearTimeout(ht2); if (tipK === k) api.tip(k, false); });
      }
      t.addEventListener('pointerdown', e => { if (!isMob && e.pointerType === 'mouse') return; takeOver(); long = false; clearTimeout(ht); ht = setTimeout(() => { long = true; api.tip(k, true); }, 450); });
      const up = () => { clearTimeout(ht); if (long) setTimeout(() => api.tip(k, false), 700); };
      t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up); t.addEventListener('pointerleave', () => clearTimeout(ht));
      t.addEventListener('contextmenu', e => e.preventDefault());
      t.addEventListener('focus', () => { if (t.matches(':focus-visible')) api.tip(k, true); });
      t.addEventListener('blur', () => { if (tipK === k) api.tip(k, false); });
    });
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
    at(6800 + slow, () => all(b => { b.tip(3, false); b.hold(false); }));
    at(7100 + slow, () => all(b => { b.tap(); b.go(3); }));
    at(8100 + slow, () => all(b => b.point(0)));
    at(8450 + slow, () => all(b => { b.tap(); b.go(0); }));
    at(9300 + slow, () => all(b => b.point(0, true)));
    at(9900 + slow, demo);
  }
  // the first touch ends the demo; after that a new note turns up a few seconds after you clear one
  function takeOver() {
    if (!auto) return; auto = false; stopAll();
    all(b => { b.hidePtr(); b.el.classList.remove('ton', 'toff'); });
  }
  const watch = new MutationObserver(() => { if (auto) return; bars.forEach(b => { if (!b.el.classList.contains('b-on') && !b.el.classList.contains('isl-on') && !b.pending) {
    b.pending = setTimeout(() => { b.pending = null; if (!auto) b.notify(); }, 6000); } }); });
  bars.forEach(b => watch.observe(b.el, { attributes: true, attributeFilter: ['class'] }));
  card.querySelector('.pn-play').addEventListener('click', () => { bars.forEach(b => { clearTimeout(b.pending); b.pending = null; }); demo(); });
  if (RM) { all(b => b.still()); sync(); } else demo();
})();
