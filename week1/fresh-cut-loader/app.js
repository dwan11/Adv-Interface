(function () {
  const $ = (id) => document.getElementById(id);
  const pct = $('pct'), label = $('stateLabel'), exp = $('exp'), readout = $('readout'), scrub = $('scrub'),
        frameNo = $('frameNo'), stamp = $('stamp'), bar = $('bar');
  const chips = [...document.querySelectorAll('.states button')];
  const LABELS = { empty: 'UNCUT', progress: 'CUTTING', complete: 'CUT ✓', indeterminate: 'TRIMMING' };
  const mIndet = $('mIndet'), mDet = $('mDet');
  const cells = Array.from({ length: 24 }, (_, k) => { const i = bar.appendChild(document.createElement('i')); i.style.setProperty('--k', k); return i; });
  let timer = null;

  // date stamp: today, in the classic '98-era layout
  const d = new Date();
  stamp.textContent = `'98 ${d.getMonth() + 1} ${String(d.getDate()).padStart(2, ' ')}`;

  const loader = CutLoader($('cut'), {
    onUpdate: ({ percent, state }) => {
      if (percent === null) {                      // indeterminate: the LCD runs, no count
        pct.textContent = '---'; label.textContent = LABELS[state]; exp.textContent = '-- EXP';
        frameNo.textContent = 'Frame -- / 24'; cells.forEach((c) => c.classList.remove('on'));
        readout.removeAttribute('aria-valuenow'); readout.setAttribute('aria-valuetext', 'Loading, progress unknown');
        return;
      }
      readout.removeAttribute('aria-valuetext');
      const p = Math.round(percent), frames = Math.round(percent / 100 * 24);
      pct.textContent = String(p).padStart(3, '0');
      label.textContent = LABELS[state];
      exp.textContent = `${24 - frames} EXP`;
      frameNo.textContent = `Frame ${String(frames).padStart(2, '0')} / 24`;
      cells.forEach((c, i) => c.classList.toggle('on', i < frames));
      readout.setAttribute('aria-valuenow', p);
    },
  });
  loader.ready.then(() => $('boot').remove());

  function setMode(indet) {
    loader.setIndeterminate(indet);
    mIndet.setAttribute('aria-checked', String(indet)); mDet.setAttribute('aria-checked', String(!indet));
    readout.classList.toggle('indet', indet);
    if (indet) chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  }
  mIndet.addEventListener('click', () => { stop(); setMode(true); });
  mDet.addEventListener('click', () => { stop(); go(+scrub.value); });

  function go(p, fromUser = true) {
    if (fromUser) stop();
    setMode(false);
    scrub.value = p;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(+c.dataset.p === +p)));
    loader.setProgress(p);
  }
  chips.forEach((c) => c.addEventListener('click', () => go(+c.dataset.p)));
  scrub.addEventListener('input', () => go(+scrub.value));
  $('reset').addEventListener('click', () => go(0));

  function stop() { clearTimeout(timer); timer = null; $('simulate').disabled = false; }
  $('simulate').addEventListener('click', () => {
    stop(); go(0, false); $('simulate').disabled = true;
    setMode(true);                              // waiting for the server: size unknown
    let p = 0, paused = false;
    const step = () => {
      p = Math.min(100, p + 1.5 + Math.random() * 5);
      go(Math.round(p), false);
      if (p >= 100) { $('simulate').disabled = false; timer = null; return; }
      timer = setTimeout(step, !paused && p > 48 ? (paused = true, 1000) : 150 + Math.random() * 230);
    };
    timer = setTimeout(() => { go(0, false); step(); }, 4400);
  });

  // film grain: a tiny noise canvas redrawn ~12 times a second, stretched over the print
  const g = $('grain'), gctx = g.getContext('2d'), img = gctx.createImageData(g.width, g.height);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastGrain = 0;
  function grain(t) {
    if (t - lastGrain > 83) {
      lastGrain = t;
      for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      gctx.putImageData(img, 0, 0);
    }
    if (!still) requestAnimationFrame(grain);
  }
  requestAnimationFrame(grain);

  loader.ready.then(() => go(50, false));   // open on the half-cut state
})();
