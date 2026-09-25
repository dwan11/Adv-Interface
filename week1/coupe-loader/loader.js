/**
 * CoupeLoader — a progress indicator that fills a coupe glass.
 * Plays a pre-rendered pour (image sequence) forward as progress rises,
 * easing between frames so any update, however jumpy, looks like one pour.
 *
 *   const loader = CoupeLoader(canvas, { onFrame: ({percent, state}) => {} });
 *   await loader.ready;           // frames preloaded
 *   loader.setProgress(25);       // determinate: 0–100, call as often as you like
 *   loader.setIndeterminate(true) // progress unknown: the glass pours and empties in a loop
 */
(function (global) {
  const FRAME_COUNT = 122;
  const framePath = (i) => `frames/f${String(i + 1).padStart(3, '0')}.webp`;

  // progress % -> video frame. Liquid level isn't linear in time,
  // so the 25% state is pinned to the frame that shows a quarter-full glass.
  const KEYS = [[0, 0], [25, 38], [100, FRAME_COUNT - 1]];

  function lerpKeys(x, from, to) {
    for (let i = 1; i < KEYS.length; i++) {
      const a = KEYS[i - 1], b = KEYS[i];
      if (x <= b[from]) {
        const t = (x - a[from]) / (b[from] - a[from] || 1);
        return a[to] + t * (b[to] - a[to]);
      }
    }
    return KEYS[KEYS.length - 1][to];
  }
  const percentToFrame = (p) => lerpKeys(Math.max(0, Math.min(100, p)), 0, 1);
  const frameToPercent = (f) => lerpKeys(Math.max(0, Math.min(FRAME_COUNT - 1, f)), 1, 0);

  function stateFor(percent) {
    if (percent <= 0.01) return 'empty';
    if (percent >= 99.99) return 'complete';
    return 'progress';
  }

  function CoupeLoader(canvas, opts = {}) {
    const ctx = canvas.getContext('2d');
    const frames = new Array(FRAME_COUNT);
    const reduceMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let pos = 0, target = 0, fade = 1, fadingTo = null, last = 0, raf = 0;
    let indet = false, hold = 0, dTarget = 0;
    const LOOP_TOP = percentToFrame(32);   // indeterminate loop pours to about a third, then empties

    const ready = Promise.all(
      Array.from({ length: FRAME_COUNT }, (_, i) => new Promise((res) => {
        const img = new Image();
        img.onload = () => { frames[i] = img; opts.onLoad?.((frames.filter(Boolean).length) / FRAME_COUNT); res(); };
        img.onerror = res;
        img.src = (opts.framePath || framePath)(i);
      }))
    ).then(() => {
      canvas.width = frames[0].naturalWidth;
      canvas.height = frames[0].naturalHeight;
      draw(); kick();
    });

    function draw() {
      const i = Math.floor(pos), frac = pos - i;
      const a = frames[i], b = frames[Math.min(i + 1, FRAME_COUNT - 1)];
      if (!a) return;
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(a, 0, 0);
      if (b && frac > 0.001) { ctx.globalAlpha = frac; ctx.drawImage(b, 0, 0); }
      canvas.style.opacity = fade;
      const percent = frameToPercent(pos);
      if (indet) opts.onFrame?.({ percent: null, state: 'indeterminate', frame: pos });
      else opts.onFrame?.({ percent, state: stateFor(percent), frame: pos });
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      let busy = indet;

      if (indet && fadingTo === null && fade >= 1) {  // loop: pour, pause, fade empty, repeat
        if (pos >= LOOP_TOP - 0.01) { hold += dt; if (hold > 0.6) { hold = 0; fadingTo = 0; } }
        target = LOOP_TOP;
      }

      if (fadingTo !== null) {                 // rewinding: fade out, cut, fade in
        fade -= dt / 0.22; busy = true;
        if (fade <= 0) { fade = 0; pos = fadingTo; fadingTo = null; }
      } else if (fade < 1) {
        fade = Math.min(1, fade + dt / 0.3); busy = true;
      }

      if (fadingTo === null && pos < target) {
        const gap = target - pos;
        // ~real-time (24 fps) on long pours, easing into the final frames
        const speed = reduceMotion ? 1e6 : Math.max(5, Math.min(24, gap * 5));
        pos = Math.min(target, pos + speed * dt);
        busy = true;
      }

      draw();
      if (busy) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }

    return {
      ready,
      setProgress(p) {
        dTarget = percentToFrame(Number(p) || 0);
        if (indet) return;                       // remembered; applied when the loop ends
        const f = dTarget;
        if (f < pos - 0.5) { target = f; if (reduceMotion) { pos = f; } else { fadingTo = f; } }
        else target = f;
        kick();
      },
      setIndeterminate(on) {
        on = !!on; if (on === indet) return;
        indet = on; hold = 0;
        if (on) { if (pos > LOOP_TOP + 0.5) fadingTo = 0; target = LOOP_TOP; }
        else {                                     // hand over to real progress from wherever the loop is
          fadingTo = null; if (fade < 1) fade = Math.max(fade, 0.01);
          if (dTarget < pos - 0.5) fadingTo = dTarget;
          target = dTarget;
        }
        kick();
      },
      get indeterminate() { return indet; },
      get progress() { return frameToPercent(pos); },
    };
  }

  global.CoupeLoader = CoupeLoader;
})(window);
