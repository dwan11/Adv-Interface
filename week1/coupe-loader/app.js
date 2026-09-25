(function () {
  const $ = (id) => document.getElementById(id);
  const glass = $('glass'), stage = $('stage'), pct = $('pct'), fill = $('fill'),
        label = $('stateLabel'), pbar = $('pbar'), scrub = $('scrub'), boot = $('boot');
  const LABELS = { empty: 'Empty', progress: 'Pouring', complete: 'Full', indeterminate: 'Pouring…' };
  const mIndet = $('mIndet'), mDet = $('mDet'), bar = document.querySelector('.bar');
  const chips = [...document.querySelectorAll('.states button')];
  let timer = null;

  const loader = CoupeLoader($('cup'), {
    onLoad: (r) => { boot.textContent = `pouring frames… ${Math.round(r * 100)}%`; },
    onFrame: ({ percent, state }) => {
      label.textContent = LABELS[state];
      glass.dataset.state = stage.dataset.state = state;
      if (percent === null) {                      // indeterminate: no number to show
        pct.textContent = '—';
        pbar.removeAttribute('aria-valuenow'); pbar.setAttribute('aria-valuetext', 'Loading, progress unknown');
        return;
      }
      const p = Math.round(percent);
      pct.textContent = p;
      fill.style.width = percent + '%';
      pbar.setAttribute('aria-valuenow', p); pbar.removeAttribute('aria-valuetext');
      label.textContent = LABELS[state];
      glass.dataset.state = stage.dataset.state = state;
    },
  });
  loader.ready.then(() => boot.remove());

  function setMode(indet) {
    loader.setIndeterminate(indet);
    mIndet.setAttribute('aria-checked', String(indet)); mDet.setAttribute('aria-checked', String(!indet));
    bar.classList.toggle('indet', indet);
    if (indet) chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  }
  mIndet.addEventListener('click', () => { stopSim(); setMode(true); });
  mDet.addEventListener('click', () => { stopSim(); go(+scrub.value); });

  function go(p, fromUser = true) {
    if (fromUser) stopSim();
    setMode(false);
    scrub.value = p;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(+c.dataset.p === +p)));
    loader.setProgress(p);
  }
  chips.forEach((c) => c.addEventListener('click', () => go(+c.dataset.p)));
  scrub.addEventListener('input', () => go(+scrub.value));
  $('reset').addEventListener('click', () => go(0));

  // Fake upload: bursty progress events, a stall at 25%, then the rest.
  function stopSim() { clearTimeout(timer); timer = null; $('simulate').disabled = false; }
  $('simulate').addEventListener('click', () => {
    stopSim(); go(0, false); $('simulate').disabled = true;
    setMode(true);                              // connecting: size unknown yet
    let p = 0;
    const step = () => {
      if (p < 25) { p = Math.min(25, p + 2 + Math.random() * 4); timer = setTimeout(step, 140 + Math.random() * 160); }
      else if (p === 25 && !step.held) { step.held = true; timer = setTimeout(step, 1100); return go(25, false); }
      else if (p < 100) { p = Math.min(100, p + 3 + Math.random() * 7); timer = setTimeout(step, 150 + Math.random() * 200); }
      else { $('simulate').disabled = false; timer = null; }
      go(Math.round(p), false);
    };
    step.held = false;
    timer = setTimeout(() => { go(0, false); step(); }, 2600);
  });
})();
