/**
 * LobbyLoader — a progress indicator that paints a hotel lobby.
 * 0%    : ink sketch only, no colour
 * 1–99% : colour descends from the skylight like light filling the room;
 *         blossoms open from the vase outward
 * 100%  : fully painted; the washi wall breathes softly
 *
 *   const loader = LobbyLoader(document.querySelector('svg.lobby'), { onUpdate });
 *   loader.setProgress(60);        // determinate: 0–100
 *   loader.setIndeterminate(true); // progress unknown: a band of light drifts down and fades, blossoms open and close
 */
(function (global) {
  const STAGES = [
    { until: 34, name: 'Washi light' },
    { until: 67, name: 'Stone & water' },
    { until: 100, name: 'Sakura' },
  ];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = (t) => t * t * (3 - 2 * t);

  function LobbyLoader(svg, opts = {}) {
    const H = svg.viewBox.baseVal.height || 800;
    const FEATHER = 220;                          // soft edge of the descending light
    const grad = svg.querySelector('#revealGrad');
    const lines = svg.querySelector('#lines');
    const flowers = [...svg.querySelectorAll('.fl')].map((el) => ({ el, t: +el.dataset.t, last: -1 }));
    const reduceMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let shown = 0, target = 0, raf = 0, last = 0;
    let indet = false, phase = 0, colourAlpha = 1, swapTo = null;
    const colour = svg.querySelector('#colour'), bloomLayers = [svg.querySelector('#bloomColour'), svg.querySelector('#reflBloom')];
    const stops = grad.querySelectorAll('stop');
    const BAND = 240, CYCLE = 5.5;              // indeterminate: half-height of the light band, seconds per pass
    function useBand(on) {                       // swap the reveal gradient between a soft edge and a travelling band
      if (on) { stops[0].setAttribute('stop-color', '#000'); stops[1].setAttribute('stop-color', '#000'); stops[0].setAttribute('offset', '0'); stops[1].setAttribute('offset', '1'); ensureMid(true); }
      else { ensureMid(false); stops[0].setAttribute('stop-color', '#fff'); stops[1].setAttribute('stop-color', '#000'); }
    }
    let mid = null;
    function ensureMid(on) {
      if (on && !mid) { mid = document.createElementNS('http://www.w3.org/2000/svg', 'stop'); mid.setAttribute('offset', '0.5'); mid.setAttribute('stop-color', '#fff'); grad.insertBefore(mid, stops[1]); }
      if (!on && mid) { mid.remove(); mid = null; }
    }
    function renderBand() {
      const t = phase % 1;
      const c = -BAND + smooth(t) * (H + 2 * BAND);
      grad.setAttribute('y1', (c - BAND).toFixed(1)); grad.setAttribute('y2', (c + BAND).toFixed(1));
      for (const f of flowers) {                 // blossoms open and close in a wave rolling outward from the vase
        const w = ((t * 1.0 - (f.t - 0.42) / 0.55 * 0.6) % 1 + 1) % 1;
        const o = Math.round((w < 0.45 ? Math.sin(Math.PI * w / 0.45) : 0) * 100) / 100;
        if (o !== f.last) { f.el.setAttribute('opacity', o); f.last = o; }
      }
      lines.setAttribute('opacity', '0.9');
      svg.dataset.state = 'indeterminate';
      opts.onUpdate?.({ percent: null, state: 'indeterminate', stage: 'Waiting for light' });
    }

    function render(pct) {
      const p = pct / 100;
      // colour sweep: eased so the light lingers on the washi before reaching the water
      const a = -FEATHER + smooth(p) * (H + FEATHER);
      grad.setAttribute('y1', a.toFixed(1));
      grad.setAttribute('y2', (a + FEATHER).toFixed(1));
      // blossoms open individually, inner ones first
      for (const f of flowers) {
        const o = Math.round(clamp((p - f.t + 0.09) / 0.09) * 100) / 100;
        if (o !== f.last) { f.el.setAttribute('opacity', o); f.last = o; }
      }
      // ink recedes a little as paint takes over
      lines.setAttribute('opacity', (1 - 0.4 * p).toFixed(3));
      const state = pct <= 0.001 ? 'empty' : pct >= 99.999 ? 'complete' : 'progress';
      svg.dataset.state = state;
      const stage = STAGES.find((s) => pct <= s.until) || STAGES[2];
      opts.onUpdate?.({ percent: pct, state, stage: state === 'empty' ? 'Sketch' : state === 'complete' ? 'Lobby lit' : stage.name });
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      // cross-fade between modes: dip the colour out, swap, bring it back
      if (swapTo !== null) {
        colourAlpha = Math.max(0, colourAlpha - dt / 0.28);
        if (colourAlpha === 0) {
          indet = swapTo; swapTo = null; useBand(indet);
          if (indet) phase = 0; else shown = 0;
        }
      } else if (colourAlpha < 1) colourAlpha = Math.min(1, colourAlpha + dt / 0.45);
      colour.setAttribute('opacity', colourAlpha.toFixed(3));
      bloomLayers.forEach((g) => g && g.setAttribute('opacity', colourAlpha.toFixed(3)));
      if (indet) {
        if (!reduceMotion) phase += dt / CYCLE;
        renderBand();
        raf = requestAnimationFrame(tick); return;
      }
      const gap = target - shown;
      if (Math.abs(gap) < 0.02 || reduceMotion) shown = target;
      else {
        const speed = Math.max(gap > 0 ? 5 : 25, Math.min(gap > 0 ? 45 : 140, Math.abs(gap) * 2.6)); // %/s
        shown += Math.sign(gap) * Math.min(Math.abs(gap), speed * dt);
      }
      render(shown);
      if (shown !== target || swapTo !== null || colourAlpha < 1) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }

    render(0);
    return {
      setProgress(v) { target = clamp(Number(v) || 0, 0, 100); if (!raf) raf = requestAnimationFrame(tick); },
      setIndeterminate(on) {
        on = !!on;
        if (swapTo === null && on === indet) return;
        if (swapTo !== null && on === indet) { swapTo = null; }      // changed its mind mid-swap
        else swapTo = on;
        if (!raf) raf = requestAnimationFrame(tick);
      },
      get indeterminate() { return swapTo !== null ? swapTo : indet; },
      get progress() { return shown; },
      stages: STAGES,
    };
  }
  global.LobbyLoader = LobbyLoader;
})(window);
