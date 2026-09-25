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
  function stopSim() { clearTimeout(timer); timer = null; }
})();
