/**
 * PiscesLoader — an art deco progress indicator.
 * 0%   : the 16 stars of Pisces, unconnected
 * 1–99%: a gold line travels from the top star, linking each star to the next
 * 100% : fully connected; the constellation settles into a slow shimmer
 *
 *   const loader = PiscesLoader(document.getElementById('sky'), { onUpdate });
 *   loader.setProgress(40);        // determinate: 0–100, call as often as you like
 *   loader.setIndeterminate(true); // progress unknown: a gold comet circles the constellation
 */
(function (global) {
  const NS = 'http://www.w3.org/2000/svg';

  // x, y, size (1 = small … 3.2 = brightest), Bayer name
  const STARS = [
    [360, 95, 1.2, 'τ Psc'], [320, 150, 1.0, 'υ Psc'], [343, 213, 1.2, 'φ Psc'],
    [250, 395, 3.0, 'η Psc · Alpherg'], [175, 518, 1.4, 'ο Psc'], [75, 648, 3.2, 'α Psc · Alrescha'],
    [188, 590, 1.3, 'ν Psc'], [250, 582, 1.3, 'μ Psc'], [387, 555, 1.5, 'ε Psc'], [460, 562, 1.4, 'δ Psc'],
    [712, 568, 3.0, 'ω Psc'], [812, 598, 2.4, 'ι Psc'], [875, 572, 1.4, 'θ Psc'], [940, 632, 2.8, 'γ Psc'],
    [882, 685, 1.4, 'κ Psc'], [803, 678, 1.5, 'λ Psc'],
  ];
  // Drawing order: from the top star, down the northern fish, along the cord, round the circlet.
  const EDGES = [[0,1],[1,2],[2,0],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,11]];

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const f = (n) => n.toFixed(2);
  const gapFor = (t) => 22 * t * (t >= 2.3 ? 0.5 : 0.38);

  function rayPath(cx, cy, deg, len, w) {
    const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    return `M${f(cx - s * w)},${f(cy + c * w)} L${f(cx + c * len)},${f(cy + s * len)} L${f(cx + s * w)},${f(cy - c * w)} Z`;
  }

  function drawStar(g, x, y, t) {
    const s = 22 * t;
    el('circle', { cx: x, cy: y, r: f(s * 1.15), fill: 'url(#pl-glow)', class: 'pl-glow' }, g);
    if (t >= 2.3) {
      const burst = el('g', { class: 'pl-burst' }, g);
      for (let k = 0; k < 24; k++) {
        const a = (k * 15 + 7.5) * Math.PI / 180, r1 = s * 0.42, r2 = s * (k % 2 ? 0.78 : 0.6);
        el('line', { x1: f(x + Math.cos(a) * r1), y1: f(y + Math.sin(a) * r1), x2: f(x + Math.cos(a) * r2), y2: f(y + Math.sin(a) * r2),
          stroke: 'url(#pl-gold)', 'stroke-width': t < 3 ? 0.9 : 1.1, 'stroke-linecap': 'round' }, burst);
      }
      el('circle', { cx: x, cy: y, r: f(s * 0.36), fill: 'none', stroke: 'url(#pl-gold)', 'stroke-width': 1 }, g);
      el('circle', { cx: x, cy: y, r: f(s * 0.86), fill: 'none', stroke: '#D4AF5A', 'stroke-width': 0.7, 'stroke-dasharray': '1.5 4', opacity: 0.8, class: 'pl-orbit' }, g);
    } else if (t >= 1.4) {
      el('circle', { cx: x, cy: y, r: f(s * 0.34), fill: 'none', stroke: 'url(#pl-gold)', 'stroke-width': 0.8 }, g);
    }
    const d = [];
    for (let k = 0; k < 4; k++) d.push(rayPath(x, y, k * 90 - 90, s, s * 0.11));
    for (let k = 0; k < 4; k++) d.push(rayPath(x, y, k * 90 - 45, s * 0.5, s * 0.075));
    el('path', { d: d.join(' '), fill: 'url(#pl-gold)', stroke: '#5E4418', 'stroke-width': 0.6 }, g);
    for (let k = 0; k < 4; k++) {
      const a = (k * 90 - 90) * Math.PI / 180;
      el('line', { x1: x, y1: y, x2: f(x + Math.cos(a) * s * 0.92), y2: f(y + Math.sin(a) * s * 0.92), stroke: '#FFF4D0', 'stroke-width': 0.5, opacity: 0.8 }, g);
    }
    const c = s * 0.16;
    el('path', { d: `M${x},${f(y - c)} L${f(x + c)},${y} L${x},${f(y + c)} L${f(x - c)},${y} Z`, fill: '#FFF1C4', stroke: '#5E4418', 'stroke-width': 0.5, class: 'pl-core' }, g);
  }

  function PiscesLoader(host, opts = {}) {
    const svg = el('svg', { viewBox: '-20 10 1040 740', class: 'pl-sky', role: 'img', 'aria-label': 'Pisces constellation loader' });
    const defs = el('defs', {}, svg);
    const gold = el('linearGradient', { id: 'pl-gold', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    [[0,'#F6E3A6'],[.35,'#D4AF5A'],[.6,'#A88034'],[.8,'#E9CD83'],[1,'#8C6524']].forEach(([o,c]) => el('stop', { offset: o, 'stop-color': c }, gold));
    const gl = el('linearGradient', { id: 'pl-line', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 1000, y2: 700 }, defs);
    [[0,'#EED493'],[.5,'#B8903F'],[1,'#E4C57A']].forEach(([o,c]) => el('stop', { offset: o, 'stop-color': c }, gl));
    const glow = el('radialGradient', { id: 'pl-glow' }, defs);
    [[0,'#F7DE95',.55],[.45,'#E2BE62',.18],[1,'#E2BE62',0]].forEach(([o,c,a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, glow));

    const linksG = el('g', { class: 'pl-links' }, svg);
    const starsG = el('g', { class: 'pl-stars' }, svg);

    // Build links, measured in visible (gap-trimmed) length.
    let total = 0;
    const links = EDGES.map(([a, b]) => {
      const [x1, y1, t1] = STARS[a], [x2, y2, t2] = STARS[b];
      const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
      const g1 = gapFor(t1), g2 = gapFor(t2);
      const ax = x1 + ux * g1, ay = y1 + uy * g1, bx = x2 - ux * g2, by = y2 - uy * g2;
      const len = Math.max(0, d - g1 - g2), nx = -uy * 2.6, ny = ux * 2.6;
      const g = el('g', {}, linksG);
      const main = el('line', { x1: f(ax), y1: f(ay), x2: f(bx), y2: f(by), stroke: 'url(#pl-line)', 'stroke-width': 1.5, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, g);
      const hair = el('line', { x1: f(ax + nx), y1: f(ay + ny), x2: f(bx + nx), y2: f(by + ny), stroke: '#D4AF5A', 'stroke-width': 0.45, opacity: 0.75, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, g);
      const tick = (px, py) => el('line', { x1: f(px - nx * 1.3), y1: f(py - ny * 1.3), x2: f(px + nx * 1.8), y2: f(py + ny * 1.8), stroke: '#D4AF5A', 'stroke-width': 0.8, class: 'pl-bit' }, g);
      const t0 = tick(ax, ay), t1b = tick(bx, by);
      let gem = null;
      if (len > 140) {
        const mx = (ax + bx) / 2, my = (ay + by) / 2, k = 4.2, ang = Math.atan2(dy, dx) * 180 / Math.PI;
        gem = el('path', { d: `M${f(mx - k * 1.8)},${f(my)} L${f(mx)},${f(my - k)} L${f(mx + k * 1.8)},${f(my)} L${f(mx)},${f(my + k)} Z`,
          transform: `rotate(${f(ang)} ${f(mx)} ${f(my)})`, fill: 'url(#pl-gold)', stroke: '#5E4418', 'stroke-width': 0.4, class: 'pl-bit' }, g);
      }
      const link = { a, b, len, start: total, main, hair, t0, t1: t1b, gem };
      total += len;
      return link;
    });

    const stars = STARS.map(([x, y, t], i) => {
      const g = el('g', { class: 'pl-star' }, starsG);
      g.style.setProperty('--i', i);
      drawStar(g, x, y, t);
      return g;
    });

    // Progress % at which each star is first reached (star 0 lights at the first tick).
    const reachAt = STARS.map(() => Infinity);
    reachAt[EDGES[0][0]] = 0;
    links.forEach((l) => { reachAt[l.b] = Math.min(reachAt[l.b], (l.start + l.len) / total * 100); });

    host.appendChild(svg);

    const reduceMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let shown = 0, target = 0, raf = 0, last = 0;
    let indet = false, tail = 0, loopHead = 0;
    const COMET = 24, LOOP_SPEED = 16;          // comet length (%) and speed (%/s) in indeterminate mode

    // Draws the path between tail% and head% (tail is 0 for normal progress).
    function render(p, tail = 0) {
      const headD = p / 100 * total, tailD = tail / 100 * total;
      let current = null;
      links.forEach((l) => {
        const a = Math.max(0, Math.min(1, (tailD - l.start) / (l.len || 1)));
        const b = Math.max(0, Math.min(1, (headD - l.start) / (l.len || 1)));
        const vis = Math.max(0, b - a);
        const dash = vis > 0 ? `${vis} 2` : '0 2', off = String(-a);
        l.main.setAttribute('stroke-dasharray', dash); l.main.setAttribute('stroke-dashoffset', off);
        l.hair.setAttribute('stroke-dasharray', dash); l.hair.setAttribute('stroke-dashoffset', off);
        l.t0.classList.toggle('on', vis > 0 && a === 0);
        l.t1.classList.toggle('on', b >= 1 && a < 1);
        l.gem?.classList.toggle('on', a <= 0.5 && b >= 0.5 && vis > 0);
        if (b > 0 && b < 1) current = l;
      });
      stars.forEach((g, i) => g.classList.toggle('lit', p > 0 && p + 1e-6 >= reachAt[i] && reachAt[i] >= tail - 1e-6));
      if (indet) {
        svg.dataset.state = 'indeterminate';
        opts.onUpdate?.({ percent: null, state: 'indeterminate', from: current ? STARS[current.a][3] : null, to: current ? STARS[current.b][3] : null, litCount: null });
        return;
      }
      const state = p <= 0.001 ? 'empty' : p >= 99.999 ? 'complete' : 'progress';
      svg.dataset.state = state;
      opts.onUpdate?.({
        percent: p, state,
        from: current ? STARS[current.a][3] : null,
        to: current ? STARS[current.b][3] : null,
        litCount: stars.filter((g) => g.classList.contains('lit')).length,
      });
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (indet) {                                 // comet: head runs ahead, tail follows, then wraps
        loopHead += (reduceMotion ? 0 : LOOP_SPEED) * dt;
        if (loopHead > 100 + COMET) loopHead = 0;
        const tailTarget = Math.max(0, loopHead - COMET);
        tail += (tailTarget - tail) * Math.min(1, dt * 8);
        if (loopHead === 0) tail = 0;
        shown = Math.min(100, loopHead);
        render(shown, Math.min(tail, shown));
        raf = requestAnimationFrame(tick); return;
      }
      if (tail > 0) tail = Math.max(0, tail - 90 * dt); // hand-off: the comet's tail rolls back to the top star
      const gap = target - shown;
      if (Math.abs(gap) < 0.02 || reduceMotion) shown = target;
      else {
        const speed = Math.max(gap > 0 ? 6 : 30, Math.min(gap > 0 ? 55 : 160, Math.abs(gap) * 3.2)); // %/s, rewinds faster
        shown += Math.sign(gap) * Math.min(Math.abs(gap), speed * dt);
      }
      render(shown, tail);
      if (shown !== target || tail > 0) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }

    render(0);
    return {
      setProgress(p) {
        target = Math.max(0, Math.min(100, Number(p) || 0));
        if (!raf) raf = requestAnimationFrame(tick);
      },
      setIndeterminate(on) {
        on = !!on; if (on === indet) return;
        indet = on;
        if (on) { loopHead = shown; tail = 0; }   // the comet leaves from wherever the line is
        if (!raf) raf = requestAnimationFrame(tick);
      },
      get indeterminate() { return indet; },
      get progress() { return shown; },
      starMarks: reachAt.slice().sort((a, b) => a - b),
      svg,
    };
  }

  PiscesLoader.STARS = STARS;
  global.PiscesLoader = PiscesLoader;
})(window);
