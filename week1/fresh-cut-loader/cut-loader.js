/**
 * CutLoader — a progress indicator that gives a fringe a sharp cut.
 * 0%    : hair uncut, falling in one piece
 * 1–99% : an invisible blade travels along the cut line from left to right;
 *         each lock it passes drops away (50% = half the fringe cut)
 * 100%  : the full cut, exactly like the final photograph
 *
 *   const loader = CutLoader(canvas, { onUpdate });
 *   await loader.ready;
 *   loader.setProgress(50);        // determinate: 0–100
 *   loader.setIndeterminate(true); // progress unknown: cut, grow back, repeat
 */
(function (global) {
  const UNCUT = { x: -24, y: -64 };                    // where the cut locks sit before the cut
  const LINE = [[0, 842], [560, 604]];                 // the cut line, left to right (image px)
  const SPAN = 600, STRIP = 5, EDGE = 0.1;             // strips across the cut, softness of the blade front

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const easeOutBack = (t) => { const c = 1.35; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

  function CutLoader(canvas, opts = {}) {
    const ctx = canvas.getContext('2d');
    const reduceMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let base, frag, shown = 0, target = 0, raf = 0, last = 0;
    let indet = false, phase = 0, peak = 60, moving = true;
    const CYCLE = 4.4, PEAK = 60;               // indeterminate: seconds per cut-and-regrow, how far each snip goes
    const easeInOut = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    function loopValue(ph) {                     // 0–40% snip · hold · 55–90% grow back · hold
      if (ph < 0.4) { moving = true; return peak * easeInOut(ph / 0.4); }
      if (ph < 0.55) { moving = false; return peak; }
      if (ph < 0.9) { moving = true; return peak * (1 - easeInOut((ph - 0.55) / 0.35)); }
      moving = false; return 0;
    }

    const ready = Promise.all([load(opts.base || 'base.webp'), load(opts.frag || 'frag.webp')]).then(([b, f]) => {
      base = b; frag = f;
      canvas.width = b.naturalWidth; canvas.height = b.naturalHeight;
      render(0);
    });

    function render(pct) {
      if (!base) return;
      const p = pct / 100;
      const front = p * (1 + EDGE);                    // blade position, 0 → 1 (+edge so 100% finishes every strip)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      for (let x = 0; x < SPAN; x += STRIP) {
        const s = x / SPAN;
        const t = clamp((front - s) / EDGE);
        const k = t <= 0 ? 0 : t >= 1 ? 1 : easeOutBack(t);   // 0 = attached, 1 = cut and settled
        const dx = UNCUT.x * (1 - k), dy = UNCUT.y * (1 - k);
        ctx.drawImage(frag, x, 0, STRIP, frag.height, x + dx, dy, STRIP, frag.height);
      }
      // the blade: a brief glint riding the cut line while cutting
      if (p > 0 && p < 1 && (!indet || moving)) {
        const bx = LINE[0][0] + (LINE[1][0] - LINE[0][0]) * clamp(front);
        const by = LINE[0][1] + (LINE[1][1] - LINE[0][1]) * clamp(front);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, 38);
        g.addColorStop(0, 'rgba(255,248,230,.85)'); g.addColorStop(.25, 'rgba(255,235,200,.35)'); g.addColorStop(1, 'rgba(255,235,200,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = g; ctx.fillRect(bx - 40, by - 40, 80, 80);
        ctx.globalCompositeOperation = 'source-over';
      }
      if (indet) { canvas.dataset.state = 'indeterminate'; opts.onUpdate?.({ percent: null, state: 'indeterminate' }); return; }
      const state = pct <= 0.001 ? 'empty' : pct >= 99.999 ? 'complete' : 'progress';
      canvas.dataset.state = state;
      opts.onUpdate?.({ percent: pct, state });
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (indet) {
        if (!reduceMotion) phase += dt / CYCLE;
        if (phase >= 1) { phase -= 1; peak = PEAK; }
        shown = loopValue(phase);
        render(shown);
        raf = requestAnimationFrame(tick); return;
      }
      const gap = target - shown;
      if (Math.abs(gap) < 0.02 || reduceMotion) shown = target;
      else {
        const speed = Math.max(gap > 0 ? 6 : 30, Math.min(gap > 0 ? 50 : 150, Math.abs(gap) * 3)); // %/s
        shown += Math.sign(gap) * Math.min(Math.abs(gap), speed * dt);
      }
      render(shown);
      if (shown !== target) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }

    return {
      ready,
      setProgress(v) { target = clamp(Number(v) || 0, 0, 100); if (!raf) raf = requestAnimationFrame(tick); },
      setIndeterminate(on) {
        on = !!on; if (on === indet) return;
        indet = on;
        if (on) {                                  // join the loop from the current cut without a jump
          if (shown > PEAK) { peak = shown; phase = 0.55; }
          else { peak = PEAK; const r = shown / PEAK; let lo = 0, hi = 1;
            for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (easeInOut(m) < r) lo = m; else hi = m; }
            phase = 0.4 * lo; }
        }
        if (!raf) raf = requestAnimationFrame(tick);   // leaving: shown eases from the loop to real progress
      },
      get indeterminate() { return indet; },
      get progress() { return shown; },
    };
  }
  global.CutLoader = CutLoader;
})(window);
